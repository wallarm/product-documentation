#!/usr/bin/env python3
"""Lossy-quantise PNG screenshots to <=256-colour palettes with pngquant.

The images that dominate bandwidth are 24-bit true-colour retina screenshots,
but UI screenshots use relatively few real colours — so quantising them to a
palette (exactly what TinyPNG/ImageOptim do) roughly halves each file with no
visible loss, and keeps the .png extension so no markdown references change.
Across the current set this takes images/ from ~191 MB to ~63 MB, versus ~121 MB
for oxipng alone.

Resizing was tried first and abandoned: a lossless PNG's size tracks content
complexity, not pixel count, so downscaling just anti-aliases the edges and
compresses no smaller once oxipng runs. Bit depth, not dimensions, is the lever.

pngquant self-protects, so this is safe to run blindly over the whole tree:
  * --quality=MIN-MAX makes it SKIP (exit 99) any image it cannot quantise to at
    least MIN quality, so gradients/photos are left untouched rather than banded;
  * --skip-if-larger (exit 98) never writes a file bigger than the original.
Both are expected, non-fatal outcomes. Runs at build time on the ephemeral CI
checkout (like oxipng) — full-resolution originals stay in git — and before
oxipng, which then losslessly squeezes the quantised palettes further.

Usage:
    python3 scripts/optimize_images.py images/ --pngquant ./pngquant
"""

import argparse
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

# pngquant exit codes that mean "intentionally left the original in place", not
# a failure: 99 = below the quality floor, 98 = quantised result was larger.
SKIP_CODES = {98, 99}


def quantise(pngquant, quality, path):
    """Quantise one PNG in place. Returns (status, before_bytes, after_bytes)."""
    before = os.path.getsize(path)
    proc = subprocess.run(
        [pngquant, "--force", "--ext", ".png", "--skip-if-larger",
         "--quality", quality, "--strip", path],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    after = os.path.getsize(path)
    if proc.returncode == 0:
        return ("ok", before, after)
    if proc.returncode in SKIP_CODES:
        return ("skip", before, after)
    return ("warn", before, after)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("root", help="directory to walk for PNGs (e.g. images/)")
    ap.add_argument("--pngquant", default="pngquant", help="path to the pngquant binary")
    ap.add_argument("--quality", default="65-95",
                    help="pngquant MIN-MAX quality; images below MIN are skipped (default 65-95)")
    ap.add_argument("--workers", type=int, default=min(8, (os.cpu_count() or 4)),
                    help="parallel pngquant processes")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        print(f"error: {args.root} is not a directory", file=sys.stderr)
        return 1

    # Fail loudly if the binary is missing/unusable — a silent skip would leave
    # every image un-optimised while the build still went green.
    try:
        subprocess.run([args.pngquant, "--version"], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except (FileNotFoundError, subprocess.CalledProcessError) as exc:
        print(f"error: pngquant not runnable at '{args.pngquant}': {exc}", file=sys.stderr)
        return 1

    files = [os.path.join(cur, name)
             for cur, _dirs, names in os.walk(args.root)
             for name in names if name.lower().endswith(".png")]

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(lambda p: quantise(args.pngquant, args.quality, p), files))

    ok = sum(1 for s, _, _ in results if s == "ok")
    skipped = sum(1 for s, _, _ in results if s == "skip")
    warned = sum(1 for s, _, _ in results if s == "warn")
    before = sum(b for _, b, _ in results)
    after = sum(a for _, _, a in results)
    saved = before - after
    pct = (100 * saved / before) if before else 0
    print(f"Quantise (pngquant q{args.quality}): {ok}/{len(files)} PNGs quantised, "
          f"{skipped} left as-is, "
          f"{before/1e6:.1f} MB -> {after/1e6:.1f} MB (saved {saved/1e6:.1f} MB, {pct:.0f}%)"
          + (f"; {warned} pngquant warnings" if warned else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
