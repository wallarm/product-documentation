[docs-module-update]:           all-in-one.md
[img-wl-console-users]:         ../images/check-users.png 
[img-create-wallarm-node]:      ../images/user-guides/nodes/create-cloud-node.png
[img-attacks-in-interface]:     ../images/admin-guides/test-attacks-quickstart.png
[wallarm-token-types]:          ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[statistics-service-all-parameters]: ../admin-en/configure-statistics-service.md
[configure-proxy-balancer-instr]:   ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md

# Upgrading the postanalytics module

These instructions describe the steps to upgrade the postanalytics module installed on a separate server up to the latest 7.x version. **Postanalytics module must be upgraded before [Upgrading Wallarm NGINX modules][docs-module-update].**

## Requirements

--8<-- "../include/waf/installation/all-in-one-upgrade-requirements.md"

## Step 1: Prepare clean machine

--8<-- "../include/waf/installation/all-in-one-clean-machine-latest.md"

## Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Step 3: Download all-in-one Wallarm installer

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Step 4: Run all-in-one Wallarm installer to install postanalytics

--8<-- "../include/waf/installation/all-in-one-postanalytics.md"

## Step 5: Upgrade the NGINX-Wallarm module on a separate server

Once the postanalytics module is installed on the separate server, [upgrade its related NGINX-Wallarm module](all-in-one.md) running on a different server.

## Step 6: Re-connect the NGINX-Wallarm module to the postanalytics module

--8<-- "../include/waf/installation/all-in-one-postanalytics-reconnect.md"

## Step 7: Check the NGINX‑Wallarm and separate postanalytics modules interaction

--8<-- "../include/waf/installation/all-in-one-postanalytics-check-latest.md"

## Step 8: Remove old postanalytics module

--8<-- "../include/waf/installation/all-in-one-postanalytics-remove-old.md"
