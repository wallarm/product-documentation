[ip-list-docs]: ../../../user-guides/ip-lists/overview.md
[deployment-platform-docs]: ../../../installation/supported-deployment-options.md

# Wallarmサービス統合付きNGINX Ingressコントローラのデプロイ

この手順は、K8sクラスタにWallarm NGINXベースのIngressコントローラをデプロイするためのステップを提供します。このソリューションでは、統合されたWallarmサービスを備えた[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)のデフォルト機能を使用します。

このソリューションのアーキテクチャは次のとおりです：

![!Solution architecture](../../../images/waf-installation/kubernetes/nginx-ingress-controller.png)

このソリューションは、WallarmのHelmチャートからデプロイされます。

## ユースケース

すべてのサポートされている[Wallarm deployment options](../../../installation/supported-deployment-options.md)の中で、このソリューションは以下の**ユースケース**に推奨されます。

* [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)と互換性のあるIngressリソースへのトラフィックをルーティングするIngressコントローラとセキュリティレイヤーが存在していません。
* お客様の技術スタックと互換性のあるセキュリティソリューションを求めて、[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)を使用しています。

    これらの指示に記述されているものとNGINX Ingressコントローラをシームレスに置き換えることができます。ただし、新しいデプロイメントに設定を移動するだけで済みます。

## 要件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "参照してください"
    * [What is Ingress?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Installation of Helm](https://helm.sh/docs/intro/install/)

## 既知の制限事項

* postanalyticsモジュールなしでの操作はサポートされていません。
* postanalyticsモジュールをスケールダウンさせると、攻撃データの一部が失われる可能性があります。

## インストール

1. Wallarm Ingressコントローラを[インストール](#step-1-installing-the-wallarm-ingress-controller)します。
2. あなたのIngressの[トラフィック解析を有効化](#step-2-enabling-traffic-analysis-for-your-ingress)します。
3. Wallarm Ingressコントローラの操作を[確認](#step-3-checking-the-wallarm-ingress-controller-operation)します。

### ステップ1: Wallarm Ingressコントローラのインストール

1. 下記のリンクからWallarm Console → **Nodes**に移動します:
    * US Cloudの場合：https://us1.my.wallarm.com/nodes
    * EU Cloudの場合：https://my.wallarm.com/nodes
1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
    
    ![!Wallarm nodeの作成](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Wallarm IngressコントローラのHelmチャートをデプロイするためのKubernetesの名前空間を作成します：

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. 下記の[Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します：
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
4. [Wallarm設定](../../../admin-en/configure-kubernetes-en.md)を記述した`values.yaml`ファイルを作成します。

    最小限の設定を記述したファイルの例：

    === "US クラウド"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
        ```
    === "EU クラウド"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
        ```    
    
    Helmチャートバージョン4.4.1から、WallarmノードトークンをKubernetesシークレットに保存し、Helmチャートに反映することもできます。[詳細](../../../admin-en/configure-kubernetes-en.md#controllerwallarmexistingsecret)
    
    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Wallarmパッケージをインストールします：

    ``` bash
    helm install --version 4.6.5 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はIngressコントローラチャートのHelmリリースのための名前です
    * `<KUBERNETES_NAMESPACE>`は、Wallarm IngressコントローラのHelmチャート用に作成したKubernetesの名前空間です
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです

### ステップ2: あなたのIngressのトラフィック解析を有効にする

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application=<APPLICATION>
```
* `<YOUR_INGRESS_NAME>`はあなたのIngressの名前です
* `<YOUR_INGRESS_NAMESPACE>`はあなたのIngressの名前空間です
* `<APPLICATION>`は、[あなたのアプリケーションまたはアプリケーショングループ](../../../user-guides/settings/applications.md)それぞれにユニークな正の数です。これにより、別々の統計情報を得ることができ、対応するアプリケーションを対象とした攻撃を区別することができます。

### ステップ3: Wallarm Ingressコントローラの動作を確認する

1. ポッドのリストを取得します：
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各ポッドには次の情報が表示されます。**STATUS：実行中**および**READY：N/N**です。例えば：

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. Ingress Controller Serviceにテスト[パストラバーサル](../../../attacks-vulns-list.md#path-traversal)攻撃のリクエストを送信します：

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、要求への応答に`403 Forbidden`コードが返され、攻撃はWallarm Console → **Events**に表示されます。

## 設定

Wallarm Ingressコントローラが正常にインストールおよび確認された後、ソリューションに対して次のような高度な設定を行うことができます：

* [エンドユーザの公開IPアドレスの適切なレポート](../../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
* [IPアドレスのブロック管理](../../../user-guides/ip-lists/overview.md)
* [高可用性に関する考察](../../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
* [Ingress Controllerの監視](../../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)

高度な設定と適切な指示のために使用されるパラメータを見つけるには、[リンク](../../../admin-en/configure-kubernetes-en.md)をご覧ください。