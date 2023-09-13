# Wallarm Platform Overview

The Wallarm platform is adept at safeguarding your APIs and cloud applications from vulnerabilities and malicious activities. In the digital landscape, many APIs and web applications unknowingly have vulnerabilities, potentially exposing sensitive business data to hackers. Wallarm stands against these risks, ensuring comprehensive protection for your infrastructure and business.

Wallarm seamlessly integrates API threat prevention with Web Application Firewall (WAF) capabilities. It ensures that both APIs and web applications, whether in multi‑cloud or cloud‑native environments, are protected given their unique security challenges.

The [NIST Cybersecurity Framework] outlines key pillars essential for a successful security strategy, spanning core functions from **Govern** to **Respond**. At Wallarm, we align our services with these key steps, offering powerful and complete protection for our customers.

![NIST diagram](../images/about-wallarm-waf/overview/nist.png)

Although the Wallarm Platform does not manage the **Recover** function - since actions like restoring assets and systems after a security incident are up to you - we focus primarily on preventing such incidents. All our security measures are aimed at this goal.

## Govern

In harmony with the **Govern** NIST principle, Wallarm focuses on the creation and oversight of an organization's security risk strategy, standards, and procedures. We provide tailored tools to seamlessly integrate security protocols with your specific guidelines. Key features are:

* [API risk scoring]: personalize risk scoring criteria for your API endpoints, considering factors like sensitive data protection and existing vulnerabilities.
* [Custom security rules]: define specific attack signatures, set which attack types Wallarm should detect in your traffic, apply virtual patches, and manage data masking rules.
* Custom security triggers: craft Wallarm's reactions to specific security incidents.
* DevSecOps integrations: route Wallarm's security notifications to your SIEM, SOAR, and other systems, weaving Wallarm's functions into your broader risk management and notification frameworks.
* [User management](../user-guides/settings/users.md): facilitate team collaboration on traffic security and API oversight. Regulate access levels, from limited read-only permissions to full administrative control, in sync with your internal governance rules.

All these capabilities enable you to align the Wallarm Platform's actions with your organization's security standards.

## Identify

The **Identify** NIST function is all about grasping the business context, resources, and possible security threats. Wallarm offers tailored tools that not only uncover your attack surface but also help prioritize assets based on their risk scores:

* [API Discovery](api-discovery.md): this Wallarm's module crafts a precise inventory of your application's REST API based on real-time usage. By consistently analyzing live traffic, the module maintains an updated view of all APIs, sensitive data, and associated risks.
* [Vulnerability detection]: Wallarm's approach capitalizes on real Internet traffic to reveal vulnerabilities within your APIs. We harness attackers' efforts to our advantage, evaluating vulnerabilities from their attempts without letting them compromise your servers.
* [API risk scoring]: building on the insights from the API Discovery, this tool assigns a risk score to every endpoint, considering various aspects such as sensitive data interactions and presence of active vulnerabilities.

## Protect

The **Protect** NIST function centers on implementing safeguards to ensure the delivery of critical services. Wallarm provides robust protection against a wide range of known and emerging threats, covering those listed in the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/). Here is a snapshot of the threats Wallarm mitigates:

* Web-based attacks: this includes code injections (e.g., SQL and XSS), remote code execution, brute force assaults, forced browsing, and BOLA (Broken Object Level Authorization).
* API abuse perfomed by malicious bots.
* DDoS mitigation: personalized rate limiting ensures you are not overwhelmed by excessive, unwanted traffic.
* Custom defenses: beyond its in-built protective measures, Wallarm allows users to define threats using custom attack detection signatures.

[Guide on leveraging Wallarm for optimum protection](../quickstart/attack-prevention-best-practices.md)

## Detect

The **Detect** NIST function emphasizes consistent monitoring of assets to identify anomalies, indicators of compromise, and other potential adverse events. Here is how Wallarm champions this cause:

* Referencing the [**Protect**] function, Wallarm identifies a plethora of attack attempts. The **Events** section within the Wallarm Console UI lays out these threats for your investigation. Here, you have the flexibility to deep-dive into specific threats, employing an array of filters and sorting mechanisms to better understand the nature of the detected attacks.
* [API leaks]: Wallarm's API Leaks module scans thousands of public repositories and databases to detect exposed API tokens. If leaks are found, Wallarm promptly notifies you, enabling you to analyze them and take decisive actions.

## Respond

The **Respond** function of NIST dictates the necessary activities to act upon a detected security incident. Wallarm's arsenal equips you to aptly respond to identified security threats:

* [Block attacks]. While the Wallarm filtering node defaults to monitoring mode, allowing a full view of detected threats and ensure uninterrupted traffic flow, you can also switch to the blocking mode. In this mode, Wallarm blocks all malicious activities before they reach your APIs.
* Utilize [geolocation-based controls] to block suspicious traffic sources like VPNs and Tor networks.
* [Integrations & Notifications](../user-guides/settings/integrations/integrations-intro.md): With seamless integrations into SIEM/SOAR systems like Sumo Logic and Splunk, Wallarm forwards attack metrics to your SOC. Coupled with [triggers], it simplifies crafting alerts for specific threats and IPs.
* Address Wallarm-flagged vulnerabilities by either direct fixes or employing [virtual patches] for urgent issues.

## Wallarm platform components

Wallarm's platform is primarily built upon two main components: the Wallarm filtering node and the Wallarm Cloud.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### Filtering node

The Wallarm node component does the following:

* Analyzes the company's entire network traffic and mitigates malicious requests
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis

You can set up the Wallarm filtering node within your own network or opt for a third-party hosted node via the [available deployment choices](../installation/supported-deployment-options.md).

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads
* Compiles custom resource-specific security rules
* Scans the company's exposed assets to detect vulnerabilities
* Builds API structure based on the traffic metrics received from the filtering node
* On the Wallarm Cloud, the Wallarm Console UI is running that serves as the central hub for managing most of Wallarm's platform settings. This user interface guides you through the platform, allowing you to oversee issues identified by Wallarm.

Wallarm manages American and European cloud instances. Each Cloud is distinct regarding databases, API endpoints, client accounts, and more. A client linked to one Wallarm Cloud cannot access another. If you are utilizing both clouds, separate Wallarm Console and API endpoint accounts are necessary for each.
