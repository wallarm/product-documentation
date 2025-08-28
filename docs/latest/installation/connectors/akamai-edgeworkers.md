[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Wallarm Connector for Akamai

For customers delivering their APIs through [Akamai CDN](https://www.akamai.com/solutions/content-delivery-network) properties, Wallarm provides a dedicated EdgeWorker code bundle. By deploying this EdgeWorker, requests are routed to a Wallarm node for inspection and protection before reaching the origin. This approach allows customers to secure their API traffic directly at the edge without changes to the origin infrastructure.

To use Wallarm as a connector for Akamai, you need to **deploy the Wallarm node externally** and **apply the Wallarm-provided code bundle in Akamai** to route traffic to the Wallarm node for analysis.

The Wallarm connector for Akamai supports both [synchronous (in-line)](../inline/overview.md) and [asynchronous (out‑of‑band)](../oob/overview.md) traffic analysis:

=== "Synchronous traffic flow"
    ![!Akamai synchronous traffic flow with Wallarm EdgeWorker](../../images/waf-installation/gateways/akamai/traffic-flow-sync.png)
=== "Asynchronous traffic flow"
    ![!Akamai asynchronous traffic flow with Wallarm EdgeWorker](../../images/waf-installation/gateways/akamai/traffic-flow-async.png)

## Use cases

This solution is recommended for securing APIs delivered through Akamai CDN.

## Limitations

The Wallarm connector for Akamai has certain limitations:

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

In addition, the following [EdgeWorkers platform restrictions](https://techdocs.akamai.com/edgeworkers/docs/limitations) affect the connector design:

* **httpRequest domain restriction** – sub-requests made from an EdgeWorker must target a domain already served by Akamai (i.e., a configured property)
* **HTTPS-only sub-requests** – if another protocol is specified, EdgeWorkers automatically convert it to HTTPS
* **Event model limitation** – request and response bodies are accessible only within the `responseProvider` event

Because of these restrictions, the Wallarm EdgeWorker is implemented as a `responseProvider` function that issues a sub-request back to the same property. This sub-request includes the custom header `x-wlrm-checked`, which prevents infinite loops and allows routing traffic to the Wallarm node.

## Requirements

To deploy the Wallarm EdgeWorker on Akamai, make sure the following requirements are met:

* Understanding of Akamai technologies
* Akamai EdgeWorkers [enabled](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) in your contract
* Origin backend available

    * Your API services running on a reachable origin server
    * Origin domain resolves to the Akamai property hostname via a CNAME record
* Akamai property configured to forward traffic to the origin

    * The property must include the **Default Rule** with the **Origin Server** behavior
    * The property must have a valid TLS certificate for the served host

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

For the Akamai connector, you can deploy the node only in your own infrastructure. 

Choose an artifact for a self-hosted node deployment and follow the attached instructions:

* [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
* [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

!!! info "Required Node version"
    Please note that the Akamai connector is supported only by the Native Node [version 0.16.3+](../../updating-migrating/native-node/node-artifact-versions.md).

### 2. Obtain the Wallarm code bundle and create EdgeWorkers

To acquire and run the Wallarm code bundle on Akamai EdgeWorkers, follow these steps:

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm code bundle.
1. Go to Akamai Control Center → **EdgeWorkers** → **Create EdgeWorker ID**, then import the code bundle `wallarm-main`.

    This is the main EdgeWorker that routes requests through the Wallarm node.
1. Create another EdgeWorker ID and import the `wallarm-sp` bundle.

    This is the EdgeWorker recommended for spoofing prevention. It does not require a property.
1. In Akamai Property Manager, create a new property with the `Dynamic Site Accelerator` type for the `wallarm-main` EdgeWorker.

### 3. Configure variables in the origin property

Open your existing origin property → **Edit New Version** and configure the following variables:

| Variable | Description | Required? |
| -------- | ----------- | --------- |
| `PMUSER_WALLARM_NODE` | Address of your [Wallarm Node instance](#1-deploy-a-wallarm-node). | Yes |
| `PMUSER_WALLARM_HEADER_SECRET` | Arbitary secret value for spoofing prevention, e.g. `aj8shd82hjd72hs9`. When the `wallarm-main` EdgeWorker forwards a request back into the same property, it adds the header `x-wlrm-checked` with this value. The `wallarm-sp` EdgeWorker validates the header: if it does not match, the request is blocked. It prevents infinite loops and ensures clients cannot add a fake header to bypass Wallarm checks.<br>Keep private and do not reuse elsewhere. | Yes |
| `PMUSER_WALLARM_ASYNC` | Determines traffic handling mode: `false` processes traffic through the Wallarm Node directly (synchronous), while `true` analyzes a [copy](../oob/overview.md) of the traffic without affecting the original flow (asynchronous). Default: `false`. | No |
| `PMUSER_WALLARM_INSPECT_REQ_BODY` | Controls whether to send request bodies to the Wallarm node for analysis or not. Default: `true`. | No |
| `PMUSER_WALLARM_INSPECT_RSP_BODY` | Controls whether to send response bodies to the Wallarm node for analysis or not. It enables response schema discovery and enhanced attack and vulnerability detection capabilities. Default: `true`. | No |

![!Wallarm variables for the Akamai origin property](../../images/waf-installation/gateways/akamai/origin-property-variables.png)

You can fine-tune the connector mode and body inspection settings per-route or per-file type by using the **Set Variable** behavior.

### 4. Add Wallarm EdgeWorker rule

In the origin property, create a new blank rule:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    does not exist
    ```
* Behavior: EdgeWorkers → the `wallarm-main` EdgeWorker

For more complex setups, you can combine this condition with path checks (e.g., apply the rule only to `/api/*` paths) so that only API traffic is processed by Wallarm.

### 5. Add spoofing-prevention rule

In the origin property, create another new blank rule:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    exists
    ```
* Behavior: EdgeWorkers → the `wallarm-sp` EdgeWorker

This rule ensures that the header `x-wlrm-checked` matches the value of `PMUSER_WALLARM_HEADER_SECRET`. Any other value is blocked, preventing clients from bypassing Wallarm checks.

For more complex setups, you can combine this condition with path checks (e.g., apply the rule only to `/api/*` paths) so that only API traffic is processed by Wallarm.

### 6. Save and activate the property

1. Save the new property version.
1. [Activate it in the staging environment](https://techdocs.akamai.com/property-mgr/docs/activate-stage).
1. After verification, [activate in production](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

## Testing

To test the functionality of the deployed EdgeWorkers, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your Akamai CDN:

    ```
    curl http://<AKAMAI_CDN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to blocking, the request will also be blocked.
