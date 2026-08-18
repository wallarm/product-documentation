#!/usr/bin/env python3
"""Self-host GLightbox instead of fetching it from unpkg.com at runtime.

The zensical theme bundle hard-codes two absolute URLs and fetches them on
every page load, when the image lightbox initialises:

    https://unpkg.com/glightbox@3/dist/css/glightbox.min.css
    https://unpkg.com/glightbox@3/dist/js/glightbox.min.js

unpkg periodically degrades to 10-20s responses, and each of those URLs
302-redirects to the pinned version (glightbox@3.3.1), doubling the
round-trips. In practice this is the single biggest drag on page load — far
slower than any first-party asset or other third-party script on the page.

Run once, after every `zensical build` pass has populated `site/`, this script:

  1. copies the vendored GLightbox files (vendor/glightbox/) into the built
     site under /assets/external/glightbox/, and
  2. rewrites the two unpkg URLs in every built bundle to those local,
     same-origin, long-cached paths.

Why this layout works for the multi-version site:

  * The URLs are rewritten to ROOT-ABSOLUTE paths (/assets/external/...), so
    every version subsite (/, /7.x/, /5.x/, /4.10/) resolves to the single
    copy placed at the site root — no per-version duplication needed.
  * The files live under /assets/, which netlify.toml serves with a 1-year
    `immutable` cache header. That is safe because the GLightbox version is
    baked into the filename: bumping the version changes the URL, so a cached
    copy can never go stale.

Usage:
    python3 scripts/self_host_glightbox.py [site_dir]   # default: site
"""

import sys
from pathlib import Path

GLIGHTBOX_VERSION = "3.3.1"

# Vendored source files (committed): vendor/glightbox/glightbox-<ver>.min.{css,js}
VENDOR_DIR = Path(__file__).resolve().parent.parent / "vendor" / "glightbox"

# Destination inside the built site, relative to the site root. Under /assets/
# so it inherits the immutable cache header from netlify.toml.
DEST_SUBPATH = "assets/external/glightbox"

# unpkg URL (as it appears verbatim in the theme bundle)  ->  local root-absolute path
REPLACEMENTS = {
    "https://unpkg.com/glightbox@3/dist/css/glightbox.min.css":
        f"/{DEST_SUBPATH}/glightbox-{GLIGHTBOX_VERSION}.min.css",
    "https://unpkg.com/glightbox@3/dist/js/glightbox.min.js":
        f"/{DEST_SUBPATH}/glightbox-{GLIGHTBOX_VERSION}.min.js",
}

# File types the theme may embed the URLs in.
SCAN_GLOBS = ("*.js", "*.html")


def main() -> int:
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    if not site.is_dir():
        print(f"ERROR: site directory not found: {site}", file=sys.stderr)
        return 1

    # 1. Copy the vendored files to the site root. Fail fast if a source is
    #    missing — that is a genuine packaging error, not a soft warning.
    dest = site / DEST_SUBPATH
    dest.mkdir(parents=True, exist_ok=True)
    for kind in ("css", "js"):
        src = VENDOR_DIR / f"glightbox-{GLIGHTBOX_VERSION}.min.{kind}"
        if not src.is_file():
            print(f"ERROR: vendored file missing: {src}", file=sys.stderr)
            return 1
        (dest / src.name).write_bytes(src.read_bytes())
    print(f"Copied vendored GLightbox {GLIGHTBOX_VERSION} -> {dest}")

    # 2. Rewrite the unpkg URLs across the whole built tree (all versions).
    files_changed = 0
    hits = 0
    for pattern in SCAN_GLOBS:
        for path in site.rglob(pattern):
            text = path.read_text(encoding="utf-8")
            if "unpkg.com/glightbox" not in text:
                continue
            new = text
            for old, repl in REPLACEMENTS.items():
                count = new.count(old)
                if count:
                    hits += count
                    new = new.replace(old, repl)
            if new != text:
                path.write_text(new, encoding="utf-8")
                files_changed += 1

    if files_changed == 0:
        # Non-fatal: a future zensical version may drop or rename the unpkg
        # dependency. Do not fail the deploy, but make it loud so we notice and
        # re-check whether self-hosting is still wired up.
        print(
            "WARNING: no unpkg/glightbox references found in the built site. "
            "The zensical bundle may have changed — verify GLightbox is still "
            "being self-hosted (scripts/self_host_glightbox.py).",
            file=sys.stderr,
        )
    else:
        print(f"Rewrote {hits} unpkg/glightbox URL(s) across {files_changed} file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
