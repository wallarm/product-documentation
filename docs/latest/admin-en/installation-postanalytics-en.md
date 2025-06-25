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
    curl -O https://meganode.wallarm.com/6.2/wallarm-6.2.1.x86_64-glibc.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/6.2/wallarm-6.2.1.aarch64-glibc.sh
    ```

## Step 2: Prepare Wallarm token

To install node, you will need a Wallarm token of the [appropriate type][wallarm-token-types]. To prepare a token:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Node deployment/Deployment` usage type.
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
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.2.1.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.2.1.aarch64-glibc.sh postanalytics
    ```        

    The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

=== "Node token"
    ```bash
    # If using the x86_64 version:
    sudo sh wallarm-6.2.1.x86_64-glibc.sh postanalytics

    # If using the ARM64 version:
    sudo sh wallarm-6.2.1.aarch64-glibc.sh postanalytics
    ```

## Step 4: Configure the postanalytics module

### Resources and memory

To change how much memory wstore uses, look for the `SLAB_ALLOC_ARENA` setting in the `/opt/wallarm/env.list` file. It is set to use 1 GB by default. If you need to change this, you can adjust the number to match the amount of memory wstore actually needs. For help on how much to set, see our [recommendations](configuration-guides/allocate-resources-for-node.md).

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

1. On the machine with the postanalytics service, open for editing the `/opt/wallarm/wstore/wstore.yaml` file:

    ```bash
    sudo vim /opt/wallarm/wstore/wstore.yaml
    ```
1. Specify the new IP address and port values in the `service.address` parameter, e.g.:

    ```yaml
    service:
      address: 192.158.1.38:3313
    ```

    The `service.address` parameter allows the following value formats:

    * IP address:Port, e.g. `192.158.1.38:3313`
    * Specific port on all IPs, e.g. `:3313`
1. On the machine with the postanalytics service, open for editing the `/opt/wallarm/etc/wallarm/node.yaml` file:

    ```bash
    sudo vim /opt/wallarm/etc/wallarm/node.yaml
    ```
1. Specify the new IP address and port values in the `wstore.host` and `wstore.port` parameters, e.g.:
    ```yaml
    api:
      uuid: <UUID of postanalytics node>
      secret: <secret key of postanalytics node>
    wstore:
      host: '0.0.0.0'
      port: 3300
    ```

## Step 5: Enable inbound connections for the postanalytics module

The postanalytics module uses port 3313 by default, but some cloud platforms may block inbound connections on this port.

To guarantee integration, allow inbound connections on port 3313 or your custom port. This step is essential for the NGINX-Wallarm module, installed separately, to connect with the wstore instance.

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
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.2.1.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.2.1.aarch64-glibc.sh filtering
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        ```bash
        # If using the x86_64 version:
        sudo sh wallarm-6.2.1.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo sh wallarm-6.2.1.aarch64-glibc.sh filtering
        ```

## Step 8: Connect the NGINX-Wallarm module to the postanalytics module

On the machine with the NGINX-Wallarm module, in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (typically located at `/etc/nginx/nginx.conf`), specify the postanalytics module server address:

```
http {
    # omitted

    upstream wallarm_wstore {
        server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
        keepalive 2;
    }

    wallarm_wstore_upstream wallarm_wstore;

    # omitted
}
```

* `max_conns` value must be specified for each of the upstream wstore servers to prevent the creation of excessive connections.
* `keepalive` value must not be lower than the number of the wstore servers.

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

## SSL/TLS and mTLS between the NGINX-Wallarm module and the postanalytics module

Optionally, you can establish a secure connection between the NGINX-Wallarm module and postanalytics over SSL/TLS. Both one-way server certificate validation and mutual TLS are supported.

Available from release 6.2.0 onwards.

### SSL/TLS connection to the postanalytics module

To enable a secure SSL/TLS connection from the NGINX-Wallarm module to the postanalytics module:

1. Issue a server certificate for the FQDN or IP address of the running postanalytics module's host.
1. On the postanalytics server, enable SSL/TLS in the `/opt/wallarm/wstore/wstore.yaml` file:

    ```yaml
    service:
      TLS:
        enabled: true
        address: 0.0.0.0:6388
        certFile: "/opt/wallarm/wstore/wstore.crt"
        keyFile: "/opt/wallarm/wstore/wstore.key"
        # caCertFile: "/opt/wallarm/wstore/wstore-ca.crt"
    ```

    * `enabled`: enables or disables SSL/TLS for the postanalytics module. Default is `false`.
    * `address`: address and port on which the postanalytics module accepts incoming TLS connections. The specified address must allow inbound connections.
    * `certFile`: path to the server certificate presented to the client (NGINX-Wallarm module) during the TLS handshake.
    * `keyFile`: path to the private key corresponding to the server certificate.
    * `caCertFile` (optional): path to the custom CA certificate for the server.
1. On the postanalytics server, restart the Wallarm services:

    ```
    sudo systemctl restart wallarm.service
    ```
1. On the NGINX-Wallarm server, in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (typically, `/etc/nginx/nginx.conf`):

    1. Configure the upstream used for postanalytics via TLS.
    1. Add the `ssl=on` option to [`wallarm_wstore_upstream`](configure-parameters-en.md#wallarm_wstore_upstream).
    1. If the postanalytics module uses a certificate issued by a custom CA, upload the CA certificate to the NGINX-Wallarm server and specify the path in [`wallarm_wstore_ssl_ca_cert_file`](configure-parameters-en.md#wallarm_wstore_ssl_ca_cert_file).
    
        This file must match the `service.TLS.caCertFile` configured on the postanalytics server.

    ```
    http {
        upstream wallarm_wstore {
            server postanalytics.server.com:6388 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
    
        wallarm_wstore_upstream wallarm_wstore ssl=on;

        # wallarm_wstore_ssl_ca_cert_file /path/to/wstore-ca.crt;
    }
    ```
1. On the NGINX-Wallarm server, restart NGINX:

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
1. [Check the integration](#step-9-check-the-nginxwallarm-and-separate-postanalytics-modules-interaction).

### Mutual TLS (mTLS)

To enable mutual authentication, where both the NGINX-Wallarm module and the postanalytics module verify each other's certificates:

1. [Enable SSL/TLS connection](#ssltls-connection-to-the-postanalytics-module) to the postanalytics module as described above.
1. Issue a client certificate for the FQDN or IP address of the running NGINX-Wallarm module's host.
1. On the NGINX-Wallarm server, upload the client certificate and private key and specify their paths in [`wallarm_wstore_ssl_cert_file`](configure-parameters-en.md#wallarm_wstore_ssl_cert_file) and [`wallarm_wstore_ssl_key_file`](configure-parameters-en.md#wallarm_wstore_ssl_key_file):

    ```
    http {
        upstream wallarm_wstore {
            server postanalytics.server.com:6388 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
    
        wallarm_wstore_upstream wallarm_wstore ssl=on;

        wallarm_wstore_ssl_cert_file /path/to/client.crt;
        wallarm_wstore_ssl_key_file /path/to/client.key;
        
        # wallarm_wstore_ssl_ca_cert_file /path/to/wstore-ca.crt;
    }
    ```

    Then, restart NGINX:

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

1. On the postanalytics server, enable mTLS in `/opt/wallarm/wstore/wstore.yaml`:

    ```yaml
    service:
      TLS:
        enabled: true
        address: 0.0.0.0:6388
        certFile: "/opt/wallarm/wstore/wstore.crt"
        keyFile: "/opt/wallarm/wstore/wstore.key"
        # caCertFile: "/opt/wallarm/wstore/wstore-ca.crt"
        mutualTLS:
          enabled: true
          # clientCACertFile: "/opt/wallarm/wstore/client-ca.crt"
    ```

    * `mutualTLS.enabled`: enables or disabled mTLS. Default is `false`.
    * `mutualTLS.clientCACertFile` (optional): path to the custom CA certificate for the NGINX‑Wallarm client.


    Then, restart the Wallarm services:

    ```
    sudo systemctl restart wallarm.service
    ```

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
    *   Restrict the access to the `3313` wstore port via TCP and UDP protocols by allowing connections only from the IP addresses of the Wallarm filtering nodes.
