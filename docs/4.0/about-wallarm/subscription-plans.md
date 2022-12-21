# Wallarm subscription plans

The subscription plan outlines the access conditions to the Wallarm products: subscription period, the set of available modules, and features.

Different subscription plans are used for:

* API Security
* API Discovery

This document describes the components that may be included into the Wallarm subscription plans and how to configure them.

## Subscription plans

The subscription plan includes a set of modules and features. You can select and include any modules listed below into your plan. The set of options in the plan is defined individually with each client.

### Modules

The set of all Wallarm platform modules is provided below. Modules can be added to any subscription plan additionally, so the set of modules is not fixed within the subscription plan.

* **API Threat Prevention / Web Application Firewall** continuously analyzes HTTP and HTTPS traffic and blocks malicious requests. Traffic analysis is performed with the DPI (Deep packet inspection) technology, and the decision to block a request is made in real time.
* **[Brute-force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)** automatically denylists IP addresses from which brute-force attacks are sent.
* **[Active threat verification](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)** detects active application vulnerabilities that could be exploited during an attack. For this, the module automatically replays attacks from real traffic processed by the filtering node and looks for vulnerabilities in the corresponding parts of the application.
* **[Custom ruleset setup](../user-guides/rules/compiling.md)** allows you to manually add request processing rules: block malicious requests if the filtering node is working in the `monitoring` mode or if any known malicious payload is not detected in the malicious request / detect the attack based on the specified regular expression / cut out sensitive information such as passwords or cookies from the uploading to the Wallarm Cloud / enable and disable the blocking of requests to various parts of a web application.
* **[Exposed asset Scanner](../user-guides/scanner/check-scope.md)** scans the company's exposed assets: discovering new domains, IP addresses, services, and notification of new objects.
* **[Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)** detects common types of vulnerabilities in the application in accordance with the OWASP Top 10 recommendations. The list of vulnerabilities that can be detected is available at this [link](../attacks-vulns-list.md).
* **[API Discovery](../about-wallarm/api-discovery.md)** identifies your application API structure based on the actual API usage. The module continuously analyzes the real traffic requests and builds the API structure based on the analysis results. The **API Discovery** module is provided within a separate subscription plan.

### Features

The set of features included to the subscription plan is defined individually with each client. The following features can be included:

* Limit for requests processed per month
* Multi-tenant system
* Period of event storage
* Number of users
* Level of technical support

To define features that should be included to your subscription plan, please send the request to [sales@wallarm.com](mailto:sales@wallarm.com). 

## Free tier subscription plan (US Cloud)

When a new user is registered in Wallarm Console of the **[US Cloud](overview.md#cloud)**, a new client account with a **Free Tier** subscription plan is automatically created in the Wallarm system.

The Free Tier subscription includes:

* The Wallarm features available for free up to the quota of **500 thousand requests per month** with no limitation in time. The quota resets on the first day of each month.
* Access to the Wallarm platform with the maximum set of modules and features, except for the following:
    * [Vulnerability](detecting-vulnerabilities.md#vulnerability-scanner) and [Exposed asset](../user-guides/scanner/check-scope.md) Scanners
    * The [API Abuse Prevention](api-abuse-prevention.md) module
    * Deployment of the [CDN node](../installation/cdn-node.md) type

**What happens if the quota is exceeded?**

If the company account exceeds the Free Tier monthly quota:

* Access to the company account is temporarily disabled.
* Integrations are temporarily disabled.

These restrictions will be in effect until the first day of the next month. Contact the Wallarm [sales team](mailto:sales@wallarm.com) to restore service immediately by switching to one of the paid subscription plans.

Information about the Free Tier subscription usage is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).

## Trial period (EU Cloud)

When a new user is registered in Wallarm Console of the **[EU Cloud](overview.md#cloud)**, a new client account with an active trial period is automatically created in the Wallarm system.

* The trial period is free.
* The trial period lasts 14 days.
* Wallarm trial provides the maximum set of modules and features that can be included in a paid subscription to Wallarm.
* Wallarm trial also activates API Discovery trial.
* The trial period can be extended for 14 days more only once.

    The trial period can be extended in the Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md) section and via the button from the email notifying about the end of the trial period. The email is sent only to users with the [role **Administrator** and **Global Administrator**](../user-guides/settings/users.md#user-roles).
* If the trial period expired:

    * The account in Wallarm Console will be blocked.
    * The Wallarm node and Wallarm Cloud synchronization will be stopped.
    * The Wallarm node will operate locally but will not get any updates from the Wallarm Cloud as well as will not upload data to the Cloud.
    
    When a paid Wallarm subscription is activated, access to the client account is restored for all users.

Information about the trial period is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).

## Subscription management

* To activate, cancel, or change a subscription, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
* Information about active subscription is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).
* Subscription cost is determined based on [incoming traffic volume](../admin-en/operation/learn-incoming-request-number.md), subscription period, the set of connected modules, and features.
