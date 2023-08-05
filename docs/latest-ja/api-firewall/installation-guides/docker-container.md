# Docker上でのAPI Firewallの実行

このガイドでは、Docker上でWallarm API Firewallをダウンロード、インストール、起動する手順を説明します。

## 必要条件

* [Dockerのインストールと設定](https://docs.docker.com/get-docker/)
* Wallarm API Firewallで保護すべきアプリケーションのREST APIに対して開発された[OpenAPI 3.0規格](https://swagger.io/specification/)

## DockerでAPI Firewallを実行する方法

API FirewallをDockerでデプロイする最も速い方法は[Docker Compose](https://docs.docker.com/compose/)です。次の手順では、この方法を使用します。

もし必要であれば、`docker run`も使用することができます。同じ環境をデプロイするための適切な`docker run`コマンドを[このセクション](#using-docker-run-to-start-api-firewall)で提供しています。

## ステップ1. `docker-compose.yml`ファイルを作成

Docker Composeを用いてAPI Firewallと適切な環境をデプロイするために、まず以下の内容で**docker-compose.yml**を作成します：

```yml
version: '3.8'

networks:
  api-firewall-network:
    name: api-firewall-network

services:
  api-firewall:
    container_name: api-firewall
    image: wallarm/api-firewall:v0.6.9
    restart: on-failure
    volumes:
      - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    environment:
      APIFW_API_SPECS: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_RESPONSE_VALIDATION: <RESPONSE_VALIDATION_MODE>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: kennethreitz/httpbin
    restart: on-failure
    ports:
      - 8090:8090
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## ステップ2. Dockerネットワークを設定

必要に応じて、**docker-compose.yml** → `networks`で定義された[Dockerネットワーク](https://docs.docker.com/network/)設定を変更します。

提供された**docker-compose.yml**は、Dockerに`api-firewall-network`ネットワークを作成し、アプリケーションとAPI Firewallコンテナをそれにリンクするよう指示します。

コンテナ化されたアプリケーションとAPI Firewallの通信を手動でリンクすることなく許可するためには、別々のDocker ネットワークを使用することをお勧めします。

## ステップ3. API Firewallで保護するアプリケーションを設定

API Firewallで保護するコンテナ化されたアプリケーションの設定を変更します。この設定は**docker-compose.yml** → `services.backend`で定義されています。

提供された**docker-compose.yml**は、Dockerに[kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) Dockerコンテナを`api-firewall-network`に接続した状態で起動させるよう指示します。ポートは8090に割り当てられています。

あなた自身のアプリケーションを設定する場合は、適切なアプリケーションコンテナの起動に必要な設定のみを定義してください。API Firewallに特有の設定は必要ありません。

## ステップ4. API Firewallを設定

**docker-compose.yml** → `services.api-firewall`で次のようにAPI Firewall設定を渡します：

** `services.api-firewall.volumes`で**、[OpenAPI 3.0規格](https://swagger.io/specification/)をAPI Firewallコンテナディレクトリにマウントしてください：
    
* `<HOST_PATH_TO_SPEC>`: ホストマシン上にあるアプリケーションのREST API用のOpenAPI 3.0規格へのパス。受け付けるファイル形式はYAMLとJSON（拡張子は`.yaml`, `.yml`, `.json`）です。例：`/opt/my-api/openapi3/swagger.json`。
* `<CONTAINER_PATH_TO_SPEC>`: OpenAPI 3.0規格をマウントするコンテナディレクトリへのパス。例：`/api-firewall/resources/swagger.json`。

** `services.api-firewall.environment`で**、以下の環境変数を通じて一般的なAPI Firewall設定を設定してください：

| 環境変数              | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 必須? |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
|<a name="apifw-api-specs"></a>`APIFW_API_SPECS`   | OpenAPI 3.0規格へのパス。以下の方法でパスを指定することができます：<ul><li>コンテナにマウントされた規格ファイルへのパス、例：`/api-firewall/resources/swagger.json`。コンテナを実行するとき、このファイルは`-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`オプションでマウントします。</li><li>規格ファイルのURLアドレス、例：`https://example.com/swagger.json`。コンテナを実行するとき、`-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`オプションは除外します。</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | はい   |
|`APIFW_URL`         | API Firewall用のURL。例：`http://0.0.0.0:8088/`。ポートの値はホストに公開されるコンテナポートと一致するべきです。<br><br>API FirewallがHTTPSプロトコルをリッスンしている場合、生成されたSSL/TLS証明書と秘密鍵をコンテナにマウントして、下記の**API Firewall SSL/TLS設定**をコンテナに渡してください。                                                                                                                                                                                                                                                   | はい   |
|`APIFW_SERVER_URL`  | API Firewallで保護するべき、マウントされたOpenAPI規格に記載されているアプリケーションのURL。例：`http://backend:80`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | はい   |
|`APIFW_REQUEST_VALIDATION` | アプリケーションURLに送信されたリクエストを検証するためのAPI Firewallのモード：<ul><li>`BLOCK`は、マウントされたOpenAPI 3.0規格と一致しないリクエストをブロックしてログに記録します（ブロックされたリクエストには`403 Forbidden`のレスポンスが返されます）。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`LOG_ONLY`は、マウントされたOpenAPI 3.0規格と一致しないリクエストをログに記録しますがブロックしません。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`DISABLE`は、リクエスト検証を無効にします。</li></ul>                                                                                                                           | はい   |
|`APIFW_RESPONSE_VALIDATION` | 送信されたリクエストへのアプリケーションのレスポンスを検証するときのAPI Firewallのモード：<ul><li>`BLOCK`は、このリクエストへのアプリケーションのレスポンスが、マウントされたOpenAPI 3.0規格と一致しない場合に、リクエストをブロックしてログに記録します。このリクエストはアプリケーションURLにプロキシされますが、クライアントは`403 Forbidden`のレスポンスを受け取ります。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`LOG_ONLY`は、このリクエストへのアプリケーションのレスポンスが、マウントされたOpenAPI 3.0規格と一致しない場合に、リクエストをログに記録しますがブロックしません。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`DISABLE`は、リクエスト検証を無効にします。</li></ul> | はい   |
|`APIFW_LOG_LEVEL`  | API Firewallのログレベル。可能な値：<ul><li>`DEBUG`は、あらゆる種類のイベント（INFO、ERROR、WARNING、DEBUG）をログに記録します。</li><li>`INFO`は、INFO、WARNING、ERRORタイプのイベントをログに記録します。</li><li>`WARNING`は、WARNINGとERRORタイプのイベントをログに記録します。</li><li>`ERROR`は、ERRORタイプのイベントのみをログに記録します。</li></ul>デフォルト値は`DEBUG`です。提供されたスキーマと一致しないリクエストとレスポンスのログはERRORタイプになります。                                                                                                                                                                                                                                       | いいえ  |
|<a name="apifw-custom-block-status-code"></a>`APIFW_CUSTOM_BLOCK_STATUS_CODE` | リクエストまたはレスポンスが、マウントされたOpenAPI 3.0規格と一致しない場合に、`BLOCK`モードで動作しているAPI Firewallによって返される[HTTPレスポンスステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。デフォルト値は`403`。 | いいえ |
| `APIFW_ADD_VALIDATION_STATUS_HEADER`<br>(実験機能) | リクエストのブロック理由を含む`Apifw-Validation-Status`ヘッダーを、このリクエストのレスポンスに返すかどうか。値は`true`または`false`で、デフォルト値は`false`。| いいえ |
| `APIFW_LOG_FORMAT` | API Firewallのログの形式。値は `TEXT`または `JSON` で、デフォルト値は `TEXT`。 | いいえ |
| `APIFW_SHADOW_API_EXCLUDE_LIST`<br>(API Firewallがリクエストとレスポンスの両方で`LOG_ONLY`モードで動作している場合のみ) | 規格に含まれていないAPIエンドポイントがシャドウエンドポイントでは「ない」と示す[HTTP レスポンスステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。複数のステータスコードはセミコロンで区切って指定できます（例：`404;401`）。デフォルト値は `404`。<br><br>デフォルトでは、API Firewallがリクエストとレスポンスの両方で`LOG_ONLY`モードで動作している場合、規格に含まれておらず、コードが`404`とは異なることを返すすべてのエンドポイントをシャドウエンドポイントとしてマークします。 | いいえ |

API Firewall設定のその他のオプションについては、[リンク](#api-firewall-fine-tuning-options)で詳しく説明しています。

**`services.api-firewall.ports`と`services.api-firewall.networks`で**、API Firewallコンテナのポートを設定し、コンテナを作成したネットワークに接続します。提供された**docker-compose.yml**は、API Firewallをポート8088で`api-firewall-network`[ネットワーク](https://docs.docker.com/network/)に接続するようにDockerに指示します。

## ステップ5. 設定した環境をデプロイ

設定した環境をビルドして起動するには、次のコマンドを実行します：

```bash
docker-compose up -d --force-recreate
```

ログの出力を確認するには：

```bash
docker-compose logs -f
```

## ステップ6. API Firewallの動作をテスト

API Firewallの動作をテストするには、API Firewall Dockerコンテナのアドレスに、マウントされたOpen API 3.0規格と一致しないリクエストを送信します。例えば、整数値が必要なパラメータに文字列値を渡すことができます。

リクエストが提供されたAPIスキーマと一致しない場合、API Firewall Dockerコンテナのログに適切なERRORメッセージが追加されます。

## ステップ7. API Firewall上のトラフィックを有効に

API Firewallの設定を確定するには、あなたのアプリケーションのデプロイメントスキーマ設定を更新して、API Firewallに対する着信トラフィックを有効にしてください。例えば、Ingress、NGINX、またはロードバランサの設定を更新する必要があります。

## API Firewallの微調整オプション

API Firewallによりビジネス課題を解決するために、ツールの操作を微調整することができます。サポートされる微調整オプションを以下に示します。それらを環境変数として[API Firewall Dockerコンテナを設定するとき](#step-4-configure-api-firewall)に渡してください。

### リクエスト認証トークンの検証

OAuth 2.0プロトコルベースの認証を使用している場合、API Firewallを設定してアクセストークンの検証をアプリケーションのサーバーへのリクエストのプロキシの前に行うことができます。API Firewallはアクセストークンが`Authorization: Bearer`リクエストヘッダーに渡されることを期待します。

API Firewallは、[規格](https://swagger.io/docs/specification/authentication/oauth2/)とトークンのメタ情報に定義されたスコープが同じである場合、トークンが有効であると判断します。`APIFW_REQUEST_VALIDATION`の値が`BLOCK`である場合、API Firewallは無効なトークンを持つリクエストをブロックします。`LOG_ONLY`モードでは、無効なトークンを持つリクエストはログに記録されるだけです。

OAuth 2.0トークン検証フローを構成するには、以下のオプションの環境変数を使用します：

| 環境変数 | 説明 |
| ------------------- | -------------------------------- |
| `APIFW_SERVER_OAUTH_VALIDATION_TYPE` | 認証トークン検証のタイプ：<ul><li>`JWT`はリクエスト認証にJWTを使用している場合。`APIFW_SERVER_OAUTH_JWT_*`変数を通じてさらに構成を行います。</li><li>`INTROSPECTION`は、特定のトークンイントロスペクションサービスにより検証できる他のトークンタイプを使用している場合。`APIFW_SERVER_OAUTH_INTROSPECTION_*`変数を通じてさらに構成を行います。</li></ul> |
| `APIFW_SERVER_OAUTH_JWT_SIGNATURE_ALGORITHM` | JWTの署名に使用されるアルゴリズム：`RS256`, `RS384`, `RS512`, `HS256`, `HS384`または`HS512`。<br><br>`ECDSA`アルゴリズムで署名されたJWTはAPI Firewallにより検証できません。 |
| `APIFW_SERVER_OAUTH_JWT_PUB_CERT_FILE` | JWTがRS256, RS384, RS512アルゴリズムで署名されている場合、RSA公開鍵( `*.pem`)が入っているファイルへのパス。このファイルはAPI Firewall Dockerコンテナにマウントしなければなりません。 |
| `APIFW_SERVER_OAUTH_JWT_SECRET_KEY` | JWTがHS256, HS384, HS512アルゴリズムで署名されている場合、JWTの署名に使用される秘密鍵の値。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT` | [トークンイントロスペクションエンドポイント](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/)。エンドポイントの例：<ul><li>`https://www.googleapis.com/oauth2/v1/tokeninfo`はGoogle OAuthを使用する場合</li><li>`http://sample.com/restv1/introspection`はGluu OAuth 2.0トークンを使用する場合</li></ul> |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` | イントロスペクションエンドポイントへのリクエストのメソッド。`GET`または`POST`が可能。<br><br>デフォルト値は`GET`。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_TOKEN_PARAM_NAME` | イントロスペクションエンドポイントへのリクエストにおける、トークン値を有するパラメータの名前。`APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD`の値に応じて、API Firewallは自動的にパラメータがクエリパラメータまたはボディパラメータであると考えます。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_CLIENT_AUTH_BEARER_TOKEN` | イントロスペクションエンドポイントへのリクエストを認証するためのBearerトークン値。 |
| <a name="apifw-server-oauth-introspection-content-type"></a>`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE` | トークンイントロスペクションサービスのメディアタイプを示す、`Content-Type`ヘッダーの値。デフォルト値は`application/octet-stream`。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_REFRESH_INTERVAL` | キャッシュされたトークンメタデータの生存時間。API Firewallはトークンメタデータをキャッシュし、同じトークンでリクエストを得ると、そのメタデータはキャッシュから得ます。<br><br>インターバルは時間(`h`)、分(`m`)、秒(`s`)、または組合せ形式（例えば`1h10m50s`）で設定できます。<br><br>デフォルト値は`10m`（10分）。  |

### コンプロミスした認証トークンを持つリクエストのブロック

API漏洩が検出された場合、Wallarm API Firewallは[コンプロミスした認証トークンの使用を停止することができます](https://lab.wallarm.com/oss-api-firewall-unveils-new-feature-blacklist-for-compromised-api-tokens-and-cookies/)。リクエストがコンプロミスしたトークンを含んでいる場合、API Firewallはこのリクエストに[`APIFW_CUSTOM_BLOCK_STATUS_CODE`](#apifw-custom-block-status-code)で設定したコードでレスポンスします。

denylist機能を有効にするには：

1. コンプロミスしたトークンを含むdenylistファイルをDockerコンテナにマウントします。denylistのテキストファイルは次のようになったかもしれません：

    ```txt
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODIifQ.CUq8iJ_LUzQMfDTvArpz6jUyK0Qyn7jZ9WCqE0xKTCA
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODMifQ.BinZ4AcJp_SQz-iFfgKOKPz_jWjEgiVTb9cS8PP4BI0
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODQifQ.j5Iea7KGm7GqjMGBuEZc2akTIoByUaQc5SSX7w_qjY8
    ```
2. 次の変数をDockerコンテナに渡して、denylist機能を設定します：

    | 環境変数 | 説明 |
    | ------------------- | -------------------------------- |
    | `APIFW_DENYLIST_TOKENS_FILE` | コンテナにマウントされたテキストdenylistファイルへのパス。ファイル内のトークンは改行で区切られている必要があります。例の値：`/api-firewall/resources/tokens-denylist.txt`。 |
    | `APIFW_DENYLIST_TOKENS_COOKIE_NAME` | 認証トークンを渡すために使用されるCookieの名前。 |
    | `APIFW_DENYLIST_TOKENS_HEADER_NAME` | 認証トークンを渡すために使用されるHeaderの名前。`APIFW_DENYLIST_TOKENS_COOKIE_NAME`と`APIFW_DENYLIST_TOKENS_HEADER_NAME`の両方が指定されている場合、API Firewallはその値を逐次的にチェックします。 |
    | `APIFW_DENYLIST_TOKENS_TRIM_BEARER_PREFIX` | 認証ヘッダーから`Bearer`プリフィックスをトリムするかどうか。`Bearer`プリフィックスが認証ヘッダーに渡されており、denylist内のトークンがこのプリフィックスを含まない場合、トークンは信頼性を持って検証されません。<br>値は`true`または`false`で、デフォルト値は`false`。 |

### 保護されたアプリケーションのSSL/TLS設定

API Firewallと、カスタムCA証明書により署名された保護されたアプリケーションのサーバーとの接続を容易にするため、または不安全な接続を容易にするため、次のオプションの環境変数を使用します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_SERVER_INSECURE_CONNECTION` | 保護されたアプリケーションサーバーのSSL/TLS証明書の検証を無効にするかどうか。サーバーのアドレスは変数`APIFW_SERVER_URL`で指定されます。<br><br>デフォルト値は`false`で、デフォルトでインストールされたCA証明書または`APIFW_SERVER_ROOT_CA`で指定したものを使用して、アプリケーションへの全ての接続は安全であるとしようとします。 |
| `APIFW_SERVER_ROOT_CA`<br>(`APIFW_SERVER_INSECURE_CONNECTION`の値が`false`の場合のみ) | Dockerコンテナ内で、保護されたアプリケーションサーバーのCA証明書へのパス。CA証明書は最初にAPI Firewall Dockerコンテナにマウントしなければなりません。 |

### API FirewallのSSL/TLS設定

API Firewallで動作しているサーバーに対してSSL/TLSを設定するため、次のオプションの環境変数を使用します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_TLS_CERTS_PATH` | API Firewallに生成された証明書と秘密鍵がマウントされたコンテナディレクトリへのパス。 |
| `APIFW_TLS_CERT_FILE` | `APIFW_TLS_CERTS_PATH`で指定されたディレクトリに存在する、API Firewallに生成されたSSL/TLS証明書のファイル名。 |
| `APIFW_TLS_CERT_KEY` | `APIFW_TLS_CERTS_PATH`で指定されたディレクトリに存在する、API Firewallに生成されたSSL/TLS秘密鍵のファイル名。 |

### システム設定

API Firewallのシステム設定を微調整するため、次のオプションの環境変数を使用します：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_READ_TIMEOUT` | API FirewallがアプリケーションURLに送信された完全なリクエスト（ボディを含む）を読み取るためのタイムアウト。デフォルト値は`5s`。 |
| `APIFW_WRITE_TIMEOUT` | API FirewallがアプリケーションURLに送信されたリクエストに対するレスポンスを返すためのタイムアウト。デフォルト値は`5s`。 |
| `APIFW_SERVER_MAX_CONNS_PER_HOST` | API Firewallが同時に処理できる最大の接続数。デフォルト値は`512`。 |
| `APIFW_SERVER_READ_TIMEOUT` | API Firewallがアプリケーションから返される完全なレスポンス（ボディを含む）を読み取るためのタイムアウト。デフォルト値は`5s`。 |
| `APIFW_SERVER_WRITE_TIMEOUT` | API Firewallが完全なリクエスト（ボディを含む）をアプリケーションに書き込むためのタイムアウト。デフォルト値は`5s`。 |
| `APIFW_SERVER_DIAL_TIMEOUT` | API Firewallがアプリケーションに接続するためのタイムアウト。デフォルト値は`200ms`。 |
| `APIFW_SERVER_CLIENT_POOL_CAPACITY`       | fasthttpクライアントの最大数。デフォルト値は `1000`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `APIFW_HEALTH_HOST`       | ヘルスチェックサービスのホスト。デフォルト値は `0.0.0.0:9667`。Liveness probeサービスのパスは `/v1/liveness`、Readinessサービスのパスは `/v1/readiness`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## デプロイされた環境の停止

Docker Composeを使用してデプロイした環境を停止するには、次のコマンドを実行します：

```bash
docker-compose down
```

## `docker run`を使用してAPI Firewallを開始

Docker上でAPI Firewallを開始するために、次の例のように通常のDockerコマンドも使用することができます：

1. [コンテナ化されたアプリケーションとAPI Firewallの通信を手動でリンクすることなく許可するための別々のDockerネットワークを作成する]のために(#step-2-configure-the-docker-network)：

    ```bash
    docker network create api-firewall-network
    ```
2. [API Firewallで保護するコンテナ化されたアプリケーションを開始する](#step-3-configure-the-application-to-be-protected-with-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p 8090:8090 kennethreitz/httpbin
    ```
3. [API Firewallを開始する](#step-4-configure-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
        -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
        -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
        -p 8088:8088 wallarm/api-firewall:v0.6.9
    ```
4. 環境が開始されたら、ステップ6と7に従ってそれをテストし、API Firewall上のトラフィックを有効にします。