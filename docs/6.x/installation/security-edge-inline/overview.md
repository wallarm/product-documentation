---
search:
  exclude: true
---

# Security Edge Inline Overview <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

The **Security Edge** platform provides a managed service for deploying Wallarm nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is **inline** deployment, offering real-time, robust protection for your entire API landscape without the need for any onsite installation.

This is an ideal solution for securing APIs when you can redirect traffic from your hosts to Wallarm's edge nodes by modifying the CNAME records in your DNS settings.

![!](../../images/waf-installation/security-edge/inline/traffic-flow.png)

## How it works

Security Edge service provides a secure cloud environment where Wallarm nodes are deployed, hosted, and managed by Wallarm:

* Turnkey deployment: minimal setup is required for Wallarm to automatically deploy nodes across globally distributed locations.
* Autoscaling: nodes automatically scale horizontally to handle varying traffic loads, with no manual configuration needed.
* Reduced costs: lower operational overhead with Wallarm-managed nodes, allowing faster deployment and scalability.
* Seamless integration: simple configuration, allowing you to protect your API landscape without disruptions.

## Limitations

* Only third-level or higher domains are supported (e.g., instead `domain.com` use `www.domain.com`).
* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.

## Deployment

To deploy Security Edge Inline, proceed to the [instructions](deployment.md).
