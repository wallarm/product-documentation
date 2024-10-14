# Native Node Artifact Versions and Changelog

This document lists available versions of the [native Wallarm node](../../installation/nginx-native-node-internals.md#native-node) 5.0 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## All-in-one installer

The all-in-one installer for the native node is used for [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) and self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), and [Cloudflare](../../installation/connectors/cloudflare.md) connectors.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to upgrade](all-in-one.md)

### 0.5.2 (2024-09-17)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export
* Fixed an issue with the C memory allocator that caused a performance slowdown

### 0.5.1 (2024-09-16)

* Added configurable access log output via [`log.access_log` parameters](../../installation/oob/tcp-traffic-mirror/configuration.md#logaccess_log-version-051-and-above)

### 0.5.0 (2024-09-11)

* Minor technical improvements and optimizations

### 0.4.3 (2024-09-05)

* Fixed an issue causing ~0.1% of data source messages to be silently lost due to a typo

### 0.4.1 (2024-08-27)

* Added support for wildcard matching in the [`route_config.routes.host`](../../installation/oob/tcp-traffic-mirror/configuration.md#host) configuration parameter

### 0.4.0 (2024-08-22)

* [Initial release](../../installation/oob/tcp-traffic-mirror/deployment.md)

## Helm chart

The Helm chart for the native node is used for self-hosted node deployments with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md), and [Istio](../../installation/connectors/istio.md) connectors.

[How to upgrade](helm-chart.md)

### 0.5.3  (2024-10-01)

* Initial release