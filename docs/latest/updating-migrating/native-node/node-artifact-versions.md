# Native Node Artifact Versions and Changelog

This document lists available [versions](../versioning-policy.md) of the [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

The all-in-one installer for the Native Node is used for [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) and self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md) connectors.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to upgrade](all-in-one.md)

### 0.4.0 (2024-08-22)

* [Initial release](../../installation/oob/tcp-traffic-mirror/deployment.md)

## Helm chart

The Helm chart for the Native Node is used for self-hosted node deployments with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md), and [Istio](../../installation/connectors/istio.md) connectors.

[How to upgrade](helm-chart.md)

### 0.5.3 (2024-10-01)

* Initial release

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md) connectors.

[How to upgrade](docker-image.md)

### 0.6.0 (2024-10-10)

* Initial release
