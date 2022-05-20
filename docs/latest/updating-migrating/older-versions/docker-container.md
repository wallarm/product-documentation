[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[enable-libdetection-docs]:         ../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection
[sqli-attack-desc]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../../images/admin-guides/test-attacks-quickstart.png

# Upgrading the Docker NGINX- or Envoy-based image of Wallarm node 2.18 or lower

These instructions describe the steps to upgrade the running Docker NGINX- or Envoy-based image 2.18 or lower to the version 4.0.

!!! warning "Using credentials of already existing Wallarm node"
    We do not recommend using the already existing Wallarm node of the previous version. Please follow these instructions to create a new filtering node of the version 4.0 and deploy it as the Docker container.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules

Please inform [Wallarm technical support](mailto:support@wallarm.com) that you are upgrading filtering node modules up to 4.0 and ask to enable new IP list logic for your Wallarm account. When new IP list logic is enabled, please ensure the section [**IP lists**](../../user-guides/ip-lists/overview.md) of Wallarm Console is available.

## Step 2: Disable the Active threat verification module (if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Active threat verification](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification) module in Wallarm Console → **Scanner** → **Settings**.

The module operation can cause [false positives](../../about-wallarm-waf/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

## Step 3: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 4: Download the updated filtering node image

=== "NGINX-based image"
    ``` bash
    docker pull wallarm/node:3.6.2-1
    ```
=== "Envoy-based image"
    ``` bash
    docker pull wallarm/envoy:3.6.1-1
    ```

## Step 5: Switch to the token-based connection to the Wallarm Cloud

The approach to connect the container to the Wallarm Cloud has been upgraded as follows:

* [The "email and password"-based approach has been deprecated](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens). In this approach, the node was registered in the Wallarm Cloud automatically once the container started with correct credentials passed in the `DEPLOY_USER` and `DEPLOY_PASSWORD` variables.
* The token-based approach has been included. To connect the container to the Cloud, run the container with the `DEPLOY_TOKEN` variable containing the Wallarm node token copied from the Wallarm Console UI.

It is recommended to use the new approach to run the image 4.0. The "email and password"-based approach will be deleted in future releases, please migrate before.

To create a new Wallarm node and get its token:

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.

## Step 6: Migrate whitelists and blacklists from the previous Wallarm node version to 4.0

[Migrate](../migrate-ip-lists-to-node-3.md) whitelist and blacklist configuration from previous Wallarm node version to 4.0.

## Step 7: Switch from deprecated configuration options

There are the following deprecated configuration options:

* The `WALLARM_ACL_ENABLE` environment variable has been deprecated. If IP lists are [migrated](../migrate-ip-lists-to-node-3.md) to the new node version, remove this variable from the `docker run` command.
* The following NGINX directives have been renamed:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the directives with former names are explicitly specified in the mounted configuration files. If so, rename them.
* The following Envoy parameters have been renamed:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * `tsets` section → `rulesets`, and correspondingly the `tsN` entries in this section → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    We only changed the names of the parameters, their logic remains the same. Parameters with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the parameters with former names are explicitly specified in the mounted configuration files. If so, rename them.

## Step 8: Update the Wallarm blocking page (if upgrading NGINX-based image)

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the Docker container 2.18 or lower was configured to return the `&/usr/share/nginx/html/wallarm_blocked.html` page to blocked requests, change this configuration as follows:

1. [Copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.
1. [Mount](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) the customized page and the NGINX configuration file to a new Docker container in the next step.

## Step 9: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 10: Run the container using the updated image

Run the container using the updated image. You can pass the same configuration parameters that were passed when running a previous image version except for the ones [listed in the previous step](#step-6-switch-from-deprecated-configuration-options).

There are two options for running the container using the updated image:

* **With the environment variables** specifying basic filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Instructions for the Envoy-based Docker container →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **In the mounted configuration file** specifying advanced filtering node configuration
    * [Instructions for the NGINX-based Docker container →](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Instructions for the Envoy-based Docker container →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Step 11: Adjust Wallarm node filtration mode settings to changes released in the latest versions

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * Environment variable [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) or the directive [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) of the NGINX‑based Docker container
      * Environment variable [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) or the directive [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) of the Envoy‑based Docker container
      * [General filtration rule configured in Wallarm Console](../../user-guides/settings/general.md)
      * [Low-level filtration rules configured in Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

## Step 12: Test the filtering node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 13: Delete the filtering node of the previous version

If the deployed image of the version 4.0 operates correctly, you can delete the filtering node of the previous version in the Wallarm Console → **Nodes** section.

## Step 14: Re-enable the Active threat verification module (if upgrading node 2.16 or lower)

Learn the [recommendation on the Active threat verification module setup](../../admin-en/attack-rechecker-best-practices.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).
