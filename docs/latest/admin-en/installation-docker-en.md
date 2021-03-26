[doc-ip-blocking]:            configure-ip-blocking-en.md
[doc-wallarm-mode]:           configure-parameters-en.md#wallarm_mode
[doc-config-params]:          configure-parameters-en.md
[doc-monitoring]:             monitoring/intro.md
[waf-mode-instr]:                   configure-wallarm-mode.md
[logging-instr]:                    configure-logging.md
[proxy-balancer-instr]:             using-proxy-or-balancer-en.md
[scanner-whitelisting-instr]:       scanner-ips-whitelisting.md
[process-time-limit-instr]:         configure-parameters-en.md#wallarm_process_time_limit
[default-ip-blocking-settings]:     configure-ip-blocking-nginx-en.md
[wallarm-acl-directive]:            configure-parameters-en.md#wallarm_acl
[allocating-memory-guide]:          configuration-guides/allocate-resources-for-waf-node.md
[enable-libdetection-docs]:         configure-parameters-en.md#wallarm_enable_libdetection

# Running Docker NGINX‑based image

## Image overview

The WAF node can be deployed as a Docker container. The Docker container is fat and contains all subsystems of the WAF node.

The functionality of the WAF node installed inside the Docker container is completely identical to the functionality of the other deployment options.

!!! info "If the Wallarm WAF image is already deployed in your environment"
    If you deploy the Wallarm WAF image instead of the already deployed image or need to duplicate the deployment, please keep the same WAF version as currently used or update the version of all images to the latest.

    To check the installed version, run the following command in the container:

    ```bash
    apt list wallarm-node
    ```

    * If the version `2.18.x` is installed, then follow the current instructions.
    * If the version `2.16.x` is installed, then follow the [instructions for 2.16](../../2.16/admin-en/installation-docker-en/) or [update the packages to 2.18](../updating-migrating/docker-container.md) in all deployments.
    * If the version `2.14.x` or lower is installed, then please [update the packages to 2.18](../updating-migrating/docker-container.md) in all deployments.

    More information about WAF node versioning is available in the [WAF node versioning policy](../updating-migrating/versioning-policy.md).

## Requirements

--8<-- "../include/waf/installation/requirements-docker.md"

## Options for running the container

The WAF node configuration parameters can be passed to the `docker run` command in the following ways:

* **In the environment variables**. This option allows for configuration of only basic WAF node parameters. Most [directives](configure-parameters-en.md) cannot be changed through environment variables.
* **In the mounted configuration file**. This option allows to configure all the WAF node [directives](configure-parameters-en.md).

## Run the container passing the environment variables

You can pass the following basic WAF node settings to the container via the option `-e`:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars.md"

To run the image, use the command:

=== "EU Cloud"
    ```bash
    docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -e NGINX_BACKEND='example.com' -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/node:2.18.1-1
    ```
=== "US Cloud"
    ```bash
    docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/node:2.18.1-1
    ```

The command does the following:

* Automatically creates new WAF node in the Wallarm Cloud. Created WAF node will be displayed in the Wallarm Console → **Nodes**.
* Creates the file `default` with minimal NGINX configuration and passes WAF node configuration in the `/etc/nginx/sites-enabled` container directory.
* Creates files with WAF node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with WAF node UUID and secret key
    * `license.key` with Wallarm license key
* Protects the resource `http://NGINX_BACKEND:80`.

## Run the container mounting the configuration file

You can mount the prepared configuration file to the Docker container via the `-v` option. The file must contain the following settings:

* [WAF node directives](configure-parameters-en.md)
* [NGINX settings](https://nginx.org/en/docs/beginners_guide.html)

??? info "See an example of the mounted file with minimal settings"
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

To run the image:

1. Pass required environment variables to the container via the `-e` option:

    --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount.md"

2. Mount the directory with the configuration file `default` to the `/etc/nginx/sites-enabled` container directory via the `-v` option.

    === "EU Cloud"
        ```bash
        docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:2.18.1-1
        ```
    === "US Cloud"
        ```bash
        docker run -d -e DEPLOY_USER='deploy@example.com' -e DEPLOY_PASSWORD='very_secret' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:2.18.1-1
        ```

The command does the following:

* Automatically creates new WAF node in Wallarm Cloud. Created WAF node will be displayed in the Wallarm Console → **Nodes**.
* Mounts the file `default` into the `/etc/nginx/sites-enabled` container directory.
* Creates files with WAF node credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with WAF node UUID and secret key
    * `license.key` with Wallarm license key
* Protects the resource `http://NGINX_BACKEND:80`.

!!! info "Mounting other configuration files"
    The container directories used by NGINX:

    * `/etc/nginx/conf.d` — common settings
    * `/etc/nginx/sites-enabled` — virtual host settings
    * `/var/www/html` — static files

    If required, you can mount any files to the listed container directories. The WAF node directives should be described in the `/etc/nginx/sites-enabled/default` file.

## Logging configuration

The logging is enabled by default. The log directories are:

* `/var/log/nginx` — NGINX logs
* `/var/log/wallarm` — Wallarm WAF logs

To configure extended logging of the WAF node variables, please use these [instructions](configure-logging.md).

By default, the logs rotate once every 24 hours. To set up the log rotation, change the configuration files in `/etc/logrotate.d/`. Changing the rotation parameters through environment variables is not possible. 

## Monitoring configuration

To monitor the WAF node, there are Nagios‑compatible scripts inside the container. See details in [Monitoring the WAF node][doc-monitoring].

Example of running the scripts:

``` bash
docker exec -it wallarm-node /usr/lib/nagios-plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it wallarm-node /usr/lib/nagios-plugins/check_wallarm_export_delay -w 120 -c 300
```

## Testing WAF node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Configuring the use cases

The configuration file mounted to the Docker container should describe the WAF node configuration in the [available directive](configure-parameters-en.md). Below are some commonly used WAF node configuration options:

--8<-- "../include/waf/installation/common-customization-options-docker-216.md"
