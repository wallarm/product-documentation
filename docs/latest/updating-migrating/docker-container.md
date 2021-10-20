[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Updating the running Docker NGINX- or Envoy-based image

These instructions describe the steps to update the running Docker NGINX- or Envoy-based image to the version 3.4.

!!! warning "Using credentials of already existing Wallarm node"
    We do not recommend to use the already existing Wallarm node of the previous version. Please follow these instructions to create a new filtering node of the version 3.4 and deploy it as the Docker container.

--8<-- "../include/waf/upgrade/warning-node-types-upgrade-to-3.4.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker.md"

## Step 1: Inform Wallarm technical support that you are updating filtering node modules

If updating Wallarm node 2.18 or lower, please inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.4 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open the Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.

## Step 2: Adjust Wallarm node filtration mode settings to changes released in version 3.2

If upgrading Wallarm node 3.0 or lower:

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md):
      * Environment variable [`WALLARM_MODE`](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) or the directive [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) of the NGINX‑based Docker container
      * Environment variable [`WALLARM_MODE`](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) or the directive [`mode`](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) of the Envoy‑based Docker container
      * [General filtration rule configured in the Wallarm Console](../user-guides/settings/general.md)
      * [Low-level filtration rules configured in the Wallarm Console](../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../admin-en/configure-wallarm-mode.md).

## Step 3: Download the updated filtering node image

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:3.4.0-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:3.4.0-1
    ```

## Step 4: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 5: Run the container using the updated image

1. If updating Wallarm node 2.18 or lower, migrate whitelist and blacklist configuration from previous Wallarm node version to 3.4 following the [instructions](migrate-ip-lists-to-node-3.md).
2. Run the container using the updated image. You can pass the same configuration parameters that were passed when running a previous image version except for the `WALLARM_ACL_ENABLE` variable.

    There are two options for running the container using the updated image:

    * **With the environment variables** specifying basic filtering node configuration
        * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **In the mounted configuration file** specifying advanced filtering node configuration
        * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 6: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 7: Delete the filtering node of the previous version

If the deployed image of the version 3.4 operates correctly, you can delete the filtering node of the previous version in the Wallarm Console → **Nodes** section.
