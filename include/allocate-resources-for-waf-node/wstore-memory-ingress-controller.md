wstore memory is configured using the following sections in the `values.yaml` file:

* To set up memory in GB:
    ```
    controller:
      wallarm:
        postanalytics:
          arena: "1.0"
    ```

* To set up memory in CPU:
    ```
    controller:
      wallarm:
        postanalytics:
          resources:
            limits:
              cpu: 400m
              memory: 3280Mi
            requests:
              cpu: 200m
              memory: 1640Mi
    ```

Listed parameters are set by using the `--set` option of the commands `helm install` and `helm upgrade`, for example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.postanalytics.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    There are also [other parameters](../configure-kubernetes-en.md#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.postanalytics.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
