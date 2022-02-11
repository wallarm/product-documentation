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

These instructions describe the steps to update Linux node packages to version 3.2. Linux node packages are packages installed in accordance with one of the following instructions:

* [NGINX `stable` module](../waf-installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../waf-installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../waf-installation/nginx-plus.md)
* [Kong module](../admin-en/installation-kong-en.md)

!!! warning "Breaking changes and recommendations for different node type update"
    * The Wallarm node 3.x is **totally incompatible with Wallarm node of version 2.18 and lower**. Before updating the modules up to 3.2, please carefully review the list of [Wallarm node changes](what-is-new.md) and consider a possible configuration change.
    * We recommend to update both the regular (client) and [partner](../partner-waf-node/overview.md) nodes of version 3.0 or lower up to version 3.2. This release enables IP greylists and other new features and stabilizes Wallarm node operation.

## Update procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instrutions below to update all packages.
* If filtering node and postanalytics modules are installed on different servers, then first update the postanalytics module following these [instructions](separate-postanalytics.md) and perform the steps below for filtering node modules.

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules

If updating Wallarm node 2.18 or lower, please inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.2 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open the Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.

## Step 2: Update NGINX to the latest stable version

Update [NGINX](http://nginx.org/en/download.html) / [NGINX Plus](https://docs.nginx.com/nginx/releases/) to the latest stable release from the official NGINX repository.

If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the API Security module for a custom version of NGINX.

## Step 3: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2**

=== "CentOS 7 and Amazon Linux 2"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/3.2/x86_64/Packages/wallarm-node-repo-1-6.el7.noarch.rpm
    ```
=== "CentOS 8"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/3.2/x86_64/Packages/wallarm-node-repo-1-6.el8.noarch.rpm
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
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.2/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/3.2/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/3.2/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/3.2/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/3.2/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node focal/3.2/
        ```

## Step 4: Migrate whitelists and blacklists from previous Wallarm node version to 3.2

If updating Wallarm node 2.18 or lower, migrate whitelist and blacklist configuration from previous Wallarm node version to 3.2 following the [instructions](migrate-ip-lists-to-node-3.md).

## Step 5: Update Wallarm API Security packages

### Filtering node and postanalytics on the same server

1. Execute the following command to upgrade the filtering node and postanalytics modules:

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
2. If the package manager asks for confirmation to rewrite the content of the configuration file `/etc/cron.d/wallarm-node-nginx`:

    1. Ensure that the [IP lists migration](#step-4-migrate-whitelists-and-blacklists-from-previous-wallarm-node-version-to-32) is completed.
    2. Confirm the file rewrite by using the option `Y`.

        The package manager would ask for the rewrite confirmation if the file `/etc/cron.d/wallarm-node-nginx` had been [changed in the previous Wallarm node versions](/2.18/admin-en/configure-ip-blocking-nginx-en/). Since IP list logic was changed in Wallarm node 3.2, the `/etc/cron.d/wallarm-node-nginx` content was updated accordingly. For the IP address blacklist to operate correctly, the Wallarm node 3.x should use the updated configuration file.

        By default, the package manager uses the option `N` but the option `Y` is required for the correct IP address blacklist operation in Wallarm node 3.x.

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
3. If the package manager asks for confirmation to rewrite the content of the configuration file `/etc/cron.d/wallarm-node-nginx`:

    1. Ensure that the [IP lists migration](#step-4-migrate-whitelists-and-blacklists-from-previous-wallarm-node-version-to-32) is completed.
    2. Confirm the file rewrite by using the option `Y`.

        The package manager would ask for the rewrite confirmation if the file `/etc/cron.d/wallarm-node-nginx` had been [changed in the previous Wallarm node versions](/2.18/admin-en/configure-ip-blocking-nginx-en/). Since IP list logic was changed in Wallarm node 3.2, the `/etc/cron.d/wallarm-node-nginx` content was updated accordingly. For the IP address blacklist to operate correctly, the Wallarm node 3.x should use the updated configuration file.

        By default, the package manager uses the option `N` but the option `Y` is required for the correct IP address blacklist operation in Wallarm node 3.x.

## Step 6: Adjust Wallarm node filtration mode settings to changes released in version 3.2

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md):
      * [Directive `wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in the Wallarm Console](../user-guides/settings/general.md)
      * [Low-level filtration rules configured in the Wallarm Console](../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../admin-en/configure-wallarm-mode.md).

## Step 7: Restart NGINX

--8<-- "../include/waf/restart-nginx-2.16.md"

## Step 8: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Settings customization

Wallarm API Security modules are updated to version 3.2. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
