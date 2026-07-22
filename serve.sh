#!/bin/bash
# Local dev server with images
# Usage: ./serve.sh [mkdocs-config.yml]
# Example: ./serve.sh mkdocs-5.0.yml

CONFIG="${1:-mkdocs-6.x.yml}"
DOCS_DIR=$(grep 'docs_dir:' "$CONFIG" | awk '{print $2}')

rm -rf site/ .cache/
cp -R images/ "$DOCS_DIR/images/"
trap "rm -rf $DOCS_DIR/images/" EXIT

# Repo root on PYTHONPATH so the local mdx_lazy_images markdown extension imports.
PYTHONPATH="$(pwd)${PYTHONPATH:+:$PYTHONPATH}" zensical serve -f "$CONFIG"
