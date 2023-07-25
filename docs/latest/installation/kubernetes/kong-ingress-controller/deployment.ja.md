[ip-lists-docs]:                ../../../user-guides/ip-lists/overview.ja.md
[deployment-platform-docs]:     ../../../installation/supported-deployment-options.ja.md

# Kong Ingress Controllerを統合されたWallarmサービスと展開する

Kong API Gatewayで管理されているAPIを保護するには、Kubernetesクラスタ内に統合されたWallarmサービスを備えたKong Ingressコントローラを展開できます。このソリューションは、リアルタイムの悪意のあるトラフィック軽減レイヤを持つデフォルトのKong API Gateway機能を組み込みます。

ソリューションは [Wallarm Helm chart](https://github.com/wallarm/kong-charts) から展開されます。

統合された Wallarm サービスを持つ Kong Ingress Controller の **主要機能** は以下の通りです。

* リアルタイムでの [攻撃検出と軽減](../../../about-wallarm/protecting-against-attacks.ja.md)
* [脆弱性検出](../../../about-wallarm/detecting-vulnerabilities.ja.md)
* [APIインベントリの発見](../../../about-wallarm/api-discovery.ja.md)
* Wallarmサービスは、オープンソース版とエンタープライズ版の両方の [Kong API Gateway](https://docs.konghq.com/gateway/latest/) にネイティブに統合されています。
* このソリューションは、Kong API Gatewayの機能をフルサポートする [公式Kong Ingress Controller](https://docs.konghq.com/kubernetes-ingress-controller/latest/) に基づいています。
* Kong API Gateway 3.1.x (オープンソース版とエンタープライズ版の両方) のサポート
* Wallarm Console UIを介したWallarmレイヤの微調整およびアノテーションを介したIngressごとの調整

    !!! エラード "アノテーションのサポート"
        Ingressアノテーションは、オープンソースのKong Ingressコントローラを基盤としたソリューションでのみサポートされています。[ サポートされているアノテーションのリストは限定されています ](customization.ja.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition)。
* ソリューションにおいて、CPUの使用率が最も高いローカルデータ解析バックエンドのpostanalyticsモジュールに専用のエンティティを提供

## ユースケース

すべての [Wallarm 展開オプション](../../../installation/supported-deployment-options.ja.md) をサポートする中で、このソリューションは以下の **ユースケース** において推奨されるものです。

* Kong で管理されている Ingress リソースへの トラフィックをルーティングするIngressコントローラとセキュリティレイヤがありません。
* オープンソース版またはエンタープライズ版の公式Kong Ingressコントローラを使用しており、技術スタックと互換性のあるセキュリティソリューションを探しています。

    これらの手順で説明されているものと同じものを使って、新しい展開に設定を移動することで、展開済みのKong Ingressコントローラをシームレスに置き換えることができます。

## ソリューションアーキテクチャ

ソリューションには次のアーキテクチャがあります。

![！ソリューションアーキテクチャ](../../../images/waf-installation/kubernetes/kong-ingress-controller/solution-architecture.png)

ソリューションは公式Kong Ingress Controllerに基づいており、そのアーキテクチャは[公式Kongドキュメント](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/)で説明されています。

Kong Ingress Controller with integrated Wallarm servicesは、以下のDeploymentオブジェクトで構成されています。

* **Ingress Controller** (`wallarm-ingress-kong`) は、Helmチャート値に基づいてK8sクラスタにKong API GatewayとWallarmリソースを挿入し、ノードコンポーネントをWallarm クラウドに接続します。
* **Postanalyticsモジュール** (`wallarm-ingress-kong-wallarm-tarantool`) は、ソリューションのローカルデータ解析バックエンドです。モジュールは、インメモリストレージTarantoolおよび一連のヘルパーコンテナ(例えば、collectd、attack exportサービス)を使用しています。

## エンタープライズ Kong Ingress コントローラの制限事項

エンタープライズKong Ingressコントローラに関する記載のソリューションでは、WallarmコンソールUIを介してのみWallarmレイヤの微調整が可能です。

しかし、Wallarmプラットフォームの一部の機能では、現在のエンタープライズソリューション実装でサポートされていない設定ファイルを変更する必要があります。これにより、次のWallarm機能が利用できなくなります。

* [マルチテナント機能](../../multi-tenant/overview.ja.md)
* [アプリケーション設定](../../../user-guides/settings/applications.ja.md)
* [カスタムブロックページとコード設定](../../../admin-en/configuration-guides/configure-block-page-and-code.ja.md) - 両方のエンタープライズおよびオープンソース版Kong IngressコントローラとWallarmサービスではサポートされていません

オープンソースKong IngressコントローラとWallarmサービスについては、[アノテーション](customization.ja.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition) を介して Ingress ごとのマルチテナントおよびアプリケーション設定をサポートしています。

## 要件

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.ja.md"

## 展開

Kong Ingress Controller を統合された Wallarm サービスに展開するには：

1. Wallarm ノードを作成します。
1. Wallarm Helm チャートでKong Ingress ControllerとWallarmサービスを展開します。
1. Ingressでトラフィック解析を有効にします。
1. 統合された Wallarm サービス付きの Kong Ingress Controller をテストします。

### ステップ 1：Wallarm ノードの作成

1. 下記リンクを使って Wallarm Console → **ノード**を開きます:

    * https://us1.my.wallarm.com/nodes（米国クラウド用）
    * https://my.wallarm.com/nodes（欧州クラウド用）
1. **Wallarm node** タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。

    ![！Wallarmノード作成](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)### ステップ2：WallarmのHelmチャートをデプロイする

1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. `values.yaml`ファイルを、[ソリューション構成](customization.ja.md)とともに作成します。

    **オープンソース**のKong Ingressコントローラに統合されたWallarmサービスを実行するための最小構成のファイルの例：

    === "US Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```
    === "EU Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```  

    **エンタープライズ**Kong Ingressコントローラに統合されたWallarmサービスを実行するための最小構成のファイルの例：

    === "US Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG-ENTERPRISE-LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        enterprise:
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```
    === "EU Cloud"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG-ENTERPRISE-LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        enterprise:
          enabled: true
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```  

    * `<NODE_TOKEN>`は、Wallarm Console UIからコピーしたWallarmノードトークンです

        --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.ja.md"

    * `<KONG-ENTERPRISE-LICENSE>`は[Kong Enterprise License](https://github.com/Kong/charts/blob/master/charts/kong/README.ja.md#kong-enterprise-license)です
1. WallarmのHelmチャートをデプロイします:

    ``` bash
    helm install --version 4.4.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`は、Kong Ingress ControllerチャートのHelmリリースの名前です
    * `<KUBERNETES_NAMESPACE>`は、Kong Ingress Controllerチャートを含むHelmリリースをデプロイする新しい名前空間です
    * `<PATH_TO_VALUES>`は、`values.yaml`ファイルへのパスです

### ステップ3：Ingressでトラフィック分析を有効にする

デプロイされたソリューションがオープンソースのKong Ingressコントローラに基づいている場合は、Wallarmを`monitoring`に設定して、Ingressでトラフィック分析を有効にします。

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

ここで、`<KONG_INGRESS_NAME>`は、保護したいマイクロサービスにAPI呼び出しをルーティングするK8s Ingressリソースの名前です。

エンタープライズKong Ingressコントローラの場合、すべてのIngressリソースに対してモニタリングモードでのトラフィック分析がデフォルトでグローバルに有効になっています。

### ステップ4：統合されたWallarmサービスを備えたKong Ingressコントローラをテストする

統合されたWallarmサービスを備えたKong Ingressコントローラが正しく動作していることを確認するために、以下の手順を実行します。

1. Wallarmポッドの詳細を取得して、正常に開始されたことを確認します。

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    それぞれのポッドは、**READY：N/N**および**STATUS：Running**を表示する必要があります。例：

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingressコントローラサービスにテスト[Path Traversal](../../../attacks-vulns-list.ja.md#path-traversal)攻撃を送信します。

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Wallarmレイヤーは**monitoring** [フィルタリングモード](../../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)で動作しているため、Wallarmノードは攻撃をブロックせず、登録するだけです。

    攻撃が登録されたことを確認するには、Wallarm Console →**イベント**に進んでください。

    ![!インターフェイスの攻撃](../../../images/admin-guides/test-attacks-quickstart.png)

## カスタマイズ

Wallarmポッドは、[デフォルトの`values.yaml`](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml)と2番目のデプロイメントステップで指定したカスタム構成に基づいて注入されています。

Kong API GatewayとWallarmの動作をさらにカスタマイズして、Wallarmを徹底的に活用できます。

[Kong Ingress Controllerソリューションカスタマイゼーションガイド](customization.ja.md)に進んでください。