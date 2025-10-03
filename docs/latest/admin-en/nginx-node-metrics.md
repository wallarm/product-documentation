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

# Monitoring the NGINX Node Metrics

The [NGINX Node][nginx-node-landing] exposes metrics in the [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format, which you can use to monitor its performance, traffic, and detected attacks. This topic provides an overview of these metrics. For detailed information on each metric type, refer to its dedicated topic.

There are two types of metrics available:

* [General metrics][wstore-metrics], which include Postanalytics module **wstore** metrics and general system metrics (e.g., Go runtime, memory usage, process statistics, etc.) available at the `http://localhost:9001/metrics` endpoint by default.
* [API Firewall metrics][apifw-metrics], available at `http://<host>:9010/metrics` endpoint by default.

    The API Firewall service underlies the [API Specification Enforcement][api-spec-enforcement] feature.