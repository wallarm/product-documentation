# Multitenancy Overview

The **multitenancy** feature allows using Wallarm to protect several independent company infrastructures or isolated environments simultaneously.

**Tenant** ([**tenant account**](#tenant-accounts)) represents the following entities:

* An independent company (**client**) if integrating Wallarm as a partner.
* An isolated environment if integrating Wallarm as a client.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Issues addressed by multitenancy

The multitenancy feature is addressing the following issues:

* **Become a partner of Wallarm**. The partner is an organization that installs a filtering node within their system infrastructure to provide their clients with attack mitigation.

    Each client will be allocated a separate account in Wallarm Console so that all account data will be isolated and accessible only for selected users.
* **Isolate the data on protected environments from each other**. An environment can be a separate application, data center, API, production or staging environment, etc.

    Related issue examples:

    * Wallarm node filters requests sent to production and staging environments managed by isolated teams. The requirement is to ensure that only the teams managing a particular environment have access to its data.
    * Wallarm nodes are deployed to several data centers managed by isolated teams and located in different regions, one is in Europe and another is in Asia. The requirement is to ensure that only the users managing a particular data center have access to its data.

    Each client will be allocated a separate account in Wallarm Console so that all account data will be isolated and accessible only for selected users.

## Customization of Wallarm components

Wallarm allows customization of Wallarm Console and some other components. If using multitenancy, the following customization options can be useful:

* Brand Wallarm Console
* Host Wallarm Console on a custom domain
* Set the email address for your technical support to receive messages from clients or colleagues

## Tenant accounts

Tenant accounts are characterised by the following:

* To correctly group tenant accounts in Wallarm Console, each tenant account is linked to the global account, indicating a partner or a client with isolated environments.
* Users are provided with access to each tenant account separately.
* Data of each tenant account is isolated and accessible only to users added to the account.
* Users with **global** [roles](../../user-guides/settings/users.md#user-roles) can create new tenant accounts and view and edit all tenant accounts' data.

Tenant accounts are created according to the following structure:

![!Tenant account structure](../../images/partner-waf-node/accounts-scheme.png)

* **Global account** is used only to group tenant accounts by a partner or a client.
* **Technical tenant account** is used to add [global users](../../user-guides/settings/users.md#user-roles) providing them with access to tenant accounts. Global users are usually employees of Wallarm partner companies or Wallarm clients using multitenancy for isolated environments.
* **Tenant accounts** are used to:

    * Provide tenants with access to the data on detected attacks and to the traffic filtration settings.
    * Provide users with access to certain tenant account's data.

[Global users](../../user-guides/settings/users.md#user-roles) can: 

* Switch between accounts in Wallarm Console.
* Monitor tenants' [subscriptions and quotas](../../about-wallarm/subscription-plans.md).

![!Tenant selector in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

* `Technical tenant` is a technical tenant account
* `Tenant 1` and `Tenant 2` are tenant accounts

## Multitenancy configuration

The multitenancy feature is inactive by default. To enable and configure the feature:

1. Send the request to [sales@wallarm.com](mailto:sales@wallarm.com) to add the **Multi-tenant system** feature to your subscription plan.
2. [Configure](configure-accounts.md) tenant accounts in Wallarm Console.
3. [Deploy and configure](deploy-multi-tenant-node.md) the multi-tenant Wallarm node.
