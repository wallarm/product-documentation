#!/usr/bin/env python3
"""Assert every built page has a raw-markdown companion.

Cloudflare serves `Accept: text/markdown` by rewriting the page URL to its .md
companion. A rewrite is blind:
Cloudflare cannot check whether the target exists, so a page without a
companion does not fall back to HTML — it returns the 404 page, labelled
`Content-Type: text/markdown` because the _headers rule matches the request
path. An agent gets 279 KB of HTML claiming to be Markdown.

The Worker this replaced fetched the companion and fell back on a miss. Losing
that fallback is only safe if "every page has a companion" is enforced, so this
turns a silent runtime failure into a build failure.

Usage: scripts/check_markdown_companions.py site
"""
import sys
from pathlib import Path

# Version landing pages are assembled by the theme rather than authored, so
# generate_raw_markdown.py produces nothing for them. They are excluded from
# the rewrite rule and serve HTML to a markdown request, which is the correct
# fallback. That exclusion list is maintained by the DevOps team; tell them if
# this set changes.
EXPECTED_WITHOUT_COMPANION = {"7.x", "5.x", "4.10"}


def main() -> int:
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    if not site.is_dir():
        print(f"error: {site} is not a directory", file=sys.stderr)
        return 2

    missing, checked = [], 0
    for page in site.rglob("index.html"):
        rel = page.parent.relative_to(site)
        slug = "" if str(rel) == "." else str(rel)
        checked += 1
        if slug in EXPECTED_WITHOUT_COMPANION:
            continue
        companion = site / "index.md" if not slug else site / f"{slug}.md"
        if not companion.is_file():
            missing.append(f"/{slug}/" if slug else "/")

    print(f"markdown companions: checked {checked} pages, "
          f"{len(EXPECTED_WITHOUT_COMPANION)} exempt, {len(missing)} missing")
    if missing:
        print("\nPages with no .md companion. Under the Cloudflare rewrite these "
              "return a mislabelled 404 to any agent sending Accept: text/markdown.\n"
              "Either fix generate_raw_markdown.py, or exempt the page here AND in "
              "markdown_negotiation.tf (local.md_no_companion):\n", file=sys.stderr)
        for m in missing[:40]:
            print(f"  {m}", file=sys.stderr)
        if len(missing) > 40:
            print(f"  … and {len(missing) - 40} more", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
