[img-wl-console-users]:             ../../images/check-users.png 
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../../images/admin-guides/test-attacks.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[scanner-whitelisting-instr]:       ../../admin-en/scanner-ips-whitelisting.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md

# Installing dynamic WAF module for NGINX stable from NGINX repository

This instruction describes the steps to install Wallarm WAF as a dynamic module for the open source version of NGINX `stable` installed from the NGINX repository.

--8<-- "../include/waf/installation/already-installed-waf-2.12.md"

## Requirements

--8<-- "../include/waf/installation/nginx-requirements.md"

## Installation options

--8<-- "../include/waf/installation/nginx-installation-options.md"

## Installation

### 1. Install NGINX stable and dependencies

There are the following options to install NGINX `stable` from the NGINX repository:

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
    === "CentOS"
        ```bash
        echo -e '\n[nginx-stable] \nname=nginx stable repo \nbaseurl=http://nginx.org/packages/centos/$releasever/$basearch/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://nginx.org/keys/nginx_signing.key \nmodule_hotfixes=true' | sudo tee /etc/yum.repos.d/nginx.repo
        sudo yum install nginx
        ```

* Compilation of the source code from the `stable` branch of the [NGINX repository](http://hg.nginx.org/pkg-oss/branches) and installation with the same options

More detailed information about installation is available in the [official NGINX documentation](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/).

### 2. Add Wallarm WAF repositories

Wallarm WAF is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

--8<-- "../include/waf/installation/add-nginx-waf-repos-2.12.md"

### 3. Install Wallarm WAF packages

#### Request processing and postanalytics on the same server

To run postanalytics and process the requests on the same server, the following packages are required:

* `nginx-module-wallarm` for the NGINX-Wallarm module
* `wallarm-node` for the postanalytics module, Tarantool database and additional NGINX-Wallarm packages

--8<-- "../include/waf/installation/nginx-postanalytics-2.12.md"

#### Request processing and postanalytics on different servers

To run postanalytics and process the requests on different servers, the following packages are required:

* `wallarm-node-nginx` and `nginx-module-wallarm` for the NGINX-Wallarm module

    === "Debian"
        ```bash
        sudo apt install --no-install-recommends wallarm-node-nginx nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt install --no-install-recommends wallarm-node-nginx nginx-module-wallarm
        ```
    === "CentOS"
        ```bash
        sudo yum install wallarm-node-nginx nginx-module-wallarm
        ```

* `wallarm-node-tarantool` on the separate server for the postanalytics module and Tarantool database (installation steps are described in the [instruction](../../admin-en/installation-postanalytics-en.md))

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
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

### 5. Connect the WAF node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud.md"

### 6. Update Wallarm WAF configuration

--8<-- "../include/waf/installation/nginx-waf-min-configuration-2.12.md"

### 7. Restart NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-2.12.md"

### 8. Test Wallarm WAF operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Dynamic Wallarm WAF module with default settings is installed for NGINX `stable`. To customize Wallarm WAF settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options.md"
