# High Availability Considerations

--8<-- "../include/ingress-controller-best-practices-intro.md"

The following recommendations are relevant for missing-critical (production) environments.

* Use more than one Ingress controller pod instances. The behavior is controlled using attribute `controller.replicaCount` in the `values.yaml` file. For example:
    ```
    controller:
        replicaCount: 2
    ```
* Force the Kubernetes cluster to place Ingress controller pods on different nodes - this will increase the Ingress service resilience in case of a node failure. The behavior is controlled using Kubernetes' pod anti-affinity feature configured in the `values.yaml` file. For example:
    ```
    controller:
        affinity:
            podAntiAffinity:
                requiredDuringSchedulingIgnoredDuringExecution:
                - labelSelector:
                    matchExpressions:
                    - key: app
                      operator: In
                      values:
                      - nginx-ingress
                topologyKey: "kubernetes.io/hostname"
    ```
* In clusters which are subject to unexpected traffic spikes or other conditions which may justify the use of [Kubernetes' horizontal pod autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) feature it can enabled in the `values.yaml` file using the following example:
    ```
    controller:
        autoscaling:
            enabled: true
            minReplicas: 1
            maxReplicas: 11
            targetCPUUtilizationPercentage: 50
            targetMemoryUtilizationPercentage: 50
    ```
* Run at least two instances of Wallarm postanalytics service based on Tarantool database. These pods include `ingress-controller-wallarm-tarantool` in the name. The behavior is controlled in file `values.yaml` using attribute `controller.wallarm.tarantool.replicaCount`. For example: 
    ```
    controller:
        wallarm:
            tarantool:
                replicaCount: 2
    ```