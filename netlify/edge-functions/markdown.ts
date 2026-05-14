// Markdown content negotiation for AI agents.
//
// When a client sends `Accept: text/markdown`, this edge function returns the
// page as Markdown (~80% smaller than the rendered HTML). Browsers and other
// clients see the original HTML response unchanged.
//
// Resolution order:
//   1. If the request has no `Accept: text/markdown`, pass through to origin.
//   2. Try the static `.md` companion this site already publishes for every
//      page (see scripts/generate_raw_markdown.py — runs during the Netlify
//      build). Page URL `/foo/bar/` maps to `/foo/bar.md`.
//   3. Fall back: fetch the HTML from origin, strip non-content chrome
//      (scripts, styles, nav, header, footer, sidebars), convert via Turndown.
//   4. On any error, return the original HTML response untouched.
//
// Test against a deployed URL:
//   curl -H "Accept: text/markdown" https://your-site.netlify.app/api-discovery/overview/
//
// Test locally (requires `npm i -g netlify-cli`):
//   netlify dev
//   curl -H "Accept: text/markdown" http://localhost:8888/api-discovery/overview/
//
// Adjust which paths the function runs on:
//   See the `[[edge_functions]]` block in netlify.toml at the repo root.
//   - `path` selects routes where the function is invoked.
//   - `excludedPath` carves out routes within `path`. Translations
//     (/ja, /tr, /pt-BR, /ar) and utility routes (/search, /sitemap.xml,
//     /robots.txt, /favicon.*) are excluded there.

import TurndownService from "npm:turndown@7.2.0";
import type { Context } from "https://edge.netlify.com";

const RESPONSE_HEADERS_BASE: Record<string, string> = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Content-Signal": "ai-train=yes, search=yes, ai-input=yes",
  "Access-Control-Allow-Origin": "*",
  "Vary": "Accept",
};

const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

async function fetchStaticMarkdown(url: URL): Promise<string | null> {
  // Page URLs are directory-style (/path/). The static companion is published
  // at /path.md next to the rendered directory (per generate_raw_markdown.py).
  const candidates: string[] = [];
  const path = url.pathname;
  if (path.endsWith("/")) {
    const stem = path.slice(0, -1);
    if (!stem) candidates.push("/index.md");
    else candidates.push(`${stem}.md`, `${stem}/index.md`);
  } else if (path.endsWith(".md")) {
    candidates.push(path);
  } else {
    candidates.push(`${path}.md`);
  }
  for (const candidate of candidates) {
    try {
      const res = await fetch(new URL(candidate, url));
      if (res.ok) return await res.text();
    } catch {
      // try next candidate
    }
  }
  return null;
}

function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "_",
  });
  td.remove(["script", "style", "noscript", "template", "nav", "header", "footer", "aside"]);
  td.addRule("stripMkdocsChrome", {
    filter: (node: { getAttribute?: (k: string) => string | null }) => {
      const cls = (node.getAttribute && node.getAttribute("class")) || "";
      return /\b(?:md-header|md-footer|md-sidebar|md-tabs|md-search|md-source|md-skip|md-feedback|md-nav)\b/.test(cls);
    },
    replacement: () => "",
  });
  return td.turndown(html).trim();
}

export default async (request: Request, context: Context): Promise<Response | void> => {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return; // implicit pass-through

  const url = new URL(request.url);

  try {
    const staticMd = await fetchStaticMarkdown(url);
    if (staticMd) {
      return new Response(staticMd, {
        headers: {
          ...RESPONSE_HEADERS_BASE,
          "X-Markdown-Tokens": String(estimateTokens(staticMd)),
          "X-Markdown-Source": "static",
        },
      });
    }
  } catch {
    // fall through to live conversion
  }

  let htmlResponse: Response;
  try {
    htmlResponse = await context.next();
  } catch {
    return; // origin failed; let Netlify return its own error page
  }

  if (!htmlResponse.ok) return htmlResponse;
  const contentType = htmlResponse.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return htmlResponse;

  try {
    const html = await htmlResponse.clone().text();
    const markdown = htmlToMarkdown(html);
    if (!markdown) return htmlResponse;
    return new Response(markdown, {
      headers: {
        ...RESPONSE_HEADERS_BASE,
        "X-Markdown-Tokens": String(estimateTokens(markdown)),
        "X-Markdown-Source": "edge-converted",
      },
    });
  } catch {
    return htmlResponse;
  }
};
