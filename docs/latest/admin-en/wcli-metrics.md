# wcli Metrics of the NGINX Node

This article describes the **wcli** metrics of the NGINX Node to help monitor and troubleshoot the NGINX Node.


## Metrics endpoint

By default, the NGINX Node provides **wcli** metrics at the following endpoint:

```bash
http://<host>:9003/metrics
```




WALLARM_WCLI__METRICS__LISTEN_ADDRESS and WALLARM_WCLI__METRICS__ENDPOINT env vars for aio, 
cloud images, docker image.
To disable metrics, you need to specify an empty state in WALLARM_WCLI__METRICS__LISTEN_ADDRESS



## General wcli system health

---
### `wallarm_wcli_job_error`

Reports errors occurred in the **wcli** service. The `component` label specifies the job that encountered the error, and the `code` label specifies the error type:

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
    * `7`	- API – cloud API errors
    * `8`	- Database – errors in tarantool/wcli storage
    * `9`	- SQL – SQLite-related issues (e.g. ACL read failure)

**Unit:** Count
**Example:**
```
wallarm_wcli_job_error{component="apispec",code="1"} 0
wallarm_wcli_job_error{component="blkexp",code="1"} 0
wallarm_wcli_job_error{component="botexp",code="1"} 0
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

## botexp – Bot Feature Extraction

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

Average time the `botexp` job spent fetching requests from a request storage (**tarantool**/**wstore**), broken down into [histogram buckets](https://prometheus.io/docs/concepts/metric_types/#histogram).
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

The total number of requests the `botexp` job fetched from request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
go_feature_extractor_fetching_request_total 104
```

---
### `go_feature_extractor_sending_duration_seconds_bucket`

Average time the `botexp` job spent sending batches of bot requests to Wallarm Cloud, broken down into [histogram buckets](https://prometheus.io/docs/concepts/metric_types/#histogram) and labeled by the result of the send operation: `success` or `error`.


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

The total number of bot requests the `botexp` job sent to Wallarm Cloud, labeled by the result of the operation (`success` or `error`).

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

Total number of interactions between the `botexp` job and the request storage (**tarantool**/**wstore**), labeled by the operation type (e.g., `ack`, `put`, `take`) and the corresponding partner/client UUID.


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


## WCLI-layer Metrics

---
### `wallarm_wcli_botexp_tnt_requests`

The total number of GET requests the `botexp` job sent to the request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_tnt_requests 505
```

---
### `wallarm_wcli_botexp_tnt_req_errors`

The total number of requests with errors came from the request storage (tarantool/wstore) and received by the `botexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_tnt_req_errors 0
```

---
### `wallarm_wcli_botexp_tnt_req_skip`

The total number of skipped requests from the request storage (**tarantool**/**wstore**) by the `botexp` job. Usually skipped due to specific settings.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_tnt_req_skip 0
```

---
### `wallarm_wcli_botexp_tnt_acks`

The total number of acknowledgment request operations with the request storage (**tarantool**/**wstore**) by the `botexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_tnt_acks 505
```

---
### `wallarm_wcli_botexp_tnt_acks_failed`

The total number of failed acknowledgment request operations with the request storage (**tarantool**/**wstore**) by the `botexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_tnt_acks_failed 0
```

---
### `wallarm_wcli_botexp_api_sent`

The total number of exported requests to Wallarm Cloud by the `botexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_api_sent 505
```

---
### `wallarm_wcli_botexp_api_failed`

The total number of failed export attempts to Wallarm Cloud by the `botexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_botexp_api_failed 0
```

## blkexp – Block Exporter

---
### `wallarm_wcli_blkexp_tnt_gets`

The total number of GET requests the `blkexp` job sent to the request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_blkexp_tnt_gets 0
```
---
### `wallarm_wcli_blkexp_tnt_acks`

The total number of acknowledgment requests the `blkexp` job sent to the request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_blkexp_tnt_acks 0
```

---
### `wallarm_wcli_blkexp_tnt_acks_failed`

The total number of failed acknowledgment requests the `blkexp` job sent to the request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_blkexp_tnt_acks_failed 0
```

---
### `wallarm_wcli_blkexp_api_send`

The total number of exported requests the `blkexp` job sent to Wallarm Cloud.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_blkexp_api_send 0
```

---
### `wallarm_wcli_blkexp_api_sent_failed`

The total number of failed export attempts the `blkexp` job sent to Wallarm Cloud.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_blkexp_api_sent_failed 0
```

## credstuff – Credential Stuffing


---
### `wallarm_wcli_credstuff_tnt_requests`

The total number of requests the `credstuff` job fetched from the request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_credstuff_tnt_requests 0
```
---
### `wallarm_wcli_credstuff_tnt_acks`

The total number of acknowledgment operations with the request storage (**tarantool**/**wstore**) by the `credstuff` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_credstuff_tnt_acks 0
```


---
### `wallarm_wcli_credstuff_tnt_acks_failed`

The total number of failed acknowledgment operations with the request storage (**tarantool**/**wstore**) by the `credstuff` job.

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

## jwtexp – JWT Token Exporter


---
### `wallarm_wcli_jwtexp_tnt_requests`

The total number of requests fetched from the request storage (tarantool/wstore) by the jwtexp job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_jwtexp_tnt_requests 0
```
---
### `wallarm_wcli_jwtexp_tnt_acks`

The total number of acknowledgment operations with the request storage (**tarantool**/**wstore**) by the `jwtexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_jwtexp_tnt_acks 0
```



---
### `wallarm_wcli_jwtexp_tnt_acks_failed`

The total number of failed acknowledgment operations with the request storage (**tarantool**/**wstore**) by the `jwtexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_jwtexp_tnt_acks_failed 0
```


---
### `wallarm_wcli_jwtexp_api_requests_sent`

The total number of exported requests to Wallarm Cloud by the `jwtexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_jwtexp_api_requests_sent 0
```

---
### `wallarm_wcli_jwtexp_api_requests_failed`

The total number of failed request export attempts to Wallarm Cloud by the `jwtexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_jwtexp_api_requests_failed 0
```

## reqexp – Request Exporter
---
### `wallarm_wcli_reqexp_tnt_requests`

The total number of requests the `reqexp` job fetched from the request storage (**tarantool**/**wstore**).

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_reqexp_tnt_requests 156
```

---
### `wallarm_wcli_reqexp_tnt_acks`

The total number of acknowledgment operations with the request storage (**tarantool**/**wstore**) by the `reqexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_reqexp_tnt_acks 156
```


---
### `wallarm_wcli_reqexp_tnt_acks_failed`

The total number of failed acknowledgment operations with the request storage (**tarantool**/**wstore**) by the `reqexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_reqexp_tnt_acks_failed 0
```


---
### `wallarm_wcli_reqexp_api_requests_sent`

The total number of exported requests to Wallarm Cloud by the `reqexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_reqexp_api_requests_sent 156
```



---
### `wallarm_wcli_reqexp_api_requests_failed`

The total number of failed request export attempts to Wallarm Cloud by the `reqexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_reqexp_api_requests_failed 0
```

## cntexp – Counter Exporter

---
### `wallarm_wcli_cntexp_tnt_counters`

The total number of counters read from the request storage (**tarantool**/**wstore**) for the `cntexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_cntexp_tnt_counters 869
```


---
### `wallarm_wcli_cntexp_api_counters_sent`

The total number of exported counters to Wallarm Cloud by the `cntexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_cntexp_api_counters_sent 869
```


---
### `wallarm_wcli_cntexp_api_counters_failed`

The total number of failed counter export attempts to Wallarm Cloud by the `cntexp` job.

**Type:** Counter
**Labels:** None
**Unit:** Count
**Example:**
```
wallarm_wcli_cntexp_api_counters_failed 0
```


## API Discovery Client


---
### `wallarm_api_discovery_datastore_batch_size`

Current size of the batch being processed by the API discovery datastore. Reflects the amount of memory allocated for the batch before flushing.

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

