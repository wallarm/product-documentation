# NGINX Node Artifact Versions and Changelog

This document lists available  [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 5.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported any more.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 5.2.1 (2024-12-07)

* New `$wallarm_attack_point_list` and `$wallarm_attack_stamp_list` variables for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    These variables log request points containing malicious payloads and attack sign IDs, thereby enabling advanced debugging of Node behavior.
* Minor bug fixes

### 5.1.1 (2024-11-08)

* Fixed some bugs in the `wallarm-status` service operation

### 5.1.0 (2024-11-06)

* Added support for [API Sessions](../api-sessions/overview.md)
* [Improved](what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Reduced memory usage during node registration

### 5.0.3 (2024-10-10)

* Added support for [customizing sensitive data detection](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../user-guides/ip-lists/overview.md) but have [known source](../user-guides/ip-lists/overview.md#select-object)

### 5.0.2 (2024-09-18)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)
* Added support for NGINX v1.26.2 stable

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 5.2.1 (2024-12-07)

* Upgraded to Community Ingress NGINX Controller version 1.11.3, aligning with the upstream Helm chart version 4.11.3
* Breaking changes introduced by the Community Ingress NGINX Controller upgrade:

    * Discontinued support for Opentracing and Zipkin modules, now only supporting Opentelemetry
    * Dropped support for `PodSecurityPolicy`
* Compatibility extended up to Kubernetes version 1.30
* Updated to NGINX 1.25.5
* Minor bug fixes

### 5.1.1 (2024-11-14)

* Fixed the [GHSA-c5pj-mqfh-rvc3](https://scout.docker.com/vulnerabilities/id/GHSA-c5pj-mqfh-rvc3) vulnerability
* Fixed some bugs in the `wallarm-status` service operation

### 5.1.0 (2024-11-06)

* Added support for [API Sessions](../api-sessions/overview.md)
* [Improved](what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Reduced memory usage during node registration
* Added new settings for API Specification Enforcement:

    * `readBufferSize`
    * `readBufferSize`
    * `writeBufferSize`
    * `maxRequestBodySize`
    * `disableKeepalive`
    * `maxConnectionsPerIp`
    * `maxRequestsPerConnection`

    See descriptions and default values [here](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall).

### 5.0.3 (2024-10-10)

* Added support for [customizing sensitive data detection](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../user-guides/ip-lists/overview.md) but have [known source](../user-guides/ip-lists/overview.md#select-object)

### 5.0.2 (2024-09-18)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)

<!-- ## Helm chart for Kong Ingress controller

[How to upgrade](kong-ingress-controller.md)

### 4.8.0 (2023-03-28)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Helm chart for Sidecar

[How to upgrade](sidecar-proxy.md)

### 5.1.0 (2024-11-06)

* Added support for [API Sessions](../api-sessions/overview.md)
* [Improved](what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Reduced memory usage during node registration

### 5.0.3 (2024-10-10)

* Added support for [customizing sensitive data detection](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../user-guides/ip-lists/overview.md) but have [known source](../user-guides/ip-lists/overview.md#select-object)

### 5.0.2 (2024-09-19)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)

<!-- ## Helm chart for Wallarm eBPF‑based solution

### 0.10.22 (2024-03-01)

* [Initial release](../installation/oob/ebpf/deployment.md) -->

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 5.2.1 (2024-12-07)

* New `$wallarm_attack_point_list` and `$wallarm_attack_stamp_list` variables for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    These variables log parameters containing malicious payloads and attack sign IDs enabling advanced debugging of Node behavior.
* Moved image source and Dockerfile from [GitHub](https://github.com/wallarm/docker-wallarm-node) to an internal GitLab repository

### 5.1.0-1 (2024-11-06)

* Added support for [API Sessions](../api-sessions/overview.md)
* [Improved](what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Reduced memory usage during node registration

### 5.0.3-1 (2024-10-10)

* Added support for [customizing sensitive data detection](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../user-guides/ip-lists/overview.md) but have [known source](../user-guides/ip-lists/overview.md#select-object)

### 5.0.2-1 (2024-09-18)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1-1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)
* Added support for NGINX v1.26.2 stable

<!-- ## Envoy-based Docker image

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](docker-container.md)

### 4.8.0-1 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 5.2.1 (2024-12-07)

* New `$wallarm_attack_point_list` and `$wallarm_attack_stamp_list` variables for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    These variables log parameters containing malicious payloads and attack sign IDs enabling advanced debugging of Node behavior.
* Minor bug fixes

### 5.1.0-1 (2024-11-06)

* Added support for [API Sessions](../api-sessions/overview.md)
* [Improved](what-is-new.md#new-in-limiting-request-processing-time) limiting request processing time
* Reduced memory usage during node registration

### 5.0.3-1 (2024-10-10)

* Added support for [customizing sensitive data detection](../api-discovery/sensitive-data.md#customizing-sensitive-data-detection) in API Discovery
* Fixed memory leak on duplicate response headers in [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Fixed memory leak related to IP addresses that are not in [IP lists](../user-guides/ip-lists/overview.md) but have [known source](../user-guides/ip-lists/overview.md#select-object)

### 5.0.2-1 (2024-09-19)

* Fixed installation failure issue when no WAAP + API Security subscription is activated
* Fixed delays in attack export

### 5.0.1-1 (2024-08-21)

* Initial release 5.0, [see changelog](what-is-new.md)

<!-- ## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-4-10-20240126-175315 (TBD)

* Initial release 5.0, [see changelog](what-is-new.md) -->