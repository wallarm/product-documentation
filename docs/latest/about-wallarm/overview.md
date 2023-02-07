# How the Wallarm platform works

The Wallarm platform has hybrid architecture that is uniquely suited to protect all your APIs and web applications in multi‑cloud and cloud‑native environments. This document overviews the products Wallarm provides and explains its architecture.

## Wallarm products

The Wallarm platform provides the following products:

* **Cloud Native WAAP (Web Application & API Protection)** that is a Next-Gen WAF providing web applications and APIs with protection against common threats.
* **Advanced API Security** provides comprehensive API discovery and threat prevention across your entire portfolio, regardless of protocol.

| Feature | Cloud Native WAAP | Advanced API Security |
| ------- | ----------------- | --------------------- |
| Mitigation of [OWASP Top 10](https://owasp.org/www-project-top-ten/) | Yes | Yes |
| Mitigation of [OWASP API Top 10](https://owasp.org/www-project-api-security/) | Partially | Yes |
| [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) | No <sup>⁕</sup> | Yes |
| [API Discovery](../about-wallarm/api-discovery.md) | No <sup>⁕</sup> | Yes |
| [Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) | No <sup>⁕</sup> | Yes |

`⁕` - can be added as a separate subscription to a corresponding module.

When [subscribing](subscription-plans.md#subscription-plans) to Wallarm, you choose the product that meets your business needs the most.

## Components of the Wallarm platform

Wallarm consists of the following core components:

* The Wallarm filtering node
* The Wallarm Cloud

### Filtering node

The Wallarm filtering node does the following:

* Analyzes the company's entire network traffic and mitigates malicious requests
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis

The Wallarm filtering node is installed in your network infrastructure by one of the [supported deployment options](../admin-en/supported-platforms.md). Regardless of the [Wallarm product](#wallarm-products) you are using, any deployment option is available.

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads
* Compiles custom resource-specific security rules
* Scans the company's exposed assets to detect vulnerabilities
* Builds API structure based on the traffic metrics received from the filtering node

Wallarm manages [American](#us-cloud) and [European](#eu-cloud) cloud instances with each Cloud being completely separate in terms of databases, API endpoints, client accounts, etc. A client registered in one Wallarm Cloud cannot use other Wallarm Cloud to manage or get access to their data stored in the first Cloud.

At the same time, you may use both Wallarm Clouds. In this case you will need to use different accounts in Wallarm Console and API endpoints to access and manage your information in individual Clouds.

Endpoints for the Wallarm Clouds are provided below.

#### US Cloud

Physically located in the USA.

* https://us1.my.wallarm.com/ to create Wallarm account
* `https://us1.api.wallarm.com/` to call API methods

#### EU Cloud

Physically located in the Netherlands.

* https://my.wallarm.com/ to create Wallarm account
* `https://api.wallarm.com/` to call API methods
