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
[oob-advantages-limitations]:       ../../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Deploying with All-in-One Installer

These instructions describe the steps to install Wallarm as an [OOB](../overview.md) dynamic module using an **all-in-one installer** designed to streamline and standardize the process of installing Wallarm node as a dynamic module for NGINX in various environments. This installer automatically identifies your operating system’s and NGINX versions, and install all the necessary dependencies.

In comparison to the individual Linux packages offered by Wallarm for [NGINX](nginx-stable.md), [NGINX Plus](nginx-plus.md), and [distribution-provided NGINX](nginx-distro.md), the **all-in-one installer** simplifies the process by automatically performing the following actions:

1. Checking your OS and NGINX version.
1. Adding Wallarm repositories for the detected OS and NGINX version.
1. Installing Wallarm packages from these repositories.
1. Connecting the installed Wallarm module to your NGINX.
1. Connecting the filtering node to Wallarm Cloud using the provided token.

![All-in-one compared to manual](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Use cases

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Requirements

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## Step 1: Install NGINX and dependencies

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download-4.8.md"

## Step 4: Run all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-run-4.8.md"

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

As soon as you have the all-in one script downloaded, you can get help on it with:

```
sudo sh ./wallarm-4.8.7.x86_64-glibc.sh -- -h
```

Which returns:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
-t, --token TOKEN           Node token, only used in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

Note that: 

* The `--batch` option enables a **batch (non-interactive) mode**. In this mode, if you do not use additional parameters, the node is installed immediately after script launch, requiring no additional interaction or data input from the user. Batch mode:
 
    * Requires `--token`
    * Installs node into EU Cloud by default
    * Allows script behavior modifications with additional options

* The `filtering/postanalytics` switcher allows installing [separately](../../../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) the postanalytics module. If switcher is not used, filtering and postanalytics part are installed altogether.
