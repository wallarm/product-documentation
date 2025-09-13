[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[ptrav-attack-docs]:                     ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:                   ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:                  ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:                ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[api-token]:                             ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]:  ../connectors/self-hosted-node-conf/helm-chart.md

# DockerイメージからNative Nodeをデプロイする

NGINXに依存せずに動作する[Wallarm Native Node](../nginx-native-node-internals.md)は、一部のコネクタと組み合わせてのデプロイを想定して設計されています。公式DockerイメージからNative Nodeを起動し、コンテナ化されたサービス上で実行できます。

## ユースケース

* 自己ホスト型のLinux OSマシン上で、MuleSoft [Mule](../connectors/mulesoft.md)または[Flex](../connectors/mulesoft-flex.md) Gateway、[Akamai](../connectors/akamai-edgeworkers.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)、[Fastly](../connectors/fastly.md)、[IBM DataPower](../connectors/ibm-api-connect.md)向けのコネクタソリューションの一部としてWallarmノードをデプロイする場合。

    インストーラーを`connector-server`モードで使用します。
* Istioで管理されるAPI向けに[gRPCベースの外部処理フィルタ](../connectors/istio.md)が必要な場合。
    
    インストーラーを`envoy-external-filter`モードで使用します。

Native Node用のDockerイメージは、AWS ECSなどのコンテナオーケストレーションプラットフォームや、その他のDockerベース環境をすでに利用している場合に最適です。Wallarmノードはサービス内でDockerコンテナとして実行され、API管理プラットフォーム向けのセキュリティフィルタリングとトラフィック検査を提供します。

## 要件

* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされていること
* API管理プラットフォームからコンテナ化環境へのインバウンドアクセス
* コンテナ化環境から以下へのアウトバウンドアクセス:

    * デプロイに必要なDockerイメージをダウンロードするための`https://hub.docker.com/r/wallarm`
    * US/EUのWallarm Cloud向けの`https://us1.api.wallarm.com`または`https://api.wallarm.com`
    * 攻撃検知ルールや[API specifications][api-spec-enforcement-docs]の更新ダウンロード、さらに[allowlisted, denylisted, or graylisted][ip-list-docs]の国・地域・データセンターに対する正確なIPの取得のための、以下のIPアドレス

        --8<-- "../include/wallarm-cloud-ips.md"
* Native Nodeを実行するECSインスタンスの前段にあるロードバランサーには、信頼できるSSL/TLS証明書が必要です
* 併せて、Wallarm ConsoleでAdministratorロールが付与されている必要があります

## 制限事項

* ロードバランサーの保護に自己署名SSL証明書は使用できません。
* [カスタムブロッキングページとブロッキングコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)の構成はまだサポートされていません。
* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートされていません。
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません。

## デプロイ

### 1. Dockerイメージを取得します

```
docker pull wallarm/node-native-aio:0.17.1
```

### 2. 設定ファイルを準備します

Native Node用の最小構成で`wallarm-node-conf.yaml`ファイルを作成します:

=== "connector-server"
    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
    ```
=== "envoy-external-filter"
    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5080"
      tls_cert: "/path/to/cert.crt"
      tls_key: "/path/to/cert.key"
    ```

[すべての設定パラメータ](all-in-one-conf.md)（DockerイメージとNative Nodeのall-in-oneインストーラーで同一です）

### 3. Wallarmトークンを準備します

ノードをインストールするには、Wallarm Cloudにノードを登録するためのトークンが必要です。トークンの準備手順:

1. Wallarm Console → **Settings** → **API tokens**（[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)）を開きます。
1. 使用タイプが`Node deployment/Deployment`のAPIトークンを探すか作成します。
1. このトークンをコピーします。

### 4. Dockerコンテナを起動します

Dockerイメージを実行するには、次のコマンドを使用します。`wallarm-node-conf.yaml`ファイルをコンテナにマウントします。

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```

環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | 使用タイプが`Node deployment/Deployment`のAPIトークンです。 | はい
`WALLARM_LABELS` | ノードインスタンスをグループ化するための`group`ラベルを設定します。例:<br>`WALLARM_LABELS="group=<GROUP>"`はノードインスタンスを`<GROUP>`インスタンスグループ（既存。存在しない場合は作成されます）に配置します。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>デフォルト: `api.wallarm.com`。 | はい
`WALLARM_APID_ONLY`（0.12.1以降） | このモードでは、トラフィックで検知された攻撃は（[有効化](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)されていれば）ノードがローカルでブロックしますが、Wallarm Cloudへはエクスポートされません。一方で、[API Discovery](../../api-discovery/overview.md)や一部のその他機能は完全に動作し、APIインベントリを検出して可視化のためにCloudへアップロードします。このモードは、まずAPIインベントリを確認して機微データを特定し、そのうえで攻撃データのエクスポートを計画的に実施したい場合に適しています。ただし、Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング](../../user-guides/rules/sensitive-data-rule.md)も提供するため、攻撃データのエクスポートを無効化するケースは稀です。[詳細](../../installation/native-node/all-in-one.md#apid-only-mode)<br>デフォルト: `false`。 | いいえ

* `-p`オプションはホストとコンテナのポートをマッピングします:

    * 最初の値（80）は外部トラフィックに公開されるホスト側のポートです。
    * 2つ目の値（5050）はコンテナ側のポートで、`wallarm-node-conf.yaml`内の`connector.address`または`envoy_external_filter.address`の設定と一致させる必要があります。
* 設定ファイルはコンテナ内で`/opt/wallarm/etc/wallarm/go-node.yaml`としてマウントする必要があります。

### 5. API管理サービスにWallarmコードを適用します

ノードをデプロイしたら、トラフィックをデプロイ済みノードへルーティングするため、WallarmコードをAPI管理プラットフォームまたはサービスに適用します。

1. sales@wallarm.comに連絡し、コネクタ用のWallarmコードバンドルを入手します。
1. プラットフォーム別の手順に従って、API管理プラットフォームにバンドルを適用します:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Envoy/Istio](../connectors/istio.md)
    * [IBM DataPower](../connectors/ibm-api-connect.md)

## ノード動作の検証

ノードがトラフィックを検知していることを確認するには、ログを確認できます:

* Native Nodeのログはデフォルトで`/opt/wallarm/var/log/wallarm/go-node.log`に書き込まれ、追加の出力はstdoutにも出力されます。
* データがWallarm Cloudへ送信されたか、検知した攻撃など、フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)は`/opt/wallarm/var/log/wallarm`ディレクトリにあります。
* 追加のデバッグには、[`log.level`](all-in-one-conf.md#loglevel)パラメータを`debug`に設定します。

`http://<NODE_IP>:9000/metrics.`で公開される[Prometheusメトリクス](../../admin-en/native-node-metrics.md)を確認して、ノードの動作を検証することもできます。

## アップグレード

ノードのアップグレードは[手順](../../updating-migrating/native-node/docker-image.md)に従います。