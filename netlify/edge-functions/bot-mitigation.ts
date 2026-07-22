/**
 * Block a distributed image-scraper without touching real users or honest bots.
 *
 * Incident: ~520 GB / 8.6M requests in 6h, all image/png, from a pool of
 * ~20,000 IPs that ALL send one frozen User-Agent — "…Intel Mac OS X 10…
 * Chrome/125…". Real browsers show diverse, current UAs; a single stale UA
 * (Chrome 125 shipped May 2024) across millions of requests and thousands of
 * IPs is a UA-spoofing scraper. Honest crawlers (Googlebot, Amazonbot, …) send
 * their own UA and never match this signature, so they are unaffected.
 *
 * Scoped to /images/* only, so a rare false positive still gets readable HTML
 * pages — just missing images — rather than a blocked site. And we require the
 * signature AND absence of headers every genuine Chromium request carries, so
 * an actual Chrome-125 visitor (near-extinct, but possible) passes through.
 *
 * Fully reversible: delete this file. Validate after deploy that the 520 GB
 * drops while Googlebot/Amazonbot and human metrics stay flat.
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
  path: "/images/*",
};
