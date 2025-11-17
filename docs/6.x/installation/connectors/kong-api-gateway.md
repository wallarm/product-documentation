[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console

# Wallarm Connector for Kong API Gateway

To secure APIs managed by a standalone [Kong API Gateway](https://docs.konghq.com/gateway/latest/) running in Docker, Wallarm provides a connector implemented as a Lua plugin.

By deploying Kong Gateway in Docker and integrating it with the Wallarm filtering node, all incoming requests are analyzed in real time, allowing Wallarm to detect and mitigate malicious traffic before it reaches your services.

The Wallarm connector for Kong API Gateway supports only [synchronous (in-line)](../inline/overview.md) mode.

## Use cases

This solution is recommended for securing APIs managed by a **standalone Kong API Gateway** running in Docker.

It is suitable for environments where Kong is not deployed through Kubernetes (i.e., no Kong Ingress Controller is used). For this case, you can use the connector for the [Kong Ingress Controller](kong-ingress-controller.md).

## Limitations

This setup allows fine-tuning Wallarm only via the Wallarm Console UI. Some Wallarm features that require file-based configuration are not supported in this implementation, such as:

* [Application configuration][applications-docs]
* [Custom blocking page and code setup][custom-blocking-page-docs]

## Requirements

Before deploying the connector, make sure the following requirements are met:

* A running **Kong API Gateway** environment with:

    * Admin API enabled and accessible (typically on port `8001`)
    * Proxy interface exposed to accept client traffic (typically on port `8000`)
* Docker and Docker Compose installed on the host
* Access to `https://us1.api.wallarm.com` (US Wallarm Cloud) or to `https://api.wallarm.com` (EU Wallarm Cloud)
* Access to the IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules, as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md) countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* **Administrator** access to Wallarm Console for [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* A **trusted** SSL/TLS certificate is required for the Node instance domain. Self-signed certificates are not yet supported.

## Deployment

### 1. Deploy a Wallarm Native Node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

You can deploy it either hosted by Wallarm or in your own infrastructure, depending on the level of control you require.

=== "Edge node"
    To deploy a Wallarm-hosted node for the connector, follow the [instructions](../security-edge/se-connector.md).
=== "Self-hosted node"
    Choose an artifact for a self-hosted node deployment and follow the attached instructions:

    * [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
    * [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
    * [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Prepare the Wallarm Lua plugin

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Lua plugin files.
1. Create a working directory and add the plugin code:

    ```bash
    mkdir kong-wallarm
    cd kong-wallarm
    mkdir wallarm-plugin
    ```
1. Place the `handler.lua` and `schema.lua` files provided by Wallarm into the `wallarm-plugin/` directory.

### 3. Build a Kong image with the Wallarm plugin

1. Create a `Dockerfile` in the `kong-wallarm/` directory with the following content:

    ```dockerfile
    FROM kong:latest

    # Copy Wallarm Lua plugin into Kong plugin directory
    COPY . /usr/local/share/lua/5.1/kong/plugins/wallarm-plugin

    # Enable the plugin
    ENV KONG_PLUGINS="bundled,wallarm-plugin"
    ```
1. Your project structure should now look as follows:

    ```
    kong-wallarm/
    ├── Dockerfile
    ├── wallarm-plugin/
    │ ├── handler.lua
    │ └── schema.lua
    ```
1. Build and restart Kong Gateway with the new image (or update your deployment pipeline accordingly):

    ```bash
    docker build -t kong-with-wallarm .
    docker stop kong && docker rm kong
    docker run -d --name kong \
      -p 8000:8000 -p 8001:8001 -p 8443:8443 \
      -e KONG_DATABASE=postgres \
      -e KONG_PG_HOST=db \
      -e KONG_PG_USER=kong \
      -e KONG_PG_PASSWORD=kong \
      -e KONG_PLUGINS="bundled,wallarm-plugin" \
      kong-with-wallarm
    ```

You can also copy the plugin into an existing Kong container and restart it, but rebuilding an image ensures persistence across restarts and upgrades.

### 4. Enable the Wallarm plugin for an existing service

Once Kong is running with the Wallarm plugin included, enable it for one or more of your existing services using the Kong Admin API:

1. Create a configuration file `enable-plugin.json` in the `kong-wallarm/` directory with the following content:

    ```json
    {
      "name": "wallarm-plugin",
      "instance_name": "wallarm-protection",
      "protocols": ["http", "https"],
      "enabled": true,
      "config": {
        "blocking": true,
        "wallarm_node_address": "<WALLARM_NODE_URL>",
        "timeout_ms": 500
      }
    }
    ```
1. Replace the `<WALLARM_NODE_URL>` value with the HTTPS URL of your [Wallarm Node](#1-deploy-a-wallarm-native-node).
1. Attach the plugin to an existing service by its ID or name using [Kong Admin API](https://developer.konghq.com/api/gateway/admin-ee/):

    ```bash
    curl -i -X POST http://localhost:8001/services/<SERVICE_NAME_OR_ID>/plugins \
      -H "Content-Type: application/json" \
      -d "@enable-plugin.json"
    ```

    To get a desired `<SERVICE_NAME_OR_ID>`, use `curl http://localhost:8001/services`.
1. Verify that the plugin is active by listing plugins for the service:

    ```bash
    curl -s http://localhost:8001/services/<SERVICE_NAME_OR_ID>/plugins | jq .
    ```

### 5. (Optional) Enable the plugin globally

To protect all services automatically, you can apply the plugin globally by omitting the service and route parameters:

```bash
curl -i -X POST http://localhost:8001/plugins \
  -H "Content-Type: application/json" \
  -d "@enable-plugin.json"
```

## Testing

To test the functionality of the deployed connector, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API Gateway:

    ```
    curl http://<KONG_API_GATEWAY>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.
    
    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node [mode is set to blocking](../../admin-en/configure-wallarm-mode.md), the request will also be blocked.

## Upgrading the Wallarm Lua plugin

To upgrade the Wallarm Lua plugin:

1. Obtain the updated `handler.lua` and `schema.lua` from support@wallarm.com.
1. Replace the old files in `/usr/local/share/lua/5.1/kong/plugins/wallarm-plugin`.
1. [Rebuild and restart Kong Gateway](#3-build-a-kong-image-with-the-wallarm-plugin).
1. Verify the plugin version via the Kong Admin API:

    ```
    curl -s http://localhost:8001/plugins | grep wallarm-plugin
    ```

## Example: Running Kong Gateway with the Wallarm plugin from scratch

The following example shows how to quickly start Kong API Gateway with the Wallarm Lua plugin on a clean host using Docker Compose.

1. [Deploy a Wallarm Native Node](#1-deploy-a-wallarm-native-node).
1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Lua plugin files.
1. Create the `kong-wallarm` working directory and add the following files:

    ```
    kong-wallarm/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── wallarm-plugin/
    │ ├── handler.lua
    │ └── schema.lua
    └── enable-plugin.json
    ```

    === "`Dockerfile`"
        ```dockerfile
        FROM kong:latest

        # Copy Wallarm Lua plugin
        COPY wallarm-plugin /usr/local/share/lua/5.1/kong/plugins/wallarm-plugin

        # Enable the plugin
        ENV KONG_PLUGINS="bundled,wallarm-plugin"
        ```
    === "`docker-compose.yml`"
        ```yaml
        version: "3.8"
        services:
          db:
            image: postgres:15
            environment:
            POSTGRES_USER: kong
            POSTGRES_DB: kong
            POSTGRES_PASSWORD: kong
          healthcheck:
            test: ["CMD-SHELL", "pg_isready -U kong -d kong"]
            interval: 5s
            timeout: 3s
            retries: 20

          kong:
            build: .
            depends_on:
              db:
                condition: service_healthy
            environment:
              KONG_DATABASE: "postgres"
              KONG_PG_HOST: "db"
              KONG_PG_USER: "kong"
              KONG_PG_PASSWORD: "kong"
              KONG_PG_DATABASE: "kong"
              KONG_ADMIN_LISTEN: "0.0.0.0:8001"
              KONG_PROXY_LISTEN: "0.0.0.0:8000, 0.0.0.0:8443 ssl"
              KONG_LOG_LEVEL: "info"
              KONG_PLUGINS: "bundled,wallarm-plugin"
            ports:
              - "8000:8000"
              - "8001:8001"
              - "8443:8443"
            command: >
              /bin/sh -c "
              kong migrations bootstrap &&
              kong start --vv &&
              tail -f /usr/local/kong/logs/*.log"
        ```
    
    === "`enable-plugin.json`"
        ```json
        {
            "name": "wallarm-plugin",
            "instance_name": "wallarm-protection",
            "protocols": ["http", "https"],
            "enabled": true,
            "config": {
                "blocking": true,
                "wallarm_node_address": "<WALLARM_NODE_URL>",
                "timeout_ms": 500
            }
        }
        ```
    
    The `handler.lua` and `schema.lua` files should be obtained from the Wallarm Support Team.
1. Start the environment:

    ```bash
    docker compose up -d --build
    ```
1. Verify that Kong is running:

    ```bash
    curl -s http://localhost:8001/ | jq .version
    ```
1. Create a test service and route

    ```bash
    curl -i -X POST http://localhost:8001/services \
        --data name=test-service \
        --data url='http://httpbin.org'

    curl -i -X POST http://localhost:8001/services/test-service/routes \
        -H "Content-Type: application/json" \
        -d '{"paths": ["/test"]}'
    ```
1. Enable the Wallarm plugin:

    ```bash
    curl -i -X POST http://localhost:8001/services/test-service/plugins \
        -H "Content-Type: application/json" \
        -d "@enable-plugin.json"
    ```
1. [Test the setup](#testing).
