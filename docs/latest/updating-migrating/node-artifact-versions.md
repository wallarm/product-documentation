# NGINX Node Artifact Versions and Changelog

This document lists available [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 7.x in various form factors, helping you track releases and plan upgrades.

--8<-- "../include/subscribe/changelog-nginx-node.md"

## All-in-one installer

History of all-in-one installer updates simultaneously applies to its x86_64 and ARM64 versions.

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 7.1.3 (2026-08-28)

* Internal improvements

### 7.1.2 (2026-08-20)

* Added support for NGINX stable 1.30.4
* Added support for NGINX mainline 1.31.4
* Fixed a 7.1.1 regression that silently dropped some requests from the export pipeline under burst load — the affected attacks and sessions never reached the Wallarm Cloud
* Bumped Go version to 1.26.7
* Fixed security vulnerabilities:

    * [CVE-2026-39821](https://nvd.nist.gov/vuln/detail/CVE-2026-39821)
    * [CVE-2026-56862](https://nvd.nist.gov/vuln/detail/CVE-2026-56862)
    * [CVE-2026-56859](https://nvd.nist.gov/vuln/detail/CVE-2026-56859)
    * [CVE-2026-56853](https://nvd.nist.gov/vuln/detail/CVE-2026-56853)
    * [CVE-2026-46600](https://nvd.nist.gov/vuln/detail/CVE-2026-46600)
    * [CVE-2026-33818](https://nvd.nist.gov/vuln/detail/CVE-2026-33818)

### 7.1.1 (2026-08-07)

* Fixed the Wallarm NGINX module reporting `ngx_add_event(eventfd) failed` and `epoll_ctl ... Bad file descriptor` errors in the NGINX error log

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

### 7.1.2 (2026-08-20)

* Fixed a 7.1.1 regression that silently dropped some requests from the export pipeline under burst load — the affected attacks and sessions never reached the Wallarm Cloud

### 7.1.1 (2026-08-07)

* Fixed the Wallarm NGINX module reporting `ngx_add_event(eventfd) failed` and `epoll_ctl ... Bad file descriptor` errors in the NGINX error log
* Fixed security vulnerabilities:

    * [GHSA-hrxh-6v49-42gf](https://github.com/advisories/GHSA-hrxh-6v49-42gf)

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

### 7.1.3 (2026-08-28)

* Fixed security vulnerabilities:

    * [CVE-2026-63076](https://nvd.nist.gov/vuln/detail/CVE-2026-63076)
    * [CVE-2026-63075](https://nvd.nist.gov/vuln/detail/CVE-2026-63075)
    * [CVE-2026-63072](https://nvd.nist.gov/vuln/detail/CVE-2026-63072)
    * [CVE-2026-54874](https://nvd.nist.gov/vuln/detail/CVE-2026-54874)
    * [CVE-2026-18798](https://nvd.nist.gov/vuln/detail/CVE-2026-18798)
    * [CVE-2026-14457](https://nvd.nist.gov/vuln/detail/CVE-2026-14457)
    * [CVE-2026-14456](https://nvd.nist.gov/vuln/detail/CVE-2026-14456)
    * [CVE-2026-63074](https://nvd.nist.gov/vuln/detail/CVE-2026-63074)

### 7.1.2 (2026-08-20)

* Fixed a 7.1.1 regression that silently dropped some requests from the export pipeline under burst load — the affected attacks and sessions never reached the Wallarm Cloud
* Bumped Go version to 1.26.7
* Fixed security vulnerabilities:

    * [CVE-2026-39821](https://nvd.nist.gov/vuln/detail/CVE-2026-39821)
    * [CVE-2026-56862](https://nvd.nist.gov/vuln/detail/CVE-2026-56862)
    * [CVE-2026-56859](https://nvd.nist.gov/vuln/detail/CVE-2026-56859)
    * [CVE-2026-56853](https://nvd.nist.gov/vuln/detail/CVE-2026-56853)
    * [CVE-2026-46600](https://nvd.nist.gov/vuln/detail/CVE-2026-46600)
    * [CVE-2026-33818](https://nvd.nist.gov/vuln/detail/CVE-2026-33818)

### 7.1.1 (2026-08-07)

* Fixed the Wallarm NGINX module reporting `ngx_add_event(eventfd) failed` and `epoll_ctl ... Bad file descriptor` errors in the NGINX error log

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

### 7.1.3 (2026-08-28)

* Internal improvements

### 7.1.2 (2026-08-20)

* Fixed a 7.1.1 regression that silently dropped some requests from the export pipeline under burst load — the affected attacks and sessions never reached the Wallarm Cloud
* Bumped Go version to 1.26.7
* Fixed security vulnerabilities:

    * [CVE-2026-39821](https://nvd.nist.gov/vuln/detail/CVE-2026-39821)
    * [CVE-2026-56862](https://nvd.nist.gov/vuln/detail/CVE-2026-56862)
    * [CVE-2026-56859](https://nvd.nist.gov/vuln/detail/CVE-2026-56859)
    * [CVE-2026-56853](https://nvd.nist.gov/vuln/detail/CVE-2026-56853)
    * [CVE-2026-46600](https://nvd.nist.gov/vuln/detail/CVE-2026-46600)
    * [CVE-2026-33818](https://nvd.nist.gov/vuln/detail/CVE-2026-33818)

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

### wallarm-node-7-1-3-20260827-223907 (2026-08-27)

* Internal improvements

### wallarm-node-7-1-2-20260820-142512 (2026-08-20)

* Fixed a 7.1.1 regression that silently dropped some requests from the export pipeline under burst load — the affected attacks and sessions never reached the Wallarm Cloud
* Bumped Go version to 1.26.7
* Fixed security vulnerabilities:

    * [CVE-2026-39821](https://nvd.nist.gov/vuln/detail/CVE-2026-39821)
    * [CVE-2026-56862](https://nvd.nist.gov/vuln/detail/CVE-2026-56862)
    * [CVE-2026-56859](https://nvd.nist.gov/vuln/detail/CVE-2026-56859)
    * [CVE-2026-56853](https://nvd.nist.gov/vuln/detail/CVE-2026-56853)
    * [CVE-2026-46600](https://nvd.nist.gov/vuln/detail/CVE-2026-46600)
    * [CVE-2026-33818](https://nvd.nist.gov/vuln/detail/CVE-2026-33818)

### wallarm-node-7-1-1-20260807-170213 (2026-08-07)

* Fixed the Wallarm NGINX module reporting `ngx_add_event(eventfd) failed` and `epoll_ctl ... Bad file descriptor` errors in the NGINX error log

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
