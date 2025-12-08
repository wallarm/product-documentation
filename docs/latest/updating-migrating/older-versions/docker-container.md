[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../../api-specification-enforcement/overview.md

# Upgrading an EOL Docker NGINX-based image

These instructions describe the steps to upgrade the running end‑of‑life Docker NGINX-based image (version 3.6 and lower) to the version 6.x.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules (only if upgrading node 2.18 or lower)

If upgrading node 2.18 or lower, please inform [Wallarm technical support](mailto:support@wallarm.com) that you are upgrading filtering node modules up to 6.x and ask to enable new IP list logic for your Wallarm account. When new IP list logic is enabled, please ensure the section [**IP lists**](../../user-guides/ip-lists/overview.md) of Wallarm Console is available.

## Step 2: Disable the Threat Replay Testing module (only if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing-trt) module in Wallarm Console → **Vulnerabilities** → **Configure**.

The module operation can cause [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

## Step 3: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 4: Download the updated filtering node image

``` bash
docker pull wallarm/node:6.8.0
```

## Step 5: Switch to the token-based connection to the Wallarm Cloud

Approach to connect the container to the Wallarm Cloud has been upgraded as follows:

* [The "email and password"-based approach has been deprecated](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens). In this approach, the node was registered in the Wallarm Cloud automatically once the container started with correct credentials passed in the `DEPLOY_USER` and `DEPLOY_PASSWORD` variables.
* The token-based approach has been included. To connect the container to the Cloud, run the container with the `WALLARM_API_TOKEN` variable containing the Wallarm API token copied from the Wallarm Console UI.

It is recommended to use the new approach to run the image 6.x. The "email and password"-based approach will be deleted in future releases, please migrate before.

To create a new Wallarm node and get its token:

1. Open Wallarm Console → **Settings** → **API Tokens** and generate a token with the **Node deployment/Deployment** usage type.
1. Copy the generated token.

## Step 6: Migrate allowlists and denylists from the previous Wallarm node version to 6.x (only if upgrading node 2.18 or lower)

If upgrading node 2.18 or lower, [migrate](../migrate-ip-lists-to-node-3.md) allowlist and denylist configuration from previous Wallarm node version to 6.x.

## Step 7: Switch from deprecated configuration options

There are the following deprecated configuration options:

* The `WALLARM_ACL_ENABLE` environment variable has been deprecated.

    If IP lists are [migrated](../migrate-ip-lists-to-node-3.md) to the new node version, remove this variable from the `docker run` command.
* If setting the postanalytics memory amount with the `TARANTOOL_MEMORY_GB` environment variable, rename the variable to `SLAB_ALLOC_ARENA`.
* The following NGINX directives have been renamed:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the directives with former names are explicitly specified in the mounted configuration files. If so, rename them.
* The `wallarm_request_time` [logging variable](../../admin-en/configure-logging.md#filter-node-variables) has been renamed to `wallarm_request_cpu_time`.

    We only changed the variable name, its logic remains the same. The old name is temporarily supported as well, but still it is recommended to rename the variable.

## Step 8: Update the Wallarm blocking page (if upgrading NGINX-based image)

In new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.

If the Docker container was configured to return the `&/usr/share/nginx/html/wallarm_blocked.html` page to blocked requests, change this configuration as follows:

1. [Copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) the new version of a sample page.
1. [Mount](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) the customized page and the NGINX configuration file to a new Docker container in the next step.

## Step 9: Review recent architectural updates (for NGINX-based Docker image)

The latest update has introduced architectural changes caused by [image optimization](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) and [Tarantool replacement](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) that may impact users, especially those mounting custom configuration files during container initiation due to alterations in the paths of certain files. Please familiarize yourself with these changes to ensure proper configuration and usage of the new image.

## Step 10: Transfer the `overlimit_res` attack detection configuration from directives to the rule

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## Step 11: Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Step 12: Run the container using the updated image

Run the container using the updated image and making necessary adjustments to the paths for the mounted files if required by the recent changes to the image caused by [image optimization](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) and [Tarantool replacement](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics).

There are two options for running the container using the updated image:

* [With the environment variables](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
* [In the mounted configuration file](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## Step 13: Adjust Wallarm node filtration mode settings to changes released in the latest versions (only if upgrading node 2.18 or lower)

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * Environment variable [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) or the directive [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) of the NGINX‑based Docker container
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Endpoint-targeted filtration rules configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

## Step 14: Test the filtering node operation

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## Step 15: Delete the filtering node of the previous version

If the deployed image of the version 6.x operates correctly, you can delete the filtering node of the previous version in the Wallarm Console → **Nodes** section.

## Step 16: Re-enable the Threat Replay Testing module (only if upgrading node 2.16 or lower)

Learn the [recommendation on the Threat Replay Testing module setup](../../vulnerability-detection/threat-replay-testing/setup.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).
