[default-ip-blocking-settings]:     ../../../admin-en/configure-ip-blocking-nginx-en.md
[wallarm-acl-directive]:            ../../../admin-en/configure-parameters-en.md#wallarm_acl
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[mount-config-instr]:               #deploying-the-waf-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md

# Deployment of the WAF node Docker image to GCP

This quick guide provides the steps to deploy the [Docker image of the NGINX-based WAF node](https://hub.docker.com/r/wallarm/node) to the Google Cloud Platform using the [component Google Compute Engine (GCE)](https://cloud.google.com/compute).

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and WAF node autoscaling. If setting up these components yourself, we recommend that you read the appropriate [GCP documentation](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling).

## Requirements

* Active GCP account
* [GCP project created](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d) enabled
* [Google Cloud SDK (gcloud CLI) installed and configured](https://cloud.google.com/sdk/docs/quickstart)
* Access to the account with the **Administrator** or **Deploy** role and two‑factor authentication disabled in the Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)

## Options for the WAF node Docker container configuration

--8<-- "../include/waf/installation/docker-running-options.md"

## Deploying the WAF node Docker container configured through environment variables

To deploy the containerized WAF node configured only through environment variables, you can use the [GCP Console or gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). In these instructions, gcloud CLI is used.

1. Set local environment variables with email and password used for authentication in the Wallarm Cloud:

    ```bash
    export DEPLOY_USER='<DEPLOY_USER>'
    export DEPLOY_PASSWORD='<DEPLOY_PASSWORD>'
    ```

    * `<DEPLOY_USER>`: email to the **Deploy** or **Administrator** user account in the Wallarm Console.
    * `<DEPLOY_PASSWORD>`: password to the **Deploy** or **Administrator** user account in the Wallarm Console.
2. Create the instance with the running Docker container by using the [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) command:

    === "Command for the Wallarm EU Cloud"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env DEPLOY_USER=${DEPLOY_USER} \
            --container-env DEPLOY_PASSWORD=${DEPLOY_PASSWORD} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WAF>
            --container-image registry-1.docker.io/wallarm/node:2.18.1-3
        ```
    === "Command for the Wallarm US Cloud"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env DEPLOY_USER=${DEPLOY_USER} \
            --container-env DEPLOY_PASSWORD=${DEPLOY_PASSWORD} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WAF> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:2.18.1-3
        ```

    * `<INSTANCE_NAME>`: name of the instance, for example: `wallarm-waf`.
    * `--zone`: [zone](https://cloud.google.com/compute/docs/regions-zones) that will host the instance.
    * `--tags`: instance tags. Tags are used to configure the availability of the instance for other resources. In the present case, the tag `http-server` opening port 80 is assigned to the instance.
    * `--container-image`: link to the Docker image of the WAF node.
    * `--container-env`: environment variables with the WAF node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the values of `DEPLOY_USER` and `DEPLOY_PASSWORD` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-218.md"
    
    * All parameters of the `gcloud compute instances create-with-container` command are described in the [GCP documentation](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container).
3. Open the [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) and ensure the instance is displayed in the list.
4. [Test the WAF node operation](#testing-the-waf-node-operation).

## Deploying the WAF node Docker container configured through the mounted file

To deploy the containerized WAF node configured through environment variables and mounted file, you should create the instance, locate the WAF node configuration file in this instance file system and run the Docker container in this instance. You can perform these steps via the [GCP Console or gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). In these instructions, gcloud CLI is used.

1. Create the instace based on any operating system image from the Compute Engine registry by using the [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) comand:

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: name of the instance.
    * `--image`: name of the operating system image from the Compute Engine registry. The created instance will be based on this image and will be used to run the Docker container later. If this parameter is omitted, the instance will be based on the Debian 10 image.
    * `--zone`: [zone](https://cloud.google.com/compute/docs/regions-zones) that will host the instance.
    * `--tags`: instance tags. Tags are used to configure the availability of the instance for other resources. In the present case, the tag `http-server` opening port 80 is assigned to the instance.
    * All parameters of the `gcloud compute instances create` command are described in the [GCP documentation](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create).
2. Open the [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) and ensure the instance is displayed in the list and is in the **RUNNING** status.
3. Connect to the instance via SSH following the [GCP instructions](https://cloud.google.com/compute/docs/instances/ssh).
4. Install the Docker packages in the instance following the [instrauctions for an appropriate operating system](https://docs.docker.com/engine/install/#server).
5. Set instance environment variables with email and password used for authentication in the Wallarm Cloud:

    ```bash
    export DEPLOY_USER='<DEPLOY_USER>'
    export DEPLOY_PASSWORD='<DEPLOY_PASSWORD>'
    ```

    * `<DEPLOY_USER>`: email to the **Deploy** or **Administrator** user account in the Wallarm Console.
    * `<DEPLOY_PASSWORD>`: password to the **Deploy** or **Administrator** user account in the Wallarm Console.
6. In the instance, create the directory with the file `default` containing the WAF node configuration (for example, the directory can be named as `configs`). An example of the file with minimal settings:

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
        # wallarm_acl default;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Set of WAF node directives that can be specified in the configuration file →](../../../admin-en/configure-parameters-en.md)
7. Run the WAF node Docker container by using the `docker run` command with passed environment variables and mounted configuration file:

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
8. [Test the WAF node operation](#testing-the-waf-node-operation).

## Testing the WAF node operation

1. Open the [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) and copy the instance IP address from the **External IP** column.

    ![!Settig up container instance](../../../images/waf-installation/gcp/container-copy-ip.png)

    If the IP address is empty, please ensure the instance is in the **RUNNING** status.

2. Send the request with test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the copied address:

    ```
    curl http://<COPIED_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
3. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in UI](../../../images/admin-guides/test-attacks.png)

Details on errors that occurred during the container deployment are displayed in the **View logs** instance menu. If the instance is unavailable, please ensure required WAF node parameters with correct values are passed to the container.
