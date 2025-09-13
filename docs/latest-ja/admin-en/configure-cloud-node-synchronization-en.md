# WallarmノードとWallarm Cloud間の同期の構成

フィルタリングノードは次の目的で定期的にWallarm Cloudと同期します:

* [トラフィック処理ルール(LOM)](../user-guides/rules/rules.md)の更新を取得します
* [proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)の更新を取得します
* 検出された攻撃と脆弱性に関するデータを送信します
* 処理済みトラフィックのメトリクスを送信します

本手順では、フィルタリングノードとWallarm Cloudの同期を構成するためのパラメータと方法について説明します。

## アクセスパラメータ

フィルタリングノードがWallarm Cloudにアクセスするためのフィルタリングノード名、UUID、Wallarm APIシークレットキーなどのパラメータは、`node.yaml`に明示的に設定されます。このファイルは`register-node`スクリプトによって自動生成されます。

* Docker NGINX-based image、クラウドイメージ、NGINX Node all-in-one installerおよびNative Nodeのインストールの場合、[`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf)ディレクティブで上書きされていない限り、ファイルは`/opt/wallarm/etc/wallarm/node.yaml`にあります。
* その他のインストールでは、`node.yaml`の場所が異なる場合があるか、[`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf)ディレクティブで上書きされている場合があります。検索するか、`wallarm_api_conf`の値を確認してファイルの場所を特定してください。

`node.yaml`ファイルには、次のアクセスパラメータが含まれる場合があります:

| パラメータ | 説明 | デフォルト値 |
| --------- | ----------- | ------------- |
| `api.regtoken`       | ノードがWallarm APIにアクセスできるようにするためのトークンです。 | `register-node`により提供されます |
| `api.uuid`           | フィルタリングノードのUUIDです。この変数は`node.yaml`ファイルで設定することが**必須**です。 | `regtoken`により提供されます |
| `api.secret`         | Wallarm APIにアクセスするためのシークレットキーです。この変数は`node.yaml`ファイルで設定することが**必須**です。 | `regtoken`により提供されます |
| `api.host`       | Wallarm APIエンドポイントです。次のいずれかです:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul> | `api.wallarm.com` |
| `api.port`       | Wallarm APIのポートです。 | `443` |
| `api.use_ssl`  | Wallarm APIに接続する際にSSLを使用するかどうかです。 | `true` |
| `api.ca_verify`  | Wallarm APIサーバー証明書の検証を有効/無効にするかどうかです。次のいずれかです:<ul><li>検証を有効にする場合は`true`</li><li>検証を無効にする場合は`false`</li></ul>。 | `true` |

同期パラメータを変更するには、次の手順を実行します:

1. `node.yaml`ファイルを編集し、必要なパラメータを追加して希望の値を設定します。
1. 同期処理に更新した設定を適用するため、NGINXを再起動します:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

## 同期間隔

デフォルトでは、フィルタリングノードは120‑240秒(2‑4分)ごとにWallarm Cloudと同期します。システム環境変数`WALLARM_SYNCNODE_INTERVAL`で同期間隔を変更できます。

フィルタリングノードとWallarm Cloudの同期間隔を変更するには:

1. ファイル`/etc/environment`を開きます。
2. ファイルに`WALLARM_SYNCNODE_INTERVAL`変数を追加し、秒単位で希望の値を設定します。値はデフォルト値(`120`秒)未満にはできません。例:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. 変更した`/etc/environment`を保存します。新しい間隔値は自動的に同期処理に適用されます。

## 設定例

--8<-- "../include/node-cloud-sync-configuration-example-5.x.md"