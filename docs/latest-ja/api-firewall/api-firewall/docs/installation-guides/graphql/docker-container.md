# Docker上でGraphQL API のAPI Firewallを実行する

このガイドは、GraphQL APIリクエストの検証のためのDocker上での[Wallarm API Firewall](../../index.md)のダウンロード、インストール、起動を説明します。GraphQLモードでは、API Firewallはプロキシとして機能し、ユーザからのGraphQLリクエストをHTTPまたはWebSocket(`graphql-ws`)プロトコルを使用してバックエンドサーバに転送します。バックエンドの実行前に、FirewallはGraphQLクエリの複雑さ、深さ、ノード数を検査します。

API FirewallはGraphQLクエリの応答を検証しません。

## 必須条件

* [Dockerのインストールと設定](https://docs.docker.com/get-docker/)
* Wallarm API Firewallで保護されるべきアプリケーションのGraphQL APIのために開発された[GraphQL仕様](http://spec.graphql.org/October2021/) 

## Docker上でAPI Firewallを実行する方法

API FirewallをDockerにデプロイする最速の方法は[Docker Compose](https://docs.docker.com/compose/)です。以下の手順はこの方法を使用することを前提としています。

必要に応じて、`docker run`も使用できます。同環境をデプロイするための適切な`docker run`コマンドを[こちらのセクション](#using-docker-run-to-start-api-firewall)で提供しています。

## ステップ1. `docker-compose.yml` ファイルの作成

Docker Composeを使用してAPI Firewallと適切な環境をデプロイするために、以下の内容で**docker-compose.yml**を最初に作成します。これ以降の手順では、このテンプレートを変更します。

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
      APIFW_MODE: graphql
      APIFW_GRAPHQL_SCHEMA: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_GRAPHQL_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY: <MAX_QUERY_COMPLEXITY>
      APIFW_GRAPHQL_MAX_QUERY_DEPTH: <MAX_QUERY_DEPTH>
      APIFW_GRAPHQL_NODE_COUNT_LIMIT: <NODE_COUNT_LIMIT>
      APIFW_GRAPHQL_INTROSPECTION: <ALLOW_INTROSPECTION_OR_NOT>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: <IMAGE_WITH_GRAPHQL_APP>
    restart: on-failure
    ports:
      - <HOST_PORT>:<CONTAINER_PORT>
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## ステップ2. Dockerのネットワークを設定する

必要に応じて、**docker-compose.yml** → `networks`で定義されている[Dockerネットワーク](https://docs.docker.com/network/)の設定を変更します。

提供されている**docker-compose.yml**は、Dockerに`api-firewall-network`ネットワークを作成し、アプリケーションとAPI Firewallのコンテナをそれにリンクするよう指示します。

保護されたコンテナ化アプリケーションとAPI Firewallの通信を手動でリンクすることなく可能にするため、専用のDockerネットワークを使用することを推奨します。

## ステップ3. API Firewallで保護するアプリケーションの設定

API Firewallで保護するためのコンテナ化されたアプリケーションの設定を変更します。この設定は**docker-compose.yml** → `services.backend`で定義されています。

このテンプレートは、Dockerに指定されたアプリケーションのDockerコンテナを起動し、それを`api-firewall-network`に接続し、`backend` [ネットワークエイリアス](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname)を指定するよう指示します。ポートはあなたの要件に合わせて定義できます。

あなたのアプリケーションの設定を行う際は、成功したコンテナ起動のために必要な設定のみを含めてください。特別なAPI Firewallの設定は必要ありません。

## ステップ4. API Firewallの設定

**docker-compose.yml** → `services.api-firewall`内でAPI Firewallの設定を以下のように行います：

**`services.api-firewall.volumes`で**、[GraphQL仕様](http://spec.graphql.org/October2021/)をAPI Firewallコンテナディレクトリにマウントします：
    
* `<HOST_PATH_TO_SPEC>`: ホストマシン上のあなたのAPIのGraphQL仕様へのパスです。ファイル形式は問わないですが、通常は `.graphql`あるいは`gql` です。たとえば：`/opt/my-api/graphql/schema.graphql`。
* `<CONTAINER_PATH_TO_SPEC>`: GraphQL仕様をマウントするコンテナディレクトリへのパスです。たとえば：`/api-firewall/resources/schema.graphql`。

**`services.api-firewall.environment`で**、以下の環境変数を通じて一般的なAPI Firewallの設定を行ってください：

| 環境変数 | 説明 | 必須? |
| -------------------- | ----------- | --------- |
| `APIFW_MODE` | 一般的なAPI Firewallモードを設定します。可能な値は[`PROXY`](../docker-container.md) (デフォルト)、`graphql` および [`API`](../api-mode.md)です。 | いいえ |
| <a name="apifw-api-specs"></a>`APIFW_GRAPHQL_SCHEMA` | コンテナにマウントされたGraphQL仕様ファイルへのパス。例:`/api-firewall/resources/schema.graphql`。 | はい |
| `APIFW_URL` | API FirewallのURL。例:`http://0.0.0.0:8088/`。ポートの値は、ホストに発行されたコンテナのポートに対応するべきである。<br><br>API FirewallがHTTPSプロトコルをリッスンしている場合は、生成されたSSL/TLS証明書と秘密鍵をコンテナにマウントし、以下で説明する**API Firewall SSL/TLS設定**をコンテナに渡すのです。 | はい |
| `APIFW_SERVER_URL` | マウントされた仕様書に記述された、API Firewallで保護すべきアプリケーションのURL。例：`http://backend:80`。 | はい |
| <a name="apifw-graphql-request-validation"></a>`APIFW_GRAPHQL_REQUEST_VALIDATION` | アプリケーションのURLに送信されるリクエストを検証する際のAPI Firewallのモード：<ul><li>`BLOCK`は、マウントされたGraphQLスキーマに一致しないリクエストをブロックし、ログに記録し、`403 Forbidden`を返します。ログは[`STDOUT`および`STDERR` Dockerサービス](https://docs.docker.com/config/containers/logging/)に送信されます。</li><li>`LOG_ONLY`は（ブロックせずに）一致しないリクエストをログに記録します。</li><li>`DISABLE`はリクエスト検証をオフにします。</li></ul>この変数は、[`APIFW_GRAPHQL_WS_CHECK_ORIGIN`](websocket-origin-check.md) を除くすべての他のパラメータに影響を及ぼします。たとえば、`APIFW_GRAPHQL_INTROSPECTION`が`false`でモードが`LOG_ONLY`である場合、インターロギング要求はバックエンドサーバに到達しますが、API Firewallは対応するエラーログを生成します。 | はい |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | クエリを実行するために必要な可能性のあるNodeリクエストの最大数を[定義](limit-compliance.md)します。`0`に設定すると、複雑さのチェックが無効になります。デフォルトの値は`0`です。 | はい |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | GraphQLクエリの許可される最大深度を[指定](limit-compliance.md)します。値が`0`の場合、クエリ深度のチェックはスキップされます。 | はい |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | クエリ中のノード数の上限を[設定](limit-compliance.md)します。`0`に設定すると、ノード数制限のチェックがスキップされます。 | はい |
| <a name="apifw-graphql-introspection"></a>`APIFW_GRAPHQL_INTROSPECTION` | あなたのGraphQLスキーマのレイアウトを公開するインターロギングクエリを許可します。`true`に設定すると、これらのクエリが許可されます。 | はい |
| `APIFW_LOG_LEVEL` | API Firewallのログレベル。可能な値：<ul><li>`DEBUG`はあらゆるタイプのイベント(INFO、ERROR、WARNING、およびDEBUG)をログに記録します。</li><li>`INFO`はINFO型、WARNING型、ERROR型のイベントをログに記録します。</li><li>`WARNING`はWARNING型とERROR型のイベントをログに記録します。</li><li>`ERROR`はERROR型のイベントのみをログに記録します。</li><li>`TRACE`は着信リクエストとAPI Firewallレスポンス、およびその内容をログに記録します。</li></ul> デフォルト値は `DEBUG` です。提供されたスキーマに一致しないリクエストとレスポンスに関するログはERROR型です。 | いいえ |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | `true`に設定すると、プロキシされたリクエストから`Accept-Encoding`ヘッダーが削除されます。デフォルト値は`false`です。 | いいえ |
| `APIFW_LOG_FORMAT` | API Firewallのログの形式。値は`TEXT`または`JSON`にすることができます。デフォルト値は`TEXT`です。 | いいえ |

**`services.api-firewall.ports`と`services.api-firewall.networks`で**、API Firewallコンテナのポートを設定し、コンテナを作成したネットワークに接続します。

## ステップ5. 設定した環境のデプロイ

設定した環境をビルドして起動するには、以下のコマンドを実行します：

```bash
docker-compose up -d --force-recreate
```

ログの出力を確認するには：

```bash
docker-compose logs -f
```

## ステップ6. API Firewallの動作をテストする

API Firewallの操作をテストするには、マウントされたGraphQL仕様に一致しないリクエストをAPI Firewall Dockerコンテナのアドレスに送信します。

`APIFW_GRAPHQL_REQUEST_VALIDATION`が`BLOCK`に設定されている場合、ファイアウォールは次のように動作します：

* APIファイアウォールがリクエストを許可すると、リクエストをバックエンドサーバにプロキシします。 
* APIファイアウォールがリクエストを解析できない場合、それは500ステータスコードを持つGraphQLエラーを応答します。
* APIファイアウォールによる検証が失敗すると、リクエストはバックエンドサーバにプロキシされず、200ステータスコードとGraphQLエラーをレスポンスとしてクライアントに応答します。

もしリクエストが提供されたAPIスキーマと一致しない場合、適切なERRORメッセージがAPI Firewall Dockerコンテナのログに追加されます。例えば、JSON形式では次のようになります：

```json
{
  "errors": [
    {
      "message": "field: name not defined on type: Query",
      "path": [
        "query",
        "name"
      ]
    }
  ]
}
```

リクエスト中の複数のフィールドが無効な場合でも、単一のエラーメッセージのみが生成されます。

## ステップ7. API Firewallにトラフィックを有効にする

API Firewallの設定を完了させるには、アプリケーションのデプロイメントスキーマの設定を更新してAPI Firewallへの入力トラフィックを有効にしてください。例えば、Ingress、NGINX、またはロードバランサーの設定を更新する必要があります。

## デプロイした環境の停止

Docker Composeを使用してデプロイした環境を停止するには、以下のコマンドを実行します：

```bash
docker-compose down
```

## `docker run`を使用してAPI Firewallを起動する

API FirewallをDocker上で起動するためには、以下のように通常のDockerコマンドも使用できます：

1. コンテナ化されたアプリケーションとAPI Firewallの通信を手動リンク無しで可能にするために、[別途Dockerネットワークを作成します](#step-2-configure-the-docker-network)：

    ```bash
    docker network create api-firewall-network
    ```
2. API Firewallで保護されるべき[コンテナ化されたアプリケーションを開始します](#step-3-configure-the-application-to-be-protected-with-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p <HOST_PORT>:<CONTAINER_PORT> <IMAGE_WITH_GRAPHQL_APP>
    ```
3. [API Firewallを開始します](#step-4-configure-api-firewall)：

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_MODE=graphql \
        -e APIFW_GRAPHQL_SCHEMA=<PATH_TO_MOUNTED_SPEC> -e APIFW_URL=<API_FIREWALL_URL> \
        -e APIFW_SERVER_URL=<PROTECTED_APP_URL> -e APIFW_GRAPHQL_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> \
        -e APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY=<MAX_QUERY_COMPLEXITY> \
        -e APIFW_GRAPHQL_MAX_QUERY_DEPTH=<MAX_QUERY_DEPTH> -e APIFW_GRAPHQL_NODE_COUNT_LIMIT=<NODE_COUNT_LIMIT> \
        -e APIFW_GRAPHQL_INTROSPECTION=<ALLOW_INTROSPECTION_OR_NOT> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. 環境が起動したら、ステップ6と7に従ってテストを行い、API Firewall上のトラフィックを有効にします。