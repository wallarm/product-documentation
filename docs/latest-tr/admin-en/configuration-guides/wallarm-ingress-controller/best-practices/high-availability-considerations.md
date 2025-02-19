# Yüksek Erişilebilirlik Hususları (NGINX tabanlı Ingress controller)

Bu makale, Wallarm Ingress controller'ın yüksek erişilebilirlik sağlanması ve kesinti sürelerinden kaçınılması için yapılandırma önerilerini içerir.

--8<-- "../include/ingress-controller-best-practices-intro.md"

## Yapılandırma Önerileri

Aşağıdaki öneriler, kritik (üretim) ortamlar için geçerlidir.

* Birden fazla Ingress controller pod örneği kullanın. Bu davranış, `values.yaml` dosyasındaki `controller.replicaCount` özniteliği kullanılarak kontrol edilir. Örneğin:
    ```
    controller:
      replicaCount: 2
    ```
* Kubernetes kümesinin Ingress controller pod'larını farklı düğümlere yerleştirmesini zorlayın: bu, bir düğüm arızası durumunda Ingress servisinin dayanıklılığını artıracaktır. Bu davranış, `values.yaml` dosyasında yapılandırılan Kubernetes pod anti-affinity özelliği kullanılarak kontrol edilir. Örneğin:
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
* Beklenmeyen trafik artışlarına veya [Kubernetes's horizontal pod autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) özelliğini kullanmayı gerektirebilecek diğer koşullara maruz kalan kümelerde, `values.yaml` dosyasında aşağıdaki örnek kullanılarak etkinleştirilebilir:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* Tarantool veritabanına dayalı Wallarm'ın postanalytics servisi örneklerinden en az ikisini çalıştırın. Bu pod'lar isimlerinde `ingress-controller-wallarm-tarantool` içerir. Davranış, `values.yaml` dosyasında `controller.wallarm.tarantool.replicaCount` özniteliği kullanılarak kontrol edilir. Örneğin:
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## Yapılandırma Prosedürü

Liste halinde belirtilen yapılandırmaları ayarlamak için, `helm install` ve `helm upgrade` komutlarında `--set` seçeneğinin kullanılması önerilir. Örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Doğru Ingress controller kurulumu için gerekli olan [diğer parametreler](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) de mevcuttur. Lütfen bunları da `--set` seçeneğinde belirtin.
=== "Ingress controller parametrelerinin güncellenmesi"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```