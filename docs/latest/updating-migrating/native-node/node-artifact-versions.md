# Native Node Artifact Versions and Changelog

This document lists available versions of the [native Wallarm node](../../installation/nginx-native-node-internals.md#native-node) 5.0 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## All-in-one installer

The all-in-one installer for the Native Node is used for [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) and self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), and [Cloudflare](../../installation/connectors/cloudflare.md) connectors.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to upgrade](all-in-one.md)

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

### 0.7.0 (2024-10-17)

* Fixed an issue where some internal service connector headers were not being stripped before processing
* Added support for [customizing sensitive data detection](../../api-discovery/setup.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../../user-guides/ip-lists/overview.md) but have [known source](../../user-guides/ip-lists/overview.md#select-object)
* Updated artifact naming from "next" to "native"
    
    `wallarm/wallarm-node-next` → `wallarm/wallarm-node-native`

### 0.5.3 (2024-10-01)

* Initial release

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), and [Cloudflare](../../installation/connectors/cloudflare.md) connectors.

[How to upgrade](docker-image.md)

### 0.7.0 (2024-10-16)

* Fixed an issue where some internal service connector headers were not being stripped before processing
* Added support for the mesh feature in `connector-server` mode, enabling consistent request/response routing across multiple node replicas

    This introdcues the new configuration parameters under [`connector.mesh`](../../installation/native-node/all-in-one-conf.md#connectormesh) to configure the mesh functionality.

### 0.6.0 (2024-10-10)

* Initial release
