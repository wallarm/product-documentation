# Recommendations for a safe WAF node update process

This document describes recommendations and associated risks for a safe update of Wallarm WAF node up to 2.18.

## Common recommendations

* Carefully plan and monitor the WAF node update process. Estimated release dates for new versions of WAF nodes are published in the [WAF node versioning policy](versioning-policy.md).
* If your infrastructure has multiple WAF nodes installed, update them gradually. After updating the first WAF node, monitor the WAF node modules operation within a day and gradually update other WAF nodes if the first WAF node operates correctly.
* For the model with separated development and production environments, update the WAF node gradually. First, apply and test new version in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring WAF nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-waf-changes).
* Before updating the WAF node, set the WAF node filtration mode to `monitoring`. If all modules work correctly and there is no abnormal number of new false positives in the `monitoring` mode for a day, then put the WAF node in the `block` mode.
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

Before upgrading, please check the [set of changes](what-is-new.md) and consider a possible configuration change when planning the upgrade.

??? "Set of changes in WAF node 2.18"

    **Changes in supported installation platforms**

    * Added Ubuntu 20.04 LTS (focal) support

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)

    **New WAF node features**

    * New variable `wallarm_attack_type_list` in the extended WAF node logging format. Attack types detected in the request are saved in this variable in text format.
    [More details on the variable `wallarm_attack_type_list` →]
    * New method for setting up the blocking page and error code returned in the response to the blocked request. Now, to return different responses to requests originated from different devices and applications, you can use the variable as the value of the directives `wallarm_block_page` and `wallarm_acl_block_page`.
        [Detailed instructions on setting up the response via the variable →]
    * New WAF node statistics parameter `startid`. This parameter stores the randomly-generated unique ID of the WAF node.
        [The full list of available statistics parameters →]
    * Support of new Wallarm Ingress controller annotation `nginx.ingress.kubernetes.io/wallarm-acl-block-page`. This annotation is used to set up the response to the request originated from a blocked IP address.
        [Example of response configuration via `nginx.ingress.kubernetes.io/wallarm-acl-block-page` →]
    * Decreased memory amount allocated for the postanalytics service in deployed WAF node cloud image by default.
        In previous WAF node versions, the default memory amount allocated for Tarantool was 75% of the total instance memory. In the WAF node version 2.18, 40% of the total instance memory is allocated for Tarantool.

### New false positives

We improve the traffic analysis with each new version of the WAF node. This means that the number of false positives decreases with each new version. However, each protected application has its own specificities, so we recommend analyzing the work of the new version of the WAF node in the `monitoring` mode before enabling the blocking mode (`block`).

To analyze the number of new false positives after the update:

1. Deploy the new version of the WAF node in the `monitoring` [mode](../admin-en/configure-wallarm-mode.md) and send the traffic to the WAF node.
2. After some time, open the Wallarm Console → **Events** section and analyze the number of requests that are mistakenly recognized as attacks.
3. If you find abnormal growth in the number of false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### Increased amount of used resources

Usage of some new WAF node features may cause changes in the amount of used resources. Information about changes in the amount of used resources is highlighted in the [What is new](what-is-new.md) section.

Also, it is recommended to monitor the WAF node operation: if you find significant differences in the actual amount of used resources and in the amount specified in the documentation, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Update process

The WAF node update process depends on the platform and installation forms. Please select the installation form and follow the appropriate instructions:

* [Modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Docker container with the modules for NGINX](docker-container.md)
* [NGINX Ingress controller with integrated Wallarm WAF](ingress-controller.md)
* [Cloud WAF node image](cloud-image.md)
