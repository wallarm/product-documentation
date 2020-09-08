# Wallarm WAF subscription plans

Subscription plan is conditions to access Wallarm WAF: billing amount and frequency, the set of available modules and features.

This document describes the parts of the Wallarm WAF subscription plan and the way of forming these parts.

## Subscription plans

The subscription plan includes the set of modules and features. You can select any modules listed below to include to your plan. The set of options in the plan is defined individually with each client.

### Modules

The set of all Wallarm WAF modules is provided below. Modules can be added to any subscription plan additionally, so the set of modules is not fixed within the subscription plan.

* **WAF** continuously analyzes HTTP and HTTPS traffic and blocks malicious requests. Traffic analysis is performed with the DPI (Deep packet inspection) technology, and the decision to block a request is made in real time.
* **Brute-force protection** automatically blacklists IP addresses from which brute-force attacks are sent.
* **Active threat verification** detects open application vulnerabilities that could be exploited during an attack. For this, the module automatically replays attacks from real traffic processed by the WAF node and looks for vulnerabilities in the corresponding parts of the application.
* **Rules configuration** allows you to manually add request processing rules: block malicious requests if the WAF node is working in the `monitoring` mode or if any known attack vector is not detected in the malicious request / detect the attack based on the specified regular expression / cut out sensitive information such as passwords or cookies from the uploading to the Wallarm Cloud / enable and disable the blocking of requests to various parts of a web application.
* **Scope** scans the company's network perimeter: discovering new domains, IP addresses, services, and notification of new objects.
* **Vulnerability scanner** detects common types of vulnerabilities in the application in accordance with the OWASP Top 10 recommendations. The list of vulnerabilities that can be detected is available at the [link](../../attacks-vulns-list.md).

### Features

The set of features included to the subscription plan is defined individually with each client. Examples of features:

* Limit for requests processed per month
* Multi-tenant system
* Logging events
* Integration with SIEM / SOAR / DevOps systems
* Authentication in Wallarm Console with SAML SSO
* Receiving security reports
* etc

To define features that should be included to your subscription plan, please send the request to [support@wallarm.com](mailto:support@wallarm.com). 

## Subscription management

* To activate, cancel or change a subscription, please send a request to [support@wallarm.com](mailto:support@wallarm.com).
* Information about active subscription is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../../user-guides/settings/subscriptions.md).
* Subscription cost is determined based on [incoming traffic volume](../../admin-en/operation/learn-incoming-request-number.md), subscription period, the set of connected modules and features.
