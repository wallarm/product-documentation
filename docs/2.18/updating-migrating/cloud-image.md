[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png

# Updating the cloud node image

These instructions describe the steps to update the cloud node image deployed on AWS, GCP, or Yandex.Cloud up to 2.18.

## Update procedure

To update the version of the filtering node deployed in the cloud:

1. Launch a new virtual machine based on the filtering node 2.18 image.
2. Copy the filtering node settings from the previous version to the new version.
3. Delete the previous Wallarm node instance.

A more detailed description of the upgrade steps is provided below.

## Step 1: Launch a new instance with the filtering node 2.18

1. Open the Wallarm filtering node image on the cloud platform marketplace and proceed to the image launch:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
      * [Yandex.Cloud marketplace](https://cloud.yandex.com/marketplace/products/f2emrc60s1nh9356v1rq)
2. At the launch step, set the following settings:

      * Select the image version `2.18.x`
      * For AWS, select the [created security group](../admin-en/installation-ami-en.md#3-create-a-security-group) in the field **Security Group Settings**
      * For AWS, select the name of the [created key pair](../admin-en/installation-ami-en.md#2-create-a-pair-of-ssh-keys) in the field **Key Pair Settings**
3. Confirm the instance launch.
4. For GCP, configure the instance following these [instructions](../admin-en/installation-gcp-en.md#3-configure-the-filtering-node-instance).

## Step 2: Connect the filtering node to Wallarm Cloud

1. Connect to the filtering node instance via SSH. More detailed instructions for connecting to the instances are available in the cloud platform documentation:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
      * [Yandex.Cloud documentation](https://cloud.yandex.com/docs/compute/quickstart/quick-create-linux#connect-to-vm)
2. Connect the filtering node to Wallarm Cloud using a new cloud node token or username and password to Wallarm Console as described in the instructions for the cloud platform:
      * [AWS](../admin-en/installation-ami-en.md#6-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../admin-en/installation-gcp-en.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [Yandex.Cloud](../admin-en/installation-guides/install-in-yandex-cloud.md#3-connect-the-filtering-node-to-wallarm-cloud)

## Step 3: Copy the filtering node settings from the previous version to the new version

1. Copy the settings for processing and proxying requests from the following configuration files of the previous Wallarm node version to the files of the filtering node 2.18:
      * `/etc/nginx/nginx.conf` and other files with NGINX settings
      * `/etc/nginx/conf.d/wallarm.conf` with global filtering node settings
      * `/etc/nginx/conf.d/wallarm-status.conf` with the filtering node monitoring service settings
      * `/etc/environment` with environment variables
      * `/etc/default/wallarm-tarantool` with Tarantool settings
      * other files with custom settings for processing and proxying requests
2. Restart NGINX to apply the settings: 

    ```bash
    sudo systemctl restart nginx
    ```

Detailed information about working with NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/ru/docs/beginners_guide.html).

The list of filtering node directives is available [here](../admin-en/configure-parameters-en.md).

## Step 4: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation.md"

## Step 5: Creating the virtual machine image based on the filtering node 2.18 in AWS or GCP

To create the virtual machine image based on the filtering node 2.18, please follow the instructions for [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) or [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## Step 6: Delete the previous Wallarm node instance

If the new version of the filtering node is successfully configured and tested, remove the instance and virtual machine image with the previous version of the filtering node using the AWS, GCP, or Yandex.Cloud management console.
