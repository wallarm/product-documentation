# API Firewallの変更ログ

このページでは、Wallarm API Firewallの最新リリースについて説明しています。

## v0.6.9 (2022-09-12)

* Goを1.19にアップグレード
* 他の依存関係のアップグレード
* シャドウAPI検出とデニーリスト処理のバグ修正
* API Firewallが返却するレスポンスから`Apifw-Request-Id`ヘッダーを削除
* IngressオブジェクトのKubernetes 1.22との互換性追加
* APIの仕様に一致する着信リクエストのログ記録をINFOログレベルで終了

## v0.6.8 (2022-04-11)

### 新機能

* OpenAPI 3.0仕様のURLアドレスを指定する機能：Dockerコンテナに仕様ファイルをマウントする代わりに（環境変数[`APIFW_API_SPECS`](installation-guides/docker-container.md#apifw-api-specs)を介して）。
* トークン検証サービスにリクエストを送信する際のカスタム`Content-Type`ヘッダーの使用可能性（環境変数[`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE`](installation-guides/docker-container.md#apifw-server-oauth-introspection-content-type)により）。
* [認証トークンのデニーリストのサポート](installation-guides/docker-container.md#blocking-requests-with-compromised-authentication-tokens)。

## v0.6.7 (2022-01-25)

Wallarm API Firewallはオープンソースになりました。関連する変更は、[このリリース](https://github.com/wallarm/api-firewall/releases/tag/v0.6.7)に含まれています：

* API Firewallのソースコードと関連するオープンソースライセンスが公開
* バイナリ、Helmチャート、Dockerイメージのビルドに対するGitHubワークフローが実装

## v0.6.6 (2021-12-09)

### 新機能

* [OAuth 2.0トークン検証のサポート](installation-guides/docker-container.md#validation-of-request-authentication-tokens)。
* カスタムCA証明書で署名されたサーバーへの[接続](installation-guides/docker-container.md#protected-application-ssltls-settings)と不安全な接続フラグのサポート。

### バグ修正

* https://github.com/wallarm/api-firewall/issues/27

## v0.6.5 (2021-10-12)

### 新機能

* fasthttpクライアントの最大数の設定 (環境変数 `APIFW_SERVER_CLIENT_POOL_CAPACITY`により)。
* API Firewallコンテナの9667ポートでのヘルスチェック (ポートは環境変数 `APIFW_HEALTH_HOST`で変更可能)。

[新しい環境変数でAPI Firewallを実行するための指示](installation-guides/docker-container.md)

### バグ修正

* https://github.com/wallarm/api-firewall/issues/15
* その他のいくつかのバグ

## v0.6.4 (2021-08-18)

### 新機能

* シャドウAPIエンドポイントの監視追加。API Firewallはリクエストとレスポンスの両方に対して`LOG_ONLY`モードで動作し、仕様に含まれていなくて`404`と異なるコードを返すすべてのエンドポイントをシャドウとしてマークします。シャドウエンドポイントを示す応答コードを環境変数 `APIFW_SHADOW_API_EXCLUDE_LIST`を使用して除外できます。
* API Firewallによってブロックされたリクエストへ返されるHTTPレスポンスのステータスコードの設定 (環境変数 `APIFW_CUSTOM_BLOCK_STATUS_CODE`により)。
* リクエストブロックの理由を含むヘッダーを返す機能 (環境変数 `APIFW_ADD_VALIDATION_STATUS_HEADER`を介して)。この機能は **試験的な** です。
* API Firewallのログフォーマット設定 (環境変数 `APIFW_LOG_FORMAT`を介して)。

[新しい環境変数でAPI Firewallを実行するための指示](installation-guides/docker-container.md)

### 最適化

* 追加された`fastjson`パーサーにより、OpenAPI 3.0仕様の検証が最適化されました。
* fasthttpのサポートが追加されました。

## v0.6.2 (2021-06-22)

* 初回リリース！
