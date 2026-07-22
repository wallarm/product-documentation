#!/usr/bin/env python3
"""Downscale oversized PNG screenshots in place before the per-version builds.

Screenshots are captured on HiDPI/retina displays at 2500-8000px wide, but the
docs content column is under ~900px, so at 2x density nothing above ~1800px is
ever visible — the browser just downscales on every view, and readers pay the
full byte cost every time (the top bandwidth consumers in analytics are all
oversized /images/*.png). This resizes only images WIDER than --max-width, with
high-quality Lanczos resampling, and leaves everything at or below the cap
untouched. It is lossless-by-intent for on-screen viewing: the cap keeps a >=2x
pixel budget for the widest realistic column, so downscaled screenshots stay
crisp on retina.

Runs at build time on the ephemeral CI checkout (like the oxipng step) — the
full-resolution originals stay in git. Resize runs BEFORE oxipng so oxipng gets
the final lossless squeeze on the already-smaller file. Per-file errors are
warned and skipped; a bad image never aborts the deploy.

Usage:
    python3 scripts/optimize_images.py images/ --max-width 1800
"""

import argparse
import os
import sys

from PIL import Image


def resize_in_place(path, max_width):
    """Resize one PNG to max_width if wider. Returns (before, after) bytes, or
    (size, size) if left untouched, or None on error."""
    before = os.path.getsize(path)
    try:
        with Image.open(path) as im:
            if im.width <= max_width:
                return (before, before)  # under the cap — leave as-is

            # Only downscale true-colour PNGs (RGB/RGBA) — the retina screenshots
            # that dominate bandwidth. Palette ('P') and grayscale ('L') PNGs are
            # already compact (1 byte/pixel); promoting them to true-colour for a
            # Lanczos resample makes the file BIGGER, because resampled edges gain
            # colours and oxipng can no longer re-palette them. That group is only
            # ~7% of oversized weight, so leave it untouched for oxipng.
            if im.mode not in ("RGB", "RGBA"):
                return (before, before)
            # An RGB PNG carrying byte-encoded transparency (rare) becomes RGBA so
            # the transparent areas survive the resample.
            if im.mode == "RGB" and "transparency" in im.info:
                im = im.convert("RGBA")

            new_h = round(im.height * max_width / im.width)
            im = im.resize((max_width, new_h), Image.LANCZOS)

            # Preserve colour profile / DPI if the source carried them; --strip
            # safe in the oxipng step keeps these too, so we stay consistent.
            save_kwargs = {"optimize": True}
            icc = im.info.get("icc_profile")
            if icc:
                save_kwargs["icc_profile"] = icc
            dpi = im.info.get("dpi")
            if dpi:
                save_kwargs["dpi"] = dpi

            im.save(path, format="PNG", **save_kwargs)
    except Exception as exc:  # noqa: BLE001 — never abort the deploy for one image
        print(f"  WARN: skipped {path}: {exc}", file=sys.stderr)
        return None

    return (before, os.path.getsize(path))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("root", help="directory to walk for PNGs (e.g. images/)")
    ap.add_argument("--max-width", type=int, default=1800,
                    help="images wider than this are downscaled to it (default 1800)")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        print(f"error: {args.root} is not a directory", file=sys.stderr)
        return 1

    scanned = resized = failed = 0
    bytes_before = bytes_after = 0

    for cur, _dirs, files in os.walk(args.root):
        for name in files:
            if not name.lower().endswith(".png"):
                continue
            scanned += 1
            path = os.path.join(cur, name)
            result = resize_in_place(path, args.max_width)
            if result is None:
                failed += 1
                continue
            b, a = result
            if a < b:
                resized += 1
                bytes_before += b
                bytes_after += a

    saved = bytes_before - bytes_after
    pct = (100 * saved / bytes_before) if bytes_before else 0
    print(f"Resize (>{args.max_width}px): {resized}/{scanned} PNGs downscaled, "
          f"{bytes_before/1e6:.1f} MB -> {bytes_after/1e6:.1f} MB "
          f"(saved {saved/1e6:.1f} MB, {pct:.0f}%)"
          + (f"; {failed} skipped on error" if failed else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
