[nginx-node-landing]:  ../installation/nginx-native-node-internals.md#nginx-node
[nginx-node-6.4.1]: ../updating-migrating/node-artifact-versions.md#641-2025-08-07
[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[AIO]: ../installation/nginx/all-in-one.md
[docker]: ../admin-en/installation-docker-en.md
[IC]: ../admin-en/installation-kubernetes-en.md
[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md
[wstore-metrics]: ../admin-en/wstore-metrics.md
[apifw-metrics]: ../admin-en/apifw-metrics.md
[api-spec-enforcement]: ../api-specification-enforcement/overview.md
[wcli-metrics]: ../admin-en/wcli-metrics.md

# Monitoring the NGINX Node Metrics

The [NGINX Node][nginx-node-landing] exposes metrics in the [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format, which you can use to monitor its performance, traffic, and detected attacks. This topic provides an overview of these metrics. For detailed information on each metric type, refer to its dedicated topic.

There are 4 types of metrics available:

* [Postanalytics metrics][wstore-metrics] — include Postanalytics module **wstore** metrics, available by default at the `http://localhost:9001/metrics` endpoint.
* [**wcli** Controller metrics][wcli-metrics] — provide data from the service that runs most Wallarm functional components (e.g., brute-force detection or attack export to the Cloud).
* [API Firewall metrics][apifw-metrics] — available by default at `http://<host>:9010/metrics` endpoint.

    The API Firewall service underlies the [API Specification Enforcement][api-spec-enforcement] feature.
* Node process metrics — expose the state of the processes managed by the `wd` service, available by default at the `http://localhost:9445/metrics` endpoint. See [Node process metrics and health endpoints](#node-process-metrics-and-health-endpoints).

## Node process metrics and health endpoints

Starting from NGINX Node 7.1.0, the node processes are managed by the `wd` service, which exposes their state through a metrics endpoint and health endpoints.

### Node process metrics

The `wd` service serves aggregated metrics in the Prometheus format at `http://localhost:9445/metrics` (the port is configurable). Along with the metrics of the underlying services, it exposes `wallarm_wd_*` metrics that describe the supervisor and the processes it manages, including:

* `wallarm_wd_up` and `wallarm_wd_start_timestamp` — supervisor availability and start time.
* `wallarm_wd_managed_processes` — number of managed processes.
* `wallarm_wd_process_state`, `wallarm_wd_process_restarts_total`, `wallarm_wd_process_uptime_seconds`, and `wallarm_wd_process_last_exit_code` — per-process state, restarts, uptime, and last exit code (labeled by process `name`).
* `wallarm_wd_scrape_errors_total` and the metrics push error counters (`wallarm_wd_metrics_push_errors_total`, `wallarm_wd_4xx_total`, `wallarm_wd_5xx_total`).

The existing `wallarm_wstore_*` (port 9001) and `wallarm_wcli_*` (port 9003) metrics are unchanged.

### Health endpoints

The `wd` service exposes readiness and liveness endpoints at `http://localhost:9446` (the port is configurable):

* `/health` — liveness. Returns `200` while the service is running.
* `/ready` — readiness. Returns `200` only after the node finishes initialization, or while it keeps operating on the last known configuration during a Wallarm Cloud outage. Returns `503` while the node is still starting or is in a degraded or failed state.

Use `/ready` for orchestrator readiness probes (for example, a Kubernetes `readinessProbe`) so that traffic reaches the node only after it is fully initialized.
