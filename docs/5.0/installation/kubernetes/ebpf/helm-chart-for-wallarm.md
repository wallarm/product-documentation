---
search:
  exclude: true
---

# Wallarm-Specific Values of the Wallarm eBPF Helm Chart

This document provides information about Wallarm-specific Helm chart values that can be modified during the [deployment](deployment.md) or upgrade of the eBPF solution. These values control the global configuration of the Wallarm eBPF Helm chart.

!!! warning "Limited to version 4.10"
    The Wallarm eBPF-based solution currently supports only the features available in Wallarm Node 4.10.

The Wallarm-specific part of the default `values.yaml` that you may need to change looks like the following:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
  mutualTLS: false
  agent:
    mirror:
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
    loadBalancerRealIPHeader: 'X-Real-IP'
    loadBalancerTrustedCIDRs: []
      # - 10.0.0.0/8
      # - 192.168.0.0/16
      # - 172.16.0.0/12
      # - 127.0.0.0/8
      # - fd00::/8
    ...
processing:
  ...
  metrics:
    enabled: false
    ...

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

* `us1.api.wallarm.com` for the [US cloud](../../../about-wallarm/overview.md#cloud)
* `api.wallarm.com` for the [EU cloud](../../../about-wallarm/overview.md#cloud) (default)

## config.api.port

Wallarm API endpoint port. By default, `443`.

## config.api.useSSL

Specifies whether to use SSL to access the Wallarm API. By default, `true`. 

## config.mutualTLS

Enables mTLS support, allowing the [Wallarm processing node](deployment.md#how-it-works) to authenticate the security of traffic from the eBPF agent. By default, `false` (disabled).

The parameter is supported starting from the Helm chart version 0.10.26.

## config.agent.mirror.allNamespaces

Enables traffic mirroring for all namespaces. The default value is `false`.

!!! warning "Not recommended to set to `true`"
    Enabling this by setting it to `true` can cause data duplication and increased resource usage. Prefer [selective mirroring](selecting-packets.md) using namespace labels, pod annotations, or `config.agent.mirror.filters` in `values.yaml`.

## config.agent.mirror.filters

Controls the level of traffic mirroring. Here is an example of the `filters` parameter:

```yaml
...
  agent:
    mirror:
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

[More details](selecting-packets.md)

## config.agent.loadBalancerRealIPHeader

Specifies the header name used by a load balancer to convey the original client IP address. Refer to your load balancer's documentation to identify the correct header name. By default, `X-Real-IP`.

The `loadBalancerRealIPHeader` and `loadBalancerTrustedCIDRs` parameters enable Wallarm eBPF to accurately determine the source IP when traffic is routed through an L7 load balancer (e.g., AWS ALB) external to the Kubernetes cluster.

## config.agent.loadBalancerTrustedCIDRs

Defines a whitelist of CIDR ranges for trusted L7 load balancers. Example:

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

To update these values using Helm:

```
# To add a single item to the list:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# To add multiple items to the list:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

Controls the configuration of the Wallarm node [metrics service](../../../admin-en/configure-statistics-service.md). By default, the service is disabled.

If you enable the service, it is recommended to retain the default values for `port`, `path`, and `scrapeInterval`:

```yaml
processing:
  ...
  metrics:
    enabled: true
    port: 9090
    path: /metrics
    scrapeInterval: 30s
```

## processing.affinity and processing.nodeSelector

Controls the Kubernetes nodes on which the Wallarm eBPF daemonSet is deployed. By default, it is deployed on each node.

## Applying changes

If you modify the `values.yaml` file and want to upgrade your deployed chart, use the following command:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```
