[doc-wallarm-mode]:           configure-parameters-en.md#wallarm_mode
[doc-config-params]:          configure-parameters-en.md
[doc-monitoring]:             monitoring/intro.md
[waf-mode-instr]:                   configure-wallarm-mode.md
[logging-instr]:                    configure-logging.md
[proxy-balancer-instr]:             using-proxy-or-balancer-en.md
[process-time-limit-instr]:         configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          configuration-guides/allocate-resources-for-waf-node.md
[enable-libdetection-docs]:         configure-parameters-en.md#wallarm_enable_libdetection
[nginx-waf-directives]:             configure-parameters-en.md
[mount-config-instr]:               #run-the-container-mounting-the-configuration-file
[greylist-docs]:                    ../user-guides/ip-lists/greylist.md
[filtration-modes-docs]:            configure-wallarm-mode.md
[application-configuration]:        ../user-guides/settings/applications.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png
[about-sidecar-container]:          installation-guides/kubernetes/wallarm-sidecar-container.md
[versioning-policy]:                ../updating-migrating/versioning-policy.md#version-list

# Running Docker NGINX‑based image

## Image overview

The Wallarm filtering node can be deployed as a Docker container. The Docker container is fat and contains all subsystems of the filtering node.

The functionality of the filtering node installed inside the Docker container is completely identical to the functionality of the other deployment options.

--8<-- "../include/waf/installation/already-deployed-nginx-docker-image.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## Options for running the container

--8<-- "../include/waf/installation/docker-running-options.md"

## Run the container passing the environment variables

To run the container:

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

    === "EU Cloud"
        ```bash
        docker run -d -e DEPLOY_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:3.6.2-1
        ```
    === "US Cloud"
        ```bash
        docker run -d -e DEPLOY_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:3.6.2-1
        ```

You can pass the following basic filtering node settings to the container via the option `-e`:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

The command does the following:

* Creates the file `default` with minimal NGINX configuration and passes filtering node configuration in the `/etc/nginx/sites-enabled` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://NGINX_BACKEND:80`.

## Run the container mounting the configuration file

You can mount the prepared configuration file to the Docker container via the `-v` option. The file must contain the following settings:

* [Filtering node directives](configure-parameters-en.md)
* [NGINX settings](https://nginx.org/en/docs/beginners_guide.html)

To run the container:

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the container with the created node:

    === "EU Cloud"
        ```bash
        docker run -d -e DEPLOY_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:3.6.2-1
        ```
    === "US Cloud"
        ```bash
        docker run -d -e DEPLOY_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:3.6.2-1
        ```

    * The `-e` option passes the following required environment variables to the container:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * The `-v` option mounts the directory with the configuration file `default` to the `/etc/nginx/sites-enabled` container directory.

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
                # wallarm_application 1;

                location / {
                        proxy_pass http://example.com;
                        include proxy_params;
                }
            }
            ```

        !!! info "Mounting other configuration files"
            The container directories used by NGINX:

            * `/etc/nginx/conf.d` — common settings
            * `/etc/nginx/sites-enabled` — virtual host settings
            * `/var/www/html` — static files

            If required, you can mount any files to the listed container directories. The filtering node directives should be described in the `/etc/nginx/sites-enabled/default` file.

The command does the following:

* Mounts the file `default` into the `/etc/nginx/sites-enabled` container directory.
* Creates files with filtering node credentials to access Wallarm Cloud in the `/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://example.com`.

## Logging configuration

The logging is enabled by default. The log directories are:

* `/var/log/nginx` — NGINX logs
* `/var/log/wallarm` — Wallarm node logs

To configure extended logging of the filtering node variables, please use these [instructions](configure-logging.md).

By default, the logs rotate once every 24 hours. To set up the log rotation, change the configuration files in `/etc/logrotate.d/`. Changing the rotation parameters through environment variables is not possible. 

## Monitoring configuration

To monitor the filtering node, there are Nagios‑compatible scripts inside the container. See details in [Monitoring the filtering node][doc-monitoring].

Example of running the scripts:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios-plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios-plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` is the ID of the running Wallarm Docker container. To get the ID, run `docker ps` and copy the proper ID.

## Testing Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Configuring the use cases

The configuration file mounted to the Docker container should describe the filtering node configuration in the [available directive](configure-parameters-en.md). Below are some commonly used filtering node configuration options:

--8<-- "../include/waf/installation/common-customization-options-docker.md"
