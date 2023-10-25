`ingress-controller-wallarm-tarantool` podu için Tarantool belleği, `values.yaml` dosyasındaki aşağıdaki bölümler kullanılarak yapılandırılır:

* GB olarak belleği ayarlamak için:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* CPU olarak belleği ayarlamak için:
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

Listelenen parametreler, `helm install` ve `helm upgrade` komutlarının `--set` seçeneği kullanılarak ayarlanır, örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Ayrıca, doğru Ingress kontrolcüsü kurulumu için [diğer gereken parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) bulunmaktadır. Lütfen onları da `--set` seçeneği ile belirtin.
=== "Ingress controller parametrelerinin güncellenmesi"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```