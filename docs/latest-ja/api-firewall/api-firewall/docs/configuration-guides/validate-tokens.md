# リクエスト認証トークンの検証

OAuth 2.0を認証に活用する際、APIファイアウォールはリクエストをアプリケーションサーバーに向ける前にアクセストークンを検証するよう設定できます。ファイアウォールは、`Authorization: Bearer`リクエストヘッダーでアクセストークンを期待しています。

APIファイアウォールは、[仕様](https://swagger.io/docs/specification/authentication/oauth2/)とトークンのメタ情報に定義されたスコープが一致している場合、トークンを有効とみなします。`APIFW_REQUEST_VALIDATION`の値が`BLOCK`の場合、APIファイアウォールは無効なトークンを持つリクエストをブロックします。`LOG_ONLY`モードでは、無効なトークンを持つリクエストはログにのみ記録されます。

!!! info "機能の利用可能性"
    この機能は、APIファイアウォールを[REST API](../installation-guides/docker-container.md)リクエストフィルタリング用に実行している場合のみ利用可能です。

OAuth 2.0トークン検証フローを設定するには、次の環境変数を使用します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_SERVER_OAUTH_VALIDATION_TYPE` | 認証トークン検証のタイプ：<ul><li>`JWT` JWTをリクエスト認証に使用している場合。`APIFW_SERVER_OAUTH_JWT_*`変数を介してさらに設定を行います。</li><li>`INTROSPECTION` 特定のトークン検証サービスで検証可能なその他のトークンタイプを使用している場合。`APIFW_SERVER_OAUTH_INTROSPECTION_*`変数を介してさらに設定を行います。</li></ul> |
| `APIFW_SERVER_OAUTH_JWT_SIGNATURE_ALGORITHM` | JWTに署名するために使用されているアルゴリズム：`RS256`, `RS384`, `RS512`, `HS256`, `HS384` または `HS512`。<br><br>`ECDSA`アルゴリズムを使用して署名されたJWTは、APIファイアウォールで検証できません。 |
| `APIFW_SERVER_OAUTH_JWT_PUB_CERT_FILE` | RS256、RS384、またはRS512アルゴリズムを使用してJWTが署名されている場合、RSA公開キー(`*.pem`)を含むファイルへのパス。このファイルはAPIファイアウォールDockerコンテナにマウントする必要があります。 |
| `APIFW_SERVER_OAUTH_JWT_SECRET_KEY` | HS256、HS384、またはHS512アルゴリズムを使用してJWTが署名されている場合、JWTに署名するために使用されている秘密キーの値。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT` | [トークン検証エンドポイント](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/)。エンドポイントの例：<ul><li>`https://www.googleapis.com/oauth2/v1/tokeninfo` Google OAuthを使用している場合</li><li>`http://sample.com/restv1/introspection` Gluu OAuth 2.0トークンの場合</li></ul> |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` | トークン検証エンドポイントへのリクエストの方法。`GET`または`POST`にできます。<br><br>デフォルト値は`GET`です。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_TOKEN_PARAM_NAME` | トークン検証エンドポイントへのリクエストでトークン値を持つパラメータの名前。`APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD`の値に応じて、APIファイアウォールは自動的にパラメータをクエリまたはボディパラメータとみなします。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_CLIENT_AUTH_BEARER_TOKEN` | トークン検証エンドポイントへのリクエストを認証するためのBearerトークンの値。 |
| <a name="apifw-server-oauth-introspection-content-type"></a>`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE` | `Content-Type`ヘッダーの値で、トークン検証サービスのメディアタイプを示します。既定値は`application/octet-stream`です。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_REFRESH_INTERVAL` | キャッシュされたトークンメタデータの有効期間。APIファイアウォールはトークンメタデータをキャッシュし、同じトークンでリクエストを受け取ると、メタデータをキャッシュから取得します。<br><br>この間隔は、時間（`h`）、分（`m`）、秒（`s`）または組み合わせ形式（例：`1h10m50s`）で設定できます。<br><br>デフォルト値は`10m`（10分）です。