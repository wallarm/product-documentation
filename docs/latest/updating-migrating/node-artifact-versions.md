# NGINX Node Artifact Versions and Changelog

This document lists available [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 7.x in various form factors, helping you track releases and plan upgrades.

--8<-- "../include/subscribe/changelog-nginx-node.md"

## All-in-one installer

History of all-in-one installer updates simultaneously applies to its x86_64 and ARM64 versions.

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 7.1.6 (2026-10-26)

* Removed the distrusted eMudhra emSign root certificates (emSign Root CA - C1, emSign ECC Root CA - C3, and emSign ECC Root CA - G3) from the Node's bundled CA certificate store
* Added support for the latest distribution NGINX 1.30.6 packages

### 7.1.5 (2026-10-23)

* Added support for NGINX stable 1.30.6
* Added support for NGINX mainline 1.31.7 and 1.31.8
* Bumped Go version to 1.26.9
* Fixed security vulnerabilities:

    * [CVE-2026-56851](https://nvd.nist.gov/vuln/detail/CVE-2026-56851)
    * [CVE-2026-78667](https://nvd.nist.gov/vuln/detail/CVE-2026-78667)
    * [CVE-2026-78669](https://nvd.nist.gov/vuln/detail/CVE-2026-78669)
    * [CVE-2026-97031](https://nvd.nist.gov/vuln/detail/CVE-2026-97031)
    * [CVE-2026-56866](https://nvd.nist.gov/vuln/detail/CVE-2026-56866)
    * [CVE-2026-78659](https://nvd.nist.gov/vuln/detail/CVE-2026-78659)
    * [CVE-2026-78660](https://nvd.nist.gov/vuln/detail/CVE-2026-78660)
    * [CVE-2026-78663](https://nvd.nist.gov/vuln/detail/CVE-2026-78663)
    * [CVE-2026-94439](https://nvd.nist.gov/vuln/detail/CVE-2026-94439)
    * [CVE-2026-94440](https://nvd.nist.gov/vuln/detail/CVE-2026-94440)
    * [CVE-2026-94448](https://nvd.nist.gov/vuln/detail/CVE-2026-94448)
    * [CVE-2026-97030](https://nvd.nist.gov/vuln/detail/CVE-2026-97030)
    * [CVE-2026-97032](https://nvd.nist.gov/vuln/detail/CVE-2026-97032)

### 7.1.4 (2026-10-01)

* Added support for NGINX stable 1.30.5
* Added support for NGINX mainline 1.31.5 and 1.31.6
* Added support for the latest distribution NGINX packages
* Fixed the per-message processing time limit for long-lived streams (WebSocket, gRPC)
* Removed Debian 11 from the test suite as it reached end of life
* Bumped Go version to 1.26.8
* Fixed security vulnerabilities:

    * [CVE-2026-56854](https://nvd.nist.gov/vuln/detail/CVE-2026-56854)
    * [CVE-2026-56855](https://nvd.nist.gov/vuln/detail/CVE-2026-56855)
    * [CVE-2026-61625](https://nvd.nist.gov/vuln/detail/CVE-2026-61625)
    * [CVE-2026-78662](https://nvd.nist.gov/vuln/detail/CVE-2026-78662)

### 7.1.3 (2026-08-28)

* Released for version parity with the Docker image and Helm chart; no changes to the installer itself

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

### 7.1.6 (2026-10-26)

* Removed the distrusted eMudhra emSign root certificates (emSign Root CA - C1, emSign ECC Root CA - C3, and emSign ECC Root CA - G3) from the Node's bundled CA certificate store

### 7.1.5 (2026-10-26)

* Fixed the per-message processing time limit for long-lived streams (WebSocket, gRPC)
* Fixed security vulnerabilities:

    * [CVE-2026-103111](https://nvd.nist.gov/vuln/detail/CVE-2026-103111)
    * [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497)
    * [CVE-2026-4775](https://nvd.nist.gov/vuln/detail/CVE-2026-4775)
    * [CVE-2026-53612](https://nvd.nist.gov/vuln/detail/CVE-2026-53612)
    * [CVE-2026-53613](https://nvd.nist.gov/vuln/detail/CVE-2026-53613)
    * [CVE-2026-53614](https://nvd.nist.gov/vuln/detail/CVE-2026-53614)
    * [CVE-2026-56851](https://nvd.nist.gov/vuln/detail/CVE-2026-56851)
    * [CVE-2026-56854](https://nvd.nist.gov/vuln/detail/CVE-2026-56854)
    * [CVE-2026-66046](https://nvd.nist.gov/vuln/detail/CVE-2026-66046)
    * [CVE-2026-76641](https://nvd.nist.gov/vuln/detail/CVE-2026-76641)
    * [CVE-2026-76642](https://nvd.nist.gov/vuln/detail/CVE-2026-76642)
    * [CVE-2026-76956](https://nvd.nist.gov/vuln/detail/CVE-2026-76956)
    * [CVE-2026-76957](https://nvd.nist.gov/vuln/detail/CVE-2026-76957)
    * [CVE-2026-77214](https://nvd.nist.gov/vuln/detail/CVE-2026-77214)
    * [CVE-2026-78408](https://nvd.nist.gov/vuln/detail/CVE-2026-78408)
    * [CVE-2026-78409](https://nvd.nist.gov/vuln/detail/CVE-2026-78409)
    * [CVE-2026-78410](https://nvd.nist.gov/vuln/detail/CVE-2026-78410)
    * [CVE-2026-78667](https://nvd.nist.gov/vuln/detail/CVE-2026-78667)
    * [CVE-2026-78669](https://nvd.nist.gov/vuln/detail/CVE-2026-78669)
    * [CVE-2026-84304](https://nvd.nist.gov/vuln/detail/CVE-2026-84304)
    * [CVE-2026-84445](https://nvd.nist.gov/vuln/detail/CVE-2026-84445)
    * [CVE-2026-86145](https://nvd.nist.gov/vuln/detail/CVE-2026-86145)
    * [CVE-2026-88806](https://nvd.nist.gov/vuln/detail/CVE-2026-88806)
    * [CVE-2026-89157](https://nvd.nist.gov/vuln/detail/CVE-2026-89157)
    * [CVE-2026-89161](https://nvd.nist.gov/vuln/detail/CVE-2026-89161)
    * [CVE-2026-92392](https://nvd.nist.gov/vuln/detail/CVE-2026-92392)
    * [CVE-2026-93990](https://nvd.nist.gov/vuln/detail/CVE-2026-93990)
    * [CVE-2026-97031](https://nvd.nist.gov/vuln/detail/CVE-2026-97031)
    * [CVE-2026-102633](https://nvd.nist.gov/vuln/detail/CVE-2026-102633)
    * [CVE-2026-19931](https://nvd.nist.gov/vuln/detail/CVE-2026-19931)
    * [CVE-2026-27456](https://nvd.nist.gov/vuln/detail/CVE-2026-27456)
    * [CVE-2026-46675](https://nvd.nist.gov/vuln/detail/CVE-2026-46675)
    * [CVE-2026-56855](https://nvd.nist.gov/vuln/detail/CVE-2026-56855)
    * [CVE-2026-56866](https://nvd.nist.gov/vuln/detail/CVE-2026-56866)
    * [CVE-2026-58055](https://nvd.nist.gov/vuln/detail/CVE-2026-58055)
    * [CVE-2026-61625](https://nvd.nist.gov/vuln/detail/CVE-2026-61625)
    * [CVE-2026-78659](https://nvd.nist.gov/vuln/detail/CVE-2026-78659)
    * [CVE-2026-78660](https://nvd.nist.gov/vuln/detail/CVE-2026-78660)
    * [CVE-2026-78662](https://nvd.nist.gov/vuln/detail/CVE-2026-78662)
    * [CVE-2026-78663](https://nvd.nist.gov/vuln/detail/CVE-2026-78663)
    * [CVE-2026-82208](https://nvd.nist.gov/vuln/detail/CVE-2026-82208)
    * [CVE-2026-84303](https://nvd.nist.gov/vuln/detail/CVE-2026-84303)
    * [CVE-2026-85091](https://nvd.nist.gov/vuln/detail/CVE-2026-85091)
    * [CVE-2026-89156](https://nvd.nist.gov/vuln/detail/CVE-2026-89156)
    * [CVE-2026-89158](https://nvd.nist.gov/vuln/detail/CVE-2026-89158)
    * [CVE-2026-89160](https://nvd.nist.gov/vuln/detail/CVE-2026-89160)
    * [CVE-2026-92388](https://nvd.nist.gov/vuln/detail/CVE-2026-92388)
    * [CVE-2026-94283](https://nvd.nist.gov/vuln/detail/CVE-2026-94283)
    * [CVE-2026-94284](https://nvd.nist.gov/vuln/detail/CVE-2026-94284)
    * [CVE-2026-94285](https://nvd.nist.gov/vuln/detail/CVE-2026-94285)
    * [CVE-2026-94287](https://nvd.nist.gov/vuln/detail/CVE-2026-94287)
    * [CVE-2026-94439](https://nvd.nist.gov/vuln/detail/CVE-2026-94439)
    * [CVE-2026-94440](https://nvd.nist.gov/vuln/detail/CVE-2026-94440)
    * [CVE-2026-94448](https://nvd.nist.gov/vuln/detail/CVE-2026-94448)
    * [CVE-2026-97030](https://nvd.nist.gov/vuln/detail/CVE-2026-97030)
    * [CVE-2026-97032](https://nvd.nist.gov/vuln/detail/CVE-2026-97032)
    * [GHSA-gcjh-h69q-9w9g](https://github.com/advisories/GHSA-gcjh-h69q-9w9g)

### 7.1.3 (2026-08-28)

* Fixed security vulnerabilities:

    * [CVE-2026-14456](https://nvd.nist.gov/vuln/detail/CVE-2026-14456)
    * [CVE-2026-33818](https://nvd.nist.gov/vuln/detail/CVE-2026-33818)
    * [CVE-2026-39821](https://nvd.nist.gov/vuln/detail/CVE-2026-39821)
    * [CVE-2026-46600](https://nvd.nist.gov/vuln/detail/CVE-2026-46600)
    * [CVE-2026-56853](https://nvd.nist.gov/vuln/detail/CVE-2026-56853)
    * [CVE-2026-56858](https://nvd.nist.gov/vuln/detail/CVE-2026-56858)
    * [CVE-2026-56859](https://nvd.nist.gov/vuln/detail/CVE-2026-56859)
    * [CVE-2026-56860](https://nvd.nist.gov/vuln/detail/CVE-2026-56860)
    * [CVE-2026-56862](https://nvd.nist.gov/vuln/detail/CVE-2026-56862)
    * [CVE-2026-18798](https://nvd.nist.gov/vuln/detail/CVE-2026-18798)
    * [CVE-2026-63072](https://nvd.nist.gov/vuln/detail/CVE-2026-63072)
    * [CVE-2026-63076](https://nvd.nist.gov/vuln/detail/CVE-2026-63076)

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

### 7.1.6 (2026-10-26)

* Removed the distrusted eMudhra emSign root certificates (emSign Root CA - C1, emSign ECC Root CA - C3, and emSign ECC Root CA - G3) from the Node's bundled CA certificate store

### 7.1.5 (2026-10-23)

* Fixed the per-message processing time limit for long-lived streams (WebSocket, gRPC)
* Bumped Go version to 1.26.9
* Fixed security vulnerabilities:

    * [CVE-2026-103111](https://nvd.nist.gov/vuln/detail/CVE-2026-103111)
    * [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497)
    * [CVE-2026-4775](https://nvd.nist.gov/vuln/detail/CVE-2026-4775)
    * [CVE-2026-53612](https://nvd.nist.gov/vuln/detail/CVE-2026-53612)
    * [CVE-2026-53613](https://nvd.nist.gov/vuln/detail/CVE-2026-53613)
    * [CVE-2026-53614](https://nvd.nist.gov/vuln/detail/CVE-2026-53614)
    * [CVE-2026-56851](https://nvd.nist.gov/vuln/detail/CVE-2026-56851)
    * [CVE-2026-56854](https://nvd.nist.gov/vuln/detail/CVE-2026-56854)
    * [CVE-2026-66046](https://nvd.nist.gov/vuln/detail/CVE-2026-66046)
    * [CVE-2026-76641](https://nvd.nist.gov/vuln/detail/CVE-2026-76641)
    * [CVE-2026-76642](https://nvd.nist.gov/vuln/detail/CVE-2026-76642)
    * [CVE-2026-76956](https://nvd.nist.gov/vuln/detail/CVE-2026-76956)
    * [CVE-2026-76957](https://nvd.nist.gov/vuln/detail/CVE-2026-76957)
    * [CVE-2026-77214](https://nvd.nist.gov/vuln/detail/CVE-2026-77214)
    * [CVE-2026-78408](https://nvd.nist.gov/vuln/detail/CVE-2026-78408)
    * [CVE-2026-78410](https://nvd.nist.gov/vuln/detail/CVE-2026-78410)
    * [CVE-2026-78667](https://nvd.nist.gov/vuln/detail/CVE-2026-78667)
    * [CVE-2026-78669](https://nvd.nist.gov/vuln/detail/CVE-2026-78669)
    * [CVE-2026-86145](https://nvd.nist.gov/vuln/detail/CVE-2026-86145)
    * [CVE-2026-89157](https://nvd.nist.gov/vuln/detail/CVE-2026-89157)
    * [CVE-2026-89161](https://nvd.nist.gov/vuln/detail/CVE-2026-89161)
    * [CVE-2026-93990](https://nvd.nist.gov/vuln/detail/CVE-2026-93990)
    * [CVE-2026-97031](https://nvd.nist.gov/vuln/detail/CVE-2026-97031)
    * [CVE-2026-102633](https://nvd.nist.gov/vuln/detail/CVE-2026-102633)
    * [CVE-2026-46675](https://nvd.nist.gov/vuln/detail/CVE-2026-46675)
    * [CVE-2026-56855](https://nvd.nist.gov/vuln/detail/CVE-2026-56855)
    * [CVE-2026-56866](https://nvd.nist.gov/vuln/detail/CVE-2026-56866)
    * [CVE-2026-61625](https://nvd.nist.gov/vuln/detail/CVE-2026-61625)
    * [CVE-2026-78659](https://nvd.nist.gov/vuln/detail/CVE-2026-78659)
    * [CVE-2026-78660](https://nvd.nist.gov/vuln/detail/CVE-2026-78660)
    * [CVE-2026-78662](https://nvd.nist.gov/vuln/detail/CVE-2026-78662)
    * [CVE-2026-78663](https://nvd.nist.gov/vuln/detail/CVE-2026-78663)
    * [CVE-2026-85091](https://nvd.nist.gov/vuln/detail/CVE-2026-85091)
    * [CVE-2026-89156](https://nvd.nist.gov/vuln/detail/CVE-2026-89156)
    * [CVE-2026-89158](https://nvd.nist.gov/vuln/detail/CVE-2026-89158)
    * [CVE-2026-89160](https://nvd.nist.gov/vuln/detail/CVE-2026-89160)
    * [CVE-2026-94439](https://nvd.nist.gov/vuln/detail/CVE-2026-94439)
    * [CVE-2026-94440](https://nvd.nist.gov/vuln/detail/CVE-2026-94440)
    * [CVE-2026-94448](https://nvd.nist.gov/vuln/detail/CVE-2026-94448)
    * [CVE-2026-97030](https://nvd.nist.gov/vuln/detail/CVE-2026-97030)
    * [CVE-2026-97032](https://nvd.nist.gov/vuln/detail/CVE-2026-97032)

### 7.1.3 (2026-08-28)

* Fixed security vulnerabilities:

    * [CVE-2026-14456](https://nvd.nist.gov/vuln/detail/CVE-2026-14456)
    * [CVE-2026-18798](https://nvd.nist.gov/vuln/detail/CVE-2026-18798)
    * [CVE-2026-63072](https://nvd.nist.gov/vuln/detail/CVE-2026-63072)
    * [CVE-2026-63076](https://nvd.nist.gov/vuln/detail/CVE-2026-63076)

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

### 7.1.6 (2026-10-26)

* Removed the distrusted eMudhra emSign root certificates (emSign Root CA - C1, emSign ECC Root CA - C3, and emSign ECC Root CA - G3) from the Node's bundled CA certificate store

### 7.1.5 (2026-10-23)

* Bumped Go version to 1.26.9
* Fixed security vulnerabilities:

    * [CVE-2026-103111](https://nvd.nist.gov/vuln/detail/CVE-2026-103111)
    * [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497)
    * [CVE-2026-4775](https://nvd.nist.gov/vuln/detail/CVE-2026-4775)
    * [CVE-2026-53612](https://nvd.nist.gov/vuln/detail/CVE-2026-53612)
    * [CVE-2026-53613](https://nvd.nist.gov/vuln/detail/CVE-2026-53613)
    * [CVE-2026-53614](https://nvd.nist.gov/vuln/detail/CVE-2026-53614)
    * [CVE-2026-56851](https://nvd.nist.gov/vuln/detail/CVE-2026-56851)
    * [CVE-2026-66046](https://nvd.nist.gov/vuln/detail/CVE-2026-66046)
    * [CVE-2026-76641](https://nvd.nist.gov/vuln/detail/CVE-2026-76641)
    * [CVE-2026-76642](https://nvd.nist.gov/vuln/detail/CVE-2026-76642)
    * [CVE-2026-76956](https://nvd.nist.gov/vuln/detail/CVE-2026-76956)
    * [CVE-2026-76957](https://nvd.nist.gov/vuln/detail/CVE-2026-76957)
    * [CVE-2026-77214](https://nvd.nist.gov/vuln/detail/CVE-2026-77214)
    * [CVE-2026-78408](https://nvd.nist.gov/vuln/detail/CVE-2026-78408)
    * [CVE-2026-78410](https://nvd.nist.gov/vuln/detail/CVE-2026-78410)
    * [CVE-2026-78667](https://nvd.nist.gov/vuln/detail/CVE-2026-78667)
    * [CVE-2026-78669](https://nvd.nist.gov/vuln/detail/CVE-2026-78669)
    * [CVE-2026-86145](https://nvd.nist.gov/vuln/detail/CVE-2026-86145)
    * [CVE-2026-89157](https://nvd.nist.gov/vuln/detail/CVE-2026-89157)
    * [CVE-2026-89161](https://nvd.nist.gov/vuln/detail/CVE-2026-89161)
    * [CVE-2026-93990](https://nvd.nist.gov/vuln/detail/CVE-2026-93990)
    * [CVE-2026-97031](https://nvd.nist.gov/vuln/detail/CVE-2026-97031)
    * [CVE-2026-102633](https://nvd.nist.gov/vuln/detail/CVE-2026-102633)
    * [CVE-2026-46675](https://nvd.nist.gov/vuln/detail/CVE-2026-46675)
    * [CVE-2026-56866](https://nvd.nist.gov/vuln/detail/CVE-2026-56866)
    * [CVE-2026-78659](https://nvd.nist.gov/vuln/detail/CVE-2026-78659)
    * [CVE-2026-78660](https://nvd.nist.gov/vuln/detail/CVE-2026-78660)
    * [CVE-2026-78663](https://nvd.nist.gov/vuln/detail/CVE-2026-78663)
    * [CVE-2026-85091](https://nvd.nist.gov/vuln/detail/CVE-2026-85091)
    * [CVE-2026-89156](https://nvd.nist.gov/vuln/detail/CVE-2026-89156)
    * [CVE-2026-89158](https://nvd.nist.gov/vuln/detail/CVE-2026-89158)
    * [CVE-2026-89160](https://nvd.nist.gov/vuln/detail/CVE-2026-89160)
    * [CVE-2026-94439](https://nvd.nist.gov/vuln/detail/CVE-2026-94439)
    * [CVE-2026-94440](https://nvd.nist.gov/vuln/detail/CVE-2026-94440)
    * [CVE-2026-94448](https://nvd.nist.gov/vuln/detail/CVE-2026-94448)
    * [CVE-2026-97030](https://nvd.nist.gov/vuln/detail/CVE-2026-97030)
    * [CVE-2026-97032](https://nvd.nist.gov/vuln/detail/CVE-2026-97032)

### 7.1.4 (2026-10-01)

* Fixed the per-message processing time limit for long-lived streams (WebSocket, gRPC)
* Bumped Go version to 1.26.8
* Fixed security vulnerabilities:

    * [CVE-2026-56854](https://nvd.nist.gov/vuln/detail/CVE-2026-56854)
    * [CVE-2026-56855](https://nvd.nist.gov/vuln/detail/CVE-2026-56855)
    * [CVE-2026-61625](https://nvd.nist.gov/vuln/detail/CVE-2026-61625)
    * [CVE-2026-78662](https://nvd.nist.gov/vuln/detail/CVE-2026-78662)

### 7.1.3 (2026-08-28)

* Fixed security vulnerabilities:

    * [CVE-2026-14456](https://nvd.nist.gov/vuln/detail/CVE-2026-14456)
    * [CVE-2026-18798](https://nvd.nist.gov/vuln/detail/CVE-2026-18798)
    * [CVE-2026-63072](https://nvd.nist.gov/vuln/detail/CVE-2026-63072)
    * [CVE-2026-63076](https://nvd.nist.gov/vuln/detail/CVE-2026-63076)

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

### wallarm-node-7-1-6-20261026-123400 (2026-10-26)

* Removed the distrusted eMudhra emSign root certificates (emSign Root CA - C1, emSign ECC Root CA - C3, and emSign ECC Root CA - G3) from the Node's bundled CA certificate store

### wallarm-node-7-1-5-20261023-145432 (2026-10-23)

* Bumped Go version to 1.26.9
* Fixed security vulnerabilities:

    * [CVE-2026-103111](https://nvd.nist.gov/vuln/detail/CVE-2026-103111)
    * [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497)
    * [CVE-2026-4775](https://nvd.nist.gov/vuln/detail/CVE-2026-4775)
    * [CVE-2026-53612](https://nvd.nist.gov/vuln/detail/CVE-2026-53612)
    * [CVE-2026-53613](https://nvd.nist.gov/vuln/detail/CVE-2026-53613)
    * [CVE-2026-53614](https://nvd.nist.gov/vuln/detail/CVE-2026-53614)
    * [CVE-2026-56851](https://nvd.nist.gov/vuln/detail/CVE-2026-56851)
    * [CVE-2026-66046](https://nvd.nist.gov/vuln/detail/CVE-2026-66046)
    * [CVE-2026-76641](https://nvd.nist.gov/vuln/detail/CVE-2026-76641)
    * [CVE-2026-76642](https://nvd.nist.gov/vuln/detail/CVE-2026-76642)
    * [CVE-2026-76956](https://nvd.nist.gov/vuln/detail/CVE-2026-76956)
    * [CVE-2026-76957](https://nvd.nist.gov/vuln/detail/CVE-2026-76957)
    * [CVE-2026-77214](https://nvd.nist.gov/vuln/detail/CVE-2026-77214)
    * [CVE-2026-78408](https://nvd.nist.gov/vuln/detail/CVE-2026-78408)
    * [CVE-2026-78410](https://nvd.nist.gov/vuln/detail/CVE-2026-78410)
    * [CVE-2026-78667](https://nvd.nist.gov/vuln/detail/CVE-2026-78667)
    * [CVE-2026-78669](https://nvd.nist.gov/vuln/detail/CVE-2026-78669)
    * [CVE-2026-86145](https://nvd.nist.gov/vuln/detail/CVE-2026-86145)
    * [CVE-2026-89157](https://nvd.nist.gov/vuln/detail/CVE-2026-89157)
    * [CVE-2026-89161](https://nvd.nist.gov/vuln/detail/CVE-2026-89161)
    * [CVE-2026-93990](https://nvd.nist.gov/vuln/detail/CVE-2026-93990)
    * [CVE-2026-97031](https://nvd.nist.gov/vuln/detail/CVE-2026-97031)
    * [CVE-2026-102633](https://nvd.nist.gov/vuln/detail/CVE-2026-102633)
    * [CVE-2026-46675](https://nvd.nist.gov/vuln/detail/CVE-2026-46675)
    * [CVE-2026-56866](https://nvd.nist.gov/vuln/detail/CVE-2026-56866)
    * [CVE-2026-78659](https://nvd.nist.gov/vuln/detail/CVE-2026-78659)
    * [CVE-2026-78660](https://nvd.nist.gov/vuln/detail/CVE-2026-78660)
    * [CVE-2026-78663](https://nvd.nist.gov/vuln/detail/CVE-2026-78663)
    * [CVE-2026-85091](https://nvd.nist.gov/vuln/detail/CVE-2026-85091)
    * [CVE-2026-89156](https://nvd.nist.gov/vuln/detail/CVE-2026-89156)
    * [CVE-2026-89158](https://nvd.nist.gov/vuln/detail/CVE-2026-89158)
    * [CVE-2026-89160](https://nvd.nist.gov/vuln/detail/CVE-2026-89160)
    * [CVE-2026-94439](https://nvd.nist.gov/vuln/detail/CVE-2026-94439)
    * [CVE-2026-94440](https://nvd.nist.gov/vuln/detail/CVE-2026-94440)
    * [CVE-2026-94448](https://nvd.nist.gov/vuln/detail/CVE-2026-94448)
    * [CVE-2026-97030](https://nvd.nist.gov/vuln/detail/CVE-2026-97030)
    * [CVE-2026-97032](https://nvd.nist.gov/vuln/detail/CVE-2026-97032)

### wallarm-node-7-1-4-20261001-133154 (2026-10-01)

* Fixed the per-message processing time limit for long-lived streams (WebSocket, gRPC)
* Bumped Go version to 1.26.8
* Fixed security vulnerabilities:

    * [CVE-2026-56854](https://nvd.nist.gov/vuln/detail/CVE-2026-56854)
    * [CVE-2026-56855](https://nvd.nist.gov/vuln/detail/CVE-2026-56855)
    * [CVE-2026-61625](https://nvd.nist.gov/vuln/detail/CVE-2026-61625)
    * [CVE-2026-78662](https://nvd.nist.gov/vuln/detail/CVE-2026-78662)

### wallarm-node-7-1-3-20260827-223907 (2026-08-27)

* Fixed security vulnerabilities:

    * [CVE-2026-14456](https://nvd.nist.gov/vuln/detail/CVE-2026-14456)
    * [CVE-2026-18798](https://nvd.nist.gov/vuln/detail/CVE-2026-18798)
    * [CVE-2026-63072](https://nvd.nist.gov/vuln/detail/CVE-2026-63072)
    * [CVE-2026-63076](https://nvd.nist.gov/vuln/detail/CVE-2026-63076)

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
