[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks.png

# Updating the cloud WAF node image

These instructions describe the steps to update the cloud WAF node image deployed on AWS, GCP, or Yandex.Cloud up to 3.0.

!!! warning "Breaking changes and skipping partner WAF node update"
    * The WAF node 3.0 is **totally incompatible with previous WAF node versions**. Before updating the modules up to 3.0, please carefully review the list of [WAF node 3.0 changes](what-is-new.md) and consider a possible configuration change.
    * We do NOT recommend updating [partner WAF node](../partner-waf-node/overview.md) up to version 3.0, since most changes will be fully supported only in partner WAF node [3.2](versioning-policy.md#version-list).

## Update procedure

To update the version of the WAF node deployed in the cloud:

1. Launch a new virtual machine based on the WAF node 3.0 image.
2. Copy the WAF node settings from the previous version to the new version.
3. Delete the previous WAF node instance.

A more detailed description of the upgrade steps is provided below.

## Step 1: Launch a new instance with the WAF node 3.0

1. Open the Wallarm WAF node image on the cloud platform marketplace and proceed to the image launch:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
      * [Yandex.Cloud marketplace](https://cloud.yandex.com/marketplace/products/f2emrc60s1nh9356v1rq)
2. At the launch step, set the following settings:

      * Select the image version `3.0.x`
      * For AWS, select the [created security group](../admin-en/installation-ami-en.md#3-create-a-security-group) in the field **Security Group Settings**
      * For AWS, select the name of the [created key pair](../admin-en/installation-ami-en.md#2-create-a-pair-of-ssh-keys) in the field **Key Pair Settings**
3. Confirm the instance launch.
4. For GCP, configure the instance following these [instructions](../admin-en/installation-gcp-en.md#3-configure-the-filter-node-instance).

## Step 2: Connect the WAF node to Wallarm Cloud

1. Connect to the WAF node instance via SSH. More detailed instructions for connecting to the instances are available in the cloud platform documentation:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
      * [Yandex.Cloud documentation](https://cloud.yandex.com/docs/compute/quickstart/quick-create-linux#connect-to-vm)
2. Connect the WAF node to Wallarm Cloud using a new cloud node token or username and password to the Wallarm Console as described in the instructions for the cloud platform:
      * [AWS](../admin-en/installation-ami-en.md#6-connect-the-filter-node-to-the-wallarm-cloud)
      * [GCP](../admin-en/installation-gcp-en.md#5-connect-the-filter-node-to-the-wallarm-cloud)
      * [Yandex.Cloud](../admin-en/installation-guides/install-in-yandex-cloud.md#3-connect-the-waf-node-to-wallarm-cloud)

## Step 3: Copy the WAF node settings from the previous version to the new version

1. Copy the settings for processing and proxying requests from the following configuration files of the previous WAF node version to the files of the WAF node 3.0:
      * `/etc/nginx/nginx.conf` and other files with NGINX settings
      * `/etc/nginx/conf.d/wallarm.conf` with global WAF node settings
      * `/etc/nginx/conf.d/wallarm-status.conf` with the WAF node monitoring service settings
      * `/etc/environment` with environment variables
      * `/etc/default/wallarm-tarantool` with Tarantool settings
      * other files with custom settings for processing and proxying requests
2. Restart NGINX to apply the settings: 

    ```bash
    sudo systemctl restart nginx
    ```

Detailed information about working with NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/ru/docs/beginners_guide.html).

The list of WAF node directives is available [here](../admin-en/configure-parameters-en.md).

## Step 4: Test WAF node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Step 5: Creating the virtual machine image based on the WAF node 3.0 in AWS or GCP

To create the virtual machine image based on the WAF node 3.0, please follow the instructions for [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) or [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## Step 6: Delete the previous WAF node instance

If the new version of the WAF node is successfully configured and tested, remove the instance and virtual machine image with the previous version of the WAF node using the AWS, GCP, or Yandex.Cloud management console.
