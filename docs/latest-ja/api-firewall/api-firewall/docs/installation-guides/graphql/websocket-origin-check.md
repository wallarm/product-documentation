# WebSocket オリジン検証

ブラウザが WebSocket 接続を開始すると、リクエストの発信元を示す `Origin` ヘッダーが自動的に含まれます。Wallarm API Firewall を使用すると、WebSocket 接続のアップグレード段階で `Origin` ヘッダーの値が事前定義されたリストと一致することを保証できます。この記事では、[GraphQL クエリ](docker-container.md)に対して `Origin` 検証を有効にする手順を説明します。

デフォルトでは、WebSocket オリジン検証機能は無効になっています。これを有効にするには、次の環境変数を設定します。

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_WS_CHECK_ORIGIN` | WebSocket アップグレード段階での `Origin` ヘッダーの検証を有効にします。デフォルト：`false`。 |
| `APIFW_GRAPHQL_WS_ORIGIN`（`APIFW_GRAPHQL_WS_CHECK_ORIGIN` が `true` の場合に必要） | WebSocket 接続に許可されるオリジンのリスト。オリジンは `;` で区切られます。 |

`APIFW_GRAPHQL_WS_CHECK_ORIGIN` は [`APIFW_GRAPHQL_REQUEST_VALIDATION`](docker-container.md#apifw-graphql-request-validation) とは独立して動作します。`Origin` ヘッダーが正しくない WebSocket リクエストは、リクエスト検証モードにかかわらずブロックされます。