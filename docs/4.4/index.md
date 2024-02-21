---
hide:
- navigation
- toc
- feedback
---

# Wallarm API Security

The Wallarm solution protects APIs, microservices and web applications from OWASP API Top 10 threats,<br>API abuse and other automated threats with no manual rule configuration and ultra‑low false positives.

!!! warning "Wallarm node 4.4 support will end soon"
    Wallarm node 4.4 support will end [soon](/updating-migrating/versioning-policy/#version-list). Please learn [what is new in the later versions](/updating-migrating/what-is-new/) and plan the upgrade procedure.

<div class="navigation">
<div class="navigation-card">
    <h3 class="icon-homepage quick-start-title">Quick start</h3>
    <p><ul>
    <li><a href="./about-wallarm/overview/">Wallarm Overview</a></li>
    <li><a href="./quickstart/">Quick Start Guide</a></li>
    <li><a href="./demo-videos/overview/">Video Guides</a></li>
    <li><a href="./about-wallarm/subscription-plans/">Subscription Plans</a></li>
    <li><a href="./about-wallarm/deployment-best-practices/">Deployment and Maintenance Best Practices</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage dashboard-title">Dashboards and Reports</h3>
    <p><ul>
    <li><a href="./user-guides/dashboards/threat-prevention/">Threat Prevention Dashboard</a></li>
    <li><a href="./user-guides/dashboards/api-discovery/">API Discovery Dashboard</a></li>
    <li><a href="./user-guides/dashboards/owasp-api-top-ten/">OWASP API Top 10 Dashboards</a></li>
    <li><a href="./user-guides/search-and-filters/use-search/">Event Search and Analysis</a></li>
    <li><a href="./user-guides/search-and-filters/custom-report/">Email PDF and CSV Reports</a></li>
    <li><a href="./user-guides/settings/audit-log/">Activity Log</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage integration-title">Integrations and Alerts</h3>
    <p><ul>
    <li><a href="./user-guides/settings/integrations/integrations-intro/">Integrations</a></li>
    <li><a href="./user-guides/triggers/triggers/">Configuring Alerts using Triggers</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage vuln-title">API Attack Surface</h3>
    <p><ul>
    <li><a href="./about-wallarm/attack-surface/">Overview</a></li>
    <li><a href="./user-guides/scanner/">Exposed Assets</a></li>
    <li><a href="./about-wallarm/api-leaks/">API Leaks</a></li>
    <li><a href="./about-wallarm/detecting-vulnerabilities/">Vulnerability Assessment</a></li>
    <li><a href="./vulnerability-detection/active-threat-verification/overview/">Active Threat Verification</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-discovery-title">API Discovery</h3>
    <p><ul>
    <li><a href="./about-wallarm/api-discovery/">Overview</a></li>
    <li><a href="./user-guides/api-discovery/">Managing API Portfolio</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-threat-prevent">API Protection</h3>
    <p><ul>
    <li><a href="./admin-en/configuration-guides/protecting-against-bola/">BOLA (IDOR) Protection</a></li>
    <li><a href="./about-wallarm/api-abuse-prevention/">API Abuse Prevention</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage api-security-testing">API Security Testing</h3>
    <p><ul>
    <li><a href="./fast/openapi-security-testing/">OpenAPI Security Testing</a></li>
    <li><a href="./fast/">Framework for API Security Testing</a></li>
    <li><a href="./fast/operations/test-policy/fuzzer-intro/">API Fuzzing</a></li>
    <li><a href="./fast/dsl/intro/">DSL for Custom Detects</a></li>
    <li><a href="./fast/poc/integration-overview/">Integration into CI/CD</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage waap-waf-title">WAAP/WAF</h3>
    <p><ul>
    <li><a href="./about-wallarm/protecting-against-attacks/">Attack Detection Procedure</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-ddos/">DDoS Protection</a></li>
    <li><a href="./admin-en/configuration-guides/protecting-against-bruteforce/">Brute Force Protection</a></li>
    <li><a href="./user-guides/ip-lists/overview/">Geolocation Restrictions</a></li>
    <li><a href="./user-guides/rules/intro/">Rules</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage user-management-title">User Management</h3>
    <p><ul>
    <li><a href="./user-guides/settings/users/">Overview</a></li>
    <li><a href="./user-guides/settings/account/">User Profile</a></li>
    <li><a href="./user-guides/settings/general/">Logout Settings</a></li>
    <li><a href="./user-guides/settings/api-tokens/">API Tokens</a></li>
    <li><a href="./admin-en/configuration-guides/sso/intro/">SAML SSO</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage deployment-title">Deployment</h3>
    <p><ul>
    <li><a href="./installation/supported-deployment-options/">All Deployment Options</a></li>
    <li><a href="./admin-en/installation-nginx-overview/">NGINX</a></li>
    <li><a href="./installation/supported-deployment-options/#cloud-platforms">Cloud Platforms</a></li>
    <li><a href="./installation/supported-deployment-options/#kubernetes">Kubernetes</a></li>
    <li><a href="./installation/supported-deployment-options/#docker-images">Docker Images</a></li>
    <li><a href="./installation/supported-deployment-options/#deb-and-rpm-packages">Packages</a></li>
    </ul></p>
</div>

<div class="navigation-card">
    <h3 class="icon-homepage operations-title">Operations</h3>
    <p><ul>
    <li><a href="./admin-en/configure-parameters-en/">Configuration Options for NGINX‑Based Node</a></li>
    <li><a href="./admin-en/configure-wallarm-mode/">Filtration Mode</a></li>
    <li><a href="./admin-en/using-proxy-or-balancer-en/">Proper Reporting of End‑User IP</a></li>
    <li><a href="./admin-en/configuration-guides/allocate-resources-for-node/">Resource Allocation</a></li>
    <li><a href="./user-guides/settings/applications/">Splitting Traffic and Settings by Applications</a></li>
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
