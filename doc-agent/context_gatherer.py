"""
Context gatherer — pulls Jira ticket and linked Confluence pages.
Expects env vars: JIRA_USER_EMAIL, JIRA_API_TOKEN, JIRA_BASE_URL
"""

import logging
import os
import re

import requests

logger = logging.getLogger(__name__)

JIRA_BASE = os.environ.get("JIRA_BASE_URL", "https://wallarm.atlassian.net")


# ── Jira ────────────────────────────────────────────────────────────────

def _jira_auth():
    return (os.environ["JIRA_USER_EMAIL"], os.environ["JIRA_API_TOKEN"])


def fetch_jira_issue(issue_key: str) -> dict:
    resp = requests.get(
        f"{JIRA_BASE}/rest/api/3/issue/{issue_key}",
        auth=_jira_auth(),
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
        "description_html": _clean_html(rendered.get("description", "")),
        "issue_type": fields.get("issuetype", {}).get("name", ""),
        "components": [c["name"] for c in fields.get("components", [])],
        "labels": fields.get("labels", []),
        "status": fields.get("status", {}).get("name", ""),
        "fix_versions": [v["name"] for v in fields.get("fixVersions", [])],
        "linked_confluence_urls": _find_confluence_pages(issue),
        "attachments": _extract_attachments(fields),
    }


def _extract_attachments(fields: dict) -> list[dict]:
    """Extract image attachment metadata from Jira issue."""
    attachments = []
    for att in fields.get("attachment", []):
        mime = att.get("mimeType", "")
        if mime.startswith("image/"):
            attachments.append({
                "filename": att.get("filename", ""),
                "url": att.get("content", ""),
                "mime": mime,
            })
    return attachments


def _clean_html(html: str) -> str:
    """Strip HTML tags, SQL blocks, and excessive whitespace. Keep text content."""
    if not html:
        return ""

    # Remove SQL/code blocks (they're internal implementation, not for docs)
    html = re.sub(r'<div class="code panel".*?</div>\s*</div>', '[code block removed]', html, flags=re.DOTALL)
    html = re.sub(r'<pre[^>]*>.*?</pre>', '[code block removed]', html, flags=re.DOTALL)

    # Remove inline images (agent can't see them anyway)
    html = re.sub(r'<span class="image-wrap".*?</span>', '[image]', html, flags=re.DOTALL)
    html = re.sub(r'<img[^>]*>', '[image]', html)

    # Strip all HTML tags, keep text
    html = re.sub(r'<[^>]+>', ' ', html)

    # Clean up entities
    html = html.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')

    # Collapse whitespace
    html = re.sub(r'\s+', ' ', html).strip()

    # Truncate if still huge
    if len(html) > 5000:
        html = html[:5000] + "\n[... truncated]"

    return html


def _find_confluence_pages(issue: dict) -> list[str]:
    desc = issue.get("fields", {}).get("description", {})
    if isinstance(desc, dict):
        return _urls_from_adf(desc, r"https?://wallarm\.atlassian\.net/wiki/[^\s\"]+")
    return []


# ── Confluence ──────────────────────────────────────────────────────────

def fetch_confluence_page(page_url: str) -> dict | None:
    match = re.search(r"/pages/(\d+)", page_url)
    if not match:
        return None

    page_id = match.group(1)
    resp = requests.get(
        f"{JIRA_BASE}/wiki/api/v2/pages/{page_id}",
        auth=_jira_auth(),
        params={"body-format": "storage"},
        timeout=30,
    )
    if resp.status_code != 200:
        logger.warning(f"Confluence page {page_id}: HTTP {resp.status_code}")
        return None

    data = resp.json()
    return {"title": data.get("title", ""), "body": data.get("body", {}).get("storage", {}).get("value", "")}


# ── ADF helpers ─────────────────────────────────────────────────────────

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


# ── Main ────────────────────────────────────────────────────────────────

def gather_context(issue_key: str) -> dict:
    logger.info(f"Gathering context for {issue_key}")

    raw_issue = fetch_jira_issue(issue_key)
    jira_ctx = extract_jira_context(raw_issue)

    confluence = []
    for url in jira_ctx["linked_confluence_urls"]:
        try:
            page = fetch_confluence_page(url)
            if page:
                confluence.append(page)
        except Exception as e:
            logger.error(f"Confluence fetch failed ({url}): {e}")

    # Download image attachments
    images = []
    for att in jira_ctx.get("attachments", []):
        try:
            img = _download_attachment(att["url"], att["filename"])
            if img:
                images.append(img)
        except Exception as e:
            logger.error(f"Attachment download failed ({att['filename']}): {e}")

    return {
        "jira_issue": jira_ctx,
        "confluence_pages": confluence,
        "images": images,
    }


def _download_attachment(url: str, filename: str) -> dict | None:
    """Download a Jira attachment and return its content as bytes."""
    resp = requests.get(url, auth=_jira_auth(), timeout=30)
    if resp.status_code != 200:
        logger.warning(f"Attachment {filename}: HTTP {resp.status_code}")
        return None
    return {"filename": filename, "content": resp.content}
