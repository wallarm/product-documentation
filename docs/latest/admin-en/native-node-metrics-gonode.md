[apifw]:           ../api-specification-enforcement/overview.md


# Go Node Metrics of the Native Node 

This article describes the Go Node metrics of the Native Node to help monitor and troubleshoot the Native Node.

## Accessing metrics

By default, the Node provides metrics at the following endpoint:

```bash
http://<NODE_IP>:9000/metrics
```

To access the metrics endpoint:

* **Docker or virtual machine** - open port `9000` in the firewall or expose it via Docker `-p 9000:9000`.

    The port and path for metrics can be changes using the [`metrics.*`](../installation/native-node/all-in-one-conf.md#metricsenabled) parameters.
* **Kubernetes** - use a `kubectl port-forward` command to forward the port locally, e.g.:

    ```bash
    kubectl port-forward svc/<NODE-SERVICE-NAME> 9000:9000 -n <NAMESPACE>
    ```

    The port and path for metrics can be changes using the [`processing.metrics.*`](../installation/native-node/helm-chart-conf.md#processingmetricsenabled) parameters.

## Available metrics

The following groups of Prometheus metrics are available. Each metric includes a `HELP` message describing its purpose in detail.

The exact list of metrics may vary depending on the Native Node version. Changes are reflected in the [Native Node changelog](../updating-migrating/native-node/node-artifact-versions.md).

### `wallarm_gonode_apifw_*`

Shows metrics from the API Firewall service, including HTTP request counters, request-processing latency histograms, and total service error statistics.

The metrics are available [starting from version 0.20.0][native-node-changelog].

!!! info "API Specification Enforcement"
    The API Firewall service underlies the [API Specification Enforcement][apifw] feature.

### `wallarm_gonode_application_*`

Provides general information about the Node instance, including version, deployment type, mode, and configuration reload statistics.

### `wallarm_gonode_files_*`, `wallarm_gonode_http_inspector_ruleset_*`

Contains details about applied configuration and ruleset files, including format and content versions as well as the last update timestamp.

### `wallarm_gonode_go_*`, `wallarm_gonode_process_*`

Standard process and Go runtime metrics, including resource usage (CPU, memory, network) and garbage collector statistics.

### `wallarm_gonode_http_connector_*`

Metrics related to the connector server component, covering request processing, blocked/bypassed requests, error counters, and latency.

### `wallarm_gonode_http_inspector_*`

Provides detailed statistics from the HTTP inspector, including processed requests and responses, detected and blocked attacks, and internal pipeline metrics.

### `wallarm_gonode_postanalytics_*`

Contains metrics related to exporting data to the postanalytics service (wstore), including exported requests, errors, and active connections to postanalytics nodes.

### `wallarm_gonode_tcp_*`

Provides metrics from the TCP packet processing pipeline, including packet and byte counters, active flows, HTTP message reconstruction statistics, and TCP-level parsing or reassembly errors.

## Example metrics output

Below is an example response from the metrics endpoint:

```{.bash .prom-metrics-output}
# TYPE wallarm_gonode_apifw_http_request_duration_seconds histogram
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="0.001"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="0.005"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="0.025"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="0.05"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="0.25"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="0.5"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="1"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="2.5"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="5"} 0
wallarm_gonode_apifw_http_request_duration_seconds_bucket{schema_id="102567",le="+Inf"} 0
wallarm_gonode_apifw_http_request_duration_seconds_sum{schema_id="102567"} 0
wallarm_gonode_apifw_http_request_duration_seconds_count{schema_id="102567"} 0
# HELP wallarm_gonode_apifw_http_requests_total Total number of HTTP requests
# TYPE wallarm_gonode_apifw_http_requests_total counter
wallarm_gonode_apifw_http_requests_total{schema_id="102567",status_code="200"} 0
# HELP wallarm_gonode_apifw_service_errors_total Total number of errors occurred in the APIFW service.
# TYPE wallarm_gonode_apifw_service_errors_total counter
wallarm_gonode_apifw_service_errors_total 0
# HELP wallarm_gonode_application_config_reload_errors_total Total number of errors during config reload
# TYPE wallarm_gonode_application_config_reload_errors_total counter
wallarm_gonode_application_config_reload_errors_total 0
# HELP wallarm_gonode_application_config_reloads_total Total number of config reloads
# TYPE wallarm_gonode_application_config_reloads_total counter
wallarm_gonode_application_config_reloads_total 0
# HELP wallarm_gonode_application_info Application information. See 'version', 'mode' labels.
# TYPE wallarm_gonode_application_info gauge
wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1-rc4"} 1
# HELP wallarm_gonode_files_apply_timestamp_seconds Timestamp of when various files are applied. See 'file' label.
# TYPE wallarm_gonode_files_apply_timestamp_seconds gauge
wallarm_gonode_files_apply_timestamp_seconds{file="custom_ruleset"} 1.753986724e+09
wallarm_gonode_files_apply_timestamp_seconds{file="proton.db"} 1.753986724e+09
# HELP wallarm_gonode_files_content_version Content version of various files. See 'file' label.
# TYPE wallarm_gonode_files_content_version gauge
wallarm_gonode_files_content_version{file="custom_ruleset"} 1938
wallarm_gonode_files_content_version{file="proton.db"} 215
# HELP wallarm_gonode_files_format_version Format version of various files. See 'file' label.
# TYPE wallarm_gonode_files_format_version gauge
wallarm_gonode_files_format_version{file="custom_ruleset"} 58
wallarm_gonode_files_format_version{file="proton.db"} 10
# HELP wallarm_gonode_go_gc_duration_seconds A summary of the wall-time pause (stop-the-world) duration in garbage collection cycles.
# TYPE wallarm_gonode_go_gc_duration_seconds summary
wallarm_gonode_go_gc_duration_seconds{quantile="0"} 5.4205e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.25"} 6.0421e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.5"} 6.5876e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.75"} 0.000109397
wallarm_gonode_go_gc_duration_seconds{quantile="1"} 0.00016074
wallarm_gonode_go_gc_duration_seconds_sum 0.000900882
wallarm_gonode_go_gc_duration_seconds_count 11
# HELP wallarm_gonode_go_gc_gogc_percent Heap size target percentage configured by the user, otherwise 100. This value is set by the GOGC environment variable, and the runtime/debug.SetGCPercent function. Sourced from /gc/gogc:percent.
# TYPE wallarm_gonode_go_gc_gogc_percent gauge
wallarm_gonode_go_gc_gogc_percent 100
# HELP wallarm_gonode_go_gc_gomemlimit_bytes Go runtime memory limit configured by the user, otherwise math.MaxInt64. This value is set by the GOMEMLIMIT environment variable, and the runtime/debug.SetMemoryLimit function. Sourced from /gc/gomemlimit:bytes.
# TYPE wallarm_gonode_go_gc_gomemlimit_bytes gauge
wallarm_gonode_go_gc_gomemlimit_bytes 9.223372036854776e+18
# HELP wallarm_gonode_go_goroutines Number of goroutines that currently exist.
# TYPE wallarm_gonode_go_goroutines gauge
wallarm_gonode_go_goroutines 39
# HELP wallarm_gonode_go_info Information about the Go environment.
# TYPE wallarm_gonode_go_info gauge
wallarm_gonode_go_info{version="go1.24.5"} 1
# HELP wallarm_gonode_go_memstats_alloc_bytes Number of bytes allocated in heap and currently in use. Equals to /memory/classes/heap/objects:bytes.
# TYPE wallarm_gonode_go_memstats_alloc_bytes gauge
wallarm_gonode_go_memstats_alloc_bytes 9.302008e+06
# HELP wallarm_gonode_go_memstats_alloc_bytes_total Total number of bytes allocated in heap until now, even if released already. Equals to /gc/heap/allocs:bytes.
# TYPE wallarm_gonode_go_memstats_alloc_bytes_total counter
wallarm_gonode_go_memstats_alloc_bytes_total 5.7922512e+07
# HELP wallarm_gonode_go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table. Equals to /memory/classes/profiling/buckets:bytes.
# TYPE wallarm_gonode_go_memstats_buck_hash_sys_bytes gauge
wallarm_gonode_go_memstats_buck_hash_sys_bytes 91305
# HELP wallarm_gonode_go_memstats_frees_total Total number of heap objects frees. Equals to /gc/heap/frees:objects + /gc/heap/tiny/allocs:objects.
# TYPE wallarm_gonode_go_memstats_frees_total counter
wallarm_gonode_go_memstats_frees_total 625423
# HELP wallarm_gonode_go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata. Equals to /memory/classes/metadata/other:bytes.
# TYPE wallarm_gonode_go_memstats_gc_sys_bytes gauge
wallarm_gonode_go_memstats_gc_sys_bytes 3.494312e+06
# HELP wallarm_gonode_go_memstats_heap_alloc_bytes Number of heap bytes allocated and currently in use, same as go_memstats_alloc_bytes. Equals to /memory/classes/heap/objects:bytes.
# TYPE wallarm_gonode_go_memstats_heap_alloc_bytes gauge
wallarm_gonode_go_memstats_heap_alloc_bytes 9.302008e+06
# HELP wallarm_gonode_go_memstats_heap_idle_bytes Number of heap bytes waiting to be used. Equals to /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes.
# TYPE wallarm_gonode_go_memstats_heap_idle_bytes gauge
wallarm_gonode_go_memstats_heap_idle_bytes 4.374528e+06
# HELP wallarm_gonode_go_memstats_heap_inuse_bytes Number of heap bytes that are in use. Equals to /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes
# TYPE wallarm_gonode_go_memstats_heap_inuse_bytes gauge
wallarm_gonode_go_memstats_heap_inuse_bytes 1.1321344e+07
# HELP wallarm_gonode_go_memstats_heap_objects Number of currently allocated objects. Equals to /gc/heap/objects:objects.
# TYPE wallarm_gonode_go_memstats_heap_objects gauge
wallarm_gonode_go_memstats_heap_objects 56658
# HELP wallarm_gonode_go_memstats_heap_released_bytes Number of heap bytes released to OS. Equals to /memory/classes/heap/released:bytes.
# TYPE wallarm_gonode_go_memstats_heap_released_bytes gauge
wallarm_gonode_go_memstats_heap_released_bytes 2.29376e+06
# HELP wallarm_gonode_go_memstats_heap_sys_bytes Number of heap bytes obtained from system. Equals to /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes + /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes.
# TYPE wallarm_gonode_go_memstats_heap_sys_bytes gauge
wallarm_gonode_go_memstats_heap_sys_bytes 1.5695872e+07
# HELP wallarm_gonode_go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE wallarm_gonode_go_memstats_last_gc_time_seconds gauge
wallarm_gonode_go_memstats_last_gc_time_seconds 1.7539879135438237e+09
# HELP wallarm_gonode_go_memstats_mallocs_total Total number of heap objects allocated, both live and gc-ed. Semantically a counter version for go_memstats_heap_objects gauge. Equals to /gc/heap/allocs:objects + /gc/heap/tiny/allocs:objects.
# TYPE wallarm_gonode_go_memstats_mallocs_total counter
wallarm_gonode_go_memstats_mallocs_total 682081
# HELP wallarm_gonode_go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures. Equals to /memory/classes/metadata/mcache/inuse:bytes.
# TYPE wallarm_gonode_go_memstats_mcache_inuse_bytes gauge
wallarm_gonode_go_memstats_mcache_inuse_bytes 2416
# HELP wallarm_gonode_go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system. Equals to /memory/classes/metadata/mcache/inuse:bytes + /memory/classes/metadata/mcache/free:bytes.
# TYPE wallarm_gonode_go_memstats_mcache_sys_bytes gauge
wallarm_gonode_go_memstats_mcache_sys_bytes 15704
# HELP wallarm_gonode_go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures. Equals to /memory/classes/metadata/mspan/inuse:bytes.
# TYPE wallarm_gonode_go_memstats_mspan_inuse_bytes gauge
wallarm_gonode_go_memstats_mspan_inuse_bytes 138400
# HELP wallarm_gonode_go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system. Equals to /memory/classes/metadata/mspan/inuse:bytes + /memory/classes/metadata/mspan/free:bytes.
# TYPE wallarm_gonode_go_memstats_mspan_sys_bytes gauge
wallarm_gonode_go_memstats_mspan_sys_bytes 163200
# HELP wallarm_gonode_go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place. Equals to /gc/heap/goal:bytes.
# TYPE wallarm_gonode_go_memstats_next_gc_bytes gauge
wallarm_gonode_go_memstats_next_gc_bytes 1.8470754e+07
# HELP wallarm_gonode_go_memstats_other_sys_bytes Number of bytes used for other system allocations. Equals to /memory/classes/other:bytes.
# TYPE wallarm_gonode_go_memstats_other_sys_bytes gauge
wallarm_gonode_go_memstats_other_sys_bytes 540825
# HELP wallarm_gonode_go_memstats_stack_inuse_bytes Number of bytes obtained from system for stack allocator in non-CGO environments. Equals to /memory/classes/heap/stacks:bytes.
# TYPE wallarm_gonode_go_memstats_stack_inuse_bytes gauge
wallarm_gonode_go_memstats_stack_inuse_bytes 1.081344e+06
# HELP wallarm_gonode_go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator. Equals to /memory/classes/heap/stacks:bytes + /memory/classes/os-stacks:bytes.
# TYPE wallarm_gonode_go_memstats_stack_sys_bytes gauge
wallarm_gonode_go_memstats_stack_sys_bytes 1.081344e+06
# HELP wallarm_gonode_go_memstats_sys_bytes Number of bytes obtained from system. Equals to /memory/classes/total:byte.
# TYPE wallarm_gonode_go_memstats_sys_bytes gauge
wallarm_gonode_go_memstats_sys_bytes 2.1082562e+07
# HELP wallarm_gonode_go_sched_gomaxprocs_threads The current runtime.GOMAXPROCS setting, or the number of operating system threads that can execute user-level Go code simultaneously. Sourced from /sched/gomaxprocs:threads.
# TYPE wallarm_gonode_go_sched_gomaxprocs_threads gauge
wallarm_gonode_go_sched_gomaxprocs_threads 2
# HELP wallarm_gonode_go_threads Number of OS threads created.
# TYPE wallarm_gonode_go_threads gauge
wallarm_gonode_go_threads 11
# HELP wallarm_gonode_http_connector_server_avg_latency_ms Average latency for requests processed on this node
# TYPE wallarm_gonode_http_connector_server_avg_latency_ms gauge
wallarm_gonode_http_connector_server_avg_latency_ms 0.819581
# HELP wallarm_gonode_http_connector_server_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_http_connector_server_debug_container_len gauge
wallarm_gonode_http_connector_server_debug_container_len{type="map:activeRequests"} 0
wallarm_gonode_http_connector_server_debug_container_len{type="map:requestWaitMap"} 0
wallarm_gonode_http_connector_server_debug_container_len{type="map:responseWaitMap"} 0
# HELP wallarm_gonode_http_connector_server_errors_total Various error counters. See 'type' label
# TYPE wallarm_gonode_http_connector_server_errors_total counter
wallarm_gonode_http_connector_server_errors_total{type="DroppedOnOverload"} 0
wallarm_gonode_http_connector_server_errors_total{type="DuplicateReqId"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgDataFormat"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgType"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgpackDataFormat"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgpackDecode"} 0
wallarm_gonode_http_connector_server_errors_total{type="NilBody"} 0
wallarm_gonode_http_connector_server_errors_total{type="ReqBodyReading"} 0
wallarm_gonode_http_connector_server_errors_total{type="RespBodyReading"} 0
# HELP wallarm_gonode_http_connector_server_messages_processed_total Total amount of successfully processed messages. See 'type' label
# TYPE wallarm_gonode_http_connector_server_messages_processed_total counter
wallarm_gonode_http_connector_server_messages_processed_total{type="request"} 3
wallarm_gonode_http_connector_server_messages_processed_total{type="response"} 0
# HELP wallarm_gonode_http_connector_server_messages_rejected_total Total amount of messages rejected by connector server for different reasons. See 'reason' label.
# TYPE wallarm_gonode_http_connector_server_messages_rejected_total counter
wallarm_gonode_http_connector_server_messages_rejected_total{reason="connector_info"} 3
wallarm_gonode_http_connector_server_messages_rejected_total{reason="host"} 0
wallarm_gonode_http_connector_server_messages_rejected_total{reason="remote_address"} 0
# HELP wallarm_gonode_http_connector_server_messages_seen_total Total amount of messages seen by connector server. See 'type' label. Type 'total' includes everything: rejected, processed, forwarded, erroneous, etc.
# TYPE wallarm_gonode_http_connector_server_messages_seen_total counter
wallarm_gonode_http_connector_server_messages_seen_total{type="health"} 0
wallarm_gonode_http_connector_server_messages_seen_total{type="request"} 3
wallarm_gonode_http_connector_server_messages_seen_total{type="response"} 0
wallarm_gonode_http_connector_server_messages_seen_total{type="total"} 6
# HELP wallarm_gonode_http_connector_server_requests_blocked_total Requests blocked by Wallarm
# TYPE wallarm_gonode_http_connector_server_requests_blocked_total counter
wallarm_gonode_http_connector_server_requests_blocked_total 0
# HELP wallarm_gonode_http_connector_server_requests_bypassed_total Requests that were not inspected. See reason label.
# TYPE wallarm_gonode_http_connector_server_requests_bypassed_total counter
wallarm_gonode_http_connector_server_requests_bypassed_total{reason="input_filters"} 0
wallarm_gonode_http_connector_server_requests_bypassed_total{reason="mode_off"} 0
# HELP wallarm_gonode_http_connector_server_responses_bypassed_total Responses that were not inspected
# TYPE wallarm_gonode_http_connector_server_responses_bypassed_total counter
wallarm_gonode_http_connector_server_responses_bypassed_total 0
# HELP wallarm_gonode_http_connector_server_step_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_http_connector_server_step_container_is_overloaded gauge
wallarm_gonode_http_connector_server_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_connector_server_step_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_http_connector_server_step_debug_container_len gauge
wallarm_gonode_http_connector_server_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_connector_server_step_is_running Flag indicating if this pipeline step is currently running (1) or stopped (0).
# TYPE wallarm_gonode_http_connector_server_step_is_running gauge
wallarm_gonode_http_connector_server_step_is_running 1
# HELP wallarm_gonode_http_connector_server_step_output_messages_total Total amount of this pipeline step output messages. See 'msgtype', 'receiver' and 'dropped' labels.
# TYPE wallarm_gonode_http_connector_server_step_output_messages_total counter
wallarm_gonode_http_connector_server_step_output_messages_total{dropped="false",msgtype="MsgHTTP",reciever="0"} 18
wallarm_gonode_http_connector_server_step_output_messages_total{dropped="true",msgtype="MsgHTTP",reciever="0"} 0
# HELP wallarm_gonode_http_inspector_acl_results_per_app_total ACL results counters. See 'list' label.
# TYPE wallarm_gonode_http_inspector_acl_results_per_app_total counter
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="black"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="none"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="white"} 0
# HELP wallarm_gonode_http_inspector_acl_results_per_host_total ACL results counters. See 'list' label.
# TYPE wallarm_gonode_http_inspector_acl_results_per_host_total counter
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="black"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="none"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="white"} 0
# HELP wallarm_gonode_http_inspector_acl_results_total ACL results counters. See 'list' label.
# TYPE wallarm_gonode_http_inspector_acl_results_total counter
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="black"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="none"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="white"} 0
# HELP wallarm_gonode_http_inspector_adjusted_counters_per_app_total Adjusted counters. Correspond to adjusted legacy counters. See 'type' label.
# TYPE wallarm_gonode_http_inspector_adjusted_counters_per_app_total counter
wallarm_gonode_http_inspector_adjusted_counters_per_app_total{aggregate="sum",application_id="-1",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_per_app_total{aggregate="sum",application_id="-1",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_counters_per_host_total Adjusted counters. Correspond to adjusted legacy counters. See 'type' label.
# TYPE wallarm_gonode_http_inspector_adjusted_counters_per_host_total counter
wallarm_gonode_http_inspector_adjusted_counters_per_host_total{aggregate="sum",host="",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_per_host_total{aggregate="sum",host="",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_counters_total Adjusted counters. Correspond to adjusted legacy counters. See 'type' label.
# TYPE wallarm_gonode_http_inspector_adjusted_counters_total counter
wallarm_gonode_http_inspector_adjusted_counters_total{aggregate="sum",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_total{aggregate="sum",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_requests_per_period Amount of adjusted requests per last period of time. See 'period' label.
# TYPE wallarm_gonode_http_inspector_adjusted_requests_per_period gauge
wallarm_gonode_http_inspector_adjusted_requests_per_period{aggregate="sum",period="1m"} 0
wallarm_gonode_http_inspector_adjusted_requests_per_period{aggregate="sum",period="1s"} 0
# HELP wallarm_gonode_http_inspector_balancer_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_http_inspector_balancer_container_is_overloaded gauge
wallarm_gonode_http_inspector_balancer_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_balancer_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_http_inspector_balancer_debug_container_len gauge
wallarm_gonode_http_inspector_balancer_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_balancer_dropped_total Dropped input messages because of nonzero drop_percent config parameter
# TYPE wallarm_gonode_http_inspector_balancer_dropped_total counter
wallarm_gonode_http_inspector_balancer_dropped_total 0
# HELP wallarm_gonode_http_inspector_balancer_workers Amount of workers.
# TYPE wallarm_gonode_http_inspector_balancer_workers gauge
wallarm_gonode_http_inspector_balancer_workers 2
# HELP wallarm_gonode_http_inspector_bytes_processed_per_app_total Bytes processed. Not strictly equal to the amount of bytes on the wire. See 'type' label.
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_app_total counter
wallarm_gonode_http_inspector_bytes_processed_per_app_total{aggregate="sum",application_id="-1",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_per_app_total{aggregate="sum",application_id="-1",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_per_host_total Bytes processed. Not strictly equal to the amount of bytes on the wire. See 'type' label.
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_host_total counter
wallarm_gonode_http_inspector_bytes_processed_per_host_total{aggregate="sum",host="",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_per_host_total{aggregate="sum",host="",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_per_period Amount of bytes processed per last period of time. See 'period' and type labels.
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_period gauge
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1m",type="request"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1m",type="response"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1s",type="request"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1s",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_total Bytes processed. Not strictly equal to the amount of bytes on the wire. See 'type' label.
# TYPE wallarm_gonode_http_inspector_bytes_processed_total counter
wallarm_gonode_http_inspector_bytes_processed_total{aggregate="sum",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_total{aggregate="sum",type="response"} 0
# HELP wallarm_gonode_http_inspector_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_http_inspector_container_is_overloaded gauge
wallarm_gonode_http_inspector_container_is_overloaded{aggregate="max",type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_http_inspector_debug_container_len gauge
wallarm_gonode_http_inspector_debug_container_len{aggregate="avg",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="max",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="min",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="sum",type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_errors_total Various error counters. See 'type' label
# TYPE wallarm_gonode_http_inspector_errors_total counter
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="AclErrors"} 3
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="ApifwErrors"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="ErrorCreatingFlow"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="ErrorSerializingReq"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowAlreadyExists"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsMissing"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsMissingRequest"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsMissingResponse"} 3
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsNotClosed"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowTimeouts"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="LeakedHandleRef"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="RouteConfigNotFound"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="UnreleasedBlockers"} 0
# HELP wallarm_gonode_http_inspector_flow_avg_time_ms Average time durations between various points in a flow life. See 'type' and 'case' labels.
# TYPE wallarm_gonode_http_inspector_flow_avg_time_ms gauge
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqOnly",type="Flow"} 1.3002335
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqOnly",type="Req"} 0.5557354999999999
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Flow"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Gap"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Req"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Resp"} 0
# HELP wallarm_gonode_http_inspector_flows Number of req/resp pairs being analysed at this moment
# TYPE wallarm_gonode_http_inspector_flows gauge
wallarm_gonode_http_inspector_flows{aggregate="avg"} 0
wallarm_gonode_http_inspector_flows{aggregate="max"} 0
wallarm_gonode_http_inspector_flows{aggregate="min"} 0
wallarm_gonode_http_inspector_flows{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_ignored_per_app_total Total amount of ignored req/resp pairs. See 'source' label.
# TYPE wallarm_gonode_http_inspector_ignored_per_app_total counter
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="mode"} 0
# HELP wallarm_gonode_http_inspector_ignored_per_host_total Total amount of ignored req/resp pairs. See 'source' label.
# TYPE wallarm_gonode_http_inspector_ignored_per_host_total counter
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="mode"} 0
# HELP wallarm_gonode_http_inspector_ignored_total Total amount of ignored req/resp pairs. See 'source' label.
# TYPE wallarm_gonode_http_inspector_ignored_total counter
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="mode"} 0
# HELP wallarm_gonode_http_inspector_mem_allocated_bytes Amount of memory allocated inside internal libproton library at this moment
# TYPE wallarm_gonode_http_inspector_mem_allocated_bytes gauge
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="avg"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="max"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="min"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_mem_allocated_max_bytes Maximum amount of memory allocated inside internal libproton library seen since the start
# TYPE wallarm_gonode_http_inspector_mem_allocated_max_bytes gauge
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="avg"} 60486
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="max"} 60486
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="min"} 60486
# HELP wallarm_gonode_http_inspector_msgs_ignored_total Total amount of internal data pipeline messages ignored. See '_ignored' metric
# TYPE wallarm_gonode_http_inspector_msgs_ignored_total counter
wallarm_gonode_http_inspector_msgs_ignored_total{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_requests_processed_per_app_total Total amount of requests processed by different inspector subsystems. One request can be processed by multiple subsystem. See 'source' label.
# TYPE wallarm_gonode_http_inspector_requests_processed_per_app_total counter
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="proton"} 3
# HELP wallarm_gonode_http_inspector_requests_processed_per_host_total Total amount of requests processed by different inspector subsystems. One request can be processed by multiple subsystem. See 'source' label.
# TYPE wallarm_gonode_http_inspector_requests_processed_per_host_total counter
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="proton"} 3
# HELP wallarm_gonode_http_inspector_requests_processed_total Total amount of requests processed by different inspector subsystems. One request can be processed by multiple subsystem. See 'source' label.
# TYPE wallarm_gonode_http_inspector_requests_processed_total counter
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="proton"} 3
# HELP wallarm_gonode_http_inspector_responses_processed_per_app_total Total amount of responses processed by different inspector subsystems. One response can be processed by multiple subsystems. See 'source' label.
# TYPE wallarm_gonode_http_inspector_responses_processed_per_app_total counter
wallarm_gonode_http_inspector_responses_processed_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
# HELP wallarm_gonode_http_inspector_responses_processed_per_host_total Total amount of responses processed by different inspector subsystems. One response can be processed by multiple subsystems. See 'source' label.
# TYPE wallarm_gonode_http_inspector_responses_processed_per_host_total counter
wallarm_gonode_http_inspector_responses_processed_per_host_total{aggregate="sum",host="",source="proton"} 0
# HELP wallarm_gonode_http_inspector_responses_processed_total Total amount of responses processed by different inspector subsystems. One response can be processed by multiple subsystems. See 'source' label.
# TYPE wallarm_gonode_http_inspector_responses_processed_total counter
wallarm_gonode_http_inspector_responses_processed_total{aggregate="sum",source="proton"} 0
# HELP wallarm_gonode_http_inspector_ruleset_content_version Content version of the custom ruleset file. Increases with every change of any of the rules inside
# TYPE wallarm_gonode_http_inspector_ruleset_content_version gauge
wallarm_gonode_http_inspector_ruleset_content_version{aggregate="max"} 1938
wallarm_gonode_http_inspector_ruleset_content_version{aggregate="min"} 1938
# HELP wallarm_gonode_http_inspector_ruleset_format_version Format version of the custom ruleset file
# TYPE wallarm_gonode_http_inspector_ruleset_format_version gauge
wallarm_gonode_http_inspector_ruleset_format_version{aggregate="max"} 58
wallarm_gonode_http_inspector_ruleset_format_version{aggregate="min"} 58
# HELP wallarm_gonode_http_inspector_step_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_http_inspector_step_container_is_overloaded gauge
wallarm_gonode_http_inspector_step_container_is_overloaded{type="channel:in"} 0
wallarm_gonode_http_inspector_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_inspector_step_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_http_inspector_step_debug_container_len gauge
wallarm_gonode_http_inspector_step_debug_container_len{type="channel:in"} 0
wallarm_gonode_http_inspector_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_inspector_step_input_messages_total Total amount of this pipeline step input messages.
# TYPE wallarm_gonode_http_inspector_step_input_messages_total counter
wallarm_gonode_http_inspector_step_input_messages_total 18
# HELP wallarm_gonode_http_inspector_step_is_running Flag indicating if this pipeline step is currently running (1) or stopped (0).
# TYPE wallarm_gonode_http_inspector_step_is_running gauge
wallarm_gonode_http_inspector_step_is_running 1
# HELP wallarm_gonode_http_inspector_step_output_messages_total Total amount of this pipeline step output messages. See 'msgtype', 'receiver' and 'dropped' labels.
# TYPE wallarm_gonode_http_inspector_step_output_messages_total counter
wallarm_gonode_http_inspector_step_output_messages_total{dropped="false",msgtype="MsgProtonSerializedRequest",reciever="0"} 3
wallarm_gonode_http_inspector_step_output_messages_total{dropped="true",msgtype="MsgProtonSerializedRequest",reciever="0"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_per_app_total Total amount of threats blocked. One request can only be blocked by one inspector subsystem. See 'source' label.
# TYPE wallarm_gonode_http_inspector_threats_blocked_per_app_total counter
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_per_host_total Total amount of threats blocked. One request can only be blocked by one inspector subsystem. See 'source' label.
# TYPE wallarm_gonode_http_inspector_threats_blocked_per_host_total counter
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_total Total amount of threats blocked. One request can only be blocked by one inspector subsystem. See 'source' label.
# TYPE wallarm_gonode_http_inspector_threats_blocked_total counter
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_found_per_app_total Total amount of threats found by different inspector subsystems. One request can be considered threat in a more than one way. See 'source' label.
# TYPE wallarm_gonode_http_inspector_threats_found_per_app_total counter
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
# HELP wallarm_gonode_http_inspector_threats_found_per_host_total Total amount of threats found by different inspector subsystems. One request can be considered threat in a more than one way. See 'source' label.
# TYPE wallarm_gonode_http_inspector_threats_found_per_host_total counter
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="proton"} 0
# HELP wallarm_gonode_http_inspector_threats_found_total Total amount of threats found by different inspector subsystems. One request can be considered threat in a more than one way. See 'source' label.
# TYPE wallarm_gonode_http_inspector_threats_found_total counter
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="proton"} 0
# HELP wallarm_gonode_postanalytics_exporter_connections Current number of connections to postanalytics. One connection per postanalytic node.
# TYPE wallarm_gonode_postanalytics_exporter_connections gauge
wallarm_gonode_postanalytics_exporter_connections 1
# HELP wallarm_gonode_postanalytics_exporter_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_postanalytics_exporter_container_is_overloaded gauge
wallarm_gonode_postanalytics_exporter_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_postanalytics_exporter_debug_container_len gauge
wallarm_gonode_postanalytics_exporter_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_errors_total Various error counters. See 'type' label
# TYPE wallarm_gonode_postanalytics_exporter_errors_total counter
wallarm_gonode_postanalytics_exporter_errors_total{type="SubmitConnect"} 6
wallarm_gonode_postanalytics_exporter_errors_total{type="SubmitResp"} 0
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total Total number of serialized requests dropped due to errors.
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total counter
wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total 3
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period Amount of serialized requests exported to postanalytics per last period of time. See 'period' label.
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period gauge
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period{period="1m"} 0
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period{period="1s"} 0
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total Total number of serialized requests exported to postanalytics.
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total counter
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total 0
# HELP wallarm_gonode_postanalytics_exporter_step_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_postanalytics_exporter_step_container_is_overloaded gauge
wallarm_gonode_postanalytics_exporter_step_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_step_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_postanalytics_exporter_step_debug_container_len gauge
wallarm_gonode_postanalytics_exporter_step_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_step_input_messages_total Total amount of this pipeline step input messages.
# TYPE wallarm_gonode_postanalytics_exporter_step_input_messages_total counter
wallarm_gonode_postanalytics_exporter_step_input_messages_total 3
# HELP wallarm_gonode_postanalytics_exporter_step_is_running Flag indicating if this pipeline step is currently running (1) or stopped (0).
# TYPE wallarm_gonode_postanalytics_exporter_step_is_running gauge
wallarm_gonode_postanalytics_exporter_step_is_running 1
# HELP wallarm_gonode_process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE wallarm_gonode_process_cpu_seconds_total counter
wallarm_gonode_process_cpu_seconds_total 1.56
# HELP wallarm_gonode_process_max_fds Maximum number of open file descriptors.
# TYPE wallarm_gonode_process_max_fds gauge
wallarm_gonode_process_max_fds 524287
# HELP wallarm_gonode_process_network_receive_bytes_total Number of bytes received by the process over the network.
# TYPE wallarm_gonode_process_network_receive_bytes_total counter
wallarm_gonode_process_network_receive_bytes_total 2.53529454e+08
# HELP wallarm_gonode_process_network_transmit_bytes_total Number of bytes sent by the process over the network.
# TYPE wallarm_gonode_process_network_transmit_bytes_total counter
wallarm_gonode_process_network_transmit_bytes_total 1.9418293e+07
# HELP wallarm_gonode_process_open_fds Number of open file descriptors.
# TYPE wallarm_gonode_process_open_fds gauge
wallarm_gonode_process_open_fds 20
# HELP wallarm_gonode_process_resident_memory_bytes Resident memory size in bytes.
# TYPE wallarm_gonode_process_resident_memory_bytes gauge
wallarm_gonode_process_resident_memory_bytes 1.67747584e+08
# HELP wallarm_gonode_process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE wallarm_gonode_process_start_time_seconds gauge
wallarm_gonode_process_start_time_seconds 1.75398672336e+09
# HELP wallarm_gonode_process_virtual_memory_bytes Virtual memory size in bytes.
# TYPE wallarm_gonode_process_virtual_memory_bytes gauge
wallarm_gonode_process_virtual_memory_bytes 1.98490112e+09
# HELP wallarm_gonode_process_virtual_memory_max_bytes Maximum amount of virtual memory available in bytes.
# TYPE wallarm_gonode_process_virtual_memory_max_bytes gauge
wallarm_gonode_process_virtual_memory_max_bytes 1.8446744073709552e+19
# HELP wallarm_gonode_tcp_reassembler_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_tcp_reassembler_debug_container_len gauge
wallarm_gonode_tcp_reassembler_debug_container_len{type="channel:in"} 0
wallarm_gonode_tcp_reassembler_debug_container_len{type="map:httpFlowsMap"} 15
wallarm_gonode_tcp_reassembler_debug_container_len{type="map:requestWaitMap"} 0
wallarm_gonode_tcp_reassembler_debug_container_len{type="map:responseWaitMap"} 0
# HELP wallarm_gonode_tcp_reassembler_errors_total Various error counters. See 'type' label
# TYPE wallarm_gonode_tcp_reassembler_errors_total counter
wallarm_gonode_tcp_reassembler_errors_total{type="HttpParsingError"} 12
wallarm_gonode_tcp_reassembler_errors_total{type="HttpReadError"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="HttpStreamCollision"} 2
wallarm_gonode_tcp_reassembler_errors_total{type="InputParsingError"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="InputScannerError"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="InvalidContentLength"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="InvalidHttpChunkHeader"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="InvalidHttpHeader"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="InvalidHttpTrailer"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="InvalidKeepaliveTimeout"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="RequestTimeout"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="ResponseBeforeRequest"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="ResponseTimeout"} 19
wallarm_gonode_tcp_reassembler_errors_total{type="TcpReadError"} 0
wallarm_gonode_tcp_reassembler_errors_total{type="UnexpectedHttpBodyEnd"} 2
wallarm_gonode_tcp_reassembler_errors_total{type="UrlParseError"} 1
# HELP wallarm_gonode_tcp_reassembler_http_bypassed_total Requests and responses that were not inspected. See labels `type`, `reason`.
# TYPE wallarm_gonode_tcp_reassembler_http_bypassed_total counter
wallarm_gonode_tcp_reassembler_http_bypassed_total{reason="any",type="response"} 0
wallarm_gonode_tcp_reassembler_http_bypassed_total{reason="input_filters",type="request"} 0
wallarm_gonode_tcp_reassembler_http_bypassed_total{reason="mode_off",type="request"} 0
# HELP wallarm_gonode_tcp_reassembler_http_bytes_total Total number of bytes in HTTP messages.
# TYPE wallarm_gonode_tcp_reassembler_http_bytes_total counter
wallarm_gonode_tcp_reassembler_http_bytes_total 238891
# HELP wallarm_gonode_tcp_reassembler_http_flows_dropped_total Number of HTTP flows dropped due to overload.
# TYPE wallarm_gonode_tcp_reassembler_http_flows_dropped_total counter
wallarm_gonode_tcp_reassembler_http_flows_dropped_total 0
# HELP wallarm_gonode_tcp_reassembler_http_messages_dropped_total Number of HTTP messages (requests/responses) dropped due to overload. See 'type' label.
# TYPE wallarm_gonode_tcp_reassembler_http_messages_dropped_total counter
wallarm_gonode_tcp_reassembler_http_messages_dropped_total{type="request"} 0
wallarm_gonode_tcp_reassembler_http_messages_dropped_total{type="response"} 0
# HELP wallarm_gonode_tcp_reassembler_http_messages_total Number of HTTP messages (requests/responses) processed. See 'type' label.
# TYPE wallarm_gonode_tcp_reassembler_http_messages_total counter
wallarm_gonode_tcp_reassembler_http_messages_total{type="request"} 583
wallarm_gonode_tcp_reassembler_http_messages_total{type="response"} 564
# HELP wallarm_gonode_tcp_reassembler_not_tcp_packets_total Number of non-TCP packets received.
# TYPE wallarm_gonode_tcp_reassembler_not_tcp_packets_total counter
wallarm_gonode_tcp_reassembler_not_tcp_packets_total 172647
# HELP wallarm_gonode_tcp_reassembler_step_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_tcp_reassembler_step_container_is_overloaded gauge
wallarm_gonode_tcp_reassembler_step_container_is_overloaded{type="channel:in"} 0
wallarm_gonode_tcp_reassembler_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_tcp_reassembler_step_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_tcp_reassembler_step_debug_container_len gauge
wallarm_gonode_tcp_reassembler_step_debug_container_len{type="channel:in"} 0
wallarm_gonode_tcp_reassembler_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_tcp_reassembler_step_input_messages_total Total amount of this pipeline step input messages.
# TYPE wallarm_gonode_tcp_reassembler_step_input_messages_total counter
wallarm_gonode_tcp_reassembler_step_input_messages_total 1.2987394e+07
# HELP wallarm_gonode_tcp_reassembler_step_is_running Flag indicating if this pipeline step is currently running (1) or stopped (0).
# TYPE wallarm_gonode_tcp_reassembler_step_is_running gauge
wallarm_gonode_tcp_reassembler_step_is_running 1
# HELP wallarm_gonode_tcp_reassembler_step_output_messages_total Total amount of this pipeline step output messages. See 'msgtype', 'receiver' and 'dropped' labels.
# TYPE wallarm_gonode_tcp_reassembler_step_output_messages_total counter
wallarm_gonode_tcp_reassembler_step_output_messages_total{dropped="false",msgtype="MsgHTTP",receiver="0"} 6829
wallarm_gonode_tcp_reassembler_step_output_messages_total{dropped="true",msgtype="MsgHTTP",receiver="0"} 0
# HELP wallarm_gonode_tcp_reassembler_tcp_bytes_total Total number of bytes in TCP packets.
# TYPE wallarm_gonode_tcp_reassembler_tcp_bytes_total counter
wallarm_gonode_tcp_reassembler_tcp_bytes_total 6.900103381e+09
# HELP wallarm_gonode_tcp_reassembler_tcp_flows Current number of active TCP flows.
# TYPE wallarm_gonode_tcp_reassembler_tcp_flows gauge
wallarm_gonode_tcp_reassembler_tcp_flows 15
# HELP wallarm_gonode_tcp_reassembler_tcp_packets_total Number of TCP packets received.
# TYPE wallarm_gonode_tcp_reassembler_tcp_packets_total counter
wallarm_gonode_tcp_reassembler_tcp_packets_total 1.2814747e+07
# HELP wallarm_gonode_tcp_reassembler_tcp_streams_closed_total Number of forced-closed TCP streams.
# TYPE wallarm_gonode_tcp_reassembler_tcp_streams_closed_total counter
wallarm_gonode_tcp_reassembler_tcp_streams_closed_total 327349
# HELP wallarm_gonode_tcp_reassembler_tcp_streams_flushed_total Number of flushed TCP streams.
# TYPE wallarm_gonode_tcp_reassembler_tcp_streams_flushed_total counter
wallarm_gonode_tcp_reassembler_tcp_streams_flushed_total 340426
# HELP wallarm_gonode_tcp_stream_errors_total Various error counters. See 'type' label
# TYPE wallarm_gonode_tcp_stream_errors_total counter
wallarm_gonode_tcp_stream_errors_total{type="TruncatedPacket"} 0
wallarm_gonode_tcp_stream_errors_total{type="WatcherError"} 0
# HELP wallarm_gonode_tcp_stream_step_container_is_overloaded Containers are not overloaded if the app processes data faster than it receives it. See 'type' label
# TYPE wallarm_gonode_tcp_stream_step_container_is_overloaded gauge
wallarm_gonode_tcp_stream_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_tcp_stream_step_debug_container_len Amount of items in various internal data structures at this moment. See 'type' label
# TYPE wallarm_gonode_tcp_stream_step_debug_container_len gauge
wallarm_gonode_tcp_stream_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_tcp_stream_step_is_running Flag indicating if this pipeline step is currently running (1) or stopped (0).
# TYPE wallarm_gonode_tcp_stream_step_is_running gauge
wallarm_gonode_tcp_stream_step_is_running 1
# HELP wallarm_gonode_tcp_stream_step_output_messages_total Total amount of this pipeline step output messages. See 'msgtype', 'receiver' and 'dropped' labels.
# TYPE wallarm_gonode_tcp_stream_step_output_messages_total counter
wallarm_gonode_tcp_stream_step_output_messages_total{dropped="false",msgtype="MsgGoPacket",receiver="0"} 1.2987394e+07
wallarm_gonode_tcp_stream_step_output_messages_total{dropped="true",msgtype="MsgGoPacket",receiver="0"} 0
# HELP wallarm_gonode_tcp_stream_tcp_packets_read_total Number of TCP packets read from the stream.
# TYPE wallarm_gonode_tcp_stream_tcp_packets_read_total counter
wallarm_gonode_tcp_stream_tcp_packets_read_total 1.2987394e+07
```

<style>
    .prom-metrics-output pre>code {
        max-height: 1000px;
        overflow-y: auto;
    }
</style>