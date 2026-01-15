# NGINX Node Artifact Versions and Changelog

This document lists available  [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 6.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported anymore.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

<!-- ### 6.5.0
new loggin variable wallarm_block_reason
new attack types in logging variables and search bars?
-->

### 6.9.0 (2026-01-15)

* Increased the frequency of session updates sent to the Wallarm Cloud. Sessions now appear in the UI faster, closer to real time
* Improved memory usage monitoring and prevention of resource exhaustion
* Fixed the [CVE-2026-21441](https://scout.docker.com/vulnerabilities/id/CVE-2026-21441) vulnerability

### 6.8.1 (2025-12-24)

* Fixed an issue where malformed fuzzing traffic could cause NGINX crashes, as observed in logs
* Added API token masking in Node logs to prevent sensitive data exposure

### 6.8.0 (2025-12-23)

* Bug fixes:
    * Fixed the issue where integers were not being masked when using the ["Mask sensitive data" rule](../user-guides/rules/sensitive-data-rule.md)
    * Fixed the issue where responses containing infoleak stamps were being blocked. Wallarm no longer blocks such responses, as doing so caused false detections and prevented rules from being edited
    * Fixed the issue where the [`wallarm_status` service statistics](../admin-en/configure-statistics-service.md) contained the outdated [`abnormal` metric](../admin-en/configure-statistics-service.md#usage), which was incorrectly increasing with each request. The metric and other outdated fields have been removed

### 6.7.3 (2025-12-11)

* Fixed an issue where large or overlapping denylisted IP ranges were not being blocked in Security Edge-hosted environments

### 6.7.1 (2025-11-17)

* Fixed `'error: no error'` when processing gRPC/WebSocket response attacks

### 6.7.0 (2025-11-05)

* Added support for Ubuntu 25.10 (Questing Quokka)
* Added support for CentOS 10 Stream
* Added support for Oracle Linux 10.x
* Added support for NGINX mainline 1.29.2 and 1.29.3
* Updated AlmaLinux 9 support to include the latest package updates
* Introduced JA4 fingerprinting in the [NGINX node](../installation/nginx-native-node-internals.md#nginx-node)

    JA4 fingerprints help detect threats and malicious clients based on TLS handshake characteristics. JA4 fingerprints are used as an additional factor when deciding to block a request.

    The feature is disabled by default. To enable it, add the following [NGINX directive](../admin-en/configure-parameters-en.md#wallarm_fingerprint) inside the `http` or `server` block:
    
    ```
    wallarm_fingerprint on;
    ```
    
* Introduced the `wallarm_fingerprint_ja4_raw` and `wallarm_fingerprint_ja4` variables to [configure extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) when JA4 fingerprinting is enabled
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
* Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses

### 6.6.1 (2025-10-16)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Fixed the following vulnerabilities:
    
    * [CVE-2025-49796](https://nvd.nist.gov/vuln/detail/cve-2025-49796)
    * [CVE-2025-49794](https://nvd.nist.gov/vuln/detail/cve-2025-49794)
    * [CVE-2025-6021](https://nvd.nist.gov/vuln/detail/cve-2025-6021)
    * [CVE-2025-49795](https://nvd.nist.gov/vuln/detail/cve-2025-49795)
    * [CVE-2025-6170](https://nvd.nist.gov/vuln/detail/cve-2025-6170)

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) using the `WALLARM_WSTORE__SERVICE__PROTOCOL` environment variable, which can be set in `/opt/wallarm/env.list`

    The default value is `"tcp4"`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric [`wallarm_wcli_job_export_period`](../admin-en/wcli-metrics.md#wallarm_wcli_job_export_period) to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `$wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable returns the final filtration mode applied to a malicious request, taking into account both local settings and those from the Wallarm Cloud (e.g., rules and mitigation controls) with their prioritization.
* Updated the wording on the [Wallarm-branded block page](../admin-en/configuration-guides/configure-block-page-and-code.md), the page now looks as follows:

    ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)

### 6.5.1 (2025-09-09)

* Added support for [blocking attackers by API sessions](../api-sessions/blocking.md)
* Added support for NGINX Plus R35
* Exposed [**wcli** Controller metrics endpoint](../admin-en/wcli-metrics.md) for external monitoring
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended

### 6.4.1 (2025-08-07)

* Added [Prometheus metrics support](../admin-en/apifw-metrics.md) for API Specification Enforcement service operation (based on the built-in API Firewall service):

    * Enable with `APIFW_METRICS_ENABLED=true` in `/opt/wallarm/env.list`
    * Default endpoint: `:9010/metrics`
    * Host and endpoint name configurable via variables `APIFW_METRICS_HOST` and `APIFW_METRICS_ENDPOINT_NAME`

### 6.4.0 (2025-07-31)

* Introduced a new `wallarm_block_reason` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable adds to the log an information on reason of request blocking (detected attack, part of bot activity, Denylist etc.)
* Introduced the new [`wallarm_export_streams`](../admin-en/configure-parameters-en.md#wallarm_export_streams) Wallarm directive which controls whether the Node exports information about long-lived streaming connections to the internal postanalytics storage (wstore)

    By default, `wallarm_export_streams` is set to `off`. When enabled, the Node sends stream and message data to wstore, allowing [API Discovery](../api-discovery/overview.md) to build the API inventory and display gRPC/WebSocket endpoints in the Wallarm Console UI.
* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements
<!-- * [Node part only, no public announcement yet] Added support for SOAP-XML API Discovery
* [Node part only, no public announcement yet] Added support file upload restriction policy -->

### 6.2.1 (2025-06-23)

* Minor internal file structure change

### 6.2.0 (2025-06-20)

* Added support for [mitigation control-based](../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Optimized stream handling for gRPC traffic
* Introduced the [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) and [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX directives to control the maximum size of a single message payload and an entire stream body, respectively, in gRPC and WebSocket traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Introduced the [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX directive to control the maximum size of an HTTP request body analyzed by the Node
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for GraphQL protocol in [API Discovery](../api-discovery/overview.md)
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
* Added support for NGINX Plus R34

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 6.9.0 (2026-01-15)

* Increased the frequency of session updates sent to the Wallarm Cloud. Sessions now appear in the UI faster, closer to real time
* Improved memory usage monitoring and prevention of resource exhaustion
* Fixed the [CVE-2026-21441](https://scout.docker.com/vulnerabilities/id/CVE-2026-21441) vulnerability

### 6.8.1 (2025-12-24)

* Fixed an issue where malformed fuzzing traffic could cause NGINX crashes, as observed in logs
* Added API token masking in Node logs to prevent sensitive data exposure

### 6.8.0 (2025-12-23)

* Bug fixes:
    * Fixed the issue where integers were not being masked when using the ["Mask sensitive data" rule](../user-guides/rules/sensitive-data-rule.md)
    * Fixed the issue where responses containing infoleak stamps were being blocked. Wallarm no longer blocks such responses, as doing so caused false detections and prevented rules from being edited
    * Fixed the issue where the [`wallarm_status` service statistics](../admin-en/configure-statistics-service.md) contained the outdated [`abnormal` metric](../admin-en/configure-statistics-service.md#usage), which was incorrectly increasing with each request. The metric and other outdated fields have been removed

### 6.7.3 (2025-12-11)

* Fixed an issue where large or overlapping denylisted IP ranges were not being blocked in Security Edge-hosted environments

### 6.7.1 (2025-11-17)

* Fixed YAML indentation issue causing Helm deployment to fail when postanalytics was configured as a DaemonSet
* Fixed `'error: no error'` when processing gRPC/WebSocket response attacks

### 6.7.0 (2025-11-05)

* Updated Community Ingress NGINX Controller 1.11.8 support to align with the latest upstream updates
* Introduced JA4 fingerprinting in the [NGINX node](../installation/nginx-native-node-internals.md#nginx-node)

    JA4 fingerprints help detect threats and malicious clients based on TLS handshake characteristics. JA4 fingerprints are used as an additional factor when deciding to block a request.

    The feature is disabled by default. To enable it, add the following [NGINX directive](../admin-en/configure-parameters-en.md#wallarm_fingerprint) inside the `http` or `server` block:
    
    ```
    wallarm_fingerprint on;
    ```
    
* Introduced the `wallarm_fingerprint_ja4_raw` and `wallarm_fingerprint_ja4` variables to [configure extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) when JA4 fingerprinting is enabled
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Updated default values for **wcli** Controller metrics:

    * [`controller.wallarm.wcliPostanalytics.metrics.enabled : true`](../admin-en/configure-kubernetes-en.md#controllerwallarmwclipostanalyticsmetricsenabled)
    * [`controller.wallarm.wcliPostanalytics.metrics.port : 9003`](../admin-en/configure-kubernetes-en.md#controllerwallarmwclipostanalyticsmetricsport)
    * [`controller.wallarm.wcliPostanalytics.metrics.host : ":9003"`](../admin-en/configure-kubernetes-en.md#controllerwallarmwclipostanalyticsmetricshost)

* Switched to native HTTP readiness and liveness probes for the **wstore** component
* Fixed the following vulnerabilities:

    * [CVE-2025-58187](https://nvd.nist.gov/vuln/detail/CVE-2025-58187)
    * [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188)
    * [CVE-2025-31498](https://nvd.nist.gov/vuln/detail/CVE-2025-31498)
* Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
* Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses

### 6.6.2 (2025-10-16)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Fixed the following vulnerabilities:
    
    * [CVE-2025-49796](https://nvd.nist.gov/vuln/detail/cve-2025-49796)
    * [CVE-2025-49794](https://nvd.nist.gov/vuln/detail/cve-2025-49794)
    * [CVE-2025-6021](https://nvd.nist.gov/vuln/detail/cve-2025-6021)
    * [CVE-2025-49795](https://nvd.nist.gov/vuln/detail/cve-2025-49795)
    * [CVE-2025-6170](https://nvd.nist.gov/vuln/detail/cve-2025-6170)

### 6.6.1 (2025-10-08)

* Fixed the postanalytics (wstore) liveness probe to align with the `serviceProtocol` setting

    When `serviceProtocol` is set to `tcp4`, the probe now explicitly uses IPv4, preventing restarts for dual-stack/IPv6 clusters.

### 6.6.0 (2025-10-03)

* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack
* Introduced protocol selection (tcp, tcp4, tcp6) in Ingress values ([`controller.wallarm.postanalytics.serviceProtocol`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceprotocol))

    The default value is `"tcp4"`.
* Changed the default value of [`controller.wallarm.postanalytics.serviceAddress`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceaddress) to `"0.0.0.0:3313"`
    
    This allows IPv4 traffic only. If you are using a custom value, make sure it matches the selected `controller.wallarm.postanalytics.serviceProtocol`.
* Fixed an issue where response context parameters configured in API Sessions were not uploaded to the Wallarm Cloud
* Introduced a new Prometheus metric `wallarm_wcli_job_export_lag` to track the average export delay for each wcli job (e.g., `reqexp`, `blkexp`, `botexp`)
* Introduced a new `wallarm_mode` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

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
* Exposed [**wcli** Controller metrics endpoint](../admin-en/wcli-metrics.md) for external monitoring
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended
* Upgraded to Community Ingress NGINX Controller version 1.11.8, aligning with the upstream Helm chart version 4.11.8 and Alpine version 3.22.0
* Fixed the [CVE-2025-5399](https://nvd.nist.gov/vuln/detail/CVE-2025-5399) and [CVE-2025-22872](https://nvd.nist.gov/vuln/detail/CVE-2025-22872) vulnerabilities due to the upstream upgrade

### 6.4.0 (2025-07-31)

* Introduced a new `wallarm_block_reason` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable adds to the log an information on reason of request blocking (detected attack, part of bot activity, Denylist etc.)
* Introduced the new [`wallarm_export_streams`](../admin-en/configure-parameters-en.md#wallarm_export_streams) Wallarm directive which controls whether the Node exports information about long-lived streaming connections to the internal postanalytics storage (wstore)

    By default, `wallarm_export_streams` is set to `off`. When enabled, the Node sends stream and message data to wstore, allowing [API Discovery](../api-discovery/overview.md) to build the API inventory and display gRPC/WebSocket endpoints in the Wallarm Console UI.
* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* Added the [`validation.forbidDangerousAnnotations`](../admin-en/configure-kubernetes-en.md#validationforbiddangerousannotations) chart value to toggle the CEL rule that blocks the dangerous `server-snippet` and `configuration-snippet` annotations

    By default, it is set to `false` - dangerous annotations are not blocked.

    Behaviour in Node 6.2.0- unchanged (annotations are blocked by default when `validation.enableCel` is `true`).
* Added support for the [`controller.wallarm.postanalytics.serviceAddress`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceaddress) parameter to customize the address and port for incoming **wstore** connections
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Added support for [mitigation control-based](../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Optimized stream handling for gRPC traffic
* Optimized stream handling for gRPC traffic
* Introduced the [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) and [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX directives to control the maximum size of a single message payload and an entire stream body, respectively, in gRPC and WebSocket traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Introduced the [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX directive to control the maximum size of an HTTP request body analyzed by the Node
* Added support for [SSL/TLS and mTLS](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticstls) between the Filtering Node and the postanalytics module
* Split the unified `controller.wallarm.wcli` component in `values.yaml` into 2 separately [configurable units](../admin-en/configure-kubernetes-en.md): `wcliController` and `wcliPostanalytics`, allowing fine-grained control over containers
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for GraphQL protocol in [API Discovery](../api-discovery/overview.md)
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

### 6.9.0 (2026-01-15)

* Increased the frequency of session updates sent to the Wallarm Cloud. Sessions now appear in the UI faster, closer to real time
* Improved memory usage monitoring and prevention of resource exhaustion
* Fixed the [CVE-2026-21441](https://scout.docker.com/vulnerabilities/id/CVE-2026-21441) vulnerability

### 6.8.1 (2025-12-24)

* Fixed an issue where malformed fuzzing traffic could cause NGINX crashes, as observed in logs
* Added API token masking in Node logs to prevent sensitive data exposure

### 6.8.0 (2025-12-23)

* Bug fixes:
    * Fixed the issue where integers were not being masked when using the ["Mask sensitive data" rule](../user-guides/rules/sensitive-data-rule.md)
    * Fixed an issue where large or overlapping denylisted IP ranges were not being blocked in Security Edge-hosted environments
    * Fixed the issue where responses containing infoleak stamps were being blocked. Wallarm no longer blocks such responses, as doing so caused false detections and prevented rules from being edited
    * Fixed the issue where the [`wallarm_status` service statistics](../admin-en/configure-statistics-service.md) contained the outdated [`abnormal` metric](../admin-en/configure-statistics-service.md#usage), which was incorrectly increasing with each request. The metric and other outdated fields have been removed

### 6.7.1 (2025-11-17)

* Fixed `'error: no error'` when processing gRPC/WebSocket response attacks

### 6.7.0 (2025-11-05)

* Introduced JA4 fingerprinting in the [NGINX node](../installation/nginx-native-node-internals.md#nginx-node)

    JA4 fingerprints help detect threats and malicious clients based on TLS handshake characteristics. JA4 fingerprints are used as an additional factor when deciding to block a request.

    The feature is disabled by default. To enable it, add the following [NGINX directive](../admin-en/configure-parameters-en.md#wallarm_fingerprint) inside the `http` or `server` block:
    
    ```
    wallarm_fingerprint on;
    ```
    
* Introduced the `wallarm_fingerprint_ja4_raw` and `wallarm_fingerprint_ja4` variables to [configure extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) when JA4 fingerprinting is enabled
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
* Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses

### 6.6.1 (2025-10-16)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Fixed the following vulnerabilities:
    
    * [CVE-2025-49796](https://nvd.nist.gov/vuln/detail/cve-2025-49796)
    * [CVE-2025-49794](https://nvd.nist.gov/vuln/detail/cve-2025-49794)
    * [CVE-2025-6021](https://nvd.nist.gov/vuln/detail/cve-2025-6021)
    * [CVE-2025-49795](https://nvd.nist.gov/vuln/detail/cve-2025-49795)
    * [CVE-2025-6170](https://nvd.nist.gov/vuln/detail/cve-2025-6170)

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
* Exposed [**wcli** Controller metrics endpoint](../admin-en/wcli-metrics.md) for external monitoring
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended

### 6.4.0 (2025-07-31)

* Introduced a new `wallarm_block_reason` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable adds to the log an information on reason of request blocking (detected attack, part of bot activity, Denylist etc.)
* Introduced the new [`wallarm_export_streams`](../admin-en/configure-parameters-en.md#wallarm_export_streams) Wallarm directive which controls whether the Node exports information about long-lived streaming connections to the internal postanalytics storage (wstore)

    By default, `wallarm_export_streams` is set to `off`. When enabled, the Node sends stream and message data to wstore, allowing [API Discovery](../api-discovery/overview.md) to build the API inventory and display gRPC/WebSocket endpoints in the Wallarm Console UI.
* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* Added support for the [`postanalytics.wstore.config.serviceAddress`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoreconfigserviceaddress) parameter to customize the address and port for incoming **wstore** connections
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Added support for [mitigation control-based](../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Optimized stream handling for gRPC traffic
* Optimized stream handling for gRPC traffic
* Added support for [SSL/TLS and mTLS](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoretls) between the Filtering Node and the postanalytics module
* Bump Alpine version to 3.22
* Upgrade NGINX to version 1.28.0
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for GraphQL protocol in [API Discovery](../api-discovery/overview.md)
* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 6.9.0 (2026-01-15)

* Increased the frequency of session updates sent to the Wallarm Cloud. Sessions now appear in the UI faster, closer to real time
* Improved memory usage monitoring and prevention of resource exhaustion
* Fixed the [CVE-2026-21441](https://scout.docker.com/vulnerabilities/id/CVE-2026-21441) vulnerability

### 6.8.1 (2025-12-24)

* Fixed an issue where malformed fuzzing traffic could cause NGINX crashes, as observed in logs
* Added API token masking in Node logs to prevent sensitive data exposure

### 6.8.0 (2025-12-23)

* Bug fixes:
    * Fixed the issue where integers were not being masked when using the ["Mask sensitive data" rule](../user-guides/rules/sensitive-data-rule.md)
    * Fixed the issue where responses containing infoleak stamps were being blocked. Wallarm no longer blocks such responses, as doing so caused false detections and prevented rules from being edited
    * Fixed the issue where the [`wallarm_status` service statistics](../admin-en/configure-statistics-service.md) contained the outdated [`abnormal` metric](../admin-en/configure-statistics-service.md#usage), which was incorrectly increasing with each request. The metric and other outdated fields have been removed

### 6.7.3 (2025-12-11)

* Fixed an issue where large or overlapping denylisted IP ranges were not being blocked in Security Edge-hosted environments

### 6.7.1 (2025-11-17)

* Fixed `'error: no error'` when processing gRPC/WebSocket response attacks

### 6.7.0 (2025-11-05)

* Introduced JA4 fingerprinting in the [NGINX node](../installation/nginx-native-node-internals.md#nginx-node)

    JA4 fingerprints help detect threats and malicious clients based on TLS handshake characteristics. JA4 fingerprints are used as an additional factor when deciding to block a request.

    The feature is disabled by default. To enable it, add the following [NGINX directive](../admin-en/configure-parameters-en.md#wallarm_fingerprint) inside the `http` or `server` block:
    
    ```
    wallarm_fingerprint on;
    ```
    
* Introduced the `wallarm_fingerprint_ja4_raw` and `wallarm_fingerprint_ja4` variables to [configure extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) when JA4 fingerprinting is enabled
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
* Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses

### 6.6.1 (2025-10-16)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Fixed the following vulnerabilities:
    
    * [CVE-2025-49796](https://nvd.nist.gov/vuln/detail/cve-2025-49796)
    * [CVE-2025-49794](https://nvd.nist.gov/vuln/detail/cve-2025-49794)
    * [CVE-2025-6021](https://nvd.nist.gov/vuln/detail/cve-2025-6021)
    * [CVE-2025-49795](https://nvd.nist.gov/vuln/detail/cve-2025-49795)
    * [CVE-2025-6170](https://nvd.nist.gov/vuln/detail/cve-2025-6170)

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
    docker sbom wallarm/node:6.6.1
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
* Exposed [**wcli** Controller metrics endpoint](../admin-en/wcli-metrics.md) for external monitoring
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

* Introduced a new `wallarm_block_reason` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable adds to the log an information on reason of request blocking (detected attack, part of bot activity, Denylist etc.)
* Introduced the new [`wallarm_export_streams`](../admin-en/configure-parameters-en.md#wallarm_export_streams) Wallarm directive which controls whether the Node exports information about long-lived streaming connections to the internal postanalytics storage (wstore)

    By default, `wallarm_export_streams` is set to `off`. When enabled, the Node sends stream and message data to wstore, allowing [API Discovery](../api-discovery/overview.md) to build the API inventory and display gRPC/WebSocket endpoints in the Wallarm Console UI.
* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Added support for [mitigation control-based](../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Optimized stream handling for gRPC traffic
* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Bump Alpine version to 3.22
* Upgrade NGINX to version 1.28.0
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for GraphQL protocol in [API Discovery](../api-discovery/overview.md)
* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 6.9.0 (2026-01-15)

* Increased the frequency of session updates sent to the Wallarm Cloud. Sessions now appear in the UI faster, closer to real time
* Improved memory usage monitoring and prevention of resource exhaustion
* Fixed the [CVE-2026-21441](https://scout.docker.com/vulnerabilities/id/CVE-2026-21441) vulnerability

### 6.8.1 (2025-12-24)

* Fixed an issue where malformed fuzzing traffic could cause NGINX crashes, as observed in logs
* Added API token masking in Node logs to prevent sensitive data exposure

### 6.8.0 (2025-12-23)

* Bug fixes:
    * Fixed the issue where integers were not being masked when using the ["Mask sensitive data" rule](../user-guides/rules/sensitive-data-rule.md)
    * Fixed the issue where responses containing infoleak stamps were being blocked. Wallarm no longer blocks such responses, as doing so caused false detections and prevented rules from being edited
    * Fixed the issue where the [`wallarm_status` service statistics](../admin-en/configure-statistics-service.md) contained the outdated [`abnormal` metric](../admin-en/configure-statistics-service.md#usage), which was incorrectly increasing with each request. The metric and other outdated fields have been removed

### 6.7.3 (2025-12-11)

* Fixed an issue where large or overlapping denylisted IP ranges were not being blocked in Security Edge-hosted environments

### 6.7.1 (2025-11-17)

* Introduced JA4 fingerprinting in the [NGINX node](../installation/nginx-native-node-internals.md#nginx-node)

    JA4 fingerprints help detect threats and malicious clients based on TLS handshake characteristics. JA4 fingerprints are used as an additional factor when deciding to block a request.

    The feature is disabled by default. To enable it, add the following [NGINX directive](../admin-en/configure-parameters-en.md#wallarm_fingerprint) inside the `http` or `server` block:
    
    ```
    wallarm_fingerprint on;
    ```
    
* Introduced the `wallarm_fingerprint_ja4_raw` and `wallarm_fingerprint_ja4` variables to [configure extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) when JA4 fingerprinting is enabled
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
* Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses
* Fixed `'error: no error'` when processing gRPC/WebSocket response attacks

### 6.6.1 (2025-10-16)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Fixed the following vulnerabilities:
    
    * [CVE-2025-49796](https://nvd.nist.gov/vuln/detail/cve-2025-49796)
    * [CVE-2025-49794](https://nvd.nist.gov/vuln/detail/cve-2025-49794)
    * [CVE-2025-6021](https://nvd.nist.gov/vuln/detail/cve-2025-6021)
    * [CVE-2025-49795](https://nvd.nist.gov/vuln/detail/cve-2025-49795)
    * [CVE-2025-6170](https://nvd.nist.gov/vuln/detail/cve-2025-6170)

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
* Exposed [**wcli** Controller metrics endpoint](../admin-en/wcli-metrics.md) for external monitoring
* Relaxed content-type validation in [API Specification Enforcement](../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Fixed the behavior of the [`wallarm_wstore_throttle_mode`](../admin-en/wstore-metrics.md#wallarm_wstore_throttle_mode) Prometheus metric, which previously did not return to the normal state (`0`) after throttling ended 

### 6.4.0 (2025-07-31)

* Introduced a new `wallarm_block_reason` variable for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    This variable adds to the log an information on reason of request blocking (detected attack, part of bot activity, Denylist etc.)
* Introduced the new [`wallarm_export_streams`](../admin-en/configure-parameters-en.md#wallarm_export_streams) Wallarm directive which controls whether the Node exports information about long-lived streaming connections to the internal postanalytics storage (wstore)

    By default, `wallarm_export_streams` is set to `off`. When enabled, the Node sends stream and message data to wstore, allowing [API Discovery](../api-discovery/overview.md) to build the API inventory and display gRPC/WebSocket endpoints in the Wallarm Console UI.
* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Bug fixes and internal improvements

### 6.3.1 (2025-07-23)

* Fixed memory leak

### 6.3.0 (2025-07-08)

* Added support for [file upload restriction policy](../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../api-abuse-prevention/overview.md)
* In rules, the separator used in [**xml_tag**](../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Internal improvements

### 6.2.0 (2025-06-20)

* Added support for [mitigation control-based](../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Optimized stream handling for gRPC traffic
* Optimized stream handling for gRPC traffic
* Added the `streams` and `messages` parameters to the [`/wallarm-status` service](../admin-en/configure-statistics-service.md) output to report the number of processed gRPC/WebSocket streams and messages
* Added support for [SSL/TLS and mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) between the NGINX-Wallarm module and the postanalytics module when they are installed separately
* Fixed [wstore](../admin-en/wstore-metrics.md#metrics-endpoint) ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Minor bug fixes

### 6.1.0 (2025-05-09)

* Added support for GraphQL protocol in [API Discovery](../api-discovery/overview.md)
* Bugfix: Attacks originated from allowlisted sources are no longer shown in the **Attacks** section
* wstore logs now include `"component": "wstore"` for easier identification

### 6.0.1 (2025-04-22)

* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities

### 6.0.0 (2025-04-03)

* Initial release 6.0, [see changelog](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-6-9-0-20260113-150813 (2026-01-15)

* Increased the frequency of session updates sent to the Wallarm Cloud. Sessions now appear in the UI faster, closer to real time
* Improved memory usage monitoring and prevention of resource exhaustion
* Fixed the [CVE-2026-21441](https://scout.docker.com/vulnerabilities/id/CVE-2026-21441) vulnerability

### wallarm-node-6-8-1-20251224-110807 (2025-12-24)

* Fixed an issue where malformed fuzzing traffic could cause NGINX crashes, as observed in logs
* Added API token masking in Node logs to prevent sensitive data exposure

### wallarm-node-6-8-0-20251219-144249 (2025-12-23)

* Bug fixes:
    * Fixed the issue where integers were not being masked when using the ["Mask sensitive data" rule](../user-guides/rules/sensitive-data-rule.md)
    * Fixed the issue where responses containing infoleak stamps were being blocked. Wallarm no longer blocks such responses, as doing so caused false detections and prevented rules from being edited
    * Fixed the issue where the [`wallarm_status` service statistics](../admin-en/configure-statistics-service.md) contained the outdated [`abnormal` metric](../admin-en/configure-statistics-service.md#usage), which was incorrectly increasing with each request. The metric and other outdated fields have been removed

### wallarm-node-6-7-3-20251211-112314 (2025-12-11)

* Fixed an issue where large or overlapping denylisted IP ranges were not being blocked in Security Edge-hosted environments

### wallarm-node-6-7-1-20251114-111054 (2025-11-17)

* Introduced JA4 fingerprinting in the [NGINX node](../installation/nginx-native-node-internals.md#nginx-node)

    JA4 fingerprints help detect threats and malicious clients based on TLS handshake characteristics. JA4 fingerprints are used as an additional factor when deciding to block a request.

    The feature is disabled by default. To enable it, add the following [NGINX directive](../admin-en/configure-parameters-en.md#wallarm_fingerprint) inside the `http` or `server` block:
    
    ```
    wallarm_fingerprint on;
    ```
    
* Introduced the `wallarm_fingerprint_ja4_raw` and `wallarm_fingerprint_ja4` variables to [configure extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node) when JA4 fingerprinting is enabled
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
* Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses
* Fixed `'error: no error'` when processing gRPC/WebSocket response attacks

### wallarm-node-6-6-1-20251015-165327 (2025-10-16)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Fixed the following vulnerabilities:
    
    * [CVE-2025-49796](https://nvd.nist.gov/vuln/detail/cve-2025-49796)
    * [CVE-2025-49794](https://nvd.nist.gov/vuln/detail/cve-2025-49794)
    * [CVE-2025-6021](https://nvd.nist.gov/vuln/detail/cve-2025-6021)
    * [CVE-2025-49795](https://nvd.nist.gov/vuln/detail/cve-2025-49795)
    * [CVE-2025-6170](https://nvd.nist.gov/vuln/detail/cve-2025-6170)

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

* Introduced the new [`wallarm_export_streams`](../admin-en/configure-parameters-en.md#wallarm_export_streams) Wallarm directive which controls whether the Node exports information about long-lived streaming connections to the internal postanalytics storage (wstore)

    By default, `wallarm_export_streams` is set to `off`. When enabled, the Node sends stream and message data to wstore, allowing [API Discovery](../api-discovery/overview.md) to build the API inventory and display gRPC/WebSocket endpoints in the Wallarm Console UI.
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
