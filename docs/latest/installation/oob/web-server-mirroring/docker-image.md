[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[doc-monitoring]:             ../../../admin-en/monitoring/intro.md
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/overview.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../supported-deployment-options.md
[oob-advantages-limitations]:       ../overview.md#limitations
[web-server-mirroring-examples]:    overview.md#configuration-examples-for-traffic-mirroring
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[aws-ecs-docs]:                     ../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:                     ../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:             ../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:                 ../../cloud-platforms/alibaba-cloud/docker-container.md
[api-policy-enf-docs]:              ../../../api-specification-enforcement/overview.md

# Deploying Wallarm OOB from the Docker Image

This article provides instructions for deploying [Wallarm OOB](overview.md) using the [NGINX-based Docker image](https://hub.docker.com/r/wallarm/node). The solution described here is designed to analyze traffic mirrored by a web or proxy server.

## Use cases

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## 1. Configure traffic mirroring

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 2. Prepare a configuration file for mirrored traffic analysis and more

To enable Wallarm nodes to analyze mirrored traffic, you need to configure additional settings in a separate file and mount it to the Docker container. The default configuration file that needs modification is located at `/etc/nginx/sites-enabled/default` within the Docker image.

In this file, you need to specify the Wallarm node configuration to process mirrored traffic and any other required settings. Follow these instructions to do so:

1. Create the local NGINX configuration file named `default` with the following contents:

    ```
    server {
            listen 80 default_server;
            listen [::]:80 default_server ipv6only=on;
            #listen 443 ssl;

            server_name localhost;

            #ssl_certificate cert.pem;
            #ssl_certificate_key cert.key;

            root /usr/share/nginx/html;

            index index.html index.htm;

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # Change 222.222.222.22 to the address of the mirroring server
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
            real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;

            wallarm_mode monitoring;

            location / {
                    
                    proxy_pass http://example.com;
                    include proxy_params;
            }
    }
    ```

    * The `set_real_ip_from` and `real_ip_header` directives are required to have Wallarm Console [display the IP addresses of the attackers][proxy-balancer-instr].
    * The `wallarm_force_response_*` directives are required to disable analysis of all requests except for copies received from the mirrored traffic.
    * The `wallarm_mode` directive is the traffic analysis [mode][waf-mode-instr]. Since malicious requests [cannot][oob-advantages-limitations] be blocked, the only mode Wallarm accepts is monitoring. For in-line deployment, there are also safe blocking and blocking modes but even if you set the `wallarm_mode` directive to a value different from monitoring, the node continues to monitor traffic and only record malicious traffic (aside from the mode set to off).
1. Specify any other required Wallarm directives. You can refer to the [Wallarm configuration parameters](../../../admin-en/configure-parameters-en.md) documentation and the [configuration use cases](#configuring-the-use-cases) to understand what settings would be useful for you.
1. If needed, modify other NGINX settings to customize its behavior. Consult the [NGINX documentation](https://nginx.org/en/docs/beginners_guide.html) for assistance.

You can also mount other files to the following container directories if necessary:

* `/etc/nginx/conf.d` — common settings
* `/etc/nginx/sites-enabled` — virtual host settings
* `/opt/wallarm/usr/share/nginx/html` — static files

## 3. Get a token to connect the node to the Cloud

Get Wallarm token of the [appropriate type][wallarm-token-types]:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.

=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.

## 4. Run the Docker container with the node

Run the Docker container with the node [mounting](https://docs.docker.com/storage/volumes/) the configuration file you have just created.

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.2.0-1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.2.0-1
    ```

The following environment variables should be passed to the container:

--8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. Testing Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

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

## Configuring the use cases

The configuration file mounted to the Docker container should describe the filtering node configuration in the [available directives](../../../admin-en/configure-parameters-en.md). Below are some commonly used filtering node configuration options:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"
