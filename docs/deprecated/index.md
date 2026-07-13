---
hide:
- navigation
- toc
- feedback
---

<div class="home-hero-media" aria-hidden="true">
<svg viewBox="0 0 780 470" role="img" aria-label="Wallarm AI Control Platform continuous loop: APIs, AI agents and cloud estate feed into Discover, Observe, Enforce and Govern.">
  <g class="aicp-chips">
    <rect class="aicp-chip" x="20" y="104" width="176" height="40"/>
    <circle cx="44" cy="124" r="5" fill="#155DFC"/>
    <text class="aicp-chip-label" x="62" y="128">APIs</text>
    <rect class="aicp-chip" x="20" y="210" width="176" height="40"/>
    <circle cx="44" cy="230" r="5" fill="#9747FF"/>
    <text class="aicp-chip-label" x="62" y="234">AI agents</text>
    <rect class="aicp-chip" x="20" y="316" width="176" height="40"/>
    <circle cx="44" cy="336" r="5" fill="#00A63E"/>
    <text class="aicp-chip-label" x="62" y="340">Cloud estate</text>
  </g>
  <path class="aicp-conn" d="M196,124 C270,124 300,230 350,230"/>
  <path class="aicp-conn" d="M196,230 C260,230 300,230 336,230"/>
  <path class="aicp-conn" d="M196,336 C270,336 300,230 350,230"/>
  <circle class="aicp-ring" cx="500" cy="230" r="150"/>
  <circle class="aicp-inner" cx="500" cy="230" r="82"/>
  <text class="aicp-core-brand" x="500" y="222" text-anchor="middle">WALLARM</text>
  <text class="aicp-core-sub" x="500" y="240" text-anchor="middle">AI Control</text>
  <text class="aicp-core-sub" x="500" y="253" text-anchor="middle">Platform</text>
  <circle class="aicp-node n1" cx="500" cy="80" r="15"/>
  <circle class="aicp-node-dot d1" cx="500" cy="80" r="5"/>
  <text class="aicp-label" x="500" y="46" text-anchor="middle">Discover</text>
  <circle class="aicp-node n2" cx="650" cy="230" r="15"/>
  <circle class="aicp-node-dot d2" cx="650" cy="230" r="5"/>
  <text class="aicp-label" x="678" y="234" text-anchor="start">Observe</text>
  <circle class="aicp-node n3" cx="500" cy="380" r="15"/>
  <circle class="aicp-node-dot d3" cx="500" cy="380" r="5"/>
  <text class="aicp-label" x="500" y="416" text-anchor="middle">Enforce</text>
  <circle class="aicp-node n4" cx="350" cy="230" r="15"/>
  <circle class="aicp-node-dot d4" cx="350" cy="230" r="5"/>
  <text class="aicp-label" x="322" y="234" text-anchor="end">Govern</text>
  <g class="aicp-orbit">
    <circle class="aicp-orbit-dot" cx="500" cy="80" r="6"/>
  </g>
</svg>
</div>

--8<-- "../include/home-version-picker.md"

# Wallarm Documentation

Wallarm AI Control Platform — discover, observe, enforce, and govern AI workloads and APIs across your environment.

!!! warning "Unsupported version"
    Wallarm node 4.10 and lower is not supported. Please learn [what is new in the later versions](/updating-migrating/what-is-new/) and plan the upgrade procedure.

    <div class="eol-actions"><a class="eol-primary" href="/"><span class="eol-ic">→</span>Go to current version · 6.x</a><a class="eol-secondary" href="/updating-migrating/versioning-policy/">Version support policy</a></div>

<style>
.homepage .md-content {
  background-color: var(--w-surface);
}

.homepage .md-content__inner h1+p {
  max-width: unset !important;
}

/* EOL / unsupported-version CTAs (borrowed from Claude Design eol-actions) */
.eol-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
}

/* Mobile: stack buttons, both flush-left */
@media screen and (max-width: 600px) {
  .eol-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}

.eol-primary,
.eol-secondary {
  font: 500 13px/1 var(--w-mono-font);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 14px 18px;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none !important;
  transition: background 0.15s ease, color 0.15s ease;
}

.eol-primary {
  background: var(--w-signal-red);
  color: #fff !important;
}

.eol-primary:hover {
  background: var(--w-black);
  color: #fff !important;
}

.eol-secondary {
  background: var(--w-paper);
  color: var(--w-ink) !important;
}

.eol-secondary:hover {
  background: var(--w-ink);
  color: #fff !important;
}

.eol-ic {
  font-size: 14px;
  line-height: 1;
}
</style>
