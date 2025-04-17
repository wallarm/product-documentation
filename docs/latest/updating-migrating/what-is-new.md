# What is New in Wallarm Node 6.x and 0.14.x

This changelog covers updates for NGINX Node 6.x and Native Node 0.14.x+. If upgrading from an older version, refer to this document.

For the detailed changelog on minor versions of the Wallarm Node, refer to the [NGINX Node artifact inventory](node-artifact-versions.md) or [Native Node artifact inventory](native-node/node-artifact-versions.md).

This release introduces key architectural improvements aimed at enhancing performance and maintainability of the Wallarm Node. These updates also lay the groundwork for upcoming features.

## Replacing Tarantool with wstore for postanalytics

Wallarm Node now uses **wstore, a Wallarm-developed service**, instead of Tarantool for local postanalytics processing.

As a result, the following changes have been introduced to NGINX Node:

* [All-in-one installer](../installation/nginx/all-in-one.md), [AWS](../installation/cloud-platforms/aws/ami.md)/[GCP](../installation/cloud-platforms/gcp/machine-image.md) images:

    * The NGINX directive `wallarm_tarantool_upstream`, which defines the postanalytics module server address when deployed separately from other NGINX services, has been renamed to [`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream).

        Backward compatibility preserved with a deprecation warning:

        ```
        2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
        ```
    
    * [Log file](../admin-en/configure-logging.md) renamed: `/opt/wallarm/var/log/wallarm/tarantool-out.log` → `/opt/wallarm/var/log/wallarm/wstore-out.log`.
    * The new wstore configuration file `/opt/wallarm/wstore/wstore.yaml` replaces obsolete Tarantool configuration files such as `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool`.
    * The `tarantool` section in `/opt/wallarm/etc/wallarm/node.yaml` is now `wstore`. Backward compatibility preserved with a deprecation warning.
* [Docker image](../admin-en/installation-docker-en.md):

    * All the above changes are applied within the container.
    * Previously, memory for Tarantool was allocated via the `TARANTOOL_MEMORY_GB` environment variable. Now, memory allocation follows the same principle but uses a new variable: `TARANTOOL_MEMORY_GB` → `SLAB_ALLOC_ARENA`.
* [Kubernetes Ingress Controller](../admin-en/installation-kubernetes-en.md):
    
    * Tarantool is no longer a separate pod, wstore runs within the main `<CHART_NAME>-wallarm-ingress-controller-xxx` pod.
    * Helm values renamed: `controller.wallarm.tarantool` → `controller.wallarm.postanalytics`.
* [Kubernetes Sidecar Controller](../installation/kubernetes/sidecar-proxy/deployment.md):

    * Helm values renamed: `postanalytics.tarantool.*` → [`postanalytics.wstore.*`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625).
    * The following Docker images have been removed from the Helm chart for Sidecar deployment:

        * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
        * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
        * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
        * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
        
        These images have been replaced by the [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers) image, which now runs the relevant services.

The described changes are incorporated into the Node upgrade instructions provided below.

## Removal of collectd

The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins. Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.

Use the [`/wallarm-status` endpoint](../admin-en/configure-statistics-service.md), which replaces collectd by providing the same metrics in Prometheus and JSON formats.

As a result of this change, also the following changed in the configuration rules:

* The `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` collectd configuration file is no longer used.
* If you previously used collectd to forward metrics via a network plugin, such as:

    ```
    LoadPlugin network

    <Plugin "network">
        Server "<Server IPv4/v6 address or FQDN>" "<Server port>"
    </Plugin>
    ```

    you should now switch to scraping `/wallarm-status` via Prometheus.

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm NGINX Nodes of version 4.10 and 5.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support-policy).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (4.8 and lower).

    If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

    * NGINX Node:
        * [DEB/RPM packages](nginx-modules.md)
        * [All-in-one installer](all-in-one.md)
        * [Docker container with the modules for NGINX](docker-container.md)
        * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
        * [Sidecar controller](sidecar-proxy.md)
        * [Cloud node image](cloud-image.md)
        * [Multi-tenant node](multi-tenant.md)
    
    * Native Node:
        * [All-in-one installer](native-node/all-in-one.md)
        * [Helm chart](native-node/helm-chart.md)
        * [Docker image](native-node/docker-image.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
