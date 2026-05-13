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
INLINE_LINK_RE = re.compile(r'(?P<bang>!?)\[(?P<text>[^\]]*)\]\((?P<target>[^)\s]+)(?P<title>\s+"[^"]*")?\)')
REF_DEF_RE = re.compile(r'^(?P<label>\[[^\]]+\]):\s*(?P<target>\S+)(?P<title>\s+"[^"]*")?\s*$', re.MULTILINE)


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
    """Convert a relative .md/image/URL link to an absolute URL.

    `page_url_dir` is the deployed-URL "directory" the page lives in
    (e.g. "/installation/nginx/all-in-one/" — the trailing slash matters
    because mkdocs uses directory-style URLs).

    Unrecognized targets are returned unchanged.
    """
    if not target or target[0] in "#?":
        return target
    if target.startswith(("http://", "https://", "//", "mailto:", "tel:", "data:")):
        return target

    path, anchor = _split_anchor(target)
    if not path:
        return target  # bare anchor

    # Absolute-path link starting with "/": already a site-rooted URL.
    if path.startswith("/"):
        return f"{SITE_URL}{path}{anchor}"

    # .md link or image link → resolve as a file under docs_dir.
    if path.endswith(_DOC_EXT) or Path(path).suffix.lower() in _IMG_EXTS:
        candidate = (page_dir / path).resolve()
        try:
            rel = candidate.relative_to(docs_dir.resolve())
        except ValueError:
            return target  # leave alone if outside docs_dir
        rel_posix = rel.as_posix()
        if rel_posix.endswith(_DOC_EXT):
            url_path = rel_posix[:-3]
            if url_path == "index":
                return f"{url_prefix}/{anchor}" if anchor else f"{url_prefix}/"
            if url_path.endswith("/index"):
                url_path = url_path[: -len("/index")]
            return f"{url_prefix}/{url_path}/{anchor}"
        return f"{url_prefix}/{rel_posix}{anchor}"

    # Directory-style relative URL (e.g. "../../foo/bar/"). Resolve against
    # the page's deployed URL using URL-segment arithmetic, not the source
    # file path (mkdocs source uses URL-relative links for directory-style
    # targets).
    if path.endswith("/") or "." not in Path(path).name:
        base_segments = [s for s in page_url_dir.strip("/").split("/") if s]
        target_segments = path.split("/")
        # If link ends with "/", trailing empty segment marks the directory.
        merged = _normalize_url_path(base_segments + target_segments)
        joined = "/".join(merged)
        trailing = "/" if path.endswith("/") else ""
        return f"{SITE_URL}/{joined}{trailing}{anchor}"

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

    # Deduplicate while preserving order.
    seen_pages: set[str] = set()
    unique_pages = []
    for p in pages:
        if p not in seen_pages:
            seen_pages.add(p)
            unique_pages.append(p)

    written = 0
    missing = 0
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
        out_path = page_to_output_path(nav_path, site_dir)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(content, encoding="utf-8")
        written += 1

    print(f"generate_raw_markdown: {written} files written to {site_dir}"
          + (f" ({missing} missing sources skipped)" if missing else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
