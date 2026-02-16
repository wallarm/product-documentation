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

!!! info "Official documentation for F5 NGINX Ingress Controller"
    The fine‑tuning of the Wallarm Ingress Controller is similar to that of the F5 NGINX Ingress Controller described in the [official documentation](https://docs.nginx.com/nginx-ingress-controller/). When working with Wallarm, all options for setting up the original F5 NGINX Ingress Controller are available.

## Wallarm-specific configuration in values.yaml

The settings are defined in the `values.yaml` file. You can view its default state in the [GitHub repository](https://github.com/wallarm/ingress-nextgen/blob/main/charts/nginx-ingress/values.yaml).

Below are the configuration parameters that are most likely changed:

<details>
<summary>Show YAML configuration</summary>

```yaml
config:
  wallarm:
    enabled: false

    api:
      host: "api.wallarm.com"
      port: 443
      ssl: true
      token: ""
      nodeGroup: "defaultIngressGroup"
      existingSecret:
        enabled: false
    fallback: "on"

  wcliPostanalytics:
    logLevel: "WARN"
    commands:
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
      jwtexp:
        logLevel: INFO
      mrksync:
        logLevel: INFO
      register:
        logLevel: INFO
      reqexp:
        logLevel: INFO

  wcliController:
    logLevel: "WARN"
    commands:
      apispec:
        logLevel: INFO
      envexp:
        logLevel: INFO
      ipfeed:
        logLevel: INFO
      iplist:
        logLevel: INFO
      metricsexp:
        logLevel: INFO
      register:
        logLevel: INFO
      syncnode:
        logLevel: INFO

  apiFirewall:
    enabled: true
    readBufferSize: 8192
    writeBufferSize: 8192
    maxRequestBodySize: 4194304
    disableKeepalive: false
    maxConnectionsPerIp: 0
    maxRequestsPerConnection: 0
    maxErrorsInResponse: 3
    config:
      mainPort: 18081
      healthPort: 18082
      specificationUpdatePeriod: "1m"
      unknownParametersDetection: true
      logLevel: "INFO"
      logFormat: "TEXT"



controller:
  name: controller

  kind: deployment

  selectorLabels: {}

  annotations: {}

  wallarm:
    metrics:
      enabled: false
      port: 18080
      portName: wallarm-metrics
      endpointPath: "/wallarm-metrics"
      service:
        annotations: {}
        labels: {}
        externalIPs: []
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
      serviceMonitor:
        enabled: false
        additionalLabels: {}
        annotations: {}
        namespace: ""
        namespaceSelector: {}
        scrapeInterval: 30s
        targetLabels: []
        relabelings: []
        metricRelabelings: []

    initContainer:
      resources: {}
      securityContext: {}
      extraEnvs: []

    wcli:
      resources: {}
      securityContext: {}
      metrics:
        enabled: true
        port: 9004
        portName: wcli-ctrl-mtrc
        endpointPath: ""
        host: ":9004"
        service:
          annotations: {}
          labels: {}
          externalIPs: []
          loadBalancerSourceRanges: []
          servicePort: 9004
          type: ClusterIP
        serviceMonitor:
          enabled: false
          additionalLabels: {}
          annotations: {}
          namespace: ""
          namespaceSelector: {}
          scrapeInterval: 30s
          targetLabels: []
          relabelings: []
          metricRelabelings: []
      extraEnvs: []

    extraVolumes: []

    extraVolumeMounts: []

  hostNetwork: false

  hostPort:
    enable: false

    http: 80

    https: 443

  containerPort:
    http: 80

    https: 443

  dnsPolicy: ClusterFirst

  nginxDebug: false

  shareProcessNamespace: false

  logLevel: info

  logFormat: glog

  directiveAutoAdjust: false

  customPorts: []

  lifecycle: {}

  customConfigMap: ""

  config:
    annotations: {}

    entries: {}

  defaultTLS:
    cert: ""

    key: ""

    secret: ""

  wildcardTLS:
    cert: ""

    key: ""

    secret: ""

  terminationGracePeriodSeconds: 30

  autoscaling:
    enabled: false
    create: true
    annotations: {}
    minReplicas: 1
    maxReplicas: 3
    targetCPUUtilizationPercentage: 50
    targetMemoryUtilizationPercentage: 50
    behavior: {}

  resources:
    requests:
      cpu: 100m
      memory: 128Mi

  podSecurityContext:
    seccompProfile:
      type: RuntimeDefault

  securityContext:
    {}

  initContainerSecurityContext: {}

  initContainerResources:
    requests:
      cpu: 100m
      memory: 128Mi

  tolerations: []

  affinity: {}

  env: []

  volumes: []

  volumeMounts: []

  initContainers: []

  minReadySeconds: 0

  podDisruptionBudget:
    enabled: false
    annotations: {}

  networkPolicy:
    enabled: false
    annotations: {}

    strategy: {}

  extraContainers: []

  replicaCount: 1

  ingressClass:
    name: nginx

    create: true

    setAsDefaultIngress: false

  watchNamespace: ""

  watchNamespaceLabel: ""

  watchSecretNamespace: ""

  enableCustomResources: true

  enableTLSPassthrough: false

  tlsPassthroughPort: 443

  enableCertManager: false

  enableExternalDNS: false

  globalConfiguration:
    create: false

    customName: ""

    spec: {}

  enableSnippets: false

  healthStatus: false

  healthStatusURI: "/nginx-health"

  nginxStatus:
    enable: true

    port: 10246

    allowCidrs: "127.0.0.1"

  service:
    create: true

    type: LoadBalancer

    externalTrafficPolicy: Local

    annotations: {}

    extraLabels: {}

    loadBalancerIP: ""

    clusterIP: ""

    externalIPs: []

    loadBalancerSourceRanges: []

    httpPort:
      enable: true

      port: 80

      targetPort: 80

      name: "http"

    httpsPort:
      enable: true

      port: 443

      targetPort: 443

      name: "https"

    customPorts: []

    sessionAffinity:
      enable: false
      type: ClientIP
      timeoutSeconds: 3600

  serviceAccount:
    annotations: {}

    imagePullSecretName: ""

    imagePullSecretsNames: []

  reportIngressStatus:
    enable: true

    ingressLink: ""

    enableLeaderElection: true

    leaderElectionLockName: ""

    annotations: {}

  pod:
    annotations: {}

    extraLabels: {}

  readyStatus:
    enable: true

    port: 8081

    initialDelaySeconds: 0

  startupStatus:

    enable: false

  enableLatencyMetrics: false

  disableIPV6: false

  defaultHTTPListenerPort: 80

  defaultHTTPSListenerPort: 443

  readOnlyRootFilesystem: false

  enableSSLDynamicReload: true

postanalytics:
  kind: "Deployment"
  replicaCount: 1
  imagePullSecrets: []
  arena: "2.0"
  serviceAddress: "0.0.0.0:3313"
  serviceProtocol: "tcp4"
  resources: {}
  livenessProbe:
    failureThreshold: 3
    initialDelaySeconds: 5
    periodSeconds: 10
    successThreshold: 1
    timeoutSeconds: 1
  readinessProbe:
    failureThreshold: 3
    initialDelaySeconds: 5
    periodSeconds: 10
    successThreshold: 1
    timeoutSeconds: 1
  extraEnvs: []
  extraVolumes: []
  extraVolumeMounts: []
  service:
    annotations: {}
    labels: {}
  podAnnotations: {}
  podLabels: {}
  nodeSelector: {}
  tolerations: []
  affinity: {}
  topologySpreadConstraints: []
  annotations: {}
  networkPolicy:
    enabled: false
    annotations: {}
  podDisruptionBudget:
    enabled: false
    annotations: {}
  terminationGracePeriodSeconds: 30
  tls:
    enabled: false
  metrics:
    listenAddress: "127.0.0.1:9001"
    protocol: "tcp4"

  initContainer:
    resources: {}
    securityContext: {}
    extraEnvs: []

  wcli:
    resources: {}
    securityContext: {}
    metrics:
      enabled: true
      port: 9003
      portName: wcli-post-mtrc
      endpointPath: ""
      host: ":9003"
      service:
        annotations: {}
        labels: {}
        externalIPs: []
        loadBalancerSourceRanges: []
        servicePort: 9003
        type: ClusterIP
      serviceMonitor:
        enabled: false
        additionalLabels: {}
        annotations: {}
        namespace: ""
        namespaceSelector: {}
        scrapeInterval: 30s
        targetLabels: []
        relabelings: []
        metricRelabelings: []
    extraEnvs: []

  appstructure:
    resources: {}
    securityContext: {}
    extraEnvs: []

  clusterrole:
    create: true

prometheus:
  create: true

  port: 9113

  secret: ""

  scheme: http

  service:
    create: false

    labels:
      service: "nginx-ingress-prometheus-service"

  serviceMonitor:
    create: false

    labels: {}

    selectorMatchLabels:
      service: "nginx-ingress-prometheus-service"

    endpoints:
      - port: prometheus

prometheusExtended:
  enabled: false
  port: 10113
  portName: prom-ext
  endpointPath: "/vts-status"
  service:
    create: false
    annotations: {}
    labels: {}
    externalIPs: []
    loadBalancerSourceRanges: []
    servicePort: 10113
    type: ClusterIP
  serviceMonitor:
    enabled: false
    additionalLabels: {}
    annotations: {}
    namespace: ""
    namespaceSelector: {}
    scrapeInterval: 30s
    targetLabels: []
    relabelings: []
    metricRelabelings: []
```
</details>

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

### Wallarm configuration parameters

#### config.wallarm.enabled

Enables or disables the Wallarm module in the Ingress Controller.

**Default value**: `false`

#### config.wallarm.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/overview.md#cloud).
* `api.wallarm.com` for the [EU cloud](../about-wallarm/overview.md#cloud),

**Default value**: `api.wallarm.com`

#### config.wallarm.api.port

Wallarm API endpoint port.

**Default value**: `443`

#### config.wallarm.api.ssl

Enables TLS when communicating with the Wallarm API.

**Default value**: `true`

#### config.wallarm.api.token

The Node token value. It is required to access the Wallarm API.

The token can be one of these [types][node-token-types]:

* **API token (recommended)** - Ideal if you need to dynamically add/remove node groups for UI organization or if you want to control token lifecycle for added security. To generate an API token:

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

#### config.wallarm.api.nodeGroup

The name of the node group to which the newly deployed Node will be added.

This parameter is required when the Node is registered using an [API token][node-token-types] with the **Node deployment / Deployment** usage type (provided via the [`config.wallarm.api.token`](#configwallarmapitoken) parameter), which is the only token type that supports node grouping.

**Default value**: `defaultIngressGroup`

#### config.wallarm.api.existingSecret.enabled

Configures the Ingress Controller to use a Wallarm node token from an existing Kubernetes Secret, instead of setting [`config.wallarm.api.token`](#configwallarmapitoken) directly. It is useful for environments with external secret management (e.g., when using an external secrets operator).

If `true`, you need to set:

- `config.wallarm.api.existingSecret.secretName` - secret name that contains the token
- `config.wallarm.api.existingSecret.secretKey` - secret key that contains the token

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

#### config.wallarm.fallback

Controls [fallback behavior][fallback] when Wallarm data (for example, [`proton.db][proton-db] or a [custom rule set][lom]) cannot be downloaded.

**Default value**: `"on"`

### Wallarm wcli parameters

#### config.wcliPostanalytics.logLevel

Log level for the [**wcli** Controller][wcli] Postanalytics module, which runs in the **postanalytics** pod.

Possible values: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

**Default value**: `"WARN"`

#### config.wcliPostanalytics.commands*

Per-command log level configuration for the [**wcli** Controller][wcli] Postanalytics module, which runs in the **postanalytics** pod.

You can set log levels individually for each command: `blkexp`, `botexp`, `cntexp`, `cntsync`, `credstuff`, `envexp`, `jwtexp`, `mrksync`, `register`, `reqexp`.

Possible values for each command: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

#### config.wcliController.logLevel

Log level for the [**wcli** Controller][wcli] Postanalytics module, which runs in the **controller** pod.

Possible values: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

**Default value**: `"WARN"`

#### config.wcliController.commands*

Per-command log level configuration for the [**wcli** Controller][wcli], which runs in the **controller** pod.

You can set log levels individually for each command: `apispec`, `envexp`, `ipfeed`, `iplist`, `metricsexp`, `register`, `syncnode`

Possible values for each command: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

### API Specification Enforcement parameters

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
    ## API Firewall configuration
    config:
      mainPort: 18081
      healthPort: 18082
      specificationUpdatePeriod: "1m"
      unknownParametersDetection: true
      #### Log level RACE|DEBUG|INFO|WARNING|ERROR
      logLevel: "INFO"
      ### Log format TEXT|JSON
      logFormat: "TEXT"
      ...
```

The table below describes the [API Specification Enforcement][api-firewall] parameters:

| Setting | Description |
| ------- | ----------- |
| `readBufferSize` | Per-connection buffer size for request reading. This also limits the maximum header size. Increase this buffer if your clients send multi-KB RequestURIs and/or multi-KB headers (for example, BIG cookies). |
| `writeBufferSize` | Per-connection buffer size for response writing.
| `maxRequestBodySize` | Maximum request body size. The server rejects requests with bodies exceeding this limit. |
| `disableKeepalive` | Disables the keep-alive connections. The server will close all the incoming connections after sending the first response to the client if this option is set to `true`. |
| `maxConnectionsPerIp` | Maximum number of concurrent client connections allowed per IP. `0` = `unlimited`. |
| `maxRequestsPerConnection` | Maximum number of requests served per connection. The server closes the connection after the last request. The `Connection: close` header is added to the last response. `0` = `unlimited`. |
| `maxErrorsInResponse` | Maximum number of errors included in an [API Specification Enforcement][api-firewall] response. |

### Wallarm container metrics parameters

#### controller.wallarm.metrics.enabled

This switch [toggles](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required.

**Default value**: `false`

#### controller.wallarm.metrics.port

Port on which the Wallarm metrics endpoint listens. This is separate from NGINX metrics.

**Default value**: `18080`

#### controller.wallarm.metrics.portName

The name assigned to the metrics endpoint port.

**Default value**: `"wallarm-metrics"`

#### controller.wallarm.metrics.endpointPath

HTTP path at which the Wallarm metrics endpoint is exposed.

**Default value**: `"/wallarm-metrics"`

#### controller.wallarm.metrics.service.annotations

Annotations to attach to the metrics service.

**Default value**: `{}`

#### controller.wallarm.metrics.service.labels

Custom labels to attach to the metrics service.

**Default value**: `{}`

#### controller.wallarm.metrics.service.externalIPs

List of external IP addresses that can access the metrics service.

**Default value**: `[]`

#### controller.wallarm.metrics.service.loadBalancerSourceRanges

List of CIDRs allowed to access the metrics service when using a load balancer.

**Default value**: `[]`

#### controller.wallarm.metrics.service.servicePort

Port exposed by the metrics service.

**Default value**: `18080`

#### controller.wallarm.metrics.service.type

Type of Kubernetes service for the metrics endpoint. 

Possible values: `ClusterIP`, `NodePort`, `LoadBalancer`.

**Default value**: `ClusterIP`

#### controller.wallarm.metrics.serviceMonitor*

If you are using the Prometheus Operator (e.g., as part of the kube-prometheus-stack), you can configure the chart to automatically create a `ServiceMonitor` resource for scraping Wallarm container metrics.

Configuration options with default values:

```yaml
controller:
  wallarm:
    metrics:
      ...
      serviceMonitor:
        enabled: false
        additionalLabels: {}
        annotations: {}
        namespace: ""
        namespaceSelector: {}
        scrapeInterval: 30s
        # honorLabels: true
        targetLabels: []
        relabelings: []
        metricRelabelings: []      
```

### Wallarm CLI in the controller pod

#### controller.wallarm.wcli.resources

Kubernetes resource requests and limits for the Wallarm CLI controller container running in the `controller` pod.

**Default value**: `{}`

#### controller.wallarm.wcli.securityContext

Kubernetes security context for the Wallarm CLI controller container.

**Default value**: `{}`

#### controller.wallarm.wcli.metrics.enabled

Enables or disables metrics collection for the Wallarm CLI controller.

**Default value**:` true`

#### controller.wallarm.wcli.metrics.port

Port on which the Wallarm CLI controller metrics endpoint listens.

**Default value**: `9004`

#### controller.wallarm.wcli.metrics.portName

Name assigned to the metrics endpoint port.

**Default value**: `"wcli-ctrl-mtrc"`

#### controller.wallarm.wcli.metrics.endpointPath

HTTP path at which the metrics endpoint is exposed.

If empty, the default path defined by the Wallarm CLI controller is used.

**Default value**: `""`

#### controller.wallarm.wcli.metrics.host

IP address and/or port on which the metrics endpoint binds.

**Default value**: `":9004"`

#### controller.wallarm.wcli.metrics.service.annotations

Annotations to attach to the metrics service.

**Default value**: `{}`

#### controller.wallarm.wcli.metrics.service.labels

Custom labels to attach to the metrics service.

**Default value**: `{}`

#### controller.wallarm.wcli.metrics.service.externalIPs

List of external IP addresses that can access the metrics service.

**Default value**: `[]`

#### controller.wallarm.wcli.metrics.service.loadBalancerSourceRanges

List of CIDR ranges allowed to access the metrics service when using a load balancer.

**Default value**: `[]`

#### controller.wallarm.wcli.metrics.service.servicePort

Port exposed by the metrics service.

**Default value**: `9004`

#### controller.wallarm.wcli.metrics.service.type

Type of Kubernetes service for the metrics endpoint. 

Possible values: `ClusterIP`, `NodePort`, `LoadBalancer`.

**Default value**: `ClusterIP`

#### controller.wallarm.wcli.metrics.serviceMonitor

If you are using the Prometheus Operator (e.g., as part of the kube-prometheus-stack), you can configure the chart to automatically create a `ServiceMonitor` resource for scraping the Wallarm CLI controller metrics.

Configuration options with default values:

```yaml
controller:
  wallarm:
    wcli:
      metrics:
        ...
        serviceMonitor:
          enabled: false
          additionalLabels: {}
          annotations: {}
          namespace: ""
          namespaceSelector: {}
          scrapeInterval: 30s
          # honorLabels: true
          targetLabels: []
          relabelings: []
          metricRelabelings: []     
```

### API Specification Enforcement metrics parameters

The [API Specification Enforcement][api-firewall] module can expose Prometheus-compatible metrics.

When enabled, metrics are available by default at `http://<host>:9010/metrics`.

| Setting | Description |
| ------- | ----------- |
| `enabled` | Enables Prometheus metrics for the API Specification Enforcement module.<br>By default: `false` (disabled). |
| `port` | Defines the port on which the API Specification Enforcement module exposes metrics. If you change this value, also update `controller.wallarm.apiFirewall.metrics.service.servicePort`.<br>Default: `9010`. |
| `portName` | Name assigned to the metrics port.<br>By default: `apifw-metrics`. |
| `endpointPath` | Defines the HTTP path of the API Specification Enforcement metrics endpoint<br>By default: `/metrics`. |
| `host` | IP address and port for binding the metrics server.<br>By default: `:9010` (all interfaces on port 9010). |

Configuration options with default values:

```yaml
controller:
  wallarm:
    apiFirewall:
      metrics:
        ## Enable metrics collection
        enabled: false
        ## Port for metrics endpoint
        port: 9010
        ## Port name for metrics endpoint
        portName: apifw-metrics
        ## Path at which the metrics endpoint is exposed
        endpointPath: "/metrics"
        ## IP address and/or port for the metrics endpoint
        host: ":9010"
        service:
          annotations: {}
          # prometheus.io/scrape: "true"
          # prometheus.io/port: "9010"
          labels: {}
          # clusterIP: ""
          externalIPs: []
          # loadBalancerIP: ""
          loadBalancerSourceRanges: []
          servicePort: 9010
          type: ClusterIP
          # externalTrafficPolicy: ""
          # nodePort: ""
```

#### controller.wallarm.apiFirewall.metrics.serviceMonitor*

If you are using the Prometheus Operator (e.g., as part of the kube-prometheus-stack), you can configure the chart to automatically create a `ServiceMonitor` resource for scraping the [API Specification Enforcement][api-firewall] metrics.

Configuration options with default values:

```yaml
controller:
  wallarm:
    apiFirewall:
      metrics:
        ...
        serviceMonitor:
          enabled: false
          additionalLabels: {}
          annotations: {}
          namespace: ""
          namespaceSelector: {}
          scrapeInterval: 30s
          # honorLabels: true
          targetLabels: []
          relabelings: []
          metricRelabelings: []   
```

#### postanalytics (wstore)

#### postanalytics.kind

Type of Postanalytics (**wstore**) installation.

Possible values: `Deployment` or `DaemonSet`.

**Default value**: `"Deployment"`

#### postanalytics.replicaCount

Number of Postanalytics replicas to run.

Applies only when [`postanalytics.kind`](#postanalyticskind) is set to `Deployment`.

**Default value**: `1`

#### postanalytics.imagePullSecrets

List of Kubernetes image pull secrets used to pull Postanalytics container images.

The secrets must already exist in the same namespace as the Helm release.

**Default value**: `[]`

#### postanalytics.arena

Specifies the amount of memory in GB allocated for postanalytics service. It is recommended to set up a value sufficient to store request data for the last 5-15 minutes.

**Default value**: `"2.0"`

#### postanalytics.serviceAddress

Specifies the address and port on which **wstore** accepts incoming connections.

**Default value**: `"0.0.0.0:3313"`

#### postanalytics.serviceProtocol

Specifies the protocol family that **wstore** uses for incoming connections.

Possible values:

* `tcp` - dual-stack mode (listens on both IPv4 and IPv6)
* `tcp4` - IPv4 only
* `tcp6` - IPv6 only

**Default value**: `"tcp4"`.

#### postanalytics.tls*

Configures TLS and mutual TLS (mTLS) settings to allow secure connection to the Postanalytics module (optional).

Configuration options with default values:

```yaml
postanalytics:
  tls:
    enabled: false
  #   certFile: "/root/test-tls-certs/server.crt"
  #   keyFile: "/root/test-tls-certs/server.key"
  #   caCertFile: "/root/test-tls-certs/ca.crt"
  #   mutualTLS:
  #     enabled: false
  #     clientCACertFile: "/root/test-tls-certs/ca.crt"
```

| Parameter | Description | Required? |
| --------- | ----------- | --------- |
| `enabled` | Enables or disables SSL/TLS for the connection to the postanalytics module. By default, `false` (disabled). | Yes |
| `certFile` | Specifies the path to the client certificate used by the the Filtering Node to authenticate itself when establishing an SSL/TLS connection to the postanalytics module. | Yes if `mutualTLS.enabled` is `true` |
| `keyFile` | Specifies the path to the private key corresponding to the client certificate provided via `certFile`. | Yes if `mutualTLS.enabled` is `true` |
| `caCertFile` | Specifies the path to a trusted Certificate Authority (CA) certificate used to validate the TLS certificate presented by the postanalytics module. | Yes if using a custom CA |
| `mutualTLS.enabled` | Enables mutual TLS (mTLS), where both the Filtering Node and the postanalytics module verify each other's identity via certificates. By default, `false` (disabled). | No |
| `mutualTLS.clientCACertFile` | Specifies the path to a trusted Certificate Authority (CA) certificate used to validate the TLS certificate presented by the Filtering Node. | Yes if using a custom CA |

### Other parameters

#### controller.wallarm.initContainer.extraEnvs

Additional environment variables to pass to the init container.

The example below shows how to pass the `https_proxy` and `no_proxy` variables. This setup directs outgoing HTTPS traffic through a designated proxy, while local traffic bypasses it. This configuration is important when external traffic, such as to the Wallarm API, must go through a proxy for security reasons.

```yaml
controller:
  wallarm:
    ...
    initContainer:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
```

### Annotation validation

NGINX Ingress Controller validates annotations by itself. If an Ingress has invalid annotation values, the controller rejects/ignores that Ingress configuration and reports it via Kubernetes Events (for example, a Rejected event). [See "Advanced configuration with Annotations"](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-annotations/).

#### controller.enableSnippets

Controls whether custom snippets are allowed in Ingress/VirtualServer resources.

When enabled, it allows using snippet-style annotations such as `nginx.org/server-snippets`/`nginx.org/location-snippets` (and related snippet mechanisms supported by the NGINX Ingress Controller).

**Default value:** `false`

!!! info "Security note"
    Snippet support can widen the attack surface in multi-tenant clusters. Keep it disabled unless you fully trust who can create/update Ingress resources.

## Global Controller settings 

Implemented via [ConfigMap](https://docs.nginx.com/nginx-ingress-controller/configuration/global-configuration/configmap-resource/).

Besides the standard ones, the following additional parameters are supported. You can set them via the Helm value `controller.config.entries`:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_upstream_connect_attempts)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_upstream_reconnect_interval)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Supported Wallarm Ingress annotations

In this section, you can see the Wallarm-specific Ingress annotations supported by the Wallarm Ingress Controller based on the [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress).

Besides the Wallarm-specific annotations described below, [standard NGINX Ingress Controller annotations](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-annotations/) are also supported.

!!! info "Annotation prefix"
    In the F5-based controller, annotations use the `nginx.org/*` prefix instead of `nginx.ingress.kubernetes.io/*`. This applies to both general NGINX annotations and Wallarm-specific annotations. [See more details][new-annotations].

| Annotation | Description | 
| --- | --- | 
| `nginx.org/wallarm-mode` | [Traffic filtration mode](../admin-en/configure-wallarm-mode.md): `monitoring` (default), `safe_blocking`, `block` or `off`. | 
| `nginx.org/wallarm-mode-allow-override` | Manages the [ability to override the `wallarm_mode values` via settings in the Cloud](../admin-en/configure-wallarm-mode.md#prioritization-of-methods): `on` (default), `off` or `strict`. | 
| `nginx.org/wallarm-fallback` | [Wallarm fallback mode](../admin-en/configure-parameters-en.md#wallarm_fallback) : `on` (default) or `off`. | 
| `nginx.org/wallarm-application` | [Wallarm application ID](../user-guides/settings/applications.md). |
| `nginx.org/wallarm-block-page` | [Blocking page and error code](../admin-en/configuration-guides/configure-block-page-and-code.md) to return to blocked requests. |
| `nginx.org/wallarm-unpack-response` | Whether to decompress compressed data returned in the application response: `on` (default) or `off`. |
| `nginx.org/wallarm-parse-response` | Whether to analyze the application responses for attacks: `on` (default) or `off`. Response analysis is required for vulnerability detection during [passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection) and [threat replay testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing-trt). |
| `nginx.org/wallarm-parse-websocket` | Wallarm has full WebSockets support. By default, the WebSockets' messages are not analyzed for attacks. To force the feature, activate the API Security [subscription plan](../about-wallarm/subscription-plans.md#core-subscription-plans) and use this annotation: `on` or `off` (default). |
| `nginx.org/wallarm-parser-disable` | Allows to disable [parsers](../user-guides/rules/request-processing.md). The directive values correspond to the name of the parser to be disabled, e.g. `json`. Multiple parsers can be specified, dividing by semicolon, e.g. `json;base64`. |
| `nginx.org/wallarm-partner-client-uuid` | Partner client [UUID](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants) for multi-tenant setups. | 

### Applying annotation to the Ingress resource

These annotations are applied to Kubernetes `Ingress` resources processed by the controller.

To set or update an annotation, use:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<YOUR_INGRESS_NAMESPACE>` is the namespace of your Ingress
* `<ANNOTATION_NAME>` is the name of the annotation from the list above
* `<VALUE>` is the value of the annotation from the list above

### Annotation examples

#### Configuring the blocking page and error code

The annotation `nginx.org/wallarm-block-page` is used to configure the blocking page and error code returned in the response to the request blocked for the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../attacks-vulns-list.md#attack-types), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above is originated from [graylisted IP address](../user-guides/ip-lists/overview.md) and the node filters requests in the safe blocking [mode](configure-wallarm-mode.md).
* Request is originated from the [denylisted IP address](../user-guides/ip-lists/overview.md).

For example, to return the default Wallarm blocking page and the error code 445 in the response to any blocked request:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.org/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[More details on the blocking page and error code configuration methods →](../admin-en/configuration-guides/configure-block-page-and-code.md)

#### Managing libdetection mode

You can control the [**libdetection**](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) mode by passing the `wallarm_enable_libdetection` directive into the generated NGINX configuration:

* (Per‑Ingress annotation) Requires `controller.enableSnippets: true`:

  ```bash
  kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> \
    nginx.org/server-snippets="wallarm_enable_libdetection off;"
  ```

* (Cluster‑wide) Uses the controller `ConfigMap` (via `controller.config.entries`) to apply the setting globally to the Ingress Controller:

  ```bash
  helm upgrade --reuse-values <INGRESS_CONTROLLER_RELEASE_NAME> ./charts/nginx-ingress -n <KUBERNETES_NAMESPACE> \
    --set-string controller.config.entries.server-snippets="wallarm_enable_libdetection off;"
  ```

!!! info "Libdetection values"
    Available values of `wallarm_enable_libdetection` are `on`/`off`.

## Wallarm policy custom resource fefinition (CRD)

The F5-based controller supports [Custom Resource Definitions](https://docs.nginx.com/nginx-ingress-controller/configuration/virtualserver-and-virtualserverroute-resources/) as an alternative to standard Ingress resources for advanced routing (canary deployments, traffic splitting, header-based routing).

When using CRDs, Wallarm settings are configured via the **Policy** resource instead of annotations. Wallarm patches the upstream Policy CRD to add an optional `spec.wallarm` block — an alternative to Wallarm annotations that provides the same set of settings through a dedicated resource. The Policy is then referenced from `VirtualServer` or `VirtualServerRoute` routes.

!!! info "Wallarm-provided CRDs"
    If you plan to use the Wallarm Policy CRD (`spec.wallarm`), apply the **Wallarm-provided CRDs** instead of the upstream F5 CRDs. The Wallarm-provided CRDs include the patched Policy schema with the `wallarm` block.

**Policy fields:**

| Field | Description | Values | Default |
| --- | --- | --- | --- |
| `mode` | Wallarm filtration mode. | `off`, `monitoring`, `safe_blocking`, `block` | — |
| `modeAllowOverride` | Whether Wallarm Cloud settings can override the local mode. | `on`, `off`, `strict` | `on` |
| `fallback` | Behavior when proton.db or custom ruleset cannot be loaded. | `on`, `off` | `on` |
| `application` | Application ID used to separate traffic in Wallarm Cloud. | Positive integer | — |
| `blockPage` | Custom block page (file path, named location, URL, or variable). | String | — |
| `parseResponse` | Analyze responses from the application. | `on`, `off` | `on` |
| `unpackResponse` | Decompress responses before analysis. | `on`, `off` | `on` |
| `parseWebsocket` | Analyze WebSocket messages. | `on`, `off` | `off` |
| `parserDisable` | Parsers to disable. | List: `cookie`, `zlib`, `htmljs`, `json`, `multipart`, `base64`, `percent`, `urlenc`, `xml`, `jwt` | — |
| `partnerClientUUID` | Partner client UUID for multi-tenant setups. | UUID | — |

**Example — two policies with different modes referenced by routes:**

```yaml
apiVersion: k8s.nginx.org/v1
kind: Policy
metadata:
  name: wallarm-block
spec:
  wallarm:
    mode: block
    application: 42
    fallback: "on"
---
apiVersion: k8s.nginx.org/v1
kind: Policy
metadata:
  name: wallarm-monitoring
spec:
  wallarm:
    mode: monitoring
---
apiVersion: k8s.nginx.org/v1
kind: VirtualServer
metadata:
  name: my-app
spec:
  host: my-app.example.com
  upstreams:
    - name: backend
      service: backend-svc
      port: 80
  routes:
    - path: /api
      policies:
        - name: wallarm-block
      action:
        pass: backend
    - path: /internal
      policies:
        - name: wallarm-monitoring
      action:
        pass: backend
```

In this example, `/api` traffic is processed in `block` mode while `/internal` traffic is in `monitoring` mode — each route references a different Wallarm Policy.