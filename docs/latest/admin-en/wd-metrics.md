[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md

# Wallarm Daemon (wd) Metrics of the NGINX Node

The `wd` (Wallarm Daemon) service manages the NGINX Node's processes. This page describes the `wd` service's own Prometheus metrics.

## What the `wd` service does

The `wd` service is the node's supervisor and is responsible for:

* **Process supervision** — starts the node's services (**wstore**, **wcli**, API Firewall), monitors their state, and restarts them on failure.
* **Node registration and synchronization** — registers the node with the Wallarm Cloud and continuously synchronizes its configuration and attack-detection resources (custom ruleset, proton.db, IP lists, IP feeds, and API specifications), reloading them as they change.
* **Metrics aggregation** — collects the metrics of all managed services and serves them on a single aggregated endpoint (`http://localhost:9445/metrics` by default).
* **Health reporting** — exposes [readiness and liveness endpoints](nginx-node-metrics.md#health-endpoints).

## Limitations

`wd` metrics are not yet available for [Sidecar][sidecar].

## Metrics endpoint

Starting from NGINX Node 7.1.0, the `wd` metrics are returned on the following aggregated endpoint, along with the other Node metrics:

```
http://127.0.0.1:9445/metrics
```

To change the port, see [Configuring the ports](nginx-node-metrics.md#configuring-the-ports).

## Process supervision metrics

The `wd` service exposes its own `wallarm_wd_*` metrics that describe how it supervises the node's processes — as opposed to the functional metrics that each service emits about its own work:

* `wallarm_wd_up` and `wallarm_wd_start_timestamp` — supervisor availability and start time.
* `wallarm_wd_managed_processes` — number of managed processes.
* `wallarm_wd_process_state`, `wallarm_wd_process_restarts_total`, `wallarm_wd_process_uptime_seconds`, and `wallarm_wd_process_last_exit_code` — per-process state, restarts, uptime, and last exit code (labeled by process `name`).
* `wallarm_wd_scrape_errors_total` — errors encountered while scraping the managed processes.
* `metrics_push_*` — counters for pushing metrics to the Wallarm Cloud (for example, `metrics_push_total`, `metrics_push_errors_total`, and `metrics_push_bytes_pushed_total`).
