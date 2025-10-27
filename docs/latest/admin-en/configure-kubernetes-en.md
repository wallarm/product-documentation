[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[wcli-metrics]:             ../admin-en/wcli-metrics.md

# Fine‑tuning of NGINX-based Wallarm Ingress Controller

Learn fine-tuning options available for the self-hosted Wallarm Ingress controller to get the most out of the Wallarm solution.

!!! info "Official documentation for NGINX Ingress Controller"
    The fine‑tuning of the Wallarm Ingress Controller is quite similar to that of the NGINX Ingress Controller described in the [official documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). When working with Wallarm, all options for setting up the original NGINX Ingress Controller are available.

## Additional Settings for Helm Chart

The settings are defined in the [`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml) file. By default, the file looks as follows:

```yaml
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    nodeGroup: defaultIngressGroup
    existingSecret:
      enabled: false
      secretKey: token
      secretName: wallarm-api-token
    postanalytics:
      kind: Deployment
      service:
        annotations: {}
      arena: "2.0"
      serviceAddress: "0.0.0.0:3313"
      serviceProtocol: "tcp4"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      tls:
        enabled: false
      #  certFile: "/root/test-tls-certs/server.crt"
      #  keyFile: "/root/test-tls-certs/server.key"
      #  caCertFile: "/root/test-tls-certs/ca.crt"
      #  mutualTLS:
      #    enabled: false
      #    clientCACertFile: "/root/test-tls-certs/ca.crt"
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wallarm-appstructure:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wallarm-antibot:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    metrics:
      port: 18080
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## List of IP addresses at which the stats-exporter service is available
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    init:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wcliController:
      logLevel: warn
      commands:
        apispec:
          logLevel: INFO
        blkexp:
          logLevel: INFO
        botexp:
          logLevel: WARN
        cntexp:
          logLevel: ERROR
        cntsync:
          logLevel: INFO
        credstuff:
          logLevel: INFO
        envexp:
          logLevel: INFO
        ipfeed:
          logLevel: INFO
        iplist:
          logLevel: INFO
        jwtexp:
          logLevel: INFO
        metricsexp:
          logLevel: INFO
        mrksync:
          logLevel: INFO
        register:
          logLevel: INFO
        reqexp:
          logLevel: INFO
        syncnode:
          logLevel: INFO
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wcliPostanalytics:
      logLevel: warn
      commands:
        apispec:
          logLevel: INFO
        blkexp:
          logLevel: INFO
        botexp:
          logLevel: WARN
        cntexp:
          logLevel: ERROR
        cntsync:
          logLevel: INFO
        credstuff:
          logLevel: INFO
        envexp:
          logLevel: INFO
        ipfeed:
          logLevel: INFO
        iplist:
          logLevel: INFO
        jwtexp:
          logLevel: INFO
        metricsexp:
          logLevel: INFO
        mrksync:
          logLevel: INFO
        register:
          logLevel: INFO
        reqexp:
          logLevel: INFO
        syncnode:
          logLevel: INFO
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
      ## Metrics configuration for WCLI Postanalytics
      metrics:
        # -- Enable metrics collection
        enabled: false
        # -- Port for metrics endpoint
        port: 9012
        # -- Port name for metrics endpoint
        portName: wcli-post-mtrc
        # -- Path at which the metrics endpoint is exposed (optional, defaults to /metrics if not specified)
        endpointPath: ""
        # -- IP address and/or port for the metrics endpoint (e.g., ":9012" or "127.0.0.1:9012")
        host: ":9012"          
    apiFirewall:
      enabled: true
      config:
        ...
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
      metrics:
        enabled: false
        port: 9010
        endpointPath: /metrics
        host: ":9010"
        service:
          servicePort: 9010
        serviceMonitor:
          ## Enables creation of the ServiceMonitor resource
          enabled: false
          ## Extra labels used to match the Prometheus instance
          additionalLabels: {}
          # -- Annotations to be added to the ServiceMonitor
          annotations: {}
          ## The label to use to retrieve the job name from
          ## jobLabel: "app.kubernetes.io/name"
          namespace: ""
          namespaceSelector: {}
          ## Default: scrape .Release.Namespace or namespaceOverride only
          ## To scrape all, use the following:
          ## namespaceSelector:
          ##   any: true
          scrapeInterval: 30s
          # honorLabels: true
          targetLabels: []
          relabelings: []
          metricRelabelings: []
validation:
  enableCel: false
  forbidDangerousAnnotations: false
```

To change this setting, we recommend using the option `--set` of `helm install` (if installing the Ingress controller) or `helm upgrade` (if updating the installed Ingress controller parameters). For example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

A description of the main parameters you can set up is provided below. Other parameters come with default values and rarely need to be changed.

### controller.wallarm.enabled

Allows you to enable or disable Wallarm functions.

**Default value**: `false`

### controller.wallarm.apiHost

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/overview.md#cloud).
* `api.wallarm.com` for the [EU cloud](../about-wallarm/overview.md#cloud),

**Default value**: `api.wallarm.com`

### controller.wallarm.token

A filtering node token value. It is required to access the Wallarm API.

The token can be one of these [types][node-token-types]:

* **API token (recommended)** - Ideal if you need to dynamically add/remove node groups for UI organization or if you want to control token lifecycle for added security. To generate an API token:

    To generate an API token:
    
    1. Go to Wallarm Console → **Settings** → **API tokens** in either the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Create an API token with the **Node deployment/Deployment** usage type.
    1. During node deployment, use the generated token and specify the group name using the `controller.wallarm.nodeGroup` parameter. You can add multiple nodes to one group using different API tokens.
* **Node token** - Suitable when you already know the node groups that will be used.

    To generate a node token:
    
    1. Go to Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Create a node and name the node group.
    1. During node deployment, use the group's token for each node you want to include in that group.

The parameter is ignored if [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret).

**Default value**: `not specified`

### controller.wallarm.nodeGroup

Starting from Helm chart version 4.6.8, this specifies the name of the group of filtering nodes you want to add newly deployed nodes to. Node grouping this way is available only when you create and connect nodes to the Cloud using an API token with the **Node deployment/Deployment** usage type (its value is passed in the `controller.wallarm.token` parameter).

**Default value**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Starting from the Helm chart version 4.4.1, you can use this configuration block to pull a Wallarm node token value from Kubernetes secrets. It is useful for environments with separate secret management (e.g. you use an external secrets operator).

To store the node token in K8s secrets and pull it to the Helm chart:

1. Create a Kubernetes secret with the Wallarm node token:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` is the Kubernetes namespace you have created for the Helm release with Wallarm Ingress controller
    * `wallarm-api-token` is the Kubernetes secret name
    * `<WALLARM_NODE_TOKEN>` is the Wallarm node token value copied from the Wallarm Console UI

    If using some external secret operator, follow [appropriate documentation to create a secret](https://external-secrets.io).
1. Set the following configuration in `values.yaml`:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**Default value**: `existingSecret.enabled: false` that points to the Helm chart to get the Wallarm node token from `controller.wallarm.token`.

### controller.wallarm.postanalytics.arena

Specifies the amount of memory allocated for postanalytics service. It is recommended to set up a value sufficient to store request data for the last 5-15 minutes.

**Default value**: `2.0`

In the [NGINX Node 5.x and earlier](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics), the parameter has been named `controller.wallarm.tarantool.arena`. Renaming is required during upgrade.

### controller.wallarm.postanalytics.serviceAddress

Specifies the address and port on which **wstore** accepts incoming connections.

Supported from the release 6.3.0 onwards.

**Default value**:

* Node 6.6.0 and higher: `0.0.0.0:3313` - listens on port 3313 on all IPv4 interfaces.
* Prior versions: `[::]:3313` - listened on port 3313 on all IPv4 and IPv6 interfaces.

### controller.wallarm.postanalytics.serviceProtocol

Specifies the protocol family that **wstore** uses for incoming connections.

Supported from the release 6.6.0 onwards.

Possible values:

* `tcp` - dual-stack mode (listens on both IPv4 and IPv6)
* `tcp4` - IPv4 only
* `tcp6` - IPv6 only

**Default value**: `"tcp4"`.

### controller.wallarm.postanalytics.tls

Configures TLS and mutual TLS (mTLS) settings to allow secure connection to the postanalytics module (optional):

```yaml
controller:
  wallarm:
    postanalytics:
      tls:
        enabled: false
      #  certFile: "/root/test-tls-certs/server.crt"
      #  keyFile: "/root/test-tls-certs/server.key"
      #  caCertFile: "/root/test-tls-certs/ca.crt"
      #  mutualTLS:
      #    enabled: false
      #    clientCACertFile: "/root/test-tls-certs/ca.crt"
```

Supported from the release 6.2.0 onwards.

| Parameter | Description | Required? |
| --------- | ----------- | --------- |
| `enabled` | Enables or disables SSL/TLS for the connection to the postanalytics module. By default, `false` (disabled). | Yes |
| `certFile` | Specifies the path to the client certificate used by the the Filtering Node to authenticate itself when establishing an SSL/TLS connection to the postanalytics module. | Yes if `mutualTLS.enabled` is `true` |
| `keyFile` | Specifies the path to the private key corresponding to the client certificate provided via `certFile`. | Yes if `mutualTLS.enabled` is `true` |
| `caCertFile` | Specifies the path to a trusted Certificate Authority (CA) certificate used to validate the TLS certificate presented by the postanalytics module. | Yes if using a custom CA |
| `mutualTLS.enabled` | Enables mutual TLS (mTLS), where both the Filtering Node and the postanalytics module verify each other's identity via certificates. By default, `false` (disabled). | No |
| `mutualTLS.clientCACertFile` | Specifies the path to a trusted Certificate Authority (CA) certificate used to validate the TLS certificate presented by the Filtering Node. | Yes if using a custom CA |

### controller.wallarm.metrics.enabled

This switch [toggles](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required.

**Default value**: `false`

### controller.wallarm.wcliPostanalytics.metrics.enabled

Enables or disables the [**wcli** Controller metrics][wcli-metrics] endpoint. When set to `true`, the **wcli** Controller exposes the metrics. Supported starting with release 6.5.1.

**Default value**: `false`

### controller.wallarm.wcliPostanalytics.metrics.port

Defines the port on which [**wcli** Controller metrics][wcli-metrics] are exposed. Supported starting with release 6.5.1.

**Default value**: `9012`

### controller.wallarm.wcliPostanalytics.metrics.portName

Defines the name of the port on which [**wcli** Controller metrics][wcli-metrics] are exposed. Supported starting with release 6.5.1.

**Default value**: `wcli-post-mtrc`

### controller.wallarm.wcliPostanalytics.metrics.endpointPath

Defines the HTTP path for the [**wcli** Controller metrics][wcli-metrics] endpoint.

If not set, the default path `/metrics` is used.

Supported starting with release 6.5.1.

**Default value**: not specified (defaults to `/metrics`)

### controller.wallarm.wcliPostanalytics.metrics.host

Sets the IP address and/or port to which the [wcli Controller metrics][wcli-metrics] server binds. Supported starting with release 6.5.1.

Examples:

* `:9012` — binds to all interfaces on port 9012
* `127.0.0.1:9012` — binds to `localhost` only (port 9012)

**Default value**: `:9012`

### controller.wallarm.apiFirewall

Controls the configuration of [API Specification Enforcement](../api-specification-enforcement/overview.md), available starting from release 4.10. By default, it is enabled and configured as shown below. If you are using this feature, it is recommended to keep these values unchanged.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### Enable or disable API Firewall functionality (true|false)
      ###
      enabled: true
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
      config:
        mainPort: 18081
        healthPort: 18082
        specificationUpdatePeriod: 1m
        unknownParametersDetection: true
        #### TRACE|DEBUG|INFO|WARNING|ERROR
        logLevel: DEBUG
        ### TEXT|JSON
        logFormat: TEXT
      ...
```

Since node 5.1.0, the following is presented (see default values in the example above):

| Setting | Description |
| ------- | ----------- |
| `readBufferSize` | Per-connection buffer size for request reading. This also limits the maximum header size. Increase this buffer if your clients send multi-KB RequestURIs and/or multi-KB headers (for example, BIG cookies). |
| `writeBufferSize` | Per-connection buffer size for response writing.
| `maxRequestBodySize` | Maximum request body size. The server rejects requests with bodies exceeding this limit. |
| `disableKeepalive` | Disables the keep-alive connections. The server will close all the incoming connections after sending the first response to the client if this option is set to `true`. |
| `maxConnectionsPerIp` | Maximum number of concurrent client connections allowed per IP. `0` = `unlimited`. |
| `maxRequestsPerConnection` | Maximum number of requests served per connection. The server closes the connection after the last request. The `Connection: close` header is added to the last response. `0` = `unlimited`. |

### controller.wallarm.apiFirewall.metrics

Starting from version 6.5.1, the [API Specification Enforcement](../api-specification-enforcement/overview.md) module can expose Prometheus-compatible metrics.

When enabled, metrics are available by default at `http://<host>:9010/metrics`.

| Setting | Description |
| ------- | ----------- |
| `enabled` | Enables Prometheus metrics for the API Specification Enforcement module.<br>By default: `false` (disabled). |
| `port` | Defines the port on which the API Specification Enforcement module exposes metrics. If you change this value, also update `controller.wallarm.apiFirewall.metrics.service.servicePort`.<br>Default: `9010`. |
| `endpointPath` | Defines the HTTP path of the API Specification Enforcement metrics endpoint<br>By default: `metrics`. |
| `host` | IP address and port for binding the metrics server.<br>By default: `:9010` (all interfaces on port 9010). |

```yaml
controller:
  wallarm:
    apiFirewall:
      metrics:
        enabled: false
        port: 9010
        endpointPath: /metrics
        host: ":9010"
        service:
          servicePort: 9010
```

### controller.wallarm.apiFirewall.metrics.serviceMonitor

If you are using the Prometheus Operator (for example, as part of the kube-prometheus-stack), you can configure the chart to automatically create a `ServiceMonitor` resource for scraping [API Specification Enforcement metrics](#controllerwallarmapifirewallmetrics).

The `serviceMonitor` configuration options are available starting from version 6.5.1.

Configuration options with default values:

```yaml
controller:
  wallarm:
    apiFirewall:
      metrics:
        ...
        serviceMonitor:
          ## Enables creation of the ServiceMonitor resource
          enabled: false
          ## Extra labels used to match the Prometheus instance
          additionalLabels: {}
          # -- Annotations to be added to the ServiceMonitor
          annotations: {}
          ## The label to use to retrieve the job name from
          ## jobLabel: "app.kubernetes.io/name"
          namespace: ""
          namespaceSelector: {}
          ## Default: scrape .Release.Namespace or namespaceOverride only
          ## To scrape all, use the following:
          ## namespaceSelector:
          ##   any: true
          scrapeInterval: 30s
          # honorLabels: true
          targetLabels: []
          relabelings: []
          metricRelabelings: []
```

### controller.wallarm.container_name.extraEnvs

Extra environment variables to be passed to the Docker containers utilized by the solution. Supported starting from the release 4.10.6.

The example below shows how to pass the `https_proxy` and `no_proxy` variables to Docker containers. This setup directs outgoing HTTPS traffic through a designated proxy, while local traffic bypasses it. Such configuration is crucial in environments where external communications, like those with the Wallarm API, must pass through a proxy for security reasons.

```yaml
controller:
  wallarm:
    apiHost: api.wallarm.com
    enabled: "true"
    token:  <API_TOKEN>
    init:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
```

### validation.enableCel

Enables validation of `Ingress` resources using [Validating Admission Policies](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/).

This feature requires:

* Kubernetes v1.30 or above
* Wallarm Helm chart version 5.3.14+ (5.x series) or 6.0.2+

When set to `true`, the Helm chart deploys:

* `ValidatingAdmissionPolicy ingress-safety-net` which defines the CEL rules for all `Ingress` resources (`networking.k8s.io/v1`)
* `ValidatingAdmissionPolicyBinding ingress-safety-net-binding` which executes those rules `cluster-wide` with the action `Deny`

The default rules catch common misconfigurations typically detected by `nginx -t`:

* Forbidding wildcard hosts (e.g., `*.example.com`)
* Ensuring all host values are unique within an Ingress
* Verifying that each HTTP path includes a service name and port
* Requiring that all paths start with `/`
* Validating formats of common size/time/boolean annotations (`proxy-buffer-size`, `proxy-read-timeout`, `ssl-redirect`)

Validation occurs during Ingress creation or update, rejecting misconfigured resources.

This mechanism replaces template testing, which is currently disabled in the [upstream NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx) due to [CVE-2025-1974](https://nvd.nist.gov/vuln/detail/CVE-2025-1974).

**Default value**: `false`

**Customizing validation rules**

You can extend or modify the default set of rules using [Common Expression Language (CEL)](https://github.com/google/cel-spec):

1. [Download the Wallarm Helm chart](https://github.com/wallarm/helm-charts/tree/main/wallarm-ingress) of the required version.
1. Modify the rules in the `templates/ingress-safety-vap.yaml` file.
1. Deploy the chart from the modified directory according to the [standard deployment instructions](installation-kubernetes-en.md).

### validation.forbidDangerousAnnotations

Enables an additional CEL rule that blocks explicitly dangerous NGINX Ingress annotations `server-snippet` and `configuration-snippet`.

Allowing all snippet annotations widens the attack surface: any user with permissions to create or update Ingresses can introduce insecure or unstable behavior.

This feature requires:

* Kubernetes v1.30 or above
* Wallarm Helm chart version 6.3.0+
* [`validation.enableCel`](#validationenablecel) is set to `true`

!!! info "Behavior in Node 6.2.0-"
    In Node versions 6.2.0 and earlier, explicitly dangerous `server-snippet` and `configuration-snippet` are blocked by default when [`validation.enableCel`](#validationenablecel) is `true`.

**Default value**: `false` (blocking explicitly dangerous annotations `server-snippet` and `configuration-snippet` is disabled)

## Global Controller Settings 

Implemented via [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/).

Besides the standard ones, the following additional parameters are supported:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_wstore_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_wstore_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingress Annotations

These annotations are used for setting up parameters for processing individual instances of Ingress.

[Besides the standard ones](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), the following additional annotations are supported:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), default: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### Applying annotation to the Ingress resource

To apply the settings to your Ingress, please use the following command:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<YOUR_INGRESS_NAMESPACE>` is the namespace of your Ingress
* `<ANNOTATION_NAME>` is the name of the annotation from the list above
* `<VALUE>` is the value of the annotation from the list above

### Annotation examples

#### Configuring the blocking page and error code

The annotation `nginx.ingress.kubernetes.io/wallarm-block-page` is used to configure the blocking page and error code returned in the response to the request blocked for the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../attacks-vulns-list.md#attack-types), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above is originated from [graylisted IP address](../user-guides/ip-lists/overview.md) and the node filters requests in the safe blocking [mode](configure-wallarm-mode.md).
* Request is originated from the [denylisted IP address](../user-guides/ip-lists/overview.md).

For example, to return the default Wallarm blocking page and the error code 445 in the response to any blocked request:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[More details on the blocking page and error code configuration methods →](configuration-guides/configure-block-page-and-code.md)

#### Managing libdetection mode

!!! info "**libdetection** default mode"
    The default mode of the **libdetection** library is `on` (enabled).

You can control the [**libdetection**](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) mode using one of the options:

* Applying the following [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) annotation to the Ingress resource:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection off;"
    ```

    Available values of `wallarm_enable_libdetection` are `on`/`off`.
* Pass the parameter `controller.config.server-snippet` to the Helm chart:

    === "Ingress controller installation"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        There are also [other parameters](#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    Available values of `wallarm_enable_libdetection` are `on`/`off`.
