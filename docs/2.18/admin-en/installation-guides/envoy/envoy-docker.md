[versioning-policy]:          ../../../updating-migrating/versioning-policy.md#version-list

# Running Docker Envoy‑based image

These instructions describe the steps to run the Wallarm Docker image based on [Envoy 1.15.0](https://www.envoyproxy.io/docs/envoy/v1.15.0/). The image contains all systems required for correct Wallarm node operation:

* Envoy proxy services with embedded Wallarm API Security module
* Tarantool modules for postanalytics
* Other services and scripts

Wallarm API Security module is designed as an Envoy HTTP filter for requests proxying.

!!! warning "Supported configuration parameters"
    Please note that the most [directives](../../configure-parameters-en.md) for the NGINX‑based filtering node configuration are not supported for the Envoy‑based filtering node configuration. See the list of parameters available for the [Envoy‑based filtering node configuration →](../../configuration-guides/envoy/fine-tuning.md)

--8<-- "../include/waf/installation/already-deployed-envoy-docker-image.md"

## Requirements

* Access to the account with the **Deploy** or **Administrator** role and two‑factor authentication disabled in Wallarm Console in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Access to `https://api.wallarm.com:444` if working with EU Wallarm Cloud or `https://us1.api.wallarm.com:444` if working with US Wallarm Cloud. Please ensure the access is not blocked by a firewall

## Options for running the container

The filtering node configuration parameters can be passed to the `docker run` command in the following ways:

* **In the environment variables**. This option allows for configuration of only basic filtering node parameters, the most [parameters](../../configuration-guides/envoy/fine-tuning.md) cannot be changed through environment variables.
* **In the mounted configuration file**. This option allows for configuration of all the filtering node [parameters](../../configuration-guides/envoy/fine-tuning.md).

## Run the container passing the environment variables

You can pass the following basic filtering node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`DEPLOY_USER` | Email to the **Deploy** or **Administrator** user account in Wallarm Console.| Yes
`DEPLOY_PASSWORD` | Password to the **Deploy** or **Administrator** user account in Wallarm Console. | Yes
`ENVOY_BACKEND` | Domain or IP address of the resource to protect with Wallarm API Security. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`. | No
`TARANTOOL_MEMORY_GB` | [Amount of memory](../../configuration-guides/allocate-resources-for-node.md) allocated to Tarantool. The value can be an integer or a float (a dot <code>.</code> is a decimal separator). By default: 0.2 gygabytes. | No
`WALLARM_ACL_ENABLE` | Enables the [IP blocking functionality](../../configuration-guides/envoy/fine-tuning.md#ip-denylisting-settings) with default settings. Any value can be assigned to a variable to enable the IP blocking functionality. Default value (if the variable is not passed to the container) is `false`.<br><br>To enable the IP blocking functionality with custom settings, you need to define appropriate [parameters](../../configuration-guides/envoy/fine-tuning.md#ip-denylisting-settings) and run the container [mounting](#run-the-container-mounting-envoyyaml) the configuration file with defined directives. | No 
`DEPLOY_FORCE` | Replaces an existing Wallarm node with a new one if an existing Wallarm node name matches the identifier of the container you are running. The following values can be assigned to a variable:<ul><li>`true` to replace the filtering node</li><li>`false` to disable the replacement of the filtering node</li></ul>Default value (if the variable is not passed to the container) is `false`.<br>The Wallarm node name always matches the identifier of the container you are running. Filtering node replacement is helpful if the Docker container identifiers in your environment are static and you are trying to run another Docker container with the filtering node (for example, a container with a new version of the image). If in this case the variable value is `false`, the filtering node creation process will fail. | No

To run the image, use the command:

=== "EU Cloud"
    ```bash
    docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:2.18.1-3
    ```
=== "US Cloud"
    ```bash
    docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:2.18.1-3
    ```

The command does the following:

* Automatically creates new filtering node in the Wallarm Cloud. Created filtering node will be displayed in Wallarm Console → **Nodes**.
* Creates the file `envoy.yaml` with minimal Envoy configuration in the `/etc/envoy` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `license.key` with Wallarm license key
* Protects the resource `http://ENVOY_BACKEND:80`.

## Run the container mounting envoy.yaml

You can mount the prepared file `envoy.yaml` to the Docker container via the `-v` option. The file must contain the following settings:

* Filtering node settings as described in the [instructions](../../configuration-guides/envoy/fine-tuning.md)
* Envoy settings as described in the [Envoy instructions](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

To run the image:

1. Pass required environment variables to the container via the `-e` option:

    Environment variable | Description| Required
    --- | ---- | ----
    `DEPLOY_USER` | Email to the **Deploy** or **Administrator** user account in Wallarm Console.| Yes
    `DEPLOY_PASSWORD` | Password to the **Deploy** or **Administrator** user account in Wallarm Console. | Yes
    `WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
    `DEPLOY_FORCE` | Replaces an existing Wallarm node with a new one if an existing Wallarm node name matches the identifier of the container you are running. The following values can be assigned to a variable:<ul><li>`true` to replace the filtering node</li><li>`false` to disable the replacement of the filtering node</li></ul>Default value (if the variable is not passed to the container) is `false`.<br>The Wallarm node name always matches the identifier of the container you are running. Filtering node replacement is helpful if the Docker container identifiers in your environment are static and you are trying to run another Docker container with the filtering node (for example, a container with a new version of the image). If in this case the variable value is `false`, the filtering node creation process will fail. | No

2. Mount the directory with the configuration file `envoy.yaml` to the `/etc/envoy` container directory via the `-v` option.

    === "EU Cloud"
        ```bash
        docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:2.18.1-3
        ```
    === "US Cloud"
        ```bash
        docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:2.18.1-3
        ```

The command does the following:

* Automatically creates new filtering node in the Wallarm Cloud. Created filtering node will be displayed in Wallarm Console → **Nodes**.
* Mounts the file `envoy.yaml` into the `/etc/envoy` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `license.key` with Wallarm license key
* Protects the resource specified in the mounted configuration file.

## Configuration of log rotation (optional)

The log file rotation is preconfigured and enabled by default. You can adjust the rotation settings if necessary. These settings are located in the `/etc/logrotate.d` directory of the container.

## Testing Wallarm node operation

1. Send the request with test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface](../../../images/admin-guides/test-attacks-quickstart-sqli-xss.png)
