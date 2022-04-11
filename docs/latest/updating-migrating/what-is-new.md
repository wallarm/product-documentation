# What is new in Wallarm node 3.6

This page lists the changes available when upgrading the node 3.4 or 3.2 up to version 3.6. Listed changes are available for both the regular (client) and partner Wallarm nodes. Before upgrading the modules, please carefully review the list of changes and [general recommendations](general-recommendations.md).

If upgrading Wallarm node 2.18 or lower, learn available changes from the [separate list](older-versions/what-is-new.md).

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
* Regular (client) and partner Wallarm nodes of the [deprecated](versioning-policy.md#version-list) versions (2.18 and lower). [Changes](older-versions/what-is-new.md) available in Wallarm node 3.x simplifies the node configuration and improves traffic filtration. Please note that some settings of node 3.x are **incompatible** with the node of older versions.

## Upgrade process

1. Review [recommendations for the modules upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Upgrading modules for NGINX, NGINX Plus, Kong](nginx-modules.md)
      * [Upgrading the Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
