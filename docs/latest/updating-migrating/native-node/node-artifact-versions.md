# Native Node Artifact Versions and Changelog

This document lists available [versions](../versioning-policy.md) of the [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.14.x+ in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

The all-in-one installer for the Native Node is used for [connectors](../../installation/nginx-native-node-internals.md#connectors_1).

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 versions.

[How to upgrade](all-in-one.md)

### 0.20.0 (2025-11-25)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Added Prometheus metrics support for the Postanalytics **wstore** component. The metrics are available by default at `http://localhost:9001` using the `tcp4` (IPv4-only) protocol

    You can change the default metrics host, port, and protocol by setting the following environment variables when deploying the Node:

    * `WALLARM_WSTORE__METRICS__LISTEN_ADDRESS` — defines the host and port
    * `WALLARM_WSTORE__METRICS__PROTOCOL` — defines the protocol

* Added Prometheus metrics support for API Specification Enforcement service operation (based on the built-in API Firewall service). API Firewall metrics are included as part of the [`go-node` Prometheus metrics](../../admin-en/native-node-metrics.md)
* Removed support for the deprecated `http_inspector.real_ip_header` configuration parameter
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Bug fixes:

    * Fixed an issue where the Aggregation/**wcli** container could enter a crash loop due to an out-of-memory (OOM) condition
    * Fixed an issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
    * Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses
    * Fixed a race condition in out-of-band connectors, resolving the `FlowIsMissingRequest`, `FlowIsMissingResponse`, and occasional duplicate ID errors
    * Fixed the issue where the `verdict` field in `go-node` access logs was occasionally missing, incorrectly formatted, and not JSON-compatible

### 0.19.0 (2025-10-07)

* Added support for [blocking attackers by API sessions](../../api-sessions/blocking.md)
* Added [multitenancy support](../../installation/multi-tenant/overview.md)
* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) using the `WALLARM_WSTORE__SERVICE__PROTOCOL` environment variable, which can be set in `/opt/wallarm/env.list`

    The default value is `"tcp4"`.
* Relaxed content-type validation in [API Specification Enforcement](../../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Bug fixes:

    * Fixed an issue where the `go-node` process could segfault in production environments
    * Fixed an issue where response context parameters configured in [API Sessions](../../api-sessions/setup.md) were not uploaded to the Wallarm Cloud
    * Fixed an issue with incorrect [`remote_addr`](../../user-guides/rules/request-processing.md#ip-address-of-a-request-origin) parsing

### 0.18.0 (2025-09-17)

* Added support for the [Azure API Management connector](../../installation/connectors/azure-api-management.md)
* Added support for the [Apigee API Management connector](../../installation/connectors/apigee.md)
* Updated Go version to 1.25
* `http_inspector.workers: auto` now respects Kubernetes `cgroup` limits
* Optimized mesh balancing logic for scale-up and scale-down events
* Bug fixes:

    * Fixed issue where the `go-node` process did not terminate correctly when stopped too early
    * Fixed issue where the `go-node` process ignored failures of metrics/health-check/mesh listeners
    * Fixed issue where `http_inspector` workers silently ignored ACL errors, addressing the most common source of these errors

### 0.17.1 (2025-08-15)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Optimized the internal channel between the Node and wstore to increase throughput
    
    This prevents potential data loss when the Node ingests traffic faster than it can export it to postanalytics.
* Fixed an issue where serialized requests without a source IP address failed to be exported to postanalytics
* Bug fixes and internal improvements

### 0.16.3 (2025-08-05)

* Added support for the [Akamai connector](../../installation/connectors/akamai-edgeworkers.md)
* Fixed a silent failure when upgrading with the `--preserve` flag set to `true`

### 0.16.1 (2025-08-01)

* Introduced the [`drop_on_overload`](../../installation/native-node/all-in-one-conf.md#drop_on_overload) parameter to control dropping excess input under high load

    Enabled (`true`) by default.
* Added new [Prometheus metrics](../../admin-en/native-node-metrics.md):

    * `wallarm_gonode_application_info` with the general Native Node instance information, e.g.:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len` now includes `aggregate="sum"` for `type="channel:in"`
    * `wallarm_gonode_http_inspector_errors_total` now includes a new `type="FlowTimeouts"`
* Improved stability in the internal `http_inspector` module

### 0.16.0 (2025-07-23)

* Added support for [file upload restriction policy](../../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../../api-abuse-prevention/overview.md)
* Added support for the [MuleSoft Flex Gateway connector](../../installation/connectors/mulesoft-flex.md)
* Introduced the [`input_filters`](../../installation/native-node/all-in-one-conf.md#input_filters) configuration section, allowing to define which requests should be inspected or bypassed by the Node
* Fixed memory leak
* In rules, the separator used in [**xml_tag**](../../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Fixed blocking issue with denylisted origins and Wallarm Console UI-configured mode
* Internal improvements

### 0.15.1 (2025-07-08)

* Added support for [mitigation control-based](../../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Introduced the [`proxy_headers`](../../installation/native-node/all-in-one-conf.md#proxy_headers) configuration to configure trusted networks and extract real client IP and host headers

    This replaces `http_inspector.real_ip_header` used in earlier versions in the `tcp-capture` mode.
* Added the [`metrics.namespace`](../../installation/native-node/all-in-one-conf.md#metricsnamespace) configuration option to customize the prefix of Prometheus metrics exposed by the `go-node` binary
* Fixed the `--preserve` script flag behavior to correctly retain the existing `node.yaml` and `env.list` files during upgrade

    Previously, these files could be overwritten, resulting in loss of configuration.
* Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits
* Minor internal file structure change
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Fixed the [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874) vulnerability
* Fixed the [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273) vulnerability

### 0.14.1 (2025-05-07)

* Added support for [**enumeration**](../../api-protection/enumeration-attack-protection.md) mitigation controls
* Added support for [**DoS protection**](../../api-protection/dos-protection.md) mitigation control
* Added support for the [IBM API Connect connector](../../installation/connectors/ibm-api-connect.md)
* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) vulnerabilities
* Added support for external health check endpoint in the `connector-server` mode

    This is controlled by the new [`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check) configuration section.
* Fixed a recurring intermittent bug that could cause occasional corruption of request and response bodies
* The following fixes and updates were made in `tcp-capture` mode:

    * GoReplay is now built with Go 1.24
    * Fixed: `go-node` process no longer hangs when the `goreplay` process crashes
    * Fixed a crash caused by a slice out-of-bounds error during header parsing in GoReplay
* Fixed incorrect display of Native Node versions in Wallarm Console → **Nodes**

### 0.14.0 (2025-04-16)

* Wallarm Node now uses **wstore**, a Wallarm-developed service, instead of Tarantool for local postanalytics processing
* The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins
    
    Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.

## Helm chart

The Helm chart for the Native Node is used for self-hosted node deployments with the [connectors](../../installation/nginx-native-node-internals.md#connectors_1).

[How to upgrade](helm-chart.md)

### 0.20.0 (2025-11-25)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Added Prometheus metrics support for the Postanalytics **wstore** component. The metrics are available by default at `http://localhost:9001` using the `tcp4` (IPv4-only) protocol

    You can change the default metrics host, port, and protocol by setting the following in `values.yaml`:

    * [`config.aggregation.metrics.listenAddress`](../../installation/native-node/helm-chart-conf.md#configaggregationmetricslistenaddress) — defines the host and port
    * [`config.aggregation.metrics.protocol`](../../installation/native-node/helm-chart-conf.md#configaggregationmetricsprotocol) — defines the protocol

* Added Prometheus metrics support for API Specification Enforcement service operation (based on the built-in API Firewall service). API Firewall metrics are included as part of the [`go-node` Prometheus metrics](../../admin-en/native-node-metrics.md)
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Switched to native HTTP readiness and liveness probes for the **wstore** component
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Bug fixes:

    * Fixed an issue where the Aggregation/**wcli** container could enter a crash loop due to an out-of-memory (OOM) condition
    * Fixed the issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
    * Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses
    * Fixed a race condition in out-of-band connectors, resolving the `FlowIsMissingRequest`, `FlowIsMissingResponse`, and occasional duplicate ID errors
    * Fixed the issue where the `verdict` field in `go-node` access logs was occasionally missing, incorrectly formatted, and not JSON-compatible

### 0.19.0 (2025-10-07)

* Added support for [blocking attackers by API sessions](../../api-sessions/blocking.md)
* Added [multitenancy support](../../installation/multi-tenant/overview.md)
* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack
* Introduced the protocol selection (tcp, tcp4, tcp6) configuration parameter: [`config.aggregation.serviceProtocol`](../../installation/native-node/helm-chart-conf.md#configaggregationserviceprotocol) 

    The default value is `"tcp4"`.
* Changed the default value of [config.aggregation.serviceAddress](../../installation/native-node/helm-chart-conf.md#configaggregationserviceaddress) to `0.0.0.0:3313`

    This allows IPv4 traffic only. If you are using a custom value, make sure it matches the selected `config.aggregation.serviceProtocol`.    
* Relaxed content-type validation in [API Specification Enforcement](../../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Set the default value for `config.connector.per_connection_limits.max_duration` to 1m (1 minute)
* Bug fixes:

    * Fixed an issue where the `go-node` process could segfault in production environments
    * Fixed an issue where response context parameters configured in [API Sessions](../../api-sessions/setup.md) were not uploaded to the Wallarm Cloud
    * Fixed an issue with incorrect [remote_addr](../../user-guides/rules/request-processing.md#ip-address-of-a-request-origin) parsing
    * Fixed an issue where processing affinity was not applied correctly in the Native Node Helm chart

### 0.18.0 (2025-09-17)

* Added support for the [Azure API Management connector](../../installation/connectors/azure-api-management.md)
* Added support for the [Apigee API Management connector](../../installation/connectors/apigee.md)
* Updated Go version to 1.25
* `http_inspector.workers: auto` now respects Kubernetes `cgroup` limits
* Optimized mesh balancing logic for scale-up and scale-down events
* Bug fixes:

    * Fixed issue where the `go-node` process did not terminate correctly when stopped too early
    * Fixed issue where the `go-node` process ignored failures of metrics/health-check/mesh listeners
    * Fixed issue where `http_inspector` workers silently ignored ACL errors, addressing the most common source of these errors

### 0.17.1 (2025-08-15)

* Introduced the [`proxy_headers`](../../installation/native-node/helm-chart-conf.md#configconnectorproxy_headers) configuration to configure trusted networks and extract real client IP and host headers
* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Optimized the internal channel between the Node and wstore to increase throughput
    
    This prevents potential data loss when the Node ingests traffic faster than it can export it to postanalytics.
* Fixed an issue where serialized requests without a source IP address failed to be exported to postanalytics
* Bug fixes and internal improvements

### 0.16.3 (2025-08-05)

* Added support for the [Akamai connector](../../installation/connectors/akamai-edgeworkers.md)
* Bug fixes

### 0.16.1 (2025-08-01)

* Introduced the [`input_filters`](../../installation/native-node/helm-chart-conf.md#configconnectorinput_filters) configuration section, allowing to define which requests should be inspected or bypassed by the Node
* Introduced the [`drop_on_overload`](../../installation/native-node/helm-chart-conf.md#drop_on_overload) parameter to control dropping excess input under high load

    Enabled (`true`) by default.
* Added new [Prometheus metrics](../../admin-en/native-node-metrics.md):

    * `wallarm_gonode_application_info` with the general Native Node instance information, e.g.:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len` now includes `aggregate="sum"` for `type="channel:in"`
    * `wallarm_gonode_http_inspector_errors_total` now includes a new `type="FlowTimeouts"`
* Deprecated the Wallarm Connector for [Istio that relied on a Lua plugin](/5.x/installation/connectors/istio/)

    We recommend using the [gRPC-based external processing filter for Istio](../../installation/connectors/istio.md) instead.
* For the deprecated Istio connector, the following improvements were made to ensure compatibility in existing deployments:

    * Fixed mesh balancing logic for messages
    * Added the `disable_mesh` parameter to process all connector traffic on the Node without mesh balancing (`false` by default - mesh balancing is enabled)
    * Added support for the `drop_on_overload` parameter
* Improved stability in the internal `http_inspector` module

### 0.16.0 (2025-07-23)

* Added support for [file upload restriction policy](../../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../../api-abuse-prevention/overview.md)
* Added support for the [MuleSoft Flex Gateway connector](../../installation/connectors/mulesoft-flex.md)
* Fixed memory leak
* In rules, the separator used in [**xml_tag**](../../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Fixed blocking issue with denylisted origins and Wallarm Console UI-configured mode
* Internal improvements

### 0.15.1 (2025-07-08)

* Added support for [mitigation control-based](../../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Added support for the [`config.aggregation.serviceAddress`](../../installation/native-node/helm-chart-conf.md#configaggregationserviceaddress) parameter to customize the address and port for incoming **wstore** connections
* Minor internal file structure change
* Fixed the [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874) vulnerability
* Fixed the [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273) vulnerability
<!-- * Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits -->

### 0.14.1 (2025-05-07)

* Added support for the [IBM API Connect connector](../../installation/connectors/ibm-api-connect.md)
* Fixed the [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) vulnerability
* Fixed handling of `clusterIP: None` in Helm chart headless service
* Fixed a recurring intermittent bug that could cause occasional corruption of request and response bodies
* Fixed incorrect display of Native Node versions in Wallarm Console → **Nodes**

### 0.14.0 (2025-04-16)

* Wallarm Node now uses **wstore**, a Wallarm-developed service, instead of Tarantool for local postanalytics processing
* All `tarantool` references in `values.yaml` (including container names and parameter keys) have been renamed to `wstore`

    If you override these parameters in your configuration, update their names accordingly.
* The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins
    
    Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.
* Renamed the `container` label to `type` in all Prometheus metrics matching `*_container_*` to prevent conflicts with Kubernetes system labels

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [connectors](../../installation/nginx-native-node-internals.md#connectors_1).

[How to upgrade](docker-image.md)

### 0.20.0 (2025-11-25)

* Introduced support for OpenAPI 3.1 in the [API Specification Enforcement](../../api-specification-enforcement/overview.md) feature — you can now upload specifications in version 3.1 format to compare traffic against them, identify mismatches, and mitigate related security risks
* Added Prometheus metrics support for the Postanalytics **wstore** component. The metrics are available by default at `http://localhost:9001` using the `tcp4` (IPv4-only) protocol

    You can change the default metrics host, port, and protocol by setting the following environment variables when deploying the Node:

    * `WALLARM_WSTORE__METRICS__LISTEN_ADDRESS` — defines the host and port
    * `WALLARM_WSTORE__METRICS__PROTOCOL` — defines the protocol

* Added Prometheus metrics support for API Specification Enforcement service operation (based on the built-in API Firewall service). API Firewall metrics are included as part of the [`go-node` Prometheus metrics](../../admin-en/native-node-metrics.md)
* Removed support for the deprecated `http_inspector.real_ip_header` configuration parameter
* Improved Node initialization logs — added detailed information about component type, supported versions, error source, API endpoint, and Node UUID to simplify troubleshooting during the initialization stage
* Fixed the [CVE-2025-58188](https://www.cve.org/CVERecord?id=CVE-2025-58188) vulnerability
* Bug fixes:

    * Fixed an issue where the Aggregation/**wcli** container could enter a crash loop due to an out-of-memory (OOM) condition
    * Fixed an issue where the Node raised an error when a JWT token was sent in the `Authorization: Bearer` header
    * Fixed invalid type error when editing automatically created rules for attacks detected in gRPC responses
    * Fixed a race condition in out-of-band connectors, resolving the `FlowIsMissingRequest`, `FlowIsMissingResponse`, and occasional duplicate ID errors
    * Fixed the issue where the `verdict` field in `go-node` access logs was occasionally missing, incorrectly formatted, and not JSON-compatible

### 0.19.0 (2025-10-07)

* Added support for [blocking attackers by API sessions](../../api-sessions/blocking.md)
* Added [multitenancy support](../../installation/multi-tenant/overview.md)
* Changed the default **wstore** binding to IPv4 (`tcp4`), it now listens only on IPv4 instead of dual‑stack

    If your configuration uses `localhost` for **wstore**, update it to `127.0.0.1`.
* Introduced protocol selection (tcp, tcp4, tcp6) via the [`WALLARM_WSTORE__SERVICE__PROTOCOL`](../../installation/native-node/docker-image.md#4-run-the-docker-container) environment variable

    The default value is `"tcp4"`.
* Relaxed content-type validation in [API Specification Enforcement](../../api-specification-enforcement/overview.md): requests with image MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) are no longer rejected
* Bumped Go version to 1.24
* Bug fixes:

    * Fixed an issue where the `go-node` process could segfault in production environments
    * Fixed an issue where response context parameters configured in [API Sessions](../../api-sessions/setup.md) were not uploaded to the Wallarm Cloud    
    * Fixed an issue with incorrect [remote_addr](../../user-guides/rules/request-processing.md#ip-address-of-a-request-origin) parsing

### 0.18.0 (2025-09-17)

* Added support for the [Azure API Management connector](../../installation/connectors/azure-api-management.md)
* Added support for the [Apigee API Management connector](../../installation/connectors/apigee.md)
* Updated Go version to 1.25
* `http_inspector.workers: auto` now respects Kubernetes `cgroup` limits
* Optimized mesh balancing logic for scale-up and scale-down events
* Bug fixes:

    * Fixed issue where the `go-node` process did not terminate correctly when stopped too early
    * Fixed issue where the `go-node` process ignored failures of metrics/health-check/mesh listeners
    * Fixed issue where `http_inspector` workers silently ignored ACL errors, addressing the most common source of these errors

### 0.17.1 (2025-08-15)

* Fixed the stuffed credentials export to the Cloud
* Improved GraphQL parser
* Optimized the internal channel between the Node and wstore to increase throughput
    
    This prevents potential data loss when the Node ingests traffic faster than it can export it to postanalytics.
* Fixed an issue where serialized requests without a source IP address failed to be exported to postanalytics
* Bug fixes and internal improvements

### 0.16.3 (2025-08-05)

* Added support for the [Akamai connector](../../installation/connectors/akamai-edgeworkers.md)
* Fixed a silent failure when upgrading with the `--preserve` flag set to `true`

### 0.16.1 (2025-08-01)

* Introduced the [`drop_on_overload`](../../installation/native-node/all-in-one-conf.md#drop_on_overload) parameter to control dropping excess input under high load

    Enabled (`true`) by default.
* Added new [Prometheus metrics](../../admin-en/native-node-metrics.md):

    * `wallarm_gonode_application_info` with the general Native Node instance information, e.g.:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len` now includes `aggregate="sum"` for `type="channel:in"`
    * `wallarm_gonode_http_inspector_errors_total` now includes a new `type="FlowTimeouts"`
* Improved stability in the internal `http_inspector` module

### 0.16.0 (2025-07-23)

* Added support for [file upload restriction policy](../../api-protection/file-upload-restriction.md) via mitigation controls
* Added support for [unrestricted resource consumption](../../attacks-vulns-list.md#unrestricted-resource-consumption) mitigation by [API Abuse Prevention](../../api-abuse-prevention/overview.md)
* Added support for the [MuleSoft Flex Gateway connector](../../installation/connectors/mulesoft-flex.md)
* Introduced the [`input_filters`](../../installation/native-node/all-in-one-conf.md#input_filters) configuration section, allowing to define which requests should be inspected or bypassed by the Node
* Fixed memory leak
* In rules, the separator used in [**xml_tag**](../../user-guides/rules/request-processing.md#xml) values that combine a URI, namespace, and tag name has been changed from `:` to `|`
* Fixed blocking issue with denylisted origins and Wallarm Console UI-configured mode
* Internal improvements

### 0.15.1 (2025-07-08)

* Added support for [mitigation control-based](../../api-protection/graphql-rule.md#mitigation-control-based-protection) **GraphQL API Protection**
* Introduced the [`proxy_headers`](../../installation/native-node/all-in-one-conf.md#proxy_headers) configuration to configure trusted networks and extract real client IP and host headers

    This replaces `http_inspector.real_ip_header` used in earlier versions in the `tcp-capture` mode.
* Added the [`metrics.namespace`](../../installation/native-node/all-in-one-conf.md#metricsnamespace) configuration option to customize the prefix of Prometheus metrics exposed by the `go-node` binary
* Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits
* Minor internal file structure change
* Fixed wstore ports binding: now bound to `127.0.0.1` instead of `0.0.0.0`
* Fixed the [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874) vulnerability
* Fixed the [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273) vulnerability

### 0.14.1 (2025-05-07)

* Added support for the [IBM API Connect connector](../../installation/connectors/ibm-api-connect.md)
* Fixed the [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) vulnerability
* Added support for external health check endpoint

    This is controlled by the new [`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check) configuration section.
* Fixed a recurring intermittent bug that could cause occasional corruption of request and response bodies
* Fixed incorrect display of Native Node versions in Wallarm Console → **Nodes**

### 0.14.0 (2025-04-16)

* Wallarm Node now uses **wstore**, a Wallarm-developed service, instead of Tarantool for local postanalytics processing
* The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins
    
    Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.

## Amazon Machine Image (AMI)

<!-- How to upgrade -->

### 0.14.0 (2025-05-07)

* Initial release
