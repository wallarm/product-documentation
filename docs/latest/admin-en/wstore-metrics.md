[nginx-node-6.4.1]: ../updating-migrating/node-artifact-versions.md#641-2025-08-07
[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[AIO]: ../installation/nginx/all-in-one.md
[docker]: ../admin-en/installation-docker-en.md
[IC]: ../admin-en/installation-kubernetes-en.md
[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md
[nginx-node-metrics]:  ../admin-en/nginx-node-metrics.md
[wstore-metrics]: ../admin-en/wstore-metrics.md
[postanalytics-module]: ../admin-en/installation-postanalytics-en.md
[aws-ami]: ../installation/packages/aws-ami.md
[gcp]: ../installation/packages/gcp-machine-image.md

# Postanalytics and General System Metrics of the NGINX Node

!!! info "Supported Node version and deployment options"
    The metrics are available for the following deployment options: [all-in-one installer][AIO], [Docker image][docker], cloud images ([AWS AMI][aws-ami] and [GCP Machine Image][gcp]). [NGINX Ingress Controller][IC] and [Sidecar][sidecar] do not support general metrics yet.

This article describes the Postanalytics module and the general system metrics of the NGINX Node to help monitor and troubleshoot the NGINX Node.

* The [Postanalytics module][postanalytics-module] uses **wstore** for local traffic processing. Its metrics are prefixed with **wallarm_wstore_** and reflect the performance of the Postanalytics module. 

    The available metric groups are listed [below](#connections-and-traffic-metrics). The exact list of metrics may vary depending on the NGINX Node version. Changes are reflected in the [NGINX Node changelog][nginx-node-changelog].

* The [general system metrics](#general-system-metrics) of the NGINX Node cover network activity, request processing, queue states, storage efficiency, and internal engine health.

## Metrics endpoint

By default, the NGINX Node provides general metrics at the following endpoint:

```bash
http://localhost:9001/metrics
```

This endpoint is accessible only from the server itself. 
!!! info "Security note"
    Unless you need to publicly expose the metrics endpoint (e.g., to run a Prometheus metrics scraper), we recommend using the default `localhost` listen address.

You can change the default metrics host and port (`http://localhost:9001/metrics`) in the following ways:

* Change `metrics.listenAddress` in the `/opt/wallarm/wstore/wstore.yaml` file.
* Provide the `WALLARM_WSTORE__METRICS__LISTEN_ADDRESS` environment variable when deploying the NGINX Node (e.g. from a Docker image or NGINX Ingress Controller).

    !!! info "Environment variable precedence"
        Environment variables take precedence over the values set in `/opt/wallarm/wstore/wstore.yaml.` For example, if the `metrics.listenAddress` in the YAML file is set to `0.0.0.0:9005`, but the `WALLARM_WSTORE__METRICS__LISTEN_ADDRESS` environment variable is set to `127.0.0.1:9005`, the metrics will be available only at `http://127.0.0.1:9005/metrics`.

## Connections and traffic metrics
---
### `wallarm_wstore_connections_total`

The total number of network connections handled by wstore, broken down by connection type (i.e., protocol schema like TCP or TLS).

**Type**: Counter
**Labels**: 
* `TCP` 
* `TLS`
**Unit**: Count 
**Example**:
```
wallarm_wstore_connections_total{schema="TCP"} 219
```
---
### `wallarm_wstore_current_connections`

The number of active connections currently established with wstore.

**Type**: Gauge
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_current_connections 9
```
---
### `wallarm_wstore_requests_total`

The total number of requests processed, labeled by the request code and the result of the operation (`success` or `failed`).

**Type**: Counter
**Labels**: 
* `code` - type of the IPROTO request (e.g., `IPROTO_CALL`, `IPROTO_CALL_16`, `IPROTO_ID`, etc.)
* `result` - result of the operation (`success` or `failed`)
**Unit**: Count
**Example**:
```
wallarm_wstore_requests_total{code="IPROTO_CALL_16",result="success"} 5962210
```
---
### `wallarm_wstore_iproto_calls_total`

The total number of iproto CALL/CALL_16 requests, broken down by the function name and result.

**Type**: Counter
**Labels**: 
* `func` - name of the called function
* `result` - result of the operation (`success` or `failed`)
**Unit**: Count 
**Example**:
```
wallarm_wstore_iproto_calls_total{func="wallarm.blocked_stat.read",result="success"} 621473
```

## Request throttling and load shedding
---
### `wallarm_wstore_throttle_mode`

Shows if wstore is currently throttling requests due to severely insufficient resources. When this metric is `1.0`, wstore is dropping some incoming requests because system resources are critically low.

**Type**: Gauge
**Labels**: None
**Unit**: Count
**Example**:
```
wallarm_wstore_throttle_mode 0
```
---
### `wallarm_wstore_throttled_requests`

The number of requests throttled due to severely insufficient resources, broken down by schema (TCP or TLS).

**Type**: Counter
**Labels**: 
* `TCP`
* `TLS`
**Unit**: Count
**Example**:
```
wallarm_wstore_throttled_requests{schema="TLS"} 0
```
---
### `wallarm_wstore_queue_throttled`

The number of requests rejected due to queue throttling, broken down by queue.

**Type**: Counter
**Labels**: `queue` - name of the wstore queue
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_throttled{queue="appstructure"} 0
```

## Request queue metrics
---
### `wallarm_wstore_queue_size`

The current number of requests in each wstore queue. 

**Type**: Gauge
**Labels**: 
* `engine` - e.g., `ring`
* `name` - name of the wstore queue
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_size{engine="ring",name="api_discovery"} 0
```
---
### `wallarm_wstore_queue_drops`

The number of requests dropped when a wstore queue reaches its maximum size and begins overwriting entries in the ring buffer, broken down by queue.
	
**Type**: Counter
**Labels**: `queue` - name of the wstore queue
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_drops{queue="appstructure"} 0
```
---
### `wallarm_wstore_queue_take_requests`

The number of requests returned from the queue by the `wallarm.requests_processing.take` function, labeled by the result of the operation (`success` or `failed`).

**Type**: Counter
**Labels**: 
* `queue` - name of the wstore queue
* `result` - result of the operation (`success` or `failed`)
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_take_requests{queue="appstructure", result="success"} 313187
```
---
### `wallarm_wstore_queue_ack_drops`

The number of acknowledgement attempts for requests that have already been removed from the wstore queue.

**Type**: Counter
**Labels**: `queue` - name of the wstore queue
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_ack_drops{queue="appstructure"} 0
```
---
### `wallarm_wstore_queue_ack_return`

The number of requests that were captured but not acknowledged, and were therefore returned to the queue for reprocessing.

**Type**: Counter
**Labels**: 
* `queue` - name of the wstore queue
* `result` - result of the operation (`success` or `failed`)
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_ack_return{queue="appstructure",result="failed"} 0
```
---
### `wallarm_wstore_queue_stats`

The total number of `put`, `ack`, and `take` actions per queue, maintained for backward compatibility.

**Type**: Counter
**Labels**: none
* `queue` - name of the wstore queue
* `action` - type of the queue operation (`put`, `take`, or `ack`)
**Unit**: Count 
**Example**:
```
wallarm_wstore_queue_stats{queue="appstructure",action="ack"} 770
```

## Request storage metrics
---
### `wallarm_wstore_request_storage_total_size`

The total size of all stored requests in bytes.

**Type**: Gauge
**Labels**: None
**Unit**: Bytes
**Example**:
```
wallarm_wstore_request_storage_total_size 2285568
```
---
### `wallarm_wstore_request_storage_timeframe_size`

Current time span in seconds between the oldest and newest requests stored in wstore.

**Type**: Gauge
**Labels**: None
**Unit**: Seconds
**Example**:
```
wallarm_wstore_request_storage_timeframe_size 308775
```
---
### `wallarm_wstore_request_storage_drops` 

The number of old requests dropped to make room for new ones when the maximum request storage size is reached.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_request_storage_drops 0
```
---
### `wallarm_wstore_request_storage_rejects`

The number of incoming requests rejected because they are too large to be stored.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_request_storage_rejects 0
```
---
### `wallarm_wstore_request_storage_misses`

The number of attempts to retrieve full request information for dropped or stale requests.

**Type**: Counter
**Labels**: None
**Unit**: Count
**Example**:
```
wallarm_wstore_request_storage_misses 0
```

## Internal wstore engine metrics
---
### `wallarm_wstore_kvstore_records_total` 

The total number of records currently stored in the wstore key-value store. 

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_records_total 770
```
---
### `wallarm_wstore_kvstore_cleanups` 

The number of old requests cleaned up from the wstore internal key-value store.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_cleanups 0
```
---
### `wallarm_wstore_kvstore_errors` 

The number of errors in the wstore internal key-value store operations, labeled by action type (e.g., cleanup, insert, or drop). 

**Type**: Counter
**Labels**: 
* `cleanup` 
* `drop`
* `get_size` 
* `insert`
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_errors{action="cleanup"} 0
```
---
### `wallarm_wstore_kvstore_oom_errors_total`

The number of Out Of Memory (OOM) errors occurred during insertion into the wstore key-value store.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_oom_errors_total 0
```
---
### `wallarm_wstore_kvstore_insertions_total` 

The number of requests successfully stored by the wstore into its key-value store.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_insertions_total 770
```
---
### `wallarm_wstore_kvstore_lost_insertions_total`

The number of requests failed to be stored in the wstore key-value store after all retry attempts.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_lost_insertions_total 0
```
---
### `wallarm_wstore_kvstore_drops_total` 

The number of requests lost due to failed cleanups from the wstore internal key-value store.

**Type**: Counter
**Labels**: None
**Unit**: Count 
**Example**:
```
wallarm_wstore_kvstore_drops_total 0
```

## General system metrics

We can divide general system metrics into two groups:

* Prometheus Go metrics, prefixed with **go_** and **process_**
  Most Prometheus Go metrics are documented [here](https://demo.akvorado.net/api/v0/inlet/metrics). If a metric is missing there, refer to the [official Go metrics documentation](https://pkg.go.dev/runtime/metrics).
* Prometheus metrics, prefixed with **metrics_push**, related to its [push gateway](https://github.com/prometheus/pushgateway).

### Example of general system metrics

See the example of general system metrics below.

```
go_sched_latencies_seconds_bucket{le="0"} 0
go_sched_latencies_seconds_bucket{le="2.56e-07"} 816039
go_sched_latencies_seconds_bucket{le="4.48e-07"} 827976
go_sched_latencies_seconds_bucket{le="7.68e-07"} 869327
go_sched_latencies_seconds_bucket{le="1.28e-06"} 957726
go_sched_latencies_seconds_bucket{le="2.048e-06"} 968265
go_sched_latencies_seconds_bucket{le="3.584e-06"} 969153
go_sched_latencies_seconds_bucket{le="6.144e-06"} 970483
go_sched_latencies_seconds_bucket{le="1.024e-05"} 982774
go_sched_latencies_seconds_bucket{le="1.6384e-05"} 995458
go_sched_latencies_seconds_bucket{le="3.2768e-05"} 1020230
go_sched_latencies_seconds_bucket{le="5.7344e-05"} 1028124
go_sched_latencies_seconds_bucket{le="9.8304e-05"} 1044716
go_sched_latencies_seconds_bucket{le="0.00016384"} 1053476
go_sched_latencies_seconds_bucket{le="0.000262144"} 1055351
go_sched_latencies_seconds_bucket{le="0.000458752"} 1055933
go_sched_latencies_seconds_bucket{le="0.000786432"} 1056114
go_sched_latencies_seconds_bucket{le="0.00131072"} 1056183
go_sched_latencies_seconds_bucket{le="0.002097152"} 1056205
go_sched_latencies_seconds_bucket{le="0.003670016"} 1056218
go_sched_latencies_seconds_bucket{le="0.007340032"} 1056223
go_sched_latencies_seconds_bucket{le="0.012582912"} 1056224
go_sched_latencies_seconds_bucket{le="0.02097152"} 1056224
go_sched_latencies_seconds_bucket{le="0.033554432"} 1056224
go_sched_latencies_seconds_bucket{le="0.058720256"} 1056224
go_sched_latencies_seconds_bucket{le="0.100663296"} 1056224
go_sched_latencies_seconds_bucket{le="0.16777216"} 1056224
go_sched_latencies_seconds_bucket{le="0.268435456"} 1056224
go_sched_latencies_seconds_bucket{le="0.469762048"} 1056224
go_sched_latencies_seconds_bucket{le="0.805306368"} 1056224
go_sched_latencies_seconds_bucket{le="+Inf"} 1056224
go_mutex_wait_seconds_total 1.027316512
go_gc_mark_assist_cpu_seconds_total 0.193795962
go_gc_cpu_seconds_total 15.027754458
go_gc_pauses_seconds_bucket{le="0"} 0
go_gc_pauses_seconds_bucket{le="2.56e-07"} 0
go_gc_pauses_seconds_bucket{le="4.48e-07"} 0
go_gc_pauses_seconds_bucket{le="7.68e-07"} 0
go_gc_pauses_seconds_bucket{le="1.28e-06"} 0
go_gc_pauses_seconds_bucket{le="2.048e-06"} 0
go_gc_pauses_seconds_bucket{le="3.584e-06"} 32
go_gc_pauses_seconds_bucket{le="6.144e-06"} 1205
go_gc_pauses_seconds_bucket{le="1.024e-05"} 1242
go_gc_pauses_seconds_bucket{le="1.6384e-05"} 1255
go_gc_pauses_seconds_bucket{le="3.2768e-05"} 1271
go_gc_pauses_seconds_bucket{le="5.7344e-05"} 1901
go_gc_pauses_seconds_bucket{le="9.8304e-05"} 2268
go_gc_pauses_seconds_bucket{le="0.00016384"} 2476
go_gc_pauses_seconds_bucket{le="0.000262144"} 2516
go_gc_pauses_seconds_bucket{le="0.000458752"} 2531
go_gc_pauses_seconds_bucket{le="0.000786432"} 2534
go_gc_pauses_seconds_bucket{le="0.00131072"} 2535
go_gc_pauses_seconds_bucket{le="0.002097152"} 2536
go_gc_pauses_seconds_bucket{le="0.003670016"} 2536
go_gc_pauses_seconds_bucket{le="0.007340032"} 2536
go_gc_pauses_seconds_bucket{le="0.012582912"} 2536
go_gc_pauses_seconds_bucket{le="0.02097152"} 2536
go_gc_pauses_seconds_bucket{le="0.033554432"} 2536
go_gc_pauses_seconds_bucket{le="0.058720256"} 2536
go_gc_pauses_seconds_bucket{le="0.100663296"} 2536
go_gc_pauses_seconds_bucket{le="0.16777216"} 2536
go_gc_pauses_seconds_bucket{le="0.268435456"} 2536
go_gc_pauses_seconds_bucket{le="0.469762048"} 2536
go_gc_pauses_seconds_bucket{le="0.805306368"} 2536
go_gc_pauses_seconds_bucket{le="+Inf"} 2536
go_scavenge_cpu_seconds_total 0.038856161
go_memlimit_bytes 268435474
go_memstats_alloc_bytes 6632192
go_memstats_alloc_bytes_total 4487035016
go_memstats_buck_hash_sys_bytes 1542555
go_memstats_frees_total 57745842
go_memstats_gc_cpu_fraction 1.5140983548901717e-05
go_memstats_gc_sys_bytes 3229040
go_memstats_heap_alloc_bytes 6632192
go_memstats_heap_idle_bytes 7626752
go_memstats_heap_inuse_bytes 8560640
go_memstats_heap_objects 155814
go_memstats_heap_released_bytes 5586944
go_memstats_heap_sys_bytes 16187392
go_memstats_last_gc_time_seconds 1.758868905210066e+09
go_memstats_lookups_total 0
go_memstats_mallocs_total 57901656
go_memstats_mcache_inuse_bytes 2416
go_memstats_mcache_sys_bytes 15704
go_memstats_mspan_inuse_bytes 182560
go_memstats_mspan_sys_bytes 244800
go_memstats_next_gc_bytes 10929562
go_memstats_other_sys_bytes 822373
go_memstats_stack_inuse_bytes 589824
go_memstats_stack_sys_bytes 589824
go_memstats_sys_bytes 22631688
go_cgo_calls_count 1904401
go_cpu_count 2
go_gc_duration_seconds{quantile="0"} 3.6523e-05
go_gc_duration_seconds{quantile="0.25"} 4.787e-05
go_gc_duration_seconds{quantile="0.5"} 5.6904e-05
go_gc_duration_seconds{quantile="0.75"} 7.4028e-05
go_gc_duration_seconds{quantile="1"} 0.000439733
go_gc_duration_seconds_sum 0.104412153
go_gc_duration_seconds_count 1268
go_gc_forced_count 301
go_gomaxprocs 2
go_goroutines 26
go_threads 9
go_info{version="go1.24.7"} 1
go_info_ext{compiler="gc", GOARCH="amd64", GOOS="linux", GOROOT="/usr/local/go"} 1
process_cpu_seconds_system_total 113.59
process_cpu_seconds_total 288.81
process_cpu_seconds_user_total 175.22
process_major_pagefaults_total 0
process_minor_pagefaults_total 258249
process_num_threads 8
process_resident_memory_bytes 25722880
process_start_time_seconds 1758823717
process_virtual_memory_bytes 1269948416
process_virtual_memory_peak_bytes 1269972992
process_resident_memory_peak_bytes 27258880
process_resident_memory_anon_bytes 14712832
process_resident_memory_file_bytes 11010048
process_resident_memory_shared_bytes 0
process_io_read_bytes_total 92285231
process_io_written_bytes_total 45150921
process_io_read_syscalls_total 3054357
process_io_write_syscalls_total 1544255
process_io_storage_read_bytes_total 0
process_io_storage_written_bytes_total 0
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.136e+04...1.292e+04"} 1496
metrics_push_block_size_bytes_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.292e+04...1.468e+04"} 10
metrics_push_block_size_bytes_sum{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 18111962
metrics_push_block_size_bytes_count{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 1506
metrics_push_bytes_pushed_total{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 18111962
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="7.743e-02...8.799e-02"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.000e-01...1.136e-01"} 772
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.136e-01...1.292e-01"} 560
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.292e-01...1.468e-01"} 102
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.468e-01...1.668e-01"} 21
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.668e-01...1.896e-01"} 7
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.896e-01...2.154e-01"} 13
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="2.154e-01...2.448e-01"} 6
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="2.783e-01...3.162e-01"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="3.162e-01...3.594e-01"} 2
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="3.594e-01...4.084e-01"} 13
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="4.642e-01...5.275e-01"} 3
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="5.275e-01...5.995e-01"} 2
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="8.799e-01...1.000e+00"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.136e+00...1.292e+00"} 1
metrics_push_duration_seconds_bucket{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics",vmrange="1.896e+01...2.154e+01"} 1
metrics_push_duration_seconds_sum{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 205.05650109099986
metrics_push_duration_seconds_count{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 1506
metrics_push_errors_total{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 1
metrics_push_interval_seconds{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 30
metrics_push_total{url="https://api.wallarm.com:443/v2/node/stat/victoriametrics"} 1506
```