[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png

# Upgrading the Docker NGINX- or Envoy-based image

These instructions describe the steps to upgrade the running Docker NGINX- or Envoy-based image 3.4 or 3.2 to the version 3.6.

!!! warning "Using credentials of already existing Wallarm node"
    We do not recommend using the already existing Wallarm node of the previous version. Please follow these instructions to create a new filtering node of the version 3.6 and deploy it as the Docker container.

To upgrade the node 2.18 or lower, please use the [different instructions](older-versions/docker-container.md).

## Requirements

--8<-- "../include/waf/installation/requirements-docker.md"

## Step 1: Download the updated filtering node image

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:3.6.1-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:3.6.0-1
    ```

## Step 2: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 3: Switch from deprecated configuration options

There are the following deprecated configuration options:

* The following NGINX directives have been renamed:

    * `wallarm_instance` → [`wallarm_application`](..//admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](..//admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](..//admin-en/configure-parameters-en.md#wallarm_protondb_path)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the directives with former names are explicitly specified in the mounted configuration files. If so, rename them.
* The following Envoy parameters have been renamed:

    * `lom` → [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the directives with former names are explicitly specified in the mounted configuration files. If so, rename them.

## Step 4: Update the Wallarm blocking page (if upgrading NGINX-based image)

In new node versions, the Wallarm blocking page has [been changed](what-is-new.md#when-upgrading-node-34). The logo and support email on the page are now empty by default.

If the Docker container 2.18 or lower is configured to return the `&/usr/share/nginx/html/wallarm_blocked.html` page to blocked requests, change this configuration as follows:

1. Copy the blocking page file contents from the new Docker image file system.
2. [Customize](..//admin-en/configuration-guides/configure-block-page-and-code.md#customizing-default-blocking-page) the copied page.
3. [Mount](../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) the customized page and the NGINX configuration file to a new Docker container in the next step.

## Step 5: Run the container using the updated image

Run the container using the updated image. You can pass the same configuration parameters that were passed when running a previous image version except for the ones [listed in the previous step](#step-3-switch-from-deprecated-configuration-options).

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

If the deployed image of the version 3.6 operates correctly, you can delete the filtering node of the previous version in the Wallarm Console → **Nodes** section.
