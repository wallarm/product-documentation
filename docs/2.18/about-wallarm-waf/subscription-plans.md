# Wallarm API Security subscription plans

The subscription plan outlines the access conditions to Wallarm API Security: subscription period, the set of available modules, and features.

This document describes the components of the Wallarm API Security subscription plan and how to configure it.

## Subscription plans

The subscription plan includes a set of modules and features. You can select and include any modules listed below into your plan. The set of options in the plan is defined individually with each client.

### Modules

The set of all Wallarm API Security modules is provided below. Modules can be added to any subscription plan additionally, so the set of modules is not fixed within the subscription plan.

* **API Threat Prevention / Web Application Firewall** continuously analyzes HTTP and HTTPS traffic and blocks malicious requests. Traffic analysis is performed with the DPI (Deep packet inspection) technology, and the decision to block a request is made in real time.
* **[Brute-force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)** automatically blacklists IP addresses from which brute-force attacks are sent.
* **[Active threat verification](../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification)** detects active application vulnerabilities that could be exploited during an attack. For this, the module automatically replays attacks from real traffic processed by the filtering node and looks for vulnerabilities in the corresponding parts of the application.
* **[Custom ruleset setup](../user-guides/rules/compiling.md)** allows you to manually add request processing rules: block malicious requests if the filtering node is working in the `monitoring` mode or if any known malicious payload is not detected in the malicious request / detect the attack based on the specified regular expression / cut out sensitive information such as passwords or cookies from the uploading to the Wallarm Cloud / enable and disable the blocking of requests to various parts of a web application.
* **[Exposed asset Scanner](../user-guides/scanner/check-scope.md)** scans the company's exposed assets: discovering new domains, IP addresses, services, and notification of new objects.
* **[Vulnerability Scanner](../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner)** detects common types of vulnerabilities in the application in accordance with the OWASP Top 10 recommendations. The list of vulnerabilities that can be detected is available at this [link](../attacks-vulns-list.md).

### Features

The set of features included to the subscription plan is defined individually with each client. Examples of included features:

* Limit for requests processed per month
* Multi-tenant system
* Registration of events in the audit log
* Integration with SIEM / SOAR / DevOps systems
* Authentication in Wallarm Console with SAML SSO
* Receiving security reports
* etc

To define features that should be included to your subscription plan, please send the request to [sales@wallarm.com](mailto:sales@wallarm.com). 

## Trial period

When a new user is registered in Wallarm Console, a new client account with an active trial period is automatically created in the Wallarm system.

* The trial period is free.
* The trial period lasts 14 days.
* Wallarm API Security trial provides the maximum set of modules and features that can be included in a paid subscription to Wallarm API Security.
* The trial period can be extended for 14 days more only once.

    The trial period can be extended in the Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md) section and via the button from the email notifying about the end of the trial period. The email is sent only to users with the [role **Administrator** and **Global Administrator**](../user-guides/settings/users.md#user-roles).
* If the trial period expired, the client account is blocked. When a paid subscription to Wallarm API Security is activated, access to the client account is restored for all users.

Information about the trial period is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).

## Subscription management

* To activate, cancel, or change a subscription, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
* Information about active subscription is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).
* Subscription cost is determined based on [incoming traffic volume](../admin-en/operation/learn-incoming-request-number.md), subscription period, the set of connected modules, and features.
