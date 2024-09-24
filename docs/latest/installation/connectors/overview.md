# Deploying Wallarm as a Connector

API deployment can be done in various ways, including utilizing external tools such as Azion Edge, Akamai Edge, Mulesoft, Apigee, and CloudFront. If you are looking for a way to secure these APIs with Wallarm, we offer a solution in the form of "connectors" specifically designed for such cases.

## How it works

Wallarm's connector solution integrates with third-party platforms, such as API gateways or edge platforms, to filter and analyze traffic. The solution operates with two main components:

* The **Wallarm node**, hosted either by Wallarm or the client, performs traffic analysis and security checks.
* A **Wallarm-provided code bundle or policy** which is injected into the third-party platform to route traffic for analysis to the Wallarm node.

With connectors, traffic can be analyzed either [in-line](../inline/overview.md) or [out-of-band](../oob/overview.md):

=== "In-line traffic flow"

    If Wallarm is configured to [block](../../admin-en/configure-wallarm-mode.md) malicious activity:

    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "Out-of-band traffic flow"
    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## Wallarm Edge connectors

Wallarm Edge Connectors are those where the Wallarm node is deployed, hosted, and managed by Wallarm in a secure cloud environment:

* **Autoscaling**: node instances automatically scale to handle varying traffic loads.
* **HTTPS security**: Wallarm automatically generates a Let's Encrypt certificate for secure communication.
* **Region selection**: choose deployment regions closer to your infrastructure for better performance and redundancy.
* **Allowed source hosts**: control which hosts are allowed to send traffic to the node.

!!! info "Supported platforms"
    Currently, Edge connectors are available only for Mulesoft, CloudFront, and Cloudflare.

## Supported platforms

Wallarm offers connectors for the following platforms:

| Connector | Supported traffic flow mode | Connector hosting |
| --- | ---- | ---- |
| [Mulesoft](mulesoft.md) | In-line | Wallarm Edge, client-hosted |
| [Apigee](apigee.md) | In-line |Client-hosted |
| [Akamai EdgeWorkers](akamai-edgeworkers.md) | In-line |Client-hosted |
| [Azion Edge](azion-edge.md) | In-line |Client-hosted |
| [Amazon CloudFront](aws-lambda.md) | In-line, out-of-band | Wallarm Edge, client-hosted |
| [Cloudflare](cloudflare.md) | In-line, out-of-band | Wallarm Edge, client-hosted |
| [Kong Ingress Controller](kong-api-gateway.md) | In-line | Client-hosted |
| [Istio Ingress](istio.md) | Out-of-band | Client-hosted |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | Out-of-band |Client-hosted |

If you couldn't find the connector you are looking for, please feel free to contact our [Sales team](mailto:sales@wallarm.com) to discuss your requirements and explore potential solutions.
