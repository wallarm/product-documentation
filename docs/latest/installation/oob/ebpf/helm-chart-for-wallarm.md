# Wallarm-Specific Values of the Wallarm eBPF Helm Chart

This document provides information about Wallarm-specific Helm chart values that can be modified during the [deployment](deployment.md) or upgrade of the eBPF solution. These values control the global configuration of the Wallarm eBPF Helm chart.

The Wallarm-specific part of the [default `values.yaml`](https://github.com/wallarm/oob-ebpf/blob/main/helm/values.yaml) that you may need to change looks like the following:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
  agent:
    mirror:
      tls: false
      allNamespaces: false
      filters: []
      # - namespace: "default"
      # - namespace: 'my-namespace'
      #   pod_labels:
      #     label_name1: 'label_value_1'
      #     label_name2: 'label_value_2,label_value_3'
      #   pod_annotations:
      #      annotation_name1: 'annotation_value_1'
      #      annotation_name2: 'annotation_value_2,annotation_value_4'
    ...
processing:
  ...
  metrics:
    enabled: false
    port: 9090
    path: /metrics
    scrapeInterval: 30s

  affinity: {}
  # podAntiAffinity:
  #   preferredDuringSchedulingIgnoredDuringExecution:
  #   - weight: 100
  #     podAffinityTerm:
  #       labelSelector:
  #         matchExpressions:
  #         - key: component
  #           operator: In
  #           values:
  #           - mtls-router
  #         - key: app
  #           operator: In
  #           values:
  #           - mtls-router
  #       topologyKey: kubernetes.io/hostname
  nodeSelector:
    kubernetes.io/os: linux
```

## config.api.token

The Wallarm node token created in Wallarm Console in the [US](https://us1.my.wallarm.com/nodes) or [EU](https://my.wallarm.com/nodes) Cloud. It is required to access Wallarm API.

## config.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud](../../../about-wallarm/overview.md#us-cloud)
* `api.wallarm.com` for the [EU cloud](../../../about-wallarm/overview.md#eu-cloud) (default)

## config.api.port

Wallarm API endpoint port. By default, `443`.

## config.api.useSSL

Specifies whether to use SSL to access the Wallarm API. By default, `true`. 

## config.agent.mirror.tls

Indicates whether the Wallarm eBPF should process HTTPS traffic. By default, `false`.

## config.agent.mirror.allNamespaces

Enables traffic mirroring for all namespaces. The default value is `false`. It is recommended to enable traffic mirroring at lower levels, such as specific namespaces, pods, or containers.

## config.agent.mirror.filters

Controls the level of traffic mirroring. The Wallarm eBPF solution inspects the traffic that is mirrored according to these filters.

You can configure filters to mirror traffic from the following entities:

* Namespace
* Pod labels
* Pod annotations
* Pod name
* Node name
* Container name

All filters are applied together using the AND logic, except for those with multiple values specified using a comma. Filters with multiple values are processed based on the OR logic.

Here is an example of the `filters` parameter:

```yaml
...
  agent:
    mirror:
      tls: false
      allNamespaces: false
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            label_name1: 'label_value_1'
            label_name2: 'label_value_2,label_value_3'
          pod_annotations:
            annotation_name1: 'annotation_value_1'
            annotation_name2: 'annotation_value_2,annotation_value_4'
```

The `filters` parameter has the lowest priority among all the possible ways to enable traffic mirroring.

## processing.metrics

Controls the configuration of the Wallarm node [metrics service](../../../admin-en/configure-statistics-service.md). By default, the service is disabled.

## processing.affinity and processing.nodeSelector

Controls the Kubernetes nodes on which the Wallarm eBPF daemonSet is deployed. By default, it is deployed on each node.

## Applying changes

If you modify the `values.yaml` file and want to upgrade your deployed chart, use the following command:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```
