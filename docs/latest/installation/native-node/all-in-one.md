[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# Deploying the Native Node with All-in-One Installer

The [Wallarm Native Node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for Wallarm connector self-hosted deployment and TCP traffic mirror analysis. You can run the Native Node on a virtual machine with a Linux OS using the all-in-one installer.

## Use cases and deployment modes

* When deploying a Wallarm node as part of a connector solution for MuleSoft [Mule](../connectors/mulesoft.md) or [Flex](../connectors/mulesoft-flex.md) Gateway, [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md) on a self-hosted Linux OS machine.

    Use the installer in `connector-server` mode.
* When you need a security solution for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md).
    
    Use the installer in `tcp-capture` mode.
* When you need a [gRPC-based external processing filter](../connectors/istio.md) for APIs managed by Istio.
    
    Use the installer in `envoy-external-filter` mode.

## Requirements

The machine intended for running the Native Node with the all-in-one installer must meet the following criteria:

* Linux OS.
* x86_64/ARM64 architecture.
* Executing all commands as a superuser (e.g. `root`).
* Outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* When running the node in the `connector-server` or `envoy_external_filter` mode, a **trusted** SSL/TLS certificate for the machine's domain should be issued and uploaded to the machine along with the private key.
* When running the node in the `tcp-capture` mode:
    
    * Traffic and response mirroring must be configured with both source and target set up, and the prepared instance chosen as a mirror target. Specific environment requirements must be met, such as allowing specific protocols for traffic mirroring configurations.
    * Mirrored traffic is tagged with either VLAN (802.1q), VXLAN, or SPAN.
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## Limitations

* When using the all-in-one installer in `connector-server` or `envoy_external_filter` mode, a **trusted** SSL/TLS certificate is required for the machine's domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Installation

### 1. Prepare Wallarm token

To install node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Node deployment/Deployment` usage type.
1. Copy this token.

### 2. Download Wallarm installer

Download Wallarm installation script and make it executable:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.16.1.x86_64.sh
    chmod +x aio-native-0.16.1.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.16.1.aarch64.sh
    chmod +x aio-native-0.16.1.aarch64.sh
    ```

### 3. Prepare the configuration file

Create the `wallarm-node-conf.yaml` file on the machine with the following minimal configuration:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    In the `connector.tls_cert` and `connector.tls_key`, you specify the paths to a **trusted** certificate and private key issued for the machine's domain.
=== "tcp-capture"
    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: 'enp7s0:'
      extra_args:
        - -input-raw-engine
        - vxlan
    ```

    In the `goreplay.filter` parameter, you specify the network interface to capture traffic from. To check network interfaces available on the host:

    ```
    ip addr show
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

    In the `envoy_external_filter.tls_cert` and `envoy_external_filter.tls_key`, you specify the paths to a **trusted** certificate and private key issued for the machine's domain.

[All configuration parameters](all-in-one-conf.md)

### 4. Run the installer

=== "connector-server"
    For the x86_64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "tcp-capture"
    For the x86_64 installer version:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "envoy-external-filter"
    For the x86_64 installer version:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=envoy-external-filter --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
* `<API_TOKEN>` specifies the generated API token for the `Node deployment/Deployment` usage type.
* `<PATH_TO_CONFIG>` specifies the path to the configuration file prepared before.

The provided configuration file will be copied to the path: `/opt/wallarm/etc/wallarm/go-node.yaml`.

If needed, you can change the copied file after the installation is finished. To apply the changes, you will need to restart the Wallarm service with `sudo systemctl restart wallarm`.

### 5. Finish the installation

=== "connector-server"
    After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

    1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
    1. Follow the platform-specific instructions to apply the bundle on your API management platform:

        * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
        * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
        * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
        * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)
=== "tcp-capture"
    [Proceed to the deployment testing](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution).
=== "envoy-external-filter"
    After deploying the node, the next step is to [update Envoy settings to forward traffic to the node](../connectors/istio.md#2-configure-envoy-to-proxy-traffic-to-the-wallarm-node).

## Verifying the node operation

To verify the node is detecting traffic, you can check the logs:

* The Native Node logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default.
* [Standard logs](../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.
* For additional debugging, set the [`log.level`](all-in-one-conf.md#loglevel) parameter to `debug`.

You can also verify the Node operation by checking its [Prometheus metrics](../../admin-en/native-node-metrics.md) exposed at `http://<NODE_IP>:9000/metrics.`

## Installer launch options

* As soon as you have the all-in one script downloaded, you can get **help** on it with:

    === "x86_64 version"
        ```
        sudo ./aio-native-0.16.1.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aio-native-0.16.1.aarch64.sh -- --help
        ```
* You can also run the installer in an **interactive** mode and choose the required mode in the 1st step:

    === "x86_64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.16.1.aarch64.sh
        ```
* <a name="apid-only-mode"></a>You can use the node in API Discovery-only mode (available since version 0.12.1). In this mode, attacks - including those detected by the Node's built-in mechanisms and those requiring additional configuration (e.g., credential stuffing, API specification violation attempts, and malicious activity from denylisted and graylisted IPs) - are detected and blocked locally (if enabled) but not exported to Wallarm Cloud. Since there is no attack data in the Cloud, [Threat Replay Testing](../../vulnerability-detection/threat-replay-testing/overview.md) does not work. Traffic from whitelisted IPs is allowed.

    Meanwhile, [API Discovery](../../api-discovery/overview.md), [API session tracking](../../api-sessions/overview.md), and [security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) remain fully functional, detecting relevant security entities and uploading them to the Cloud for visualization.

    This mode is for those who want to review their API inventory and identify sensitive data first, and plan controlled attack data export accordingly. However, disabling attack export is rare, as Wallarm securely processes attack data and provides [sensitive attack data masking](../../user-guides/rules/sensitive-data-rule.md) if needed.

    To enable API Discovery-only mode:

    1. Create or modify the `/etc/wallarm-override/env.list` file:

        ```
        sudo mkdir /etc/wallarm-override
        sudo vim /etc/wallarm-override/env.list
        ```

        Add the following variable:

        ```
        WALLARM_APID_ONLY=true
        ```
    
    1. Follow the [node installation procedure](#installation).

    With the API Discovery-only mode enabled, the `/opt/wallarm/var/log/wallarm/wcli-out.log` log returns the following message:

    ```json
    {"level":"info","component":"reqexp","time":"2025-01-31T11:59:38Z","message":"requests export skipped (disabled)"}
    ```

## Upgrade and reinstallation

* To upgrade the node, follow the [instructions](../../updating-migrating/native-node/all-in-one.md).
* If there is a problem with the upgrade or reinstallation process:

    1. Remove the current installation:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Install the node as usual following the installation steps from above.
