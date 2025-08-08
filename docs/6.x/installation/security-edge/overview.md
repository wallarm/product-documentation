# Security Edge <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge is Wallarm's managed deployment option allowing you to protect your APIs and applications without hosting the [Wallarm Node](../../about-wallarm/overview.md#filtering-node) yourself. You redirect traffic to **Wallarm's globally distributed Edge infrastructure**, where the traffic is filtered and securely forwarded to your backend.

The Node is hosted and operated by Wallarm, reducing infrastructure overhead for your team.

## Key benefits

Security Edge service provides a secure cloud environment where Wallarm Nodes are deployed, hosted, and managed by Wallarm:

* Fully managed solution with minimal operational complexity.
* Turnkey deployment: minimal setup is required for Wallarm to automatically deploy Nodes across globally distributed locations.
* Autoscaling: Nodes automatically scale horizontally to handle varying traffic loads, with no manual configuration needed.
* Reduced costs: lower operational overhead with Wallarm-managed Nodes, allowing faster deployment and scalability.
* Seamless integration: simple configuration, allowing you to protect your API landscape without disruptions.
* Global network of PoPs and latency-based DNS steering: traffic is routed through Wallarm's distributed Points of Presence, located close to your users.

## Available deployment options

Security Edge supports two deployment options:

* [Inline](inline/overview.md): real-time traffic is redirected through the Edge Node, filtered, and forwarded to your origin.
* [Connector](se-connector.md): deploy the Edge Node and connect it to your API management platform (e.g., MuleSoft or Cloudflare) for either asynchronous mirrored traffic analysis or synchronous traffic redirection for real-time threat blocking.

!!! info "Deployment alternatives"
    Looking for more control or traditional hosting options? Visit [Self-Hosted Node Deployment](../supported-deployment-options.md) and [Self-Hosted Node Deployment for Connectors](../connectors/overview.md).
