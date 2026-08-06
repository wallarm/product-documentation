[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../attacks-vulns-list.md#path-traversal

# Upgrading Wallarm NGINX Node with All-in-One Installer

These instructions describe the steps to upgrade the Wallarm node installed using [all‑in‑one installer](../installation/nginx/all-in-one.md) to the latest version 7.x.

!!! info "Re-installation of the Wallarm services is required"
    For a safe upgrade procedure, install the new Node on a new machine, redirect traffic to the new machine, and then remove the old one.
    
    Alternatively, you can stop and remove the services on your current machine and then re-install the node. However, this may cause some downtime, which is not recommended.

    This article describes the safest migration method.

## Step 1: Install the new node version on a clean machine

1. If upgrading from 5.x or earlier and the postanalytics module is installed separately, copy and update your existing configurations to reflect the [replacement of Tarantool with wstore](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics):

    * On the filtering node machine, in the `http` block of `/etc/nginx/nginx.conf`, rename `wallarm_tarantool_upstream` to [`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream).
    * On the postanalytics machine (if using a custom host and port), in `/opt/wallarm/etc/wallarm/node.yaml`, rename the `tarantool` section to `wstore`.
1. Install the newest version of the node on a **new machine** alongside the most recent version of NGINX by following one of the guides. The guide also covers the requirements for the machine.

    * [Filtering and postanalytics modules on the same server](../installation/nginx/all-in-one.md) - you can transfer and reuse your previous configuration files.
    * [Filtering and postanalytics modules on different servers](../admin-en/installation-postanalytics-en.md) - use the updated configuration files from step 1.
1. If you monitor the node, update your monitoring for the 7.x process and metrics model:

    * Scrape node metrics from the new single aggregated endpoint `http://127.0.0.1:9445/metrics` served by the `wd` (Wallarm Daemon) service, which replaces `supervisord`. The per-component ports `9001`, `9003`, and `9010` still work for backward compatibility.
    * Use the `http://127.0.0.1:9446/ready` and `http://127.0.0.1:9446/health` endpoints for health checks. If you previously checked the node through `supervisorctl`, switch to these endpoints.
    * Stop scraping the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` metrics and remove them from dashboards and alerts — they are no longer exposed.

    See [What is New in NGINX Node 7.x](what-is-new.md#node-architecture-and-process-management-wd) for the full list of node changes.
1. Route the traffic to the new machine for the new node to process it.

## Step 2: Remove the old node

1. Once traffic is routed to the new machine and your Cloud-stored data (rules, IP lists) is synchronized, perform some test attacks to ensure your rules work as expected.
1. Delete the old node in Wallarm Console → **Nodes** by selecting your node and clicking **Delete**.
1. Confirm the action.
    
    When the node is deleted from Cloud, it will stop filtration of requests to your applications. Deleting the filtering node cannot be undone. The node will be deleted from the list of nodes permanently.

1. Delete the machine with the old node or just clean it from Wallarm node components:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
