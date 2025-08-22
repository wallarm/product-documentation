[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Dockerイメージを使用したWallarm Native Nodeのアップグレード

以下の手順では，[DockerイメージからデプロイされたNative Node](../../installation/native-node/docker-image.md)のアップグレード方法について説明します。

[Dockerイメージのリリースを表示する](node-artifact-versions.md)

## 要件

* [Docker](https://docs.docker.com/engine/install/)がホストシステムにインストールされていること
* API管理プラットフォームからコンテナ化された環境へのインバウンドアクセスが可能であること
* コンテナ化された環境から次のアドレスへのアウトバウンドアクセスが可能であること:

    * 配備に必要なDockerイメージをダウンロードするために`https://hub.docker.com/r/wallarm`へアクセス
    * US/EU Wallarm Cloud用の`https://us1.api.wallarm.com`または`https://api.wallarm.com`へアクセス
    * 攻撃検知ルールのアップデートや[API仕様書][api-spec-enforcement-docs]のダウンロード、さらに[許可、拒否、またはグレイリスト][ip-list-docs]に登録されている国、地域、またはデータセンターの正確なIPの取得のために下記IPアドレスへアクセス

        --8<-- "../include/wallarm-cloud-ips.md"
* 上記に加え，Wallarm Consoleで**Administrator**ロールが割り当てられていること

## 1. 新しいDockerイメージのバージョンをダウンロードします

```
docker pull wallarm/node-native-aio:0.11.0
```

## 2. 稼働中のコンテナを停止します

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 3. 新しいイメージを使用してコンテナを実行します

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.11.0
    ```

環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | `Deploy`ロールを持つAPIトークンです。 | Yes
`WALLARM_LABELS` | ノードインスタンスのグループ化のための`group`ラベルを設定します。例:<br>`WALLARM_LABELS="group=<GROUP>"`はノードインスタンスを既存の`<GROUP>`グループに配置するか，存在しない場合は作成します。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバーです。:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul>デフォルトは`api.wallarm.com`です。 | No

* `-p`オプションはホストとコンテナのポートをマッピングします:

    * 最初の値(`80`)は外部トラフィックに公開されるホストのポートです。
    * 2番目の値(`5050`)はコンテナのポートで，これは`wallarm-node-conf.yaml`ファイルの`connector.address`設定と一致する必要があります。
* 構成ファイルはコンテナ内の`/opt/wallarm/etc/wallarm/go-node.yaml`としてマウントされる必要があります。

    初期インストール時に使用した構成ファイルを再利用できます。必要な場合にのみ新しいパラメータを追加するか既存のパラメータを変更してください―詳細は[サポートされている構成オプション](../../installation/native-node/all-in-one-conf.md)を参照してください。

## 4. アップグレードを検証します

ノードが正しく動作しているかどうかを検証するには:

1. エラーログを確認します:

    * ログはデフォルトで`/opt/wallarm/var/log/wallarm/go-node.log`に出力され，標準出力にも追加の出力が表示されます。
    * Wallarm Cloudへのデータ送信状況や攻撃検知情報などのフィルタリングノードの[標準ログ](../../admin-en/configure-logging.md)は，コンテナ内の`/opt/wallarm/var/log/wallarm`ディレクトリにあります。
1. テスト用の[パストラバーサル攻撃][ptrav-attack-docs]を保護リソースアドレスに送信します:

    ```
    curl http://localhost/etc/passwd
    ```
    
    トラフィックが`example.com`にプロキシされるように構成されている場合，リクエストに`-H "Host: example.com"`ヘッダーを付加してください。
1. アップグレードされたノードが前のバージョンと比較して期待通りに動作していることを確認します。