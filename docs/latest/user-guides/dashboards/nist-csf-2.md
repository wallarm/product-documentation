# NIST Cyber Security Framework 2.0 (Beta)

The [NIST cybersecurity framework](https://www.nist.gov/cyberframework), created by the National Institute of Standards and Technology, defines key pillars for an effective security strategy. Wallarm's services align with the most of NIST pillars, ensuring comprehensive protection for our customers. Our dashboard demonstrates this alignment and assists in configuring the platform's features.

![NIST Dashboard](../../images/user-guides/dashboard/nist-csf-2-dash.png)

## Respond

Wallarm's arsenal equips you to aptly respond to identified security threats:

* [Active blocking] to prevent malicious activities from reaching your APIs.
* API risk management: Wallarm enables streamlined management of detected vulnerabilities by enabling you to swiftly [update vulnerability statuses] for better security oversight.
* [Integrations and alerts] allowing you to craft and route security alerts to your SIEM, SOAR, and other systems.

## Identify

Wallarm provides the tools designed to understand your company's business landscape, resources, and potential security vulnerabilities. These tools illuminate your attack surface and assist in ranking assets according to their risk scores:

* [API attack surface management] is a set of capabilities that allows organizations to enumerate, assess, and manage the public attack surface presented by their APIs.
* [API Discovery] crafts a precise inventory of your application's REST API based on real-time usage, effectively identifying zombie, orphan, and shadow APIs.
* [API risk scoring]: Wallarm automatically assigns risk scores for your API endpoints based on factors like data exposure and vulnerabilities, but also provides customization by letting you adjust the significance of these factors.

## Protect

Wallarm provides robust protection against a wide range of known and emerging threats:

* [Application and API Protection (WAAP)] which is a next-gen Web Application Firewall supporting multiple API protocols, such as REST, SOAP, GraphQL, and others, and implying a deep packet inspection to fully cover OWASP Top 10 and more.
* API Threat Prevention that includes [API abuse], [credential stuffing], and other automated API threat prevention.

## Detect

To identify anomalies, indicators of compromise, and other potential adverse events, Wallarm emphasizes consistent monitoring of assets as follows:

* [Vulnerability detection]: using real Internet traffic, Wallarm identifies API vulnerabilities by assessing attackers' attempts, all while keeping your servers safe.
* [API leaks]: Wallarm's API Leaks module scans public repositories to identify exposed API tokens. Upon detecting leaks, Wallarm alerts you, allowing prompt analysis and action.
* [API security testing]: Wallarm's Framework for API Security Testing integrates seamlessly into your CI/CD and early-stage security assessment processes. It identifies vulnerabilities before deployment, enabling proactive measures to prevent production risks.
