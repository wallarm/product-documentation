# Yüksek Kullanılabilirlik Hususları (NGINX tabanlı Ingress denetleyicisi)

Bu makale, Wallarm Ingress denetleyicisinin yüksek kullanılabilir olmasını ve arızaların önlenmesini sağlamak için yapılandırma önerileri sunmaktadır.

--8<-- "../include-tr/ingress-controller-best-practices-intro.md"

## Yapılandırma önerileri

Aşağıdaki öneriler eksik-kritik (üretim) ortamlar için geçerlidir.

* Birden fazla Ingress denetleyici pod örneği kullanın. Bu davranış, `values.yaml` dosyasındaki `controller.replicaCount` özelliği kullanılarak kontrol edilir. Örneğin:
    ```
    controller:
      replicaCount: 2
    ```
* Kubernetes kümesini, Ingress denetleyici podları farklı düğümlere yerleştirmeye zorlayın: Bu, bir düğme arızası durumunda Ingress hizmetinin direncini artırır. Bu davranış, `values.yaml` dosyasında yapılandırılan Kubernetes pod anti-affinity özelliği kullanılarak kontrol edilir. Örneğin:
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
* Beklenmedik trafik dalgalanmalarına tabi olan veya [Kubernetes'in yatay pod otomatik ölçeklendirme (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) özelliğinin kullanımını haklı çıkaran diğer koşullar bulunan kümelerde, bu özellik `values.yaml` dosyasında aşağıdaki örneği kullanarak etkinleştirilebilir:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* En az iki Wallarm'ın postanalytics hizmeti örneğini Tarantool veritabanı temelinde çalıştırın. Bu podlar isimlerinde `ingress-controller-wallarm-tarantool` içerir. Bu davranış, `values.yaml` dosyasındaki `controller.wallarm.tarantool.replicaCount` özelliği kullanılarak kontrol edilir. Örneğin: 
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## Yapılandırma işlemi

Belirtilen yapılandırmaları ayarlamak için, `helm install` ve `helm upgrade` komutlarının `--set` seçeneğini kullanmanız önerilir. Örneğin:

=== "Ingress denetleyici kurulumu"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Doğru Ingress denetleyici kurulumu için [diğer parametrelere](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) de ihtiyaç vardır. Lütfen onları da `--set` seçeneğinde geçirin.
=== "Ingress denetleyici parametrelerinin güncellenmesi"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```