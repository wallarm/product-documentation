#!/bin/bash
# Local dev server with images
# Usage: ./serve.sh [mkdocs-config.yml]
# Example: ./serve.sh mkdocs-5.0.yml

CONFIG="${1:-mkdocs-6.x.yml}"
DOCS_DIR=$(grep 'docs_dir:' "$CONFIG" | awk '{print $2}')

rm -rf site/ .cache/
cp -R images/ "$DOCS_DIR/images/"
trap "rm -rf $DOCS_DIR/images/" EXIT

zensical serve -f "$CONFIG"
