# Recommendations for a safe WAF node update process

This document describes recommendations and associated risks for a safe update of Wallarm WAF node. Please use these recommendations to migrate to a newer version of the WAF node with less cost and risk.

## Possible risks

Below are the risks that may occur when updating the WAF node. To reduce the impact of the risks, please follow the appropriate guidelines when updating:

* Changed functionality. Please check the section [What is new](what-is-new.md) to be informed of all the breaking, major and minor changes on the new WAF node version.

    In most installation forms, the configuration of the previous version is automatically applied to the new version after updating a WAF node (when updating the cloud image, you should manually transfer the configuration files to the new version).
* New false positives. We improve the traffic analysis with each new version of the WAF node, it means that the number of false positives decreases. To reduce the risk, deploy the new version of the WAF node in the `monitoring` [filtering mode](../admin-en/configure-wallarm-mode.md) and check for false positives in the Wallarm Console → section **Events**.

    If you find false attacks, mark them as false positives or contact the [Wallarm technical support](mailto:support@wallarm.com). If there are no false positives in the event list, put the WAF node in the `block` mode.
* Increased amount of used memory and CPU resources. Please check the section [What is new](what-is-new.md) to be informed of changes in memory and CPU usage. Also, monitor the WAF node operation: if you find that amount of used memory and CPU resources increased significantly, please contact the [Wallarm technical support](mailto:support@wallarm.com).

## Common recommendations

* Carefully plan and monitor the WAF node update process. Estimated release dates for new versions of WAF nodes are published in the [WAF node versioning policy](versioning-policy.md).
* If your infrastructure has multiple WAF nodes installed, update them gradually. After updating the first WAF node, ensure that the modules work correctly and gradually update other WAF nodes.
* Gradually roll out new WAF node version in a model with separated environments. First, apply and test new packages versions in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring WAF nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-waf-changes).
* Deploy a new version of the WAF node with the filtering mode set to `monitoring`. If all modules work correctly and there are no false positives in the `monitoring` mode, put the WAF node in `block` mode.
* Update NGINX to the latest version available before applying WAF node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build a WAF module for a custom version of NGINX.

## Update process

The WAF node update process depends on the platform and installation forms. Please select the installation form and follow the instructions:

* Modules for NGINX, NGINX Plus, Kong: [Updating Linux WAF packages](nginx-modules.md)
* Docker container with the modules for NGINX: [Updating the Docker Container](docker-container.md)
