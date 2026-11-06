# Wallarm Connector for SAP API Management

This guide describes how to secure your APIs managed by SAP API Management (part of SAP Integration Suite on SAP Business Technology Platform) using the Wallarm connector.

## Overview

SAP API Management provides authentication and authorization, traffic management, and content validation for APIs, but it does not detect application-layer attacks. To add this protection, **deploy the Wallarm Node externally** and **inject the Wallarm policies into your SAP API proxy** to route traffic to the Node for analysis.

The Wallarm connector for SAP API Management supports the **synchronous** and **asynchronous** traffic analysis:

=== "Synchronous traffic flow"
    In [synchronous (in-line)](../inline/overview.md) mode, the Wallarm policy sends each request to the Wallarm Node and holds it until the Node responds. Based on the Node's [filtration mode](../../admin-en/configure-wallarm-mode.md), malicious requests are blocked with `403` and never reach your target endpoint, providing real-time threat mitigation.
=== "Asynchronous traffic flow"
    In [asynchronous (out-of-band)](../oob/overview.md) mode, the Wallarm policy mirrors requests and responses to the Node without waiting for a reply. Requests are never held or blocked. Malicious requests are logged in Wallarm Console.

## Limitations

* Installation is per API proxy.

    You inject the Wallarm policies into each API proxy separately: export the proxy, run the preparation script, and import the result. SAP does not provide a way to import shared flows through the SAP Integration Suite UI, so a single action that protects all APIs in an environment is not available.
* Do not edit a Wallarm-enabled proxy in the SAP Integration Suite policy editor.

    The editor cannot parse the Wallarm JavaScript policy XML on save. Change the Wallarm policies only through the export, script, and import workflow described in this guide.

## Requirements

Before deployment, ensure the following prerequisites are met:

* Familiarity with SAP Integration Suite and its API Management capability.
* An SAP Business Technology Platform (BTP) account with SAP Integration Suite subscribed, the API Management capability activated, and an active API Management runtime.
* The following role collections assigned to your user:

    * `Integration_Provisioner`
    * `APIManagement.SelfService.Administrator`
    * `Subaccount Administrator`, if you encounter access issues
* Access to the **Administrator** account in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Native Node [version 0.25.7 or higher](../../updating-migrating/native-node/node-artifact-versions.md). Older Node versions reject traffic from this connector.
* A valid **trusted** SSL/TLS certificate for the Wallarm Node domain (self-signed certificates are not supported).
* Python 3 on the machine where you run the preparation script.

## Deployment

### 1. Deploy a Wallarm Node

The Wallarm Node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

Choose an artifact for a self-hosted node deployment and follow the attached instructions:

* [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
* [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

Note the HTTPS address of the Node. It is the `<WALLARM_NODE_URL>` value in the next step.

### 2. Obtain the connector code bundle

Contact support@wallarm.com to get the SAP API Management connector code bundle.

The bundle contains the `prepare.sh` script and the Wallarm policy resources that the script adds to your API proxy.

### 3. Create a key value map in SAP

The connector reads its configuration from a key value map (KVM). Using a KVM allows you to change parameters without modifying policy code.

In SAP Integration Suite, go to **Configure** → **APIs** → **Key Value Maps** → **Create** and create a map with these settings:

* **Name**: `WallarmConfig`
* **Encrypt Key Value Map**: cleared

Add the following entries:

| KVM entry | Description | Required? |
| --------- | ----------- | --------- |
| `node_url` | Full domain name of your [Wallarm Node](#1-deploy-a-wallarm-node) including protocol (for example, `https://wallarm-node-instance.com`). | Yes |
| `ignore_errors` | Defines error-handling behavior in synchronous traffic analysis when the Node is unavailable:<ul><li>`true` (default) - requests are forwarded to APIs when the Node is not available</li><li>`false` - requests are blocked with status code `403` when the Node is not available or returns any status other than `200`</li></ul> | No |

!!! warning "Use the exact names"
    The connector looks up the map by the name `WallarmConfig` and reads the `node_url` and `ignore_errors` keys. Any other spelling breaks the connector.

### 4. Export the API proxy

1. In SAP Integration Suite, go to **Configure** → **APIs**.
1. Open the API proxy to protect.
1. Select **...** → **Export API** and note the name of the downloaded file.

### 5. Inject the Wallarm policies

Run the preparation script from the code bundle against the exported proxy. Choose the traffic flow mode:

```bash
# Synchronous (in-line)
./prepare.sh --mode sync <PATH_TO_EXPORTED_PROXY>.zip

# Asynchronous (out-of-band)
./prepare.sh --mode async <PATH_TO_EXPORTED_PROXY>.zip
```

The script writes a new bundle to the current directory, for example `<EXPORTED_PROXY>-wallarm-sync.zip`. The bundle contains the following policies:

| Policy | Purpose |
| ------ | ------- |
| `KVM-Get-Wallarm-Node-URL` | Reads `node_url` and `ignore_errors` from the `WallarmConfig` KVM. |
| `JS-Wallarm-Node-Request` | Sends the request to the Wallarm Node. In synchronous mode, it waits for the Node verdict. |
| `JS-Wallarm-Node-Response` | Sends the response to the Wallarm Node. |
| `RF-Wallarm-403` | Synchronous mode only. Raises a `403` fault when the Node blocks the request. |

### 6. Import the prepared proxy

1. In SAP Integration Suite, go to **Configure** → **APIs**.
1. Select **Import API** and upload the prepared bundle. SAP overwrites and redeploys the existing proxy.

Repeat steps 4-6 for each API proxy to protect.

## Testing

Test the deployed connector with both legitimate and malicious traffic.

Set the proxy URL:

```bash
export SAP_PROXY_URL="https://<HOST_ALIAS>/<SUBACCOUNT>/<PROXY_BASEPATH>"
```

### Legitimate traffic

1. Send a legitimate request:

    ```bash
    curl -i "${SAP_PROXY_URL}"
    ```

    The request returns the normal response of your target endpoint.
1. In Wallarm Console → **API Sessions**, verify that the request is displayed.

### Malicious traffic

1. Send requests with test [SQLi](../../attacks-vulns-list.md#sql-injection) and [path traversal](../../attacks-vulns-list.md#path-traversal) attacks:

    ```bash
    curl -i "${SAP_PROXY_URL}?id=1%20OR%201=1"
    curl -i "${SAP_PROXY_URL}/etc/passwd"
    ```

    * Synchronous mode with [blocking enabled](../../admin-en/configure-wallarm-mode.md): the request is blocked with `403`.
    * Synchronous mode (monitoring): the request reaches the API and is logged in Wallarm Console.
    * Asynchronous mode: the request reaches the API and is logged in Wallarm Console.
1. In Wallarm Console → **Attacks**, confirm that the attacks are listed. They appear within seconds in synchronous mode and within a few minutes in asynchronous mode.

## Upgrading the policies

To upgrade the deployed Wallarm policies to a [newer version](code-bundle-inventory.md#sap-api-management):

1. [Download](#2-obtain-the-connector-code-bundle) the updated SAP API Management connector code bundle from Wallarm.
1. Export the Wallarm-enabled proxy from SAP Integration Suite, as described in [step 4](#4-export-the-api-proxy).
1. Run the `prepare.sh` script from the new bundle with the same mode, as described in [step 5](#5-inject-the-wallarm-policies).
1. Import the prepared bundle, as described in [step 6](#6-import-the-prepared-proxy).
1. [Test](#testing) both legitimate and malicious traffic to verify the upgrade.

Policy upgrades may require a Wallarm Node upgrade. See the [Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for the self-hosted Node release notes.

## Uninstalling the policies

To remove the Wallarm connector from an API proxy:

1. Export the Wallarm-enabled proxy in SAP Integration Suite (**Configure** → **APIs** → **...** → **Export API**).
1. Remove the Wallarm policies from the bundle:

    ```bash
    ./prepare.sh --uninstall <PATH_TO_EXPORTED_PROXY>.zip
    ```

    The script writes a clean bundle named `<EXPORTED_PROXY>-no-wallarm.zip`.
1. Import the clean bundle in SAP Integration Suite and redeploy the proxy.
1. Delete the `WallarmConfig` KVM in **Configure** → **APIs** → **Key Value Maps** if you no longer need it.
