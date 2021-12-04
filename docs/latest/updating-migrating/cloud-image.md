[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png

# Upgrading the cloud node image

These instructions describe the steps to upgrade the cloud node image deployed on AWS, GCP, or Yandex.Cloud up to 3.4.

--8<-- "../include/waf/upgrade/warning-node-types-upgrade-to-3.4.md"

## Upgrade procedure

To upgrade the version of the filtering node deployed in the cloud:

1. If upgrading Wallarm node 2.18 or lower, inform Wallarm technical support that you are upgrading Wallarm node modules up to 3.4.
2. If upgrading Wallarm node 3.0 or lower, adjust Wallarm node filtration mode settings to changes released in newer versions.
3. Launch a new virtual machine based on the filtering node 3.4 image.
4. Copy the filtering node settings from the previous version to the new version.
5. Delete the previous Wallarm node instance.

A more detailed description of the upgrade steps is provided below.

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules

If upgrading Wallarm node 2.18 or lower, please inform [Wallarm technical support](mailto:support@wallarm.com) that you are upgrading filtering node modules up to 3.4 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.

## Step 2: Launch a new instance with the filtering node 3.4

1. Open the Wallarm filtering node image on the cloud platform marketplace and proceed to the image launch:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
      * [Yandex.Cloud marketplace](https://cloud.yandex.com/marketplace/products/f2emrc60s1nh9356v1rq)
2. At the launch step, set the following settings:

      * Select the image version `3.4.x`
      * For AWS, select the [created security group](../admin-en/installation-ami-en.md#3-create-a-security-group) in the field **Security Group Settings**
      * For AWS, select the name of the [created key pair](../admin-en/installation-ami-en.md#2-create-a-pair-of-ssh-keys) in the field **Key Pair Settings**
3. Confirm the instance launch.
4. For GCP, configure the instance following these [instructions](../admin-en/installation-gcp-en.md#3-configure-the-filtering-node-instance).

## Step 3: Adjust Wallarm node filtration mode settings to changes released in version 3.2

If upgrading Wallarm node 3.0 or lower:

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md):
      * [Directive `wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../user-guides/settings/general.md)
      * [Low-level filtration rules configured in Wallarm Console](../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../admin-en/configure-wallarm-mode.md).

## Step 4: Connect the filtering node to Wallarm Cloud

1. Connect to the filtering node instance via SSH. More detailed instructions for connecting to the instances are available in the cloud platform documentation:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
      * [Yandex.Cloud documentation](https://cloud.yandex.com/docs/compute/quickstart/quick-create-linux#connect-to-vm)
2. Connect the filtering node to Wallarm Cloud using a new cloud node token or username and password to Wallarm Console as described in the instructions for the cloud platform:
      * [AWS](../admin-en/installation-ami-en.md#6-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../admin-en/installation-gcp-en.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [Yandex.Cloud](../admin-en/installation-guides/install-in-yandex-cloud.md#3-connect-the-filtering-node-to-wallarm-cloud)

## Step 5: Copy the filtering node settings from the previous version to the new version

1. Copy the settings for processing and proxying requests from the following configuration files of the previous Wallarm node version to the files of the filtering node 3.4:
      * `/etc/nginx/nginx.conf` and other files with NGINX settings
      * `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings
      * `/etc/nginx/conf.d/wallarm-status.conf` with the filtering node monitoring service settings
      * `/etc/environment` with environment variables
      * `/etc/default/wallarm-tarantool` with Tarantool settings
      * other files with custom settings for processing and proxying requests
2. If upgrading Wallarm node 2.18 or lower, migrate whitelist and blacklist configuration from previous Wallarm node version to 3.4 following the [instructions](migrate-ip-lists-to-node-3.md).
3. Restart NGINX to apply the settings: 

    ```bash
    sudo systemctl restart nginx
    ```

Detailed information about working with NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/ru/docs/beginners_guide.html).

The list of filtering node directives is available [here](../admin-en/configure-parameters-en.md).

## Step 6: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Step 7: Creating the virtual machine image based on the filtering node 3.4 in AWS or GCP

To create the virtual machine image based on the filtering node 3.4, please follow the instructions for [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) or [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## Step 8: Delete the previous Wallarm node instance

If the new version of the filtering node is successfully configured and tested, remove the instance and virtual machine image with the previous version of the filtering node using the AWS, GCP, or Yandex.Cloud management console.
