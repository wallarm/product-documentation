# Deploying Wallarm with Connectors

API deployment can be done in various ways, including utilizing external tools such as Azion Edge, Akamai Edge, Mulesoft, Apigee, and CloudFront. If you are looking for a way to secure these APIs with Wallarm, we offer a solution in the form of "connectors" specifically designed for such cases.

## How it works

The Wallarm filtering node is deployed externally and acts as a connector between your API gateway or edge platform and Wallarm.

To route traffic to the deployed connector for analysis and protection, you need to inject a Wallarm‑provided code bundle into the API gateway or edge platform.

Wallarm connectors for some platforms are fully deployed, hosted, and managed by Wallarm in a secure cloud environment, while others require you to deploy and host the Wallarm node yourself.

Traffic can be analyzed either [in-line](../inline/overview.md) or [out-of-band](../oob/overview.md):

=== "In-line traffic flow"

    If Wallarm is configured to [block](../../admin-en/configure-wallarm-mode.md) malicious activity:

    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "Out-of-band traffic flow"
    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## Wallarm Edge connectors

For platforms like Mulesoft, CloudFront, and Cloudflare, Wallarm provides fully managed connectors. These connectors are deployed, hosted, and managed by Wallarm in a secure cloud environment.

Wallarm-hosted connectors have the following characteristics:

* **Autoscaling**: Connector instances automatically scale to handle varying traffic loads.
* **HTTPS security**: Wallarm automatically generates a Let's Encrypt certificate for secure communication.
* **Region selection**: Choose deployment regions closer to your infrastructure for better performance and redundancy.
* **Allowed source hosts**: Control which hosts are allowed to send traffic to the connector.

## Supported platforms

Currently, Wallarm offers connectors for the following platforms:

| Connector | Supported traffic flow mode | Connector hosting |
| --- | ---- | ---- |
| [Mulesoft](mulesoft.md) | In-line | Wallarm Edge, customer-hosted |
| [Apigee](apigee.md) | In-line |Customer-hosted |
| [Akamai EdgeWorkers](akamai-edgeworkers.md) | In-line |Customer-hosted |
| [Azion Edge](azion-edge.md) | In-line |Customer-hosted |
| [Amazon CloudFront](aws-lambda.md) | In-line, out-of-band | Wallarm Edge, customer-hosted |
| [Cloudflare](cloudflare.md) | In-line, out-of-band | Wallarm Edge, customer-hosted |
| [Kong Ingress Controller](kong-api-gateway.md) | In-line | Customer-hosted |
| [Istio Ingress](istio.md) | Out-of-band | Customer-hosted |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | Out-of-band |Customer-hosted |

If you couldn't find the connector you are looking for, please feel free to contact our [Sales team](mailto:sales@wallarm.com) to discuss your requirements and explore potential solutions.
