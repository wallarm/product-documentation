wstore belleği, `values.yaml` dosyasındaki aşağıdaki bölümler kullanılarak yapılandırılır:

* Belleği GB cinsinden ayarlamak için:
    ```
    controller:
      wallarm:
        postanalytics:
          arena: "1.0"
    ```

* CPU/bellek kaynaklarını ayarlamak için:
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

Listelenen parametreler, `helm install` ve `helm upgrade` komutlarının `--set` seçeneği kullanılarak ayarlanır; örneğin:

=== "Ingress denetleyicisinin kurulumu"
    ```bash
    helm install --set controller.wallarm.postanalytics.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Doğru Ingress denetleyicisi kurulumu için ayrıca [diğer parametreler](../configure-kubernetes-en.md#additional-settings-for-helm-chart) gereklidir. Lütfen bunları da `--set` seçeneği ile iletin.
=== "Ingress denetleyicisi parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.postanalytics.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```