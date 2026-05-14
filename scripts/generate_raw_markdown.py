#!/usr/bin/env python3
"""Generate publicly-accessible raw .markdown files for every documentation page.

For each page in the given mkdocs config, this script:
  1. Reads the source markdown (a wrapper under docs/<version>/, or a full page).
  2. Recursively resolves `--8<-- "path"` snippet directives (pymdownx.snippets),
     using `docs/` as the snippet base path (matches mkdocs-base.yml).
  3. Rewrites relative links and image refs to absolute URLs at the deployed site,
     so the raw markdown is self-contained and clickable.
  4. Writes the result to <site_dir>/<page-path-without-.md>.markdown.

Usage:
    python3 scripts/generate_raw_markdown.py mkdocs-6.x.yml
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

import yaml


REPO_ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://docs.wallarm.com"

SNIPPET_RE = re.compile(r'^(?P<indent>[ \t]*)--8<--\s*"(?P<path>[^"]+)"\s*$', re.MULTILINE)
HTML_COMMENT_RE = re.compile(r'<!--.*?-->', re.DOTALL)
# Greedy-by-design code-fence match: same indent on opener and closer, same
# fence marker (``` or ~~~). Non-greedy body so successive blocks don't merge.
CODE_FENCE_RE = re.compile(
    r'^(?P<indent>[ \t]*)(?P<fence>```|~~~)[^\n]*\n.*?^(?P=indent)(?P=fence)[ \t]*$',
    re.DOTALL | re.MULTILINE,
)
INLINE_LINK_RE = re.compile(r'(?P<bang>!?)\[(?P<text>[^\]]*)\]\((?P<target>[^)\s]+)(?P<title>\s+"[^"]*")?\)')
REF_DEF_RE = re.compile(r'^(?P<label>\[[^\]]+\]):\s*(?P<target>\S+)(?P<title>\s+"[^"]*")?\s*$', re.MULTILINE)
FRONTMATTER_RE = re.compile(r'\A---\n.*?\n---\n', re.DOTALL)

# For inline_ref_defs:
REF_DEF_FULL_RE = re.compile(
    r'^(?P<indent>[ \t]*)\[(?P<name>[^\]\n]+)\]:\s*(?P<url>\S+)(?:\s+"(?P<title>[^"]*)")?\s*$',
    re.MULTILINE,
)
FULL_REF_USE_RE = re.compile(r'(?P<bang>!?)\[(?P<text>[^\]\n]*)\]\[(?P<name>[^\]\n]+)\]')
# Shortcut form `[name]` — must not be followed by `[`, `(`, or `:` which would
# indicate a different markdown construct (collapsed ref, inline link, def).
SHORTCUT_REF_USE_RE = re.compile(r'(?<!\!)\[(?P<name>[^\]\n]+)\](?![\[\(:])')

# Pymdownx tabbed marker (use the standard `===` form; we don't customize the
# extension to use other delimiters).
TAB_MARKER_RE = re.compile(r'^(?P<indent>[ \t]*)===\s+"(?P<title>[^"]+)"\s*$')


class _SafeLoader(yaml.SafeLoader):
    """YAML loader that tolerates mkdocs' python/object tags by ignoring them."""


def _ignore_unknown(loader, tag_suffix, node):
    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node)
    return loader.construct_mapping(node)


_SafeLoader.add_multi_constructor("tag:yaml.org,2002:python/", _ignore_unknown)
_SafeLoader.add_multi_constructor("!!python/", _ignore_unknown)


def load_config(config_path: Path) -> dict:
    with config_path.open() as f:
        config = yaml.load(f, Loader=_SafeLoader)
    inherit = config.get("INHERIT")
    if inherit:
        base_path = (config_path.parent / inherit).resolve()
        with base_path.open() as f:
            base = yaml.load(f, Loader=_SafeLoader)
        merged = {**base, **config}
        merged["nav"] = config.get("nav", base.get("nav", []))
        return merged
    return config


def walk_nav(nav, out: list[str]) -> None:
    if not nav:
        return
    for entry in nav:
        if isinstance(entry, dict):
            for value in entry.values():
                if isinstance(value, str) and value.endswith(".md"):
                    out.append(value)
                elif isinstance(value, list):
                    walk_nav(value, out)
        elif isinstance(entry, str) and entry.endswith(".md"):
            out.append(entry)


def resolve_snippets(content: str, snippet_base: Path, seen: set[Path] | None = None) -> str:
    if seen is None:
        seen = set()

    def replace(match: re.Match) -> str:
        indent = match.group("indent")
        snip_path = match.group("path")
        full = (snippet_base / snip_path).resolve()
        if full in seen:
            return f"{indent}<!-- snippet cycle: {snip_path} -->"
        if not full.is_file():
            return f"{indent}<!-- snippet not found: {snip_path} -->"
        seen.add(full)
        body = full.read_text(encoding="utf-8")
        body = resolve_snippets(body, snippet_base, seen)
        seen.discard(full)
        if not indent:
            return body
        return "\n".join((indent + line) if line else line for line in body.splitlines())

    return SNIPPET_RE.sub(replace, content)


_DOC_EXT = ".md"
_IMG_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".pdf"}


def _split_anchor(target: str) -> tuple[str, str]:
    if "#" in target:
        path, anchor = target.split("#", 1)
        return path, "#" + anchor
    return target, ""


def _normalize_url_path(parts_in: list[str]) -> list[str]:
    """Apply `.`/`..` segments to a URL-style path component list."""
    out: list[str] = []
    for part in parts_in:
        if part == "" or part == ".":
            continue
        if part == "..":
            if out:
                out.pop()
            continue
        out.append(part)
    return out


def to_absolute_url(
    target: str,
    page_dir: Path,
    docs_dir: Path,
    url_prefix: str,
    page_url_dir: str,
) -> str:
    """Convert a relative .md/image/URL link to an absolute URL pointing at the
    Wallarm docs site.

    Internal doc links resolve to the `.md` companion file (Stripe-style),
    preserving any anchor fragment. Image and other-asset links resolve to
    their deployed asset path. External URLs (`http(s)://example.com/`,
    `mailto:`, `tel:`, etc.) and bare anchors (`#section`) are returned
    unchanged — we only ever rewrite paths that point inside the docs tree.

    `page_url_dir` is the deployed-URL "directory" the page lives in
    (e.g. "/installation/nginx/all-in-one/"); used for directory-style
    relative URLs.
    """
    if not target or target[0] in "#?":
        return target
    if target.startswith(("http://", "https://", "//", "mailto:", "tel:", "data:")):
        return target

    path, anchor = _split_anchor(target)
    if not path:
        return target  # bare anchor

    # Absolute-path link starting with "/" — a site-rooted URL. If it's
    # directory-style (`/foo/bar/`), redirect to the .md companion; if it
    # already names a file (`.png`, `.svg`, …), pass through.
    if path.startswith("/"):
        if path.endswith("/"):
            return f"{SITE_URL}{path.rstrip('/')}.md{anchor}"
        if not Path(path).suffix:
            return f"{SITE_URL}{path}.md{anchor}"
        return f"{SITE_URL}{path}{anchor}"

    # .md link or image link — resolve as a file under docs_dir.
    if path.endswith(_DOC_EXT) or Path(path).suffix.lower() in _IMG_EXTS:
        candidate = (page_dir / path).resolve()
        try:
            rel = candidate.relative_to(docs_dir.resolve())
        except ValueError:
            return target  # leave alone if outside docs_dir
        rel_posix = rel.as_posix()
        # For .md targets, point at the .md companion (Stripe convention);
        # the anchor — if any — stays attached and is resolved by the
        # reader (humans via section heading match; LLMs by text search).
        return f"{url_prefix}/{rel_posix}{anchor}"

    # Directory-style relative URL (e.g. "../../foo/bar/"). Resolve against
    # the page's deployed URL using URL-segment arithmetic, not the source
    # file path (mkdocs source uses URL-relative links for directory-style
    # targets). All such targets in our docs are doc pages, so they map to
    # the .md companion.
    if path.endswith("/") or "." not in Path(path).name:
        base_segments = [s for s in page_url_dir.strip("/").split("/") if s]
        target_segments = path.split("/")
        merged = _normalize_url_path(base_segments + target_segments)
        joined = "/".join(merged)
        return f"{SITE_URL}/{joined}.md{anchor}"

    return target


def rewrite_links(
    content: str,
    page_dir: Path,
    docs_dir: Path,
    url_prefix: str,
    page_url_dir: str,
) -> str:
    def inline(match: re.Match) -> str:
        bang = match.group("bang") or ""
        text = match.group("text")
        target = match.group("target")
        title = match.group("title") or ""
        new_target = to_absolute_url(target, page_dir, docs_dir, url_prefix, page_url_dir)
        return f"{bang}[{text}]({new_target}{title})"

    def refdef(match: re.Match) -> str:
        label = match.group("label")
        target = match.group("target")
        title = match.group("title") or ""
        new_target = to_absolute_url(target, page_dir, docs_dir, url_prefix, page_url_dir)
        return f"{label}: {new_target}{title}"

    content = INLINE_LINK_RE.sub(inline, content)
    content = REF_DEF_RE.sub(refdef, content)
    return content


def _apply_outside_code_fences(content: str, transform) -> str:
    """Run `transform(text)` only on portions of `content` that lie OUTSIDE
    fenced code blocks (``` / ~~~). Lets us strip / rewrite prose while
    leaving HTML examples, diff blocks, and code samples verbatim.
    """
    fences: list[str] = []

    def stash(m: re.Match) -> str:
        fences.append(m.group(0))
        return f"\x00FENCE{len(fences) - 1}\x00"

    shielded = CODE_FENCE_RE.sub(stash, content)
    shielded = transform(shielded)

    def restore(m: re.Match) -> str:
        return fences[int(m.group(1))]

    return re.sub(r"\x00FENCE(\d+)\x00", restore, shielded)


def strip_html_comments(content: str) -> str:
    """Remove `<!-- ... -->` blocks (single- or multi-line) from prose, while
    preserving them inside fenced code blocks.

    Why: authors use HTML comments to TODO-out unfinished sections (entire
    paragraphs incl. snippet directives wrapped in a comment). zensical's HTML
    suppresses them visually; our raw .md must match. But ```html / ```xml /
    server-config code samples can contain legitimate `<!--` syntax — that's
    real content, not author scaffolding.
    """
    return _apply_outside_code_fences(content, lambda c: HTML_COMMENT_RE.sub("", c))


# Matches `href="..."` and `src="..."` attributes on any HTML tag.
# All hrefs in source are double-quoted (verified by grep on the corpus);
# we don't bother matching single-quoted or unquoted variants.
HTML_ATTR_RE = re.compile(r'(?P<attr>\b(?:href|src))="(?P<value>[^"]*)"')


def rewrite_html_attrs(
    content: str,
    page_dir: Path,
    docs_dir: Path,
    url_prefix: str,
    page_url_dir: str,
) -> str:
    """Rewrite href/src on inline HTML tags (e.g. `<a class="card" href="...">`,
    `<img src="...">`) the same way `rewrite_links` rewrites markdown links —
    relative or absolute-path docs paths become absolute Wallarm URLs;
    external URLs stay untouched (`to_absolute_url` short-circuits them).

    Why: source markdown carries hand-rolled HTML (homepage navigation cards,
    inline `<img>` badges, custom `<a class="do-card">` connectors). Without
    rewriting, a reader opening the raw .md sees broken relative paths.
    """
    def replace(m: re.Match) -> str:
        attr = m.group("attr")
        value = m.group("value")
        new_value = to_absolute_url(value, page_dir, docs_dir, url_prefix, page_url_dir)
        return f'{attr}="{new_value}"'

    return _apply_outside_code_fences(content, lambda c: HTML_ATTR_RE.sub(replace, c))


def inline_ref_defs(content: str) -> str:
    """Replace `[text][name]` / `[name]` shortcuts with inline `[text](URL)` and
    delete the `[name]: URL` definition block.

    Why: reference-style links are valid Markdown, but the 40-line ref block at
    the top of wrapper pages adds token noise for LLM consumers, and a reader
    opening the raw .md must scroll past it to reach content. Inlining makes
    the file self-readable top-to-bottom with no information loss.
    """
    defs: dict[str, tuple[str, str | None]] = {}
    for m in REF_DEF_FULL_RE.finditer(content):
        defs[m.group("name").lower()] = (m.group("url"), m.group("title"))

    if not defs:
        return content

    # Remove the definition lines.
    content = REF_DEF_FULL_RE.sub("", content)

    def _title_suffix(title: str | None) -> str:
        return f' "{title}"' if title else ""

    def replace_full(m: re.Match) -> str:
        name = m.group("name").lower()
        if name not in defs:
            return m.group(0)
        url, title = defs[name]
        return f'{m.group("bang") or ""}[{m.group("text")}]({url}{_title_suffix(title)})'

    content = FULL_REF_USE_RE.sub(replace_full, content)

    def replace_shortcut(m: re.Match) -> str:
        original = m.group("name")
        name = original.lower()
        if name not in defs:
            return m.group(0)
        url, title = defs[name]
        return f"[{original}]({url}{_title_suffix(title)})"

    content = SHORTCUT_REF_USE_RE.sub(replace_shortcut, content)

    # Collapse the run of blank lines left where the ref-def block lived.
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content


def flatten_tabs(content: str) -> str:
    """Convert pymdownx `=== "Tab"` blocks into `**Tab:**` bold headers with
    de-indented bodies.

    Why: tabbed content carries semantically distinct alternatives (per-OS
    commands, per-region IPs). LLMs parse the `===` syntax inconsistently;
    flattening to bold headers preserves the same information in
    universally-understood Markdown with no loss.

    Tabs can nest (an outer tab body containing more `=== "..."` markers).
    A single pass dedents nested markers but doesn't re-process them, so we
    iterate until no markers remain (bounded loop guards against pathological
    input).
    """

    def _one_pass(text: str) -> str:
        lines = text.split("\n")
        out: list[str] = []
        tab_indent: str | None = None
        content_indent: str | None = None

        for line in lines:
            if tab_indent is not None:
                if line.strip() == "":
                    out.append("")
                    continue
                if content_indent and line.startswith(content_indent):
                    out.append(tab_indent + line[len(content_indent):])
                    continue
                tab_indent = None
                content_indent = None

            m = TAB_MARKER_RE.match(line)
            if m:
                indent = m.group("indent")
                title = m.group("title")
                if out and out[-1] != "":
                    out.append("")
                out.append(f"{indent}**{title}:**")
                out.append("")
                tab_indent = indent
                content_indent = indent + "    "
                continue

            out.append(line)

        return "\n".join(out)

    for _ in range(10):  # depth cap; real-world nesting rarely exceeds 2
        new = _one_pass(content)
        if new == content:
            break
        content = new
    return content


def page_to_output_path(nav_path: str, site_dir: Path) -> Path:
    # nav_path is always relative (e.g. "installation/nginx/all-in-one.md").
    # The directory tree is preserved as-is; the .md companion sits next to
    # the rendered directory-style URL:
    #   page URL  /installation/nginx/all-in-one/
    #   raw md    /installation/nginx/all-in-one.md
    assert nav_path.endswith(".md")
    return site_dir / nav_path


def page_to_url_dir(nav_path: str, url_prefix_path: str) -> str:
    """Return the deployed URL "directory" (with trailing slash) for a page."""
    assert nav_path.endswith(".md")
    stem = nav_path[:-3]
    if stem == "index":
        return f"{url_prefix_path}/" or "/"
    if stem.endswith("/index"):
        stem = stem[: -len("/index")]
    return f"{url_prefix_path}/{stem}/"


def derive_url_prefix(site_dir_rel: str) -> str:
    """Map site_dir → URL prefix (no trailing slash).

    site                → ""              (deployed at /)
    site/7.x            → "/7.x"          (deployed at /7.x/)
    site/5.x            → "/5.x"          (deployed at /5.x/)
    """
    parts = [p for p in site_dir_rel.split("/") if p and p != "site"]
    return "/" + "/".join(parts) if parts else ""


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: generate_raw_markdown.py <mkdocs-config.yml>", file=sys.stderr)
        return 2

    config_path = (REPO_ROOT / argv[1]).resolve() if not os.path.isabs(argv[1]) else Path(argv[1])
    config = load_config(config_path)

    docs_dir = (REPO_ROOT / config["docs_dir"]).resolve()
    site_dir = (REPO_ROOT / config["site_dir"]).resolve()
    snippet_base = (REPO_ROOT / "docs").resolve()
    url_prefix_path = derive_url_prefix(config["site_dir"])  # "" or "/7.x"
    url_prefix = SITE_URL + url_prefix_path  # no trailing slash

    if not site_dir.is_dir():
        print(f"site_dir does not exist (build first?): {site_dir}", file=sys.stderr)
        return 1

    pages: list[str] = []
    walk_nav(config.get("nav", []), pages)

    # Implicit homepage: docs_dir/index.md is rendered as `/` even if not in nav.
    if (docs_dir / "index.md").is_file() and "index.md" not in pages:
        pages.insert(0, "index.md")

    # Pick up any built pages that aren't in nav (orphans like wizard variants,
    # llms.md, beta antibot pages). zensical still renders them to HTML, so we
    # need .md companions for the <link rel="alternate"> tag to stay symmetric.
    nav_set = set(pages)
    for md_file in sorted(docs_dir.rglob("*.md")):
        rel = md_file.relative_to(docs_dir).as_posix()
        if rel not in nav_set:
            pages.append(rel)

    # Deduplicate while preserving order.
    seen_pages: set[str] = set()
    unique_pages = []
    for p in pages:
        if p not in seen_pages:
            seen_pages.add(p)
            unique_pages.append(p)

    written = 0
    missing = 0
    full_chunks: list[str] = []
    for nav_path in unique_pages:
        src = docs_dir / nav_path
        if not src.is_file():
            missing += 1
            print(f"  skip (missing source): {nav_path}", file=sys.stderr)
            continue
        content = src.read_text(encoding="utf-8")
        content = resolve_snippets(content, snippet_base)
        page_url_dir = page_to_url_dir(nav_path, url_prefix_path)
        content = rewrite_links(content, src.parent, docs_dir, url_prefix, page_url_dir)
        content = rewrite_html_attrs(content, src.parent, docs_dir, url_prefix, page_url_dir)

        # LLM-friendly transforms (applied in order):
        #   1. Strip YAML front matter — zensical layout/search directives only.
        #   2. Strip HTML comments — authors hide draft sections inside <!-- -->,
        #      and zensical's HTML doesn't render them; the raw .md must match.
        #      Runs AFTER snippet resolution so it also catches comments brought
        #      in via inlined snippets.
        #   3. Inline ref-defs — drops the noisy top-of-file `[name]: URL` block.
        #   4. Flatten `=== "Tab"` blocks into `**Tab:**` headers.
        content = FRONTMATTER_RE.sub("", content, count=1)
        content = strip_html_comments(content)
        content = inline_ref_defs(content)
        content = flatten_tabs(content)
        content = content.lstrip("\n")

        out_path = page_to_output_path(nav_path, site_dir)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(content, encoding="utf-8")
        written += 1

        # Collect for the llms-full.txt bundle (uses the same transformed body).
        full_chunks.append(f"## {SITE_URL}{page_url_dir}\n\n{content.strip()}\n")

    # llms-full.txt: concatenated full text of every page. Convention from the
    # llms.txt spec — companion to /llms.txt that lets LLMs ingest everything
    # in one fetch.
    llms_full = site_dir / "llms-full.txt"
    header = (
        "# Wallarm Documentation — Full Text\n\n"
        f"> Concatenated full text of every page in {SITE_URL}{url_prefix_path}/ "
        "for LLM consumption.\n"
        f"> See {SITE_URL}{url_prefix_path}/llms.txt for the indexed (link-only) version.\n"
    )
    llms_full.write_text(header + "\n---\n\n" + "\n---\n\n".join(full_chunks), encoding="utf-8")

    print(
        f"generate_raw_markdown: {written} .md + 1 llms-full.txt written to {site_dir}"
        + (f" ({missing} missing sources skipped)" if missing else "")
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
