# Inventory of node artifact versions

This document lists available [patch versions](versioning-policy.md#version-format) of Wallarm node 4.4 in different form-factors. You can track new patch version releases and plan timely upgrade based on this document.

## Helm chart for NGINX Ingress controller

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

### 4.4.1 (2023-01-16)

* Ability to save a Wallarm node token as a Kubernetes secret and pull it to the Helm chart using the `existingSecret` feature. [Read more](../admin-en/configure-kubernetes-en.md#controllerwallarmexistingsecret)
* New Helm chart parameters for Tarantool resources:

    * [`controller.wallarm.tarantool.terminationGracePeriodSeconds`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L789) - read more in the [K8s documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)
    * [`controller.wallarm.topologySpreadConstraint`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L793) - read more in the [K8s documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/#topologyspreadconstraints-field)
    * [`revisionHistoryLimit`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml#L870) - this global parameter now also sets a number of Tarantool resource ReplicaSets to retain

[How to upgrade](ingress-controller.md)

## Helm chart for Kong Ingress controller

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

## Helm chart for Sidecar proxy

### 1.1.5

* Initial release 4.4, [see changelog](what-is-new.md)

## NGINX-based Docker container

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)

## Envoy-based Docker container

### 4.4.0

* Initial release 4.4, [see changelog](what-is-new.md)
