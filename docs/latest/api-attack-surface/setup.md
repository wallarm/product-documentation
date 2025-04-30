# API Attack Surface Management Setup  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

This article describes how to enable and configure [API Attack Surface Management](overview.md) to discover your external hosts with their APIs, identify missing WAF/WAAP solutions, and mitigate API Leaks and other vulnerabilities.

## Enabling

To use AASM, the Wallarm's [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) subscription plan should be active for your company. To activate, do one of the following:

* If you do not have Wallarm account yet, get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).

    This activates the Core (freemium) version, and scanning of the used email's domain starts immediately. After activation, you can [add additional domains](setup.md) to the scope.

    You can continue using the Core version for as long as you need, provided that Enterprise features are not necessary for your use. See differences of different versions [here](https://www.wallarm.com/product/aasm-pricing).

* If you already have Wallarm account, contact [sales@wallarm.com](mailto:sales@wallarm.com).

## Adding domains

To configure [API Attack Surface Management](overview.md) to detect hosts under your selected domains and search for security issues related to these hosts:

1. Proceed to Wallarm Console → AASM → **API Attack Surface** section → **Configure**.
1. Add your domains to the scope and check the scanning status.

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Wallarm will list all hosts under your domains and show security issues related to them if there are any. During scan, at the **Status** tab, you can pause or continue scanning for any domain with pause/play buttons.

## Scheduled rescan

Previously added domains are automatically re-scanned once every 7 days - new hosts will be added automatically, previously listed but not found during re-scan will remain in the list.

## Manual rescan

You can re-start, pause or continue scanning for any domain manually at **Configure** → **Status** by clicking the play/pause buttons.

## Notifications

You automatically receive notifications to your personal email (the one you use to log in) about discovered hosts and security issues, including:

* **Daily critical security issues (new only)** - all [critical](security-issues.md#issue-risk-level) security issues opened for the day, sent once a day with a detailed description of each issue and instructions on how to mitigate it.
* **Daily security issues (new only)** - statistics for security issues opened for the day, sent once a day with information on how many issues of every [risk level](security-issues.md#issue-risk-level) were found and general action items for mitigation.
* **Weekly AASM statistics** - information about hosts, APIs, and statistics for security issues discovered for your configured domains within last week.

The notifications are enabled by default. You can unsubscribe at any moment and configure any additional emails to get all or some of these notifications in Wallarm Console → **Configuration** → **Integrations** → **Email and messengers** → **Personal email** (you email) or **Email report** (extra emails) as described [here](../user-guides/settings/integrations/email.md#setting-up-integration).