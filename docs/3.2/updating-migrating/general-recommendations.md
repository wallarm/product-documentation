# Recommendations for a safe node upgrade process

This document describes recommendations and associated risks for a safe update of Wallarm filtering node up to 3.2.

!!! warning "Breaking changes and recommendations for different node type update"
    * The Wallarm node 3.x is **totally incompatible with Wallarm node of version 2.18 and lower**. Before updating the modules up to 3.2, please carefully review the list of [Wallarm node changes](what-is-new.md) and consider a possible configuration change.
    * We recommend to update both the regular (client) and [partner](../partner-waf-node/overview.md) nodes of version 3.0 or lower up to version 3.2. This release enables IP greylists and other new features and stabilizes Wallarm node operation.

## Common recommendations

* Carefully plan and monitor the filtering node update process. Estimated release dates for new versions of Wallarm nodes are published in the [Wallarm node versioning policy](versioning-policy.md).
* If your infrastructure has multiple Wallarm nodes installed, update them gradually. After updating the first node, monitor the node modules operation within a day and gradually update other Wallarm nodes if the first node operates correctly.
* For the model with separated development and production environments, update the filtering node gradually. First, apply and test new version in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring Wallarm nodes for separated environments](../admin-en/configuration-guides/waf-in-separated-environments/configure-waf-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes).
* Before updating the filtering node, set the node filtration mode to `monitoring`. If all modules work correctly and there is no abnormal number of new false positives in the `monitoring` mode for a day, then put the filtering node in the `block` mode.
* Update NGINX to the latest version available before applying Wallarm node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the API Security module for a custom version of NGINX.

## Possible risks

Below are the risks that may occur when updating the filtering node. To reduce the impact of the risks, please follow the appropriate guidelines when updating.

### Changed functionality

Wallarm node 3.x is **totally incompatible with Wallarm node of version 2.18 and lower**. Before updating the modules up to 3.x, please carefully review the list of [Wallarm node changes](what-is-new.md) and consider a possible configuration change.

??? note "Set of changes in Wallarm node updated from version 2.18 or lower to version 3.2"
    **Changes in supported installation platforms**

    * Dropped support for the operating system Ubuntu 16.04 LTS (xenial)

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)

    **Changes in supported filtering node configuration parameters**

    * Dropped support for all `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP address blacklist. Manual configuration of IP blacklisting is no longer required.

        [Details on migrating blacklist configuration →](migrate-ip-lists-to-node-3.md)

    * Added new NGINX directive and Envoy parameter `disable_acl`. This parameter allows to disable request origin analysis.

        [Details on the `disable_acl` NGINX directive →](../admin-en/configure-parameters-en.md#disable_acl)

        [Details on the `disable_acl` Envoy parameter →](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    **Changes in system requirements for the filtering node installation**

    Starting with version 3.0, the filtering node supports IP addresses [whitelists, blacklists, and greylists](../user-guides/ip-lists/overview.md). The Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

    The Wallarm node downloads an actual list of IP addresses registered in whitelisted, blacklisted, or greylisted countries or data centers from GCP storage. By default, access to this storage can be restricted in your system. Allowing access to GCP storage is a new requirement for the virtual machine on which the filtering node is installed.

    [Range of GCP IP addresses that should be allowed →](https://www.gstatic.com/ipranges/goog.json)

    **Changes in filtration mode logic**

    Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

    * Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [blacklisted](../user-guides/ip-lists/blacklist.md) IP, it does not block this request.

    [More details on Wallarm node 3.2 modes →](../admin-en/configure-wallarm-mode.md)

    **New features**

    * Support for new [filtration mode](../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP address greylist](../user-guides/ip-lists/greylist.md).

        The Wallarm node operating in `safe_blocking` mode blocks only those malicious requests originated from greylisted IP addresses that allow a significant reduction of [false positives](../about-wallarm-waf/protecting-against-attacks.md#false-positives) numbers.
    
    * New reaction of triggers **Add to greyist** allowing to automatically greylist IP addresses originated a specific number of malicious requests.

        [Example of the trigger that greylists IP addresses →](../user-guides/triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour)
    
    * Management of [IP address whitelist](../user-guides/ip-lists/whitelist.md) via the Wallarm Console.
    * Automated whitelisting of [Wallarm Vulnerability Scanner](../about-wallarm-waf/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual whitelisting of Scanner IP addresses is no longer required.
    * Ability to whitelist, blacklist, or greylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country or data center.

        [Details on adding IPs to the whitelist, blacklist, and greylist →](../user-guides/ip-lists/overview.md)
    
    * Ability to whitelist, blacklist, or greylist request sources for specific applications.

        [Details on adding IPs to the whitelist, blacklist, and greylist →](../user-guides/ip-lists/overview.md)
    
    * New parameters of the file `node.yaml` for configuring the synchronization of the Wallarm Cloud and filtering nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface through which requests to Wallarm API are sent.

        [See the full list of `node.yaml` parameters for Wallarm Cloud and filtering node synchronization setup →](../admin-en/configure-cloud-node-synchronization-en.md#credentials-to-access-the-wallarm-cloud)
    
    * New module **API Discovery** that automatically identifies the application API structure.

        [Details on the API Discovery module →](../about-wallarm-waf/api-discovery.md)
    
    * The number of requests originated from blacklisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.

        [Details on the statistic service →](../admin-en/configure-statistics-service.md)
    
    * The **libdetection** library is now supported in the Envoy-based Wallarm node. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. Using this library allows reducing the number of false positives among the SQL Injection attacks.

        By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

        [Details on the **libdetection** library →](../about-wallarm-waf/protecting-against-attacks.md#library-libdetection)

??? note "Set of changes in Wallarm node updated from version 3.0 to version 3.2"
    **Breaking change**

    Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

    * Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [blacklisted](../user-guides/ip-lists/blacklist.md) IP, it does not block this request.
    * If the Wallarm node operating in the `monitoring` mode detects the attack originated from the [whitelisted](../user-guides/ip-lists/whitelist.md) IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of the Wallarm Console.

    [Details on Wallarm node 3.2 modes →](../admin-en/configure-wallarm-mode.md)

    **New features**

    * Ability to whitelist, blacklist, or greylist request sources for specific applications.

        [Details on adding IPs to the whitelist, blacklist, and greylist →](../user-guides/ip-lists/overview.md)
    
    * The number of requests originated from blacklisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.

        [Details on the statistic service →](../admin-en/configure-statistics-service.md)
    
    * The **libdetection** library is now supported in the Envoy-based Wallarm node. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. Using this library allows reducing the number of false positives among the SQL Injection attacks.

        By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

        [Details on the **libdetection** library →](../about-wallarm-waf/protecting-against-attacks.md#library-libdetection)

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
