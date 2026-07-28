[nginx-node-landing]:  ../installation/nginx-native-node-internals.md#nginx-node
[nginx-node-6.4.1]: ../updating-migrating/node-artifact-versions.md#641-2025-08-07
[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[AIO]: ../installation/nginx/all-in-one.md
[docker]: ../admin-en/installation-docker-en.md
[IC]: ../admin-en/installation-kubernetes-en.md
[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md
[wstore-metrics]: ../admin-en/wstore-metrics.md
[apifw-metrics]: ../admin-en/apifw-metrics.md#enabling-api-firewall-metrics
[api-spec-enforcement]: ../api-specification-enforcement/overview.md
[wcli-metrics]: ../admin-en/wcli-metrics.md

# Monitoring the NGINX Node Metrics and Health

The [NGINX Node][nginx-node-landing] exposes metrics in the [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format, which you can use to monitor its performance, traffic, and detected attacks, along with [health endpoints](#health-endpoints) for orchestration. This page gives an overview of the available metrics and health endpoints.

## Metric groups

The recommended way to read most Node metrics is the single aggregated endpoint served by the `wd` (Wallarm Daemon) service at `http://127.0.0.1:9445/metrics`. It combines the following groups of metrics:

* [Traffic and attack metrics](traffic-attack-metrics.md) — the node's core filtering counters such as `wallarm_requests`, `wallarm_attacks`, and `wallarm_blocked` that report processed traffic, detected attacks, blocked requests, and detection health.
* [Postanalytics metrics][wstore-metrics] — Postanalytics module (**wstore**) metrics covering network activity, request processing, queue states, and storage.
* [**wcli** Controller metrics][wcli-metrics] — data from the service that runs most Wallarm functional components (e.g., brute-force detection or attack export to the Cloud).
* [Wallarm Daemon (wd) metrics](wd-metrics.md) — the `wd` service's own `wallarm_wd_*` metrics describing process supervision and `wd` scrape/push housekeeping.

These services also still expose their own endpoints, but reading from the aggregated `9445` endpoint is the recommended approach.

The `http://127.0.0.1:9445/metrics` endpoint also carries the managed services' runtime metrics (`go_*`, `process_*`) and the internal scraper's self-metrics (`vm_*`, `scrape_*`). To focus on Wallarm data, filter on the `wallarm_.*` prefix — for example, with a Prometheus `metric_relabel_configs` rule.

!!! info "API Firewall metrics"
    There are also [API Firewall metrics][apifw-metrics] that are handled differently: they are disabled by default and exposed on their own endpoint (port `9010`). In the [NGINX Ingress Controller][IC] they can also be aggregated into the `9445` endpoint; in other deployments they are available only on `9010`.

!!! info "Sidecar"
    The aggregated `9445` endpoint is not yet available in [Sidecar deployments][sidecar]. There, read metrics from each service's own endpoint instead.

## Health endpoints

In addition to metrics, readiness and liveness endpoints are exposed at `http://127.0.0.1:9446`:

* `http://127.0.0.1:9446/health` — liveness. Returns `200` while the node is running.
* `http://127.0.0.1:9446/ready` — readiness. Returns `200` only after the node finishes initialization, or while it keeps operating on the last known configuration during a Wallarm Cloud outage. Returns `503` while the node is still starting or is in a degraded or failed state.

## Configuring the ports

The node uses the following ports to expose its metrics and health endpoints:

| Port | Purpose | Default state | How to change |
| --- | --- | --- | --- |
| `9445` | Aggregated metrics endpoint served by `wd` (recommended for scraping) | Enabled | [NGINX Ingress Controller][IC]: the **config.wallarm.wd.metricsPort** Helm value, plus the per-pod Service ports that must be kept in sync ([read more](configure-kubernetes-en.md#configwallarmwdmetricsport))<br><br>[AIO][AIO] / [Docker][docker] / cloud images: `node.metrics_listen_address` in `/opt/wallarm/etc/wd.yaml` |
| `9446` | Health endpoints (`/health`, `/ready`) served by `wd` | Enabled | [NGINX Ingress Controller][IC]: the **config.wallarm.wd.healthPort** [Helm value](configure-kubernetes-en.md#configwallarmwdhealthport)<br><br>[AIO][AIO] / [Docker][docker] / cloud images: `node.healthcheck_listen_address` in `/opt/wallarm/etc/wd.yaml` |
| `9001` | **wstore** metrics source endpoint | Enabled | [NGINX Ingress Controller][IC]: `postanalytics.metrics.listenAddress` sets the port **wstore** listens on; keep the scrape target [`config.wallarm.wd.scrape.wstore.endpoint`](configure-kubernetes-en.md#configwallarmwdscrape) in sync<br><br>[AIO][AIO] / [Docker][docker] / cloud images: `metrics.listenAddress` in `/opt/wallarm/wstore/wstore.yaml`, or the `WALLARM_WSTORE__METRICS__LISTEN_ADDRESS` environment variable, which takes precedence |
| `9003` | **wcli** metrics source endpoint | Enabled | [NGINX Ingress Controller][IC]: fixed at `9003` (the **wcli** default, not exposed as a Helm value)<br><br>[AIO][AIO] / [Docker][docker] / cloud images: the `WALLARM_WCLI__METRICS__LISTEN_ADDRESS` and `WALLARM_WCLI__METRICS__ENDPOINT` environment variables, which set the listen address and the metrics path, respectively |
| `9010` (also aggregated into `9445` in the [NGINX Ingress Controller][IC]) | API Firewall metrics endpoint | Disabled | [Enable and configure per deployment][apifw-metrics] |

!!! warning "Keep the `wd` scrape targets in sync"
    Ports `9001`, `9003`, and `9010` are scraped by `wd` at fixed endpoints. If you change a service's metrics port, you also need to update the endpoint `wd` scrapes it from — otherwise `wd` stops collecting that service's metrics and it disappears from the aggregated `9445` endpoint:

    * **[NGINX Ingress Controller][IC]** — update the matching `config.wallarm.wd.scrape.<component>.endpoint` Helm value.
    * **[All-in-one installer][AIO], [Docker image][docker], and cloud images** — update the matching `metrics_endpoint` under `processes` in `/opt/wallarm/etc/wd.yaml`.
