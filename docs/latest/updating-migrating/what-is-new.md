# What is New in Wallarm Node 5.x and 0.x

This document describes the changelog for the NGINX Node 5.x and Native Node 0.x major versions. If upgrading from older major node versions, you can rely on this document.

For the detailed changelog on minor versions of the Wallarm Node, refer to the [NGINX Node artifact inventory](node-artifact-versions.md) or [Native Node artifact inventory](native-node/node-artifact-versions.md).

## API Sessions

!!! tip ""
    [NGINX Node 5.1.0 and higher](node-artifact-versions.md) and [Native Node 0.8.1 and higher](native-node/node-artifact-versions.md)

We introduce a unique security feature tailored for the API economy - [API Sessions](../api-sessions/overview.md). This addition gives you visibility into attacks, anomalies, and user behavior across your APIs, providing transparency into how users interact with your APIs and applications.

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

[Read more](../api-sessions/overview.md)

## New in limiting request processing time

!!! tip ""
    [NGINX Node 5.1.0 and higher](node-artifact-versions.md) and [Native Node 0.8.1 and higher](native-node/node-artifact-versions.md)

Wallarm [limits the request processing](../user-guides/rules/configure-overlimit-res-detection.md) time to avoid running out of system memory which can lead to the node being down to leave your applications unprotected. Now the transparency of this mechanism is increased:

* All the cases of exceeding the limit are registered and immediately displayed in **Attacks** as `overlimit_res` events - you can easily locate and analyze them.
* In all the cases of exceeding the limit, the processing of requests stops.
* Configuring of system behavior is easier now - general configuration is displayed in **Settings** → **General** and can be modified there.
* The **Limit request processing time** (former **Fine-tune the overlimit_res attack detection**) rule is simplified to set different configurations for specific endpoints.

## Customizing sensitive data detection in API Discovery

!!! tip ""
    [NGINX Node 5.0.3 and higher](node-artifact-versions.md) and [Native Node 0.7.0 and higher](native-node/node-artifact-versions.md)

API Discovery detects and highlights sensitive data consumed and carried by your APIs. Now you can [fine-tune](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) the existing detection process and add your own sensitive data patterns.

Patterns are used to define which sensitive data is detected and how. To modify default patterns and add your own, in Wallarm Console go to **API Discovery** → **Configure API Discovery** → **Sensitive data**.

## Native Node for connectors and TCP traffic mirror

We are excited to introduce the Native Node, a new deployment option for the Wallarm Node that operates independently of NGINX. This solution was developed for environments where NGINX is not required or where a platform-agnostic approach is preferred. 

Currently, it is tailored for the following deployments:

* MuleSoft, Cloudflare, and CloudFront connectors with both request and response analysis
* Kong API Gateway and Istio Ingress connectors
* TCP traffic mirror analysis

[Read more](../installation/nginx-native-node-internals.md#native-node)

## NGINX Node technology stack changes

The [Wallarm NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 5.x has been re-engineered, transitioning from a **Ruby-based** implementation to one based on the **Go language**. With this release, we focus on making the solution faster, more scalable, and more resource-efficient, both now and for the future development.

### Metrics

Regarding the exact metrics, the following performance improvements have been made in the Wallarm postanalytics module:

* CPU consumption has been decreased from 0.5 CPU cores to 0.1 CPU cores.
* Memory consumption has been reduced by 400 MB at a traffic rate of 500 requests per second.

### File system changes

With the technology stack changes, the file system of the NGINX Node artifacts has changed as follows:

* Log file system: Previously, logs were recorded in multiple files, each for a dedicated script. Now, logs from almost all services are recorded into a single dedicated file, `wcli-out.log`. You can review the list of [previous log files](/4.10/admin-en/configure-logging/) and the [current one](../admin-en/configure-logging.md).
* The diagnostic script path change: The `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` file has been moved to `/opt/wallarm/collect-info.sh`.

### Further feature introduction

Starting with NGINX Node release 5.2, new features will be introduced exclusively in the node with the new Go-based implementation. These new features will not be backported to the previous version (4.10).

## Changes to versioning policy

With updates to the NGINX Node technology stack and the introduction of the Native Node, the [Wallarm Node versioning policy](versioning-policy.md) has been updated:

* Wallarm now supports the 2 most recent major versions, limited to their latest minor versions.
* Support for versions two releases behind (e.g., 6.x → 4.x) ends 3 months after a new major version is released.
* Major versions are released every 6 months or for significant new features and breaking changes.
* Minor versions are released monthly, focusing on enhancements within existing functionality (+1 increment).
* The Native Node now follows the same versioning pattern as the NGINX Node, with simultaneous releases and feature parity. However, the Native Node major version numbering starts from 0.

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm NGINX Nodes of version 4.8 and 4.10 to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support-policy).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (4.6 and lower).

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
