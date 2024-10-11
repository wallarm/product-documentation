# All-in-One Installer Configuration for Wallarm Connectors

When deploying the self-hosted Wallarm node for connectors using the all-in-one installer, you create the `.yaml` configuration file. In this file, you can specify node configiration, all the parameters for that are described in this document.

To modify the settings after the node is running:

1. Update the `/opt/wallarm/etc/wallarm/go-node.yaml` file. The initial configuration file is copied to this path during installation.
1. Restart the Wallarm service to apply changes:

    ```
    sudo systemctl restart wallarm
    ```

!!! info "Supported platforms"
    This document covers configurations for self-hosted nodes deployed for Mulesoft, Cloudflare, or Amazon CloudFront connectors. For other connectors, refer to the [NGINX node setup](../../../admin-en/configure-parameters-en.md) documentation.

## Basic settings

```yaml
version: 2

mode: connector-server

connector:
  address: ":5050"
  tls_cert: path/to/tls-cert.crt
  tls_key: path/to/tls-key.key
  blocking: false
  allowed_networks:
    - 0.0.0.0/0
  allowed_hosts:
    - w.com
    - "*.test.com"

route_config:
  wallarm_application: 10
  routes:
    - route: /example/api/v1
      wallarm_mode: off
    - route: /example/extra_api
      wallarm_application: 2
    - route: /example/testing
      wallarm_mode: off

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

The Wallarm node operation mode. It should be `connector-server` for deploying the node for the Wallarm connector.

### connector.address (required)

Specifies the listening IP address and port separated by a colon (`:`).

Ensure the port is not `80`, `8080`, `9000`, or `3313`, as these are used by other Wallarm processes.

=== "IP address:Port"
    ```yaml
    version: 2

    connector:
      address: '192.158.1.38:5050'
    ```
=== "All ports on IP"
    ```yaml
    version: 2

    connector:
      address: '192.158.1.38:'
    ```
=== "Specific port on all IPs"
    ```yaml
    version: 2

    connector:
      address: ':5050'
    ```

### connector.tls_cert (required)

Path to the TLS/SSL certificate (usually a `.crt` or `.pem` file) issued for the domain where the node is running.

The certificate must be provided by a trusted Certificate Authority (CA) to ensure secure communication.

### connector.tls_key (required)

Path to the private key corresponding to the TLS/SSL certificate (typically a `.key` file).

### connector.blocking

Defines whether to [block](../../../admin-en/configure-wallarm-mode.md) malicious requests (`true`) or only log them. In OOB (Out-of-Band) mode, traffic blocking is disabled, and the node will only log malicious traffic regardless of this setting.

Default: `false` - monitor and log malicious activity in the Wallarm Console.

The mode can be [overridden for specific routes](#wallarm_mode).

### connector.allowed_networks

A list of IP networks allowed to connect.

Default: `0.0.0.0/0` (all IP networks are allowed).

### connector.allowed_hosts

A list of allowed hostnames.

Default: all hosts are allowed.

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

connector:
  allowed_hosts:
    - w.com
    - "*.test.com"
```

### route_config

Configuration section where you specify settings for specific routes.

### route_config.wallarm_application

[Wallarm application ID](../../../user-guides/settings/applications.md). This value can be overridden for specific routes.

Default: `-1`.

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

Specifies the route host. This parameter supports wildcard matching the same as the [`connector.allowed_hosts`](#connectorallowed_hosts) parameter.

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

Traffic [filtration mode](../../../admin-en/configure-wallarm-mode.md): `block`, `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

Default: `monitoring`.

### log.pretty

Controls the error and access log format. Set to `true` for human-readable logs, or `false` for JSON logs.

Default: `true`.

### log.level

Log level, can be `debug`, `info`, `warn`, `error`, `fatal`.

Default: `info`.

### log.log_file

Specifies the destination for error log output. Options are `stdout`, `stderr`, or a path to a log file.

Default: `stderr`. However, the node redirects `stderr` to the file `/opt/wallarm/var/log/wallarm/go-node.log`.

### log.access_log

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
