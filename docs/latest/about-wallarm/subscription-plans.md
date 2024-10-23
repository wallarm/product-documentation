# Wallarm Subscription Plans

Wallarm is the only solution that unifies best-in-class API Security and WAAP capabilities to protect your entire API, and web application portfolio in multi-cloud,  cloud-native and on-premise environments. You can easily choose the set of functionality that best suits your needs.

## WAAP and Advanced API Security

**Cloud Native WAAP** - WAAP (Web Application & API Protection) subscription provides web applications and APIs with protection against common threats such as SQLi, XSS, brute force, etc. It supports all API protocols but does not cover some specific API threats.

**WAAP + Advanced API Security**. This bundle enhances general WAAP capabilities with comprehensive API Security tools to cover all OWASP API Top-10 threats.

| Feature | WAAP | WAAP + API Security |
| ------- | ----------------- | --------------------- |
| **Real-time protection** | | |
| [DDoS protection (L7)](../admin-en/configuration-guides/protecting-against-ddos.md) | Yes | Yes |
| [Geo/source filtering](../user-guides/ip-lists/overview.md) | Yes | Yes |
| [IP reputation feeds](../user-guides/ip-lists/overview.md#malicious-ip-feeds) | Yes | Yes |
| [Attack stamps (SQLi, XSS, SSRF, etc.)](../about-wallarm/protecting-against-attacks.md#input-validation-attacks) | Yes | Yes |
| [Customer defined signatures](../user-guides/rules/regex-rule.md) | Yes | Yes |
| [Virtual patching](../user-guides/rules/vpatch-rule.md) | Yes | Yes |
| [Brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) | Yes | Yes |
| [Forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) | Yes | Yes |
| [Distributed rate limiting](../user-guides/rules/rate-limiting.md) | Yes | Yes |
| [BOLA protection](../admin-en/configuration-guides/protecting-against-bola.md) | Manual triggers | Automated protection |
| [API Abuse Prevention (bot management)](../api-abuse-prevention/overview.md) | No | Yes |
| [Credential Stuffing Detection](../about-wallarm/credential-stuffing.md) | No | Yes |
| [API Specification Enforcement](../api-specification-enforcement/overview.md) | No | Yes |
| [GraphQL security policies](../api-protection/graphql-rule.md) | No | Yes |
| **Security posture** | | |
| [Exposed asset scanner](../user-guides/scanner.md) | Yes | Yes |
| [Vulnerability assessment](../user-guides/vulnerabilities.md) | Yes | Yes |
| [API Discovery](../api-discovery/overview.md) | No | Yes |
| [Sensitive data detection](../api-discovery/overview.md#sensitive-data-detection) | No | Yes |
| [Rogue API Detection (shadow, orphan zombie)](../api-discovery/rogue-api.md) | No | Yes |
| **Security testing** | | |
| [Active threat verification](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) | Yes | Yes |
| [OpenAPI security testing](../fast/openapi-security-testing.md) |  No | Yes |
| **Additional options** | | |
| [Deployment options](../installation/supported-deployment-options.md) | All | All |
| [Integrations](../user-guides/settings/integrations/integrations-intro.md) | All | All |
| [Number of users](../user-guides/settings/users.md#inviting-a-user) | Unlimited | Unlimited |
| [SSO authentication](../admin-en/configuration-guides/sso/intro.md) | Yes | Yes |
| [Role-based access control (RBAC)](../user-guides/settings/users.md#user-roles) | Yes | Yes |
| [Multi-tenant](../installation/multi-tenant/overview.md) | Yes (by request) | Yes (by request) |
| Period of event storage | 6 month | 6 month |
| Support | Standard/Advanced/Platinum | Standard/Advanced/Platinum |

To activate the subscription plan, contact [sales@wallarm.com](mailto:sales@wallarm.com).

## API Attack Surface

The **API Attack Surface** subscription plan provides a comprehensive view of publicly exposed APIs and related information with **zero deployment** and minimal configuration.

The subscription plan provides the [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) product which includes:

* [API Attack Surface Discovery](../api-attack-surface/api-surface.md)
* [API Leaks Detection](../api-attack-surface/api-leaks.md)

To activate the subscription plan, do one of the following:

* If you do not have Wallarm account yet, get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).

    When activating, scanning of the used email's domain starts immediately while you negotiate sales team. After activation, you can add additional domains to the scope.

* If you already have Wallarm account, contact [sales@wallarm.com](mailto:sales@wallarm.com).

## Security Edge

The Security Edge subscription plan allows you to deploy the Wallarm node on the managed environment, eliminating the need for onsite installation and management.

With Wallarm handling node hosting and maintenance, you can focus on your core infrastructure while benefiting from robust traffic filtering, attack detection, and secure communication - all backed by Wallarm.

Available Security Edge deployments include:

* [Security Edge Inline](../installation/security-edge/deployment.md)
* [Security Edge Connectors](../installation/se-connector.md)

To inquire about this subscription, please contact [sales@wallarm.com](mailto:sales@wallarm.com).

## Free Tier

For smaller companies and educational purposes, Wallarm offers the option to create a Free Tier account yourself. You can choose the Wallarm cloud that best suits your storage preferences:

* [Create Free Tier account on the US Wallarm Cloud](https://us1.my.wallarm.com/signup)
* [Create Free Tier account on the EU Wallarm Cloud](https://my.wallarm.com/signup)

The Free Tier accounts allow:

* Process up to **500 thousand requests per month** with no limitation in time.
* Access to the Wallarm platform as [Advanced API Security](#waap-and-advanced-api-security), except for the following:

    * Security Edge [Inline](../installation/security-edge/deployment.md) and [Connectors](../installation/se-connector.md)
    * [Exposed assets scanner](../user-guides/scanner.md)
    * [Vulnerability assessment](../user-guides/vulnerabilities.md)
    * [API Abuse Prevention](../api-abuse-prevention/overview.md)

If a Free Tier account exceeds 100% of the monthly quota, your access to the Wallarm Console is disabled, along with all integrations. When reaching 200%, protection on your Wallarm nodes is disabled. These restrictions will be in effect until the first day of the next month.

You can easily remove all restrictions by [migrating to paid subscriptions](mailto:sales@wallarm.com).
