[img-wl-console-users]:             ../images/check-users.png 
[memory-instr]:                     ../admin-en/configuration-guides/allocate-resources-for-waf-node.md

# Installing the WAF node (NGINX)

## Installation overview

The processing of requests in the WAF is divided into two stages:

* Primary processing in the NGINX-Wallarm module
* Statistical analysis of the processed requests in the postanalytics module

Depending on the system architecture, the NGINX-Wallarm and postanalytics modules can be installed on the **same server** or on **different servers**.

These instructions describe the installation of the NGINX-Wallarm and postanalytics modules on the **same server**. The WAF node will be installed as a dynamic module for the open source version of NGINX `stable` that was installed from the NGINX repository.

[The list of all WAF node installation forms →](../admin-en/supported-platforms.md)

## Requirements

* Access to the account with the **Administrator** or **Deploy** [role](../user-guides/settings/users.md) and two‑factor authentication disabled in the Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Executing all commands as a superuser (e.g. `root`)
* Supported 64-bit operating system:

    * Debian 9.x (stretch)
    * Debian 10.x (buster)
    * Ubuntu 18.04 LTS (bionic)
    * Ubuntu 20.04 LTS (focal)
    * CentOS 7.x
    * Amazon Linux 2
    * CentOS 8.x
* SELinux disabled or configured upon the [instructions](../admin-en/configure-selinux.md)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://api.wallarm.com:444` for working with EU Wallarm Cloud or to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions](qs-setup-proxy-en.md)
* Access to [GCP storage addresses](https://www.gstatic.com/ipranges/goog.json) to download an actual list of IP addresses registered in [whitelisted, blacklisted, or greylisted](../user-guides/ip-lists/overview.md) countries or data centers
* Installed text editor **vim**, **nano**, or any other. In these instructions, **vim** is used

## Installation

### 1. Install NGINX stable and dependencies

These are the following options to install NGINX `stable` from the NGINX repository:

* Installation from the built package

    === "Debian"
        ```bash
        sudo apt install curl gnupg2 ca-certificates lsb-release
        echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
        curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
        sudo apt update
        sudo apt install nginx
        ```
    === "Ubuntu"
        ```bash
        sudo apt install curl gnupg2 ca-certificates lsb-release
        echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
        curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
        sudo apt update
        sudo apt install nginx
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
        sudo yum install nginx
        ```

* Compilation of the source code from the `stable` branch of the [NGINX repository](https://hg.nginx.org/pkg-oss/branches) and installation with the same options

More detailed information about installation is available in the [official NGINX documentation](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/).

### 2. Add Wallarm WAF repositories

Wallarm WAF is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

--8<-- "../include/waf/installation/add-nginx-waf-repos-3.0.md"

### 3. Install Wallarm WAF packages

Depending on your operating system, run one of the commands:

--8<-- "../include/waf/installation/nginx-postanalytics.md"

### 4. Connect the Wallarm WAF module

1. Open the file `/etc/nginx/nginx.conf`:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. Ensure that the `include /etc/nginx/conf.d/*` line is added to the file. If there is no such line, add it.
3. Add the following directive right after the `worker_processes` directive:

    ```bash
    load_module modules/ngx_http_wallarm_module.so;
    ```

    Configuration example with the added directive:

    ```
    user  nginx;
    worker_processes  auto;
    load_module modules/ngx_http_wallarm_module.so;

    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    ```

4. Copy the configuration files for the system setup:

    ``` bash
    sudo cp /usr/share/doc/nginx-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

### 5. Connect the WAF node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud.md"

### 6. Allocate resources for the postanalytics module

The WAF node uses the in-memory storage Tarantool. The recommended memory size for Tarantool is 75% of the total server memory. To allocate memory for Tarantool:

1. Open the Tarantool configuration file in the editing mode:

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
2. Specify memory size in GB in the `SLAB_ALLOC_ARENA` directive. The value can be an integer or a float (a dot `.` is a decimal separator). For example, 24 GB:
    
    ```bash
    SLAB_ALLOC_ARENA=24
    ```

    Detailed recommendations about allocating memory for Tarantool are described in these [instructions][memory-instr]. 
3. To apply changes, restart Tarantool:

    === "Debian"
        ``` bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo systemctl restart wallarm-tarantool
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        sudo systemctl restart wallarm-tarantool
        ```

### 7. Restart NGINX

--8<-- "../include/waf/restart-nginx-2.16.md"

## Next steps

Installation is completed. Now you need to configure the WAF node to filter traffic.

See [Configure the proxying and filtering rules →](qs-setup-proxy-en.md)
