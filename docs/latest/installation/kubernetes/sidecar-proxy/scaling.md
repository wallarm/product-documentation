# Scaling and High Availability of Wallarm Sidecar

This guide focuses on the nuances of scaling, High Availability (HA), and the correct allocation of resources for the [Wallarm Sidecar solution][sidecar-docs]. By configuring these effectively, you can enhance the reliability and performance of Wallarm Sidecar, ensuring minimal downtime and efficient request processing.

Configuration is broadly categorized into two segments:

* Settings dedicated for Wallarm Sidecar control plane
* Settings for application workload with injected sidecar

Scaling and high availability of Wallarm Sidecar rely on standard Kubernetes practices. To grasp the basics before applying our recommendations, consider exploring these recommended links:

* [Kubernetes Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Highly available clusters in Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [Assigning CPU resources to containers and pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Scaling Wallarm Sidecar control plane

The Wallarm Sidecar solution [consists of two components: controller and postanalytics (Tarantool)][sidecar-arch-docs]. Each requires individual scaling configurations, involving Kubernetes parameters like `replicas`, `requests`, and `podAntiAffinity`.

### Controller

The Sidecar Controller functions as a mutating admission webhook, injecting sidecar containers into the application's Pod. In most cases, HPA scaling is not needed. For the HA deployment, consider the following settings of the `values.yaml` file:

* Use more than one instance of the Sidecar pod. Control this with the [`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877) attribute.
* Optionally, set [`controller.resources.requests.cpu` and `controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001) to ensure reserved resources for the controller's Pod.
* Optionally, use pod anti-affinity to distribute controller pods across different nodes to provide resilience in case of a node failure.

Here is an example of the adjusted `controller` section in the `values.yaml` file, incorporating these recommendations:

```yaml
controller:
  replicaCount: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 32Mi
```

### Postanalytics (Tarantool)

The postanalytics component handles traffic from all sidecar containers injected in your application workload. This component can not be scaled by HPA.

For the HA deployment, you can manually adjust the amount of replicas using the following settings of the `values.yaml` file:

* Use more than one instance of the Tarantool Pod. Control this with the [`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L382) attribute.
* Configure [`postanalytics.tarantool.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L610C7-L610C7) in gigabytes (GB) based on the anticipated traffic volume to the application workload. This setting determines the maximum memory Tarantool will utilize. For calculation guidelines, you may find useful [the same of our recommendations for other deployment options][wstore-memory-recommendations].
* Align [`postanalytics.tarantool.resources.limits` and `postanalytics.tarantool.resources.requests`](https://github.com/wallarm/sidecar/blob/4eb1a4c4f8d20989757c50c40e192eb7eb1f2169/helm/values.yaml#L639) with the `arena` configuration. Set `limits` at or above the `arena` value to handle peak demand and avoid memory-related crashes. Ensure `requests` meet or exceed the `arena` value for Tarantool's optimal performance. For further information, see the [Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
* Optionally, set `resources.requests` and `resources.limits` for all other containers within the `postanalytics` section to ensure dedicated resource allocation for the Tarantool Pod. These containers include `postanalytics.init`, `postanalytics.supervisord`, and `postanalytics.appstructure`.
* Optionally, implement pod anti-affinity to distribute postanalytics pods across different nodes to provide resilience in case of a node failure.

Here is an example of the adjusted `postanalytics` section in the `values.yaml` file, incorporating these recommendations:

```yaml
postanalytics:
  replicaCount: 2
  tarantool:
    config:
      arena: "1.0"
    resources:
      limits:
        cpu: 500m
        memory: 1Gi
      requests:
        cpu: 100m
        memory: 1Gi
  init:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  supervisord:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  appstructure:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - postanalytics
          topologyKey: kubernetes.io/hostname
```

## Scaling application workload with injected sidecar containers

When using Horizontal Pod Autoscaling (HPA) for managing application workloads, it is essential to configure `resources.requests` for every container in the Pod including the ones injected by Wallarm Sidecar.

### Prerequisites

To successfully [implement HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) for the Wallarm containers, ensure these prerequisites are met:

* [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) deployed and configured in your Kubernetes cluster.
* [`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) configured for all containers in the application pod, including init containers.

    Resource allocation for the application container should be specified in its manifest. For containers injected by Wallarm, resource settings are outlined below, with allocation possible both [globally and on a per-pod basis][sidecar-conf-area].

### Global allocation via Helm chart values

| Container deployment pattern | Container name        | Chart value                                      |
|-------------------|-----------------------|--------------------------------------------------|
| [Split, Single][single-split-deployment]     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Split             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Split, Single     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Split             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

Example of Helm chart values for managing resources (requests & limits) globally:

```yaml
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```

### Per-pod basis allocation via Pod's annotations

| Container deployment pattern | Container name        | Annotation                                                             |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [Single, Split][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Split             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Single, Split     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Split             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

Example of annotations to manage resources (requests & limits) on a per-pod basis (with the `single` container pattern enabled):

```yaml hl_lines="16-24"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/proxy-cpu: 200m
        sidecar.wallarm.io/proxy-cpu-limit: 500m
        sidecar.wallarm.io/proxy-memory: 256Mi
        sidecar.wallarm.io/proxy-memory-limit: 512Mi
        sidecar.wallarm.io/init-iptables-cpu: 50m
        sidecar.wallarm.io/init-iptables-cpu-limit: 100m
        sidecar.wallarm.io/init-iptables-memory: 32Mi
        sidecar.wallarm.io/init-iptables-memory-limit: 64Mi
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

## Example

Below is the example of the Wallarm chart's `values.yaml` file with the settings describe above applied. This example assumes that resources for containers injected by Wallarm are allocated globally.

```yaml
controller:
  replicaCount: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 32Mi
postanalytics:
  replicaCount: 2
  tarantool:
    config:
      arena: "1.0"
    resources:
      limits:
        cpu: 500m
        memory: 1Gi
      requests:
        cpu: 100m
        memory: 1Gi
  init:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  supervisord:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  appstructure:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - postanalytics
          topologyKey: kubernetes.io/hostname
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```
