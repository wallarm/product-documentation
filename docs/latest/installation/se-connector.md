[se-connector-setup-img]:           ../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edge Connectors <a href="../../../about-wallarm/subscription-plans/#security-edge"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

The **Security Edge** platform provides a managed service for deploying nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is the [**connector**](connectors/overview.md) node deployment, offering robust protection for your entire API landscape without the need for any onsite installation.

![!](../images/waf-installation/security-edge/connectors/traffic-flow.png)

## How it works

Security Edge service provides a secure cloud environment where the Wallarm node is deployed, hosted, and managed by Wallarm:

* Turnkey deployment: deploy Wallarm nodes in globally distributed locations with minimal setup.
* Autoscaling: node instances automatically scale to handle varying traffic loads.
* Reduced costs: lower operational overhead with Wallarm-managed nodes, allowing faster deployment and scalability.

!!! info "Supported platforms"
    Currently, Edge connectors are available only for MuleSoft, CloudFront, and Cloudflare.

## Deploying the Edge node for a connector

You only need to specify the connector settings. Wallarm will handle the deployment and provide you with an endpoint to route traffic from your platform.

One endpoint can handle multiple connections from different hosts.

1. The Security Edge deployment is available only with the corresponding subscription. Contact sales@wallarm.com to obtain it.
1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Add connector**.

    ![!][se-connector-setup-img]
1. Specify the node deployment settings:

    * **Regions**: select one or more regions to deploy the Wallarm node for the connector. We recommend choosing regions close to where your APIs or applications are deployed. Multiple regions improve geo-redundancy by balancing the load if an instance becomes unavailable.
    * **Filtration mode**: [traffic analysis mode][filtration-mode-docs].
    * **Application**: general application ID. In Wallarm, [applications](../user-guides/settings/applications.md) help identify and organize parts of your infrastructure (e.g., domains, locations, instances).
    
        Each node requires a general application ID, with the option to assign specific IDs for locations or instances.
    
    * **Allowed hosts**: specify which hosts the node will accept and analyze traffic from.

        If a specified host does not exist or is unreachable, the 415 error will be returned, and the traffic will not be processed.
    
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

<!-- add the schreenshot with the green status and RPS and with no "staging" mentioned
rename the "connector configuration" button the connectors
mention that users can edit settings on the deployment SE and that can delete and what happens if they delete the SE deployment
if the SE node, code connector is downloaded from the UI. if self-hosted, it should be requested from the sales team
mention that we upgrade the edge node oursleves. latest stable with all features
 -->
