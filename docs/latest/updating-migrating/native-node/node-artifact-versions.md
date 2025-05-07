# Native Node Artifact Versions and Changelog

This document lists available [versions](../versioning-policy.md) of the [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.14.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

The all-in-one installer for the Native Node is used for [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) and self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Istio](../../installation/connectors/istio-inline.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md) connectors.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to upgrade](all-in-one.md)

### 0.14.0 (2025-04-16)

* Wallarm Node now uses **wstore**, a Wallarm-developed service, instead of Tarantool for local postanalytics processing
* The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins
    
    Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.

## Helm chart

The Helm chart for the Native Node is used for self-hosted node deployments with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md), and [Istio](../../installation/connectors/istio-inline.md) connectors.

[How to upgrade](helm-chart.md)

### 0.14.0 (2025-04-16)

* Wallarm Node now uses **wstore**, a Wallarm-developed service, instead of Tarantool for local postanalytics processing
* All `tarantool` references in `values.yaml` (including container names and parameter keys) have been renamed to `wstore`

    If you override these parameters in your configuration, update their names accordingly.
* The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins
    
    Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.
* Renamed the `container` label to `type` in all Prometheus metrics matching `*_container_*` to prevent conflicts with Kubernetes system labels

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Istio](../../installation/connectors/istio-inline.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md) connectors.

[How to upgrade](docker-image.md)

### 0.14.0 (2025-04-16)

* Wallarm Node now uses **wstore**, a Wallarm-developed service, instead of Tarantool for local postanalytics processing
* The collectd service, previously installed on all filtering nodes, has been removed along with its related plugins
    
    Metrics are now collected and sent using Wallarm's built-in mechanisms, reducing dependencies on external tools.

## Amazon Machine Image (AMI)

<!-- How to upgrade -->

### 0.14.0 (2025-05-07)

* Initial release
