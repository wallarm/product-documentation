# Wallarm subscription plans

The subscription plan outlines the access conditions to the Wallarm products: subscription period, the set of available modules, and features.

Different subscription plans are used for:

* API Security
* API Discovery

This document describes the components that may be included into the Wallarm subscription plans and how to configure them.

## Subscription plans

There are two main ways to use the Wallarm platforms that is also reflected in the subscription plans for the platform:

| Feature | WAAP | API Security |
| ------- | ---- | ------------ |
| OWASP Top 10 protection | + | + |
| Web Application protection | + | + |
| API service protection | + | + |
| Real-time Threat Prevention | + | + |
| API Abuse Prevention (Beta) | - | + |

## Free tier subscription plan

When a new user is registered in Wallarm Console of the **[US Cloud](overview.md#cloud)**, a new client account with a **Free Tier** subscription plan is automatically created in the Wallarm system.

!!! warning "Currently available only for US Cloud"
    The **Free Tier** subscription plan is available only for the US Cloud for now.

With the **Free Tier** subscription plan you can:

* Use Wallarm features for free up to the quota of **500 thousand requests per month**.
* Have the quota reset on the first day of each month.
* Have no limitation in time when using this subscription plan.

Free Tier subscription includes:

* API Security, except Scanner
* API Discovery

**What happens if the quota is exceeded?**

If the company account exceeds the Free Tier monthly quota:

* Access to the company account is temporarily disabled.
* Integrations are temporarily disabled.

These restrictions will be in effect until the first day of the next month. Contact the Wallarm [sales team](mailto:sales@wallarm.com) to restore service immediately by switching to one of the paid subscription plans.

Information about the Free Tier subscription usage is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).

## Trial period

When a new user is registered in Wallarm Console of the **[EU Cloud](overview.md#cloud)**, a new client account with an active trial period is automatically created in the Wallarm system.

* The trial period is free.
* The trial period lasts 14 days.
* Wallarm API Security trial provides the maximum set of modules and features that can be included in a paid subscription to Wallarm API Security.
* Wallarm API Security trial also activates API Discovery trial.
* The trial period can be extended for 14 days more only once.

    The trial period can be extended in the Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md) section and via the button from the email notifying about the end of the trial period. The email is sent only to users with the [role **Administrator** and **Global Administrator**](../user-guides/settings/users.md#user-roles).
* If the trial period expired:

    * The account in Wallarm Console will be blocked.
    * The Wallarm node and Wallarm Cloud synchronization will be stopped.
    * The Wallarm node will operate locally but will not get any updates from the Wallarm Cloud as well as will not upload data to the Cloud.
    
    When a paid subscription to Wallarm API Security is activated, access to the client account is restored for all users.

Information about the trial period is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).

## Subscription management

* To activate, cancel, or change a subscription, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
* Information about active subscription is displayed in Wallarm Console → **Settings** → [**Subscriptions**](../user-guides/settings/subscriptions.md).
* Subscription cost is determined based on [incoming traffic volume](../admin-en/operation/learn-incoming-request-number.md), subscription period, the set of connected modules, and features.
