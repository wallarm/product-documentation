"""
Doc Agent Lambda handlers.

1. slack_handler   — receives Slack events, responds fast, kicks off worker async
2. worker_handler  — does the actual work (context gathering, Claude, MR creation)

Slack flow:
  User: @DocBot PROD-3059
  → Slack sends event → API Gateway → slack_handler
  → slack_handler responds 200 immediately, invokes worker_handler async
  → worker_handler gathers context, runs Claude, creates MR
  → worker_handler posts result back to Slack thread
"""

import hashlib
import hmac
import json
import logging
import os
import re
import time

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

_secrets_client = boto3.client("secretsmanager")
_lambda_client = boto3.client("lambda")
_cache: dict = {}


def _secret(arn: str) -> str:
    if arn not in _cache:
        _cache[arn] = _secrets_client.get_secret_value(SecretId=arn)["SecretString"]
    return _cache[arn]


# ── Slack handler (fast response) ───────────────────────────────────────

def slack_handler(event, _ctx):
    body = event.get("body", "")
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}

    # URL verification (one-time Slack setup)
    payload = json.loads(body)
    if payload.get("type") == "url_verification":
        return {"statusCode": 200, "body": json.dumps({"challenge": payload["challenge"]})}

    # Verify signature
    if not _verify_slack(headers, body):
        return {"statusCode": 401, "body": "Unauthorized"}

    # Ignore bot messages and retries
    slack_event = payload.get("event", {})
    if slack_event.get("bot_id") or headers.get("x-slack-retry-num"):
        return {"statusCode": 200, "body": "ok"}

    # Extract Jira key from message
    text = slack_event.get("text", "")
    match = re.search(r"([A-Z]+-\d+)", text)
    if not match:
        _post_to_slack(
            slack_event.get("channel"),
            "Could not find a Jira issue key. Usage: `@DocBot PROD-3059`",
            thread_ts=slack_event.get("ts"),
        )
        return {"statusCode": 200, "body": "ok"}

    issue_key = match.group(1)
    channel = slack_event.get("channel")
    thread_ts = slack_event.get("ts")

    # Ack to Slack immediately
    _post_to_slack(channel, f"Working on *{issue_key}*. I'll post the PR link here when ready.", thread_ts=thread_ts)

    # Kick off worker async
    _lambda_client.invoke(
        FunctionName=os.environ["WORKER_FUNCTION_NAME"],
        InvocationType="Event",  # async
        Payload=json.dumps({
            "issue_key": issue_key,
            "slack_channel": channel,
            "slack_thread_ts": thread_ts,
        }),
    )

    return {"statusCode": 200, "body": "ok"}


def _verify_slack(headers: dict, body: str) -> bool:
    signing_secret = _secret(os.environ["SLACK_SIGNING_SECRET_ARN"])
    timestamp = headers.get("x-slack-request-timestamp", "")
    if not timestamp or abs(time.time() - int(timestamp)) > 300:
        return False
    sig_basestring = f"v0:{timestamp}:{body}"
    expected = "v0=" + hmac.new(
        signing_secret.encode(), sig_basestring.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, headers.get("x-slack-signature", ""))


# ── Worker handler (long-running) ──────────────────────────────────────

def worker_handler(event, _ctx):
    """
    Input: {"issue_key": "PROD-3059", "slack_channel": "C123", "slack_thread_ts": "123.456"}
    Or:    {"issue_key": "PROD-3059"}  (manual invoke, no Slack reply)
    """
    from context_gatherer import gather_context
    from agent_runner import run_doc_agent

    issue_key = event["issue_key"]
    channel = event.get("slack_channel")
    thread_ts = event.get("slack_thread_ts")

    logger.info(f"Worker started for {issue_key}")

    # Load secrets
    os.environ["JIRA_API_TOKEN"] = _secret(os.environ["JIRA_API_TOKEN_ARN"])
    os.environ["GITHUB_TOKEN"] = _secret(os.environ["GITHUB_TOKEN_ARN"])
    os.environ["ANTHROPIC_API_KEY"] = _secret(os.environ["CLAUDE_API_KEY_ARN"])

    try:
        # 1. Gather context
        context = gather_context(issue_key)

        if channel:
            _post_to_slack(channel, f"Context gathered. Running Claude...", thread_ts=thread_ts)

        # 2. Run agent
        result = run_doc_agent(context)

        # 3. Report to Slack
        if channel:
            if result.get("status") == "pr_created":
                _post_to_slack(
                    channel,
                    f"Done! PR created: {result['pr_url']}\nPlease review and edit as needed.",
                    thread_ts=thread_ts,
                )
            elif result.get("status") == "no_changes":
                _post_to_slack(channel, f"No documentation changes needed for *{issue_key}*.", thread_ts=thread_ts)
            else:
                _post_to_slack(channel, f"Result: {json.dumps(result)}", thread_ts=thread_ts)

        return result

    except Exception as e:
        logger.exception(f"Worker failed for {issue_key}")
        if channel:
            _post_to_slack(channel, f"Failed to process *{issue_key}*: `{e}`", thread_ts=thread_ts)
        return {"status": "error", "issue": issue_key, "error": str(e)}


# ── Slack posting ───────────────────────────────────────────────────────

def _post_to_slack(channel: str, text: str, thread_ts: str = None):
    import requests

    token = _secret(os.environ["SLACK_BOT_TOKEN_ARN"])
    payload = {"channel": channel, "text": text}
    if thread_ts:
        payload["thread_ts"] = thread_ts

    resp = requests.post(
        "https://slack.com/api/chat.postMessage",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=payload,
        timeout=10,
    )
    if not resp.json().get("ok"):
        logger.error(f"Slack post failed: {resp.json()}")
