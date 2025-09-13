[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

#   FAST nodeで使用する環境変数の一覧

FAST nodeの構成には多数のパラメータがあります。これらのパラメータの値は対応する環境変数で変更できます。

環境変数の値を設定し、それらの変数をFAST nodeに渡す方法は次のいずれかです。
* `-e`引数を使用する
    
    ```
    docker run --name <container name> \
    -e <environment variable 1>=<value> \
    ... 
    -e <environment variable N>=<value> \
    -p <target port>:8080 wallarm/fast
    ```
    
* または、環境変数を含むファイルへのパスを指定する`--env-file`引数を使用する

    ```
    docker run --name <container name> \
    --env-file=<file with environment variables> \
    -p <target port>:8080 wallarm/fast
    ```
    
    このファイルには環境変数の一覧を1行に1変数で記載します:

    ```
    # 環境変数のサンプルファイル

    WALLARM_API_TOKEN=token_Qwe12345            # これはサンプル値です—実際のトークン値を使用してください
    ALLOWED_HOSTS=google-gruyere.appspot.com    # このドメインを宛先とする受信リクエストはテストレコードに書き込まれます
    ```

設定可能なパラメータを以下の表に示します。

| パラメータ             | 値     | 必須? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm Cloudのトークンです。 | はい |
| `WALLARM_API_HOST`   	| Wallarm APIサーバのアドレスです。<br>許容値: <br>Wallarm US Cloudのサーバには`us1.api.wallarm.com`、<br>Wallarm EU Cloudのサーバには`api.wallarm.com`です。 | はい |
| `ALLOWED_HOSTS`       | 対象アプリケーションのホスト一覧です。これらのホストを宛先とする受信リクエストがテストレコードに書き込まれます。<br>デフォルトでは、すべての受信リクエストが記録されます。<br>詳細は[こちら][anchor-allowed-hosts]をご覧ください。| いいえ |
| `WALLARM_API_USE_SSL` | Wallarm APIサーバへの接続時にSSLを使用するかどうかを指定します。<br>許容値: `true`と`false`。<br>デフォルト値: `true`です。 | いいえ |
| `WORKERS`             | ベースラインリクエストの処理とセキュリティテストを実行するスレッド数です。<br>デフォルト値: `10`です。 | いいえ |
| `GIT_EXTENSIONS`      | [カスタムFAST DSL拡張][doc-dsl-ext]を含むGitリポジトリへのリンクです（このリポジトリはFAST nodeコンテナからアクセス可能である必要があります）。 | いいえ |
| `CI_MODE`             | CI/CDに統合する際のFAST nodeの動作モードです。<br>許容値は次のとおりです: <br>`recording`は[記録モード][doc-record-mode]、<br>`testing`は[テストモード][doc-test-mode]です。 | いいえ |
| `BACKEND_HTTPS_PORTS` | 対象アプリケーションでデフォルト以外のポートを設定している場合に、アプリケーションが使用するHTTPSポート番号です。<br>複数ポートを指定できます。例: <br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>デフォルト値: `443`です。 | いいえ |
| `WALLARM_API_CA_VERIFY` | Wallarm APIサーバのCA証明書を検証するかどうかを指定します。<br>許容値: `true`と`false`。<br>デフォルト値: `false`です。 | いいえ |
| `CA_CERT`             | FAST nodeで使用するCA証明書へのパスです。<br>デフォルト値: `/etc/nginx/ssl/nginx.crt`です。 | いいえ |
| `CA_KEY`              | FAST nodeで使用するCA秘密鍵へのパスです。 <br>デフォルト値: `/etc/nginx/ssl/nginx.key`です。 | いいえ |


## 記録対象リクエスト数の制限

デフォルトでは、FAST nodeはすべての受信リクエストをベースラインとして扱います。そのため、これらを記録し、それに基づくセキュリティテストを作成・実行します。ただし、本来ベースラインとして認識すべきでない不要なリクエストが、FAST nodeを経由して対象アプリケーションへ流入する場合があります。

対象アプリケーションを宛先としていないすべてのリクエストをフィルタリングして除外することで、FAST nodeが記録するリクエスト数を制限できます（なお、フィルタリングされたリクエストはFAST nodeがプロキシしますが、記録はしません）。この制限によりFAST nodeおよび対象アプリケーションへの負荷が軽減され、テスト処理が高速化します。この制限を適用するには、テスト中にリクエストの送信元がどのホストと通信するかを把握しておく必要があります。

環境変数`ALLOWED_HOSTS`を設定すると、ベースラインではないすべてのリクエストをフィルタリングできます。

--8<--  "../include/fast/operations/env-vars-allowed-hosts.md"

FAST nodeはこの環境変数を次のように使用します:
* 受信リクエストの`Host`ヘッダーの値が`ALLOWED_HOSTS`に指定した値と一致する場合、FAST nodeはそのリクエストをベースラインと見なします。そのリクエストは記録され、プロキシされます。
* それ以外のリクエストはFAST nodeを介してプロキシされますが、記録されません。

!!! info "ALLOWED_HOSTS環境変数の使用例"
    変数を`ALLOWED_HOSTS=google-gruyere.appspot.com`と定義した場合、`google-gruyere.appspot.com`ドメインを宛先とするリクエストはベースラインとして扱われます。