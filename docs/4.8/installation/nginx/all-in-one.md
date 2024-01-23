[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[platform]:                         ../supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# Deploying with All-in-One Installer

An **all-in-one installer** is designed to streamline and standardize the process of installing Wallarm node as a dynamic module for NGINX in various environments. This installer automatically identifies your operating system’s and NGINX versions, and install all the necessary dependencies.

In comparison to the individual Linux packages offered by Wallarm for [NGINX](dynamic-module.md), [NGINX Plus](../nginx-plus.md), and [distribution-provided NGINX](dynamic-module-from-distr.md), the **all-in-one installer** simplifies the process by automatically performing the following actions:

1. Checking your OS and NGINX version.
1. Adding Wallarm repositories for the detected OS and NGINX version.
1. Installing Wallarm packages from these repositories.
1. Connecting the installed Wallarm module to your NGINX.
1. Connecting the filtering node to Wallarm Cloud using the provided token.

![All-in-one compared to manual](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

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

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-all-in-one.md"

## Step 6: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Step 7: Configure sending traffic to Wallarm node

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## Step 8: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 9: Fine-tune deployed solution

The dynamic Wallarm module with default settings is installed. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/nginx.conf` with NGINX settings
* `/etc/nginx/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` with the settings for the `collectd` plugin that collects statistics from Tarantool

Below there are a few of the typical settings that you can apply if needed:

* [Configuration of the filtration mode][waf-mode-instr]
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
    --install-only          In batch mode, this flag starts a stage that copies needed configuration files and automatically sets NGINX for node installation, skipping Cloud registration and activation. Requires --batch flag.
    --skip-ngx-config       A batch mode option that avoids auto NGINX config changes, ideal for later manual adjustments. Works with --install-only and needs --batch flag.
    --register-only         This modifier finalizes setup by registering the node and starting its service, part of batch mode operations. Requires --batch flag.
-t, --token TOKEN           Node token, required in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

### Batch mode

The `--batch` option triggers **batch (non-interactive)** mode, where the script requires configuration options via the `--token` and `--cloud` flags, along with the `WALLARM_LABELS` environment variable if needed. In this mode, the script does not prompt the user for data input step by step as in the default mode; instead, it requires explicit commands for interaction.

Below are examples of commands to run the script in batch mode for node installation, assuming the script has already been [downloaded](#step-3-download-all-in-one-wallarm-installer):

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.x86_64-glibc.sh -- --batch -t <TOKEN> -c US

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.aarch64-glibc.sh -- --batch -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```bash
    # If using the x86_64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.x86_64-glibc.sh -- --batch -t <TOKEN>

    # If using the ARM64 version:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.7.aarch64-glibc.sh -- --batch -t <TOKEN>
    ```

### Separate execution of node installation stages

The all-in-one installer facilitates node installation and setup through two distinct stages:

1. File copying and NGINX configuration: Copies necessary files and modifies NGINX configurations for node operation. You can bypass the NGINX file modification by using the `--skip-ngx-config` flag if you prefer manual adjustments.
1. Node registration and service start: Registers the node in the Wallarm Cloud and starts the service.

Starting from the all‑in‑one installer version 4.8.7, these phases can be performed separately by utilizing the installer in batch mode with specific flags. The following commands facilitate sequential execution of the described steps.

=== "US Cloud"
    ```bash
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.x86_64-glibc.sh
    sudo sh wallarm-4.8.7.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.aarch64-glibc.sh
    sudo sh wallarm-4.8.7.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN> -c US
    ```
=== "EU Cloud"
    ```
    # If using the x86_64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.x86_64-glibc.sh
    sudo sh wallarm-4.8.7.x86_64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>

    # If using the ARM64 version:
    curl -O https://meganode.wallarm.com/4.8/wallarm-4.8.7.aarch64-glibc.sh
    sudo sh wallarm-4.8.7.aarch64-glibc.sh -- --batch --install-only
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/setup.sh --batch --register-only -t <TOKEN>
    ```

Finally, to complete the installation, you need to [enable Wallarm to analyze traffic](#step-5-enable-wallarm-node-to-analyze-traffic) and [restart NGINX](#step-6-restart-nginx).

### Separate installation of filtering and postanalytics nodes

The filtering/postanalytics switch provides the option to install the postanalytics module [separately](../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script). Without this switch, both filtering and postanalytics components are installed together by default.
