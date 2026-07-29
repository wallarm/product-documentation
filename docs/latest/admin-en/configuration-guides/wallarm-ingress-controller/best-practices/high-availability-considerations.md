# High Availability and Resource Configuration (NGINX-based Ingress Controller)

This article provides configuration recommendations for running the Wallarm Ingress Controller in production: sizing its resources and making it highly available and resilient to downtimes.

Wallarm’s version of the Kubernetes Ingress Controller is based on the [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress); its [Helm parameters reference](https://docs.nginx.com/nginx-ingress-controller/lts/install/helm/parameters/) documents the high availability and resource settings that also apply to Wallarm's Ingress Controller.

## Components to make highly available

The Wallarm Ingress Controller runs as two independently scaled workloads, and both matter for high availability:

* **Controller pods** — the NGINX Ingress Controller that processes traffic. Configured under `controller.*` in `values.yaml`.
* **Postanalytics pods** — the Wallarm postanalytics backend (**wstore**) that the controller streams request data to for asynchronous analysis. Configured under `postanalytics.*`.

For a mission-critical (production) setup, run and spread replicas of **both** workloads. The recommendations below are grouped accordingly.

## Controller pods

### Run more than one replica

Set `controller.replicaCount` to at least `2`:

```yaml
controller:
  replicaCount: 2
```

### Spread pods across nodes

Force Kubernetes to place controller pods on different nodes, so that a single node failure does not take the service down. The chart ships `controller.affinity` empty (`affinity: {}`); populate it with a pod anti-affinity rule:

```yaml
controller:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchLabels:
              app.kubernetes.io/name: wallarm-ingress
              app.kubernetes.io/instance: <INGRESS_CONTROLLER_RELEASE_NAME>
          topologyKey: kubernetes.io/hostname
```

!!! info "Match the actual pod labels"
    Replace `<INGRESS_CONTROLLER_RELEASE_NAME>` with your Helm release name. If in doubt, list the labels of the running pods with `kubectl get pods -n <KUBERNETES_NAMESPACE> --show-labels` and use the labels that identify the controller pods in the selector.

!!! tip "Alternative: topology spread constraints"
    Instead of pod anti-affinity, you can spread pods with `controller.topologySpreadConstraints` (and `postanalytics.topologySpreadConstraints` for the postanalytics pods) — a more flexible way to distribute pods evenly across nodes or availability zones.

### Autoscale on load

In clusters subject to traffic spikes, enable [Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for controller pods running as a Deployment:

```yaml
controller:
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 11
    targetCPUUtilizationPercentage: 50
    targetMemoryUtilizationPercentage: 50
```

### Keep a minimum number of pods during disruptions

Add a [PodDisruptionBudget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) so that voluntary disruptions (node drains, cluster upgrades) do not remove too many controller pods at once:

```yaml
controller:
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

You can use `maxUnavailable` instead of `minAvailable`, depending on how you prefer to express the budget.

### Set resource requests and limits

Reserve and cap CPU and memory for the controller pods with `controller.resources`, so the scheduler can place them reliably and they do not starve or overrun neighboring workloads:

```yaml
controller:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
```

By default, `controller.resources` sets only requests (`cpu: 100m`, `memory: 128Mi`) and no limits.

The controller pod also runs a `wd` sidecar container that manages **wcli** and **API Firewall** and aggregates the pod's metrics. Size it separately with `controller.wallarm.wd.resources` (empty by default):

```yaml
controller:
  wallarm:
    wd:
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 500m
          memory: 512Mi
```

## Postanalytics pods

The postanalytics backend (**wstore**) runs as a separate workload. In a production setup, make it highly available as well.

### Run more than one replica

Postanalytics must run as a Deployment to scale beyond a single replica:

```yaml
postanalytics:
  replicaCount: 2
```

### Spread pods across nodes

Populate the empty `postanalytics.affinity` field the same way:

```yaml
postanalytics:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchLabels:
              app.kubernetes.io/name: wallarm-ingress
              app.kubernetes.io/instance: <INGRESS_CONTROLLER_RELEASE_NAME>
          topologyKey: kubernetes.io/hostname
```

Use the labels that identify the postanalytics pods (verify them with `kubectl get pods --show-labels`).

### Keep a minimum number of pods during disruptions

```yaml
postanalytics:
  podDisruptionBudget:
    enabled: true
    minAvailable: 1
```

### Size the wstore memory

The postanalytics backend (**wstore**) reserves memory to buffer request data for asynchronous analysis. Set the amount in GB with `postanalytics.arena` — high enough to hold request data for the last 5–15 minutes:

```yaml
postanalytics:
  arena: "2.0"
```

### Set resource requests and limits

`postanalytics.arena` reserves memory at the application level (**wstore**). Set matching Kubernetes requests and limits with `postanalytics.wd.resources` — the postanalytics pod's only workload container is the `wd` container, which runs **wstore** — so it is scheduled with, and capped at, the corresponding resources:

```yaml
postanalytics:
  wd:
    resources:
      requests:
        cpu: 200m
        memory: 1640Mi
      limits:
        cpu: 400m
        memory: 3280Mi
```

By default, `postanalytics.wd.resources` is empty (`{}`) — the container runs with no requests or limits, so set them explicitly for production. Align the memory with `postanalytics.arena` (the values above are an example, not a required ratio).

## Configuration procedure

To apply these settings, use the `--set` option of `helm install` (first install) or `helm upgrade` (existing installation). For example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.replicaCount=2 --set postanalytics.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    There are also [other parameters](../../../configure-kubernetes-en.md) required for correct Ingress controller installation. Pass them in the `--set` option too.
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 --set postanalytics.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
