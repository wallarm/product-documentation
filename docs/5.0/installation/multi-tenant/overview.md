# Multitenancy Overview

The **multitenancy** feature allows using Wallarm to protect several independent company infrastructures or isolated environments simultaneously.

**Tenant** ([**tenant account**](#tenant-accounts)) represents the following entities:

* An independent company (**client**) if integrating Wallarm as a partner.
* An isolated environment if integrating Wallarm as a client.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Issues addressed by multitenancy

The multitenancy feature is addressing the following issues:

* **Become a partner of Wallarm**. The partner is an organization that installs a filtering node within their system infrastructure to provide their clients with attack mitigation.

    Each client will be allocated a separate account in Wallarm Console so that all it's data will be isolated and accessible only for this client's users.

* **Isolate the data on protected environments from each other**. An environment can be a separate application, data center, API, production or staging environment, etc.

    Related issue examples:

    * Wallarm node filters requests sent to production and staging environments managed by isolated teams. The requirement is to ensure that only the teams managing a particular environment have access to its data.
    * Wallarm nodes are deployed to several data centers managed by isolated teams and located in different regions, one is in Europe and another is in Asia. The requirement is to ensure that only the users managing a particular data center have access to its data.

    Each environment will be allocated a separate account in Wallarm Console so that all its data will be isolated and accessible only for selected users.

    !!! info "Non-isolated environments"
        If you do not need to isolate environments, instead of multitenancy, you can use [applications](../../user-guides/settings/applications.md) to separate settings and viewing capabilities for these environments. This will organize environments within one account accessible to all its users.

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
* [Migrate rules](#migrating-rules) between tenants (global **administrators**)

![!Tenant selector in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

* `Technical tenant` is a technical tenant account
* `Tenant 1` and `Tenant 2` are tenant accounts

## Multitenancy configuration

The multitenancy feature is inactive by default. To enable and configure the feature:

1. Send the request to [sales@wallarm.com](mailto:sales@wallarm.com) to add the **Multi-tenant system** feature to your subscription plan.
2. [Configure](configure-accounts.md) tenant accounts in Wallarm Console.
3. [Deploy and configure](deploy-multi-tenant-node.md) the multi-tenant Wallarm node.

## Migrating rules

As [global administrator](../../user-guides/settings/users.md#user-roles), you can copy rules between tenants. This can be helpful in case you want to create/test all rules on the testing environment and only them put them on production environment.

Consider the following:

* Migrating includes [Rules](../../user-guides/rules/rules.md) and [Credential Stuffing Detection](../../about-wallarm/credential-stuffing.md) settings.
* During migration, all these will be blocked from viewing and editing both on **source** and **target** tenant. Also, rules compilation and sending to node will not start (both tenants) during migration process.
* The full set of rules is copied, not the separate or selected ones.
* The rules in the target tenant will be completely replaced during migration.

Due to all this, to provide data integrity, the **recommended approach** is:

* You copy the current state of all rules from production to test.
* On test, you modify, add and test.
* During tests, you do not change anything in rules on production.
* As soon as all is ok, you copy all rules from test to production.

To migrate rules between tenants:

1. In Wallarm Console, go to **source** tenant → any of the sections:

    * **Rules**
    * **Credential Stuffing**

1. Click **Migrate rules**, select **target** tenant by name or ID.
1. If necessary, configure mappings (for [applications](../../user-guides/settings/applications.md) and/or domains).

    ![!Migrating rules between tenants](../../images/partner-waf-node/migrating-rules-between-tenants.png)

1. Start rules migration. Lock page is displayed for all copied sections in **source** and **target**. Progress is displayed. On finish, notification about result is displayed.
1. If mappings were used, check they worked as expected.

In case of failure (connectivity problems or other errors during copying):

* **Source** is unlocked.
* **Target** remains locked, you make a decision: **rollback** (restore state that was before the beginning of the migration process and then unlock) or **retry migration**.
