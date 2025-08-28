[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[ptrav-attack-docs]:                     ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:                   ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:                  ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:                ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[api-token]:                             ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]:  ../connectors/self-hosted-node-conf/helm-chart.md

# Deploying the Native Node from Docker Image

The [Wallarm Native Node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for deployment with some connectors. You can run the Native Node from the official Docker image on your containerized services.

## Use cases

* When deploying a Wallarm node as part of a connector solution for MuleSoft [Mule](../connectors/mulesoft.md) or [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md) on a self-hosted Linux OS machine.

    Use the installer in `connector-server` mode.
* When you need a [gRPC-based external processing filter](../connectors/istio.md) for APIs managed by Istio.
    
    Use the installer in `envoy-external-filter` mode.

The Docker image for the Native Node is ideal if you are already using container orchestration platforms like AWS ECS or other Docker-based environments. The Wallarm node runs as a Docker container within your service, enabling security filtering and traffic inspection for your API management platform.

## Requirements

* [Docker](https://docs.docker.com/engine/install/) installed on your host system
* Inbound access to your containerized environment from your API management platform
* Outbound access from your containerized environment to:

    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* A **trusted** SSL/TLS certificate is required for the load balancer in front of the ECS instance with the Native Node
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console

## Limitations

* Self-signed SSL certificates are not supported for securing the load balancer.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Deployment

### 1. Pull the Docker image

```
docker pull wallarm/node-native-aio:0.17.1
```

### 2. Prepare the configuration file

Create the `wallarm-node-conf.yaml` file with the following minimal configuration for the Native Node:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
    ```
=== "envoy-external-filter"
    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5080"
      tls_cert: "/path/to/cert.crt"
      tls_key: "/path/to/cert.key"
    ```

[All configuration parameters](all-in-one-conf.md) (they are identical for both the Docker image and the Native Node all-in-one installer)

### 3. Prepare Wallarm token

To install node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Node deployment/Deployment` usage type.
1. Copy this token.

### 4. Run the Docker container

To run the Docker image, use the following commands. Mount the `wallarm-node-conf.yaml` file to the container.

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | API token with the `Node deployment/Deployment` usage type. | Yes
`WALLARM_LABELS` | Sets the `group` label for node instance grouping, for example:<br>`WALLARM_LABELS="group=<GROUP>"` will place node instance into the `<GROUP>` instance group (existing, or, if does not exist, it will be created). | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No
`WALLARM_APID_ONLY` (0.12.1 and higher) | In this mode, attacks detected in your traffic are blocked locally by the node (if [enabled](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)) but not exported to Wallarm Cloud. Meanwhile, [API Discovery](../../api-discovery/overview.md) and some other features remain fully functional, detecting your API inventory and uploading it to the Cloud for visualization. This mode is for those who want to review their API inventory and identify sensitive data first, and plan controlled attack data export accordingly. However, disabling attack export is rare, as Wallarm securely processes attack data and provides [sensitive attack data masking](../../user-guides/rules/sensitive-data-rule.md) if needed. [More details](../../installation/native-node/all-in-one.md#apid-only-mode)<br>By default: `false`. | No

* The `-p` option maps host and container ports:

    * The first value (`80`) is the host's port, exposed to external traffic.
    * The second value (`5050`) is the container's port, which should match the `connector.address` or `envoy_external_filter.address` setting in the `wallarm-node-conf.yaml` file.
* The configuration file must be mounted as `/opt/wallarm/etc/wallarm/go-node.yaml` inside the container.

### 5. Apply Wallarm code to an API management service

After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
1. Follow the platform-specific instructions to apply the bundle on your API management platform:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Envoy/Istio](../connectors/istio.md)
    * [IBM DataPower](../connectors/ibm-api-connect.md)

## Verifying the node operation

To verify the node is detecting traffic, you can check the logs:

* The Native Node logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default, with additional output available in stdout.
* [Standard logs](../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.
* For additional debugging, set the [`log.level`](all-in-one-conf.md#loglevel) parameter to `debug`.

You can also verify the Node operation by checking its [Prometheus metrics](../../admin-en/native-node-metrics.md) exposed at `http://<NODE_IP>:9000/metrics.`

## Upgrade

To upgrade the node, follow the [instructions](../../updating-migrating/native-node/docker-image.md).
