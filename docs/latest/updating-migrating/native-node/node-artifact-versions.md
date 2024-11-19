# Native Node Artifact Versions and Changelog

This document lists available [versions](../versioning-policy.md) of the [Native Wallarm Node](../installation/nginx-native-node-internals.md#native-node) 0.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

The all-in-one installer for the Native Node is used for [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) and self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), and [Cloudflare](../../installation/connectors/cloudflare.md) connectors.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to upgrade](all-in-one.md)

### 0.8.3 (2024-11-14)

* Added support for Mulesoft connector v3.0.x

### 0.8.2 (2024-11-11)

* Fixed some bugs in the `wallarm-status` service operation

### 0.8.1 (2024-11-06)

* Fixed regression in the `request_id` format introduced in 0.8.0

### 0.8.0 (2024-11-06)

* Added support for [API Sessions](../../api-sessions/overview.md)
* [Improved](../what-is-new.md#new-in-limiting-request-processing-time-node-510-and-higher) limiting request processing time
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
* Fixed memory leak on duplicate response headers in [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton)
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

The Helm chart for the Native Node is used for self-hosted node deployments with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md), and [Istio](../../installation/connectors/istio.md) connectors.

[How to upgrade](helm-chart.md)

### 0.8.3 (2024-11-14)

* Added support for Mulesoft connector v3.0.x

### 0.8.2 (2024-11-11)

* Fixed some bugs in the `wallarm-status` service operation

### 0.8.1 (2024-11-07)

* Added support for [API Sessions](../../api-sessions/overview.md)
* [Improved](../what-is-new.md#new-in-limiting-request-processing-time-node-510-and-higher) limiting request processing time
* The [`config.connector.mode`](../../installation/native-node/helm-chart-conf.md#configconnectormode) parameter, which sets the traffic filtration mode, now defaults to `monitoring`, providing an optimal setup for initial deployments
* Reduced memory usage during node registration
* Some bug fixes

### 0.7.0 (2024-10-17)

* Fixed an issue where some internal service connector headers were not being stripped before processing
* Added support for [customizing sensitive data detection](../../api-discovery/setup.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../../user-guides/ip-lists/overview.md) but have [known source](../../user-guides/ip-lists/overview.md#select-object)
* Updated artifact naming from "next" to "native"
    
    `wallarm/wallarm-node-next` → `wallarm/wallarm-node-native`
* Updated the `config.wallarm_node_address` parameter value in the `KongClusterPlugin` Kubernetes resource used to activate the Wallarm Lua plugin:

    `http://next-processing.wallarm-node.svc.cluster.local:5000` → `http://native-processing.wallarm-node.svc.cluster.local:5000`

### 0.5.3 (2024-10-01)

* Initial release

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), and [Cloudflare](../../installation/connectors/cloudflare.md) connectors.

[How to upgrade](docker-image.md)

### 0.8.3 (2024-11-14)

* Added support for Mulesoft connector v3.0.x

### 0.8.2 (2024-11-11)

* Fixed some bugs in the `wallarm-status` service operation

### 0.8.1 (2024-11-06)

* Added support for [API Sessions](../../api-sessions/overview.md)
* [Improved](../what-is-new.md#new-in-limiting-request-processing-time-node-510-and-higher) limiting request processing time
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
