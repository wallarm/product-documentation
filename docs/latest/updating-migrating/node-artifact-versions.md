# NGINX Node Artifact Versions and Changelog

This document lists available [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 7.x in various form factors, helping you track releases and plan upgrades.

--8<-- "../include/subscribe/changelog-nginx-node.md"

## All-in-one installer

History of all-in-one installer updates simultaneously applies to its x86_64 and ARM64 versions.

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 7.1.0 (2026-07-21)

* Added the ability for the node to [start when the Wallarm Cloud is temporarily unavailable](../faq/wallarm-cloud-down.md#can-a-wallarm-node-start-while-the-cloud-is-down)
* Exposed Prometheus metrics on a [single aggregated endpoint](../admin-en/nginx-node-metrics.md), `http://127.0.0.1:9445/metrics` — the recommended endpoint for scraping
* Added [`wallarm_wd_*` node process metrics](../admin-en/wd-metrics.md) on port `9445`, covering managed-process state, restarts, and uptime
* Added node [readiness and liveness endpoints](../admin-en/nginx-node-metrics.md#health-endpoints) (`/ready` and `/health` on port `9446`) for orchestrator health probes, endpoints are exposed by default
* Removed the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` [postanalytics metrics](../admin-en/wstore-metrics.md)
* Changed node process management — the `supervisord` process manager is replaced by the Go-based `wd` (Wallarm Daemon) service
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed the installer reporting spurious "NGINX binary is not officially supported" errors for custom NGINX builds run with `--custom-ngx-build`
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

[Read more](what-is-new.md)

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 7.1.0 (2026-07-21)

* Based on F5 NGINX Ingress Controller `5.5.4` upstream
* Updated the bundled NGINX to stable `1.31.x`
* Added support for cookie-based sticky sessions, provided by the F5 NGINX Ingress Controller upstream
* Added the ability for the node to [start even when the Wallarm Cloud is temporarily unavailable](../faq/wallarm-cloud-down.md#can-a-wallarm-node-start-while-the-cloud-is-down)
* Added node [readiness and liveness endpoints](../admin-en/nginx-node-metrics.md#health-endpoints) (`/ready` and `/health` on port `9446`) for orchestrator health probes — the node reports ready only after initialization completes
* Added [`wallarm_wd_*` node process metrics](../admin-en/wd-metrics.md) on port `9445`, covering managed-process state, restarts, and uptime
* Changed node process management — the `supervisord` process manager is replaced by the Go-based `wd` (Wallarm Daemon) service
* Removed the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` [postanalytics metrics](../admin-en/wstore-metrics.md)
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

[Read more](what-is-new.md)

### 7.0.0 (2026-02-16)

7.0.0 rebuilds the Ingress Controller on the F5 NGINX Ingress Controller. See [What is New in NGINX Node 7.x](what-is-new.md#wallarm-ingress-controller-f5-based) for the full overview and migration guidance.

<!-- ## Helm chart for Sidecar

[How to upgrade](sidecar-proxy.md)

### 7.1.0 (2026-07-21)

* Added the ability for the node to [start even when the Wallarm Cloud is temporarily unavailable](../faq/wallarm-cloud-down.md#can-a-wallarm-node-start-while-the-cloud-is-down)
* Added node [readiness and liveness endpoints](../admin-en/nginx-node-metrics.md#health-endpoints) (`/ready` and `/health` on port `9446`) for orchestrator health probes — the node reports ready only after initialization completes
* Added [`wallarm_wd_*` node process metrics](../admin-en/wd-metrics.md) on port `9445`, covering managed-process state, restarts, and uptime
* Changed node process management — the `supervisord` process manager is replaced by the Go-based `wd` (Wallarm Daemon) service
* Removed the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` [postanalytics metrics](../admin-en/wstore-metrics.md)
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814) -->

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 7.1.0 (2026-07-21)

* Removed the `appstructure` component (the [API Discovery](../api-discovery/overview.md) module), including its `appstructure-out.log` log
* Added the ability for the node to [start even when the Wallarm Cloud is temporarily unavailable](../faq/wallarm-cloud-down.md#can-a-wallarm-node-start-while-the-cloud-is-down)
* Added node [readiness and liveness endpoints](../admin-en/nginx-node-metrics.md#health-endpoints) (`/ready` and `/health` on port `9446`) for orchestrator health probes — the node reports ready only after initialization completes
* Added [`wallarm_wd_*` node process metrics](../admin-en/wd-metrics.md) on port `9445`, covering managed-process state, restarts, and uptime
* Changed node process management — the `supervisord` process manager is replaced by the Go-based `wd` (Wallarm Daemon) service
* Removed the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` [postanalytics metrics](../admin-en/wstore-metrics.md)
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

[Read more](what-is-new.md)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 7.1.0 (2026-07-21)

* Added the ability for the node to [start even when the Wallarm Cloud is temporarily unavailable](../faq/wallarm-cloud-down.md#can-a-wallarm-node-start-while-the-cloud-is-down)
* Added node [readiness and liveness endpoints](../admin-en/nginx-node-metrics.md#health-endpoints) (`/ready` and `/health` on port `9446`) for orchestrator health probes — the node reports ready only after initialization completes
* Added [`wallarm_wd_*` node process metrics](../admin-en/wd-metrics.md) on port `9445`, covering managed-process state, restarts, and uptime
* Changed node process management — the `supervisord` process manager is replaced by the Go-based `wd` (Wallarm Daemon) service
* Removed the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` [postanalytics metrics](../admin-en/wstore-metrics.md)
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

[Read more](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-7-1-0-20260722-105251 (2026-07-22)

* Added the ability for the node to [start even when the Wallarm Cloud is temporarily unavailable](../faq/wallarm-cloud-down.md#can-a-wallarm-node-start-while-the-cloud-is-down)
* Added node [readiness and liveness endpoints](../admin-en/nginx-node-metrics.md#health-endpoints) (`/ready` and `/health` on port `9446`) for orchestrator health probes — the node reports ready only after initialization completes
* Added [`wallarm_wd_*` node process metrics](../admin-en/wd-metrics.md) on port `9445`, covering managed-process state, restarts, and uptime
* Changed node process management — the `supervisord` process manager is replaced by the Go-based `wd` (Wallarm Daemon) service
* Removed the `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` [postanalytics metrics](../admin-en/wstore-metrics.md)
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)
