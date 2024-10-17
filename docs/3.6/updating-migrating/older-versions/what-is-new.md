# What is new in Wallarm node (if upgrading node 2.18 or lower)

This page lists the changes available when upgrading the node 2.18 up to version 3.6. Listed changes are available for both the regular (client) and multi-tenant Wallarm nodes. 

!!! warning "Wallarm nodes 2.18 and lower are deprecated"
    Wallarm nodes 2.18 and lower are recommended to be upgraded since they are [deprecated](../versioning-policy.md#version-list).

    Node configuration and traffic filtration have been significantly simplified in the Wallarm node of version 3.6. Some settings of node 3.6 are **incompatible** with the nodes of older versions. Before upgrading the modules, please carefully review the list of changes and [general recommendations](../general-recommendations.md).

## Supported installation options

* Wallarm Ingress controller based on the latest version of Community Ingress NGINX Controller, 1.1.3.

    [Instructions on migrating to the Wallarm Ingress controller 3.6 →](ingress-controller.md)
* Added support for AlmaLinux, Rocky Linux and Oracle Linux 8.x instead of the [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x.

    Wallarm node packages for the alternative operating systems will be stored in the CentOS 8.x repository. 
* Added support for CloudLinux OS 6.x
* Added support for Debian 11 Bullseye
* Dropped support for the operating system Ubuntu 16.04 LTS (xenial)
* Version of Envoy used in [Wallarm Envoy-based Docker image](../../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

[See the full list of supported installation options →](../../installation/supported-deployment-options.md)

## System requirements for the filtering node installation

Starting with version 3.x, the filtering node supports IP address [allowlisting, denylisting, and graylisting](../../user-guides/ip-lists/overview.md). Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

The Wallarm node requires access to specific IP addresses to download actual lists of IPs for allowlisted, denylisted, or graylisted countries, regions, or data centers. If your system typically restricts external access, you will need to allow connectivity to these IPs to successfully install the filtering node:

--8<-- "../include/wallarm-cloud-ips.md"

## Filtration modes

* New **safe blocking** filtration mode.

    This mode enables a significant reduction of [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) number by blocking only malicious requests originating from [graylisted IP addresses](../../user-guides/ip-lists/graylist.md).
* Analysis of request sources is now performed only in the `safe_blocking` and `block` modes.
    
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originating from the [denylisted](../../user-guides/ip-lists/denylist.md) IP, it does not block this request.
    * Wallarm node operating in the `monitoring` mode uploads all the attacks originating from the [allowlisted IP addresses](../../user-guides/ip-lists/allowlist.md) to the Wallarm Cloud.

[More details on Wallarm node modes →](../../admin-en/configure-wallarm-mode.md)

## Request source control

The following parameters for request source control have been deprecated:

* All `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP address denylist. Manual configuration of IP denylisting is no longer required.

    [Details on migrating denylist configuration →](../migrate-ip-lists-to-node-3.md)

There are the following new features for request source control:

* Wallarm Console section for full IP address allowlist, denylist and graylist control.
* Support for new [filtration mode](../../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP address graylists](../../user-guides/ip-lists/graylist.md).

    The **safe blocking** mode enables a significant reduction of [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) number by blocking only malicious requests originating from graylisted IP addresses.

    For automatic IP address graylisting there is a new [trigger **Add to graylist**](../../user-guides/triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) released.
* Automated allowlisting of [Wallarm Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual allowlisting of Scanner IP addresses is no longer required.
* Ability to allowlist, denylist, or graylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country, region or data center.
* Ability to allowlist, denylist, or graylist request sources for specific applications.
* New NGINX directive and Envoy parameter `disable_acl` to disable request origin analysis.

    [Details on the `disable_acl` NGINX directive →](../../admin-en/configure-parameters-en.md#disable_acl)

    [Details on the `disable_acl` Envoy parameter →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[Details on adding IPs to the allowlist, denylist, and graylist →](../../user-guides/ip-lists/overview.md)

## New module for API inventory discovery

New Wallarm nodes are distributed with the module **API Discovery** automatically identifying the application API. The module is disabled by default.

[Details on the API Discovery module →](../../about-wallarm/api-discovery.md)

## Support of the libdetection library in the Envoy-based nodes

The **libdetection** library is now supported in the Envoy-based Wallarm nodes. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. This library reduces the number of false positives among the SQL Injection attacks.

By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

[Details on the **libdetection** library →](../../about-wallarm/protecting-against-attacks.md#library-libdetection)

## The rule enabling the `overlimit_res` attack detection fine-tuning

We have introduced the new [rule allowing the `overlimit_res` attack detection fine-tuning](../../user-guides/rules/configure-overlimit-res-detection.md).

The `overlimit_res` attack detection fine-tuning via the NGINX and Envoy configuration files is considered to be the deprecated way:

* The rule allows setting up a single request processing time limit as the `wallarm_process_time_limit` NGINX directive and `process_time_limit` Envoy parameter did before.
* The rule allows to block or pass the `overlimit_res` attacks in accordance with the [node filtration mode](../../admin-en/configure-wallarm-mode.md) instead of the `wallarm_process_time_limit_block` NGINX directive and `process_time_limit_block` Envoy parameter configuration.

The listed directives and parameters have been deprecated and will be deleted in future releases. It is recommended to transfer the `overlimit_res` attack detection configuration from directives to the rule before. Relevant instructions are provided for each [node deployment option](../general-recommendations.md#update-process).

If the listed parameters are explicitly specified in the configuration files and the rule is not created yet, the node processes requests as set in the configuration files.

## New blocking page

The sample blocking page `/usr/share/nginx/html/wallarm_blocked.html` has been updated. In the new node version, it has new layout and supports the logo and support email customization.
    
New blocking page with the new layout looks as follows by default:

![Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[More details on the blocking page setup →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## New parameters for basic node setup

* New environment variables to be passed to the Wallarm NGINX‑based Docker container:

    * `WALLARM_APPLICATION` to set the identifier of the protected application to be used in the Wallarm Cloud.
    * `NGINX_PORT` to set a port that NGINX will use inside the Docker container. This allows avoiding port collision when using this Docker container as a [sidecar container](../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md) within a pod of Kubernetes cluster.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../../admin-en/installation-docker-en.md)
* New parameters of the file `node.yaml` to configure the synchronization of the Wallarm Cloud and filtering nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface to send requests to Wallarm API through.

    [See the full list of `node.yaml` parameters for Wallarm Cloud and filtering node synchronization setup →](../../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)

## Renamed parameters, files and metrics

* The following NGINX directives and Envoy parameters have been renamed:

    * NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    Parameters with previous names are still supported but will be deprecated in future releases. The parameter logic has not changed.
* The Ingress [annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` has been renamed to `nginx.ingress.kubernetes.io/wallarm-application`.

    The annotation with the previous name is still supported but will be deprecated in future releases. The annotation logic has not changed.
* The file with the custom ruleset build `/etc/wallarm/lom` has been renamed to `/etc/wallarm/custom_ruleset`. In the file system of new node versions, there is only the file with the new name.

    Default values of the NGINX directive [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) and Envoy parameter [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) have been changed appropriately. New default value is `/etc/wallarm/custom_ruleset`.
* The collectd metric `gauge-lom_id` has been renamed to `gauge-custom_ruleset_id`.

    In new node versions, the collectd service collects both the deprecated and new metrics. The deprecated metric collection will be stopped in future releases.

    [All collectd metrics →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)

## Parameters of the statistics service

* The number of requests originating from denylisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.
* The following node statistics parameters have been renamed:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    In new node versions, the `http://127.0.0.8/wallarm-status` endpoint temporarily returns both the deprecated and new parameters. The deprecated parameters will be removed from the service output in future releases.

[Details on the statistics service →](../../admin-en/configure-statistics-service.md)

## Increasing the performance by omitting attack search in requests from denylisted IPs

The new [`wallarm_acl_access_phase`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) directive enables you to increase the Wallarm node performance by omitting the attack search stage during the analysis of requests from [denylisted](../../user-guides/ip-lists/denylist.md) IPs. This configuration option is useful if there are many denylisted IPs (e.g. the whole countries) producing high traffic that heavily loads the working machine CPU.

## Upgrade process

1. Review [recommendations for the modules upgrade](../general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Upgrading modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
      * [Upgrading the Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
3. [Migrate](../migrate-ip-lists-to-node-3.md) allowlist and denylist configuration from previous Wallarm node versions to 3.6.

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
