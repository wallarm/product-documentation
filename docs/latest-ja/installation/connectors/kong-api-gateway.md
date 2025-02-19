[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Kong Ingress Controller用Wallarmコネクタ

Kong Ingress Controllerによって管理されるAPIを保護するために、WallarmはKubernetes環境にシームレスに統合できるコネクタを提供します。Wallarmフィルタリングノードをデプロイし、カスタムLuaプラグインを介してKongに接続することで、着信トラフィックをリアルタイムに解析し、悪意のあるリクエストがサービスに到達する前にWallarmが軽減できるようにします。

Kong Ingress Controller用Wallarmコネクタは[in-line](../inline/overview.md)モードのみサポートします：

![Kong with Wallarm plugin](../../images/waf-installation/gateways/kong/traffic-flow-inline.png)

## ユースケース

サポートされているすべての[Wallarmのデプロイメントオプション](../supported-deployment-options.md)の中で、このソリューションはKong API Gatewayを実行しているKong Ingress Controllerによって管理されるAPIを保護するために推奨します。

## 制限事項

本セットアップではWallarmの微調整はWallarm Console UI経由でのみ可能です。この実装では、ファイルベースの設定を必要とするWallarmの一部の機能はサポートしていません。例えば：

* [マルチテナンシー機能][multitenancy-overview]
* [アプリケーション設定][applications-docs]
* [カスタムブロッキングページとコード設定][custom-blocking-page-docs]

## 要件

デプロイを進めるには、次の要件を満たしていることを確認してください：

* KubernetesクラスターにKong Ingress Controllerがデプロイされ、APIトラフィックを管理していること
* [Helm v3](https://helm.sh/)パッケージマネージャー
* `https://us1.api.wallarm.com`（US Wallarm Cloud）または`https://api.wallarm.com`（EU Wallarm Cloud）にアクセス可能であること
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`にアクセス可能であること
* Docker HubのWallarmリポジトリ`https://hub.docker.com/r/wallarm`にアクセス可能であること
* 攻撃検出ルールの更新のダウンロード、および[許可リスト、拒否リスト、またはグレイリスト](../../user-guides/ip-lists/overview.md)に指定された国、地域、またはデータセンターの正確なIPアドレスを取得するために、以下のIPアドレスにアクセス可能であること

    --8<-- "../include/wallarm-cloud-ips.md"
* **Administrator**アクセスがあり、[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleにアクセス可能であること

## デプロイメント

Kong Ingress Controllerによって管理されるAPIを保護するために、以下の手順に従ってください：

1. KubernetesクラスターにWallarmフィルタリングノードサービスをデプロイします。
1. Kong Ingress Controllerからの着信トラフィックをWallarmフィルタリングノードにルーティングして解析するために、Wallarm Luaプラグインを入手しデプロイします。

### 1. Wallarm Native Nodeのデプロイ

WallarmノードをKubernetesクラスター上の別個のサービスとしてデプロイするには、[手順](../native-node/helm-chart.md)に従ってください。

### 2. Wallarm Luaプラグインの入手とデプロイ

1. Kong Ingress Controller用のWallarm Luaプラグインコードを入手するために[support@wallarm.com](mailto:support@wallarm.com)に連絡してください。
1. プラグインコードを含むConfigMapを作成してください：

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```

    `<KONG_NS>`はKong Ingress Controllerがデプロイされているnamespaceです。
1. Kong Ingress Controller用の`values.yaml`ファイルを更新し、Wallarm Luaプラグインのロードを設定してください：

    ```yaml
    gateway:
      plugins:
        configMaps:
        - name: kong-lua
          pluginName: kong-lua
    ```
1. Kong Ingress Controllerをアップグレードしてください：

    ```
    helm upgrade --install <KONG_RELEASE_NAME> kong/ingress -n <KONG_NS> --values values.yaml
    ```
1. `KongClusterPlugin`リソースを作成し、Wallarmノードサービスのアドレスを指定することで、Wallarm Luaプラグインを有効にしてください：

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

    `wallarm-node`はWallarmノードサービスがデプロイされているnamespaceです。
1. 選択したサービスに対してプラグインを有効にするため、IngressまたはGateway APIルートに以下の注釈を追加してください：

    ```
    konghq.com/plugins: kong-lua
    kubernetes.io/ingress.class: kong
    ```

## テスト

デプロイされたコネクタの機能をテストするため、以下の手順に従ってください：

1. Wallarmポッドが正常に稼働していることを確認してください：

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node`はWallarmノードサービスがデプロイされているnamespaceです。

    各ポッドのステータスは**STATUS: Running**または**READY: N/N**である必要があります。例えば：

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. `Kong Gateway` IPを取得してください（通常、`LoadBalancer`サービスとして構成されます）：

    ```
    export PROXY_IP=$(kubectl get svc --namespace <KONG_NS> <KONG_RELEASE_NAME>-gateway-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```
1. テスト用の[Path Traversal][ptrav-attack-docs]攻撃を使用して、ロードバランサーにリクエストを送信してください：

    ```
    curl -H "Host: kong-lua-test.wallarm" $PROXY_IP/etc/passwd
    ```

    ノードはデフォルトで[monitoring mode][available-filtration-modes]で動作するため、Wallarmノードは攻撃をブロックするのではなく登録します。
1. Wallarm Consoleの→ **Attacks** セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃がリストに表示されていることを確認してください。

    ![Attacks in the interface][attacks-in-ui-image]

## Wallarm Luaプラグインのアップグレード

デプロイされたWallarm Luaプラグインを[newer version](code-bundle-inventory.md#kong-api-gateway)にアップグレードするには：

1. Kong Ingress Controller用の更新されたWallarm Luaプラグインコードを入手するため、support@wallarm.comに連絡してください。
1. プラグインコードを含むConfigMapを更新してください：

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```
    
    `<KONG_NS>`はKong Ingress Controllerがデプロイされているnamespaceです。

プラグインのアップグレードには、特にメジャーバージョンの更新の場合、Wallarmノードのアップグレードが必要になることがあります。リリースの更新およびアップグレード手順については[Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。非推奨を回避し、将来のアップグレードを簡素化するために、定期的なノードの更新を推奨します。