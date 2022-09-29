# Customizing Kong Ingress Controller with integrated Wallarm services

This article instructs you on the safe and effective customization of the [Kong Ingress Controller with integrated Wallarm services](deployment.md).

## Configuration area

Kong Ingress Controller with integrated Wallarm services is based on the standard Kubernetes components, thus the solution configuration is largely similar to the Kubernetes stack configuration.

You can configure the solution as follows:

* Globally via `values.yaml` - it allows setting up the general deployment configuration, the Kong API Gateway and some basic Wallarm API Security settings. These settings apply to all Ingress resources the solution proxies traffic to.
* Via the Wallarm Console UI - it allows fine-tuning the Wallarm API Security settings.

## Configuration of Kong API Gateway

Configuration of Kong Ingress Controller for Kong API Gateway is set by the [default Helm chart values](https://github.com/wallarm/kong-charts-preview/blob/main/charts/kong/values.yaml). This configuration can be overridden by the `values.yaml` file provided by the user during `helm install` or `helm upgrade`.

To customize the default Helm chart values, learn the [official instructions on the Kong and Ingress Controller configuration](https://github.com/Kong/charts/tree/main/charts/kong#configuration).

## Configuration of the Wallarm API Security layer

You can configure the Wallarm API Security layer of the solution as follows:

* Set basic configuration via `values.yaml`: connection to the Wallarm Cloud, resource allocation, fallbacks.
* Fine-tune traffic analysis via the Wallarm Console UI: traffic filtration mode, notifications about security events, request source management, mask sensitive data, allow certain attack types, etc.

### Basic configuration via `values.yaml`

The default `values.yaml` file provides the following Wallarm API Security configuration:

```yaml
wallarm:
  image:
    tag: "<WALLARM_NODE_IMAGE_TAG>"
  enabled: true
  apiHost: api.wallarm.com
  apiPort: 443
  apiSSL: true
  token: ""
  fallback: "on"
  tarantool:
    kind: Deployment
    service:
      annotations: {}
    replicaCount: 1
    arena: "0.2"
    livenessProbe:
      failureThreshold: 3
      initialDelaySeconds: 10
      periodSeconds: 10
      successThreshold: 1
      timeoutSeconds: 1
    resources: {}
  heartbeat:
    resources: {}
  wallarm-appstructure:
    resources: {}
  wallarm-antibot:
    resources: {}
  metrics:
    port: 18080
    enabled: false

    service:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: /wallarm-metrics
        prometheus.io/port: "18080"

      # clusterIP: ""

      ## -- List of IP addresses at which the stats-exporter service is available
      ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
      ##
      externalIPs: []

      # loadBalancerIP: ""
      loadBalancerSourceRanges: []
      servicePort: 18080
      type: ClusterIP
      # externalTrafficPolicy: ""
      # nodePort: ""
  addnode:
    resources: {}
  cron:
    jobs:
      exportEnvironment:
        schedule: "0 */1 * * *"
        timeout: 10m
      exportAttacks:
        schedule: "* * * * *"
        timeout: 3h
      exportCounters:
        schedule: "* * * * *"
        timeout: 11m
      bruteDetect:
        schedule: "* * * * *"
        timeout: 6m
      syncIpLists:
        schedule: "* * * * *"
        timeout: 3h
      exportMetrics:
        schedule: "* * * * *"
        timeout: 3h
      syncIpListsSource:
        schedule: "*/5 * * * *"
        timeout: 3h
      syncMarkers:
        schedule: "* * * * *"
        timeout: 1h
    resources: {}
  exportenv:
    resources: {}
  synccloud:
    wallarm_syncnode_interval_sec: 120
    resources: {}
  collectd:
    resources: {}
```

The main parameters you may need to change are:

| Parameter | Description | Default value |
| --- | --- | --- |
| `wallarm.enabled` | Allows you to enable or disable the Wallarm API Security layer. | `true` |
| `wallarm.apiHost` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Wallarm node token. **Required**. | Empty |
| `wallarm.fallback` | Whether to run the Kong API Gateway services if the Wallarm service start failed. | `on`
| `wallarm.tarantool.replicaCount` | The number of running pods for the Wallarm postanalytics module that is the local data analytics backend for the solution. | `1`
| `wallarm.tarantool.arena` | Specifies the amount of memory allocated for the Wallarm postanalytics module. It is recommended to set up a value sufficient to store request data for the last 5-15 minutes. | `0.2`
| `wallarm.metrics.enabled` | This switch toggles information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required. | `false`

Other parameters come with default values and rarely need to be changed.

### Fine-tuning of traffic analysis via the Wallarm Console UI

The Wallarm Console UI enables you to fine-tune the traffic analysis performed by the Wallarm API Security layer as follows:

* Configure the traffic filtration mode
    
    Once the [solution is deployed](deployment.md), it starts filtering all incoming requests in the **monitoring** [mode](../../../admin-en/configure-wallarm-mode.md#available-filtration-modes).

    The Wallarm Console UI enables you to change the mode:

    * [Globally for all incoming requests](../../../user-guides/settings/general.md)
    * On the per-Ingress basis using the [rule](../../../user-guides/rules/wallarm-mode-rule.md)
* Set up [notifications on security events](../../../user-guides/settings/integrations/integrations-intro.md)
* [Manage access to APIs by the request sources](../../../user-guides/ip-lists/overview.md)
* [Customize traffic filtration rules](../../../user-guides/rules/intro.md)
