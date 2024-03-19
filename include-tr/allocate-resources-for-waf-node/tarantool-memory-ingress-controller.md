`ingress-controller-wallarm-tarantool` podu için Tarantool belleği, `values.yaml` dosyasındaki aşağıdaki bölümleri kullanarak yapılandırılmıştır:

* GB olarak hafıza ayarlamak için:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* CPU olarak hafıza ayarlamak için:
    ```
    controller:
      wallarm:
        tarantool:
          resources:
            limits:
              cpu: 400m
              memory: 3280Mi
            requests:
              cpu: 200m
              memory: 1640Mi
    ```

Listelenen parametreler, `helm install` ve `helm upgrade` komutlarının `--set` seçeneği kullanılarak belirlenir, örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Ayrıca doğru Bir Ingress controller kurulumu için gereken [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) vardır. Lütfen bunları `--set` seçeneğinde de geçirin.
=== "Ingress controller parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```