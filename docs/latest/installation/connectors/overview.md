# Deploying Wallarm as a Connector

API deployment can be done in various ways, including utilizing external tools such as Azion Edge, Akamai Edge, MuleSoft, Apigee, and CloudFront. If you are looking for a way to secure these APIs with Wallarm, we offer a solution in the form of "connectors" specifically designed for such cases.

## How it works

Wallarm's connector solution integrates with third-party platforms, such as API gateways or edge platforms, to filter and analyze traffic. The solution operates with two main components:

* The **Wallarm node**, hosted either by [Wallarm](../security-edge/se-connector.md) or the client, performs traffic analysis and security checks.
* A **Wallarm-provided code bundle or policy** which is injected into the third-party platform to route traffic for analysis to the Wallarm node.

With connectors, traffic can be analyzed either [in-line](../inline/overview.md) or [out-of-band](../oob/overview.md):

=== "In-line traffic flow"

    If Wallarm is configured to [block](../../admin-en/configure-wallarm-mode.md) malicious activity:

    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "Out-of-band traffic flow"
    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## Supported platforms

Wallarm offers connectors for the following platforms:

| Connector | Supported traffic flow mode | Connector hosting |
| --- | ---- | ---- |
| [MuleSoft Mule Gateway](mulesoft.md) | In-line | Security Edge, self-hosted |
| [MuleSoft Flex Gateway](mulesoft-flex.md) | In-line, out-of-band | Security Edge, self-hosted |
| [Apigee](apigee.md) | In-line, out-of-band | Security Edge, self-hosted |
| [Akamai](akamai-edgeworkers.md) | In-line, out-of-band |Security Edge, self-hosted |
| [Azion Edge](azion-edge.md) | In-line |Self-hosted |
| [Amazon CloudFront](aws-lambda.md) | In-line, out-of-band | Security Edge, self-hosted |
| [Amazon API Gateway](aws-api-gateway.md) | In-line, out-of-band | Security Edge, self-hosted |
| [Cloudflare](cloudflare.md) | In-line, out-of-band | Security Edge, self-hosted |
| [Standalone Kong API Gateway](standalone-kong-api-gateway.md) | In-line, out-of-band | Security Edge, self-hosted |
| [Kong Ingress Controller](kong-ingress-controller.md) | In-line | Self-hosted |
| [Istio Ingress](istio.md) | In-line, out-of-band | Self-hosted |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | In-line | Self-hosted |
| [Fastly](fastly.md) | In-line, out-of-band | Security Edge, self-hosted |
| [IBM DataPower](ibm-api-connect.md) | In-line | Security Edge, self-hosted |
| [Azure API Management](azure-api-management.md) | In-line, out-of-band | Security Edge, self-hosted |

If you couldn't find the connector you are looking for, please feel free to contact our [Sales team](mailto:sales@wallarm.com) to discuss your requirements and explore potential solutions.
