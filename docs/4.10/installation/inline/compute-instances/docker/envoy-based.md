---
search:
  exclude: true
---

[versioning-policy]:                ../../../../../updating-migrating/versioning-policy.md#version-list
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-directives-docs]:            ../../../../admin-en/configure-parameters-en.md
[docker-envoy-configuration-docs]:  ../../../../admin-en/configuration-guides/envoy/fine-tuning.md
[graylist-docs]:                    ../../../../user-guides/ip-lists/overview.md
[wallarm-mode-docs]:                ../../../../admin-en/configure-wallarm-mode.md
[api-tokens-docs]:                  ../../../../user-guides/settings/api-tokens.md
[allocate-resources-for-wallarm-docs]: ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[supported-deployments]:            ../../../../installation/supported-deployment-options.md
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[rate-limit-docs]:                  ../../../../user-guides/rules/rate-limiting.md
[cred-stuffing-docs]:               ../../../../about-wallarm/credential-stuffing.md
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# Running Docker Envoy‑based Image

These instructions describe the steps to run the Wallarm Docker image based on [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4). The image contains all systems required for correct Wallarm node operation:

* Envoy proxy services with the embedded Wallarm module
* Tarantool modules for postanalytics
* Other services and scripts

The Wallarm module is designed as an Envoy HTTP filter for requests proxying.

!!! warning "Supported configuration parameters"
    Please note that the most [directives][nginx-directives-docs] for the NGINX‑based filtering node configuration are not supported for the Envoy‑based filtering node configuration. Consequently, [rate limiting][rate-limit-docs] and [credential stuffing detection][cred-stuffing-docs] is not available in this deployment method.
    
    See the list of parameters available for the [Envoy‑based filtering node configuration →][docker-envoy-configuration-docs]

## Use cases

--8<-- "../include/waf/installation/docker-images/envoy-based-use-cases.md"

## Requirements

--8<-- "../include/waf/installation/docker-images/envoy-requirements.md"

## Options for running the container

The filtering node configuration parameters can be passed to the `docker run` command in the following ways:

* **In the environment variables**. This option allows for configuration of only basic filtering node parameters, the most [parameters][docker-envoy-configuration-docs] cannot be changed through environment variables.
* **In the mounted configuration file**. This option allows for configuration of all the filtering node [parameters][docker-envoy-configuration-docs].

## Run the container passing the environment variables

To run the container:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Run the container with the node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

You can pass the following basic filtering node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node or API token. | Yes
`ENVOY_BACKEND` | Domain or IP address of the resource to protect with the Wallarm solution. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originated from [graylisted IP addresses][graylist-docs]</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`.<br>[Detailed description of filtration modes →][wallarm-mode-docs] | No
`WALLARM_LABELS` | <p>Available starting from node 4.6. Works only if `WALLARM_API_TOKEN` is set to [API token][api-tokens-docs] with the `Deploy` role. Sets the `group` label for node instance grouping, for example:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...will place node instance into the `<GROUP>` instance group (existing, or, if does not exist, it will be created).</p> | Yes (for API tokens)
`TARANTOOL_MEMORY_GB` | [Amount of memory][allocate-resources-for-wallarm-docs] allocated to Tarantool. The value can be an integer or a float (a dot <code>.</code> is a decimal separator). By default: 0.2 gygabytes. | No

The command does the following:

* Creates the file `envoy.yaml` with minimal Envoy configuration in the `/etc/envoy` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://ENVOY_BACKEND:80`.

## Run the container mounting envoy.yaml

You can mount the prepared file `envoy.yaml` to the Docker container via the `-v` option. The file must contain the following settings:

* Filtering node settings as described in the [instructions][docker-envoy-configuration-docs]
* Envoy settings as described in the [Envoy instructions](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

To run the container:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Run the container with the node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * The `-e` option passes the following required environment variables to the container:

    Environment variable | Description| Required
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You can use one token in several installations regardless of the selected [platform][supported-deployments]. It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</p></div> | Yes
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
