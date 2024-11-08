# What Is New in NGINX Wallarm Node 5.X Series

[NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.X series introduces an efficiency-oriented change in technology stack along with the new unique features and improvements.

!!! info "Series in brief"
    * 5.0.1 - new technology stack for efficiency (Go language-based node)
    * 5.0.2 - fixes
    * 5.0.3 - customizing sensitive data detection in API Discovery
    * 5.1.0 - API Sessions and limiting request processing time

    See also: series' [artifacts](../updating-migrating/node-artifact-versions.md) by dates.

Note: besides newly introduced, nodes 5.X series support all features of 4.10 nodes.

## Technical refactoring

!!! info "Node 5.0.1 and higher"

The Wallarm node has been re-engineered, transitioning from a **Ruby-based** implementation to one based on the **Go language**. With this release, we focus on making the solution faster, more scalable, and more resource-efficient, both now and for the future development.

Regarding the exact metrics, the following performance improvements have been made in the Wallarm postanalytics module:

* CPU consumption has been decreased from 0.5 CPU cores to 0.1 CPU cores.
* Memory consumption has been reduced by 400 MB at a traffic rate of 500 requests per second.

### File system changes

The following changes have been introduced in the file system of the Wallarm deployment artifacts:

* Log file system: Previously, logs were recorded in multiple files, each for a dedicated script. Now, logs from almost all services are recorded into a single dedicated file, `wcli-out.log`. You can review the list of [previous log files](/4.10/admin-en/configure-logging/) and the [current one](../admin-en/configure-logging.md).
* The diagnostic script path change: The `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` file has been moved to `/opt/wallarm/collect-info.sh`.

### Further feature introduction

Starting with release 5.2, new features will be introduced exclusively in the node with the new Go-based implementation. Per our [versioning policy](node-artifact-versions.md), these new features will not be backported to the previous version (4.10).

### New deployment option for TCP traffic mirror analysis

With the launch of release 5.0, Wallarm introduces an artifact specifically designed for TCP traffic mirror analysis. This new deployment option, based on our advanced re-engineered node, enhances your ability to monitor and secure TCP traffic directly at the network layer.

[Deployment instructions](../installation/oob/tcp-traffic-mirror/deployment.md)

## Features

### API Sessions

!!! info "Node 5.1.0 and higher"

In this latest update, we introduce a unique security feature tailored for the API economy—[API Sessions](../api-sessions/overview.md). This addition gives you visibility into attacks, anomalies, and user behavior across your APIs, providing transparency into how users interact with your APIs and applications.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

Attackers often exploit vulnerable endpoints by blending their actions with legitimate user behavior. Without the full context of how those sessions unfold, identifying patterns or threats becomes a time-consuming process involving multiple tools and systems. Organizations  do not have an appropriate visibility at the API level. 

With API Sessions, security teams now have the ability to see all relevant activity grouped by user session, offering unparalleled visibility into attack sequences, user anomalies, and normal behaviors. Investigations that once took hours or days can now be conducted directly from the Wallarm Console in just minutes.

Key features:

* Visibility into attacks, anomalies, and user behavior: View and analyze every request made in a session to track attack vectors and suspicious patterns.
* Support for both legacy and modern sessions: Whether your applications rely on cookie-based sessions or JWT/OAuth, Wallarm API Sessions ensures full compatibility and visibility.
* Seamlessly navigate between individual attacks and their sessions.

With API Sessions, security teams can now easily:

* Investigate the full activity of threat actors to understand potential attack paths and compromised resources.
* Identify how shadow or zombie APIs are being accessed, mitigating risks from undocumented or outdated APIs.
* Share key insights with colleagues to foster collaboration during security investigations.

See [documentation](../api-sessions/overview.md) for details.

### Customizing sensitive data detection in API Discovery

!!! info "Node 5.0.3 and higher"

API Discovery detects and highlights sensitive data consumed and carried by your APIs. Starting from version 5.0.3, you can [fine-tune](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) the existing detection process and add your own sensitive data patterns.

Patterns are used to define which sensitive data is detected and how. To modify default patterns and add your own, in Wallarm Console go to **API Discovery** → **Configure API Discovery** → **Sensitive data**.

### New in limiting request processing time

!!! info "Node 5.1.0 and higher"

Wallarm [limits the request processing](../user-guides/rules/configure-overlimit-res-detection.md) time to avoid running out of system memory which can lead to the node being down to leave your applications unprotected. Now the transparency of this mechanism is increased:

* All the cases of exceeding the limit are registered and immediately displayed in **Attacks** as `overlimit_res` events - you can easily locate and analyze them.
* In all the cases of exceeding the limit, the processing of requests stops.
* Configuring of system behavior is easier now - general configuration is displayed in **Settings** → **General** and can be modified there.
* The **Limit request processing time** (former **Fine-tune the overlimit_res attack detection**) rule is simplified to set different configurations for specific endpoints.

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.8 and 4.10 to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (4.6 and lower).

    If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [DEB/RPM packages](nginx-modules.md)
      * [All-in-one installer](all-in-one.md)
      * [Docker container with the modules for NGINX](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Sidecar controller](sidecar-proxy.md)
      * [Cloud node image](cloud-image.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
