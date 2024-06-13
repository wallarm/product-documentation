# Deploying the Node for TCP Traffic Mirror Analysis

Wallarm provides a foundational artifact for deploying its filtering node, specifically designed for TCP traffic mirror analysis. This guide explains how to deploy and configure the Wallarm filtering node in this form-factor.

## Use cases

Among all supported [out-of-band deployment options](../../supported-deployment-options.md#out-of-band), this solution is recommended for the following scenarios:

* You prefer to capture traffic mirrors at the TCP level and require a security solution to analyze this specific traffic.
* NGINX- or Envoy-based deployment artifacts are either unavailable, too slow, or consume excessive resources. The solution for TCP traffic mirror analysis is low-resource consuming, as it independently parses and analyzes traffic.
* Your network includes virtual interfaces configured for TCP traffic mirroring, with the mirrored traffic targeting certain servers without being tied to specific web servers like NGINX.

## How does it work

This solution operates in out-of-band (OOB) mode, capturing mirrored TCP traffic directly from the network interface, independent of web servers like NGINX. The solution uses Goreplay to capture the traffic and handle encapsulations (e.g., VLAN, VXLAN). The captured traffic is then parsed, reassembled, and analyzed for threats by the Wallarm services.

It seamlessly swaps between multiple traffic sources. When multiple data sources are directed to a traffic mirror target (the instance with the Wallarm node), the solution efficiently collects and decrypts traffic, allowing flexible monitoring without disruption. By reassembling TCP traffic, the Wallarm node ensures accurate threat detection and analysis, ensuring no suspicious activity is missed.

Additionally, the solution supports response mirror parsing, allowing non-interrupted traffic flow while providing Wallarm features that rely on response data. These features include vulnerability discovery, API discovery, and more.

## Requirements

* Understanding of TCP traffic mirroring flow and the specifics of your environment to configure the solution effectively.
* The machine intended for running the node must meet the following criteria:

    * Linux OS
    * x86_64/ARM64 architecture
* Traffic and response mirroring must be configured with both source and target set up, and the prepared instance chosen as a mirror target. Specific environment requirements must be met, such as allowing specific protocols for traffic mirroring configurations.

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
    curl -O https://meganode.wallarm.com/next/aionext-0.2.2.x86_64.sh
    chmod +x aionext-0.2.2.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/next/aionext-0.2.2.aarch64.sh
    chmod +x aionext-0.2.2.aarch64.sh
    ```

## Step 3: Prepare the configurarion file

Create the `wallarm-node-conf.yaml` file on the instance. The solution requires proper configuration to identify the network interface and the traffic format (e.g., VLAN, VXLAN). The minimal content should include the following settings:

```yaml
Version: 1
GoreplayMiddleware:
  Enabled: true
  Goreplay:
    Filter: <your network interface, i.e. "lo:" or "enp7s0:">
    ExtraArgs:
      - ...
      - ...
```

In the [article](configuration.md), you will find the list of more supported configuration parameters.

### Choosing a network interface for listening

To specify the network interface to capture from:

1. Check network interfaces available on the host:

    ```
    ip link show command
    ```

1. Specify the network interface in the `Filter` parameter, e.g.:

    ```yaml
    Version: 1
    GoreplayMiddleware:
      Enabled: true
      Goreplay:
        Filter: "eth0:"
    ```

### Capturing VLAN

If mirrored traffic is wrapped in VLAN, provide additional arguments:

```yaml
Version: 1
GoreplayMiddleware:
  Enabled: true
  Goreplay:
    Filter: <your network interface, i.e. "lo:" or "enp7s0:">
    ExtraArgs:
      - -input-raw-vlan
      - -input-raw-vlan-vid
      - 42 # VID of your vlan
```

### Capturing VXLAN (AWS mirroring)

If mirrored traffic is wrapped in VXLAN (common in AWS), provide additional arguments:

```yaml
Version: 1
GoreplayMiddleware:
  Enabled: true
  Goreplay:
    Filter: <your network interface, i.e. "lo:" or "enp7s0:">
    ExtraArgs:
      - -input-raw-engine
      - vxlan
      - -input-raw-vxlan-port # custom VXLAN UDP port
      - 4789                  # custom VXLAN UDP port
      - -input-raw-vxlan-vni  # specific VNI (capture all by default)
      - 1                     # specific VNI
```

## Step 4: Run the Wallarm installer

To install the Wallarm node for TCP traffic mirror analysis, run the following command:

=== "x86_64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.2.2.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.2.2.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```
=== "ARM64 version"
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.2.2.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.2.2.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
    ```

* The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
* `<API_TOKEN>` specifies the generated API token for the `Deploy` role.
* `<PATH_TO_CONFIG>` specifies the path to the configuration file prepared before.

The provided configuration file will be copied to the path: `/opt/wallarm/etc/wallarm/go-node.yaml`.

If needed, you can change the copied file after the installation is finished. To apply the changes, you will need to restart the Wallarm service with `sudo systemctl restart wallarm`.

## Step 5: Test the solution

Send the test Path Traversal attack to the mirror source address by replacing `<MIRROR_SOURCE_ADDRESS>` with the actual IP address or DNS name of the instance:

```
curl http://<MIRROR_SOURCE_ADDRESS>/etc/passwd
```

Since the Wallarm solution for TCP traffic mirror analysis operates out-of-band, it does not block attacks but only registers them.

To check that the attack has been registered, proceed to Wallarm Console → **Events**:

![!Attacks in the interface](../../../images/waf-installation/epbf/ebpf-attack-in-ui.png)

## Debugging

* To check if there is traffic on the network interface you are trying to capture from, run the following command on your machine:

    ```
    tcpdump -i <INTERFACE_NAME>
    ```
* To verify if the filtering node detects traffic:

    Set the log level in `/opt/wallarm/etc/wallarm/go-node.yaml` to `debug` as follows:

    ```yaml
    Log:
      Level: debug
    ```

    Restart the Wallarm service:

    ```
    sydo systemctl restart wallarm
    ```

    Logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default. You can read them there.
* Standard logs of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.

## Installer launch options

* As soon as you have the all-in one script downloaded, you can get **help** on it with:

    === "x86_64 version"
        ```
        sudo ./aionext-0.2.2.x86_64.sh -- --help
        ```
    === "ARM64 version"
        ```
        sudo ./aionext-0.2.2.aarch64.sh -- --help
        ```
* You can also run the installer in an **interactive** mode by choosing the `tcp-capture` mode in the 1st step:

    === "x86_64 version"
        ```
        sudo ./aionext-0.2.2.x86_64.sh
        ```
    === "ARM64 version"
        ```
        sudo ./aionext-0.2.2.aarch64.sh
        ```

    In this case, the minimal config file applied will look like the following. You can edit it later in `/opt/wallarm/etc/wallarm/go-node.yaml`:

    ```yaml
    Version: 1

    GoreplayMiddleware:
      Enabled: true
    ```

## Limitations

* [Rate limits](../../../user-guides/rules/rate-limiting.md) and [IP lists](../../../user-guides/ip-lists/overview.md) are not supported yet.
