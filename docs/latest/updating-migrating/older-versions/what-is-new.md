# What is new in Wallarm node (if upgrading node 2.18 or lower)

This page lists the changes available when upgrading the node 2.18 up to version 4.0. Listed changes are available for both the regular (client) and multi-tenant Wallarm nodes. 

!!! warning "Wallarm nodes 2.18 and lower are deprecated"
    Wallarm nodes 2.18 and lower are recommended to be upgraded since they are [deprecated](../versioning-policy.md#version-list).

    Node configuration and traffic filtration have been significantly simplified in the Wallarm node of version 4.0. Some settings of node 4.0 are **incompatible** with the nodes of older versions. Before upgrading the modules, please carefully review the list of changes and [general recommendations](../general-recommendations.md).

## Supported installation options

* Wallarm Ingress controller based on the latest version of Community Ingress NGINX Controller, 1.1.3.

    [Instructions on migrating to the Wallarm Ingress controller →](ingress-controller.md)
* Added support for AlmaLinux, Rocky Linux and Oracle Linux 8.x instead of the [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x.

    Wallarm node packages for the alternative operating systems will be stored in the CentOS 8.x repository. 
* Added support for CloudLinux OS 6.x
* Added support for Debian 11 Bullseye
* Dropped support for the operating system Ubuntu 16.04 LTS (xenial)
* Version of Envoy used in [Wallarm Envoy-based Docker image](../../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

[See the full list of supported installation options →](../../admin-en/supported-platforms.md)

## System requirements for the filtering node installation

* The filtering node now supports IP address [whitelisting, blacklisting, and greylisting](../../user-guides/ip-lists/overview.md). Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

    The Wallarm node downloads an actual list of IP addresses registered in whitelisted, blacklisted, or greylisted countries or data centers from GCP storage. By default, access to this storage can be restricted in your system. Allowing access to GCP storage is a new requirement for the virtual machine to install the filtering node.

    [Range of GCP IP addresses that should be allowed →](https://www.gstatic.com/ipranges/goog.json)
* The filtering node now uploads data to the Cloud using `api.wallarm.com:443` (EU Cloud) and `us1.api.wallarm.com:443` (US Cloud) instead of `api.wallarm.com:444` and `us1.api.wallarm.com:444`.

    If your server with the deployed node has a limited access to the external resources and the access is granted to each resource separately, after upgrade to version 4.0 the synchronization between the filtering node and the Cloud will stop. The upgraded node needs to be granted access to the API endpoint with the new port.

## Unified registration of nodes in the Wallarm Cloud by tokens

The release 4.0 enables you to register the Wallarm node in the Cloud by the **token** on [any supported platform](../../admin-en/supported-platforms.md). Wallarm nodes of previous versions required the "email-password" user credentials on some platforms.

Unified registration of nodes by tokens makes the connection to the Wallarm Cloud more secure and faster, e.g.:

* Dedicated user accounts of the **Deploy** role allowing only to install the node are no longer required.
* Users' data remains securely stored in the Wallarm Cloud.
* Two-factor authentication enabled for the user accounts does not prevent nodes from being registered in the Wallarm Cloud.
* The initial traffic processing and request postanalytics modules deployed to separate servers can be registered in the Cloud by one node token.

Changes in node registration methods result in some updates in node types:

* The node supporting the unified registration by token has the **Wallarm node** type. The script to be run on the server to register the node is named `register-node`.

    Previously, the Wallarm node was named [**cloud node**](/2.18/user-guides/nodes/cloud-node/). It also supported registration by the token but with the different script named `addcloudnode`.

    The cloud node is not required to be migrated to the new node type.
* The [**regular node**](/2.18/user-guides/nodes/regular-node/) supporting the registration by "email-password" passed to the `addnode` script is deprecated.

    Starting from version 4.0, registration of the node deployed as the NGINX, NGINX Plus, Kong module or the Docker container looks as follows:

    1. Create the **Wallarm node** in Wallarm Console and copy the generated token.
    1. Run the `register-node` script with the node token passed or run the Docker container with the `DEPLOY_TOKEN` variable defined.

    !!! info "Regular node support"
        The regular node type is deprecated in release 4.0 and will be removed in future releases.

        It is recommended to replace the regular node with the **Wallarm node** before the regular type is removed. You will find the appropriate instructions in the node upgrade guides.

## Simplified multi-tenant node configuration

For the [multi-tenant nodes](../../waf-installation/multi-tenant/overview.md), tenants and applications are now defined each with its own directive:

* The [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) NGINX directive and [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param) Envoy parameter have been added to configure the unique identifier of a tenant.
* The [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) NGINX directive and [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#application_param) Envoy parameter behavior has been changed. Now it is **only** used to configure an application ID.

[Instructions on the multi-tenant node upgrade](../multi-tenant.md)

## Filtration modes

* New **safe blocking** filtration mode.

    This mode enables a significant reduction of [false positive](../../about-wallarm-waf/protecting-against-attacks.md#false-positives) number by blocking only malicious requests originating from [greylisted IP addresses](../../user-guides/ip-lists/greylist.md).
* Analysis of request sources is now performed only in the `safe_blocking` and `block` modes.
    
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originating from the [blacklisted](../../user-guides/ip-lists/blacklist.md) IP, it does not block this request.
    * Wallarm node operating in the `monitoring` mode uploads all the attacks originating from the [whitelisted IP addresses](../../user-guides/ip-lists/whitelist.md) to the Wallarm Cloud.

[More details on Wallarm node modes →](../../admin-en/configure-wallarm-mode.md)

## Request source control

The following parameters for request source control have been deprecated:

* All `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP address blacklist. Manual configuration of IP blacklisting is no longer required.

    [Details on migrating blacklist configuration →](../migrate-ip-lists-to-node-3.md)

There are the following new features for request source control:

* Wallarm Console section for full IP address whitelist, blacklist and greylist control.
* Support for new [filtration mode](../../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP address greylists](../../user-guides/ip-lists/greylist.md).

    The **safe blocking** mode enables a significant reduction of [false positive](../../about-wallarm-waf/protecting-against-attacks.md#false-positives) number by blocking only malicious requests originating from greylisted IP addresses.

    For automatic IP address greylisting there is a new [trigger **Add to greyist**](../../user-guides/triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour) released.
* Automated whitelisting of [Wallarm Vulnerability Scanner](../../about-wallarm-waf/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual whitelisting of Scanner IP addresses is no longer required.
* Ability to whitelist, blacklist, or greylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country or data center.
* Ability to whitelist, blacklist, or greylist request sources for specific applications.
* New NGINX directive and Envoy parameter `disable_acl` to disable request origin analysis.

    [Details on the `disable_acl` NGINX directive →](../../admin-en/configure-parameters-en.md#disable_acl)

    [Details on the `disable_acl` Envoy parameter →](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

[Details on adding IPs to the whitelist, blacklist, and greylist →](../../user-guides/ip-lists/overview.md)

## New module for API structure discovery

New Wallarm nodes are distributed with the module **API Discovery** automatically identifiyng the application API structure. The module is disabled by default.

[Details on the API Discovery module →](../../about-wallarm-waf/api-discovery.md)

## Support of the libdetection library in the Envoy-based nodes

The **libdetection** library is now supported in the Envoy-based Wallarm nodes. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. This library reduces the number of false positives among the SQL Injection attacks.

By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

[Details on the **libdetection** library →](../../about-wallarm-waf/protecting-against-attacks.md#library-libdetection)

## New blocking page

The sample blocking page `/usr/share/nginx/html/wallarm_blocked.html` has been updated. In the new node version, it has new layout and supports the logo and support email customization.
    
New blocking page with the new layout looks as follows by default:

![!Wallarm blocking page](../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[More details on the blocking page setup →](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## New parameters for basic node setup

* New environment variables to be passed to the Wallarm NGINX‑based Docker container:

    * `WALLARM_APPLICATION` to set the identifier of the protected application to be used in the Wallarm Cloud.
    * `NGINX_PORT` to set a port that NGINX will use inside the Docker container. This allows avoiding port collision when using this Docker container as a [sidecar container](../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md) within a pod of Kubernetes cluster.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../../admin-en/installation-docker-en.md)
* New parameters of the file `node.yaml` to configure the synchronization of the Wallarm Cloud and filtering nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface to send requests to Wallarm API through.

    [See the full list of `node.yaml` parameters for Wallarm Cloud and filtering node synchronization setup →](../../admin-en/configure-cloud-node-synchronization-en.md#credentials-to-access-the-wallarm-cloud)

## Renamed parameters, files and metrics

* The following NGINX directives and Envoy parameters have been renamed:

    * NGINX: `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * Envoy: `tsets` section → `rulesets`, and correspondingly the `tsN` entries in this section → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    Parameters with previous names are still supported but will be deprecated in future releases. The parameter logic has not changed.
* The Ingress [annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` has been renamed to `nginx.ingress.kubernetes.io/wallarm-application`.

    The annotation with the previous name is still supported but will be deprecated in future releases. The annotation logic has not changed.
* The file with the custom ruleset build `/etc/wallarm/lom` has been renamed to `/etc/wallarm/custom_ruleset`. In the file system of new node versions, there is only the file with the new name.

    Default values of the NGINX directive [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) and Envoy parameter [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) have been changed appropriately. New default value is `/etc/wallarm/custom_ruleset`.
* The private key file `/etc/wallarm/license.key` has been renamed to `/etc/wallarm/private.key`. In the file system of new node versions, there is only the file with the new name. NGINX directives and Envoy parameters pointing to this file now point to the renamed file by default.
* The collectd metric `gauge-lom_id` has been renamed to `gauge-custom_ruleset_id`.

    In new node versions, the collectd service collects both the deprecated and new metrics. The deprecated metric collection will be stopped in future releases.

    [All collectd metrics →](../../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)

## Parameters of the statistics service

* The number of requests originating from blacklisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.
* The following node statistics parameters have been renamed:

    * `lom_apply_time` → `custom_ruleset_apply_time`
    * `lom_id` → `custom_ruleset_id`

    In new node versions, the `http://127.0.0.8/wallarm-status` endpoint temporarily returns both the deprecated and new parameters. The deprecated parameters will be removed from the service output in future releases.

[Details on the statistics service →](../../admin-en/configure-statistics-service.md)

## Improved attack detection

The [libdetection library](../../about-wallarm-waf/protecting-against-attacks.md#library-libdetection) is upgraded. This provides the better attack detection.

## Upgrade process

1. Review [recommendations for the modules upgrade](../general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Upgrading modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
      * [Upgrading the Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
3. [Migrate](../migrate-ip-lists-to-node-3.md) whitelist and blacklist configuration from previous Wallarm node versions to 4.0.

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
