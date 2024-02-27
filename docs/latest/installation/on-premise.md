# Wallarm On-Premise Deployment (Pre-Release)

Wallarm offers a pre-release version of its on-premise solution designed for partners, large enterprises, and any organization looking for a comprehensive on-premise security system. This offering allows for the integration of Wallarm's security infrastructure directly into their own environments. The article provides information on how to access and make use of this offering.

!!! info "Contact for any inquiries"
    As the solution is in pre-release, please contact [Wallarm's sales team](mailto:sales@wallarm.com) for any questions or requests regarding on-premise deployment.

The Wallarm architecture is built around [two main components](../about-wallarm/overview.md#how-wallarm-works):

* Filtering node: Deployed within your infrastructure, allowing for flexible deployment options to suit your needs.
* Wallarm Cloud: Traditionally hosted externally by Wallarm. In the on-premise deployment model, we offer a method for deploying Wallarm Cloud within your own infrastructure. This approach necessitates organizing the entire infrastructure due to the comprehensive nature of the service deployment. We simplify this process by providing a script that automatically initiates all required services.

<!-- ![On-premise deployment](../images/waf-installation/on-premise.png) -->

## Deploying Wallarm Cloud on-premise

For on-premise deployment, you need to deploy the Wallarm Cloud on your infrastructure. Wallarm simplifies this process by providing a script that deploys all required Cloud services in a couple of steps, including both the backend and frontend components (Wallarm Console UI).

### Requirements

To deploy Wallarm Cloud, prepare a compute instance meeting these criteria:

* Ubuntu 22.04 LTS or RedHat 9.x with minimal additional software installed.
* At least 16 physical CPU cores, 48 GB RAM, and 300 GB of SSD disk space on the root partition, without additional mounts. For production environments, 500+ GB of SSD space is recommended.
* A 3-5 level DNS wildcard configured for the instance, such as `*.wallarm.companyname.tld`.
* A valid SSL/TLS wildcard certificate (and key) issued from either a trusted or an internal CA. All filtering node instances and browsers must recognize this SSL/TLS certificate/key pair as trusted.
* Allowed outgoing connections to Wallarm's on-premise license service IP address (single static IP address; provided during integration) for downloading the license key and the installation/upgrade packages.

### Procedure

To deploy Wallarm Cloud on-premise:

1. Contact our [sales team](mailto:sales@wallarm.com?subject=Wallarm%20on-premise%20deployment&body=Dear%20Wallarm%20Sales%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20deploying%20the%20Wallarm%20platform%20on-premise.%20Could%20you%20please%20provide%20me%20with%20the%20necessary%20scripts%20for%20deployment%2C%20detailed%20information%20on%20the%20appropriate%20subscription%20plans%2C%20and%20comprehensive%20instructions%3F)  to obtain the deployment script for the Cloud services, the corresponding instructions, and the initial credentials.
1. Prepare a virtual (or physical) machine according to the requirements outlined above.
1. Upload the installation package to the prepared instance and execute it to deploy the solution components.
1. Configure a DNS wildcard record to point to the IP address of the prepared instance. For example, if you want to delegate a wildcard DNS record `*.wallarm.companyname.tld`, ensure that at least `my.wallarm.companyname.tld` and `api.wallarm.companyname.tld` are resolved to the IP address of the prepared instance.
1. Follow the initial configuration guide provided with the installation package.
1. Once configured, access `https://my.wallarm.companyname.tld` (or the corresponding domain record you configured) and attempt to log in using the initial credentials provided with the installation package.

You can now configure the Wallarm platform via the on-premise UI just like the hosted Cloud version, e.g.:

* [Generate tokens for node deployment](../user-guides/settings/api-tokens.md)
* [Review attacks and hits](../user-guides/events/check-attack.md)
* [Change traffic filtering rules](../user-guides/rules/rules.md)
* Manage additional platform modules like [API Discovery](../api-discovery/overview.md), etc.

All functionalities are outlined on this documentation site. When referencing Wallarm Console UI links in different Clouds from the articles, use your own domain and the interface where you have deployed the on-premise Wallarm Cloud.

## Deploying Wallarm filtering node

The deployment process for the on-premise Wallarm filtering node is similar to standard filtering node deployment procedures. Choose a deployment option that suits your needs and infrastructure and follow our guides, considering the specific requirements for your selected deployment method.

### Requirements

To deploy a filtering node, prepare a compute instance meeting these criteria:

* NGINX artifacts access required if deploying the node as an NGINX module or in any setup that involves NGINX installation on the instance.
* Sufficient CPU, memory, and storage to support node operation, tailored to your traffic volume. Refer to the general resource allocation recommendations provided [here](../admin-en/configuration-guides/allocate-resources-for-node.md).
* Access to the TCP/80 and TCP/443 ports of the on-premise Cloud instance.
* Follow any other requirements specified in the deployment method article you choose.

### Procedure

To deploy a filtering node on-premise:

1. Select a [deployment option](supported-deployment-options.md) from the available choices and adhere to the provided instructions. All options, including in-line and out-of-band (OOB) configurations, support on-premise deployment.

    During the node setup, in the parameters that define the Wallarm Cloud host, specify the address of the Wallarm Cloud instance you created earlier.
1. Ensure the domain of the running instance resolves to its IP address. For instance, if the domain is configured as `my.wallarm.node.com`, this domain should point to the instance's IP.

## Testing the deployment

To test the deployment:

1. Run the test Path Traversal attack targeting the filtering node instance:

    ```bash
    curl http://localhost/etc/passwd
    ```
1. Open the deployed Wallarm Console UI and check that the corresponding attack appeared in the attack list.
