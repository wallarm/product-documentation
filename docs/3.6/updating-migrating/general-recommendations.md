# Recommendations for a safe node upgrade process

This document describes recommendations and associated risks for a safe update of Wallarm filtering node up to 3.6.

--8<-- "../include/waf/upgrade/warning-node-types-upgrade-to-3.6.md"

## Common recommendations

* Carefully plan and monitor the filtering node update process. Estimated release dates for new versions of Wallarm nodes are published in the [Wallarm node versioning policy](versioning-policy.md).
* If your infrastructure has multiple Wallarm nodes installed, update them gradually. After updating the first node, monitor the node modules operation within a day and gradually update other Wallarm nodes if the first node operates correctly.
* For the model with separated development and production environments, update the filtering node gradually. First, apply and test new version in non-production environments, then in production environments. Detailed recommendations are described in the [instructions for configuring Wallarm nodes for separated environments](../admin-en/configuration-guides/wallarm-in-separated-environments/configure-wallarm-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes).
* Before upgrading the filtering node, disable traffic routing through the node using any method available to you (e.g. by setting [traffic filtration mode](../admin-en/configure-wallarm-mode.md) to `off`).
* Once filtering node module is upgraded, set the node filtration mode to `monitoring`. If all modules work correctly and there is no abnormal number of new false positives in the `monitoring` mode for a day, then put the filtering node in the `block` mode.
* Update NGINX to the latest version available before applying Wallarm node updates. If your infrastructure needs to use a specific version of NGINX, please contact the [Wallarm technical support](mailto:support@wallarm.com) to build the Wallarm module for a custom version of NGINX.

## Possible risks

Below are the risks that may occur when updating the filtering node. To reduce the impact of the risks, please follow the appropriate guidelines when updating.

### Changed functionality

Wallarm node 3.x is **totally incompatible with Wallarm node of version 2.18 and lower**. If upgrading the node 2.x, please consider possible configuration changes.

??? note "Set of changes in Wallarm node upgraded from version 3.4 or 3.2 to version 3.6"

    [Open the list on a separate page](what-is-new.md)

    **When upgrading node 3.4**

    There are the following changes available in Wallarm node 3.6:

    * Wallarm Ingress controller based on the latest version of Community Ingress NGINX Controller, 1.1.3.

        [Instructions on migrating to the Wallarm Ingress controller 3.6 →](ingress-controller.md)

    * Added support for AlmaLinux, Rocky Linux and Oracle Linux 8.x instead of the [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x.

        Wallarm node packages for the alternative operating systems will be stored in the CentOS 8.x repository. 

    * New layout and customization options of the sample blocking page `/usr/share/nginx/html/wallarm_blocked.html`. In the new node version, you can customize the logo and support email displayed on the page.
        
        [More details on the blocking page setup →](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

    * The following NGINX directives and Envoy parameters have been renamed:

        * NGINX: `wallarm_instance` → [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application)

        * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)

        * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../admin-en/configure-parameters-en.md#wallarm_protondb_path)

        * Envoy: `lom` → [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

        * Envoy: `instance` → [`application`](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

        Parameters with previous names are still supported but will be deprecated in future releases. The parameter logic has not changed.

    * The Ingress [annotation](../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` has been renamed to `nginx.ingress.kubernetes.io/wallarm-application`.

        The annotation with the previous name is still supported but will be deprecated in future releases. The annotation logic has not changed.

    * The file with the custom ruleset build `/etc/wallarm/lom` has been renamed to `/etc/wallarm/custom_ruleset`. In the file system of new node versions, there is only the file with the new name.

        Default values of the NGINX directive [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) and Envoy parameter [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) have been changed appropriately. New default value is `/etc/wallarm/custom_ruleset`.

    * The following node statistics parameters have been renamed:

        * `lom_apply_time` → `custom_ruleset_apply_time`

        * `lom_id` → `custom_ruleset_id`

        In new node versions, the `http://127.0.0.8/wallarm-status` endpoint temporarily returns both the deprecated and new parameters. The deprecated parameters will be removed from the service output in future releases.

        [More details on the statistics service →](../admin-en/configure-statistics-service.md)

    * The collectd metric `gauge-lom_id` has been renamed to `gauge-custom_ruleset_id`.

        In new node versions, the collectd service collects both the deprecated and new metrics. The deprecated metric collection will be stopped in future releases.

        [All collectd metrics →](../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)

    * New environment variable `NGINX_PORT` to be passed to the Wallarm NGINX‑based Docker container.

        This variable sets a port that NGINX will use inside the Docker container. This allows avoiding port collision when using this Docker container as a [sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md) within a pod of Kubernetes cluster.

        [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

    **When upgrading node 3.2**

    Wallarm node 3.6 provides **all changes listed above** as well as the following:

    * Support for CloudLinux OS 6.x

        [See the full list of supported platforms →](../installation/supported-deployment-options.md)

    * Support for Debian 11 Bullseye

        [See the full list of supported platforms →](../installation/supported-deployment-options.md)
    
    * Version of Envoy used in [Wallarm Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

        [See the full list of supported platforms →](../installation/supported-deployment-options.md)
    
    * New environment variable `WALLARM_APPLICATION` to be passed to the Wallarm NGINX‑based Docker container. This variable sets the identifier of the protected application to be used in the Wallarm Cloud.

        [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

??? note "Set of changes in Wallarm node upgraded from version 2.18 or lower to version 3.6"

    [Open the list on a separate page](older-versions/what-is-new.md)

    **Supported installation options**

    * Wallarm Ingress controller based on the latest version of Community Ingress NGINX Controller, 1.1.3.

        [Instructions on migrating to the Wallarm Ingress controller 3.6 →](older-versions/ingress-controller.md)

    * Added support for AlmaLinux, Rocky Linux and Oracle Linux 8.x instead of the [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x.

        Wallarm node packages for the alternative operating systems will be stored in the CentOS 8.x repository. 

    * Added support for CloudLinux OS 6.x
    * Added support for Debian 11 Bullseye
    * Dropped support for the operating system Ubuntu 16.04 LTS (xenial)
    * Version of Envoy used in [Wallarm Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

    [See the full list of supported installation options →](../installation/supported-deployment-options.md)

    **System requirements for the filtering node installation**

    Starting with version 3.x, the filtering node supports IP address [allowlisting, denylisting, and graylisting](../user-guides/ip-lists/overview.md). Wallarm Console allows adding both single IPs and **countries** or **data centers** to any IP list type.

    The Wallarm node requires access to specific IP addresses to download actual lists of IPs for allowlisted, denylisted, or graylisted countries, regions, or data centers. If your system typically restricts external access, you will need to allow connectivity to these IPs to successfully install the filtering node:

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```

    **Filtration modes**

    * New **safe blocking** filtration mode.

        This mode enables a significant reduction of [false positive](../about-wallarm/protecting-against-attacks.md#false-positives) number by blocking only malicious requests originating from [graylisted IP addresses](../user-guides/ip-lists/graylist.md).
    
    * Analysis of request sources is now performed only in the `safe_blocking` and `block` modes.
        
        * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originating from the [denylisted](../user-guides/ip-lists/denylist.md) IP, it does not block this request.
        
        * Wallarm node operating in the `monitoring` mode uploads all the attacks originating from the [allowlisted IP addresses](../user-guides/ip-lists/allowlist.md) to the Wallarm Cloud.

    [More details on Wallarm node modes →](../admin-en/configure-wallarm-mode.md)

    **Request source control**

    The following parameters for request source control have been deprecated:

    * All `acl` NGINX directives, Envoy parameters, and environment variables used to configure IP address denylist. Manual configuration of IP denylisting is no longer required.

        [Details on migrating denylist configuration →](migrate-ip-lists-to-node-3.md)

    There are the following new features for request source control:

    * Wallarm Console section for full IP address allowlist, denylist and graylist control.
    
    * Support for new [filtration mode](../admin-en/configure-wallarm-mode.md) `safe_blocking` and [IP address graylists](../user-guides/ip-lists/graylist.md).

        The **safe blocking** mode enables a significant reduction of [false positive](../about-wallarm/protecting-against-attacks.md#false-positives) number by blocking only malicious requests originating from graylisted IP addresses.

        For automatic IP address graylisting there is a new [trigger **Add to graylist**](../user-guides/triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) released.
    
    * Automated allowlisting of [Wallarm Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vunerability-scanner) IP addresses. Manual allowlisting of Scanner IP addresses is no longer required.
    
    * Ability to allowlist, denylist, or graylist a subnet, Tor network IPs, VPN IPs, a group of IP addresses registered in a specific country, region or data center.
    
    * Ability to allowlist, denylist, or graylist request sources for specific applications.
    
    * New NGINX directive and Envoy parameter `disable_acl` to disable request origin analysis.

        [Details on the `disable_acl` NGINX directive →](../admin-en/configure-parameters-en.md#disable_acl)

        [Details on the `disable_acl` Envoy parameter →](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

    [Details on adding IPs to the allowlist, denylist, and graylist →](../user-guides/ip-lists/overview.md)

    **New module for API inventory discovery**

    New Wallarm nodes are distributed with the module **API Discovery** automatically identifying the application API. The module is disabled by default.

    [Details on the API Discovery module →](../about-wallarm/api-discovery.md)

    **Support of the libdetection library in the Envoy-based nodes**

    The **libdetection** library is now supported in the Envoy-based Wallarm nodes. This library additionally validates the SQL Injection attacks to confirm detected malicious payloads. If the payload is not confirmed by the **libdetection** library, the request is considered to be legitimate. This library reduces the number of false positives among the SQL Injection attacks.

    By default, the library **libdetection** is disabled. To improve the attack detection, we recommend enabling it.

    [Details on the **libdetection** library →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

    **New blocking page**

    The sample blocking page `/usr/share/nginx/html/wallarm_blocked.html` has been updated. In the new node version, it has new layout and supports the logo and support email customization.
        
    [More details on the blocking page setup →](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

    **New parameters for basic node setup**

    * New environment variables to be passed to the Wallarm NGINX‑based Docker container:

        * `WALLARM_APPLICATION` to set the identifier of the protected application to be used in the Wallarm Cloud.

        * `NGINX_PORT` to set a port that NGINX will use inside the Docker container. This allows avoiding port collision when using this Docker container as a [sidecar container](../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md) within a pod of Kubernetes cluster.

        [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

    * New parameters of the file `node.yaml` to configure the synchronization of the Wallarm Cloud and filtering nodes: `api.local_host` and `api.local_port`. New parameters allow specifying a local IP address and port of the network interface to send requests to Wallarm API through.

        [See the full list of `node.yaml` parameters for Wallarm Cloud and filtering node synchronization setup →](../admin-en/configure-cloud-node-synchronization-en.md#access-parameters)
    
    **Renamed parameters, files and metrics**

    * The following NGINX directives and Envoy parameters have been renamed:

        * NGINX: `wallarm_instance` → [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application)
        
        * NGINX: `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
        
        * NGINX: `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../admin-en/configure-parameters-en.md#wallarm_protondb_path)
        
        * Envoy: `lom` → [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
        
        * Envoy: `instance` → [`application`](../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)

        Parameters with previous names are still supported but will be deprecated in future releases. The parameter logic has not changed.
    
    * The Ingress [annotation](../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-instance` has been renamed to `nginx.ingress.kubernetes.io/wallarm-application`.

        The annotation with the previous name is still supported but will be deprecated in future releases. The annotation logic has not changed.

    * The file with the custom ruleset build `/etc/wallarm/lom` has been renamed to `/etc/wallarm/custom_ruleset`. In the file system of new node versions, there is only the file with the new name.

        Default values of the NGINX directive [`wallarm_custom_ruleset_path`](../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path) and Envoy parameter [`custom_ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) have been changed appropriately. New default value is `/etc/wallarm/custom_ruleset`.
    
    * The collectd metric `gauge-lom_id` has been renamed to `gauge-custom_ruleset_id`.

        In new node versions, the collectd service collects both the deprecated and new metrics. The deprecated metric collection will be stopped in future releases.

        [All collectd metrics →](../admin-en/monitoring/available-metrics.md#nginx-metrics-and-nginx-wallarm-module-metrics)

    ## Parameters of the statistics service

    * The number of requests originating from denylisted IPs is now displayed in the statistic service output, in the new parameter `blocked_by_acl` and in the existing parameters `requests`, `blocked`.
    * The following node statistics parameters have been renamed:

        * `lom_apply_time` → `custom_ruleset_apply_time`
        
        * `lom_id` → `custom_ruleset_id`

        In new node versions, the `http://127.0.0.8/wallarm-status` endpoint temporarily returns both the deprecated and new parameters. The deprecated parameters will be removed from the service output in future releases.

    [Details on the statistics service →](../admin-en/configure-statistics-service.md)

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
* [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
* [Cloud node image](cloud-image.md)
* [Migrating allowlists and denylists from Wallarm node 2.18 and lower to 3.x](migrate-ip-lists-to-node-3.md)
