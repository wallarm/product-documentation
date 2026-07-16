# NGINX Node Artifact Versions and Changelog

This document lists available [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 7.x in various form factors, helping you track releases and plan upgrades.

--8<-- "../include/subscribe/changelog-nginx-node.md"

## All-in-one installer

History of all-in-one installer updates simultaneously applies to its x86_64 and ARM64 versions.

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 7.1.0 (2026-07-21)

* Added [Server-Sent Events (SSE)](../api-sessions/mcp-sessions.md) support, enabling [API Discovery](../api-discovery/overview.md) to analyze responses from MCP servers that stream over SSE
* Added the ability for the node to start even when the Wallarm Cloud is temporarily unavailable
* Changed the node process supervisor from supervisord to the WD service
* Changed the internal API Discovery component from `appstructure` to the api-discovery job
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed a node crash when a custom ruleset contained HEX parser rules
* Fixed the installer reporting spurious "NGINX binary is not officially supported" errors for custom NGINX builds run with `--custom-ngx-build`
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 7.1.0 (2026-07-21)

* Added [Server-Sent Events (SSE)](../api-sessions/mcp-sessions.md) support, enabling [API Discovery](../api-discovery/overview.md) to analyze responses from MCP servers that stream over SSE
* Added the ability for the node to start even when the Wallarm Cloud is temporarily unavailable
* Changed the node process supervisor from supervisord to the WD service
* Changed the internal API Discovery component from `appstructure` to the api-discovery job
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed a node crash when a custom ruleset contained HEX parser rules
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

### 7.0.0 (2026-02-16)

* Initial release 7.0, [see changelog](what-is-new.md)

## Helm chart for Sidecar

[How to upgrade](sidecar-proxy.md)

### 7.1.0 (2026-07-21)

* Added [Server-Sent Events (SSE)](../api-sessions/mcp-sessions.md) support, enabling [API Discovery](../api-discovery/overview.md) to analyze responses from MCP servers that stream over SSE
* Added the ability for the node to start even when the Wallarm Cloud is temporarily unavailable
* Changed the node process supervisor from supervisord to the WD service
* Changed the internal API Discovery component from `appstructure` to the api-discovery job
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed a node crash when a custom ruleset contained HEX parser rules
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 7.1.0 (2026-07-21)

* Added [Server-Sent Events (SSE)](../api-sessions/mcp-sessions.md) support, enabling [API Discovery](../api-discovery/overview.md) to analyze responses from MCP servers that stream over SSE
* Added the ability for the node to start even when the Wallarm Cloud is temporarily unavailable
* Changed the node process supervisor from supervisord to the WD service
* Changed the internal API Discovery component from `appstructure` to the api-discovery job
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed a node crash when a custom ruleset contained HEX parser rules
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 7.1.0 (2026-07-21)

* Added [Server-Sent Events (SSE)](../api-sessions/mcp-sessions.md) support, enabling [API Discovery](../api-discovery/overview.md) to analyze responses from MCP servers that stream over SSE
* Added the ability for the node to start even when the Wallarm Cloud is temporarily unavailable
* Changed the node process supervisor from supervisord to the WD service
* Changed the internal API Discovery component from `appstructure` to the api-discovery job
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed a node crash when a custom ruleset contained HEX parser rules
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

<!-- TODO: replace the header below with the actual GCP image name and build date once the image is built:
     gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-7-1-0-.*'" --no-standard-images -->
### wallarm-node-7-1-0-<YYYYMMDD-HHMMSS> (2026-07-21)

* Added [Server-Sent Events (SSE)](../api-sessions/mcp-sessions.md) support, enabling [API Discovery](../api-discovery/overview.md) to analyze responses from MCP servers that stream over SSE
* Added the ability for the node to start even when the Wallarm Cloud is temporarily unavailable
* Changed the node process supervisor from supervisord to the WD service
* Changed the internal API Discovery component from `appstructure` to the api-discovery job
* Fixed an attack-detection bypass caused by incomplete reads of WebSocket and streamed request data
* Fixed a node crash when a custom ruleset contained HEX parser rules
* Fixed security vulnerabilities:

    * [CVE-2026-29181](https://nvd.nist.gov/vuln/detail/CVE-2026-29181)
    * [CVE-2026-33814](https://nvd.nist.gov/vuln/detail/CVE-2026-33814)
