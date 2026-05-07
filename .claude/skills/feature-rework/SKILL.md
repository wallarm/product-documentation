---
name: feature-rework
description: "Update existing documentation when a feature is redesigned, expanded, or its implementation changes. Covers full overhauls, incremental expansion across multiple docs, and UI/config actualization. Identifies all affected pages, preserves doc graph integrity."
---

# Prompt

You are updating existing Wallarm documentation because a feature has been redesigned, expanded, or its implementation has changed.

## Input

The author provides one or more of:
- **Description of what changed**: verbal explanation of the feature rework
- **PR link(s)**: GitHub PR with the product changes — read the PR description and diff to understand what changed
- **Jira/Confluence link(s)**: ticket or spec describing the redesign
- **Use cases**: how the reworked feature is used
- **Context from the author**: any additional guidance on scope, tone, or emphasis

The author does NOT need to specify which files to edit — you determine that yourself.

## Steps

### Phase 1: Understand the change

1. Read all source material the author provided (PRs, tickets, descriptions).
2. Identify the **scope of the rework**:
   - **Full page overhaul** — the feature was fundamentally redesigned (new API, new architecture, new setup flow). Example: Sentinel integration rewritten to use Azure Monitor Logs Ingestion API instead of the old method.
   - **Feature expansion** — a new capability was added to an existing feature, requiring updates across multiple existing docs. Example: MCP support added to API Discovery — touched overview, exploring, risk-score, sensitive-data, setup.
   - **Actualization** — UI changed, parameters renamed, screenshots outdated, new options added. Example: terraform provider docs updated after config schema change.

### Phase 2: Map the affected documentation

3. Search for ALL pages related to this feature:
   - Grep for the feature name, key terms, and related concepts across `docs/latest/` and `include/`
   - Read the main feature page and follow all cross-references to identify the doc graph
   - Check overview/landing pages in the same section (e.g., `overview.md`, `setup.md`)
   - Check `updating-migrating/what-is-new.md` — may need updates for new capabilities
   - Check navigation in `mkdocs-7.x.yml` and `mkdocs-6.x.yml` — pages may be added, removed, or renamed

4. Read each affected page fully before making changes.

5. Read `.doc-agent/glossary.md` to verify terminology for any new terms introduced by the rework.

### Phase 3: Plan the changes

6. For each affected page, determine the type of change:

   | Change type | What to do |
   |---|---|
   | **Rewrite** | Page structure fundamentally changes. Write new content preserving only what still applies. Keep the same filename unless the scope changed so much that a rename is warranted. |
   | **Extend** | Add new sections, table rows, list items, tabs for the new capability. Keep existing content intact. |
   | **Update** | Change specific values: version numbers, parameter names, UI paths, descriptions. |
   | **Cross-ref fix** | Update links pointing to/from renamed or restructured pages. |
   | **New page** | Create a new page if the rework introduces a distinct sub-feature that deserves its own article. |
   | **Delete/merge** | Remove a page if the rework consolidates features. Update nav and fix all inbound links. |

7. If new pages are needed, determine:
   - **Section folder**: based on where related pages live (e.g., if reworking something in `agentic-ai/`, new pages go there too)
   - **Filename**: lowercase with hyphens, descriptive of the content
   - Wrappers needed in `docs/7.x/` and `docs/6.x/`
   - Nav entries needed in both `mkdocs-*.yml` files

### Phase 4: Execute the changes

8. Apply changes to each affected page:
   - For **rewrites**: preserve the page template structure (H1 + badge, Requirements, How it works, Configuration, Example) unless the rework demands a different structure
   - For **extensions**: match the formatting patterns of the existing page (same table style, same admonition style, same list format)
   - For **new pages**: follow the appropriate page template from CLAUDE.md

9. Update cross-references:
   - If a page was renamed or a section anchor changed, grep for all references to the old path/anchor and update them
   - If new pages were created, add links from related overview/landing pages

10. Update screenshots:
    - If the UI changed, replace image references or add `<!-- TODO: update screenshot -->` placeholders
    - Place new images in root `images/` directory, organized by section

11. If the rework introduces new capabilities visible to users:
    - Consider whether `docs/latest/updating-migrating/what-is-new.md` needs an update
    - Consider whether release notes (`node-artifact-versions.md`) need a new entry

12. If new pages were created:
    - Create wrapper files in `docs/7.x/` and `docs/6.x/`
    - Add navigation entries in both `mkdocs-7.x.yml` and `mkdocs-6.x.yml`

### Phase 5: Validate

13. Verify consistency:
    - All cross-references resolve (no broken links to old paths/anchors)
    - Terminology matches glossary
    - No contractions, passive voice, or marketing language
    - Version requirements are up to date
    - Tables, admonitions, tabs, code blocks are syntactically correct

## Rework patterns from real history

These patterns are observed from actual documentation reworks in this repository:

### Pattern: Full overhaul (Sentinel)
The old Sentinel integration page (~60 lines, simple setup) was completely rewritten (~500 lines) when the product switched from the old Azure Log Analytics API to the new Logs Ingestion API. The new page has:
- Entirely new structure (What this setup creates, Prerequisites, Wallarm event schema, Step-by-step with CLI/portal tabs)
- New screenshots (6 added)
- Same filename preserved (`azure-sentinel.md`)
- Cross-links from `integrations-intro.md` updated

### Pattern: Feature expansion across docs (MCP in API Discovery)
When MCP support was added to API Discovery, these existing pages were updated:
- `api-discovery/overview.md` — added MCP to supported protocols table, added MCP tab to API inventory, mentioned MCP in traffic processing
- `api-discovery/exploring.md` — added MCP primitive details section
- `api-discovery/risk-score.md` — added MCP risk factors
- `api-discovery/sensitive-data.md` — mentioned MCP context
- `api-discovery/setup.md` — added MCP to requirements and protocol selection
- New pages created: `agentic-ai/mcp-discovery.md`, `api-sessions/mcp-sessions.md`
- Overview page updated: `agentic-ai/overview.md`, `agentic-ai/agentic-ai-discovery.md`

### Pattern: Multi-doc evolution (Human Identity / Antibot)
Started as a single `web-antibot.md`, then:
1. First draft → review → major rewrite after review (133 insertions, 171 deletions)
2. New companion page `mobile-antibot.md` added
3. Overview page `overview.md` created/updated
4. Integration with Wallarm Node documented (cookie + session context)
5. Temporarily hidden from nav during draft phase, then re-added

### Pattern: Actualization (terraform, activity log, APID)
Smaller-scope updates where:
- Parameter names or default values changed
- UI screenshots became outdated
- New options or modes were added
- Version compatibility info changed
- Usually 1-3 files affected, not full rewrites

## Style rules

Same as all Wallarm docs:
- American English, no contractions
- Present tense, active voice, second person
- Imperative for instructions
- Check glossary for all terms
- Relative cross-references only
- Placeholders: `<UPPERCASE_WITH_UNDERSCORES>`

## Do NOT

- Change pages that are unrelated to the rework
- Remove existing content unless the rework makes it obsolete
- Invent feature behavior not described in the source material
- Leave broken cross-references after renaming or restructuring
- Forget to update overview/landing pages that link to reworked content
- Skip creating wrappers in 6.x/7.x for any new pages
- Rename or delete a page without adding a redirect in `docs/6.x/_redirects` (format: `/old/path  /new/path`)
