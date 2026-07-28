# Migration Plan for Wallarm NGINX Ingress Controller Customers

In November 2025, the Kubernetes community announced the [retirement of the Community Ingress NGINX project](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term), with best-effort maintenance ending in March 2026. This page outlines how this change affects Wallarm's NGINX-based Ingress deployment artifact and the available migration paths.

## Wallarm's NGINX-based Ingress controller support timeline

Wallarm currently provides a [Wallarm Ingress Controller based on the Community Ingress NGINX](../admin-en/installation-kubernetes-en.md). To align with the upstream project's lifecycle, the following support plan applies:

* Wallarm will fully support this controller — including new feature releases — until **March 2026**
* Within this support window, the controller remains suitable for:

    * Evaluations and PoC deployments
    * Production workloads, provided you plan a migration before the end of support
* After March 2026:

    * The controller will remain functional, but
    * It will not receive upstream changes, security updates, or further enhancements
    * New capabilities will be delivered through new deployment artifacts (see below)

## New deployment options

Wallarm provides several alternatives to the Community Ingress NGINX-based controller, including an option available today and additional long-term deployment artifacts planned for 2026.

### Alternative available today: Istio/Envoy connector

Today, Wallarm offers an [Istio/Envoy-based connector](../installation/connectors/istio.md).

This is not a direct replacement for the NGINX Ingress Controller and may require architectural changes in how traffic enters and flows through the cluster.

It is a suitable option for customers who are already using, or planning to adopt, Envoy-based ingress gateways or service-mesh-style architectures.

### Wallarm Ingress Controller based on OSS Ingress NGINX (March 2026)

Wallarm will provide a new deployment artifact based on the [open-source Ingress NGINX](https://github.com/nginx/kubernetes-ingress).

* **Planned availability**: March 2026
* **Recommended for**: customers who prefer to continue using an NGINX-based ingress controller

### Wallarm Node deployment based on Kubernetes Gateway API (first half of 2026)

Wallarm will also introduce a new deployment artifact that leverages the Kubernetes Gateway API, the modern, Kubernetes-recommended standard for traffic ingress.

* **Planned availability**: first half of 2026
* **Recommended for**: customers adopting Gateway API in their clusters or moving toward modern Kubernetes networking patterns

This artifact will provide a native integration point for Wallarm traffic processing using the Gateway API's extensible and role-oriented model.

## Next steps for customers

No immediate changes are required in your existing clusters. However, we encourage you to review the available options as you plan your infrastructure roadmap for 2026.

### Before March 2026

Customers may choose one of the following paths:

* Continue using the [current Wallarm NGINX-based Ingress controller](../admin-en/installation-kubernetes-en.md) until March 2026 — it will remain fully functional and continue receiving Wallarm feature updates within this support window.
* Adopt the [Istio/Envoy-based connector](../installation/connectors/istio.md) now, if your organization is already using or planning to transition to Envoy-based or service-mesh architectures.

### When new deployment artifacts become available

* Migrate to the Wallarm deployment based on OSS Ingress NGINX (planned for March 2026).
* Plan adoption of the Wallarm Gateway API–based artifact (planned for first half of 2026).
