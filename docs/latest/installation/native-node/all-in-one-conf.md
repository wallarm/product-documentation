# Configuring Native Node with the All-in-One Installer, Docker Image or AWS AMI

When deploying the self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node) using the all-in-one installer, Docker image or AWS AMI, you create the `.yaml` configuration file. In this file, you can specify node configiration, all the parameters for that are described in this document.

To modify the settings after the node is running using the all-in-one installer or AWS AMI:

1. Update the `/opt/wallarm/etc/wallarm/go-node.yaml` file. The initial configuration file is copied to this path during installation.
1. Restart the Wallarm service to apply changes:

    ```
    sudo systemctl restart wallarm
    ```

If the node is deployed using a Docker image, it is recommended to update the configuration file on the host machine and restart the Docker container with the updated file.

## mode (required)

The Wallarm node operation mode. It can be:

* `connector-server` for [connectors](../nginx-native-node-internals.md#connectors_1).
* `tcp-capture-v2` for [TCP traffic mirror analysis](../oob/tcp-traffic-mirror/deployment.md).
* `envoy-external-filter` for [gRPC-based external processing filter](../connectors/istio.md) for APIs managed by Istio.

=== "connector-server"
    If you installed the Native Node for a Wallarm connector, the basic configuration looks as follows:

    ```yaml
    version: 4

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
        name: native-node-mesh-discovery
        port: 9093
      url_normalize: true
      external_health_check:
        enabled: true
        endpoint: /wallarm-external-health
      # per_connection_limits:
        # max_requests: 300
        # max_received_bytes: 640_000
        # max_duration: 1m

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
    
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      # wallarm_partner_client_uuid: 11111111-1111-1111-1111-111111111111
      # wallarm_application: "-1"
      routes:
        - route: /example/api/v1
          wallarm_mode: off
          # wallarm_partner_client_uuid: 11111111-1111-1111-1111-111111111111
          # wallarm_application: 1
        - route: /example/extra_api
          # wallarm_partner_client_uuid: 22222222-2222-2222-2222-222222222222
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
=== "tcp-capture-v2"
    If you installed the Native Node for TCP traffic mirror analysis, the basic configuration looks as follows:

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
=== "envoy-external-filter"
    If you installed the Native Node as an Envoy external filter, the basic configuration looks as follows:

    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key

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
    version: 4

    connector:
      address: '192.158.1.38:5050'
    ```
=== "Specific port on all IPs"
    ```yaml
    version: 4

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

Defalt: `true`.

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
version: 4

connector:
  allowed_hosts:
    - w.com
    - "*.test.com"
```

### connector.mesh

The mesh feature is used in `connector-server` mode for Wallarm nodes to ensure consistent traffic processing when multiple node replicas are deployed. It routes requests and their corresponding responses to the same node, even if initially handled by different replicas. This is critical when horizontally scaling, such as with auto-scaling or multiple replicas in ECS.

!!! info "Kubernetes environments"
    In Kubernetes, use the [Helm chart for native Wallarm node deployment](helm-chart.md). Mesh is automatically configured when auto-scaling or multiple replicas are detected, with no extra setup needed.

To configure the mesh in ECS:

1. Set up service discovery (e.g., [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html), [Google Cloud DNS](https://cloud.google.com/dns/), or similar services) to allow nodes in the mesh to dynamically find and communicate with each other.

    Without service discovery, the mesh will not function properly, as nodes will be unable to locate each other, leading to traffic routing issues.
1. Configure the Wallarm node to use the mesh by specifying the `connector.mesh` parameters in the configuration file as shown below:

```yaml
version: 4

connector:
  mesh:
    discovery: dns
    name: native-node-mesh-discovery
    port: 9093
```

#### discovery

Defines how nodes in the mesh discover each other. Currently, only the `dns` value is allowed.

Nodes discover each other using DNS. The DNS record must resolve to the IP addresses of all nodes participating in the mesh.

#### name

The DNS domain name used by nodes to resolve the IP addresses of other nodes in the mesh. This is typically set to a value that resolves to all the node instances in the ECS service.

#### port

Specifies the internal port used for communication between nodes in the mesh. This port is not exposed externally and is reserved for node-to-node traffic within the ECS cluster.

### connector.url_normalize

Enables URL normalization before selecting route configurations and analyzing data with libproton.

Default: `true`.

### connector.external_health_check

Configures an additional external health check endpoint allowing external systems to verify the availability of the Wallarm Node.

The endpoint is served on the same port as Node (parameter `connector.address`) and responds with HTTP 200 OK if the Node is running.

Supported in:

* Native Node 0.13.3 and higher 0.13.x versions
* Native Node 0.14.1 and higher
* Not supported in the AWS AMI yet

```yaml
version: 4

connector:
  external_health_check:
    enabled: true
    endpoint: /wallarm-external-health
```

#### enabled

Turns the external health check endpoint on or off. If `true`, the endpoint becomes accessible at the specified endpoint, on the same port as Node.

Default: `false`.

#### endpoint

Defines the URL path at which the external health check endpoint will be available. Must begin with a `/`.

### connector.per_connection_limits

Defines limits for `keep-alive` connections. Once any of the specified limits is reached, the Node sends the `Connection: Close` HTTP header to the client, prompting it to close the current TCP session and establish a new one for subsequent requests.

This mechanism helps with Level 4 load balancing by preventing clients from staying connected to a single Node instance after upscaling.

By default, no limits are applied, which is the recommended configuration for most use cases.

Supported in Native Node 0.13.4 and later 0.13.x versions, and in 0.15.1 and later.

```yaml
version: 4

connector:
  per_connection_limits:
    max_requests: 300
    max_received_bytes: 640_000
    max_duration: 1m
```

#### max_requests

Maximum number of requests a single connection can handle before being closed.

#### max_received_bytes

Maximum number of bytes that can be received through a connection.

#### max_duration

Maximum lifetime of a connection (e.g., `1m` for 1 minute).

## TCP mirror-specific settings

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
    Promiscuous mode does not work with [`tcp_stream.from_interface.interface`](#tcp_streamfrom_interfaceinterface-required) set to `any`.

## Envoy external filter-specific settings

### envoy_external_filter.address (required)

Specifies the listening IP address and port separated by a colon (`:`).

Ensure the port is not `80`, `8080`, `9000`, or `3313`, as these are used by other Wallarm processes.

=== "IP address:Port"
    ```yaml
    version: 4

    envoy_external_filter:
      address: '192.158.1.38:5080'
    ```
=== "Specific port on all IPs"
    ```yaml
    version: 4

    envoy_external_filter:
      address: ':5080'
    ```

### envoy_external_filter.tls_cert (required)

Path to the TLS/SSL certificate (usually a `.crt` or `.pem` file) issued for the domain where the node is running.

The certificate must be provided by a trusted Certificate Authority (CA) to ensure secure communication.

!!! info "Docker deployment requirement"    
    This parameter is mandatory when the node is deployed using a [Docker image](../../installation/native-node/docker-image.md).

### envoy_external_filter.tls_key (required)

Path to the private key corresponding to the TLS/SSL certificate (typically a `.key` file).

!!! info "Docker deployment requirement"    
    This parameter is mandatory when the node is deployed using a [Docker image](../../installation/native-node/docker-image.md).

## Basic settings

### proxy_headers

Configures how the Native Node extracts the original client IP and host when traffic passes through proxies or load balancers.

* `trusted_networks`: trusted proxy IP ranges (CIDRs). Headers like `X-Forwarded-For` are only trusted if the request comes from these networks.

    If omitted, all networks are trusted (not recommended).
* `original_host`: headers to use for the original `Host` value, if modified by a proxy.
* `real_ip`: headers to use for extracting the real client IP address.

You can define multiple rules for different proxy types or trust levels.

!!! info "Rule evaluation order"    
    Only the first matching rule is applied per request.

Supported in Native Node 0.13.5 and later 0.13.x versions, and in 0.15.1 and later.

Example:

```yaml
version: 4

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

### route_config

Configuration section where you specify settings for specific routes.

### route_config.wallarm_application

[Wallarm application ID](../../user-guides/settings/applications.md). This value can be overridden for specific routes.

Default: `-1`.

### route_config.wallarm_partner_client_uuid

Unique identifier of the tenant for the [multi-tenant](../../installation/multi-tenant/deploy-multi-tenant-node.md) Wallarm node. The value should be a string in the [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) format, for example:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

Supported in Native Node 0.19.0 and later.

!!! info
    This parameter can be set inside the `route_config` and `routes` blocks.

    Know how to:
    
    * [Get the UUID of the tenant during tenant creation →](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)
    * [Get the list of UUIDs of existing tenants →](../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)

Configuration example:

```yaml
version: 4
mode: connector-server
route_config:
  wallarm_mode: monitoring
  wallarm_partner_client_uuid: 11111111-1111-1111-1111-111111111111
  wallarm_application: "-1"
  routes:
    - route: /login
      wallarm_partner_client_uuid: 11111111-1111-1111-1111-111111111111
      wallarm_application: 1
    - route: /users
      wallarm_partner_client_uuid: 22222222-2222-2222-2222-222222222222
      wallarm_application: 2
```

In the configuration above:

* Tenant stands for partner's client. The partner has 2 clients.
* The traffic targeting `example.com/login` will be associated with the client `11111111-1111-1111-1111-111111111111`.
* The traffic targeting `example.com/users` will be associated with the client `22222222-2222-2222-2222-222222222222`.
* The clients have applications, specified via the [`wallarm_application`](#route_configwallarm_application) directive:
    * `example.com/login` – `wallarm_application 1`
    * `example.com/users` – `wallarm_application 2`

    The traffic targeting these 2 paths will be associated with the corresponding application, the remaining will be the generic traffic of the first client.

### route_config.wallarm_mode

General traffic [filtration mode](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

The mode can be [overridden for specific routes](#wallarm_mode).

Default: `monitoring`.

### route_config.routes

Sets route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

=== "connector-server"
    ```yaml
    version: 4

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
=== "tcp-capture-v2"
    ```yaml
    version: 4

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

=== "connector-server"
    ```yaml
    version: 4

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```
=== "tcp-capture-v2"
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

=== "connector-server"
    ```yaml
    version: 4

    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
        headers:
          Authorization: "^Bearer .+"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
  
    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

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
      namespace: wallarm_gonode

    health_check:
      enabled: true
      listen_address: :8080
    
    drop_on_overload: true
    ```
=== "tcp-capture-v2"
    ```yaml
    version: 4

    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
        headers:
          Authorization: "^Bearer .+"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
    
    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

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
      namespace: wallarm_gonode

    health_check:
      enabled: true
      listen_address: :8080
    
    drop_on_overload: true
    ```

### input_filters

Defines which incoming requests should be **inspected** or **bypassed** by the Native Node. This reduces CPU usage by ignoring irrelevant traffic such as static assets or health checks.

By default, all requests are inspected.

!!! warning "Requests skipped from inspection are not analyzed or sent to Wallarm Cloud"
    As a result, skipped requests do not appear in metrics, API Discovery, API sessions, vulnerability detection and so on. Wallarm features do not apply to them.

**Compatibility**

* Native Node 0.13.7 and higher 0.13.x versions
* Native Node 0.16.0 and higher
* Not supported in the AWS AMI yet

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
    input_filters:
      inspect:
      - headers:
        host: "^api\\.example\\.com$"
      bypass:
      - path: "^/healthz$"
    ```

### http_inspector.workers

Wallarm worker number.

Default: `auto`, which means the number of workers is set to the number of CPU cores.

### http_inspector.libdetection_enabled

Whether to additionally validate the SQL Injection attacks using the [libdetection](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) library.

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

### http_inspector.wallarm_process_time_limit

Defines the maximum time for processing a single HTTP request by the Wallarm Native Node.

If the limit is exceeded, the request is marked as an [`overlimit_res`](../../attacks-vulns-list.md#resource-overlimit) attack and blocked.

You can configure the limit in this parameter or [via the Wallarm Console](../../user-guides/rules/configure-overlimit-res-detection.md), which also controls whether to block such requests. Wallarm Console settings override local configurations.

### postanalytics_exporter.address

Sets the address for the postanalytics service which handles statistical request analysis in Wallarm's request processing. Typically, you do not need to modify this parameter.

Default: `127.0.0.1:3313`.

In Node version 0.12.1 and earlier, this parameter is set as `tarantool_exporter.address`.

### postanalytics_exporter.enabled

Controls whether the postanalytics service is enabled. This parameter must be set to `true` as the Wallarm node does not function without the postanalytics service.

Default: `true`.

In Node version 0.12.1 and earlier, this parameter is set as `tarantool_exporter.enabled`.

### log.proton_log_mask

The mask for internal traffic logging. Typically, you do not need to modify this parameter.

Default: `info@*`.

### metrics.enabled

Controls whether [Prometheus metrics](../../admin-en/configure-statistics-service.md#usage) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.listen_address

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).

### metrics.legacy_status.enabled

Controls whether the [`/wallarm-status`](../../admin-en/configure-statistics-service.md#usage) metrics service is enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### metrics.legacy_status.listen_address

Sets the address and port where `/wallarm-status` metrics in JSON format will be exposed. To access these metrics, use the `/wallarm-status` endpoint.

Default: `127.0.0.1:10246`.

### metrics.namespace

Defines the prefix for Prometheus metrics exposed by the `go-node` binary (the core processing service of the Native Node).

Default: `wallarm_gonode`.

All metrics emitted by `go-node` will use this prefix (e.g., `wallarm_gonode_requests_total`). Other components of the node, such as `wstore` and `wcli`, use their own fixed prefixes.

Supported in Native Node 0.13.5 and later 0.13.x versions, and in 0.15.1 and later.

### health_check.enabled

Controls whether health check endpoints are enabled.

Default: `true`.

### health_check.listen_address

Sets the address and port for the `/live` and `/ready` health check endpoints.

Default: `:8080` (all network interfaces on the port 8080).

### drop_on_overload

Controls whether the Node drops incoming requests when the processing load exceeds its capacity.

**Compatibility**

* Native Node 0.16.1 and higher
* Not supported in the AWS AMI yet
* For the [Envoy connector](../connectors/istio.md), behavior depends on the `failure_mode_allow` setting

    The `drop_on_overload` configuration is not applied.

When enabled (`true`), if the Node cannot process data in real time, it drops excess input and responds with `503 (Service Unavailable)`. This prevents the Node from accumulating unprocessed requests in internal queues, which could otherwise lead to severe performance degradation or out‑of‑memory errors.

Returning 503 allows upstream services, load balancers, or clients to detect overload conditions and retry requests if needed.

In blocking [mode](../../admin-en/configure-wallarm-mode.md), such requests are not blocked.

Default: `true`.
