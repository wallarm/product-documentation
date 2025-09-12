[nginx-node-6.4.1]: ../updating-migrating/node-artifact-versions.md#641-2025-08-07
[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[AIO]: ../installation/nginx/all-in-one.md
[inline]:  ../installation/nginx-native-node-internals.md#in-line
[docker]: ../admin-en/installation-docker-en.md
[IC]: ../admin-en/installation-kubernetes-en.md
[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md
[nginx-node-metrics]:  ../admin-en/nginx-node-metrics.md
[wstore-metrics]: ../admin-en/wstore-metrics.md

# Monitoring General Metrics

!!! info "Supported Node version and deployment options"
    General metrics are available in [NGINX Node 6.4.1][nginx-node-6.4.1] and later for the following deployment options: [all-in-one installer][AIO], [cloud images][inline], and [Docker image][docker]. [NGINX Ingress Controller][IC] and [Sidecar][sidecar] do not support general metrics yet.

General metrics are a type of metrics available for [monitoring the NGINX node][nginx-node-metrics]. 

Before the [6.4.1 release][nginx-node-6.4.1], NGINX node metrics were based on external tools. To meet client requests, we replaced those with the built-in Wallarm **wstore** service.

General metrics include **wstore** metrics and general system metrics (e.g., Go runtime, memory usage, process stats, etc.) in the Prometheus format. **wstore** metrics reflect network activity, request processing, queue states, storage efficiency, and internal engine health, helping you monitor and troubleshoot the NGINX node.

By default, the NGINX Node provides general metrics at the following endpoint:

```bash
http://localhost:9001/metrics
```

This endpoint is accessible only from the local machine. To view it in your browser, you need to either run a browser on the server, use curl from the command line on the server, or establish an SSH tunnel.

!!! info "Security note"
    Unless you specifically need to expose port 9001 (e.g., to run a Prometheus metrics scraper), we recommend keeping the port bound to localhost.

You can change the default metrics host and port (`http://localhost:9001/metrics`) in the following ways:

* Change `metrics.listenAddress` in the `/opt/wallarm/wstore/wstore.yaml` file.
* Provide the `WALLARM_WSTORE_METRICS_LISTEN_ADDRESS` environment variable when deploying the NGINX Node (e.g. from a Docker image or NGINX Ingress Controller).

    !!! info "Environment variable precedence"
        Environment variables take precedence over the values set in `/opt/wallarm/wstore/wstore.yaml.` For example, if the `metrics.listenAddress` in the YAML file is set to `localhost:9003`, but the `WALLARM_WSTORE_METRICS_LISTEN_ADDRESS` environment variable is set to `0.0.0.0:9005`, the metrics will be available at `http://localhost:9005/metrics`.

The available metric groups are listed below. The exact list of metrics may vary depending on the NGINX Node version. Changes are reflected in the [NGINX Node changelog][nginx-node-changelog].

!!! info "**wstore** metrics"
    We focus only on describing Wallarm-specific **wstore** metrics, which follow the `wallarm_wstore_*` naming pattern. General system metrics are not covered.

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
