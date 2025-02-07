Tarantool belleği, `values.yaml` dosyasındaki aşağıdaki bölümler kullanılarak `ingress-controller-wallarm-tarantool` pod’u için yapılandırılır:

* Belleği GB cinsinden ayarlamak için:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* Belleği CPU cinsinden ayarlamak için:
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

Listelenen parametreler, örneğin `helm install` ve `helm upgrade` komutlarının `--set` seçeneği kullanılarak ayarlanır:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

Doğru Ingress controller kurulumu için ayrıca [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) gereklidir. Lütfen bunları da `--set` seçeneği ile iletin.

=== "Ingress controller parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```