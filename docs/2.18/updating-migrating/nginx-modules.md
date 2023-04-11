[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[attacks-in-ui-image]:           ../images/admin-guides/test-attacks-quickstart-sqli-xss.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[scanner-allowlisting-instr]:       ../admin-en/scanner-ips-allowlisting.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Upgrading Wallarm NGINX modules

These instructions describe the steps to update Linux node packages to version 2.18. Linux node packages are packages installed in accordance with one of the following instructions:

* [NGINX `stable` module](../installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../installation/nginx-plus.md)
* [Kong module](../admin-en/installation-kong-en.md)

## Update procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instrutions below to update all packages.
* If filtering node and postanalytics modules are installed on different servers, then first update the postanalytics module following these [instructions](separate-postanalytics.md) and perform the steps below for filtering node modules.

## Step 1: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/2.18/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/2.18/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
    ```

**Debian and Ubuntu**

1. Open the file with the Wallarm repository address in the installed text editor. In these instructions, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 9.x (stretch)"
        ``` bash
        deb https://repo.wallarm.com/debian/wallarm-node stretch/2.18/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node stretch/2.18/
        deb https://repo.wallarm.com/debian/wallarm-node stretch-backports/2.18/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/2.18/
        ```
    === "Ubuntu 16.04 LTS (xenial)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node xenial/2.18/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/2.18/
        ```

## Step 2: Update Wallarm packages

### Filtering node and postanalytics on the same server

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```

### Filtering node and postanalytics on different servers

!!! warning "Sequence of steps to update the filtering node and postanalytics modules"
    If the filtering node and postanalytics modules are installed on different servers, then it is required to update the postanalytics packages before updating the filtering node packages.

1. Update postanalytics packages following these [instructions](separate-postanalytics.md).
2. Update Wallarm node packages:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```

## Step 3: Restart NGINX

--8<-- "../include/waf/restart-nginx-2.16.md"

## Step 4: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats-for-deprecated.md"

## Settings customization

The Wallarm modules are updated to version 2.18. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-216.md"
