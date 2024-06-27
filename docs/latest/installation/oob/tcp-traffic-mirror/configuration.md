# Configuring TCP Traffic Mirror Analysis

In the configuration file you create for deploying the Wallarm node for TCP Traffic Mirror analysis (`wallarm-node-conf.yaml` as specified in the [deployment instructions](deployment.md)), you can fine-tune the solution deployed.

## Basic settings

```yaml
Version: 1

GoreplayMiddleware:
  Enabled: true
  Goreplay:
    Filter: <your network interface and port, e.g. "lo:" or "enp7s0:">
    ExtraArgs:
      - -input-raw-engine
      - vxlan
  Middleware:
    RouteConfig:
      Wallarm:
        ApplicationId: 10
      Routes:
        - Route: "/api/v1"
          Wallarm:
            ApplicationId: 1
        - Route: "/testing"
          Wallarm:
            Mode: off
  Wallarm:
    RealIpHeader: "X-Real-IP"

Log:
  Pretty: true
  Level: info
  LogFile: stderr
```

### GoreplayMiddleware.Enabled (required)

Controls whether the Wallarm node is enabled for TCP traffic mirror analysis.

### GoreplayMiddleware.Goreplay.Filter

Specifies a network interface to capture traffic from. If no value is specified, it captures traffic from all network interfaces on the instance.

Note that the value should be the network interface and port separated by a colon (`:`). Examples of filters include `eth0:`, `eth0:80`, or `:80` (to intercept a specific port on all interfaces), e.g.:

```yaml
Version: 1
GoreplayMiddleware:
  Enabled: true
  Goreplay:
    Filter: "eth0:"
```

To check network interfaces available on the host, run:

```
ip link show command
```

### GoreplayMiddleware.Goreplay.ExtraArgs

This parameter allows you to specify [extra arguments](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) to be passed to GoReplay.

Typically, you will use it to define the types of mirrored traffic requiring analysis, such as VLAN, VXLAN. For example:

* For VLAN-wrapped mirrored traffic, provide the following:

    ```yaml
    Version: 1
    GoreplayMiddleware:
      Enabled: true
      Goreplay:
        Filter: <your network interface and port, e.g. "lo:" or "enp7s0:">
        ExtraArgs:
          - -input-raw-vlan
          - -input-raw-vlan-vid
          # VID of your VLAN, e.g.:
          # - 42
    ```

* For VXLAN-wrapped mirrored traffic (e.g. for AWS traffic mirroring), provide the following:

    ```yaml
    Version: 1
    GoreplayMiddleware:
      Enabled: true
      Goreplay:
        Filter: <your network interface and port, e.g. "lo:" or "enp7s0:">
        ExtraArgs:
          - -input-raw-engine
          - vxlan
          # Custom VXLAN UDP port, e.g.:
          # - -input-raw-vxlan-port 
          # - 4789
          # Specific VNI (by default, all VNIs are captured), e.g.:
          # - -input-raw-vxlan-vni
          # - 1
    ```

* If the mirrored traffic is not wrapped in additional protocols like VLAN or VXLAN, you can omit the `ExtraArgs` configuration. Unencapsulated traffic is parsed by default.

    ```yaml
    Version: 1
    GoreplayMiddleware:
      Enabled: true
      Goreplay:
        Filter: <your network interface and port, e.g. "lo:" or "enp7s0:">
    ```

### GoreplayMiddleware.Middleware.RouteConfig

Configuration section where you specify settings for specific routes.

### GoreplayMiddleware.Middleware.RouteConfig.Wallarm.ApplicationId

[Wallarm application ID](../../../user-guides/settings/applications.md). This value can be overridden for specific routes.

### GoreplayMiddleware.Middleware.RouteConfig.Routes

Specifies route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

```yaml
Version: 1
GoreplayMiddleware:
  Enabled: true
  ...
  Middleware:
    ...
    RouteConfig:
      Wallarm:
        ApplicationId: 10
      Routes:
        - Host: example.com
          Wallarm:
            ApplicationId: 1
          Routes: # Subconfigs are allowed
            - Route: /app2
              Wallarm: # Will be applied to requests to example.com/app2
                ApplicationId: 2
        - Host: api.example.com
          Route: /api
          Wallarm:
            ApplicationId: 100
        - Route: /testing
          Wallarm:
            Mode: off
  ...
```

#### Host

Specifies the route host.

#### Routes.Route or Route

Defines specific routes. Routes can be configured with NGINX-like prefixes:

```yaml
- Route: [ = | ~ | ~* | ^~ |   ]/location
           |   |   |    |    ^ prefix (lower priority than regexes)
           |   |   |    ^ prefix (higher priority than regexes)
           |   |   ^re case insensitive
           |   ^re case sensitive
           ^exact match
```

For example, to match only the exact route:

```yaml
- Route: =/api/login
```

To match routes with the regex:

```yaml
- Route: ~/user/[0-9]+/login.*
```

#### Wallarm.ApplicationId

Sets the [Wallarm application ID](../../../user-guides/settings/applications.md). Overrides the `GoreplayMiddleware.Middleware.RouteConfig.Wallarm.ApplicationId` for specific endpoints.

#### Wallarm.Mode

Traffic [filtration mode](../../../admin-en/configure-wallarm-mode.md): `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

Default: `monitoring`.

### GoreplayMiddleware.Wallarm.RealIpHeader

By default, Wallarm reads the source IP address from the network packet's IP headers. However, proxies and load balancers can change this to their own IPs.

To preserve the real client IP, these intermediaries often add an HTTP header (e.g., `X-Real-IP`, `X-Forwarded-For`). The `RealIpHeader` parameter tells Wallarm which header to use to extract the original client IP.

### Log.Pretty

Controls the log format. Set to `true` for human-readable logs, or `false` for JSON logs.

Default: `true`.

### Log.Level

Log level, can be `debug`, `info`, `warn`, `error`, `fatal`.

Default: `info`.

### Log.LogFile

Specifies the destination for log output. Options are `stdout`, `stderr`, or a path to a log file.

Default: `stderr`. However, the node redirects `stderr` to the file `/opt/wallarm/var/log/wallarm/go-node.log`.

## Advanced settings

```yaml
Version: 1

GoreplayMiddleware:
  Goreplay:
    Path: /opt/wallarm/usr/bin/gor
  Middleware:
    ParseResponses: true
    ResponseTimeout: 5s
  Wallarm:
    WallarmDirPath: /opt/wallarm/etc/wallarm/
    APIFirewall:
      Enabled: true
      DatabasePath: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
    Workers: auto
    ShmDir: /tmp
    EnableLibdetection: true
  WallarmExporter:
    Address: 127.0.0.1:3313
    Enabled: true

Log:
  ProtonLogMask: info@*

Metrics:
  Enabled: true
  ListenAddress: :9000
  LegacyStatus:
    Enabled: true
    ListenAddress: 127.0.0.8:80

HealthCheck: 
  Enabled: true
  ListenAddress: :8080
```

### GoreplayMiddleware.Goreplay.Path

The path to the GoReplay binary file. Typically, you do not need to modify this parameter.

Default: `/opt/wallarm/usr/bin/gor`.

### GoreplayMiddleware.Middleware.ParseResponses

Controls whether to parse mirrored responses. This enables Wallarm features that rely on response data, such as [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) and [API discovery](../../../api-discovery/overview.md).

By default, `true`.

Ensure response mirroring is configured in your environment to the target instance with the Wallarm node.

### GoreplayMiddleware.Middleware.ResponseTimeout

Specifies the maximum time to wait for a response. If a response is not received within this time, the Wallarm processes stop waiting the corresponding response.

Default: `5s`.

### GoreplayMiddleware.Wallarm.WallarmDirPath

Specifies the directory path for node configuration files. Typically, you do not need to modify this parameter. If you need assistance, please contact the [Wallarm support team](mailto:support@wallarm.com).

Default: `/opt/wallarm/etc/wallarm`.

### GoreplayMiddleware.Wallarm.APIFirewall.Enabled

Controls whether [API Specification Enforcement](../../../api-specification-enforcement/overview.md) is enabled. Please note that activating this feature does not substitute for the required subscription and configuration through the Wallarm Console UI.

Default: `true`.

### GoreplayMiddleware.Wallarm.APIFirewall.DatabasePath

Specifies the path to the database containing the API specifications you have uploaded for [API Specification Enforcement](../../../api-specification-enforcement/overview.md). This database synchronizes with the Wallarm Cloud.

Typically, you do not need to modify this parameter.

Default: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`.

### GoreplayMiddleware.Wallarm.Workers

Wallarm worker number.

Default: `auto`, which means the number of workers is set to the number of CPU cores.

### GoreplayMiddleware.Wallarm.ShmDir

HTTP analyzer shared directory. Typically, you do not need to modify this parameter.

Default: `/tmp`.

### GoreplayMiddleware.Wallarm.EnableLibdetection

Whether to additionally validate the SQL Injection attacks using the [libdetection](../../../about-wallarm/protecting-against-attacks.md#libdetection-overview) library.

Default: `true`.

### GoreplayMiddleware.WallarmExporter.Address

Sets the address for the postanalytics service which handles statistical request analysis in Wallarm's request processing. Typically, you do not need to modify this parameter.

Default: `127.0.0.1:3313`.

### GoreplayMiddleware.WallarmExporter.Enabled

Controls whether the postanalytics service is enabled. This parameter must be set to `true` as the Wallarm node does not function without the postanalytics service.

Default: `true`.

### Log.ProtonLogMask

The mask for internal traffic logging. Typically, you do not need to modify this parameter.

Default: `info@*`.

### Metrics.Enabled

Controls whether [Prometheus metrics](../../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### Metrics.ListenAddress

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).

### Metrics.LegacyStatus.Enabled

Controls whether the [`/wallarm-status`](../../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) metrics service is enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### Metrics.LegacyStatus.ListenAddress

Sets the address and port where `/wallarm-status` metrics in JSON format will be exposed. To access these metrics, use the `/wallarm-status` endpoint.

Default: `127.0.0.8:80`.

### HealthCheck.Enabled

Controls whether health check endpoints are enabled.

Default: `true`.

### HealthCheck.ListenAddress

Sets the address and port for the `/live` and `/ready` health check endpoints.

Default: `:8080` (all network interfaces on the port 8080).
