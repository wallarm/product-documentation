[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Upgrading Wallarm NGINX modules

These instructions describe the steps to upgrade the Wallarm NGINX modules 3.4 or 3.2 to version 3.6. Wallarm NGINX modules are the modules installed in accordance with one of the following instructions:

* [NGINX `stable` module](../waf-installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../waf-installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../waf-installation/nginx-plus.md)
* [Kong module](../admin-en/installation-kong-en.md)

To upgrade the node 2.18 or lower, please use the [different instructions](older-versions/nginx-modules.md).

## Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all packages.
* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module following these [instructions](separate-postanalytics.md) and then perform the steps below for filtering node modules.

## Step 1: Upgrade NGINX to the latest stable version

Update [NGINX](http://nginx.org/en/download.html) / [NGINX Plus](https://docs.nginx.com/nginx/releases/) to the latest stable release from the official NGINX repository.

If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the API Security module for a custom version of NGINX.

## Step 2: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CloudLinux OS 6.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/6/3.6/x86_64/Packages/wallarm-node-repo-1-6.el6.noarch.rpm
    ```
=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "Support for CentOS 8.x has been deprecated"
        Support for CentOS 8.x [has been deprecated](https://www.centos.org/centos-linux-eol/). You can install the Wallarm node 3.6 on the AlmaLinux, Rocky Linux or Oracle Linux 8.x operating system insted.

        * [Installation instructions for NGINX `stable`](../waf-installation/nginx/dynamic-module.md)
        * [Installation instructions for NGINX from CentOS/Debian repositories](../waf-installation/nginx/dynamic-module-from-distr.md)
        * [Installation instructions for NGINX Plus](../waf-installation/nginx-plus.md)

**Debian and Ubuntu**

1. Open the file with the Wallarm repository address in the installed text editor. In these instructions, **vim** is used.

    ```bash
    sudo vim /etc/apt/sources.list.d/wallarm.list
    ```
2. Comment out or delete the previous repository address.
3. Add a new repository address:

    === "Debian 9.x (stretch)"
        ``` bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.6/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.6/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/3.6/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/3.6/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/3.6/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/
        ```

## Step 3: Upgrade Wallarm API Security packages

### Filtering node and postanalytics on the same server

Execute the following command to upgrade the filtering node and postanalytics modules:

=== "Debian"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"
=== "Ubuntu"
    ```bash
    sudo apt update
    sudo apt dist-upgrade
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum update
    ```

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

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum update
        ```

## Step 4: Update the Wallarm blocking page

In the new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#when-upgrading-node-34). The logo and support email on the page are now empty by default.

If the page `&/usr/share/nginx/html/wallarm_blocked.html` was configured to be returned in response to the blocked requests, [copy and customize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.

## Step 5: Rename deprecated NGINX directives

Rename the following NGINX directives if they are explicitly specified in configuration files:

* `wallarm_instance` → [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../admin-en/configure-parameters-en.md#wallarm_protondb_path)

We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.

## Step 6: Restart NGINX

--8<-- "../include/waf/restart-nginx-2.16.md"

## Step 7: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Wallarm API Security modules are updated to version 3.4. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
