# Inventory of node artifact versions

This document lists available [patch versions](versioning-policy.md#version-format) of Wallarm node 4.10 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## All-in-one installer

History of updates simultaneously applies to the x86_64 and ARM64 (beta) versions of [all-in-one installer](../installation/nginx/all-in-one.md).

[How to migrate from DEB/RPM packages](nginx-modules.md)

[How to migrate from previous all-in-one installer version](all-in-one.md)

### 4.10.5 (2024-04-23)

* Fixed the API Abuse Prevention module logging issues

### 4.10.4 (2024-04-18)

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)
* Added support for NGINX v1.25.4

### 4.10.3 (2024-03-18)

* The `readahead` parameter value for Tarantool has been decreased to 32KB

### 4.10.2 (2024-03-08)

* Internal improvements for higher reliability and security, including better synchronization between the filtering node and Wallarm Cloud, securing the `wallarm` user with a non-interactive shell, and other changes that do not affect the usage flow
* Updated the `appstructure` package
* Updated the `api-firewall` package
* The `readahead` parameter value for Tarantool has been decreased to 32KB
* Fixed the vulnerabilities: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1 (2024-02-21)

* Fixed an issue where partially downloaded custom ruleset files were mistakenly validated as complete. Chunked downloading has been implemented to address this issue
* Fixed the vulnerabilities:

    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-41817](https://nvd.nist.gov/vuln/detail/CVE-2021-41817)
    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2023-28755](https://nvd.nist.gov/vuln/detail/CVE-2023-28755)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)

### 4.10.0 (2024-02-02)

* Initial release 4.10, [see changelog](what-is-new.md)

<!-- ## DEB/RPM packages for NGINX

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](nginx-modules.md)

### 4.8.0 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Helm chart for Wallarm NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 4.10.4 (2024-04-19)

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)
* Fixed performance issue

### 4.10.3 (2024-03-08)

* Internal improvements for higher reliability and security, including better synchronization between the filtering node and Wallarm Cloud, securing the `wallarm` user with a non-interactive shell, and other changes that do not affect the usage flow
* Updated the `appstructure` package
* Updated the `api-firewall` package
* Fixed the vulnerabilities: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.2 (2024-02-21)

* Restored OpenTracing

### 4.10.1 (2024-02-21)

* Updated the `appstructure` package
* Internal enhancements and optimizations:
    
    * Implemented labels and annotations for the Tarantool pod
    * Transitioned to supervisord
* Fixed the vulnerabilities:

    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2023-28755](https://nvd.nist.gov/vuln/detail/CVE-2023-28755)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-41817](https://nvd.nist.gov/vuln/detail/CVE-2021-41817)

### 4.10.0 (2024-02-01)

* Initial release 4.10, [see changelog](what-is-new.md)

<!-- ## Helm chart for Kong Ingress controller

[How to upgrade](kong-ingress-controller.md)

### 4.8.0 (2023-03-28)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Helm chart for Sidecar

[How to upgrade](sidecar-proxy.md)

### 4.10.4 (2024-04-29)

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)
* Bump Alpine version to 3.19
* Bump Golang version to 1.22.2
* Bump Golang dependencies

### 4.10.2 (2024-04-19)

* Added support for [credential stuffing detection](../about-wallarm/credential-stuffing.md)
* Added support for ARM64 processors
* Bump Alpine version to 3.19
* Upgrade NGINX to version 1.24.0 from 1.21.6
* The following [built-in NGINX modules](../installation/kubernetes/sidecar-proxy/customization.md#enabling-additional-nginx-modules) are not distributed with the Sidecar solution anymore:

    * [ngx_http_auth_digest_module.so](https://github.com/atomx/nginx-http-auth-digest)
    * [ngx_http_influxdb_module.so](https://github.com/influxdata/nginx-influxdb-module)
    * [ngx_http_modsecurity_module.so](https://github.com/SpiderLabs/ModSecurity)
    * [ngx_http_opentracing_module.so](https://github.com/opentracing-contrib/nginx-opentracing)
* Fixed the vulnerabilities of the critical and high risk levels:

    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2017-18342](https://nvd.nist.gov/vuln/detail/CVE-2017-18342)
    * [CVE-2020-1747](https://nvd.nist.gov/vuln/detail/CVE-2020-1747)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2019-11324](https://nvd.nist.gov/vuln/detail/CVE-2019-11324)
    * [CVE-2023-5363](https://nvd.nist.gov/vuln/detail/CVE-2023-5363)
    * [CVE-2024-25062](https://nvd.nist.gov/vuln/detail/CVE-2024-25062)
    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-41817](https://nvd.nist.gov/vuln/detail/CVE-2021-41817)
    * [CVE-2023-28755](https://nvd.nist.gov/vuln/detail/CVE-2023-28755)

## Helm chart for Wallarm eBPF‑based solution

### 0.10.28 (2024-04-24)

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)
* Added support for NGINX v1.25.4

### 0.10.27 (2024-03-29)

* Fixed incorrect behavior in case of processing/aggregation init container fail

### 0.10.26 (2024-03-27)

* Implemented Certificate Authority (CA) verification for traffic from the eBPF agent to the Wallarm processing node
* Added mutual TLS (mTLS) support, enabling the processing node to authenticate the security of traffic from the eBPF agent

    This is controlled by the [`config.mutualTLS`](../installation/oob/ebpf/helm-chart-for-wallarm.md#configmutualtls) value in the Helm chart, disabled by default.
* Upgraded agent dependencies

### 0.10.25 (2024-03-19)

* Added support for [credential stuffing detection](../about-wallarm/credential-stuffing.md)
* Bump the default `SLAB_ALLOC_ARENA` value up to 2GB
* Internal improvements

### 0.10.23 (2024-03-07)

* Fixed http2 streams mirroring issues in some cases
* Internal fixes and stability improvements

### 0.10.22 (2024-03-01)

* [Initial release](../installation/oob/ebpf/deployment.md)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 4.10.4-1 (2024-04-18)

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)
* Added support for NGINX v1.25.4

### 4.10.2-1 (2024-03-08)

* Internal improvements for higher reliability and security, including better synchronization between the filtering node and Wallarm Cloud, securing the `wallarm` user with a non-interactive shell, and other changes that do not affect the usage flow
* Updated the `appstructure` package
* Updated the `api-firewall` package
* Fixed the vulnerabilities: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1-1 (2024-02-21)

* Updated the `appstructure` package
* Fixed the vulnerabilities:

    * [CVE-2021-43998](https://nvd.nist.gov/vuln/detail/CVE-2021-43998)
    * [CVE-2021-38553](https://nvd.nist.gov/vuln/detail/CVE-2021-38553)
    * [CVE-2023-5954](https://nvd.nist.gov/vuln/detail/CVE-2023-5954)
    * [CVE-2023-5077](https://nvd.nist.gov/vuln/detail/CVE-2023-5077)
    * [CVE-2023-24999](https://nvd.nist.gov/vuln/detail/CVE-2023-24999)
    * [CVE-2021-32923](https://nvd.nist.gov/vuln/detail/CVE-2021-32923)
    * [CVE-2021-3282](https://nvd.nist.gov/vuln/detail/CVE-2021-3282)
    * [CVE-2021-41816](https://nvd.nist.gov/vuln/detail/CVE-2021-41816)
    * [CVE-2021-41819](https://nvd.nist.gov/vuln/detail/CVE-2021-41819)
    * [CVE-2021-33621](https://nvd.nist.gov/vuln/detail/CVE-2021-33621)
    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2022-3920](https://nvd.nist.gov/vuln/detail/CVE-2022-3920)
    * [CVE-2023-39325](https://nvd.nist.gov/vuln/detail/CVE-2023-39325)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2023-45283](https://nvd.nist.gov/vuln/detail/CVE-2023-45283)
    * [GHSA-m425-mq94-257g](https://github.com/advisories/GHSA-m425-mq94-257g)

### 4.10.0-1 (2024-02-02)

* Initial release 4.10, including optimizations, and security enhancements for the Docker image. [See changelog](what-is-new.md)

<!-- ## Envoy-based Docker image

!!! info "Pending upgrade to 4.10"
    This artifact has not been updated to Wallarm node 4.10 yet; an upgrade is pending. The 4.10 features are not supported on nodes deployed with this artifact.

[How to upgrade](docker-container.md)

### 4.8.0-1 (2023-10-19)

* Initial release 4.8, [see changelog](what-is-new.md) -->

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 4.10.4-1 (2024-04-19)

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)

### 4.10.2-2 (2024-03-20)

* The `readahead` parameter value for Tarantool has been decreased to 32KB

### 4.10.2-1 (2024-03-08)

* Internal improvements for higher reliability and security, including better synchronization between the filtering node and Wallarm Cloud, securing the `wallarm` user with a non-interactive shell, and other changes that do not affect the usage flow
* Updated the `appstructure` package
* Updated the `api-firewall` package
* Fixed the vulnerabilities: 

    * [CVE-2021-43809](https://nvd.nist.gov/vuln/detail/CVE-2021-43809)
    * [CVE-2023-48795](https://nvd.nist.gov/vuln/detail/CVE-2023-48795)

### 4.10.1-2 (2024-02-21)

* Updated the `appstructure` package
* Fixed the vulnerabilities:

    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2023-4408](https://nvd.nist.gov/vuln/detail/CVE-2023-4408)
    * [CVE-2023-50387](https://nvd.nist.gov/vuln/detail/CVE-2023-50387)
    * [CVE-2023-50868](https://nvd.nist.gov/vuln/detail/CVE-2023-50868)
    * [CVE-2023-5517](https://nvd.nist.gov/vuln/detail/CVE-2023-5517)
    * [CVE-2023-5679](https://nvd.nist.gov/vuln/detail/CVE-2023-5679)
    * [CVE-2024-0553](https://nvd.nist.gov/vuln/detail/CVE-2024-0553)
    * [CVE-2024-0567](https://nvd.nist.gov/vuln/detail/CVE-2024-0567)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)

### 4.10.0-1 (2024-02-02)

* Initial release 4.10, including optimizations for the image. [See changelog](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

<!--### wallarm-node-4-10-20240418-112335

* Added support for [API Specification Enforcement](../api-policy-enforcement/overview.md) (using the functionality increases CPU consumption normally by about 20%)
* Added support for [GraphQL API Protection](../api-protection/graphql-rule.md)
-->
### wallarm-node-4-10-20240220-234618

* Updated the `appstructure` package
* Fixed the vulnerabilities:

    * [CVE-2020-14343](https://nvd.nist.gov/vuln/detail/CVE-2020-14343)
    * [CVE-2023-4408](https://nvd.nist.gov/vuln/detail/CVE-2023-4408)
    * [CVE-2023-50387](https://nvd.nist.gov/vuln/detail/CVE-2023-50387)
    * [CVE-2023-50868](https://nvd.nist.gov/vuln/detail/CVE-2023-50868)
    * [CVE-2023-5517](https://nvd.nist.gov/vuln/detail/CVE-2023-5517)
    * [CVE-2023-5679](https://nvd.nist.gov/vuln/detail/CVE-2023-5679)
    * [CVE-2024-0553](https://nvd.nist.gov/vuln/detail/CVE-2024-0553)
    * [CVE-2024-0567](https://nvd.nist.gov/vuln/detail/CVE-2024-0567)
    * [CVE-2023-37920](https://nvd.nist.gov/vuln/detail/CVE-2023-37920)
    * [CVE-2021-33503](https://nvd.nist.gov/vuln/detail/CVE-2021-33503)
    * [CVE-2020-36327](https://nvd.nist.gov/vuln/detail/CVE-2020-36327)
    * [CVE-2021-31799](https://nvd.nist.gov/vuln/detail/CVE-2021-31799)
    * [CVE-2021-28965](https://nvd.nist.gov/vuln/detail/CVE-2021-28965)
    * [CVE-2020-25613](https://nvd.nist.gov/vuln/detail/CVE-2020-25613)

### wallarm-node-4-10-20240126-175315 (2024-02-02)

* Initial release 4.10, including optimizations for the image. [See changelog](what-is-new.md)