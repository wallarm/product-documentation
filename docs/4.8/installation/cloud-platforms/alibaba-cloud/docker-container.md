[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[mount-config-instr]:               #deploying-the-wallarm-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/overview.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../installation/supported-deployment-options.md
[copy-container-ip-alibaba-img]:    ../../../images/waf-installation/alibaba-cloud/container-copy-ip.png
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[logging-docs]:                     ../../../admin-en/configure-logging.md

# Deployment of the Wallarm Docker Image to Alibaba Cloud

This quick guide provides the steps to deploy the [Docker image of the NGINX-based Wallarm node](https://hub.docker.com/r/wallarm/node) to the Alibaba Cloud platform using the [Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs).

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and node autoscaling. If setting up these components yourself, we recommend that you read the appropriate [Alibaba Cloud documentation](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka).

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## Requirements

* Access to the [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm)
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)

## Options for the Wallarm node Docker container configuration

--8<-- "../include/waf/installation/docker-running-options.md"

## Deploying the Wallarm node Docker container configured through environment variables

To deploy the containerized Wallarm filtering node configured only through environment variables, you should create the Alibaba Cloud instance and run the Docker container in this instance. You can perform these steps via the Alibaba Cloud Console or [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm). In these instructions, Alibaba Cloud Console is used.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Open the Alibaba Cloud Console → the list of services → **Elastic Compute Service** → **Instances**.
1. Create the instance following the [Alibaba Cloud instructions](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) and the guidelines below:

    * The instance can be based on the image of any operating system.
    * Since the instance should be available for external resources, public IP address or domain should be configured in the instance settings.
    * The instance settings should reflect the [method used to connect to the instance](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Connect to the instance by one of the methods described in the [Alibaba Cloud documentation](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Install the Docker packages in the instance following the [instructions for an appropriate operating system](https://docs.docker.com/engine/install/#server).
1. Set the instance environment variable with the copied Wallarm token to be used to connect the instance to the Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Run the Wallarm node Docker container by using the `docker run` command with passed environment variables and mounted configuration file:

    === "Command for the Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.9-1
        ```
    === "Command for the Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:4.8.9-1
        ```
        
    * `-p`: port the filtering node listens to. The value should be the same as the instance port.
    * `-e`: environment variables with the filtering node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the value of `WALLARM_API_TOKEN` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-4.8.md"
1. [Test the filtering node operation](#testing-the-filtering-node-operation).

## Deploying the Wallarm node Docker container configured through the mounted file

To deploy the containerized Wallarm filtering node configured through environment variables and mounted file, you should create the Alibaba Cloud instance, locate the filtering node configuration file in this instance file system and run the Docker container in this instance. You can perform these steps via the Alibaba Cloud Console or [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm). In these instructions, Alibaba Cloud Console is used.

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. Open the Alibaba Cloud Console → the list of services → **Elastic Compute Service** → **Instances**.
1. Create the instance following the [Alibaba Cloud instructions](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) and the guidelines below:

    * The instance can be based on the image of any operating system.
    * Since the instance should be available for external resources, public IP address or domain should be configured in the instance settings.
    * The instance settings should reflect the [method used to connect to the instance](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Connect to the instance by one of the methods described in the [Alibaba Cloud documentation](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Install the Docker packages in the instance following the [instructions for an appropriate operating system](https://docs.docker.com/engine/install/#server).
1. Set the instance environment variable with the copied Wallarm token to be used to connect the instance to the Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. In the instance, create the directory with the file `default` containing the filtering node configuration (for example, the directory can be named as `configs`). An example of the file with minimal settings:

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
1. Run the Wallarm node Docker container by using the `docker run` command with passed environment variables and mounted configuration file:

    === "Command for the Wallarm US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.9-1
        ```
    === "Command for the Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.9-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: path to the configuration file created in the previous step. For example, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: directory of the container to mount the configuration file to. Configuration files can be mounted to the following container directories used by NGINX:

        * `/etc/nginx/conf.d` — common settings
        * `/etc/nginx/sites-enabled` — virtual host settings
        * `/var/www/html` — static files

        The filtering node directives should be described in the `/etc/nginx/sites-enabled/default` file.
    
    * `-p`: port the filtering node listens to. The value should be the same as the instance port.
    * `-e`: environment variables with the filtering node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the value of `WALLARM_API_TOKEN` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Test the filtering node operation](#testing-the-filtering-node-operation).

## Testing the filtering node operation

1. Open the Alibaba Cloud Console → the list of services → **Elastic Compute Service** → **Instances** and copy the public IP address of the instance from the **IP address** column.

    ![Settig up container instance][copy-container-ip-alibaba-img]

    If the IP address is empty, please ensure the instance is in the **Running** status.

2. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the copied address:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Open Wallarm Console → **Attacks** in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    ![Attacks in UI][attacks-in-ui-image]

To view details on errors that occurred during the container deployment, please [connect to the instance by one of the methods](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) and review the [container logs][logging-docs]. If the instance is unavailable, please ensure required filtering node parameters with correct values are passed to the container.
