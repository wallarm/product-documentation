# WallarmノードとCloud間の同期設定

フィルタリングノードは定期的にWallarm Cloudと同期し、以下の処理を行います:

* [トラフィック処理ルール(LOM)](../user-guides/rules/rules.md)の更新を取得
* [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)の更新を取得
* 検出した攻撃および脆弱性に関するデータを送信
* 処理済みトラフィックのメトリクスを送信

これらの手順では、フィルタリングノードとWallarm Cloud間の同期設定に使用するパラメータおよび方法について説明します。

## アクセスパラメータ

フィルタリングノードがCloudにアクセスするために必要な、フィルタリングノード名、UUID、Wallarm API秘密鍵などのパラメータは`node.yaml`に明示的に設定されます。このファイルは`register-node`スクリプトで自動的に生成されます。

* Docker NGINXベースイメージ、Cloudイメージ、NGINX NodeオールインワンインストーラーおよびNative Nodeインストールの場合、[`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf)ディレクティブで上書きされていなければ、`/opt/wallarm/etc/wallarm/node.yaml`にあるファイルを参照します。
* その他のインストールの場合、`node.yaml`の場所は異なる場合、または[`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf)ディレクティブで上書きされる場合があります。ファイルを探すか、`wallarm_api_conf`の値を確認してファイルの場所を特定してください。

`node.yaml`ファイルには以下のアクセスパラメータが含まれる場合があります:

| パラメータ         | 説明                                                                                 | デフォルト値                   |
| ------------------ | ------------------------------------------------------------------------------------ | ------------------------------ |
| `hostname`         | フィルタリングノード名。この変数は`node.yaml`ファイルに**必須**で設定する必要があります。             | `register-node`によって提供     |
| `api.regtoken`     | フィルタリングノードがWallarm APIにアクセスできるためのトークン。                                  | `register-node`によって提供     |
| `api.uuid`         | フィルタリングノードUUID。この変数は`node.yaml`ファイルに**必須**で設定する必要があります。             | `regtoken`によって提供         |
| `api.secret`       | Wallarm APIにアクセスするための秘密鍵。この変数は`node.yaml`ファイルに**必須**で設定する必要があります。   | `regtoken`によって提供         |
| `api.host`         | Wallarm APIエンドポイント。以下のいずれかです:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul> | `api.wallarm.com`              |
| `api.port`         | Wallarm APIポート。                                                                        | `443`                          |
| `api.use_ssl`      | Wallarm APIに接続する際にSSLを使用するかどうか。                                                  | `true`                         |
| `api.ca_verify`    | Wallarm APIサーバの証明書検証を有効または無効にするかどうか。以下のいずれかです:<ul><li>`true`で検証を有効</li><li>`false`で検証を無効</li></ul>。 | `true`                         |

同期パラメータを変更するには、以下の手順に従ってください:

1. `node.yaml`ファイルに必要なパラメータを追加し、希望する値を設定します。
1. 同期プロセスに更新された設定を適用するためにNGINXを再起動します:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 同期間隔

デフォルトでは、フィルタリングノードはWallarm Cloudと120～240秒(2～4分)ごとに同期します。同期待続間隔はシステム環境変数`WALLARM_SYNCNODE_INTERVAL`で変更できます。

フィルタリングノードとWallarm Cloud間の同期間隔を変更するには、以下の手順に従ってください:

1. `/etc/environment`ファイルを開きます。
2. `WALLARM_SYNCNODE_INTERVAL`変数をファイルに追加し、秒単位で希望する値を設定します。値はデフォルト値(`120`秒)未満に設定できません。例えば:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. 変更した`/etc/environment`ファイルを保存します。新しい間隔の値は自動的に同期プロセスに適用されます。

## 設定例

--8<-- "../include/node-cloud-sync-configuration-example-5.x.md"