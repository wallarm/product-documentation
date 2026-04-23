#!/usr/bin/env python3
"""
Manual doc-agent runner.

Usage:
    # Set env vars (or use .env file):
    export JIRA_USER_EMAIL=you@wallarm.com
    export JIRA_API_TOKEN=your-token
    export GITLAB_TOKEN=your-token

    # Run:
    python run.py PROD-3059
    python run.py PROD-3059 --dry-run          # just print the prompt, don't run claude
    python run.py PROD-3059 --task-type release # override auto-detected task type
"""

import argparse
import json
import os
import re
import subprocess
import sys

import requests

# ── Config (from env vars) ──────────────────────────────────────────────

JIRA_BASE = os.environ.get("JIRA_BASE_URL", "https://wallarm.atlassian.net")
JIRA_EMAIL = os.environ.get("JIRA_USER_EMAIL", "")
JIRA_TOKEN = os.environ.get("JIRA_API_TOKEN", "")

GITLAB_BASE = os.environ.get("GITLAB_BASE_URL", "https://gl.wallarm.com/api/v4")
GITLAB_TOKEN = os.environ.get("GITLAB_TOKEN", "")


# ── Jira ────────────────────────────────────────────────────────────────

def fetch_jira_issue(issue_key: str) -> dict:
    resp = requests.get(
        f"{JIRA_BASE}/rest/api/3/issue/{issue_key}",
        auth=(JIRA_EMAIL, JIRA_TOKEN),
        params={"expand": "renderedFields"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def extract_jira_context(issue: dict) -> dict:
    fields = issue.get("fields", {})
    rendered = issue.get("renderedFields", {})
    return {
        "key": issue.get("key"),
        "summary": fields.get("summary", ""),
        "description_html": rendered.get("description", ""),
        "issue_type": fields.get("issuetype", {}).get("name", ""),
        "components": [c["name"] for c in fields.get("components", [])],
        "labels": fields.get("labels", []),
        "status": fields.get("status", {}).get("name", ""),
        "fix_versions": [v["name"] for v in fields.get("fixVersions", [])],
        "linked_mr_urls": _find_gitlab_mrs(issue),
        "linked_confluence_urls": _find_confluence_pages(issue),
    }


def _find_gitlab_mrs(issue: dict) -> list[str]:
    urls = []
    for comment in issue.get("fields", {}).get("comment", {}).get("comments", []):
        body = comment.get("body", {})
        urls.extend(_urls_from_adf(body, r"https?://gl\.wallarm\.com/[^\s\"]+merge_requests/\d+"))
    return urls


def _find_confluence_pages(issue: dict) -> list[str]:
    urls = []
    desc = issue.get("fields", {}).get("description", {})
    if isinstance(desc, dict):
        urls.extend(_urls_from_adf(desc, r"https?://wallarm\.atlassian\.net/wiki/[^\s\"]+"))
    return urls


def _urls_from_adf(node: dict, pattern: str) -> list[str]:
    urls = []
    if not isinstance(node, dict):
        return urls
    for mark in node.get("marks", []):
        href = mark.get("attrs", {}).get("href", "")
        if re.search(pattern, href):
            urls.append(href)
    if node.get("type") == "inlineCard":
        url = node.get("attrs", {}).get("url", "")
        if re.search(pattern, url):
            urls.append(url)
    for child in node.get("content", []):
        urls.extend(_urls_from_adf(child, pattern))
    return urls


# ── GitLab ──────────────────────────────────────────────────────────────

def fetch_mr_diff(mr_url: str) -> dict | None:
    match = re.search(r"gl\.wallarm\.com/(.+?)/-/merge_requests/(\d+)", mr_url)
    if not match:
        return None

    project = match.group(1).replace("/", "%2F")
    iid = match.group(2)
    headers = {"PRIVATE-TOKEN": GITLAB_TOKEN}

    mr = requests.get(f"{GITLAB_BASE}/projects/{project}/merge_requests/{iid}",
                       headers=headers, timeout=30).json()

    changes = requests.get(f"{GITLAB_BASE}/projects/{project}/merge_requests/{iid}/changes",
                            headers=headers, timeout=60).json()

    diffs = []
    for c in changes.get("changes", []):
        d = c.get("diff", "")
        if len(d) < 10_000:
            diffs.append({"file": c.get("new_path", ""), "diff": d})

    return {
        "title": mr.get("title", ""),
        "description": mr.get("description", ""),
        "source_branch": mr.get("source_branch", ""),
        "diffs": diffs,
    }


# ── Confluence ──────────────────────────────────────────────────────────

def fetch_confluence_page(page_url: str) -> dict | None:
    match = re.search(r"/pages/(\d+)", page_url)
    if not match:
        return None

    page_id = match.group(1)
    resp = requests.get(
        f"{JIRA_BASE}/wiki/api/v2/pages/{page_id}",
        auth=(JIRA_EMAIL, JIRA_TOKEN),
        params={"body-format": "storage"},
        timeout=30,
    )
    if resp.status_code != 200:
        print(f"  ⚠ Confluence page {page_id}: {resp.status_code}", file=sys.stderr)
        return None

    data = resp.json()
    return {"title": data.get("title", ""), "body": data.get("body", {}).get("storage", {}).get("value", "")}


# ── Task type detection ─────────────────────────────────────────────────

def detect_task_type(jira_ctx: dict) -> str:
    itype = jira_ctx["issue_type"].lower()
    labels = [l.lower() for l in jira_ctx["labels"]]

    if any(kw in labels for kw in ["release", "release-notes"]):
        return "release"
    if itype == "epic" or "feature" in itype:
        return "new-feature"
    return "maintenance"


# ── Prompt building ─────────────────────────────────────────────────────

def build_prompt(jira_ctx: dict, mrs: list, confluence_pages: list, task_type: str) -> str:
    from prompts.new_feature import build_new_feature_prompt
    from prompts.release import build_release_prompt
    from prompts.maintenance import build_maintenance_prompt

    context = {
        "jira_issue": jira_ctx,
        "merge_requests": mrs,
        "confluence_pages": confluence_pages,
        "task_type": task_type,
    }

    builders = {
        "new-feature": build_new_feature_prompt,
        "release": build_release_prompt,
        "maintenance": build_maintenance_prompt,
    }
    return builders.get(task_type, build_maintenance_prompt)(context)


# ── Main ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Run doc-agent on a Jira issue")
    parser.add_argument("issue_key", help="Jira issue key, e.g. PROD-3059")
    parser.add_argument("--dry-run", action="store_true", help="Print prompt without running Claude")
    parser.add_argument("--task-type", choices=["new-feature", "release", "maintenance"],
                        help="Override auto-detected task type")
    parser.add_argument("--no-mr", action="store_true", help="Skip MR creation, just run agent locally")
    args = parser.parse_args()

    # Validate env
    if not JIRA_EMAIL or not JIRA_TOKEN:
        print("Error: Set JIRA_USER_EMAIL and JIRA_API_TOKEN env vars", file=sys.stderr)
        sys.exit(1)

    # 1. Gather context
    print(f"📋 Fetching {args.issue_key} from Jira...")
    raw_issue = fetch_jira_issue(args.issue_key)
    jira_ctx = extract_jira_context(raw_issue)
    print(f"   Summary: {jira_ctx['summary']}")
    print(f"   Components: {', '.join(jira_ctx['components'])}")
    print(f"   MR links found: {len(jira_ctx['linked_mr_urls'])}")
    print(f"   Confluence links found: {len(jira_ctx['linked_confluence_urls'])}")

    # 2. Fetch MR diffs
    mrs = []
    if GITLAB_TOKEN:
        for url in jira_ctx["linked_mr_urls"]:
            print(f"🔀 Fetching MR: {url}")
            mr = fetch_mr_diff(url)
            if mr:
                mrs.append(mr)
                print(f"   {mr['title']} ({len(mr['diffs'])} files changed)")
    else:
        print("⚠ GITLAB_TOKEN not set, skipping MR diffs", file=sys.stderr)

    # 3. Fetch Confluence pages
    confluence_pages = []
    for url in jira_ctx["linked_confluence_urls"]:
        print(f"📄 Fetching Confluence: {url}")
        page = fetch_confluence_page(url)
        if page:
            confluence_pages.append(page)
            print(f"   {page['title']}")

    # 4. Detect task type
    task_type = args.task_type or detect_task_type(jira_ctx)
    print(f"\n🏷  Task type: {task_type}")

    # 5. Build prompt
    prompt = build_prompt(jira_ctx, mrs, confluence_pages, task_type)

    if args.dry_run:
        print("\n" + "=" * 80)
        print("DRY RUN — prompt that would be sent to Claude:")
        print("=" * 80)
        print(prompt)
        return

    # 6. Run Claude
    print(f"\n🤖 Running Claude agent (task_type={task_type})...")
    print("   Working directory: current repo")
    print("   This may take a few minutes...\n")

    result = subprocess.run(
        [
            "claude", "-p", prompt,
            "--allowedTools", "Read,Edit,Write,Glob,Grep,Bash",
        ],
        timeout=600,
    )

    if result.returncode != 0:
        print(f"\n❌ Claude exited with code {result.returncode}", file=sys.stderr)
        sys.exit(1)

    print("\n✅ Agent finished. Check `git diff` for changes.")

    if not args.no_mr:
        print("   To create a branch and push:")
        branch = f"doc-agent/{args.issue_key.lower()}"
        print(f"     git checkout -b {branch}")
        print(f"     git add -A")
        print(f'     git commit -m "docs({args.issue_key}): {jira_ctx["summary"]}"')
        print(f"     git push origin {branch}")


if __name__ == "__main__":
    main()
