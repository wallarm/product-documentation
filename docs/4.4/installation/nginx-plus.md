[img-wl-console-users]:             ../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../admin-en/installation-postanalytics-en/
[waf-mode-recommendations]:          ../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[versioning-policy]:                ../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx-plus/
[img-node-with-several-instances]:  ../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 custom/custom-nginx-version.md

# Installing dynamic Wallarm module for NGINX Plus

These instructions describe the steps to install Wallarm filtering node as a dynamic module for the official commercial version of NGINX Plus.

## Requirements

--8<-- "../include/waf/installation/nginx-plus-requirements-4.0.md"

## Installation options

--8<-- "../include/waf/installation/nginx-installation-options.md"

Installation commands for both options are described in the further instructions.

## Installation
    
### 1. Install NGINX Plus and dependencies

Install NGINX Plus and its dependencies using these [official NGINX instructions](https://www.nginx.com/resources/admin-guide/installing-nginx-plus/).

!!! info "Installing on Amazon Linux 2.0.2021x and lower"
    To install NGINX Plus on Amazon Linux 2.0.2021x and lower, use the CentOS 7 instructions.

### 2. Add Wallarm repositories

Wallarm node is installed and updated from the Wallarm repositories. To add repositories, use the commands for your platform:

=== "Debian 11.x (bullseye)"
    ```bash
    sudo apt -y install dirmngr
    curl -fSsL https://repo.wallarm.com/wallarm.gpg | sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/wallarm.gpg --import
    sudo chmod 644 /etc/apt/trusted.gpg.d/wallarm.gpg
    sh -c "echo 'deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb https://repo.wallarm.com/ubuntu/wallarm-node jammy/4.4/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
    ```bash
    sudo dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

### 3. Install Wallarm packages

#### Request processing and postanalytics on the same server

To run postanalytics and process the requests on the same server, the following packages are required:

* `nginx-plus-module-wallarm` for the NGINX Plus-Wallarm module
* `wallarm-node` for the postanalytics module, Tarantool database, and additional NGINX Plus-Wallarm packages

=== "Debian"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt -y install --no-install-recommends wallarm-node nginx-plus-module-wallarm
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```
=== "RHEL 8.x"
    ```bash
    sudo yum install -y wallarm-node nginx-plus-module-wallarm
    ```

#### Request processing and postanalytics on different servers

To run postanalytics and process the requests on different servers, the following packages are required:

* `wallarm-node-nginx` and `nginx-plus-module-wallarm` for the NGINX Plus-Wallarm module

    === "Debian"
        ```bash
        sudo apt -y install --no-install-recommends wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt -y install --no-install-recommends wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-plus-module-wallarm
        ```
    === "RHEL 8.x"
        ```bash
        sudo yum install -y wallarm-node-nginx nginx-plus-module-wallarm
        ```

* `wallarm-node-tarantool` on the separate server for the postanalytics module and Tarantool database (installation steps are described in the [instructions](../admin-en/installation-postanalytics-en.md))

### 4. Connect the Wallarm module

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

### 5. Connect the filtering node to Wallarm Cloud

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.4.md"

### 6. Update Wallarm node configuration

--8<-- "../include/waf/installation/nginx-waf-min-configuration-4.4.md"

### 7. Restart NGINX Plus

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### 8. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Settings customization

The dynamic Wallarm module with default settings is installed for NGINX Plus. To customize Wallarm node settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-4.4.md"
