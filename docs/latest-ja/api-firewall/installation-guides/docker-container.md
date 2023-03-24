# Docker上でのAPI Firewallの実行

このガイドでは、Docker上でWallarm API Firewallをダウンロード、インストール、開始する方法について説明します。

## 必要条件

* [インストールおよび設定済みのDocker](https://docs.docker.com/get-docker/)
* Wallarm API Firewallで保護されるべきアプリケーションのREST API用に開発された[OpenAPI 3.0仕様](https://swagger.io/specification/)

## Docker上でAPI Firewallを実行する方法

API FirewallをDockerにデプロイする最速の方法は、[Docker Compose](https://docs.docker.com/compose/)です。以下の手順はこの方法を使用しています。

必要に応じて、`docker run`も使用できます。[このセクション](#using-docker-run-to-start-api-firewall)で、同じ環境をデプロイするための適切な`docker run`コマンドを提供しています。

## ステップ1. `docker-compose.yml`ファイルを作成する

Docker Composeを使用してAPI Firewallと適切な環境をデプロイするには、最初に以下の内容で**docker-compose.yml**を作成します。

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

## ステップ2. Dockerネットワークを設定する

必要に応じて、**docker-compose.yml** → `networks`で定義されている[Dockerネットワーク](https://docs.docker.com/network/)の設定を変更します。

提供された**docker-compose.yml**は、Dockerにネットワーク`api-firewall-network`を作成し、アプリケーションとAPI Firewallコンテナをそれにリンクするよう指示します。

コンテナ化されたアプリケーションとAPI Firewallの通信を手動リンクせずに可能にするために、別のDockerネットワークを使用することをお勧めします。

## ステップ3. API Firewallで保護されるアプリケーションを設定する

API Firewallで保護されるコンテナ化されたアプリケーションの設定を変更します。この設定は、**docker-compose.yml** → `services.backend`で定義されています。

提供された**docker-compose.yml**は、Dockerに`api-firewall-network`に接続された[kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) Dockerコンテナを起動するよう指示し、`backend` [ネットワークエイリアス](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname)が割り当てられます。コンテナポートは8090です。

独自のアプリケーションを設定する場合は、正しいアプリケーションコンテナの開始に必要な設定のみを定義してください。API Firewallに特定の設定は必要ありません。## ステップ4. APIファイアウォールの設定

**docker-compose.yml** → `services.api-firewall`にAPIファイアウォールの設定を次のように渡します：

**`services.api-firewall.volumes` を使って**、APIファイアウォールコンテナのディレクトリに [OpenAPI 3.0 仕様](https://swagger.io/specification/) をマウントしてください:

* `<HOST_PATH_TO_SPEC>`: ホストマシン上にある、アプリケーションのREST APIのOpenAPI 3.0仕様へのパス。受け入れられるファイル形式はYAMLとJSON（`.yaml`、`.yml`、`.json`のファイル拡張子）。例：`/opt/my-api/openapi3/swagger.json`。
* `<CONTAINER_PATH_TO_SPEC>`: OpenAPI 3.0 仕様をマウントするためのコンテナディレクトリへのパス。例：`/api-firewall/resources/swagger.json`。

**`services.api-firewall.environment`を使って**、次の環境変数を通じて一般的なAPIファイアウォールの設定を設定してください：

| 環境変数              | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 必須? |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| <a name="apifw-api-specs"></a>`APIFW_API_SPECS`                 | OpenAPI 3.0 仕様へのパス。パスを指定する方法は次のとおりです:<ul><li>コンテナにマウントされた仕様ファイルへのパス。例: `/api-firewall/resources/swagger.json`。コンテナを実行する際、`-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>` オプションでこのファイルをマウントします。</li><li>仕様ファイルのURLアドレス。例： `https://example.com/swagger.json`。コンテナを実行する際、`-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>` オプションを省略します。</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | はい       |
| `APIFW_URL`                       | APIファイアウォールのURL。例：`http://0.0.0.0:8088/`。ポートの値は、ホストに公開されるコンテナポートに対応するように設定してください。<br><br>API ファイアウォールが HTTPS プロトコルでリッスンしている場合は、生成された SSL/TLS 証明書と秘密鍵をコンテナにマウントし、下記の**APIファイアウォールSSL/TLS設定**をコンテナに渡してください。                                                                                                                                                                                                                                                   | はい       |
| `APIFW_SERVER_URL`                | APIファイアウォールで保護する必要がある、マウントされたOpenAPI仕様で説明されているアプリケーションのURL。例：`http://backend:80`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | はい       |
| `APIFW_REQUEST_VALIDATION`        | アプリケーションのURLに送信されるリクエストを検証する際のAPIファイアウォールモード：<ul><li>`BLOCK`: マウントされた OpenAPI 3.0 仕様と一致しないリクエストをブロックおよびログする。ブロックされたリクエストには `403 Forbidden` レスポンスが返されます。ログは [STDOUT および STDERR Docker サービス](https://docs.docker.com/config/containers/logging/) に送信されます。</li><li>`LOG_ONLY`: マウントされた OpenAPI 3.0 仕様と一致しないリクエストをログに記録するがブロックはせず、`STDOUT` および `STDERR` Docker サービス（https://docs.docker.com/config/containers/logging/）に送信する。</li><li>`DISABLE`: リクエストの検証を無効にします。</li></ul>                                                                                                                           | はい       |
| `APIFW_RESPONSE_VALIDATION`       | APIファイアウォールが届いたリクエストへのアプリケーションのレスポンスを検証するモード：<ul><li>`BLOCK`: アプリケーションのこのリクエストへの応答が、マウントされた OpenAPI 3.0 仕様と一致しない場合、リクエストをブロックおよびログし、クライアントは `403 Forbidden`レスポンスを受け取ります。ログは [`STDOUT` および `STDERR` Docker サービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`LOG_ONLY`: アプリケーションのこのリクエストへの応答が、マウントされたOpenAPI 3.0 仕様と一致しない場合、ログに記録するがブロックはせず、`STDOUT`および`STDERR`Dockerサービス（https://docs.docker.com/config/containers/logging/）に送信します。</li><li>`DISABLE`: リクエストの検証を無効にします。</li></ul> | はい       |
| `APIFW_LOG_LEVEL`                 | APIファイアウォールのログレベル。可能な値：<ul><li>`DEBUG`: 任意のタイプのイベント（INFO, ERROR, WARNING, DEBUG）をログに記録する。</li><li>`INFO`: INFO, WARNING, ERRORタイプのイベントをログに記録する。</li><li>`WARNING`: WARNINGおよびERRORタイプのイベントをログに記録する。</li><li>`ERROR`: ERRORタイプのイベントのみをログに記録する。</li></ul>デフォルトの値は `DEBUG`。提供されたスキーマと一致しないリクエストおよびレスポンスのログは、ERRORタイプを持っています。                                                                                                                                                                                                                                       | いいえ        |
| <a name="apifw-custom-block-status-code"></a>`APIFW_CUSTOM_BLOCK_STATUS_CODE` | `BLOCK` モードで動作しているAPIファイアウォールが、マウントされた OpenAPI 3.0 仕様と一致しないリクエストまたはレスポンスを返す場合の [HTTP レスポンスステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。デフォルトの値は `403`。 | いいえ 
| `APIFW_ADD_VALIDATION_STATUS_HEADER`<br>(実験的) | リクエストのブロック理由が含まれた `Apifw-Validation-Status` ヘッダ를 반환するかどうか。値は `true` または `false`。デフォルト値は `false`です。| いいえ
| `APIFW_LOG_FORMAT` | API ファイアウォールのログ形式。値は `TEXT` または `JSON`。 デフォルト値は `TEXT` です。 | いいえ |
| `APIFW_SHADOW_API_EXCLUDE_LIST`<br>(リクエストとレスポンスの両方に対して `LOG_ONLY` モードで動作する場合のみ) | 仕様に含まれていない要求されたAPI エンドポイントがシャドウではないことを示す [HTTP レスポンスステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。セミコロンで区切って複数のステータスコードを指定できます（例：`404;401`）。デフォルト値は `404`。<br><br>デフォルトで、リクエストとレスポンスの両方に対して `LOG_ONLY` モードで動作する APIファイアウォールは、仕様に含まれていないエンドポイントでコードが `404` と異なるものすべてをシャドウエンドポイントとしてマークします。 | いいえ

API ファイアウォールの設定オプションの詳細は[リンク](#api-firewall-fine-tuning-options)内に記載されています。

**`services.api-firewall.ports` および `services.api-firewall.networks` で**、APIファイアウォールコンテナポートを設定し、コンテナを作成されたネットワークに接続します。 提供される **docker-compose.yml** は、APIファイアウォールを `api-firewall-network` [ネットワーク](https://docs.docker.com/network/) に接続された状態でポート 8088 で起動するように Docker に指示します。## ステップ5. 構成済み環境のデプロイ

構成済みの環境をビルドし、起動するには、次のコマンドを実行してください。

```bash
docker-compose up -d --force-recreate
```

ログ出力を確認するには：

```bash
docker-compose logs -f
```

## ステップ6. APIファイアウォールの操作をテストする

APIファイアウォールの動作をテストするには、マウントされたOpen API 3.0仕様に一致しないリクエストをAPIファイアウォールDockerコンテナのアドレスに送信します。例えば、integer値を必要とするパラメータにstring値を渡すことができます。

リクエストが提供されたAPIスキーマと一致しない場合、適切なERRORメッセージがAPIファイアウォールDockerコンテナのログに追加されます。

## ステップ７. APIファイアウォールでトラフィックを有効にする

APIファイアウォールの設定を最終化するために、アプリケーションのデプロイスキーマ設定を更新して、APIファイアウォールでの受信トラフィックを有効にしてください。たとえば、Ingress、NGINX、またはロードバランサーの設定を更新する必要があります。

## APIファイアウォールの微調整オプション

APIファイアウォールを微調整して、より多くのビジネス問題に対処することができます。サポートされている微調整オプションが以下にリストされています。[APIファイアウォールDockerコンテナの設定](#step-4-configure-api-firewall)で環境変数として渡してください。

### リクエスト認証トークンの検証

OAuth 2.0プロトコルに基づく認証を使用している場合、APIファイアウォールを構成して、アプリケーションサーバーにリクエストをプロキシする前にアクセストークンを検証できます。APIファイアウォールは、アクセストークンが`Authorization: Bearer`リクエストヘッダーで渡されることを期待しています。

APIファイアウォールは、[仕様](https://swagger.io/docs/specification/authentication/oauth2/)で定義されているスコープとトークンのメタ情報のスコープが同じである場合、トークンが有効であると見なします。 `APIFW_REQUEST_VALIDATION`の値が`BLOCK`の場合、APIファイアウォールは無効なトークンを持つリクエストをブロックします。 `LOG_ONLY`モードでは、無効なトークンを持つリクエストはログに記録されるだけです。

OAuth 2.0トークン検証フローの構成には、次のオプションの環境変数を使用します。

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_SERVER_OAUTH_VALIDATION_TYPE` | 認証トークンの検証のタイプ：<ul><li>`JWT`：リクエスト認証にJWTを使用しています。 `APIFW_SERVER_OAUTH_JWT_*`変数を介してさらなる構成を行ってください。</li><li>`INTROSPECTION`：トークンイントロスペクションサービスで検証できる他のトークンタイプを使用しています。 `APIFW_SERVER_OAUTH_INTROSPECTION_*`変数を介してさらなる構成を行ってください。</li></ul> |
| `APIFW_SERVER_OAUTH_JWT_SIGNATURE_ALGORITHM` | JWTの署名に使用されているアルゴリズム：`RS256`、`RS384`、`RS512`、`HS256`、`HS384`、または`HS512`。<br><br>`ECDSA`アルゴリズムで署名されたJWTはAPIファイアウォールで検証できません。 |
| `APIFW_SERVER_OAUTH_JWT_PUB_CERT_FILE` | JWTがRS256、RS384、またはRS512アルゴリズムで署名されている場合、RSA公開鍵ファイル（`*.pem`）へのパス。このファイルはAPIファイアウォールDockerコンテナにマウントする必要があります。 |
| `APIFW_SERVER_OAUTH_JWT_SECRET_KEY` | JWTがHS256、HS384、またはHS512アルゴリズムで署名されている場合、JWTの署名に使用されている秘密鍵の値。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT` | [トークンイントロスペクションエンドポイント](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/)。エンドポイントの例：<ul><li>`https://www.googleapis.com/oauth2/v1/tokeninfo`：Google OAuthを使用する場合</li><li>`http://sample.com/restv1/introspection`：Gluu OAuth 2.0トークン用</li></ul> |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` | イントロスペクションエンドポイントへのリクエストの方法。 `GET`か`POST`になります。<br><br>デフォルト値は`GET`です。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_TOKEN_PARAM_NAME` | イントロスペクションエンドポイントへのリクエストでトークン値を含むパラメータの名前。 `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD`の値に応じて、APIファイアウォールは自動的にクエリパラメータまたはボディパラメータと見なします。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_CLIENT_AUTH_BEARER_TOKEN` |  イントロスペクションエンドポイントへのリクエストに認証するためのBearerトークンの値。 |
| <a name="apifw-server-oauth-introspection-content-type"></a>`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE` | トークンイントロスペクションサービスのメディアタイプを示す`Content-Type`ヘッダーの値。デフォルト値は`application/octet-stream`です。 |
| `APIFW_SERVER_OAUTH_INTROSPECTION_REFRESH_INTERVAL` | キャッシュされたトークンメタデータのタイムツーリブ。APIファイアウォールはトークンのメタデータをキャッシュし、同じトークンでリクエストが届くと、キャッシュからメタデータを取得します。<br><br>間隔は、時間（`h`）、分（`m`）、秒（`s`）、または組み合わせた形式で設定できます（例：`1h10m50s`）。<br><br>デフォルト値は`10m`（10分）です。 |

### 暗号化された認証トークンを持つリクエストのブロック

APIリークが検出された場合、Wallarm APIファイアウォールは、[妨害された認証トークンの使用を停止できます](https://lab.wallarm.com/oss-api-firewall-unveils-new-feature-blacklist-for-compromised-api-tokens-and-cookies/)。リクエストに妨害されたトークンが含まれている場合、APIファイアウォールは、[`APIFW_CUSTOM_BLOCK_STATUS_CODE`](#apifw-custom-block-status-code)で設定されたコードでこのリクエストに対応します。

ブラックリスト機能を有効にするには：

1. 妨害されたトークンを含むブラックリストファイルをDockerコンテナにマウントします。ブラックリストテキストファイルは次のようになります。

    ```txt
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODIifQ.CUq8iJ_LUzQMfDTvArpz6jUyK0Qyn7jZ9WCqE0xKTCA
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODMifQ.BinZ4AcJp_SQz-iFfgKOKPz_jWjEgiVTb9cS8PP4BI0
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODQifQ.j5Iea7KGm7GqjMGBuEZc2akTIoByUaQc5SSX7w_qjY8
    ```
2. Dockerコンテナに以下の変数を渡すことで、ブラックリスト機能の設定を行います。

    | 環境変数 | 説明 |
    | -------------------- | ----------- |
    | `APIFW_DENYLIST_TOKENS_FILE` | コンテナにマウントされたテキストブラックリストファイルのパス。ファイル内のトークンは改行で区切られている必要があります。例：`/api-firewall/resources/tokens-denylist.txt`。 |
    | `APIFW_DENYLIST_TOKENS_COOKIE_NAME` | 認証トークンを渡すために使用されるCookieの名前。 |
    | `APIFW_DENYLIST_TOKENS_HEADER_NAME` | 認証トークンを渡すために使用されるヘッダーの名前。`APIFW_DENYLIST_TOKENS_COOKIE_NAME`と`APIFW_DENYLIST_TOKENS_HEADER_NAME`の両方の変数が指定されている場合、APIファイアウォールは順番に値をチェックします。 |
    | `APIFW_DENYLIST_TOKENS_TRIM_BEARER_PREFIX` | 認証ヘッダーから`Bearer`プレフィックスをトリムするかどうか。認証ヘッダーに`Bearer`プレフィックスが渡され、ブラックリスト内のトークンにこのプレフィックスが含まれていない場合、トークンは信頼性のある方法で検証されません。<br>値は`true`または`false`になります。デフォルト値は`false`です。 |

### 保護されたアプリケーションのSSL/TLS設定

カスタムCA証明書で署名された保護されたアプリケーションサーバーとの接続、またはAPIファイアウォールとの安全でない接続を容易にするために、次のオプションの環境変数を使用します。

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_SERVER_INSECURE_CONNECTION` | 保護されたアプリケーションサーバーのSSL/TLS証明書の検証を無効にするかどうか。サーバーアドレスは、変数`APIFW_SERVER_URL`で指定されています。<br><br>デフォルト値は`false`です。デフォルトでインストールされているCA証明書または`APIFW_SERVER_ROOT_CA`で指定されているのものを使用して、アプリケーションへのすべての接続がセキュアにしようとします。 |
| `APIFW_SERVER_ROOT_CA`<br>(`APIFW_SERVER_INSECURE_CONNECTION`の値が`false`の場合のみ) | Dockerコンテナ内の保護されたアプリケーションサーバーのCA証明書へのパス。まず、CA証明書をAPIファイアウォールDockerコンテナにマウントする必要があります。 |### APIファイアウォール SSL/TLS 設定

動作しているAPIファイアウォールのサーバーでSSL/TLSを設定するには、以下のオプションの環境変数を使用してください：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_TLS_CERTS_PATH`            | API Firewall用に生成された証明書と秘密鍵がマウントされたコンテナディレクトリへのパス。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `APIFW_TLS_CERT_FILE`             | APIFW_TLS_CERTS_PATHで指定されたディレクトリにある、API Firewall用に生成されたSSL/TLS証明書のファイル名。                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `APIFW_TLS_CERT_KEY`              | APIFW_TLS_CERTS_PATHで指定されたディレクトリにある、API Firewall用に生成されたSSL/TLS秘密鍵のファイル名。                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### システム設定

APIファイアウォールのシステム設定を調整するために、以下のオプションの環境変数を使用してください：

| 環境変数 | 説明 |
| -------------------- | ----------- |
| `APIFW_READ_TIMEOUT`              | アプリケーションURLに送信された完全なリクエスト（本文を含む）をAPIファイアウォールが読み取るまでの## `docker run`を使ってAPI Firewallを起動する方法

DockerでAPI Firewallを開始するには、以下の例に示すように、通常のDockerコマンドも使用できます。

1. [コンテナ化されたアプリケーションとAPI Firewallの通信を手動リンクなしで許可するために、別々のDockerネットワークを作成する](#step-2-configure-the-docker-network)：

    ```bash
    docker network create api-firewall-network
    ```
2. [API Firewallで保護されるべきコンテナ化されたアプリケーションを開始する](#step-3-configure-the-application-to-be-protected-with-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p 8090:8090 kennethreitz/httpbin
    ```
3. [API Firewallを起動する](#step-4-configure-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
        -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
        -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
        -p 8088:8088 wallarm/api-firewall:v0.6.9
    ```
4. 環境が開始されたら、ステップ6と7に従ってAPI Firewallでトラフィックをテストして有効にします。