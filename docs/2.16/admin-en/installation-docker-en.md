[doc-ip-blocking]:            configure-ip-blocking-en.md
[doc-wallarm-mode]:           configure-parameters-en.md#wallarm_mode
[doc-config-params]:          configure-parameters-en.md
[doc-monitoring]:             monitoring/intro.md
[waf-mode-instr]:                   configure-wallarm-mode.md
[logging-instr]:                    configure-logging.md
[proxy-balancer-instr]:             using-proxy-or-balancer-en.md
[scanner-whitelisting-instr]:       scanner-ips-whitelisting.md
[process-time-limit-instr]:         configure-parameters-en.md#wallarm_process_time_limit

# Running Docker NGINX‑based image

## Image overview

The WAF node can be deployed as a Docker container. The Docker container is a fat one and contains all subsystems of the WAF node.

The functionality of the WAF node installed inside the Docker container is completely identical to the functionality of the other deployment options.

!!! info "If the Wallarm WAF image is already deployed in your environment"
    If you deploy Wallarm WAF image instead of already deployed image or need to duplicate the deployment, please keep the same WAF version as currently used or update the version of all images to the latest.

    To check the installed version, run the following command in the container:

    ```bash
    apt list wallarm-node
    ```

    * If the version `2.16.x` is installed, follow the current instruction.
    * If the version `2.14.x` is installed, follow the [instructions for 2.14](../../2.14/admin-en/installation-docker-en/) or [update the packages to 2.16](../updating-migrating/docker-container.md) in all deployments.
    * If the version `2.12.x` or lower is installed, please [update the packages to 2.16](../updating-migrating/docker-container.md) in all deployments.

    More information about WAF node versioning is available in the [WAF node versioning policy](../updating-migrating/versioning-policy.md).

## Requirements

* Access to the account with the **Deploy** or **Administrator** role and two‑factor authentication disabled in Wallarm Console in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Access to `https://api.wallarm.com:444` for working with EU Wallarm Cloud or to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud. Please ensure the access is not blocked by a firewall

## Options for running the container

The WAF node configuration parameters can be passed to the `docker run` command in the following ways:

* **In the environment variables**. This option allows to configure only basic WAF node parameters, the most [directives](configure-parameters-en.md) cannot be changed through environment variables.
* **In the mounted configuration file**. This option allows to configure all the WAF node [directives](configure-parameters-en.md).

## Run the container passing the environment variables

You can pass the following basic WAF node settings to the container via the option `-e`:

Environment variable | Description| Required
--- | ---- | ----
`DEPLOY_USER` | Email to the **Deploy** or **Administrator** user account in Wallarm Console.| Yes
`DEPLOY_PASSWORD` | Password to the **Deploy** or **Administrator** user account in Wallarm Console. | Yes
`NGINX_BACKEND` | Domain or IP address of the resource to protect with WAF. | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_MODE` | WAF node mode:<ul><li>`block` to block malicious requests</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul>By default: `monitoring`. | No
`TARANTOOL_MEMORY_GB` | [Amount of memory](configuration-guides/allocate-resources-for-waf-node.md) allocated to Tarantool. By default: 0.2 gygabytes. | No
`WALLARM_ACL_ENABLE` | Enables the [IP blocking functionality](configure-ip-blocking-en.md). By default: `false`. | No 

To run the image, use the command:

=== "EU Cloud"
    ```bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e NGINX_BACKEND="example.com" -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/node:2.16
    ```
=== "US Cloud"
    ```bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e NGINX_BACKEND="example.com" -e WALLARM_API_HOST=us1.api.wallarm.com -e TARANTOOL_MEMORY_GB=16 -p 80:80 wallarm/node:2.16
    ```

The command does the following:

* Automatically creates new WAF node in Wallarm Cloud. Created WAF node will be displayed in Wallarm Console → **Nodes**.
* Creates the file `default` with minimal NGINX configuration and passed WAF node configuration in the `/etc/nginx/sites-enabled` container directory.
* Creates files with WAF node credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
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

    Environment variable | Description| Required
    --- | ---- | ----
    `DEPLOY_USER` | Email to the **Deploy** or **Administrator** user account in Wallarm Console.| Yes
    `DEPLOY_PASSWORD` | Password to the **Deploy** or **Administrator** user account in Wallarm Console. | Yes
    `WALLARM_API_HOST` | Wallarm API server:<ul><li>`api.wallarm.com` for the EU Cloud</li><li>`us1.api.wallarm.com` for the US Cloud</li></ul>By default: `api.wallarm.com`. | No

2. Mount the directory with the configuration file `default` to the `/etc/nginx/sites-enabled` container directory via the `-v` option.

    === "EU Cloud"
        ```bash
        docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:2.16
        ```
    === "US Cloud"
        ```bash
        docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e WALLARM_API_HOST=us1.api.wallarm.com -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:2.16
        ```

The command does the following:

* Automatically creates new WAF node in Wallarm Cloud. Created WAF node will be displayed in Wallarm Console → **Nodes**.
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

1. Send the request with test [SQLI](../attacks-vulns-list.md#sql-injection) and [XSS](../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the WAF node works in the `block` mode, the request will be blocked and the code `403 Forbidden` will be returned.
2. Open Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface](../images/admin-guides/test-attacks.png)

## Configuring the use cases

The configuration file mounted to the Docker container should describe the WAF node configuration in the [available directive](configure-parameters-en.md). Below are some commonly used WAF node configuration optins:

* [Configuration of the filtering mode][waf-mode-instr]
* [Logging WAF node variables][logging-instr]
* [Adding Wallarm Scanner addresses to the whitelist in the `block` filtering mode][scanner-whitelisting-instr]
* [Limiting the single request processing time in the directive `wallarm_process_time_limit`][process-time-limit-instr]
* [Limiting the server reply waiting time in the NGINX directive `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size in the NGINX directive `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)