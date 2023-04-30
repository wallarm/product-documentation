[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png

# Running Docker Envoy‑based image

These instructions describe the steps to run the Wallarm Docker image based on [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4). The image contains all systems required for correct Wallarm node operation:

* Envoy proxy services with the embedded Wallarm module
* Tarantool modules for postanalytics
* Other services and scripts

The Wallarm module is designed as an Envoy HTTP filter for requests proxying.

!!! warning "Supported configuration parameters"
    Please note that the most [directives](../../../admin-en/configure-parameters-en.md) for the NGINX‑based filtering node configuration are not supported for the Envoy‑based filtering node configuration. See the list of parameters available for the [Envoy‑based filtering node configuration →](../../../admin-en/configuration-guides/envoy/fine-tuning.md)

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console in the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/) 
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. Please ensure the access is not blocked by a firewall

## Options for running the container

The filtering node configuration parameters can be passed to the `docker run` command in the following ways:

* **In the environment variables**. This option allows for configuration of only basic filtering node parameters, the most [parameters](../../../admin-en/configuration-guides/envoy/fine-tuning.md) cannot be changed through environment variables.
* **In the mounted configuration file**. This option allows for configuration of all the filtering node [parameters](../../../admin-en/configuration-guides/envoy/fine-tuning.md).

## Run the container passing the environment variables

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.6.1-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.6.1-1
        ```

You can pass the following basic filtering node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node or API token.<br><div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You have two options for using one token for several installations:</p> <ul><li>**For all node versions**, you can use one [**node token**](../../../quickstart.md#deploy-the-wallarm-filtering-node) in several installations regardless of the selected [platform](../../../admin-en/supported-platforms.md). It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</li><li>**Starting from node 4.6**, for nodes grouping, you can use one [**API token**](../../../user-guides/settings/api-tokens.md) with the `Deploy` role together with the `WALLARM_LABELS` variable.</li></ul></div> | Yes
`ENVOY_BACKEND` | Domain or IP address of the resource to protect with the Wallarm solution. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originated from [graylisted IP addresses](../../../user-guides/ip-lists/graylist.md)</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`.<br>[Detailed description of filtration modes →](../../../admin-en/configure-wallarm-mode.md) | No
`WALLARM_LABELS` | <p>Available starting from node 4.6. Works only if `WALLARM_API_TOKEN` is set to [API token](../../../user-guides/settings/api-tokens.md) with the `Deploy` role. Allows setting the `group` label for node instance grouping, for example:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...will place node instance into the `<GROUP>` instance group (existing, or, if does not exist, it will be created).</p> | No
`TARANTOOL_MEMORY_GB` | [Amount of memory](../../../admin-en/configuration-guides/allocate-resources-for-node.md) allocated to Tarantool. The value can be an integer or a float (a dot <code>.</code> is a decimal separator). By default: 0.2 gygabytes. | No

The command does the following:

* Creates the file `envoy.yaml` with minimal Envoy configuration in the `/etc/envoy` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://ENVOY_BACKEND:80`.

## Run the container mounting envoy.yaml

You can mount the prepared file `envoy.yaml` to the Docker container via the `-v` option. The file must contain the following settings:

* Filtering node settings as described in the [instructions](../../../admin-en/configuration-guides/envoy/fine-tuning.md)
* Envoy settings as described in the [Envoy instructions](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

To run the container:

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.6.1-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.6.1-1
        ```

    * The `-e` option passes the following required environment variables to the container:

    Environment variable | Description| Required
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You can use one token in several installations regardless of the selected [platform](../../../admin-en/supported-platforms.md). It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</p></div> | Yes
    `WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No

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

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"
