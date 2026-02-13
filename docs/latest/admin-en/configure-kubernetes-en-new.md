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

This page describes the **Helm chart configuration options** for the Wallarm Ingress Controller based on [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress).

!!! info "Official documentation for F5 NGINX Ingress Controller"
    The fine‑tuning of the Wallarm Ingress Controller is similar to that of the F5 NGINX Ingress Controller described in the [official documentation](https://docs.nginx.com/nginx-ingress-controller/). When working with Wallarm, all options for setting up the original F5 NGINX Ingress Controller are available.

## Wallarm-specific configuration in values.yaml

The settings are defined in the `values.yaml` file. By default, the file looks as follows:

<details>
<summary>Show YAML configuration</summary>

```yaml
# Wallarm WAF configuration
config:
  wallarm:
    ## Enable the Wallarm WAF module in the Ingress Controller.
    ## Requires a Wallarm-enabled NGINX image with the wallarm module installed.
    enabled: false

    ## Wallarm API configuration for cloud communication
    api:
      host: "api.wallarm.com"
      port: 443
      ssl: true
      token: ""
      ## The name of Node group, required if API token is used to register the Node
      ## https://docs.wallarm.com/user-guides/nodes/nodes/#api-and-node-tokens-for-node-creation
      ##
      nodeGroup: "defaultIngressGroup"
      ## Existing secret feature allows to pull Wallarm API token from existing Kubernetes secret
      ## https://docs.wallarm.com/admin-en/configure-kubernetes-en/#controllerwallarmexistingsecret
      ##
      existingSecret:
        enabled: false
        ## Name of the existing secret containing the token
        # secretName: "wallarm-api-token"
        ## Key in the secret that contains the token
        # secretKey: "token"
    ## Enable fallback mode when Wallarm proton.db or LOM cannot be downloaded
    fallback: "on"

  ## Wallarm CLI postanalytics configuration (runs in postanalytics pod)
  wcliPostanalytics:
    ## Log level for wcli
    logLevel: "WARN"
    ## Per-job log levels
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

  ## Wallarm CLI controller configuration (runs in controller pod)
  wcliController:
    ## Log level for wcli
    logLevel: "WARN"
    ## Per-job log levels
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

  ## API Firewall configuration (runs in controller pod)
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



# Controller component detailed configuration
controller:
  ## The name of the Ingress Controller daemonset or deployment.
  name: controller

  ## The kind of the Ingress Controller installation - deployment or daemonset.
  kind: deployment

  ## The selectorLabels used to override the default values.
  selectorLabels: {}

  ## Annotations for deployments and daemonsets
  annotations: {}

  # Wallarm containers inside of controller pod
  wallarm:
    ## Wallarm metrics endpoint configuration
    metrics:
      ## Enable Wallarm metrics
      enabled: false
      ## Port for Wallarm metrics (separate from NGINX metrics)
      port: 18080
      ## Port name for metrics endpoint
      portName: wallarm-metrics
      ## Path at which the metrics endpoint is exposed
      endpointPath: "/wallarm-metrics"
      service:
        annotations: {}
        # prometheus.io/scrape: "true"
        # prometheus.io/port: "18080"
        labels: {}
        # clusterIP: ""
        externalIPs: []
        # loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
        # externalTrafficPolicy: ""
        # nodePort: ""
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

    ## Init container for node registration
    initContainer:
      ## Resource requests and limits
      resources: {}
      ## Security context for the init container
      securityContext: {}
      ## Additional environment variables
      extraEnvs: []

    ## Wallarm CLI controller configuration (runs in controller pod)
    wcli:
      ## Resource requests and limits
      resources: {}
      ## Security context for the wcli container
      securityContext: {}
      ## Metrics configuration
      metrics:
        ## Enable metrics collection
        enabled: true
        ## Port for metrics endpoint
        port: 9004
        ## Port name for metrics endpoint
        portName: wcli-ctrl-mtrc
        ## Path at which the metrics endpoint is exposed
        endpointPath: ""
        ## IP address and/or port for the metrics endpoint
        host: ":9004"
        service:
          annotations: {}
          # prometheus.io/scrape: "true"
          # prometheus.io/port: "9004"
          labels: {}
          # clusterIP: ""
          externalIPs: []
          # loadBalancerIP: ""
          loadBalancerSourceRanges: []
          servicePort: 9004
          type: ClusterIP
          # externalTrafficPolicy: ""
          # nodePort: ""
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
      ## Additional environment variables
      extraEnvs: []

    ## Additional volumes for Wallarm
    extraVolumes: []

    ## Additional volume mounts for Wallarm
    extraVolumeMounts: []

  ## Enables the Ingress Controller pods to use the host's network namespace.
  hostNetwork: false

  ## The hostPort configuration for the Ingress Controller pods.
  hostPort:
    ## Enables hostPort for the Ingress Controller pods.
    enable: false

    ## The HTTP hostPort configuration for the Ingress Controller pods.
    http: 80

    ## The HTTPS hostPort configuration for the Ingress Controller pods.
    https: 443

  containerPort:
    ## The HTTP containerPort configuration for the Ingress Controller pods.
    http: 80

    ## The HTTPS containerPort configuration for the Ingress Controller pods.
    https: 443

  ## DNS policy for the Ingress Controller pods
  dnsPolicy: ClusterFirst

  ## Enables debugging for NGINX. Uses the nginx-debug binary. Requires error-log-level: debug in the ConfigMap via `controller.config.entries`.
  nginxDebug: false

  ## Share process namespace between containers in the Ingress Controller pod.
  shareProcessNamespace: false

  ## The log level of the Ingress Controller. Options include: trace, debug, info, warning, error, fatal
  logLevel: info

  ## Sets the log format of Ingress Controller. Options include: glog, json, text
  logFormat: glog

  ## Enables auto adjusting some of the NGINX directives to help with safe configuration and prevent NGINX misconfigurations.
  ## See https://docs.nginx.com/nginx-ingress-controller/configuration/proxy-buffers-configuration/  for more details of which configuration options are affected
  directiveAutoAdjust: false

  ## A list of custom ports to expose on the NGINX Ingress Controller pod. Follows the conventional Kubernetes yaml syntax for container ports.
  customPorts: []

  ## The lifecycle of the Ingress Controller pods.
  lifecycle: {}

  ## The custom ConfigMap to use instead of the one provided by default
  customConfigMap: ""

  config:
    ## The name of the ConfigMap used by the Ingress Controller.
    ## Autogenerated if not set or set to "".
    # name: nginx-config

    ## The annotations of the Ingress Controller configmap.
    annotations: {}

    ## The entries of the ConfigMap for customizing NGINX configuration.
    entries: {}

  ## It is recommended to use your own TLS certificates and keys
  defaultTLS:
    ## The base64-encoded TLS certificate for the default HTTPS server.
    ## Note: It is recommended that you specify your own certificate. Alternatively, omitting the default server secret completely will configure NGINX to reject TLS connections to the default server.
    cert: ""

    ## The base64-encoded TLS key for the default HTTPS server.
    ## Note: It is recommended that you specify your own key. Alternatively, omitting the default server secret completely will configure NGINX to reject TLS connections to the default server.
    key: ""

    ## The secret with a TLS certificate and key for the default HTTPS server.
    ## The value must follow the following format: `<namespace>/<name>`.
    ## Used as an alternative to specifying a certificate and key using `controller.defaultTLS.cert` and `controller.defaultTLS.key` parameters.
    ## Note: Alternatively, omitting the default server secret completely will configure NGINX to reject TLS connections to the default server.
    ## Format: <namespace>/<secret_name>
    secret: ""

  wildcardTLS:
    ## The base64-encoded TLS certificate for every Ingress/VirtualServer host that has TLS enabled but no secret specified.
    ## If the parameter is not set, for such Ingress/VirtualServer hosts NGINX will break any attempt to establish a TLS connection.
    cert: ""

    ## The base64-encoded TLS key for every Ingress/VirtualServer host that has TLS enabled but no secret specified.
    ## If the parameter is not set, for such Ingress/VirtualServer hosts NGINX will break any attempt to establish a TLS connection.
    key: ""

    ## The secret with a TLS certificate and key for every Ingress/VirtualServer host that has TLS enabled but no secret specified.
    ## The value must follow the following format: `<namespace>/<name>`.
    ## Used as an alternative to specifying a certificate and key using `controller.wildcardTLS.cert` and `controller.wildcardTLS.key` parameters.
    ## Format: <namespace>/<secret_name>
    secret: ""

  ## The node selector for pod assignment for the Ingress Controller pods.
  # nodeSelector: {}

  ## The termination grace period of the Ingress Controller pod.
  terminationGracePeriodSeconds: 30

  ## HorizontalPodAutoscaling (HPA)
  autoscaling:
    ## Enables HorizontalPodAutoscaling.
    enabled: false
    ## Create the HorizontalPodAutoscaler resource.  This can be set to false to manage the HPA externally.
    create: true
    ## The annotations of the Ingress Controller HorizontalPodAutoscaler.
    annotations: {}
    ## Minimum number of replicas for the HPA.
    minReplicas: 1
    ## Maximum number of replicas for the HPA.
    maxReplicas: 3
    ## The target cpu utilization percentage.
    targetCPUUtilizationPercentage: 50
    ## The target memory utilization percentage.
    targetMemoryUtilizationPercentage: 50
    ## Custom behavior policies
    behavior: {}

  ## The resources of the Ingress Controller pods.
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
  # limits:
  #   cpu: 1
  #   memory: 1Gi

  ## The security context for the Ingress Controller pods.
  podSecurityContext:
    seccompProfile:
      type: RuntimeDefault

  ## The security context for the Ingress Controller containers.
  securityContext:
    {} # Remove curly brackets before adding values
    # allowPrivilegeEscalation: true
    # readOnlyRootFilesystem: true
    # runAsUser: 101 #nginx
    # runAsNonRoot: true
    # capabilities:
    #   drop:
    #   - ALL
    #   add:
    #   - NET_BIND_SERVICE

  ## The security context for the Ingress Controller init container which is used when readOnlyRootFilesystem is set to true.
  initContainerSecurityContext: {}

  ## The resources for the Ingress Controller init container which is used when readOnlyRootFilesystem is set to true.
  initContainerResources:
    requests:
      cpu: 100m
      memory: 128Mi
    # limits:
    #   cpu: 1
    #   memory: 1Gi

  ## The tolerations of the Ingress Controller pods.
  tolerations: []

  ## The affinity of the Ingress Controller pods.
  affinity: {}

  ## The topology spread constraints of the Ingress controller pods.
  # topologySpreadConstraints: {}

  ## The additional environment variables to be set on the Ingress Controller pods.
  env: []
  # - name: MY_VAR
  #   value: myvalue

  ## The volumes of the Ingress Controller pods.
  volumes: []
  # - name: extra-conf
  #   configMap:
  #     name: extra-conf

  ## The volumeMounts of the Ingress Controller pods.
  volumeMounts: []
  # - name: extra-conf
  #   mountPath: /etc/nginx/conf.d/extra.conf
  #   subPath: extra.conf

  ## InitContainers for the Ingress Controller pods.
  initContainers: []
  # - name: init-container
  #   image: busybox:1.34
  #   command: ['sh', '-c', 'echo this is initial setup!']

  ## The minimum number of seconds for which a newly created Pod should be ready without any of its containers crashing, for it to be considered available.
  minReadySeconds: 0

  ## Pod disruption budget for the Ingress Controller pods.
  podDisruptionBudget:
    ## Enables PodDisruptionBudget.
    enabled: false
    ## The annotations of the Ingress Controller pod disruption budget.
    annotations: {}
    ## The number of Ingress Controller pods that should be available. This is a mutually exclusive setting with "maxUnavailable".
    # minAvailable: 1
    ## The number of Ingress Controller pods that can be unavailable. This is a mutually exclusive setting with "minAvailable".
    # maxUnavailable: 1

  ## Network policy for the Ingress Controller pods.
  ## Restricts network access to/from the controller pods for enhanced security.
  networkPolicy:
    ## Enables NetworkPolicy for the controller.
    enabled: false
    ## Annotations for the NetworkPolicy resource.
    annotations: {}
    ## Custom source selectors to allow ingress traffic from.
    ## If not specified, allows HTTP/HTTPS from anywhere.
    # allowIngressFrom:
    #   - namespaceSelector:
    #       matchLabels:
    #         kubernetes.io/metadata.name: my-namespace
    ## Custom source selectors to allow metrics scraping from.
    ## If not specified, allows from the release namespace.
    # allowMetricsFrom:
    #   - namespaceSelector:
    #       matchLabels:
    #         name: monitoring
    ## Custom destination selectors to allow egress traffic to.
    ## If not specified, allows to any pod in the cluster.
    # allowEgressTo:
    #   - namespaceSelector: {}
    ## Additional custom ingress rules.
    # ingressRules: []
    ## Additional custom egress rules.
    # egressRules: []

    ## Strategy used to replace old Pods by new ones. .spec.strategy.type can be "Recreate" or "RollingUpdate" for Deployments, and "OnDelete" or "RollingUpdate" for Daemonsets. "RollingUpdate" is the default value.
  strategy: {}

  ## Extra containers for the Ingress Controller pods.
  extraContainers: []
  # - name: container
  #   image: busybox:1.34
  #   command: ['sh', '-c', 'echo this is a sidecar!']

  ## The number of replicas of the Ingress Controller deployment.
  replicaCount: 1

  ## Configures the ingress class the Ingress Controller uses.
  ingressClass:
    ## A class of the Ingress Controller.

    ## IngressClass resource with the name equal to the class must be deployed. Otherwise,
    ## the Ingress Controller will fail to start.
    ## The Ingress Controller only processes resources that belong to its class - i.e. have the "ingressClassName" field resource equal to the class.

    ## The Ingress Controller processes all the resources that do not have the "ingressClassName" field for all versions of kubernetes.
    name: nginx

    ## Creates a new IngressClass object with the name "controller.ingressClass.name". To use an existing IngressClass with the same name, set this value to false. If you use helm upgrade, do not change the values from the previous release as helm will delete IngressClass objects managed by helm. If you are upgrading from a release earlier than 3.3.0, do not set the value to false.
    create: true

    ## New Ingresses without an ingressClassName field specified will be assigned the class specified in `controller.ingressClass`. Requires "controller.ingressClass.create".
    setAsDefaultIngress: false

  ## Comma separated list of namespaces to watch for Ingress resources. By default, the Ingress Controller watches all namespaces. Mutually exclusive with "controller.watchNamespaceLabel".
  watchNamespace: ""

  ## Configures the Ingress Controller to watch only those namespaces with label foo=bar. By default, the Ingress Controller watches all namespaces. Mutually exclusive with "controller.watchNamespace".
  watchNamespaceLabel: ""

  ## Comma separated list of namespaces to watch for Secret resources. By default, the Ingress Controller watches all namespaces.
  watchSecretNamespace: ""

  ## Enable the custom resources.
  enableCustomResources: true

  ## Enable TLS Passthrough on port 443. Requires controller.enableCustomResources.
  enableTLSPassthrough: false

  ## Set the port for TLS Passthrough. Requires controller.enableCustomResources and controller.enableTLSPassthrough.
  tlsPassthroughPort: 443

  ## Enable cert manager for Virtual Server resources. Requires controller.enableCustomResources.
  enableCertManager: false

  ## Enable external DNS for Virtual Server resources. Requires controller.enableCustomResources.
  enableExternalDNS: false

  globalConfiguration:
    ## Creates the GlobalConfiguration custom resource. Requires controller.enableCustomResources.
    create: false

    ## customName: "the-namespace/the-name-of-the-global-configuration-custom-resource"
    ## The name of the GlobalConfiguration custom resource to use instead of the one provided by default.
    ## Make sure the namespace is watched when watchNamespace or watchNamespaceLabel parameters are in use.
    customName: ""

    ## The spec of the GlobalConfiguration for defining the global configuration parameters of the Ingress Controller.
    spec: {} ## Ensure both curly brackets are removed when adding listeners in YAML format.
    # listeners:
    # - name: dns-udp
    #   port: 5353
    #   protocol: UDP
    # - name: dns-tcp
    #   port: 5353
    #   protocol: TCP

  ## Enable custom NGINX configuration snippets in Ingress, VirtualServer, VirtualServerRoute and TransportServer resources.
  enableSnippets: false

  ## Add a location based on the value of health-status-uri to the default server. The location responds with the 200 status code for any request.
  ## Useful for external health-checking of the Ingress Controller.
  healthStatus: false

  ## Sets the URI of health status location in the default server. Requires controller.healthStatus.
  healthStatusURI: "/nginx-health"

  nginxStatus:
    ## Enable the NGINX stub_status, or the NGINX Plus API.
    enable: true

    ## Set the port where the NGINX stub_status or the NGINX Plus API is exposed.
    port: 10246

    ## Add IPv4 IP/CIDR blocks to the allow list for NGINX stub_status or the NGINX Plus API. Separate multiple IP/CIDR by commas.
    allowCidrs: "127.0.0.1"

  service:
    ## Creates a service to expose the Ingress Controller pods.
    create: true

    ## The type of service to create for the Ingress Controller.
    type: LoadBalancer

    ## The externalTrafficPolicy of the service. The value Local preserves the client source IP.
    externalTrafficPolicy: Local

    ## The annotations of the Ingress Controller service.
    annotations: {}

    ## The extra labels of the service.
    extraLabels: {}

    ## The static IP address for the load balancer. Requires controller.service.type set to LoadBalancer. The cloud provider must support this feature.
    loadBalancerIP: ""

    ## The ClusterIP for the Ingress Controller service, autoassigned if not specified.
    clusterIP: ""

    ## The list of external IPs for the Ingress Controller service.
    externalIPs: []

    ## The IP ranges (CIDR) that are allowed to access the load balancer. Requires controller.service.type set to LoadBalancer. The cloud provider must support this feature.
    loadBalancerSourceRanges: []

    ## Whether to automatically allocate NodePorts (only for LoadBalancers).
    # allocateLoadBalancerNodePorts: false

    ## Dual stack preference.
    ## Valid values: SingleStack, PreferDualStack, RequireDualStack
    # ipFamilyPolicy: SingleStack

    ## List of IP families assigned to this service.
    ## Valid values: IPv4, IPv6
    # ipFamilies:
    #   - IPv6

    httpPort:
      ## Enables the HTTP port for the Ingress Controller service.
      enable: true

      ## The HTTP port of the Ingress Controller service.
      port: 80

      ## The custom NodePort for the HTTP port. Requires controller.service.type set to NodePort or LoadBalancer.
      # nodePort: 80

      ## The HTTP port on the POD where the Ingress Controller service is running.
      targetPort: 80

      ## The name of the HTTP port.
      name: "http"

    httpsPort:
      ## Enables the HTTPS port for the Ingress Controller service.
      enable: true

      ## The HTTPS port of the Ingress Controller service.
      port: 443

      ## The custom NodePort for the HTTPS port. Requires controller.service.type set to NodePort or LoadBalancer.
      # nodePort: 443

      ## The HTTPS port on the POD where the Ingress Controller service is running.
      targetPort: 443

      ## The name of the HTTPS port.
      name: "https"

    ## A list of custom ports to expose through the Ingress Controller service. Follows the conventional Kubernetes yaml syntax for service ports.
    customPorts: []

    ## Session affinity configuration for the Ingress Controller service, ensures requests from the same client IP go to the same pod
    sessionAffinity:
      ## Enable session affinity. Valid values: None, ClientIP
      enable: false
      ## Session affinity type. Currently only ClientIP is supported.
      type: ClientIP
      ## Session affinity timeout in seconds (default: 3600 = 1 hour)
      timeoutSeconds: 3600

  serviceAccount:
    ## The annotations of the service account of the Ingress Controller pods.
    annotations: {}

    ## The name of the service account of the Ingress Controller pods. Used for RBAC.
    ## Autogenerated if not set or set to "".
    # name: nginx-ingress

    ## The name of the secret containing docker registry credentials.
    ## Secret must exist in the same namespace as the helm release.
    imagePullSecretName: ""

    ## A list of secret names containing docker registry credentials.
    ## Secrets must exist in the same namespace as the helm release.
    imagePullSecretsNames: []

  reportIngressStatus:
    ## Updates the address field in the status of Ingress resources with an external address of the Ingress Controller.
    ## You must also specify the source of the external address either through an external service via controller.reportIngressStatus.externalService,
    ## controller.reportIngressStatus.ingressLink or the external-status-address entry in the ConfigMap via controller.config.entries.
    ## Note: controller.config.entries.external-status-address takes precedence over the others.
    enable: true

    ## Specifies the name of the service with the type LoadBalancer through which the Ingress Controller is exposed externally.
    ## The external address of the service is used when reporting the status of Ingress, VirtualServer and VirtualServerRoute resources.
    ## controller.reportIngressStatus.enable must be set to true.
    ## The default is autogenerated and matches the created service (see controller.service.create).
    # externalService: nginx-ingress

    ## Specifies the name of the IngressLink resource, which exposes the Ingress Controller pods via a BIG-IP system.
    ## The IP of the BIG-IP system is used when reporting the status of Ingress, VirtualServer and VirtualServerRoute resources.
    ## controller.reportIngressStatus.enable must be set to true.
    ingressLink: ""

    ## Enable Leader election to avoid multiple replicas of the controller reporting the status of Ingress resources. controller.reportIngressStatus.enable must be set to true.
    enableLeaderElection: true

    ## Specifies the name to be used as the lock for leader election. controller.reportIngressStatus.enableLeaderElection must be set to true.
    ## The default is autogenerated.
    leaderElectionLockName: ""

    ## The annotations of the leader election Lease.
    annotations: {}

  pod:
    ## The annotations of the Ingress Controller pod.
    annotations: {}

    ## The additional extra labels of the Ingress Controller pod.
    extraLabels: {}

  ## The PriorityClass of the Ingress Controller pods.
  # priorityClassName: ""

  readyStatus:
    ## Enables readiness endpoint "/nginx-ready". The endpoint returns a success code when NGINX has loaded all the config after startup.
    enable: true

    ## Set the port where the readiness endpoint is exposed.
    port: 8081

    ## The number of seconds after the Ingress Controller pod has started before readiness probes are initiated.
    initialDelaySeconds: 0

  startupStatus:

    ## Enable the startup probe.
    enable: false

    # ## Set the port where the startup endpoint is exposed. This is a required value if startupStatus.enable is true.
    # port: 9999

    # ## path to the startup endpoint. This is a required value if startupStatus.enable is true.
    # path: /

    # ## The number of seconds after the Ingress Controller pod has started before startup probes are initiated.
    # initialDelaySeconds: 5

    # ## The number of seconds between each startup probe.
    # periodSeconds: 1

    # ## The number of seconds after which the startup probe times out.
    # timeoutSeconds: 1

    # ## The number of seconds after which the startup probe is considered successful.
    # successThreshold: 1

    # ## The number of seconds after which the startup probe is considered failed.
    # failureThreshold: 30

  ## Enable collection of latency metrics for upstreams. Requires prometheus.create.
  enableLatencyMetrics: false

  ## Disable IPV6 listeners explicitly for nodes that do not support the IPV6 stack.
  disableIPV6: false

  ## Sets the port for the HTTP `default_server` listener.
  defaultHTTPListenerPort: 80

  ## Sets the port for the HTTPS `default_server` listener.
  defaultHTTPSListenerPort: 443

  ## Configure root filesystem as read-only and add volumes for temporary data.
  ## Three major releases after 3.5.x this argument will be moved to the `securityContext` section.
  ## This value will not be used if `controller.securityContext` is set
  readOnlyRootFilesystem: false

  ## Enable dynamic reloading of certificates
  enableSSLDynamicReload: true

# Postanalytics (wstore) component detailed configuration
postanalytics:
  ## Deployment kind: Deployment or DaemonSet
  kind: "Deployment"
  ## Number of replicas (only for Deployment kind)
  replicaCount: 1
  ## List of image pull secrets for postanalytics images.
  ## Secrets must already exist in the same namespace as the helm release.
  ## Example:
  ##   imagePullSecrets:
  ##     - name: my-registry-secret
  ##     - name: another-secret
  imagePullSecrets: []
  ## Memory arena size in GB
  arena: "2.0"
  ## Service address for wstore
  serviceAddress: "0.0.0.0:3313"
  ## Protocol for wstore service (tcp, tcp4, tcp6)
  serviceProtocol: "tcp4"
  ## Resource requests and limits
  resources: {}
    # limits:
    #   cpu: 500m
    #   memory: 512Mi
    # requests:
    #   cpu: 100m
    #   memory: 128Mi
  ## Liveness probe configuration
  livenessProbe:
    failureThreshold: 3
    initialDelaySeconds: 5
    periodSeconds: 10
    successThreshold: 1
    timeoutSeconds: 1
  ## Readiness probe configuration
  readinessProbe:
    failureThreshold: 3
    initialDelaySeconds: 5
    periodSeconds: 10
    successThreshold: 1
    timeoutSeconds: 1
  ## Additional environment variables
  extraEnvs: []
  ## Additional volumes
  extraVolumes: []
  ## Additional volume mounts
  extraVolumeMounts: []
  ## Service configuration
  service:
    ## Additional annotations for the service
    annotations: {}
    ## Additional labels for the service
    labels: {}
  ## Pod annotations
  podAnnotations: {}
  ## Pod labels
  podLabels: {}
  ## Node selector
  nodeSelector: {}
  ## Tolerations
  tolerations: []
  ## Affinity
  affinity: {}
  ## Topology spread constraints
  topologySpreadConstraints: []
  ## Annotations for the deployment/daemonset
  annotations: {}
  ## Network policy for the postanalytics pods.
  ## Restricts network access to the postanalytics pods for enhanced security.
  networkPolicy:
    ## Enables NetworkPolicy for postanalytics.
    enabled: false
    ## Annotations for the NetworkPolicy resource.
    annotations: {}
    ## Custom source selectors to allow health check traffic from.
    ## If not specified, health checks are only allowed from localhost.
    # allowHealthCheckFrom:
    #   - podSelector: {}
    ## Custom source selectors to allow metrics scraping from.
    ## If not specified, allows from the release namespace.
    # allowMetricsFrom:
    #   - namespaceSelector:
    #       matchLabels:
    #         name: monitoring
    ## Additional custom ingress rules.
    # ingressRules: []
    ## Custom egress rules. If specified, egress policy type is enabled.
    # egressRules:
    #   - to:
    #       - ipBlock:
    #           cidr: 0.0.0.0/0
    #     ports:
    #       - protocol: TCP
    #         port: 443
  ## Pod disruption budget for the postanalytics pods.
  podDisruptionBudget:
    ## Enables PodDisruptionBudget.
    enabled: false
    ## The annotations of the postanalytics pod disruption budget.
    annotations: {}
    ## The number of postanalytics pods that should be available. This is a mutually exclusive setting with "maxUnavailable".
    # minAvailable: 1
    ## The number of postanalytics pods that can be unavailable. This is a mutually exclusive setting with "minAvailable".
    # maxUnavailable: 1
  ## Termination grace period
  terminationGracePeriodSeconds: 30
  tls:
    enabled: false
  #   certFile: "/root/test-tls-certs/server.crt"
  #   keyFile: "/root/test-tls-certs/server.key"
  #   caCertFile: "/root/test-tls-certs/ca.crt"
  #   mutualTLS:
  #     enabled: false
  #     clientCACertFile: "/root/test-tls-certs/ca.crt"
  # -- Additional environment variables to set
  metrics:
    listenAddress: "127.0.0.1:9001"
    protocol: "tcp4"

  ## Init container for node registration
  initContainer:
    ## Resource requests and limits
    resources: {}
    ## Security context for the init container
    securityContext: {}
    ## Additional environment variables
    extraEnvs: []

  ## Wallarm CLI configuration (runs in postanalytics pod)
  wcli:
    ## Resource requests and limits
    resources: {}
    ## Security context for the wcli container
    securityContext: {}
    ## Metrics configuration
    metrics:
      ## Enable metrics collection
      enabled: true
      ## Port for metrics endpoint
      port: 9003
      ## Port name for metrics endpoint
      portName: wcli-post-mtrc
      ## Path at which the metrics endpoint is exposed
      endpointPath: ""
      ## IP address and/or port for the metrics endpoint
      host: ":9003"
      service:
        annotations: {}
        # prometheus.io/scrape: "true"
        # prometheus.io/port: "9003"
        labels: {}
        # clusterIP: ""
        externalIPs: []
        # loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 9003
        type: ClusterIP
        # externalTrafficPolicy: ""
        # nodePort: ""
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
    ## Additional environment variables
    extraEnvs: []

  ## Wallarm appstructure configuration (runs in postanalytics pod)
  appstructure:
    ## Resource requests and limits
    resources: {}
    ## Security context for the appstructure container
    securityContext: {}
    ## Additional environment variables
    extraEnvs: []

  clusterrole:
    ## Create ClusterRole
    create: true

prometheus:
  ## Expose NGINX or NGINX Plus metrics in the Prometheus format.
  create: true

  ## Configures the port to scrape the metrics.
  port: 9113

  ## Specifies the namespace/name of a Kubernetes TLS Secret which will be used to protect the Prometheus endpoint.
  secret: ""

  ## Configures the HTTP scheme used.
  scheme: http

  service:
    ## Creates a ClusterIP Service to expose Prometheus metrics internally
    ## Requires prometheus.create=true
    create: false

    labels:
      service: "nginx-ingress-prometheus-service"

  serviceMonitor:
    ## Creates a serviceMonitor to expose statistics on the kubernetes pods.
    create: false

    ## Kubernetes object labels to attach to the serviceMonitor object.
    labels: {}

    ## A set of labels to allow the selection of endpoints for the ServiceMonitor.
    selectorMatchLabels:
      service: "nginx-ingress-prometheus-service"

    ## A list of endpoints allowed as part of this ServiceMonitor.
    ## Matches on the name of a Service port.
    endpoints:
      - port: prometheus

prometheusExtended:
  ## Enable extended Prometheus metrics via VTS module / Experimental
  enabled: false
  ## Port for extended metrics
  port: 10113
  ## Port name for metrics endpoint
  portName: prom-ext
  ## Path at which the metrics endpoint is exposed
  endpointPath: "/vts-status"
  ## Detailed status codes to measure (e.g. "all", or "200 301 302 400 403 404 500 502 503")
  # detailedCodes: ""
  service:
    ## Creates a ClusterIP Service to expose extended Prometheus metrics
    create: false
    annotations: {}
    labels: {}
    externalIPs: []
    loadBalancerSourceRanges: []
    servicePort: 10113
    type: ClusterIP
  serviceMonitor:
    ## Creates a ServiceMonitor for extended Prometheus metrics
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

## Wallarm configuration parameters

### config.wallarm.enabled

Enables or disables the Wallarm WAF module in the Ingress Controller.

!!! info "NGINX Ingress Controller requirement"
    Requires a Wallarm-enabled NGINX controller image with the Wallarm module installed.

**Default value**: `false`

### config.wallarm.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/overview.md#cloud).
* `api.wallarm.com` for the [EU cloud](../about-wallarm/overview.md#cloud),

**Default value**: `api.wallarm.com`

### config.wallarm.api.port

Wallarm API endpoint port.

**Default value**: `443`

### `config.wallarm.api.ssl`

Enables TLS when communicating with the Wallarm API.

**Default value**: `true`

### `config.wallarm.api.token`

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

### config.wallarm.api.nodeGroup

The name of the node group to which the newly deployed Node will be added.

This parameter is required when the Node is registered using an [API token][node-token-types] with the **Node deployment / Deployment** usage type (provided via the [`config.wallarm.api.token`](#configwallarmapitoken) parameter), which is the only token type that supports node grouping.

**Default value**: `defaultIngressGroup`

### config.wallarm.api.existingSecret.enabled

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

### config.wallarm.fallback

Controls [fallback behavior][fallback] when Wallarm data (for example, [`proton.db][proton-db] or a [custom rule set][lom]) cannot be downloaded.

**Default value**: `"on"`

## Wallarm wcli parameters

### config.wcliPostanalytics.logLevel

Log level for the [**wcli** Controller][wcli] Postanalytics module, which runs in the **postanalytics** pod.

Possible values: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

**Default value**: `"WARN"`

### config.wcliPostanalytics.commands*

Per-command log level configuration for the [**wcli** Controller][wcli] Postanalytics module, which runs in the **postanalytics** pod.

You can set log levels individually for each command: `blkexp`, `botexp`, `cntexp`, `cntsync`, `credstuff`, `envexp`, `jwtexp`, `mrksync`, `register`, `reqexp`.

Possible values for each command: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

### config.wcliController.logLevel

Log level for the [**wcli** Controller][wcli] Postanalytics module, which runs in the **controller** pod.

Possible values: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

**Default value**: `"WARN"`

### config.wcliController.commands*

Per-command log level configuration for the [**wcli** Controller][wcli], which runs in the **controller** pod.

You can set log levels individually for each command: `apispec`, `envexp`, `ipfeed`, `iplist`, `metricsexp`, `register`, `syncnode`

Possible values for each command: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

## API Specification Enforcement parameters

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

## Wallarm container metrics parameters

### controller.wallarm.metrics.enabled

This switch [toggles](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required.

**Default value**: `false`

### controller.wallarm.metrics.port

Port on which the Wallarm metrics endpoint listens. This is separate from NGINX metrics.

**Default value**: `18080`

### controller.wallarm.metrics.portName

The name assigned to the metrics endpoint port.

**Default value**: `"wallarm-metrics"`

### controller.wallarm.metrics.endpointPath

HTTP path at which the Wallarm metrics endpoint is exposed.

**Default value**: `"/wallarm-metrics"`

### controller.wallarm.metrics.service.annotations

Annotations to attach to the metrics service.

**Default value**: `{}`

### controller.wallarm.metrics.service.labels

Custom labels to attach to the metrics service.

**Default value**: `{}`

### controller.wallarm.metrics.service.externalIPs

List of external IP addresses that can access the metrics service.

**Default value**: `[]`

### controller.wallarm.metrics.service.loadBalancerSourceRanges

List of CIDRs allowed to access the metrics service when using a load balancer.

**Default value**: `[]`

### controller.wallarm.metrics.service.servicePort

Port exposed by the metrics service.

**Default value**: `18080`

### controller.wallarm.metrics.service.type

Type of Kubernetes service for the metrics endpoint. 

Possible values: `ClusterIP`, `NodePort`, `LoadBalancer`.

**Default value**: `ClusterIP`

### controller.wallarm.metrics.serviceMonitor*

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

## Wallarm CLI in the controller pod

### controller.wallarm.wcli.resources

Kubernetes resource requests and limits for the Wallarm CLI controller container running in the `controller` pod.

**Default value**: `{}`

### controller.wallarm.wcli.securityContext

Kubernetes security context for the Wallarm CLI controller container.

**Default value**: `{}`

### controller.wallarm.wcli.metrics.enabled

Enables or disables metrics collection for the Wallarm CLI controller.

**Default value**:` true`

### controller.wallarm.wcli.metrics.port

Port on which the Wallarm CLI controller metrics endpoint listens.

**Default value**: `9004`

### controller.wallarm.wcli.metrics.portName

Name assigned to the metrics endpoint port.

**Default value**: `"wcli-ctrl-mtrc"`

### controller.wallarm.wcli.metrics.endpointPath

HTTP path at which the metrics endpoint is exposed.

If empty, the default path defined by the Wallarm CLI controller is used.

**Default value**: `""`

### controller.wallarm.wcli.metrics.host

IP address and/or port on which the metrics endpoint binds.

**Default value**: `":9004"`

### controller.wallarm.wcli.metrics.service.annotations

Annotations to attach to the metrics service.

**Default value**: `{}`

### controller.wallarm.wcli.metrics.service.labels

Custom labels to attach to the metrics service.

**Default value**: `{}`

### controller.wallarm.wcli.metrics.service.externalIPs

List of external IP addresses that can access the metrics service.

**Default value**: `[]`

### controller.wallarm.wcli.metrics.service.loadBalancerSourceRanges

List of CIDR ranges allowed to access the metrics service when using a load balancer.

**Default value**: `[]`

### controller.wallarm.wcli.metrics.service.servicePort

Port exposed by the metrics service.

**Default value**: `9004`

### controller.wallarm.wcli.metrics.service.type

Type of Kubernetes service for the metrics endpoint. 

Possible values: `ClusterIP`, `NodePort`, `LoadBalancer`.

**Default value**: `ClusterIP`

### controller.wallarm.wcli.metrics.serviceMonitor

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

## API Specification Enforcement metrics parameters

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

### controller.wallarm.apiFirewall.metrics.serviceMonitor*

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

## Postanalytics (wstore)

### postanalytics.kind

Type of Postanalytics (**wstore**) installation.

Possible values: `Deployment` or `DaemonSet`.

**Default value**: `"Deployment"`

### postanalytics.replicaCount

Number of Postanalytics replicas to run.

Applies only when [`postanalytics.kind`](#postanalyticskind) is set to `Deployment`.

**Default value**: `1`

### postanalytics.imagePullSecrets

List of Kubernetes image pull secrets used to pull Postanalytics container images.

The secrets must already exist in the same namespace as the Helm release.

**Default value**: `[]`

### postanalytics.arena

Specifies the amount of memory in GB allocated for postanalytics service. It is recommended to set up a value sufficient to store request data for the last 5-15 minutes.

**Default value**: `"2.0"`

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

### postanalytics.tls*

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

## Other parameters

### controller.wallarm.initContainer.extraEnvs

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

## Global Controller settings 

Implemented via [ConfigMap](https://docs.nginx.com/nginx-ingress-controller/configuration/global-configuration/configmap-resource/).

Besides the standard ones, the following additional parameters are supported. You can set them via the Helm value `controller.config.entries`:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_upstream_connect_attempts)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_upstream_reconnect_interval)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Annotation validation

NGINX Ingress Controller validates annotations by itself. If an Ingress has invalid annotation values, the controller rejects/ignores that Ingress configuration and reports it via Kubernetes Events (for example, a Rejected event). [See "Advanced configuration with Annotations"](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-annotations/).

### controller.enableSnippets

Controls whether custom snippets are allowed in Ingress/VirtualServer resources.

When enabled, it allows using snippet-style annotations such as `nginx.org/server-snippets`/`nginx.org/location-snippets` (and related snippet mechanisms supported by the NGINX Ingress Controller).

**Default value:** `false`

!!! info "Security note"
    Snippet support can widen the attack surface in multi-tenant clusters. Keep it disabled unless you fully trust who can create/update Ingress resources.

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