# Wallarm Platform Overview

Wallarm delivers all-in-one API security, identifying and shielding your APIs from vulnerabilities and malicious activities. In the digital landscape, many APIs and web applications unknowingly have vulnerabilities, potentially exposing sensitive business data to hackers. Wallarm stands against these risks, ensuring comprehensive protection for your infrastructure and business.

Wallarm seamlessly integrates API threat prevention with Web Application Firewall (WAF) capabilities. It ensures that both APIs and web applications, whether in multi‑cloud or cloud‑native environments, are protected given their unique security challenges.

At Wallarm, we deliver powerful and complete protection for our customers encompassing essential pillars of a successful security strategy, from **Govern** to **Respond**.

![NIST diagram](../images/about-wallarm-waf/overview/nist.png)

## Identify

Wallarm provides the tools designed to understand your company's business landscape, resources, and potential security vulnerabilities. These tools illuminate your attack surface and assist in ranking assets according to their risk scores:

* Exposed asset Scanner delves into the company's public-facing assets, autonomously identifying domains, IP addresses, and services.
* API Discovery crafts a precise inventory of your application's REST API based on real-time usage, effectively identifying zombie, orphan, and shadow APIs.. By consistently analyzing live traffic, the module maintains an updated view of all APIs, including associated attacks and security vulnerabilities.
* Sensitive data detection: Every endpoint recognized by the API Discovery is analyzed to determine if they handle sensitive data - like login details, financial information such as credit card numbers, or Personally Identifiable Information (PII) like passport data.

## Protect

Wallarm provides robust protection against a wide range of known and emerging threats, covering those listed in the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/). Here is a snapshot of the threats Wallarm mitigates:

* L7 DDoS mitigation: personalized [rate limiting] ensures you are not overwhelmed by excessive, unwanted traffic.
* Web-based attacks: this includes code injections (e.g., SQL and XSS), remote code execution, brute force assaults, forced browsing, and BOLA (Broken Object Level Authorization).
* Custom defenses: beyond its in-built protective measures, Wallarm allows users to define threats using custom attack detection signatures.
* API abuse perfomed by malicious bots.

<!-- API Policy Enforcement (later) -->

[Guide on leveraging Wallarm for optimum protection](../quickstart/attack-prevention-best-practices.md)

## Detect

To identify anomalies, indicators of compromise, and other potential adverse events, Wallarm emphasizes consistent monitoring of assets as follows:

* [Vulnerability detection]: using real Internet traffic, Wallarm identifies API vulnerabilities by assessing attackers' attempts, all while keeping your servers safe.
* [API leaks]: Wallarm's API Leaks module scans public repositories to identify exposed API tokens. Upon detecting leaks, Wallarm alerts you, allowing prompt analysis and action.
* [Active Threat Verification]: this module turns attackers into your own penetration testers. It analyzes initial attack attempts, then explores other ways the same attack could be exploited. This exposes weak spots in your environment that even the original attackers did not find.
* [API security testing]: Wallarm's Framework for API Security Testing integrates seamlessly into your CI/CD and early-stage security assessment processes. It identifies vulnerabilities before deployment, enabling proactive measures to prevent production risks.

<!-- Credential stuffing -->

## Respond

Wallarm's arsenal equips you to aptly respond to identified security threats:

* [Block attacks] to prevent malicious activities from reaching your APIs.
* Utilize [geolocation-based controls] to block suspicious traffic sources like VPNs and Tor networks.
* [Receive security threat notifications] seamlessly connecting with messengers, log management, incident and task management systems, and data collectors like Slack, Sumo Logic, Splunk, Microsoft Sentinel, and more.
* Address Wallarm-flagged vulnerabilities by either direct fixes or employing [virtual patches] for urgent issues.

## Govern

To establish and oversee an company’s security risk strategy, policies, and procedures, Wallarm provides tools that integrate security protocols with your specific guidelines:

* [API risk scoring]: Wallarm automatically assigns risk scores for your API endpoints based on factors like data exposure and vulnerabilities, but also provides customization by letting you adjust the significance of these factors.
* API risk management: Wallarm enables streamlined management of detected vulnerabilities by enabling you to swiftly [update vulnerability statuses] for better security oversight. Additionally, you can craft and route security alerts to your [SIEM, SOAR, and other systems], weaving Wallarm's functions into your broader risk management frameworks.

All these capabilities enable you to align the Wallarm Platform's actions with your organization's security standards.

## Wallarm platform components

Wallarm's platform is primarily built upon two main components: the Wallarm filtering node and the Wallarm Cloud.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### Filtering node

Positioned between the Internet and your APIs, the Wallarm filtering node:

* Analyzes the company's entire network traffic and mitigates malicious requests.
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud.
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis.
* Detects sensitive data in your requests, ensuring it remains secure within your infrastructure and is not transmitted to the Cloud as to a third-party service.

You can set up the Wallarm filtering node within your own network or opt for a third-party hosted node via the [available deployment choices](../installation/supported-deployment-options.md).

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads.
* Compiles custom resource-specific security rules.
* Scans the company's exposed assets to detect vulnerabilities.
* Builds API structure based on the traffic metrics received from the filtering node.
* Houses the Wallarm Console UI, your command center for navigating and configuring the Wallarm platform, ensuring you have a comprehensive view of all security insights.

Wallarm offers cloud instances in both the US and Europe, enabling you to select the best fit considering your data storage preferences and regional service operation requirements.

[Proceed to signup on the Wallarm Cloud](../quickstart/getting-started.md)
