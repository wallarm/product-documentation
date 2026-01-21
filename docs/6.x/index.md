---
hide:
- navigation
- toc
- feedback
---

# Wallarm Documentation

Everything you need to discover your APIs, MCPs, and AI agents, protect them from threats, and test for vulnerabilities.

<div class="homepage-actions">
    <button type="button" class="homepage-btn homepage-btn-search" onclick="document.getElementById('__search').checked = true; setTimeout(function() { document.querySelector('.md-search__input').focus(); }, 100);">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
        <span>Search...</span>
        <span class="homepage-btn-shortcut"></span>
    </button>
    <button type="button" class="homepage-btn homepage-btn-ai" onclick="if(window.openInkeepChat) window.openInkeepChat();">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>
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

<!-- Row 2: API Discovery, API Protection, API Security Testing, AI Security -->
<div class="navigation navigation-4col">

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
    <li><a href="./api-attack-surface/overview/">Attack Surface (AASM)</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage agent-ai-title"><a href="./agentic-ai/overview/">AI Security <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Discover and protect AI agents and MCPs.</p>
    <p><ul>
    <li><a href="./agentic-ai/agentic-ai-discovery/">AI Agent Discovery</a></li>
    <li><a href="./agentic-ai/agentic-ai-protection/">AI Agent Protection</a></li>
    <li><a href="./agentic-ai/demo/">Demo</a></li>
    </ul></p>
</div>

</div>

<!-- Row 2: Deployment, Integrations, Platform Management -->
<div class="navigation navigation-3col">

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
    <h3 class="icon-homepage user-management-title"><a href="./platform-management/overview/">Platform Management <span class="card-arrow">→</span></a></h3>
    <p class="card-description">Monitor threats, configure alerts, and manage users and access controls.</p>
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
(function() {
    var isMac = navigator.platform.toLowerCase().indexOf('mac') !== -1;
    var shortcut = isMac ? '⌘K' : 'Ctrl K';
    var el = document.querySelector('.homepage-btn-shortcut');
    if (el) el.textContent = shortcut;
})();
</script>

<style>
/* Hide search and Ask AI button in header on homepage */
.md-search,
.md-header .header-ask-ai-btn {
    display: none !important;
}

/* Show search when activated */
[data-md-toggle="search"]:checked ~ .md-header .md-search {
    display: block !important;
}

/* Homepage actions (Search + Ask AI buttons) */
.homepage-actions {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-self: center;
    margin-bottom: 24px;
}

/* Single column navigation row */
.navigation-1col {
    margin-bottom: 24px;
}

/* Card title arrow */
.card-arrow {
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    display: inline-block;
}

.navigation-card:hover .card-arrow {
    opacity: 1;
    transform: translateX(3px);
}

/* Make entire card clickable via stretched link */
.navigation-card {
    position: relative;
}

.navigation-card h3 a::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

/* Keep embedded links clickable above the stretched link */
.navigation-card ul a {
    position: relative;
    z-index: 1;
}

/* 2-column navigation grid for Introduction */
.navigation-2col {
    grid-template-columns: repeat(2, 1fr) !important;
    margin-bottom: 24px;
}

.navigation-2col .homepage-intro {
    grid-column: span 1;
}

.homepage-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 400;
    text-align: center;
    border: 1px solid #DAE1EB;
    cursor: pointer;
    font-size: 15px;
    font-family: inherit;
}

.homepage-btn-search {
    background-color: #F9FAFB;
    color: #6B7280;
    flex: 0 1 42%;
    justify-content: flex-start;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.homepage-btn-search:hover {
    background-color: #F3F4F6;
    border-color: #C5CCD6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.homepage-btn-search svg {
    flex-shrink: 0;
    opacity: 0.5;
}

.homepage-btn-search span:first-of-type {
    flex: 1;
    text-align: left;
}

.homepage-btn-shortcut {
    font-size: 11px;
    font-weight: 500;
    color: #9CA3AF;
    background-color: white;
    border: 1px solid #E5E7EB;
    border-radius: 4px;
    padding: 2px 6px;
    margin-left: auto;
}

.homepage-btn-ai {
    background-color: #F9FAFB;
    color: #374151;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.homepage-btn-ai:hover {
    background-color: #F3F4F6;
    border-color: #C5CCD6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.homepage-btn-ai svg {
    flex-shrink: 0;
}

/* 4-column navigation grid */
.navigation-4col {
    grid-template-columns: repeat(4, 1fr) !important;
    margin-bottom: 24px;
}

/* 3-column navigation grid */
.navigation-3col {
    grid-template-columns: repeat(3, 1fr) !important;
    margin-bottom: 48px;
}

@media screen and (max-width: 1100px) {
    .navigation-4col {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

@media screen and (max-width: 900px) {
    .navigation-3col {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

@media screen and (max-width: 600px) {
    .navigation-4col,
    .navigation-3col,
    .navigation-2col {
        grid-template-columns: repeat(1, 1fr) !important;
    }
    .homepage-actions {
        margin-top: 16px;
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

.demo-cta-left {
    flex: 1;
}

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

.demo-cta-right {
    flex: 1;
}

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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
    .demo-cta-content {
        flex-direction: column;
        gap: 32px;
    }
    .demo-cta-section {
        padding: 32px;
    }
    .demo-cta-heading {
        font-size: 24px !important;
    }
}

@media screen and (max-width: 600px) {
    .demo-cta-section {
        padding: 24px;
    }
    .demo-cta-heading {
        font-size: 20px !important;
    }
}
</style>
