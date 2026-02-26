# Docs Check — Glossary & Style Guide Automation

Automated documentation quality check that validates pull request changes against the Wallarm Confluence Glossary and Style Guide using Claude AI.

---

## Usage

### Manual check during a PR

At any point while a PR is open, post a comment on it:

```
/check-docs
```

A 👀 reaction appears on the comment to confirm the check has started. When it finishes, the bot posts a comment on the PR with results. If you run `/check-docs` again after pushing more commits, the bot updates its existing comment rather than posting a new one.

**Example result — violations found:**

> ## Docs check results (changed files in PR)
> Found **2 violation(s)** in 1 file(s).
> - Wrong term: 1
> - Style: 1
>
> | File | Line | Type | Found | Suggestion | Note |
> |---|---|---|---|---|---|
> | `docs/latest/api/overview.md` | 14 | Wrong term | `whitelist` | allowlist | Use "allowlist" instead of "whitelist". |
> | `docs/latest/api/overview.md` | 27 | Style | `simply click` | — | Avoid "simply" — it implies the action is easy, which may frustrate users. |

**Example result — clean:**

> ## Docs check results (changed files in PR)
> **No violations found** across 3 file(s) checked.

### Automatic check at merge

When a PR is added to the **merge queue**, the check runs automatically on the PR's changed files. If violations are found, the merge is blocked until they are resolved (or the check is manually bypassed by a repo admin).

### Scope

Both triggers check **only the files changed in the PR** — not the entire docs site. A PR touching 2 files results in 2 files being checked. Only English source files in `docs/latest/` and `include/` are in scope; translated versions are excluded.

### Rules source

Rules are fetched live from Confluence at the time the check runs. Updates to the Glossary or Style Guide in Confluence take effect on the next check run — no code changes needed.

---

## Implementation

### Files created in this repository

| File | Purpose |
|---|---|
| [`.github/workflows/docs-check.yml`](workflows/docs-check.yml) | GitHub Actions workflow — defines triggers, checkout logic, file list building, and calls the checker script |
| [`scripts/check_docs.py`](../scripts/check_docs.py) | Python script — fetches Confluence pages, builds Claude prompt, checks each file, posts PR comment or job summary |
| [`scripts/requirements-checker.txt`](../scripts/requirements-checker.txt) | Python dependencies for the checker script (`requests`, `beautifulsoup4`, `lxml`, `anthropic`) |

### How the check works (technical flow)

```
PR comment "/check-docs"  ─────────────────────────────┐
                                                        ▼
merge_group event (PR added to merge queue)  ──► GitHub Actions runner
                                                        │
                                              ┌─────────┴──────────┐
                                              │  Confluence REST API │
                                              │  GET /wiki/rest/api  │
                                              │  /content/{page_id}  │
                                              └─────────┬──────────┘
                                                        │ Glossary HTML
                                                        │ Style Guide HTML
                                                        │ (parsed to plain text)
                                                        ▼
                                              ┌─────────────────────┐
                                              │  Claude Haiku API    │
                                              │  One call per file:  │
                                              │  system = rules      │
                                              │  user   = file body  │
                                              │  → JSON violations   │
                                              └─────────┬───────────┘
                                                        │
                                         ┌──────────────┴──────────────┐
                                         ▼                             ▼
                                  /check-docs trigger          merge_group trigger
                                  Post/update PR comment       Write to job summary
                                                               (check passes or fails)
```

### GitHub configuration

#### Repository secrets

Add the following under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `CONFLUENCE_BASE_URL` | Confluence instance URL, e.g. `https://yourcompany.atlassian.net` |
| `CONFLUENCE_EMAIL` | Email of the team member whose account is used for Confluence API access (see below) |
| `CONFLUENCE_API_TOKEN` | API token for that account ([generate here](https://id.atlassian.com/manage-profile/security/api-tokens)) |
| `CONFLUENCE_GLOSSARY_PAGE_ID` | Numeric ID of the Glossary page (visible in the Confluence page URL) |
| `CONFLUENCE_STYLE_GUIDE_PAGE_ID` | Numeric ID of the Style Guide page |
| `ANTHROPIC_API_KEY` | API key for Claude ([console.anthropic.com](https://console.anthropic.com)) |

#### Branch protection rule for `master`

Under **Settings → Branches → Edit rule for `master`**:

1. Enable **Require merge queue**
2. Under **Require status checks to pass**, add `Check docs against Confluence rules`

This ensures the docs check is a required gate before any PR can merge.

#### Confluence credentials — current approach

Confluence Cloud does not support org-level or team-level API credentials — every API token is always tied to an individual Atlassian account.

**Currently in use:** the personal Atlassian account of a designated team member. The account email and API token are stored in the `CONFLUENCE_EMAIL` and `CONFLUENCE_API_TOKEN` repository secrets. Only repo admins can read or update these values.

The API token grants read-only access to the Glossary and Style Guide pages. It does not allow writing to Confluence or accessing any other content.

**If the credential owner leaves the team:** a repo admin must generate a new API token from another team member's account and update both secrets.

#### Confluence credentials — alternative approaches (not implemented)

**A. Team-owned bot account in Confluence**

Create a dedicated Atlassian account using a shared team mailbox (e.g. a Google Group at `docs-bot@wallarm.com`). The account belongs to no individual — any team member can access the mailbox, and the automation continues working regardless of who joins or leaves the team.

Not adopted because Atlassian accounts backed by Google Workspace SSO domains may require IT involvement to create, and managing a shared mailbox adds operational overhead that is disproportionate for a team of three. Worth revisiting if the team grows or if credential rotation becomes a recurring issue.

**B. Rules as files in the repository**

Store the Glossary and Style Guide content as plain files in the repo (e.g. `scripts/glossary.md` and `scripts/style-guide.md`). The workflow reads from those files instead of calling the Confluence API, removing the need for any Confluence credentials entirely.

Not adopted because it introduces a manual sync requirement: whenever the Glossary or Style Guide is updated in Confluence, someone must also update the corresponding file in the repo via a PR. Without an automated reminder, the repo copy can silently drift from the Confluence source of truth. This approach becomes practical if a separate scheduled workflow is added to detect Confluence changes and open a GitHub issue to prompt a sync.
