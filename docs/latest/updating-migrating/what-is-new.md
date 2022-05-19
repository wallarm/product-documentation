# What is new in Wallarm node 3.6

This page lists the changes available when upgrading the node 3.4 or 3.2 up to version 3.6. Listed changes are available for both the regular (client) and multi-tenant Wallarm nodes. Before upgrading the modules, please carefully review the list of changes and [general recommendations](general-recommendations.md).

If upgrading Wallarm node 2.18 or lower, learn available changes from the [separate list](older-versions/what-is-new.md).

## When upgrading node 3.6

There are the following changes available in Wallarm node 4.0:

* The [libdetection library](../about-wallarm-waf/protecting-against-attacks.md#library-libdetection) is upgraded. This provides the better attack detection.
* The following NGINX directives and Envoy parameters have been renamed:

    * NGINX: `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)
    * Envoy: `tsets` section → `rulesets`, and correspondingly the `tsN` entries in this section → `rsN`
    * Envoy: `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * Envoy: `ts` → [`ruleset`](../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)

    Parameters with previous names are still supported but will be deprecated in future releases. The parameter logic has not changed.
* The private key file `/etc/wallarm/license.key` has been renamed to `/etc/wallarm/private.key`. In the file system of new node versions, there is only the file with the new name. NGINX directives and Envoy parameters pointing to this file now point to the renamed file by default.

### Unified registration of nodes in the Wallarm Cloud by tokens

The release 4.0 enables you to register the Wallarm node in the Cloud by the **token** on [any supported platform](../admin-en/supported-platforms.md). Wallarm nodes of previous versions required the "email-password" user credentials on some platforms.

Unified registration of nodes by tokens makes the connection to the Wallarm Cloud more secure and faster, e.g.:

* Dedicated user accounts of the **Deploy** role allowing only to install the node are no longer required.
* Users' data remains securely stored in the Wallarm Cloud.
* Two-factor authentication enabled for the user accounts does not prevent nodes from being registered in the Wallarm Cloud.
* The initial traffic processing and request postanalytics modules deployed to separate servers can be registered in the Cloud by one node token.

Changes in node registration methods result in some updates in node types:

* The node supporting the unified registration by token has the **Wallarm node** type. The script to be run on the server to register the node is named `register-node`.

    In versions 3.6 and lower, the Wallarm node was named [**cloud node**](/3.6/user-guides/nodes/cloud-node/). It also supported registration by the token but with the different script named `addcloudnode`.

    The cloud node is not required to be migrated to the new node type.
* The [**regular node**](/3.6/user-guides/nodes/regular-node/) supporting the registration by "email-password" passed to the `addnode` script is deprecated.

    Starting from version 4.0, registration of the node deployed as the NGINX, NGINX Plus, Kong module or the Docker container looks as follows:

    1. Create the **Wallarm node** in Wallarm Console and copy the generated token.
    1. Run the `register-node` script with the node token passed or run the Docker container with the `DEPLOY_TOKEN` variable defined.

    !!! info "Regular node support"
        The regular node type is deprecated in release 4.0 and will be removed in future releases.

        It is recommended to replace the regular node with the **Wallarm node** before the regular type is removed. You will find the appropriate instructions in the node upgrade guides.

### Changes in system requirements for the filtering node installation

Starting with version 4.0, the filtering node uploads data to the Cloud using the `api.wallarm.com:443` (EU Cloud) and `us1.api.wallarm.com:443` (US Cloud) API endpoints instead of `api.wallarm.com:444` and `us1.api.wallarm.com:444`.

Your node needs to be granted access to the API endpoint with this new port. Note that the port `443` is the default one in https, so that there is no need to specify it explicitly.

If your server with the filtering node had a limited access to the external resources and the access was granted to each resource separately, then after upgrade to version 4.0 the synchronization between the filtering node and the Cloud will stop.

To restore the synchronization, in your configuration, change port `444` to `443` for API endpoint for each resource.

## When upgrading node 3.4

There are the following changes available in Wallarm node 3.6:

* Wallarm Ingress controller based on the latest version of Community Ingress NGINX Controller, 1.1.3.

    [Instructions on migrating to the Wallarm Ingress controller 3.6 →](ingress-controller.md)
* Added support for AlmaLinux, Rocky Linux and Oracle Linux 8.x instead of the [deprecated](https://www.centos.org/centos-linux-eol/) CentOS 8.x.

    Wallarm node packages for the alternative operating systems will be stored in the CentOS 8.x repository. 
* New layout and customization options of the blocking page `/usr/share/nginx/html/wallarm_blocked.html`. In the new node version, you can customize the logo and support email displayed on the page.
    
    The sample blocking page with the new layout looks as follows:

    ![!Wallarm sample blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

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

## When upgrading node 3.2

Wallarm node 3.6 provides **all changes listed above** as well as the following:

* Support for CloudLinux OS 6.x

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)
* Support for Debian 11 Bullseye

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)
* Version of Envoy used in [Wallarm Envoy-based Docker image](../admin-en/installation-guides/envoy/envoy-docker.md) has been increased to [1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4)

    [See the full list of supported platforms →](../admin-en/supported-platforms.md)
* New environment variable `WALLARM_APPLICATION` to be passed to the Wallarm NGINX‑based Docker container. This variable sets the identifier of the protected application to be used in the Wallarm Cloud.

    [Instructions on deploying the Wallarm NGINX‑based Docker container →](../admin-en/installation-docker-en.md)

## Which Wallarm nodes are recommended to be upgraded?

* Regular (client) Wallarm node of version 3.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Regular (client) and multi-tenant Wallarm nodes of the [deprecated](versioning-policy.md#version-list) versions (2.18 and lower). [Changes](older-versions/what-is-new.md) available in Wallarm node 3.x simplifies the node configuration and improves traffic filtration. Please note that some settings of node 3.x are **incompatible** with the node of older versions.

## Upgrade process

1. Review [recommendations for the modules upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Upgrading modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
      * [Upgrading the Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
