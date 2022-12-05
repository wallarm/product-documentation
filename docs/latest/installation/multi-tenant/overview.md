# Multitenancy overview

The **multitenancy** feature allows using Wallarm to protect several independent company infrastructures or isolated environments simultaneously.

**Tenant** represents the following entities:

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

Depending on the Wallarm [subscription plan](../../about-wallarm/subscription-plans.md), some options may be unavailable.

## Multitenancy configuration

The multitenancy feature is inactive by default. To enable and configure the feature:

1. Send the request to [sales@wallarm.com](mailto:sales@wallarm.com) to add the **Multi-tenant system** [feature](../../about-wallarm/subscription-plans.md#features) to your subscription plan.
2. [Configure](configure-accounts.md) tenant accounts in Wallarm Console.
3. [Deploy and configure](deploy-multi-tenant-node.md) the multi-tenant Wallarm node.
