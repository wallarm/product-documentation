# Configuring TCP Traffic Mirror Analysis

In the configuration file you create for deploying the Wallarm node for TCP Traffic Mirror analysis (`wallarm-node-conf.yaml` as specified in the [deployment instructions](deployment.md)), you can fine-tune the solution deployed.

## Basic settings

```yaml
version: 2

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan

route_config:
  wallarm_application: 10
  routes:
    - route: /example/api/v1
      wallarm_mode: off
    - route: /example/extra_api
      wallarm_application: 2
    - route: /example/testing
      wallarm_mode: off

http_inspector:
  real_ip_header: "X-Real-IP"

log:
  pretty: true
  level: debug
  log_file: stderr
  access_log:
    enabled: true
    verbose: true
    log_file: stderr
```

### mode (required)

The Wallarm node operation mode. Currently, it can be only `tcp-capture`.

### goreplay.filter

Specifies a network interface to capture traffic from. If no value is specified, it captures traffic from all network interfaces on the instance.

Note that the value should be the network interface and port separated by a colon (`:`). Examples of filters include `eth0:`, `eth0:80`, or `:80` (to intercept a specific port on all interfaces), e.g.:

```yaml
version: 2

goreplay:
  filter: 'eth0:'
```

To check network interfaces available on the host, run:

```
ip addr show
```

### goreplay.extra_args

This parameter allows you to specify [extra arguments](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) to be passed to GoReplay.

Typically, you will use it to define the types of mirrored traffic requiring analysis, such as VLAN, VXLAN. For example:

* For VLAN-wrapped mirrored traffic, provide the following:

    ```yaml
    version: 2

    goreplay:
      extra_args:
        - -input-raw-vlan
        - -input-raw-vlan-vid
        # VID of your VLAN, e.g.:
        # - 42
    ```

* For VXLAN-wrapped mirrored traffic (e.g. for AWS traffic mirroring), provide the following:

    ```yaml
    version: 2

    goreplay:
      extra_args:
        - -input-raw-engine
        - vxlan
        # Custom VXLAN UDP port, e.g.:
        # - -input-raw-vxlan-port 
        # - 4789
        # Specific VNI (by default, all VNIs are captured), e.g.:
        # - -input-raw-vxlan-vni
        # - 1
    ```

* If the mirrored traffic is not wrapped in additional protocols like VLAN or VXLAN, you can omit the `extra_args` configuration. Unencapsulated traffic is parsed by default.

### route_config

Configuration section where you specify settings for specific routes.

### route_config.wallarm_application

[Wallarm application ID](../../../user-guides/settings/applications.md). This value can be overridden for specific routes.

### route_config.routes

Sets route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

```yaml
version: 2

route_config:
  wallarm_application: 10
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
      wallarm_mode: off
```

#### host

Specifies the route host.

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
version: 2

route_config:
  wallarm_application: 10
  routes:
    - host: "*.host.com"
```

#### routes.route or route

Defines specific routes. Routes can be configured with NGINX-like prefixes:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
           |   |   |    |    ^ prefix (lower priority than regexes)
           |   |   |    ^ prefix (higher priority than regexes)
           |   |   ^re case insensitive
           |   ^re case sensitive
           ^exact match
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

Sets the [Wallarm application ID](../../../user-guides/settings/applications.md). Overrides the `route_config.wallarm_application` for specific endpoints.

#### wallarm_mode

Traffic [filtration mode](../../../admin-en/configure-wallarm-mode.md): `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

Default: `monitoring`.

### http_inspector.real_ip_header

By default, Wallarm reads the source IP address from the network packet's IP headers. However, proxies and load balancers can change this to their own IPs.

To preserve the real client IP, these intermediaries often add an HTTP header (e.g., `X-Real-IP`, `X-Forwarded-For`). The `real_ip_header` parameter tells Wallarm which header to use to extract the original client IP.

### log.pretty

Controls the error and access log format. Set to `true` for human-readable logs, or `false` for JSON logs.

Default: `true`.

### log.level

Log level, can be `debug`, `info`, `warn`, `error`, `fatal`.

Default: `info`.

### log.log_file

Specifies the destination for error log output. Options are `stdout`, `stderr`, or a path to a log file.

Default: `stderr`. However, the node redirects `stderr` to the file `/opt/wallarm/var/log/wallarm/go-node.log`.

### log.access_log (version 0.5.1 and above)

#### enabled

Controls whether to collect access logs.

Default: `true`.

#### verbose

Controls whether to include detailed information about each request in the access log output.

Default: `true`.

#### log_file

Specifies the destination for access log output. Options are `stdout`, `stderr`, or a path to a log file.

Default: `stderr`. However, the node redirects `stderr` to the file `/opt/wallarm/var/log/wallarm/go-node.log`.

If not set, the [`log.log_file`](#loglog_file) setting is used.

## Advanced settings

```yaml
version: 2

goreplay:
  path: /opt/wallarm/usr/bin/gor

middleware:
  parse_responses: true
  response_timeout: 5s

http_inspector:
  workers: auto
  libdetection_enabled: true
  api_firewall_enabled: true
  api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
  wallarm_dir: /opt/wallarm/etc/wallarm
  shm_dir: /tmp

tarantool_exporter:
  address: 127.0.0.1:3313
  enabled: true

log:
  proton_log_mask: info@*

metrics:
  enabled: true
  listen_address: :9000
  legacy_status:
    enabled: true
    listen_address: 127.0.0.8:80

health_check:
  enabled: true
  listen_address: :8080
```

### goreplay.path

The path to the GoReplay binary file. Typically, you do not need to modify this parameter.

Default: `/opt/wallarm/usr/bin/gor`.

### middleware.parse_responses

Controls whether to parse mirrored responses. This enables Wallarm features that rely on response data, such as [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) and [API discovery](../../../api-discovery/overview.md).

By default, `true`.

Ensure response mirroring is configured in your environment to the target instance with the Wallarm node.

### middleware.response_timeout

Specifies the maximum time to wait for a response. If a response is not received within this time, the Wallarm processes stop waiting the corresponding response.

Default: `5s`.

### http_inspector.workers

Wallarm worker number.

Default: `auto`, which means the number of workers is set to the number of CPU cores.

### http_inspector.libdetection_enabled

Whether to additionally validate the SQL Injection attacks using the [libdetection](../../../about-wallarm/protecting-against-attacks.md#libdetection-overview) library.

Default: `true`.

### http_inspector.api_firewall_enabled

Controls whether [API Specification Enforcement](../../../api-specification-enforcement/overview.md) is enabled. Please note that activating this feature does not substitute for the required subscription and configuration through the Wallarm Console UI.

Default: `true`.

### http_inspector.api_firewall_database

Specifies the path to the database containing the API specifications you have uploaded for [API Specification Enforcement](../../../api-specification-enforcement/overview.md). This database synchronizes with the Wallarm Cloud.

Typically, you do not need to modify this parameter.

Default: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`.

### http_inspector.wallarm_dir

Specifies the directory path for node configuration files. Typically, you do not need to modify this parameter. If you need assistance, please contact the [Wallarm support team](mailto:support@wallarm.com).

Default: `/opt/wallarm/etc/wallarm`.

### http_inspector.shm_dir

HTTP analyzer shared directory. Typically, you do not need to modify this parameter.

Default: `/tmp`.

### tarantool_exporter.address

Sets the address for the postanalytics service which handles statistical request analysis in Wallarm's request processing. Typically, you do not need to modify this parameter.

Default: `127.0.0.1:3313`.

### tarantool_exporter.enabled

Controls whether the postanalytics service is enabled. This parameter must be set to `true` as the Wallarm node does not function without the postanalytics service.

Default: `true`.

### log.proton_log_mask

The mask for internal traffic logging. Typically, you do not need to modify this parameter.

Default: `info@*`.

### metrics.enabled

Controls whether [Prometheus metrics](../../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.listen_address

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).

### metrics.legacy_status.enabled

Controls whether the [`/wallarm-status`](../../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) metrics service is enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.legacy_status.listen_address

Sets the address and port where `/wallarm-status` metrics in JSON format will be exposed. To access these metrics, use the `/wallarm-status` endpoint.

Default: `127.0.0.8:80`.

### health_check.enabled

Controls whether health check endpoints are enabled.

Default: `true`.

### health_check.listen_address

Sets the address and port for the `/live` and `/ready` health check endpoints.

Default: `:8080` (all network interfaces on the port 8080).
