[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[scanner-allowlisting-instr]:       ../admin-en/scanner-ips-allowlisting.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[default-ip-blocking-settings]:     ../admin-en/configure-ip-blocking-nginx-en.md
[wallarm-acl-directive]:            ../admin-en/configure-parameters-en.md#wallarm_acl
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[attacks-in-ui-image]:           ../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Upgrading the Wallarm Docker NGINX- or Envoy-based image

These instructions describe the steps to update the running Docker NGINX- or Envoy-based image to the version 2.18.

!!! warning "Using credentials of already existing Wallarm node"
    We do not recommend to use the already existing Wallarm node of the previous version. Please follow these instructions to create a new filtering node of the version 2.18 and deploy it as the Docker container.

## Requirements

--8<-- "../include/waf/installation/requirements-docker.md"

## Step 1: Download the updated filtering node image

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:2.18.1-5
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:2.18.1-3
    ```

## Step 2: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 3: Run the container using the updated image

When running the container using the updated image, you can pass the same configuration parameters that were passed when running a previous image version. If some parameters are deprecated or added in the new Wallarm node version, the appropriate information is published in the list of the [new version changes](what-is-new.md).

There are two options for running the container using the updated image:

* **With the environment variables** specifying basic filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **In the mounted configuration file** specifying advanced filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 4: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats-for-deprecated.md"

## Step 5: Delete the filtering node of the previous version

If the deployed image of the version 2.18 operates correctly, you can delete the filtering node of the previous version in the Wallarm Console → **Nodes** section.
