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
[graylist-docs]:                    ../../user-guides/ip-lists/overview.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[sqli-attack-docs]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[web-server-mirroring-examples]:    ../../installation/oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md

# Upgrading EOL Wallarm NGINX modules

These instructions describe the steps to upgrade the end‑of‑life Wallarm NGINX modules (version 3.6 and lower) to version 5.0. Wallarm NGINX modules are the modules installed in accordance with one of the following instructions:

* Individual packages for NGINX stable
* Individual packages for NGINX Plus
* Individual packages for distribution-provided NGINX

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! info "Upgrading with all-in-one installer"
    Upgrading is performed using Wallarm's [all-in-one installer](../../installation/nginx/all-in-one.md) as the individual Linux packages have been deprecated. This method simplifies the upgrade process and ongoing deployment maintenance compared to the previous approach.
    
    The installer automatically performs the following actions:

    1. Checking your OS and NGINX version.
    1. Adding Wallarm repositories for the detected OS and NGINX version.
    1. Installing Wallarm packages from these repositories.
    1. Connecting the installed Wallarm module to your NGINX.
    1. Connecting the filtering node to Wallarm Cloud using the provided token.

        Manual upgrade with individual Linux packages is not supported any more.

    ![All-in-one compared to manual](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Inform Wallarm technical support that you are upgrading EOL node

If upgrading the end‑of‑life Wallarm NGINX modules (version 3.6 and lower) to version 5.0, inform [Wallarm technical support](mailto:support@wallarm.com) about that and ask for assistance.

Besides any other help, ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../../user-guides/ip-lists/overview.md) is available.

## Requirements

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Upgrade procedure

* If filtering node and postanalytics modules are installed on the same server, then follow the instructions below to upgrade all.

    You will need to run a node of the newer version using all-in-one installer on a clean machine, test that it works well and stop the previous one and configure traffic to flow through the new machine instead of the previous one.

* If filtering node and postanalytics modules are installed on different servers, **first** upgrade the postanalytics module and **then** the filtering module following these [instructions](separate-postanalytics.md).

## Step 1: Disable the Threat Replay Testing module (if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) module in Wallarm Console → **Vulnerabilities** → **Configure**.

The module operation can cause [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

## Step 2: Prepare clean machine

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Step 3: Install NGINX and dependencies

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Step 4: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 5: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download-5.0.md"

## Step 6: Run all-in-one Wallarm installer

### Filtering node and postanalytics on the same server

--8<-- "../include/waf/installation/all-in-one-installer-run-5.0.md"

### Filtering node and postanalytics on different servers

!!! warning "Sequence of steps to upgrade the filtering node and postanalytics modules"
    If the filtering node and postanalytics modules are installed on different servers, then it is required to upgrade the postanalytics packages before updating the filtering node packages.

1. Upgrade postanalytics module following these [instructions](separate-postanalytics.md).
1. Upgrade filtering node:

    === "API token"
        ```bash
        # If using the x86_64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.13.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-5.3.13.aarch64-glibc.sh filtering
        ```        

        The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        ```bash
        # If using the x86_64 version:
        sudo sh wallarm-5.3.13.x86_64-glibc.sh filtering

        # If using the ARM64 version:
        sudo sh wallarm-5.3.13.aarch64-glibc.sh filtering
        ```

## Step 7: Migrate allowlists and denylists from the previous Wallarm node version to 5.0 (only if upgrading node 2.18 or lower)

If upgrading node 2.18 or lower, [migrate](../migrate-ip-lists-to-node-3.md) allowlist and denylist configuration from previous Wallarm node version to the latest version.

## Step 8: Transfer NGINX and postanalytics configuration from old node machine to new

Transfer node-related NGINX configuration and postanalytics configuration from the configuration files on the old machine to the files on a new machine. You can do that by copying the required directives.

**Source files**

On an old machine, depending on OS and NGINX version, the NGINX configuration files may be located in different directories and have different names. Most common are the following:

* `/etc/nginx/conf.d/default.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]

Also, the configuration of the postanalytics module (Tarantool database settings) is usually located here:

* `/etc/default/wallarm-tarantool` or
* `/etc/sysconfig/wallarm-tarantool`

**Target files**

As all-in-one installer works with different combinations of OS and NGINX versions, on your new machine, the [target files](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) may have different names and be located in different directories.

When transferring configuration, you need to perform steps listed below.

### Rename deprecated NGINX directives

Rename the following NGINX directives if they are explicitly specified in configuration files:

* `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
* `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
* `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
* `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.

### Update the node logging variables

In the new node version the following changes to the [node logging variables](../../admin-en/configure-logging.md#filter-node-variables) have been implemented:

* The `wallarm_request_time` variable has been renamed to `wallarm_request_cpu_time`.

    We only changed the variable name, its logic remains the same. The old name is temporarily supported as well, but still it is recommended to rename the variable.
* The `wallarm_request_mono_time` variable has been added – place it in the configuration of the logging format if you need log information about total time being the sum of:

    * Time in the queue
    * Time in seconds the CPU spent processing the request

### Adjust Wallarm node filtration mode settings to changes released in the latest versions

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Endpoint-targeted filtration rules configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

### Transfer the `overlimit_res` attack detection configuration from directives to the rule

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

### Update the `wallarm-status.conf` file contents

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

### Update the Wallarm blocking page

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the page `&/usr/share/nginx/html/wallarm_blocked.html` was configured to be returned in response to blocked requests, [copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.

## Step 9: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 10: Re-enable the Threat Replay Testing module (only if upgrading node 2.16 or lower)

Learn the [recommendation on the Threat Replay Testing module setup](../../vulnerability-detection/threat-replay-testing/setup.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Step 11: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Step 12: Test Wallarm node operation

To test the new node operation:

1. Send the request with test [SQLI][sqli-attack-docs] and [XSS][xss-attack-docs] attacks to the protected resource address:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Open the Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and ensure attacks are displayed in the list.
1. As soon as your Cloud stored data (rules, IP lists) is synchronized to the new node, perform some test attacks to make sure your rules work as expected.

## Step 13: Configure sending traffic to Wallarm node

Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.

Before full redirecting of the traffic to the new node, it is recommended to first redirect it partially and check that the new node behaves as expected.

## Step 14: Remove old node

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

## Settings customization

The Wallarm modules are updated to version 5.0. Previous filtering node settings will be applied to the new version automatically. To make additional settings, use the [available directives](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"
