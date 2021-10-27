# What is new in Wallarm node 3.0

We have released Wallarm node 3.0 that is **totally incompatible with previous Wallarm node versions**. Before updating the modules up to 3.0, please carefully review the list of Wallarm node 3.0 changes listed below and [general recommendations](general-recommendations.md).

## Which Wallarm nodes are recommended to be updated?

* We do NOT recommend updating [partner node](../partner-waf-node/overview.md) up to version 3.0, since most changes will be fully supported in partner node [3.2](versioning-policy.md#version-list).
* Regular (client) Wallarm node can be updated up to version 3.0. Before updating the modules, we recommend to carefully review the list of Wallarm node 3.0 changes listed below and [other recommendations](general-recommendations.md).

## Changes in supported installation platforms

* Dropped support for the operating system Ubuntu 16.04 LTS (xenial)

[See the full list of supported platforms →](../admin-en/supported-platforms.md)

## Changes in supported filtering node configuration parameters

* Dropped support for all `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP address blacklist. Manual configuration of IP blacklisting is no longer required.

    [Details on migrating blacklist configuration →](migrate-ip-lists-to-node-3.md)

* Added new NGINX directive and Envoy parameter `disable_acl`. This parameter allows to disable request origin analysis.

    [Details on the `disable_acl` NGINX directive →](../admin-en/configure-parameters-en.md#disable_acl)

    [Details on the `disable_acl` Envoy parameter →](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

## Changes in system requirements for the filtering node installation

Starting with version 3.0, the filtering node supports IP addresses [whitelists, blacklists, and greylists](../user-guides/ip-lists/overview.md). The Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

The Wallarm node downloads an actual list of IP addresses registered in whitelisted, blacklisted, or greylisted countries or data centers from GCP storage. By default, access to this storage can be restricted in your system. Allowing access to GCP storage is a new requirement for the virtual machine on which the filtering node is installed.

[Range of GCP IP addresses that should be allowed →](https://www.gstatic.com/ipranges/goog.json)

## New features

* Support for new [filtration mode](../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP address greylist](../user-guides/ip-lists/greylist.md).

    The Wallarm node operating in `safe_blocking` mode blocks only those malicious requests originated from greylisted IP addresses that allow a significant reduction of [false positives](../about-wallarm-waf/protecting-against-attacks.md#false-positives) numbers.
* New reaction of triggers **Add to greyist** allowing to automatically greylist IP addresses originated a specific number of malicious requests.

    [Example of the trigger that greylists IP addresses →](../user-guides/triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour)
* Management of [IP address whitelist](../user-guides/ip-lists/whitelist.md) via Wallarm Console.
* Automated whitelisting of [Wallarm Vulnerability Scanner](../about-wallarm-waf/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual whitelisting of Scanner IP addresses is no longer required.
* New parameters of the file `node.yaml` for configuring the synchronization of the Wallarm Cloud and filtering nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface through which requests to Wallarm API are sent.

    [See the full list of `node.yaml` parameters for Wallarm Cloud and filtering node synchronization setup →](../admin-en/configure-cloud-node-synchronization-en.md#credentials-to-access-the-wallarm-cloud)
* Ability to whitelist, blacklist, or greylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country or data center.

    [Details on adding IPs to the whitelist, blacklist, and greylist →](../user-guides/ip-lists/overview.md)
* New module **API Discovery** that automatically identifies the application API structure.

    [Details on the API Discovery module →](../about-wallarm-waf/api-discovery.md)

## Update process

1. Review [recommendations for the modules update](general-recommendations.md).
2. Update installed modules following the instructions for your Wallarm node deployment option:

      * [General recommendations for a safe node update process](general-recommendations.md)
      * [Updating modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
      * [Updating the Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [Updating NGINX Ingress controller with integrated Wallarm API Security modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
3. [Migrate](migrate-ip-lists-to-node-3.md) whitelist and blacklist configuration from previous Wallarm node versions to 3.0

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
