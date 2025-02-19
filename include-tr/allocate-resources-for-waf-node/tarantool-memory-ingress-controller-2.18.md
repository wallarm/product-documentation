Tarantool belleği, `values.yaml` dosyasındaki aşağıdaki bölümler kullanılarak `ingress-controller-wallarm-tarantool` pod'u için yapılandırılır:

* GB cinsinden bellek ayarlamak için:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* CPU cinsinden bellek ayarlamak için:
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

Listelemiş olduğumuz parametreler, `helm install` ve `helm upgrade` komutlarının `--set` seçeneği kullanılarak ayarlanır, örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Doğru Ingress controller kurulumu için gerekli [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) de vardır. Lütfen bunları da `--set` seçeneğiyle geçin.
=== "Ingress controller parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```