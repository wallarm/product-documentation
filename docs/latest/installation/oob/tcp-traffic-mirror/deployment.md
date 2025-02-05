# Deploying the Node for TCP Traffic Mirror Analysis

Wallarm provides an artifact for deploying its filtering node, specifically designed for TCP traffic mirror analysis. This guide explains how to deploy and configure the Wallarm filtering node in this form-factor.

## Use cases

Among all supported [out-of-band deployment options](../../supported-deployment-options.md#out-of-band), this solution is recommended for the following scenarios:

* You prefer to capture TCP traffic mirrored at the network layer and require a security solution to analyze this specific traffic.
* NGINX or Envoy-based deployment artifacts are unavailable, too slow, or consume too many resources. In this case, implementing HTTP traffic mirror analysis can be resource-intensive. The TCP traffic mirror analysis runs independently from web servers, avoiding these issues.
* You require a security solution that also parses responses, enabling features like [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) and [API discovery](../../../api-discovery/overview.md), which rely on response data.

## How does it work

This solution operates in out-of-band (OOB) mode, capturing mirrored TCP traffic directly from the network interface, independent of web servers like NGINX. The captured traffic is then parsed, reassembled, and analyzed for threats.

It functions as a mirror target, seamlessly switching between multiple traffic sources. The solution supports traffic tagged with VLAN (802.1q), VXLAN, or SPAN.

Additionally, the solution enables response mirror parsing, providing Wallarm features that rely on response data. These features include [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md), [API discovery](../../../api-discovery/overview.md) and more.

![!TCP traffic mirror scheme](../../../images/waf-installation/oob/tcp-mirror-analysis.png)

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* The machine intended for running the node must meet the following criteria:

    * Linux OS
    * x86_64/ARM64 architecture
    * Executing all commands as a superuser (e.g. `root`).
    * Allowed outgoing connections to `https://meganode.wallarm.com` to download the Wallarm installer
    * Allowed outgoing connections to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
    * Allowed outgoing connections to the IP addresses below for downloading updates to attack detection rules and [API specifications](../../../api-specification-enforcement/overview.md), as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../../../user-guides/ip-lists/overview.md) countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* Traffic and response mirroring must be configured with both source and target set up, and the prepared instance chosen as a mirror target. Specific environment requirements must be met, such as allowing specific protocols for traffic mirroring configurations.
* Mirrored traffic is tagged with either VLAN (802.1q), VXLAN, or SPAN. 

## Step 1: Prepare Wallarm token

To install node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Deploy` source role.
1. Copy this token.

## Step 2: Download Wallarm installer

Wallarm suggests installations for the following processors:

* x86_64
* ARM64

To download Wallarm installation script and make it executable, use the following commands:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.12.0.x86_64.sh
    chmod +x aio-native-0.12.0.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.12.0.aarch64.sh
    chmod +x aio-native-0.12.0.aarch64.sh
    ```

## Step 3: Prepare the configuration file

Create the `wallarm-node-conf.yaml` file on the instance. The solution requires proper configuration to identify the network interface and the traffic format (e.g., VLAN, VXLAN). The example content of the file:

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: 'enp7s0:'
  extra_args:
      - -input-raw-engine
      - vxlan
```

In the [article](../../native-node/all-in-one-conf.md), you will find the list of more supported configuration parameters.

### Setting the mode (required)

It is required to specify the `tcp-capture` mode in the corresponding parameter to run the solution for the TCP traffic mirror analysis.

### Choosing a network interface for listening

To specify the network interface to capture traffic from:

1. Check network interfaces available on the host:

    ```
    ip addr show
    ```

1. Specify the network interface in the `filter` parameter.

    Note that the value should be the network interface and port separated by a colon (`:`). Examples of filters include `eth0:`, `eth0:80`, or `:80` (to intercept a specific port on all interfaces), e.g.:

    ```yaml
    version: 3

    mode: tcp-capture

    goreplay:
      filter: 'eth0:'
    ```

### Capturing VLAN

If mirrored traffic is wrapped in VLAN, provide additional arguments:

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-vlan
    - -input-raw-vlan-vid
    # VID of your VLAN, e.g.:
    # - 42
```

### Capturing VXLAN

If mirrored traffic is wrapped in VXLAN (common in AWS), provide additional arguments:

```yaml
version: 3

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan
    # Custom VXLAN UDP port, e.g.:
    # - -input-raw-vxlan-port 
    # - 4789
    # Specific VNI (by default, all VNIs are captured), e.g.:
    # - -input-raw-vxlan-vni
    # - 1
```

### Identifying the original client IP address

By default, Wallarm reads the source IP address from the network packet's IP headers. However, proxies and load balancers can change this to their own IPs.

To preserve the real client IP, these intermediaries often add an HTTP header (e.g., `X-Real-IP`, `X-Forwarded-For`). The `real_ip_header` parameter tells Wallarm which header to use to extract the original client IP, e.g.:

```yaml
version: 3

mode: tcp-capture

http_inspector:
  real_ip_header: "X-Real-IP"
```

## Step 4: Run the Wallarm installer

To install the Wallarm node for TCP traffic mirror analysis, run the following command:

=== "x86_64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.12.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.12.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "ARM64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.12.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.12.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
* `<API_TOKEN>` specifies the generated API token for the `Deploy` role.
* `<PATH_TO_CONFIG>` specifies the path to the configuration file prepared before.

The provided configuration file will be copied to the path: `/opt/wallarm/etc/wallarm/go-node.yaml`.

If needed, you can change the copied file after the installation is finished. To apply the changes, you will need to restart the Wallarm service with `sudo systemctl restart wallarm`.

## Step 5: Test the solution

Send the test [Path Traversal](../../../attacks-vulns-list.md#path-traversal) attack to the mirror source address by replacing `<MIRROR_SOURCE_ADDRESS>` with the actual IP address or DNS name of the instance:

```
curl http://<MIRROR_SOURCE_ADDRESS>/etc/passwd
```

Since the Wallarm solution for TCP traffic mirror analysis operates out-of-band, it does not block attacks but only registers them.

To check that the attack has been registered, proceed to Wallarm Console → **Events**:

![!Attacks in the interface](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## Verifying the node operation

* To check if there is traffic on the network interface you are trying to capture from, run the following command on your machine:

    ```
    sudo tcpdump -i <INTERFACE_NAME>
    ```
* To verify the node is detecting traffic, you can check the logs:

    * The Native Node logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default.
    * [Standard logs](../../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.

For additional debugging, set the [`log.level`](../../native-node/all-in-one-conf.md#loglevel) parameter to `debug`.

## Installer launch options

* As soon as you have the all-in one script downloaded, you can get **help** on it with:

    === "x86_64 version"
        ```
        sudo ./aio-native-0.12.0.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aio-native-0.12.0.aarch64.sh -- --help
        ```
* You can also run the installer in an **interactive** mode and choose the `tcp-capture` mode in the 1st step:

    === "x86_64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.12.0.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.12.0.aarch64.sh
        ```
* You can use the node in API Discovery-only mode (available since version 0.12.0). In this mode, attacks - including those detected by the Node's built-in mechanisms and those requiring additional configuration (e.g., credential stuffing, API specification violation attempts and brute force) - are detected and [logged](../../../admin-en/configure-logging.md) locally but not exported to Wallarm Cloud. Since there is no attack data in the Cloud, [Threat Replay Testing](../../../vulnerability-detection/threat-replay-testing/overview.md) does not work.

    Meanwhile, [API Discovery](../../../api-discovery/overview.md), [API session tracking](../../../api-sessions/overview.md), and [security vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) remain fully functional, detecting relevant security entities and uploading them to the Cloud for visualization.

    This mode is for those who want to review their API inventory and identify sensitive data first, and plan controlled attack data export accordingly. However, disabling attack export is rare, as Wallarm securely processes attack data and provides [sensitive attack data masking](../../../user-guides/rules/sensitive-data-rule.md) if needed.

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
    
    1. Follow the [node installation procedure from the 1st step](#step-1-prepare-wallarm-token).

## Upgrade and reinstallation

* To upgrade the node, follow the [instructions](../../../updating-migrating/native-node/all-in-one.md).
* If there is a problem with the upgrade or reinstallation process:

    1. Remove the current installation:

        ```
        sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
        ```
    
    1. Install the node as usual following the installation steps from above.

## Limitations

* Due to its out-of-band (OOB) operation, which analyzes traffic independently from actual flow, the solution has several inherent limitations:

    * It does not instantly block malicious requests. Wallarm only observes attacks and provides you with the [details in Wallarm Console](../../../user-guides/events/check-attack.md).
    * [Rate limiting](../../../user-guides/rules/rate-limiting.md) is not supported as it is impossible to limit load on target servers.
    * [Filtering by IP addresses](../../../user-guides/ip-lists/overview.md) is not supported.
* The solution analyzes only unencrypted HTTP traffic over raw TCP, not encrypted HTTPS traffic.
* The solution does not support parsing responses over HTTP keep-alive connections yet.
