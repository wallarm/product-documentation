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

# Wallarm Connector for MuleSoft Flex Gateway

This guide describes how to secure your Mule and non-Mule APIs managed by [MuleSoft Flex Gateway](https://docs.mulesoft.com/gateway/latest/) using the Wallarm connector.

To use Wallarm as a connector for Flex Gateway, you need to **deploy the Wallarm node externally** and **apply the Wallarm-provided policy in MuleSoft** to route traffic to the Wallarm node for analysis.

The Wallarm connector for Flex Gateway supports both [synchronous (in-line)](../inline/overview.md) and [asynchronous (out‑of‑band)](../oob/overview.md) traffic analysis:

=== "Synchronous traffic flow"
    ![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-flex-gateway-inline.png)
=== "Asynchronous traffic flow"
    ![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/traffic-flow-flex-gateway-oob.png)

## Use cases

This solution is recommended for securing APIs managed by Flex Gateway.

## Limitations

--8<-- "../include/waf/installation/connectors/native-node-limitations.md"

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of the MuleSoft platform.
* Your application and API are linked and running on Flex Gateway.

    !!! info "Partial requests note"
        For the connector operating in the blocking [mode](../../admin-en/configure-wallarm-mode.md), ensure your upstream can safely handle partial requests. This is due to the streaming nature of `proxy wasm` policies - some body data may reach the upstream before full validation completes. [Read more](https://docs.mulesoft.com/pdk/latest/policies-pdk-configure-features-stop)
* Your MuleSoft user is enabled to upload artifacts to the MuleSoft Anypoint Platform account.
* Access to the **Administrator** account in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* [Node.js](https://nodejs.org/en/download) 16.0.0+ and `npm` 7+ installed on your host system.
* [`make`](https://formulae.brew.sh/formula/make) installed on your host system.
* [Anypoint CLI 4.x](https://docs.mulesoft.com/anypoint-cli/latest/install) installed on your host system.
* [Prerequisites for PDK CLI](https://docs.mulesoft.com/pdk/latest/policies-pdk-prerequisites) installed on your host system.
* [Docker](https://docs.docker.com/engine/install/) installed and running on your host system.
* Native Node [version 0.16.0 or higher](../../updating-migrating/native-node/node-artifact-versions.md).

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../security-edge/se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

!!! info "Required Node version"
    Please note that the MuleSoft Flex Gateway connector is supported only by the Native Node [version 0.16.0+](../../updating-migrating/native-node/node-artifact-versions.md).

### 2. Obtain and upload the Wallarm policy to MuleSoft Exchange

To acquire and upload the Wallarm policy to MuleSoft Exchange, follow these steps:

1. Contact sales@wallarm.com to get the code bundle.
1. Ensure the machine you will use to publish the policy meets [all necessary requirements](#requirements).
1. Extract the policy archive.
1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its **business group ID**.
1. In the extracted policy directory → `Cargo.toml` → `[package.metadata.anypoint]` → `group_id`, specify the copied group ID:

    ```toml
    ...
    [package.metadata.anypoint]
    group_id = "<BUSINESS_GROUP_ID>"
    definition_asset_id = "wallarm-custom-policy"
    implementation_asset_id = "wallarm-custom-policy-flex"
    ...
    ```
1. [Authenticate with Anypoint CLI](https://docs.mulesoft.com/anypoint-cli/latest/auth) in the same terminal session where you are working with the policy:

    ```
    anypoint-cli-v4 conf username <USERNAME>
    anypoint-cli-v4 conf password '<PASSWORD>'
    ```
1. Build and publish the policy:

    ```bash
    make setup      # Installs dependencies and PDK CLI
    make build      # Builds the policy
    make release    # Publishes a new production version of the policy to Anypoint
    # or
    # make publish  # Publishes a development version of the policy to Anypoint
    ```

Your custom policy is now available in your MuleSoft Anypoint Platform Exchange.

![MuleSoft with Wallarm policy](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Attach the Wallarm policy to your API

You can attach the Wallarm policy to either an individual API or all APIs.

1. To apply the policy to an individual API, navigate to Anypoint Platform → **API Manager** → select the desired API → **Policies** → **Add policy**.
1. To apply the policy to all APIs, go to Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**.
1. Choose the Wallarm policy from Exchange.
1. Specify the Wallarm node URL including `http://` or `https://` in the `wallarm_node` parameter.
1. If necessary, modify [other parameters](#configuration-options).
1. Apply the policy.

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup-flex.png)

## Configuration options

In the Wallarm policy settings for Flex Gateway, you can specify the following parameters:

| Parameter | Description | Required? |
| --------- | ----------- | --------- |
| `wallarm_node` | Sets the address of your [Wallarm Node instance](#1-deploy-a-wallarm-node). | Yes |
| `real_ip_header` | Specifies which header to use to determine the original client IP address when behind a proxy or load balancer. Default: `X-Forwarded-For`. | Yes |
| `real_host_header` | Specifies which HTTP header to use as the original request host when behind a proxy or load balancer. Default: `Host`. | Yes |
| `wallarm_mode` | Determines traffic handling mode: `sync` processes traffic through the Wallarm Node directly, while `async` analyzes a [copy](../oob/overview.md) of the traffic without affecting the original flow. Default: `sync`. | Yes |
| `fallback_action` | Defines request handling behavior when the Wallarm node is down. Can be: `pass` (all requests are allowed through) or `block` (all requests are blocked with the 403 code). Default: `pass`. | Yes |
| `parse_responses` | Controls whether to analyze response bodies or not. It enables response schema discovery and enhanced attack and vulnerability detection capabilities. Default: `true`. | Yes |
| `response_body_limit` | Limits the size of the response body sent to the Wallarm node. Default: `4096` bytes. | No |

## Testing

To test the functionality of the deployed policy, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl http://<GATEWAY_URL>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md) and the traffic flows in-line, the request will also be blocked.

## Troubleshooting

If the solution does not perform as expected, refer to the logs of your API by accessing MuleSoft Anypoint Platform → **Runtime Manager** → your application → **Logs**.

You can also verify whether the policy is applied to the API by navigating to your API in the **API Manager** and reviewing the policies applied on the **Policies** tab. For automated policies, you can use the **See covered APIs** option to view the APIs covered and the reasons for any exclusions.

## Upgrading the policy

To upgrade the deployed Wallarm policy to a [newer version](code-bundle-inventory.md#mulesoft-flex-gateway):

1. Download the updated Wallarm policy and upload it to MuleSoft Exchange, as described in [Step 2](#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange).
1. Once the new version appears in Exchange, go to **API Manager** → your API → **Policies** → Wallarm policy → **Edit configuration** → **Advanced options** and choose the new policy version from the dropdown.
1. If the new version introduces additional parameters, provide the necessary values.
1. Save changes.

If the Wallarm policy is applied as an automated policy, direct upgrades may not be possible. In such cases, remove the current policy and reapply the new version manually.

Policy upgrades may require a Wallarm node upgrade, especially for major version updates. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes. Regular node updates are recommended to avoid deprecation and simplify future upgrades.

## Uninstalling the policy

To uninstall the Wallarm policy, use the **Remove policy** option in either the automated policy list or the list of policies applied to an individual API.
