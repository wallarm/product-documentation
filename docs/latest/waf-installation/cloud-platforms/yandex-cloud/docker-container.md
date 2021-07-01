[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[mount-config-instr]:               #deploying-the-waf-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md

# Deployment of the WAF node Docker image to Yandex.Cloud

This quick guide provides the steps to deploy the [Docker image of the NGINX-based WAF node](https://hub.docker.com/r/wallarm/node) to the Yandex.Cloud platform using the [Yandex Container Solution service](https://cloud.yandex.com/en/docs/cos/).

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and WAF node autoscaling. If setting up these components yourself, we recommend that you read the appropriate [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/operations/instance-groups/create-autoscaled-group).

## Requirements

* Access to the [Yandex.Cloud management console](https://console.cloud.yandex.com/)
* Payment account in the `ACTIVE` or `TRIAL_ACTIVE` status displayed on the [billing page](https://console.cloud.yandex.com/billing)
* Folder created. By default, the folder `default` will be created. To create a new folder, please follow these [instructions](https://cloud.yandex.com/docs/resource-manager/operations/folder/create)
* If you deploy the Docker container with the WAF node configured only through environment variables, [Yandex.Cloud CLI installed and configured](https://cloud.yandex.com/en/docs/cli/quickstart)
* Access to the account with the **Administrator** or **Deploy** role and two‑factor authentication disabled in the Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)

## Options for the WAF node Docker container configuration

--8<-- "../include/waf/installation/docker-running-options.md"

## Deploying the WAF node Docker container configured through environment variables

To deploy the containerized WAF node configured only through environment variables, you can use the [Yandex.Cloud management console or CLI](https://cloud.yandex.com/en/docs/cos/quickstart). In these instructions, Yandex.Cloud CLI is used.

1. Set local environment variables with email and password used for authentication in the Wallarm Cloud:

    ```bash
    export DEPLOY_USER='<DEPLOY_USER>'
    export DEPLOY_PASSWORD='<DEPLOY_PASSWORD>'
    ```

    * `<DEPLOY_USER>`: email to the **Deploy** or **Administrator** user account in the Wallarm Console.
    * `<DEPLOY_PASSWORD>`: password to the **Deploy** or **Administrator** user account in the Wallarm Console.
2. Create the instance with the running Docker container by using the [`yc compute instance create-with-container`](https://cloud.yandex.com/en/docs/cli/cli-ref/managed-services/compute/instance/create-with-container) command:

    === "Command for the Wallarm EU Cloud"
        ```bash
        yc compute instance create-with-container \
            --name <INSTANCE_NAME> \
            --zone=<DEPLOYMENT_ZONE> \
            --public-ip \
            --container-image=wallarm/node:2.18.1-3 \
            --container-env=DEPLOY_USER=${DEPLOY_USER},DEPLOY_PASSWORD=${DEPLOY_PASSWORD},NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WAF>
        ```
    === "Command for the Wallarm US Cloud"
        ```bash
        yc compute instance create-with-container \
            --name <INSTANCE_NAME> \
            --zone=<DEPLOYMENT_ZONE> \
            --public-ip \
            --container-image=wallarm/node:2.18.1-3 \
            --container-env=DEPLOY_USER=${DEPLOY_USER},DEPLOY_PASSWORD=${DEPLOY_PASSWORD},NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WAF>,WALLARM_API_HOST=us1.api.wallarm.com
        ```

    * `--name`: name of the instance, for example: `wallarm-waf`.
    * `--zone`: [zone](https://cloud.yandex.com/en/docs/overview/concepts/geo-scope) that will host the instance.
    * `--public-ip`: if this parameter is passed, the public IP address will be assigned to the instance.
    * `--container-image`: link to the Docker image of the WAF node.
    * `--container-env`: environment variables with the WAF node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the values of `DEPLOY_USER` and `DEPLOY_PASSWORD` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars.md"
    
    * All parameters of the `yc compute instance create-with-container` command are described in the [Yandex.Cloud documentation](https://cloud.yandex.com/en/docs/cli/cli-ref/managed-services/compute/instance/create-with-container).
3. Open the Yandex.Cloud management console → **Compute Cloud** → **Virtual machines** and ensure the instance is displayed in the list.
4. [Test the WAF node operation](#testing-the-waf-node-operation).

## Deploying the WAF node Docker container configured through the mounted file

To deploy the containerized WAF node configured through environment variables and mounted file, you should create the instance, locate the WAF node configuration file in this instance file system and run the Docker container in this instance. You can perform these steps via the [Yandex.Cloud management console](https://cloud.yandex.com/en/docs/compute/quickstart/) or [Yandex.Cloud CLI](https://cloud.yandex.com/en/docs/cli/cli-ref/managed-services/compute/instance/create). In these instructions, Yandex.Cloud CLI is used.

1. Create the instance based on any operating system image following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/quickstart/quick-create-linux). An example of the instance settings:

    ![!Container instance setup](../../../images/waf-installation/yandex-cloud/create-vm.png)
2. Connect to the instance via SSH following the [Yandex.Cloud instructions](https://cloud.yandex.com/en/docs/compute/operations/vm-connect/ssh#vm-connect).
3. Install the Docker packages in the instance following the [instructions for an appropriate operating system](https://docs.docker.com/engine/install/#server).
4. Set instance environment variables with email and password used for authentication in the Wallarm Cloud:

    ```bash
    export DEPLOY_USER='<DEPLOY_USER>'
    export DEPLOY_PASSWORD='<DEPLOY_PASSWORD>'
    ```

    * `<DEPLOY_USER>`: email to the **Deploy** or **Administrator** user account in the Wallarm Console.
    * `<DEPLOY_PASSWORD>`: password to the **Deploy** or **Administrator** user account in the Wallarm Console.
5. In the instance, create the directory with the file `default` containing the WAF node configuration (for example, the directory can be named as `configs`). An example of the file with minimal settings:

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
        # wallarm_instance 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Set of WAF node directives that can be specified in the configuration file →](../../../admin-en/configure-parameters-en.md)
6. Run the WAF node Docker container by using the `docker run` command with passed environment variables and mounted configuration file:

    === "Command for the Wallarm EU Cloud"
        ```bash
        docker run -d -e DEPLOY_USER=${DEPLOY_USER} -e DEPLOY_PASSWORD=${DEPLOY_PASSWORD} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:2.18.1-3
        ```
    === "Command for the Wallarm US Cloud"
        ```bash
        docker run -d -e DEPLOY_USER=${DEPLOY_USER} -e DEPLOY_PASSWORD=${DEPLOY_PASSWORD} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:2.18.1-3
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: path to the configuration file created in the previous step. For example, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: directory of the container to mount the configuration file to. Configuration files can be mounted to the following container directories used by NGINX:

        * `/etc/nginx/conf.d` — common settings
        * `/etc/nginx/sites-enabled` — virtual host settings
        * `/var/www/html` — static files

        The WAF node directives should be described in the `/etc/nginx/sites-enabled/default` file.
    
    * `-p`: port the WAF node listens to. The value should be the same as the instance port.
    * `-e`: environment variables with the WAF node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the values of `DEPLOY_USER` and `DEPLOY_PASSWORD` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount.md"
7. [Test the WAF node operation](#testing-the-waf-node-operation).

## Testing the WAF node operation

1. Open the Yandex.Cloud management console → **Compute Cloud** → **Virtual machines** and copy the instance IP address from the **Public IPv4** column.

    ![!Settig up container instance](../../../images/waf-installation/yandex-cloud/container-copy-ip.png)

    If the IP address is empty, please ensure the instance is in the **Running** status.

2. Send the request with test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the copied address:

    ```
    curl http://<COPIED_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
3. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in UI](../../../images/admin-guides/test-attacks.png)

To view details on errors that occurred during the container deployment, please [connect to the instance via SSH](https://cloud.yandex.com/en/docs/compute/operations/vm-connect/ssh) and review the [container logs](../../../admin-en/configure-logging.md). If the instance is unavailable, please ensure required WAF node parameters with correct values are passed to the container.
