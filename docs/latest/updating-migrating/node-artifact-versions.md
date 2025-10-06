# NGINX Node Artifact Versions and Changelog

This document lists available  [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 6.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported any more.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

<!-- ### 6.5.0
new loggin variable wallarm_block_reason
new attack types in logging variables and search bars?
-->

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) using the `WALLARM_WSTORE__SERVICE__PROTOCOL` environment variable, which can be set in `/opt/wallarm/env.list`

    The default value is `"tcp4"`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)

### 6.5.1 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended

### 6.4.1 (2025-08-07)

* Added [Prometheus metrics support](../admin-en/apifw-metrics.md) for API Specification Enforcement service operation (based on the built-in API Firewall service):

    * Enable with `APIFW_METRICS_ENABLED=true` in `/opt/wallarm/env.list`
    * Default endpoint: `:9010/metrics`
    * Host and endpoint name configurable via variables `APIFW_METRICS_HOST` and `APIFW_METRICS_ENDPOINT_NAME`

### 6.4.0 (2025-07-31)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md)
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements
<!-- * [Node part only, no public announcement yet] Added support for SOAP-XML API Discovery
* [Node part only, no public announcement yet] Added support file upload restriction policy -->

### 6.2.1 (2025-06-23)

* Minor internal file structure change

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Introduced the [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) and [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX directives to control the maximum size of a single message payload and an entire stream body, respectively, in gRPC and WebSocket traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Introduced the [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX directive to control the maximum size of an HTTP request body analyzed by the Node
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for [**enumeration**](../api-protection/enumeration-attack-protection.md) mitigation controls
* Added support for [**DoS protection**](../api-protection/dos-protection.md) mitigation control
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

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack
* Introduced protocol selection (tcp, tcp4, tcp6) in Ingress values ([`controller.wallarm.postanalytics.serviceProtocol`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceprotocol))

    The default value is `"tcp4"`.
* Changed the default value of [`controller.wallarm.postanalytics.serviceAddress`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceaddress) to `"0.0.0.0:3313"`
    
    This allows IPv4 traffic only. If you are using a custom value, make sure it matches the selected `controller.wallarm.postanalytics.serviceProtocol`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)
* Fixed the following vulnerabilities:

    * [CVE-2025-9230](https://nvd.nist.gov/vuln/detail/CVE-2025-9230)
    * [CVE-2025-9231](https://nvd.nist.gov/vuln/detail/CVE-2025-9231)
    * [CVE-2025-9232](https://nvd.nist.gov/vuln/detail/CVE-2025-9232)
    * [CVE-2025-50181](https://nvd.nist.gov/vuln/detail/CVE-2025-50181)
    * [CVE-2025-50182](https://nvd.nist.gov/vuln/detail/CVE-2025-50182)
    * [CVE-2024-47081](https://nvd.nist.gov/vuln/detail/CVE-2025-47081)
    * [CVE-2025-9086](https://nvd.nist.gov/vuln/detail/CVE-2025-9086)
    * [CVE-2025-10148](https://nvd.nist.gov/vuln/detail/CVE-2025-10148)
    * [CVE-2025-22872](https://nvd.nist.gov/vuln/detail/CVE-2025-22872)

### 6.5.1 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Added [Prometheus metrics support](../admin-en/apifw-metrics.md) for API Specification Enforcement service operation (based on the built-in API Firewall service)

    Metrics are disabled by default and can be enabled through the new [`controller.wallarm.apiFirewall.metrics.*`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewallmetrics) values.
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended
* Upgraded to Community Ingress NGINX Controller version 1.11.8, aligning with the upstream Helm chart version 4.11.8 and Alpine version 3.22.0
* Fixed the [CVE-2025-5399](https://nvd.nist.gov/vuln/detail/CVE-2025-5399) and [CVE-2025-22872](https://nvd.nist.gov/vuln/detail/CVE-2025-22872) vulnerabilities due to the upstream upgrade

### 6.4.0 (2025-07-31)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md)
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
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

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack
* Introduced protocol selection (tcp, tcp4, tcp6) in Ingress values ([`postanalytics.wstore.config.serviceProtocol`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoreconfigserviceprotocol))

    The default value is `"tcp4"`.
* Changed the default value of [`postanalytics.wstore.config.serviceAddress`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoreconfigserviceaddress) to `"0.0.0.0:3313"`
    
    This allows IPv4 traffic only. If you are using a custom value, make sure it matches the selected `postanalytics.wstore.config.serviceProtocol`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)
* Fixed the following vulnerabilities:

    * [CVE-2025-9230](https://nvd.nist.gov/vuln/detail/CVE-2025-9230)
    * [CVE-2025-9231](https://nvd.nist.gov/vuln/detail/CVE-2025-9231)
    * [CVE-2025-9232](https://nvd.nist.gov/vuln/detail/CVE-2025-9232)
    * [CVE-2025-50181](https://nvd.nist.gov/vuln/detail/CVE-2025-50181)
    * [CVE-2025-50182](https://nvd.nist.gov/vuln/detail/CVE-2025-50182)
    * [CVE-2024-47081](https://nvd.nist.gov/vuln/detail/CVE-2025-47081)
    * [CVE-2025-9086](https://nvd.nist.gov/vuln/detail/CVE-2025-9086)
    * [CVE-2025-10148](https://nvd.nist.gov/vuln/detail/CVE-2025-10148)

### 6.5.1 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Added [Prometheus metrics support](../admin-en/apifw-metrics.md) for API Specification Enforcement service operation (based on the built-in API Firewall service)

    Metrics are disabled by default and can be enabled through the new [`config.wallarm.apiFirewall.metrics.*`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md) values.
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended

### 6.4.0 (2025-07-31)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md)
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
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

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) via the `WALLARM_WSTORE__SERVICE__PROTOCOL` environment variable

    The default value is `"tcp4"`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Fixed an issue where Docker container logs showed a false error about inability to connect to port 3313 when `upstream wallarm_wstore` was configured with `localhost` instead of `127.0.0.1`

    False error example:

    ```
    2025/09/11 15:49:07 [error] 33#33: wallarm: [::1]:3313 connect() failed 21
    ```
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Included an [SBOM](../integrations-devsecops/generate-sbom-for-docker-images.md) in the image by default, you can retrieve it using the following command:

    ```
    docker sbom wallarm/node:6.6.0
    ```
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)
* Fixed the following vulnerabilities:

    * [CVE-2025-9230](https://nvd.nist.gov/vuln/detail/CVE-2025-9230)
    * [CVE-2025-9231](https://nvd.nist.gov/vuln/detail/CVE-2025-9231)
    * [CVE-2025-9232](https://nvd.nist.gov/vuln/detail/CVE-2025-9232)
    * [CVE-2025-50181](https://nvd.nist.gov/vuln/detail/CVE-2025-50181)
    * [CVE-2025-50182](https://nvd.nist.gov/vuln/detail/CVE-2025-50182)
    * [CVE-2024-47081](https://nvd.nist.gov/vuln/detail/CVE-2025-47081)
    * [CVE-2025-59375](https://nvd.nist.gov/vuln/detail/CVE-2025-59375)
    * [CVE-2025-8961](https://nvd.nist.gov/vuln/detail/CVE-2025-8961)
    * [CVE-2025-9165](https://nvd.nist.gov/vuln/detail/CVE-2025-9165)

### 6.5.1 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended

### 6.4.1 (2025-08-07)

* Added [Prometheus metrics support](../admin-en/apifw-metrics.md) for API Specification Enforcement service operation (based on the built-in API Firewall service):

    * Enable with the environment variable `APIFW_METRICS_ENABLED=true`
    * Default endpoint: `:9010/metrics`
    * Expose the metrics port in your container (e.g., for the default state, use `-p 9010:9010`)
    * Host and endpoint name configurable via variables `APIFW_METRICS_HOST` and `APIFW_METRICS_ENDPOINT_NAME`

### 6.4.0 (2025-07-31)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md)
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
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

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) using the `WALLARM_WSTORE__SERVICE__PROTOCOL` environment variable, which can be set in `/opt/wallarm/env.list`

    The default value is `"tcp4"`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)

### 6.5.1 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended 

### 6.4.0 (2025-07-31)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md)
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
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

### wallarm-node-6-6-0-20251005-044509 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) using the `WALLARM_WSTORE__SERVICE__PROTOCOL` environment variable, which can be set in `/opt/wallarm/env.list`

    The default value is `"tcp4"`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)

### wallarm-node-6-5-1-20250908-174655 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended

### wallarm-node-6-4-0-20250730-083353 (2025-07-31)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### wallarm-node-6-3-1-20250721-082413 (2025-07-23)

* Fixed memory leak

### wallarm-node-6-3-0-20250708-175541 (2025-07-08)

* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### wallarm-node-6-2-0-20250618-150224 (2025-06-20)

* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### wallarm-node-6-1-0-20250508-144827 (2025-05-09)

* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### wallarm-node-6-0-1-20250422-104749 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### wallarm-node-6-0-0-20250403-102125 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)
