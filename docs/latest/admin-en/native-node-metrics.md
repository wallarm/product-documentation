[nginx-node-landing]:  ../installation/nginx-native-node-internals/#native-node
[wstore-metrics]: ../admin-en/native-node-metrics-wstore.md
[go-node-metrics]: ../admin-en/native-node-metrics-gonode.md

# Monitoring the Native Node Metrics

The [Native Node][nginx-node-landing] exposes metrics in the [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format, which you can use to monitor its performance, traffic, and detected attacks. This topic provides an overview of these metrics. For detailed information on each metric type, refer to its dedicated topic.

There are 2 types of metrics available:

* [Postanalytics metrics][wstore-metrics] — include Postanalytics module **wstore** metrics, available by default at the `http://localhost:9001/metrics` endpoint. The metrics are available [starting from version 0.20.0][native-node-changelog] for all deployment options except [Amazon Machine Image (AMI)][aws-ami].
* [Go Node metrics][go-node-metrics] — provide information about the Node's internal operations (e.g., blocked/bypassed traffic, HTTP inspection, Go runtime statistics). These metrics are available by default at the `http://<NODE_IP>:9000/metrics` endpoint.
