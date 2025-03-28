---
search:
  exclude: true
---

[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[oob-advantages-limitations]:       ../../../oob/overview.md#limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../../../admin-en/installation-postanalytics-en.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# Deploying with All-in-One Installer

These instructions describe the steps to install Wallarm as an [OOB](../overview.md) dynamic module using an **all-in-one installer** designed to streamline and standardize the process of installing Wallarm node as a dynamic module for NGINX in various environments. This installer automatically identifies your operating system’s and NGINX versions, and install all the necessary dependencies.

The **all-in-one installer** provides a simple node installation process by automatically performing the following actions:

1. Checking your OS and NGINX version.
1. Adding Wallarm repositories for the detected OS and NGINX version.
1. Installing Wallarm packages from these repositories.
1. Connecting the installed Wallarm module to your NGINX.
1. Connecting the filtering node to Wallarm Cloud using the provided token.

## Use cases

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Requirements

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## Step 1: Install NGINX and dependencies

--8<-- "../include/waf/installation/all-in-one-nginx-4.10.md"

## Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download-4.10.md"

## Step 4: Run all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-run-4.10.md"

Commands in the further steps are the same for x86_64 and ARM64 installations.

## Step 5: Enable Wallarm node to analyze traffic

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## Step 6: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Step 7: Configure sending traffic to Wallarm node

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## Step 8: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 9: Fine-tune deployed solution

The dynamic Wallarm module with default settings is installed. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/nginx.conf` with NGINX settings
* `/etc/nginx/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` with the settings for the `collectd` plugin that collects statistics from Tarantool

Below there are a few of the typical settings that you can apply if needed:

* [Allocating resources for Wallarm nodes][memory-instr]
* [Logging Wallarm node variables][logging-instr]
* [Using the balancer of the proxy server behind the filtering node][proxy-balancer-instr]
* [Limiting the single request processing time in the directive `wallarm_process_time_limit`][process-time-limit-instr]
* [Limiting the server reply waiting time in the NGINX directive `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size in the NGINX directive `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configuring dynamic DNS resolution in NGINX][dynamic-dns-resolution-nginx]

## Launch options

--8<-- "../include/waf/installation/all-in-one/launch-options-4.10.md"

## Starting the installation over

If you need to delete the Wallarm node installation and start again, follow the steps below.

!!! warning "Impact of starting the installation over"
    Starting the installation over involves stopping and deleteing already running Wallarm services, thus pausing traffic filtering until reinstallation. Exercise caution in production or critical traffic environments, as this leaves traffic unfiltered and at risk.

    To upgrade an existing node (e.g., from 4.8 to 4.10), see the [upgrade instructions](../../../../updating-migrating/all-in-one.md).

1. Terminate Wallarm processes and remove configuration files:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. Continue with the reinstallation process by following the setup instructions from the [2nd step](#step-2-prepare-wallarm-token).