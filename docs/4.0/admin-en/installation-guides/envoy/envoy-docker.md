[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list

# Running Docker Envoy‑based image

These instructions describe the steps to run the Wallarm Docker image based on [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4). The image contains all systems required for correct Wallarm node operation:

* Envoy proxy services with embedded Wallarm API Security module
* Tarantool modules for postanalytics
* Other services and scripts

Wallarm API Security module is designed as an Envoy HTTP filter for requests proxying.

!!! warning "Supported configuration parameters"
    Please note that the most [directives](../../configure-parameters-en.md) for the NGINX‑based filtering node configuration are not supported for the Envoy‑based filtering node configuration. See the list of parameters available for the [Envoy‑based filtering node configuration →](../../configuration-guides/envoy/fine-tuning.md)

--8<-- "../include/waf/installation/already-deployed-envoy-docker-image.md"

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Access to `https://api.wallarm.com` if working with EU Wallarm Cloud or `https://us1.api.wallarm.com` if working with US Wallarm Cloud. Please ensure the access is not blocked by a firewall

## Options for running the container

The filtering node configuration parameters can be passed to the `docker run` command in the following ways:

* **In the environment variables**. This option allows for configuration of only basic filtering node parameters, the most [parameters](../../configuration-guides/envoy/fine-tuning.md) cannot be changed through environment variables.
* **In the mounted configuration file**. This option allows for configuration of all the filtering node [parameters](../../configuration-guides/envoy/fine-tuning.md).

## Run the container passing the environment variables

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.0.1-1
        ```
    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.0.1-1
        ```

You can pass the following basic filtering node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Previous variables configuring access to the Wallarm Cloud</p> <p>Before the release of version 4.0, the variables prior to `WALLARM_API_TOKEN` were `DEPLOY_USERNAME` and `DEPLOY_PASSWORD`. Starting from the new release, it is recommended to use the new token-based approach to access the Wallarm Cloud. [More details on migrating to the new node version](/updating-migrating/docker-container/)</p></div> | Yes
`ENVOY_BACKEND` | Domain or IP address of the resource to protect with Wallarm API Security. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originated from [graylisted IP addresses](../../../user-guides/ip-lists/graylist.md)</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`.<br>[Detailed description of filtration modes →](../../configure-wallarm-mode.md) | No
`TARANTOOL_MEMORY_GB` | [Amount of memory](../../configuration-guides/allocate-resources-for-node.md) allocated to Tarantool. The value can be an integer or a float (a dot <code>.</code> is a decimal separator). By default: 0.2 gygabytes. | No

The command does the following:

* Creates the file `envoy.yaml` with minimal Envoy configuration in the `/etc/envoy` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://ENVOY_BACKEND:80`.

## Run the container mounting envoy.yaml

You can mount the prepared file `envoy.yaml` to the Docker container via the `-v` option. The file must contain the following settings:

* Filtering node settings as described in the [instructions](../../configuration-guides/envoy/fine-tuning.md)
* Envoy settings as described in the [Envoy instructions](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

To run the container:

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.0.1-1
        ```
    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.0.1-1
        ```

    * The `-e` option passes the following required environment variables to the container:

    Environment variable | Description| Required
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Previous variables configuring access to the Wallarm Cloud</p> <p>Before the release of version 4.0, the variables prior to `WALLARM_API_TOKEN` were `DEPLOY_USERNAME` and `DEPLOY_PASSWORD`. Starting from the new release, it is recommended to use the new token-based approach to access the Wallarm Cloud. [More details on migrating to the new node version](/updating-migrating/docker-container/)</p></div> | Yes
    `WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No

    * The `-v` option mounts the directory with the configuration file `envoy.yaml` to the `/etc/envoy` container directory.

The command does the following:

* Mounts the file `envoy.yaml` into the `/etc/envoy` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource specified in the mounted configuration file.

## Configuration of log rotation (optional)

The log file rotation is preconfigured and enabled by default. You can adjust the rotation settings if necessary. These settings are located in the `/etc/logrotate.d` directory of the container.

## Testing Wallarm node operation

1. Send the request with test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface](../../../images/admin-guides/test-attacks-quickstart.png)
