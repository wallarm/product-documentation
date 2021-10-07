Tarantool memory is configured for the `ingress-controller-wallarm-tarantool` pod using the following sections in the `values.yaml` file:

* To set up memory in GB:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* To set up memory in CPU:
    ```
    controller:
      wallarm:
        tarantool:
          resources:
            limits:
              cpu: 1000m
              memory: 1640Mi
            requests:
              cpu: 1000m
              memory: 1640Mi
    ```

Listed parameters are set by using the `--set` option of the commands `helm install` and `helm upgrade`, for example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingress controller update or upgrade"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
