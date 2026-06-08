/**
 * Accept-header content negotiation for raw Markdown.
 *
 * When the caller sends `Accept: text/markdown` (e.g. AI agents that prefer
 * raw source over HTML), this function serves the `.md` companion file
 * instead of the HTML page — same convention Stripe Docs uses. Without that
 * header, requests pass through and Netlify serves HTML as usual.
 *
 * Vary: Accept is always added to the response so any CDN, browser, or proxy
 * caches the HTML and Markdown variants under separate keys.
 *
 * Path scoping (config.path = "/*") is intentionally broad; this function
 * short-circuits for any URL whose path already names a file (anything with
 * an extension like `.md`, `.png`, `.css`, `.xml`, ...), so asset requests
 * are not affected.
 */

import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Bypass for any path that already names a file (`.md`, `.png`, `.css`,
  // `.xml`, `llms*.txt`, fonts, …). Doc pages are directory-style URLs with
  // no extension, so anything with one is not a candidate for negotiation.
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
  headers.set("Content-Signal", "ai-train=no, search=yes, ai-input=yes");
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
  // Skip asset paths so the function never even loads for them. Netlify's
  // glob: `*` matches a single segment, `**` matches multi-segment — most
  // of our assets are deep (e.g. `/images/about-wallarm-waf/foo.png`,
  // `/installation/nginx/all-in-one.md`), so we list both flat and nested.
  // The in-function extension regex still catches anything missed here.
  excludedPath: [
    "/*.md",      "/**/*.md",
    "/*.txt",     "/**/*.txt",
    "/*.xml",     "/**/*.xml",
    "/*.json",    "/**/*.json",
    "/*.css",     "/**/*.css",
    "/*.js",      "/**/*.js",
    "/*.map",     "/**/*.map",
    "/*.png",     "/**/*.png",
    "/*.jpg",     "/**/*.jpg",
    "/*.jpeg",    "/**/*.jpeg",
    "/*.gif",     "/**/*.gif",
    "/*.svg",     "/**/*.svg",
    "/*.webp",    "/**/*.webp",
    "/*.ico",     "/**/*.ico",
    "/*.pdf",     "/**/*.pdf",
    "/*.woff",    "/**/*.woff",
    "/*.woff2",   "/**/*.woff2",
    "/*.ttf",     "/**/*.ttf",
    "/*.otf",     "/**/*.otf",
    "/images/**",
    "/stylesheets/**",
  ],
};
