# Docker上でREST APIのAPIファイアウォールを実行する

このガイドでは、Docker上でREST APIリクエストの検証のための[Wallarm APIファイアウォール](../index.md)のダウンロード、インストール、起動を説明します。

## 要件

* [Dockerがインストールおよび設定済み](https://docs.docker.com/get-docker/)
* Wallarm APIファイアウォールで保護するアプリケーションのREST APIに対して開発された[OpenAPI 3.0仕様](https://swagger.io/specification/)

## Docker上でAPIファイアウォールを実行する方法

APIファイアウォールをDocker上で展開する最速の方法は[Docker Compose](https://docs.docker.com/compose/)です。以下の手順はこの方法を使用するものです。

必要に応じて`docker run`も使用できます。このセクションでは、同様の環境をデプロイするための適切な`docker run`コマンドを提供しています。

## ステップ1.`docker-compose.yml`ファイルの作成

APIファイアウォールと適切な環境をDocker Composeを使用してデプロイするには、まず以下の内容で**docker-compose.yml**を作成します：

```yml
version: '3.8'

networks:
  api-firewall-network:
    name: api-firewall-network

services:
  api-firewall:
    container_name: api-firewall
    image: wallarm/api-firewall:v0.6.13
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

## ステップ2. Dockerネットワークの設定

必要に応じて、**docker-compose.yml** → `networks` で定義された[Dockerネットワーク](https://docs.docker.com/network/)の設定を変更します。

提供された**docker-compose.yml**は、Dockerに`api-firewall-network`ネットワークを作成させ、アプリケーションとAPIファイアウォールのコンテナをそれにリンクさせるよう指示します。

コンテナ化されたアプリケーションとAPIファイアウォールの通信を手動でリンクすることなく許可するために、別のDockerネットワークを使用することをお勧めします。

## ステップ3. APIファイアウォールで保護するアプリケーションの設定

APIファイアウォールで保護するコンテナ化されたアプリケーションの設定を変更します。この設定は**docker-compose.yml** → `services.backend`で定義されています。

提供された**docker-compose.yml**は、Dockerに命令して`api-firewall-network`に接続され、`backend` [ネットワークエイリアス](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname)が割り当てられた[kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) Dockerコンテナを起動します。 コンテナポートは8090です。

自分のアプリケーションを設定する場合は、アプリケーションコンテナが正しく起動するために必要な設定のみを定義し、APIファイアウォールに対する特定の設定は必要ありません。

## ステップ4. APIファイアウォールの設定

**docker-compose.yml** → `services.api-firewall`にAPIファイアウォールの設定を次のように渡します：

**`services.api-firewall.volumes`とともに**、[OpenAPI 3.0仕様書](https://swagger.io/specification/)をAPIファイアウォールのコンテナディレクトリにマウントしてください：
    
* `<HOST_PATH_TO_SPEC>`: ホストマシン上にあるアプリケーションのREST API用のOpenAPI 3.0仕様書へのパス。承認されたファイル形式はYAMLおよびJSON（`.yaml`、`.yml`、`.json`のファイル拡張子）。例: `/opt/my-api/openapi3/swagger.json`。
* `<CONTAINER_PATH_TO_SPEC>`: OpenAPI 3.0の仕様書をマウントするコンテナディレクトリへのパス。例：`/api-firewall/resources/swagger.json`。

**`services.api-firewall.environment`とともに**、次の環境変数を使用して一般的なAPIファイアウォールの設定を設定してください：

| 環境変数              | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 必要？ |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| <a name="apifw-api-specs"></a>`APIFW_API_SPECS`                 | OpenAPI 3.0の仕様書へのパス。パスを指定する方法は以下のとおりです：<ul><li>コンテナにマウントされた仕様書のパス。例：`/api-firewall/resources/swagger.json`。コンテナを起動するときに、このファイルを`-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`オプションでマウントします。</li><li>仕様書のURLアドレス。例：`https://example.com/swagger.json`。コンテナを起動するときに、`-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`オプションは省略します。</li></ul>| Yes       |
| `APIFW_URL`                       | APIファイアウォール用のURL。例： `http://0.0.0.0:8088/`。ポートの値は、ホストに公開されるコンテナのポートに対応すべきです。<br><br>APIファイアウォールがHTTPSプロトコルをリッスンしている場合は、生成されたSSL/TLS証明書と秘密鍵をコンテナにマウントし、以下に記載されている**APIファイアウォールSSL/TLS設定**をコンテナに渡してください。| Yes       |
| `APIFW_SERVER_URL`                | APIファイアウォールで保護すべき、マウントされたOpenAPI仕様書で説明されているアプリケーションのURL。例： `http://backend:80`。| Yes       |
| `APIFW_REQUEST_VALIDATION`        | アプリケーションURLへ送信されるリクエストを検証するときのAPIファイアウォールのモード：<ul><li>`BLOCK`は、マウントされたOpenAPI 3.0仕様書に一致しないリクエストをブロックし、ログに記録します（ブロックされたリクエストには`403 Forbidden`の応答が返されます）。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`LOG_ONLY`は、マウントされたOpenAPI 3.0仕様書に一致しないリクエストをログに記録しますが、ブロックはしません。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`DISABLE`はリクエストの検証を無効にします。</li></ul>                                                                                                                           | Yes       |
| `APIFW_RESPONSE_VALIDATION`       | 入力要求に対するアプリケーションの応答を検証する際のAPIファイアウォールモード：<ul><li>`BLOCK`は、アプリケーションの応答がマウントされたOpenAPI 3.0仕様書に一致しない場合、リクエストをブロックし、ログに記録します。このリクエストはアプリケーションURLにプロキシされますが、クライアントは`403 Forbidden`の応答を受け取ります。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`LOG_ONLY`は、アプリケーションの応答がマウントされたOpenAPI 3.0仕様書に一致しない場合、リクエストをログに記録しますが、ブロックしません。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`DISABLE`はリクエストの検証を無効にします。</li></ul> | Yes       |
| `APIFW_LOG_LEVEL`                 | APIファイアウォールのロギングレベル。可能な値：<ul><li>`DEBUG`はすべてのタイプのイベント（INFO、ERROR、WARNING、DEBUG）をログに記録します。</li><li>`INFO`はINFO、WARNING、ERRORタイプのイベントをログに記録します。</li><li>`WARNING`はWARNINGとERRORタイプのイベントをログに記録します。</li><li>`ERROR`はERRORタイプのイベントのみをログに記録します。</li><li>`TRACE`は、リクエストとAPIファイアウォールの応答、およびその内容をログに記録します。</li></ul> デフォルト値は`DEBUG`です。提供されたスキーマと一致しないリクエストと応答に関するログはERRORタイプです。                                                                                                                                                                                                                                       | No        |
| <a name="apifw-custom-block-status-code"></a>`APIFW_CUSTOM_BLOCK_STATUS_CODE` | リクエストまたは応答がマウントされたOpenAPI 3.0の仕様書と一致しない場合、`BLOCK`モードで動作するAPIファイアウォールが返す[HTTP応答ステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)です。デフォルト値は`403`です。| No
| `APIFW_ADD_VALIDATION_STATUS_HEADER`<br>(EXPERIMENTAL) | リクエストのブロック理由を含む`Apifw-Validation-Status`ヘッダーをリクエストの応答に返すかどうか。値は`true`または`false`です。デフォルト値は`false`です。| No |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | `true`に設定されている場合、プロキシリクエストから`Accept-Encoding`ヘッダーが削除されます。デフォルト値は`false`です。| No |
| `APIFW_LOG_FORMAT` | APIファイアウォールのログの形式。値は`TEXT`または`JSON`です。デフォルト値は`TEXT`です。 | No |
| `APIFW_SHADOW_API_EXCLUDE_LIST`<br>(only if API Firewall is operating in the `LOG_ONLY` mode for both the requests and responses) | 仕様に含まれていない要求されたAPIエンドポイントがShadowではないことを示す[HTTP応答ステータスコード](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)。セミコロン（例：`404;401`）で区切って複数のステータスコードを指定できます。デフォルト値は`404`です。<br><br>デフォルトでは、リクエストと応答の両方で`LOG_ONLY`モードで動作するAPIファイアウォールは、仕様に含まれておらず、`404`と異なるコードを返すすべてのエンドポイントをshadowとしてマークします。 | No |
| `APIFW_MODE` | 一般的なAPIファイアウォールのモードを設定します。可能な値は`PROXY`（デフォルト）、[`graphql`](graphql/docker-container.md)、[`API`](api-mode.md)です。 | No |
| `APIFW_PASS_OPTIONS` | `true`に設定すると、APIファイアウォールは仕様のエンドポイントへの`OPTIONS`リクエストを許可します。この方法が記述されていなくてもです。デフォルト値は`false`です。 | No |
| `APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION` | パラメータがOpenAPI仕様で定義されたものと一致しない場合、リクエストが仕様外として識別されるかどうかを指定します。デフォルト値は`true`です。<br><br>APIファイアウォールを[`API`モード](api-mode.md)で実行している場合、この変数の名前は`APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION`に変わります。 | No |

**`services.api-firewall.ports`および`services.api-firewall.networks`とともに**、APIファイアウォールのコンテナポートを設定し、コンテナを作成されたネットワークに接続します。提供された**docker-compose.yml**は、Dockerに、ポート8088で`api-firewall-network`[ネットワーク](https://docs.docker.com/network/)に接続されたAPIファイアウォールを起動するよう指示します。

## ステップ5. 設定された環境のデプロイ

設定された環境をビルドして開始するには、以下のコマンドを実行します：

```bash
docker-compose up -d --force-recreate
```

ログ出力を確認するには：

```bash
docker-compose logs -f
```

## ステップ6. APIファイアウォールの動作テスト

APIファイアウォールの動作をテストするには、OpenAPI 3.0の仕様と一致しないリクエストをAPIファイアウォールのDockerコンテナアドレスに送信します。たとえば、整数値が必要なパラメータに文字列の値を渡すことができます。

リクエストがAPIスキーマと一致しない場合、適切なERRORメッセージがAPIファイアウォールのDockerコンテナのログに追加されます。

## ステップ7. APIファイアウォール上のトラフィックを有効にする

APIファイアウォールの設定を完了するには、アプリケーションの展開スキームの設定を更新してAPIファイアウォールに対して着信トラフィックを有効にしてください。例えば、Ingress、NGINX、またはロードバランサーの設定を更新する必要があります。

## デプロイされた環境の停止

Docker Composeを使用してデプロイされた環境を停止するには、次のコマンドを実行します：

```bash
docker-compose down
```

## `docker run`を使用してAPIファイアウォールを起動する

Docker上でAPIファイアウォールを起動するために、以下の例のように通常のDockerコマンドも使用できます:

1. [別のDockerネットワークを作成する](#step-2-configure-the-docker-network)ことで、コンテナ化されたアプリケーションとAPIファイアウォールの通信を手動でリンクすることなく許可します：

    ```bash
    docker network create api-firewall-network
    ```
2. [APIファイアウォールで保護するコンテナ化されたアプリケーションを起動します](#step-3-configure-the-application-to-be-protected-with-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p 8090:8090 kennethreitz/httpbin
    ```
3. [APIファイアウォールを開始する](#step-4-configure-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
        -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
        -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. 環境が起動したら、ステップ6と7に従ってテストを行い、APIファイアウォール上のトラフィックを有効にします。