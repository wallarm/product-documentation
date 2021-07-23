# Recommendations for a safe node update process

This document describes recommendations and associated risks for a safe update of Wallarm filtering node up to 2.16.

## Common recommendations

* Carefully plan and monitor the filtering node update process. Estimated release dates for new versions of Wallarm nodes are published in the [Wallarm node versioning policy](versioning-policy.md).
* If your infrastructure has multiple Wallarm nodes installed, update them gradually. After updating the first node, monitor the node modules operation within a day and gradually update other Wallarm nodes if the first node operates correctly.
* For the model with separated development and production environments, update the filtering node gradually. First, apply and test new version in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring Wallarm nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes).
* Before updating the filtering node, set the node filtration mode to `monitoring`. If all modules work correctly and there is no abnormal number of new false positives in the `monitoring` mode for a day, then put the filtering node in the `block` mode.
* Update NGINX to the latest version available before applying Wallarm node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the API Security module for a custom version of NGINX.

## Possible risks

Below are the risks that may occur when updating the filtering node. To reduce the impact of the risks, please follow the appropriate guidelines when updating.

### Changed functionality

A new minor version of the filtering node may contain the following changes:

* Support for new installation options
* Dropped support for unclaimed installation options
* New filtering node featuress
* Optimization of work of the filtering node

The configuration of the previous version is automatically applied to the new version and does not require additional changes. When updating the cloud image, you should manually transfer the configuration files to the new version. Most of the new features are configured via the directives in configuration files.

Before upgrading, please check the [set of changes](what-is-new.md) and consider a possible configuration change when planning the upgrade.

??? "Set of changes in Wallarm node 2.16"
    **Supported installation options**

    * Dropped support for the operating system CentOS 6.x
    * Dropped support for the cloud platform Heroku
    * Dropped support for the operating system Debian 8.x (jessie-backports)
    * Added CentOS 8.x support
    * Added Envoy support
    * Added Yandex.Cloud support

    All platforms available for the filtering node 2.16 installation are listed [here](../admin-en/supported-platforms.md).

    **New filtering node featuress**

    * [Displaying versions](../user-guides/nodes/regular-node.md#viewing-details-of-filtering-node) of installed Wallarm nodes, NGINX-WAF, and Envoy-WAF components in the Wallarm Console
    * New configuration directive [`wallarm_enable_libdtection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) reduces the number of false positives using additional attack validation with improved algorithms

        !!! warning "Memory consumption increase"
            When analyzing attacks using the libdetection library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%.

    * Ability to append or replace the value of the NGINX header `Server`. For setup, it is required to add an appropriate rule to the application profile. To add the rule, please contact [our technical support](mailto:support@wallarm.com)
    * New filtering node statistics parameters:
        * `db_apply_time`: Unix time of the last update of the proton.db file
        * `lom_apply_time`: Unix time of the last update of the [LOM](../glossary-en.md#lom) file
        * `ts_files`: object with information about the [LOM](../glossary-en.md#lom) file
        * `db_files`: object with information about the proton.db file
        * `overlimits_time`: the number of attacks with the type of [overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the filtering node

        The full list of available statistic parameters is available [here](../admin-en/configure-statistics-service.md#working-with-the-statistics-service).
    <!-- * [Example of Terraform code](../admin-en/installation-guides/amazon-cloud/deploy-waf-via-terraform/deploy-waf-via-terraform-intro.md) to deploy a cluster of Wallarm filtering node in AWS public cloud -->
    
    * Installation of the filtering node in the form of the [Kubernetes sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md)

    **Optimization of work of the filtering node**

    * Increased assembly speed of LOM by 5-10 times on average. A more optimized process is now used to generate security rules. You can find more details about optimization in the [post on our news portal](https://changelog.wallarm.com/security-rule-generation-5x-faster-152572)

### New false positives

We improve the traffic analysis with each new version of the filtering node. This means that the number of false positives decreases with each new version. However, each protected application has its own specificities, so we recommend analyzing the work of the new version of the filtering node in the `monitoring` mode before enabling the blocking mode (`block`).

To analyze the number of new false positives after the update:

1. Deploy the new version of the filtering node in the `monitoring` [mode](../admin-en/configure-wallarm-mode.md) and send the traffic to the filtering node.
2. After some time, open the Wallarm Console → **Events** section and analyze the number of requests that are mistakenly recognized as attacks.
3. If you find abnormal growth in the number of false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### Increased amount of used resources

Usage of some new filtering node features may cause changes in the amount of used resources. Information about changes in the amount of used resources is highlighted in the [What is new](what-is-new.md) section.

Also, it is recommended to monitor the filtering node operation: if you find significant differences in the actual amount of used resources and in the amount specified in the documentation, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Update process

The Wallarm node update process depends on the platform and installation forms. Please select the installation form and follow the appropriate instructions:

* [Modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Docker container with the modules for NGINX](docker-container.md)
* [NGINX Ingress controller with integrated Wallarm API Security modules](ingress-controller.md)
* [Cloud node image](cloud-image.md)
