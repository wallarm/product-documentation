# Running Docker Envoy‑based image

These instructions describe the steps to run the WAF Docker image based on [Envoy 1.15.0](https://www.envoyproxy.io/docs/envoy/v1.15.0/). The image contains all systems required for correct WAF operation:

* Envoy proxy services with embedded Wallarm WAF module
* Tarantool modules for postanalytics
* Other services and scripts

Wallarm WAF module is designed as an Envoy HTTP filter for requests proxying.

## Running the image with new WAF node

A new WAF node will be automatically registered in Wallarm Cloud when the image is run.

* For **basic** WAF node configuration, it is required to pass environment variables to the Docker container
* For **advanced** WAF node configuration, it is required to pass environment variables and mount the directory with the `envoy.yaml` configuration file to the Docker container

### Basic flow

You can pass the following basic WAF node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`DEPLOY_USER` | Email to the **Deploy** or **Administrator** user account in Wallarm Console.| Yes
`DEPLOY_PASSWORD` | Password to the **Deploy** or **Administrator** user account in Wallarm Console. | Yes
`ENVOY_BACKEND` | Domain or IP address of the resource to protect with WAF. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | WAF node mode:<ul><li>`block` to block malicious requests</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `block`. | No
`TARANTOOL_MEMORY_GB` | [Amount of memory](../../configuration-guides/allocate-resources-for-waf-node.md) allocated to Tarantool. By default: 0.2 gygabytes. | No
`WALLARM_ACL_ENABLE` | Allows to block requests sent from the [blacklisted](../../../user-guides/blacklist.md) IP addresses. By default: `false`. | No 

To run the image, use the command:

=== "EU Cloud"
    ```bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/envoy:2.16
    ```
=== "US Cloud"
    ```bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e ENVOY_BACKEND="example.com" -e WALLARM_API_HOST=us1.api.wallarm.com -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/envoy:2.16
    ```

The command does the following:

* Automatically creates new WAF node in Wallarm Cloud. Created WAF node will be displayed in Wallarm Console → **Nodes**.
* Creates the file `envoy.yaml` with minimal Envoy configuration in the `/etc/envoy` container directory.
* Creates files with WAF node credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with WAF node UUID `uuid` and secret key `secret`
    * `license.key` with Wallarm license key

    Credentials are required to run the image with the existing WAF node.
* Protects the resource `http://ENVOY_BACKEND:80`.

### Advanced flow

You can mount the prepared file `envoy.yaml` to the Docker container via the `-v` option. The file must contain the following settings:

* WAF node settings as described in the [instruction](../../configuration-guides/envoy/fine-tuning.md)
* Envoy settings as described in the [Envoy instructions](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

To run the image with advanced settings:

1. Pass environment variables above to the container via the `-e` option. Please omit `ENVOY_BACKEND` and `WALLARM_MODE`, its values must be specified in the file `envoy.yaml`.
2. Mount the directory with the configuration file `envoy.yaml` to the `/etc/envoy` container directory via the `-v` option.

=== "EU Cloud"
    ```bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=16 -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:2.16
    ```
=== "US Cloud"
    ```bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e ENVOY_BACKEND="example.com" -e WALLARM_API_HOST=us1.api.wallarm.com -e TARANTOOL_MEMORY_GB=16 -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:2.16
    ```

The command does the following:

* Automatically creates new WAF node in Wallarm Cloud. Created WAF node will be displayed in Wallarm Console → **Nodes**.
* Mounts the file `envoy.yaml` into the `/etc/envoy` container directory.
* Creates files with WAF node credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with WAF node UUID `uuid` and secret key `secret`
    * `license.key` with Wallarm license key

    Credentials are required to run the image with the existing WAF node.
* Protects the resource `http://ENVOY_BACKEND:80`.

## Running the image with existing WAF node

To run existing WAF node, you can pass credentials to access Wallarm Cloud received after WAF node creation to the Docker container:

* WAF node UUID `uuid` via the `NODE_UUID` variable or mounting `node.yaml` to the `/etc/wallarm` container directory
* Secret key `secret` via the `NODE_SECRET` variable or mounting `node.yaml` to the `/etc/wallarm` container directory
* Wallarm license key `license.key` mounting the file to the `/etc/wallarm` container directory

Define the WAF node configuration type and follow the appropriate instructions:

* For **basic** WAF node configuration, it is required to pass environment variables and mount `license.key` to the Docker container
* For **advanced** WAF node configuration, it is required to pass environment variables and mount `license.key`, `envoy.yaml` to the Docker container

### Basic flow

You can pass the following basic WAF node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`NODE_UUID` | WAF node UUID (`uuid` from `node.yaml`).| Yes, if `node.yaml` is not mounted
`NODE_SECRET` | WAF node secret key (`secret` from `node.yaml`). | Yes, if `node.yaml` is not mounted
`ENVOY_BACKEND` | Domain or IP address of the resource to protect with WAF. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | WAF node mode:<ul><li>`block` to block malicious requests</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `block`. | No
`TARANTOOL_MEMORY_GB` | [Amount of memory](../../configuration-guides/allocate-resources-for-waf-node.md) allocated to Tarantool. By default: 0.2 gygabytes. | No
`WALLARM_ACL_ENABLE` | Allows to block requests sent from the [blacklisted](../../../user-guides/blacklist.md) IP addresses. By default: `false`. | No 

To run the image, use the command:

=== "EU Cloud"
    ```bash
    docker run -d -e NODE_UUID="some_uuid" -e NODE_SECRET="some_secret" -v /configs/license.key:/etc/wallarm/license.key -e WALLARM_API_HOST=api.wallarm.com -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/envoy:2.16
    ```
=== "US Cloud"
    ```bash
    docker run -d -e NODE_UUID="some_uuid" -e NODE_SECRET="some_secret" -v /configs/license.key:/etc/wallarm/license.key -e WALLARM_API_HOST=us1.api.wallarm.com -e ENVOY_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/envoy:2.16
    ```

The command does the following:

* Runs the WAF node with the specified UUID.
* Creates the file `envoy.yaml` with minimal Envoy configuration in the `/etc/envoy` container directory.
* Duplicates credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with WAF node UUID `uuid` and secret key `secret`
    * `license.key` with Wallarm license key

    Credentials are required to run the image with the existing WAF node.
* Protects the resource `http://ENVOY_BACKEND:80`.

### Advanced flow

You can mount prepared file `envoy.yaml` to the Docker container via the `-v` option. The file must contain the following settings:

* WAF node settings as described in the [instruction](../../configuration-guides/envoy/fine-tuning.md)
* Envoy settings as described in the [Envoy instructions](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview)

To run the image with advanced settings:

1. Pass environment variables above to the container via the `-e` option. Please omit `ENVOY_BACKEND` and `WALLARM_MODE`, its values must be specified in the file `envoy.yaml`.
2. Mount the directory with the configuration file `envoy.yaml` to the `/etc/envoy` container directory via the `-v` option.

=== "EU Cloud"
    ```bash
    docker run -d -e NODE_UUID="some_uuid" -e NODE_SECRET="some_secret" -v /configs/license.key:/etc/wallarm/license.key -e WALLARM_API_HOST=api.wallarm.com -e TARANTOOL_MEMORY_GB=16 -v /configs/envoy.key:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:2.16
    ```
=== "US Cloud"
    ```bash
    docker run -d -e NODE_UUID="some_uuid" -e NODE_SECRET="some_secret" -v /configs/license.key:/etc/wallarm/license.key -e WALLARM_API_HOST=us1.api.wallarm.com -e TARANTOOL_MEMORY_GB=16 -v /configs/envoy.key:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:2.16
    ```

The command does the following:

* Runs the WAF node with the specified UUID.
* Mounts the file `envoy.yaml` into the `/etc/envoy` container directory.
* Duplicates credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with WAF node UUID `uuid` and secret key `secret`
    * `license.key` with Wallarm license key

    Credentials are required to run the image with the existing WAF node.
* Protects the resource `http://ENVOY_BACKEND:80`.

## Configuration of log rotation (optional)

The log file rotation is preconfigured and enabled by default. You can adjust the rotation settings if necessary. These settings are located in the `/etc/logrotate.d` directory of the container.

## Testing WAF node operation

1. Send the request with test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    WAF node will block the request and return the code `403 blocked by wallarm filter`.
2. Open Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface](../../../images/admin-guides/test-attacks.png)
