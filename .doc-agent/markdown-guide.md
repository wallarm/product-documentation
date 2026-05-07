# Markdown style guide

This guide covers the Markdown syntax used in Wallarm product documentation, built with zensical.

## Headers

```
# H1 — page title (Title Case)
## H2 — section (sentence case)
### H3 — subsection (sentence case)
```

H1 is capitalized (Title Case). H2 and lower use sentence case (only first word capitalized).

## Emphasis

```
**bold text**
*italicized text*
```

* **Bold** — UI element names the user clicks ("Press **Save**"), important text
* **`Code`** — anything user enters, code blocks, file/method/parameter/value names, CLI commands
* **→ symbol** — sequence of UI actions: "Go to Wallarm Console → **Triggers**"
* Avoid quotation marks and brackets for highlighting

## Lists

Use `*` for unordered lists (not `-`):

```
* First item
* Second item
* Third item
  * Nested item
```

Use `1.` for all ordered list items (zensical auto-numbers):

```
1. First item
1. Second item
1. Third item
```

For sub-steps within numbered lists, indent with 4 spaces. Code blocks, images, and admonitions inside steps also need 4-space indentation.

## Code blocks

Triple backticks with language identifier:

````
```bash
my command
```
````

Code highlighting: add the language name after opening backticks. Add `linenums="1"` for line numbers:

````
```bash linenums="1"
my code
```
````

Supported lexers: `bash`, `yaml`, `json`, `python`, `javascript`, `go`, etc. See [Pygments lexers](https://pygments.org/docs/lexers/).

### Code tabs

````
=== "Tab 1"
    ```bash
    code for tab 1
    ```
=== "Tab 2"
    ```python
    code for tab 2
    ```
````

### Placeholders in code

* Format: `<UPPERCASE_WITH_UNDERSCORES>` (e.g., `<YOUR_API_TOKEN>`, `<YOUR_SECRET_KEY>`)
* Use realistic but fake example values:
  * Domains: `api.example.com`, `example.com`
  * IPs: `1.1.1.1`, `2.2.2.2`
  * Names: John Doe, John Smith
  * Emails: `johndoe@example.com`

## Links

```
[inline link](https://www.example.com)
[email link](mailto:email@example.com)
[relative link](../section/page.md)
[link with anchor](../section/page.md#section-anchor)
```

* Use informative link text: `follow the [Wallarm documentation](url)` not `[click here](url)`
* Exclude articles from link text
* Never use absolute paths or full URLs to docs.wallarm.com
* Always include `http://` or `https://` in external URLs

### Reference-style links

Use reference-style links **only** for relative links in included content (`include/`) where nesting depth varies between including files:

```markdown
<!-- include/included-example.md -->
Some text with [link][example-link].
```

```markdown
<!-- docs/latest/file1.md -->
[example-link]: linked-file.md

--8<-- "../include/included-example.md"
```

```markdown
<!-- docs/latest/folder/file2.md -->
[example-link]: ../linked-file.md

--8<-- "../include/included-example.md"
```

In all other cases, use inline links.

## Images

```
![Zoomable image](../images/<section>/filename.png)
![!Non-zoomable image](../images/<section>/filename.png)
```

* All images are **zoomable by default** (GLightbox). The `!` prefix in alt text (`![!...]`) adds the `non-zoomable` class, excluding the image from the lightbox.
* Place images in root `images/` directory, organized by section (e.g., `images/about-wallarm-waf/api-discovery-2.0/`)
* Use `.png` extension
* Missing screenshots: `<!-- TODO: add screenshot -->`
* Do not create diagrams/schemes — they are maintained in [Figma](https://www.figma.com/file/77TOtRey6EfvZsPQTClWMn/Traffic-flows). Leave TODO placeholders.

Reference-style images follow the same rules as reference-style links — use only for included content with varying nesting.

## Tables

```
| Parameter | Description |
|-----------|-------------|
| **Name** | `value` |
| Paragraph | <ul><li>item 1</li><li>item 2</li></ul><br>Text after list. |
```

* Always include column headers
* Prefer tables for: configuration parameters, version comparisons, feature mappings
* Configuration tables: `| Parameter | Description |` or `| Parameter | Description | Default |`
* Comparison tables: `| | Option A | Option B |`
* For lists or line breaks inside table cells, use HTML: `<ul><li>`, `<br>`
* Do not overload tables with text; move long descriptions to sub-bullets or paragraphs

## Admonitions

```
!!! info "Title"
    Expanded admonition with a title.

!!! info ""
    Expanded admonition without a title.

!!! warning "Title"
    Critical information.

??? info "Collapsed title"
    Collapsed admonition (click to expand).

???+ info "Expanded by default"
    Collapsible admonition, expanded by default.
```

Use only two admonition types: `info` for additional information and `warning` for critical information.

## Included content (snippets)

```
Some text content.

--8<-- "../include/included-example.md"

More text content.
```

Snippet base path is `docs/` (configured in `mkdocs-base.yml`). Paths in snippet directives are relative to `docs/`.

When including as part of a list (no blank line before):

```
* First item
--8<-- "../include/file-with-other-list-items.md"

* Introduced items with blank line:
  --8<-- "../include/introduced-items.md"
```

## Version requirements

When a feature needs a minimum Node version, include a version table:

```markdown
| Required [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) version | Required [Native Node](../installation/nginx-native-node-internals.md#native-node) version |
| --- | --- |
| 6.12.0 | 0.25.0 |
```

## Line breaks

Use one empty line to separate elements. Add empty lines:

* After the page title
* Before and after headers
* Before and after code blocks and code tabs
* Before and after images
* Before and after tables
* Before and after lists
* Before and after admonitions
* Before and after included content (when included as a separate paragraph)
* Inside admonitions to divide paragraphs

Do NOT add empty lines:

* Inside one paragraph
* Before included content that continues a list (see "Included content" section above)

## HTML

Avoid HTML tags in Markdown except for:

* Lists and line breaks inside table cells (`<ul><li>`, `<br>`)
* YouTube video embedding:

```html
<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/VIDEO_ID"
    frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope;
    picture-in-picture" allowfullscreen></iframe>
</div>
```
