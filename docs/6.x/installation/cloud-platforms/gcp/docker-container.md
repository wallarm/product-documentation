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
[copy-container-ip-gcp-img]:        ../../../images/waf-installation/gcp/container-copy-ip.png
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[api-policy-enf-docs]:              ../../../api-specification-enforcement/overview.md
[filtration-modes]:                 ../../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[api-discovery-docs]:               ../../../api-discovery/overview.md
[sensitive-data-rule]:              ../../../user-guides/rules/sensitive-data-rule.md
[apid-only-mode-details]:           ../../../installation/nginx/all-in-one.md#api-discovery-only-mode
[what-is-new-wstore]:            ../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics
[wstore-metrics]:                    ../../../admin-en/wstore-metrics.md
[wstore-metrics-mount]:             ../../../admin-en/wstore-metrics.md
[link-docs-check-operation]:        ../../../admin-en/uat-checklist-en.md
[wcli-metrics]:                     ../../../admin-en/wcli-metrics.md


# Deployment of the Wallarm Docker Image to GCP

This quick guide provides the steps to deploy the [Docker image of the NGINX-based Wallarm node](https://hub.docker.com/r/wallarm/node) to the Google Cloud Platform using the [component Google Compute Engine (GCE)](https://cloud.google.com/compute).

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and node autoscaling. If setting up these components yourself, we recommend that you read the appropriate [GCP documentation](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling).

## Use cases

--8<-- "../include/waf/installation/cloud-platforms/google-gce-use-cases.md"

## Requirements

* Active GCP account
* [GCP project created](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [Compute Engine API](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d) enabled
* [Google Cloud SDK (gcloud CLI) installed and configured](https://cloud.google.com/sdk/docs/quickstart)
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to the IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications][api-policy-enf-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][graylist-docs] countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"

## Options for the Wallarm node Docker container configuration

--8<-- "../include/waf/installation/docker-running-options.md"

## Deploying the Wallarm node Docker container configured through environment variables

To deploy the containerized Wallarm filtering node configured only through environment variables, you can use the [GCP Console or gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). In these instructions, gcloud CLI is used.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Set the local environment variable with the Wallarm node token to be used to connect the instance to the Wallarm Cloud:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Create the instance with the running Docker container by using the [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container) command:

    === "Command for the Wallarm US Cloud"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:6.9.0
        ```
    === "Command for the Wallarm EU Cloud"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-image registry-1.docker.io/wallarm/node:6.9.0
        ```

    * `<INSTANCE_NAME>`: name of the instance, for example: `wallarm-node`.
    * `--zone`: [zone](https://cloud.google.com/compute/docs/regions-zones) that will host the instance.
    * `--tags`: instance tags. Tags are used to configure the availability of the instance for other resources. In the present case, the tag `http-server` opening port 80 is assigned to the instance.
    * `--container-image`: link to the Docker image of the filtering node.
    * `--container-env`: environment variables with the filtering node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the value of `WALLARM_API_TOKEN` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * All parameters of the `gcloud compute instances create-with-container` command are described in the [GCP documentation](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container).
1. Open the [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) and ensure the instance is displayed in the list.
1. [Test the filtering node operation](#testing-the-filtering-node-operation).

## Deploying the Wallarm node Docker container configured through the mounted file

To deploy the containerized Wallarm filtering node configured through environment variables and mounted file, you should create the instance, locate the filtering node configuration file in this instance file system and run the Docker container in this instance. You can perform these steps via the [GCP Console or gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). In these instructions, gcloud CLI is used.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Create the instance based on any operating system image from the Compute Engine registry by using the [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create) comand:

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
1. Open the [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) and ensure the instance is displayed in the list and is in the **RUNNING** status.
1. Connect to the instance via SSH following the [GCP instructions](https://cloud.google.com/compute/docs/instances/ssh).
1. Install the Docker packages in the instance following the [instrauctions for an appropriate operating system](https://docs.docker.com/engine/install/#server).
1. Set the local environment variable with the Wallarm node token to be used to connect the instance to the Wallarm Cloud:

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
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:6.9.0
        ```
    === "Command for the Wallarm EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:6.9.0
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: path to the configuration file created in the previous step. For example, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: directory of the container to mount the configuration file to. Configuration files can be mounted to the following container directories used by NGINX:

        * `/etc/nginx/conf.d` — common settings
        * `/etc/nginx/http.d` — virtual host settings
        * `/var/www/html` — static files

        The filtering node directives should be described in the `/etc/nginx/http.d/default.conf` file.
    
    * `-p`: port the filtering node listens to. The value should be the same as the instance port.
    * `-e`: environment variables with the filtering node configuration (available variables are listed in the table below). Please note that it is not recommended to pass the value of `WALLARM_API_TOKEN` explicitly.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Test the filtering node operation](#testing-the-filtering-node-operation).

## Testing the filtering node operation

1. Open the [GCP Console → **Compute Engine** → VM instances](https://console.cloud.google.com/compute/instances) and copy the instance IP address from the **External IP** column.

    ![Settig up container instance][copy-container-ip-gcp-img]

    If the IP address is empty, please ensure the instance is in the **RUNNING** status.

2. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the copied address:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Open Wallarm Console → **Attacks** in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    ![Attacks in UI][attacks-in-ui-image]
1. Optionally, [test][link-docs-check-operation] other aspects of the node functioning.

Details on errors that occurred during the container deployment are displayed in the **View logs** instance menu. If the instance is unavailable, please ensure required filtering node parameters with correct values are passed to the container.
