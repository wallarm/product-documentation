---
name: update-feature-docs
description: "Document new features, changed functionality, or fix documentation mistakes. Determines scope automatically: new pages, updates to existing pages, cross-cutting changes, or targeted fixes."
---

# Prompt

You are updating Wallarm product documentation. The task may be any of:
* **New feature** — a capability that did not exist before
* **Changed functionality** — a feature was redesigned, its UI/API/config changed
* **Documentation fix** — factual error, missing content, broken link, review feedback

## Input

The author provides one or more of:
* **Description**: what changed, what is wrong, or what is missing
* **PR link(s)**: GitHub PR — read the description and diff
* **Jira/Confluence link(s)**: ticket or spec
* **Use cases**: how users use the feature
* **Review comments**: specific issues to address
* **Context from the author**: guidance on scope, tone, or emphasis

The author does NOT need to specify which files to edit, section, or filename — you determine that yourself.

## Steps

### Phase 1: Understand and scope

1. **Read the source material** the author provided.
2. **Read reference files**:
   * `.doc-agent/glossary.md` — approved terminology
   * `.doc-agent/style-guide.md` — writing conventions
   * `.doc-agent/markdown-guide.md` — formatting conventions
3. **Determine the type of change**:

| Type | Signs | Typical scope |
|------|-------|---------------|
| **New feature** | Capability did not exist before | New page + updates to overview/setup/related pages |
| **Changed functionality** | Existing feature redesigned, new API/UI/config | Rewrite or extend existing pages, possibly add/remove pages |
| **Fix** | Something is wrong or missing in current docs | Targeted edits to 1-3 files |

4. **Find all affected pages**: grep for the feature name, key terms, and related concepts across `docs/latest/` and `include/`.
5. **Read each affected page** fully before making changes.

### Phase 2: Plan

6. For each affected page, determine what to do:

| Action | When |
|--------|------|
| **Create new page** | New concept, standalone workflow, enough content for a full article |
| **Rewrite** | Page structure fundamentally changes due to redesign |
| **Extend** | Add sections, table rows, list items, tabs for new capability |
| **Update** | Change specific values: versions, parameter names, UI paths |
| **Fix** | Correct factual errors, broken links, terminology, style |
| **Delete/merge** | Rework consolidates features — remove page, update nav, fix inbound links |

7. If creating new pages, determine:
   * **Section folder**: based on where related pages live
   * **Filename**: lowercase with hyphens (e.g., `mcp-discovery.md`, `auth-flows.md`)
   * Check sibling pages for subscription badge and version requirements

### Phase 3: Execute

8. **New pages**: write following the structure of existing pages in the same section. Typical structure:

   ```markdown
   # Feature name <subscription-badge-if-needed>

   <1-3 sentence intro>

   ## Requirements

   ## How <feature> works

   ## <Feature-specific sections>
   ```

   Adapt to the feature — not every page needs all sections.

9. **Existing pages**: match the formatting patterns already in the page (same table style, admonition style, list format). For fixes, make the minimal change needed.

10. **Cross-references**: if a page was renamed or an anchor changed, grep for all references and update them. Add links from overview/landing pages to new content.

11. **Screenshots**: if UI changed, replace image references or add `<!-- TODO: update screenshot -->`. Place new images in root `images/` directory.

### Phase 4: Integrate

12. **If new pages were created**:
    * Create wrappers in `docs/7.x/` and `docs/6.x/` with content: `--8<-- "latest/<path>"`
    * Create parent directories if they do not exist
    * Add navigation entries in both `mkdocs-7.x.yml` and `mkdocs-6.x.yml`

13. **If pages were renamed or deleted**:
    * Add redirect in `_redirects`
    * Update nav in both mkdocs configs
    * Fix all inbound cross-references

14. **Update related pages**: overview/landing pages, `updating-migrating/what-is-new.md` if user-facing.

### Phase 5: Validate

15. **Check consistency**:
    * All cross-references resolve
    * Terminology matches glossary
    * Style matches style guide
    * New pages have wrappers and nav entries in both version configs
    * No broken markdown syntax

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
* Ask the author to specify files, section, or filename — determine it yourself
* Rewrite sections beyond what the task requires
* Skip creating wrappers and nav entries for new pages
* Rename or delete pages without adding a redirect in `_redirects`
* Leave broken cross-references after any restructuring
* Forget to update overview/landing pages that should link to changed content
