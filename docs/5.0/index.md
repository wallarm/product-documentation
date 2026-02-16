---
hide:
  - navigation
  - toc
  - feedback
---

# Wallarm Documentation

Everything you need to discover your APIs, MCPs, and AI agents, protect them from threats, and test for vulnerabilities.

!!! info "Newer version is available"
    The newer version of the Wallarm node has been released. [What is new in the latest version](/updating-migrating/what-is-new/)

<div class="homepage-actions">
  <!-- Search will be moved here from the header via JS (desktop only) -->
  <div id="homepage-search-mount"></div>

  <button type="button" class="homepage-btn homepage-btn-ai" onclick="if(window.openInkeepChat) window.openInkeepChat();">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
    </svg>
    <span>Ask AI</span>
  </button>
</div>

<!-- Row 1: Introduction -->
<div class="navigation navigation-1col">
  <div class="navigation-card homepage-intro">
    <h3 class="icon-homepage quick-start-title"><a href="./about-wallarm/overview/">Introduction <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Get started with the Wallarm platform and learn the fundamentals.</p>
    <p><ul>
      <li><a href="./about-wallarm/overview/">Platform Overview</a></li>
      <li><a href="./quickstart/getting-started/">Quick Start</a></li>
      <li><a href="./demo-videos/platform-overview/">Video Guides</a></li>
    </ul></p>
  </div>
</div>

<!-- Row 2: API Discovery, API Protection, API Security Testing (5.0: 3 cards) -->
<div class="navigation navigation-3col navigation-3col-first">

  <div class="navigation-card">
    <h3 class="icon-homepage api-discovery-title"><a href="./api-discovery/overview/">API Discovery <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Catalog all your APIs/MCPs/agents, their risks and sensisitve data flows.</p>
    <p><ul>
      <li><a href="./api-discovery/exploring/">Exploring Your APIs</a></li>
      <li><a href="./api-discovery/risk-score/">Risk Score</a></li>
      <li><a href="./api-discovery/rogue-api/">Rogue APIs (Shadow/Zombie)</a></li>
      <li><a href="./api-discovery/sensitive-data/">Sensitive Data Detection</a></li>
      <li><a href="./api-discovery/setup/">Setup & Configuration</a></li>
    </ul></p>
  </div>

  <div class="navigation-card">
    <h3 class="icon-homepage api-threat-prevent"><a href="./about-wallarm/api-protection-overview/">API Protection <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Block attacks, bots, and abuse in real-time with intelligent threat detection.</p>
    <p><ul>
      <li><a href="./api-sessions/overview/">API Sessions</a></li>
      <li><a href="./api-specification-enforcement/overview/">API Spec Enforcement</a></li>
      <li><a href="./api-abuse-prevention/overview/">Bot Management</a></li>
      <li><a href="./about-wallarm/credential-stuffing/">Credential Stuffing</a></li>
      <li><a href="./about-wallarm/waap-overview/">Threat Protection (WAAP)</a></li>
      <li><a href="./user-guides/rules/rules/">Rules & Policies</a></li>
    </ul></p>
  </div>

  <div class="navigation-card">
    <h3 class="icon-homepage api-security-testing"><a href="./vulnerability-detection/security-testing-overview/">API Security Testing <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Find vulnerabilities before attackers do with automated security testing.</p>
    <p><ul>
      <li><a href="./vulnerability-detection/threat-replay-testing/overview/">Threat Replay Testing</a></li>
      <li><a href="./vulnerability-detection/schema-based-testing/overview/">Schema-Based Testing</a></li>
      <li><a href="./vulnerability-detection/api-security-testing-via-postman/overview/">API Security Testing via Postman</a></li>
      <li><a href="./api-attack-surface/overview/">Attack Surface (AASM)</a></li>
      <li><a href="./agentic-ai/rogue-mcp-inspection/">Rogue MCP Inspection</a></li>
    </ul></p>
  </div>

</div>

<!-- Row 3: Deployment, Integrations, Platform Management -->
<div class="navigation navigation-3col navigation-3col-last">

  <div class="navigation-card">
    <h3 class="icon-homepage deployment-title"><a href="./installation/supported-deployment-options/">Deployment <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Deploy Wallarm using managed, self-hosted, or connector-based options.</p>
    <p><ul>
      <li><a href="./installation/security-edge/overview/">Security Edge (Managed)</a></li>
      <li><a href="./admin-en/installation-kubernetes-en/">Kubernetes</a></li>
      <li><a href="./installation/cloud-platforms/aws/docker-container/">Cloud Platforms</a></li>
      <li><a href="./installation/connectors/overview/">Connectors</a></li>
      <li><a href="./installation/native-node/all-in-one/">Self-Hosted Node</a></li>
      <li><a href="./installation/oob/overview/">Out-of-Band</a></li>
    </ul></p>
  </div>

  <div class="navigation-card">
    <h3 class="icon-homepage integration-title"><a href="./user-guides/settings/integrations/integrations-intro/">Integrations <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Connect Wallarm with your existing security tools, SIEMs, and alerting systems.</p>
    <p><ul>
      <li><a href="./user-guides/settings/integrations/email/">Messaging & Alerts</a></li>
      <li><a href="./user-guides/settings/integrations/pagerduty/">Incident Management</a></li>
      <li><a href="./user-guides/settings/integrations/splunk/">SIEM & Analytics</a></li>
      <li><a href="./user-guides/settings/integrations/fluentd/">Log Collectors</a></li>
      <li><a href="./user-guides/settings/integrations/amazon-s3/">Cloud Storage</a></li>
      <li><a href="./user-guides/settings/integrations/webhook/">Webhooks</a></li>
    </ul></p>
  </div>

  <div class="navigation-card">
    <h3 class="icon-homepage platform-management-title"><a href="./platform-management/overview/">Platform Management <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Monitor threats, configure alerts, and manage access and infrastructure.</p>
    <p><ul>
      <li><a href="./user-guides/events/overview/">Monitoring & Events</a></li>
      <li><a href="./user-guides/triggers/triggers/">Triggers & Alerts</a></li>
      <li><a href="./user-guides/search-and-filters/use-search/">Search & Reports</a></li>
      <li><a href="./user-guides/settings/users/">Users & Access</a></li>
      <li><a href="./troubleshooting/overview/">Troubleshooting</a></li>
    </ul></p>
  </div>

</div>

<!-- CTA Section: Watch Demo -->
<div class="demo-cta-section">
  <div class="demo-cta-content">
    <div class="demo-cta-left">
      <div class="demo-cta-label">NEW TO WALLARM?</div>
      <h2 class="demo-cta-heading">See How It All Works in 5 Minutes</h2>
      <a href="./demo-videos/platform-overview/" class="demo-cta-button">Watch the Overview</a>
    </div>
    <div class="demo-cta-right">
      <a href="./demo-videos/platform-overview/" class="demo-cta-video-link">
        <div class="demo-cta-video">
          <iframe src="https://player.vimeo.com/video/1077418935?h=8e650aed1a&title=0&byline=0&portrait=0&muted=1&autoplay=1&autopause=0&controls=0&loop=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
          <div class="demo-cta-video-overlay"></div>
        </div>
      </a>
    </div>
  </div>
</div>

<script>
/**
 * Homepage search behavior (MkDocs Material):
 * - Desktop (>= 960px): move the built-in header search into #homepage-search-mount
 *   and render results as a dropdown under the input.
 * - Tablet/Mobile (< 960px): restore search back to the header and let MkDocs Material
 *   handle search normally (overlay, toggle, back arrow, etc).
 *
 * Fixes:
 * - Mobile search icon opening a blank screen (search was moved/hidden).
 * - Mobile search icon sometimes "jumping" to the middle of the page (toggle opens but UI isn't in header).
 */
(function () {
  var BREAKPOINT = 960; // >= 960px = desktop, <= 959px = tablet/mobile
  var mql = window.matchMedia("(min-width: " + BREAKPOINT + "px)");

  // Remember original DOM position so we can restore exactly
  var original = { parent: null, nextSibling: null };

  function isHomepage() {
    var p = window.location.pathname.replace(/\/+$/, "");
    if (p === "" || p.endsWith("/index.html") || p.endsWith("/index")) return true;
    // Single path segment = locale or version root (e.g. /ar, /ja, /5.x)
    return /^\/[^/]+$/.test(p);
  }

  function getSearchEl() {
    // Search root (same element used by MkDocs Material)
    return document.querySelector(".md-search[data-md-component='search']");
  }

  function getHeaderContainerFallback() {
    // Best-effort header container where search usually lives
    return (
      document.querySelector(".md-header .md-header__inner") ||
      document.querySelector(".md-header") ||
      document.body
    );
  }

  function closeMaterialSearchToggle() {
    // MkDocs Material uses this checkbox to toggle the search overlay on mobile
    var toggle = document.getElementById("__search");
    if (toggle) toggle.checked = false;
  }

  function resetHomepageSearchState(searchEl) {
    if (!searchEl) return;

    // Remove homepage-only classes so default CSS/JS applies
    searchEl.classList.remove("homepage-search", "homepage-search--open");

    // Remove inline styles we set for homepage dropdown behavior
    var output = searchEl.querySelector(".md-search__output");
    if (output) {
      output.style.display = "";
      output.style.pointerEvents = "";
    }

    // Ensure toggle is closed to avoid a half-open/empty overlay state on mobile
    closeMaterialSearchToggle();
  }

  function restoreSearchToHeader(searchEl) {
    if (!searchEl) return;

    // Restore to the exact original DOM location if we have it
    if (original.parent) {
      if (original.nextSibling && original.nextSibling.parentNode === original.parent) {
        original.parent.insertBefore(searchEl, original.nextSibling);
      } else {
        original.parent.appendChild(searchEl);
      }
    } else {
      // Fallback if original was not recorded for some reason
      getHeaderContainerFallback().appendChild(searchEl);
    }

    resetHomepageSearchState(searchEl);
  }

  function mountSearchToHomepage(searchEl) {
    if (!searchEl) return;

    var mount = document.getElementById("homepage-search-mount");
    if (!mount) return;

    // Record original DOM position once
    if (!original.parent) {
      original.parent = searchEl.parentNode;
      original.nextSibling = searchEl.nextSibling; // can be null
    }

    if (!mount.contains(searchEl)) {
      mount.appendChild(searchEl);
    }

    searchEl.classList.add("homepage-search");

    // Homepage-only dropdown open/close hooks
    var input  = searchEl.querySelector("input[data-md-component='search-query'], .md-search__input");
    var output = searchEl.querySelector(".md-search__output");

    // Defensive: output must NOT intercept clicks when closed
    if (output) {
      output.style.display = "none";
      output.style.pointerEvents = "none";
    }

    function openDropdown() {
      searchEl.classList.add("homepage-search--open");
      if (output) {
        output.style.display = "";
        output.style.pointerEvents = "";
      }
    }

    function closeDropdown() {
      searchEl.classList.remove("homepage-search--open");
      if (output) {
        output.style.display = "none";
        output.style.pointerEvents = "none";
      }
    }

    // Attach homepage handlers only once
    if (input && !input.dataset.homepageSearchHooked) {
      input.dataset.homepageSearchHooked = "true";

      input.addEventListener("focus", openDropdown);
      input.addEventListener("click", openDropdown);
      input.addEventListener("input", openDropdown);

      // "/" focuses search on homepage desktop
      document.addEventListener("keydown", function (e) {
        if (!mql.matches) return; // desktop only
        if (!isHomepage()) return;
        if (!input) return;

        if (e.key === "/" && document.activeElement !== input) {
          e.preventDefault();
          openDropdown();
          input.focus();
        }
        if (e.key === "Escape") {
          closeDropdown();
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("pointerdown", function (e) {
        if (!mql.matches) return; // desktop only
        if (!isHomepage()) return;
        if (!searchEl.classList.contains("homepage-search--open")) return;

        if (typeof document.hasFocus === "function" && !document.hasFocus()) return;
        if (!e || !e.target || !(e.target instanceof Node)) return;

        if (searchEl.contains(e.target)) return;
        closeDropdown();
      }, { capture: true });

      // Close dropdown on blur (with small delay)
      input.addEventListener("blur", function () {
        setTimeout(function () {
          if (!mql.matches) return; // desktop only
          if (typeof document.hasFocus === "function" && !document.hasFocus()) return;
          if (document.activeElement && searchEl.contains(document.activeElement)) return;
          closeDropdown();
        }, 120);
      });
    }
  }

  function apply() {
    if (!isHomepage()) return;

    var searchEl = getSearchEl();
    if (!searchEl) return;

    if (mql.matches) {
      // Desktop: move search into homepage
      mountSearchToHomepage(searchEl);
    } else {
      // Tablet/Mobile: restore search back to header (default Material behavior)
      restoreSearchToHeader(searchEl);
    }
  }

  function init() {
    // Apply immediately
    apply();

    // Re-apply on breakpoint changes (resize/orientation)
    if (mql.addEventListener) {
      mql.addEventListener("change", apply);
    } else {
      // Safari fallback
      mql.addListener(apply);
    }

    // Extra safety: some browsers delay matchMedia updates
    window.addEventListener("resize", apply);

    // Ensure correct placement after full load (fonts/layout settle)
    window.addEventListener("load", apply);
  }

  // MkDocs Material navigation events
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
    document.addEventListener("navigation:load", init);
  }
})();
</script>

<style>
/* =====================================================
   Homepage search + Ask AI: DESKTOP ONLY
   Tablet and below → hide, header search is used instead
   ===================================================== */

/* Tablet and smaller */
@media screen and (max-width: 959px) {
  .homepage-actions { display: none !important; }
  .homepage .md-content__inner h1+p, .admonition {
    max-width: unset !important;
  }
}

.homepage .md-content__inner h1+p {
  max-width: unset !important;
}

/* Desktop-only homepage search styling */
@media screen and (min-width: 960px) {

/* ==========================
   Actions row: LEFT as before
   ========================== */

.homepage-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  overflow: visible;

  /* key: do NOT center */
  align-self: flex-start;
  justify-content: flex-start;
  /* Match intro tile width (50% of grid minus half gap) */
  width: calc(50% - 8px);
}

/* Search expands to fill available width */
#homepage-search-mount {
  flex: 1;
  min-width: 280px;
  overflow: visible;
}

/* Ask AI stays compact */
.homepage-btn-ai {
  flex: 0 0 auto;
}

/* ==========================
   Search: keep it stable
   ========================== */

.md-search { padding: unset; }

#homepage-search-mount .md-search {
  position: relative;
  display: block;
  width: 100%;
}

/* Match button height */
#homepage-search-mount .md-search__inner {
  height: 44px;
  border: 1px solid #DAE1EB;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  background: #F9FAFB;
  width: 100%;
  display: flex;
  align-items: center;

  transition: none !important;

  /* KEY: anchor absolute ::after */
  position: relative;
}

#homepage-search-mount .md-search__inner:hover,
#homepage-search-mount .md-search__inner:active,
#homepage-search-mount .md-search__inner:focus,
#homepage-search-mount .md-search__inner:focus-within {
  background: #F9FAFB !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
  outline: none !important;
}

#homepage-search-mount .md-search__form {
  display: flex;
  align-items: center;
  height: 44px;
  background-color: #ffffff1f;
}

#homepage-search-mount .md-search__input {
  height: 44px;
  line-height: 44px;
  padding: 0 16px 0 44px;
  font-size: 15px;
  background: transparent !important;
  width: 100%;

  /* Reserve space on the right so UI/clear doesn't cover the badge */
  padding-right: 64px;
}

/* Keep left icon + options centered */
#homepage-search-mount .md-search__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
}

.md-search__icon[for=__search] { top: unset; }

#homepage-search-mount .md-search__options {
  display: inline-flex !important;
  align-items: center !important;
  height: 44px !important;
  gap: 6px;
}

/* Disable fullscreen overlay behavior on homepage (desktop dropdown instead) */
#homepage-search-mount .md-search__overlay {
  display: none !important;
}

/* Output dropdown under input */
#homepage-search-mount .md-search__output {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  z-index: 2;
}

/* Default: hidden + non-interactive */
#homepage-search-mount .md-search__output {
  display: none !important;
  pointer-events: none !important;
}

/* Only when open/focused: visible + interactive */
#homepage-search-mount .md-search__inner:focus-within .md-search__output,
#homepage-search-mount .md-search.homepage-search--open .md-search__output {
  display: block !important;
  pointer-events: auto !important;
  opacity: 1 !important;
  transform: none !important;
}

#homepage-search-mount .md-search__scrollwrap {
  max-height: min(60vh, 26rem);
  width: unset;
}

/* Hotkey indicator for the search field (desktop only) */
#homepage-search-mount .md-search__inner::after {
  content: "⌘K";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  background-color: white;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  padding: 2px 6px;
  pointer-events: none;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Hide the badge while typing (desktop dropdown UX) */
#homepage-search-mount .md-search__inner:focus-within::after,
#homepage-search-mount .md-search.homepage-search--open .md-search__inner::after {
  display: none !important;
}

/* Links in search results */
#homepage-search-mount a:hover {
  color: unset;
  text-decoration: none;
}

/* Lists styling ONLY inside homepage search results */
[dir=ltr] #homepage-search-mount .md-search-result__list {
  margin-top: 0;
  margin-left: 0;
  padding-left: 0;
}

[dir=ltr] #homepage-search-mount .md-search-result__item {
  margin-left: 0;
}

/* =========================================================
   Homepage search styling ONLY (ported from default styles)
   No header selectors, no toggle dependencies
   ========================================================= */

/* Input base style */
#homepage-search-mount .md-search__input {
  color: #000000;
  border-radius: .1rem;
}

/* Input background when NOT focused */
#homepage-search-mount .md-search__input:not(:focus-visible) {
  background-color: #F7F7F8;
}

/* Placeholder color */
#homepage-search-mount input.md-search__input::placeholder {
  color: #959DAC;
}

/* Search icon color */
#homepage-search-mount .md-search__icon,
#homepage-search-mount .md-search__icon svg {
  color: #959DAC;
}

/* Result meta background */
#homepage-search-mount .md-search-result__meta {
  background-color: #FAFAFB;
}

/* Result link hover / focus */
#homepage-search-mount a.md-search-result__link:hover {
  background-color: #F7F7F8;
  box-shadow: inset 0px -1px 0px rgba(229, 229, 229, 0.5);
}

#homepage-search-mount .md-search-result__link:focus code,
#homepage-search-mount .md-search-result__link:hover code {
    background-color: unset !important;
}

#homepage-search-mount .md-search-result__link:focus,
#homepage-search-mount .md-search-result__link:hover {
  background-color: #F7F7F8;
}

/* "More results" hover / focus */
#homepage-search-mount .md-search-result__more > summary:focus > div,
#homepage-search-mount .md-search-result__more > summary:hover > div {
  background-color: #F7F7F8;
  box-shadow: inset 0px -1px 0px rgba(229, 229, 229, 0.5);
}

#homepage-search-mount .md-search-result__more > summary {
    padding-right: 0px;
    padding-top: 0px;
    padding-left: 0px;
    padding-bottom: 0px;
    background-color: var(--md-default-bg-color) !important;
}

#homepage-search-mount .md-search-result__more {
    border: unset;
}

#homepage-search-mount .md-search-result__more > summary:before {
    display: none !important;
}

/* Highlighted matches */
#homepage-search-mount .md-search-result em {
  color: #FC7303;
  text-decoration: none;
  font-weight: inherit;
}

/* ==========================
   Ask AI button: fixed height
   ========================== */

.homepage-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 44px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 400;
  text-align: center;
  border: 1px solid #DAE1EB;
  cursor: pointer;
  font-size: 15px;
  font-family: inherit;
}

.homepage-btn-ai {
  background-color: #F9FAFB;
  color: #374151;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.homepage-btn-ai:hover {
  background-color: #F3F4F6;
  border-color: #C5CCD6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.homepage-btn-ai svg { flex-shrink: 0; }

/* Keep desktop actions row stable on small desktop widths */
@media screen and (max-width: 1100px) {
  .homepage-actions { width: 100%; }
}

} /* end min-width: 960px desktop block */

/* (Your existing styles below can remain as-is) */

.navigation-1col { margin-bottom: 24px; }

.card-arrow {
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.navigation-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.navigation-card { position: relative; }

.navigation-card h3 a::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
}

.navigation-card ul a { position: relative; z-index: 1; }

.navigation-4col {
  grid-template-columns: repeat(4, 1fr) !important;
  margin-bottom: 24px;
}

.navigation-3col {
  grid-template-columns: repeat(3, 1fr) !important;
  margin-bottom: 48px;
}

/* 5.0: two rows of 3 cards — smaller gap between rows, keep space before CTA */
.navigation-3col-first {
  margin-bottom: 24px !important;
}
.navigation-3col-last {
  margin-bottom: 48px !important;
}

@media screen and (max-width: 1100px) {
  .navigation-4col { grid-template-columns: repeat(2, 1fr) !important; }
}

@media screen and (max-width: 900px) {
  .navigation-3col { grid-template-columns: repeat(2, 1fr) !important; }
  /* 5.0: 3 cards in row — make 3rd card span full width so no empty cell on the right */
  .navigation-3col .navigation-card:nth-child(3):nth-last-child(1) {
    grid-column: 1 / -1;
  }
}

@media screen and (max-width: 600px) {
  .navigation-4col,
  .navigation-3col {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}

/* Demo CTA Section */
.demo-cta-section {
  background-color: #121B28;
  border-radius: 12px;
  padding: 48px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.demo-cta-content {
  display: flex;
  gap: 48px;
  align-items: center;
}

.demo-cta-left { flex: 1; }

.demo-cta-label {
  color: #FC7303;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.demo-cta-heading {
  color: white !important;
  font-size: 28px !important;
  font-weight: 600 !important;
  margin: 0 0 24px 0 !important;
  line-height: 1.3 !important;
}

.demo-cta-right { flex: 1; }

.demo-cta-video-link {
  display: block;
  text-decoration: none;
}

.demo-cta-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 5px 5px 0 #FC7303;
  background-color: white;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.demo-cta-video:hover {
  box-shadow: 7px 7px 0 #FC7303;
  transform: translate(-2px, -2px);
}

.demo-cta-video iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.demo-cta-video-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  cursor: pointer;
}

.demo-cta-button {
  display: inline-block;
  background-color: #3B82F6;
  color: white !important;
  padding: 14px 32px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.demo-cta-button:hover {
  background-color: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  color: white !important;
  text-decoration: none !important;
}

@media screen and (max-width: 900px) {
  .demo-cta-content { flex-direction: column; gap: 32px; }
  .demo-cta-section { padding: 32px; }
  .demo-cta-heading { font-size: 24px !important; }
}

@media screen and (max-width: 600px) {
  .demo-cta-section { padding: 24px; }
  .demo-cta-heading { font-size: 20px !important; }
}

/* If you intentionally hide a custom header AI button, keep it */
button.md-header__button.header-ask-ai-btn {
  display: none;
}

@media screen and (max-width: 475px) {
  .md-header__title {
    display: none !important;
  }
}

.admonition {
    max-width: calc(50% - 8px);
}

</style>
