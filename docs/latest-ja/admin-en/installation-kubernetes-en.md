# Wallarmサービス統合付きのNGINX Ingressコントローラのデプロイ

この手順書では、K8sクラスタへのWallarm NGINXベースのIngressコントローラのデプロイ手順を提供します。ソリューションは、統合されたWallarmサービスを備えた[Community Ingress NGINXコントローラ](https://github.com/kubernetes/ingress-nginx)のデフォルト機能を活用しています。

そのソリューションのアーキテクチャは以下の通りです：

![ソリューションのアーキテクチャ][nginx-ing-image]

ソリューションはWallarm Helmチャートからデプロイされます。

## ユースケース

全てのサポート対象の[Wallarmのデプロイオプション][deployment-platform-docs]の中で、以下の**ユースケース**に対して本ソリューションが推奨されます：

* Ingressリソースと[Community Ingress NGINXコントローラ](https://github.com/kubernetes/ingress-nginx)と互換性のあるトラフィックをルーティングするIngressコントローラおよびセキュリティレイヤが存在しない。
* [Community Ingress NGINXコントローラ](https://github.com/kubernetes/ingress-nginx)を使用しており、自身の技術スタックと互換性のあるセキュリティソリューションを探している。

    これらの手順書で説明されているものと、デプロイされたNGINX Ingressコントローラをシームレスに置き換えることが可能です。新たなデプロイに設定を移動するだけです。

## 要件

--8<-- "../include-ja/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "参照"
    * [Ingressとは何ですか？](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helmのインストール](https://helm.sh/docs/intro/install/)

## 既知の制限事項

* postanalyticsモジュールなしの操作はサポートされていません。
* postanalyticsモジュールをスケールダウンすると、攻撃データの一部の損失が発生する可能性があります。

## インストール

1. [Wallarm Ingressコントローラのインストール](#ステップ1-wallarm-ingress-コントローラのインストール)
2. [Ingressに対するトラフィック分析の有効化](#ステップ2-Ingressに対するトラフィック分析の有効化)
3. [Wallarm Ingressコントローラ操作の確認](#ステップ3-wallarm-ingress-コントローラ操作の確認)

### ステップ1: Wallarm Ingressコントローラのインストール

1. 以下のリンクからWallarm Console → **ノード**に移動します：
   * US Cloudの場合：https://us1.my.wallarm.com/nodes
   * EU Cloudの場合：https://my.wallarm.com/nodes
2. **Wallarmノード**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。

    ![Wallarmノード作成][nginx-ing-create-node-img]
3. Wallarm Ingressコントローラを備えたHelmチャートをデプロイするためのKubernetesの名前空間を作成します：

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
4. [Wallarmのチャートリポジトリ](https://charts.wallarm.com/)を追加します：
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
4. [Wallarmの設定][configure-nginx-ing-controller-docs]を含む`values.yaml`ファイルを作成します。

    最小限設定のファイル例は以下の通りです：

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
        ```    

    Helmチャートのバージョン4.4.1から、Kubernetes secretsにWallarmノードトークンを保存し、Helmチャートにプルすることも可能です。[詳しくはこちら][controllerwallarmexistingsecret-docs]
    
    --8<-- "../include-ja/waf/installation/info-about-using-one-token-for-several-nodes.md"
5. Wallarmパッケージをインストールします：

    ``` bash
    helm install --version 4.6.8 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はIngressコントローラチャートのHelmリリース名
    * `<KUBERNETES_NAMESPACE>`はWallarm Ingressコントローラを備えたHelmチャート用に作成したKubernetesの名前空間
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパス

### ステップ2: Ingressに対するトラフィック分析の有効化

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>`はIngressの名前
* `<YOUR_INGRESS_NAMESPACE>`はIngressの名前空間
* `<APPLICATION>`は各[アプリケーションまたはアプリケーショングループ][application-docs]ごとに一意になる正の数値。これにより、個別の統計を取得し、対応するアプリケーションに向けられた攻撃を区別することができます。

### ステップ3: Wallarm Ingressコントローラ操作の確認

1. ポッドのリストを取得します：
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各ポッドは以下の状態を示すべきです： **STATUS: Running**と**READY: N/N**。例：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. Ingress Controller Serviceにテスト[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストを送信します：
   
    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、リクエストへの応答で`403 Forbidden`コードが返り、攻撃はWallarm Console → **Events**で表示されます。

## 設定

Wallarm Ingressコントローラが正常にインストールされ、チェックされた後で、ソリューションに対して以下のような詳細な設定を行うことが可能です：

* [エンドユーザの公開IPアドレスの適切な報告][best-practices-for-public-ip]
* [IPアドレスのブロック管理][ip-lists-docs]
* [高可用性についての考慮点][best-practices-for-high-availability]
* [Ingress Controllerのモニタリング][best-practices-for-ingress-monitoring]

詳細設定用のパラメータと適切な指示を見つけるためには、[こちらのリンク][configure-nginx-ing-controller-docs]を参照してください。