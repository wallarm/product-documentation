# APIファイアウォールの変更履歴

このページでは、Wallarm APIファイアウォールの新規リリースについて説明します。

## v0.6.13 (2023-09-08)

* [GraphQL APIリクエストの検証をサポート](installation-guides/graphql/docker-container.md)

## v0.6.12 (2023-08-04)

* `APIFW_MODE`環境変数を使用して、一般的なAPIファイアウォールモードを設定する機能。デフォルト値は`PROXY`です。APIに設定すると、提供されたOpenAPI仕様に基づいて個々のAPIリクエストを検証し [それ以上プロキシしないことが可能です](installation-guides/api-mode.md)。
* OpenAPIで指定されたエンドポイントに対して、`OPTIONS`メソッドが明示的に定義されていない場合でも`OPTIONS`リクエストを許可する機能を導入。これは`APIFW_PASS_OPTIONS`変数を使用して実現できます。デフォルト値は`false`です。
* リクエストのパラメータがOpenAPI仕様に記載されているものと一致しない場合に、仕様に一致しないとして識別されるべきかどうかを制御する機能を導入。デフォルトでは`true`に設定されています。

    これは`PROXY`モードでは`APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION`変数を介して、`API`モードでは`APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION`変数を介して制御できます。
* 新しいログレベルモード`TRACE`を導入し、受信リクエストとAPIファイアウォールのレスポンス（その内容を含む）をログに記録します。このレベルは`APIFW_LOG_LEVEL`環境変数を使用して設定できます。
* 依存関係の更新
* バグ修正

## v0.6.11 (2023-02-10)

* `APIFW_SERVER_DELETE_ACCEPT_ENCODING`環境変数を追加。`true`に設定すると、プロキシされたリクエストから`Accept-Encoding`ヘッダーが削除されます。デフォルト値は`false`です。
* https://github.com/wallarm/api-firewall/issues/56
* https://github.com/wallarm/api-firewall/issues/57
* リクエストボディとレスポンスボディの解凍を追加

## v0.6.10 (2022-12-15)

* https://github.com/wallarm/api-firewall/issues/54
* 依存関係の更新

## v0.6.9 (2022-09-12)

* Goを1.19にアップグレード
* その他の依存関係をアップグレード
* Shadow APIの検出やdenylistの処理に関するバグを修正
* APIファイアウォールによって返されたレスポンスから`Apifw-Request-Id`ヘッダーを削除
* Kubernetes 1.22との互換性のIngressオブジェクトを追加
* APIの仕様に一致する受信リクエストのログ記録をINFOログレベルで停止

## v0.6.8 (2022-04-11)

### 新機能

* Dockerコンテナに仕様ファイルをマウントする代わりに、OpenAPI 3.0仕様のURLアドレスを指定する機能（環境変数[`APIFW_API_SPECS`](installation-guides/docker-container.md#apifw-api-specs)を介して）。
* トークン検証サービスへのリクエスト送信時にカスタム`Content-Type`ヘッダーを使用する機能（環境変数[`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE`](configuration-guides/validate-tokens.md)を介して）。
* [認証トークンのdenylistsのサポート](configuration-guides/denylist-leaked-tokens.md)。

## v0.6.7 (2022-01-25)

Wallarm APIファイアウォールはオープンソースとなりました。[このリリース](https://github.com/wallarm/api-firewall/releases/tag/v0.6.7)には以下の変更点があります：

* APIファイアウォールのソースコードと関連するオープンソースライセンスが公開されました
* バイナリ、Helmチャート、DockerイメージのビルドのためのGitHubワークフローが実装されました

## v0.6.6 (2021-12-09)

### 新機能

* [OAuth 2.0トークンの検証のサポート](configuration-guides/validate-tokens.md)。
* カスタムCA証明書で署名されたサーバーへの[接続](configuration-guides/ssl-tls.md)と、不安全な接続フラグのサポート。

### バグ修正

* https://github.com/wallarm/api-firewall/issues/27

## v0.6.5 (2021-10-12)

### 新機能

* 最大fasthttpクライアント数の設定（環境変数`APIFW_SERVER_CLIENT_POOL_CAPACITY`を介して）。
* APIファイアウォールコンテナの9667ポートでのヘルスチェック（環境変数`APIFW_HEALTH_HOST`を介してポートを変更可能）。

[新しい環境変数でのAPIファイアウォールの実行についての指示](installation-guides/docker-container.md)

### バグ修正

* https://github.com/wallarm/api-firewall/issues/15
* その他のバグ

## v0.6.4 (2021-08-18)

### 新機能

* Shadow APIエンドポイントの監視を追加。`LOG_ONLY`モードで動作するAPIファイアウォールは、仕様に含まれていないすべてのエンドポイントをshadowとしてマークし、`404`以外のコードを返すリクエストとレスポンスの両方にマークを付けます。環境変数`APIFW_SHADOW_API_EXCLUDE_LIST`を使用してshadowエンドポイントを示すレスポンスコードを除外できます。
* APIファイアウォールによってブロックされたリクエストに返されるHTTPレスポンスステータスコードの設定（環境変数`APIFW_CUSTOM_BLOCK_STATUS_CODE`を介して）。
* リクエストブロッキングの理由を含むヘッダーを返す機能（環境変数`APIFW_ADD_VALIDATION_STATUS_HEADER`を介して）。この機能は**実験的**です。
* APIファイアウォールのログ形式の設定（環境変数`APIFW_LOG_FORMAT`を介して）。

[新しい環境変数でのAPIファイアウォールの実行についての指示](installation-guides/docker-container.md)

### 最適化

* `fastjson`パーサーを追加することでOpenAPI 3.0仕様の検証を最適化。
* fasthttpのサポートを追加。

## v0.6.2 (2021-06-22)

* 最初のリリース！