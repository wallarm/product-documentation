# Wallarmサービスと統合したKong Ingress Controllerのデプロイ

Kong APIゲートウェイで管理されるAPIを保護するために、Wallarmサービスと統合したKong IngressコントローラをKubernetesクラスタにデプロイできます。このソリューションは、リアルタイムの悪意のあるトラフィック軽減のレイヤーを備えたデフォルトのKong APIゲートウェイの機能を用います。

このソリューションは[Wallarm Helm chart](https://github.com/wallarm/kong-charts)からデプロイされます。

Wallarm サービスと統合した Kong Ingress Controllerの**主要な特長**は次のとおりです:

* リアルタイムの[攻撃検出と軽減][attack-detection-docs]
* [脆弱性検出][vulnerability-detection-docs]
* [APIインベントリ検出][api-discovery-docs]
* Wallarmサービスはオープンソース及びエンタープライズの両[Kong API Gateway](https://docs.konghq.com/gateway/latest/)エディションにネイティブに統合されています
* このソリューションは、Kong API Gatewayのすべての機能を完全にサポートしている[公式のKong Ingress Controller for Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/)を基にしています
* Kong API Gateway 3.1.xのサポート（オープンソースとエンタープライズの両エディション）
* Wallarm Console UIおよびアノテーションを通じたIngressごとのWallarmレイヤーの微調整

    !!! warning "アノテーションのサポート"
        IngressアノテーションはオープンソースのKong Ingressコントローラーを基にしたソリューションのみがサポートします。[対応しているアノテーションのリストは限られています](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition)。
* このソリューションは、CPUの大部分を消費するローカルデータ分析バックエンドであるpostanalyticsモジュールの専用エンティティを提供します

## ユースケース

すべてのサポートされている[Wallarmデプロイメントオプション][deployment-platform-docs]の中で、このソリューションは以下の**ユースケース**に推奨されます:

* Kongが管理するIngressリソースへのトラフィックをルーティングするIngressコントローラーとセキュリティレイヤーがありません。
* 公式のオープンソースまたはエンタープライズのKong Ingressコントローラを使用しており、技術スタックと互換性のあるセキュリティソリューションを探しています。

    あなたは配置済みのKong Ingress Controllerをこれらの指示に従ったものにシームレスに置き換えることができます。新しいデプロイメントにコンフィギュレーションを移動するだけです。

## ソリューションアーキテクチャ

このソリューションは以下のアーキテクチャを持っています:

![ソリューションアーキテクチャ][kong-ing-controller-scheme]

このソリューションは公式のKong Ingress Controllerに基づいており、そのアーキテクチャは[公式Kongドキュメンテーション](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/)で説明されています。

Wallarmサービスと統合したKong Ingress Controllerは、以下のDeploymentオブジェクトにより構成されます:

* **Ingress controller** (`wallarm-ingress-kong`)は、Helm chartの値に基づいてK8sクラスタにKong API GatewayとWallarmリソースを注入し、これを構成し、ノードコンポーネントをWallarm Cloudに接続します。
* **Postanalyticsモジュール** (`wallarm-ingress-kong-wallarm-tarantool`)はこのソリューションのローカルデータ分析バックエンドです。このモジュールはメモリ内ストレージのTarantoolと一部のヘルパーコンテナ（collectd、攻撃エクスポートサービスなど）を使用します。

##  Kong Ingress コントローラの制限事項

 Kong Ingressコントローラ用の解説されたソリューションは、Wallarmレイヤーの微調整をWallarm Console UI経由でのみ許容します。

ただし、Wallarmプラットフォームの一部の機能には、現在のエンタープライズソリューションの実装ではサポートされていない設定ファイルの変更が必要です。これにより次のWallarmの機能が利用できません:

* [マルチテナンシーフューチャー][multitenancy-overview]
* [アプリケーション設定][applications-docs]
* [カスタムブロッキングページとコード設定][custom-blocking-page-docs] - Wallarmサービスを持つ企業とオープンソースの両方のKong Ingressコントローラではサポートされていません

なお、Wallarmサービスと統合したオープンソースのKong Ingressコントローラは、[アノテーション](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition)を介したIngressごとのマルチテナンシーとアプリケーション設定をサポートしています。

## 要件

--8<-- "../include-ja/waf/installation/kong-ingress-controller-reqs.md"

## デプロイメント

Wallarmサービスと統合したKong Ingress Controllerをデプロイするには:

1. Wallarmノードを作成します。
1. Kong Ingress ControllerとWallarmサービスとともにWallarm Helmチャートをデプロイします。
1. あなたのIngressに対してトラフィック分析を有効にします。
1. Wallarmサービスと統合したKong Ingress Controllerをテストします。

### ステップ1: Wallarmノードの作成

1. 以下のリンクからWallarm Console → **ノード** を開きます:

    * https://us1.my.wallarm.com/nodes (米国クラウドの場合)
    * https://my.wallarm.com/nodes (EUクラウドの場合)
1. **Wallarmノード**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
    
    ![Wallarmノードの作成][create-wallarm-node-img]

### ステップ2: Wallarm Helm チャートのデプロイ

1. [Wallarm chartリポジトリ](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. [ソリューションの構成](customization.md)を持つ`values.yaml`ファイルを作成します。

    **オープンソース**のKong Ingressコントローラと統合したWallarmサービスを実行するための最小構成のファイルの例:

    === "米国クラウド"
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
    === "EUクラウド"
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

    **エンタープライズ** Kong Ingressコントローラと統合したWallarmサービスを実行するための最小構成のファイルの例:

    === "米国クラウド"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```
    === "EUクラウド"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```  
    
    * `<NODE_TOKEN>` は、Wallarm Console UIからコピーしたWallarmノードのトークンです

        --8<-- "../include-ja/waf/installation/info-about-using-one-token-for-several-nodes.md"
    
    * `<KONG--LICENSE>` は [Kong  License](https://github.com/Kong/charts/blob/master/charts/kong/README.md#kong--license)です
1. Wallarm Helmチャートをデプロイします:

    ``` bash
    helm install --version 4.6.1 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` は Kong Ingress ControllerチャートのHelmリリースの名前です
    * `<KUBERNETES_NAMESPACE>` は Kong Ingress Controllerチャートを含むHelmリリースをデプロイするための新しい名前空間です
    * `<PATH_TO_VALUES>` は `values.yaml`ファイルへのパスです

### ステップ3: あなたのIngressでトラフィック分析を有効にする

デプロイされたソリューションがオープンソースのKong Ingressコントローラに基づいている場合、Wallarmモードを`monitoring`に設定してあなたのIngressに対するトラフィック分析を有効にします:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

ここで、`<KONG_INGRESS_NAME>`は、保護したいマイクロサービスへのAPI呼び出しをルーティングするK8s Ingressリソースの名前です。

エンタープライズKong Ingressコントローラについては、すべてのIngressリソースに対して監視モードのトラフィック分析がデフォルトで有効になっています。

### ステップ4: Wallarmサービスと統合したKong Ingress Controllerのテスト

Wallarmサービスと統合したKong Ingress Controllerが正しく動作していることを確認するために:

1. Wallarmポッドの詳細を取得して、正常に起動されたことを確認します:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    それぞれのポッドは次のように表示されます: **READY: N/N** と **STATUS: Running**、例えば以下のように:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingress Controllerサービスにテスト[Path Traversal][ptrav-attack-docs]攻撃を送信します:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Wallarmレイヤは**監視**[フィルタリングモード][available-filtration-modes-docs]で動作するので、Wallarmノードは攻撃をブロックせずに登録します。

    攻撃が登録されたことを確認するには、Wallarm Console → **Events**に進みます:

    ![インターフェースの中の攻撃][attacks-in-ui-image]

## カスタマイズ

Wallarmのポッドは、[デフォルトの`values.yaml`](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml)と、2ndデプロイメントステップで指定したカスタム設定に基づいて注入されています。

Kong API GatewayおよびWallarmの挙動をさらにカスタマイズし、 Wallarmを最大限に活用できます。

[Kong Ingress Controllerソリューションのカスタマイズガイド](customization.md)に進むだけです。