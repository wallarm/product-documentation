# Wallarm ノードとクラウド間の同期設定

フィルタリングノードは定期的に Wallarm Cloud と同期して次のことを行います。

* [トラフィック処理ルール (LOM)](../about-wallarm/protecting-against-attacks.md#custom-rules-for-request-analysis) の更新を取得
* [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) の更新を取得
* 検出された攻撃と脆弱性のデータを送信
* 処理されたトラフィックのメトリクスを送信

これらの指示は、フィルタリングノードと Wallarm Cloud の同期を設定するために使用されるパラメータと方法を説明しています。

## アクセスパラメータ

`node.yaml` ファイルには、フィルタリングノードがクラウドにアクセスするためのパラメータが含まれています。

このファイルは、`register-node` スクリプトを実行した後に自動的に作成され、フィルタリングノードの名前とUUID、および Wallarm API シークレットキーを含みます。ファイルへのデフォルトのパスは `/etc/wallarm/node.yaml` です。このパスは [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) ディレクティブを通じて変更することができます。

`node.yaml` ファイルには、次のアクセスパラメータが含まれる可能性があります。

| パラメータ | 説明 | デフォルト値 |
| --------- | ----------- | ------------- |
| `hostname`       | フィルタリングノードの名前。この変数は `node.yaml` ファイルに設定することが**必須**です。 | `register-node` により提供されます |
| `regtoken`       | ノードが Wallarm API にアクセスできるようにするためのトークン。 | `register-node` により提供されます |
| `uuid`           | フィルタリングノードの UUID。この変数は `node.yaml` ファイルに設定することが**必須**です。 | `regtoken` により提供されます |
| `secret`         | Wallarm API にアクセスするためのシークレットキー。この変数は `node.yaml` ファイルに設定することが**必須**です。 | `regtoken` により提供されます |
| `api.host`       | Wallarm API エンドポイント。以下の可能性があります。<ul><li>`us1.api.wallarm.com` は US クラウド用です</li><li>`api.wallarm.com` は EU クラウド用です</li></ul> | `api.wallarm.com` |
| `api.port`       | Wallarm API のポート。 | `443` |
| `api.use_ssl`  | Wallarm API に接続する際に SSL を使用するかどうか。 | `true` |
| `api.ca_verify`  | Wallarm API サーバーの証明書検証を有効/無効にするかどうか。以下の可能性があります。<ul><li>`true` は検証を有効にする</li><li>`false` は検証を無効にする</li></ul>。 | `true` |
| `api.ca_file`  | SSL 証明書ファイルへのパス。 | `/usr/share/wallarm-common/ca.pem` |
| `api.localhost` | Wallarm API へのリクエストを送信するためのネットワークインターフェースのローカル IP アドレス。デフォルトで使用されるネットワークインターフェース（例えば、インターネットへのアクセスが閉じている場合など）が Wallarm API へのアクセスを制限している場合、このパラメータが必要です。 | - |
| `api.localport` | Wallarm API へのリクエストを送信するためのネットワークインターフェースのポート。デフォルトで使用されるネットワークインターフェース（例えば、インターネットへのアクセスが閉じている場合など）が Wallarm API へのアクセスを制限している場合、このパラメータが必要です。 | - |

同期パラメータを変更するには、以下のステップを実行します。

1. 必要なパラメータを追加し、それらに所望の値を割り当てることで、`node.yaml` ファイルを変更します。
1. NGINX を再起動して、同期プロセスに更新設定を適用します。

    --8<-- "../include-ja/waf/restart-nginx-4.4-and-above.md"

## 同期間隔

デフォルトでは、フィルタリングノードは Wallarm Cloud と120〜240秒（2〜4分）ごとに同期します。システム環境変数 `WALLARM_SYNCNODE_INTERVAL` を介して同期間隔を変更することができます。

フィルタリングノードと Wallarm Cloud の同期間隔を変更するには:

1. ファイル `/etc/environment` を開きます。
2. ファイルに `WALLARM_SYNCNODE_INTERVAL` 変数を追加し、その変数に希望の値（秒）を設定します。値はデフォルト値（`120秒`）より小さくすることはできません。例えば:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. 変更を保存します。新しい間隔値は自動的に同期プロセスに適用されます。

## 設定例

この記事で説明されている一般的な `api` セクションに加えて、フィルタリングノードがクラウドにアクセスするためのパラメータを提供する `node.yaml` ファイルは、異なるプロセスがノードの操作に必要なファイルへのアクセスを提供するパラメータ（`syncnode` セクション）も含めることができます。

--8<-- "../include-ja/node-cloud-sync-configuration-example.md"
