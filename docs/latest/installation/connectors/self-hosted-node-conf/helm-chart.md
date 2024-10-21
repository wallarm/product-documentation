[us-cloud-docs]:                      ../../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../../about-wallarm/overview.md#cloud

# Helm Chart Configuration for Wallarm Connectors

When deploying a self-hosted Wallarm node for connectors using a Helm chart, configuration is specified in the `values.yaml` file or through the CLI. This document outlines the available configuration parameters.

To modify settings after deployment, use the following command with the parameters you wish to change:

```
helm upgrade --set config.api.token=<VALUE> <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node
```

!!! info "Supported platforms"
    This document covers configurations for self-hosted nodes deployed for Mulesoft, Cloudflare, or Amazon CloudFront connectors. For other connectors, please refer to the relevant installation instructions.

## Basic settings

The Wallarm-specific part of the [default `values.yaml`](https://github.com/wallarm/node-next/blob/main/chart/values.yaml) that you basically might need to change looks like the following:

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
    mode: block

    route_config: {}
      # wallarm_application: -1
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

    log_level: debug

processing:
  service:
    type: LoadBalancer
    port: 5000
```

### config.api.token (required)

An [API token](../../../user-guides/settings/api-tokens.md) for connecting the node to the Wallarm Cloud.

To generate an API token:

1. Go to Wallarm Console → **Settings** → **API tokens** in either the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Create an API token with the **Deploy** source role.

### config.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud][us-cloud-docs]
* `api.wallarm.com` for the [EU cloud][eu-cloud-docs] (default)

### config.api.nodeGroup

This specifies the name of the group of filtering nodes you want to add newly deployed nodes to.

**Default value**: `defaultNodeNextGroup`

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

### config.connector.mode

Traffic [filtration mode](../../../admin-en/configure-wallarm-mode.md): `block`, `monitoring` or `off`. In OOB mode, traffic blocking is not supported.

Default: `monitoring`.

The mode can be [overridden for specific routes](#wallarm_mode).

### route_config

Configuration section where you specify settings for specific routes.

### route_config.wallarm_application

[Wallarm application ID](../../../user-guides/settings/applications.md). This value can be overridden for specific routes.

Default: `-1`.

### route_config.routes

Sets route-specific Wallarm configuration. Includes Wallarm mode and application IDs. Example configuration:

```yaml
config:
  connector:
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

### config.connector.log_level

Log level, can be `debug`, `info`, `warn`, `error`, `fatal`.

Default: `debug`.

## Advanced settings

The Wallarm-specific part of the [default `values.yaml`](https://github.com/wallarm/node-next/blob/main/chart/values.yaml) that you additionally might need to change looks like the following:

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
```

### config.connector.http_inspector.workers

Wallarm worker number.

Default: `auto`, which means the number of workers is set to the number of CPU cores.

### config.connector.http_inspector.api_firewall_enabled

Controls whether [API Specification Enforcement](../../../api-specification-enforcement/overview.md) is enabled. Please note that activating this feature does not substitute for the required subscription and configuration through the Wallarm Console UI.

Default: `true`.

### config.connector.http_inspector.wallarm_dir

Specifies the directory path for node configuration files. Typically, you do not need to modify this parameter. If you need assistance, please contact the [Wallarm support team](mailto:support@wallarm.com).

Default: `/opt/wallarm/etc/wallarm`.

### processing.metrics.enabled

Controls whether [Prometheus metrics](../../../admin-en/configure-statistics-service.md#working-with-the-statistics-service) are enabled. This parameter must be set to `true` as the Wallarm node does not function properly without it.

Default: `true`.

### processing.metrics.port

Sets the address and port where Prometheus metrics will be exposed. To access these metrics, use the `/metrics` endpoint.

Default: `:9000` (all network interfaces on the port 9000).
