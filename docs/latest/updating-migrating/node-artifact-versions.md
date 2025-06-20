# NGINX Node Artifact Versions and Changelog

This document lists available  [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 6.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported any more.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginxwallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for [**enumeration**](../api-protection/enumeration-attack-protection.md) mitigation controls
* Added support for [**Rate abuse protection**](../api-protection/rate-abuse-protection.md) mitigation control
* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.3 (2025-05-07)

* Added support for Amazon Linux 2
* Fixed the installation issues with custom NGINX

### 6.0.2 (2025-04-29)

* Added support for NGINX stable 1.28.0
* Added support for NGINX mainline 1.27.5

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
<!-- * Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages -->
* Added support for [SSL/TLS and mTLS](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticstls) between the Filtering Node and the postanalytics module
* Split the unified `controller.wallarm.wcli` component in `values.yaml` into 2 separately [configurable units](../admin-en/configure-kubernetes-en.md): `wcliController` and `wcliPostanalytics`, allowing fine-grained control over containers
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.2 (2025-04-25)

* Added the [`validation.enableCel`](../admin-en/configure-kubernetes-en.md#validationenablecel) parameter to enable validation of Ingress resources via Validating Admission Policies

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) vulnerability

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## Helm chart for Sidecar

[How to upgrade](sidecar-proxy.md)

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
<!-- * Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages -->
* Added support for [SSL/TLS and mTLS](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwstoretls) between the Filtering Node and the postanalytics module
* Bump Alpine version to 3.22
* Upgrade NGINX to version 1.28.0
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginxwallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Bump Alpine version to 3.22
* Upgrade NGINX to version 1.28.0
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginxwallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-6-2-0-20250618-150224 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginxwallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### wallarm-node-6-1-0-20250508-144827 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### wallarm-node-6-0-1-20250422-104749 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### wallarm-node-6-0-0-20250403-102125 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)
