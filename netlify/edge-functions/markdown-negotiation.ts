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

// User-Agent signatures we hard-block:
//  - Deno: a JS runtime, never a real browser — the heaviest non-browser
//    channel the scraper uses.
//  - Stale Chrome majors the scraper pins itself to (119, 125): real users have
//    auto-updated far past these. To spare the near-zero genuine visitor still
//    on one, we additionally require the ABSENCE of headers every real Chromium
//    request carries (accept-language / sec-fetch-dest / sec-ch-ua) — a real
//    Chrome-119/125 browser sends them and passes; the header-less scraper does not.
// The rotating pool of CURRENT browser versions (Chrome 131-146, Firefox,
// Safari 18) is deliberately NOT matched — those strings are what real visitors
// send, so they can only be separated by fingerprint/behaviour (a bot-management
// layer's job), not by User-Agent.
const DENO_UA = /\bDeno\//;
const STALE_CHROME_UA = /\bChrome\/(?:119|125)\b/;

// Hard denylist by CIDR FAMILY (not single IPs): the scraper allocates
// sequential proxy /24 blocks and rotates within them, so blocking the whole
// range beats chasing individual addresses. These two /24s covered ~160 of the
// unique IPs seen in the wave. Matched on the REAL visitor IP from Cloudflare's
// CF-Connecting-IP header — the site sits behind Cloudflare, so context.ip is
// Cloudflare's edge IP, not the client. Still a stopgap; the durable fix is
// fingerprint-based bot management at the Cloudflare edge.
const BLOCKED_CIDRS = [
  // Sequential proxy /24 pools the scraper allocates from (Alibaba/Asian hosting):
  // consecutive addresses ALL hammering => an allocated proxy block, not real users.
  "47.82.201.0/24",
  "43.119.100.0/24",
  // Heaviest current scraper single IPs, kept as narrow /32s so no neighbour is
  // caught. AWS addresses are ephemeral/shared, so only these two confirmed top
  // talkers are hard-blocked; revisit later.
  "54.196.3.183/32",  // 89K req / 2.88 GB
  "54.177.162.30/32", // 31.8K req / 1 GB
  // NOTE: shared-hosting /24s (Linode, Hurricane Electric, etc.) are deliberately
  // NOT hard-blocked here — a /24 on a multi-tenant provider can catch unrelated
  // customers. Those go through a Cloudflare Managed Challenge (which never hard-
  // blocks a real visitor) or a /32 after verification, not a blind /24 block.
];

/** Parse an IPv4 string to a 32-bit unsigned int, or null if not valid IPv4. */
function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    const o = Number(part);
    if (!Number.isInteger(o) || o < 0 || o > 255) return null;
    n = n * 256 + o;
  }
  return n >>> 0;
}

/** True if IPv4 `ip` falls inside CIDR `a.b.c.d/bits`. */
export function inCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split("/");
  const bits = Number(bitsStr);
  const ipN = ipv4ToInt(ip);
  const rangeN = ipv4ToInt(range);
  if (ipN === null || rangeN === null || !Number.isInteger(bits) || bits < 0 || bits > 32) {
    return false;
  }
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipN & mask) === (rangeN & mask);
}

/** Real visitor IP. Behind Cloudflare, use CF-Connecting-IP; fall back to the
 *  first X-Forwarded-For entry, then the direct connection IP. */
function clientIp(request: Request, context: Context): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    context.ip ||
    ""
  );
}

/**
 * True if the request's User-Agent is one we hard-block. Pure (headers only) so
 * it is unit-testable. Deno is blocked outright; a stale Chrome major is blocked
 * only when it also lacks the headers a genuine Chromium browser always sends,
 * so a real (near-extinct) Chrome-119/125 visitor is not caught.
 */
export function isScraper(headers: Headers): boolean {
  const ua = headers.get("user-agent") ?? "";
  // Never touch self-identifying crawlers (Googlebot, Amazonbot, bingbot,
  // PetalBot, …). Some declare a stale Chrome token — Amazonbot rides on
  // Chrome/119 — which would otherwise trip the stale-Chrome rule below. The
  // scraper uses plain browser UAs with no bot/spider/crawler token, so it is
  // unaffected by this allowance.
  if (/bot|spider|crawl/i.test(ua)) return false;
  if (DENO_UA.test(ua)) return true;
  if (STALE_CHROME_UA.test(ua)) {
    const looksLikeRealBrowser =
      headers.has("accept-language") &&
      headers.has("sec-fetch-dest") &&
      headers.has("sec-ch-ua");
    return !looksLikeRealBrowser;
  }
  return false;
}

export default async (request: Request, context: Context) => {
  // (0) IP denylist by CIDR family — matched on the real visitor IP
  // (CF-Connecting-IP behind Cloudflare), before anything else.
  const ip = clientIp(request, context);
  if (ip && BLOCKED_CIDRS.some((cidr) => inCidr(ip, cidr))) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "cache-control": "no-store" },
    });
  }

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
