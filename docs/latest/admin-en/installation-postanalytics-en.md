[tarantool-status]:           ../images/tarantool-status.png
[configure-selinux-instr]:    configure-selinux.md
[configure-proxy-balancer-instr]:   configuration-guides/access-to-wallarm-api-via-proxy.md
[img-wl-console-users]:             ../images/check-user-no-2fa.png

# Separate postanalytics module installation

--8<-- "../include/waf/installation/nginx-installation-options.md"

These instructions provide the steps to install the postanalytics module on a separate server.

## Requirements

* NGINX-Wallarm module installed with [NGINX stable from NGINX repository](../waf-installation/nginx/dynamic-module.md), [NGINX from Debian/CentOS repositories](../waf-installation/nginx/dynamic-module-from-distr.md) or [NGINX Plus](../waf-installation/nginx-plus.md)
* Access to the account with the **Administrator** role in Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* Executing all commands as a superuser (e.g. `root`)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://api.wallarm.com` if working with EU Wallarm Cloud or to `https://us1.api.wallarm.com` if working with US Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to [GCP storage addresses](https://www.gstatic.com/ipranges/goog.json) to download an actual list of IP addresses registered in [whitelisted, blacklisted, or greylisted](../user-guides/ip-lists/overview.md) countries or data centers
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used

## Installation

### 1. Add Wallarm repositories

The postanalytics module, like other Wallarm API Security modules, is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

=== "Debian 9.x (stretch)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 9.x (stretch-backports)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/4.0/' | sudo tee --append /etc/apt/sources.list.d/wallarm.list"
    # for correct Wallarm node operation, uncomment the following line in /etc/apt/sources.list`:
    # deb http://deb.debian.org/debian stretch-backports main contrib non-free
    sudo apt update
    ```
=== "Debian 10.x (buster)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node bullseye/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CloudLinux OS 6.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/6/4.0/x86_64/wallarm-node-repo-4-0.el6.noarch.rpm
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.0/x86_64/wallarm-node-repo-4-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.0/x86_64/wallarm-node-repo-4-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.0/x86_64/wallarm-node-repo-4-0.el8.noarch.rpm
    ```

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
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install wallarm-node-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install wallarm-node-tarantool
    ```

### 3. Connect the postanalytics module to Wallarm Cloud

The postanalytics module interacts with the Wallarm Cloud. To connect the postanalytics module to the Cloud, it is required to create the Wallarm node for the postanalytics module. Created node will get the security rules from the Cloud and upload attacks data to the Cloud.

To create the filtering node and connect the postanalytics module to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Run the `register-node` script in a system with the installed postanalytics module packages:
    
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --no-sync
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --no-sync
        ```

    `<NODE_TOKEN>` is the copied token value.

### 4. Update postanalytics module configuration

The configuration files of the postanalytics module are located in the paths:

* `/etc/default/wallarm-tarantool` for Debian and Ubuntu operating systems
* `/etc/sysconfig/wallarm-tarantool` for CentOS and Amazon Linux 2.0.2021x and lower operating systems

To open the file in the editing mode, please use the command:

=== "Debian"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

#### Memory

The postanalytics module uses the in-memory storage Tarantool. For production environments, the recommended amount of RAM allocated for Tarantool is 75% of the total server memory. If testing the Wallarm node or having a small server size, the lower amount can be enough (e.g. 25% of the total memory).

The allocated memory size is set in GB via the `SLAB_ALLOC_ARENA` directive in the [`/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool`](#4-update-postanalytics-module-configuration) configuration file. The value can be an integer or a float (a dot `.` is a decimal separator). For example:

=== "If testing the node"
    ```bash
    SLAB_ALLOC_ARENA=0.5
    ```
=== "If deploying the node to the production environment"
    ```bash
    SLAB_ALLOC_ARENA=24
    ```

Detailed recommendations about allocating memory for Tarantool are described in these [instructions](configuration-guides/allocate-resources-for-waf-node.md).

#### Address of the separate postanalytics server

To set the address of the separate postanalytics server:

1. Open the Tarantool file in the editing mode:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. Uncomment the `HOST` and `PORT` variables and set them the following values:

    ```bash
    # address and port for bind
    HOST='0.0.0.0'
    PORT=3313
    ```
3. If the configuration file of Tarantool is set up to accept connections on the IP addresses different from `0.0.0.0` or `127.0.0.1`, then please provide the addresses in `/etc/wallarm/node.yaml`:

    ```bash
    hostname: <name of postanalytics node>
    uuid: <UUID of postanalytics node>
    secret: <secret key of postanalytics node>
    tarantool:
        host: '<IP address of Tarantool>'
        port: 3313
    ```
4. Add the address of the postanalytics module server to the configuration files on the server with the NGINX‑Wallarm package as described in the instructions for proper installation forms:

    * [NGINX stable from NGINX repository](../waf-installation/nginx/dynamic-module.md#address-of-the-separate-postanalytics-server)
    * [NGINX from Debian/CentOS repositories](../waf-installation/nginx/dynamic-module-from-distr.md#address-of-the-separate-postanalytics-server)
    * [NGINX Plus](../waf-installation/nginx-plus.md#address-of-the-separate-postanalytics-server)

### 5. Restart Wallarm services

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
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
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
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo systemctl restart nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl restart nginx
        ```

### 6. Check the NGINX‑Wallarm and separate postanalytics modules interaction

To check the NGINX‑Wallarm and separate postanalytics modules interaction, you can send the request with test attack to the address of the protected application:

```bash
curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
```

If the NGINX‑Wallarm and separate postanalytics modules are configured properly, the attack will be uploaded to the Wallarm Cloud and displayed in the **Events** section of Wallarm Console:

![!Attacks in the interface](../images/admin-guides/test-attacks-quickstart.png)

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
    
    *   Disclosure of information about processed requests
    *   Possibility of executing arbitrary Lua code and operating system commands
   
    Please note that no such risk exists if you are deploying the postanalytics module alongside with the NGINX-Wallarm module on the same server. This holds true because the postanalytics module will listen to the port `3313`.
    
    **Here are the firewall settings that should be applied to the separately installed postanalytics module:**
    
    *   Allow the HTTPS traffic to and from the Wallarm API servers, so the postanalytics module can interact with these servers:
        *   `api.wallarm.com` is the API server in the EU Wallarm Cloud
        *   `us1.api.wallarm.com` is the API server in the US Wallarm Cloud
    *   Restrict the access to the `3313` Tarantool port via TCP and UDP protocols by allowing connections only from the IP addresses of the Wallarm filtering nodes.
