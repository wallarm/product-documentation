/**
 * Two jobs, in order:
 *
 * 1. Block a distributed image/page scraper. A pool of ~20,000 IPs all send one
 *    frozen User-Agent — "…Intel Mac OS X 10… Chrome/125…" — and hammer images
 *    (~520 GB/6h), then HTML pages and /search.json (136 GB) once images were
 *    blocked. Real traffic to those paths is on current browsers (Chrome
 *    136-149, Safari 17); none is on the frozen Chrome 125, and we additionally
 *    require the headers every genuine Chromium request carries, so a real
 *    Chrome-125 visitor still passes and honest crawlers (Googlebot, Amazonbot,
 *    ClaudeBot, …) never match. This check is the FIRST thing the function does,
 *    so a matched request is 403'd before any origin fetch — no bandwidth spent,
 *    and no dependency on edge-function ordering. Fully reversible: delete the
 *    isScraper block.
 *
 * 2. Accept-header content negotiation for raw Markdown. When the caller sends
 *    `Accept: text/markdown` (e.g. AI agents that prefer raw source over HTML),
 *    serve the `.md` companion file instead of the HTML page — same convention
 *    Stripe Docs uses. Without that header, requests pass through and Netlify
 *    serves HTML as usual. Vary: Accept is added so caches keep HTML and
 *    Markdown variants under separate keys.
 *
 * Scope (config.path = "/*") covers pages, images, and /search.json so the
 * block reaches every path the scraper abuses; the in-function extension check
 * short-circuits negotiation for non-page URLs. Cheap/cacheable assets
 * (.css/.js/fonts/stylesheets, hashed and served straight from cache) are
 * excludedPath'd so the function never even loads for them — the scraper can't
 * reach them anyway once its page requests 403.
 */

import type { Context } from "@netlify/edge-functions";

// Frozen scraper signature: Chrome major 125 paired with "Intel Mac OS X 10".
const SCRAPER_UA = /\bChrome\/125\b/;
const SCRAPER_PLATFORM = /Intel Mac OS X 10/;

/**
 * True if the request is the frozen-UA scraper. Pure (headers only) so it is
 * unit-testable. Requires the stale signature AND the absence of headers every
 * genuine Chromium request carries on subresource loads over TLS, so a real
 * (near-extinct) Chrome-125 browser is not caught.
 */
export function isScraper(headers: Headers): boolean {
  const ua = headers.get("user-agent") ?? "";
  if (!SCRAPER_UA.test(ua) || !SCRAPER_PLATFORM.test(ua)) return false;
  const looksLikeRealBrowser =
    headers.has("accept-language") &&
    headers.has("sec-fetch-dest") &&
    headers.has("sec-ch-ua");
  return !looksLikeRealBrowser;
}

export default async (request: Request, context: Context) => {
  // (1) Scraper block — first, before any origin fetch, on every scoped path.
  if (isScraper(request.headers)) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "cache-control": "no-store" },
    });
  }

  // (2) Markdown negotiation — pages only.
  const url = new URL(request.url);
  const path = url.pathname;

  // Bypass for any path that already names a file (`.png`, `.json`, fonts, …).
  // Doc pages are directory-style URLs with no extension, so anything with one
  // is not a candidate for negotiation — but the block above already ran for it.
  if (/\.[a-zA-Z0-9]+$/.test(path)) {
    return;
  }

  const wantsMarkdown = (request.headers.get("accept") ?? "")
    .split(",")
    .some((t) => t.trim().toLowerCase().startsWith("text/markdown"));

  const stem = path === "/" ? "/index" : path.replace(/\/$/, "");
  const mdHref = `${stem}.md`;

  if (!wantsMarkdown) {
    // Standard HTML response, but:
    //   1. Flag the alternate Markdown representation for caches via Vary so
    //      they keep separate slots for HTML and Markdown variants.
    //   2. Advertise the .md companion as a Link header (RFC 8288) plus the
    //      site-wide /llms.txt service-doc — a second discovery channel for
    //      agents that consume HTTP headers without parsing the HTML <head>.
    const response = await context.next();
    response.headers.set("Vary", mergeVary(response.headers.get("Vary"), "Accept"));
    appendLink(response.headers, `</llms.txt>; rel="service-doc"; type="text/plain"`);
    appendLink(response.headers, `<${mdHref}>; rel="alternate"; type="text/markdown"`);
    return response;
  }

  // Caller asked for Markdown. Fetch the pre-built .md companion. The
  // generator at scripts/generate_raw_markdown.py writes one of these for
  // every page:
  //   /                       →  /index.md     (root home)
  //   /foo/bar/    or  /foo/bar →  /foo/bar.md
  //   /7.x/foo/    or  /7.x/foo →  /7.x/foo.md (per-version URL prefix
  //                                              already baked into the path)
  let mdResp: Response;
  try {
    mdResp = await fetch(new URL(mdHref, url.origin));
  } catch (err) {
    // Network failure fetching the companion (timeout, DNS, edge-to-origin
    // hiccup, etc.). Don't 500 the user — fall back to the HTML page.
    console.error("markdown-negotiation: companion fetch failed:", err);
    const fallback = await context.next();
    fallback.headers.set("Vary", mergeVary(fallback.headers.get("Vary"), "Accept"));
    appendLink(fallback.headers, `</llms.txt>; rel="service-doc"; type="text/plain"`);
    appendLink(fallback.headers, `<${mdHref}>; rel="alternate"; type="text/markdown"`);
    return fallback;
  }

  if (!mdResp.ok) {
    // No .md companion at this path (orphan HTML, redirect target, etc.).
    // Serve HTML instead — better than 404'ing the request.
    const fallback = await context.next();
    fallback.headers.set("Vary", mergeVary(fallback.headers.get("Vary"), "Accept"));
    appendLink(fallback.headers, `</llms.txt>; rel="service-doc"; type="text/plain"`);
    return fallback;
  }

  // Read body so we can compute size-based headers (token estimate). The
  // .md output is bounded (~50 KB worst case), so buffering is fine.
  const body = await mdResp.text();

  const headers = new Headers(mdResp.headers);
  // Always force the Markdown content type; the upstream response carries
  // the right type already, but we set it explicitly so a future change to
  // the static header rules in netlify.toml can't accidentally regress this.
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Vary", mergeVary(headers.get("Vary"), "Accept"));
  // Vary: Accept tells well-behaved caches to keep HTML and Markdown under
  // separate keys, but intermediate proxies sometimes ignore Vary entirely.
  // `private` keeps this response out of shared caches — only the
  // originating browser can store it — so a non-Accept request can never
  // be served stale Markdown. Slightly less CDN-efficient, much safer.
  headers.set("Cache-Control", "private, max-age=3600");
  // Emerging "Content-Signal" standard (Netlify's own AI-pages template
  // uses it): explicit signal to AI crawlers that this content is OK to
  // ingest for search, as prompt context, AND for model training — we want
  // Wallarm's docs surface in current and future AI models.
  headers.set("Content-Signal", "ai-train=yes, search=yes, ai-input=yes");
  // Rough token estimate (1 token ≈ 4 chars) so clients can budget context.
  headers.set("X-Markdown-Tokens", Math.ceil(body.length / 4).toString());
  // Site-wide service-doc Link (used to live in netlify.toml on every "/*"
  // response — moved here so asset/font/image responses don't carry it).
  appendLink(headers, `</llms.txt>; rel="service-doc"; type="text/plain"`);
  return new Response(body, { status: 200, headers });
};

/** Append `value` to a comma-separated `Vary` header, deduplicating. */
function mergeVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.some((p) => p.toLowerCase() === value.toLowerCase())) return existing;
  parts.push(value);
  return parts.join(", ");
}

/** Add an RFC 8288 link to the response's `Link` header, preserving any
 *  existing values (e.g. the site-wide `service-doc` link from netlify.toml). */
function appendLink(headers: Headers, link: string): void {
  const existing = headers.get("Link");
  headers.set("Link", existing ? `${existing}, ${link}` : link);
}

export const config = {
  path: "/*",
  // Skip cheap/cacheable assets so the function never loads for them: hashed
  // JS/CSS/maps, fonts, PDFs, stylesheets, and the raw .md/.txt/.xml companions.
  // Images and .json (search index) are DELIBERATELY not excluded — the scraper
  // abuses them directly, and the block above must reach them. Pages have no
  // extension and are always covered.
  excludedPath: [
    "/*.md",      "/**/*.md",
    "/*.txt",     "/**/*.txt",
    "/*.xml",     "/**/*.xml",
    "/*.css",     "/**/*.css",
    "/*.js",      "/**/*.js",
    "/*.map",     "/**/*.map",
    "/*.pdf",     "/**/*.pdf",
    "/*.woff",    "/**/*.woff",
    "/*.woff2",   "/**/*.woff2",
    "/*.ttf",     "/**/*.ttf",
    "/*.otf",     "/**/*.otf",
    "/stylesheets/**",
  ],
};
