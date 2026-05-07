# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & serve commands

This is a documentation site built with **zensical**. Python dependencies are in `requirements.txt`.

```bash
# First-time setup
pip install -r requirements.txt
git submodule update --init --recursive   # required — without this, build fails on terraform module snippets

# Serve locally (available at http://127.0.0.1:8000)
./serve.sh mkdocs-6.x.yml   # 6.x (current root version)
./serve.sh mkdocs-7.x.yml   # 7.x
```

For a **full multi-version build** (all languages, all versions), use the `Dockerfile` — available at http://localhost:8080/:

```bash
docker build -t wallarm-docs . && docker run -p 8080:80 wallarm-docs
```

### Git workflow

* **Branch naming**: use descriptive names by topic, e.g., `apid-auth-flows`, `mcp-mitigation-controls`, `apid-collected-fixes` (for mixed fixes in one area).
* **Before committing**: run `./serve.sh` locally and verify the result in browser — this is the baseline check before any commit.

### Deployment pipeline

* There are no tests or linters. Validation happens via **Netlify preview builds**.
* Creating a **PR to `master`** triggers a Netlify test build — the preview link appears in the PR checks (takes 3-5 minutes).
* **Merging to `master`** triggers production deployment via Netlify.
* Build configuration is in `netlify.toml`.

## Repository architecture

### Content flow: latest → version wrappers → site

```
docs/latest/         ← SOURCE OF TRUTH. All editing happens here.
  ├── about-wallarm/
  ├── agentic-ai/
  ├── api-discovery/
  ├── api-sessions/
  ├── human-identity/
  ├── installation/
  ├── updating-migrating/
  ├── user-guides/
  └── ...other section folders

docs/<version>/      ← Version directories (7.x, 6.x, 5.0, ...)
docs/deprecated/     ← Stub page for fully deprecated versions
```

**Version directory lifecycle**: when a version is the latest, its `docs/<version>/` folder contains one-line wrapper files that include from `docs/latest/` via `--8<-- "latest/section/page.md"`. When a newer version replaces it, version-specific pages (installation, migration guides) are copied from `docs/latest/` into the old version folder as full content files, freezing them. Older versions gradually accumulate more full files and fewer wrappers.

The current **root version** is **6.x** (NGINX Node) / **0.14.x+** (Native Node) — it serves at `/` and is the default for all users. **7.x** is in preview mode and serves under `/7.x/`; it will become the root version once fully released.

Each active version has its own config:

| Config | Version | Serves at | Status |
|--------|---------|-----------|--------|
| `mkdocs-6.x.yml` | 6.x (NGINX Node) / 0.14.x+ (Native Node) | Site root `/` | Current root |
| `mkdocs-7.x.yml` | 7.x / 0.26.x+ | `/7.x/` | Preview |
| `mkdocs-5.0.yml` | 5.x / 0.13.x- | `/5.x/` | Legacy |
| `mkdocs-deprecated.yml` | 4.10 (stub page only) | `/4.10/` | Deprecated |

All configs inherit from `mkdocs-base.yml` (shared plugins, extensions, theme settings). The root version is controlled by `rootVersion` in `stylesheets/extra.js` and `site_dir` in the config.

### Translations

Docs are written in English. Translation configs (`mkdocs-ja-6.x.yml`, `mkdocs-tr-6.x.yml`, etc.) and translation snippets (`include-ja/`, `include-ar/`, etc.) exist in the repo but the auto-translation pipeline is not yet in place. Do NOT edit translated files directly — they will be auto-generated from English sources.

### Reusable content (includes)

```
include/             ← English snippets shared across pages
include-ja/          ← Japanese translated snippets
include-ar/          ← Arabic translated snippets
```

Referenced from docs via `--8<-- "../include/snippet.md"`. The snippet base path is `docs/` (configured in `mkdocs-base.yml` under `pymdownx.snippets`), so paths in snippet directives are relative to the `docs/` directory.

### Images

`images/` at repo root is the **single source** for all screenshots/diagrams.

**How images reach each version**: before every build or serve, images are copied from `images/` into each version's `docs_dir` (e.g., `docs/6.x/images/`). This happens in `serve.sh`, `Dockerfile`, and `netlify.toml`. The copies are temporary and cleaned up after the build. Do not commit `docs/<version>/images/` — they are gitignored or cleaned up.

Diagrams and schemes are maintained in the [Figma project](https://www.figma.com/file/77TOtRey6EfvZsPQTClWMn/Traffic-flows).

### Reference files

* `.doc-agent/glossary.md` — official terminology with approved/forbidden synonyms
* `.doc-agent/style-guide.md` — writing conventions

### Redirects

The `_redirects` file lives in the root version's `docs_dir` (currently `docs/6.x/_redirects`, will move to `docs/7.x/_redirects` when 7.x becomes root). When a page is **renamed or deleted**, add a redirect from the old path to the new one:

```
/old/path/page  /new/path/page
```

This prevents 404 errors for users with bookmarked URLs. Redirect syntax supports wildcards (`/*`). See [Netlify redirect docs](https://docs.netlify.com/routing/redirects/).

### Key platform files

| File | Purpose |
|------|---------|
| `mkdocs-base.yml` | Shared config: plugins, extensions, theme |
| `netlify.toml` | Build commands and deploy config (edit only for version management) |
| `stylesheets/extra.js` | Custom JS: image zoom, version selector logic, `rootVersion` variable |
| `stylesheets/partials/` | Custom HTML overrides: `nav.html` (version selector), `header.html`, `footer.html`, `feedback.html`, `actions.html` (edit actions), `toc.html`, `integrations/` |
| `Dockerfile` | Full multi-version build for local testing |
| `serve.sh` | Single-version local dev server |

## Creating a new page

1. Write the page in `docs/latest/<section>/new-page.md`
2. Create wrapper in `docs/7.x/<section>/new-page.md`:
   ```
   --8<-- "latest/<section>/new-page.md"
   ```
3. Create wrapper in `docs/6.x/<section>/new-page.md` (same pattern)
4. Add to navigation in **both** `mkdocs-7.x.yml` and `mkdocs-6.x.yml`
5. Use lowercase filenames with hyphens: `api-discovery-setup.md`
6. Place in an appropriate existing section folder

## Formatting, style, and terminology

Follow these guides before writing or editing any content:

* **`.doc-agent/markdown-guide.md`** — Markdown syntax, extensions, images, tables, code blocks, cross-references, line breaks
* **`.doc-agent/style-guide.md`** — language, tone, highlighting, numbers, dates
* **`.doc-agent/glossary.md`** — approved terminology and forbidden synonyms

## What NOT to do

* Do NOT edit `mkdocs-base.yml` unless explicitly required
* Do NOT edit `netlify.toml` or files in `stylesheets/` except for version management tasks (adding/deprecating a guide version)
* Do NOT edit files in `docs/6.x/` or `docs/7.x/` directly — they are include wrappers (exception: creating new wrappers for new pages)
* Do NOT invent features not described in the source material
* Do NOT add content in languages other than English
* Do NOT remove existing content unless explicitly instructed
* Do NOT modify files outside the `docs/`, `images/`, `include/`, and `mkdocs-*.yml` scope
* Do NOT place images inside `docs/` directories — always use the root `images/` folder
* Do NOT modify installation/deployment docs unless explicitly required by the ticket
* Do NOT use contractions (it's, don't, can't)
* Do NOT use "blacklist" / "whitelist" — use "denylist" / "allowlist"
* Do NOT use full URLs to docs.wallarm.com for cross-references
* Do NOT use directional language ("in the right sidebar") — UI can change
* Do NOT skip header levels for styling
* Do NOT start titles with articles ("The configuration of...")
* Do NOT rename or delete a page without adding a redirect in `docs/6.x/_redirects`
* Do NOT edit translated files (`docs/ja/`, `docs/tr/`, `include-ja/`, etc.) — translations are auto-generated from English
