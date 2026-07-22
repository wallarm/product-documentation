# Native Node Artifact Versions and Changelog

This document lists available [versions](../versioning-policy.md) of the [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.14.x+ in various form factors, helping you track releases and plan upgrades.

--8<-- "../include/subscribe/changelog-native-node.md"

## All-in-one installer

The all-in-one installer for the Native Node is used for [connectors](../../installation/nginx-native-node-internals.md#connectors_1).

History of all-in-one installer updates simultaneously applies to its x86_64 and ARM64 versions.

[How to upgrade](all-in-one.md)

## Helm chart

The Helm chart for the Native Node is used for self-hosted node deployments with the [connectors](../../installation/nginx-native-node-internals.md#connectors_1).

[How to upgrade](helm-chart.md)

### 0.26.7 (2026-07-22)

* Added [authentication flow detection](../../api-discovery/authentication.md) in API Discovery — automatically identifies authentication methods used by each endpoint and highlights unauthenticated endpoints
* Fixed [API Specification Enforcement](../../api-specification-enforcement/overview.md) not triggering [specification processing overlimit](../../api-specification-enforcement/viewing-events.md#overlimit-events) events for requests exceeding size or time limits
* Updated [Prometheus metrics](../../admin-en/native-node-metrics-gonode.md):

    | Change | Metric |
    |--------|--------|
    | New | `wallarm_gonode_envoy_external_filter_requests_blocked_total` |
    | Changed | Per-host metrics (`*_per_host_total`) — `host` label is now validated, normalized to lowercase; invalid/oversized values bucketed under `__invalid_host__` |
    | Renamed | `…errors_total{type="ResponseBeforeRequest"}` → `…{type="ResponseReadyBeforeRequest"}` |
    | Removed | `wallarm_gonode_http_connector_server_errors_total{type="MsgType"}` |

* Fixed minor stability and reliability issues

## Docker image

The Docker image for the Native Node is used for self-hosted node deployment with the [connectors](../../installation/nginx-native-node-internals.md#connectors_1).

[How to upgrade](docker-image.md)

### 0.26.7 (2026-07-22)

* Added [authentication flow detection](../../api-discovery/authentication.md) in API Discovery — automatically identifies authentication methods used by each endpoint and highlights unauthenticated endpoints
* Fixed [API Specification Enforcement](../../api-specification-enforcement/overview.md) not triggering [specification processing overlimit](../../api-specification-enforcement/viewing-events.md#overlimit-events) events for requests exceeding size or time limits
* Updated [Prometheus metrics](../../admin-en/native-node-metrics-gonode.md):

    | Change | Metric |
    |--------|--------|
    | New | `wallarm_gonode_envoy_external_filter_requests_blocked_total` |
    | Changed | Per-host metrics (`*_per_host_total`) — `host` label is now validated, normalized to lowercase; invalid/oversized values bucketed under `__invalid_host__` |
    | Renamed | `…errors_total{type="ResponseBeforeRequest"}` → `…{type="ResponseReadyBeforeRequest"}` |
    | Removed | `wallarm_gonode_http_connector_server_errors_total{type="MsgType"}` |

* Fixed minor stability and reliability issues

<!-- ## Amazon Machine Image (AMI) -->

<!-- How to upgrade -->
<!-- 
### 0.14.0 (2025-05-07)

* Initial release -->
