# Inventory of node artifact versions

This document lists available [patch versions](versioning-policy.md#version-format) of Wallarm node 5.0 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported any more.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 5.0.3 (2024-10-10)

* Added support for [customizing sensitive data detection](../api-discovery/setup.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../user-guides/ip-lists/overview.md) but have [known source](../user-guides/ip-lists/overview.md#select-object)

### 5.0.2 (2024-09-18)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)
* Added support for NGINX v1.26.2 stable

<!-- ## DEB/RPM packages for NGINX

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](nginx-modules.md)

### 4.8.0 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 5.0.2 (2024-09-18)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)

<!-- ## Helm chart for Kong Ingress controller

[How to upgrade](kong-ingress-controller.md)

### 4.8.0 (2023-03-28)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Helm chart for Sidecar

[How to upgrade](sidecar-proxy.md)

### 5.0.2 (2024-09-19)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)

<!-- ## Helm chart for Wallarm eBPF‑based solution

### 0.10.22 (2024-03-01)

* [Initial release](../installation/oob/ebpf/deployment.md) -->

## Wallarm node for TCP traffic mirror analysis

### 0.5.2 (2024-09-17)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export
* Fixed an issue with the C memory allocator that caused a performance slowdown

### 0.5.1 (2024-09-16)

* Added configurable access log output via [`log.access_log` parameters](../installation/oob/tcp-traffic-mirror/configuration.md#logaccess_log-version-051-and-above)

### 0.5.0 (2024-09-11)

* Minor technical improvements and optimizations

### 0.4.3 (2024-09-05)

* Fixed an issue causing ~0.1% of data source messages to be silently lost due to a typo

### 0.4.1 (2024-08-27)

* Added support for wildcard matching in the [`route_config.routes.host`](../installation/oob/tcp-traffic-mirror/configuration.md#host) configuration parameter

### 0.4.0 (2024-08-22)

* [Initial release](../installation/oob/tcp-traffic-mirror/deployment.md)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 5.0.2-1 (2024-09-18)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1-1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)
* Added support for NGINX v1.26.2 stable

<!-- ## Envoy-based Docker image

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](docker-container.md)

### 4.8.0-1 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 5.0.2-1 (2024-09-19)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1-1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)

<!-- ## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-4-10-20240126-175315 (TBD)

* Initial release 5.0, [see changelog](what-is-new.md) -->