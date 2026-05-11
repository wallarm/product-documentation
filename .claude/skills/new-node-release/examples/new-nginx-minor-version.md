# Example 01 — NGINX Node patch release (Jira-link mode)

## When to use this template

- Patch or minor release on the current root version (e.g., 6.12.1 when `rootVersion` is 6).
- Single artifact type (NGINX Node only).
- Jira release link is available — you have not pre-filtered the issue list.
- No MAJOR bump, no component replacement, no backport to an older line.

This is the most common case. If your release matches all four bullets above,
copy the prompt below and fill in your version, date, and Jira link.

## Prompt

I need to document a new Wallarm Node release using the new-node-release skill. Here are the details:

* Artifact type: NGINX Node
* New version: 6.12.1
* Release date: 2026-05-11
* Source of release contents: JIRA link with the release

Please run the full workflow end-to-end. Show me draft previews and verification reports at each checkpoint before committing changes to files. When in doubt about classification, version applicability, or component-replacement specifics — ask me rather than guess.


<!-- Reference output: TBD -->