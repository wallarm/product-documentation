# 統合Wallarmサービス付きNGINX Ingress Controllerのデプロイ

本手順は、K8sクラスターにWallarm NGINXベースのIngress Controllerをデプロイする手順を提供します。ソリューションはWallarm Helmチャートからデプロイされます。

本ソリューションは、Wallarmサービスが統合された[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)をベースに構築されています。最新バージョンでは、Community Ingress NGINX Controller 1.11.3およびNGINX stable 1.25.5が使用されています。

以下のアーキテクチャとなります。

![Solution architecture][nginx-ing-image]

## ユースケース

全てのサポートされている[Wallarmのデプロイオプション][deployment-platform-docs]の中で、このソリューションは以下の**ユースケース**に対して推奨されます：

* Ingress Controllerが存在せず、[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)に対応するIngressリソースにトラフィックをルーティングするセキュリティレイヤーが存在しない場合。
* 現在Community Ingress NGINX Controllerを使用しており、標準のController機能と強化されたセキュリティ機能を両立するセキュリティソリューションを探している場合。本手順に記載のWallarm-NGINX Ingress Controllerに簡単に切り替えることが可能です。既存の設定を新たなデプロイメントに移行することで、入れ替えが完了します。

    既存のIngress ControllerとWallarm Controllerを同時に使用する場合は、設定の詳細について[Ingress Controllerチェーンガイド][chaining-doc]をご参照ください。

## 必要条件

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "関連情報"
    * [Ingressとは何か？](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Helmのインストール](https://helm.sh/docs/intro/install/)

## 既知の制限事項

* postanalyticsモジュールなしでの動作はサポートされません。 
* postanalyticsモジュールのスケールダウンにより、攻撃データが部分的に欠落する可能性があります。

## インストール

1. [Wallarm Ingress Controllerをインストール](#step-1-installing-the-wallarm-ingress-controller)します。
2. Ingressに対して[トラフィック分析を有効化](#step-2-enabling-traffic-analysis-for-your-ingress)します。
3. Wallarm Ingress Controllerの動作を[確認](#step-3-checking-the-wallarm-ingress-controller-operation)します。 

### Step 1: Wallarm Ingress Controllerのインストール

Wallarm Ingress Controllerをインストールするには、以下の手順に従います。

1. [該当するタイプ][node-token-types]のフィルタリングノードトークンを生成します。

    === "API token (Helm chart 4.6.8 and above)"
        1. Wallarm Consoleの**Settings** → **API tokens**を、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます。
        1. `Deploy`ソースロールを持つAPI tokenを見つけるか、作成します。
        1. このトークンをコピーします。
    === "Node token"
        1. Wallarm Consoleの**Nodes**を、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で開きます。
        1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
            
            ![Creation of a Wallarm node][nginx-ing-create-node-img]
1. Wallarm Ingress Controllerを含むHelmチャートをデプロイするため、Kubernetesのnamespaceを作成します。

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. [Wallarmチャートリポジトリ](https://charts.wallarm.com/)を追加します。
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

1. [Wallarm設定][configure-nginx-ing-controller-docs]を記載した`values.yaml`ファイルを作成します。最小構成の例は以下の通りです。

    API tokenを使用する場合は、`nodeGroup`パラメータにノードグループ名を指定してください。ノードはこのグループに割り当てられ、Wallarm Consoleの**Nodes**セクションに表示されます。デフォルトのグループ名は`defaultIngressGroup`です。

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    また、WallarmノードトークンをKubernetes Secretsに保存してHelmチャートで参照することもできます。[詳細はこちら][controllerwallarmexistingsecret-docs]

    !!! info "Deployment from your own registries"    
        `values.yaml`ファイルの要素を上書きすることで、[自社レジストリ](#deployment-from-your-own-registries)に保存されたイメージからWallarm Ingress Controllerをインストールすることができます。

1. Wallarmパッケージをインストールします。

    ``` bash
    helm install --version 5.3.0 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`はIngress ControllerチャートのHelmリリース名です。
    * `<KUBERNETES_NAMESPACE>`はWallarm Ingress Controllerを含むHelmチャート用に作成したKubernetes namespaceです。
    * `<PATH_TO_VALUES>`は`values.yaml`ファイルへのパスです。

### Step 2: Ingressに対するトラフィック分析の有効化

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application="<APPLICATION_ID>"
```
* `<YOUR_INGRESS_NAME>`はIngressの名前です。
* `<YOUR_INGRESS_NAMESPACE>`はIngressのnamespaceです。
* `<APPLICATION_ID>`は、それぞれの[アプリケーションまたはアプリケーショングループ][application-docs]に固有の正の数です。これにより、個別の統計情報取得や、対応するアプリケーションを対象とした攻撃の識別が可能になります。

### Step 3: Wallarm Ingress Controllerの動作確認

1. Podのリストを取得します。
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    各Podは**STATUS: Running**および**READY: N/N**と表示される必要があります。例:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. テスト用の[Path Traversal][ptrav-attack-docs]攻撃を含むリクエストをIngress Controller Serviceに送信します。

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    フィルタリングノードが`block`モードで動作している場合、リクエストのレスポンスとして`403 Forbidden`が返され、Wallarm Consoleの**Attacks**セクションに攻撃が表示されます。

## ARM64デプロイメント

NGINX Ingress ControllerのHelmチャートバージョン4.8.2より、ARM64プロセッサとの互換性が導入されました。初期はx86アーキテクチャ向けに設定されていましたが、ARM64ノードでのデプロイはHelmチャートパラメータの変更が必要です。

ARM64環境では、Kubernetesノードに`arm64`ラベルが付与されることが多いため、Wallarmワークロードを適切なノードタイプに割り当てるため、Helmチャート設定内で`nodeSelector`、`tolerations`、またはaffinityルールを参照してください。

以下は、Google Kubernetes Engine（GKE）向けのWallarm Helmチャートの例です。該当ノードには`kubernetes.io/arch: arm64`ラベルが利用されています。このテンプレートは、他のクラウド環境におけるARM64のラベリング規則に合わせて変更可能です。

=== "nodeSelector"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
      admissionWebhooks:
        nodeSelector:
          kubernetes.io/arch: arm64
        patch:
          nodeSelector:
            kubernetes.io/arch: arm64
      wallarm:
        tarantool:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```
=== "tolerations"
    ```yaml
    controller:
      tolerations:
        - key: kubernetes.io/arch
          operator: Equal
          value: arm64
          effect: NoSchedule
      admissionWebhooks:
        patch:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
      wallarm:
        tarantool:
          tolerations:
            - key: kubernetes.io/arch
              operator: Equal
              value: arm64
              effect: NoSchedule
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com" # if using EU Cloud, comment out this line
        # If using an API token, uncomment the following line and specify your node group name
        # nodeGroup: defaultIngressGroup
    ```

## 自社レジストリからのデプロイ

何らかの理由でWallarmパブリックリポジトリからDockerイメージを取得できない場合（例えば、社内セキュリティポリシーにより外部リソースの使用が制限されている場合）、代替として以下を行うことが可能です：

1. これらのイメージを自社のプライベートレジストリにクローンします。
1. 自社レジストリに保存されたイメージを使用して、Wallarm NGINXベースのIngress Controllerをインストールします。

HelmチャートでNGINXベースのIngress Controllerのデプロイメントに使用されるDockerイメージは、以下の通りです：

* [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
* [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)

自社レジストリに保存されたイメージを使用してWallarm NGINXベースのIngress Controllerをインストールするには、Wallarm Ingress Controller Helmチャートの`values.yaml`ファイルを上書きしてください：

```yaml
controller:
  image:
    ## The image and tag for wallarm nginx ingress controller
    ##
    registry: <YOUR_REGISTRY>
    image: wallarm/ingress-controller
    tag: <IMAGE_TAG>
  wallarm:
    helpers:
      ## The image and tag for the helper image
      ##
      image: <YOUR_REGISTRY>/wallarm/node-helpers
      tag: <IMAGE_TAG>
```

その後、修正済みの`values.yaml`を使用してインストールを実行してください。

## 設定

Wallarm Ingress Controllerのインストールおよび動作確認が完了した後、以下のような高度な設定を行うことができます：

* [エンドユーザ公開IPアドレスの適切な報告][best-practices-for-public-ip]
* [IPアドレスブロックの管理][ip-lists-docs]
* [高可用性に関する考慮事項][best-practices-for-high-availability]
* [Ingress Controllerのモニタリング][best-practices-for-ingress-monitoring]

高度な設定に使用されるパラメータや詳細な手順については、[こちらのリンク][configure-nginx-ing-controller-docs]を参照してください。