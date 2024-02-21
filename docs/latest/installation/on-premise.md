# Wallarm On-premise Deployment (Pre-Release)

Wallarm offers a pre-release version of its on-premise solution designed for partners, large enterprises, and any organization looking for a comprehensive on-premise security system. This offering allows for the integration of Wallarm's security infrastructure directly into their own environments. The article provides information on how to access and make use of this offering.

!!! info "Contact for any inquiries"
    As the solution is in pre-release, please contact [Wallarm's sales team](mailto:sales@wallarm.com) for any questions or requests regarding on-premise deployment.

The Wallarm architecture is built around [two main components](../about-wallarm/overview.md#how-wallarm-works):

* Filtering node: Deployed within your infrastructure, allowing for flexible deployment options to suit your needs.
* Wallarm Cloud: Traditionally hosted externally by Wallarm. In the on-premise deployment model, we offer a method for deploying Wallarm Cloud within your own infrastructure. This approach necessitates organizing the entire infrastructure due to the comprehensive nature of the service deployment. We simplify this process by providing a script that automatically initiates all required services.

![On-premise deployment](../images/waf-installation/on-premise.png)

## Deploying Wallarm Cloud on-premise

For on-premise deployment, you need to deploy the Wallarm Cloud on your infrastructure. Wallarm simplifies this process by providing a script that deploys all required Cloud services in a couple steps, including both the backend and frontend components (Wallarm Console UI).

### Requirements

To deploy Wallarm Cloud, prepare a compute instance meeting these criteria:

* Ubuntu 22.04 LTS or RedHat 9.x with vim and minimal additional software installed.
* At least 16 physical CPU cores, 48 GB RAM, and 300 GB of SSD disk space on the root partition, without additional mounts. For production environments, 500 GB of SSD space is recommended.
* A 3-5 level DNS wildcard for the service, such as `*.wallarm.on-prem.com`.
* The domain secured with an SSL/TLS certificate that has been independently acquired and signed by a recognized Certificate Authority (CA).
* Allowed outgoing connections to Wallarm's IP (provided during integration) for downloading packages and other data from Wallarm.

### Procedure

To deploy Wallarm Cloud on-premise:

1. Contact our [sales team](mailto:sales@wallarm.com?subject=Wallarm%20on-premise%20deployment&body=Dear%20Wallarm%20Sales%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20deploying%20the%20Wallarm%20platform%20on-premise.%20Could%20you%20please%20provide%20me%20with%20the%20necessary%20scripts%20for%20deployment%2C%20detailed%20information%20on%20the%20appropriate%20subscription%20plans%2C%20and%20comprehensive%20instructions%3F) to obtain the deployment script for the Cloud services, the corresponding instructions, and the initial credentials.
1. Execute the received script to deploy the solution components.
1. Ensure the domain of the running instance resolves to its IP address. For instance, if the domain is configured as `my.wallarm.on-prem.com`, this domain should point to the instance's IP.

## Deploying Wallarm filtering node

The deployment process for the on-premise Wallarm filtering node is similar to standard filtering node deployment procedures. Choose a deployment option that suits your needs and infrastructure and follow our guides, considering the specific requirements for your selected deployment method.

### Requirements

To deploy a filtering node, prepare a compute instance meeting these criteria:

* Access to external resources necessary for downloading deployment artifacts. This includes access to DockerHub, Wallarm-hosted resources, etc., with specifics provided in the deployment guides.
* NGINX artifacts access required if deploying the node as an NGINX module or in any setup that involves NGINX installation on the instance.
* Sufficient CPU, memory, and storage to support node operation, tailored to your traffic volume. Refer to the general resource allocation recommendations provided [here](../admin-en/configuration-guides/allocate-resources-for-node.md).
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
