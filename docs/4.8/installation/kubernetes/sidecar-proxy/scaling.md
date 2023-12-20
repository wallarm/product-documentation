# Scaling and High Availability of Wallarm Sidecar

This guide focuses on the nuances of scaling, High Availability (HA), and the correct allocation of resources for the [Wallarm Sidecar solution]. By configuring these effectively, you can enhance the reliability and performance of Wallarm Sidecar, ensuring minimal downtime and efficient request processing.

Configuration is broadly categorized into two segments:

* Settings dedicated for Sidecar pods
* Settings for the Sidecar container injected into your application's pod

Scaling and high availability of Wallarm Sidecar rely on on standard Kubernetes practices. To grasp the basics before applying our recommendations, consider exploring these recommended links:

* [Kubernetes Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Highly available clusters in Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [Assigning CPU resources to containers and pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Scaling Wallarm Sidecar Pod

The Wallarm Sidecar solution [consists of two components: `wallarm-sidecar-controller` and `wallarm-sidecar-postanalytics` pods][sidecar-arch-docs]. Each requires individual scaling configurations, involving Kubernetes parameters like `replicas`, `requests`, and `podAntiAffinity`.

### Controller's Pod scaling

The `wallarm-sidecar-controller` functions as a mutating admission webhook, injecting Wallarm sidecar resources into the application's Pod. This component is not scaled via HPA, but for HA, consider the following settings of the Wallarm Sidecar `values.yaml` file:

* Use more than one instance of the Sidecar pod. Control this with the [`config.controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877) attribute.

    ```yaml
    config:
      controller:
        replicaCount: 2
    ```
* (Optionally) Set [`controller.resources.requests.cpu` and `controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001) to ensure reserved resources for the controller's Pod. For calculation guidelines, you may find useful [the same of our recommendations for other deployment options](admin-en/configuration-guides/allocate-resources-for-node/#nginx).
* (Optionally) Use pod anti-affinity to distribute Sidecar pods across different nodes to increase the Sidecar service's resilience in case of a node failure, e.g.:

    ```yaml
    controller:
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
                - key: app.kubernetes.io/instance
                  operator: In
                  values:
                  - release-name
                - key: app.kubernetes.io/component
                  operator: In
                  values:
                  - controller
              topologyKey: kubernetes.io/hostname
    ```

### Tarantool's pod scaling

The wallarm-sidecar-postanalytics Tarantool pod, which handles traffic from all sidecar containers in your application pods, cannot currently be scaled using HPA based on memory or CPU usage.

To configure the Tarantool module for HA and manage traffic effectively, the following settings of the Wallarm Sidecar `values.yaml` file can be adjusted:

* [`postanalytics.tarantool.config.arena`] should be configured based on the expected traffic to the sidecars. For calculation guidelines, you may find useful [the same of our recommendations for other deployment options](admin-en/configuration-guides/allocate-resources-for-node/#tarantool)
* [`postanalytics.tarantool.resources.requets.memory`] must align with the `arena` configuration mentioned above.
* Ensure [`postanalytics.tarantool.replicaCount`] is two or more to achieve HA.
* (Optionally) Set [`resources.requests`] for all containers within the `postanalytics.tarantool` section to ensure dedicated resource allocation for the Tarantool Pod.
* (Optionally) Use pod anti-affinity to distribute Sidecar pods across different nodes to increase the Sidecar service's resilience in case of a node failure, e.g.:

    ```yaml
    postanalytics:
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
                - key: app.kubernetes.io/instance
                  operator: In
                  values:
                  - release-name
                - key: app.kubernetes.io/component
                  operator: In
                  values:
                  - postanalytics
              topologyKey: kubernetes.io/hostname
    ```

## Scaling Wallarm Sidecar containers injected into your application's pod

Wallarm Sidecar containers, when injected into your application pod, might require scaling adjustments. It is essential for HPA to have defined CPU or memory usage parameters for these containers. HPA will continuously monitor the load on the pods and dynamically adjust their count to ensure optimal performance and efficiency, following the specified settings.

### Prerequisites

To successfully [implement HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) for the Wallarm containers, ensure these prerequisites are met:

* [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) deployed and configured in your Kubernetes cluster.
* [`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) configured for all containers in the application pod, including init containers.

    Resource allocation for the application container should be specified in its manifest. For containers injected by Wallarm, resource settings are outlined below, with allocation possible both [globally and on a per-pod basis].

### Global allocation via Helm chart values

| Container deployment pattern | Container name        | Chart value                                      |
|-------------------|-----------------------|--------------------------------------------------|
| [Split, Single](#single-and-split-deployment-of-containers)     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
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
| [Single, Split](#single-and-split-deployment-of-containers)     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
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

