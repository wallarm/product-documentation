"""
Single prompt — all guidelines and existing files embedded.
Claude returns file changes in a parseable format.
"""

import logging
import os

logger = logging.getLogger(__name__)


def _read_file(path: str) -> str:
    try:
        with open(path, "r") as f:
            return f.read()
    except FileNotFoundError:
        return ""


def build_prompt(context: dict, repo_dir: str = None, existing_files: dict = None) -> str:
    jira = context["jira_issue"]
    confs = context.get("confluence_pages", [])

    # Embed guidelines
    claude_md = _read_file(os.path.join(repo_dir, "CLAUDE.md")) if repo_dir else ""
    style_guide = _read_file(os.path.join(repo_dir, ".doc-agent", "style-guide.md")) if repo_dir else ""
    glossary = _read_file(os.path.join(repo_dir, ".doc-agent", "glossary.md")) if repo_dir else ""

    guidelines = ""
    if claude_md:
        guidelines += f"\n## Repository Guidelines\n\n{claude_md}\n"
    if style_guide:
        guidelines += f"\n## Writing Style Guide\n\n{style_guide}\n"
    if glossary:
        guidelines += f"\n## Terminology Glossary\n\n{glossary}\n"

    # Embed existing files
    files_section = ""
    if existing_files:
        files_section = "\n## Existing Documentation Files\n\n"
        files_section += "These are the current files you may need to update:\n\n"
        for path, content in existing_files.items():
            files_section += f"### FILE: {path}\n```\n{content}\n```\n\n"

    # Confluence specs
    conf_section = ""
    if confs:
        conf_parts = []
        for page in confs:
            conf_parts.append(f"### Page: {page.get('title', 'Unknown')}\n")
            conf_parts.append(page.get("body", "")[:5000])
        conf_section = "\n## Product Specification (Confluence)\n\n" + "\n".join(conf_parts)

    return f"""You are a technical writer for Wallarm, a cloud-native API security platform.
Update the product documentation based on the Jira ticket below.
{guidelines}

## Jira Ticket: {jira['key']}

**Summary**: {jira['summary']}
**Type**: {jira['issue_type']}
**Components**: {', '.join(jira['components'])}
**Fix versions**: {', '.join(jira['fix_versions'])}

### Description
{jira.get('description_html', 'No description')}
{conf_section}
{files_section}

## Output Format

Return ONLY the files that need changes. For each file, use this exact format:

=== FILE: docs/latest/section/filename.md ===
(complete file content with your changes)
=== END FILE ===

Rules:
- Output the COMPLETE file content for each changed file, not just the diff.
- Only include files you actually changed or created.
- For new pages, also output the include-wrappers for 6.x and 7.x.
- For new pages, also output updated mkdocs-7.x.yml and mkdocs-6.x.yml.
- Use `<!-- TODO: add screenshot -->` for missing screenshots.
- Do NOT invent features not in the ticket.
- Follow the style guide and glossary strictly.
- Do NOT output any explanation before or after the files — ONLY the file blocks.
"""
