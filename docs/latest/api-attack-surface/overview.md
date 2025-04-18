# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm's **API Attack Surface Management** (**AASM**) is an agentless detection solution  tailored to the API ecosystem, designed to discover external hosts with their APIs, identify missing WAF/WAAP solutions, and mitigate API Leaks and other vulnerabilities.

API Attack Surface Management includes:

* [API Attack Surface Discovery (AASD)](api-surface.md)
* [Security Issues Detection](security-issues.md)

![AASM](../images/api-attack-surface/aasm.png)

## How it works

API Attack Surface Management provides multiple automated activities described in the sections below.

### Step 1: External API attack surface discovery

* [Discovers](api-surface.md) external hosts and their APIs (including hosting e.g. CDN, IaaS, or PaaS providers).
* Identifies geolocation and data centers based on IP resolution.
* Provides insights into potential API protocols that an organization is using (JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB and more).
* Uncovers private API specifications unintentionally made publicly available.
* Continuously monitors changes in the external API attack surface to detect new APIs, shadow APIs, and rogue endpoints introduced during development or deployment.
* [Notifies](setup.md#notifications) your about discovery results and changes in your API attack surface.

### Step 2: WAF coverage discovery & testing

* [Discovers](api-surface.md) if APIs are protected by WAFs/WAAPs.
* Tests types of threats WAFs/WAAPs are configured to detect.
* Computes a [security score](api-surface.md#security-posture) for each discovered endpoint.
* Identifies and reports gaps in WAF configurations, such as missing rules for OWASP Top 10 vulnerabilities or lack of coverage for modern API-specific threats like BOLA and credential stuffing.

### Step 3: Automatic API leaks and vulnerability detection

* Once the external attack surface landscape is discovered, starts to [discover API leaks and vulnerabilities](security-issues.md) related to the discovered apps and APIs.
* Monitors and classifies vulnerabilities by severity, categorizing issues such as misconfigurations, weak encryption, or outdated dependencies to prioritize remediation efforts effectively.
* [Notifies](setup.md#notifications) your about found leaks and detected vulnerabilities.

## Vulnerability types detected

API Attack Surface Management detects:

* GraphQL misconfigurations
* Information exposures (debug data, configuration files, logs, source code, backups)
* Sensitive APIs exposure (e.g. Prometheus metrics, status pages, APIs exposing system/debug data)
* Most widespread cases of Path traversal, SQLi, SSRF, XSS, etc.
* Remote management interfaces exposure (including API Gateway's management interfaces)
* Database management interface exposure
* SSL/TLS misconfigurations
* API specification exposure
* API Leaks, including API Keys, PII (user names and passwords), authorization tokens (Bearer/JWT), and more 
* Outdated software versions and corresponding CVEs
* ~2k most popular web and API-related CVEs

See full list with the descriptions [here](security-issues.md#list-of-detected-issues).

## Enabling and setup

To start using API Attack Surface Management, enable and configure it as described in API [Attack Surface Management Setup](setup.md).
