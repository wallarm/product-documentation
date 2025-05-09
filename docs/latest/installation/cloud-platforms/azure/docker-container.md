# Deployment of the Wallarm Docker Image to Azure

This quick guide provides the steps to deploy the [Docker image of the NGINX-based Wallarm node](https://hub.docker.com/r/wallarm/node) to the Microsoft Azure cloud platform using the [Azure **Container Instances** service](https://docs.microsoft.com/en-us/azure/container-instances/).

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and node autoscaling. If setting up these components yourself, we recommend that you read the documentation on [Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/overview).

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## Requirements

* Active Azure subscription
* [Azure CLI installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to the IP addresses below for downloading updates to attack detection rules and [API specifications][api-policy-enf-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][graylist-docs] countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"

## Options for the Wallarm node Docker container configuration

--8<-- "../include/waf/installation/docker-running-options.md"

## Deploying the Wallarm node Docker container configured through environment variables

To deploy the containerized Wallarm filtering node configured only through environment variables, you can use the following tools:

* [Azure CLI](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Azure portal](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [Azure PowerShell](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [ARM template](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [Docker CLI](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

In these instructions, the container is deployed using the Azure CLI.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Sign in to the Azure CLI by using the [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) command:

    ```bash
    az login
    ```
1. Create a resource group by using the [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) command. For example, create the group `myResourceGroup` in the East US region with the following command:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Set the local environment variable with the Wallarm node token to be used to connect the instance to the Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Create an Azure resource from the Wallarm node Docker container by using the [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) command:

    === "Command for the Wallarm US Cloud"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.1.0 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Command for the Wallarm EU Cloud"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.1.0 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_LABELS='group=<GROUP>'
         ```
        
    * `--resource-group`: name of the resource group created in the second step.
    * `--name`: name of the container.
    * `--dns-name-label`: DNS name label for the container.
    * `--ports`: port on which the filtering node listens.
    * `--image`: name of the Wallarm node Docker image.
    * `--environment-variables`: environment variables with the filtering node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the value of `WALLARM_API_TOKEN` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. Open the [Azure portal](https://portal.azure.com/) and ensure the created resource is displayed in the list of resources.
1. [Test the filtering node operation](#testing-the-filtering-node-operation).

## Deploying the Wallarm node Docker container configured through the mounted file

To deploy the containerized Wallarm filtering node configured through environment variables and mounted file, only [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) can be used.

To deploy the container with environment variables and mounted configuration file:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Sign in to the Azure CLI by using the [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login) command:

    ```bash
    az login
    ```
1. Create a resource group by using the [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create) command. For example, create the group `myResourceGroup` in the East US region with the following command:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```
1. Create a configuration file with the filtering node settings locally. A example of the file with minimal settings:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #listen 443 ssl;

        server_name localhost;

        #ssl_certificate cert.pem;
        #ssl_certificate_key cert.key;

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        # wallarm_application 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Set of filtering node directives that can be specified in the configuration file →][nginx-waf-directives]
1. Locate the configuration file in one of the ways suitable for mounting data volumes in Azure. All methods are described in the [**Mount data volumes** section of the Azure documentation](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files).

    In these instructions, the configuration file is mounted from the Git repository.
1. Set the local environment variable with the Wallarm node token to be used to connect the instance to the Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Create an Azure resource from the Wallarm node Docker container by using the [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create) command:

    === "Command for the Wallarm US Cloud"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.1.0 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/http.d \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com' WALLARM_LABELS='group=<GROUP>'
         ```
    === "Command for the Wallarm EU Cloud"
         ```bash
         az container create \
            --resource-group myResourceGroup \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:6.1.0 \
            --gitrepo-url <URL_OF_GITREPO> \
            --gitrepo-mount-path /etc/nginx/http.d \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_LABELS='group=<GROUP>'
         ```

    * `--resource-group`: name of the resource group created in the 2nd step.
    * `--name`: name of the container.
    * `--dns-name-label`: DNS name label for the container.
    * `--ports`: port on which the filtering node listens.
    * `--image`: name of the Wallarm node Docker image.
    * `--gitrepo-url`: URL of the Git repository containing the configuration file. If the file is located in the repository root, you need to pass only this parameter. If the file is located in a separate Git repository directory, please also pass the path to the directory in the `--gitrepo-dir` parameter (for example,<br>`--gitrepo-dir ./dir1`).
    * `--gitrepo-mount-path`: directory of the container to mount the configuration file to. Configuration files can be mounted to the following container directories used by NGINX:

        * `/etc/nginx/conf.d` — common settings
        * `/etc/nginx/http.d` — virtual host settings
        * `/var/www/html` — static files

        The filtering node directives should be described in the `/etc/nginx/http.d/default.conf` file.
    
    * `--environment-variables`: environment variables containing settings for the filtering node and Wallarm Cloud connection (available variables are listed in the table below). Please note that it is not recommended to explicitly pass the value of `WALLARM_API_TOKEN`.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. Open the [Azure portal](https://portal.azure.com/) and ensure the created resource is displayed in the list of resources.
1. [Test the filtering node operation](#testing-the-filtering-node-operation).

## Testing the filtering node operation

1. Open the created resource on the Azure portal and copy the **FQDN** value.

    ![Settig up container instance][copy-container-ip-azure-img]

    If the **FQDN** field is empty, please ensure the container is in the **Running** status.

2. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the copied domain:

    ```
    curl http://<COPIED_DOMAIN>/etc/passwd
    ```
3. Open Wallarm Console → **Attacks** in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    ![Attacks in UI][attacks-in-ui-image]
1. Optionally, [test][link-docs-check-operation] other aspects of the node functioning.

Details on errors occurred during the container deployment are displayed on the **Containers** → **Logs** tab of the resource details on the Azure portal. If the resource is unavailable, please ensure required filtering node parameters with correct values are passed to the container.
