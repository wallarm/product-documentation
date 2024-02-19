[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[img-wl-console-users]:             ../../images/check-users.png 
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../installation/custom/custom-nginx-version.md
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:          ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                    ../../user-guides/ip-lists/graylist.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../../installation/oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Upgrading EOL Wallarm NGINX modules

These instructions describe the steps to upgrade the end‑of‑life Wallarm NGINX modules (version 3.6 and lower) to version 4.6. Wallarm NGINX modules are the modules installed in accordance with one of the following instructions:

* [Individual packages for NGINX stable](../../installation/nginx/dynamic-module.md)
* [Individual packages for NGINX Plus](../../installation/nginx-plus.md)
* [Individual packages for distribution-provided NGINX](../../installation/nginx/dynamic-module-from-distr.md)

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Inform Wallarm technical support that you are upgrading EOL  node

If upgrading the end‑of‑life Wallarm NGINX modules (version 3.6 and lower) to version 4.6, inform [Wallarm technical support](mailto:support@wallarm.com) about that and ask for assistance.

Besides any other help, ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../../user-guides/ip-lists/overview.md) is available.

## Upgrade methods

--8<-- "../include/waf/installation/upgrade-methods.md"

## Upgrade with all-in-one installer

Use the procedure below to upgrade the end‑of‑life Wallarm NGINX modules (version 3.6 and lower) to version 4.6 using [all-in-one installer](../../installation/nginx/all-in-one.md).

### Requirements for upgrade using all-in-one installer

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

### Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all.

    You will need to run a node of the newer version using all-in-one installer on a clean machine, test that it works well and stop the previous one and configure traffic to flow through the new machine instead of the previous one.

* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module and **then** the filtering module following these [instructions](separate-postanalytics.md).

### Step 1: Disable the Active threat verification module (if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Active threat verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) module in Wallarm Console → **Vulnerabilities** → **Configure**.

The module operation can cause [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

### Step 2: Prepare clean machine

--8<-- "../include/waf/installation/all-in-one-clean-machine.md"

### Step 3: Install NGINX and dependencies

--8<-- "../include/waf/installation/all-in-one-nginx.md"

### Step 4: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

### Step 5: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download-4.6.md"

### Step 6: Run all-in-one Wallarm installer

#### Filtering node and postanalytics on the same server

--8<-- "../include/waf/installation/all-in-one-installer-run-4.6.md"

#### Filtering node and postanalytics on different servers

!!! warning "Sequence of steps to upgrade the filtering node and postanalytics modules"
    If the filtering node and postanalytics modules are installed on different servers, then it is required to upgrade the postanalytics packages before updating the filtering node packages.

1. Upgrade postanalytics module following these [instructions](separate-postanalytics.md).
1. Upgrade filtering node:

    === "API token"
        ```bash
        # If using the x86_64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.16.aarch64-glibc.sh filtering
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        ```bash
        # If using the x86_64 version:
        sudo sh wallarm-4.6.16.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo sh wallarm-4.6.16.aarch64-glibc.sh filtering
        ```

### Step 7: Migrate allowlists and denylists from the previous Wallarm node version to 4.6 (only if upgrading node 2.18 or lower)

If upgrading node 2.18 or lower, [migrate](../migrate-ip-lists-to-node-3.md) allowlist and denylist configuration from previous Wallarm node version to the latest version.

### Step 8: Transfer NGINX and postanalytics configuration from old node machine to new

Transfer node-related NGINX configuration and postanalytics configuration from the configuration files on the old machine to the files on a new machine. You can do that by copying the required directives.

**Source files**

On an old machine, depending on OS and NGINX version, the NGINX configuration files may be located in different directories and have different names. Most common are the following:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, the `default.conf` is usually used or new configuration file is created for each domain group (for example, `example.com.conf` and `test.com.conf`). Detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
    
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]

Also, the configuration of the postanalytics module (Tarantool database settings) is usually located here:

* `/etc/default/wallarm-tarantool` or
* `/etc/sysconfig/wallarm-tarantool`

**Target files**

As all-in-one installer works with different combinations of OS and NGINX versions, on your new machine, the [target files](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) may have different names and be located in different directories.

When transferring configuration, you need to perform steps listed below.

#### Rename deprecated NGINX directives

Rename the following NGINX directives if they are explicitly specified in configuration files:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.

#### Update the node logging variables

In the new node version the following changes to the [node logging variables](../../admin-en/configure-logging.md#filter-node-variables) have been implemented:

* The `wallarm_request_time` variable has been renamed to `wallarm_request_cpu_time`.

    We only changed the variable name, its logic remains the same. The old name is temporarily supported as well, but still it is recommended to rename the variable.
* The `wallarm_request_mono_time` variable has been added – place it in the configuration of the logging format if you need log information about total time being the sum of:

    * Time in the queue
    * Time in seconds the CPU spent processing the request

#### Adjust Wallarm node filtration mode settings to changes released in the latest versions

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [Low-level filtration rules configured in Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

#### Transfer the `overlimit_res` attack detection configuration from directives to the rule

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

#### Update the `wallarm-status.conf` file contents

Update the `/etc/nginx/conf.d/wallarm-status.conf` contents as follows:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Access is only available for loopback addresses of the filter node server  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # Checking request sources is disabled, denylisted IPs are allowed to request the wallarm-status service. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[More details on the statistics service configuration](../../admin-en/configure-statistics-service.md)

#### Update the Wallarm blocking page

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the page `&/usr/share/nginx/html/wallarm_blocked.html` was configured to be returned in response to blocked requests, [copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.

### Step 9: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

### Step 10: Re-enable the Active threat verification module (only if upgrading node 2.16 or lower)

Learn the [recommendation on the Active threat verification module setup](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### Step 11: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

### Step 12: Test Wallarm node operation

To test the new node operation:

1. Send the request with test [SQLI][sqli-attack-docs] and [XSS][xss-attack-docs] attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Open the Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/search) or [EU Cloud](https://my.wallarm.com/search) and ensure attacks are displayed in the list.
1. As soon as your Cloud stored data (rules, IP lists) is synchronized to the new node, perform some test attacks to make sure your rules work as expected.

### Step 13: Configure sending traffic to Wallarm node

Depending on the deployment approach being used, perform the following settings:

=== "In-line"
    Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.

    Before full redirecting of the traffic to the new node, it is recommended to first redirect it partially and check that the new node behaves as expected.

=== "Out-of-Band"
    Configure your web or proxy server (e.g. NGINX, Envoy) to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web or proxy server documentation.

    Inside the [link][web-server-mirroring-examples], you will find the example configuration for the most popular of web and proxy servers (NGINX, Traefik, Envoy).

### Step 14: Remove old node

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
    === "RHEL 8.x"
        ```bash
        sudo yum remove wallarm-node nginx-module-wallarm
        ```

## Manual upgrade

### Requirements for manual upgrade

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

### Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all packages.
* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module following these [instructions](separate-postanalytics.md) and then perform the steps below for filtering node modules.

### Step 1: Disable the Active threat verification module (if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Active threat verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) module in Wallarm Console → **Vulnerabilities** → **Configure**.

The module operation can cause [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

### Step 2: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

### Step 3: Upgrade NGINX to the latest version

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
    For NGINX [installed from Debian/CentOS repository](../../installation/nginx/dynamic-module-from-distr.md), please skip this step. The installed NGINX version will be upgraded [later](#step-7-upgrade-wallarm-packages) along with the Wallarm modules.

If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the Wallarm module for a custom version of NGINX.

### Step 4: Add new Wallarm repository

Delete the previous Wallarm repository address and add a repository with a new Wallarm node version package. Please use the commands for the appropriate platform.

**CentOS and Amazon Linux 2.0.2021x and lower**

=== "CentOS 7 and Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```
=== "CentOS 8"
    !!! warning "Support for CentOS 8.x has been deprecated"
        Support for CentOS 8.x [has been deprecated](https://www.centos.org/centos-linux-eol/). You can install the Wallarm node on the AlmaLinux, Rocky Linux, Oracle Linux 8.x, or RHEL 8.x operating system instead.

        * [Installation instructions for NGINX `stable`](../../installation/nginx/dynamic-module.md)
        * [Installation instructions for NGINX from CentOS/Debian repositories](../../installation/nginx/dynamic-module-from-distr.md)
        * [Installation instructions for NGINX Plus](../../installation/nginx-plus.md)
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo yum remove wallarm-node-repo
    sudo yum clean all
    sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
    ```
=== "RHEL 8.x"
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
            Official NGINX versions (stable and Plus) and, as a result, Wallarm node 4.4 and above cannot be installed on Debian 10.x (buster). Please use this OS only if [NGINX is installed from Debian/CentOS repositories](../../installation/nginx/dynamic-module-from-distr.md).

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

### Step 5: Migrate allowlists and denylists from the previous Wallarm node version to 4.6 (only if upgrading node 2.18 or lower)

If upgrading node 2.18 or lower, [migrate](../migrate-ip-lists-to-node-3.md) allowlist and denylist configuration from previous Wallarm node version to the latest version.

### Step 6: Upgrade Wallarm packages

#### Filtering node and postanalytics on the same server

Execute the following command to upgrade the filtering node and postanalytics modules:

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
=== "RHEL 8.x"
    ```bash
    sudo yum update
    ```

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
    === "RHEL 8.x"
        ```bash
        sudo yum update
        ```
3. If the package manager asks for confirmation to rewrite the content of the configuration file `/etc/cron.d/wallarm-node-nginx`:

    1. Ensure that the [IP lists migration](#step-6-migrate-allowlists-and-denylists-from-previous-wallarm-node-version-to-42) is completed.
    2. Confirm the file rewrite by using the option `Y`.

        The package manager would ask for the rewrite confirmation if the file `/etc/cron.d/wallarm-node-nginx` had been [changed in the previous Wallarm node versions](/2.18/admin-en/configure-ip-blocking-nginx-en/). Since IP list logic was changed in Wallarm node 3.x, the `/etc/cron.d/wallarm-node-nginx` content was updated accordingly. For the IP address denylist to operate correctly, the Wallarm node 3.x should use the updated configuration file.

        By default, the package manager uses the option `N` but the option `Y` is required for the correct IP address denylist operation in Wallarm node 3.x.

### Step 7: Update the node type

The deployed node has the deprecated **regular** type that is [now replaced with the new **Wallarm node** type](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

It is recommended to install the new node type instead of the deprecated one during migration to the version 4.6. The regular node type will be removed in future releases, please migrate before.

!!! info "If the postanalytics module is installed on a separate server"
    If the initial traffic processing and postanalytics modules are installed on separate servers, it is recommended to connect these modules to the Wallarm Cloud using the same node token. The Wallarm Console UI will display each module as a separate node instance, e.g.:

    ![Node with several instances](../../images/user-guides/nodes/wallarm-node-with-two-instances.png)

    The Wallarm node has already been created during the [separate postanalytics module upgrade](separate-postanalytics.md). To connect the initial traffic processing module to the Cloud using the same node credentials:

    1. Copy the node token generated during the separate postanalytics module upgrade.
    1. Proceed to the 4th step in the list below.

To replace the regular node with the Wallarm node:

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![Wallarm node creation][img-create-wallarm-node]
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
    === "RHEL 8.x"
        ```bash
        sudo systemctl stop nginx
        ```

    The NGINX service pausing mitigates the risk of incorrect RPS calculation.
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

### Step 8: Update the Wallarm blocking page

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the page `&/usr/share/nginx/html/wallarm_blocked.html` was configured to be returned in response to blocked requests, [copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.

### Step 9: Rename deprecated NGINX directives

Rename the following NGINX directives if they are explicitly specified in configuration files:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.

### Step 10: Update the node logging variables

In the new node version the following changes to the [node logging variables](../../admin-en/configure-logging.md#filter-node-variables) have been implemented:

* The `wallarm_request_time` variable has been renamed to `wallarm_request_cpu_time`.

    We only changed the variable name, its logic remains the same. The old name is temporarily supported as well, but still it is recommended to rename the variable.
* The `wallarm_request_mono_time` variable has been added – place it in the configuration of the logging format if you need log information about total time being the sum of:

    * Time in the queue
    * Time in seconds the CPU spent processing the request

### Step 11: Adjust Wallarm node filtration mode settings to changes released in the latest versions

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console)
      * [Low-level filtration rules configured in Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

### Step 12: Transfer the `overlimit_res` attack detection configuration from directives to the rule

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### Step 13: Update the `wallarm-status.conf` file contents

Update the `/etc/nginx/conf.d/wallarm-status.conf` contents as follows:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Access is only available for loopback addresses of the filter node server  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # Checking request sources is disabled, denylisted IPs are allowed to request the wallarm-status service. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location ~/wallarm-status$ {
    wallarm_status on;
  }
}
```

[More details on the statistics service configuration](../../admin-en/configure-statistics-service.md)

### Step 14: Restart NGINX

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### Step 15: Test Wallarm node operation

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

### Step 16: Re-enable the Active threat verification module (only if upgrading node 2.16 or lower)

Learn the [recommendation on the Active threat verification module setup](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### Step 17: Delete the node of the previous version

Once the operation of the new node is properly tested, open the **Nodes** section of Wallarm Console and delete the regular node of the previous version from the list.

If the postanalytics module is installed on a separate server, please also delete the node instance related to this module.

## Settings customization

The Wallarm modules are updated to version 4.6. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
