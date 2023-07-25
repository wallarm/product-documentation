# API Firewall 変更履歴

このページでは、Wallarm API Firewall の新しいリリースについて説明しています。

## v0.6.9 (2022-09-12)

* Go を 1.19 にアップグレード
* 他の依存関係をアップグレード
* Shadow API 検出と denylist 処理のバグを修正
* API Firewall によって返されるレスポンスから `Apifw-Request-Id` ヘッダーを削除
* Kubernetes 1.22 との Ingress オブジェクトの互換性を追加
* INFO ログレベルでの API 仕様に一致する受信リクエストのログ記録を終了

## v0.6.8 (2022-04-11)

### 新機能

* OpenAPI 3.0 仕様の URL アドレスを指定し、Docker コンテナに仕様ファイルをマウントする代わりに行います（環境変数 [`APIFW_API_SPECS`](installation-guides/docker-container.md#apifw-api-specs) を介して）。
* トークンイントロスペクションサービスにリクエストを送信する際に、カスタム `Content-Type` ヘッダーを使用する機能（環境変数 [`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE`](installation-guides/docker-container.md#apifw-server-oauth-introspection-content-type) を介して）。
* [認証トークンの denylist 対応](installation-guides/docker-container.md#blocking-requests-with-compromised-authentication-tokens)。

## v0.6.7 (2022-01-25)

Wallarm API Firewall は、オープンソースになりました。[このリリース](https://github.com/wallarm/api-firewall/releases/tag/v0.6.7) で次の関連変更があります。

* API Firewall のソースコードと関連するオープンソースライセンスが公開されました
* バイナリ、Helm chart、および Docker イメージの構築用の GitHub ワークフローが実装されました

## v0.6.6 (2021-12-09)

### 新機能

* [OAuth 2.0 トークン検証](installation-guides/docker-container.md#validation-of-request-authentication-tokens) のサポート。
* カスタム CA 証明書で署名されたサーバーへの[接続](installation-guides/docker-container.md#protected-application-ssltls-settings)と、安全でない接続フラグのサポート。

### バグフィックス

* https://github.com/wallarm/api-firewall/issues/27

## v0.6.5 (2021-10-12)

### 新機能

* fasthttp クライアントの最大数を設定します（環境変数 `APIFW_SERVER_CLIENT_POOL_CAPACITY` を介して）。
* API Firewall コンテナの 9667 ポートでのヘルスチェック（ポートは環境変数 `APIFW_HEALTH_HOST` を介して変更できます）。

[新しい環境変数で API Firewall を実行する方法](installation-guides/docker-container.md)

### バグ修正

* https://github.com/wallarm/api-firewall/issues/15
* その他いくつかのバグ

## v0.6.4 (2021-08-18)

### 新機能

* Shadow API エンドポイントの監視を追加。API Firewall は、リクエストとレスポンスの両方で `LOG_ONLY` モードで動作し、仕様に含まれていないエンドポイントをすべて検出し、コード `404` と異なるコードを返すものとしてマークします。環境変数 `APIFW_SHADOW_API_EXCLUDE_LIST` を使用して、Shadow エンドポイントを示すレスポンスコードを除外できます。
* API Firewall がブロックされたリクエストに返す HTTP レスポンスステータスコードの設定（環境変数 `APIFW_CUSTOM_BLOCK_STATUS_CODE` を介して）。
* リクエストのブロック理由を含むヘッダーを返す機能（環境変数 `APIFW_ADD_VALIDATION_STATUS_HEADER` を介して）。この機能は**実験的**です。
* API Firewall のログ形式の設定（環境変数 `APIFW_LOG_FORMAT` を介して）。

[新しい環境変数で API Firewall を実行する方法](installation-guides/docker-container.md)

### 最適化

* `fastjson` パーサーが追加されたため、OpenAPI 3.0 仕様の検証が最適化されました。
* fasthttp のサポートが追加されました。

## v0.6.2 (2021-06-22)

* 初リリース！