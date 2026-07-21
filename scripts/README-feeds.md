# Changelog feeds pipeline

`scripts/generate_feeds.py` publishes a release feed for each of Wallarm's three
independently-versioned node artifacts. Each feed aggregates that artifact's
history across every docs version; the feed URL never carries a version.

| Artifact | Atom | JSON |
|----------|------|------|
| NGINX Node | `/feeds/changelog-nginx-node.xml` | `/feeds/changelog-nginx-node.json` |
| Native Node | `/feeds/changelog-native-node.xml` | `/feeds/changelog-native-node.json` |
| connector code bundle | `/feeds/changelog-connectors-bundle.xml` | `/feeds/changelog-connectors-bundle.json` |

## Versioning model (why the code is shaped this way)

Wallarm ships these artifacts on **independent** version trains (see the
[Versioning Policy](../docs/latest/updating-migrating/versioning-policy.md)):

- **NGINX Node** — `5.x` / `6.x` / `7.x`. Its changelog is a separate full file
  per docs version (never a shared include) and mixes form factors that carry
  their **own** version series (e.g. the eBPF Helm chart at `0.23.x`). So an
  entry's line comes from the docs folder, not the version.
- **Native Node** — released independently of the NGINX Node; no breaking major
  split yet, so every release is on the `0.x` train (add a `1.x` rule to
  `native_lines` when it reaches 1.0). Its changelog is a single `latest/` file
  shared across docs sites, so the docs URL is derived from the version
  (`0.13.x-` → `/5.x/`, `0.14.x+` → `/`, `0.26.x+` → `/7.x/`).
- **connector code bundle** — per-connector version series (MuleSoft, Cloudflare,
  …). No node line; the connector name is the grouping axis.

## What it does

1. **Reads one config** — [`feeds.config.yml`](../feeds.config.yml).
2. **Resolves sources by following includes** (`--8<-- "latest/…"`), so the
   include topology is discovered at run time, not hardcoded.
3. **Parses** `### X.Y.Z (YYYY-MM-DD)` headings grouped under `##` sub-groups
   (form factor for nodes, connector name for the bundle). Anchors are derived
   exactly as the MkDocs `toc` extension derives them (default slugify + the
   `_1/_2/…` de-dup counter over every heading). Verified against the built HTML.
4. **Builds entries:**
   - **NGINX / Native Node — one entry per version.** The body has a
     `#### <form factor>` section per form factor, so a release is a single feed
     item (one notification), not one per form factor. The entry links to the
     first form factor's anchor on the page.
   - **connector code bundle — one entry per (connector, version).**
5. **Derives line + docs URL** per artifact (see the model above).
6. **Renders `<content>`** with the site's markdown extensions, rewriting
   relative links to absolute `docs.wallarm.com` URLs.
7. **Emits per product:** Atom (newest first, capped at `atom_max_entries`) and
   JSON (full current history, newest first).

### Fail-fast

Any version heading without a parseable `(YYYY-MM-DD)` date aborts the run with
the offending entries listed — no partial feeds. The run also self-validates the
Atom output (well-formed XML, >0 entries, unique `<id>`s, every entry
categorised) and exits non-zero on failure, aborting the deploy.

## JSON schema

Array, newest first. Each record:

| Field | Meaning |
|-------|---------|
| `product` | `nginx-node` \| `native-node` \| `connectors` |
| `version` | version string as written in the heading (e.g. `6.12.7`, `0.25.3`) |
| `line` | NGINX: `5.x`/`6.x`/`7.x`; Native: `0.x`; connectors: the connector name |
| `date` | `YYYY-MM-DD` |
| `url` | canonical deep link to the changelog entry |
| `summary` | first line of the entry, plain text |
| `body_markdown` | full entry body (for nodes, with a `#### <form factor>` section per form factor) |

## Running locally

```bash
pip install -r requirements.txt
python3 scripts/generate_feeds.py --output /tmp/out   # writes /tmp/out/feeds/*.xml|json
```

Open the files, or validate at `validator.w3.org/feed` (Validate by Direct Input),
or serve locally (`python3 -m http.server` in the feeds dir) and add the localhost
URL to a desktop RSS reader.

## Build integration

The feeds are generated straight into the published site by a step in the
`netlify.toml` build command, gated to **production deploys only** (same as the
raw-markdown step) — so nothing runs on PR previews or branch deploys. There are
no committed feed files and no separate CI job. The output is deterministic from
the changelog files + config, so the published feed changes only when a changelog
changes.

## Add a new line

- New NGINX line (e.g. 8.x): add the docs folder to `docs_versions` in
  `feeds.config.yml` (with its `nginx_line` + `url_prefix`).
- New Native train start (e.g. 1.0): add a rule to `native_lines`.

## End-of-life

When a docs version is removed (via `deprecate-guide-version`), that version's
releases simply drop out of the feeds on the next production build — their docs
pages no longer exist, so retaining the entries would only produce dead links.
No archive is kept. (If retaining deprecated-version history in the JSON ever
becomes a requirement, reintroduce a committed snapshot merged at build time.)

## Subscribe blocks + guide page

Each changelog page carries a compact "Subscribe" button + link, from a shared
snippet `include/subscribe/changelog-<product>.md`. The full how-to lives at
`docs/latest/updating-migrating/subscribe-to-release-updates.md` (wrapped into
every version) and is listed in each `llms.md`.
