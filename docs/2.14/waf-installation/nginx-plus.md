[img-wl-console-users]:             ../images/check-users.png 
[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[scanner-whitelisting-instr]:       ../admin-en/scanner-ips-whitelisting.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[2.14-install-postanalytics-instr]: ../../admin-en/installation-postanalytics-en/
[2.16-install-postanalytics-instr]: ../../../admin-en/installation-postanalytics-en/
[update-instr]:                     ../updating-migrating/nginx-modules.md
[2.16-installation-instr]:          ../../../waf-installation/nginx-plus/
[nginx-modules-update-docs]:        ../../../updating-migrating/nginx-modules/
[separate-postanalytics-update-docs]:   ../../../updating-migrating/separate-postanalytics/
[install-postanalytics-docs]:        ../../admin-en/installation-postanalytics-en/
[versioning-policy]:               ../updating-migrating/versioning-policy.md

# Installing dynamic WAF module for NGINX Plus

These instructions describe the steps to install Wallarm WAF as a dynamic module for the official commercial version of NGINX Plus.

--8<-- "../include/waf/installation/already-installed-waf.md"

## Requirements

--8<-- "../include/waf/installation/nginx-requirements.md"

## Installation options

--8<-- "../include/waf/installation/nginx-installation-options.md"

Installation commands for both options are described in the further instructions.

## Installation
    
### 1. Install NGINX Plus and dependencies

Install NGINX Plus and its dependencies using these [official NGINX instructions](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/).

!!! info "Installing on Amazon Linux 2"
    To install NGINX Plus on Amazon Linux 2, use the CentOS 7 instructions.

### 2. Add Wallarm WAF repositories

Wallarm WAF is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

--8<-- "../include/waf/installation/add-nginx-waf-repos.md"

### 3. Install Wallarm WAF packages

#### Request processing and postanalytics on the same server

To run postanalytics and process the requests on the same server, the following packages are required:

* `nginx-plus-module-wallarm` for the NGINX Plus-Wallarm module
* `wallarm-node` for the postanalytics module, Tarantool database, and additional NGINX Plus-Wallarm packages

=== "Debian"
    ```bash
    sudo apt install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "CentOS or Amazon Linux 2"
    ```bash
    sudo yum install wallarm-node nginx-plus-module-wallarm
    ```

#### Request processing and postanalytics on different servers

To run postanalytics and process the requests on different servers, the following packages are required:

* `wallarm-node-nginx` and `nginx-plus-module-wallarm` for the NGINX Plus-Wallarm module

    === "Debian"
        ```bash
        sudo apt install --no-install-recommends wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt install --no-install-recommends wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "CentOS or Amazon Linux 2"
        ```bash
        sudo yum install wallarm-node-nginx nginx-plus-module-wallarm
        ```

* `wallarm-node-tarantool` on the separate server for the postanalytics module and Tarantool database (installation steps are described in the [instructions](../admin-en/installation-postanalytics-en.md))

### 4. Connect the Wallarm WAF module

1. Open the file `/etc/nginx/nginx.conf`:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
2. Add the following directive right after the `worker_processes` directive:

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

3. Copy the configuration files for the system setup:

    ``` bash
    sudo cp /usr/share/doc/nginx-plus-module-wallarm/examples/*.conf /etc/nginx/conf.d/
    ```

### 5. Connect the WAF node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud.md"

### 6. Update Wallarm WAF configuration

--8<-- "../include/waf/installation/nginx-waf-min-configuration.md"

### 7. Restart NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx.md"

### 8. Test Wallarm WAF operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Dynamic Wallarm WAF module with default settings is installed for NGINX Plus. To customize Wallarm WAF settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options.md"
