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