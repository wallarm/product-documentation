[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md
[link-deployment-on-prem]:      ../installation/on-premise/overview.md

# Wallarm Platform Overview

In today's digital world, APIs face growing threats, especially with the rise of AI. Traditional security can overlook API vulnerabilities or be difficult to deploy. With Wallarm, you get a single platform for API protection and inventory observability across cloud-native and on-prem environments.

Enterprises prefer Wallarm for its enhanced API security, easy deployment, and value. It combines API discovery, risk management, real-time protection, and testing with advanced API security capabilities.

![Diagram](../images/about-wallarm-waf/overview/wallarm-features.png)

Wallarm's functional areas align with [NIST cybersecurity framework (CSF)](https://www.nist.gov/cyberframework), ensuring comprehensive protection for our customers.

## Discover

You need to know it to protect it. Wallarm offers comprehensive API discovery capabilities to identify APIs in your environment and evaluate their security risks. Here is what Wallarm's API discovery does:

* [Detects your API endpoints and their parameters](../api-discovery/overview.md), and continually updates the API view through consistent traffic analysis.
* [Identifies rogue endpoints](../api-discovery/rogue-api.md), including shadow, orphan, and zombie APIs.
* Spots endpoints that could expose sensitive data, like PII.
* [Assesses each endpoint for security risks](../api-discovery/risk-score.md), vulnerabilities, and provides a risk score.

![Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## Protect

Wallarm extends discovery to deliver real protection by detecting and blocking application and API attacks in traffic. Wallarm’s proprietary detection techniques deliver highly accurate results, including detection of attacks against [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/) vulnerabilities. Here is how Wallarm ensures protection:

* Detects attacks both [inline](../installation/inline/overview.md) and [out-of-band](../installation/oob/overview.md).
* Combats [various threats](../attacks-vulns-list.md), from web-based to API-specific ones, like code injections, remote code execution, brute force, BOLA, and more.
* Identifies [API specific malicious bot abuse](../api-abuse-prevention/overview.md).
* Counters Layer 7 Denial of Service attacks with customizable [rate limiting](../user-guides/rules/rate-limiting.md).
* Allows users to create [custom defenses](../user-guides/rules/regex-rule.md) by setting their own threat definitions, complementing the built-in measures.
* Maps attacks with your system's vulnerabilities to highlight critical incidents.
* Detects [credential stuffing attempts](../about-wallarm/credential-stuffing.md).

## Respond

Wallarm gives you the tools to effectively respond to security threats, offering in-depth data, broad integrations, and blocking mechanisms. It first presents detailed information, helping security analysts gauge the threat's nature and severity. You can then tailor responses, act on threats, and send alerts to relevant systems. Here is how Wallarm backs you up:

* [Deep attack inspection](../user-guides/events/check-attack.md), which includes unpacked encoded requests, detailing every aspect of an attack, from headers to the body.
* [Geolocation-based controls](../user-guides/ip-lists/overview.md) to block suspicious traffic sources like VPNs and Tor networks.
* [Attack blocking measures](../admin-en/configure-wallarm-mode.md#available-filtration-modes) to prevent malicious activities from reaching your APIs.
* [Integrations](../user-guides/settings/integrations/integrations-intro.md) with the most widely used security, operational, and development tools to create tickets, notifications, and deliver data on detected security threats. Compatible platforms include Slack, Sumo Logic, Splunk, Microsoft Sentinel, and more.
* [Virtual patches](../user-guides/rules/vpatch-rule.md) for urgent issues highlighted by Wallarm's vulnerability detection.

![Events](../images/about-wallarm-waf/overview/events-with-attacks.png)

## Test

Managing deployed risk is the first line of defense, but reducing the risk exhibited by product applications and APIs is the most effective way to reduce incidents. Wallarm closes the loop on application and API security by providing a [suite of testing capabilities](../about-wallarm/detecting-vulnerabilities.md#detection-methods) to find and eliminate applications' and APIs' **security issues (vulnerabilities)**:

* With the installed [Wallarm filtering node](#filtering-node):

    * Your security issues are found **by default without any further configuration**, just by working Wallarm filtering node based on its analysis of the actual traffic, including both requests and responses. As no special test requests are sent, this is called [passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection).
    * For a single attack, passive detection checks only one request/response pair. By configuring [Threat Replay Testing (TRT)](../vulnerability-detection/threat-replay-testing/overview.md), use this data from the traffic as a start point to create multiple attack modifications to try all of them on a test server.

* Even **without node** (agentless solutions):

    * Discover your external hosts, their APIs and security issues and further manage the discovered vulnerability mitigation with [API Attack Surface Management (AASM)](../api-attack-surface/overview.md).
    * Use [Schema-Based Testing (SBT)](../vulnerability-detection/schema-based-testing/overview.md) Wallarm's dynamic application security testing (DAST) solution that enables "shift-left" security - proactively identifies a wide range of vulnerabilities early in the development process. SBT starts as Docker container and is tailored to your specification.

Explore and manage all found security issues, regardless of the detection method, in one unified management center in Wallarm Console - the [**Security Issues**](../user-guides/vulnerabilities.md) section.

![Security Issues](../images/api-attack-surface/security-issues.png)

## How Wallarm works

Wallarm's platform is primarily built upon two main components: the Wallarm filtering node and the Wallarm Cloud.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### Filtering node

Positioned between the Internet and your APIs, the Wallarm filtering node:

* Analyzes the company's entire network traffic and mitigates malicious requests.
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud.
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis.
* Detects sensitive data in your requests, ensuring it remains secure within your infrastructure and is not transmitted to the Cloud as to a third-party service.

You can set up the Wallarm filtering node within [your own network](../installation/supported-deployment-options.md) or opt for [Wallarm Security Edge](../installation/security-edge/overview.md).

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads.
* Compiles custom resource-specific security rules.
* Scans the company's exposed assets to detect vulnerabilities.
* Builds API structure based on the traffic metrics received from the filtering node.
* Houses the Wallarm Console UI, your command center for navigating and configuring the Wallarm platform, ensuring you have a comprehensive view of all security insights.

Wallarm offers cloud instances in both the US and Europe, enabling you to select the best fit considering your data storage preferences and regional service operation requirements.

[Proceed to signup on the US Wallarm Cloud](https://us1.my.wallarm.com/signup)

[Proceed to signup on the EU Wallarm Cloud](https://my.wallarm.com/signup)

## Where Wallarm works

The [described](#how-wallarm-works) Wallarm components: filtering node and Cloud - can be deployed in one of three forms:

--8<-- "../include/deployment-forms.md"

See details on [shared responsibility](shared-responsibility.md) for each deployment form.
