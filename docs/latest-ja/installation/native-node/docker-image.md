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

# DockerイメージからNative Nodeをデプロイ

[Wallarm Native Node](../nginx-native-node-internals.md)はNGINXに依存せず動作し、一部のコネクタ向けにデプロイするために設計されています。公式のDockerイメージを使用して、コンテナ化されたサービス上でNative Nodeを実行できます。

## ユースケース

[MuleSoft](../connectors/mulesoft.md)、[Cloudflare](../connectors/cloudflare.md)、[Amazon CloudFront](../connectors/aws-lambda.md)、[Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md)および[Fastly](../connectors/fastly.md)向けのWallarmコネクタをセットアップする際、セルフホストノードが必要な場合にNative Nodeをデプロイします。

Native NodeのDockerイメージは、AWS ECSなどのコンテナオーケストレーションプラットフォームやその他のDockerベースの環境をご利用の場合に最適です。Wallarmノードは、サービス内でDockerコンテナとして稼働し、API管理プラットフォームに対してセキュリティフィルタリングおよびトラフィック検査を実現します。

## 要件

* ご利用のホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストール済みであること
* API管理プラットフォームからコンテナ化された環境へのインバウンドアクセスが可能であること
* コンテナ化された環境から以下へのアウトバウンドアクセスが可能であること:

    * デプロイに必要なDockerイメージをダウンロードするために `https://hub.docker.com/r/wallarm` へアクセスすること
    * US/EU Wallarm Cloudの場合、`https://us1.api.wallarm.com` または `https://api.wallarm.com` へアクセスすること
    * 攻撃検知ルールおよび[API仕様書][api-spec-enforcement-docs]の更新をダウンロードするため、また[allowlisted, denylisted, or graylisted][ip-list-docs]の国、地域、またはデータセンターに対する正確なIPを取得するため、下記IPアドレスにアクセスすること

        --8<-- "../include/wallarm-cloud-ips.md"
* ECSインスタンス前段のロードバランサ向けに、**信頼された**SSL/TLS証明書が必要です
* 上記に加え、Wallarm Consoleで**Administrator**ロールが割り当てられている必要があります

## 制限事項

* ロードバランサの保護には自己署名SSL証明書は使用できません
* [カスタムブロッキングページおよびブロッキングコード](../../admin-en/configuration-guides/configure-block-page-and-code.md)の設定はまだサポートされていません
* Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートされていません
* [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません

## デプロイ

### 1. Dockerイメージをプル

```
docker pull wallarm/node-native-aio:0.11.0
```

### 2. 設定ファイルを準備

Native Nodeのための最小限の設定を含む`wallarm-node-conf.yaml`ファイルを作成します:

```yaml
version: 2

mode: connector-server

connector:
  address: ":5050"
```

[すべての設定パラメータ](all-in-one-conf.md)（DockerイメージとNative Nodeオールインワンインストーラで同一です）

### 3. Wallarmトークンを準備

ノードをインストールするには、Wallarm Cloudにノードを登録するためのトークンが必要です。トークンを準備するには:

1. Wallarm Console → **Settings** → **API tokens**を、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で開きます
1. `Deploy`ロールを持つAPIトークンを見つけるか、新規作成します
1. このトークンをコピーします

### 4. Dockerコンテナを実行

以下のコマンドを使用してDockerイメージを実行します。`wallarm-node-conf.yaml`ファイルをコンテナにマウントしてください。

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```

環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | `Deploy`ロールを持つAPIトークンです。 | Yes
`WALLARM_LABELS` | ノードインスタンスのグルーピングのための`group`ラベルを設定します。例えば、<br>`WALLARM_LABELS="group=<GROUP>"`と設定すると、ノードインスタンスが既存か新規作成される`<GROUP>`グループに配置されます。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバです：<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>初期値: `api.wallarm.com`。 | No
`WALLARM_APID_ONLY` (0.11.0以上) | このモードでは、トラフィックで検知された攻撃が（[有効な場合](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)）ノード内でローカルにブロックされますが、Wallarm Cloudへエクスポートされません。同時に、[API Discovery](../../api-discovery/overview.md)およびその他の機能はフルに稼働し、APIインベントリを検知してCloudへアップロードし、視覚化を実現します。このモードは、APIインベントリを確認し、センシティブなデータを識別したうえで、制御された攻撃データのエクスポートを計画するためのものです。ただし、攻撃エクスポートの無効化は稀です。なぜなら、Wallarmは攻撃データを安全に処理し、必要に応じて[センシティブな攻撃データのマスキング](../../user-guides/rules/sensitive-data-rule.md)を提供するからです。[詳細](../../installation/native-node/all-in-one.md#apid-only-mode)<br>初期値: `false`。 | No

* オプション`-p`はホストとコンテナのポートをマッピングします:

    * 最初の値（`80`）はホストのポートで、外部トラフィックに公開されます。
    * 2番目の値（`5050`）はコンテナのポートで、`wallarm-node-conf.yaml`ファイル内の`connector.address`設定と一致している必要があります。
* 設定ファイルはコンテナ内部で`/opt/wallarm/etc/wallarm/go-node.yaml`としてマウントする必要があります。

### 5. API管理サービスにWallarmコードを適用

ノードのデプロイ後、デプロイされたノードにトラフィックをルーティングするため、WallarmコードをAPI管理プラットフォームまたはサービスに適用します。

1. sales@wallarm.comに連絡して、コネクタ用Wallarmコードバンドルを入手してください
1. プラットフォーム固有の手順に従い、API管理プラットフォームにバンドルを適用します:

    * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)

## ノードの動作確認

ノードがトラフィックを検知しているか確認するには、ログをチェックしてください:

* Native Nodeのログはデフォルトで`/opt/wallarm/var/log/wallarm/go-node.log`に出力され、stdoutにも追加出力されます
* Wallarm Cloudへのデータ送信状況、検知された攻撃など、フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)は`/opt/wallarm/var/log/wallarm`ディレクトリに格納されます

追加のデバッグには、[`log.level`](all-in-one-conf.md#loglevel)パラメータを`debug`に設定してください。

## アップグレード

ノードをアップグレードするには、[手順](../../updating-migrating/native-node/docker-image.md)に従ってください。