# What is new in Wallarm node 5.0

We are excited to announce the release of Wallarm Node 5.0! This major release introduces changes to our technology stack.

## Overview

The Wallarm filtering node has been re-engineered, transitioning from a **Ruby-based** implementation to one based on the **Go language and frameworks**. With this release, we focus on making the solution faster, more scalable, and more resource-efficient, both now and for the future development.

Regarding the exact metrics, the following performance improvements have been made:

* CPU consumption by the Wallarm scripts has been decreased from 0.5 CPU to 0.1 CPU cores.
* Memory consumption has been reduced by 400MB at traffic rates of 500 requests per second.

This release focuses on technical refactoring and does not introduce any changes in Wallarm functionality. All the features supported by the previous node version 4.10 are also present in 5.0.

## File system changes

The following changes have been introduced in the file system of the Wallarm deployment artifacts:

* Log file system: Previously, logs were recorded in multiple files, each for a dedicated script. Now, logs from almost all services are recorded into a single dedicated file, `wcli-out.log`. You can review the list of [previous log files](/4.10/admin-en/configure-logging/) and the [current one](../admin-en/configure-logging.md).
* The diagnostic script path change: The `/opt/wallarm/usr/share/wallarm-common/collect-info.sh` file has been moved to `/opt/wallarm/collect-info.sh`.

## Further feature introduction

Starting with release 5.2, new features will be introduced exclusively in the node with the new Go-based implementation. Per our [versioning policy](node-artifact-versions.md), these new features will not be backported to the previous version (4.10).

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
      * [CDN node](cdn-node.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
