# Native Node Artifact Versions and Changelog

This document lists available [versions](../versioning-policy.md) of the [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

The all-in-one installer for the Native Node is used for [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) and self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM API Connect](../../installation/connectors/ibm-api-connect.md) connectors.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to upgrade](all-in-one.md)

### 0.13.4 (2025-05-14)

* Fixed the `--preserve` script flag behavior to correctly retain the existing `node.yaml` and `env.list` files during upgrade

    Previously, these files could be overwritten, resulting in loss of configuration.
* Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits
* Added support for the `WALLARM_ATTACKS_DETAILED_EXPORT` environment variable to optionally disable exporting full attack data to Wallarm Cloud

    This is intended for environments with strict data protection requirements.

### 0.13.3 (2025-05-07)

* Added support for the [IBM API Connect connector](../../installation/connectors/ibm-api-connect.md)
* Fixed the [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115), [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) vulnerabilities
* Added support for external health check endpoint in the `connector-server` mode

    This is controlled by the new [`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check) configuration section.
* Fixed a recurring intermittent bug that could cause occasional corruption of request and response bodies
* The following fixes and updates were made in `tcp-capture` mode:

    * GoReplay is now built with Go 1.24
    * Fixed: `go-node` process no longer hangs when the `goreplay` process crashes
    * Fixed a crash caused by a slice out-of-bounds error during header parsing in GoReplay
* Fixed incorrect display of Native Node versions in Wallarm Console → **Nodes**

### 0.13.2 (2025-04-15)

* Fixed an intermittent bug causing occasional request and response body corruption

### 0.13.1 (2025-04-09)

* Stability improvements

### 0.13.0 (2025-03-31)

* `tarantool_exporter` is now `postanalytics_exporter` in the Native Node configuration file. This change also requires an update to the `version` value:

    ```diff
    -version: 3
    +version: 4

    -tarantool_exporter:
    +postanalytics_exporter:
      address: 127.0.0.1:3313
      enabled: true
    ```
    
    Deployments using version 2 or version 3 will continue to work with Native Node 0.13.x and above if you do not explicitly specify the `postanalytics_exporter` configuration. However, this approach is deprecated, and updating to the new configuration format is recommended.
* Added support for the [`envoy-external-filter` operation mode for Istio/Envoy external gRPC processing filter](../../installation/connectors/istio-inline.md)
* Fixed the [CVE-2024-56171](https://nvd.nist.gov/vuln/detail/CVE-2024-56171), [CVE-2025-24928](https://nvd.nist.gov/vuln/detail/CVE-2025-24928), [CVE-2025-22869](https://nvd.nist.gov/vuln/detail/CVE-2025-22869), [CVE-2025-22868](https://nvd.nist.gov/vuln/detail/CVE-2025-22868) vulnerabilities
* Fixed request counter when `wallarm_mode: off` (they are not counted)

### 0.12.1 (2025-02-27)

* Fixed the [CVE-2025-22869](https://nvd.nist.gov/vuln/detail/CVE-2025-22869), [CVE-2024-13176](https://nvd.nist.gov/vuln/detail/CVE-2024-13176), [CVE-2024-56326](https://nvd.nist.gov/vuln/detail/CVE-2024-56326), [CVE-2024-56201](https://nvd.nist.gov/vuln/detail/CVE-2024-56201) and [CVE-2025-22866](https://nvd.nist.gov/vuln/detail/CVE-2025-22866) vulnerabilities
* Fixed the [CVE-2025-26519](https://nvd.nist.gov/vuln/detail/CVE-2025-26519) and [CVE-2024-12797](https://nvd.nist.gov/vuln/detail/CVE-2024-12797) vulnerabilities
* Fixed vpatch attacks not being blocked in monitoring mode
* Fixed serialized requests missing response time and length fields
* Fixed chained headers log level from `warn` to `trace`

### 0.12.0 (2025-02-05)

* Added support for response parameters in [API Sessions](../../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../../api-sessions/setup.md#session-grouping) (see detailed [change description](../../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../../user-guides/rules/request-processing.md#gql) (see detailed [change description](../../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions

* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../../user-guides/rules/configure-overlimit-res-detection.md) attacks
* Fixed problem for the `invalid_xml` attack detection in responses
* Fixed an issue where user-overridden headers were being dropped

### 0.11.0 (2025-01-31)

* Added support for the [`WALLARM_APID_ONLY` environment variable](../../installation/native-node/all-in-one.md#installer-launch-options) which enables API Discovery-only mode

    In this mode, attacks are blocked locally (if enabled) but not exported to Wallarm Cloud, while [API Discovery](../../api-discovery/overview.md), [API session tracking](../../api-sessions/overview.md), and [security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) remain fully functional. This mode is rarely needed, in most environments, using this mode is unnecessary.
* Improved the Native Node's interaction with GoReplay, resulting in the following configuration changes:

    ``` diff
    -version: 2
    +version: 3

    -middleware:
    +goreplay:
      parse_responses: true
      response_timeout: 5s
      url_normalize: true
    ```

    During upgrade, update the `version` value and replace the `middleware` section with `goreplay` if explicitly specified in the initial configuration file.
* Fixed a small HTTP parsing bug in the `tcp-capture` mode

### 0.10.1 (2025-01-02)

* Added support for sensitive business flows in [API Discovery](../../api-discovery/sbf.md) and [API Sessions](../../api-sessions/exploring.md#sensitive-business-flows)
* Added support for the [Fastly](../../installation/connectors/fastly.md) connector
* Fixed potential request loss at mesh startup
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

### 0.10.0 (2024-12-19)

* Added URL normalization before selecting route configurations and analyzing data with libproton in `tcp-capture` mode

    This is controlled by the [`middleware.url_normalize`](../../installation/native-node/all-in-one-conf.md#goreplayurl_normalize) parameter (`true` by default).
* Introduced the [`http_inspector.wallarm_process_time_limit`](../../installation/native-node/all-in-one-conf.md#http_inspectorwallarm_process_time_limit) parameter to control request processing time locally

    The default is `1s` unless overridden by Wallarm Console settings.
* Prometheus metrics updates (available in the :9000 port):

    * Removed obsolete metrics with static zero values.
    * Enhanced `http_inspector_requests_processed` and `http_inspector_threats_found` metrics with `anything` allowed to be specified in `source` label values.
    * Added the `http_inspector_adjusted_counters` metric for tracking request and attack counts.

### 0.9.1 (2024-12-10)

* Minor bug fixes

### 0.9.0 (2024-12-04)

* The default endpoint for JSON-formatted `/wallarm-status` metrics has changed to `127.0.0.1:10246` (the `metrics.legacy_status.listen_address` parameter value). This legacy service is critical for Node functionality but does not require direct interaction.

### 0.8.3 (2024-11-14)

* Added support for Mulesoft connector 3.0.x

### 0.8.2 (2024-11-11)

* Fixed some bugs in the `wallarm-status` service operation

### 0.8.1 (2024-11-06)

* Fixed regression in the `request_id` format introduced in 0.8.0

### 0.8.0 (2024-11-06)

* Added support for the [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) connector
* Added support for [API Sessions](../../api-sessions/overview.md)
* [Improved](../what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Changed default values for the following parameters:

    * The [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking) parameter now defaults to `true`, enabling the Native Node's general capability to block incoming requests without manual configuration during deployment.
    * The [`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parameter, which sets the traffic filtration mode, now defaults to `monitoring`, providing an optimal setup for initial deployments.
* Added URL normalization before selecting route configurations and analyzing data with libproton (controlled by the [`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize) parameter which is set to `true` by default)
* Reduced memory usage during node registration
* Some bug fixes

### 0.7.0 (2024-10-16)

* Fixed an issue where some internal service connector headers were not being stripped before processing
* Added support for the mesh feature in `connector-server` mode, enabling consistent request/response routing across multiple node replicas

    This introdcues the new configuration parameters under [`connector.mesh`](../../installation/native-node/all-in-one-conf.md#connectormesh) to configure the mesh functionality.

### 0.6.0 (2024-10-10)

* Added support for [customizing sensitive data detection](../../api-discovery/setup.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)
* Fixed memory leak related to IP addresses that are not in [IP lists](../../user-guides/ip-lists/overview.md) but have [known source](../../user-guides/ip-lists/overview.md#select-object)
* Updated artifact naming from "next" to "native"
    
    `https://meganode.wallarm.com/next/aionext-<VERSION>.<ARCH>.sh` → `https://meganode.wallarm.com/native/aio-native-<VERSION>.<ARCH>.sh`

### 0.5.2 (2024-09-17)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export
* Fixed an issue with the C memory allocator that caused a performance slowdown

### 0.5.1 (2024-09-16)

* Added configurable access log output via [`log.access_log` parameters](../../installation/native-node/all-in-one-conf.md#logaccess_logenabled)

### 0.5.0 (2024-09-11)

* Minor technical improvements and optimizations

### 0.4.3 (2024-09-05)

* Fixed an issue causing ~0.1% of data source messages to be silently lost due to a typo

### 0.4.1 (2024-08-27)

* Added support for wildcard matching in the [`route_config.routes.host`](../../installation/native-node/all-in-one-conf.md#host) configuration parameter

### 0.4.0 (2024-08-22)

* [Initial release](../../installation/oob/tcp-traffic-mirror/deployment.md)

## Helm chart

The Helm chart for the Native Node is used for self-hosted node deployments with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM API Connect](../../installation/connectors/ibm-api-connect.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md), and [Istio](../../installation/connectors/istio.md) connectors.

[How to upgrade](helm-chart.md)

### 0.13.4 (2025-05-14)

* Added [`config.connector.per_connection_limits`](../../installation/native-node/helm-chart-conf.md#configconnectorper_connection_limits) to control `keep-alive` connection limits

### 0.13.3 (2025-05-07)

* Added support for the [IBM API Connect connector](../../installation/connectors/ibm-api-connect.md)
* Renamed the `container` label to `type` in all Prometheus metrics matching `*_container_*` to prevent conflicts with Kubernetes system labels
* Fixed the [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) vulnerability
* Fixed handling of `clusterIP: None` in Helm chart headless service
* Fixed a recurring intermittent bug that could cause occasional corruption of request and response bodies
* Fixed incorrect display of Native Node versions in Wallarm Console → **Nodes**

### 0.13.2 (2025-04-15)

* Fixed an intermittent bug causing occasional request and response body corruption

### 0.13.1 (2025-04-09)

* Stability improvements

### 0.13.0 (2025-03-31)

* Added support for the [`envoy-external-filter` operation mode for Istio/Envoy external gRPC processing filter](../../installation/connectors/istio-inline.md)
* Fixed the [CVE-2024-56171](https://nvd.nist.gov/vuln/detail/CVE-2024-56171), [CVE-2025-24928](https://nvd.nist.gov/vuln/detail/CVE-2025-24928), [CVE-2025-22869](https://nvd.nist.gov/vuln/detail/CVE-2025-22869), [CVE-2025-22868](https://nvd.nist.gov/vuln/detail/CVE-2025-22868) vulnerabilities
* Fixed request counter when `wallarm_mode: off` (they are not counted)

### 0.12.1 (2025-02-27)

* Fixed the [CVE-2025-22869](https://nvd.nist.gov/vuln/detail/CVE-2025-22869), [CVE-2024-13176](https://nvd.nist.gov/vuln/detail/CVE-2024-13176), [CVE-2024-56326](https://nvd.nist.gov/vuln/detail/CVE-2024-56326), [CVE-2024-56201](https://nvd.nist.gov/vuln/detail/CVE-2024-56201) and [CVE-2025-22866](https://nvd.nist.gov/vuln/detail/CVE-2025-22866) vulnerabilities
* Fixed the [CVE-2025-26519](https://nvd.nist.gov/vuln/detail/CVE-2025-26519) and [CVE-2024-12797](https://nvd.nist.gov/vuln/detail/CVE-2024-12797) vulnerabilities
* Fixed vpatch attacks not being blocked in monitoring mode
* Fixed serialized requests missing response time and length fields
* Fixed chained headers log level from `warn` to `trace`

### 0.12.0 (2025-02-05)

* Added support for response parameters in [API Sessions](../../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../../api-sessions/setup.md#session-grouping) (see detailed [change description](../../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../../user-guides/rules/request-processing.md#gql) (see detailed [change description](../../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions

* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../../user-guides/rules/configure-overlimit-res-detection.md) attacks
* Fixed problem for the `invalid_xml` attack detection in responses
* Fixed an issue where user-overridden headers were being dropped

### 0.11.0 (2025-01-31)

* Fixed some bugs

### 0.10.1 (2025-01-02)

* Added support for sensitive business flows in [API Discovery](../../api-discovery/sbf.md) and [API Sessions](../../api-sessions/exploring.md#sensitive-business-flows)
* Added support for the [Fastly](../../installation/connectors/fastly.md) connector
* Fixed potential request loss at mesh startup
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

### 0.10.0 (2024-12-19)

* Introduced more granular logging configuration options in the [`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog) section, replacing the single `config.connector.log_level` parameter
* The default log level is now `info` (previously `debug`)

### 0.9.1 (2024-12-10)

* Minor bug fixes

### 0.9.0 (2024-12-04)

* Some fixes for consistent traffic distribution across all aggregation replicas.
* The default endpoint for JSON-formatted `/wallarm-status` metrics has changed to `127.0.0.1:10246` (the `metrics.legacy_status.listen_address` parameter value). This legacy service is critical for Node functionality but does not require direct interaction.
* Minor fixes to increase reliability under diverse deployment conditions.

### 0.8.3 (2024-11-14)

* Added support for Mulesoft connector v3.0.x

### 0.8.2 (2024-11-11)

* Fixed some bugs in the `wallarm-status` service operation

### 0.8.1 (2024-11-07)

* Added support for the [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) connector
* Added support for [API Sessions](../../api-sessions/overview.md)
* [Improved](../what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Reduced memory usage during node registration
* Some bug fixes

### 0.7.0 (2024-10-17)

* Fixed an issue where some internal service connector headers were not being stripped before processing
* Added support for [customizing sensitive data detection](../../api-discovery/setup.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)
* Fixed memory leak related to IP addresses that are not in [IP lists](../../user-guides/ip-lists/overview.md) but have [known source](../../user-guides/ip-lists/overview.md#select-object)
* Updated artifact naming from "next" to "native"
    
    `wallarm/wallarm-node-next` → `wallarm/wallarm-node-native`
* Updated the `config.wallarm_node_address` parameter value in the `KongClusterPlugin` Kubernetes resource used to activate the Wallarm Lua plugin:

    `http://next-processing.wallarm-node.svc.cluster.local:5000` → `http://native-processing.wallarm-node.svc.cluster.local:5000`

### 0.5.3 (2024-10-01)

* Initial release

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM API Connect](../../installation/connectors/ibm-api-connect.md) connectors.

[How to upgrade](docker-image.md)

### 0.13.4 (2025-05-14)

* Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits
* Added support for the [`WALLARM_ATTACKS_DETAILED_EXPORT` environment variable](../../installation/native-node/docker-image.md#4-run-the-docker-container) to optionally disable exporting full attack data to Wallarm Cloud

    This is intended for environments with strict data protection requirements.

### 0.13.3 (2025-05-07)

* Added support for the [IBM API Connect connector](../../installation/connectors/ibm-api-connect.md)
* Fixed the [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) vulnerability
* Added support for external health check endpoint

    This is controlled by the new [`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check) configuration section.
* Fixed a recurring intermittent bug that could cause occasional corruption of request and response bodies
* Fixed incorrect display of Native Node versions in Wallarm Console → **Nodes**

### 0.13.2 (2025-04-15)

* Fixed an intermittent bug causing occasional request and response body corruption

### 0.13.1 (2025-04-09)

* Stability improvements

### 0.13.0 (2025-03-31)

* `tarantool_exporter` is now `postanalytics_exporter` in the Native Node configuration file. This change also requires an update to the `version` value:

    ```diff
    -version: 3
    +version: 4

    -tarantool_exporter:
    +postanalytics_exporter:
      address: 127.0.0.1:3313
      enabled: true
    ```
    
    Deployments using version 2 or version 3 will continue to work with Native Node 0.13.x and above if you do not explicitly specify the `postanalytics_exporter` configuration. However, this approach is deprecated, and updating to the new configuration format is recommended.
* Added support for the [`envoy-external-filter` operation mode for Istio/Envoy external gRPC processing filter](../../installation/connectors/istio-inline.md)
* Fixed the [CVE-2024-56171](https://nvd.nist.gov/vuln/detail/CVE-2024-56171), [CVE-2025-24928](https://nvd.nist.gov/vuln/detail/CVE-2025-24928), [CVE-2025-22869](https://nvd.nist.gov/vuln/detail/CVE-2025-22869), [CVE-2025-22868](https://nvd.nist.gov/vuln/detail/CVE-2025-22868) vulnerabilities
* Fixed request counter when `wallarm_mode: off` (they are not counted)

### 0.12.1 (2025-02-27)

* Fixed the [CVE-2025-22869](https://nvd.nist.gov/vuln/detail/CVE-2025-22869), [CVE-2024-13176](https://nvd.nist.gov/vuln/detail/CVE-2024-13176), [CVE-2024-56326](https://nvd.nist.gov/vuln/detail/CVE-2024-56326), [CVE-2024-56201](https://nvd.nist.gov/vuln/detail/CVE-2024-56201) and [CVE-2025-22866](https://nvd.nist.gov/vuln/detail/CVE-2025-22866) vulnerabilities
* Fixed the [CVE-2025-26519](https://nvd.nist.gov/vuln/detail/CVE-2025-26519) and [CVE-2024-12797](https://nvd.nist.gov/vuln/detail/CVE-2024-12797) vulnerabilities
* Fixed vpatch attacks not being blocked in monitoring mode
* Fixed serialized requests missing response time and length fields
* Fixed chained headers log level from `warn` to `trace`

### 0.12.0 (2025-02-05)

* Added support for response parameters in [API Sessions](../../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../../api-sessions/setup.md#session-grouping) (see detailed [change description](../../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../../user-guides/rules/request-processing.md#gql) (see detailed [change description](../../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions

* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../../user-guides/rules/configure-overlimit-res-detection.md) attacks
* Fixed problem for the `invalid_xml` attack detection in responses
* Fixed an issue where user-overridden headers were being dropped

### 0.11.0 (2025-01-31)

* Added support for the [`WALLARM_APID_ONLY` environment variable](../../installation/native-node/docker-image.md#4-run-the-docker-container) which enables API Discovery-only mode

    In this mode, attacks are blocked locally (if enabled) but not exported to Wallarm Cloud, while [API Discovery](../../api-discovery/overview.md), [API session tracking](../../api-sessions/overview.md), and [security vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) remain fully functional. This mode is rarely needed, in most environments, using this mode is unnecessary.

### 0.10.1 (2025-01-02)

* Added support for sensitive business flows in [API Discovery](../../api-discovery/sbf.md) and [API Sessions](../../api-sessions/exploring.md#sensitive-business-flows)
* Added support for the [Fastly](../../installation/connectors/fastly.md) connector
* Fixed potential request loss at mesh startup
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

### 0.10.0 (2024-12-19)

* Resolved the critical [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) vulnerability and addressed several minor vulnerabilities
* Added URL normalization before selecting route configurations and analyzing data with libproton in `tcp-capture` mode

    This is controlled by the [`middleware.url_normalize`](../../installation/native-node/all-in-one-conf.md#goreplayurl_normalize) parameter (`true` by default).
* Introduced the [`http_inspector.wallarm_process_time_limit`](../../installation/native-node/all-in-one-conf.md#http_inspectorwallarm_process_time_limit) parameter to control request processing time locally

    The default is `1s` unless overridden by Wallarm Console settings.
* Prometheus metrics updates (available in the :9000 port):

    * Removed obsolete metrics with static zero values.
    * Enhanced `http_inspector_requests_processed` and `http_inspector_threats_found` metrics with `anything` allowed to be specified in `source` label values.
    * Added the `http_inspector_adjusted_counters` metric for tracking request and attack counts.

### 0.9.1 (2024-12-10)

* Minor bug fixes

### 0.9.0 (2024-12-04)

* Some fixes for consistent traffic distribution across all aggregation replicas.
* The default endpoint for JSON-formatted `/wallarm-status` metrics has changed to `127.0.0.1:10246` (the `metrics.legacy_status.listen_address` parameter value). This legacy service is critical for Node functionality but does not require direct interaction.
* Minor fixes to increase reliability under diverse deployment conditions.

### 0.8.3 (2024-11-14)

* Added support for Mulesoft connector v3.0.x

### 0.8.2 (2024-11-11)

* Fixed some bugs in the `wallarm-status` service operation

### 0.8.1 (2024-11-06)

* Added support for the [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) connector
* Added support for [API Sessions](../../api-sessions/overview.md)
* [Improved](../what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Changed default values for the following parameters:

    * The [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking) parameter now defaults to `true`, enabling the Native Node's general capability to block incoming requests without manual configuration during deployment.
    * The [`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parameter, which sets the traffic filtration mode, now defaults to `monitoring`, providing an optimal setup for initial deployments.
* Added URL normalization before selecting route configurations and analyzing data with libproton (controlled by the [`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize) parameter which is set to `true` by default)
* Reduced memory usage during node registration
* Some bug fixes

### 0.7.0 (2024-10-16)

* Fixed an issue where some internal service connector headers were not being stripped before processing
* Added support for the mesh feature in `connector-server` mode, enabling consistent request/response routing across multiple node replicas

    This introdcues the new configuration parameters under [`connector.mesh`](../../installation/native-node/all-in-one-conf.md#connectormesh) to configure the mesh functionality.

### 0.6.0 (2024-10-10)

* Initial release
