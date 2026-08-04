# Migration Plan for Wallarm NGINX Ingress Controller Customers

In November 2025, the Kubernetes community announced the [retirement of the Community Ingress NGINX project](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term), with best-effort maintenance ending in March 2026. This page outlines how this change affects Wallarm's NGINX-based Ingress deployment artifact and the available migration paths.

## Support timeline for the Community-based controller

To align with the upstream project's lifecycle, the following support plan applies to the [Community‑based Wallarm Ingress Controller (Wallarm Node 6.x)][community-ic]:

* Wallarm actively supported this controller, including new feature releases, until **March 2026**.
* Since **March 2026**:

    * The controller remains functional.
    * Wallarm no longer actively develops it — no new features are added.
    * Wallarm may still deliver limited fixes and minor updates.
    * Because the upstream Community Ingress NGINX project has been retired, the controller no longer receives upstream security patches.

## Alternative deployment options

Wallarm provides several alternatives to the Community-based Wallarm Ingress Controller, covering the most common ingress models:

* [F5 NGINX Ingress Controller](#f5-nginx-ingress-controller-available-now-wallarm-node-7x) — available now in Wallarm Node 7.x
* [Istio/Envoy connector](#istioenvoy-connector-available-now) — available now
* [Wallarm Node deployment compatible with the Kubernetes Gateway API](#wallarm-node-deployment-compatible-with-the-kubernetes-gateway-api-coming-soon) — coming soon

### F5 NGINX Ingress Controller (available now, Wallarm Node 7.x)

Wallarm Node 7.x delivers a reworked Ingress Controller Helm chart based on the [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress) with integrated Wallarm services.

* **Availability**: available now in Wallarm Node 7.x
* **Recommended for**: customers who prefer to continue using an NGINX-based Ingress controller, and customers already running F5 NGINX Ingress
* [How to deploy F5 NGINX Ingress Controller with Integrated Wallarm Services][f5-install]
* [Migrating From the Community-Based to F5-Based Wallarm Ingress Controller][f5-migration]

### Istio/Envoy connector (available now)

Wallarm offers an [Istio/Envoy-based connector](../installation/connectors/istio.md).

This is not a direct replacement for the NGINX Ingress Controller and may require architectural changes in how traffic enters and flows through the cluster.

It is a suitable option for customers who are already using, or planning to adopt, Envoy-based ingress gateways or service-mesh-style architectures.

### Wallarm Node deployment compatible with the Kubernetes Gateway API (coming soon)

Wallarm will also introduce a new deployment artifact compatible with the Kubernetes Gateway API, the modern, Kubernetes-recommended standard for traffic ingress.

* **Availability**: coming soon
* **Recommended for**: customers adopting Gateway API in their clusters or moving toward modern Kubernetes networking patterns

This artifact will integrate Wallarm traffic processing into clusters through the Gateway API's extensible, role-oriented model.

## Next steps for customers

Although your existing clusters keep running, Wallarm recommends migrating rather than postponing it. Wallarm Node 7.x is production-ready and is set to become the latest stable version, replacing 6.x. In addition, the Community-based controller is no longer actively supported, and the retired upstream project no longer receives security patches.

Choose one of the following options:

* To keep using an NGINX-based Ingress controller, upgrade to the F5-based controller by following the [migration guide][f5-migration].
* If your organization is already using or planning to transition to Envoy-based or service-mesh architectures, adopt the [Istio/Envoy-based connector](../installation/connectors/istio.md).
* If you are adopting the Kubernetes Gateway API, plan for the Wallarm artifact compatible with the Gateway API (coming soon).
