[se-connector-setup-img]:           ../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edge Connectors

The **Wallarm Security Edge** service offers a streamlined way to deploy Wallarm nodes for [**connectors**](connectors/overview.md) in a Wallarm‑hosted environment. Deployed and fully managed by Wallarm across geographically distributed locations, the service provides robust protection for your entire API landscape without the need for any onsite installation.

![!](../images/waf-installation/security-edge/connectors/traffic-flow.png)

## How it works

Wallarm Edge service provides a secure cloud environment where the Wallarm node is deployed, hosted, and managed by Wallarm:

* Turnkey deployment: deploy Wallarm nodes in globally distributed locations with minimal setup.
* Autoscaling: node instances automatically scale to handle varying traffic loads.
* Operational transparency: monitor logs, operational alerts, and node performance easily within the Wallarm console.
* Reduced costs: lower operational overhead with Wallarm-managed nodes, allowing faster deployment and scalability.

!!! info "Supported platforms"
    Currently, Edge connectors are available only for MuleSoft, CloudFront, and Cloudflare.

## Deploying the Edge node for a connector

You only need to specify the connector settings. Wallarm will handle the deployment and provide you with an endpoint to route traffic from your platform.

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Add connector**.

    ![!][se-connector-setup-img]
1. Specify the node deployment settings:

    * **Regions**: select one or more regions to deploy the Wallarm node for the connector. We recommend choosing regions close to where your APIs or applications are deployed. Multiple regions improve geo-redundancy by balancing the load if an instance becomes unavailable.
    * **Filtration mode**: [traffic analysis mode][filtration-mode-docs].
    * **Application**: general application ID. In Wallarm, [applications](../user-guides/settings/applications.md) help identify and organize parts of your infrastructure (e.g., domains, locations, instances).
    
        Each node requires a general application ID, with the option to assign specific IDs for locations or instances.
    
    * **Allowed hosts**: specify which hosts the node will accept and analyze traffic from.
    * **Location configuration**: assign unique application IDs to specific hosts and locations, if needed.

        ![!][se-connector-hosts-locations-img]
1. Once saved, it will take 3-5 minutes for Wallarm to deploy and configure the node for the connector.

    The status will change from **Pending** to **Active** when deployment is complete.
1. Copy the node endpoint as you will need it later to route traffic from your platform.

![!](../images/waf-installation/security-edge/connectors/copy-endpoint.png)

## Injecting Wallarm code on a platform running your APIs

After deploying the Edge node, you will need to inject Wallarm code into your platform to route traffic to the deployed node. Follow the instructions below for this process:

* [MuleSoft](connectors/mulesoft.md)
* [CloudFront](connectors/aws-lambda.md)
* [Cloudflare](connectors/cloudflare.md)
