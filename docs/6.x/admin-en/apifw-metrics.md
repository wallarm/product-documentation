[nginx-node-changelog]: ../updating-migrating/node-artifact-versions.md
[AIO]: ../installation/nginx/all-in-one.md
[inline]:  ../installation/nginx-native-node-internals.md#in-line
[docker]: ../admin-en/installation-docker-en.md
[nginx-node-metrics]:  ../admin-en/nginx-node-metrics.md
[api-spec-enforcement]: ../api-specification-enforcement/overview.md


# API Firewall Metrics on the NGINX Node

This article describes the API Firewall metrics of the NGINX Node. The API Firewall provides the core functionality for [API Specification Enforcement][api-spec-enforcement], which detects discrepancies between your API specification and actual REST API requests.

The metrics include data on HTTP request performance, request counts, and service errors. They help you monitor and troubleshoot the [NGINX Node][nginx-node-metrics].

Unlike [general metrics][nginx-node-metrics], API Firewall metrics are not enabled by default.

## Enabling API Firewall metrics

1. You enable metrics differently depending on your deployment type:

    * ([Docker image][docker]) Set the `APIFW_METRICS_ENABLED` environment variable to `true` when deploying the NGINX Node. 

    * ([All-in-one installer][AIO]) Once you have deployed the NGINX Node, add `APIFW_METRICS_ENABLED=true` to `/opt/wallarm/env.list`.

    Once enabled, metrics are available at `http://<host>:9010/metrics` unless custom host or path are used (see step 2 below).

2. (Optional) You can change the default API Firewall metrics endpoint `http://<host>:9010/metrics` using the following environment variables:

    * `APIFW_METRICS_ENDPOINT_NAME` - the path at which the metrics endpoint is exposed.
    * `APIFW_METRICS_HOST` - the IP address and/or port for the metrics endpoint. When specifying a port, prefix it with a colon (:).
    Expose the metrics port in your container or deployment configuration (e.g., for the default state, use `-p 9010:9010`).

3. If your NGINX node was deployed using the [all-in-one installer][AIO], restart NGINX to apply the custom API Firewall metrics settings:

    ```
    sudo systemctl restart nginx
    ```

## Example of API Firewall metrics

See the example of API Firewall metrics below.

Each metric includes `HELP` and `TYPE` metadata lines, which describe its purpose and format in detail.

```
# HELP wallarm_apifw_http_request_duration_seconds HTTP request duration in seconds
# TYPE wallarm_apifw_http_request_duration_seconds histogram
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="0.001"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="0.005"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="0.025"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="0.05"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="0.25"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="0.5"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="1"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="2.5"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="5"} 2
wallarm_apifw_http_request_duration_seconds_bucket{schema_id="1",le="+Inf"} 2
wallarm_apifw_http_request_duration_seconds_sum{schema_id="1"} 0.00028954100000000004
wallarm_apifw_http_request_duration_seconds_count{schema_id="1"} 2
# HELP wallarm_apifw_http_requests_total Total number of HTTP requests
# TYPE wallarm_apifw_http_requests_total counter
wallarm_apifw_http_requests_total{schema_id="1",status_code="200"} 2
# HELP wallarm_apifw_service_errors_total Total number of errors occurred in the APIFW service.
# TYPE wallarm_apifw_service_errors_total counter
wallarm_apifw_service_errors_total 0
```
