---
hide:
- navigation
- toc
- feedback
---

# Wallarm Documentation

Wallarm is a unified platform that provides real-time API and AI security by detecting and blocking threats, automating API/agents inventory, and managing API risks across cloud-native and on-premises environments.

<!-- Top Section: Introduction + Search/Ask AI -->
<div class="homepage-top">
    <div class="navigation-card homepage-intro">
        <h3 class="icon-homepage quick-start-title">Introduction</h3>
        <p><ul>
        <li><a href="./about-wallarm/overview/">Platform Overview</a></li>
        <li><a href="./quickstart/getting-started/">Quick Start</a></li>
        <li><a href="./demo-videos/">Video Guides</a></li>
        </ul></p>
    </div>
    <div class="homepage-actions">
        <a href="#__search" class="homepage-btn homepage-btn-search">Search</a>
        <button type="button" class="homepage-btn homepage-btn-ai" onclick="if(window.openInkeepChat) window.openInkeepChat();">Ask AI</button>
    </div>
</div>

<!-- Row 1: API Discovery, API Protection, API Security Testing, AI Security -->
<div class="navigation navigation-4col">

<div class="navigation-card">
    <h3 class="icon-homepage api-discovery-title">API Discovery</h3>
    <p><ul>
    <li><a href="./api-discovery/overview/">Overview</a></li>
    <li><a href="./api-discovery/setup/">Setup & Configuration</a></li>
    <li><a href="./api-discovery/exploring/">Exploring Your APIs</a></li>
    <li><a href="./api-discovery/risk-score/">Risk Analysis</a></li>
    <li><a href="./api-discovery/sensitive-data/">Data Protection</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-threat-prevent">API Protection</h3>
    <p><ul>
    <li><a href="./about-wallarm/api-protection-overview/">Overview</a></li>
    <li><a href="./about-wallarm/waap-overview/">Threat Protection (WAAP)</a></li>
    <li><a href="./api-abuse-prevention/overview/">Bot Protection</a></li>
    <li><a href="./api-specification-enforcement/overview/">Spec Enforcement</a></li>
    <li><a href="./api-sessions/overview/">Session Security</a></li>
    <li><a href="./user-guides/rules/rules/">Rules & Policies</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-security-testing">API Security Testing</h3>
    <p><ul>
    <li><a href="./vulnerability-detection/security-testing-overview/">Overview</a></li>
    <li><a href="./vulnerability-detection/threat-replay-testing/overview/">Threat Replay Testing</a></li>
    <li><a href="./vulnerability-detection/schema-based-testing/overview/">Schema-Based Testing</a></li>
    <li><a href="./api-attack-surface/overview/">Attack Surface (AASM)</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage ai-security-title">AI Security</h3>
    <p><ul>
    <li><a href="./agentic-ai/overview/">Overview</a></li>
    <li><a href="./agentic-ai/agentic-ai-discovery/">AI Agent Discovery</a></li>
    <li><a href="./agentic-ai/agentic-ai-protection/">AI Agent Protection</a></li>
    <li><a href="./agentic-ai/demo/">Demo</a></li>
    </ul></p>
</div>

</div>

<!-- Row 2: Deployment, Integrations, Platform Management -->
<div class="navigation navigation-3col">

<div class="navigation-card">
    <h3 class="icon-homepage deployment-title">Deployment</h3>
    <p><ul>
    <li><a href="./installation/supported-deployment-options/">Deployment Overview</a></li>
    <li><a href="./installation/security-edge/overview/">Security Edge (Managed)</a></li>
    <li><a href="./admin-en/installation-kubernetes-en/">Kubernetes</a></li>
    <li><a href="./installation/connectors/overview/">Connectors</a></li>
    <li><a href="./installation/native-node/all-in-one/">Self-Hosted Node</a></li>
    <li><a href="./installation/oob/overview/">Out-of-Band</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage integration-title">Integrations</h3>
    <p><ul>
    <li><a href="./user-guides/settings/integrations/integrations-intro/">Overview</a></li>
    <li><a href="./user-guides/settings/integrations/email/">Messaging & Alerts</a></li>
    <li><a href="./user-guides/settings/integrations/splunk/">SIEM & Analytics</a></li>
    <li><a href="./user-guides/settings/integrations/fluentd/">Log Collectors</a></li>
    <li><a href="./user-guides/settings/integrations/webhook/">Webhooks</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage user-management-title">Platform Management</h3>
    <p><ul>
    <li><a href="./user-guides/dashboards/threat-prevention/">Dashboards</a></li>
    <li><a href="./user-guides/events/overview/">Monitoring & Events</a></li>
    <li><a href="./user-guides/settings/users/">Users & Access</a></li>
    <li><a href="./user-guides/triggers/triggers/">Triggers & Alerts</a></li>
    <li><a href="./about-wallarm/subscription-plans/">Plans & Pricing</a></li>
    </ul></p>
</div>

</div>

<style>
/* Homepage top section */
.homepage-top {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    align-items: flex-start;
}

.homepage-intro {
    flex: 1;
    max-width: 50%;
}

.homepage-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 40px;
}

.homepage-btn {
    display: inline-block;
    padding: 12px 32px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    text-align: center;
    min-width: 140px;
}

.homepage-btn-search {
    background-color: #6B7280;
    color: white;
}

.homepage-btn-search:hover {
    background-color: #4B5563;
    color: white;
    text-decoration: none;
}

.homepage-btn-ai {
    background-color: white;
    color: #374151;
    border: 1px solid #D1D5DB;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
}

.homepage-btn-ai:hover {
    background-color: #F9FAFB;
    color: #374151;
    text-decoration: none;
}

/* 4-column navigation grid */
.navigation-4col {
    grid-template-columns: repeat(4, 1fr) !important;
}

/* 3-column navigation grid */
.navigation-3col {
    grid-template-columns: repeat(3, 1fr) !important;
}

@media screen and (max-width: 1100px) {
    .navigation-4col {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

@media screen and (max-width: 900px) {
    .homepage-top {
        flex-direction: column;
    }
    .homepage-intro {
        max-width: 100%;
    }
    .homepage-actions {
        flex-direction: row;
        padding-top: 0;
    }
    .navigation-3col {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}

@media screen and (max-width: 600px) {
    .navigation-4col,
    .navigation-3col {
        grid-template-columns: repeat(1, 1fr) !important;
    }
    .homepage-actions {
        flex-direction: column;
        width: 100%;
    }
    .homepage-btn {
        width: 100%;
    }
}
</style>
