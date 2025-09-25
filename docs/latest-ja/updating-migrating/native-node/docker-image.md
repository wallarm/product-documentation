[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Dockerイメージを使用したWallarm Native Nodeのアップグレード

本手順では、[DockerイメージからデプロイされたNative Node](../../installation/native-node/docker-image.md)をアップグレードする手順を説明します。

[Dockerイメージのリリースを表示](node-artifact-versions.md)

## 要件

* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされていること
* API管理プラットフォームからコンテナ化された環境へのインバウンドアクセス
* コンテナ化された環境から以下へのアウトバウンドアクセス:
    * デプロイに必要なDockerイメージをダウンロードするための`https://hub.docker.com/r/wallarm`
    * US/EUのWallarm Cloud用の`https://us1.api.wallarm.com`または`https://api.wallarm.com`
    * 攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[allowlisted、denylisted、graylisted][ip-list-docs]の国・地域・データセンターの正確なIPを取得するための、以下のIPアドレスへのアクセス

        --8<-- "../include/wallarm-cloud-ips.md"
* さらに、Wallarm ConsoleでAdministratorロールが割り当てられている必要があります

## 1. 新しいDockerイメージのバージョンをダウンロードします

```
docker pull wallarm/node-native-aio:0.17.1
```

## 2. 実行中のコンテナを停止します

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 3. 新しいイメージを使用してコンテナを起動します

!!! info "Nodeバージョン0.12.x以下からアップグレードする場合"
    Nodeバージョン0.12.x以下からアップグレードする場合は、初期設定ファイル（デフォルトのインストール手順では`wallarm-node-conf.yaml`）の`version`値を更新し、（明示的に指定している場合は）`tarantool_exporter`セクションの名前を`postanalytics_exporter`に変更してください:

    ```diff
    -version: 2
    +version: 4

    -tarantool_exporter:
    +postanalytics_exporter:
        address: 127.0.0.1:3313
        enabled: true
    
    ...
    ```

=== "USクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```
=== "EUクラウド"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.17.1
    ```

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | `Node deployment/Deployment`の使用タイプを持つAPIトークンです。 | はい
`WALLARM_LABELS` | ノードインスタンスのグルーピング用に`group`ラベルを設定します。例えば:<br>`WALLARM_LABELS="group=<GROUP>"`はノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存のグループがある場合はそこへ、存在しない場合は作成されます）。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>USクラウドは`us1.api.wallarm.com`</li><li>EUクラウドは`api.wallarm.com`</li></ul>デフォルト: `api.wallarm.com`。 | いいえ

* `-p`オプションはホストとコンテナのポートをマッピングします。
    * 最初の値（`80`）はホストのポートで、外部トラフィックに公開されます。
    * 2つ目の値（`5050`）はコンテナのポートで、`wallarm-node-conf.yaml`ファイルの`connector.address`設定と一致している必要があります。
* 設定ファイルは、コンテナ内で`/opt/wallarm/etc/wallarm/go-node.yaml`としてマウントする必要があります。

    設定ファイルには、初回インストール時に使用したものを再利用できます。必要な場合のみ新しいパラメータを追加するか既存のものを変更してください。サポートされる[設定オプション](../../installation/native-node/all-in-one-conf.md)を参照してください。

## 4. アップグレードを検証します

ノードが正しく動作していることを確認するには、次を実行します。

1. エラーがないかログを確認します。
    * デフォルトではログは`/opt/wallarm/var/log/wallarm/go-node.log`に書き込まれ、追加の出力はstdoutにも表示されます。
    * フィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)（Wallarm Cloudへのデータ送信状況、検出された攻撃など）は、コンテナ内の`/opt/wallarm/var/log/wallarm`ディレクトリにあります。
1. 保護されたリソースのアドレスに、テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストを送信します。
    ```
    curl http://localhost/etc/passwd
    ```
    
    トラフィックが`example.com`にプロキシされるように構成されている場合は、リクエストに`-H "Host: example.com"`ヘッダーを含めてください。
1. アップグレードされたノードが、前のバージョンと比較して期待どおりに動作することを確認します。