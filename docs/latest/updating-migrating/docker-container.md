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
[envoy-process-time-limit-docs]:    ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md

# Upgrading the Docker NGINX- or Envoy-based image

These instructions describe the steps to upgrade the running Docker NGINX- or Envoy-based image 4.x to the version 4.10.

!!! warning "Using credentials of already existing Wallarm node"
    We do not recommend using the already existing Wallarm node of the previous version. Please follow these instructions to create a new filtering node of the version 4.10 and deploy it as the Docker container.

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/docker-container.md).

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-4.0.md"

## Step 1: Download the updated filtering node image

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:4.10.1-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## Step 2: Review recent architectural updates (for NGINX-based Docker image)

The latest update has introduced [architectural changes](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) that may impact users, especially those mounting custom configuration files during container initiation due to alterations in the paths of certain files. Please familiarize yourself with these changes to ensure proper configuration and usage of the new image.

## Step 3: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 4: Run the container using the new image

1. Proceed to Wallarm Console → **Nodes** and create **Wallarm node**.

    ![Creation of a Wallarm node](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Copy the generated token.
1. Run the updated image using the copied token and making necessary adjustments to the paths for the mounted files if required by the [recent changes to the image](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image).
    
    There are two options for running the container using the updated image:

    * **With the environment variables** specifying basic filtering node configuration
        * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **In the mounted configuration file** specifying advanced filtering node configuration
        * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 5: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 6: Delete the filtering node of the previous version

If the deployed image of the version 4.10 operates correctly, you can delete the filtering node of the previous version in Wallarm Console → **Nodes**.
