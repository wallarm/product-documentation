/**
 * Cloudflare Worker in front of the static-assets binding (DEVOPS-5014).
 * Port of netlify/edge-functions/markdown-negotiation.ts, minus the User-Agent
 * and IP scraper blocks — those move to Cloudflare WAF / rate-limiting rules,
 * which do the same job in front of the Worker and cost nothing to run.
 *
 * Accept-header content negotiation for raw Markdown: when the caller sends
 * `Accept: text/markdown` (e.g. AI agents that prefer raw source over HTML),
 * serve the `.md` companion instead of the HTML page — the same convention
 * Stripe Docs uses. Without that header the request passes through to the
 * asset server. `Vary: Accept` keeps HTML and Markdown under separate cache
 * keys, and RFC 8288 `Link` headers advertise the alternates.
 *
 * This Worker only runs for extension-less (page) URLs — see the
 * `assets.run_worker_first` glob list in wrangler.jsonc. Everything else is
 * served straight off the asset server, which is where the `_headers` rules
 * apply. `_headers` does NOT apply to responses returned from Worker code, so
 * the site-wide security headers are re-applied here for the paths we do serve.
 */

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": "frame-ancestors *",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
};

const SERVICE_DOC_LINK = `</llms.txt>; rel="service-doc"; type="text/plain"`;

// Typed inline rather than via @cloudflare/workers-types: wrangler strips types
// with esbuild and never typechecks, so the dependency would only serve editors.
interface Env {
  ASSETS: { fetch(input: Request | URL | string): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Anything that already names a file (`.png`, `.json`, fonts, …) is not a
    // negotiation candidate. run_worker_first should keep those away from us,
    // but a glob miss must not break the asset.
    if (/\.[a-zA-Z0-9]+$/.test(path)) {
      return env.ASSETS.fetch(request);
    }

    // scripts/generate_raw_markdown.py writes one companion per page:
    //   /              →  /index.md
    //   /foo/bar[/]    →  /foo/bar.md
    //   /7.x/foo[/]    →  /7.x/foo.md   (version prefix already in the path)
    const stem = path === "/" ? "/index" : path.replace(/\/$/, "");
    const mdHref = `${stem}.md`;

    const wantsMarkdown = (request.headers.get("accept") ?? "")
      .split(",")
      .some((t) => t.trim().toLowerCase().startsWith("text/markdown"));

    if (wantsMarkdown) {
      const md = await env.ASSETS.fetch(new URL(mdHref, url.origin));
      if (md.ok) {
        return markdownResponse(await md.text());
      }
      // No companion at this path (orphan HTML, redirect target, …) — serving
      // the HTML page beats 404'ing the request.
    }

    return htmlResponse(await env.ASSETS.fetch(request), mdHref);
  },
};

/** HTML page: advertise the Markdown alternate, keep caches honest. */
function htmlResponse(upstream: Response, mdHref: string): Response {
  const response = new Response(upstream.body, upstream);
  applySecurityHeaders(response.headers);
  response.headers.set("Vary", mergeVary(response.headers.get("Vary"), "Accept"));
  appendLink(response.headers, SERVICE_DOC_LINK);
  appendLink(response.headers, `<${mdHref}>; rel="alternate"; type="text/markdown"`);
  return response;
}

function markdownResponse(body: string): Response {
  const headers = new Headers({
    // Forced explicitly so a future change to _headers cannot regress it.
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    // `Vary: Accept` tells well-behaved caches to keep HTML and Markdown under
    // separate keys, but intermediate proxies sometimes ignore Vary entirely.
    // `private` keeps this out of shared caches, so a non-Accept request can
    // never be served stale Markdown. Slightly less CDN-efficient, much safer.
    "Cache-Control": "private, max-age=3600",
    // Emerging "Content-Signal" standard: explicit signal to AI crawlers that
    // this content is OK to ingest for search, prompt context, and training —
    // we want Wallarm's docs surfaced in current and future AI models.
    "Content-Signal": "ai-train=yes, search=yes, ai-input=yes",
    // Rough token estimate (1 token ≈ 4 chars) so clients can budget context.
    "X-Markdown-Tokens": Math.ceil(body.length / 4).toString(),
    Link: SERVICE_DOC_LINK,
  });
  applySecurityHeaders(headers);
  return new Response(body, { status: 200, headers });
}

function applySecurityHeaders(headers: Headers): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
}

/** Append `value` to a comma-separated `Vary` header, deduplicating. */
export function mergeVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.some((p) => p.toLowerCase() === value.toLowerCase())) return existing;
  parts.push(value);
  return parts.join(", ");
}

/** Add an RFC 8288 link to the response's `Link` header, preserving existing values. */
export function appendLink(headers: Headers, link: string): void {
  const existing = headers.get("Link");
  headers.set("Link", existing ? `${existing}, ${link}` : link);
}
