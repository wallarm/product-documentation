# Documentation Agent Guidelines

## Repository structure

- `docs/latest/` — **source of truth**. All content lives here. Edit ONLY these files.
- `docs/6.x/`, `docs/7.x/` — version wrappers. Each file contains a single include:
  ```
  --8<-- "latest/section/page.md"
  ```
  When creating a new page, create the wrapper files too.
- `include/` — reusable English content snippets shared across pages (`--8<-- "../include/snippet.md"`)
- `include-ja/`, `include-ar/`, etc. — translated reusable content for localized docs
- `images/` — **root-level directory** for all screenshots and diagrams. Version directories (`docs/6.x/images`, etc.) are symbolic links to this root folder. Always place images here, never inside `docs/`.
- `mkdocs-7.x.yml`, `mkdocs-6.x.yml` — navigation config per version. Update when adding/removing pages.
- `mkdocs-base.yml` — base theme, plugins, extensions inherited by all version configs. Do NOT modify.
- `stylesheets/` — custom CSS and JS for the documentation site. Do NOT modify unless explicitly asked.
- `netlify.toml` — deployment config for Netlify. Do NOT modify.

## Documentation platform

- Static site generator: **zensical**
- Source format: **Markdown** with YAML front matter
- Deployment: **Netlify** — every PR triggers a preview build automatically
- Site: https://docs.wallarm.com
- Languages: English (primary), Japanese and others are auto-translated

## Creating a new page

1. Write the page in `docs/latest/<section>/new-page.md`
2. Create wrapper in `docs/7.x/<section>/new-page.md`:
   ```
   --8<-- "latest/<section>/new-page.md"
   ```
3. Create wrapper in `docs/6.x/<section>/new-page.md` (same pattern)
4. Add to navigation in **both** `mkdocs-7.x.yml` and `mkdocs-6.x.yml`
5. Use lowercase filenames with hyphens: `api-discovery-setup.md`, not `ApiDiscoverySetup.md`
6. Place the file in the appropriate existing section folder. Create a new folder only if no existing one fits.

## Formatting rules

### Markdown syntax

- **Admonitions**: `!!! info "Title"`, `!!! warning "Title"`, `!!! tip ""`
- **Tabs**: `=== "Tab name"`
- **Collapsible sections**: `??? "Title"` (collapsed), `???+ "Title"` (expanded)
- **Code blocks**: triple backticks with language (```bash, ```yaml, ```sql)
- **Snippets/includes**: `--8<-- "path/to/file.md"` — for content reused across multiple pages, put it in `include/` and reference from there

### Cross-references

- Sibling file: `[Link text](sibling.md)`
- Other section: `[Link text](../section/page.md)`
- With anchor: `[Link text](../section/page.md#section-anchor)`
- Never use absolute paths or full URLs to docs.wallarm.com

### Images

- **Always place in the root `images/` directory**, organized by section (e.g., `images/about-wallarm-waf/api-discovery-2.0/`)
- Reference from docs: `![Description](../images/<section>/filename.png)`
- Non-zoomable: `![!Description](../images/<section>/filename.png)`
- Subscription badges: `<a href="..."><img src="../../images/api-security-tag.svg" style="border: none;"></a>`
- When screenshots are not yet available, add: `<!-- TODO: add screenshot -->`
- For diagrams/schemes: Wallarm uses Figma for scheme design. Do not create new schemes, only reference existing images or leave TODO placeholders.

### Tables

Standard Markdown tables. Always include the header separator:
```
| Column 1 | Column 2 |
| --- | --- |
| Data | Data |
```

## Writing style

- **User-focused**: document what the user can DO, not internal implementation
- **Concise**: short paragraphs, bullet points where appropriate
- **Present tense, active voice**: "Wallarm detects..." not "Detection is performed by..."
- **No marketing language**: state facts, not sales pitches
- **Consistent terminology**: use the glossary (see `.doc-agent/glossary.md` if available)
- **English only**: do not write content in other languages; translations are handled separately via GPT
- **Version requirements**: always specify Node version when a feature requires a minimum version:
  ```
  | Required [NGINX Node](path) version | Required [Native Node](path) version |
  | --- | --- |
  | 6.12.0 | 0.25.0 |
  ```

## What NOT to do

- Do NOT edit `mkdocs-base.yml`, `netlify.toml`, or files in `stylesheets/`
- Do NOT edit files in `docs/6.x/` or `docs/7.x/` directly — they are include wrappers (exception: creating new wrappers for new pages)
- Do NOT invent features not described in the source material
- Do NOT add content in languages other than English
- Do NOT remove existing content unless explicitly instructed
- Do NOT modify files outside the `docs/`, `images/`, `include/`, and `mkdocs-*.yml` scope
- Do NOT place images inside `docs/` directories — always use the root `images/` folder
- Do NOT modify installation/deployment docs unless explicitly required by the ticket
