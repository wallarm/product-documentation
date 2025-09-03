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
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:6.4.1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:6.4.1
        ```

You can pass the following basic filtering node settings to the container via the option `-e`:

--8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"

The command does the following:

* Creates the file `default.conf` with minimal NGINX configuration and passes filtering node configuration in the `/etc/nginx/http.d` container directory.
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
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/http.d/default.conf -p 80:80 wallarm/node:6.4.1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/http.d/default.conf -p 80:80 wallarm/node:6.4.1
        ```

    * The `-e` option passes the following required environment variables to the container:

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * The `-v` option mounts the directory with the configuration file `default.conf` to the `/etc/nginx/http.d` container directory.

        ??? info "See the example `/etc/nginx/http.d/default.conf` minimal content"
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
                    include /etc/nginx/modules/*.conf;
                    ```
                1. In `nginx.conf`, add the `wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;` directive in the `http` block. This specifies the path to the configuration file for [API Specification Enforcement][api-policy-enf-docs].
                1. Mount the `wallarm-apifw-loc.conf` file to the specified path. The content should be:

                    ```
                    location ~ ^/wallarm-apifw(.*)$ {
                            wallarm_mode off;
                            proxy_pass http://127.0.0.1:8088$1;
                            error_page 404 431         = @wallarm-apifw-fallback;
                            error_page 500 502 503 504 = @wallarm-apifw-fallback;
                            allow 127.0.0.8/8;
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
            * `/etc/nginx/http.d` — virtual host settings
            * `/opt/wallarm/usr/share/nginx/html` — static files

            If required, you can mount any files to the listed container directories. The filtering node directives should be described in the `/etc/nginx/http.d/default.conf` file.

The command does the following:

* Mounts the file `default.conf` into the `/etc/nginx/http.d` container directory.
* Creates files with filtering node credentials to access Wallarm Cloud in the `/opt/wallarm/etc/wallarm` container directory:
    * `node.yaml` with filtering node UUID and secret key
    * `private.key` with Wallarm private key
* Protects the resource `http://example.com`.

## Logging configuration

The logging is enabled by default. The log directories are:

* `/var/log/nginx` — NGINX logs
* `/opt/wallarm/var/log/wallarm` — [Wallarm node logs][logging-instr]

## Testing Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Configuring the use cases

The configuration file mounted to the Docker container should describe the filtering node configuration in the [available directive][nginx-directives-docs]. Below are some commonly used filtering node configuration options:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md"
