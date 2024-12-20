[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Connector for Cloudflare

[Cloudflare](https://www.cloudflare.com/) is a security and performance service which offers features designed to enhance the security, speed, and reliability of websites and internet applications, including CDN, WAF, DNS services and SSL/TLS encryption. Wallarm can act as a connector to secure APIs running on Cloudflare.

To use Wallarm as a connector for Cloudflare, you need to **deploy the Wallarm node externally** and **run a Cloudflare worker using the Wallarm-provided code** to route traffic to the Wallarm node for analysis.

<a name="cloudflare-modes"></a> The Cloudflare connector supports both [in-line](../inline/overview.md) and [out-of-band](../oob/overview.md) traffic flows:

=== "In-line traffic flow"

    If Wallarm is configured to block malicious activity:

    ![Cloudflare with Wallarm - in-line scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Cloudflare with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended in case when you provide access to your applications via Cloudflare.

## Limitations

* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Cloudflare technologies.
* APIs or traffic running through Cloudflare.

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Obtain and deploy the Wallarm worker code

To run a Cloudflare worker routing traffic to the Wallarm node:

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download a code bundle for your platform.

    If running a self-hosted node, contact sales@wallarm.com to get the code bundle.
1. [Create a Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) using the downloaded code.
1. Set the address of your [Wallarm node instance](#1-deploy-a-wallarm-node) in the `wallarm_node` parameter.
1. If using [out-of-band](../oob/overview.md) mode, set the `wallarm_mode` parameter to `async`.

    Based on the selected mode, the worker controls whether traffic goes through the Wallarm node inline or if original traffic proceeds while a copy is inspected for malicious activities.

    ![Cloudflare worker](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. In **Website** → your domain, go to **Workers Routes** → **Add route**:

    * In **Route**, specify the paths to be routed to Wallarm for analysis (e.g., `*.example.com/*` for all paths).
    * In **Worker**, select the Wallarm worker you created.

    ![Cloudflare add route](../../images/waf-installation/gateways/cloudflare/add-route.png)

## Testing

To test the functionality of the deployed solution, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md) and the traffic flows in-line, the request will also be blocked.
