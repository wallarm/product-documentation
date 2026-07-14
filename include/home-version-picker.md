<div class="home-verpick" id="homeVerpick">
<button type="button" id="homeVerMain" class="versions-main ver-pill" aria-expanded="false" aria-haspopup="true" aria-controls="homeVerList">
<span class="v-label">Version</span>
<span class="v-val">6.x · 0.14.x+</span>
<svg class="versions-drop" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2.25" fill="none"><path d="M8 10.5L12 14.5L16 10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</button>
<div class="versions-list ver-menu" id="homeVerList" hidden>
<div class="vm-head">Documentation version</div>
<a class="vm-item" data-ver="6.x" href="/"><span class="vm-v">6.x · 0.14.x+</span><span class="vm-tag current">Current</span><svg class="vm-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="vm-item" data-ver="7.x" href="/7.x/"><span class="vm-v">7.x · 0.26.x+</span><span class="vm-tag preview">Preview</span><svg class="vm-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="vm-item" data-ver="5.x" href="/5.x/"><span class="vm-v">5.x · 0.13.x-</span><span class="vm-tag legacy">Legacy</span><svg class="vm-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<a class="vm-item" data-ver="4.10" href="/4.10/"><span class="vm-v">4.10</span><span class="vm-tag eol">End of life</span><svg class="vm-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></a>
<hr>
<a class="vm-foot" data-ver-policy href="/updating-migrating/versioning-policy/"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>Version support policy</a>
</div>
</div>

<style>
/* Home-page Node version picker. Nav (with its version selector) is hidden on
   the home page, so this exposes the SAME selector in the hero. It reuses the
   article selector's classes (.ver-pill / .ver-menu / .vm-*) for an identical
   look; only the positioning is overridden here (open downward under the pill,
   instead of upward at the sidebar foot). */
.home-verpick { position: relative; display: inline-flex; margin: 0 0 18px; }

/* Anchor the dropdown below the pill and beat the sidebar's upward-open rule. */
.home-verpick .versions-list.ver-menu {
  top: calc(100% + 6px);
  bottom: auto;
  left: 0;
  right: auto;
  margin: 0;
  min-width: 260px;
  z-index: 30;
}
.home-verpick .versions-list.ver-menu[hidden] { display: none; }

/* The picker sits inside .md-typeset on the home page, so the content-link
   styles (.homepage .md-typeset a / :hover) leak in — black text, Signal-Red
   hover, underline. Neutralize them so hovers and text colors match the
   in-article selector exactly. */
.home-verpick .ver-menu .vm-item,
.home-verpick .ver-menu .vm-foot { text-decoration: none; transition: none; }
.home-verpick .ver-menu .vm-foot { color: var(--w-core-blue); }
.home-verpick .ver-menu .vm-item:hover {
  color: inherit;
  text-decoration: none;
  background: #F8FAFC;
}
.home-verpick .ver-menu .vm-foot:hover {
  color: var(--w-core-blue);
  text-decoration: underline;
}
</style>

<script>
(function () {
  var VAL = { "6.x": "6.x · 0.14.x+", "7.x": "7.x · 0.26.x+", "5.x": "5.x · 0.13.x-", "4.10": "4.10" };

  function initHomeVerpick() {
    var root = document.getElementById("homeVerpick");
    if (!root || root.dataset.hooked) return;
    root.dataset.hooked = "1";

    var btn = document.getElementById("homeVerMain");
    var menu = document.getElementById("homeVerList");
    var val = root.querySelector(".v-val");

    // Detect current version from the URL (matches extra.js version segments).
    var p = location.pathname;
    var cur = "6.x";
    if (/^\/7\.x(\/|$)/.test(p)) cur = "7.x";
    else if (/^\/5\.x(\/|$)/.test(p)) cur = "5.x";
    else if (/^\/4\.10(\/|$)/.test(p)) cur = "4.10";

    if (val) val.textContent = VAL[cur];

    var items = root.querySelectorAll(".vm-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("active", items[i].getAttribute("data-ver") === cur);
    }

    // Version support policy link honors the current version prefix.
    var foot = root.querySelector("[data-ver-policy]");
    if (foot) {
      foot.setAttribute("href", cur === "6.x"
        ? "/updating-migrating/versioning-policy/"
        : "/" + cur + "/updating-migrating/versioning-policy/");
    }

    function open() {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      btn.classList.add("versions-main-active");
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      btn.classList.remove("versions-main-active");
    }

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
