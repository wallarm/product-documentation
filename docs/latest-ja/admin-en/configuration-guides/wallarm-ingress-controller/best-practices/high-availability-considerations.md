# 高可用性に関する考慮事項（NGINXベースIngressコントローラ）

この記事では、Wallarm Ingressコントローラを高可用性化し、ダウンタイムを防止するための構成推奨事項について説明します。

--8<-- "../include/ingress-controller-best-practices-intro.md"

## 構成推奨事項

以下の推奨事項は、本番環境など重要な環境に該当します。

* 複数のIngressコントローラポッドインスタンスを使用します。この動作は、`values.yaml`ファイル内の属性`controller.replicaCount`で制御します。例えば:
    ```
    controller:
      replicaCount: 2
    ```
* KubernetesクラスターがIngressコントローラポッドを異なるノードに配置するよう強制します。これにより、ノード障害時にIngressサービスのレジリエンスが向上します。この動作は、Kubernetesのpodアンチアフィニティ機能を使用しており、`values.yaml`ファイルに設定されています。例えば:
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
* 予期しないトラフィック急増やその他の条件により[Kubernetesのhorizontal pod autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)機能の使用が正当化されるクラスターでは、`values.yaml`ファイルで以下のように有効化できます:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* Tarantoolデータベースを利用したWallarmのpostanalyticsサービスを少なくとも2インスタンス実行します。これらのポッドは名前に`ingress-controller-wallarm-tarantool`を含みます。この動作は、`values.yaml`ファイル内の属性`controller.wallarm.tarantool.replicaCount`で制御します。例えば:
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## 構成手順

これらの構成を設定するには、`helm install`および`helm upgrade`コマンドの`--set`オプションを使用することが推奨されます。例えば:

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しいIngressコントローラのインストールには[その他のパラメータ](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションで渡してください。
=== "Ingressコントローラパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```