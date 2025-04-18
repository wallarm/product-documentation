# Deploying with All-in-One Installer

An **all-in-one installer** is designed for installing Wallarm node as a dynamic module for NGINX in Linux-based environments for [inline traffic filtration][inline-docs]. This installer automatically identifies your operating system’s and NGINX versions, and install all the necessary dependencies.

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

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Step 4: Run all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

Commands in the further steps are the same for x86_64 and ARM64 installations.

## Step 5: Enable Wallarm node to analyze traffic

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## Step 6: Restart NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Step 7: Configure sending traffic to Wallarm node

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## Step 8: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 9: Fine-tune deployed solution

The dynamic Wallarm module with default settings is installed. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives][waf-directives-instr] or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/sites-available/default` for the settings on the server and location levels
* `/etc/nginx/nginx.conf` for the settings on the http level
* `/etc/nginx/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]

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

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## Starting the installation over

If you need to delete the Wallarm node installation and start again, follow the steps below.

!!! warning "Impact of starting the installation over"
    Starting the installation over involves stopping and deleteing already running Wallarm services, thus pausing traffic filtering until reinstallation. Exercise caution in production or critical traffic environments, as this leaves traffic unfiltered and at risk.

    To upgrade an existing node (e.g., from 4.10 to 5.0), see the [upgrade instructions][upgrade-docs].

1. Terminate Wallarm processes and remove configuration files:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. Continue with the reinstallation process by following the setup instructions from the [2nd step](#step-2-prepare-wallarm-token).