[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Updating Linux node packages

These instructions describe the steps to update Linux node packages to version 3.0. Linux node packages are packages installed in accordance with one of the following instructions:

* [NGINX `stable` module](../waf-installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../waf-installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../waf-installation/nginx-plus.md)
* [Kong module](../admin-en/installation-kong-en.md)

!!! warning "Breaking changes and skipping partner node update"
    * The Wallarm node 3.0 is **totally incompatible with previous Wallarm node versions**. Before updating the modules up to 3.0, please carefully review the list of [Wallarm node 3.0 changes](what-is-new.md) and consider a possible configuration change.
    * We do NOT recommend updating [partner node](../partner-waf-node/overview.md) up to version 3.0, since most changes will be fully supported only in partner node [3.2](versioning-policy.md#version-list).

## Update procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instrutions below to update all packages.
* If filtering node and postanalytics modules are installed on different servers, then first update the postanalytics module following these [instructions](separate-postanalytics.md) and perform the steps below for filtering node modules.

## Step 1: Inform Wallarm technical support that you are updating filtering node modules

Please inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.0 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open the Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.

## Step 2: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2**

=== "CentOS 7 and Amazon Linux 2"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.0/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/3.0/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
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
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.0/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.0/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/3.0/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/3.0/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/3.0/
        ```

## Step 3: Migrate whitelists and blacklists from previous Wallarm node version to 3.0

Migrate whitelists and blacklists configuration from previous Wallarm node version to 3.0 following the [instructions](migrate-ip-lists-to-node-3.md).

## Step 4: Update Wallarm API Security packages

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
=== "CentOS или Amazon Linux 2"
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
    === "CentOS или Amazon Linux 2"
        ```bash
        sudo yum update
        ```

## Step 5: Restart NGINX

--8<-- "../include/waf/restart-nginx-2.16.md"

## Step 6: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Wallarm API Security modules are updated to version 3.0. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
