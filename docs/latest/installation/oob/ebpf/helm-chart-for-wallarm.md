# Wallarm-Specific Values of the Wallarm eBPF Helm Chart

This document provides information about Wallarm-specific Helm chart values that can be modified during the [deployment](deployment.md) or upgrade of the eBPF solution. These values control the global configuration of the Wallarm eBPF Helm chart.

The Wallarm-specific part of the default `values.yaml` that you may need to change looks like the following:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
  mutualTLS: false
  connector:
    allowed_hosts: []
    certificate:
      enabled: false
      certManager:
        enabled: false
      existingSecret:
        enabled: false
      customSecret:
        enabled: false
    route_config: {}
    input_filters: {}
    proxy_headers: []
    http_inspector: {}
    per_connection_limits:
      max_duration: 1m
    log:
      pretty: false
      level: info
      log_file: stdout
      access_log:
        enabled: true
        verbose: false
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
  aggregation:
    wstoreMemory: 2.0
  wcli:
    commands: ...
    logLevel: warn
processing:
  metrics:
    enabled: true
    port: 9090
    path: /metrics
  affinity: {}
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

Enables mTLS support, allowing the [Wallarm Native Node](deployment.md#how-it-works) to authenticate the security of traffic from the eBPF agent. By default, `false` (disabled).

## config.connector

The eBPF chart's Native Node supports the same configuration parameters as the [Wallarm Native Node Helm chart](../../../installation/native-node/helm-chart-conf.md). You can use `config.connector` parameters to fine-tune traffic processing, for example, for application-specific settings.

### config.connector.allowed_hosts

A list of allowed hostnames in the `Host` header. By default, empty (all hosts allowed).

Supports wildcard matching: `*` matches any sequence of non-separator characters, `?` matches any single non-separator character.

Example:

```yaml
config:
  connector:
    allowed_hosts:
      - w.com
      - "*.test.com"
```

### config.connector.certificate

Certificate provisioning mode for secure communication between the eBPF agent and the Native Node. Supports the following methods:

=== "certManager"
    Use [`cert-manager`](https://cert-manager.io/) if installed in your cluster:

    ```yaml
    config:
      connector:
        certificate:
          enabled: true
          certManager:
            enabled: true
            issuerRef:
              name: letsencrypt-prod
              kind: ClusterIssuer
    ```

=== "existingSecret"
    Use an existing Kubernetes secret pre-provisioned in the app namespace (mandatory fields: `tls.crt` and `tls.key`):

    ```yaml
    config:
      connector:
        certificate:
          enabled: true
          existingSecret:
            enabled: true
            name: my-secret-name
    ```

=== "customSecret"
    Define a certificate directly in `values.yaml` as base64-encoded values:

    ```yaml
    config:
      connector:
        certificate:
          enabled: true
          customSecret:
            enabled: true
            ca: LS0...
            crt: LS0...
            key: LS0...
    ```

By default, certificate provisioning is disabled.

### config.connector.route_config

Configuration section for route-specific settings, including [Wallarm application IDs](../../../user-guides/settings/applications.md) and filtration mode.

* `wallarm_application` — [Wallarm application ID](../../../user-guides/settings/applications.md). Default: `-1`.
* `wallarm_mode` — traffic [filtration mode](../../../admin-en/configure-wallarm-mode.md): `monitoring` or `"off"`. Default: `monitoring`.
* `routes` — list of route-specific overrides. Each route can specify `host`, `route`, `wallarm_application`, and `wallarm_mode`.

Routes support NGINX-like prefix matching: `=` (exact), `~` (regex case-sensitive), `~*` (regex case-insensitive), `^~` (prefix, higher priority than regex).

Example:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - host: example.com
          wallarm_application: 1
          routes:
            - route: /app2
              wallarm_application: 2
        - host: api.example.com
          route: /api
          wallarm_application: 100
```

For the full route configuration reference, see the [Native Node documentation](../../../installation/native-node/helm-chart-conf.md#configconnectorroute_config).

### config.connector.input_filters

Defines which incoming requests should be inspected or bypassed. This reduces CPU usage by ignoring irrelevant traffic such as static assets or health checks. By default, all requests are inspected.

* `inspect` — only requests matching at least one filter are inspected. If omitted, all requests are inspected unless excluded by `bypass`.
* `bypass` — requests matching any filter are never inspected, even if they match `inspect`.

Each filter can include `path` (regex for matching the request path) and `headers` (map of header names to regex patterns).

Example:

```yaml
config:
  connector:
    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
```

For more examples, see the [Native Node documentation](../../../installation/native-node/helm-chart-conf.md#configconnectorinput_filters).

### config.connector.proxy_headers

Configures how the Native Node extracts the original client IP and host when traffic passes through proxies or load balancers.

* `trusted_networks` — trusted proxy IP ranges (CIDRs). Headers like `X-Forwarded-For` are only trusted from these networks. If omitted, all networks are trusted (not recommended).
* `original_host` — headers to use for the original `Host` value.
* `real_ip` — headers to use for extracting the real client IP address.

You can define multiple rules for different proxy types. Only the first matching rule is applied per request.

Example:

```yaml
config:
  connector:
    proxy_headers:
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For
```

### config.connector.http_inspector

Controls the HTTP inspection engine:

* `workers` — number of Wallarm workers. Default: `auto` (equals the number of CPU cores).
* `api_firewall_enabled` — controls whether [API Specification Enforcement](../../../api-specification-enforcement/overview.md) is enabled. Default: `true`.

### config.connector.per_connection_limits

Per-connection limits. By default, `max_duration` is set to `1m`. Refer to the [per-connection limits documentation](../../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) for details.

### config.connector.log

Logging configuration:

* `pretty` — set to `true` for human-readable logs, `false` for JSON. Default: `false`.
* `level` — log level: `debug`, `info`, `warn`, `error`, `fatal`. Default: `info`.
* `log_file` — log destination: `stdout`, `stderr`, or a file path. Default: `stdout`.
* `access_log.enabled` — enable access log. Default: `true`.
* `access_log.verbose` — include detailed information about each request. Default: `false`.

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

## config.aggregation.wstoreMemory

The allocated memory size in GB for wstore in-memory storage. By default, `2.0`. Detailed recommendations are provided in the [resource allocation guide](../../../admin-en/configuration-guides/allocate-resources-for-node.md).

## config.wcli

Configures the scheduled jobs (formerly `config.supervisord`). Contains:

* `commands` - log level settings for individual scheduled commands (exportEnvironment, exportAttacks, syncNode, etc.)
* `logLevel` - general log level for the job runner. By default, `warn`. Possible values: `trace`, `debug`, `info`, `warn`, `error`, `fatal`, `panic`, `disabled`

## processing.metrics

Controls the configuration of the Wallarm node metrics service. By default, the service is enabled.

```yaml
processing:
  metrics:
    enabled: true
    port: 9090
    path: /metrics
```

## agent.metrics

Controls the metrics configuration of the eBPF agent DaemonSet. By default, metrics are enabled.

```yaml
agent:
  metrics:
    enabled: true
    type: VictoriaMetrics
    port: 9090
    path: /metrics
```

## processing.affinity and processing.nodeSelector

Controls the Kubernetes nodes on which the Wallarm eBPF processing pods are scheduled. By default, they are deployed on Linux nodes.

## Applying changes

If you modify the `values.yaml` file and want to upgrade your deployed chart, use the following command:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```
