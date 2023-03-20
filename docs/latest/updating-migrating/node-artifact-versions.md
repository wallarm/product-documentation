# Inventory of node artifact versions

This document lists available [patch versions](versioning-policy.md#version-format) of Wallarm node 4.4 in different form-factors. You can track new patch version releases and plan timely upgrades based on this document.

## DEB/RPM packages for NGINX

[How to upgrade](nginx-modules.md)

### 4.4.3 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

## Helm chart for NGINX Ingress controller

[How to upgrade](ingress-controller.md)

### 4.4.8 (2023-02-23)

* The Helm chart version of the NGINX Ingress controller has been bumped to [4.5.2](https://github.com/kubernetes/ingress-nginx/releases/tag/helm-chart-4.5.2)
* The NGINX Ingress controller version has been bumped to [1.6.4](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v1.6.4)

### 4.4.7 (2023-02-13)

* Fix the issue when Wallarm helper containers don't respect SIGTERM signal, which leads to rolling upgrade taking much time

### 4.4.6 (2023-02-13)

* Fix the deprecated API version for HorizontalPodAutoscaler, bump to v2 (`autoscaling/v2beta2` → `autoscaling/v2`)

### 4.4.5 (2023-02-13)

* Fix the pod re-start issue when Wallarm API accidentally becomes unavailable
* Remove the `synccloud` and `heardbeat` containers in [#185](https://github.com/wallarm/ingress/pull/185)

### 4.4.4 (2023-02-13)

* Fix the pod re-start issues when Wallarm API is unavailable during Helm chart installation or upgrade

### 4.4.3 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.2 (2023-01-19)

* Fix the weak JWT detection functionality issues

### 4.4.1 (2023-01-16)

* Ability to save a Wallarm node token as a Kubernetes secret and pull it to the Helm chart using the `existingSecret` feature. [Read more](../admin-en/configure-kubernetes-en.md#controllerwallarmexistingsecret)
* New Helm chart parameters for Tarantool resources:

    * [`controller.wallarm.tarantool.terminationGracePeriodSeconds`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L789) - read more in the [K8s documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)
    * [`controller.wallarm.topologySpreadConstraint`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L793) - read more in the [K8s documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/#topologyspreadconstraints-field)
    * [`revisionHistoryLimit`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L870) - this global parameter now also sets a number of Tarantool resource ReplicaSets to retain, read more about the parameter in the [K8s documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#revision-history-limit)
* Remove the `exportenv` init container in [#170](https://github.com/wallarm/ingress/pull/170)

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

## Helm chart for Kong Ingress controller

[How to upgrade](kong-ingress-controller.md)

### 4.4.3 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.1

* Fix the weak JWT detection functionality issues
* Upgrade the Kong API Gateway version to 3.1.x (for both the Open-Source and Enterprise editions)
* Upgrade the Kong Ingress Controller version to 2.8.x

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

## Helm chart for Sidecar proxy

[How to upgrade](sidecar-proxy.md)

### 4.4.5 (2023-02-13)

* Set the [`config.wallarm.fallback`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmfallback) and [`config.wallarm.enableLibDetection`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmenablelibdetection) Helm values to `on` by default

### 4.4.4 (2023-02-13)

* Ability to save a Wallarm node token as a Kubernetes secret and pull it to the Helm chart using the `existingSecret` feature. [Read more](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmapiexistingsecret)

### 4.4.3 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.1

* Fix the weak JWT detection functionality issues

### 1.1.5

* Initial release 4.4, [see changelog](what-is-new.md)

## NGINX-based Docker image

[How to upgrade](docker-container.md)

### 4.6.0-1 (2023-03-20)

* Initial release 4.6, [see changelog](what-is-new.md)

### 4.4.5-1 (2023-03-03)

* Fix the issue with invalid custom ruleset causing segmentation faults

### 4.4.3-1 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.0-1

* Initial release 4.4, [see changelog](what-is-new.md)

## Envoy-based Docker image

[How to upgrade](docker-container.md)

### 4.4.3 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

## Amazon Machine Image (AMI)

[How to upgrade](cloud-image.md)

### 4.4.2-1 (2023-02-10)

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### 4.4.1-1

* Initial release 4.4, [see changelog](what-is-new.md)

## Google Cloud Platform Image

[How to upgrade](cloud-image.md)

### wallarm-node-4-4-20230131-154432

* Support for [Mass Assignment](../attacks-vulns-list.md#mass-assignment) and [SSRF](../attacks-vulns-list.md#serverside-request-forgery-ssrf) attack detection
* New parameter `custom_ruleset_ver` returned by the [Wallarm statistics service](../admin-en/configure-statistics-service.md) in both JSON and Prometheus formats

### wallarm-node-4-4-20221122-092419

* Initial release 4.4, [see changelog](what-is-new.md)
