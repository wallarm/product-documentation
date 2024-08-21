[docs-module-update]:           nginx-modules.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[tarantool-status]:             ../images/tarantool-status.png
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Upgrading the postanalytics module

These instructions describe the steps to upgrade the postanalytics module 4.x installed on a separate server. Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].

To upgrade the end‑of‑life module (3.6 or lower), please use the [different instructions](older-versions/separate-postanalytics.md).

!!! info "Upgrading with all-in-one installer"
    Since version 4.10, upgrading is performed using Wallarm's [all-in-one installer](../installation/nginx/all-in-one.md). This improves and simplifies the upgrade process in comparison to the upgrade with individual Linux packages offered by Wallarm previously. The installer automatically performs the following actions:

    1. Checking your OS and NGINX version.
    1. Adding Wallarm repositories for the detected OS and NGINX version.
    1. Installing Wallarm packages from these repositories.
    1. Connecting the installed Wallarm module to your NGINX.
    1. Connecting the filtering node to Wallarm Cloud using the provided token.
    
        Manual upgrade with individual Linux packages is not supported any more.

    ![All-in-one compared to manual](../images/installation-nginx-overview/manual-vs-all-in-one.png)

### Requirements

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Step 1: Prepare clean machine

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download-4.10.md"

## Step 4: Run all-in-one Wallarm installer to install postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics-4.10.md"

## Step 5: Upgrade the NGINX-Wallarm module on a separate server

Once the postanalytics module is installed on the separate server, [upgrade its related NGINX-Wallarm module](nginx-modules.md) running on a different server.

## Step 6: Re-connect the NGINX-Wallarm module to the postanalytics module

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## Step 7: Check the NGINX‑Wallarm and separate postanalytics modules interaction

--8<-- "../include/waf/installation/all-in-one-postanalytics-check.md"

## Step 8: Remove old postanalytics module

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"
