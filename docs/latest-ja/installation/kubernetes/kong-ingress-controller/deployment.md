# Wallarmサービス統合Kong Ingress Controllerのデプロイ

Kong API Gatewayで管理されるAPIを保護するため、KubernetesクラスタにWallarmサービスが統合されたKong Ingress Controllerをデプロイできます。  
このソリューションは、既定のKong API Gatewayの機能とリアルタイムの不正トラフィック軽減層が組み合わされています。

このソリューションは [Wallarm Helm chart](https://github.com/wallarm/kong-charts) をもとにデプロイします。

Wallarmサービス統合Kong Ingress Controllerの**主な特長**:

* リアルタイムの[攻撃検知と軽減][attack-detection-docs]
* [脆弱性検出][vulnerability-detection-docs]
* [API資産の検出][api-discovery-docs]
* Wallarmサービスはオープンソース版[Kong API Gateway](https://docs.konghq.com/gateway/latest/)にネイティブに統合されています
* このソリューションは、Kong API Gatewayの機能を完全にサポートする[公式Kong Ingress Controller for Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/)をベースにしています
* Kong API Gateway 3.1.xをサポートしています
* Wallarm Console UIおよびIngressごとのアノテーションによるWallarm層の微調整が可能です

!!! warning "アノテーションのサポート"
    Ingressアノテーションは、オープンソース版Kong Ingress Controllerに基づくソリューションのみサポートされます。[サポートされるアノテーションの一覧は限定されています](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition)。

* postanalyticsモジュールのための専用エンティティを提供します。このモジュールは、ソリューションのローカルデータ解析バックエンドとして大部分のCPUリソースを消費します。

## ユースケース

サポートされるすべての[Wallarmデプロイメントオプション][deployment-platform-docs]の中で、本ソリューションは以下の**ユースケース**に推奨されます:

* Ingressコントローラやセキュリティレイヤが、Kongで管理されるIngressリソースへのトラフィックのルーティングを担当していない場合です。
* オープンソース版の公式Kong Ingress Controllerを使用しており、ご利用のテクノロジースタックと互換性のあるセキュリティソリューションをお探しの場合です。

    現在デプロイされているKong Ingress Controllerの設定を新しいデプロイメントに移行するだけで、これらの手順が説明するものにシームレスに置き換えることができます。

## ソリューションのアーキテクチャ

本ソリューションは以下のアーキテクチャとなっております:

![Solution architecture][kong-ing-controller-scheme]

本ソリューションは公式Kong Ingress Controllerをベースにしており、そのアーキテクチャは[公式Kongドキュメント](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/)に記載されています。

Wallarmサービス統合Kong Ingress Controllerは、以下のDeploymentオブジェクトによって構成されます:

* **Ingress controller** (`wallarm-ingress-kong`) は、Helm chartのvaluesに基づいてK8sクラスタにKong API GatewayおよびWallarmリソースを注入し、ノードコンポーネントをWallarm Cloudに接続します。
* **Postanalytics module** (`wallarm-ingress-kong-wallarm-tarantool`) は本ソリューションのローカルデータ解析バックエンドです。このモジュールは、インメモリーストレージのTarantoolおよびcollectd、attack export servicesなどのヘルパーコンテナ群を使用します。

## 制限事項

以下のWallarm機能は利用できません:

* [カスタムブロッキングページおよびコード設定][custom-blocking-page-docs]
* [認証情報の詰め込み検出][cred-stuffing-detection]

## 要件

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

## デプロイ

Wallarmサービスが統合されたKong Ingress Controllerをデプロイする手順は以下の通りです:

1. Wallarmノードを作成します.
1. Kong Ingress ControllerおよびWallarmサービスを含むWallarm Helm chartをデプロイします.
1. Ingressに対してトラフィック解析を有効にします.
1. Wallarmサービス統合Kong Ingress Controllerの動作をテストします.

### ステップ 1: Wallarmノードの作成

1. 以下のリンクを使用し、Wallarm Console → **Nodes** を開きます:

    * US Cloudの場合は https://us1.my.wallarm.com/nodes
    * EU Cloudの場合は https://my.wallarm.com/nodes
1. **Wallarm node** タイプのフィルタリングノードを作成し、生成されたトークンをコピーします.
    
    ![Creation of a Wallarm node][create-wallarm-node-img]

### ステップ 2: Wallarm Helm chartのデプロイ

1. [Wallarm chart repository](https://charts.wallarm.com/)を追加します:
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. [solution configuration](customization.md)を使用して`values.yaml`ファイルを作成します.

    Wallarmサービスが統合された**Open-Source** Kong Ingress Controllerを稼働するための最小構成のファイル例:

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
            
    `<NODE_TOKEN>`はWallarm Console UIからコピーしたWallarmノードのトークンです

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"

1. Wallarm Helm chartをデプロイします:

    ``` bash
    helm install --version 4.6.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はKong Ingress Controller chartのHelmリリース名です
    * `<KUBERNETES_NAMESPACE>`はKong Ingress Controller chartのHelmリリースをデプロイする新しいnamespaceです
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルのパスです

### ステップ 3: Ingressに対してトラフィック解析を有効にする

デプロイされたソリューションがオープンソース版Kong Ingress Controllerに基づく場合、Wallarmモードを`monitoring`に設定してIngressに対してトラフィック解析を有効にします:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

ここで、`<KONG_INGRESS_NAME>`は保護対象のマイクロサービスへのAPI呼び出しをルーティングするK8s Ingressリソースの名前です.

### ステップ 4: Wallarmサービス統合Kong Ingress Controllerの動作テスト

Wallarmサービス統合Kong Ingress Controllerが正しく動作していることを確認するため、以下を実行します:

1. Wallarmポッドの詳細を取得し、正常に開始されていることを確認します:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    各ポッドについて、**READY: N/N**と**STATUS: Running**と表示される必要があります。例:
    
    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Kong Ingress Controller Serviceに対してテスト用の[ディレクトリ横断攻撃][ptrav-attack-docs]を送信します:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Wallarm層は**monitoring**の[フィルトレーションモード][available-filtration-modes-docs]で動作しているため、Wallarmノードは攻撃をブロックせずに記録します.

    攻撃が記録されたことを確認するには、Wallarm Console → **Attacks**に進みます:
    
    ![Attacks in the interface][attacks-in-ui-image]

## カスタマイズ

Wallarmポッドは[デフォルト `values.yaml`](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml)および第2ステップで指定したカスタム構成に基づいて注入されています.  
Kong API GatewayとWallarmの動作をさらに細かくカスタマイズし、企業向けにWallarmを最大限に活用可能です.  
詳細は[カスタマイズガイド](customization.md)をご参照ください.