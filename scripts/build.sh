#!/usr/bin/env bash
# Full multi-version site build. Extracted verbatim from the `[build] command`
# in netlify.toml so Netlify and Cloudflare run the same steps (DEVOPS-5014).
# netlify.toml is left untouched until the DNS cutover is verified — until then
# the two copies must be kept in sync.
#
# CONTEXT mirrors Netlify's variable: "production" enables the expensive
# production-only steps (image optimisation, raw markdown, OG images, feeds).
# Anything else (PR preview, branch build) skips them to keep builds fast.
#
# SKIP_IMAGE_OPTIMISATION=1 drops just the image pass while keeping the rest of
# a production build. The pass downloads x86_64 Linux binaries (pngquant,
# oxipng), so without this the script cannot run in production mode on a
# developer machine — and the markdown companions the Worker serves are only
# generated in production mode, so they would otherwise be untestable locally.
set -euo pipefail

CONTEXT="${CONTEXT:-deploy-preview}"

pip3 install --no-cache-dir -r requirements.txt

# The lazy-loading markdown extension (mdx_lazy_images) lives at the repo root;
# make it importable for every `zensical build` below.
export PYTHONPATH="$PWD"

# Image optimisation, two passes, before any per-version build copies the
# directory. Both run on the ephemeral CI checkout — full-resolution originals
# stay in git. Together they take images/ from ~191 MB to ~63 MB (oxipng alone
# managed only ~121 MB); the top bandwidth consumers in analytics roughly halve.
#
# 1. Quantise (scripts/optimize_images.py -> pngquant): the heavy images are
#    24-bit true-colour retina screenshots, but UI screenshots use few real
#    colours, so quantising to a <=256-colour palette (what TinyPNG does) roughly
#    halves each file with no visible loss and keeps the .png extension, so no
#    markdown references change. --quality=65-95 SKIPS any image it cannot
#    quantise cleanly (gradients/photos), --skip-if-larger never writes a bigger
#    file.
# 2. oxipng: losslessly recompress every PNG. --strip safe keeps colour profile
#    and gamma metadata. -o 2 is the recommended speed/size tradeoff for batch
#    use. Runs AFTER quantise so it squeezes the palette PNGs further.
if [ "$CONTEXT" = "production" ] && [ -n "${SKIP_IMAGE_OPTIMISATION:-}" ]; then
  echo "Skipping image optimisation (SKIP_IMAGE_OPTIMISATION set)"
elif [ "$CONTEXT" = "production" ]; then
  echo "Image size before optimisation: $(du -sh images/ | cut -f1) ($(find images/ -name '*.png' | wc -l) PNGs)"
  curl -fsSL https://pngquant.org/pngquant-linux.tar.bz2 | tar xj pngquant
  python3 scripts/optimize_images.py images/ --pngquant ./pngquant
  curl -fsSL https://github.com/oxipng/oxipng/releases/download/v10.1.1/oxipng-10.1.1-x86_64-unknown-linux-gnu.tar.gz | tar xz --strip-components=1 oxipng-10.1.1-x86_64-unknown-linux-gnu/oxipng
  ./oxipng -r -o 2 --strip safe -q images/
  echo "Image size after  optimisation: $(du -sh images/ | cut -f1)"
else
  echo "Skipping image optimisation (CONTEXT=$CONTEXT — only runs on production deploys)"
fi

# Raw .md companion files (scripts/generate_raw_markdown.py) only ship on
# production. The companions power the "Copy as Markdown" button — readers only
# ever fetch them from docs.wallarm.com, so previews skip the step to save build
# minutes. On previews the button falls back to its "Failed to copy" snackbar,
# which is the expected dev UX.
build_version() {
  local docs_dir="$1" config="$2" og_only="${3:-}"
  cp -R images/ "docs/${docs_dir}/images/"
  zensical build -f "$config"
  if [ "$CONTEXT" = "production" ]; then
    [ "$og_only" = "og-only" ] || python3 scripts/generate_raw_markdown.py "$config"
    python3 scripts/generate_og_images.py "$config"
  fi
  rm -rf "docs/${docs_dir}/images/"
}

build_version 6.x mkdocs-6.x.yml
build_version 7.x mkdocs-7.x.yml
build_version 5.0 mkdocs-5.0.yml
build_version deprecated mkdocs-deprecated.yml og-only

# Aggregated changelog feeds (Atom + RSS + JSON), one per node artifact. Reads
# the changelog files from docs/, self-validates, and aborts the deploy on a
# broken changelog. Production only. See scripts/README-feeds.md.
if [ "$CONTEXT" = "production" ]; then
  python3 scripts/generate_feeds.py --output site
fi
