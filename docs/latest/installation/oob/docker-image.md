# WIP: Deploying Wallarm Docker image OOB for NGINX stable

This article instructs you on deploying Wallarm from Docker image to analyze traffic mirrored by NGINX stable.

<!-- Where to deploy Docker image??? -->

## Configure NGINX to mirror the traffic

For NGINX to mirror the traffic:

1. Configure the [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) module by setting the `mirror` directive in the `location` or `server` block.

    The example below will mirror requests received at `location /` to `location /mirror-test`.
1. To send the mirrored traffic to the Wallarm node, list the headers to be mirrored and specify the IP address of the machine with the node in the `location` the `mirror` directive points.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

<!-- 
1. where to configure?
1. how to mention load balancing???
 -->

## Run the Wallarm Docker container

You can mount the prepared configuration file to the Docker container via the `-v` option. The file must contain the following settings:

* [Filtering node directives](../../admin-en/configure-parameters-en.md)

* [NGINX settings](https://nginx.org/en/docs/beginners_guide.html)

To run the container:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Run the container with the node:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.4.3-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.4.3-1
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

<!-- ## Logging configuration

The logging is enabled by default. The log directories are:

* `/var/log/nginx` — NGINX logs
* `/var/log/wallarm` — Wallarm node logs

To configure extended logging of the filtering node variables, please use these [instructions](configure-logging.md).

By default, the logs rotate once every 24 hours. To set up the log rotation, change the configuration files in `/etc/logrotate.d/`. Changing the rotation parameters through environment variables is not possible.  -->

## Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

<!-- ## Configuring the use cases

The configuration file mounted to the Docker container should describe the filtering node configuration in the [available directive](../../admin-en/configure-parameters-en.md). Below are some commonly used filtering node configuration options:

--8<-- "../include/waf/installation/common-customization-options-docker-4.4.md" -->
