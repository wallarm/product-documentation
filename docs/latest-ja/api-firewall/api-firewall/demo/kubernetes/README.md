# Wallarm API FirewallとKubernetesを使用したデモ

このデモでは、アプリケーション[**httpbin**](https://httpbin.org/)と、**httpbin** APIを保護するプロキシとしてのWallarm API FirewallがDockerコンテナ内でKubernetes上で動作しています。

## システム要件

このデモを実行する前に、システムが次の要件を満たしていることを確認してください：

* [Mac](https://docs.docker.com/docker-for-mac/install/)、[Windows](https://docs.docker.com/docker-for-windows/install/)、または[Linux](https://docs.docker.com/engine/install/#server)用にインストールされたDocker Engine 20.x以上
* [Docker Compose](https://docs.docker.com/compose/install/)がインストールされていること
* [Mac](https://formulae.brew.sh/formula/make)、[Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download)、またはLinux(適切なパッケージ管理ユーティリティを使用)用に**make**がインストールされていること

このデモ環境を実行することはリソースを多く使用する可能性があります。以下のリソースが利用可能であることを確認してください：

* 少なくとも2つのCPUコア
* 少なくとも6GBの揮発性メモリ

## 使用されるリソース

このデモで使用されるリソースは以下の通りです：

* [**httpbin** Dockerイメージ](https://hub.docker.com/r/kennethreitz/httpbin/)
* [API Firewall Dockerイメージ](https://hub.docker.com/r/wallarm/api-firewall)

## デモコードの説明

[デモコード](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)は、**httpbin**とAPI FirewallがデプロイされたKubernetesクラスタを実行します。

Kubernetesクラスタを実行するために、このデモは[Dockerコンテナとしてのノードを使用して数分でK8sクラスタを実行することを可能にするツール**kind**](https://kind.sigs.k8s.io/)を使用しています。いくつかの抽象化レイヤーを使用することで、**kind**とその依存関係はDockerイメージにパッケージされ、Kubernetesクラスタを起動します。

デモデプロイメントは、以下のディレクトリ/ファイルを介して構成されます：

* **httpbin** APIのOpenAPI 3.0仕様は、`volumes/helm/api-firewall.yaml`ファイルの`manifest.body`パスに位置しています。この仕様を使用して、API Firewallはアプリケーションアドレスに送信されたリクエストとレスポンスがアプリケーションAPIスキーマに一致するかどうかを検証します。

    この仕様は、[**httpbin**の元のAPIスキーマ](https://httpbin.org/spec.json)を定義していません。API Firewallの機能をより透明に示すために、元のOpenAPI 2.0スキーマを明示的に変換・複雑化し、変更された仕様を`volumes/helm/api-firewall.yaml` > `manifest.body`に保存しました。
* `Makefile`はDockerルーチンを定義する設定ファイルです。
* `docker-compose.yml`は、次の構成の一時的なKubernetesクラスタを実行するためのファイルです：

    * [`docker/Dockerfile`](https://github.com/wallarm/api-firewall/blob/main/demo/kubernetes/docker/Dockerfile)に基づいて構築された[**kind**](https://kind.sigs.k8s.io/)ノード。
    * KubernetesとDockerサービスディスカバリの同時デプロイメントにDNSサーバーを配置。
    * ローカルDockerレジストリと`dind`サービスのデプロイメント。
    * **httpbin**と[API Firewall Docker](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/)イメージの設定。

## ステップ1：デモコードの実行

デモコードを実行するには：

1. デモコードが含まれているGitHubリポジトリをクローンします：

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. クローンしたリポジトリの`demo/kubernetes`ディレクトリに変更します：

    ```bash
    cd api-firewall/demo/kubernetes
    ```
3. 下記のコマンドを使用してデモコードを実行します。このデモを実行することはリソースを多く使用する可能性があることに注意してください。デモ環境を開始するまでに最大3分かかる場合があります。

    ```bash
    make start
    ```

    * API Firewallによって保護されたアプリケーション**httpbin**はhttp://localhost:8080で利用可能です。
    * API Firewallに保護されていないアプリケーション**httpbin**はhttp://localhost:8090で利用可能です。デモデプロイメントをテストする際に、保護されていないアプリケーションにリクエストを送信して、違いを知ることができます。
4. デモのテストに進みます。

## ステップ2：デモのテスト

次のリクエストを使用して、デプロイされたAPI Firewallをテストできます：

* API Firewallが公開されていないパスに送信されたリクエストをブロックすることを確認します：

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
* 整数データタイプが必要なパラメータに文字列値が渡されたリクエストがAPI Firewallによってブロックされるか確認します：

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

    このケースは、API FirewallがアプリケーションをCache-Poisoned DoS攻撃から保護していることを示しています。
* 必要なクエリパラメータ`int`が次の定義と一致しないリクエストがAPI Firewallによってブロックされるか確認します：

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

    次のリクエストを使用して定義をテストします：

    ```bash
    # 必要なクエリパラメータが欠落しているリクエスト
    curl -sD - http://localhost:8080/get

    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0

    
    # intパラメータ値が有効範囲内のリクエスト
    curl -sD - http://localhost:8080/get?int=15

    # 期待されるレスポンス
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # intパラメータ値が範囲外のリクエスト
    curl -sD - http://localhost:8080/get?int=5

    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # intパラメータ値が範囲外のリクエスト
    curl -sD - http://localhost:8080/get?int=1000

    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # intパラメータ値が範囲外のリクエスト
    # 潜在的な悪意：8バイト整数オーバーフローはスタックドロップで応答する可能性があります
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* クエリパラメータ`str`が次の定義と一致しないリクエストがAPI Firewallによってブロックされるか確認します：

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

    次のリクエストを使用して定義をテストします（`int`パラメータは依然として必要です）：

    ```bash
    # 定義された正規表現と一致しないstrパラメータ値を持つリクエスト
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # 定義された正規表現と一致しないstrパラメータ値を持つリクエスト
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # 定義された正規表現と一致するstrパラメータ値を持つリクエスト
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # 期待されるレスポンス
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # 定義された正規表現と一致しないstrパラメータ値を持つリクエスト
    # 潜在的な悪意：SQLインジェクション
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # 期待されるレスポンス
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## ステップ4：デモコードの停止

デモデプロイメントを停止して環境をクリアするには、コマンドを使用します：

```bash
make stop
```