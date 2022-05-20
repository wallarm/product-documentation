[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[sqli-attack-desc]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[enable-libdetection-docs]:         ../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png

# Upgrading Wallarm NGINX modules 2.18 or lower

These instructions describe the steps to upgrade the Wallarm NGINX modules 2.18 or lower to version 4.0. Wallarm NGINX modules are the modules installed in accordance with one of the following instructions:

* [NGINX `stable` module](../../waf-installation/nginx/dynamic-module.md)
* [Module for NGINX from CentOS/Debian repositories](../../waf-installation/nginx/dynamic-module-from-distr.md)
* [NGINX Plus module](../../waf-installation/nginx-plus.md)
* [Kong module](../../admin-en/installation-kong-en.md)

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all packages.
* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module following these [instructions](separate-postanalytics.md) and then perform the steps below for filtering node modules.

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules

Inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 4.0 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../../user-guides/ip-lists/overview.md) is available.

## Step 2: Disable the Active threat verification module (if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Active threat verification](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification) module in Wallarm Console → **Scanner** → **Settings**.

The module operation can cause [false positives](../../about-wallarm-waf/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

## Step 3: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 4: Upgrade NGINX to the latest stable version

Update [NGINX](http://nginx.org/en/download.html) / [NGINX Plus](https://docs.nginx.com/nginx/releases/) to the latest stable release from the official NGINX repository.

If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the API Security module for a custom version of NGINX.

## Step 5: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CloudLinux OS 6.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/6/4.0/x86_64/wallarm-node-repo-4-0.el6.noarch.rpm
    ```
=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.0/x86_64/wallarm-node-repo-4-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "Support for CentOS 8.x has been deprecated"
        Support for CentOS 8.x [has been deprecated](https://www.centos.org/centos-linux-eol/). You can install the Wallarm node on the AlmaLinux, Rocky Linux or Oracle Linux 8.x operating system insted.

        * [Installation instructions for NGINX `stable`](../../waf-installation/nginx/dynamic-module.md)
        * [Installation instructions for NGINX from CentOS/Debian repositories](../../waf-installation/nginx/dynamic-module-from-distr.md)
        * [Installation instructions for NGINX Plus](../../waf-installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.0/x86_64/wallarm-node-repo-4-0.el8.noarch.rpm
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
        deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/
        ```
    === "Debian 9.x (stretch-backports)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node stretch/4.0/
        deb http://repo.wallarm.com/debian/wallarm-node stretch-backports/4.0/
        ```
    === "Debian 10.x (buster)"
        ```bash
        deb http://repo.wallarm.com/debian/wallarm-node buster/4.0/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node bionic/4.0/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb http://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/
        ```

## Step 6: Migrate whitelists and blacklists from the previous Wallarm node version to 4.0

[Migrate](../migrate-ip-lists-to-node-3.md) whitelist and blacklist configuration from previous Wallarm node version to 4.0.

## Step 7: Upgrade Wallarm API Security packages

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
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum update
    ```

    --8<-- "../include/waf/upgrade/warning-expired-gpg-keys.md"

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
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum update
        ```
3. If the package manager asks for confirmation to rewrite the content of the configuration file `/etc/cron.d/wallarm-node-nginx`:

    1. Ensure that the [IP lists migration](#step-6-migrate-whitelists-and-blacklists-from-previous-wallarm-node-version-to-40) is completed.
    2. Confirm the file rewrite by using the option `Y`.

        The package manager would ask for the rewrite confirmation if the file `/etc/cron.d/wallarm-node-nginx` had been [changed in the previous Wallarm node versions](/2.18/admin-en/configure-ip-blocking-nginx-en/). Since IP list logic was changed in Wallarm node 3.x, the `/etc/cron.d/wallarm-node-nginx` content was updated accordingly. For the IP address blacklist to operate correctly, the Wallarm node 3.x should use the updated configuration file.

        By default, the package manager uses the option `N` but the option `Y` is required for the correct IP address blacklist operation in Wallarm node 3.x.

## Step 8: Update the node type

The deployed node has the deprecated **regular** type that is [now replaced with the new **Wallarm node** type](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

It is recommended to install the new node type instead of the deprecated one during migration to the version 4.0. The regular node type will be removed in future releases, please migrate before.

!!! info "If the postanalytics module is installed on a separate server"
    If the initial traffic processing and postanalytics modules are installed on separate servers, it is recommended to connect these modules to the Wallarm Cloud using the same node token. The Wallarm Console UI will display each module as a separate node instance, e.g.:

    ![!Node with several instances](../../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    The Wallarm node has already been created during the [separate postanalytics module upgrade](separate-postanalytics.md). To connect the initial traffic processing module to the Cloud using the same node credentials:

    1. Copy the node token generated during the separate postanalytics module upgrade.
    1. Proceed to the 4th step in the list below.

To replace the regular node with the Wallarm node:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the user list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Pause the NGINX service on the server with the node of the older version:

    === "Debian"
        ```bash
        sudo systemctl stop nginx
        ```
    === "Ubuntu"
        ```bash
        sudo service nginx stop
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo systemctl stop nginx
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo systemctl stop nginx
        ```

    The NGINX service pausing mitigates the risk of incorrect RPS calculation.
1. Execute the `register-node` script to run the **Wallarm node**:

    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> --force
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com --force
        ```
    
    * `<NODE_TOKEN>` is the Wallarm node token.
    * The `--force` option forces rewriting of the Wallarm Cloud access credentials specified in the `/etc/wallarm/node.yaml` file.

## Step 9: Update the Wallarm blocking page

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the page `&/usr/share/nginx/html/wallarm_blocked.html` was configured to be returned in response to blocked requests, [copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.

## Step 10: Rename deprecated NGINX directives

Rename the following NGINX directives if they are explicitly specified in configuration files:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.

## Step 11: Adjust Wallarm node filtration mode settings to changes released in the latest versions

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../user-guides/settings/general.md)
      * [Low-level filtration rules configured in Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

## Step 12: Restart NGINX

--8<-- "../include/waf/restart-nginx-3.6.md"

## Step 13: Test Wallarm node operation

1. Send the request with test [SQLI][sqli-attack-desc] and [XSS][xss-attack-desc] attacks to the application address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
1. Make sure the node of the new type processes the request in the same way as the **regular** node did, e.g.:

    * Blocks the request if the appropriate [filtration mode](../../admin-en/configure-wallarm-mode.md) is configured.
    * Returns the [custom blocking page](../../admin-en/configuration-guides/configure-block-page-and-code.md) if it is configured.
2. Open Wallarm Console → **Events** in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and make sure that:

    * Attacks are displayed in the list.
    * Hit details display the Wallarm node UUID.

    ![!Attacks in the interface][img-test-attacks-in-ui]

## Step 14: Re-enable the Active threat verification module (if upgrading node 2.16 or lower)

Learn the [recommendation on the Active threat verification module setup](../../admin-en/attack-rechecker-best-practices.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Step 15: Delete the node of the previous version

Once the operation of the new node is properly tested, open the **Nodes** section of Wallarm Console and delete the regular node of the previous version from the list.

If the postanalytics module is installed on a separate server, please also delete the node instance related to this module.

## Settings customization

Wallarm API Security modules are updated to version 4.0. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx.md"
