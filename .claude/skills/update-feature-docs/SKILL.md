---
name: update-feature-docs
description: "Document new features, changed functionality, or fix documentation mistakes. Determines scope automatically: new pages, updates to existing pages, cross-cutting changes, or targeted fixes."
---

# Prompt

You are updating Wallarm product documentation. The task may be any of:
* **New feature** — a capability that did not exist before
* **Changed functionality** — a feature was redesigned, its UI/API/config changed
* **Documentation fix** — factual error, missing content, broken link, review feedback

This skill can be used as a step-by-step workflow by an AI agent or as a checklist by a human contributor working without an agent. Steps with code snippets are mechanical; steps that say "ask the author" are decision points where product knowledge is required.

## Input

The author provides one or more of:
* **Description**: what changed, what is wrong, or what is missing
* **PR link(s)**: GitLab or GitHub PR — read the description and diff
* **Jira/Confluence link(s)**: ticket or spec
* **Use cases**: how users use the feature
* **Review comments**: specific issues to address
* **Context from the author**: guidance on scope, tone, or emphasis

The author does NOT need to specify which files to edit, section, or filename — you determine that yourself.

## Investigation before questions

**The repo itself is your product knowledge base.** Wallarm documentation already maps features, integrations, terminology, and relationships between areas. Read the repo first, ask the author only about things the repo cannot tell you.

Before deciding scope or bringing questions to the author:

* grep across `docs/latest/` and `include/` for the feature name, related component names, and obvious synonyms
* open the overview / landing page of the relevant area and read its table of contents
* read at least 2-3 sibling pages in the same folder before deciding where new content belongs
* skim `updating-migrating/what-is-new.md` for recent entries about the same area — they show how similar changes were framed

**Two kinds of questions, only one belongs to the author:**

| Find in the repo (do not ask) | Ask the author |
|-------------------------------|----------------|
| Where a feature lives in the navigation | Subscription tier / availability for unreleased features |
| Relationships between existing features | Official naming, UI labels, parameter names — especially for new functionality |
| Current behaviour, current terminology | User-visible framing (what does the user actually see or do differently?) |
| Which pages describe a subject | Form-factor scope (NGINX Node, Native Node, sidecar, ingress, OOB — which apply?) |
| Existing config parameters, existing metrics | Version applicability, including backports |
| Style and formatting conventions | Migration / breaking changes — what users need to do |
| | Adjacent features that touch this change but were not mentioned |

After investigating, expect to find things the author did not mention. Bring them back rather than silently resolving:

* "I found feature X mentioned in `<file>` in the context of Y — does this change apply there too?"
* "The glossary lists Z as deprecated, but your description uses Z — which term should the docs use?"
* "Pages A and B describe the same flow with conflicting steps. Which is current?"

Batch related questions. Prefer multi-option questions with concrete choices over open-ended ones. Asking is a working tool, not a sign that something went wrong.

## Steps

### Phase 1: Understand and scope

1. **Read the source material** — identify the user-visible change, the affected feature(s), and any UI/API/config names that will need to appear verbatim in docs.
2. **Read reference files** (declared in CLAUDE.md):
   * `.doc-agent/glossary.md` — approved terminology
   * `.doc-agent/style-guide.md` — writing conventions
   * `.doc-agent/markdown-guide.md` — formatting conventions
3. **Determine the type of change**:

    | Type | Signs | Typical scope |
    |------|-------|---------------|
    | **New feature** | Capability did not exist before | New page + updates to overview/setup/related pages |
    | **Changed functionality** | Existing feature redesigned, new API/UI/config | Rewrite or extend existing pages, possibly add/remove pages |
    | **Fix** | Something is wrong or missing in current docs | Targeted edits to 1-3 files |

4. **Find all affected pages**: grep for the feature name, key terms, and related concepts across `docs/latest/` and `include/`. List every hit, including ones that look unrelated — read the surrounding paragraphs before dismissing.
5. **Read each affected page** fully before making changes.
6. **Surface discrepancies to the author.** If the repo describes the feature differently from the author's description, if two existing pages contradict each other, or if you found related areas the author did not mention — raise them now, before scoping further.

### Phase 2: Plan

7. For each affected page, determine what to do:

    | Action | When |
    |--------|------|
    | **Create new page** | New concept, standalone workflow, enough content for a full article |
    | **Rewrite** | Page structure fundamentally changes due to redesign |
    | **Extend** | Add sections, table rows, list items, tabs for new capability |
    | **Update** | Change specific values: versions, parameter names, UI paths |
    | **Fix** | Correct factual errors, broken links, terminology, style |
    | **Delete/merge** | Rework consolidates features — remove page, update nav, fix inbound links |

8. If creating new pages, determine:
    * **Section folder**:
        * If the feature extends an existing area (API Discovery, Antibot, Sentinel integration, etc.) → place inside that area's folder
        * If it is a standalone capability → place at the relevant top-level section root
        * When in doubt, mirror the location of the closest sibling page with similar scope
    * **Filename**: lowercase with hyphens (e.g., `mcp-discovery.md`, `auth-flows.md`)
    * Check sibling pages for subscription badge and version requirements

### Phase 3: Execute

9. **New pages**: write following the structure of existing pages in the same section. Typical structure:

    ```markdown
    # Feature name <subscription-badge-if-needed>

    <1-3 sentence intro>

    ## Requirements

    ## How <feature> works

    ## <Feature-specific sections>
    ```

    Adapt to the feature — not every page needs all sections. Before writing, open 1-2 sibling pages in the same folder and match their structure (intro length, section order, presence of "Use cases" / "Limitations" / "Troubleshooting").

10. **Existing pages**: match the formatting patterns already in the page (same table style, admonition style, list format). For fixes, make the minimal change needed.

11. **Cross-references**: if a page was renamed or an anchor changed, grep for all references and update them. Add links from overview/landing pages to new content.

12. **Screenshots**: if UI changed, replace image references or add `<!-- TODO: update screenshot -->`. Place new images in root `images/` directory.

### Phase 4: Integrate

13. **If new pages were created**:
    * Identify every active version directory by listing `mkdocs-*.yml` configs at the repo root (e.g., `mkdocs-6.x.yml`, `mkdocs-7.x.yml`); each one corresponds to a `docs/<X>/` directory
    * In every such `docs/<X>/` create a wrapper at the matching path with content: `--8<-- "latest/<path>"`
    * Create parent directories if they do not exist
    * Add navigation entries in every `mkdocs-*.yml`

14. **If pages were renamed or deleted**:
    * Add a redirect in `_redirects`
    * Update nav in every `mkdocs-*.yml`
    * Fix all inbound cross-references

15. **Update related pages**: overview/landing pages always. Add an entry to `updating-migrating/what-is-new.md` only if this is a user-visible capability or behavior change — skip it for fixes, terminology updates, internal restructuring, and screenshot refreshes.

### Phase 5: Validate

16. **Run these checks before handing off:**

    * **Inbound references resolve.** If anything was renamed, deleted, or moved:

        ```bash
        grep -rn "<old-page-name>\|<old-anchor>" docs/latest/ include/
        ```

        Expect zero results outside changelog/history sections. Repeat across every active `docs/<X>/` directory.

    * **New pages render.** Run `./serve.sh mkdocs-<root>.yml` (and any other active version config) and open the new/edited page. Confirm: title renders, admonitions render, code blocks render, images load, internal links resolve.

    * **New pages are wired up.** For every new page in `docs/latest/`, check that a wrapper exists at the matching path in every active `docs/<X>/`, and that the page is in nav of every `mkdocs-*.yml`.

    * **Terminology and style.** Cross-check feature/product names against `.doc-agent/glossary.md`. Cross-check formatting (lists, admonitions, code fences, links) against `.doc-agent/markdown-guide.md` and `.doc-agent/style-guide.md`.

## Real patterns from this repository

### New feature: MCP in API Discovery
New capability added to an existing feature. Updated 6 existing pages (overview, exploring, risk-score, sensitive-data, setup, agentic-ai-discovery), created 2 new pages (mcp-discovery, mcp-sessions), updated overview page.

### Changed functionality: Sentinel integration
Complete rewrite of `azure-sentinel.md` (~60 → ~500 lines) when the product switched APIs. Same filename preserved, 6 new screenshots, cross-links updated.

### Multi-doc evolution: Human Identity / Antibot
Started as a single page, evolved through: draft → review rewrite → companion page added → overview created → integration with Node documented.

### Fix: actualization
Smaller-scope: parameter names changed, UI screenshots outdated, new options added. Usually 1-3 files, not full rewrites.

## Do NOT

* Invent features not in the source material
* Ask the author about things the repo can answer (where a feature lives, how it relates to others, what terminology currently exists) — investigate the repo first
* Silently resolve discrepancies between the repo and the author's description — surface them and let the author decide
* Ask the author to specify files, section, or filename — determine it yourself
* Rewrite sections beyond what the task requires
* When creating new pages, omit any of: wrappers in every active version directory, nav entries in every `mkdocs-*.yml`, inbound links from overview/landing pages — they must all land in the same PR
* Rename or delete pages without adding a redirect in `_redirects` and fixing every inbound cross-reference
* Add an entry to `what-is-new.md` for fixes, terminology, or internal restructuring — reserve it for user-visible capability or behavior changes