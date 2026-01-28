---
search:
  exclude: true
---

[doc-wallarm-mode]:           ../../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../../admin-en/configure-parameters-en.md
[doc-monitoring]:             ../../../../admin-en/monitoring/intro.md
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../../admin-en/configure-parameters-en.md
[mount-config-instr]:               #run-the-container-mounting-the-configuration-file
[graylist-docs]:                    ../../../../user-guides/ip-lists/overview.md
[filtration-modes-docs]:            ../../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../supported-deployment-options.md
[nginx-directives-docs]:            ../../../../admin-en/configure-parameters-en.md
[aws-ecs-docs]:                     ../../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:                     ../../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:             ../../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:                 ../../../cloud-platforms/alibaba-cloud/docker-container.md
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../../../../api-specification-enforcement/overview.md
[filtration-modes]:                 ../../../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[api-discovery-docs]:               ../../../../api-discovery/overview.md
[sensitive-data-rule]:              ../../../../user-guides/rules/sensitive-data-rule.md
[apid-only-mode-details]:           ../../../../installation/nginx/all-in-one.md#api-discovery-only-mode
[inline-docs]:                      ../../../inline/overview.md
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md
[attack-analysis-docs]:             ../../../../user-guides/events/check-attack.md
[limit-export-details]:             ../../../../installation/nginx/all-in-one.md#limited-attack-export

# Running Docker NGINX‑based Image

The Wallarm NGINX-based filtering node can be deployed using a [Docker image](https://hub.docker.com/r/wallarm/node). This node supports both x86_64 and ARM64 architectures, which are automatically identified during installation. This article provides guidance on how to run the node from the Docker image for [inline traffic filtration][inline-docs].

The Docker image is based on Alpine Linux and the NGINX version provided by Alpine. Currently, the latest image uses Alpine Linux version 3.22, which includes NGINX stable 1.28.0.

## Use cases

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Options for running the container

--8<-- "../include/waf/installation/docker-running-options.md"

## Run the container passing the environment variables

To run the container:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Run the container with the node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:5.3.17
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:5.3.17
        ```

You can pass the following basic filtering node settings to the container via the option `-e`:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-5.0.md"

The command does the following:

* Creates the file `default` with minimal NGINX configuration and passes filtering node configuration in the `/etc/nginx/sites-enabled` container directory.
* Creates files with filtering node credentials to access the Wallarm Cloud in the `/opt/wallarm/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://NGINX_BACKEND:80`.

## Run the container mounting the configuration file

You can mount the prepared configuration file to the Docker container via the `-v` option. The file must contain the following settings:

* [Filtering node directives][nginx-directives-docs]
* [NGINX settings](https://nginx.org/en/docs/beginners_guide.html)

To run the container:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Run the container with the node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.17
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.17
        ```

    * The `-e` option passes the following required environment variables to the container:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-5.0.md"
    
    * The `-v` option mounts the directory with the configuration file `default` to the `/etc/nginx/sites-enabled` container directory.

        ??? info "See the example `/etc/nginx/sites-enabled` minimal content"
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

                    location / {
                            
                            proxy_pass http://example.com;
                            include proxy_params;
                    }
            }
            ```

        ??? info "Mounting other configuration files"
            The container directories used by NGINX:

            * `/etc/nginx/nginx.conf` - This is the main NGINX configuration file. If you decide to mount this file, additional steps are necessary for proper Wallarm functionality:

                1. In `nginx.conf`, add the following setting at the top level:

                    ```
                    include /etc/nginx/modules-enabled/*.conf;
                    ```
                1. In `nginx.conf`, add the `wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;` directive in the `http` block. This specifies the path to the configuration file for [API Specification Enforcement][api-policy-enf-docs].
                1. Mount the `wallarm-apifw-loc.conf` file to the specified path. The content should be:

                    ```
                    location ~ ^/wallarm-apifw(.*)$ {
                            wallarm_mode off;
                            proxy_pass http://127.0.0.1:8088$1;
                            error_page 404 431         = @wallarm-apifw-fallback;
                            error_page 500 502 503 504 = @wallarm-apifw-fallback;
                            allow 127.0.0.0/8;
                            deny all;
                    }

                    location @wallarm-apifw-fallback {
                            wallarm_mode off;
                            return 500 "API FW fallback";
                    }
                    ```
                1. Mount the `/etc/nginx/conf.d/wallarm-status.conf` file with the content below. It is crucial not to modify any lines from the provided configuration as this may interfere with the successful upload of node metrics to the Wallarm cloud.

                    ```
                    server {
                      # Port should match the NGINX_PORT variable value
                      listen 127.0.0.8:80;

                      server_name localhost;

                      allow 127.0.0.0/8;
                      deny all;

                      wallarm_mode off;
                      disable_acl "on";
                      wallarm_enable_apifw off;
                      access_log off;

                      location ~/wallarm-status$ {
                        wallarm_status on;
                      }
                    }
                    ```
                1. Within your NGINX configuration file, set up the following configuration for the `/wallarm-status` endpoint:

                    ```
                    location /wallarm-status {
                        # Allowed addresses should match the WALLARM_STATUS_ALLOW variable value
                        allow xxx.xxx.x.xxx;
                        allow yyy.yyy.y.yyy;
                        deny all;
                        wallarm_status on format=prometheus;
                        wallarm_mode off;
                    }
                    ```
            * `/etc/nginx/conf.d` — common settings
            * `/etc/nginx/sites-enabled` — virtual host settings
            * `/opt/wallarm/usr/share/nginx/html` — static files

            If required, you can mount any files to the listed container directories. The filtering node directives should be described in the `/etc/nginx/sites-enabled/default` file.

The command does the following:

* Mounts the file `default` into the `/etc/nginx/sites-enabled` container directory.
* Creates files with filtering node credentials to access Wallarm Cloud in the `/opt/wallarm/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://example.com`.

## Logging configuration

The logging is enabled by default. The log directories are:

* `/var/log/nginx` — NGINX logs
* `/opt/wallarm/var/log/wallarm` — [Wallarm node logs][logging-instr]

## Monitoring configuration

To monitor the filtering node, there are Nagios‑compatible scripts inside the container. See details in [Monitoring the filtering node][doc-monitoring].

Example of running the scripts:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` is the ID of the running Wallarm Docker container. To get the ID, run `docker ps` and copy the proper ID.

## Testing Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Configuring the use cases

The configuration file mounted to the Docker container should describe the filtering node configuration in the [available directive][nginx-directives-docs]. Below are some commonly used filtering node configuration options:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"
