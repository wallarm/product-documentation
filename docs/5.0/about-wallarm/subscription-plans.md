# Wallarm Subscription Plans

Wallarm is the only solution that unifies API discovery, risk management, real-time protection, and testing capabilities to protect your entire API portfolio in multi-cloud, cloud-native and on-premise environments. You can easily choose the set of functionality that best suits your needs.

## Core subscription plans

**Cloud Native WAAP** - WAAP (Web Application & API Protection) subscription provides web applications and APIs with protection against common threats such as SQLi, XSS, brute force, etc. It supports all API protocols but does not cover some specific API threats.

**WAAP + Advanced API Security**. This bundle enhances general WAAP capabilities with comprehensive API Security tools to cover all OWASP API Top-10 threats.

**Security Testing**. This bundle helps you proactively uncover security vulnerabilities in your applications and APIs before attackers do.

| Feature | WAAP | WAAP + API Security | Security Testing |
| ------- | ----------------- | --------------------- | --------------------- |
| **Real-time protection** | | | |
| [DDoS protection (L7)](../admin-en/configuration-guides/protecting-against-ddos.md) | Yes | Yes | No |
| [Geo/source filtering](../user-guides/ip-lists/overview.md) | Yes | Yes | No |
| [IP reputation feeds](../user-guides/ip-lists/overview.md#malicious-ip-feeds) | Yes | Yes | No |
| [Attack stamps (SQLi, XSS, SSRF, etc.)](../attacks-vulns-list.md#attack-types) | Yes | Yes | No |
| [Customer defined signatures](../user-guides/rules/regex-rule.md) | Yes | Yes | No |
| [Virtual patching](../user-guides/rules/vpatch-rule.md) | Yes | Yes | No |
| [Brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) | Yes | Yes | No |
| [Forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) | Yes | Yes | No |
| [Distributed rate limiting](../user-guides/rules/rate-limiting.md) | Yes | Yes | No |
| [BOLA protection](../admin-en/configuration-guides/protecting-against-bola.md) | Manual triggers | Automated protection | No |
| [API Abuse Prevention (bot management)](../api-abuse-prevention/overview.md) | No | Yes | No |
| [Credential Stuffing Detection](../about-wallarm/credential-stuffing.md) | No | Yes | No |
| [API Specification Enforcement](../api-specification-enforcement/overview.md) | No | Yes | No |
| [GraphQL security policies](../api-protection/graphql-rule.md) | No | Yes | No |
| **API protocol support** | | | |
| Legacy (SOAP, XML-RPC, WebDAV, WebForm) | Yes | Yes | No |
| Mainstream (REST, GraphQL) | Yes | Yes | No |
| Modern and streaming (gRPC, WebSocket) | Yes | Yes | No |
| **Security posture** | | | |
| [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) | No | Yes | No |
| [Vulnerability assessment](../user-guides/vulnerabilities.md) | Yes | Yes | No |
| [API Sessions](../api-sessions/overview.md) | No | Yes | No |
| [API Discovery](../api-discovery/overview.md) | No | Yes | No |
| [Sensitive data detection](../api-discovery/overview.md#sensitive-data-detection) | No | Yes | No |
| [Rogue API Detection (shadow, orphan zombie)](../api-discovery/rogue-api.md) | No | Yes | No |
| [BI Dashboards](../user-guides/dashboards/bi-dashboards.md) | No | Yes | No |
| **Security testing** | | | |
| [Threat Replay Testing](../vulnerability-detection/threat-replay-testing/overview.md) | No | Yes | Yes, with API Security |
| [Schema-Based Security Testing](../vulnerability-detection/schema-based-testing/overview.md) | No | No | Yes |
| **Additional options** | | | |
| [Self-hosted Node deployment](../installation/supported-deployment-options.md) | All | All | No |
| [Security Edge](../installation/security-edge/overview.md) | No | No | No |
| [Integrations](../user-guides/settings/integrations/integrations-intro.md) | All | All | All |
| [Number of users](../user-guides/settings/users.md) | Unlimited | Unlimited | Unlimited |
| [SSO authentication](../admin-en/configuration-guides/sso/intro.md) | Yes | Yes | Yes |
| [Role-based access control (RBAC)](../user-guides/settings/users.md#user-roles) | Yes | Yes | Yes |
| [Multi-tenant](../installation/multi-tenant/overview.md) | Yes (by request) | Yes (by request) | Yes (by request) |
| Period of event storage | 6 month | 6 month | 6 month |
| Support | Standard/<br>Advanced/<br>Platinum | Standard/<br>Advanced/<br>Platinum | Standard/<br>Advanced/<br>Platinum |

To activate the subscription plan, contact [sales@wallarm.com](mailto:sales@wallarm.com).

When your subscription expires, you receive notifications in the Wallarm Console UI and by email. A 90-day grace period is provided to renew the subscription; after it ends, access to the Wallarm Console is disabled, and Nodes no longer receive updates or upload data to the Wallarm Cloud.

## API Attack Surface

Variants: **Core (Free)**, **Enterprise (Paid)** - see comparison [here](https://www.wallarm.com/product/aasm-pricing).

!!! info "Relations to other plans"

    This subscription plan:

    * Is included into [Advanced API Security](#core-subscription-plans) plan
    * Can be added to [Cloud Native WAAP](#core-subscription-plans) plan
    * Can be used alone (no other plans or filtering node required)

The **API Attack Surface** subscription plan provides a comprehensive view of publicly exposed APIs and related information with **zero deployment** and minimal configuration.

The subscription plan provides the [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) product which includes:

* [API Attack Surface Discovery](../api-attack-surface/api-surface.md)
* [Security Issues Detection](../api-attack-surface/security-issues.md)

To activate the subscription plan, do one of the following:

* If you do not have Wallarm account yet, get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).

    When activating, scanning of the used email's domain starts immediately while you negotiate sales team. After activation, you can add additional domains to the scope.

* If you already have Wallarm account, contact [sales@wallarm.com](mailto:sales@wallarm.com).

## Security Edge (Paid Plan)

!!! info "Relations to other plans"

    This subscription plan:

    * Can be added to [Cloud Native WAAP](#core-subscription-plans) or [Advanced API Security](#core-subscription-plans) plan
    * Cannot be used alone

The Security Edge subscription plan allows you to deploy the Wallarm node on the managed environment, eliminating the need for onsite installation and management.

With Wallarm handling node hosting and maintenance, you can focus on your core infrastructure while benefiting from robust traffic filtering, attack detection, and secure communication - all backed by Wallarm.

Available Security Edge deployments include:

* [Security Edge Inline](../installation/security-edge/inline/deployment.md)
* [Security Edge Connectors](../installation/security-edge/se-connector.md)

To inquire about this subscription, please contact [sales@wallarm.com](mailto:sales@wallarm.com).

## Security Edge Free Tier

For smaller companies and educational purposes, Wallarm offers the option to create a [Security Edge](#security-edge-paid-plan) Free Tier account yourself. You can choose the Wallarm cloud that best suits your storage preferences:

* [Create Free Tier account on the US Wallarm Cloud](https://us1.my.wallarm.com/signup)
* [Create Free Tier account on the EU Wallarm Cloud](https://my.wallarm.com/signup)

The Security Edge Free Tier account allows:

* Security Edge functionality, with some feature limitations.
* Process up to **500 thousand requests per month** with no limitation in time.
* Access to the Wallarm platform as [Advanced API Security](#core-subscription-plans), except for the following:

    * [Vulnerability assessment](../user-guides/vulnerabilities.md)
    * [API Abuse Prevention](../api-abuse-prevention/overview.md)
    * Limited to 3 users per company account
    * Telemetry portal of Security Edge
    * Multi-cloud Security Edge deployment

If a Free Tier account exceeds 100% of the monthly quota, your access to the Wallarm Console is disabled, along with all integrations. When reaching 200%, protection on your Wallarm nodes is disabled. These restrictions will be in effect until the first day of the next month.

To remove all restrictions, contact [sales@wallarm.com](mailto:sales@wallarm.com).
