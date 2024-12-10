[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md

# Deploying the Native Node with All-in-One Installer

The [Wallarm Native Node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for Wallarm connector self-hosted deployment and TCP traffic mirror analysis. You can run the Native Node on a virtual machine with a Linux OS using the all-in-one installer.

## Use cases and deployment modes

* When deploying a Wallarm node as part of a connector solution for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md) or [Amazon CloudFront](../connectors/aws-lambda.md) on a self-hosted Linux OS machine.

    Use the installer in `connector-server` mode.
* When you need a security solution for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md).
    
    Use the installer in `tcp-capture` mode.

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
* When running the node in the `connector-server` mode, a **trusted** SSL/TLS certificate for the machine's domain should be issued and uploaded to the machine along with the private key.
* When running the node in the `tcp-capture` mode:
    
    * Traffic and response mirroring must be configured with both source and target set up, and the prepared instance chosen as a mirror target. Specific environment requirements must be met, such as allowing specific protocols for traffic mirroring configurations.
    * Mirrored traffic is tagged with either VLAN (802.1q), VXLAN, or SPAN.
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## Limitations

* When using the all-in-one installer in `connector-server` mode, a **trusted** SSL/TLS certificate is required for the machine's domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Installation

### 1. Prepare Wallarm token

To install node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Deploy` source role.
1. Copy this token.

### 2. Download Wallarm installer

Download Wallarm installation script and make it executable:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.9.1.x86_64.sh
    chmod +x aio-native-0.9.1.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.9.1.aarch64.sh
    chmod +x aio-native-0.9.1.aarch64.sh
    ```

### 3. Prepare the configuration file

Create the `wallarm-node-conf.yaml` file on the machine with the following minimal configuration:

=== "connector-server"
    ```yaml
    version: 2

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    In the `connector.tls_cert` and `connector.tls_key`, you specify the paths to a **trusted** certificate and private key issued for the machine's domain.
=== "tcp-capture"
    ```yaml
    version: 2

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

[All configuration parameters](all-in-one-conf.md)

### 4. Run the installer

=== "connector-server"
    For the x86_64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "tcp-capture"
    For the x86_64 installer version:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
* `<API_TOKEN>` specifies the generated API token for the `Deploy` role.
* `<PATH_TO_CONFIG>` specifies the path to the configuration file prepared before.

The provided configuration file will be copied to the path: `/opt/wallarm/etc/wallarm/go-node.yaml`.

If needed, you can change the copied file after the installation is finished. To apply the changes, you will need to restart the Wallarm service with `sudo systemctl restart wallarm`.

### 5. Finish the installation

=== "connector-server"
    After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

    1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
    1. Follow the platform-specific instructions to apply the bundle on your API management platform:

        * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
        * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
        * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
=== "tcp-capture"
    [Proceed to the deployment testing](../oob/tcp-traffic-mirror/deployment.md#step-5-test-the-solution).

## Verifying the node operation

To verify the node is detecting traffic, you can check the logs:

* The Native Node logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default.
* [Standard logs](../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.

For additional debugging, set the [`log.level`](all-in-one-conf.md#loglevel) parameter to `debug`.

## Installer launch options

* As soon as you have the all-in one script downloaded, you can get **help** on it with:

    === "x86_64 version"
        ```
        sudo ./aio-native-0.9.1.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aio-native-0.9.1.aarch64.sh -- --help
        ```
* You can also run the installer in an **interactive** mode and choose the required mode in the 1st step:

    === "x86_64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.9.1.aarch64.sh
        ```

## Upgrade and reinstallation

* To upgrade the node, follow the [instructions](../../updating-migrating/native-node/all-in-one.md).
* If there is a problem with the upgrade or reinstallation process:

    1. Remove the current installation:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Install the node as usual following the installation steps from above.
