# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Wallarm product documentation repository, built with MkDocs and Material for MkDocs theme. The documentation is published at https://docs.wallarm.com/.

## Build Commands

### Local Development (using uv)

```bash
# Install dependencies (without insiders theme)
uv pip install -r requirements-no-insiders.txt

# Serve documentation locally (default: http://127.0.0.1:8000)
mkdocs serve -f mkdocs-6.x.yml    # Latest English docs (6.x version)
mkdocs serve -f mkdocs-5.0.yml    # Version 5.0 docs
```

### Build Static Site

```bash
mkdocs build -f mkdocs-6.x.yml    # Builds to site/ directory
```

### With Insiders Theme (requires token)

```bash
# Set CLONE_INSIDERS_TOKEN environment variable first
uv pip install -r requirements.txt
INSIDERS=true mkdocs serve -f mkdocs-6.x.yml
```

## Architecture

### Configuration Files

- `mkdocs-base.yml` - Base configuration inherited by all version-specific configs
- `mkdocs-6.x.yml` - Latest version (6.x) configuration with navigation structure
- `mkdocs-5.0.yml` - Version 5.0 configuration
- `mkdocs-ja-6.x.yml`, `mkdocs-tr-6.x.yml`, `mkdocs-pt-BR-4.8.yml`, `mkdocs-ar-4.10.yml` - Localized versions

### Directory Structure

- `docs/` - Documentation source files
  - `latest/` - Symlinked/working directory for current development
  - `6.x/`, `5.0/` - Version-specific English content
  - `ja/`, `tr/`, `pt-BR/`, `ar/` - Localized content directories
  - `latest-*` - Symlinks for localized latest versions
- `include/` - Reusable markdown snippets (English)
- `include-ja/`, `include-tr/`, etc. - Localized snippets
- `images/` - Static images and assets
- `stylesheets/` - Custom theme overrides (CSS, JS, HTML templates)

### Content Reuse

The repository uses MkDocs snippets extension for content reuse. Reusable content lives in `include/` directories and is referenced in docs using snippet syntax. Each language has its own include directory.

### Theme Customization

Custom styling is in `stylesheets/`:
- `main.html` - Main template override
- `extra_new.css` - Custom CSS
- `extra.js` - Custom JavaScript
- `partials/` - Template partials
