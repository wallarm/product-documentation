[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[lom]:                      ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[fallback]:                 ../admin-en/configure-parameters-en.md#wallarm_fallback
[proton-db]:                ../faq/node-issues-on-owasp-dashboards.md#custom_ruleset-and-protondb
[wcli]:                     ../admin-en/wcli-metrics.md
[wstore]:                   ../admin-en/wstore-metrics.md
[deployment]:               https://docs.nginx.com/nginx-ingress-controller/install/manifests/#using-a-deployment 
[daemonset]:                https://docs.nginx.com/nginx-ingress-controller/install/manifests/#using-a-daemonset
[api-firewall]:             ../api-specification-enforcement/overview.md  
[new-annotations]:          ../updating-migrating/what-is-new.md#annotation-namespace

# Fine-Tuning the Wallarm Ingress Controller (F5 NGINX IC-Based)

This page describes the **Helm chart configuration options** for the [Wallarm Ingress Controller based on F5 NGINX Ingress Controller](installation-kubernetes-en.md).

The fine‑tuning of the Wallarm Ingress Controller is similar to that of the F5 NGINX Ingress Controller described in the [official documentation](https://docs.nginx.com/nginx-ingress-controller/). When working with Wallarm, all options for setting up the original F5 NGINX Ingress Controller are available.

## Wallarm-specific configuration in values.yaml

The settings are defined in the `values.yaml` file. You can view its default state in the [GitHub repository](https://github.com/wallarm/ingress-nextgen/blob/main/charts/nginx-ingress/values.yaml).

Below are the configuration parameters that you might need to change:

```yaml
config:
  wallarm:
    enabled: false
    api:
      host: "api.wallarm.com"
      port: 443
      token: ""
      nodeGroup: "defaultIngressGroup"
      existingSecret:
        enabled: false
        # secretName: "wallarm-api-token"
        # secretKey: "token"
    fallback: "on"

    wd:
      metricsPort: 9445
      healthPort: 9446
      scrape:
        wstore:
          enabled: true
          endpoint: "http://127.0.0.1:9001/metrics"
          type: prometheus
        wcliPostanalytics:
          enabled: true
          endpoint: "http://127.0.0.1:9003/metrics"
          type: prometheus
        apiFirewall:
          enabled: false
          endpoint: "http://127.0.0.1:9010/metrics"
          type: prometheus

  apiFirewall:
    enabled: true
    readBufferSize: 8192
    writeBufferSize: 8192
    maxRequestBodySize: 4194304
    disableKeepalive: false
    maxConnectionsPerIp: 0
    maxRequestsPerConnection: 0
    maxErrorsInResponse: 3

controller:
  wallarm:
    wd:
      extraEnvs: []
      metrics:
        enabled: true
        serviceMonitor:
          enabled: false

  config:
    entries: {}

  enableSnippets: false

postanalytics:
  serviceAddress: "0.0.0.0:3313"
  serviceProtocol: "tcp4"
  metrics:
    listenAddress: "127.0.0.1:9001"
    protocol: "tcp4"

  wd:
    extraEnvs: []
    metrics:
      enabled: true
      serviceMonitor:
        enabled: false
```

To change the settings, we recommend using the option `--set` of `helm install` (if installing the Ingress controller) or `helm upgrade` (if updating the installed Ingress controller parameters). For example:

=== "Ingress controller installation"
    ```bash
    helm install --set config.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set config.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

A description of the main parameters you can set up is provided below. Other parameters come with default values and rarely need to be changed.

### config.wallarm.enabled

Enables or disables the Wallarm module in the Ingress Controller.

**Default value**: `false`

### config.wallarm.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/api-security-overview.md#cloud).
* `api.wallarm.com` for the [EU cloud](../about-wallarm/api-security-overview.md#cloud).

**Default value**: `api.wallarm.com`

### config.wallarm.api.port

Wallarm API endpoint port.

**Default value**: `443`

### config.wallarm.api.token

The Node token value. It is required to access the Wallarm API.

The token can be one of these [types][node-token-types]:

* **API token (recommended)** - Ideal if you need to dynamically add/remove node groups for UI organization or if you want to control token lifecycle for added security.

    To generate an API token:
    
    1. Go to Wallarm Console → **Settings** → **API tokens** in either the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Create an API token with the **Node deployment/Deployment** usage type.
    1. During node deployment, use the generated token and specify the group name using the `config.wallarm.api.nodeGroup` parameter. You can add multiple nodes to one group using different API tokens.
* **Node token** - Suitable when you already know the node groups that will be used.

    To generate a node token:
    
    1. Go to Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Create a node and name the node group.
    1. During node deployment, use the group's token for each node you want to include in that group.

The parameter is ignored if [`config.wallarm.existingSecret.enabled: true`](#configwallarmapiexistingsecretenabled).

**Default value**: `not specified`

### config.wallarm.api.nodeGroup

The name of the node group to which the newly deployed Node will be added.

This parameter is required when the Node is registered using an [API token][node-token-types] with the **Node deployment / Deployment** usage type (provided via the [`config.wallarm.api.token`](#configwallarmapitoken) parameter), which is the only token type that supports node grouping.

**Default value**: `defaultIngressGroup`

### config.wallarm.api.existingSecret.enabled

Configures the Ingress Controller to use a Wallarm node token from an existing Kubernetes Secret, instead of setting [`config.wallarm.api.token`](#configwallarmapitoken) directly. It is useful for environments with external secret management (e.g., when using an external secrets operator).

If `true`, you need to set:

* `config.wallarm.api.existingSecret.secretName` - secret name that contains the token
* `config.wallarm.api.existingSecret.secretKey` - secret key that contains the token

To store the node token in Kubernetes Secrets and pull it to the Helm chart:

1. Create a Kubernetes secret with the Wallarm node token:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` is the Kubernetes namespace you have created for the Helm release with Wallarm Ingress controller
    * `wallarm-api-token` is the Kubernetes secret name
    * `<WALLARM_NODE_TOKEN>` is the Wallarm node token value copied from the Wallarm Console UI

    If using an external secret operator, [follow its documentation](https://external-secrets.io).
1. Set the following configuration in `values.yaml`:

    ```yaml
    config:
      wallarm:
        api:
          existingSecret:
            enabled: true
            secretName: "wallarm-api-token"
            secretKey: "token"
    ```

**Default value**: `false`. Points to the Helm chart to get the Wallarm node token from [`config.wallarm.api.token`](#configwallarmapitoken).

### config.wallarm.fallback

Controls [fallback behavior][fallback] when Wallarm data (for example, [`proton.db`][proton-db] or a [custom rule set][lom]) cannot be downloaded:

* `"on"` — NGINX enters emergency mode. The Wallarm module is disabled for the `http`, `server`, and `location` blocks whose data failed to download, and NGINX keeps running and passing traffic (unfiltered for those blocks). Availability is prioritized over filtering.
* `"off"` — emergency mode is disabled. On a download failure the Wallarm module is not disabled automatically, so the affected `http`, `server`, and `location` configuration fails to load.

**Default value**: `"on"`

### config.wallarm.wd.metricsPort

Port on which the aggregated [Prometheus metrics](nginx-node-metrics.md) from all managed processes are exposed.

When you change this port, set the per-pod metrics **Service** ports to the same number in **both** pods, so that `wd` and its Kubernetes Service agree on the port:

* `controller.wallarm.wd.metrics.service.servicePort` and `postanalytics.wd.metrics.service.servicePort` — the port each metrics Service exposes
* `controller.wallarm.wd.metrics.port` and `postanalytics.wd.metrics.port` — the metrics port on the `wd` endpoint that the Service targets

**Default value**: `9445`

??? "Show the example of the configuration with changed ports"
    ```yaml
    config:
      wallarm:
        enabled: true
        api:
          host: "us1.api.wallarm.com"
          token: "<TOKEN>"
        wd:
          metricsPort: 9442
    controller:
      wallarm:
        wd:
          metrics:
            port: 9442
            service:
              servicePort: 9442
    postanalytics:
      wd:
        metrics:
          port: 9442
          service:
            servicePort: 9442
    ```

### config.wallarm.wd.healthPort

Port for the `wd` [health and readiness endpoints](nginx-node-metrics.md#health-endpoints) (`/health` and `/ready`).

**Default value**: `9446`

### config.wallarm.wd.scrape

Configures the component metrics endpoints that `wd` scrapes.

Each component — `wstore`, `wcliPostanalytics`, and `apiFirewall` — has the following fields:

* `enabled` — whether scraping of this component's metrics is enabled.
* `endpoint` — the URL from which the metrics are scraped.
* `type` — the metrics format (`prometheus`).

By default, `wstore` and `wcliPostanalytics` are enabled and `apiFirewall` is disabled. `wd` aggregates the scraped metrics into a single endpoint on port `9445` — see [Monitoring the NGINX Node metrics and health](nginx-node-metrics.md).

To include [API Firewall metrics](apifw-metrics.md) in the aggregated endpoint, first enable them, then set `config.wallarm.wd.scrape.apiFirewall.enabled` to `true`.

### controller.wallarm.wd.metrics.enabled

Whether to create the Kubernetes Service that exposes the `wd` aggregated metrics (`9445`) for scraping. Keep it `true` unless you scrape the pods directly and do not need a Service.

**Default value**: `true`

### controller.wallarm.wd.metrics.serviceMonitor

Prometheus Operator `ServiceMonitor` settings for scraping the `wd` metrics. Set `serviceMonitor.enabled` to `true` when you run Prometheus Operator, so it automatically discovers and scrapes the metrics Service; leave it `false` if you configure scraping another way.

To correctly scrape, enable it in both `controller.wallarm.wd.metrics.serviceMonitor` and `postanalytics.wd.metrics.serviceMonitor`.

**Default value** (`serviceMonitor.enabled`): `false`

### config.apiFirewall

Controls the configuration of [API Specification Enforcement][api-firewall].

By default, it is enabled and configured as shown below. If you are using this feature, it is recommended to keep these values unchanged.

```yaml
config:
  apiFirewall:
    ### Enable or disable API Firewall functionality (true|false)
    ###
    enabled: true
    ### Per-connection buffer size (in bytes) for requests' reading. This also limits the maximum header size.
    ### Increase this buffer if your clients send multi-KB RequestURIs and/or multi-KB headers (for example, BIG cookies)
    readBufferSize: 8192
    ### Per-connection buffer size (in bytes) for responses' writing.
    ###
    writeBufferSize: 8192
    ### Maximum request body size (in bytes). The server rejects requests with bodies exceeding this limit.
    ###
    maxRequestBodySize: 4194304
    ### Whether to disable keep-alive connections. The server will close all the incoming connections after sending
    ## the first response to client if this option is set to 'true'
    ###
    disableKeepalive: false
    ### Maximum number of concurrent client connections allowed per IP. '0' means unlimited
    ###
    maxConnectionsPerIp: 0
    ### Maximum number of requests served per connection. The server closes connection after the last request.
    ### 'Connection: close' header is added to the last response. '0' means unlimited
    ###
    maxRequestsPerConnection: 0
    ### Maximum number of errors limiting apiFirewall response size
    ### to prevent it from exceeding the configured subrequest threshold.
    ###
    maxErrorsInResponse: 3
```

The table below describes the [API Specification Enforcement][api-firewall] parameters:

| Setting | Description |
| ------- | ----------- |
| `readBufferSize` | Per-connection buffer size for request reading. This also limits the maximum header size. Increase this buffer if your clients send multi-KB RequestURIs and/or multi-KB headers (for example, BIG cookies). |
| `writeBufferSize` | Per-connection buffer size for response writing. |
| `maxRequestBodySize` | Maximum request body size. The server rejects requests with bodies exceeding this limit. |
| `disableKeepalive` | Disables the keep-alive connections. The server will close all the incoming connections after sending the first response to the client if this option is set to `true`. |
| `maxConnectionsPerIp` | Maximum number of concurrent client connections allowed per IP. `0` = `unlimited`. |
| `maxRequestsPerConnection` | Maximum number of requests served per connection. The server closes the connection after the last request. The `Connection: close` header is added to the last response. `0` = `unlimited`. |
| `maxErrorsInResponse` | Maximum number of errors included in an [API Specification Enforcement][api-firewall] response. |

### postanalytics.serviceAddress

Specifies the address and port on which **wstore** accepts incoming connections.

**Default value**: `"0.0.0.0:3313"`

### postanalytics.serviceProtocol

Specifies the protocol family that **wstore** uses for incoming connections.

Possible values:

* `tcp` - dual-stack mode (listens on both IPv4 and IPv6)
* `tcp4` - IPv4 only
* `tcp6` - IPv6 only

**Default value**: `"tcp4"`.

### postanalytics.metrics

Address and protocol on which the Postanalytics (**wstore**) module exposes its own [metrics](wstore-metrics.md).

```yaml
postanalytics:
  metrics:
    listenAddress: "127.0.0.1:9001"
    protocol: "tcp4"
```

* `listenAddress` — address and port where **wstore** serves its metrics. **Default value**: `"127.0.0.1:9001"`.
* `protocol` — protocol family for the metrics listener: `tcp` (dual-stack), `tcp4` (IPv4 only), or `tcp6` (IPv6 only). **Default value**: `"tcp4"`.

The `wd` service scrapes this endpoint (see [`config.wallarm.wd.scrape`](#configwallarmwdscrape)) and aggregates it into the pod's single metrics endpoint on port `9445`.

### controller.enableSnippets

Controls whether custom snippets are allowed in Ingress/VirtualServer resources.

When enabled, it allows using snippet-style annotations such as `nginx.org/server-snippets`/`nginx.org/location-snippets` (and related snippet mechanisms supported by the NGINX Ingress Controller).

**Default value:** `false`

!!! info "Security note"
    Snippet support can widen the attack surface in multi-tenant clusters. Keep it disabled unless you fully trust who can create/update Ingress resources.

### controller.config.entries

Custom entries for the NGINX Ingress Controller [ConfigMap](https://docs.nginx.com/nginx-ingress-controller/configuration/global-configuration/configmap-resource/), specified as key-value pairs. Use it to customize the global NGINX configuration.

Besides the standard NGINX ConfigMap keys, the following Wallarm-specific entries are supported:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_upstream_connect_attempts)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_upstream_reconnect_interval)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

Set it as a key-value pair under `entries`, the same as any standard ConfigMap key (values are strings), e.g.:

```yaml
controller:
  config:
    entries:
      wallarm-upstream-connect-attempts: "3"
```

The global NGINX snippet keys are also set through this parameter — `main-snippets`, `http-snippets`, `server-snippets`, `location-snippets`, and `stream-snippets` — each injecting raw NGINX directives into the corresponding context, e.g.:

```yaml
controller:
  config:
    entries:
      server-snippets: |
        underscores_in_headers on;
        ignore_invalid_headers off;
```

Snippet keys set here through `controller.config.entries` are global ConfigMap snippets and apply directly — they do **not** require [`controller.enableSnippets`](#controllerenablesnippets). The `controller.enableSnippets` flag is only needed for snippets set on individual resources: the `nginx.org/server-snippets` / `nginx.org/location-snippets` Ingress annotations and VirtualServer/VirtualServerRoute snippets.

### Extra environment variables for containers

You can pass additional environment variables to the Wallarm `wd` containers. This is useful for configuring proxy settings, custom logging, or injecting secrets.

The following containers support the `extraEnvs` parameter:

| Parameter | Container |
| --------- | --------- |
| `controller.wallarm.wd.extraEnvs` | `wd` container in the controller pod |
| `postanalytics.wd.extraEnvs` | `wd` container in the postanalytics pod |

Example — passing proxy settings to the `wd` container in the controller pod:

```yaml
controller:
  wallarm:
    wd:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
```

## Ingress annotations and policies

Per-Ingress Wallarm settings (traffic filtration mode, block page, response analysis, and others) are configured through Ingress annotations or the Wallarm **Policy** custom resource, not through the Helm chart. See [Wallarm Ingress Controller annotations and policies](configure-kubernetes-annotations.md).
