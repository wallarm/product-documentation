# Recommendations for a safe WAF node update process

This document describes recommendations and associated risks for a safe update of Wallarm WAF node up to 3.0.

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

??? "Set of changes in WAF node 3.0"
    **Changes in supported installation platforms**

    * Dropped support for the operating system Ubuntu 16.04 LTS (xenial)

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)

    **Changes in supported WAF node configuration parameters**

    * Dropped support for all `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP addresses blacklist. Manual configuration of IP blacklisting is no longer required.

        [Details on migrating blacklist configuration →](migrate-ip-lists-to-node-3.md)

    * Added new NGINX directive and Envoy parameter `disable_acl`. This parameter allows to disabled request origin analysis.

        [Details on the `disable_acl` NGINX directive →](../admin-en/configure-parameters-en.md#disable_acl)

        [Details on the `disable_acl` Envoy parameter →](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    **Changes in system requirements for the WAF node installation**

    Starting with version 3.0, the WAF node supports IP addresses [whitelists, blacklists, and greylists](../user-guides/ip-lists/overview.md). The Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

    The WAF node downloads an actual list of IP addresses registered in whitelisted, blacklisted, or greylisted countries or data centers from GCP storage. By default, access to this storage can be restricted in your system. Allowing access to GCP storage is a new requirement for the virtual machine on which the WAF node is installed.

    [Range of GCP IP addresses that should be allowed →](https://www.gstatic.com/ipranges/goog.json)

    **New features**

    * Support for new [filtration mode](../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP addresses greylist](../user-guides/ip-lists/greylist.md).

        The WAF node operating in `safe_blocking` mode blocks only those malicious requests originated from greylisted IP addresses that allow a significant reduction of [false positives](../about-wallarm-waf/protecting-against-attacks.md#false-positives) numbers.
    
    * New reaction of triggers **Add to greyist** allowing to automatically greylist IP addresses originated a specific number of malicious requests.

        [Example of the trigger that greylists IP addresses →](../user-guides/triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour)
    
    * Management of [IP addresses whitelist](../user-guides/ip-lists/whitelist.md) via the Wallarm Console.
    * Automated whitelisting of [Wallarm Vulnerability Scanner](../about-wallarm-waf/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual whitelisting of Scanner IP addresses is no longer required.
    * New parameters of the file `node.yaml` for configuring the synchronization of the Wallarm Cloud and WAF nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface through which requests to Wallarm API are sent.

        [See the full list of `node.yaml` parameters for Wallarm Cloud and WAF node synchronization setup →](../admin-en/configure-cloud-node-synchronization-en.md#credentials-to-access-the-wallarm-cloud)
    
    * Ability to whitelist, blacklist, or greylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country or data center.

        [Details on adding IPs to the whitelist, blacklist, and greylist →](../user-guides/ip-lists/overview.md)

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
