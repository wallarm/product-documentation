[AIO]: ../installation/nginx/all-in-one.md
[docker]: ../admin-en/installation-docker-en.md
[aws-ami]: ../installation/packages/aws-ami.md
[gcp]: ../installation/packages/gcp-machine-image.md
[IC]: ../admin-en/installation-kubernetes-en.md
[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md
[sidecar-helm-chart]: ../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwclimetricsenabled
[sidecar-deployment]: ../installation/kubernetes/sidecar-proxy/deployment.md
[sidecar-upgrade]: ../updating-migrating/sidecar-proxy.md
[ic-helm-chart]: ../admin-en/configure-kubernetes-en.md#controllerwallarmwclipostanalyticsmetricsenabled
[ic-deployment]: ../admin-en/installation-kubernetes-en.md
[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[nginx-node-6.6.0]: ../updating-migrating/node-artifact-versions.md#660-2025-10-03
[api-abuse-prevention]: ../api-abuse-prevention/overview.md
[cred-stuffing]: ../about-wallarm/credential-stuffing.md
[jwt-tokens]: ../updating-migrating/older-versions/what-is-new.md#checking-json-web-token-strength
[api-discovery]: ../api-discovery/overview.md

# wcli Controller Metrics of the NGINX Node

Current NGINX Node version: {{ nginx_node_version }}

```
Current NGINX Node version: {{ nginx_node_version }}
```

```yaml
Current NGINX Node version: {{ nginx_node_version }}
```

This article describes the metrics of the **wcli** Controller of the NGINX Node to help monitor and troubleshoot the NGINX Node.

* The **wcli** metrics provide data from the service that runs most Wallarm functional components, including brute-force detection, attack export to the Cloud, and Node-Cloud synchronization status.

    The available metric groups are listed [below](#general-wcli-controller-system-metrics).

    Each metric group has its own prefix that reflects the service it represents (e.g., `wallarm_wcli_credstuff_*` includes metrics related to [Credential Stuffing Detection][cred-stuffing], while `wallarm_api_discovery_*` covers [API Discovery][api-discovery] metrics, etc.)
    
    The exact list of metrics may vary depending on the NGINX Node version. Changes are reflected in the [NGINX Node changelog][nginx-node-changelog].

* The **wcli** [service runtime metrics](#service-runtime-metrics) of the NGINX Node cover network activity, request processing, queue states, storage efficiency, and internal engine health.

## Metrics endpoint

The **wcli** metrics are available by default for all deployment types. However, the metrics endpoint differs:

Deployment type | Metric endpoint
--- | ---- 
[Docker image][docker], [all-in-one installer][AIO], and cloud images | `http://localhost:9003/metrics` 
[NGINX Ingress Controller][IC] and [Sidecar][sidecar] | `http://<host>:9003/metrics`

You can change the default metrics host and endpoint. See the instructions for your specific deployment type below.

**For [Docker image][docker], [all-in-one installer][AIO], and cloud images ([AWS AMI][aws-ami], [GCP Machine Image][gcp]):**

Specify the `WALLARM_WCLI__METRICS__LISTEN_ADDRESS` and `WALLARM_WCLI__METRICS__ENDPOINT` environment variables to the desired host and endpoint, respectively. 

To disable the **wcli** metrics, specify an empty value in `WALLARM_WCLI__METRICS__LISTEN_ADDRESS`.

**For [NGINX Ingress Controller][IC]:**

Edit the [`controller.wallarm.wcliPostanalytics.metrics*`][ic-helm-chart] values in the Helm Chart during NGINX Ingress Controller [deployment][ic-deployment] or upgrade.

```yaml hl_lines="8 12 14"
controller:
  wallarm:
    wcliPostanalytics:
      metrics:
        # -- Enable metrics collection
        enabled: true
        # -- Port for metrics endpoint
        port: 9003
        # -- Port name for metrics endpoint
        portName: wcli-post-mtrc
        # -- Path at which the metrics endpoint is exposed (optional, defaults to /metrics if not specified)
        endpointPath: ""
        # -- IP address and/or port for the metrics endpoint (e.g., ":9003" or "127.0.0.1:9003")
        host: ":9003"
```

**For [Sidecar][sidecar]:**

Edit the [`config.wallarm.wcli.metrics.*`][sidecar-helm-chart] values in the Helm Chart during Sidecar [deployment][sidecar-deployment] or [upgrade][sidecar-upgrade]. 

```yaml hl_lines="11 15"
config:
  # Other configuration values...
  wcli:
    metrics:
      ### Enable/disable wcli metrics endpoint
      ###
      enabled: true
      ### IP address and port for the wcli metrics endpoint
      ### Default: ":9003"
      ###
      listenAddress: ":9003"
      ### The path at which the wcli metrics endpoint is exposed
      ### Default: "/metrics"
      ###
      endpoint: "/metrics"
```

## General wcli Controller system metrics

General system health metrics for the **wcli** Controller. Tracks job errors, export timing, Wallarm Cloud connectivity, and subscription status. Useful for monitoring overall system operation and performance.

---
### `wallarm_wcli_job_error`

Reports errors occurred in the **wcli** service. The `component` label specifies the job that encountered the error, and the `code` label specifies the error type.

**Type:** Counter

**Labels**:

* `component` – name of the job (`blkexp`, `botexp`, `credstuff`, `datasync`, etc.)

* `code` – numeric code describing the error:    
    * `0`	- Technical value, should not occur
    * `1`	- Unknown – default error
    * `2`	- Internal – e.g. file read/write failure
    * `3`	- Not found – missing referenced resource
    * `4`	- Bad argument – invalid user input
    * `5`	- Canceled – usually by kill signal
    * `6`	- Init – configuration/network startup issues
    * `7`	- API – Wallarm API errors
    * `8`	- Database – errors in request storage
    * `9`	- SQL – SQLite-related issues (e.g. ACL read failure)

**Unit:** Count

**Example:**

```
wallarm_wcli_job_error{component="apispec",code="1"} 0
wallarm_wcli_job_error{component="blkexp",code="1"} 0
wallarm_wcli_job_error{component="botexp",code="1"} 0
```

---
### `wallarm_wcli_job_export_period`

!!! info "Metric availability"
    This metric is available starting from [NGINX Node version 6.6.0][nginx-node-6.6.0].

Reports the interval (in seconds) between the time a request was received by the system and when it was exported by a specific **wcli** job. This metric helps monitor export delays per job.

**Type:** Gauge

**Labels**:

* `component` – name of the job (`blkexp`, `botexp`, `credstuff`, `jwtexp`, etc.)

**Unit:** Seconds

**Example:**

```
wallarm_wcli_job_export_period{component="blkexp"} 15619.140777577
wallarm_wcli_job_export_period{component="botexp"} 15570.112460529
wallarm_wcli_job_export_period{component="cntexp"} 15568.817094894
wallarm_wcli_job_export_period{component="credstuff"} 15619.140557983
wallarm_wcli_job_export_period{component="jwtexp"} 15619.140830117
wallarm_wcli_job_export_period{component="reqexp"} 15608.084553393
```

---
### `wallarm_wcli_cloud_connectivity`

Shows whether the Wallarm cloud is responsive.

!!! info "Metric availability"
    Available only if `WALLARM_WCLI_CLOUD_PROBE_METRICS` environment variable is set to `1`.

**Type:** Gauge

**Labels:** None

**Unit:** Boolean (`0` or `1`)

**Example:**

```
wallarm_wcli_cloud_connectivity 1
```

---
### `wallarm_wcli_subscription_active`

Shows whether the Wallarm subscription is currently active.

!!! info "Metric availability"
    Available only if `WALLARM_WCLI_CLOUD_PROBE_METRICS` environment variable is set to `1`.

**Type:** Gauge

**Labels:** None

**Unit:** Boolean (0 or 1)

**Example:**

```
wallarm_wcli_subscription_active 1
```

## Bot feature extraction (botexp) metrics

Metrics from the bot feature extraction `botexp` job used by the [API Abuse Prevention module][api-abuse-prevention] to analyze and detect automated traffic (bots).

---
### `go_feature_extractor_processing_duration_seconds`

Average time the `botexp` job spent processing requests.

**Type:** Histogram

**Labels:** None

**Unit:** Seconds

**Example:**

```
go_feature_extractor_processing_duration_seconds_bucket{le="0.1"} 15
```

---
### `go_feature_extractor_fetching_duration_seconds`

Average time the `botexp` job spent fetching requests from the request storage, broken down into [histogram buckets](https://prometheus.io/docs/concepts/metric_types/#histogram).
It is also labeled by the result of the send operation (`success` or `error`) and the corresponding partner/client UUID.

**Type:** Histogram

**Labels:**

* `partner_client_uuid` - unique identifier for the Wallarm partner/client instance

* `result` — result of the operation (`success` or `error`)

* `vmrange` — bucket range

**Unit:** Seconds

**Example:**

```
go_feature_extractor_fetching_duration_seconds_bucket{partner_client_uuid="b938ac84-1ac3-11ec-9f1c-4201ac1ff113",result="success",vmrange="1.000e-04...1.136e-04"} 369
```

---
### go_feature_extractor_fetching_request_total`

The total number of requests the `botexp` job fetched from the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
go_feature_extractor_fetching_request_total 104
```

---
### `go_feature_extractor_sending_duration_seconds_bucket`

Average time the `botexp` job spent sending batches of bot requests to the Wallarm Cloud, broken down into [histogram buckets](https://prometheus.io/docs/concepts/metric_types/#histogram) and labeled by the result of the send operation: `success` or `error`.

**Type:** Histogram

**Labels:**:

* `result` — result of the operation (`success` or `error`)

* `vmrange` — bucket range

**Unit:** Seconds

**Example:**

```
go_feature_extractor_sending_duration_seconds_bucket{result="error",vmrange="7.743e-02...8.799e-02"} 1
go_feature_extractor_sending_duration_seconds_bucket{result="success",vmrange="2.783e-01...3.162e-01"} 29
```

---
### `go_feature_extractor_sending_request_total`

The total number of bot requests the `botexp` job sent to the Wallarm Cloud, labeled by the result of the operation (`success` or `error`).

**Type:** Counter

**Labels:** `result` — result of the operation (`success` or `error`)

**Unit:** Count

**Example:**

```
go_feature_extractor_sending_request_total{result="error"} 1
go_feature_extractor_sending_request_total{result="success"} 505
```

---
### `go_feature_extractor_tarantool_queue_total`

The total number of interactions between the `botexp` job and the request storage, labeled by the operation type (e.g., `ack`, `put`, `take`) and the corresponding partner/client UUID.

**Type:** Counter

**Labels:** 

* `type` – interaction type (e.g. ack, put. take)

* `partner_client_uuid` - unique identifier for the Wallarm partner/client instance

**Unit:** Count

**Example:**

```
go_feature_extractor_tarantool_queue_total{partner_client_uuid="b938ac84-1ac3-11ec-9f1c-4201ac1ff113",type="ack"} 505
go_feature_extractor_tarantool_queue_total{partner_client_uuid="b938ac84-1ac3-11ec-9f1c-4201ac1ff113",type="put"} 505
go_feature_extractor_tarantool_queue_total{partner_client_uuid="b938ac84-1ac3-11ec-9f1c-4201ac1ff113",type="take"} 505
go_feature_extractor_tarantool_queue_total{partner_client_uuid="b938ac84-1ac3-11ec-9f1c-4201ac1ff113",type="throttled"} 0

```

## wcli-layer metrics for bot feature extraction (botexp)

Metrics for the `botexp` job (used by the [API Abuse Prevention module][api-abuse-prevention]) at the **wcli** layer. Tracks interactions with the request storage (fetched, skipped, acknowledged, or failed requests) and exports to the Wallarm Cloud (successful and failed). Useful for monitoring `botexp` job activity, reliability, and data flow.

---
### `wallarm_wcli_botexp_tnt_requests`

The total number of GET requests the `botexp` job sent to the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_tnt_requests 505
```

---
### `wallarm_wcli_botexp_tnt_req_errors`

The total number of requests with errors came from the request storage and received by the `botexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_tnt_req_errors 0
```

---
### `wallarm_wcli_botexp_tnt_req_skip`

The total number of skipped requests from the request storage by the `botexp` job. Usually skipped due to specific settings.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_tnt_req_skip 0
```

---
### `wallarm_wcli_botexp_tnt_acks`

The total number of acknowledgment request operations with the request storage by the `botexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_tnt_acks 505
```

---
### `wallarm_wcli_botexp_tnt_acks_failed`

The total number of failed acknowledgment request operations with the request storage by the `botexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_tnt_acks_failed 0
```

---
### `wallarm_wcli_botexp_api_sent`

The total number of exported requests to the Wallarm Cloud by the `botexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_api_sent 505
```

---
### `wallarm_wcli_botexp_api_failed`

The total number of failed export attempts to the Wallarm Cloud by the `botexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_botexp_api_failed 0
```

## Blocked request exporter metrics (blkexp)

Metrics for the `blkexp job`, which tracks the export and processing of blocked requests. Includes counts, processing rates, and export status to the Wallarm Cloud.

---
### `wallarm_wcli_blkexp_tnt_gets`

The total number of GET requests the `blkexp` job sent to the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_blkexp_tnt_gets 0
```

---
### `wallarm_wcli_blkexp_tnt_acks`

The total number of acknowledgment requests the `blkexp` job sent to the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_blkexp_tnt_acks 0
```

---
### `wallarm_wcli_blkexp_tnt_acks_failed`

The total number of failed acknowledgment requests the `blkexp` job sent to the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_blkexp_tnt_acks_failed 0
```

---
### `wallarm_wcli_blkexp_api_send`

The total number of exported requests the `blkexp` job sent to the Wallarm Cloud.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_blkexp_api_send 0
```

---
### `wallarm_wcli_blkexp_api_sent_failed`

The total number of failed export attempts the `blkexp` job sent to the Wallarm Cloud.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_blkexp_api_sent_failed 0
```

## Credential Stuffing Detection metrics (credstuff)

Metrics for the [Credential Stuffing Detection module][cred-stuffing]. Monitors event detection rate, matched credentials, and request processing statistics.

---
### `wallarm_wcli_credstuff_tnt_requests`

The total number of requests the `credstuff` job fetched from the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_credstuff_tnt_requests 0
```

---
### `wallarm_wcli_credstuff_tnt_acks`

The total number of acknowledgment operations with the request storage by the `credstuff` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_credstuff_tnt_acks 0
```

---
### `wallarm_wcli_credstuff_tnt_acks_failed`

The total number of failed acknowledgment operations with the request storage by the `credstuff` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_credstuff_tnt_acks_failed 0
```

---
### `wallarm_wcli_credstuff_requests_processed`

The total number of requests the `credstuff` job successfully processed.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_credstuff_requests_processed 0
```

---
### `wallarm_wcli_credstuff_requests_failed`

The total number of requests the `credstuff` job failed to process.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_credstuff_requests_failed 0
```

## JWT token exporter metrics (jwtexp)

Metrics from the  JWT token exporter, which extracts and analyzes [JSON Web Tokens][jwt-tokens] for authentication and abuse detection.

---
### `wallarm_wcli_jwtexp_tnt_requests`

The total number of requests fetched from the request storage by the `jwtexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_jwtexp_tnt_requests 0
```

---
### `wallarm_wcli_jwtexp_tnt_acks`

The total number of acknowledgment operations with the request storage by the `jwtexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_jwtexp_tnt_acks 0
```

---
### `wallarm_wcli_jwtexp_tnt_acks_failed`

The total number of failed acknowledgment operations with the request storage by the `jwtexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_jwtexp_tnt_acks_failed 0
```

---
### `wallarm_wcli_jwtexp_api_requests_sent`

The total number of exported requests to the Wallarm Cloud by the `jwtexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_jwtexp_api_requests_sent 0
```

---
### `wallarm_wcli_jwtexp_api_requests_failed`

The total number of failed request export attempts to the Wallarm Cloud by the `jwtexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_jwtexp_api_requests_failed 0
```

## Request exporter metrics (reqexp)

Metrics for the request exporter, responsible for sending analyzed HTTP request data from the Postanalytics module to the Wallarm Cloud.

---
### `wallarm_wcli_reqexp_tnt_requests`

The total number of requests the `reqexp` job fetched from the request storage.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_reqexp_tnt_requests 156
```

---
### `wallarm_wcli_reqexp_tnt_acks`

The total number of acknowledgment operations with the request storage by the `reqexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_reqexp_tnt_acks 156
```

---
### `wallarm_wcli_reqexp_tnt_acks_failed`

The total number of failed acknowledgment operations with the request storage by the `reqexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_reqexp_tnt_acks_failed 0
```

---
### `wallarm_wcli_reqexp_api_requests_sent`

The total number of exported requests to the Wallarm Cloud by the `reqexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_reqexp_api_requests_sent 156
```

---
### `wallarm_wcli_reqexp_api_requests_failed`

The total number of failed request export attempts to the Wallarm Cloud by the `reqexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_reqexp_api_requests_failed 0
```

## Counter exporter metrics (cntexp)

Metrics from the counter exporter, tracking aggregated counters and summary statistics used for analytics and reporting.

---
### `wallarm_wcli_cntexp_tnt_counters`

The total number of counters read from the request storage for the `cntexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_cntexp_tnt_counters 869
```

---
### `wallarm_wcli_cntexp_api_counters_sent`

The total number of exported counters to the Wallarm Cloud by the `cntexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_cntexp_api_counters_sent 869
```

---
### `wallarm_wcli_cntexp_api_counters_failed`

The total number of failed counter export attempts to the Wallarm Cloud by the `cntexp` job.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_wcli_cntexp_api_counters_failed 0
```

## API Discovery metrics (api_discovery)

Metrics for the [API Discovery module][api-discovery], which analyzes incoming API requests to identify and catalog API endpoints. Tracks batch processing, memory usage, request filtering, and data flush operations to monitor system activity, performance, and reliability.

---
### `wallarm_api_discovery_datastore_batch_size`

The current size of the batch being processed by the API Discovery datastore. Reflects the amount of memory allocated for the batch before flushing.

**Type:** Gauge

**Labels:** None

**Unit:** Count

**Example:**

```
wallarm_api_discovery_datastore_batch_size 0
```

---
### `api_discovery_client_batch_processing`

Duration histogram of batch operations API Discovery processed.

**Type:** Histogram

**Labels:** None

**Unit:** Seconds

**Example:**

```
api_discovery_client_batch_processing_bucket{le="0.1"} 100
```

---
### `api_discovery_client_batch_count`

The total number of batches API Discovery processed.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
api_discovery_client_batch_count 0
```

---
### `api_discovery_client_request_count`

The number of requests API Discovery processed or filtered. The `result` label specifies the result.

**Type:** Counter

**Labels:** `result` – `processed` or `filtered`

**Unit:** Count

**Example:**

```
api_discovery_client_request_count{result="filtered"} 0
api_discovery_client_request_count{result="processed"} 0
```

---
### `api_discovery_client_flushed_count`

The total number of flush operations API Discovery performed.

**Type:** Counter

**Labels:** None

**Unit:** Count

**Example:**

```
api_discovery_client_flushed_count 0
```

---
### `api_discovery_client_flushed_points_count`

The number of data points API Discovery successfully flushed to the destination or failed to flush. The `result` label shows the result.

**Type:** Counter

**Labels:** `result` - result of the operation (`success` or `failed`)

**Unit:** Count

**Example:**

```
api_discovery_client_flushed_points_count{result="failed"} 0
api_discovery_client_flushed_points_count{result="success"} 0
```

## Service runtime metrics

We can divide service runtime metrics into 2 groups:

* Prometheus Go metrics, prefixed with `go_*` and `process_*`

    Most Prometheus Go metrics are documented [here](https://demo.promlabs.com/metrics). If a metric is missing there, refer to the [official Go metrics documentation](https://pkg.go.dev/runtime/metrics).

* Prometheus metrics, prefixed with `metrics_push_*`, related to its [push gateway](https://github.com/prometheus/pushgateway).

See the example of service runtime metrics below.

```
go_sched_latencies_seconds_bucket{le="0"} 0
go_sched_latencies_seconds_bucket{le="2.56e-07"} 8991916
go_sched_latencies_seconds_bucket{le="4.48e-07"} 9697767
go_sched_latencies_seconds_bucket{le="7.68e-07"} 10568124
go_sched_latencies_seconds_bucket{le="1.28e-06"} 11017954
go_sched_latencies_seconds_bucket{le="2.048e-06"} 11780658
go_sched_latencies_seconds_bucket{le="3.584e-06"} 12107962
go_sched_latencies_seconds_bucket{le="6.144e-06"} 12626567
go_sched_latencies_seconds_bucket{le="1.024e-05"} 14051578
go_sched_latencies_seconds_bucket{le="1.6384e-05"} 15074657
go_sched_latencies_seconds_bucket{le="3.2768e-05"} 15559992
go_sched_latencies_seconds_bucket{le="5.7344e-05"} 15816998
go_sched_latencies_seconds_bucket{le="9.8304e-05"} 15909070
go_sched_latencies_seconds_bucket{le="0.00016384"} 15947082
go_sched_latencies_seconds_bucket{le="0.000262144"} 15960353
go_sched_latencies_seconds_bucket{le="0.000458752"} 15965095
go_sched_latencies_seconds_bucket{le="0.000786432"} 15967240
go_sched_latencies_seconds_bucket{le="0.00131072"} 15968685
go_sched_latencies_seconds_bucket{le="0.002097152"} 15969122
go_sched_latencies_seconds_bucket{le="0.003670016"} 15969239
go_sched_latencies_seconds_bucket{le="0.007340032"} 15969315
go_sched_latencies_seconds_bucket{le="0.012582912"} 15969339
go_sched_latencies_seconds_bucket{le="0.02097152"} 15969341
go_sched_latencies_seconds_bucket{le="0.033554432"} 15969341
go_sched_latencies_seconds_bucket{le="0.058720256"} 15969341
go_sched_latencies_seconds_bucket{le="0.100663296"} 15969341
go_sched_latencies_seconds_bucket{le="0.16777216"} 15969341
go_sched_latencies_seconds_bucket{le="0.268435456"} 15969341
go_sched_latencies_seconds_bucket{le="0.469762048"} 15969341
go_sched_latencies_seconds_bucket{le="0.805306368"} 15969341
go_sched_latencies_seconds_bucket{le="+Inf"} 15969341
go_mutex_wait_seconds_total 10.659191952
go_gc_mark_assist_cpu_seconds_total 7.152239324
go_gc_cpu_seconds_total 143.674639875
go_gc_pauses_seconds_bucket{le="0"} 0
go_gc_pauses_seconds_bucket{le="2.56e-07"} 0
go_gc_pauses_seconds_bucket{le="4.48e-07"} 0
go_gc_pauses_seconds_bucket{le="7.68e-07"} 0
go_gc_pauses_seconds_bucket{le="1.28e-06"} 0
go_gc_pauses_seconds_bucket{le="2.048e-06"} 0
go_gc_pauses_seconds_bucket{le="3.584e-06"} 258
go_gc_pauses_seconds_bucket{le="6.144e-06"} 14497
go_gc_pauses_seconds_bucket{le="1.024e-05"} 15182
go_gc_pauses_seconds_bucket{le="1.6384e-05"} 15377
go_gc_pauses_seconds_bucket{le="3.2768e-05"} 16332
go_gc_pauses_seconds_bucket{le="5.7344e-05"} 23001
go_gc_pauses_seconds_bucket{le="9.8304e-05"} 31750
go_gc_pauses_seconds_bucket{le="0.00016384"} 32830
go_gc_pauses_seconds_bucket{le="0.000262144"} 33147
go_gc_pauses_seconds_bucket{le="0.000458752"} 33266
go_gc_pauses_seconds_bucket{le="0.000786432"} 33301
go_gc_pauses_seconds_bucket{le="0.00131072"} 33312
go_gc_pauses_seconds_bucket{le="0.002097152"} 33323
go_gc_pauses_seconds_bucket{le="0.003670016"} 33325
go_gc_pauses_seconds_bucket{le="0.007340032"} 33327
go_gc_pauses_seconds_bucket{le="0.012582912"} 33328
go_gc_pauses_seconds_bucket{le="0.02097152"} 33328
go_gc_pauses_seconds_bucket{le="0.033554432"} 33328
go_gc_pauses_seconds_bucket{le="0.058720256"} 33328
go_gc_pauses_seconds_bucket{le="0.100663296"} 33328
go_gc_pauses_seconds_bucket{le="0.16777216"} 33328
go_gc_pauses_seconds_bucket{le="0.268435456"} 33328
go_gc_pauses_seconds_bucket{le="0.469762048"} 33328
go_gc_pauses_seconds_bucket{le="0.805306368"} 33328
go_gc_pauses_seconds_bucket{le="+Inf"} 33328
go_scavenge_cpu_seconds_total 1.240800986
go_memlimit_bytes 9223372036854775807
go_memstats_alloc_bytes 17136984
go_memstats_alloc_bytes_total 138086636624
go_memstats_buck_hash_sys_bytes 3912
go_memstats_frees_total 1000151408
go_memstats_gc_cpu_fraction 5.111006308772386e-05
go_memstats_gc_sys_bytes 4058904
go_memstats_heap_alloc_bytes 17136984
go_memstats_heap_idle_bytes 11395072
go_memstats_heap_inuse_bytes 20455424
go_memstats_heap_objects 142997
go_memstats_heap_released_bytes 8650752
go_memstats_heap_sys_bytes 31850496
go_memstats_last_gc_time_seconds 1.7591465749931078e+09
go_memstats_lookups_total 0
go_memstats_mallocs_total 1000294405
go_memstats_mcache_inuse_bytes 2416
go_memstats_mcache_sys_bytes 15704
go_memstats_mspan_inuse_bytes 230880
go_memstats_mspan_sys_bytes 424320
go_memstats_next_gc_bytes 23112410
go_memstats_other_sys_bytes 632536
go_memstats_stack_inuse_bytes 1703936
go_memstats_stack_sys_bytes 1703936
go_memstats_sys_bytes 38689808
go_cgo_calls_count 991161
go_cpu_count 2
go_gc_duration_seconds{quantile="0"} 4.8988e-05
go_gc_duration_seconds{quantile="0.25"} 5.8761e-05
go_gc_duration_seconds{quantile="0.5"} 6.7579e-05
go_gc_duration_seconds{quantile="0.75"} 7.6025e-05
go_gc_duration_seconds{quantile="1"} 0.001981286
go_gc_duration_seconds_sum 1.341063898
go_gc_duration_seconds_count 16664
go_gc_forced_count 0
go_gomaxprocs 2
go_goroutines 197
go_threads 9
go_info{version="go1.24.7"} 1
go_info_ext{compiler="gc", GOARCH="amd64", GOOS="linux", GOROOT="/usr/local/go"} 1
process_cpu_seconds_system_total 1981.87
process_cpu_seconds_total 4652.34
process_cpu_seconds_user_total 2670.47
process_major_pagefaults_total 0
process_minor_pagefaults_total 1415571
process_num_threads 8
process_resident_memory_bytes 43749376
process_start_time_seconds 1758823717
process_virtual_memory_bytes 1278091264
process_virtual_memory_peak_bytes 1278455808
process_resident_memory_peak_bytes 50864128
process_resident_memory_anon_bytes 26710016
process_resident_memory_file_bytes 17039360
process_resident_memory_shared_bytes 0
process_io_read_bytes_total 109873669268
process_io_written_bytes_total 1548031404
process_io_read_syscalls_total 53344941
process_io_write_syscalls_total 14412361
process_io_storage_read_bytes_total 139264
process_io_storage_written_bytes_total 420069376
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="3.162e+04...3.594e+04"} 4
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="3.594e+04...4.084e+04"} 135
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="4.084e+04...4.642e+04"} 125
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="4.642e+04...5.275e+04"} 3819
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="5.275e+04...5.995e+04"} 1298
metrics_push_block_size_bytes_sum{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 271938763
metrics_push_block_size_bytes_count{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 5381
metrics_push_bytes_pushed_total{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 271938763
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.896e-01...2.154e-01"} 118
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="2.154e-01...2.448e-01"} 13
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="2.448e-01...2.783e-01"} 359
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="2.783e-01...3.162e-01"} 4551
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="3.162e-01...3.594e-01"} 162
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="3.594e-01...4.084e-01"} 26
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="4.084e-01...4.642e-01"} 39
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="4.642e-01...5.275e-01"} 70
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="5.275e-01...5.995e-01"} 6
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="5.995e-01...6.813e-01"} 5
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="6.813e-01...7.743e-01"} 7
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="7.743e-01...8.799e-01"} 4
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="8.799e-01...1.000e+00"} 5
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.000e+00...1.136e+00"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.136e+00...1.292e+00"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.668e+00...1.896e+00"} 2
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="4.642e+00...5.275e+00"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="5.275e+00...5.995e+00"} 11
metrics_push_duration_seconds_sum{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 1639.013844672997
metrics_push_duration_seconds_count{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 5381
metrics_push_errors_total{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 1
metrics_push_interval_seconds{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 60
metrics_push_total{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 5381
```
