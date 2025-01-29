# NGINX Node Artifact Versions and Changelog

This document lists available  [versions](versioning-policy.md) of the [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 5.x in various form factors, helping you track releases and plan upgrades.

## All-in-one installer

Since version 4.10, installation and upgrading of Wallarm nodes is performed **only** with all [all-in-one installer](../installation/nginx/all-in-one.md). Manual upgrade with individual Linux packages is not supported any more.

History of all-in-one installer updates simultaneously applies to it's x86_64 and ARM64 (beta) versions.

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 5.3.0 (2024-01-29)

* Added support for response parameters in [API Sessions](../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../api-sessions/setup.md#session-grouping) (see detailed [change description](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../user-guides/rules/request-processing.md#gql) (see detailed [change description](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions

* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) attacks

### 5.2.11 (2024-12-25)

* Added support for NGINX Mainline v1.27.2 and 1.27.3
* Added support for NGINX Plus R33
* Added support for sensitive business flows in [API Discovery](../api-discovery/sbf.md) and [API Sessions](../api-sessions/exploring.md#sensitive-business-flows)
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

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

### 5.3.0 (2024-01-29)

* Added support for response parameters in [API Sessions](../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../api-sessions/setup.md#session-grouping) (see detailed [change description](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../user-guides/rules/request-processing.md#gql) (see detailed [change description](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions
    
* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) attacks

### 5.2.12 (2025-01-08)

* Resolved the [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) controller vulnerability

### 5.2.11 (2024-12-27)

* Added support for sensitive business flows in [API Discovery](../api-discovery/sbf.md) and [API Sessions](../api-sessions/exploring.md#sensitive-business-flows)
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

### 5.2.2 (2024-12-11)

* Re-apply the fix for the [GHSA-c5pj-mqfh-rvc3](https://scout.docker.com/vulnerabilities/id/GHSA-c5pj-mqfh-rvc3) vulnerability

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

### 5.3.0 (2024-01-29)

* Added support for response parameters in [API Sessions](../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../api-sessions/setup.md#session-grouping) (see detailed [change description](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../user-guides/rules/request-processing.md#gql) (see detailed [change description](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions
    
* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) attacks
<!--* Added configurable parameters for API FW in Helm chart values
* Added configurable parameter for NGINX extended logging in Helm chart values-->

### 5.2.11 (2024-12-27)

* Added support for sensitive business flows in [API Discovery](../api-discovery/sbf.md) and [API Sessions](../api-sessions/exploring.md#sensitive-business-flows)
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

### 5.2.1 (2024-12-09)

* New `$wallarm_attack_point_list` and `$wallarm_attack_stamp_list` variables for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    These variables log request points containing malicious payloads and attack sign IDs, thereby enabling advanced debugging of Node behavior.
* Minor bug fixes

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

### 5.3.0 (2024-01-29)

* Added support for response parameters in [API Sessions](../api-sessions/overview.md) for providing the full context of user activities and more precise [session grouping](../api-sessions/setup.md#session-grouping) (see detailed [change description](../updating-migrating/what-is-new.md#response-parameters-in-api-sessions))
* Added a full-fledged [GraphQL parser](../user-guides/rules/request-processing.md#gql) (see detailed [change description](../updating-migrating/what-is-new.md#full-fledged-graphql-parser)) that allows:

    * Improved detection of the input validation attacks in GraphQL-specific request points
    * Fine-tuning attack detection for specific GraphQL points (e.g. disable detection of specific attack types in specific points)
    * Analyzing specific parts of GraphQL requests in API sessions
    
* Fixed invalid time value in serialized requests to properly display the [resource overlimit](../user-guides/rules/configure-overlimit-res-detection.md) attacks

### 5.2.11 (2024-12-25)

* Added support for sensitive business flows in [API Discovery](../api-discovery/sbf.md) and [API Sessions](../api-sessions/exploring.md#sensitive-business-flows)
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

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

### 5.2.11 (2024-12-28)

* Added support for sensitive business flows in [API Discovery](../api-discovery/sbf.md) and [API Sessions](../api-sessions/exploring.md#sensitive-business-flows)
* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

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

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-5-2-20241227-095327 (2024-12-27)

* Resolved the [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) and [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) vulnerabilities
* Fixed an issue where some requests were processed unsuccessfully, potentially affecting API Sessions, Credential Stuffing, and API Abuse Prevention

### wallarm-node-5-2-20241209-114655 (2024-12-07)

* New `$wallarm_attack_point_list` and `$wallarm_attack_stamp_list` variables for [extended logging](../admin-en/configure-logging.md#configuring-extended-logging-for-the-nginxbased-filter-node)

    These variables log parameters containing malicious payloads and attack sign IDs enabling advanced debugging of Node behavior.
* Minor bug fixes

### wallarm-node-5-1-20241108-120238 (2024-11-08)

* Initial release 5.x, [see changelog](what-is-new.md)
