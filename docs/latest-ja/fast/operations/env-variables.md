[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

# FAST nodeで使用される環境変数の一覧

FAST nodeの設定には多くのパラメータが使用されます。これらのパラメータの値は、対応する環境変数を介して変更できます。

環境変数の値を設定し、それらの変数をFAST nodeに渡す方法は以下のとおりです。
* `-e`引数を使用して
    
    ```
    docker run --name <container name> \
    -e <environment variable 1>=<value> \
    ... 
    -e <environment variable N>=<value> \
    -p <target port>:8080 wallarm/fast
    ```
    
* 環境変数が含まれるファイルへのパスを指定する`--env-file`引数を使用して

    ```
    docker run --name <container name> \
    --env-file=<file with environment variables> \
    -p <target port>:8080 wallarm/fast
    ```
    
    このファイルには環境変数の一覧を1行に1変数ずつ記述します:

    ```
    # 環境変数のサンプルファイル

    WALLARM_API_TOKEN=token_Qwe12345            # これはサンプルの値です―実際のトークン値をご使用ください
    ALLOWED_HOSTS=google-gruyere.appspot.com    # このドメインをターゲットとするリクエストはテストレコードに記録されます
    ```

すべての設定可能なパラメータは、以下の表に記載されています:

| パラメータ             | 値     | 必須？ |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm Cloudからのトークンです。 | はい |
| `WALLARM_API_HOST`   	| Wallarm APIサーバのアドレスです。 <br>許容値: <br>`us1.api.wallarm.com`はWallarm US Cloud内のサーバ用、<br>`api.wallarm.com`はWallarm EU Cloud内のサーバ用です。 | はい |
| `ALLOWED_HOSTS`       | ターゲットアプリケーションのホスト一覧です。これらのホストをターゲットとするリクエストはテストレコードに記録されます。<br>デフォルトではすべてのリクエストが記録されます。<br>詳細は[こちら][anchor-allowed-hosts]を参照ください。 | いいえ |
| `WALLARM_API_USE_SSL` | Wallarm APIサーバへ接続する際にSSLを使用するかどうかを定義します。<br>許容値: `true` および `false`。<br>デフォルト値: `true`。 | いいえ |
| `WORKERS`             | ベースラインリクエストの処理およびセキュリティテストを行うスレッド数です。<br>デフォルト値: `10`。 | いいえ |
| `GIT_EXTENSIONS`      | [custom FAST DSL extensions][doc-dsl-ext]を含むGitリポジトリへのリンクです（このリポジトリはFAST nodeコンテナからアクセス可能である必要があります）。 | いいえ |
| `CI_MODE`             | CI/CDに統合する際のFAST nodeの動作モードです。<br>許容値:<br>`recording` は[レコーディングモード][doc-record-mode]、<br>`testing` は[テストモード][doc-test-mode]です。 | いいえ |
| `BACKEND_HTTPS_PORTS` | ターゲットアプリケーションでデフォルト以外のポートが設定されている場合に使用されるHTTPSポート番号です。<br>このパラメータの値には複数のポートを列挙できます。例:<br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>デフォルト値: `443` | いいえ |
| `WALLARM_API_CA_VERIFY` | Wallarm APIサーバのCA証明書を検証するかどうかを定義します。<br>許容値: `true` および `false`。<br>デフォルト値: `false`。 | いいえ |
| `CA_CERT`             | FAST nodeで使用するCA証明書のパスです。<br>デフォルト値: `/etc/nginx/ssl/nginx.crt`。 | いいえ |
| `CA_KEY`              | FAST nodeで使用するCA秘密鍵のパスです。<br>デフォルト値: `/etc/nginx/ssl/nginx.key`。 | いいえ |


## 記録されるリクエスト数の制限

デフォルトでは、FAST nodeはすべての受信リクエストをベースラインリクエストとみなします。そのため、リクエストは記録され、これに基づいてセキュリティテストが作成および実行されます。しかし、本来ベースラインリクエストとして認識すべきでない余分なリクエストが、FAST nodeを通過してターゲットアプリケーションに送られる可能性があります。

アプリケーションをターゲットとしていないすべてのリクエストを除外することで、FAST nodeによって記録されるリクエスト数を制限できます（除外されたリクエストはFAST nodeによってプロキシされますが、記録はされません）。この制限により、FAST nodeおよびターゲットアプリケーションへの負荷が軽減され、テストプロセスが高速化されます。この制限を適用するためには、テスト中にリクエスト元がやり取りするホストを把握する必要があります。

環境変数`ALLOWED_HOSTS`を設定することで、ベースラインリクエスト以外のリクエストを除外できます。

--8<--  "../include/fast/operations/env-vars-allowed-hosts.md"

FAST nodeはこの環境変数を以下の方法で利用します:
* 受信リクエストの`Host`ヘッダーの値が`ALLOWED_HOSTS`変数に指定された値と一致する場合、FAST nodeはそのリクエストをベースラインリクエストとみなし、記録およびプロキシを行います。
* その他のすべてのリクエストはFAST nodeを経由してプロキシされますが、記録はされません。

!!! info "ALLOWED_HOSTS環境変数の使用例"
    もし変数が`ALLOWED_HOSTS=google-gruyere.appspot.com`と定義されている場合、`google-gruyere.appspot.com`ドメインをターゲットとするリクエストはベースラインリクエストとみなされます。