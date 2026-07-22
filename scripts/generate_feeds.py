#!/usr/bin/env python3
"""Generate aggregated Atom + JSON changelog feeds for docs.wallarm.com.

One feed per node artifact (NGINX Node, Native Node, connector code bundle), NOT
one per docs version. Each feed aggregates that artifact's releases across every
docs version, sorted newest first.

Pipeline (see scripts/README-feeds.md for the full write-up):

  1. For each product, scan each docs version folder, following `--8<--` include
     wrappers so the topology is discovered at run time, not hardcoded.
  2. Parse per-(subgroup, version) headings. A "subgroup" is the `##` heading the
     entry lives under: a form factor for the nodes, a connector name for the
     bundle. Anchors are derived exactly as the MkDocs `toc` extension derives
     them (default slugify + `_N` de-dup counter over every heading).
  3. Group into feed entries:
       - NGINX / Native Node: ONE entry per version. The body has a `#### <form
         factor>` section per form factor, so a release is a single notification
         rather than one per form factor.
       - connector code bundle: one entry per (connector, version).
  4. Derive each entry's line + docs URL from its own version axis
     (feeds.config.yml): NGINX from the docs folder, Native from the version,
     connectors from the connector name + source folder.
  5. Emit <output>/feeds/<basename>.xml (Atom) and .rss (RSS 2.0), both capped at
     atom_max_entries, plus .json (full current history).

Fail-fast: any version heading (an H3 starting with a digit) without a parseable
`(YYYY-MM-DD)` date aborts the whole run with the offending entries listed. No
partial feeds are written.

Usage:
    python3 scripts/generate_feeds.py [--config feeds.config.yml]
                                      [--docs-root docs] [--output site]
"""

from __future__ import annotations

import argparse
import html
import json
import posixpath
import re
import sys
import unicodedata
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

import yaml

try:
    import markdown as md_lib
except ImportError:  # pragma: no cover
    md_lib = None


# --------------------------------------------------------------------------- #
# MkDocs/Python-Markdown anchor derivation (must match the built site)
# --------------------------------------------------------------------------- #

_SLUG_STRIP = re.compile(r"[^\w\s-]", re.UNICODE)
_SLUG_SPACE = re.compile(r"[-\s]+")
_IDCOUNT = re.compile(r"^(.*)_([0-9]+)$")


def slugify(value: str, separator: str = "-") -> str:
    """Replica of markdown.extensions.toc.slugify (unicode=False, the default)."""
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = _SLUG_STRIP.sub("", value).strip().lower()
    return _SLUG_SPACE.sub(separator, value)


def unique_id(base: str, used: set) -> str:
    """Replica of markdown.extensions.toc.unique — appends _1, _2, ..."""
    ident = base
    while ident in used or not ident:
        m = _IDCOUNT.match(ident)
        if m:
            ident = "%s_%d" % (m.group(1), int(m.group(2)) + 1)
        else:
            ident = "%s_1" % ident
    used.add(ident)
    return ident


# --------------------------------------------------------------------------- #
# Source resolution + parsing
# --------------------------------------------------------------------------- #

INCLUDE_RE = re.compile(r'^\s*(?:-{2,}8<-{2,})\s+"([^"]+)"\s*$')
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
VERSION_RE = re.compile(r"^(?P<ver>\S+?)\s*(?:\((?P<date>\d{4}-\d{2}-\d{2})\))?\s*$")
DATE_RE = re.compile(r"\((\d{4}-\d{2}-\d{2})\)")
# Google Cloud Platform Image section uses the image name as the heading,
# e.g. "wallarm-node-6-12-7-20260625-060642 (2026-06-25)" instead of "6.12.7".
# Capture the version part (before the -YYYYMMDD-HHMMSS build stamp) so these
# releases join their node-version entry like every other form factor.
GCP_VER_RE = re.compile(r"^wallarm-node-(\d+(?:-\d+)*)-\d{8}-\d{6}\b")
REFDEF_RE = re.compile(r"^\s{0,3}\[[^\]]+\]:\s+\S+")
COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)


class ParseError(Exception):
    pass


def resolve_source(docs_root: Path, folder: str, rel_path: str) -> Path | None:
    """Return the real content file for docs/<folder>/<rel_path>, following a
    single-include wrapper. Returns None if the version has no such page."""
    path = docs_root / folder / rel_path
    if not path.is_file():
        return None
    seen = set()
    while True:
        if path in seen:
            raise ParseError(f"Include cycle detected at {path}")
        seen.add(path)
        text = path.read_text(encoding="utf-8")
        include_target = None
        for line in text.splitlines():
            stripped = line.strip()
            if not stripped or REFDEF_RE.match(line):
                continue  # skip leading ref-defs / blanks in a wrapper
            m = INCLUDE_RE.match(line)
            if m:
                include_target = m.group(1)
            break  # only inspect the first meaningful line
        if include_target is None:
            return path
        path = docs_root / include_target


def strip_comments_and_fences(text: str) -> list[str]:
    """Remove HTML comments, then return lines with fenced-code regions blanked
    out for heading detection (content is kept verbatim in body capture)."""
    text = COMMENT_RE.sub("", text)
    return text.splitlines()


def collect_refdefs(lines: list[str]) -> str:
    return "\n".join(l for l in lines if REFDEF_RE.match(l))


def parse_file(text: str) -> list[dict]:
    """Parse one changelog file into a list of entry dicts.

    Each entry: {subgroup, version, date, body_markdown}. Anchors are attached
    in a second, whole-file heading pass so the toc counter matches the build.
    """
    lines = strip_comments_and_fences(text)

    # --- Pass 1: compute an id for every heading, in document order --------- #
    used: set = set()
    heading_ids: list[str] = []          # id per heading, in order
    fence = None
    for line in lines:
        f = re.match(r"^\s*(```+|~~~+)", line)
        if fence:
            if line.strip().startswith(fence):
                fence = None
            continue
        if f:
            fence = f.group(1)[:3]
            continue
        m = HEADING_RE.match(line)
        if m:
            heading_ids.append(unique_id(slugify(m.group(2)), used))

    # --- Pass 2: build entries, pulling ids from Pass 1 --------------------- #
    entries: list[dict] = []
    hidx = -1
    subgroup = None
    current = None
    body: list[str] = []
    fence = None
    undated: list[str] = []

    def close():
        nonlocal current, body
        if current is not None:
            current["body_markdown"] = "\n".join(body).strip("\n")
            entries.append(current)
        current, body = None, []

    for line in lines:
        f = re.match(r"^\s*(```+|~~~+)", line)
        in_fence_before = fence is not None
        if fence:
            if line.strip().startswith(fence):
                fence = None
            if current is not None:
                body.append(line)
            continue
        if f:
            fence = f.group(1)[:3]
            if current is not None:
                body.append(line)
            continue

        m = HEADING_RE.match(line)
        if not m:
            if current is not None:
                body.append(line)
            continue

        hidx += 1
        hid = heading_ids[hidx]
        level, htext = len(m.group(1)), m.group(2)

        if level >= 4:
            # sub-heading inside an entry body — keep it in the body
            if current is not None:
                body.append(line)
            continue
        if level == 1:
            close()
            continue
        if level == 2:
            close()
            subgroup = htext
            continue
        # level == 3
        gcp = GCP_VER_RE.match(htext)              # GCP image name -> node version
        if not re.match(r"^\d", htext) and not gcp:
            close()            # non-version H3 (a real sub-section) ends the entry
            continue
        # a version entry
        close()
        dm = DATE_RE.search(htext)
        date = dm.group(1) if dm else None
        if gcp:
            version = ".".join(gcp.group(1).split("-"))
        else:
            vm = VERSION_RE.match(htext)
            version = vm.group("ver") if vm else htext
        if not date:
            undated.append(f"{subgroup or '(no group)'} -> ### {htext}")
            continue
        current = {
            "subgroup": subgroup or "",
            "version": version,
            "date": date,
            "anchor": hid,
            "body_markdown": "",
        }
        body = []

    close()

    if undated:
        raise ParseError(
            "version heading(s) without a (YYYY-MM-DD) date:\n    "
            + "\n    ".join(undated)
        )
    return entries


# --------------------------------------------------------------------------- #
# Markdown -> HTML rendering + absolute-link rewriting
# --------------------------------------------------------------------------- #

_MD_EXTENSIONS = [
    "admonition", "tables", "sane_lists", "attr_list", "md_in_html", "def_list",
    "toc", "nl2br",
    "pymdownx.superfences", "pymdownx.details", "pymdownx.magiclink",
    "pymdownx.tasklist", "pymdownx.highlight", "pymdownx.inlinehilite",
    "pymdownx.mark", "pymdownx.critic", "pymdownx.smartsymbols", "pymdownx.tilde",
]

_HREF_RE = re.compile(r'(?P<attr>href|src)="(?P<url>[^"]*)"')


def md_target_to_url(path: str) -> str:
    """Map a doc-root-relative .md target to its use_directory_urls URL path."""
    if path.endswith(".md"):
        path = path[:-3]
        if path.endswith("/index"):
            path = path[: -len("index")]      # dir keeps trailing slash
            return path
        return path + "/"
    return path  # images / other assets keep their extension


def rewrite_links(html_text: str, base_url: str, url_prefix: str, src_dir: str) -> str:
    """Rewrite relative href/src into absolute docs.wallarm.com URLs.

    src_dir is the source file's directory relative to the version root
    (e.g. 'updating-migrating/native-node'). Relative links are resolved against
    it (mirroring how MkDocs resolves against the source path), then mapped to
    the directory-URL form under base_url + url_prefix.
    """
    prefix = f"{base_url}{url_prefix}"

    def repl(m: re.Match) -> str:
        url = m.group("url")
        if not url or url.startswith(("http://", "https://", "mailto:", "//", "data:")):
            return m.group(0)
        if url.startswith("#"):
            return m.group(0)  # in-page anchor — leave for the reader's context
        frag = ""
        if "#" in url:
            url, frag = url.split("#", 1)
            frag = "#" + frag
        joined = posixpath.normpath(posixpath.join(src_dir, url))
        joined = joined.lstrip("/")
        abs_url = f"{prefix}/{md_target_to_url(joined)}{frag}"
        return f'{m.group("attr")}="{abs_url}"'

    return _HREF_RE.sub(repl, html_text)


def render_html(body_markdown: str, refdefs: str, base_url: str,
                url_prefix: str, src_dir: str) -> str:
    if md_lib is None:
        raise ParseError("the `markdown` package is required (pip install -r requirements.txt)")
    if "--8<--" in body_markdown:
        raise ParseError("changelog entry body contains a snippet include (--8<--); "
                         "feed rendering does not resolve snippets")
    md = md_lib.Markdown(extensions=_MD_EXTENSIONS)
    source = (refdefs + "\n\n" + body_markdown) if refdefs else body_markdown
    html_text = md.convert(source)
    return rewrite_links(html_text, base_url, url_prefix, src_dir)


# --------------------------------------------------------------------------- #
# Feed assembly
# --------------------------------------------------------------------------- #

def _version_tuple(version: str) -> tuple:
    """Leading numeric components of a version string, e.g. '0.25.3' -> (0, 25, 3)."""
    nums = []
    for part in version.split("."):
        m = re.match(r"\d+", part)
        if not m:
            break
        nums.append(int(m.group(0)))
    return tuple(nums)


def derive_line(cfg: dict, product: dict, entry: dict, folder_cfg: dict) -> tuple:
    """Return (line_label, url_prefix) for an entry.

    - NGINX Node: line = the folder's NGINX line (its changelog is per-version and
      not shared, and mixes form factors with their own version series).
    - Native Node: line/URL from the version itself (its changelog is shared
      across folders and it is versioned independently of the NGINX Node).
    - connectors: line = connector name; URL from the folder where it is published.
    """
    scheme = product["line_from"]
    if scheme == "docs_folder":
        return folder_cfg["nginx_line"], folder_cfg["url_prefix"]
    if scheme == "native_version":
        ver = _version_tuple(entry["version"])
        for rule in cfg["native_lines"]:               # ordered high -> low
            if ver >= _version_tuple(rule["floor"]):
                return rule["label"], rule["url_prefix"]
        raise ParseError(f"no native_lines rule for version {entry['version']!r}")
    if scheme == "connector":
        return entry["subgroup"], folder_cfg["url_prefix"]
    raise ParseError(f"unknown line_from scheme {scheme!r}")


def build_entries(cfg: dict, docs_root: Path, product_key: str) -> list[dict]:
    product = cfg["products"][product_key]
    base_url = cfg["base_url"].rstrip("/")
    rel_path = product["path"]
    src_dir = posixpath.dirname(rel_path)
    page_url_path = md_target_to_url(rel_path)
    # Node feeds: ONE entry per version, whose body has a section per form factor
    # (a release should be a single notification, not one per form factor).
    # Connector feeds: one entry per (connector, version) — connectors are
    # separate products with their own version series.
    merge_form_factors = product["line_from"] != "connector"
    labels = cfg.get("form_factor_labels", {})      # short names for the summary

    # Collect sub-entries (one per parsed heading), deduped by (subgroup, version)
    # across docs folders, keeping the first (current-stable) occurrence.
    seen_keys: set = set()
    subs: list[dict] = []
    for folder_cfg in cfg["docs_versions"]:         # current-stable first
        src = resolve_source(docs_root, folder_cfg["folder"], rel_path)
        if src is None:
            continue
        text = src.read_text(encoding="utf-8")
        try:
            parsed = parse_file(text)
        except ParseError as e:
            raise ParseError(f"[{product_key} / {folder_cfg['folder']} / {src}] {e}")
        refdefs = collect_refdefs(strip_comments_and_fences(text))
        for e in parsed:
            key = (product_key, e["subgroup"], e["version"])
            if key in seen_keys:
                continue
            seen_keys.add(key)
            line_label, url_prefix = derive_line(cfg, product, e, folder_cfg)
            subs.append({**e, "line": line_label, "url_prefix": url_prefix, "refdefs": refdefs})

    def emit(version, subgroup, line, url, url_prefix, date, body_md, refdefs, summary_html):
        return {
            "product": product_key,
            "product_name": product["name"],
            "version": version,
            "line": line,
            "date": date,
            "url": url,
            "id": entry_id(product_key, version, subgroup),
            "title": entry_title(product_key, product["name"], version, subgroup),
            "summary_html": summary_html,
            "body_markdown": body_md,
            "content_html": render_html(body_md, refdefs, base_url, url_prefix, src_dir),
        }

    page_url_of = lambda url_prefix: f"{base_url}{url_prefix}/{page_url_path}"

    out: list[dict] = []
    if merge_form_factors:
        groups: dict = {}                           # version -> [sub, ...], first-seen order
        for s in subs:
            groups.setdefault(s["version"], []).append(s)
        for version, items in groups.items():
            first = items[0]                        # first form factor in document order
            body_md = "\n\n".join(
                f"#### {s['subgroup'] or product['name']}\n\n{s['body_markdown']}".rstrip()
                for s in items
            )
            # summary = plain-text list of the form factors released in this
            # version (short labels). Deliberately NOT links: the entry <link>
            # (title) already points to the changelog, and any summary href would
            # be unfurled by Slack into a duplicate preview card. Full per-form-
            # factor sections + links stay in <content>.
            summary_html = "Released for: " + ", ".join(
                labels.get(s["subgroup"] or product["name"], s["subgroup"] or product["name"])
                for s in items
            )
            # Entry link goes to the changelog page (NO form-factor anchor) — a
            # release spans several form factors, each of which has its own deep
            # link in the summary above, so the entry itself must not favour one.
            out.append(emit(
                version, None, first["line"], page_url_of(first["url_prefix"]),
                first["url_prefix"], max(s["date"] for s in items),
                body_md, first["refdefs"], summary_html,
            ))
    else:
        for s in subs:                              # connectors: one section per entry
            summary_html = s["subgroup"]            # plain text (see note above)
            url = f'{page_url_of(s["url_prefix"])}#{s["anchor"]}'
            out.append(emit(
                s["version"], s["subgroup"], s["line"], url, s["url_prefix"],
                s["date"], s["body_markdown"], s["refdefs"], summary_html,
            ))
    return out


def entry_title(product_key: str, product_name: str, version: str, subgroup=None) -> str:
    # Every title starts with "Wallarm" so a subscriber following many feeds can
    # tell at a glance that the notification is a Wallarm release.
    if product_key == "connectors":
        return f"Wallarm connector code bundle — {subgroup} {version}"
    return f"Wallarm {product_name} {version}"


def entry_id(product_key: str, version: str, subgroup=None) -> str:
    """Stable, URL-independent entry identifier (RFC 4151 tag: URI) for the Atom
    <id> and RSS <guid>. It must NEVER change once published, so it is derived
    from product + version (+ connector), NOT from the docs URL — the URL moves
    when a version is promoted to root, but the id must stay put so readers do
    not re-notify. The <link> carries the resolvable (possibly redirected) URL.
    """
    slug = f"{product_key}/{version}"
    if subgroup:                                    # connectors: include the connector
        conn = re.sub(r"[^a-z0-9]+", "-", subgroup.lower()).strip("-")
        slug = f"{product_key}/{conn}/{version}"
    return f"tag:docs.wallarm.com,2026:{slug}"


def sort_key(e: dict):
    # newest first; tie-break by version string then title for stability
    return (e["date"], e["version"], e["title"])


def json_record(e: dict) -> dict:
    return {
        "id": e["id"],                              # matches Atom <id> / RSS <guid>
        "artifact_id": e["product"],
        "version": e["version"],
        "line": e["line"],
        "title": e["title"],                        # matches Atom/RSS <title>
        "date": e["date"],
        "url": e["url"],                            # matches Atom/RSS <link>
        "body_markdown": e["body_markdown"],
    }


def build_atom(cfg: dict, product_key: str, entries: list[dict]) -> str:
    product = cfg["products"][product_key]
    base_url = cfg["base_url"].rstrip("/")
    feed_url = f"{base_url}/feeds/{product['feed_basename']}.xml"
    # alternate = the root-line changelog page (first configured line = newest,
    # but link to the current root for the human-facing "site link")
    site_link = f"{base_url}/{md_target_to_url(product['path'])}"
    updated = (entries[0]["date"] if entries else "1970-01-01") + "T00:00:00Z"
    lines_covered = ", ".join(dict.fromkeys(e["line"] for e in entries))

    parts = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<feed xmlns="http://www.w3.org/2005/Atom">',
        f"  <title>{xml_escape(product['feed_title'])}</title>",
        f"  <id>{feed_url}</id>",
        f'  <link rel="self" href="{feed_url}"/>',
        f'  <link rel="alternate" href="{site_link}"/>',
        f"  <updated>{updated}</updated>",
        f"  <subtitle>Full {xml_escape(product['name'])} release history. "
        f"Each entry is tagged with its version line ({xml_escape(lines_covered)}).</subtitle>",
        "  <author><name>Wallarm</name></author>",
    ]
    for e in entries[: cfg["atom_max_entries"]]:
        parts += [
            "  <entry>",
            f"    <title>{xml_escape(e['title'])}</title>",
            f"    <id>{xml_escape(e['id'])}</id>",
            f'    <link rel="alternate" href="{xml_escape(e["url"])}"/>',
            f"    <updated>{e['date']}T00:00:00Z</updated>",
            f"    <published>{e['date']}T00:00:00Z</published>",
            f'    <category term="{xml_escape(e["line"])}"/>',
            f'    <summary type="html">{xml_escape(e["summary_html"])}</summary>',
            f'    <content type="html">{xml_escape(e["content_html"])}</content>',
            "  </entry>",
        ]
    parts.append("</feed>")
    return "\n".join(parts) + "\n"


def _rfc822(date_str: str) -> str:
    """'2026-06-26' -> 'Fri, 26 Jun 2026 00:00:00 +0000' (RSS 2.0 pubDate format)."""
    from datetime import datetime, timezone
    dt = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")


def build_rss(cfg: dict, product_key: str, entries: list[dict]) -> str:
    """RSS 2.0 rendering of the same entries (offered alongside the Atom feed).

    <description> carries the summary (artifact list); <content:encoded> carries
    the full rendered release notes — mirroring the Atom <summary>/<content> split.
    """
    product = cfg["products"][product_key]
    base_url = cfg["base_url"].rstrip("/")
    feed_url = f"{base_url}/feeds/{product['feed_basename']}.rss"
    site_link = f"{base_url}/{md_target_to_url(product['path'])}"
    lines_covered = ", ".join(dict.fromkeys(e["line"] for e in entries))
    build_date = _rfc822(entries[0]["date"] if entries else "1970-01-01")

    parts = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" '
        'xmlns:atom="http://www.w3.org/2005/Atom">',
        "  <channel>",
        f"    <title>{xml_escape(product['feed_title'])}</title>",
        f"    <link>{site_link}</link>",
        f'    <atom:link href="{feed_url}" rel="self" type="application/rss+xml"/>',
        f"    <description>Full {xml_escape(product['name'])} release history. "
        f"Each item is tagged with its version line ({xml_escape(lines_covered)}).</description>",
        f"    <lastBuildDate>{build_date}</lastBuildDate>",
    ]
    for e in entries[: cfg["atom_max_entries"]]:
        parts += [
            "    <item>",
            f"      <title>{xml_escape(e['title'])}</title>",
            f"      <link>{xml_escape(e['url'])}</link>",
            f'      <guid isPermaLink="false">{xml_escape(e["id"])}</guid>',
            f"      <pubDate>{_rfc822(e['date'])}</pubDate>",
            f"      <category>{xml_escape(e['line'])}</category>",
            f"      <description>{xml_escape(e['summary_html'])}</description>",
            f"      <content:encoded>{xml_escape(e['content_html'])}</content:encoded>",
            "    </item>",
        ]
    parts += ["  </channel>", "</rss>"]
    return "\n".join(parts) + "\n"


# --------------------------------------------------------------------------- #
# Validation
# --------------------------------------------------------------------------- #

def validate_rss(xml_text: str, product_key: str) -> None:
    import xml.etree.ElementTree as ET

    root = ET.fromstring(xml_text)              # raises on malformed XML
    items = root.findall("./channel/item")
    if not items:
        raise ParseError(f"[{product_key}] RSS feed has 0 items")
    guids = set()
    for it in items:
        g = it.findtext("guid")
        if not g:
            raise ParseError(f"[{product_key}] RSS item without <guid>")
        if g in guids:
            raise ParseError(f"[{product_key}] duplicate <guid>: {g}")
        guids.add(g)
        if it.find("category") is None:
            raise ParseError(f"[{product_key}] RSS item {g} missing <category>")

def validate_atom(xml_text: str, product_key: str) -> None:
    import xml.etree.ElementTree as ET

    ns = "{http://www.w3.org/2005/Atom}"
    root = ET.fromstring(xml_text)              # raises on malformed XML
    entries = root.findall(f"{ns}entry")
    if not entries:
        raise ParseError(f"[{product_key}] Atom feed has 0 entries")
    ids = set()
    for ent in entries:
        eid = ent.findtext(f"{ns}id")
        if not eid:
            raise ParseError(f"[{product_key}] entry without <id>")
        if eid in ids:
            raise ParseError(f"[{product_key}] duplicate <id>: {eid}")
        ids.add(eid)
        if ent.find(f"{ns}category") is None:
            raise ParseError(f"[{product_key}] entry {eid} missing <category>")


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--config", default="feeds.config.yml")
    ap.add_argument("--docs-root", default="docs")
    ap.add_argument("--output", default="site", help="site dir; feeds go to <output>/feeds/")
    args = ap.parse_args()

    cfg = yaml.safe_load(Path(args.config).read_text(encoding="utf-8"))
    docs_root = Path(args.docs_root)
    out_dir = Path(args.output) / "feeds"
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        for product_key, product in cfg["products"].items():
            entries = build_entries(cfg, docs_root, product_key)
            entries.sort(key=sort_key, reverse=True)

            atom = build_atom(cfg, product_key, entries)          # capped at atom_max_entries
            validate_atom(atom, product_key)
            (out_dir / f"{product['feed_basename']}.xml").write_text(atom, encoding="utf-8")

            rss = build_rss(cfg, product_key, entries)            # RSS 2.0, same entries
            validate_rss(rss, product_key)
            (out_dir / f"{product['feed_basename']}.rss").write_text(rss, encoding="utf-8")

            json_out = [json_record(e) for e in entries]          # full current history
            (out_dir / f"{product['feed_basename']}.json").write_text(
                json.dumps(json_out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
            )

            print(f"[{product_key}] {len(entries)} entries "
                  f"({min(len(entries), cfg['atom_max_entries'])} in Atom/RSS) -> "
                  f"{product['feed_basename']}.xml/.rss/.json")
    except ParseError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    print("Feeds generated OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
