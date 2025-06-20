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
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[oob-docs]:                         ../installation//oob/overview.md
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../installation/oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Upgrading Wallarm NGINX modules

These instructions describe the steps to upgrade the Wallarm NGINX modules 4.x installed from the individual packages to version 6.x. These are the modules installed in accordance with one of the following instructions:

* Individual packages for NGINX stable
* Individual packages for NGINX Plus
* Individual packages for distribution-provided NGINX

!!! info "Upgrading with all-in-one installer"
    Since version 4.10, upgrading is performed using Wallarm's [all-in-one installer](../installation/nginx/all-in-one.md) as the individual Linux packages have been deprecated. This method simplifies the upgrade process and ongoing deployment maintenance compared to the previous approach.
    
    The installer automatically performs the following actions:

    1. Checking your OS and NGINX version.
    1. Adding Wallarm repositories for the detected OS and NGINX version.
    1. Installing Wallarm packages from these repositories.
    1. Connecting the installed Wallarm module to your NGINX.
    1. Connecting the filtering node to Wallarm Cloud using the provided token.

    ![All-in-one compared to manual](../images/installation-nginx-overview/manual-vs-all-in-one.png)

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/nginx-modules.md).

## Requirements

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all.

    You will need to run a node of the newer version using all-in-one installer on a clean machine, test that it works well and stop the previous one and configure traffic to flow through the new machine instead of the previous one.

* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module and **then** the filtering module following these [instructions](../updating-migrating/separate-postanalytics.md).

## Step 1: Prepare clean machine

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Step 2: Install latest NGINX and dependencies

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Step 3: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 4: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Step 5: Run all-in-one Wallarm installer

### Filtering node and postanalytics on the same server

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

### Filtering node and postanalytics on different servers

!!! warning "Sequence of steps to upgrade the filtering node and postanalytics modules"
    If the filtering node and postanalytics modules are installed on different servers, then it is required to upgrade the postanalytics packages before updating the filtering node packages.

1. Upgrade postanalytics module following these [instructions](separate-postanalytics.md).
1. Upgrade filtering node:

    === "API token"
        ```bash
        # If using the x86_64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.2.0.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-6.2.0.aarch64-glibc.sh filtering
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        ```bash
        # If using the x86_64 version:
        sudo sh wallarm-6.2.0.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo sh wallarm-6.2.0.aarch64-glibc.sh filtering
        ```

## Step 6: Transfer NGINX and postanalytics configuration from old node machine to new

Migrate the node-related NGINX and postanalytics configurations from the old machine to the new one by copying the necessary directives or files:

* `/etc/nginx/conf.d/default.conf` or `/etc/nginx/nginx.conf` with NGINX settings for the `http` level

    If the filtering and postanalytics nodes are on different servers, in the `http` block of `/etc/nginx/nginx.conf` on the filtering node machine, rename `wallarm_tarantool_upstream` to [`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream).
* `/etc/nginx/sites-available/default` with NGINX and Wallarm settings for traffic routing
* `/etc/nginx/conf.d/wallarm-status.conf` → copy to `/etc/nginx/wallarm-status.conf` on the new machine

    Detailed description is available within the [link][wallarm-status-instr].
* `/etc/wallarm/node.yaml` → copy to `/opt/wallarm/etc/wallarm/node.yaml` on the new machine

    If using a custom host and port on a separate postanalytics server, rename the `tarantool` section to `wstore` in the copied file on the postanalytics node machine.

## Step 7: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Step 8: Test Wallarm node operation

To test the new node operation:

1. Send the request with test [SQLI][sqli-attack-docs] and [XSS][xss-attack-docs] attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Open the Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and ensure attacks are displayed in the list.
1. As soon as your Cloud stored data (rules, IP lists) is synchronized to the new node, perform some test attacks to make sure your rules work as expected.

## Step 9: Configure sending traffic to Wallarm node

Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.

Before full redirecting of the traffic to the new node, it is recommended to first redirect it partially and check that the new node behaves as expected.

## Step 10: Remove old node

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
