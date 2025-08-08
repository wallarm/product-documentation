# Security Edge Inline Overview <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

The [**Security Edge**](../overview.md) platform provides a managed service for deploying Wallarm Nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is **inline** deployment, offering real-time, robust protection for your entire API landscape without the need for any onsite installation.

![!](../../../images/waf-installation/security-edge/inline/traffic-flow.png)

## Use cases

This is an ideal solution for securing APIs when:

* You are looking for a fully managed security solution with minimal operational complexity.
* You can route traffic via DNS to Wallarm.

## How it works

With Security Edge Inline, your API traffic is routed through Wallarm's globally distributed Points of Presence (PoPs), where Wallarm Nodes are deployed, hosted, and managed by Wallarm.

* DNS-based traffic redirection: you configure your DNS to point your API domains to Wallarm Edge Node.
* PoP selection and routing: requests are directed to the nearest available PoP based on latency or your selected region(s).
* Real-time inspection and filtering: the inline Node analyzes incoming requests and blocks malicious ones before forwarding legitimate traffic to your origin servers.
* Multi-origin and multi-region: you can define multiple origin servers and deploy inline Nodes across different cloud regions for high availability and geo-redundancy.
* Automatic scaling and updates: Wallarm handles Node scaling, updates, and maintenance - no action required on your side.

## Limitations

* Only domains shorter than 64 characters are supported.
* Only HTTPS traffic is supported; HTTP is not allowed.
* [Custom blocking page and blocking code](../../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.

## Deployment

To deploy Security Edge Inline, follow the [step-by-step instructions](deployment.md).
