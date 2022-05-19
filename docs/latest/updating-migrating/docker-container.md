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

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## Step 1: Download the updated filtering node image

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:3.6.2-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:3.6.1-1
    ```

## Step 2: Create a new Wallarm node

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.

## Step 3: Switch from deprecated configuration options

The following configuration options have been deprecated:

* The approach to connect the container to the Wallarm Cloud has been upgraded as follows:

    * [The "email and password"-based approach has been deprecated](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens). In this approach, the node was registered in the Wallarm Cloud automatically once the container started with correct credentials passed in the `DEPLOY_USER` and `DEPLOY_PASSWORD` variables.
    * The token-based approach has been included. To connect the container to the Cloud, run the container with the `DEPLOY_TOKEN` variable containing the [Wallarm node token](#step-2-create-a-new-wallarm-node) copied from the Wallarm Console UI.

    It is recommended to use the new approach to run the image 4.0. The "email and password"-based approach will be removed in future releases, please migrate before.
* The following NGINX directive has been renamed:

    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    We only changed the name of the directive, its logic remains the same. Directive with former name will be deprecated soon, so you are recommended to rename it before.
    
    Please check if the directive with former name is explicitly specified in the mounted configuration files. If so, rename it.
* The following Envoy parameters have been renamed:

    * `tsets` section → `rulesets`, and correspondingly the `tsN` entries in this section → `rsN`
    * `ts` → [`ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    We only changed the names of the parameters, their logic remains the same. Parameters with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the parameters with former names are explicitly specified in the mounted configuration files. If so, rename them.

## Step 4: Update the Wallarm blocking page (if upgrading NGINX-based image)

In the new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#when-upgrading-node-34). The logo and support email on the page are now empty by default.

If your Docker container was configured to return the `&/usr/share/nginx/html/wallarm_blocked.html` page in response to the blocked requests, transfer this configuration as follows:

1. [Copy and customize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.
1. [Mount](../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) the new customized or previously used page and the NGINX configuration file to a new Docker container in the next step.

## Step 5: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 6: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 7: Run the container using the new image

Run the container using the new image. You can pass the same configuration parameters that were passed when running a previous image version except for the [deprecated ones](#step-3-switch-from-deprecated-configuration-options).

There are two options for running the container using the updated image:

* **With the environment variables** specifying basic filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **In the mounted configuration file** specifying advanced filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 8: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 9: Delete the filtering node of the previous version

If the deployed image of the version 3.6 operates correctly, you can delete the filtering node of the previous version in Wallarm Console → **Nodes**.
