# 高可用性の配慮事項（NGINXベースのIngressコントローラー）

この記事では、Wallarm Ingressコントローラーが高可用性を持ち、ダウンタイムを防ぐための設定推奨事項を提供しています。

--8<-- "../include/ingress-controller-best-practices-intro.ja.md"

## 設定推奨事項

以下の推奨事項は、欠損しているクリティカル（本番）環境に関連します。

* 複数のIngressコントローラーポッドインスタンスを使用します。この動作は、`values.yaml`ファイルの`controller.replicaCount`属性で制御されます。例えば：
    ```
    controller:
      replicaCount: 2
    ```
* Kubernetesクラスターに、異なるノード上のIngressコントローラポッドを配置させる：これにより、ノードの障害発生時にIngressサービスのレジリエンスが向上します。この動作は、`values.yaml`ファイルで設定されるKubernetesのポッドアンチアフィニティ機能を使用して制御されます。例えば：
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
* [Kubernetesの水平ポッドオートスケーリング（HPA）](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)機能の使用が正当化されるような条件が発生するクラスタでは、`values.yaml`ファイルで以下の例を使用して有効にすることができます：
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* タランツールデータベースに基づくWallarmのpostanalyticsサービスのインスタンスを少なくとも2つ実行します。これらのポッドには、名前に`ingress-controller-wallarm-tarantool`が含まれています。この動作は、`values.yaml`ファイルで`controller.wallarm.tarantool.replicaCount`属性を使用して制御されます。例えば：
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## 設定手順

上記の設定を設定するには、`helm install`および`helm upgrade`コマンドの`--set`オプションを使用することをお勧めします。例えば：

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しいIngressコントローラのインストールには[他のパラメータ](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。それらも`--set`オプションで渡してください。
=== "Ingressコントローラパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```