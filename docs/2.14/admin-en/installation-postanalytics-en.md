[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-users.png 

# Separate postanalytics module installation

--8<-- "../include/waf/installation/nginx-installation-options.md"

These instructions provide the steps to install the postanalytics module on a separate server.

## Requirements

* NGINX-Wallarm module installed with [NGINX stable from NGINX repository](../waf-installation/nginx/dynamic-module.md), [NGINX from Debian/CentOS repositories](../waf-installation/nginx/dynamic-module-from-distr.md) or [NGINX Plus](../waf-installation/nginx-plus.md)
* Access to the account with the **Administrator** or **Deploy** role and two‑factor authentication disabled in Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* SELinux disabled or configured upon the [instruction][configure-selinux-instr]
* Executing all commands as a superuser (e.g. `root`)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://api.wallarm.com:444` if working with EU Wallarm Cloud or to `https://us1.api.wallarm.com:444` if working with US Wallarm Cloud. If access can be configured only via the proxy server, use the [instruction][configure-proxy-balancer-instr]
* Installed text editor **vim**, **nano** or any other. In the instruction, **vim** is used

## Installation

### 1. Add Wallarm WAF repositories

The postanalytics module, like other Wallarm WAF modules, is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

--8<-- "../include/waf/installation/add-nginx-waf-repos-2.16.md"

### 2. Install packages for the postanalytics module

Install the `wallarm-node-tarantool` package from the Wallarm repository for the postanalytics module and Tarantool database:

=== "Debian"
    ```bash
    sudo apt install --no-install-recommends wallarm-node-tarantool
    ```
=== "Ubuntu"
    ```bash
    sudo apt install --no-install-recommends wallarm-node-tarantool
    ```
=== "CentOS or Amazon Linux 2"
    ```bash
    sudo yum install wallarm-node-tarantool
    ```

### 3. Connect the postanalytics module to Wallarm Cloud

The postanalytics module interacts with the Wallarm Cloud. To connect the postanalytics module to the Cloud, it is required to create a separate WAF node for the postanalytics module. Created WAF node will get the security rules from the Cloud and upload attacks data to the Cloud.

To create the WAF node and connect the postanalytics module to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** or **Deploy** role enabled and two-factor authentication disabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]

2.  Run the `addnode` script in a system with the installed postanalytics module packages:
    
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode --no-sync
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H api.wallarm.ru --no-sync
        ```
3. Input an email and password of you account in Wallarm Console.
4. Input the postanalytics WAF node name or click Enter to use automatically generated name.
5. Open Wallarm Console → **Node** section in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and ensure a new WAF node is added to the list.

### 4. Update postanalytics module configuration

The configuration files of the postanalytics module are located in the paths:

* `/etc/default/wallarm-tarantool` for Debian and Ubuntu operating systems
* `/etc/sysconfig/wallarm-tarantool` for CentOS and Amazon Linux 2 operating systems

To open the file in the editing mode, please use the command:

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

#### Memory

The postanalytics module uses the in-memory storage Tarantool. The recommended memory size for Tarantool is 75% of the total server memory.

The allocated memory size is set in GB via the `SLAB_ALLOC_ARENA` directive in the `wallarm‑tarantool` configuration file. The value can be an integer or a float (a dot `.` is a decimal separator). For example, 24 GB:

```bash
SLAB_ALLOC_ARENA=24
```

Detailed recommendations about allocating memory for Tarantool are described in these [instructions](configuration-guides/allocate-resources-for-waf-node.md).

#### Address of the separate postanalytics server

To set the address of the separate postanalytics server:

1. Uncomment the `HOST` and `PORT` variables in the `wallarm-tarantool` configuration file and set them the following values:

    ```bash
    # address and port for bind
    HOST='0.0.0.0'
    PORT=3313
    ```
2. If the configuration file of Tarantool is set up to accept connections on the IP addresses different from `0.0.0.0` or `127.0.0.1`, then please provide the addresses in `/etc/wallarm/node.yaml`:

    ```bash
    hostname: <name of postanalytics WAF node>
    uuid: <UUID of postanalytics WAF node>
    secret: <secret key of postanalytics WAF node>
    tarantool:
        host: '<IP address of Tarantool>'
        port: 3313
    ```
3. Add the address of the postanalytics module server to the configuration files on the server with the NGINX‑Wallarm package as described in the instructions for proper installation forms:

    * [NGINX stable from NGINX repository](../waf-installation/nginx/dynamic-module.md#address-of-the-separate-postanalytics-server)
    * [NGINX from Debian/CentOS repositories](../waf-installation/nginx/dynamic-module-from-distr.md#address-of-the-separate-postanalytics-server)
    * [NGINX Plus](../waf-installation/nginx-plus.md#address-of-the-separate-postanalytics-server)

### 5. Restart Wallarm WAF services

To apply the settings to the postanalytics and NGINX‑Wallarm modules:

1. Restart the `wallarm-tarantool` service on the server with separate postanalytics module:

    === "Debian"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "Ubuntu"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
2. Restart the NGINX service on the server with the NGINX‑Wallarm module:

    === "Debian"
        ```bash
        sudo systemctl restart nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx restart
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        sudo systemctl restart nginx
        ```

### 6. Check the NGINX‑Wallarm and separate postanalytics modules interaction

To check the NGINX‑Wallarm and separate postanalytics modules interaction, you can send the request with test attack to the address of the protected application:

```bash
curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
```

If the NGINX‑Wallarm and separate postanalytics modules are configured properly, the attack will be uploaded to the Wallarm Cloud and displayed in the **Events** section of the Wallarm Console:

![!Attacks in the interface](../images/admin-guides/test-attacks.png)

If the attack was not uploaded to the Cloud, please check that there are no errors in the services operation:

* Make sure that the postanalytics service `wallarm-tarantool` is in the status `active`

    ```bash
    sudo systemctl status wallarm-tarantool
    ```

    ![!wallarm-tarantool status][tarantool-status]
* Analyze the postanalytics module logs

    ```bash
    sudo cat /var/log/wallarm/tarantool.log
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
    
    *   disclosure of information about processed requests
    *   possibility of executing arbitrary Lua code and operating system commands
   
    Please note that no such risk exists if you are deploying the postanalytics module alongside with the NGINX-Wallarm module on the same server. This holds true because the postanalytics module will listen to the port `3313`.
    
    **Here are the firewall settings that should be applied to the separately installed postanalytics module:**
    
    *   Allow the HTTPS traffic to and from the Wallarm API servers, so the postanalytics module can interact with these servers:
        *   `api.wallarm.com:444` is the API server in the EU Wallarm Cloud
        *   `us1.api.wallarm.com:444` is the API server in the US Wallarm Cloud
    *   Restrict the access to the `3313` Tarantool port via TCP and UDP protocols by allowing connections only from the IP addresses of the Wallarm WAF nodes.
