# Configuring TCP Traffic Mirror Analysis

In the configuration file you create for deploying the Wallarm node for TCP Traffic Mirror analysis (`wallarm-node-conf.yaml` as specified in the [deployment instructions](deployment.md)), you can fine-tune the solution deployed.

Below is an example file content with parameters you may need to change:

```yaml
Version: 1

GoreplayMiddleware:
  Enabled: true
  Goreplay:
    Filter: <your network interface, i.e. "lo:" or "enp7s0:">
    ExtraArgs:
      - ...
      - ...
  Middleware:
    ParseResponses: true
    ResponseTimeout: 5s
    RouteConfig:
      Wallarm:
        ApplicationId: 10
      Routes:
        - Route: "/api/v1"
          Wallarm:
            ApplicationId: 1
        - Route: "/extra_api"
          Wallarm:
            ApplicationId: 2
        - Route: "/testing"
          Wallarm:
            Mode: off
  Wallarm:
    WallarmDirPath: /etc/wallarm
    RealIpHeader: "x-real-ip"
  WallarmExporter:
    Address: "127.0.0.1:3313"

Log:
  Pretty: true
  Level: info
  LogFile: stderr

Metrics:
  Enabled: true
  ListenAddress: :9000

HealthCheck:
  Enabled: true
  ListenAddress: :8080
```

## GoreplayMiddleware.Enabled (required)

Controls whether the Wallarm node is enabled for TCP traffic mirror analysis.

## GoreplayMiddleware.Goreplay.Filter

Specifies a network interface to capture traffic from. If no value is specified, it captures traffic from all network interfaces on the instance. Example configuration:

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

## GoreplayMiddleware.Goreplay.ExtraArgs

Specifies arguments for what traffic to capture:

* For VLAN-wrapped mirrored traffic, provide the following:

    ```yaml
    Version: 1
    GoreplayMiddleware:
      Enabled: true
      Goreplay:
        Filter: <your network interface, i.e. "lo:" or "enp7s0:">
        ExtraArgs:
          - -input-raw-vlan
          - -input-raw-vlan-vid
          - 42 # VID of your vlan
    ```

* For VXLAN-wrapped mirrored traffic (e.g. for AWS traffic mirroring), provide the following:

    ```yaml
    Version: 1
    GoreplayMiddleware:
      Enabled: true
      Goreplay:
        Filter: <your network interface, i.e. "lo:" or "enp7s0:">
        ExtraArgs:
          - -input-raw-engine
          - vxlan
          - -input-raw-vxlan-port # custom VXLAN UDP port
          - 4789                  # custom VXLAN UDP port
          - -input-raw-vxlan-vni  # specific VNI (capture all by default)
          - 1                     # specific VNI
    ```

## GoreplayMiddleware.Middleware.ParseResponses

Controls whether to parse mirrored responses. This enables Wallarm features that rely on response data, such as [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) and [API discovery](../../../api-discovery/overview.md).

By default, `true`.

Ensure response mirroring is configured in your environment to the target instance with the Wallarm node.

## GoreplayMiddleware.Middleware.ResponseTimeout

Specifies the maximum time to wait for a response in seconds. If a response is not received within this time, the Wallarm processes stop waiting does not parse the corresponding response.

Default: `5s`.

## GoreplayMiddleware.Middleware.RouteConfig

Configuration section where you specify settings for specific routes.

## GoreplayMiddleware.Middleware.RouteConfig.Wallarm.ApplicationId

[Wallarm application ID](../../../user-guides/settings/applications.md). This value can be overridden for specific routes.

## GoreplayMiddleware.Middleware.RouteConfig.Routes

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
              Wallarm: # Will be applited to requests to example.com/app2
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

### Host

Specifies the route host.

### Routes.Route or Route

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

### Wallarm.ApplicationId

Sets the [Wallarm application ID](../../../user-guides/settings/applications.md). Overrides the `GoreplayMiddleware.Middleware.RouteConfig.Wallarm.ApplicationId` for specific endpoints.

### Wallarm.Mode

Traffic [filtration mode](../../../admin-en/configure-wallarm-mode.md): `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

Default: `monitoring`.

## GoreplayMiddleware.Wallarm.WallarmDirPath

Specifies the directory path for node configuration files. Files are placed in `/opt/wallarm` and then in the specified directory.

Default: `/etc/wallarm` which means `/opt/wallarm/etc/wallarm`.

## GoreplayMiddleware.Wallarm.RealIpHeader

Specifies the header to extract the [real IP address](../../../admin-en/using-proxy-or-balancer-en.md) from requests.

## GoreplayMiddleware.WallarmExporter.Address

Sets the address for the postanalytics service, crucial for the solution. This service handles statistical request analysis in Wallarm's request processing.

## Log.Pretty

Controls the log format. Set to `true` for human-readable logs, or `false` for JSON logs.

Default: `true`.

## Log.Level

Log level, can be `debug`, `info`, `warn`, `error`, `fatal`.

Default: `info`.

## Log.LogFile

Specifies the destination for log output. Options are `stdout`, `stderr`, or a path to a log file.

Default: `/opt/wallarm/var/log/wallarm/go-node.log`.

## Metrics.Enabled

Controls whether Prometheus metrics are enabled.

Default: `true`.

## Metrics.ListenAddress

Sets the address and port where Prometheus metrics will be exposed.

Default: `:9000` (all network interfaces on the port 9000).

## HealthCheck.Enabled

Controls whether health check endpoints are enabled.

Default: `true`.

## HealthCheck.ListenAddress

Sets the address and port for the `/live` and `/ready` health check endpoints.

Default: `:8080` (all network interfaces on the port 8080).
