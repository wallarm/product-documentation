# Monitoring the Native Node Metrics

The [Native Node](../installation/nginx-native-node-internals.md#native-node) exposes metrics in the [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format, allowing you to monitor its performance, traffic, and detected attacks. This guide explains how to access and interpret these metrics.

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

Contains metrics for the postanalytics service (wstore), including exported requests, errors, and active connections to postanalytics nodes.
