# Inventory of node artifact versions

This document lists available [patch versions](versioning-policy.md#version-format) of Wallarm node 4.6 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## All-in-one installer

History of updates simultaneously applies to the x86_64 and ARM64 (beta) versions of [all-in-one installer](../installation/nginx/all-in-one.md).

### 4.6.12 (2023-06-30)

* Initial release 4.6, [see changelog](what-is-new.md)

## DEB/RPM packages for NGINX

[How to upgrade](nginx-modules.md)

### 4.6.0 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)

## Helm chart for NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 4.6.5 (2023-06-19)

* Added support for the latest [compromised secret key set](https://github.com/wallarm/jwt-secrets) with over 100,000 recently discovered compromised keys, further enhancing our [weak JWT detection](../attacks-vulns-list.md#weak-jwt) capabilities
* Increased [memory allocated for the Wallarm postanalytics module](../admin-en/configure-kubernetes-en.md#controllerwallarmtarantoolarena) to 1GB

### 4.6.4 (2023-06-06)

* The Helm chart version of the NGINX Ingress controller has been bumped to [4.7.0](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.7.0)
* The NGINX Ingress controller version has been bumped to [1.8.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.8.0)
* Internal improvements:
    * Mount Wallarm API token to the Docker container as a volume instead of the environment variable
    * Use a dedicated image tag for helper containers

### 4.6.3 (2023-05-18)

* The Helm chart version of the NGINX Ingress controller has been bumped to [4.6.1](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.6.1)
* The NGINX Ingress controller version has been bumped to [1.7.1](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.7.1)

### 4.6.2 (2023-04-10)

* The Helm chart version of the NGINX Ingress controller has been bumped to [4.6.0](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.6.0)
* The NGINX Ingress controller version has been bumped to [1.7.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.7.0)
* Kubernetes 1.23.x is no longer supported (it is EOL)

### 4.6.0 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)

## Helm chart for Kong Ingress controller

[How to upgrade](kong-ingress-controller.md)

### 4.6.0 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)

## Helm chart for Sidecar proxy

[How to upgrade](sidecar-proxy.md)

### 4.6.4 (2023-06-27)

* Added support for [external postanalytics (Tarantool) module usage](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticsexternalenabled)

### 4.6.3 (2023-06-20)

* Fixed a bug that caused failure in the sidecar container when the following annotations were not handled properly: `sidecar.wallarm.io/nginx-http-snippet`, `sidecar.wallarm.io/nginx-server-snippet`, `sidecar.wallarm.io/nginx-location-snippet`

### 4.6.2 (2023-06-19)

* Added support for the latest [compromised secret key set](https://github.com/wallarm/jwt-secrets) with over 100,000 recently discovered compromised keys, further enhancing our [weak JWT detection](../attacks-vulns-list.md#weak-jwt) capabilities
* Bump Alpine version in the Sidecar proxy solution to 3.18.0

### 4.6.1 (2023-06-07)

* Support for [SSL/TLS termination](../installation/kubernetes/sidecar-proxy/customization.md#ssltls-termination)

### 4.6.0 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 4.6.2-1 (2023-06-13)

* Added support for the latest [compromised secret key set](https://github.com/wallarm/jwt-secrets) with over 100,000 recently discovered compromised keys, further enhancing our [weak JWT detection](../attacks-vulns-list.md#weak-jwt) capabilities

### 4.6.1-1 (2023-04-18)

* Now, container terminates when `WALLARM_LABELS` is not provided for deploy token

### 4.6.0-1 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)

## Envoy-based Docker image

[How to upgrade](docker-container.md)

### 4.6.2-1 (2023-06-13)

* Added support for the latest [compromised secret key set](https://github.com/wallarm/jwt-secrets) with over 100,000 recently discovered compromised keys, further enhancing our [weak JWT detection](../attacks-vulns-list.md#weak-jwt) capabilities

### 4.6.1-1 (2023-04-21)

* Now, container terminates when `WALLARM_LABELS` is not provided for deploy token
* Fix request count calculation

### 4.6.0-1 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 4.6.4-1 (2023-07-06)

* Fixed the [CVE-2021-3177](https://nvd.nist.gov/vuln/detail/CVE-2021-3177) vulnerability

    Due to the presence of this vulnerability in previous AMI versions, versions 4.0.6, 4.0.7, 4.2.1, 4.4.2-1, and 4.6.0-1 have been deleted.
* Added support for the latest [compromised secret key set](https://github.com/wallarm/jwt-secrets) with over 100,000 recently discovered compromised keys, further enhancing our [weak JWT detection](../attacks-vulns-list.md#weak-jwt) capabilities

### 4.6.0-1 (2023-03-28)

!!! warning "Version deleted"
    This AMI version has been deleted due to the presence of the [CVE-2021-3177](https://nvd.nist.gov/vuln/detail/CVE-2021-3177) vulnerability. Instead, a newer version, 4.6.4-1, with the necessary fix has been released.

* Initial release 4.6, [see changelog](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-4-6-20230630-122224 (2023-07-06)

* Fixed the [CVE-2021-3177](https://nvd.nist.gov/vuln/detail/CVE-2021-3177) vulnerability
* Added support for the latest [compromised secret key set](https://github.com/wallarm/jwt-secrets) with over 100,000 recently discovered compromised keys, further enhancing our [weak JWT detection](../attacks-vulns-list.md#weak-jwt) capabilities

### wallarm-node-4-6-20230324-114215 (2023-03-28)

* Initial release 4.6, [see changelog](what-is-new.md)
