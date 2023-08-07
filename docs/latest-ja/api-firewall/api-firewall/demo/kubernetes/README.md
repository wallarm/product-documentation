# KubernetesとのWallarm API Firewallデモ

このデモでは、アプリケーション[**httpbin**](https://httpbin.org/)とWallarm API Firewallをプロキシとしてデプロイし、**httpbin** APIを保護します。両方のアプリケーションはKubernetesのDockerコンテナで実行されています。

## システム要件

このデモを実行する前に、お使いのシステムが以下の要件を満たしていることを確認してください：

* Docker Engine 20.x 以上が [Mac](https://docs.docker.com/docker-for-mac/install/)、[Windows](https://docs.docker.com/docker-for-windows/install/)、または [Linux](https://docs.docker.com/engine/install/#server)にインストールされている
* [Docker Compose](https://docs.docker.com/compose/install/)がインストールされている
* **make**が [Mac](https://formulae.brew.sh/formula/make)、[Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download)、または Linux（適切なパッケージ管理ユーティリティを使用して）にインストールされている

このデモ環境の実行はリソースを多く消費する可能性があります。以下のリソースが利用可能なことを確認してください：

* 少なくとも2つのCPUコア
* 少なくとも6GBの揮発性メモリ

## 使用されるリソース

このデモで使用されるリソースは次のとおりです：

* [**httpbin** Docker イメージ](https://hub.docker.com/r/kennethreitz/httpbin/)
* [API Firewall Docker イメージ](https://hub.docker.com/r/wallarm/api-firewall)

## デモコードの説明

[デモコード](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)は、デプロイされた**httpbin**とAPI Firewallを持つKubernetesクラスタを実行します。

Kubernetesクラスタを実行するために、このデモはツール[**kind**](https://kind.sigs.k8s.io/)を使用します。これは、Dockerコンテナをノードとして使用してK8sクラスタを数分で実行することが可能です。いくつかの抽象化レイヤーを使用して、**kind**およびその依存関係は、Kubernetesクラスタを起動するDockerイメージにパックされています。

デモのデプロイメントは以下のディレクトリ/ファイルを通じて設定されます：

* **httpbin** APIのOpenAPI 3.0仕様は、ファイル `volumes/helm/api-firewall.yaml`の `manifest.body` パスに位置しています。この仕様を使用して、API Firewallではアプリケーションのアドレスに送信されるリクエストとレスポンスがアプリケーションのAPIスキーマと一致するかどうかを検証します。
    
    この仕様は、[元の**httpbin**のAPIスキーマ](https://httpbin.org/spec.json)を定義していません。API Firewallの機能をより透明に示すために、元のOpenAPI 2.0スキーマを明示的に変換し、複雑にし、変更された仕様を `volumes/helm/api-firewall.yaml` > `manifest.body`に保存しました。
* `Makefile` はDockerルーチンを定義する設定ファイルです。
* `docker-compose.yml`は次の設定を定義するファイルです。一時的なKubernetesクラスタを実行するための：

    * [`docker/Dockerfile`](https://github.com/wallarm/api-firewall/blob/main/demo/kubernetes/docker/Dockerfile)に基づいて[**kind**](https://kind.sigs.k8s.io/) ノードの構築。
    * KubernetesとDockerのサービスディスカバリーを同時に提供するDNSサーバーのデプロイメント。
    * ローカルDockerレジストリと `dind` サービスのデプロイメント。
    * **httpbin**と [API Firewall Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/) イメージの設定。

## ステップ1：デモコードの実行

デモコードを実行するには：

1. デモコードが含まれる GitHubリポジトリをクローンします：

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2.  クローンしたリポジトリの `demo/kubernetes` ディレクトリに変更します：

    ```bash
    cd api-firewall/demo/kubernetes
    ```
3. 以下のコマンドを使用してデモコードを実行します。このデモの実行はリソースを多く消費する可能性があることに注意してください。デモ環境の開始には最大3分かかることがあります。

    ```bash
    make start
    ```

    * API Firewallによって保護されたアプリケーション**httpbin**は http://localhost:8080 で利用可能になります。
    * API Firewallによって保護されていないアプリケーション**httpbin**は http://localhost:8090 で利用可能になります。デモのデプロイメントをテストする際には、保護されていないアプリケーションにリクエストを送信して、二つのアプリケーションの違いを確認できます。
4.  デモのテストに進みます。

## ステップ2：デモのテスト

以下のリクエストを用いて、デプロイしたAPI Firewallをテストすることができます：

* API Firewallが露出していないパスに送信されるリクエストをブロックします：

    ```bash
    curl -sD - http://localhost:8080/unexposed/path
    ```

    予測されるレスポンス：

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* API Firewallが整数データタイプが必要なパラメータに文字列値が渡されたリクエストをブロックします：

    ```bash
    curl -sD - http://localhost:8080/cache/arewfser
    ```

    予測されるレスポンス：

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

    このケースでは、API FirewallがアプリケーションをキャッシュベースのDoS攻撃から保護することを示しています。
* API Firewallが以下の定義に一致しない必須クエリパラメータ `int` を持つリクエストをブロックします：

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
    # 必須のクエリパラメータが間違ったリクエスト
    curl -sD - http://localhost:8080/get

    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    
    # intパラメータの値が有効範囲内のリクエスト
    curl -sD - http://localhost:8080/get?int=15

    # 予測されるレスポンス
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # int パラメータの値が範囲外のリクエスト
    curl -sD - http://localhost:8080/get?int=5

    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # int パラメータの値が範囲外のリクエスト
    curl -sD - http://localhost:8080/get?int=1000

    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # int パラメータの値が範囲外のリクエスト
    # 邪悪な可能性： 8バイト整数のオーバーフローがスタックドロップで反応する
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* API Firewallが以下の定義に一致しないクエリパラメータ `str` を持つリクエストをブロックします：

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

   以下のリクエストを使用して定義をテストします（ `int` パラメータは依然として必要です）：

    ```bash
    # 定義した正規表現に一致しないstrパラメータの値を持つリクエスト
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # 定義した正規表現に一致しないstrパラメータの値を持つリクエスト
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # 定義した正規表現に一致するstrパラメータの値を持つリクエスト
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # 予測されるレスポンス
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # 定義した正規表現に一致しないstrパラメータの値を持つリクエスト
    # 邪悪な可能性：SQLインジェクション
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # 予測されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## ステップ4：デモコードの停止

デモデプロイメントを停止し、環境をクリアするために次のコマンドを使用します：

```bash
make stop
```