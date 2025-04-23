[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# Upgrading the Docker NGINX-based image

These instructions describe the steps to upgrade the running Docker NGINX-based image to the latest version 6.x.

!!! warning "Using credentials of already existing Wallarm node"
    We do not recommend using the already existing Wallarm node of the previous version. Please follow these instructions to create a new filtering node of the version 6.x and deploy it as the Docker container.

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/docker-container.md).

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Step 1: Download the updated filtering node image

``` bash
docker pull wallarm/node:6.0.1
```

## Step 2: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 3: Run the container using the new image

1. If upgrading from version 5.x or earlier, please note the following important changes:

    * If you previously configured the postanalytics memory via the `TARANTOOL_MEMORY_GB` environment variable, rename it to `SLAB_ALLOC_ARENA`.
    * If you are running the Docker container with mounted custom NGINX configuration files:

        * The `include` paths in `/etc/nginx/nginx.conf` have changed to align with Alpine Linux directory conventions:

            ```diff
            ...

            - include /etc/nginx/modules-enabled/*.conf;
            + include /etc/nginx/modules/*.conf;

            ...

            http {
            -     include /etc/nginx/sites-enabled/*;
            +     include /etc/nginx/http.d/*;
            }
            ```
        
        * In `/etc/nginx/conf.d/wallarm-status.conf`, the default value of the `allow` directive (used to define permitted IP addresses) has changed:

            ```diff
            ...

            - allow 127.0.0.8/8;
            + allow 127.0.0.0/8;

            ...
            ```
        
        * The path for mounting virtual host configuration files has changed from `/etc/nginx/sites-enabled/default` to `/etc/nginx/http.d`.
1. Proceed to Wallarm Console → **Settings** → **API Tokens** and generate a token with the **Node deployment/Deployment** usage type.
1. Copy the generated token.
1. Run the container using the new image and apply the updated configuration.
    
    There are two options for running the container using the updated image:

    * [With the environment variables](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [In the mounted configuration file](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## Step 4: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 5: Delete the filtering node of the previous version

If the deployed image of the version 6.x operates correctly, you can delete the filtering node of the previous version in Wallarm Console → **Nodes**.
