[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# Upgrading the cloud node image

These instructions describe the steps to upgrade the cloud node image 4.x deployed on AWS or GCP up to 5.0.

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/cloud-image.md).

## Requirements

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Step 1: Launch a new instance with the filtering node 5.0

1. Open the Wallarm filtering node image on the cloud platform marketplace and proceed to the image launch:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. At the launch step, set the following settings:

      * Select the image version `5.x.x`
      * For AWS, select the created security group in the field **Security Group Settings**
      * For AWS, select the name of the created key pair in the field **Key Pair Settings**
3. Confirm the instance launch.
4. For GCP, configure the instance following these [instructions](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance).

## Step 2: Connect the filtering node to Wallarm Cloud

1. Connect to the filtering node instance via SSH. More detailed instructions for connecting to the instances are available in the cloud platform documentation:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Create a new Wallarm node and connect it to the Wallarm Cloud using the generated token as described in the instructions for the cloud platform:
      * [AWS](../installation/cloud-platforms/aws/ami.md#4-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## Step 3: Copy the filtering node settings from the previous version to the new version

Copy the settings for processing and proxying requests from the following configuration files of the previous Wallarm node version to the files of the filtering node 5.0:

* `/etc/nginx/nginx.conf` and other files with NGINX settings
* `/etc/nginx/conf.d/wallarm-status.conf` with the filtering node monitoring service settings
* `/etc/environment` with environment variables
* any other custom configuration files for request processing and proxying

Detailed information about working with NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/docs/beginners_guide.html).

The list of filtering node directives is available [here](../admin-en/configure-parameters-en.md).

## Step 4: Restart NGINX

Restart NGINX to apply the settings:

```bash
sudo systemctl restart nginx
```

## Step 5: Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Step 6: Create the virtual machine image based on the filtering node 5.0 in AWS or GCP

To create the virtual machine image based on the filtering node 5.0, please follow the instructions for [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) or [GCP](../admin-en/installation-guides/google-cloud/create-image.md).

## Step 7: Delete the previous Wallarm node instance

If the new version of the filtering node is successfully configured and tested, remove the instance and virtual machine image with the previous version of the filtering node using the AWS or GCP management console.
