<div class="home-verpick" id="homeVerpick">
<button type="button" class="hvp-btn" aria-expanded="false" aria-haspopup="true" aria-controls="homeVerpickMenu">
<span class="hvp-dot"></span>
<span class="hvp-cur">Node 6.x</span>
<svg class="hvp-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
</button>
<div class="hvp-menu" id="homeVerpickMenu" hidden>
<div class="hvp-head">Documentation version</div>
<a class="hvp-item" data-ver="6.x" href="/"><span class="hvp-name">6.x · 0.14.x+</span><span class="hvp-tag current">Current</span><svg class="hvp-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="hvp-item" data-ver="7.x" href="/7.x/"><span class="hvp-name">7.x · 0.26.x+</span><span class="hvp-tag preview">Preview</span><svg class="hvp-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="hvp-item" data-ver="5.x" href="/5.x/"><span class="hvp-name">5.x · 0.13.x-</span><span class="hvp-tag legacy">Legacy</span><svg class="hvp-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="hvp-item" data-ver="4.10" href="/4.10/"><span class="hvp-name">4.10</span><span class="hvp-tag eol">End of life</span><svg class="hvp-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="hvp-foot" data-ver-policy href="/updating-migrating/versioning-policy/"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>Version support policy</a>
</div>
</div>

<style>
/* ============================================================
   Home-page Node version picker (nav is hidden on the home page,
   so this exposes version switching in the hero). Ported from the
   Claude Design "hero-verpick" component.
   ============================================================ */
.home-verpick { position: relative; display: inline-flex; margin: 0 0 18px; }

.home-verpick .hvp-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 8px 5px 10px;
  border: 1px solid var(--w-hairline); background: var(--w-white);
  font: 500 11px/1 var(--w-mono-font); letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--w-ink); cursor: pointer;
}
.home-verpick .hvp-btn:hover { border-color: var(--w-black); }
.home-verpick .hvp-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--w-success); flex: none; }
.home-verpick .hvp-chev { color: var(--w-graphite); }

.home-verpick .hvp-menu {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 30;
  min-width: 250px; padding: 8px;
  background: var(--w-white); border: 1px solid var(--w-hairline);
  box-shadow: 0 12px 34px rgba(0,0,0,0.14);
}
.home-verpick .hvp-menu[hidden] { display: none; }

.home-verpick .hvp-head {
  font: 600 10px/1 var(--w-mono-font); letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--w-graphite); padding: 4px 8px 8px;
}

.home-verpick .hvp-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 8px; border-bottom: 1px solid var(--w-hairline);
  text-decoration: none !important;
}
.home-verpick .hvp-item:hover { background: var(--w-cream); }
.home-verpick .hvp-name { flex: 1; font: 500 14px/1 var(--w-mono-font); color: var(--w-ink); }

.home-verpick .hvp-tag {
  font: 600 9px/1 var(--w-mono-font); letter-spacing: 0.08em; text-transform: uppercase;
  padding: 4px 7px; border: 1px solid transparent;
}
.home-verpick .hvp-tag.current { background: #E6F5EC; color: var(--w-success); border-color: #BFE6CE; }
.home-verpick .hvp-tag.preview { background: #EAF1FF; color: var(--w-core-blue); border-color: #C9DBFF; }
.home-verpick .hvp-tag.legacy  { background: var(--w-paper); color: var(--w-graphite); border-color: var(--w-hairline); }
.home-verpick .hvp-tag.eol     { background: #FBEDEB; color: #C0392B; border-color: #E9C4BF; }

.home-verpick .hvp-check { margin-left: 2px; color: var(--w-signal-red); opacity: 0; flex: none; }
.home-verpick .hvp-item.active .hvp-check { opacity: 1; }

.home-verpick .hvp-foot {
  display: flex; align-items: center; gap: 6px;
  margin-top: 4px; padding: 10px 8px 4px; border-top: 1px solid var(--w-hairline);
  font: 500 11px/1 var(--w-body-font, inherit); color: var(--w-core-blue);
  text-decoration: underline !important; text-underline-offset: 2px;
}

/* Dot reflects the current version's status */
.home-verpick[data-cur="7.x"] .hvp-dot { background: var(--w-core-blue); }
.home-verpick[data-cur="5.x"] .hvp-dot { background: var(--w-graphite); }
.home-verpick[data-cur="4.10"] .hvp-dot { background: #C0392B; }

@media screen and (max-width: 600px) {
  .home-verpick .hvp-menu { min-width: min(250px, 86vw); }
}
</style>

<script>
(function () {
  function initHomeVerpick() {
    var root = document.getElementById("homeVerpick");
    if (!root || root.dataset.hooked) return;
    root.dataset.hooked = "1";

    var btn = root.querySelector(".hvp-btn");
    var menu = root.querySelector(".hvp-menu");
    var curLabel = root.querySelector(".hvp-cur");

    // Detect current version from the URL (matches extra.js version segments)
    var p = location.pathname;
    var cur = "6.x";
    if (/^\/7\.x(\/|$)/.test(p)) cur = "7.x";
    else if (/^\/5\.x(\/|$)/.test(p)) cur = "5.x";
    else if (/^\/4\.10(\/|$)/.test(p)) cur = "4.10";

    root.setAttribute("data-cur", cur);
    if (curLabel) curLabel.textContent = "Node " + cur;

    var items = root.querySelectorAll(".hvp-item");
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute("data-ver") === cur) items[i].classList.add("active");
    }

    // Version support policy link honors the current version prefix
    var foot = root.querySelector("[data-ver-policy]");
    if (foot) {
      foot.setAttribute("href", cur === "6.x"
        ? "/updating-migrating/versioning-policy/"
        : "/" + cur + "/updating-migrating/versioning-policy/");
    }

    function open() { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); }
    function close() { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (menu.hidden) open(); else close();
    });
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initHomeVerpick);
  } else {
    document.addEventListener("DOMContentLoaded", initHomeVerpick);
    document.addEventListener("navigation:load", initHomeVerpick);
  }
})();
</script>
