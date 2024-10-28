# Configuring Native Node with the All-in-One Installer

When deploying the self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node) using the all-in-one installer, you create the `.yaml` configuration file. In this file, you can specify node configiration, all the parameters for that are described in this document.

To modify the settings after the node is running:

1. Update the `/opt/wallarm/etc/wallarm/go-node.yaml` file. The initial configuration file is copied to this path during installation.
1. Restart the Wallarm service to apply changes:

    ```
    sudo systemctl restart wallarm
    ```

## mode (required)

The Wallarm node operation mode. It can be:

* `connector-server` for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md) or [Amazon CloudFront](../connectors/aws-lambda.md) connectors.
* `tcp-capture` for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md).

=== "connector-server"
    If you installed the Native Node for a Wallarm connector, the basic configuration looks as follows:

    ```yaml
    version: 2

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
      blocking: true
      allowed_networks:
        - 0.0.0.0/0
      allowed_hosts:
        - w.com
        - "*.test.com"
      mesh:
        discovery: dns
        name: go-node-mesh-discovery
        port: 9093

    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
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
=== "tcp-capture"
    If you installed the Native Node for TCP traffic mirror analysis, the basic configuration looks as follows:

    ```yaml
    version: 2

    mode: tcp-capture

    goreplay:
      filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
      extra_args:
        - -input-raw-engine
        - vxlan
      path: /opt/wallarm/usr/bin/gor

    http_inspector:
      real_ip_header: "X-Real-IP"
    
    middleware:
      parse_responses: true
      response_timeout: 5s

    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
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

## Connector-specific settings

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

If the node is deployed using a Docker image, this parameter is not needed because SSL decryption should occur at the load balancer level, before the traffic reaches the containerized node.

### connector.tls_key (required)

Path to the private key corresponding to the TLS/SSL certificate (typically a `.key` file).

If the node is deployed using a Docker image, this parameter is not needed because SSL decryption should occur at the load balancer level, before the traffic reaches the containerized node.

### connector.blocking

Typically, you do not need to modify this parameter. Specific blocking behavior for malicious requests is controlled by the [`wallarm_mode`](#route_configwallarm_mode) parameter.

This parameter enables the Native Node's general capability to block incoming requests, whether they are malicious, from denylisted IPs, or any other conditions that require blocking.

Defalt: `false`.

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

### connector.mesh

The mesh feature is used in `connector-server` mode for Wallarm nodes to ensure consistent traffic processing when multiple node replicas are deployed. It allows requests and their corresponding responses to be routed to the same node, even if they are initially handled by different replicas. This is crucial in environments where the node runs as a part of an autoscaling ECS service.

The mesh configuration (if specified) is automatically applied in ECS under two conditions:

* Replicas > 1: If your ECS service is configured to run more than one replica of the node.
* Auto-scaling: If auto-scaling is enabled, the mesh adapts to ensure nodes communicate correctly as the service scales up or down.

```yaml
version: 2

connector:
  mesh:
    discovery: dns
    name: go-node-mesh-discovery
    port: 9093
```

#### discovery

Defines how nodes in the mesh discover each other. Currently, only the `dns` value is allowed.

Nodes discover each other using DNS. The DNS record must resolve to the IP addresses of all nodes participating in the mesh.

#### name

The DNS domain name used by nodes to resolve the IP addresses of other nodes in the mesh. This is typically set to a value that resolves to all the node instances in the ECS service.

#### port

Specifies the internal port used for communication between nodes in the mesh. This port is not exposed externally and is reserved for node-to-node traffic within the ECS cluster.

## TCP mirror-specific settings

### goreplay.filter

Specifies a network interface to capture traffic from. If no value is specified, it captures traffic from all network interfaces on the instance.

The value should be the network interface and port separated by a colon (`:`), e.g.:

=== "Interface:Port"
    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:80'
    ```

    To capture traffic from multiple interfaces and ports, use `goreplay.filter` along with `goreplay.extra_args`, e.g.:

    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:80'
      extra_args:
        - "-input-raw"
        - "eth0:8080"
        - "-input-raw"
        - "eth0:8081"
        - "-input-raw"
        - "eth1:80"
    ```

    The `filter` sets GoReplay with the `-input-raw` argument, and `extra_args` allows for specifying additional `-input-raw` inputs.
=== "All ports on interface"
    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:'
    ```
=== "Specific port on all interfaces"
    ```yaml
    version: 2

    goreplay:
      filter: ':80'
    ```
=== "All interfaces and ports"
    ```yaml
    version: 2

    goreplay:
      filter: ':'
    ```

To check network interfaces available on the host, run:

```
ip addr show
```

### goreplay.extra_args

This parameter allows you to specify [extra arguments](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) to be passed to GoReplay.

* Typically, you will use it to define the types of mirrored traffic requiring analysis, such as VLAN, VXLAN. For example:

    === "VLAN-wrapped mirrored traffic"
        ```yaml
        version: 2

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VID of your VLAN, e.g.:
            # - 42
        ```
    === "VXLAN-wrapped mirrored traffic (common in AWS)"
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

    If the mirrored traffic is not wrapped in additional protocols like VLAN or VXLAN, you can omit the `extra_args` configuration. Unencapsulated traffic is parsed by default.
* You can extend `filter` with `extra_args` to capture additional interfaces and ports:

    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:80'
      extra_args:
        - "-input-raw"
        - "eth0:8080"
        - "-input-raw"
        - "eth0:8081"
        - "-input-raw"
        - "eth1:80"
    ```

    The `filter` sets GoReplay with the `-input-raw` argument, and `extra_args` allows for specifying additional `-input-raw` inputs.

### goreplay.path

The path to the GoReplay binary file. Typically, you do not need to modify this parameter.

Default: `/opt/wallarm/usr/bin/gor`.

### http_inspector.real_ip_header

By default, Wallarm reads the source IP address from the network packet's IP headers. However, proxies and load balancers can change this to their own IPs.

To preserve the real client IP, these intermediaries often add an HTTP header (e.g., `X-Real-IP`, `X-Forwarded-For`). The `real_ip_header` parameter tells Wallarm which header to use to extract the original client IP.

### middleware.parse_responses

Controls whether to parse mirrored responses. This enables Wallarm features that rely on response data, such as [vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) and [API discovery](../../api-discovery/overview.md).

By default, `true`.

Ensure response mirroring is configured in your environment to the target instance with the Wallarm node.

### middleware.response_timeout

Specifies the maximum time to wait for a response. If a response is not received within this time, the Wallarm processes stop waiting the corresponding response.

Default: `5s`.

## Basic settings

### route_config

Configuration section where you specify settings for specific routes.

### route_config.wallarm_application

[Wallarm application ID](../../user-guides/settings/applications.md). This value can be overridden for specific routes.

Default: `-1`.

### route_config.wallarm_mode

General traffic [filtration mode](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

The mode can be [overridden for specific routes](#wallarm_mode).

Default: `monitoring`.

### route_config.routes

Sets route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

```yaml
version: 2

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
      wallarm_mode: off
```

#### host

Specifies the route host.

This parameter supports wildcard matching similar to [`connector.allowed_hosts`](#connectorallowed_hosts).

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

### log.access_log.enabled

Controls whether to collect access logs.

Default: `true`.

### log.access_log.verbose

Controls whether to include detailed information about each request in the access log output.

Default: `true`.

### log.access_log.log_file

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

Whether to additionally validate the SQL Injection attacks using the [libdetection](../../about-wallarm/protecting-against-attacks.md#libdetection-overview) library.

Default: `true`.

### http_inspector.api_firewall_enabled

Controls whether [API Specification Enforcement](../../api-specification-enforcement/overview.md) is enabled. Please note that activating this feature does not substitute for the required subscription and configuration through the Wallarm Console UI.

Default: `true`.

### http_inspector.api_firewall_database

Specifies the path to the database containing the API specifications you have uploaded for [API Specification Enforcement](../../api-specification-enforcement/overview.md). This database synchronizes with the Wallarm Cloud.

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

Controls whether [Prometheus metrics](../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.listen_address

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).

### metrics.legacy_status.enabled

Controls whether the [`/wallarm-status`](../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) metrics service is enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

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
