# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Serve Commands

This is a documentation site built with **zensical** (MkDocs-based). Python dependencies are in `requirements.txt`.

```bash
# Install dependencies
pip install -r requirements.txt

# Serve locally (7.x version — the current/default version)
cp -R images/ docs/7.x/images/ && zensical serve -f mkdocs-7.x.yml
# After stopping, clean up: rm -rf docs/7.x/images/

# Serve locally (6.x version)
cp -R images/ docs/6.x/images/ && zensical serve -f mkdocs-6.x.yml

# Build a specific version
cp -R images/ docs/7.x/images/ && zensical build -f mkdocs-7.x.yml && rm -rf docs/7.x/images/
```

Images must be copied into the version's `docs_dir` before build/serve because zensical does not follow symlinks. Always clean up after.

There are no tests or linters. Validation happens via Netlify preview builds on PRs.

## Repository Architecture

### Content flow: latest → version wrappers → site

```
docs/latest/         ← SOURCE OF TRUTH. All editing happens here.
  ├── about-wallarm/
  ├── api-discovery/
  ├── installation/
  ├── user-guides/
  └── ...30+ section folders

docs/7.x/           ← Version wrapper. Each file is a one-line include:
  └── section/page.md    contains:  --8<-- "latest/section/page.md"

docs/6.x/           ← Same pattern, older version
```

`mkdocs-7.x.yml` and `mkdocs-6.x.yml` inherit from `mkdocs-base.yml` and define navigation + version-specific extras. The `6.x` config sets `is_latest: true` (serves at site root `/`), while `7.x` serves under `/7.x/`.

### Reusable content (includes)

```
include/             ← English snippets shared across pages
include-ja/          ← Japanese translated snippets
include-ar/          ← Arabic translated snippets
```

Referenced from docs via `--8<-- "../include/snippet.md"`. The snippet base path is `docs/` (configured in `mkdocs-base.yml` under `pymdownx.snippets`), so paths in snippet directives are relative to the `docs/` directory.

### Images

`images/` at repo root is the single source for all screenshots/diagrams. Version directories (`docs/6.x/images/`, `docs/7.x/images/`) are either symlinks or get images copied in at build time.

### Reference files

- `.doc-agent/glossary.md` — official terminology with approved/forbidden synonyms
- `.doc-agent/style-guide.md` — writing conventions (American English, no contractions, present tense, active voice, second person)

## Creating a New Page

1. Write the page in `docs/latest/<section>/new-page.md`
2. Create wrapper in `docs/7.x/<section>/new-page.md`:
   ```
   --8<-- "latest/<section>/new-page.md"
   ```
3. Create wrapper in `docs/6.x/<section>/new-page.md` (same pattern)
4. Add to navigation in **both** `mkdocs-7.x.yml` and `mkdocs-6.x.yml`
5. Use lowercase filenames with hyphens: `api-discovery-setup.md`
6. Place in an appropriate existing section folder

## Formatting Rules

### Markdown extensions (Material for MkDocs)

- **Admonitions**: `!!! info "Title"`, `!!! warning "Title"`, `!!! tip ""`
- **Tabs**: `=== "Tab name"`
- **Collapsible sections**: `??? "Title"` (collapsed), `???+ "Title"` (expanded)
- **Code blocks**: triple backticks with language identifier
- **Snippets/includes**: `--8<-- "path/to/file.md"`

### Cross-references

- Sibling: `[Link text](sibling.md)`
- Other section: `[Link text](../section/page.md)`
- With anchor: `[Link text](../section/page.md#section-anchor)`
- Never use absolute paths or full URLs to docs.wallarm.com

### Images

- Place in root `images/` directory, organized by section (e.g., `images/about-wallarm-waf/api-discovery-2.0/`)
- Reference: `![Description](../images/<section>/filename.png)`
- Non-zoomable: `![!Description](../images/<section>/filename.png)`
- Missing screenshots: `<!-- TODO: add screenshot -->`
- Do not create diagrams/schemes — Wallarm uses Figma. Leave TODO placeholders.

## Writing Style

- **American English**, no contractions ("do not" not "don't")
- **Present tense, active voice, second person**: "You configure..." not "Configuration is performed..."
- **Imperative for instructions**: "Open the file" not "You should open the file"
- **No marketing language** — state facts
- **Consistent terminology** — check `.doc-agent/glossary.md`. Key rules:
  - "NGINX Node" / "Native Node" (not "Nginx Node" or "native Node")
  - "Wallarm Console" (not "Wallarm portal" or lowercase "console")
  - "security issue" or "vulnerability" (not "vuln")
  - "denylist" / "allowlist" (not "blacklist" / "whitelist")
- **Placeholder format in code**: `<UPPERCASE_WITH_UNDERSCORES>` (e.g., `<YOUR_API_TOKEN>`)
- **Version requirements**: when a feature needs a minimum Node version, include a version table:
  ```
  | Required [NGINX Node](path) version | Required [Native Node](path) version |
  | --- | --- |
  | 6.12.0 | 0.25.0 |
  ```

## What NOT to Do

- Do NOT edit `mkdocs-base.yml`, `netlify.toml`, or files in `stylesheets/`
- Do NOT edit files in `docs/6.x/` or `docs/7.x/` directly — they are include wrappers (exception: creating new wrappers for new pages)
- Do NOT invent features not described in the source material
- Do NOT add content in languages other than English
- Do NOT remove existing content unless explicitly instructed
- Do NOT modify files outside the `docs/`, `images/`, `include/`, and `mkdocs-*.yml` scope
- Do NOT place images inside `docs/` directories — always use the root `images/` folder
- Do NOT modify installation/deployment docs unless explicitly required by the ticket
