# Yüksek Kullanılabilirlik Hususları (NGINX tabanlı Ingress controller)

Bu makale, Wallarm Ingress controller'ın yüksek kullanılabilir olması ve kesintilerin önlenmesi için yapılandırma önerileri sunar.

--8<-- "../include/ingress-controller-best-practices-intro.md"

## Yapılandırma önerileri

Aşağıdaki öneriler iş açısından kritik (üretim) ortamlar için geçerlidir.

* Birden fazla Ingress controller pod örneği kullanın. Bu davranış `values.yaml` dosyasındaki `controller.replicaCount` özniteliği ile kontrol edilir. Örneğin:
    ```
    controller:
      replicaCount: 2
    ```
* Kubernetes kümesini Ingress controller pod'larını farklı düğümlere yerleştirmeye zorlayın: bu, bir düğüm arızası durumunda Ingress servisinin dayanıklılığını artıracaktır. Bu davranış, `values.yaml` dosyasında yapılandırılan Kubernetes pod anti-affinity özelliği kullanılarak kontrol edilir. Örneğin:
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
* Beklenmeyen trafik sıçramalarına veya [Kubernetes'in horizontal pod autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) özelliğinin kullanımını haklı çıkarabilecek diğer koşullara maruz kalan kümelerde, bu özellik `values.yaml` dosyasında aşağıdaki örnek kullanılarak etkinleştirilebilir:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```

## Yapılandırma prosedürü

Listelenen yapılandırmaları ayarlamak için `helm install` ve `helm upgrade` komutlarının `--set` seçeneğini kullanmanız önerilir; örneğin:

=== "Ingress controller kurulumu"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Doğru Ingress controller kurulumu için gerekli [diğer parametreler](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) de vardır. Lütfen bunları da `--set` seçeneği ile iletin.
=== "Ingress controller parametrelerini güncelleme"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```