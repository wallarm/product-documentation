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

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../inline/overview/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-inline.svg" />
            <h3>Security Edge Inline</h3>
            <p>Real-time traffic is redirected through the Edge Node, filtered, and forwarded to your origin</p>
        </a>

        <a class="do-card" href="../se-connector/">
            <img class="non-zoomable" src="../../../images/platform-icons/se-connectors.svg" />
            <h3>Security Edge Connector</h3>
            <p>Connect the Edge Node to your API platform for asynchronous analysis or real-time blocking</p>
        </a>
    </div>
</div>

!!! info "Deployment alternatives"
    Looking for more control or traditional hosting options? Visit [Self-Hosted Node Deployment](../supported-deployment-options.md) and [Self-Hosted Node Deployment for Connectors](../connectors/overview.md).

## Free Tier

Security Edge is available on the Free Tier plan with up to **500,000 requests per month - free of charge**.

You can deploy Edge Nodes on the Free Tier plan via the [**Quick setup** wizard](free-tier.md).  

<link rel="stylesheet" href="/stylesheets/supported-platforms.min.css?v=1" />
