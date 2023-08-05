# 高可用性に関する考慮事項（NGINXベースのIngressコントローラ）

この記事では、Wallarm Ingressコントローラが高可用性を維持し、ダウンタイムを防ぐための設定推奨事項を提供します。

--8<-- "../include/ingress-controller-best-practices-intro.md"

## 設定推奨事項

次の推奨事項は、欠落しているクリティカルな（プロダクション）環境に関連しています。

* 複数のIngressコントローラpodインスタンスを使用します。この動作は、 `values.yaml` ファイルの属性 `controller.replicaCount` を使用して制御されます。例えば:
    ```
    controller:
      replicaCount: 2
    ```
* KubernetesクラスターにIngressコントローラポッドを異なるノードに配置するよう強制します。これにより、ノードの障害時にIngressサービスのレジリエンスが向上します。この動作は、Kubernetesのpod反親和性（anti-affinity）機能を使用して制御されますが、`values.yaml` ファイルで設定されます。例えば:
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
* 予期せぬトラフィックの急増やその他の条件が[Kubernetesのホリゾンタルpodオートスケーリング（HPA）](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)機能の使用を正当化する可能性があるクラスタでは、次の例のように `values.yaml` ファイルでこれを有効化できます:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* 少なくとも2つのインスタンスのWallarmのpostanalyticsサービスをTarantoolデータベースに基づいて実行します。これらのポッドは名前に `ingress-controller-wallarm-tarantool` を含みます。この動作は、ファイル `values.yaml` の属性 `controller.wallarm.tarantool.replicaCount` を使用して制御されます。例えば:
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## 設定手順

以下の設定を行うには、 `helm install` および `helm upgrade` コマンドのオプション `--set` の使用が推奨されます。例：

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しいIngressコントローラのインストールには、他にも[必要なパラメーター](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart)があります。それらも `--set` オプションで渡してください。
=== "Ingressコントローラパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```