# What is new in Wallarm node 3.4

This page lists the changes released in Wallarm node 3.4 and other minor versions of Wallarm node 3.x.

If upgrading Wallarm node 2.18 or lower, please note that version 3.x contains **breaking changes**. Before upgrading the modules up to 3.x, please carefully review the list of changes and [general recommendations](general-recommendations.md) for upgrade.

## Which Wallarm nodes are recommended to be upgraded?

* Regular (client) and multi-tenant Wallarm nodes of version 2.18 and lower. [Changes](#changes-available-when-upgrading-wallarm-node-of-version-218-and-lower) available in Wallarm node 3.x simplifies the node configuration and improves traffic filtration.
* Regular (client) Wallarm node of version 3.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).

## Changes available when upgrading Wallarm node of version 2.18 and lower
 
Listed changes are available for both the regular (client) and multi-tenant Wallarm node 3.4.

### Changes in supported installation options

* Added support for CloudLinux OS 6.x
* Added support for Debian 11 Bullseye
* Dropped support for the operating system Ubuntu 16.04 LTS (xenial)
* Version of Envoy used in [Wallarm Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

[See the full list of supported installation options →](../admin-en/supported-platforms.md)

### Changes in supported filtering node configuration parameters

* Dropped support for all `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP address denylist. Manual configuration of IP denylisting is no longer required.

    [Details on migrating denylist configuration →](migrate-ip-lists-to-node-3.md)

* Added new NGINX directive and Envoy parameter `disable_acl`. This parameter allows to disable request origin analysis.

    [Details on the `disable_acl` NGINX directive →](../admin-en/configure-parameters-en.md#disable_acl)

    [Details on the `disable_acl` Envoy parameter →](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

### Changes in system requirements for the filtering node installation

Starting with version 3.x, the filtering node supports IP addresses [allowlists, denylists, and graylists](../user-guides/ip-lists/overview.md). The Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

The Wallarm node downloads an actual list of IP addresses registered in allowlisted, denylisted, or graylisted countries, regions or data centers from GCP storage. By default, access to this storage can be restricted in your system. Allowing access to GCP storage is a new requirement for the virtual machine on which the filtering node is installed.

[Range of GCP IP addresses that should be allowed →](https://www.gstatic.com/ipranges/goog.json)

### Changes in filtration mode logic

Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

* Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
* If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [denylisted](../user-guides/ip-lists/denylist.md) IP, it does not block this request.

[More details on Wallarm node modes →](../admin-en/configure-wallarm-mode.md)

### New features

* Support for new [filtration mode](../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP address graylist](../user-guides/ip-lists/graylist.md).

    The Wallarm node operating in `safe_blocking` mode blocks only those malicious requests originated from graylisted IP addresses that allow a significant reduction of [false positives](../about-wallarm/protecting-against-attacks.md#false-positives) numbers.
* New reaction of triggers **Add to graylist** allowing to automatically graylist IP addresses originated a specific number of malicious requests.

    [Example of the trigger that graylists IP addresses →](../user-guides/triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)
* Management of [IP address allowlist](../user-guides/ip-lists/allowlist.md) via Wallarm Console.
* Automated allowlisting of [Wallarm Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual allowlisting of Scanner IP addresses is no longer required.
* Ability to allowlist, denylist, or graylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country, region or data center.

    [Details on adding IPs to the allowlist, denylist, and graylist →](../user-guides/ip-lists/overview.md)
* Ability to allowlist, denylist, or graylist request sources for specific applications.

    [Details on adding IPs to the allowlist, denylist, and graylist →](../user-guides/ip-lists/overview.md)
* New parameters of the file `node.yaml` for configuring the synchronization of the Wallarm Cloud and filtering nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface through which requests to Wallarm API are sent.

    [See the full list of `node.yaml` parameters for Wallarm Cloud and filtering node synchronization setup →](../admin-en/configure-cloud-node-synchronization-en.md#credentials-to-access-the-wallarm-cloud)
* New module **API Discovery** that automatically identifies the application API structure.

    [Details on the API Discovery module →](../about-wallarm/api-discovery.md)
* The number of requests originated from denylisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.

    [Details on the statistic service →](../admin-en/configure-statistics-service.md)
* The **libdetection** library is now supported in the Envoy-based Wallarm node. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. Using this library allows reducing the number of false positives among the SQL Injection attacks.

    By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

    [Details on the **libdetection** library →](../about-wallarm/protecting-against-attacks.md#library-libdetection)
* New environment variable `WALLARM_APPLICATION` that can be passed to the Wallarm NGINX‑based Docker container of version `3.4.1-1` or higher. This variable is used to set the identifier of the protected application to be used in the Wallarm Cloud.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

## Changes available when upgrading Wallarm node of version 3.0

### Breaking change

Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

* Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
* If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [denylisted](../user-guides/ip-lists/denylist.md) IP, it does not block this request.
* If the Wallarm node operating in the `monitoring` mode detects the attack originated from the [allowlisted](../user-guides/ip-lists/allowlist.md) IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of Wallarm Console.

[Details on Wallarm node modes →](../admin-en/configure-wallarm-mode.md)

### Changes in supported installation options

* Added support for CloudLinux OS 6.x
* Added support for Debian 11 Bullseye
* Version of Envoy used in [Wallarm Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

[See the full list of supported installation options →](../admin-en/supported-platforms.md)

### New features

* Ability to allowlist, denylist, or graylist request sources for specific applications.

    [Details on adding IPs to the allowlist, denylist, and graylist →](../user-guides/ip-lists/overview.md)
* The number of requests originated from denylisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.

    [Details on the statistic service →](../admin-en/configure-statistics-service.md)
* The **libdetection** library is now supported in the Envoy-based Wallarm node. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. Using this library allows reducing the number of false positives among the SQL Injection attacks.

    By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

    [Details on the **libdetection** library →](../about-wallarm/protecting-against-attacks.md#library-libdetection)
* New environment variable `WALLARM_APPLICATION` that can be passed to the Wallarm NGINX‑based Docker container of version `3.4.1-1` or higher. This variable is used to set the identifier of the protected application to be used in the Wallarm Cloud.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

## Changes available when upgrading Wallarm node of version 3.2

* Added support for CloudLinux OS 6.x

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)
* Added support for Debian 11 Bullseye

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)
* Version of Envoy used in [Wallarm Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)
* New environment variable `WALLARM_APPLICATION` that can be passed to the Wallarm NGINX‑based Docker container of version `3.4.1-1` or higher. This variable is used to set the identifier of the protected application to be used in the Wallarm Cloud.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

## Upgrade process

1. Review [recommendations for the modules upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [General recommendations for a safe node upgrade process](general-recommendations.md)
      * [Upgrading modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
      * [Upgrading the Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
3. If upgrading the Wallarm node 2.18 or lower to version 3.4, [migrate](migrate-ip-lists-to-node-3.md) allowlist and denylist configuration from previous Wallarm node versions to 3.4.

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
