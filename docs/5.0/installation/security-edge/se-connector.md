[se-connector-setup-img]:           ../../images/waf-installation/security-edge/connectors/setup-view.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-hosts-locations-img]: ../../images/waf-installation/security-edge/connectors/hosts-locations.png

# Security Edge Connectors <a href="../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../images/security-edge-tag.svg" style="border: none;"></a>

The [**Security Edge**](overview.md) platform provides a managed service for deploying Wallarm Nodes across geographically distributed locations within a Wallarm-hosted environment. One of its key deployment options is the [**connector**](../connectors/overview.md) Node deployment, offering robust protection for your entire API landscape without the need for any onsite installation.

![!](../../images/waf-installation/security-edge/connectors/traffic-flow.png)

!!! info "Supported platforms"
    Currently, Edge connectors are available only for MuleSoft Mule Gateway, CloudFront, Cloudflare, Fastly, IBM DataPower.

## Requirements

* [Security Edge subscription](../../about-wallarm/subscription-plans.md) (free or paid)
* API running on one of the following API management platforms:

    * MuleSoft Mule Gateway
    * CloudFront
    * Cloudflare
    * Fastly
    * IBM DataPower

## Running Security Edge Connectors

To run the Security Edge Connector, go to the Wallarm Console → **Security Edge** → **Connectors** → **Add connector**. If this section is unavailable, contact sales@wallarm.com to access the required subscription.

On the Free Tier, after deploying Edge Nodes via [Quick setup](free-tier.md), the **Security Edge** section lets you adjust settings.

### 1. Deploying the Edge Node for a connector

Only the connector settings need to be specified. Wallarm handles the deployment and provides an endpoint for routing traffic from the platform.

One endpoint can handle multiple connections from different hosts.

1. Proceed to Wallarm Console → **Security Edge** → **Connectors** → **Add connector**.

    ![!][se-connector-setup-img]
1. Specify the Node deployment settings:

    * **Regions**: select one or more regions to deploy the Wallarm Node for the connector. We recommend choosing regions close to where your APIs or applications are deployed. Multiple regions improve geo-redundancy by balancing the load if an instance becomes unavailable.

        You can choose regions in **AWS** or **Azure**.
    
    * **Filtration mode**: [traffic analysis mode][filtration-mode-docs].
    * **Application**: general application ID. In Wallarm, [applications](../../user-guides/settings/applications.md) help identify and organize parts of your infrastructure (e.g., domains, locations, instances).
    
        Each Node requires a general application ID, with the option to assign specific IDs for locations or instances.
    
    * **Allowed hosts**: specify which hosts the Node will accept and analyze traffic from.

        If a specified host does not exist or is unreachable, the 415 error will be returned, and the traffic will not be processed.
    
    * **Location configuration**: assign unique application IDs and traffic analysis mode to specific hosts and locations, if needed.

        ![!][se-connector-hosts-locations-img]
1. In the **Auto-update strategy** settings, you can select an [Edge Node version](../../updating-migrating/native-node/node-artifact-versions.md#all-in-one-installer) and enable [Auto update](#upgrading-the-edge-node) if needed. If no version is explicitly selected, the latest version is automatically deployed.

    ![!](../../images/waf-installation/security-edge/connectors/autoupdate.png)
1. Once saved, it will take 3-5 minutes for Wallarm to deploy and configure the Node for the connector.

    The status will change from **Pending** to **Active** when deployment is complete.
1. Copy the Node endpoint as you will need it later to route traffic from your platform.

![!](../../images/waf-installation/security-edge/connectors/copy-endpoint.png)

You can change the Edge Node deployment settings at any time while the Node is in **Active** status. The Node will be re-deployed, starting from the **Pending** status to **Active**. The endpoint will not change, but it will be unavailable during the re-deployment process.

### 2. Injecting Wallarm code on a platform running your APIs

After deploying the Edge Node, you will need to inject Wallarm code into your platform to route traffic to the deployed Node.

1. Download a code bundle for your platform from the Wallarm Console UI.

    ![!](../../images/waf-installation/security-edge/connectors/download-code-bundle.png)
1. Apply the bundle on your API management platform following the instructions:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)

## Telemetry portal

The telemetry portal for Security Edge Connectors provides a Grafana dashboard with real-time insights into metrics on traffic processed by Wallarm.

The dashboard displays key metrics such as total processed requests, RPS, detected and blocked attacks, deployed Edge Node number, resource consumption, number of 5xx responses, etc.

![!](../../images/waf-installation/security-edge/connectors/telemetry-portal.png)

**Run telemetry portal** once the Node reaches the **Active** status. It becomes accessible via a direct link from the Security Edge section ~5 minutes after initiation.

![!](../../images/waf-installation/security-edge/connectors/run-telemetry-portal.png)

From the Grafana home page, to reach the dashboard, navigate to **Dashboards** → **Wallarm** → **Portal Connector Overview**. For multiple Nodes, switch the **Tenant ID** corresponding to the connector endpoint to view each dashboard.

## Upgrading the Edge Node

When **Auto update** is enabled, the Edge Node is automatically upgraded as soon as a new minor or patch version is released (depending on the selected option). All your initial settings are preserved. Auto update is off by default.

To manually upgrade the Edge Node, open your Node for editing and select a version in the **Auto update** section. Using the latest version is recommended for optimal performance and security.

Upgrading to a new major version can only be done manually.

For the changelog of versions, refer to the [article](../../updating-migrating/native-node/node-artifact-versions.md#all-in-one-installer). The Edge Node version follows the `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` format, corresponding to the same version in the linked article. The build number in the Edge Node version indicates minor changes.

Additionally, you might need to upgrade your connector code bundle. For the changelog and upgrade instructions, see the [Connector Code Bundle Changelog](../connectors/code-bundle-inventory.md).

## Deleting the Edge Node

If you delete the Edge Node, its endpoint becomes unavailable, and you will no longer be able to redirect traffic through it for security analysis.

The Wallarm code bundle injected into your platform will still try to reach the Node endpoint specified in the bundle settings. However, it will fail with the `failed: Couldn't resolve address` error, and traffic will continue to flow to its target without passing through the Edge Node.

If your subscription expires, the Edge Node will be automatically deleted after 14 days.

## Troubleshooting

--8<-- "../include/waf/installation/security-edge/connector-troubleshooting.md"
