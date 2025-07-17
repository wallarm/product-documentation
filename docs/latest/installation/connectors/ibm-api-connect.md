[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/waf-installation/gateways/ibm/test-attack-ui.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Wallarm Connector for IBM API Connect

[IBM API Connect](https://www.ibm.com/products/api-connect) is a full lifecycle API management solution that includes tools for creating, securing, managing, and monitoring APIs. Wallarm can be used as a connector to protect APIs managed through IBM API Connect by inspecting API traffic and mitigating malicious requests.

To integrate Wallarm with IBM API Connect, **deploy a Wallarm node externally** and **configure IBM API Gateway to proxy traffic to the node** for inspection.

The Wallarm connector for IBM API Connect supports only [in-line](../inline/overview.md) traffic analysis:

![](../../images/waf-installation/gateways/ibm/ibm-traffic-flow-inline.png)

!!! info "Requests matching API specification"
    According to IBM API Connect behavior, only requests matching the defined OpenAPI paths will be inspected by the Wallarm Node.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is recommended for securing APIs published via IBM API Connect.

## Limitations

* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Familiarity with IBM API Connect and IBM DataPower Gateway.
* An IBM API Connect environment up and running (either local or cloud-managed).
* A published API in IBM API Connect.
* IBM API Toolkit installed for command-line interaction (`apic` or `apic-slim`).
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Wallarm Node of version 0.13.3 or later in the 0.13.x series, or version 0.14.1 or later.

## Deployment

### 1. Deploy a Wallarm node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

!!! info "Required Wallarm Node version"
    The IBM API Connect integration requires Wallarm Node [version](../../updating-migrating/native-node/node-artifact-versions.md) 0.13.3 or later in the 0.13.x series, or 0.14.1 or later. Older versions do not support this connector.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
    <!-- * [AWS AMI](../native-node/aws-ami.md) for AWS infrastructures -->
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Obtain and apply the Wallarm policies to APIs in IBM API Connect

Wallarm provides custom policies that can be attached to APIs in API Connect. These policies proxy API requests and responses through the Wallarm Node for inspection and threat detection.

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** and download a code bundle for your platform.

    If running a self-hosted node, contact sales@wallarm.com to get the code bundle.
1. Register the request inspection policy:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. Register the response inspection policy:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-post.zip
    ```

In most cases, the `configured-gateway-service` name is `datapower-api-gateway`.

### 3. Integrate Wallarm inspection steps into the assembly pipeline

In your API specification, within the `x-ibm-configuration.assembly.execute` section, add or update the following steps to route traffic through the Wallarm Node:

1. Before the `invoke` step, add the `wallarm_pre` step to proxy incoming requests to the Wallarm Node.
1. Ensure that the `invoke` step is configured as follows:
    
    * The `target-url` should follow the format `$(target-url)$(request.path)?$(request.query-string)`. This ensures that requests are proxied to the original backend path along with any query parameters.
    * `header-control` and `parameter-control` allow all headers and parameters to pass through. This enables the Wallarm Node to analyze the full request, detect attacks in any part of it, and accurately build the API inventory.
1. After the `invoke` step, add the `wallarm_post` step to proxy responses to the Wallarm Node for inspection.

```yaml hl_lines="8-22"
...
x-ibm-configuration:
  properties:
    target-url:
      value: <BACKEND_ADDRESS>
  ...
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
...
```

Supported properties in Wallarm policies:

| Parameter | Step name | Description | Required? |
| --------- | --------- | ----------- | --------- |
| `wallarmNodeAddress` | `wallarm_pre`, `wallarm_post` | Wallarm Node instance URL. | Yes |
| `failSafeBlock` | `wallarm_pre`, `wallarm_post` | If `true` (default), blocks the request or response if the Wallarm Node is unavailable or returns an error during request/response forwarding. | No |

### 4. Publish your product with the updated API

To apply changes to the traffic flow, re-publish the product that includes the modified API:

```
apic products:publish \
    --scope <CATALOG OR SPACE> \
    --server <MANAGEMENT SERVER ENDPOINT> \
    --org <ORG NAME OR ID> \
    --catalog <CATALOG NAME OR ID> \
    <PATH TO THE UPDATED PRODUCT YAML>
```

## Example: API and product with Wallarm policies

This example shows a basic API and product configuration with Wallarm request and response inspection steps (`wallarm_pre`, `invoke`, `wallarm_post`) added to the assembly. You can deploy it to test traffic inspection via Wallarm Node.

* API specification:

```yaml
openapi: 3.0.3
info:
  title: Hello API
  version: 1.0.0
  x-ibm-name: hello-api
servers:
  - url: /
paths:
  /hello:
    get:
      summary: Say Hello
      responses:
        '200':
          description: OK
          content:
            text/plain:
              schema:
                type: string
x-ibm-configuration:
  properties:
    target-url:
      value: https://httpbin.org
      description: Where to proxy the filtered traffic
      encoded: false
  type: rest
  phase: realized
  enforced: true
  testable: true
  cors:
    enabled: true
  gateway: datapower-api-gateway
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
  activity-log:
    enabled: true
    success-content: activity
    error-content: payload
```

* Product specification:

```yaml
product: 1.0.0
info:
  name: hello-product
  title: Hello Product
  version: 1.0.0
  description: A basic product exposing Hello API
apis:
  hello-api:
    $ref: ./api.yaml
plans:
  default:
    title: Default Plan
    description: Open access plan
    approval: false
    rate-limit:
      value: unlimited
    apis:
      hello-api: {}
visibility:
  view:
    enabled: true
    type: public
  subscribe:
    enabled: true
    type: authenticated
gateways:
  - datapower-api-gateway
```

## Testing

To test the functionality of the deployed policies, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API:

    ```
    curl -k --request GET --url https://localhost:9444/<PATH ALLOWED BY SPEC> \
      --header 'X-IBM-Client-Id: <YOUR IBM CLIENT ID>' \
      --header 'accept: /etc/passwd'
    ```

    According to IBM API Connect behavior, only requests matching the defined OpenAPI paths will be inspected by the Wallarm Node.

1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to [blocking](../../admin-en/configure-wallarm-mode.md) and the traffic flows in-line, the request will also be blocked (the screenshot demonstartes this case).

## Upgrading the policies

To upgrade the deployed Wallarm policies to a [newer version](code-bundle-inventory.md#ibm-api-connect):

1. Download the updated Wallarm policies for IBM from Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**.

    If running a self-hosted node, contact sales@wallarm.com to get the updated code bundle.
1. Re-register each policy using the `policies:create` command and specify the updated `.zip` files:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. Repeat for `wallarm-post.zip`.
1. In your API specification, update the policy versions in `x-ibm-configuration.assembly.execute`:

    ```yaml
    ...
    x-ibm-configuration:
      ...
      assembly:
        execute:
          - wallarm_pre:
              version: <NEW_VERSION>
          ...
          - wallarm_post:
              version: <NEW_VERSION>
    ...
    ```

    Both policies use the same version number.
1. Re-publish the associated product using the `products:publish` command.

    ```
    apic products:publish \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        <PATH TO THE UPDATED PRODUCT YAML>
    ```

Policy upgrades may require a Wallarm node upgrade, especially for major version updates. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes and upgrade instructions or the [Edge connector upgrade procedure](../se-connector.md#upgrading-the-edge-node). Regular node updates are recommended to avoid deprecation and simplify future upgrades.
