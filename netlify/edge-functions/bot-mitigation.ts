/**
 * Block a distributed image-scraper without touching real users or honest bots.
 *
 * Incident: a distributed scraper from a pool of ~20,000 IPs that ALL send one
 * frozen User-Agent — "…Intel Mac OS X 10… Chrome/125…". It first hammered
 * image/png (~520 GB / 8.6M req in 6h); once images were blocked it shifted to
 * HTML pages (e.g. 1.1M req / 15.3 GB on one page in 10h), so the block now
 * covers the whole site, not just /images/*. Blocking the page 403s before any
 * HTML is served, so the scraper also stops pulling that page's sub-resources
 * (rum, extra.js, css, …).
 *
 * Safe to apply site-wide: real traffic to these pages is on current browsers
 * (Chrome 136-149, Safari 17, …) — not one is on the frozen Chrome 125 — and we
 * additionally require the signature AND absence of headers every genuine
 * Chromium request carries, so a real Chrome-125 visitor (near-extinct, but
 * possible) still passes. Honest crawlers (Googlebot, Amazonbot, ClaudeBot, …)
 * send their own UA and never match.
 *
 * Fully reversible: delete this file. Validate after deploy that the Chrome/125
 * bandwidth drops while Googlebot/Amazonbot and human metrics stay flat.
 */

import type { Config, Context } from "@netlify/edge-functions";

// The exact frozen signature the scraper pins itself to. Deliberately narrow:
// only Chrome major 125 paired with the "Intel Mac OS X 10" platform string.
const SCRAPER_UA = /\bChrome\/125\b/;
const SCRAPER_PLATFORM = /Intel Mac OS X 10/;

/**
 * Decide whether a request is the scraper. Exported for unit testing — pure,
 * depends only on request headers.
 */
export function isScraper(headers: Headers): boolean {
  const ua = headers.get("user-agent") ?? "";
  if (!SCRAPER_UA.test(ua) || !SCRAPER_PLATFORM.test(ua)) {
    return false; // not the frozen signature — leave it alone
  }
  // Real Chromium sends all of these on subresource (image) requests over TLS.
  // A bare-GET scraper spoofing only the UA typically omits at least one, so a
  // genuine Chrome-125 user (who sends them all) is NOT blocked.
  const looksLikeRealBrowser =
    headers.has("accept-language") &&
    headers.has("sec-fetch-dest") &&
    headers.has("sec-ch-ua");
  return !looksLikeRealBrowser;
}

export default async (request: Request, _context: Context) => {
  if (!isScraper(request.headers)) {
    return; // pass through to the normal asset response
  }
  return new Response("Forbidden", {
    status: 403,
    // no-store so this per-request decision is never cached and served to
    // someone else; the block is evaluated fresh on every request.
    headers: { "cache-control": "no-store" },
  });
};

export const config: Config = {
  // Site-wide: the scraper moved from images to HTML pages. Blocking the page
  // 403s before HTML is served, so it never fetches that page's sub-resources.
  path: "/*",
  // Skip the content-hashed, immutable theme bundles under /assets/*: they are
  // cache-friendly and not an independent scraper target (a blocked page yields
  // no HTML, so those are never requested). Excluding them avoids spending edge
  // invocations on legitimate cached-asset traffic (credit-based Pro plan).
  excludedPath: ["/assets/*"],
};
