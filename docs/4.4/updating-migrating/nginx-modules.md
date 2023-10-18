[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md

# Upgrading Wallarm NGINX modules

These instructions describe the steps to upgrade the Wallarm NGINX modules 4.x to version 4.4. Wallarm NGINX modules are the modules installed in accordance with one of the following instructions:

* [NGINX `stable` module](../installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../installation/nginx-plus.md)

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/nginx-modules.md).

## Requirements

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all packages.
* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module following these [instructions](separate-postanalytics.md) and then perform the steps below for filtering node modules.

## Step 1: Upgrade NGINX to the latest version

Upgrade NGINX to the latest version using the relevant instructions:

=== "NGINX stable"

    DEB-based distributions:

    ```bash
    sudo apt update
    sudo apt -y install nginx
    ```

    RPM-based distributions:

    ```bash
    sudo yum update
    sudo yum install -y nginx
    ```
=== "NGINX Plus"
    For NGINX Plus, please follow the [official upgrade instructions](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/#upgrading-nginx-plus).
=== "NGINX from Debian/CentOS repository"
    For NGINX [installed from Debian/CentOS repository](../installation/nginx/dynamic-module-from-distr.md), please skip this step. The installed NGINX version will be upgraded [later](#step-4-upgrade-wallarm-packages) along with the Wallarm modules.

If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the Wallarm module for a custom version of NGINX.

## Step 2: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
    ```

**Debian and Ubuntu**

1. Open the file with the Wallarm repository address in the installed text editor. In these instructions, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 10.x (buster)"
        !!! warning "Unsupported by NGINX stable and NGINX Plus"
            Official NGINX versions (stable and Plus) and, as a result, Wallarm node 4.4 and above cannot be installed on Debian 10.x (buster). Please use this OS only if [NGINX is installed from Debian/CentOS repositories](../installation/nginx/dynamic-module-from-distr.md).

        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.4/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.4/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.4/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/
        ```

## Step 3: Upgrade Wallarm packages

### Filtering node and postanalytics on the same server

1. Execute the following command to upgrade the filtering node and postanalytics modules:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
2. If the package manager asks for confirmation to rewrite the content of the configuration file `/etc/cron.d/wallarm-node-nginx`, send the option `Y`.

    The `/etc/cron.d/wallarm-node-nginx` content should be updated for the new script counting RPS to be downloaded.

    By default, the package manager uses the option `N` but the option `Y` is required for correct RPS counting.

### Filtering node and postanalytics on different servers

!!! warning "Sequence of steps to upgrade the filtering node and postanalytics modules"
    If the filtering node and postanalytics modules are installed on different servers, then it is required to upgrade the postanalytics packages before updating the filtering node packages.

1. Upgrade postanalytics packages following these [instructions](separate-postanalytics.md).
2. Upgrade Wallarm node packages:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.4.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
3. If the package manager asks for confirmation to rewrite the content of the configuration file `/etc/cron.d/wallarm-node-nginx`, send the option `Y`.

    The `/etc/cron.d/wallarm-node-nginx` content should be updated for the new script counting RPS to be downloaded.

    By default, the package manager uses the option `N` but the option `Y` is required for correct RPS counting.

## Step 4: Restart NGINX

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## Step 5: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Settings customization

The Wallarm modules are updated to version 4.4. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
