#!/usr/bin/env python3
"""
Documentation checker: validates Markdown files against Confluence Glossary
and Style Guide using Claude Haiku for semantic understanding.

Runs entirely in GitHub Actions — no local setup required.
Controlled via environment variables set by the workflow.
"""

import json
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import anthropic
import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

COMMENT_MARKER  = "<!-- docs-check-bot -->"
DEFAULT_SCAN_DIRS = ["docs/latest", "include"]
CLAUDE_MODEL    = "claude-haiku-4-5-20251001"
MAX_RETRIES     = 3
RETRY_DELAY     = 5   # seconds, doubled on each retry


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------

@dataclass
class Violation:
    file: str
    line: int
    rule_type: str    # "wrong_term" | "casing" | "style"
    found: str
    suggestion: str
    message: str


# ---------------------------------------------------------------------------
# Confluence helpers
# ---------------------------------------------------------------------------

def fetch_confluence_page(page_id: str) -> str:
    """Return the Confluence storage-format HTML body of a page."""
    base_url = os.environ.get("CONFLUENCE_BASE_URL", "").rstrip("/")
    email    = os.environ.get("CONFLUENCE_EMAIL", "")
    token    = os.environ.get("CONFLUENCE_API_TOKEN", "")

    if not base_url:
        sys.exit("ERROR: CONFLUENCE_BASE_URL is not set.")
    if not email or not token:
        sys.exit("ERROR: CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must be set.")

    url  = f"{base_url}/wiki/rest/api/content/{page_id}"
    resp = requests.get(
        url,
        params={"expand": "body.storage"},
        auth=(email, token),
        timeout=30,
    )
    if resp.status_code == 404:
        sys.exit(f"ERROR: Confluence page {page_id} not found. Check the page ID.")
    resp.raise_for_status()
    return resp.json()["body"]["storage"]["value"]


def extract_page_text(html: str) -> str:
    """Convert Confluence storage HTML to clean plain text."""
    soup = BeautifulSoup(html, "lxml")
    # Preserve table structure as plain text rows
    for table in soup.find_all("table"):
        rows = []
        for tr in table.find_all("tr"):
            cells = [td.get_text(" ", strip=True) for td in tr.find_all(["th", "td"])]
            rows.append(" | ".join(cells))
        table.replace_with("\n".join(rows) + "\n")
    return soup.get_text("\n", strip=True)


# ---------------------------------------------------------------------------
# Claude prompt
# ---------------------------------------------------------------------------

def build_system_prompt(glossary_text: str, style_text: str) -> str:
    parts = ["You are a technical documentation reviewer.\n"]

    if glossary_text:
        parts.append("## Glossary\n")
        parts.append(glossary_text)
        parts.append("")

    if style_text:
        parts.append("## Style Guide\n")
        parts.append(style_text)
        parts.append("")

    parts.append(
        "Review the Markdown document provided. Identify violations of the "
        "Glossary and Style Guide rules above.\n"
        "Ignore content inside fenced code blocks (``` or ~~~), inline code "
        "spans, and URLs.\n\n"
        "Respond ONLY with a valid JSON array. Each violation object:\n"
        '{"line": <integer>, '
        '"type": "wrong_term" or "casing" or "style", '
        '"found": "<exact problematic text from the document>", '
        '"suggestion": "<what to write instead, or empty string>", '
        '"message": "<one concise sentence explanation>"}\n\n'
        "If there are no violations, respond with an empty array: []\n"
        "Output nothing except the JSON array — no markdown, no prose."
    )
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Checking files with Claude
# ---------------------------------------------------------------------------

def check_file_with_claude(
    filepath: str,
    client: anthropic.Anthropic,
    system_prompt: str,
) -> list[Violation]:
    """Send one file to Claude Haiku and return parsed violations."""
    try:
        content = Path(filepath).read_text(encoding="utf-8", errors="replace")
    except OSError as e:
        print(f"WARNING: cannot read {filepath}: {e}", file=sys.stderr)
        return []

    user_message = f"File: {filepath}\n\n{content}"

    delay = RETRY_DELAY
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=2048,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}],
            )
            raw = response.content[0].text.strip()
            break
        except anthropic.RateLimitError:
            if attempt == MAX_RETRIES:
                print(f"WARNING: rate limit hit for {filepath}, skipping.", file=sys.stderr)
                return []
            print(f"Rate limit hit, retrying in {delay}s...", file=sys.stderr)
            time.sleep(delay)
            delay *= 2
        except anthropic.APIError as e:
            print(f"WARNING: API error for {filepath}: {e}", file=sys.stderr)
            return []

    # Strip markdown code fences if Claude wrapped the JSON anyway
    if raw.startswith("```"):
        raw = "\n".join(
            line for line in raw.splitlines()
            if not line.strip().startswith("```")
        ).strip()

    try:
        items = json.loads(raw)
    except json.JSONDecodeError:
        print(f"WARNING: could not parse Claude response for {filepath}.", file=sys.stderr)
        print(f"  Raw response: {raw[:200]}", file=sys.stderr)
        return []

    violations: list[Violation] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        violations.append(Violation(
            file=filepath,
            line=int(item.get("line", 0)),
            rule_type=item.get("type", "style"),
            found=item.get("found", ""),
            suggestion=item.get("suggestion", ""),
            message=item.get("message", ""),
        ))
    return violations


def check_files_with_claude(
    file_list: list[str],
    client: anthropic.Anthropic,
    system_prompt: str,
) -> list[Violation]:
    all_violations: list[Violation] = []
    for i, filepath in enumerate(file_list, start=1):
        print(f"  [{i}/{len(file_list)}] {filepath}", file=sys.stderr)
        violations = check_file_with_claude(filepath, client, system_prompt)
        all_violations.extend(violations)
        # Small courtesy delay to stay well within rate limits
        if i < len(file_list):
            time.sleep(0.3)
    return all_violations


# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------

_TYPE_LABEL = {
    "wrong_term": "Wrong term",
    "casing":     "Wrong casing",
    "style":      "Style",
}


def format_markdown_report(
    violations: list[Violation],
    files_checked: int,
    scan_label: str = "",
) -> str:
    lines: list[str] = [COMMENT_MARKER]
    scan_note = f" ({scan_label})" if scan_label else ""
    lines.append(f"## Docs check results{scan_note}\n")

    if not violations:
        lines.append(
            f"**No violations found** across {files_checked} file(s) checked."
        )
        return "\n".join(lines)

    by_type: dict[str, int] = {}
    for v in violations:
        by_type[v.rule_type] = by_type.get(v.rule_type, 0) + 1

    lines.append(f"Found **{len(violations)} violation(s)** in {files_checked} file(s).\n")
    for rtype, count in sorted(by_type.items()):
        lines.append(f"- {_TYPE_LABEL.get(rtype, rtype)}: {count}")
    lines.append("")

    lines.append("<details>")
    lines.append("<summary>View all violations</summary>\n")
    lines.append("| File | Line | Type | Found | Suggestion | Note |")
    lines.append("|---|---|---|---|---|---|")
    for v in violations:
        suggestion = v.suggestion if v.suggestion else "—"
        lines.append(
            f"| `{v.file}` | {v.line} "
            f"| {_TYPE_LABEL.get(v.rule_type, v.rule_type)} "
            f"| `{v.found}` | {suggestion} | {v.message} |"
        )
    lines.append("</details>\n")
    lines.append(
        "<sub>Checked by [docs-check workflow]"
        "(.github/workflows/docs-check.yml) using Claude Haiku. "
        "Rules sourced from Confluence Glossary and Style Guide.</sub>"
    )
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# GitHub integration
# ---------------------------------------------------------------------------

def _gh_headers() -> dict:
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        sys.exit("ERROR: GITHUB_TOKEN is not set.")
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def post_or_update_pr_comment(body: str, pr_number: str) -> None:
    """Post a new PR comment or update the existing bot comment (no spam)."""
    repo    = os.environ.get("GITHUB_REPOSITORY", "")
    if not repo:
        sys.exit("ERROR: GITHUB_REPOSITORY is not set.")

    api     = f"https://api.github.com/repos/{repo}"
    headers = _gh_headers()

    existing_id: Optional[int] = None
    page = 1
    while True:
        resp = requests.get(
            f"{api}/issues/{pr_number}/comments",
            headers=headers,
            params={"per_page": 100, "page": page},
            timeout=30,
        )
        resp.raise_for_status()
        comments = resp.json()
        if not comments:
            break
        for comment in comments:
            if COMMENT_MARKER in comment.get("body", ""):
                existing_id = comment["id"]
                break
        if existing_id or len(comments) < 100:
            break
        page += 1

    if existing_id:
        resp = requests.patch(
            f"{api}/issues/comments/{existing_id}",
            headers=headers,
            json={"body": body},
            timeout=30,
        )
    else:
        resp = requests.post(
            f"{api}/issues/{pr_number}/comments",
            headers=headers,
            json={"body": body},
            timeout=30,
        )
    resp.raise_for_status()
    print(f"PR comment {'updated' if existing_id else 'posted'} on PR #{pr_number}.")


def write_step_summary(body: str) -> None:
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        with open(summary_file, "a", encoding="utf-8") as f:
            f.write(body + "\n")
    else:
        print(body)


# ---------------------------------------------------------------------------
# File list helpers
# ---------------------------------------------------------------------------

def collect_files_from_env(path: str) -> list[str]:
    files = Path(path).read_text(encoding="utf-8").splitlines()
    return [f for f in files if f.strip() and Path(f).is_file()]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    # --- Validate required secrets ---
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        sys.exit("ERROR: ANTHROPIC_API_KEY is not set.")

    glossary_id    = os.environ.get("CONFLUENCE_GLOSSARY_PAGE_ID", "")
    style_guide_id = os.environ.get("CONFLUENCE_STYLE_GUIDE_PAGE_ID", "")
    if not glossary_id and not style_guide_id:
        sys.exit(
            "ERROR: Set at least one of CONFLUENCE_GLOSSARY_PAGE_ID or "
            "CONFLUENCE_STYLE_GUIDE_PAGE_ID."
        )

    # --- Load file list ---
    files_from = os.environ.get("FILES_FROM", "")
    if files_from and Path(files_from).is_file():
        files = collect_files_from_env(files_from)
    else:
        # Fallback: scan default directories (used in edge cases)
        files = []
        for d in DEFAULT_SCAN_DIRS:
            files.extend(str(p) for p in Path(d).rglob("*.md") if p.is_file())

    if not files:
        print("No Markdown files to check.")
        sys.exit(0)

    print(f"Checking {len(files)} file(s)...", file=sys.stderr)

    # --- Fetch Confluence content ---
    glossary_text = ""
    style_text    = ""

    if glossary_id:
        print("Fetching Glossary from Confluence...", file=sys.stderr)
        glossary_text = extract_page_text(fetch_confluence_page(glossary_id))

    if style_guide_id:
        print("Fetching Style Guide from Confluence...", file=sys.stderr)
        style_text = extract_page_text(fetch_confluence_page(style_guide_id))

    # --- Build Claude system prompt (once, reused for all files) ---
    system_prompt = build_system_prompt(glossary_text, style_text)

    # --- Run checks ---
    client = anthropic.Anthropic(api_key=api_key)
    violations = check_files_with_claude(files, client, system_prompt)

    print(
        f"Found {len(violations)} violation(s) across {len(files)} file(s).",
        file=sys.stderr,
    )

    # --- Determine scan label and output destination ---
    event = os.environ.get("GITHUB_EVENT_NAME", "")

    if event == "issue_comment":
        scan_label = "changed files in PR"
    elif event == "merge_group":
        scan_label = "changed files (merge queue)"
    else:
        scan_label = "changed files"

    # --- Format and output ---
    report = format_markdown_report(violations, len(files), scan_label)

    if event == "issue_comment":
        pr_number = os.environ.get("PR_NUMBER", "")
        if not pr_number:
            sys.exit("ERROR: PR_NUMBER is not set.")
        post_or_update_pr_comment(report, pr_number)
    else:
        # merge_group: results appear in the job summary and check status
        write_step_summary(report)

    if violations:
        sys.exit(1)


if __name__ == "__main__":
    main()
