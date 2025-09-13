[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Kong Ingress Controller向けWallarmコネクタ

[Kong Ingress Controller](https://docs.konghq.com/kubernetes-ingress-controller/latest/)が管理するAPIを保護するために、WallarmはKubernetes環境へシームレスに統合できるコネクタを提供します。Wallarmフィルタリングノードをデプロイし、カスタムLuaプラグインでKongに接続すると、受信トラフィックがリアルタイムで解析され、サービスに到達する前にWallarmが悪意のあるリクエストを軽減できます。

Kong Ingress Controller向けWallarmコネクタがサポートするモードは[インライン](../inline/overview.md)のみです。

![Wallarmプラグインを使用したKong](../../images/waf-installation/gateways/kong/traffic-flow-inline.png)

## ユースケース

このソリューションは、Kong API Gatewayを実行するKong Ingress Controllerが管理するAPIの保護に推奨される構成です。

## 制限事項

このセットアップでは、Wallarmの詳細な調整はWallarm ConsoleのUI経由でのみ可能です。ファイルベースの設定を必要とする一部のWallarm機能は本実装ではサポートされません。例：

* [マルチテナンシー機能][multitenancy-overview]
* [アプリケーション設定][applications-docs]
* [カスタムブロッキングページとコード設定][custom-blocking-page-docs]

## 要件

デプロイを進める前に、次の要件を満たしていることを確認してください。

* Kong Ingress Controllerがデプロイされ、KubernetesクラスターでAPIトラフィックを管理していること
* [Helm v3](https://helm.sh/)パッケージマネージャー
* `https://us1.api.wallarm.com`（US Wallarm Cloud）または`https://api.wallarm.com`（EU Wallarm Cloud）へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス
* 攻撃検知ルールの更新をダウンロードし、さらに[許可リスト、拒否リスト、グレーリスト](../../user-guides/ip-lists/overview.md)に登録した国・地域・データセンターの正確なIPを取得するために、以下のIPアドレスへアクセスできること

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleへの**Administrator**アクセス
* Nodeインスタンスのドメインには信頼できるSSL/TLS証明書が必要です。自己署名証明書はサポートされていません。

## デプロイ

Kong Ingress Controllerが管理するAPIを保護するには、次の手順に従ってください。

1. WallarmフィルタリングノードをKubernetesクラスターにデプロイします。
1. Kong Ingress ControllerからWallarmフィルタリングノードへ受信トラフィックをルーティングして解析させるため、Wallarm Luaプラグインを入手してデプロイします。

### 1. Wallarm Native Nodeをデプロイする

WallarmノードをKubernetesクラスター内の独立したサービスとしてデプロイするには、[手順](../native-node/helm-chart.md)に従ってください。

### 2. Wallarm Luaプラグインを入手してデプロイする

1. Kong Ingress Controller用のWallarm Luaプラグインのコードを入手するため、[support@wallarm.com](mailto:support@wallarm.com)へご連絡ください。
1. プラグインコードでConfigMapを作成します：

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```

    `<KONG_NS>`はKong Ingress ControllerがデプロイされているNamespaceです。
1. Wallarm Luaプラグインを読み込むように、Kong Ingress Controllerの`values.yaml`を更新します：

    ```yaml
    gateway:
      plugins:
        configMaps:
        - name: kong-lua
          pluginName: kong-lua
    ```
1. Kong Ingress Controllerを更新します：

    ```
    helm upgrade --install <KONG_RELEASE_NAME> kong/ingress -n <KONG_NS> --values values.yaml
    ```
1. KongClusterPluginリソースを作成し、WallarmノードのServiceアドレスを指定して、Wallarm Luaプラグインを有効化します：

    ```yaml
    echo '
    apiVersion: configuration.konghq.com/v1
    kind: KongClusterPlugin
    metadata:
      name: kong-lua
      annotations:
        kubernetes.io/ingress.class: kong
    config:
      wallarm_node_address: "http://native-processing.wallarm-node.svc.cluster.local:5000"
    plugin: kong-lua
    ' | kubectl apply -f -
    ```

    `wallarm-node`はWallarmノードのServiceがデプロイされているNamespaceです。
1. 対象サービスでプラグインを有効化するため、IngressまたはGateway APIのルートに次のアノテーションを追加します：

    ```
    konghq.com/plugins: kong-lua
    kubernetes.io/ingress.class: kong
    ```

## テスト

デプロイしたコネクタの動作をテストするには、次の手順に従ってください。

1. WallarmのPodが起動していることを確認します：

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`はWallarmノードのServiceがデプロイされているNamespaceです。

    各Podのステータスは「STATUS: Running」または「READY: N/N」になっている必要があります。例：

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Kong GatewayのIPを取得します（通常はLoadBalancer Serviceとして構成されています）：

    ```
    export PROXY_IP=$(kubectl get svc --namespace <KONG_NS> <KONG_RELEASE_NAME>-gateway-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```
1. テスト用[パストラバーサル][ptrav-attack-docs]攻撃のリクエストをバランサーへ送信します：

    ```
    curl -H "Host: kong-lua-test.wallarm" $PROXY_IP/etc/passwd
    ```

    デフォルトではノードは[監視モード][available-filtration-modes]で動作しているため、Wallarmノードは攻撃をブロックせず、記録します。
1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。

    ![インターフェースのAttacks][attacks-in-ui-image]

## Wallarm Luaプラグインのアップグレード

デプロイ済みのWallarm Luaプラグインを[新しいバージョン](code-bundle-inventory.md#kong-api-gateway)にアップグレードするには：

1. Kong Ingress Controller用の最新のWallarm Luaプラグインコードを入手するため、support@wallarm.comへご連絡ください。
1. プラグインコードでConfigMapを更新します：

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```
    
    `<KONG_NS>`はKong Ingress ControllerがデプロイされているNamespaceです。

プラグインのアップグレードでは、特にメジャーバージョン更新時に、Wallarmノードのアップグレードが必要になる場合があります。リリース情報とアップグレード手順は、[Wallarm Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。将来のアップグレードを容易にし、非推奨による問題を避けるため、ノードを定期的に更新することを推奨します。