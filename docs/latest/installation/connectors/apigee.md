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

# Wallarm Connector for Apigee API Management

This guide describes how to secure your APIs managed by [Apigee API Management (APIM)](https://cloud.google.com/apigee) using the Wallarm connector.

## Overview

To use Wallarm as a connector for Apigee APIM, you need to **deploy the Wallarm Node externally** and **apply the Wallarm-provided shared flows in Apigee** to route traffic to the Wallarm Node for analysis.

The Wallarm connector for Apigee APIM supports the **synchronous** and **asynchronous** traffic analysis:

=== "Synchronous traffic flow"
    In [synchronous (inline)](../inline/overview.md) mode, the policy intercepts requests and sends them to the Wallarm Node for inspection. Based on the Node's [filtration mode](../../admin-en/configure-wallarm-mode.md), malicious requests may be blocked with `403`, providing real-time threat mitigation.

    ![Apigee APIM with Wallarm policy, synchronous traffic analysis](../../images/waf-installation/gateways/apigee/traffic-flow-apigee-inline.png)
=== "Asynchronous traffic flow"
    In [asynchronous (out-of-band)](../oob/overview.md) mode, traffic is mirrored to the Node without affecting the original flow. Malicious requests are logged in Wallarm Console but not blocked.

    ![Apigee APIM with Wallarm policy, asynchronous traffic analysis](../../images/waf-installation/gateways/apigee/traffic-flow-apigee-oob.png)

## Use cases

This solution is recommended for securing APIs managed by the Apigee APIM service.

## Limitations

* [Custom blocking code][custom-blocking-page] configuration is not supported.

    All [blocked](../../admin-en/configure-wallarm-mode.md) malicious traffic is returned with status code `403` by default. You can customize the block page content, but not the response code itself.
* [Rate limiting][rate-limiting] by Wallarm rules is not supported.
    
    Rate limiting cannot be enforced on the Wallarm side for this connector. If rate limiting is required, use [Apigee policies](https://cloud.google.com/apigee/docs/api-platform/develop/rate-limiting).
* [Multitenancy][multi-tenancy] is not supported.

    All protected APIs are managed under a single Wallarm account; separating protection across multiple accounts for different infrastructures or environments is not yet supported.

## Requirements

Before deployment, ensure the following prerequisites are met:

* Familiarity with Apigee API Management.
* APIs published via Apigee. Supported distributions:

    * Apigee OPDK
    * Apigee Edge
    * Apigee X and Hybrid
* Apigee [environment is of type **Intermediate** or higher](https://cloud.google.com/apigee/docs/api-platform/reference/pay-as-you-go-environment-types).
* A user with the **Environment Admin** or **Org Admin** [role in Apigee](https://cloud.google.com/apigee/docs/api-platform/system-administration/apigee-roles).
* [Google Cloud SDK (gcloud CLI) installed and configured](https://cloud.google.com/sdk/docs/quickstart) (if managing Apigee from CLI).
* Access to the **Administrator** account in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Native Node [version 0.18.0 or higher](../../updating-migrating/native-node/node-artifact-versions.md).
* A valid **trusted** SSL/TLS certificate for the Wallarm Node domain (self-signed certificates are not supported).

## Deployment

This guide shows deployment primarly via the Google Cloud Console and Apigee REST API. For automation, use the [Apigee Terraform provider](https://registry.terraform.io/providers/scastria/apigee/latest/docs), or refer to the [full Apigee API reference](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest).

### 1. Deploy a Wallarm Node

The Wallarm Node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../security-edge/se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

!!! info "Required Node version"
    Please note that the Apigee APIM connector is supported only by the Native Node [version 0.18.0+](../../updating-migrating/native-node/node-artifact-versions.md).

### 2. Obtain the connector code bundle

Contact sales@wallarm.com to get the Apigee connector code bundle.

The bundle contains:

* `sharedflows/` - Wallarm shared flow bundles to deploy in Apigee:
  
    * `Wallarm-Inline-Request-Flow.zip` and `Wallarm-Inline-Response-Flow.zip` for [synchronous](../inline/overview.md) analysis
    * `Wallarm-OOB-Request-Flow.zip` and `Wallarm-OOB-Response-Flow.zip` for [asynchronous](../oob/overview.md) analysis

* `proxies/` - sample, ready-to-use API proxies you can modify and reuse:

    * `wallarm-single-proxy-sync` - sample proxy with the Wallarm connector policies preconfigured for synchronous analysis
    * `wallarm-single-proxy-async` - sample proxy with the Wallarm connector policies preconfigured for asynchronous analysis

    While this guide walks you through deployment from scratch, these samples can serve as a shortcut or reference.

    To run the sample proxies, you must also create the [`WallarmConfig` KVM](#3-create-a-key-value-map-in-apigee) in the target environment and [deploy the corresponding shared flows](#4-deploy-wallarm-shared-flows).

### 3. Create a key value map in Apigee

Define the `WallarmConfig` [key value map (KVM)](https://cloud.google.com/apigee/docs/api-platform/cache/key-value-maps) to store Wallarm connector configuration. Using a KVM allows you to change parameters without modifying policy code.

1. Create the `WallarmConfig` KVM:

    === "Apigee API Management"
        Use the following [Apigee API call](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps/create) to create a KVM at the environment level:

        ```curl
        curl -X POST \
          -H "Authorization: Bearer $(gcloud auth print-access-token)" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "WallarmConfig",
            "encrypted": true
          }' \
          "https://apigee.googleapis.com/v1/organizations/<APIGEE_ORG_ID>/environments/\
          <APIGEE_ENV>/keyvaluemaps"
        ```

        `<APIGEE_ORG_ID>` - the Google Cloud project name, `<APIGEE_ENV>` - the Apigee environment.

        Alternatively, you can create a KVM at the [API proxy](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.apis.keyvaluemaps/create) or [organization](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.keyvaluemaps/create) level.
    === "Google Cloud Console"
        In Google Cloud Console → **Management** → **Environments** → your environment → **Key value maps**, **Create** the `WallarmConfig` KVM.

        ![WallarmConfig KVM for Apigee](../../images/waf-installation/gateways/apigee/create-wallarm-kvm.png)

        When using the Console, KVMs can only be created at the environment level.

1. Add entries to the `WallarmConfig` KVM:

    | KVM entry | Description | Required? |
    | --------- | ----------- | --------- |
    | `node_url`| Full domain name of your [Wallarm Node](#1-deploy-a-wallarm-node) including protocol (e.g., `https://wallarm-node-instance.com`). | Yes |
    | `ignore_errors` | Defines error-handling behavior in synchronous traffic analysis when the Node is unavailable (e.g., timeouts):<ul><li>`true` (default) - requests are forwarded to APIs when the Node is not available</li><li>`false` - block requests with status code `403` when the Node is not available</li></ul>If not specified, the connector defaults to `true`, meaning requests are always forwarded to APIs when the Node is unavailable. | No |

    === "Apigee API Management"
        Use the following [Apigee API call](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps.entries/create) to add entries to the environment-level KVM:

        ```curl
        curl -X POST \
          -H "Authorization: Bearer $(gcloud auth print-access-token)" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "node_url",
            "value": "<WALLARM_NODE_URL>"
          }' \
          "https://apigee.googleapis.com/v1/organizations/<APIGEE_ORG_ID>/environments/\
          <APIGEE_ENV>/keyvaluemaps/WallarmConfig/entries"
        ```

        Alternatively, you can add entries to a KVM at the [API proxy](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.apis.keyvaluemaps.entries/create) or [organization](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.keyvaluemaps.entries/create) level.

        Entries must be created at the same level where the KVM itself was originally created.
    === "Google Cloud Console"
        Add entries by creating a `KeyValueMapOperations` policy inside your API proxy:

        1. In Google Cloud Console → **Proxy development** → **API proxies** → select your API proxy → **Policies**, **Add policy** with the following XML:

            ```xml
            <KeyValueMapOperations async="false" continueOnError="false" enabled="true" name="SetKVMEntry" mapIdentifier="WallarmConfig">
                <Put>
                  <Key>
                    <Parameter>node_url</Parameter>
                  </Key>
                  <Value>WALLARM_NODE_URL</Value>
                </Put>
                <Scope>environment</Scope>
            </KeyValueMapOperations>
            ```

            ![Entries in WallarmConfig KVM for Apigee](../../images/waf-installation/gateways/apigee/wallarm-kvm-entries.png)
        1. Attach the policy to **Request PreFlow** and **Response PostFlow** of the proxy endpoint:

            ![KeyValueMapOperations in PreFlow/PostFlow](../../images/waf-installation/gateways/apigee/set-kvm-entry-pre-post-policies.png)

            ??? "Relevant XML snippet for the proxy configuration"
                ```xml
                ...
                  <PreFlow name="PreFlow">
                    <Request>
                      <Step>
                        <Name>SetKVMEntry</Name>
                      </Step>
                    </Request>
                  </PreFlow>

                  <PostFlow name="PostFlow">
                    <Response>
                      <Step>
                        <Name>SetKVMEntry</Name>
                      </Step>
                    </Response>
                  </PostFlow>
                ...
                ```
        1. **Save** and **Deploy** a new API proxy revision.

### 4. Deploy Wallarm shared flows

Each traffic analysis mode (synchronous or asynchronous) requires 2 shared flows: one for requests and one for responses.

1. In Google Cloud Console → **Proxy development** → **Shared flows**, **Upload bundle** from `Wallarm-Inline-Request-Flow.zip` for synchronous mode or from `Wallarm-OOB-Request-Flow.zip` for asynchronous mode.

    ![Upload Wallarm shared flow bundle in the Google Console UI](../../images/waf-installation/gateways/apigee/upload-flow-bundle.png)
1. **Deploy** the uploaded flow. Verify that it shows a green "Ok" status for each target environment.  

    ![Deploy Wallarm shared flow bundle in the Google Console UI](../../images/waf-installation/gateways/apigee/deploy-flow-bundle.png)
1. In the same section, upload the corresponding response flow archive (`Wallarm-Inline-Response-Flow.zip` or `Wallarm-OOB-Response-Flow.zip`).
1. **Deploy** the response shared flow.

Alternatively, you can automate this step using the [Apigee API](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.sharedflows/create).

### 5. Apply shared flows to your APIs

You can apply the Wallarm shared flows globally to all API proxies in an environment, or attach them only to specific API proxies.

=== "All API proxies in the environment"
    To enable the connector for all proxies in an environment, attach the Wallarm flows as flow hooks:

    1. Proceed to Google Cloud Console → **Management** → **Environments** → select your environment → **Flow hooks**.
    1. Assign the deployed Wallarm flows:

        * **Pre-proxy** → `Wallarm-Sync-Request-Flow` for synchronous mode or `Wallarm-Async-Request-Flow` for asynchronous mode.
            
            Requests are forwarded (synchronous) or mirrored (asynchronous) to the Wallarm Node for inspection before reaching the API proxy.

        * **Post-proxy** → `Wallarm-Sync-Response-Flow` for synchronous mode or `Wallarm-Async-Response-Flow` for asynchronous mode.
            
            Responses from the target service are mirrored to the Wallarm Node for inspection.

    ![Flow hooks for environment in Apigee](../../images/waf-installation/gateways/apigee/wallarm-flow-hooks.png)

    If you already use pre-proxy or post-proxy flow hooks for other policies, you can include the Wallarm flows by referencing them through a [**FlowCallout** policy](#specific-api-proxy).

    Alternatively, you can automate this step using the [Apigee API](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.flowhooks/attachSharedFlowToFlowHook).

=== "Specific API proxy"
    You can attach the Wallarm shared flows only to specific API proxies using the `Flow Callout` policies:

    1. Proceed to Google Cloud Console → **Proxy development** → **API proxies** → select the API proxy to protect → **Policies** → **Add policy**.
    1. Create the request policy:

        * Policy type: `Flow Callout`
        * Name and Display name: `FC-Wallarm-Node-Request`
        * Sharedflow: `Wallarm-Sync-Request-Flow` for synchronous mode or `Wallarm-Async-Request-Flow` for asynchronous mode
    1. Create the response policy:

        * Policy type: `Flow Callout`
        * Name and Display name: `FC-Wallarm-Node-Response`
        * Sharedflow: `Wallarm-Sync-Response-Flow` for synchronous mode or `Wallarm-Async-Response-Flow` for asynchronous mode

        ![Flow callout for requests in Apigee](../../images/waf-installation/gateways/apigee/wallarm-flow-callout-policy.png)

        The `FC-Wallarm-Node-Request.xml` and `FC-Wallarm-Node-Response.xml` policy files are also included in the Wallarm Apigee connector bundle.
    1. Attach the policies to the proxy flows:

        * **Request → PreFlow** → select `FC-Wallarm-Node-Request`
        * **Response → PostFlow** → select `FC-Wallarm-Node-Response`

        ![Flow callout for requests in Apigee, attach as preflow](../../images/waf-installation/gateways/apigee/wallarm-preflow-callout-policy-request.png)

        ??? "Relevant XML snippet for PreFlow and PostFlow"
            ```xml
            ...
              <PreFlow name="PreFlow">
                <Request>
                  <Step>
                    <Name>FC-Wallarm-Node-Request</Name>
                  </Step>
                </Request>
              </PreFlow>
              <PostFlow name="PostFlow">
                <Response>
                  <Step>
                    <Name>FC-Wallarm-Node-Response</Name>
                  </Step>
                </Response>
              </PostFlow>
            ...
            ```
    1. Add `FC-Wallarm-Node-Response` with `<AlwaysEnforce>true</AlwaysEnforce>` to the default fault rule of your proxy.

        When a proxy returns 4xx/5xx, Apigee skips the `PostFlow` by default. Adding the policy to the fault rule ensures the response is still sent to the Wallarm Node.

        ```xml
        ...
          <FaultRules/>
          <DefaultFaultRule name="DefaultFaultRule">
            <AlwaysEnforce>true</AlwaysEnforce>
            <Step>
              <Name>FC-Wallarm-Node-Response</Name>
            </Step>
          </DefaultFaultRule>
        ...
        ```
    1. **Save** and **Deploy** a new API proxy revision.

## Testing

Test the deployed connector with both legitimate and malicious traffic.

### Legitimate traffic

1. In Google Cloud Console → **Proxy development** → **API proxies** → select your API proxy → **Debug** → **Start debug session**.
1. Send a legitimate request to the provided URL.
1. Review the transactions in the debug session and confirm that the Wallarm flows are triggered:

    ![Apigee APIM debug legitimate request](../../images/waf-installation/gateways/apigee/debug-legitimate-request.png)

    If flows are applied at the environment level, the debug view may differ slightly, but `Wallarm-Sync-Request-Flow` and `Wallarm-Sync-Response-Flow` (or their `Async` counterparts) must still appear.
1. In Wallarm Console → **API Sessions**, verify that the legitimate request is displayed:

    ![Wallarm Console: legitimate request in API Sessions](../../images/waf-installation/gateways/apigee/legitimate-request-in-sessions.png)

### Malicious traffic

1. Send a request with a test [SQLi](../../attacks-vulns-list.md#sql-injection) attack by adding the query parameter `x='+OR+1=1`:

    ```
    curl "https:<API_URL>/?x='+OR+1=1"
    ```

    * Synchronous mode with [blocking enabled](../../admin-en/configure-wallarm-mode.md): the request is blocked with `403`.
    * Synchronous mode (monitoring): request reaches the API and is logged in Wallarm Console.  
    * Asynchronous mode: request reaches the API and is logged in Wallarm Console.
1. In Wallarm Console → **API Sessions**, verify that the malicious request is logged: 

    ![Wallarm Console: malicious request in API Sessions](../../images/waf-installation/gateways/apigee/attack-in-sessions.png)
1. In Wallarm Console → **Attacks**, confirm that the attack is listed:

    ![SQLi attacks in the interface (Apigee APIM connector for Wallarm)](../../images/waf-installation/gateways/apigee/attack-in-attack-section.png)

## Block page customization

If the Node is deployed in synchronous mode with [blocking enabled](../../admin-en/configure-wallarm-mode.md), you can customize the block page returned for blocked malicious requests:

1. Go to Google Cloud Console → **Shared Flows** → `Wallarm-Sync-Request-Flow` → **Develop**.
1. Edit the `RF-Wallarm-403` RaiseFault policy. This policy defines the error response from Wallarm.  
   
    Update the content inside the `<FaultResponse><Set><Payload>` tag. Make sure the payload is wrapped in CDATA.
1. **Save** and **deploy** a new flow revision.

![Customizing Wallarm block page for Apigee APIM connector](../../images/waf-installation/gateways/apigee/customize-block-page.png)

## Upgrading the policies

To upgrade the deployed Wallarm policies to a [newer version](code-bundle-inventory.md#apigee):

1. [Download](#2-obtain-the-connector-code-bundle) the updated Apigee connector code bundle from Wallarm.
1. Import the new versions of the shared flows (`Wallarm-Inline-*` or `Wallarm-OOB-*`) into Apigee, as described in [Step 4](#4-deploy-wallarm-shared-flows).
1. Deploy the updated shared flows to the required environments.
1. Update your API proxies or environment flow hooks to reference the new flow revisions, as described in [Step 5](#5-apply-shared-flows-to-your-apis).
1. [Test](#testing) both legitimate and malicious traffic to verify the upgrade.

Policy upgrades may require a Wallarm Node upgrade, especially for major version updates. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes. Regular node updates are recommended to avoid deprecation and simplify future upgrades.

## Uninstalling the policies

To remove the Wallarm connector from Apigee API Management:

1. In Google Cloud Console → **Proxy development** → **API proxies**, open the proxy where the connector is applied.
1. Remove the `FC-Wallarm-Node-Request` and `FC-Wallarm-Node-Response` policies from **PreFlow**, **PostFlow**, and the **Default Fault Rule**.
1. If deployed at the environment level, remove the Wallarm shared flows from **Flow hooks**.
1. Delete the Wallarm shared flows (`Wallarm-Sync-*` or `Wallarm-Async-*`) from **Shared flows**.
1. Remove the `WallarmConfig` KVM or its entries if no longer needed.
1. Save and deploy a new revision of the proxy (or updated environment configuration).
