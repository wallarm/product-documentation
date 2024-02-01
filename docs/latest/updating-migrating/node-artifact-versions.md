# Inventory of node artifact versions

This document lists available [patch versions](versioning-policy.md#version-format) of Wallarm node 4.8 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## All-in-one installer

History of updates simultaneously applies to the x86_64 and ARM64 (beta) versions of [all-in-one installer](../installation/nginx/all-in-one.md).

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 4.10.0 (2024-01-31)

* Initial release 4.10, [see changelog](what-is-new.md)

## DEB/RPM packages for NGINX

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](nginx-modules.md)

### 4.8.0 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md)

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 4.8.6 (2023-12-28)

* Helm chart version of the NGINX Ingress controller bumped to 4.9.0
* NGINX Ingress controller version bumped to 1.9.5
* Fixed [CVE-2023-44487](https://github.com/advisories/GHSA-qppj-fm5r-hxr3) in the controller image
* Fixed [CVE-2023-5363](https://github.com/advisories/GHSA-xw78-pcr6-wrg8) and [CVE-2023-5678](https://github.com/advisories/GHSA-2cj7-mg3x-9mhq) in the Wallarm helper image

### 4.8.5 (2023-11-24)

* Optimize Wallarm Cloud's export of brute, dirbust, and BOLA statistics to avoid delays in reaction to attacks under high request loads and numerous triggers

### 4.8.4 (2023-11-13)

* Helm chart version of the NGINX Ingress controller bumped to 4.8.3
* NGINX Ingress controller version bumped to 1.9.4
* Fixed [CVE-2022-4886](https://github.com/advisories/GHSA-gvrm-w2f9-f77q), [CVE-2023-5043](https://github.com/advisories/GHSA-5wj4-wffq-3378) and [CVE-2023-5044](https://github.com/advisories/GHSA-fp9f-44c2-cw27) in the controller image

### 4.8.3 (2023-10-30)

* This release fixes [CVE-2023-5363](https://github.com/advisories/GHSA-xw78-pcr6-wrg8) and [CVE-2023-44487](https://github.com/advisories/GHSA-qppj-fm5r-hxr3) in the controller image

### 4.8.2 (2023-10-20)

* Resolved statistics errors for denylisted requests connected with non-standard HTTP port (80) upstreams

### 4.8.1 (2023-10-19)

* Added support for ARM64 processors
* Fix the bug when Wallarm API token could not be applied by `helm upgrade`
* Fix the following CVE in golang.org/x/net: [CVE-2023-39325](https://github.com/advisories/GHSA-4374-p667-p6c8), [CVE-2023-3978](https://github.com/advisories/GHSA-2wrh-6pvc-2jm9), [CVE-2023-44487](https://github.com/advisories/GHSA-qppj-fm5r-hxr3)

### 4.8.0 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md)

<!-- ## Helm chart for Kong Ingress controller

[How to upgrade](kong-ingress-controller.md)

### 4.8.0 (2023-03-28)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Helm chart for Sidecar

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](sidecar-proxy.md)

### 4.8.1 (2023-11-15)

* Optimize Wallarm Cloud's export of brute, dirbust, and BOLA statistics to avoid delays in reaction to attacks under high request loads and numerous triggers

### 4.8.0 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md)
* Added support for [API tokens](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) to create filtering nodes and connect them to the Cloud during solution deployment. With API tokens, you can control the lifetime of your tokens and enhance node organization in the UI by setting a node group name.

    Node group names are set using the `config.wallarm.api.nodeGroup` parameter in **values.yaml**, with `defaultSidecarGroup` as the default name. Optionally, you can control the names of node groups based on the applications' pods using the `sidecar.wallarm.io/wallarm-node-group` annotation.
* Fix [CVE-2023-38039](https://github.com/advisories/GHSA-99j9-jf36-9747)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 4.10.0-1 (2024-01-31)

* Initial release 4.10, including optimizations, and security enhancements for the Docker image. [See changelog](what-is-new.md)

## Envoy-based Docker image

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](docker-container.md)

### 4.8.0-1 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 4.8.1-1 (2023-12-01)

* Optimize Wallarm Cloud's export of brute, dirbust, and BOLA statistics to avoid delays in reaction to attacks under high request loads and numerous triggers
* The `wallarm-appstructure` package bumped to 1.7.6
* Removed apt cache for Vim package, which previously provoked false positive vulnerability detection by AWS Inspector

### 4.8.0-1 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-4-8-20231019-221905 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md)