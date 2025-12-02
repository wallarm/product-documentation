# Configuring TCP Traffic Mirror Analysis

In the configuration file you create for deploying the Wallarm node for TCP Traffic Mirror analysis (`wallarm-node-conf.yaml` as specified in the [deployment instructions](deployment.md)), you can fine-tune the solution deployed.

## Basic settings

```yaml
version: 4

mode: tcp-capture-v2

tcp_stream:
  from_interface:
    enabled: true
    # Network interface to capture traffic from, e.g., "lo" or "enp7s0"
    interface: "enp7s0" 
    # Number of bytes to capture from each packet (Libpcap snaplen)
    snap_len: 65535
    # Enable capturing all packets on the interface, including those not addressed to it
    # Does not work if interface is set to "any"
    promiscuous: true
    # BPF filter expression to select packets and/or ports (by default, absent or empty)
    filter: "vlan and port 80"

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

The Wallarm node operation mode. It should be `tcp-capture-v2` for TCP traffic mirror analysis.

### tcp_stream.from_interface.enabled (required)

Specifies if capturing traffic from a network interface is active.

Default: `false`.

```yaml
version: 4

mode: tcp-capture-v2

tcp_stream:
  from_interface:
    enabled: true
    interface: "lo"
```

### tcp_stream.from_interface.interface (required)

Specifies the network interface name to capture traffic from (e.g., `eth0`, `enp7s0`).

Default: `any`.

If `tcp_stream.from_interface.interface` is not set or the default value `any` is used, traffic is captured from all available interfaces.

=== "Interface"
    ```yaml
    version: 4

    mode: tcp-capture-v2

    tcp_stream:
      from_interface:
        enabled: true
        interface: "eth0"
    ```
=== "Multiple interfaces"
    To capture traffic from multiple interfaces, add multiple entries under `from_interface`:

    ```yaml
    version: 4

    mode: tcp-capture-v2

    tcp_stream:
      from_interface:
        - enabled: true
          interface: "eth0"
        - enabled: true
          interface: "eth1"
    ```
=== "All interfaces"
    ```yaml
    version: 4

    mode: tcp-capture-v2

    tcp_stream:
      from_interface:
        enabled: true
        interface: "any"
    ```

!!! info "Checking available interfaces"
    To check network interfaces available on the host, run:
    ```
    ip addr show
    ```  

### tcp_stream.from_interface.filter

Specifies an optional [BPF (Berkeley Packet Filter)](https://biot.com/capstats/bpf.html) expression to control which packets and ports are captured.

Default: `vlan and port 80`.

If `tcp_stream.from_interface.filter` is not set or left empty, all packets on the selected interface are captured.

=== "All ports on interface"
    ```yaml
    version: 4

    mode: tcp-capture-v2

    tcp_stream:
      from_interface:
        enabled: true
        interface: "eth0"
    ```
=== "Specific packets and port on interface"
    ```yaml
    version: 4

    mode: tcp-capture-v2

    tcp_stream:
      from_interface:
        enabled: true
        interface: "eth0"
        filter: "vlan and port 80"
    ```

### tcp_stream.from_interface.snap_len

Specifies the number of bytes to capture from each packet (snaplen). 

Default: `65535` bytes, which ensures the full packet is recorded.

Lowering this value can reduce memory usage, but may truncate packet data, potentially impacting traffic analysis.

### tcp_stream.from_interface.promiscuous

Enables promiscuous mode. When enabled, the interface captures all network traffic seen on the interface, including packets not addressed to it. When disabled, capture is restricted to packets addressed to the interface.

Default: `true`.

If `tcp_stream.from_interface.promiscuous` is not set, promiscuous mode is enabled by default.

!!! info "Promiscuous mode limitation"
    Promiscuous mode does not work with [`tcp_stream.from_interface.interface`](#tcp_streamfrom_interfaceinterface) set to `any`.

### route_config

Configuration section where you specify settings for specific routes.

### route_config.wallarm_application

[Wallarm application ID](../../../user-guides/settings/applications.md). This value can be overridden for specific routes.

### route_config.routes

Sets route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

```yaml
version: 4

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
version: 4

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
version: 4

tcp_reassembler:
  parse_responses: true
  response_timeout: 5s

http_inspector:
  workers: auto
  libdetection_enabled: true
  api_firewall_enabled: true
  api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
  wallarm_dir: /opt/wallarm/etc/wallarm
  shm_dir: /tmp

postanalytics_exporter:
  address: 127.0.0.1:3313
  enabled: true

log:
  proton_log_mask: info@*

metrics:
  enabled: true
  listen_address: :9000
  legacy_status:
    enabled: true
    listen_address: 127.0.0.1:10246

health_check:
  enabled: true
  listen_address: :8080
```

### tcp_reassembler.parse_responses

Controls whether to parse mirrored responses. This enables Wallarm features that rely on response data, such as [vulnerability detection](../../../about-wallarm/detecting-vulnerabilities.md) and [API discovery](../../../api-discovery/overview.md).

By default, `true`.

Ensure response mirroring is configured in your environment to the target instance with the Wallarm node.

### tcp_reassembler.response_timeout

Specifies the maximum time to wait for a response. If a response is not received within this time, the Wallarm processes stop waiting the corresponding response.

Default: `5s`.

### http_inspector.workers

Wallarm worker number.

Default: `auto`, which means the number of workers is set to the number of CPU cores.

### http_inspector.libdetection_enabled

Whether to additionally validate the SQL Injection attacks using the [libdetection](../../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) library.

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

### postanalytics_exporter.address

Sets the address for the postanalytics service which handles statistical request analysis in Wallarm's request processing. Typically, you do not need to modify this parameter.

Default: `127.0.0.1:3313`.

In Node 0.12.x and earlier, this parameter [is set as `tarantool_exporter.address`](../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics). Renaming is required during upgrade.

### postanalytics_exporter.enabled

Controls whether the postanalytics service is enabled. This parameter must be set to `true` as the Wallarm node does not function without the postanalytics service.

Default: `true`.

In Node 0.12.x and earlier, this parameter [is set as `tarantool_exporter.enabled`](../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics). Renaming is required during upgrade.

### log.proton_log_mask

The mask for internal traffic logging. Typically, you do not need to modify this parameter.

Default: `info@*`.

### metrics.enabled

Controls whether [Prometheus metrics](../../../admin-en/configure-statistics-service.md#usage) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.listen_address

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).

### metrics.legacy_status.enabled

Controls whether the [`/wallarm-status`](../../../admin-en/configure-statistics-service.md#usage) metrics service is enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.legacy_status.listen_address

Sets the address and port where `/wallarm-status` metrics in JSON format will be exposed. To access these metrics, use the `/wallarm-status` endpoint.

Default: `127.0.0.1:10246`.

### health_check.enabled

Controls whether health check endpoints are enabled.

Default: `true`.

### health_check.listen_address

Sets the address and port for the `/live` and `/ready` health check endpoints.

Default: `:8080` (all network interfaces on the port 8080).