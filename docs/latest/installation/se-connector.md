[se-connector-setup-img]:           ../images/waf-installation/se-connector-setup.png
[filtration-mode-docs]:             ../admin-en/configure-wallarm-mode.md

# Security Edge Connectors

If you choose to deploy Wallarm as a [connector](connectors/overview.md) for MuleSoft, CloudFront, or Cloudflare, one of the key components of this solution is the Wallarm node. Wallarm offers an option to use a Wallarm-hosted node, deployed and managed by Wallarm on the Wallarm Edge, eliminating the need for self-management.

Wallarm Edge Connectors provide a secure cloud environment where the Wallarm node is deployed, hosted, and managed by Wallarm:

* **Autoscaling**: node instances automatically scale to handle varying traffic loads.
* **HTTPS security**: Wallarm automatically generates a Let's Encrypt certificate for secure communication.
* **Region selection**: choose deployment regions closer to your infrastructure for better performance and redundancy.
* **Allowed source hosts**: control which hosts are allowed to send traffic to the node.

!!! info "Supported platforms"
    Currently, Edge connectors are available only for MuleSoft, CloudFront, and Cloudflare.

## Deploying the Edge node for a connector

You only need to specify the connector settings. Wallarm will handle the deployment and provide you with an endpoint to route traffic from your platform.

--8<-- "../include/waf/installation/security-edge/add-connector.md"

## Injecting Wallarm code on a platform running your APIs

After deploying the Edge node, you will need to inject Wallarm code into your platform to route traffic to the deployed node. Follow the instructions below for this process:

* [MuleSoft](connectors/mulesoft.md)
* [CloudFront](connectors/aws-lambda.md)
* [Cloudflare](connectors/cloudflare.md)
