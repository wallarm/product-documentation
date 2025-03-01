[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[enable-libdetection-docs]:         ../admin-en/configure-parameters-en.md#wallarm_enable_libdetection
[sqli-attack-docs]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[attacks-in-ui-image]:           ../images/admin-guides/test-attacks-quickstart-sqli-xss.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block

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
    docker pull wallarm/node:3.6.2-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:3.6.1-1
    ```

## Step 2: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 3: Switch from deprecated configuration options

There are the following deprecated configuration options:

* The following NGINX directives have been renamed:

    * `wallarm_instance` → [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../admin-en/configure-parameters-en.md#wallarm_protondb_path)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the directives with former names are explicitly specified in the mounted configuration files. If so, rename them.
* The following Envoy parameters have been renamed:

    * `lom` → [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the directives with former names are explicitly specified in the mounted configuration files. If so, rename them.

## Step 4: Update the Wallarm blocking page (if upgrading NGINX-based image)

In the new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#when-upgrading-node-34). The logo and support email on the page are now empty by default.

If your Docker container was configured to return the `&/usr/share/nginx/html/wallarm_blocked.html` page in response to the blocked requests, transfer this configuration as follows:

1. [Copy and customize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.
1. [Mount](../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) the new customized or previously used page and the NGINX configuration file to a new Docker container in the next step.

## Step 5: Transfer the `overlimit_res` attack detection configuration from directives to the rule

Starting from the version 3.6, you can fine-tune the `overlimit_res` attack detection using the rule in Wallarm Console.

Earlier, the following options have been used:

* The [`wallarm_process_time_limit`][nginx-process-time-limit-docs] and [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX directives
* The [`process_time_limit`][envoy-process-time-limit-docs] and [`process_time_limit_block`][envoy-process-time-limit-block-docs] Envoy parameters

The listed directives and parameters are considered to be deprecated with the new rule release and will be deleted in future releases.

If the `overlimit_res` attack detection settings are customized via the listed parameters, it is recommended to transfer them to the rule as follows:

1. Open Wallarm Console → **Rules** and proceed to the [**Limit request processing time**][overlimit-res-rule-docs] rule setup.
1. Configure the rule as done in the mounted configuration files:

    * The rule condition should match the NGINX or Envoy configuration block with the `wallarm_process_time_limit` and `wallarm_process_time_limit_block` directives or the `process_time_limit` and `process_time_limit_block` parameters specified.
    * The time limit for the node to process a single request (milliseconds): the value of `wallarm_process_time_limit` or `process_time_limit`.
    
        !!! warning "Risk of running out of system memory"
            The high time limit and/or continuation of request processing after the limit is exceeded can trigger memory exhaustion or out-of-time request processing.
    
    * The node will either block or pass the `overlimit_res` attack depending on the [node filtration mode][waf-mode-instr]:

        * In the **monitoring** mode, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.
        * In the **safe blocking** mode, the node blocks the request if it is originated from the [graylisted][graylist-docs] IP address. Otherwise, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.
        * In the **block** mode, the node blocks the request.
1. Delete the `wallarm_process_time_limit`, `wallarm_process_time_limit_block` NGINX directives from the mounted configuration file.

    If the `overlimit_res` attack detection is fine-tuned using both the parameters and the rule, the node will process requests as the rule sets.

## Step 6: Run the container using the updated image

Run the container using the updated image. You can pass the same configuration parameters that were passed when running a previous image version except for the ones listed in the previous steps.

There are two options for running the container using the updated image:

* **With the environment variables** specifying basic filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **In the mounted configuration file** specifying advanced filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Instructions for the Envoy-based Docker container →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 7: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats-for-deprecated.md"

## Step 8: Delete the filtering node of the previous version

If the deployed image of the version 3.6 operates correctly, you can delete the filtering node of the previous version in the Wallarm Console → **Nodes** section.
