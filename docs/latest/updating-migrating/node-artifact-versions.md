# NGINX Node Artifact Versions and Changelog

This document lists available  [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 6.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported any more.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 6.3.0 (2025-07-08)

* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

<!-- * [Node part only, no public announcement yet] Added support for SOAP-XML API Discovery
* [Node part only, no public announcement yet] Added support file upload restriction policy
* [Node part only, no public announcement yet] Added support for unrestricted resource consumption mitigation by API Abuse Prevention -->

### 6.2.1 (2025-06-23)

* Minor internal file structure change

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Introduced the [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) and [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX directives to control the maximum size of a single message payload and an entire stream body, respectively, in gRPC and WebSocket traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Introduced the [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX directive to control the maximum size of an HTTP request body analyzed by the Node
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
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

### 6.3.0 (2025-07-08)

* Added the [`validation.forbidDangerousAnnotations`](../admin-en/configure-kubernetes-en.md#validationforbiddangerousannotations) chart value to toggle the CEL rule that blocks the dangerous `server-snippet` and `configuration-snippet` annotations

    By default, it is set to `false` - dangerous annotations are not blocked.

    Behaviour in Node 6.2.0- unchanged (annotations are blocked by default when `validation.enableCel` is `true`).
* Added support for the [`controller.wallarm.postanalytics.serviceAddress`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceaddress) parameter to customize the address and port for incoming **wstore** connections
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Introduced the [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) and [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX directives to control the maximum size of a single message payload and an entire stream body, respectively, in gRPC and WebSocket traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Introduced the [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX directive to control the maximum size of an HTTP request body analyzed by the Node
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

### 6.3.0 (2025-07-08)

* Added support for the [`postanalytics.wstore.config.serviceAddress`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoreconfigserviceaddress) parameter to customize the address and port for incoming **wstore** connections
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added support for [SSL/TLS and mTLS](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoretls) between the Filtering Node and the postanalytics module
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

### 6.3.0 (2025-07-08)

* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
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

### 6.3.0 (2025-07-08)

* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
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

### wallarm-node-6-3-0-20250708-175541 (2025-07-08)

* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### wallarm-node-6-2-0-20250618-150224 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### wallarm-node-6-1-0-20250508-144827 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### wallarm-node-6-0-1-20250422-104749 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### wallarm-node-6-0-0-20250403-102125 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)
