#!/usr/bin/env python3
"""Generate a per-page Open Graph / social-share image for every documentation page.

For each page in the given mkdocs config, this script:
  1. Reads the source markdown (a wrapper under docs/<version>/, or a full page)
     and resolves `--8<-- "path"` snippet directives (same as the raw-markdown
     companion generator), so wrapper pages get their real title/first paragraph.
  2. Derives a title (page H1 > nav label > prettified filename) and a short
     description (frontmatter `description:` > first prose paragraph, trimmed to
     ~1-2 lines at a sentence/word boundary).
  3. Renders a 1200x630 PNG onto the shared banner template
     (scripts/og-assets/og-template.png — the approved og-docs-banner.png with
     the text area cleared, so the logo, "DOCUMENTATION" eyebrow, dashed
     perforation, and background are pixel-identical on every card). The title
     is set in Source Serif 4 Medium, the description in Inter Medium.
  4. Writes the PNG to <site_dir>/images/og/<page-slug>.png, mirroring the
     page's deployed URL so stylesheets/main.html can point og:image/twitter:image
     at it (see the {# per-page OG image #} block there).

The homepage (page.url == "") keeps the static og-docs-banner.png as its card;
this script skips it.

Usage:
    python3 scripts/generate_og_images.py mkdocs-6.x.yml
"""

from __future__ import annotations

import concurrent.futures
import functools
import html
import os
import re
import sys
from pathlib import Path

# Reuse the config loader, snippet resolver, and shared regexes from the
# raw-markdown generator so both tools treat wrappers/snippets identically.
import generate_raw_markdown as grm

from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = Path(__file__).resolve().parent.parent
ASSETS = REPO_ROOT / "scripts" / "og-assets"
TEMPLATE = ASSETS / "og-template.png"
SERIF_FONT = ASSETS / "fonts" / "SourceSerif4.ttf"
INTER_FONT = ASSETS / "fonts" / "Inter.ttf"

# Layout (matched to the approved og-docs-banner.png by measurement).
INK = (0x11, 0x11, 0x12)        # title
GREY = (0x3A, 0x3A, 0x3C)       # description
LEFT = 140                      # content left edge (aligns with logo + eyebrow)
MAX_W = 1000                    # wrap width for title and description
CENTER_Y = 330                  # vertical centre of the title+description block

TITLE_SIZE_MAX = 84             # Source Serif 4 Medium, shrinks to fit <=2 lines
TITLE_SIZE_MIN = 52
DESC_SIZE = 33                  # Inter Medium
DESC_MAX_CHARS = 155            # trim first paragraph to ~1-2 lines

# Version badge (non-root versions only): thin grey label in the top-right,
# opposite the logo, e.g. "Node Version 7.x · 0.26.x+ (preview)". Covers both
# node trains (NGINX + Native) and the version status, not just NGINX.
BADGE_COLOR = (0x54, 0x53, 0x4F)
BADGE_SIZE = 23
BADGE_RIGHT = 1150             # right edge (aligns with content right margin)
BADGE_Y = 64                  # baseline-aligned with the logo

# Home-card content — matches the static og-docs-banner.png. The latest/root
# version keeps that plain banner; every non-root version renders this same
# content plus its version badge (deprecated swaps in a "no longer supported"
# line). Home pages are HTML-heavy (hero SVG, cards) with no clean prose to
# extract, so the text is fixed here rather than pulled from index.md.
HOME_TITLE = "Wallarm Documentation"
HOME_DESC = ("Product docs for the Wallarm AI Control Platform — discover, "
             "observe, enforce, and govern AI workloads and APIs.")

H1_RE = re.compile(r'^#[ \t]+(.+?)[ \t]*#*[ \t]*$', re.MULTILINE)
ATTR_LIST_RE = re.compile(r'\s*\{[^}]*\}\s*$')          # trailing `{ #id .class }`
FM_DESC_RE = re.compile(r'^description:[ \t]*(.+?)[ \t]*$', re.MULTILINE)
INLINE_IMG_RE = re.compile(r'!\[[^\]]*\]\([^)]*\)')
INLINE_LINK_RE = re.compile(r'\[([^\]]+)\]\([^)]*\)')
REF_LINK_RE = re.compile(r'\[([^\]]+)\]\[[^\]]*\]')
HTML_TAG_RE = re.compile(r'<[^>]+>')
EMPH_RE = re.compile(r'[*_`]{1,3}')
WS_RE = re.compile(r'\s+')

# A source line that cannot be the start of a plain prose paragraph.
_BLOCK_START = ('#', '>', '|', '-', '*', '+', '!', '<', '[', '=', '~', '`',
                '!!!', '???', '===', '--8<--')


def load_titled_nav(nav, mapping: dict[str, str]) -> None:
    """Populate {nav_path: nav_label} for dict-form nav entries."""
    if not nav:
        return
    for entry in nav:
        if isinstance(entry, dict):
            for label, value in entry.items():
                if isinstance(value, str) and value.endswith(".md"):
                    mapping.setdefault(value, label)
                elif isinstance(value, list):
                    load_titled_nav(value, mapping)
        elif isinstance(entry, list):
            load_titled_nav(entry, mapping)


def clean_inline(text: str) -> str:
    text = INLINE_IMG_RE.sub("", text)
    text = INLINE_LINK_RE.sub(r"\1", text)
    text = REF_LINK_RE.sub(r"\1", text)
    text = HTML_TAG_RE.sub("", text)
    text = EMPH_RE.sub("", text)
    text = text.replace("\\", "")
    return WS_RE.sub(" ", text).strip()


def extract_title(content: str, nav_label: str | None, nav_path: str) -> str:
    m = H1_RE.search(content)
    if m:
        title = ATTR_LIST_RE.sub("", m.group(1))
        title = clean_inline(title)
        if title:
            return title
    if nav_label:
        return nav_label.strip()
    # Prettify the filename: "deployment-options.md" -> "Deployment options".
    stem = Path(nav_path).stem
    if stem in ("index", "README"):
        stem = Path(nav_path).parent.name or stem
    pretty = stem.replace("-", " ").replace("_", " ").strip()
    return pretty[:1].upper() + pretty[1:] if pretty else "Wallarm Documentation"


def extract_description(raw: str, resolved: str, fallback: str) -> str:
    # 1) Explicit frontmatter description wins (editor override).
    fm = grm.FRONTMATTER_RE.match(raw)
    if fm:
        dm = FM_DESC_RE.search(fm.group(0))
        if dm:
            return _trim(clean_inline(dm.group(1).strip().strip('"\'')))

    # 2) First prose paragraph of the resolved body.
    body = grm.FRONTMATTER_RE.sub("", resolved, count=1)
    body = grm.strip_html_comments(body)
    # Drop fenced code blocks so we never pull code as the description.
    body = grm.CODE_FENCE_RE.sub("", body)

    para: list[str] = []
    for line in body.splitlines():
        # Column-0 prose only — skips indented admonition/list bodies.
        if line[:1].isspace():
            if para:
                break
            continue
        stripped = line.strip()
        if not stripped:
            if para:
                break
            continue
        if stripped.startswith(_BLOCK_START):
            if para:
                break
            continue
        # A lone reference definition like `[label]: url`.
        if re.match(r'^\[[^\]]+\]:\s', stripped):
            if para:
                break
            continue
        para.append(stripped)

    text = clean_inline(" ".join(para))
    return _trim(text) if text else fallback


def _trim(text: str) -> str:
    if len(text) <= DESC_MAX_CHARS:
        return text
    window = text[: DESC_MAX_CHARS + 15]
    # Prefer a sentence boundary in a sensible range.
    best = -1
    for punct in (". ", "! ", "? "):
        idx = window.rfind(punct)
        if 90 <= idx <= DESC_MAX_CHARS + 10 and idx > best:
            best = idx + 1
    if best != -1:
        return window[:best].strip()
    cut = text[:DESC_MAX_CHARS].rsplit(" ", 1)[0].rstrip(",;:—- ")
    return cut + "…"


# Both fonts are variable with an Optical Size axis. Large display text must use
# the DISPLAY optical cut (high stroke contrast, tighter spacing) to match the
# wallarm.com share cards — not the text cut you get from a plain named instance.
# Axis order differs per font: Source Serif 4 = [Weight, Optical Size];
# Inter = [Optical size, Weight].
TITLE_OPSZ = 60                 # Source Serif 4 display cut (axis max)
TITLE_WGHT = 500                # Medium
DESC_OPSZ = 32                  # Inter display cut (axis max)
DESC_WGHT = 500                 # Medium
BADGE_WGHT = 600                # SemiBold
BADGE_OPSZ = 14                 # Inter text cut — small tracked label reads better


@functools.lru_cache(maxsize=128)
def _serif(size: int, wght: int = TITLE_WGHT, opsz: int = TITLE_OPSZ) -> ImageFont.FreeTypeFont:
    # Cached: re-reading the 1.2 MB variable font per page (and per title-shrink
    # step) dominated runtime. The returned instance is reused read-only.
    f = ImageFont.truetype(str(SERIF_FONT), size)
    try:
        f.set_variation_by_axes([wght, opsz])
    except Exception:
        pass
    return f


@functools.lru_cache(maxsize=128)
def _inter(size: int, wght: int = DESC_WGHT, opsz: int = DESC_OPSZ) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(INTER_FONT), size)
    try:
        f.set_variation_by_axes([opsz, wght])
    except Exception:
        pass
    return f


@functools.lru_cache(maxsize=1)
def _base_template() -> Image.Image:
    return Image.open(TEMPLATE).convert("RGB")


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, max_w: int) -> list[str]:
    lines: list[str] = []
    cur = ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def _line_h(font) -> int:
    ascent, descent = font.getmetrics()
    return ascent + descent


def _draw_badge(draw: ImageDraw.ImageDraw, label: str) -> None:
    f = _inter(BADGE_SIZE, BADGE_WGHT, BADGE_OPSZ)
    x = BADGE_RIGHT - draw.textlength(label, font=f)
    draw.text((x, BADGE_Y), label, font=f, fill=BADGE_COLOR)


def render_card(title: str, desc: str, out_path: Path, version_label: str | None = None) -> None:
    im = _base_template().copy()
    draw = ImageDraw.Draw(im)
    if version_label:
        _draw_badge(draw, version_label)

    # Title: shrink from the max size until it fits in <=2 lines.
    size = TITLE_SIZE_MAX
    while size > TITLE_SIZE_MIN:
        tf = _serif(size)
        tlines = _wrap(draw, title, tf, MAX_W)
        if len(tlines) <= 2:
            break
        size -= 4
    tf = _serif(size)
    tlines = _wrap(draw, title, tf, MAX_W)
    if len(tlines) > 2:                     # still too long — ellipsize line 2
        tlines = tlines[:2]
        while tlines[1] and draw.textlength(tlines[1] + "…", font=tf) > MAX_W:
            tlines[1] = tlines[1].rsplit(" ", 1)[0]
        tlines[1] += "…"

    df = _inter(DESC_SIZE)
    dlines = _wrap(draw, desc, df, MAX_W) if desc else []
    if len(dlines) > 2:                     # cap at 2 lines, ellipsize the 2nd
        dlines = dlines[:2]
        while dlines[1] and draw.textlength(dlines[1] + "…", font=df) > MAX_W:
            dlines[1] = dlines[1].rsplit(" ", 1)[0]
        dlines[1] = dlines[1].rstrip(",;:—- ") + "…"

    title_lh = int(_line_h(tf) * 0.98)
    desc_lh = int(_line_h(df) * 1.12)
    gap = 30
    block = len(tlines) * title_lh + (gap if dlines else 0) + len(dlines) * desc_lh
    y = CENTER_Y - block // 2

    for ln in tlines:
        draw.text((LEFT, y), ln, font=tf, fill=INK)
        y += title_lh
    if dlines:
        y += gap
        for ln in dlines:
            draw.text((LEFT, y), ln, font=df, fill=GREY)
            y += desc_lh

    out_path.parent.mkdir(parents=True, exist_ok=True)
    im.save(out_path, optimize=True)


def page_to_slug(nav_path: str) -> str | None:
    """Deployed-URL slug (no leading/trailing slash) for a page, matching
    zensical's page.url under use_directory_urls. Returns None for the homepage.
    """
    assert nav_path.endswith(".md")
    stem = nav_path[:-3]
    if stem in ("index", "README"):
        return None
    if stem.endswith("/index"):
        stem = stem[: -len("/index")]
    elif stem.endswith("/README"):
        stem = stem[: -len("/README")]
    return stem


_OG_DESC_RE = re.compile(r'(<meta property="og:description" content=")[^"]*(")')
_TW_DESC_RE = re.compile(r'(<meta name="twitter:description" content=")[^"]*(")')


def _patch_html_description(html_path: Path, desc: str) -> None:
    """Rewrite the built page's og:description / twitter:description to the exact
    text shown on its card, so the link-preview blurb matches the image. The
    SEO <meta name="description"> is left to the meta-descriptions plugin.
    Runs post-build (HTML already emitted); silently no-ops if the file/tags
    are absent.
    """
    if not html_path.is_file():
        return
    esc = html.escape(desc, quote=True)
    original = html_path.read_text(encoding="utf-8")
    patched = _OG_DESC_RE.sub(lambda m: m.group(1) + esc + m.group(2), original)
    patched = _TW_DESC_RE.sub(lambda m: m.group(1) + esc + m.group(2), patched)
    if patched != original:
        html_path.write_text(patched, encoding="utf-8")


def _render_task(task: tuple) -> str | None:
    """Worker: render one page's card. Returns None on success, or an error
    string. Runs in a separate process (rendering is CPU-bound); each worker
    keeps its own font/template cache, reused across the pages it handles.
    """
    (nav_path, nav_label, version_label,
     docs_dir_s, site_dir_s, snippet_base_s, site_description) = task
    docs_dir = Path(docs_dir_s)
    site_dir = Path(site_dir_s)
    snippet_base = Path(snippet_base_s)
    try:
        raw = (docs_dir / nav_path).read_text(encoding="utf-8")
        resolved = grm.resolve_snippets(raw, snippet_base)
        title = extract_title(resolved, nav_label, nav_path)
        desc = extract_description(raw, resolved, site_description)
        slug = page_to_slug(nav_path)
        render_card(title, desc, site_dir / "images" / "og" / f"{slug}.png", version_label)
        # Mirror the card's description into the page's link-preview meta tags.
        _patch_html_description(site_dir / slug / "index.html", desc)
        return None
    except Exception as exc:                    # never break the build over one page
        return f"{nav_path}: {exc}"


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: generate_og_images.py <mkdocs-config.yml>", file=sys.stderr)
        return 2

    config_path = (REPO_ROOT / argv[1]).resolve() if not os.path.isabs(argv[1]) else Path(argv[1])
    config = grm.load_config(config_path)

    docs_dir = (REPO_ROOT / config["docs_dir"]).resolve()
    site_dir = (REPO_ROOT / config["site_dir"]).resolve()
    snippet_base = (REPO_ROOT / "docs").resolve()
    site_description = config.get("site_description", "Wallarm Documentation")

    # Non-root versions get a node-version badge, e.g.
    # "Node Version 7.x · 0.26.x+ (preview)" — both node trains (NGINX + Native)
    # and the status. The root/latest version stays unlabelled (mirrors the
    # announce bar). native/status come from extra.versionNative / extra.status.
    extra = config.get("extra", {}) or {}
    version = extra.get("version")
    version_label = None
    if version and not extra.get("is_latest"):
        version_label = f"Node Version {version}"
        native = extra.get("versionNative")
        if native:
            version_label += f" · {native}"
        status = extra.get("status")
        if status:
            version_label += f" ({status})"

    if not site_dir.is_dir():
        print(f"site_dir does not exist (build first?): {site_dir}", file=sys.stderr)
        return 1
    for asset in (TEMPLATE, SERIF_FONT, INTER_FONT):
        if not asset.is_file():
            print(f"missing OG asset: {asset}", file=sys.stderr)
            return 1

    nav_titles: dict[str, str] = {}
    load_titled_nav(config.get("nav", []), nav_titles)

    pages: list[str] = []
    grm.walk_nav(config.get("nav", []), pages)
    # Cover orphan pages that render to HTML but are not in nav, so their
    # og:image never 404s (same policy as the raw-markdown generator).
    nav_set = set(pages)
    for md_file in sorted(docs_dir.rglob("*.md")):
        rel = md_file.relative_to(docs_dir).as_posix()
        if rel not in nav_set:
            pages.append(rel)

    seen: set[str] = set()
    tasks: list[tuple] = []
    for nav_path in pages:
        if nav_path in seen:
            continue
        seen.add(nav_path)
        if page_to_slug(nav_path) is None:      # homepage → static banner
            continue
        if not (docs_dir / nav_path).is_file():
            continue
        tasks.append((nav_path, nav_titles.get(nav_path), version_label,
                      str(docs_dir), str(site_dir), str(snippet_base), site_description))

    # Rendering is CPU-bound and per-page independent — fan out across cores.
    # Cap workers so a shared CI box is not overwhelmed. Fall back to serial for
    # tiny page sets (pool startup would cost more than it saves).
    workers = min(os.cpu_count() or 4, 8)
    errors: list[str] = []
    if workers > 1 and len(tasks) > 8:
        chunk = max(1, len(tasks) // (workers * 4))
        with concurrent.futures.ProcessPoolExecutor(max_workers=workers) as pool:
            errors = [e for e in pool.map(_render_task, tasks, chunksize=chunk) if e]
    else:
        workers = 1
        errors = [e for e in (_render_task(t) for t in tasks) if e]

    for e in errors:
        print(f"  skip (render error) {e}", file=sys.stderr)

    # Home page. The latest/root version keeps the plain static banner; every
    # non-root version (7.x, 5.0, deprecated) gets a home card = banner content
    # + its version badge, so a shared home link is labelled with the version.
    # main.html points non-latest home og:image at images/og/home.png. Either
    # way, mirror the home description into the link-preview meta so it matches.
    home_note = ""
    home_desc = HOME_DESC
    if extra.get("status") == "deprecated":
        home_desc = (f"Wallarm node {version} and lower is no longer supported "
                     f"— see the latest documentation for current versions.")
    try:
        if version_label:                       # non-root → dedicated badged card
            render_card(HOME_TITLE, home_desc, site_dir / "images" / "og" / "home.png", version_label)
            home_note = " + home card"
        _patch_html_description(site_dir / "index.html", home_desc)
    except Exception as exc:
        print(f"  skip (home card): {exc}", file=sys.stderr)

    print(f"OG images: wrote {len(tasks) - len(errors)}, skipped {len(errors)} "
          f"({workers} worker{'s' if workers != 1 else ''}){home_note} -> {site_dir}/images/og/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
