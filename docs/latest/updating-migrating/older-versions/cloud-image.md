[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../../images/admin-guides/test-attacks-quickstart.png

# Upgrading the cloud node image 2.18 or lower

These instructions describe the steps to upgrade the cloud node image 2.18 or lower deployed on AWS, GCP, or Yandex.Cloud up to 3.6.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules

Please inform [Wallarm technical support](mailto:support@wallarm.com) that you are upgrading filtering node modules up to 3.6 and ask to enable new IP list logic for your Wallarm account. When new IP list logic is enabled, please ensure the section [**IP lists**](../../user-guides/ip-lists/overview.md) of Wallarm Console is available.

## Step 2: Disable the Active threat verification module (if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Active threat verification](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification) module in Wallarm Console → **Scanner** → **Settings**.

The module operation can cause [false positives](../../about-wallarm-waf/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

## Step 3: Launch a new instance with the filtering node 3.6

1. Open the Wallarm filtering node image on the cloud platform marketplace and proceed to the image launch:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
      * [Yandex.Cloud marketplace](https://cloud.yandex.com/marketplace/products/f2emrc60s1nh9356v1rq)
2. At the launch step, set the following settings:

      * Select the image version `3.6.x`
      * For AWS, select the [created security group](../../admin-en/installation-ami-en.md#3-create-a-security-group) in the field **Security Group Settings**
      * For AWS, select the name of the [created key pair](../../admin-en/installation-ami-en.md#2-create-a-pair-of-ssh-keys) in the field **Key Pair Settings**
3. Confirm the instance launch.
4. For GCP, configure the instance following these [instructions](../../admin-en/installation-gcp-en.md#3-configure-the-filtering-node-instance).

## Step 4: Adjust Wallarm node filtration mode settings to changes released in the latest versions

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../user-guides/settings/general.md)
      * [Low-level filtration rules configured in Wallarm Console](../../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../../admin-en/configure-wallarm-mode.md).

## Step 5: Connect the filtering node to Wallarm Cloud

1. Connect to the filtering node instance via SSH. More detailed instructions for connecting to the instances are available in the cloud platform documentation:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
      * [Yandex.Cloud documentation](https://cloud.yandex.com/docs/compute/quickstart/quick-create-linux#connect-to-vm)
2. Connect the filtering node to Wallarm Cloud using a new cloud node token or username and password to Wallarm Console as described in the instructions for the cloud platform:
      * [AWS](../../admin-en/installation-ami-en.md#6-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../admin-en/installation-gcp-en.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [Yandex.Cloud](../../admin-en/installation-guides/install-in-yandex-cloud.md#3-connect-the-filtering-node-to-wallarm-cloud)

## Step 6: Copy the filtering node settings from the previous version to the new version

1. Copy the settings for processing and proxying requests from the following configuration files of the previous Wallarm node version to the files of the filtering node 3.6:
      * `/etc/nginx/nginx.conf` and other files with NGINX settings
      * `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings
      * `/etc/nginx/conf.d/wallarm-status.conf` with the filtering node monitoring service settings
      * `/etc/environment` with environment variables
      * `/etc/default/wallarm-tarantool` with Tarantool settings
      * other files with custom settings for processing and proxying requests
1. Rename the following NGINX directives if they are explicitly specified in configuration files:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
1. [Migrate](../migrate-ip-lists-to-node-3.md) whitelist and blacklist configuration from previous Wallarm node version to 3.6.
1. If the page `&/usr/share/nginx/html/wallarm_blocked.html` is returned to blocked requests, [copy and customize](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) its new version.

      In the new node version, the Wallarm sample blocking page has [been changed](what-is-new.md#new-blocking-page). The logo and support email on the page are now empty by default.
1. Restart NGINX to apply the settings: 

    ```bash
    sudo systemctl restart nginx
    ```

Detailed information about working with NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/ru/docs/beginners_guide.html).

The list of filtering node directives is available [here](../../admin-en/configure-parameters-en.md).

## Step 7: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Step 8: Create the virtual machine image based on the filtering node 3.6 in AWS or GCP

To create the virtual machine image based on the filtering node 3.6, please follow the instructions for [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) or [GCP](../../admin-en/installation-guides/google-cloud/create-image.md).

## Step 9: Delete the previous Wallarm node instance

If the new version of the filtering node is successfully configured and tested, remove the instance and virtual machine image with the previous version of the filtering node using the AWS, GCP, or Yandex.Cloud management console.

## Step 10: Re-enable the Active threat verification module (if upgrading node 2.16 or lower)

Learn the [recommendation on the Active threat verification module setup](../../admin-en/attack-rechecker-best-practices.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).
