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
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss

# Upgrading Wallarm NGINX modules

These instructions describe the steps to upgrade the Wallarm NGINX modules 4.x to version 4.6. Wallarm NGINX modules are the modules installed in accordance with one of the following instructions:

* [Individual packages for NGINX stable](../installation/nginx/dynamic-module.md)
* [Individual packages for NGINX Plus](../installation/nginx-plus.md)
* [Individual packages for distribution-provided NGINX](../installation/nginx/dynamic-module-from-distr.md)

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/nginx-modules.md).

## Upgrade methods

You can upgrade the Wallarm NGINX modules 4.x installed from individual DEB/RPM packages to version 4.6 in two different ways:

* Migrate to the [all-in-one installer](#upgrade-with-all-in-one-automatic-installer) usage during the upgrade procedure. This is the recommended approach as it automates various node installation and upgrade activities, such as NGINX and OS version identification and others (see the table below).
* Keep using the current [manual](#manual-upgrade) installation method If you prefer to stick with the current installation method using individual DEB/RPM packages. However, it's important to note that this approach might require additional effort and manual configuration during the upgrade process in comparison to the new method for Wallarm node installation on Debian/Ubuntu operating systems.

| Position to compare | All-in-one installer | Manual upgrade |
|---------------------|----------------------|----------------|
| Machine         | New or cleared from previous installation | The same  |
| Checking your OS and NGINX version | Automatically | Manually  |
| Adding Wallarm repositories for the detected OS and NGINX version | Automatically | Run CLI script manually  |
| Installing Wallarm packages | Automatically | Run CLI script manually  |
| Connecting the installed Wallarm module to your NGINX| Automatically | Run CLI script manually  |
| Connecting the filtering node to Wallarm Cloud using the provided token | Automatically | Run CLI script manually  |
| Future updates of your node components | Run a new version of all-in-one installer | Download and install components via CLI manually |

* "Automatically" means you only once run all-in-one installer, the remaining it does by itself.

## Upgrade with all-in-one automatic installer

Use the procedure below to upgrade the Wallarm NGINX modules 4.x to version 4.6 using [all-in-one automatic installer](../installation/nginx/all-in-one.md).

### Requirements for all-in-one upgrade

--8<-- "../include/waf/installation/all-in-one-requirements.md"

### Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all.

    You will need to run a node of the newer version using all-in-one installer on a clean machine, test that it works well and stop the previous one and configure traffic to flow through the new machine instead of the previous one.

* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module and **then** the filtering module following these [instructions](../updating-migrating/separate-postanalytics.md).

### Step 1: Prepare clean machine

When upgrading from node 4.x to 4.6 with all-in-one installer, you cannot upgrade an old package installation - instead you need to use a clean machine. Thus, as step 1, prepare a machine with the [appropriate OS](#requirements-for-all-in-one-upgrade) within you environment.

This will lead to that at some moment you will have both old and new node, which is good: you can test the new one working properly without stopping the old one.

**Alternative**

You can also clean the old machine from installed Wallarm packages and then install the new node into this cleaned machine.

The following packages should be removed:

* `nginx-module-wallarm` for the NGINX-Wallarm module
* `wallarm-node` for the [postanalytics][install-postanalytics-docs] module, Tarantool database, and additional NGINX-Wallarm packages

=== "Debian"
    ```bash
    sudo apt remove wallarm-node nginx-module-wallarm
    ```
=== "Ubuntu"
    ```bash
    sudo apt remove wallarm-node nginx-module-wallarm
    ```
=== "CentOS or Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node nginx-module-wallarm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node nginx-module-wallarm
    ```

### Step 2: Install NGINX and dependencies

--8<-- "../include/waf/installation/all-in-one-nginx.md"

### Step 3: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

### Step 4: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

### Step 5: Run all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

Commands in the further steps are the same for x86_64 and ARM64 installations.

### Step 6: Enable Wallarm node to analyze traffic

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

### Step 7: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### Step 8: Test Wallarm node operation

To test the new node operation:

1. Send the request with test [SQLI][sqli-attack-docs] and [XSS][xss-attack-docs] attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Open the Wallarm Console → **Events** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and ensure attacks are displayed in the list.
1. As soon as your Cloud stored data (rules, IP lists) is synchronized to the new node, perform some test attacks to make sure your rules work as expected.

### Step 9: Configure sending traffic to Wallarm node

Depending on the deployment approach being used, perform the following settings:

=== "In-line"
    Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.

    Before full redirecting of the traffic to the new node, it is recommended to first redirect it partially and check that the new node behaves as expected.

=== "Out-of-Band"
    Configure your web or proxy server (e.g. NGINX, Envoy) to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web or proxy server documentation.

    Inside the [link][web-server-mirroring-examples], you will find the example configuration for the most popular of web and proxy servers (NGINX, Traefik, Envoy).

### Step 10: Remove old node

1. Delete old node in Wallarm Console → **Nodes** by selecting your node and clicking **Delete**.
1. Confirm the action.
    
    When the node is deleted from Cloud, it will stop filtration of requests to your applications. Deleting the filtering node cannot be undone. The node will be deleted from the list of nodes permanently.

1. Delete machine with the old node or just clean it from Wallarm node components:

    === "Debian"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "Ubuntu"
        ```bash
        sudo apt remove wallarm-node nginx-module-wallarm
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## Manual upgrade

Use the procedure below to manually upgrade the Wallarm NGINX modules 4.x to version 4.6.

### Requirements for manual upgrade

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

### Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all packages.
* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module following these [instructions](separate-postanalytics.md) and then perform the steps below for filtering node modules.

### Step 1: Upgrade NGINX to the latest version

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

### Step 2: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
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
        deb https://repo.wallarm.com/debian/wallarm-node buster/4.6/
        ```
    === "Debian 11.x (bullseye)"
        ```bash
        deb https://repo.wallarm.com/debian/wallarm-node bullseye/4.6/
        ```
    === "Ubuntu 18.04 LTS (bionic)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node bionic/4.6/
        ```
    === "Ubuntu 20.04 LTS (focal)"
        ```bash
        deb https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/
        ```

### Step 3: Upgrade Wallarm packages

#### Filtering node and postanalytics on the same server

1. Execute the following command to upgrade the filtering node and postanalytics modules:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.6.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.6.md"

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

#### Filtering node and postanalytics on different servers

!!! warning "Sequence of steps to upgrade the filtering node and postanalytics modules"
    If the filtering node and postanalytics modules are installed on different servers, then it is required to upgrade the postanalytics packages before updating the filtering node packages.

1. Upgrade postanalytics packages following these [instructions](separate-postanalytics.md).
2. Upgrade Wallarm node packages:

    === "Debian"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.6.md"

        --8<-- "../include/waf/upgrade/details-about-dist-upgrade.md"
    === "Ubuntu"
        ```bash
        sudo apt update
        sudo apt dist-upgrade
        ```

        --8<-- "../include/waf/upgrade/warning-expired-gpg-keys-4.6.md"

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

### Step 4: Update the node type

!!! info "Only for nodes installed using the `addnode` script"
    Only follow this step if a node of a previous version is connected to the Wallarm Cloud using the `addnode` script. This script has been [removed](what-is-new.md#removal-of-the-email-password-based-node-registration) and replaced by the `register-node`, which requires a token to register the node in the Cloud.

1. Make sure that your Wallarm account has the **Administrator** role by navigating to the user list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]

    !!! info "If the postanalytics module is installed on a separate server"
        If the initial traffic processing and postanalytics modules are installed on separate servers, it is recommended to connect these modules to the Wallarm Cloud using the same node token. The Wallarm Console UI will display each module as a separate node instance, e.g.:

        ![!Node with several instances](../images/user-guides/nodes/wallarm-node-with-two-instances.png)

        The Wallarm node has already been created during the [separate postanalytics module upgrade](separate-postanalytics.md). To connect the initial traffic processing module to the Cloud using the same node credentials:

        1. Copy the node token generated during the separate postanalytics module upgrade.
        1. Proceed to the 4th step in the list below.
1. Copy the generated token.
1. Pause the NGINX service to mitigate the risk of incorrect RPS calculation:

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
1. Execute the `register-node` script to run the **Wallarm node**:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com --force
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> --force
        ```
    
    * `<TOKEN>` is the copied value of the node token or API token with the `Deploy` role.
    * The `--force` option forces rewriting of the Wallarm Cloud access credentials specified in the `/etc/wallarm/node.yaml` file.

    <div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You have two options for using one token for several installations:</p> <ul><li>**For all node versions**, you can use one [**node token**](../quickstart.md#deploy-the-wallarm-filtering-node) in several installations regardless of the selected [platform](../installation/supported-deployment-options.md). It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</li><li><p>**Starting from node 4.6**, for nodes grouping, you can use one [**API token**](../user-guides/settings/api-tokens.md) with the `Deploy` role together with the `--labels 'group=<GROUP>'` flag, for example:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>

### Step 5: Update the Wallarm blocking page

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the page `&/usr/share/nginx/html/wallarm_blocked.html` was configured to be returned in response to blocked requests, [copy and customize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.

### Step 6: Restart NGINX

--8<-- "../include/waf/restart-nginx-3.6.md"

### Step 7: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

### Settings customization

The Wallarm modules are updated to version 4.6. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
