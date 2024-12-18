---
hide:
- navigation
- toc
- feedback
---

# Wallarm API Security

The Wallarm solution protects APIs, microservices and web applications from OWASP API Top 10 threats,<br>API abuse and other automated threats with no manual rule configuration and ultra‑low false positives.

!!! info "Newer version is available"
    The newer version of the Wallarm node has been released. [What is new in the latest version](/updating-migrating/what-is-new/)

<div class="navigation">
<div class="navigation-card">
    <h3 class="icon-homepage quick-start-title">Quick start</h3>
    <p><ul>
    <li><a href="./about-wallarm/overview/">Wallarm Overview</a></li>
    <li><a href="./quickstart/getting-started/">Getting Started</a></li>
    <li><a href="./about-wallarm/subscription-plans/">Subscription Plans</a></li>
    <li><a href="./installation/supported-deployment-options/">Deployment Guides</a></li>
    <li><a href="./quickstart/attack-prevention-best-practices/">Best Practices</a></li>
    <li><a href="./demo-videos/overview/">Video Guides</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage dashboard-title">Threat Management</h3>
    <p><ul>
    <li><a href="./user-guides/dashboards/threat-prevention/">Dashboards</a></li>
    <li><a href="./user-guides/events/check-attack/">Attack Analysis</a></li>
    <li><a href="./user-guides/events/check-incident/">Incident Analysis</a></li>
    <!-- <li><a href="./api-sessions/">API Sessions</a></li> -->
    <li><a href="./user-guides/search-and-filters/custom-report/">Reports</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-discovery-title">API Discovery</h3>
    <p><ul>
    <li><a href="./api-discovery/overview/">Exploring API Inventory</a></li>
    <li><a href="./api-discovery/track-changes/">Tracking Changes in API</a></li>
    <li><a href="./api-discovery/risk-score/">Endpoint Risk Score</a></li>
    <li><a href="./api-discovery/rogue-api/">Shadow, Orphan, Zombie API</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-threat-prevent">API Protection</h3>
    <p><ul>
    <li><a href="./about-wallarm/api-protection-overview/">Overview</a></li>
    <li><a href="./api-specification-enforcement/overview/">API Specification Enforcement</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bola/">BOLA Protection</a></li>
    <li><a href="./api-abuse-prevention/overview/">API Abuse Prevention</a></li>
    <li><a href="./about-wallarm/credential-stuffing/">Credential Stuffing Detection</a></li>
    <li><a href="./api-protection/graphql-rule/">GraphQL API Protection</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage vuln-title">API Attack Surface Management</h3>
    <p><ul>
    <li><a href="./api-attack-surface/overview/">Overview</a></li>
    <li><a href="./api-attack-surface/api-surface/">API Attack Surface Discovery</a></li>
    <li><a href="./api-attack-surface/api-leaks/">API Leaks Detection</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage vuln-title">Assets & Vulnerabilities</h3>
    <p><ul>
    <li><a href="./user-guides/scanner/">Exposed Assets</a></li>
    <li><a href="./about-wallarm/detecting-vulnerabilities/">Vulnerability Assessment</a></li>
    <li><a href="./vulnerability-detection/active-threat-verification/overview/">Active Threat Verification</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage waap-waf-title">WAAP/WAF</h3>
    <p><ul>
    <li><a href="./about-wallarm/waap-overview/">Overview</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-ddos/">DDoS Protection</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bruteforce/">Brute Force Protection</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-forcedbrowsing/">Forced Browsing Protection</a></li>
    <li><a href="./user-guides/rules/rate-limiting/">Rate Limiting</a></li>    
    <li><a href="./user-guides/rules/vpatch-rule/">Virtual Patching</a></li>
    <li><a href="./user-guides/rules/regex-rule/">User-Defined Detectors</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage deployment-title">Deployment</h3>
    <p><ul>
    <li><a href="./installation/supported-deployment-options/">All Deployment Options</a></li>
    <li><a href="./installation/oob/overview/">Out-of-Band</a></li>
    <li><a href="./installation/supported-deployment-options/#public-clouds">Public Clouds</a></li>
    <li><a href="./installation/supported-deployment-options/#kubernetes">Kubernetes</a></li>
    <li><a href="./installation/inline/overview/">In-Line</a></li>
    <li><a href="./installation/connectors/overview/">Connectors</a></li>
    <li><a href="./installation/supported-deployment-options/#packages">Packages</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage integration-title">Integrations and Alerts</h3>
    <p><ul>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#email-and-messengers">Email and Messengers</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#incident-and-task-management-systems">Incident and Task Management Systems</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#siem-and-soar-systems">SIEM and SOAR Systems</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#log-management-systems">Log Management Systems</a></li>
    <li><a href="./user-guides/settings/integrations/integrations-intro/#data-collectors">Data Collectors</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage user-management-title">User Management</h3>
    <p><ul>
    <li><a href="./user-guides/settings/users/">Overview</a></li>
    <li><a href="./user-guides/settings/account/">User Profile</a></li>
    <li><a href="./user-guides/settings/api-tokens/">API Tokens</a></li>
    <li><a href="./admin-en/configuration-guides/sso/intro/">SAML SSO</a></li>
    <li><a href="./admin-en/configuration-guides/ldap/ldap/">Using LDAP</a></li>
    <li><a href="./user-guides/settings/audit-log/">Activity Log</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage operations-title">Operations</h3>
    <p><ul>
    <li><a href="./user-guides/settings/applications/">Applications</a></li>
    <li><a href="./admin-en/configure-parameters-en/">NGINX‑Based Nodes</a></li>
    <li><a href="./admin-en/using-proxy-or-balancer-en/">Proper Reporting of End‑User IP</a></li>
    <li><a href="./admin-en/configuration-guides/allocate-resources-for-node/">Resource Allocation</a></li>
    <li><a href="./admin-en/configure-logging/">Filtering Node Logs</a></li>
    <li><a href="./updating-migrating/what-is-new/">Node Upgrade</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage references-title">References</h3>
    <p><ul>
    <li><a href="./faq/ingress-installation/">FAQ</a></li>
    <li><a href="./news/">Changelog & News</a></li>
    <li><a href="./api/overview/">Wallarm API Reference</a></li>
    <li><a href="./admin-en/managing/terraform-provider/">Wallarm Terraform Provider</a></li>
    <li><a href="./integrations-devsecops/verify-docker-image-signature/">Verifying Docker Image Signatures</a></li>
    </ul></p>
</div>

</div>
