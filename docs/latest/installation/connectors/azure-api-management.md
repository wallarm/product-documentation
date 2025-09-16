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

# Wallarm Connector for Azure API Management

This guide describes how to secure your APIs managed by [Azure API Management (APIM)](https://azure.microsoft.com/en-us/products/api-management) using the Wallarm connector.

To use Wallarm as a connector for Azure APIM, you need to **deploy the Wallarm Node externally** and **apply the Wallarm-provided policy fragments in Azure** to route traffic to the Wallarm Node for analysis.

The Wallarm connector for Azure APIM supports both [synchronous (in-line)](../inline/overview.md) and [asynchronous (out‑of‑band)](../oob/overview.md) traffic analysis.

<!-- === "Synchronous traffic flow"
    ![Azure APIM with Wallarm policy, synchronous traffic analysis](../../images/waf-installation/gateways/azure-apim/traffic-flow-azure-apim-inline.png)
=== "Asynchronous traffic flow"
    ![Azure APIM with Wallarm policy, asynchronous traffic analysis](../../images/waf-installation/gateways/mulesoft/traffic-flow-azure-apim-oob.png) -->

## Use cases

This solution is the recommended one for securing APIs managed by the Azure APIM service.

## Limitations

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"
* Attacks in query parameters are registered **3 times**. 

    This is because the Azure Application Gateway adds the `X-ORIGINAL-URL` and `X-WAWS-UNENCODED-URL` headers, which fully reflect the original URI including the attack pattern. Therefore, a single malicious query parameter will result in 3 detections:
    
    * In the query parameter itself
    * In the `X-ORIGINAL-URL` header
    * In the `X-WAWS-UNENCODED-URL` header

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the Azure API Management service.
* Your APIs are running in Azure APIM.
* A user with the appropriate [role in Azure APIM](https://learn.microsoft.com/en-us/azure/api-management/api-management-role-based-access-control):

    * **API Management Workspace Contributor** - for managing policy fragments within a workspace.
    * **API Management Service Contributor** - for global configuration across the entire APIM instance.
* Access to the **Administrator** account in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Native Node [version 0.18.0 or higher](../../updating-migrating/native-node/node-artifact-versions.md).

## Deployment

### 1. Deploy a Wallarm Node

The Wallarm Node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

For the Azure API Management connector, you can deploy the node only in your own infrastructure. 

Choose an artifact for a self-hosted node deployment and follow the attached instructions:

* [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
* [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

!!! info "Required Node version"
    Please note that the Azure APIM connector is supported only by the Native Node [version 0.18.0+](../../updating-migrating/native-node/node-artifact-versions.md).

### 2. Create named values in Azure

Define the following [named values in Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-properties?tabs=azure-portal) to reference them from policies:

| Named value | Description | Type | Required? |
| ----------- | ----------- | ---- | --------- |
| `WallarmNodeUrl` | Full domain name of your [Wallarm Node](#1-deploy-a-wallarm-node) including protocol (e.g., `https://wallarm-node-instance.com`). | Plain | Yes |
| `WallarmIgnoreErrors` | Defines error-handling behavior in synchronous traffic analysis when the Node is unavailable (e.g., timeouts):<ul><li>`true` (default) - requests are forwarded to APIs</li><li>`false` - block such requests with status `403`</li></ul> | Plain | No |

![Named values for Wallarm in Azure APIM](../../images/waf-installation/gateways/azure-apim/create-named-values.png)

### 3. Obtain and deploy Wallarm policy fragments

The Azure API Management connector package includes 4 XML files:

* Synchronous mode:

    * `wallarm-inline-request.xml`
    * `wallarm-inline-response.xml`
* Asynchronous mode:

    * `wallarm-out-of-band-request.xml`
    * `wallarm-out-of-band-response.xml`

Each mode requires 2 fragments: one for requests (inbound) and one for responses (outbound).

The steps below use the Azure Portal UI, but you can also deploy policy fragments with Terraform or ARM templates.

1. Contact sales@wallarm.com to get the policy fragments.
1. Extract the policy archive.
1. Navigate to Azure Portal → **API Management** service → **APIs** → **Policy fragments** → **Create**.
1. Create a request policy fragment using either `wallarm-inline-request.xml` or `wallarm-out-of-band-request.xml`, depending on your chosen traffic analysis mode.
   
    Name the fragment consistently with the file.

    ![Wallarm request policy fragment](../../images/waf-installation/gateways/azure-apim/request-policy-fragment.png)
1. Create a response policy fragment using either `wallarm-inline-response.xml` or `wallarm-out-of-band-response.xml`.
   
    Name the fragment consistently with the file.

    ![Wallarm response policy fragment](../../images/waf-installation/gateways/azure-apim/response-policy-fragment.png)

### 4. Apply Wallarm policy fragments to APIs

Apply the created fragments to individual APIs or globally to all APIs using the following code:

=== "Synchronous traffic analysis"
    ```xml
    <policies>
        <inbound>
            <include-fragment fragment-id="wallarm-sync-request" />
            <base />
        </inbound>

        <outbound>
            <include-fragment fragment-id="wallarm-sync-response" />
            <base />
        </outbound>
    </policies>
    ```

    In [synchronous (inline)](../inline/overview.md) mode, the policy intercepts requests and sends them to the Wallarm Node for inspection. Based on the Node's [filtration mode](../../admin-en/configure-wallarm-mode.md), malicious requests may be blocked with 403.
=== "Asynchronous traffic analysis"
    ```xml
    <policies>
        <inbound>
            <include-fragment fragment-id="wallarm-async-request" />
            <base />
        </inbound>

        <outbound>
            <include-fragment fragment-id="wallarm-async-response" />
            <base />
        </outbound>
    </policies>
    ```

    In [asynchronous (out-of-band)](../oob/overview.md) mode, traffic is mirrored to the Node without affecting the original flow. Malicious requests are logged in Wallarm Console but not blocked.

To apply the policies:

* Per API: go to **APIs** → select API → **All operations** → **Inbound processing** / **Outbound processing** → add the fragments.
* Per operation: go to **APIs** → select API → select operation → **Inbound processing** / **Outbound processing** → add the fragments.
* Globally: go to **APIs** → **All APIs** → **Inbound processing** / **Outbound processing** → add the fragments.

Example of per-API application:

![Wallarm policy fragment applied to individual API on Azure APIM](../../images/waf-installation/gateways/azure-apim/policies-for-indiv-api.png)

## Block page customization

If the Node is deployed in synchronous mode with [blocking enabled](../../admin-en/configure-wallarm-mode.md), you can customize the block page returned for blocked malicious requests.

To do this:

1. Navigate to Azure Portal → **API Management** → **APIs** → **Policy fragments**.
1. Open the `wallarm-sync-request` fragment and edit the `<set-body>` section:

![Customizing Wallarm block page for Azure APIM connector](../../images/waf-installation/gateways/azure-apim/customize-block-page.png)

## Testing

Test the deployed policy fragments with both legitimate and malicious traffic.

### Legitimate traffic

1. In Azure Portal, go to your API → **Test** → select an operation → enter valid parameters → **Trace**:

    ![Azure APIM Trace legitimate request](../../images/waf-installation/gateways/azure-apim/trace-legitimate-request.png)

2. Review the HTTP response trace - you should see the inbound policy `request-forwarder`:

    ![Azure APIM Trace legitimate request - view log on request forwarded to Wallarm Node](../../images/waf-installation/gateways/azure-apim/trace-legitimate-request-result.png)

3. In Wallarm Console → **API Sessions**, verify that the legitimate request is displayed:

    ![Wallarm Console: legitimate request in API Sessions](../../images/waf-installation/gateways/azure-apim/legitimate-request-in-sessions.png)

### Malicious traffic

1. Send a request with a test [SQLi](../../attacks-vulns-list.md#sql-injection) attack by adding the query parameter `x='+OR+1=1`:

    ![Azure APIM Trace SQLi attack](../../images/waf-installation/gateways/azure-apim/trace-sqli-attack.png)

    * In synchronous mode with [blocking enabled](../../admin-en/configure-wallarm-mode.md), the request will be blocked with `403`.
    * In asynchronous mode, the request will reach the API and will be logged in Wallarm Console.
1. In Wallarm Console → **API Sessions**, verify that the malicious request is logged: 

    ![Wallarm Console: malicious request in API Sessions](../../images/waf-installation/gateways/azure-apim/attack-in-sessions.png)
1. In Wallarm Console → **Attacks**, confirm that the attack is listed:

    ![SQLi attacks in the interface (Azure APIM connector for Wallarm)](../../images/waf-installation/gateways/azure-apim/attack-in-attack-section.png)

    The attack will appear 3 times due to [APIM headers](#limitations).

## Upgrading the policies

To upgrade the deployed Wallarm policies to a [newer version](code-bundle-inventory.md#azure-api-management):

1. Download the updated Wallarm policy package and create **new fragments** using the updated XML files, as described in [Step 3](#3-obtain-and-deploy-wallarm-policy-fragments).
1. Update your API policies to reference the new fragment names, as described in [Step 4](#4-apply-wallarm-policy-fragments-to-apis).
1. [Test](#testing) both legitimate and malicious traffic to confirm correct behavior.

Policy upgrades may require a Wallarm Node upgrade, especially for major version updates. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes. Regular node updates are recommended to avoid deprecation and simplify future upgrades.

## Uninstalling the policies

To remove the Wallarm connector from Azure API Management:

1. Navigate to Azure Portal → **API Management** service → **APIs** → your API.
1. Remove the inbound and outbound `<include-fragment>` lines referencing Wallarm fragments.
1. Remove the Wallarm policy fragments from **Policy fragments**.
1. Remove the `WallarmNodeUrl` and `WallarmIgnoreErrors` **named values** if they are no longer needed.
