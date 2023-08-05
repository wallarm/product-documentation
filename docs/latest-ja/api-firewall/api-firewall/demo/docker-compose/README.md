# ウォーラームAPIファイアウォールのデモ、Docker Composeを用いた例

このデモでは、アプリケーション [**httpbin**](https://httpbin.org/)とガード役のウォーラームAPIファイアウォールをデプロイします。**httpbin**のAPIがどのように守られているかを確認できます。両アプリケーションは Docker Composeを用いて接続されたDockerコンテナ内で動作します。

## システム要件

このデモを実行する前に、以下の要件を満たすシステムをご用意ください：

* [Mac](https://docs.docker.com/docker-for-mac/install/)、[Windows](https://docs.docker.com/docker-for-windows/install/)、または [Linix](https://docs.docker.com/engine/install/#server) 用にインストールされた Docker Engine 20.x 以上。
* [Docker Compose](https://docs.docker.com/compose/install/)がインストールされていること。
* [Mac](https://formulae.brew.sh/formula/make)、 [Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download)、または Linux（適切なパッケージ管理ユーティリティを用いる）用の **make** がインストールされていること。

## 使用されるリソース

このデモでは、以下のリソースを使用します：

* [**httpbin** Dockerイメージ](https://hub.docker.com/r/kennethreitz/httpbin/)
* [APIファイアウォールDockerイメージ](https://hub.docker.com/r/wallarm/api-firewall)

## デモコードの説明

[デモコード](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)には、以下の設定ファイルが含まれます：

* `volumes`ディレクトリに配置された、以下のOpenAPI 3.0の仕様：
    * `httpbin.json`は、[**httpbin**のOpenAPI 2.0仕様](https://httpbin.org/spec.json)をOpenAPI 3.0仕様形式に変換したものです。
    * `httpbin-with-constraints.json`は、追加のAPI制限を明示的に追加した**httpbin**のOpenAPI 3.0の仕様です。

  これらのファイルは、デモデプロイメントのテストに使用されます。
* Dockerのルーチンを定義する設定ファイルである`Makefile`。
* **httpbin**と[APIファイアウォールDocker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/)イメージの設定を定義する`docker-compose.yml`ファイル。

## ステップ1：デモコードの実行

デモコードを実行するには以下の手順を守ります。

1. デモコードを含むGitHubリポジトリをクローンします：

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

    * APIファイアウォールで保護されたアプリケーション**httpbin**はhttp://localhost:8080で利用できます。
    * APIファイアウォールで保護されていないアプリケーション**httpbin**はhttp://localhost:8090で利用できます。デモデプロイメントをテストする際に、保護されていないアプリケーションにリクエストを送信して、その違いを確認できます。
4. デモのテストに進みます。

## ステップ2：元のOpenAPI 3.0仕様に基づいたデモのテスト

デフォルトでは、このデモは元の**httpbin** OpenAPI 3.0の仕様で動作します。このデモオプションをテストするために、以下のリクエストを使用できます：

* APIファイアウォールが露出していないパスへのリクエストをブロックすることを確認します：

   ```bash
   curl -sD - http://localhost:8080/unexposed/path
   ```

   期待されるレスポンス：

   ```bash
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 06:58:29 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0
   ```
* APIファイアウォールが、整数のデータタイプが必要なパラメータに文字列値が渡されたリクエストをブロックすることを確認します：

   ```bash
   curl -sD - http://localhost:8080/cache/arewfser
   ```

   期待されるレスポンス：

   ```bash
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 06:58:29 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0
   ```

   このケースでは、APIファイアウォールがCache-Poisoned DoS攻撃からアプリケーションを保護していることを示しています。

## ステップ3：より厳格なOpenAPI 3.0仕様に基づいたデモのテスト

まず、デモで使用されるOpenAPI 3.0の仕様へのパスをアップデートしてください：

1. `docker-compose.yml`ファイル内で、`APIFW_API_SPECS`環境変数の値を、より厳格なOpenAPI 3.0の仕様(`/opt/resources/httpbin-with-constraints.json`)へのパスに置き換えます。
2. 以下のコマンドを使用してデモを再開します：

   ```bash
   make stop
   make start
   ```

その後、このデモオプションをテストするために、以下の方法を使用できます：

* APIファイアウォールが、以下の定義に合わない必須のクエリパラメータ`int`を含むリクエストをブロックすることを確認します：

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
   # 必要なクエリパラメータを欠いているリクエスト
   curl -sD - http://localhost:8080/get

   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:09:08 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0


   # intパラメータの値が範囲内にあるリクエスト
   curl -sD - http://localhost:8080/get?int=15

   # 期待するレスポンス
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

   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:09:27 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0


   # intパラメータの値が範囲外であるリクエスト
   curl -sD - http://localhost:8080/get?int=1000

   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:09:53 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0


   # intパラメータの値が範囲外であるリクエスト
   # 悪意のある可能性：8バイトの整数オーバーフローがスタックドロップで応答する可能性があります
   curl -sD - http://localhost:8080/get?int=18446744073710000001

   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:10:04 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0
   ```
* APIファイアウォールが、以下の定義に一致しないクエリパラメータ`str`を含むリクエストをブロックすることを確認します：

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

   以下のリクエストを使用して定義をテストします（`int`パラメータは引き続き必要です）：

   ```bash
   # strパラメータの値が規定された正規表現に一致しないリクエスト
   curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:10:42 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0


   # strパラメータの値が規定された正規表現に一致しないリクエスト
   curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
   
   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:10:42 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0


   # strパラメータの値が規定された正規表現にの一致するリクエスト
   curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

   # 期待するレスポンス
   HTTP/1.1 200 OK
   Server: gunicorn/19.9.0
   Date: Mon, 31 May 2021 07:11:03 GMT
   Content-Type: application/json
   Content-Length: 331
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Credentials: true
   ...


   # strパラメータの値が規定された正規表現に一致しないリクエスト
   # 悪意の可能性: SQLインジェクション
   curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

   # 期待するレスポンス
   HTTP/1.1 403 Forbidden
   Date: Mon, 31 May 2021 07:12:04 GMT
   Content-Type: text/plain; charset=utf-8
   Content-Length: 0
   ```

## ステップ4：デモコードの停止

デモデプロイメントを停止し、環境をクリアするには、次のコマンドを使用します：

```bash
make stop
```