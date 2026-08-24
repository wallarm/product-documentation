# Cloudflare deployment

Hosting for docs.wallarm.com on **Workers Static Assets**. Tracked in
[DEVOPS-5014](https://wallarm.atlassian.net/browse/DEVOPS-5014).

Netlify still builds and serves production. Nothing here is live until the
cutover, and `netlify.toml` is deliberately untouched so rollback stays trivial.

## What lives where

| Concern | Here | infra/cloudflare-iac |
|---|---|---|
| Build | `scripts/build.sh` | — |
| Deploy config | `wrangler.jsonc` | — |
| Response headers | `docs/6.x/_headers` | `Vary`, `Link` for negotiable pages |
| Redirects | `docs/6.x/_redirects` | legacy `/2.x`–`/4.10` catch-all |
| `Accept: text/markdown` | `.md` companions from the build | the rewrite rules |
| DNS, WAF, bot management | — | all of it |

There is **no Worker script**. Static Assets is served by a code-less Worker
entry, which is why asset requests are free and never invoke anything.

## Workers Builds settings

**Dashboard only.** There is no API or Terraform path: the Workers Builds
endpoints all reject an account-scoped token (`400` / `12006 Invalid token`),
and the Git connection is a GitHub App install that has to be authorized
interactively. So this cannot live in `infra/cloudflare-iac` with the rest of
the Cloudflare config, and the settings are recorded here instead.

Connecting it needs **both**:

* Cloudflare dashboard access on the Wallarm account
* GitHub **owner** or *GitHub Apps Manager* on the `wallarm` org, to install the
  Cloudflare Workers & Pages app. Scope it to `product-documentation` only
  ("Only select repositories") rather than the whole org.

Then set:

| Setting | Value |
|---|---|
| Repository | `wallarm/product-documentation` |
| Production branch | `master` |
| Build command | `git submodule update --init --recursive && scripts/build.sh` |
| Deploy command | `npx wrangler deploy` |
| Non-production deploy command | `npx wrangler versions upload` |
| Build variable | `CONTEXT=production` |
| Build variable | `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` |

Notes on each of those:

* **Submodules are not cloned automatically.** The build fails without them —
  terraform module snippets are included from `docs/latest/`. Both submodules
  are public, so anonymous HTTPS is enough.
* **Python** is pinned by `.python-version` (3.14). The build image defaults to
  3.13.
* **`CONTEXT=production`** is what enables image optimisation, the `.md`
  companions, OG images and feeds. Without it the companions are not generated
  and markdown negotiation returns 404s. `scripts/build.sh` mirrors the variable
  Netlify sets, so the two stay comparable.
* **`PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`** — `package.json` carries puppeteer for
  the PDF tooling, which the docs build does not use. Workers Builds installs
  dependencies automatically, and without this it downloads ~170 MB of Chromium
  on every build.

### The first build is safe

`wrangler deploy` with no `--env` targets the **production** Worker,
`wallarm-docs`, which does not exist yet — the first `master` build creates it.
That does not move any traffic: routes are owned by Terraform in
`infra/cloudflare-iac`, and no route points at `wallarm-docs`. Until one is
added at cutover, docs.wallarm.com continues to be served by Netlify and the new
Worker sits there receiving nothing.

So Workers Builds can be connected, run, and iterated on well before the
cutover, which is the point of doing it as a separate step.

**One thing to confirm on the first PR build:** `workers_dev` is `false` and
`preview_urls` is `true`. Cloudflare disables preview URLs by default when
`workers_dev` is off; the explicit `preview_urls: true` is meant to override
that, but this combination has not been exercised yet. If a PR build produces no
preview URL, that is the cause.

Build takes roughly 3-6 minutes on a 4-vCPU runner; measured at 1m35s wall
clock locally with 518s of CPU across 6 cores. The platform timeout is 20
minutes, so there is comfortable headroom.

## Preview builds do not test routing

Previews are served from `*.workers.dev`, and **zone rules do not apply there**.
Verified against staging:

| | `*.workers.dev` | `docs-staging.wallarm.com` |
|---|---|---|
| `Accept: text/markdown` | `text/html` | `text/markdown` |
| `/4.8/admin-en/foo/` | `404` | `301` |
| `Vary` | absent | present |

So a preview shows **content** accurately but not **routing**. Any change to
redirects, headers or markdown negotiation must be checked on
`docs-staging.wallarm.com`, which is a real hostname on the zone and behaves
exactly like production.

For the same reason `workers_dev` is `false` on production: it would publish the
whole site a second time with no redirects, no negotiation, no WAF, and
indexable by search engines.

## Two things that will break the build

**Redirect ordering.** Cloudflare rejects the entire deployment past 100
dynamic `_redirects` rules, and counts every rule appearing *after the first
wildcard rule* toward that budget regardless of its own shape. Plain rules go
above the wildcard block at the bottom of the file.

**Missing markdown companions.** `scripts/check_markdown_companions.py` fails
the build if a page has no `.md`. This is deliberate: the negotiation is a blind
URL rewrite, so a missing companion does not fall back to HTML — it returns the
404 page labelled `Content-Type: text/markdown`. Its exemption list must stay in
sync with `local.md_no_companion` in the IaC repo.

## Cutover

1. Connect Workers Builds with the settings above; confirm a `master` build
   deploys and a PR gets a preview.
2. Widen the zone rules in `infra/cloudflare-iac` from
   `docs-staging.wallarm.com` to include `docs.wallarm.com`.
3. Point Cloudflare's record for the proxied hostname at the Worker. **This is a
   Cloudflare-side DNS change, not a Route53 one** — `wallarm.com` is a partial
   zone, and Route53 already delegates `docs` to Cloudflare. Today that record
   reads `CNAME docs.wallarm.com -> pensive-dubinsky-5f7a00.netlify.app`.
4. Verify, then ask Anastasiia Popova to check.
5. Once stable, delete `netlify.toml`, `netlify/`, and the duplication between
   `scripts/build.sh` and the Netlify build command.

**Rollback** is restoring that one CNAME to the Netlify value. Netlify keeps
building from the same branch throughout, so its copy stays current.

`cloudflare_workers_custom_domain` does **not** work here: Custom Domains refuse
a hostname that already carries a CNAME and are documented against full zones.
Production takes the same route-based binding staging uses.
