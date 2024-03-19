# Docker Composeを利用したWallarm API Firewallデモ

このデモは、アプリケーション[**httpbin**](https://httpbin.org/)と**httpbin** APIを保護するプロキシとしてのWallarm API Firewallをデプロイします。両方のアプリケーションはDockerコンテナ内で実行され、Docker Composeを使用して接続されます。

## システム要件

このデモを実行する前に、システムが以下の要件を満たしていることを確認してください：

* [Mac](https://docs.docker.com/docker-for-mac/install/)、[Windows](https://docs.docker.com/docker-for-windows/install/)、または[Linux](https://docs.docker.com/engine/install/#server)用にインストールされたDocker Engine 20.x以降
* [Docker Compose](https://docs.docker.com/compose/install/)がインストールされている
* [Mac](https://formulae.brew.sh/formula/make)、[Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download)、またはLinux（適切なパッケージ管理ユーティリティを使用して）に**make**がインストールされている

## 使用されるリソース

このデモで使用されるリソースは以下の通りです：

* [**httpbin** Dockerイメージ](https://hub.docker.com/r/kennethreitz/httpbin/)
* [API Firewall Dockerイメージ](https://hub.docker.com/r/wallarm/api-firewall)

## デモコードの説明

[デモコード](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)には、以下の構成ファイルが含まれています：

* `volumes`ディレクトリ内に位置する以下のOpenAPI 3.0仕様：
    * `httpbin.json`は[**httpbin** OpenAPI 2.0仕様](https://httpbin.org/spec.json)をOpenAPI 3.0仕様形式に変換したものです。
    * `httpbin-with-constraints.json`は追加のAPI制限が明示的に追加された**httpbin** OpenAPI 3.0仕様です。

    これらのファイルはどちらもデモデプロイをテストするために使用されます。
* `Makefile`はDockerルーチンを定義する設定ファイルです。
* `docker-compose.yml`は[API Firewall Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/)  イメージ設定を定義するファイルです。

## ステップ 1: デモコードの実行

デモコードを実行するには：

1. デモコードが含まれるGitHubリポジトリをクローンします：

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. クローンしたリポジトリの`demo/docker-compose`ディレクトリに移動します：

    ```bash
    cd api-firewall/demo/docker-compose
    ```
3. 以下のコマンドを使用してデモコードを実行します：

    ```bash
    make start
    ```

    * API Firewallによって保護されたアプリケーション**httpbin**は http://localhost:8080 で利用可能です。
    * API Firewallによって保護されていないアプリケーション**httpbin**は http://localhost:8090 で利用可能です。デモデプロイメントをテストする際に、保護されていないアプリケーションにリクエストを送信して違いを知ることができます。
4. デモのテストに進みます。

## ステップ 2: オリジナルのOpenAPI 3.0仕様に基づいたデモのテスト

デフォルトでは、このデモはオリジナルの**httpbin** OpenAPI 3.0仕様で実行されています。このデモオプションをテストするには、以下のリクエストを使用できます：

* API Firewallが公開されていないパスに送られたリクエストをブロックすることを確認：

    ```bash
    curl -sD - http://localhost:8080/unexposed/path
    ```

    期待される応答：

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* 整数データタイプが必要なパラメータに文字列値が渡されたリクエストをAPI Firewallがブロックすることを確認：

    ```bash
    curl -sD - http://localhost:8080/cache/arewfser
    ```

    期待される応答：

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

    このケースは、API FirewallがアプリケーションをCache-Poisoned DoS攻撃から保護することを示しています。

## ステップ 3: より厳格なOpenAPI 3.0仕様に基づいたデモのテスト

まず、デモで使用されるOpenAPI 3.0仕様のパスを更新してください：

1. `docker-compose.yml`ファイルで、`APIFW_API_SPECS`環境変数の値をより厳格なOpenAPI 3.0仕様のパス(`/opt/resources/httpbin-with-constraints.json`)に置き換えます。
2. 以下のコマンドを使用してデモを再起動します：

    ```bash
    make stop
    make start
    ```

次に、このデモオプションをテストするために、以下の方法を使用できます：

* 以下の定義に一致しない必須クエリパラメータ`int`を持つリクエストがAPI Firewallによってブロックされることを確認：

    ```json
    ...
    {
      "in": "query",
      "name": "int",
      "schema": {
        "type": "integer",
        "minimum": 10,
        "maximum": 100
      },
      "required": true
    },
    ...
    ```

    以下のリクエストを使用して定義をテストします：

    ```bash
    # 必須クエリパラメータが不足しているリクエスト
    curl -sD - http://localhost:8080/get

    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    
    # intパラメータの値が有効範囲内であるリクエスト
    curl -sD - http://localhost:8080/get?int=15

    # 期待される応答
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # intパラメータの値が範囲外であるリクエスト
    curl -sD - http://localhost:8080/get?int=5

    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # intパラメータの値が範囲外であるリクエスト
    curl -sD - http://localhost:8080/get?int=1000

    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # intパラメータの値が範囲外であるリクエスト
    # 悪意の可能性：8バイトの整数オーバーフローはスタックドロップに対応できる
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* 以下の定義に一致しないクエリパラメータ`str`を持つリクエストがAPI Firewallによってブロックされることを確認：

    ```json
    ...
    {
      "in": "query",
      "name": "str",
      "schema": {
        "type": "string",
        "pattern": "^.{1,10}-\\d{1,10}$"
      }
    },
    ...
    ```

    定義された正規表現に一致しない`str`パラメータの値を持つ以下のリクエストを使用して定義をテストします（`int`パラメータは依然として必要です）：

    ```bash
    # 定義された正規表現に一致しないstrパラメータの値を持つリクエスト
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # 定義された正規表現に一致しないstrパラメータの値を持つリクエスト
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # 定義された正規表現に一致するstrパラメータの値を持つリクエスト
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # 期待される応答
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # 定義された正規表現に一致しないstrパラメータの値を持つリクエスト
    # 悪意の可能性：SQLインジェクション
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # 期待される応答
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## ステップ 4: デモコードの停止

デモデプロイメントを停止し環境をクリアするには、以下のコマンドを使用します：

```bash
make stop
```