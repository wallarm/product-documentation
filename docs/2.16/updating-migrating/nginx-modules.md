[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
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

# Updating Linux WAF packages

This instruction describes the steps to update Linux WAF packages installed according to the instructions below to the version 2.16.

* [NGINX `stable` module](../waf-installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../waf-installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../waf-installation/nginx-plus.md)
* [Kong module](../admin-en/installation-kong-en.md)

## Update procedure

* If WAF node and postanalytics modules are installed on the same server, follow the instrutions below to update all packages.
* If WAF node and postanalytics modules are installed on different servers, first update the postanalytics module following these [instructions](separate-postanalytics.md) and perform the steps below for WAF node modules.

## Step 1: Add new Wallarm WAF repositories

=== "Debian 9.x (stretch)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/2.16/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Debian 9.x (stretch-backports)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch/2.16/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/2.16/' | sudo tee --append /etc/apt/sources.list.d/wallarm.list"
    # for correct WAF operation, uncomment the following line in /etc/apt/sources.list`:
    # deb http://deb.debian.org/debian stretch-backports main contrib non-free
    sudo apt update
    ```
=== "Debian 10.x (buster)"
    ```bash
    sudo apt install dirmngr
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/debian/wallarm-node buster/2.16/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node xenial/2.16/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sh -c "echo 'deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/2.16/' | sudo tee /etc/apt/sources.list.d/wallarm.list"
    sudo apt update
    ```
=== "CentOS 7.x"
    ```bash
    sudo yum install -y epel-release
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.16/x86_64/Packages/wallarm-node-repo-1-5.el7.noarch.rpm
    ```
=== "Amazon Linux 2"
    ```bash
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.16/x86_64/Packages/wallarm-node-repo-1-5.el7.noarch.rpm
    ```

## Step 2: Update Wallarm WAF packages

### WAF node and postanalytics on the same server

=== "Debian"
    ```bash
    sudo apt install wallarm-node --no-install-recommends
    ```
=== "Ubuntu"
    ```bash
    sudo apt install wallarm-node --no-install-recommends
    ```
=== "CentOS or Amazon Linux 2"
    ```bash
    sudo yum update wallarm-node
    ```

### WAF node and postanalytics on different servers

1. Update postanalytics packages following these [instructions](separate-postanalytics.md).
2. Update WAF node packages:

    === "Debian"
        ```bash
        sudo apt install wallarm-node-nginx --no-install-recommends
        ```
    === "Ubuntu"
        ```bash
        sudo apt install wallarm-node-nginx --no-install-recommends
        ```
    === "CentOS или Amazon Linux 2"
        ```bash
        sudo yum update wallarm-node-nginx
        ```

## Step 3: Restart NGINX

--8<-- "../include/waf/restart-nginx-2.16.md"

## Step 4: Test Wallarm WAF operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Wallarm WAF modules are updated to version 2.16. Previous WAF node settings will be applied to a new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options.md"
