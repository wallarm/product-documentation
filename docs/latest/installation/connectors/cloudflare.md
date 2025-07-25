[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Wallarm Connector for Cloudflare

[Cloudflare](https://www.cloudflare.com/) is a security and performance service which offers features designed to enhance the security, speed, and reliability of websites and internet applications, including CDN, WAF, DNS services and SSL/TLS encryption. Wallarm can act as a connector to secure APIs running on Cloudflare.

To use Wallarm as a connector for Cloudflare, you need to **deploy the Wallarm Node externally** and **run a Cloudflare worker using the Wallarm-provided code** to route traffic to the Wallarm Node for analysis.

<a name="cloudflare-modes"></a> The Cloudflare connector supports both [in-line](../inline/overview.md) and [out-of-band](../oob/overview.md) traffic flows:

=== "In-line traffic flow"

    If Wallarm is configured to block malicious activity:

    ![Cloudflare with Wallarm - in-line scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-inline.png)
=== "Out-of-band traffic flow"
    ![Cloudflare with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/cloudflare/cloudflare-traffic-flow-oob.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended in case when you provide access to your applications via Cloudflare.

## Limitations

* When deploying the Wallarm service with the `LoadBalancer` type using the [Helm chart][helm-chart-native-node], a **trusted** SSL/TLS certificate is required for the Node instance domain. Self-signed certificates are not yet supported.
* [Rate limiting][rate-limiting] by the Wallarm rule is not supported.
* [Multitenancy][multi-tenancy] is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Cloudflare technologies.
* APIs or traffic running through Cloudflare.

## Deployment

### 1. Deploy a Wallarm Node

The Wallarm Node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
    * [AWS AMI](../native-node/aws-ami.md) for AWS infrastructures
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Obtain and deploy the Wallarm worker code

To run a Cloudflare worker routing traffic to the Wallarm Node:

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download a code bundle for your platform.

    If running a self-hosted node, contact sales@wallarm.com to get the code bundle.
1. [Create a Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) using the downloaded code.
1. Set the Wallarm node URL in the `wallarm_node` parameter.
1. If using [asynchronous (out-of-band)](../oob/overview.md) mode, set the `wallarm_mode` parameter to `async`.
1. If required, modify [other parameters](cloudflare.md#configuration-options).

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

    If the Wallarm Node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md) and the traffic flows in-line, the request will also be blocked.

## Configuration options

In the worker code, you can specify the following parameters:

| Parameter | Description | Required? |
| --------- | ----------- | --------- |
| `wallarm_node` | Sets the address of your [Wallarm Node instance](#1-deploy-a-wallarm-node). | Yes |
| `wallarm_mode` | Determines traffic handling mode: `inline` (default) processes traffic through the Wallarm Node directly, while `async` analyzes a [copy](../oob/overview.md) of the traffic without affecting the original flow. | No |
| `wallarm_send_rsp_body` | Enables response body analysis for schema [discovery](../../api-discovery/overview.md) and enhanced attack detection, such as [brute force](../../admin-en/configuration-guides/protecting-against-bruteforce.md). Default: `true` (enabled). | No |
| `wallarm_response_body_limit` | Limit for a response body size (in bytes) the Node can parse and analyze. Default is `0x4000`. | No |
| `wallarm_block_page.custom_path`<br>(Worker version 1.0.1+) | URL of a custom blocking page returned with HTTP 403 responses from the Node, for example: `https://example.com/block-page.html`.<br>Default: `null` (uses detailed Wallarm-provided error page if `html_page` is `true`). | No |
| `wallarm_block_page.html_page`<br>(Worker version 1.0.1+) | Enables a custom HTML blocking page for malicious requests. Default: `false` (returns a simple HTTP 403). | No |
| `wallarm_block_page.support_email`<br>(Worker version 1.0.1+) | Email displayed on the blocking page for reporting issues. Default: `support@mycorp.com`. | Yes, if `html_page` is `true` |

??? info "Show Wallarm-provided error page"
    The Wallarm-provided error page returned with HTTP 403 responses looks as follows:

    ![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Upgrading the Cloudflare worker

To upgrade the deployed Cloudflare worker to a [newer version](code-bundle-inventory.md#cloudflare):

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download the updated Wallarm Cloudflare code bundle.

    If running a self-hosted node, contact sales@wallarm.com to get the updated code bundle.
1. Replace the code in your deployed Cloudflare worker with the updated bundle.

    Preserve the existing values for parameters like `wallarm_node`, `wallarm_mode`, and others.
1. **Deploy** the updated functions.

Worker upgrades may require a Wallarm Node upgrade, especially for major version updates. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes and upgrade instructions or the [Edge connector upgrade procedure](../se-connector.md#upgrading-the-edge-node). Regular node updates are recommended to avoid deprecation and simplify future upgrades.
