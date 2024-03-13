# API Firewall での GraphQL Playground

Wallarm API Firewall は開発者に [GraphQL Playground](https://github.com/graphql/graphql-playground) を装備しています。このガイドでは、プレイグラウンドの実行方法を説明します。

GraphQL Playground は、GraphQL 専用のブラウザ内統合開発環境（IDE）です。開発者がGraphQLクエリ、ミューテーション、サブスクリプションの膨大な可能性を容易に記述、検討、および探求できる視覚的なプラットフォームとして設計されています。

プレイグラウンドは `APIFW_SERVER_URL` に設定されたURLからスキーマを自動的にフェッチします。この動作は、GraphQLスキーマを公開する内省クエリです。したがって、`APIFW_GRAPHQL_INTROSPECTION` 変数が `true` に設定されていることを確認する必要があります。これにより、このプロセスが許可され、API Firewallのログで潜在的なエラーを回避します。

API Firewall内でPlaygroundを有効にするには、次の環境変数を使用する必要があります：

| 環境変数 | 説明 |
| -------- | ---- |
| `APIFW_GRAPHQL_INTROSPECTION` | 内省クエリを許可し、GraphQLスキーマの構造を公開します。この変数が `true` に設定されていることを確認してください。 |
| `APIFW_GRAPHQL_PLAYGROUND` | プレイグラウンド機能を切り替えます。デフォルトでは `false` に設定されています。有効にするには、`true` に変更します。 |
| `APIFW_GRAPHQL_PLAYGROUND_PATH` | プレイグラウンドがアクセス可能になるパスを指定します。デフォルトはルートパス `/` です。 |

設定後、ブラウザで指定されたパスからプレイグラウンドインターフェースにアクセスできます：

![Playground](https://github.com/wallarm/api-firewall/blob/main/images/graphql-playground.png?raw=true)