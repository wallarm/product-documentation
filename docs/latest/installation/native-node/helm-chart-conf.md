[us-cloud-docs]:                      ../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../about-wallarm/overview.md#cloud

# Configuring Native Node with the Helm Chart

When deploying the self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node) using the Helm chart, configuration is specified in the `values.yaml` file or through the CLI. This document outlines the available configuration parameters.

To modify settings after deployment, use the following command with the parameters you wish to change:

```
helm upgrade --set config.api.token=<VALUE> <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node
```

## Basic settings

The Wallarm-specific part of the default `values.yaml` that you basically might need to change looks like the following:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    nodeGroup: "defaultNodeNextGroup"

  connector:
    certificate:
      enabled: true
      certManager:
        enabled: false
        # issuerRef:
        #   name: letsencrypt-prod
        #   kind: ClusterIssuer
      existingSecret:
        enabled: false
        # name: my-secret-name
      customSecret:
        enabled: false
        # ca: LS0...
        # crt: LS0...
        # key: LS0...
    
    allowed_hosts: []

    route_config: {}
      # wallarm_application: -1
      # wallarm_mode: monitoring
      # routes:
        # - route: "/api/v1"
        #   wallarm_application: 1
        # - route: "/extra_api"
        #   wallarm_application: 2
        # - route: "/testing"
        #   wallarm_mode: monitoring
        # - host: "example.com"
        #   route: /api
        #   wallarm_application: 3

    proxy_headers:
      # Rule 1: Internal company proxies
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Rule 2: External edge proxies (e.g., CDN, reverse proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP

    log:
      pretty: false
      level: info
      log_file: stdout
      access_log:
        enabled: true
        verbose: false

  aggregation:
    serviceAddress: "[::]:3313"

processing:
  service:
    type: LoadBalancer
    port: 5000
```

### config.api.token (required)

An [API token](../../user-guides/settings/api-tokens.md) for connecting the node to the Wallarm Cloud.

To generate an API token:

1. Go to Wallarm Console → **Settings** → **API tokens** in either the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Create an API token with the **Node deployment/Deployment** usage type.

### config.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud][us-cloud-docs]
* `api.wallarm.com` for the [EU cloud][eu-cloud-docs] (default)

### config.api.nodeGroup

This specifies the name of the group of filtering nodes you want to add newly deployed nodes to.

**Default value**: `defaultNodeNextGroup`

### config.connector.mode

The Wallarm node operation mode. It can be:

* `connector-server` (default) for [connectors](../nginx-native-node-internals.md#connectors_1).
* `envoy-external-filter` for [gRPC-based external processing filter](../connectors/istio.md) for APIs managed by Istio.

### config.connector.certificate.enabled (required)

Controls whether the Wallarm Load Balancer should use SSL/TLS certificate for secure communication.

It **must be set to `true`** and **trusted certificate** must be issued for the communication.

To manage SSL/TLS communication, you can use either the `certManager`, `existingSecret` or `customSecret` approach.

#### certManager

If you use [`cert-manager`](https://cert-manager.io/) in your cluster and prefer it for generating the SSL/TLS certificate, specify the corresponding configuration in this section.

Example configuration:

```yaml
config:
  connector:
    certificate:
      enabled: true
      certManager:
        enabled: true
        issuerRef:
          # The name of the cert-manager Issuer or ClusterIssuer
          name: letsencrypt-prod
          # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
          kind: ClusterIssuer
```

#### existingSecret

You can use this configuration block to pull an SSL/TLS certificate from an existing Kubernetes secret in the same namespace.

Example configuration:

```yaml
config:
  connector:
    certificate:
      enabled: true
      existingSecret:
        enabled: true
        # The name of the Kubernetes secret containing the certificate and private key
        name: my-secret-name
```

#### customSecret

The `customSecret` configuration allows you to define a certificate directly within the configuration file, without relying on external sources like Kubernetes secrets or cert-manager.

The certificate, private key, and optionally a CA should be specified as base64-encoded values.

Example configuration:

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

### config.connector.allowed_hosts

A list of allowed hostnames.

**Default value**: all hosts are allowed.

This parameter supports wildcard matching:

* `*` matches any sequence of non-separator characters
* `?` matches any single non-separator character
* `'[' [ '^' ] { character-range } ']'`

??? info "Wildcard matching syntax details"
    ```
    // The pattern syntax is:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         matches any sequence of non-Separator characters
    //		'?'         matches any single non-Separator character
    //		'[' [ '^' ] { character-range } ']'
    //		            character class (must be non-empty)
    //		c           matches character c (c != '*', '?', '\\', '[')
    //		'\\' c      matches character c
    //
    //	character-range:
    //		c           matches character c (c != '\\', '-', ']')
    //		'\\' c      matches character c
    //		lo '-' hi   matches character c for lo <= c <= hi
    //
    // Match requires pattern to match all of name, not just a substring.
    ```

For example:

```yaml
config:
  connector:
    allowed_hosts:
      - w.com
      - "*.test.com"
```

### config.connector.route_config

Configuration section where you specify settings for specific routes.

### config.connector.route_config.wallarm_application

[Wallarm application ID](../../user-guides/settings/applications.md). This value can be overridden for specific routes.

Default: `-1`.

### config.connector.route_config.wallarm_mode

Traffic [filtration mode](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

This value can be overridden for specific routes.

!!! info "Syntax for the `off` value"
    The `off` value should be quoted `"off"`.

Default: `monitoring`.

### config.connector.route_config.routes

Sets route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

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
        - route: /testing
          wallarm_mode: block
```

#### host

Specifies the route host. This parameter supports wildcard matching the same as the [`config.connector.allowed_hosts`](#configconnectorallowed_hosts) parameter.

For example:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
```

#### routes.route or route

Defines specific routes. Routes can be configured with NGINX-like prefixes:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ prefix (lower priority than regexes)
        #  |   |   |    ^ prefix (higher priority than regexes)
        #  |   |   ^re case insensitive
        #  |   ^re case sensitive
        #  ^exact match
```

For example, to match only the exact route:

```yaml
- route: =/api/login
```

To match routes with a regular expression:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

Sets the [Wallarm application ID](../../user-guides/settings/applications.md). Overrides the `route_config.wallarm_application` for specific endpoints.

#### wallarm_mode

Host-specific traffic [filtration mode](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

!!! info "Syntax for the `off` value"
    The `off` value should be quoted `"off"`.

Default: `monitoring`.

### config.connector.proxy_headers

Configures how the Native Node extracts the original client IP and host when traffic passes through proxies or load balancers.

* `trusted_networks`: trusted proxy IP ranges (CIDRs). Headers like `X-Forwarded-For` are only trusted if the request comes from these networks.

    If omitted, all networks are trusted (not recommended).
* `original_host`: headers to use for the original `Host` value, if modified by a proxy.
* `real_ip`: headers to use for extracting the real client IP address.

You can define multiple rules for different proxy types or trust levels.

!!! info "Rule evaluation order"    
    Only the first matching rule is applied per request.

Supported in Native Node 0.17.1 and later.

Example:

```yaml
config:
  connector:
    proxy_headers:
      # Rule 1: Internal company proxies
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Rule 2: External edge proxies (e.g., CDN, reverse proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
```

### config.connector.log

The `config.connector.log.*` configuration section is available starting with the Native Node Helm chart version 0.10.0. Previously, logging was managed solely via the `config.connector.log_level` parameter.

#### pretty

Controls the error and access log format. Set to `true` for human-readable logs, or `false` for JSON logs.

Default: `false`.

#### level

Log level, can be `debug`, `info`, `warn`, `error`, `fatal`.

Default: `info`.

#### log_file

Specifies the destination for error and access log output. Options are `stdout`, `stderr`, or a path to a log file.

Default: `stdout`.

#### access_log.enabled

Controls whether to collect access logs.

Default: `true`.

#### access_log.verbose

Controls whether to include detailed information about each request in the access log output.

Default: `false`.

### config.aggregation.serviceAddress

Specifies the address and port on which **wstore** accepts incoming connections.

Supported from the release 0.15.1 onwards.

**Default value**: `[::]:3313` - listens on port 3313 on all IPv4 and IPv6 interfaces. This was also the default behavior in versions prior to 0.15.1.

### processing.service.type

Wallarm service type. Can be:

* `LoadBalancer` for running the service as a load balancer with a public IP for easy traffic routing.

    This is suitable for [connectors](../nginx-native-node-internals.md#connectors_1).
* `ClusterIP` for internal traffic, without exposing a public IP.

    This is suitable for [Kong API Gateway](../connectors/kong-api-gateway.md) connectors.

Default: `ClusterIP`.

### processing.service.port

Wallarm service port.

Default: `5000`.

## Advanced settings

The Wallarm-specific part of the default `values.yaml` that you additionally might need to change looks like the following:

```yaml
config:
  connector:
    http_inspector:
      workers: auto
      api_firewall_enabled: true
      wallarm_dir: /opt/wallarm/etc/wallarm

processing:
  metrics:
    enabled: true
    port: 9090

drop_on_overload: true
```

### config.connector.input_filters

Defines which incoming requests should be **inspected** or **bypassed** by the Native Node. This reduces CPU usage by ignoring irrelevant traffic such as static assets or health checks.

By default, all requests are inspected.

!!! warning "Requests skipped from inspection are not analyzed or sent to Wallarm Cloud"
    As a result, skipped requests do not appear in metrics, API Discovery, API sessions, vulnerability detection and so on. Wallarm features do not apply to them.

**Compatibility**

* Native Node 0.16.1 and higher

**Filtering logic**

The filtering logic is based on 2 lists:

* `inspect`: only requests matching at least one filter here are inspected.

    If omitted or empty, all requests are inspected, unless excluded by `bypass`.
* `bypass`: requests matching any filter here are never inspected, even if they match `inspect`.

**Filter format**

Each filter is an object that can include:

* `path` or `url`: regex for matching the request path (both are supported and equivalent).
* `headers`: a map of header names to regex patterns for matching their values.

All regular expressions must follow the [RE2 syntax](https://github.com/google/re2/wiki/Syntax).

**Examples**

=== "Allow requests by token, skip static content"
    This configuration inspects only requests to versioned API endpoints (e.g. `/api/v1/...`) that include a `Bearer` token in the `Authorization` header.
    
    It bypasses requests for static files (images, scripts, styles) and browser-initiated HTML page loads.

    ```yaml
    config:
      connector:
        input_filters:
          inspect:
          - path: "^/api/v[0-9]+/.*"
            headers:
              Authorization: "^Bearer .+"
          bypass:
          - path: ".*\\.(png|jpg|css|js|svg)$"
          - headers:
              accept: "text/html"
    ```
=== "Allow requests by domain, skip health checks"
    This configuration inspects only requests with `Host: api.example.com`, skipping all others.
    
    Requests to the `/healthz` endpoint are always bypassed, even if they match the inspected host.

    ```yaml
    config:
      connector:
        input_filters:
          inspect:
          - headers:
              host: "^api\\.example\\.com$"
          bypass:
          - path: "^/healthz$"
    ```

### config.connector.http_inspector.workers

Wallarm worker number.

Default: `auto`, which means the number of workers is set to the number of CPU cores.

### config.connector.http_inspector.api_firewall_enabled

Controls whether [API Specification Enforcement](../../api-specification-enforcement/overview.md) is enabled. Please note that activating this feature does not substitute for the required subscription and configuration through the Wallarm Console UI.

Default: `true`.

### config.connector.http_inspector.wallarm_dir

Specifies the directory path for node configuration files. Typically, you do not need to modify this parameter. If you need assistance, please contact the [Wallarm support team](mailto:support@wallarm.com).

Default: `/opt/wallarm/etc/wallarm`.

### processing.metrics.enabled

Controls whether [Prometheus metrics](../../admin-en/configure-statistics-service.md#usage) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### processing.metrics.port

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).

### drop_on_overload

Controls whether the Node drops incoming requests when the processing load exceeds its capacity.

**Compatibility**

* Native Node 0.16.1 and higher
* For the [Envoy connector](../connectors/istio.md), behavior depends on the `failure_mode_allow` setting

    The `drop_on_overload` configuration is not applied.

When enabled (`true`), if the Node cannot process data in real time, it drops excess input and responds with `503 (Service Unavailable)`. This prevents the Node from accumulating unprocessed requests in internal queues, which could otherwise lead to severe performance degradation or out‑of‑memory errors.

Returning 503 allows upstream services, load balancers, or clients to detect overload conditions and retry requests if needed.

In blocking [mode](../../admin-en/configure-wallarm-mode.md), such requests are not blocked.

Default: `true`.
