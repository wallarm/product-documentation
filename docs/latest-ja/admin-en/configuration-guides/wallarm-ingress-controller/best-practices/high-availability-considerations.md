# 高可用性に関する考慮事項（NGINXベースのIngressコントローラー）

本記事では、Wallarm Ingress controllerの高可用性確保とダウンタイム防止に役立つ設定の推奨事項を提供します。

--8<-- "../include/ingress-controller-best-practices-intro.md"

## 設定の推奨事項

以下の推奨事項はミッションクリティカル（本番）環境を対象としています。

* IngressコントローラーのPodインスタンスを複数使用します。この挙動は`values.yaml`ファイルの属性`controller.replicaCount`で制御します。例：
    ```
    controller:
      replicaCount: 2
    ```
* Kubernetesクラスターに対してIngressコントローラーのPodを異なるノードに配置するよう強制します。これはノード障害発生時のIngressサービスの回復性を高めます。この挙動はKubernetesのPodアンチアフィニティ機能で制御でき、`values.yaml`ファイルで設定します。例：
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
* 予期せぬトラフィックスパイクや、[Kubernetesのhorizontal pod autoscaling（HPA）](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)機能の利用が妥当となるその他の状況が想定されるクラスターでは、`values.yaml`ファイルで次のように有効化できます。
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```

## 設定手順

上記の設定を適用するには、`helm install`および`helm upgrade`コマンドの`--set`オプションを使用することを推奨します。例：

=== "Ingressコントローラーのインストール"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しくIngressコントローラーをインストールするには[その他のパラメータ](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションで指定してください。
=== "Ingressコントローラーのパラメータ更新"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```