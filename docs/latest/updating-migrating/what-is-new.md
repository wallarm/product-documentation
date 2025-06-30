# What is New in Wallarm Node 6.x and 0.14.x

This changelog covers updates for NGINX Node 6.x and Native Node 0.14.x+. If upgrading from an older version, refer to [this](../updating-migrating/older-versions/what-is-new.md) document.

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
    * Adjusted the container's directory structure to align with Alpine Linux conventions. Specifically:

        * Content from `/etc/nginx/modules-available` and `/etc/nginx/modules-enabled` has been moved to `/etc/nginx/modules`.
        * Content from `/etc/nginx/sites-available` and `/etc/nginx/sites-enabled` has been moved to `/etc/nginx/http.d`.
    
    * The default `allow` value, specifying permitted IP addresses for the `/wallarm-status` service, is now 127.0.0.0/8 instead of 127.0.0.8/8.
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

## Mitigation Controls

We introduce a unified management center for all Wallarm attack mitigation settings - [**Mitigation Controls**](../about-wallarm/mitigation-controls-overview.md). With mitigation controls you can:

* View and manage all Wallarm mitigation settings in one place.
* Manage all in a unified way (all controls have similar configuration UI and options).
* Easily overview the current mode of each control: is it active? is it just monitoring or also blocking?
* Get quick overview of attacks caught by each control.

![Mitigation Controls page in UI](../images/user-guides/mitigation-controls/mc-main-page.png)

### Enumeration attack protection

!!! tip ""
    [NGINX Node 6.1.0 and higher](node-artifact-versions.md) and [Native Node 0.14.1 and higher](native-node/node-artifact-versions.md)

New level of protection from [enumeration attacks](../attacks-vulns-list.md#enumeration-attacks) comes with enumeration mitigation controls:

* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../api-protection/enumeration-attack-protection.md)

Comparing to triggers that were used for this protection before, mitigation controls:

* Allow selecting which parameters will be monitored for enumeration attempts.
* Allow advanced sophisticated filtering of which exact requests will be counted.
* Provide deep integration with [API Sessions](../api-sessions/overview.md): the detected attacks are displayed within a corresponding session, providing you with full context of what was happening and why the session activities were marked as attack and blocked.

![BOLA protection mitigation control - example](../images/user-guides/mitigation-controls/mc-bola-example-01.png)

### DoS protection

!!! tip ""
    [NGINX Node 6.1.0 and higher](node-artifact-versions.md) and [Native Node 0.14.1 and higher](native-node/node-artifact-versions.md)

The [unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) is included in the [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) list of most serious API security risks. Being a threat by itself (service slow-down or complete down by overload), this also serves as foundation to different attack types, for example, enumeration attacks. Allowing too many requests per time is one of the main causes of these risks.

Wallarm provides the new [**DoS protection**](../api-protection/dos-protection.md) mitigation control to help prevent excessive traffic to your API.

![DoS protection - JWT example](../images/api-protection/mitigation-controls-dos-protection-jwt.png)

### Default controls

Wallarm provides a set of [default mitigation controls](../about-wallarm/mitigation-controls-overview.md#default-controls) that, when enabled, significantly enhance the detection capabilities of the Wallarm platform. These controls are pre-configured to offer robust protection against a variety of common attack patterns. The current default mitigation controls include:

* [GraphQL protection](../api-protection/graphql-rule.md)
* [BOLA (Broken Object Level Authorization) enumeration protection](../api-protection/enumeration-attack-protection.md#bola) for user IDs, object IDs, and filenames
* [Brute force protection](../api-protection/enumeration-attack-protection.md#brute-force) for passwords, OTPs, and authentication codes
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md#forced-browsing) (404 probing)
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md#generic-enumeration), including:
    
    * User/email enumeration
    * SSRF (Server-Side Request Forgery) enumeration
    * User-agent rotation

## File upload restriction policy

Wallarm now provides tools for direct restricting the size of uploaded files. This comes as a part of set of measures aimed to prevent the [unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) included in the [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) list of most serious API security risks.

Depending on your subscription plan, upload restrictions are applied via mitigation control or rule. You can set file size restrictions for the full request or its selected point.

![File upload restriction MC - example](../images/api-protection/mitigation-controls-file-upload-1.png)

## Protection from unrestricted resource consumption

!!! tip ""
    [NGINX Node 6.3.0 and higher](node-artifact-versions.md) and not supported by [Native Node](installation/nginx-native-node-internals.md#native-node) so far.

Wallarm's [API Abuse Prevention](../api-abuse-prevention/overview.md) introduces the possibility to prevent the [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) - abusive behavior where an automated client consumes excessive API or application resources without proper limits. This may include sending high volumes of non-malicious requests, exhausting compute, memory, or bandwidth, and causing service degradation for legitimate users.

![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

To detect this type of automated threats, API Abuse Prevention provides a set of three new [detectors](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works):

* **Response time anomaly** identifying abnormal patterns in the latency of API responses that may signal automated abuse or backend exploitation attempts.
* **Excessive request consumption** identifying clients that send abnormally large request payloads to the API, potentially indicating abuse or misuse of backend processing resources.
* **Excessive response consumption** flagging suspicious sessions based on the total volume of response data transferred over their lifetime. Unlike detectors focused on individual requests, this detector aggregates response sizes across an entire session to identify slow-drip or distributed scraping attacks.

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
