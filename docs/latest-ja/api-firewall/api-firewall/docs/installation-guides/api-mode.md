# プロキシを介さず個々のリクエストを検証する

特定のOpenAPI仕様に基づいて個々のAPIリクエストを検証し、さらにプロキシを介さない場合は、Wallarm API Firewallを非プロキシモードで利用できます。この場合、ソリューションはレスポンスを検証しません。

!!! info "機能の可用性"
    この機能はAPI Firewallのバージョン0.6.12以降で使用可能で、REST API向けに特化しています。

そのためには：

1. コンテナに[OpenAPI仕様書ファイルをマウントする](../installation-guides/docker-container.md)代わりに、1つ以上のOpenAPI 3.0仕様書を含む[SQLiteデータベース](https://www.sqlite.org/index.html)を`/var/lib/wallarm-api/1/wallarm_api.db`にマウントします。データベースは以下のスキーマに従う必要があります：

    * `schema_id`, integer (自動インクリメント) - 仕様のID。
    * `schema_version`, string - 仕様のバージョン。好きなバージョンを設定できます。このフィールドが変わると、API Firewallは仕様自体が変更されたとみなし、それに応じて更新します。
    * `schema_format`, string - 仕様のフォーマットは、`json`または`yaml`があります。
    * `schema_content`, string - 仕様の内容。
1. 環境変数`APIFW_MODE=API`を設定してコンテナを実行し、必要に応じてこのモードに特化した他の変数を使用します：

    | 環境変数 | 説明 |
    | -------------------- | ----------- |
    | `APIFW_MODE` | 一般的なAPI Firewallモードを設定します。可能な値は[`PROXY`](docker-container.md)（デフォルト）、[`graphql`](graphql/docker-container.md)、そして`API`です。 |
    | `APIFW_SPECIFICATION_UPDATE_PERIOD` | 仕様更新の頻度を決定します。`0`に設定されている場合、仕様の更新は無効になります。デフォルト値は`1m`（1分）です。 |
    | `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION` | リクエストパラメータが仕様で定義されたものと一致しない場合にエラーコードを返すかどうかを指定します。デフォルト値は`true`です。 |
    | `APIFW_PASS_OPTIONS` | `true`に設定すると、API Firewallは`OPTIONS`メソッドが仕様に記述されていない場合でも、仕様のエンドポイントに対する`OPTIONS`リクエストを許可します。デフォルト値は`false`です。 |

1. マウントされた仕様と照合するかどうかを評価する際に、API Firewallにどの仕様を検証に使用するかを示すためにヘッダー`X-Wallarm-Schema-ID: <schema_id>`を含めます。

API Firewallは次のようにリクエストを検証します：

* リクエストが仕様に一致する場合、空のレスポンスが200ステータスコードとともに返されます。
* リクエストが仕様に一致しない場合、レスポンスは403ステータスコードと不一致の理由を説明するJSONドキュメントを提供します。
* リクエストを処理または検証できない場合、空のレスポンスが500ステータスコードとともに返されます。