[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[sidecar]: ../installation/kubernetes/sidecar-proxy/deployment.md

# Traffic and Attack Metrics of the NGINX Node

The NGINX Node's core filtering counters report processed traffic, detected attacks, blocked requests, and detection health. This page describes the metrics you are most likely to monitor.

The traffic and attack counters are reported both as an **aggregate** across all applications (no label) and **per [Wallarm application](../user-guides/settings/applications.md)** via the `app_id` label. For example, `wallarm_requests` is the total, while `wallarm_requests{app_id="23"}` is the count for application `23`. The value `app_id="-1"` denotes traffic not assigned to any application.

The exact list of metrics may vary depending on the NGINX Node version. Changes are reflected in the [NGINX Node changelog][nginx-node-changelog].

## Limitations

Traffic and attack metrics are not yet available for [Sidecar][sidecar].

## Metrics endpoint

Starting from NGINX Node 7.1.0, the traffic and attack metrics are returned on the following aggregated endpoint by default:

```
http://127.0.0.1:9445/metrics
```

The same counters are also available via the `wallarm_status` endpoint of the [Statistics service](configure-statistics-service.md).

To change the port, see [Configuring the ports](nginx-node-metrics.md#configuring-the-ports).

## Traffic metrics

---
### `wallarm_requests`

The number of requests processed by the node.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_requests 15234
wallarm_requests{app_id="23"} 12010
```

---
### `wallarm_streams`

The number of processed gRPC/WebSocket streams.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_streams 128
wallarm_streams{app_id="23"} 96
```

---
### `wallarm_messages`

The number of processed gRPC/WebSocket messages.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_messages 3542
wallarm_messages{app_id="23"} 2870
```

---
### `wallarm_abnormal`

The number of abnormal requests — requests the node could not process normally.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_abnormal 7
```

---
### `wallarm_bytes_in`

The total number of bytes received by listening servers from clients (incoming traffic). Collected regardless of the [filtration mode](configure-wallarm-mode.md).

**Type**: Gauge

**Labels**: None

**Unit**: Bytes

**Example**:

```
wallarm_bytes_in 48219340
```

---
### `wallarm_bytes_out`

The total number of bytes sent from listening servers to clients (outgoing traffic). Collected regardless of the [filtration mode](configure-wallarm-mode.md).

**Type**: Gauge

**Labels**: None

**Unit**: Bytes

**Example**:

```
wallarm_bytes_out 210734820
```

## Attacks and blocking metrics

---
### `wallarm_attacks`

The number of recorded attacks.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_attacks 42
wallarm_attacks{app_id="23"} 37
```

---
### `wallarm_blocked`

The number of blocked requests, including those originating from [denylisted](../user-guides/ip-lists/overview.md) IPs.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_blocked 30
wallarm_blocked{app_id="23"} 25
```

---
### `wallarm_blocked_by_acl`

The number of requests blocked due to [denylisted](../user-guides/ip-lists/overview.md) request sources.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_blocked_by_acl 12
wallarm_blocked_by_acl{app_id="23"} 10
```

---
### `wallarm_blocked_by_antibot`

The number of requests blocked by the [API Abuse Prevention](../api-abuse-prevention/overview.md) module.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_blocked_by_antibot 5
wallarm_blocked_by_antibot{app_id="23"} 4
```

---
### `wallarm_bytes_blocked_in`, `wallarm_bytes_blocked_out`

The total number of bytes received in blocked requests and sent in blocked responses.

**Type**: Counter

**Labels**: None

**Unit**: Bytes

**Example**:

```
wallarm_bytes_blocked_in 15320
wallarm_bytes_blocked_out 8110
```

---
### `wallarm_bytes_blocked_by_acl_in`, `wallarm_bytes_blocked_by_acl_out`

The total number of bytes received and sent in ACL-blocked requests and responses.

**Type**: Counter

**Labels**: None

**Unit**: Bytes

**Example**:

```
wallarm_bytes_blocked_by_acl_in 4200
wallarm_bytes_blocked_by_acl_out 1900
```

## Metrics on detection resources and health

---
### `wallarm_db_id`

The ID of the currently loaded `proton.db` (attack detection rules) file.

**Type**: Gauge

**Labels**: None

**Unit**: ID

**Example**:

```
wallarm_db_id 317
```

---
### `wallarm_lom_id`

The ID of the currently loaded LOM file.

**Type**: Gauge

**Labels**: None

**Unit**: ID

**Example**:

```
wallarm_lom_id 2205
```

---
### `wallarm_custom_ruleset_id`

The ID of the currently loaded [custom ruleset](../user-guides/rules/rules.md#ruleset-lifecycle) file.

**Type**: Gauge

**Labels**: None

**Unit**: ID

**Example**:

```
wallarm_custom_ruleset_id 2205
```

---
### `wallarm_db_apply_time`, `wallarm_lom_apply_time`, `wallarm_custom_ruleset_apply_time`

The Unix timestamps when the `proton.db`, LOM, and custom ruleset files were last applied.

**Type**: Gauge

**Labels**: None

**Unit**: Unix timestamp (seconds)

**Example**:

```
wallarm_db_apply_time 1784907369
wallarm_lom_apply_time 1784907370
wallarm_custom_ruleset_apply_time 1784907370
```

---
### `wallarm_proton_instances_total`, `wallarm_proton_instances_success`, `wallarm_proton_instances_fallback`, `wallarm_proton_instances_failed`

The number of libproton instances — in total and by status: successfully loaded, running in fallback, or failed.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_proton_instances_total 4
wallarm_proton_instances_success 4
wallarm_proton_instances_fallback 0
wallarm_proton_instances_failed 0
```

---
### `wallarm_proton_errors`

The number of non-memory-related libproton faults.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_proton_errors 0
```

---
### `wallarm_time_detect`

Time spent on attack detection.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Seconds

**Example**:

```
wallarm_time_detect 0.842
wallarm_time_detect{app_id="23"} 0.751
```

---
### `wallarm_config_revision`

The revision number of the applied node configuration.

**Type**: Gauge

**Labels**: None

**Unit**: Revision number

**Example**:

```
wallarm_config_revision 12
```

---
### `wallarm_startid`

A unique identifier generated each time the node starts.

**Type**: Gauge

**Labels**: None

**Unit**: ID

**Example**:

```
wallarm_startid 10590889219338960000
```

## Error and fault metrics

---
### `wallarm_tnt_errors`

The number of wstore (Postanalytics) write errors.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_tnt_errors 0
```

---
### `wallarm_api_errors`

The number of API write errors.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_api_errors 0
```

---
### `wallarm_requests_lost`

The number of requests lost before analysis.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_requests_lost 0
```

---
### `wallarm_overlimits_time`

The number of requests that exceeded the processing time limit.

**Type**: Gauge

**Labels**: `app_id`

**Unit**: Count

**Example**:

```
wallarm_overlimits_time 3
wallarm_overlimits_time{app_id="23"} 2
```

---
### `wallarm_segfaults`

The number of segmentation faults.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_segfaults 0
```

---
### `wallarm_memfaults`

The number of events where the virtual memory limit was reached.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_memfaults 0
```

---
### `wallarm_softmemfaults`

The number of events where the per-request memory limit was reached.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_softmemfaults 0
```

---
### `wallarm_stalled_workers`

The number of workers stalled in libproton.

**Type**: Gauge

**Labels**: None

**Unit**: Count

**Example**:

```
wallarm_stalled_workers 0
```
