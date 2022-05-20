# Recommendations for a safe node upgrade process

This document describes recommendations and associated risks for a safe upgrade of Wallarm filtering node up to 4.0.

!!! warning "Breaking changes and recommendations for node upgrade"
    Please note that version 4.x contains **breaking changes**. Please carefully review what has been changed before upgrading the node.

    We recommend to upgrade both the client and [multi-tenant](../waf-installation/multi-tenant/overview.md) nodes up to version 4.0. It allows to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).

## Common recommendations

* Carefully plan and monitor the filtering node update process. Estimated release dates for new versions of Wallarm nodes are published in the [Wallarm node versioning policy](versioning-policy.md).
* If your infrastructure has multiple Wallarm nodes installed, update them gradually. After updating the first node, monitor the node modules operation within a day and gradually update other Wallarm nodes if the first node operates correctly.
* For the model with separated development and production environments, update the filtering node gradually. First, apply and test new version in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring Wallarm nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes).
* Before updating the filtering node, set the node filtration mode to `monitoring`. If all modules work correctly and there is no abnormal number of new false positives in the `monitoring` mode for a day, then put the filtering node in the `block` mode.
* Update NGINX to the latest version available before applying Wallarm node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the API Security module for a custom version of NGINX.

## Possible risks

Below are the risks that may occur when updating the filtering node. To reduce the impact of the risks, please follow the appropriate guidelines when updating.

### Changed functionality

* [What is new in Wallarm node 4.0](what-is-new.md)
* [What is new if upgrading the node 2.18 or lower](older-versions/what-is-new.md)

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
* [Migrating whitelists and blacklists from Wallarm node 2.18 and lower to 3.x](migrate-ip-lists-to-node-3.md)
