# Wallarm On-Premise Deployment (Pre-Release)

Wallarm offers a pre-release version of its on-premise solution designed for partners, large enterprises, and any organization looking for a comprehensive on-premise security system. This offering allows for the integration of Wallarm's security infrastructure directly into their own environments. The article provides information on how to access and make use of this offering.

!!! info "Contact for any inquiries"
    As the solution is in pre-release, please contact [Wallarm's sales team](mailto:sales@wallarm.com) for any questions or requests regarding on-premise deployment.

The Wallarm architecture is built around [two main components](../about-wallarm/overview.md#how-wallarm-works):

* Filtering node: Deployed within your infrastructure, allowing for flexible deployment options to suit your needs.
* Wallarm Cloud: Traditionally hosted externally by Wallarm. In the on-premise deployment model, we offer a method for deploying Wallarm Cloud within your own infrastructure. This approach necessitates organizing the entire infrastructure due to the comprehensive nature of the service deployment. We simplify this process by providing a script that automatically initiates all required services.

![On-premise deployment](../images/waf-installation/on-premise.png)

## Deploying Wallarm Cloud on-premise

For on-premise deployment, you need to deploy the Wallarm Cloud on your infrastructure. Wallarm simplifies this process by providing a script that deploys all required Cloud services in a couple of steps, including both the backend and frontend components (Wallarm Console UI).

### Requirements

To deploy Wallarm Cloud on-premise, you need to prepare a compute instance meeting the criteria below.

**Operating system**

* Ubuntu LTS 18.04, 20.04, 22.04
* Debian 11.x, 12.x
* Red Hat Enterprise Linux 8.x

**System requirements**

The server should be dedicated as a standalone unit. Allocating dedicated power is advisable. Resource requirements vary based on the expected incoming traffic load.

For less than 1 billion requests per month:

* 16+ cores
* 48 GB+ memory
* 300 GB of SSD root storage (HDDs are inadequate due to their slow performance; NVMe is acceptable but not necessary). Ensure that the server configuration includes only the default operating system mounts to the root directory and, optionally, the boot directory (`/boot`). Avoid setting up any additional disk volumes or storage partitions.
* Additional 100 GB of storage for every 100 million requests per month, to accommodate data for 1 year

For more than 1 billion requests per month:

* 32+ cores
* 80 GB+ memory (120 GB recommended)
* 500 GB of SSD root storage (HDDs are inadequate due to their slow performance; NVMe is acceptable but not necessary). Ensure that the server configuration includes only the default operating system mounts to the root directory and, optionally, the boot directory (`/boot`). Avoid setting up any additional disk volumes or storage partitions.
* Additional 100 GB of storage for every 100 million requests per month, to accommodate data for 1 year

**Network requirements**

* Allowed outgoing connections to `https://onprem.wallarm.com` with 80 and 443 ports for downloading the license key and the installation/upgrade packages. This domain operates from a static IP address and the DNS must also resolve it.
* A 3-5 level DNS wildcard record configured for the instance, e.g. `*.wallarm.companyname.tld`. Ensure that the instance is accessible via these DNS resolutions from any Wallarm filtering node and any client that needs to have this access (probably, you will want to hide it for access only from your VPN, do so then or maybe you will want to have it accessible from any browser and any IP address outside, configure it as you need to)
* A valid SSL/TLS wildcard certificate (and key) issued from either a trusted or an internal CA. All filtering node instances and browsers must recognize this SSL/TLS certificate/key pair as trusted.

**System requirements**

The server should be dedicated as a standalone unit. Allocating dedicated power is advisable. Resource requirements vary based on the expected incoming traffic load.

For less than 1 billion requests per month:

* 16+ cores
* 48 GB+ memory
* 300 GB of SSD root storage (HDDs are inadequate due to their slow performance; NVMe is acceptable but not necessary). Ensure that the server configuration includes only the default operating system mounts to the root directory and, optionally, the boot directory (`/boot`). Avoid setting up any additional disk volumes or storage partitions.
* Additional 100 GB of storage for every 100 million requests per month, to accommodate data for 1 year

For more than 1 billion requests per month:

* 32+ cores
* 80 GB+ memory (120 GB recommended)
* 500 GB of SSD root storage (HDDs are inadequate due to their slow performance; NVMe is acceptable but not necessary). Ensure that the server configuration includes only the default operating system mounts to the root directory and, optionally, the boot directory (`/boot`). Avoid setting up any additional disk volumes or storage partitions.
* Additional 100 GB of storage for every 100 million requests per month, to accommodate data for 1 year

**Network requirements**

* Allowed outgoing connections to `https://onprem.wallarm.com` with 80 and 443 ports for downloading the license key and the installation/upgrade packages. This domain operates from a static IP address and the DNS must also resolve it.
* A 3-5 level DNS wildcard record configured for the instance, e.g. `*.wallarm.companyname.tld`. Ensure that the instance is accessible via these DNS resolutions from any Wallarm filtering node and any client that needs to have this access (probably, you will want to hide it for access only from your VPN, do so then or maybe you will want to have it accessible from any browser and any IP address outside, configure it as you need to)
* A valid SSL/TLS wildcard certificate (and key) issued from either a trusted or an internal CA. All filtering node instances and browsers must recognize this SSL/TLS certificate/key pair as trusted.

**Software dependencies**

Begin with a clean operating system installation featuring only essential software. The deployment process will subsequently install any additional packages (including containerd, Kubernetes, etc). Ensure that the following conditions are met:

* The SSHd service is operational on TCP port 22, with SSH key authentication enabled.
* The following packages are pre-installed (these are typically included by default in most systems):

    * `iproute`
    * `iptables`
    * `bash`
    * `curl`
    * `ca-certificates`

    === "Debian-based OS"
        ```
        apt-get install iproute2 iptables bash curl ca-certificates
        ```
    === "Red Hat-based OS"
        ```
        yum install iproute iptables bash curl ca-certificates
        ```
* SELinux is fully disabled, the permissive mode is insufficient due to performance considerations.
* SWAP memory is disabled.

    ```
    swapon -s
    ```

### Procedure

To deploy Wallarm Cloud on-premise on the prepared compute instance:

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

* Sufficient CPU, memory, and storage to support node operation, tailored to your traffic volume. Refer to the general resource allocation recommendations provided [here](../admin-en/configuration-guides/allocate-resources-for-node.md).
* Access to the TCP/80 and TCP/443 ports of the on-premise Cloud instance.
* Follow any other requirements specified in the deployment method article you choose.

### Procedure

To deploy a filtering node on-premise:

1. Select a [deployment option](supported-deployment-options.md) from the available choices and adhere to the provided instructions. All options, including in-line and out-of-band (OOB) configurations, support on-premise deployment.

    During the node setup, in the parameters that define the Wallarm Cloud host, specify `api.wallarm.companyname.tld` where `wallarm.companyname.tld` is the domain of the Wallarm Cloud instance you created earlier.
1. Ensure the domain of the running instance resolves to its IP address. For instance, if the domain is configured as `wallarm.node.com`, this domain should point to the instance's IP.

## Testing the deployment

To test the deployment:

1. Run the test Path Traversal attack targeting the filtering node instance:

    ```bash
    curl http://localhost/etc/passwd
    ```
1. Open the deployed Wallarm Console UI and check that the corresponding attack appeared in the attack list.

## Limitations

The following functionalities are currently not supported by the on-premise Wallarm solution:

* [Exposed Asset Scanner](../user-guides/scanner.md)
* [Active Threat Verification](../vulnerability-detection/active-threat-verification/overview.md)
* [API Leaks](../about-wallarm/api-leaks.md)
