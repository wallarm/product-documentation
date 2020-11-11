# Recommendations for a safe WAF node update process

This document describes recommendations and associated risks for a safe update of Wallarm WAF node up to 2.16.

## Common recommendations

* Carefully plan and monitor the WAF node update process. Estimated release dates for new versions of WAF nodes are published in the [WAF node versioning policy](versioning-policy.md).
* If your infrastructure has multiple WAF nodes installed, update them gradually. After updating the first WAF node, monitor the WAF node modules operation within a day and gradually update other WAF nodes if the first WAF node operates correctly.
* For the model with separated development and production environments, update the WAF node gradually. First, apply and test new version in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring WAF nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-waf-changes).
* Before updating the WAF node, set the WAF node filtering mode to `monitoring`. If all modules work correctly and there is no abnormal number of new false positives in the `monitoring` mode for a day, put the WAF node in the `block` mode.
* Update NGINX to the latest version available before applying WAF node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build a WAF module for a custom version of NGINX.

## Possible risks

Below are the risks that may occur when updating the WAF node. To reduce the impact of the risks, please follow the appropriate guidelines when updating.

### Changed functionality

A new minor version of the WAF node may contain the following changes:

* Support for new installation options
* Dropped support for unclaimed installation options
* New WAF node features
* Optimization of work of the WAF node

The configuration of the previous version is automatically applied to the new version and does not require additional changes. When updating the cloud image, you should manually transfer the configuration files to the new version. Most of the new features are configured via the directives in configuration files.

Before upgrading, please check the [set of changes](what-is-new.md) and consider a possible configuration change in planning the upgrade.

??? "Set of changes in WAF node 2.16"
    **Supported installation options**

    * Dropped support for the operating system CentOS 6.x
    * Dropped support for the cloud platform Heroku
    * Dropped support for the operating system Debian 8.x (jessie-backports)
    * Added CentOS 8.x support
    * Added Envoy support
    * Added Yandex.Cloud support
    <!-- * Added Ubuntu 20.04 LTS (Focal Fossa) support -->

    All platforms available for the WAF node 2.16 installation are listed [here](../admin-en/supported-platforms.md).

    **New WAF node features**

    * [Displaying versions](../user-guides/nodes/regular-node.md#viewing-details-of-waf-node) of installed WAF, NGINX-WAF, and Envoy-WAF components in the Wallarm Console
    * New configuration directive [`wallarm_enable_libdtection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) reduces the number of false positives using additional attack validation with improved algorithms

        !!! warning "Memory consumption increase"
            When analyzing attacks using the libdetection library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%.

    * Ability to append or replace the value of the NGINX header `Server`. For setup, it is required to add an appropriate rule to the application profile. To add the rule, please contact [our technical support](mailto:support@wallarm.com)
    * New WAF node statistics parameters:
        * `db_apply_time`: Unix time of the last update of the proton.db file
        * `lom_apply_time`: Unix time of the last update of the [LOM](../glossary-en.md#lom) file
        * `ts_files`: object with information about the [LOM](../glossary-en.md#lom) file
        * `db_files`: object with information about the proton.db file
        * `overlimits_time`: the number of attacks with the type of [overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the WAF node

        The full list of available statistics parameters is available [here](../admin-en/configure-statistics-service.md#working-with-the-statistics-service).
    <!-- * [Example of Terraform code](../admin-en/installation-guides/amazon-cloud/deploy-waf-via-terraform/deploy-waf-via-terraform-intro.md) to deploy a cluster of Wallarm WAF node in AWS public cloud -->
    
    * Installation of the WAF node in the form of the [Kubernetes sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md)

    **Optimization of work of the WAF node**

    * Increased assembly speed of LOM by 5-10 times on average. A more optimized process is now used to generate security rules. You can find more details about optimization in the [post on our news portal](https://changelog.wallarm.com/security-rule-generation-5x-faster-152572)

## Update process

To update the WAF node, it is recommended to check the general recommendations for the process and follow the instructions for updating the installed modules:

* [General recommendations for a safe WAF node update process](general-recommendations.md)
* [Updating modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Updating the Docker container with the modules for NGINX](docker-container.md)
* [Updating NGINX Ingress controller with integrated Wallarm WAF](ingress-controller.md)
<!-- * [Cloud WAF node image](cloud-image.md) -->


### New false positives

We improve the traffic analysis with each new version of the WAF node, it means that the number of false positives decreases. However each system has its own specificities, so we recommend analyzing the work of the new version of the WAF node in the `monitoring` mode before enabling the blocking mode (`block`).

To analyze the number of new false positives after the update:

1. Deploy the new version of the WAF node in the `monitoring` [mode](../admin-en/configure-wallarm-mode.md) and send the traffic to the WAF node.
2. After some time, open Wallarm Console → **Events** section and analyze the number of requests that are mistakenly recognized as attacks.
3. If you find abnormal growth in the number of false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### Increased amount of used resources

Usage of some new WAF node features may cause changes in the amount of used resources. Information about changes in the amount of used resources is highlighted in the [What is new](what-is-new.md) section.

Also, it is recommended to monitor the WAF node operation: if you find significant differences in the actual amount of used resources and in the amount specified in the documentation, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Update process

The WAF node update process depends on the platform and installation forms. Please select the installation form and follow the appropriate instructions:

* [Modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Docker container with the modules for NGINX](docker-container.md)
* [NGINX Ingress controller with integrated Wallarm WAF](ingress-controller.md)
<!-- * [Cloud WAF node image](cloud-image.md) -->
