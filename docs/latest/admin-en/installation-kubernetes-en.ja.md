[ip-list-docs]: ../user-guides/ip-lists/overview.md
[deployment-platform-docs]: ../installation/supported-deployment-options.md

# Wallarmサービスを統合したNGINX Ingressコントローラのインストール

この手順では、Wallarmを使用するNGINXベースのIngressコントローラをK8sクラスタにデプロイする方法を説明しています。このソリューションは、[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)のデフォルトの機能と統合されたWallarmサービスが含まれています。

ソリューションはWallarmのHelmチャートからデプロイされます。

## ユースケース

すべてのサポートされる[Wallarm展開オプション](../installation/supported-deployment-options.md)の中で、このソリューションは以下の**ユースケース**において推奨されるものです。

* [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)と互換性のあるIngressリソースにトラフィックをルーティングするIngressコントローラやセキュリティレイヤがない
* 開発技術スタックと互換性のあるセキュリティソリューションを探している[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)を使用している。

    これらの手順で説明されている新しいデプロイメントに設定を移動するだけで、デプロイされたNGINX Ingressコントローラをシームレスに置き換えることができます。

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.ja.md"

!!! info "参照"
    * [Ingressとは？](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helmのインストール](https://helm.sh/docs/intro/install/)

## 既知の制限事項

* postanalyticsモジュールなしでの運用はサポートされていません。 
* postanalyticsモジュールのスケールダウンにより、攻撃データの一部が損失する可能性があります。

## インストール

1. [Wallarm Ingressコントローラをインストール](#step-1-installing-the-wallarm-ingress-controller)します。
2. [Ingressでトラフィック分析を有効に](#step-2-enabling-traffic-analysis-for-your-ingress)します。
3. [Wallarm Ingressコントローラの動作を確認](#step-3-checking-the-wallarm-ingress-controller-operation)します。 

### ステップ1：Wallarm Ingressコントローラのインストール

1. 以下のリンクからWallarm Console → **Nodes** にアクセスします。
    * https://us1.my.wallarm.com/nodes（米国 クラウド用）
    * https://my.wallarm.com/nodes（EU クラウド用）
1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーしてください。
    
    ![!Wallarm nodeの作成](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Wallarm Ingressコントローラを含むHelmチャートをデプロイするためのKubernetesの名前空間を作成します：

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します：
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
4. [Wallarm設定](configure-kubernetes-en.md)を含む`values.yaml`ファイルを作成します。

    最小構成のファイルの例：

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
    
    Helmチャートのバージョン4.4.1から、WallarmノードのトークンをKubernetesシークレットに保存し、Helmチャートに引っ張ってくることができます。[詳細はこちら](configure-kubernetes-en.md#controllerwallarmexistingsecret)
    
    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.ja.md"
1. Wallarmパッケージをインストールします：

    ``` bash
    helm install --version 4.4.8 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`は、IngressコントローラチャートのHelmリリース名です
    * `<KUBERNETES_NAMESPACE>`は、Wallarm Ingressコントローラを含むHelmチャート用に作成したKubernetesの名前空間です
    * `<PATH_TO_VALUES>`は、`values.yaml`ファイルへのパスです

### ステップ2：Ingressでトラフィック分析を有効にする

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application=<APPLICATION>
```
* `<YOUR_INGRESS_NAME>`は、Ingressの名前です
* `<YOUR_INGRESS_NAMESPACE>`は、Ingressの名前空間です
* `<APPLICATION>`は、[アプリケーションまたはアプリケーショングループ](../user-guides/settings/applications.md)ごとに固有の正の数です。これにより、個別の統計を取得し、対応するアプリケーションに対する攻撃を区別することができます

### ステップ3：Wallarm Ingressコントローラの動作を確認する

1. Podの一覧を取得します：
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各Podには次のように表示される必要があります：**STATUS：Running** および **READY：N / N**。 例：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. テスト[Path Traversal](../attacks-vulns-list.md#path-traversal)攻撃を含むリクエストをIngress Controller Serviceに送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、リクエストの応答に`403 Forbidden`のコードが返され、攻撃がWallarm Console → **イベント**に表示されます。

## 設定

Wallarm Ingressコントローラが正常にインストールされ確認された後、ソリューションに対して高度な設定を行うことができます。

* [エンドユーザーの公開IPアドレスを適切に報告する](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
* [IPアドレスのブロック管理](../user-guides/ip-lists/overview.md)
* [高可用性に関する考慮事項](configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
* [Ingressコントローラの監視](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)

高度な設定に使用されるパラメータや適切な手順を見つけるには、[リンク](configure-kubernetes-en.md)をご覧ください。