[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[greylist-docs]:                     ../user-guides/ip-lists/greylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Upgrading the cloud node image

These instructions describe the steps to upgrade the cloud node image 3.4 or 3.2 deployed on AWS or GCP up to 3.6.

To upgrade the node 2.18 or lower, please use the [different instructions](older-versions/cloud-image.md).

## Step 1: Launch a new instance with the filtering node 3.6

1. Open the Wallarm filtering node image on the cloud platform marketplace and proceed to the image launch:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. At the launch step, set the following settings:

      * Select the image version `3.6.x`
      * For AWS, select the [created security group](../admin-en/installation-ami-en.md#3-create-a-security-group) in the field **Security Group Settings**
      * For AWS, select the name of the [created key pair](../admin-en/installation-ami-en.md#2-create-a-pair-of-ssh-keys) in the field **Key Pair Settings**
3. Confirm the instance launch.
4. For GCP, configure the instance following these [instructions](../admin-en/installation-gcp-en.md#3-configure-the-filtering-node-instance).

## Step 2: Connect the filtering node to Wallarm Cloud

1. Connect to the filtering node instance via SSH. More detailed instructions for connecting to the instances are available in the cloud platform documentation:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Connect the filtering node to Wallarm Cloud using a new node token or username and password to Wallarm Console as described in the instructions for the cloud platform:
      * [AWS](../admin-en/installation-ami-en.md#6-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../admin-en/installation-gcp-en.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## Step 3: Copy the filtering node settings from the previous version to the new version

1. Copy the settings for processing and proxying requests from the following configuration files of the previous Wallarm node version to the files of the filtering node 3.6:
      * `/etc/nginx/nginx.conf` and other files with NGINX settings
      * `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings
      * `/etc/nginx/conf.d/wallarm-status.conf` with the filtering node monitoring service settings
      * `/etc/environment` with environment variables
      * `/etc/default/wallarm-tarantool` with Tarantool settings
      * other files with custom settings for processing and proxying requests
1. Rename the following NGINX directives if they are explicitly specified in configuration files:

    * `wallarm_instance` → [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../admin-en/configure-parameters-en.md#wallarm_protondb_path)

    We only changed the names of the directives, their logic remains the same. Directives with former names will be deprecated soon, so you are recommended to rename them before.
1. If the page `&/usr/share/nginx/html/wallarm_blocked.html` is returned to blocked requests, [copy and customize](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) its new version.

      In the new node version, the sample blocking page has [been changed](what-is-new.md#when-upgrading-node-34). The logo and support email on the page are now empty by default.

Detailed information about working with NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/docs/beginners_guide.html).

The list of filtering node directives is available [here](../admin-en/configure-parameters-en.md).

## Step 4: Transfer the `overlimit_res` attack detection configuration from directives to the rule

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## Step 5: Restart NGINX

Restart NGINX to apply the settings:

```bash
sudo systemctl restart nginx
```

## Step 6: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Step 7: Create the virtual machine image based on the filtering node 3.6 in AWS or GCP

To create the virtual machine image based on the filtering node 3.6, please follow the instructions for [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) or [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## Step 8: Delete the previous Wallarm node instance

If the new version of the filtering node is successfully configured and tested, remove the instance and virtual machine image with the previous version of the filtering node using the AWS or GCP management console.
