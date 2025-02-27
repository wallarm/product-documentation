[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Separate Postanalytics Module Installation

In Wallarm's request processing, two stages are involved, including the postanalytics stage for statistical request analysis. Postanalytics is memory-intensive, which may require it to be performed on a dedicated server for optimized performance. This article explains how to install the postanalytics module on a separate server.

## Overview

The processing of requests in the Wallarm node consists of two stages:

* Primary processing in the NGINX-Wallarm module, which is not memory demanding and can be executed on frontend servers without altering server requirements.
* Statistical analysis of the processed requests in the postanalytics module which is memory demanding.

The schemes below depict module interaction in two scenarios: when installed on the same server and on different servers.

=== "NGINX-Wallarm and postanalytics on one server"
    ![Traffic flow between postanalytics and nginx-wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-the-same-server.png)
=== "NGINX-Wallarm and postanalytics on different servers"
    ![Traffic flow between postanalytics and nginx-wallarm](../images/waf-installation/separate-postanalytics/processing-postanalytics-on-different-servers.png)

## Requirements

--8<-- "../include/waf/installation/all-in-one/separate-postanalytics-reqs.md"

## Step 1: Download all-in-one Wallarm installer

To download all-in-one Wallarm installation script, execute the command:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.8.x86_64-glibc.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/5.3/wallarm-5.3.8.aarch64-glibc.sh
    ```

## Step 2: Prepare Wallarm token

To install node, you will need a Wallarm token of the [appropriate type][wallarm-token-types]. To prepare a token:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.

=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.

## Step 3: Run all-in-one Wallarm installer to install postanalytics

To install postanalytics separately with all-in-one installer, use:

=== "API token"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.8.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.8.aarch64-glibc.sh postanalytics
    ```        

    The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

=== "Node token"
    ```bash
    # If using the x86_64 version:
    sudo sh wallarm-5.3.8.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo sh wallarm-5.3.8.aarch64-glibc.sh postanalytics
    ```

## Step 4: Configure the postanalytics module

### Resources and memory

To change how much memory Tarantool uses, look for the `SLAB_ALLOC_ARENA` setting in the `/opt/wallarm/env.list` file. It is set to use 1 GB by default. If you need to change this, you can adjust the number to match the amount of memory Tarantool actually needs. For help on how much to set, see our [recommendations](configuration-guides/allocate-resources-for-node.md).

To change allocated memory:

1. Open for editing the `/opt/wallarm/env.list` file:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. Set the `SLAB_ALLOC_ARENA` attribute to memory size. The value can be an integer or a float (a dot `.` is a decimal separator). For example:

    ```
    SLAB_ALLOC_ARENA=2.0
    ```

### Host and port

By default, the postanalytics module is set to accept connections on all IPv4 addresses of the host (0.0.0.0) using port 3313. It is recommended to retain the default configuration unless a change is necessary.

However, if you need to change the default configuration:

1. Open for editing the `/opt/wallarm/env.list` file:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. Update the `HOST` and `PORT` values as required. Define the `PORT` variable if it is not already specified, for example:

    ```bash
    # tarantool
    HOST=0.0.0.0
    PORT=3300
    ```
1. Open for editing the `/opt/wallarm/etc/wallarm/node.yaml` file:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. Enter the new `host` and `port` values for the `tarantool` parameters, as shown below:

    ```yaml
    hostname: <name of postanalytics node>
    uuid: <UUID of postanalytics node>
    secret: <secret key of postanalytics node>
    tarantool:
        host: '0.0.0.0'
        port: 3300
    ```

## Step 5: Enable inbound connections for the postanalytics module

The postanalytics module uses port 3313 by default, but some cloud platforms may block inbound connections on this port.

To guarantee integration, allow inbound connections on port 3313 or your custom port. This step is essential for the NGINX-Wallarm module, installed separately, to connect with the Tarantool instance.

## Step 6: Restart the Wallarm services

After making the necessary changes, restart the Wallarm services on the machine hosting the postanalytics module to apply the updates:

```
sudo systemctl restart wallarm.service
```

## Step 7: Install the NGINX-Wallarm module on a separate server

Once the postanalytics module is installed on the separate server:

1. Install the NGINX-Wallarm module on a different server following the corresponding [guide](../installation/nginx/all-in-one.md).
1. When launching the installation script for the NGINX-Wallarm module on a separate server, include the `filtering` option, for example:

    === "API token"
        ```bash
        # If using the x86_64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.8.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.8.aarch64-glibc.sh filtering
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        ```bash
        # If using the x86_64 version:
        sudo sh wallarm-5.3.8.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo sh wallarm-5.3.8.aarch64-glibc.sh filtering
        ```

## Step 8: Connect the NGINX-Wallarm module to the postanalytics module

On the machine with the NGINX-Wallarm module, in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/), specify the postanalytics module server address:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` value must be specified for each of the upstream Tarantool servers to prevent the creation of excessive connections.
* `keepalive` value must not be lower than the number of the Tarantool servers.

Once the configuration file changed, restart NGINX/NGINX Plus on the NGINX-Wallarm module server:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## Step 9: Check the NGINX‑Wallarm and separate postanalytics modules interaction

To check the NGINX‑Wallarm and separate postanalytics modules interaction, you can send the request with test attack to the address of the protected application:

```bash
curl http://localhost/etc/passwd
```

If the NGINX‑Wallarm and separate postanalytics modules are configured properly, the attack will be uploaded to the Wallarm Cloud and displayed in the **Attacks** section of Wallarm Console:

![Attacks in the interface](../images/admin-guides/test-attacks-quickstart.png)

If the attack was not uploaded to the Cloud, please check that there are no errors in the services operation:

* Analyze the postanalytics module logs

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/wstore-out.log
    ```

    If there is the record like `SystemError binary: failed to bind: Cannot assign requested address`, make sure that the server accepts connection on specified address and port.
* On the server with the NGINX‑Wallarm module, analyze the NGINX logs:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    If there is the record like `[error] wallarm: <address> connect() failed`, make sure that the address of separate postanalytics module is specified correctly in the NGINX‑Wallarm module configuration files and separate postanalytics server accepts connection on specified address and port.
* On the server with the NGINX‑Wallarm module, get the statistics on processed requests using the command below and make sure that the value of `tnt_errors` is 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Description of all parameters returned by the statistics service →](configure-statistics-service.md)

## Postanalytics module protection

!!! warning "Protect installed postanalytics module"
    We **highly recommend** to protect a newly installed Wallarm postanalytics module with a firewall. Otherwise, there is a risk of getting unauthorized access to the service that may result in:
    
    *   Disclosure of information about processed requests
    *   Possibility of executing arbitrary Lua code and operating system commands
   
    Please note that no such risk exists if you are deploying the postanalytics module alongside with the NGINX-Wallarm module on the same server. This holds true because the postanalytics module will listen to the port `3313`.
    
    **Here are the firewall settings that should be applied to the separately installed postanalytics module:**
    
    *   Allow the HTTPS traffic to and from the Wallarm API servers, so the postanalytics module can interact with these servers:
        *   `us1.api.wallarm.com` is the API server in the US Wallarm Cloud
        *   `api.wallarm.com` is the API server in the EU Wallarm Cloud
    *   Restrict the access to the `3313` Tarantool port via TCP and UDP protocols by allowing connections only from the IP addresses of the Wallarm filtering nodes.

## Tarantool troubleshooting

[Tarantool troubleshooting](../faq/tarantool.md)
