# High Availability Considerations (NGINX-based Ingress controller)

This article provides configuration recommendations for the Wallarm Ingress controller to be highly available and prevented from downtimes.

--8<-- "../include/ingress-controller-best-practices-intro.md"

## Configuration recommendations

The following recommendations are relevant for missing-critical (production) environments.

* Use more than one Ingress controller pod instances. The behavior is controlled using the attribute `controller.replicaCount` in the `values.yaml` file. For example:
    ```
    controller:
      replicaCount: 2
    ```
* Force the Kubernetes cluster to place Ingress controller pods on different nodes: this will increase the Ingress service's resilience in case of a node failure. This behavior is controlled using the Kubernetes pod anti-affinity feature, which is configured in the `values.yaml` file. For example:
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
* In clusters that are subject to unexpected traffic spikes or other conditions that may justify the use of [Kubernetes's horizontal pod autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) feature it can enabled in the `values.yaml` file using the following example:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```

## Configuration procedure

To set listed configurations, it is recommended to use the option `--set` of the commands `helm install` and `helm upgrade`, for example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    There are also [other parameters](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```