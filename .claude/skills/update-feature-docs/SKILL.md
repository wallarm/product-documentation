---
name: update-feature-docs
description: "Document new features, changed functionality, or fix documentation mistakes. Determines scope automatically: new pages, updates to existing pages, cross-cutting changes, or targeted fixes."
---

# Prompt

You are updating Wallarm product documentation. The task may be any of:
* **New feature** — a capability that did not exist before
* **Changed functionality** — a feature was redesigned, its UI/API/config changed
* **Documentation fix** — factual error, missing content, broken link, review feedback
* **Removal of a discontinued feature/product** — purge all docs related to something that no longer exists; goal is that the content is no longer accessible on the public site

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
    | **Removal** | Feature/product discontinued; "remove all docs for X", "purge X from the site" | Delete pages, wrappers, nav entries, related sections, images, **including across all versions AND all translation directories** — see "Removal across all languages" below |

4. **Find all affected pages**: grep for the feature name, key terms, and related concepts across `docs/latest/` and `include/`. List every hit, including ones that look unrelated — read the surrounding paragraphs before dismissing.

    **For removal tasks**, broaden the grep to cover every version dir AND every translation dir from the start:

    ```bash
    grep -rln "<feature-term>" docs/ include/ include-*/ mkdocs-*.yml
    ```

    Translated sources live under `docs/latest-ja/`, `docs/latest-tr/`, `docs/latest-ar/`, `docs/latest-pt-BR/`. Version wrappers live under `docs/{5.0,6.x,7.x,ja,tr,ar,pt-BR}/`. Translated terms also need to be searched (e.g., "オンプレ" for Japanese, "şirket içi" for Turkish, "في الموقع" for Arabic, "no local" / "implantação local" for Portuguese) — ask the author for the translated term, or check the existing translated source file before deciding.
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

14. **If a new customer-facing capability was added** (a feature, not just a config tweak or a bug fix), audit `docs/latest/about-wallarm/subscription-plans.md`. The table lists features per subscription tier and needs a new row when a new capability ships. Procedure:
    * Open the feature page and read its **Requirements** section to learn which subscription tier(s) the feature requires.
    * Open `subscription-plans.md` and find the matching section header (`Real-time protection`, `API protocol support`, `Security posture`, `Security testing`, `Additional options`). Place the new row next to its closest parent feature so related rows cluster.
    * Set tier columns based on the Requirements section: `Yes` for tiers that include the capability, `No` for tiers that do not.
    * Link the feature name in the new row to its documentation page.
    * Skip this step for fixes, config tweaks, performance improvements, and other non-capability changes — those do not get table rows.

15. **If pages were renamed or deleted**:
    * Add a redirect in `_redirects` (the active root version's `_redirects`, plus the next-root's, plus any language-specific `docs/<lang>/_redirects` that exist)
    * Update nav in every `mkdocs-*.yml` — including the translation configs (`mkdocs-ja-*.yml`, `mkdocs-tr-*.yml`, `mkdocs-ar-*.yml`, `mkdocs-pt-BR-*.yml`) when the deletion is meant to apply across all languages
    * Fix all inbound cross-references

    **Removal across all languages.** When the request is "remove all documentation for X from the site" (typically a discontinued product/feature), the cleanup must include translations even though CLAUDE.md normally says "do not edit translated files". This is an explicit override — the translated content is stale because it describes something that no longer exists. Touch all of the following:

    | Surface | Files |
    |---------|-------|
    | English sources | `docs/latest/<paths>` |
    | English version dirs | `docs/{5.0,6.x,7.x}/<paths>` (wrappers or frozen full copies — check) |
    | Translated sources | `docs/latest-ja/<paths>`, `docs/latest-tr/<paths>`, `docs/latest-ar/<paths>`, `docs/latest-pt-BR/<paths>` (full translated files) |
    | Translation version dirs | `docs/{ja,tr,ar,pt-BR}/<paths>` (wrappers, usually) |
    | mkdocs nav | `mkdocs-*.yml` for every active English version AND every translation config (`mkdocs-ja-6.x.yml`, `mkdocs-tr-6.x.yml`, `mkdocs-ar-4.10.yml`, `mkdocs-pt-BR-4.8.yml`) |
    | Shared includes | `include/<files>` and `include-ja/<files>`, `include-tr/<files>` (other translation includes exist but typically have no equivalent file) |
    | Redirects | `docs/{5.0,6.x,7.x,ja,tr,ar,pt-BR}/_redirects` (only those that exist; English roots are the main ones) |
    | Images | `images/<paths>` (single shared source; remove only if no surviving page references them) |
    | Auto-generated LLM indexes | `docs/{6.x,7.x}/llms.md` and `llms.txt` — pruning is optional (they regenerate), but cleaner to scrub in the same PR |

    Watch for **frozen full copies in older version dirs**: when a version stops being root, version-specific pages get copied from `docs/latest/` into that older version dir as full files (instead of `--8<-- "latest/..."` wrappers). For removals, these frozen copies must be edited directly — they will not follow updates to `docs/latest/`. Verify each affected path in each version dir individually:

    ```bash
    for v in 5.0 6.x 7.x ar ja tr pt-BR; do
      head -1 "docs/$v/<path-to-affected-file>" 2>/dev/null | grep -q "8<--" \
        && echo "$v: wrapper" || echo "$v: FULL — needs direct edit"
    done
    ```

    For translation full files, edit them in their native language. Match the existing translation's voice — do not introduce English terms where a translated equivalent is already established (check the surrounding paragraphs). For terminology you cannot translate confidently, prefer deleting the stale phrase rather than inventing wording. The auto-translation pipeline will eventually catch up, but stale references to a removed product must not survive in the interim.

    Translation cleanup is not optional polish — it is part of "the content is no longer accessible on the public site", since translation URLs serve from the same domain.

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

## Writing principles

These come from repeated review-and-rewrite cycles on real PRs. Apply during Phase 3 (Execute) and during self-review before handoff — they prevent a class of rewrites the author would otherwise drive. They sit on top of `.doc-agent/style-guide.md`, which covers sentence-level conventions; this section covers paragraph-, section-, and article-level choices.

### Describe what the user does, not the UI itself

When a screenshot, table, or wizard accompanies a section, the prose should explain *what the section is for* and *what decisions the user makes there*. It should not enumerate every column, field, or button visible in the image — those are self-evident. A two-sentence description ("Use this tab to create recurring scans and review their history") beats a four-bullet enumeration of column headers when both convey the same information. Reserve bold formatting for the few UI elements the user actually interacts with (buttons they click, fields where the value matters), not every visible label.

### Skip obvious mechanical actions

Inside a numbered step sequence, "click **Next**" and "click **Add Account**" at the end of every step carry no information — they describe inevitable UI mechanics, not decisions. Document the *configuration choices* (which option is selected, what value is entered, what file is uploaded) and let the obvious clicks remain implicit. "Set X, click Next, then set Y, click Next, then Z, click Add" reduces to "Configure X, Y, and Z" with the field-level guidance.

### Mirror product UI structure

When documenting a Console section with tabs or sub-tabs, structure the article to match: top-level tabs become `##` headings, sub-tabs become `###` headings, in the same order the user sees them. Do not invent abstract categories that mix items the UI presents separately, and do not split items the UI presents together into different pages. A reader reading the docs side-by-side with the product should see the same hierarchy in both.

### Prose for concepts, bullets for parallel discrete items

Bullets fit parallel, discrete, non-overlapping items: a list of mutually exclusive actions, a set of supported services, a checklist of prerequisites. Explanation of a concept or a process belongs in a paragraph. If a bullet item is more than one sentence, or if bullets re-introduce the same subject each time ("Each finding shows: severity — ...; status — ...; source — ..."), prose is the better fit. Keep paragraphs short — one idea each, split when stuffing more than two or three.

### Plain prose over corporate abstractions

"Remediation recommendation" → "how to fix it". "Surface the IAM principal" → "show who created it". "Resource configuration analysis" → "checks for risky setups". When a shorter, more concrete phrasing conveys the same meaning, prefer it. Avoid abstraction nouns ("attribution", "enrichment", "aggregation") in favor of verbs and concrete nouns where possible.

### Define product-specific terms in context

When a term like "finding", "policy", "rule", or "drift" appears as a section heading or anchor concept, the first paragraph should define it inline — even if it is defined elsewhere. Readers land on pages from search and external links, not always via the overview. Do not assume the reader has read prior sections.

### Verify product claims against code, not marketing

AWS Marketplace listings, blog posts, sales decks, and adjacent products' changelogs may claim capabilities the product does not have, list services it does not yet cover, or describe authentication methods that work only in dev. Source of truth: the IAM policy template, the actual collectors directory, the product's own changelog, the routes in API handlers. If a claim cannot be traced to code, raise it with the author rather than transcribing it.

### Link to external products' docs, do not re-explain them

For setup that involves a third-party product (AWS, Azure, GCP, Postman, etc.), link to that product's own documentation rather than reproducing its UI workflow. State the intent — "create an IAM user, attach the policy, generate access keys" — and link each phrase to the corresponding vendor docs page. Their UI changes; their docs follow; ours do not. Less to maintain.

### Be specific about where in someone else's UI

When directing the reader to a value in a third-party UI, name the exact location: tab, page, or section. "See the stack outputs" is not enough; "once the status changes to `CREATE_COMPLETE`, open the **Outputs** tab on the stack page and copy the `DiscoveryRoleArn` value" is.

### Be precise about timing

When describing a feature that involves lookups, scans, or computation, be explicit about *when* it happens — on every scan, on user request, once at setup, daily, etc. "Infrastructure Discovery queries CloudTrail" reads as automatic and per-asset. "When you open an asset, Infrastructure Discovery queries CloudTrail" makes it clear the lookup is lazy and on-demand. The reader's mental model of cost, latency, and behavior depends on this.

### Do not duplicate content that lives authoritatively elsewhere

Pricing, plan-tier limits, feature-comparison tables, AWS region lists, third-party version-support matrices — content maintained in another channel (marketplace listing, vendor docs, dynamic page) should be *linked* from our docs, not duplicated. Duplication drifts; the moment one side updates, the other lies. Link the source and write a short context sentence.

### Audit anchors after every restructure

When section headings are renamed, reordered, or demoted/promoted, the slug-based anchor changes. Internal `[text](#anchor)` and external `file.md#anchor` links break silently — the page still renders, the link does not jump where intended. After any restructure, grep for the old anchor name across `docs/latest/` (and across version dirs for frozen full copies) and update every reference. Do this as a discrete pass, not interleaved with other edits.

### Pseudo-duplicate bullets indicate one underlying mechanism

If two list items describe the same product mechanism through different framings ("Exposure detection" + "Security posture analysis", both implemented by the same built-in rule engine), they are not two features — they are one feature described twice. Merge them. The marketplace may split them into separate marketing pillars; docs follow product reality, not marketing framing.

### Skip filler before actionable content

"The Findings sub-tab is the primary place to review findings. Each finding shows..." — the first sentence is preamble. Open with substantive content. The reader already knows they are reading the Findings section; they do not need to be told that the Findings section is about findings.

## Real patterns from this repository

### New feature: MCP in API Discovery
New capability added to an existing feature. Updated 6 existing pages (overview, exploring, risk-score, sensitive-data, setup, agentic-ai-discovery), created 2 new pages (mcp-discovery, mcp-sessions), updated overview page.

### Changed functionality: Sentinel integration
Complete rewrite of `azure-sentinel.md` (~60 → ~500 lines) when the product switched APIs. Same filename preserved, 6 new screenshots, cross-links updated.

### Multi-doc evolution: Human Identity / Antibot
Started as a single page, evolved through: draft → review rewrite → companion page added → overview created → integration with Node documented.

### Fix: actualization
Smaller-scope: parameter names changed, UI screenshots outdated, new options added. Usually 1-3 files, not full rewrites.

### Removal: discontinued On-Premise product
Whole product line retired. Required deleting source pages in `docs/latest/installation/on-premise/`, wrappers in every version dir (`5.0/`, `6.x/`, `7.x/`), translated full sources in `docs/latest-ja/` and `docs/latest-tr/`, translation wrappers in `docs/{ar,ja,tr,pt-BR}/`, removing nav entries from 7 mkdocs configs (3 English + 4 translation), pruning the "On-Premise" item from `include/deployment-forms.md` + the `include-ja/` and `include-tr/` equivalents, removing the dedicated `## On-Premise` section from `shared-responsibility.md` across all language sources (where it existed), rewriting generic mentions of "on-premise" to "self-hosted" (and the translated equivalents), removing the "On-Premise" card from `installation/supported-deployment-options.md` in 6.x/7.x/5.0 and in every translation version dir, deleting the on-premise images, adding redirects from the deleted URLs to `installation/supported-deployment-options/` in each `_redirects` file, and scrubbing the On-Premise entries from `llms.md` / `llms.txt`. ~40+ files touched. The acceptance criterion was URL inaccessibility — translations had to be cleaned too because they serve from the same domain.

## Do NOT

* Invent features not in the source material
* Ask the author about things the repo can answer (where a feature lives, how it relates to others, what terminology currently exists) — investigate the repo first
* Silently resolve discrepancies between the repo and the author's description — surface them and let the author decide
* Ask the author to specify files, section, or filename — determine it yourself
* Rewrite sections beyond what the task requires
* When creating new pages, omit any of: wrappers in every active version directory, nav entries in every `mkdocs-*.yml`, inbound links from overview/landing pages — they must all land in the same PR
* Rename or delete pages without adding a redirect in `_redirects` and fixing every inbound cross-reference
* Add an entry to `what-is-new.md` for fixes, terminology, or internal restructuring — reserve it for user-visible capability or behavior changes
* For a "remove all docs for X" request, stop at `docs/latest/` and the English version dirs — translations under `docs/latest-*/`, `docs/{ja,tr,ar,pt-BR}/`, and translation mkdocs configs (`mkdocs-{ja,tr,ar,pt-BR}-*.yml`) must be cleaned in the same PR. The "do not edit translated files" rule from CLAUDE.md is overridden for explicit removal requests, because stale translations would otherwise keep the discontinued content publicly accessible at translated URLs.