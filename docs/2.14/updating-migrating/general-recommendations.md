# Recommendations for a safe WAF node update process

This document describes recommendations and associated risks for a safe update of Wallarm WAF node. Please use these recommendations to migrate to a newer version of the WAF node with less cost and risk.

## Common recommendations

* Carefully plan and monitor the WAF node update process. Estimated release dates for new versions of WAF nodes are published in the [WAF node versioning policy](versioning-policy.md).
* If your infrastructure has multiple WAF nodes installed, update them gradually. After updating the first WAF node, ensure that the modules work correctly and gradually update other WAF nodes.
* Gradually roll out new WAF node version in a model with separated environments. First, apply and test new packages versions in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring WAF nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-waf-changes).
* Deploy a new version of the WAF node with the filtering mode set to `monitoring`. If all modules work correctly and there are no false positives in the `monitoring` mode, put the WAF node in `block` mode.
* Update NGINX to the latest version available before applying WAF node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build a WAF module for a custom version of NGINX.

## Possible risks

Below are the risks that may occur when updating the WAF node. To reduce the impact of the risks, please follow the appropriate guidelines when updating.

### Changed functionality

Each minor version of the WAF node contains a set of changes:

* Support for new installation options.
* Dropped support for unclaimed installation options.
* New WAF node features. Most of the new features are configured via the directives in configuration files.
* Optimization of the current WAF node features. The configuration of the previous version is automatically applied to the new version and does not require additional changes. When updating the cloud image, you should manually transfer the configuration files to the new version.

Before upgrading, please check the [set of changes](what-is-new.md) and consider a possible configuration change in planning the upgrade.

### New false positives

We improve the traffic analysis with each new version of the WAF node, it means that the number of false positives decreases. However each system has its own specificities, so we recommend analyzing the work of the new version of the WAF node in the `monitoring` mode before enabling the blocking mode (`block`).

To analyze the number of new false positives after the update:

1. Deploy the new version of the WAF node in the `monitoring` [mode](../admin-en/configure-wallarm-mode.md) and send the traffic to the WAF node.
2. After some time, open Wallarm Console → **Events** section and analyze the number of requests that are mistakenly recognized as attacks.
3. If you find abnormal growth in the number of false attacks, please contact the [Wallarm technical support](mailto:support@wallarm.com).

### Increased amount of used memory and CPU resources

Usage of some new WAF node features may cause a slight increase in the amount of used memory and CPU resources. Information about changes in the amount of used resources is highlighted in the [What is new](what-is-new.md) section.

Also, it is recommended to monitor the WAF node operation: if you find that amount of used memory and CPU resources increased significantly, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Update process

The WAF node update process depends on the platform and installation forms. Please select the installation form and follow the appropriate instructions:

* [Modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
* [Docker container with the modules for NGINX](docker-container.md)
* [NGINX Ingress controller with integrated Wallarm WAF](ingress-controller.md)
* [Cloud WAF node image](cloud-image.md)
