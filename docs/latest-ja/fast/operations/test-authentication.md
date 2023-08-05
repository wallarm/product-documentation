# テスト実行の認証設定

アプリケーションへのリクエストが認証を必要とする場合、セキュリティテストも認証が必要です。この指示では、テスト実行を正常に認証するための資格情報を渡す方法をご提供します。

## テスト実行認証の設定方法

テスト実行認証用の資格情報を渡すために、FASTノードDockerコンテナを[デプロイ](../qsg/deployment.md#4-deploy-the-fast-node-docker-container)する前に、以下の手順を実行します：

1. `.yml`または`.yaml`の拡張子を持つローカルファイルを作成します。例えば：`auth_dsl.yaml`。
2. 以下のように[FAST DSL](../dsl/intro.md)の構文を使用して、作成したファイルに認証パラメータを定義します：
   1. ファイルに[`modify`](../dsl/phase-modify.md)セクションを追加します。
   2. `modify`セクションで、認証パラメータが渡されるリクエストの部分を指定します。リクエスト部分は [point](../dsl/points/basics.md) 形式で指定する必要があります。

        !!! info "トークンパラメータのポイント例"
            トークンがリクエスト認証に使用され、その値が`Cookie`リクエストヘッダー内の`token`パラメータで渡される場合、ポイントは`HEADER_COOKIE_COOKIE_token_value`のように見えるかもしれません。

    3. 以下のように認証パラメータの値を指定します。

        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        使用する認証パラメータの数に制限はありません。
3. コンテナをデプロイする際に`-v {path_to_folder}:/opt/dsl_auths`オプションを使用して、`.yml`/`.yaml`ファイルがあるディレクトリをFASTノードDockerコンテナにマウントします。例えば：
   ```
   docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
   ```

   !!! warning "マウントされたディレクトリ内のファイル"
       なお、マウントされたディレクトリには認証資格情報が記載されたファイルのみが含まれている必要があります。

## 定義した認証パラメータの.yml/.yamlファイル例

`.yml`/`.yaml`ファイルに定義されたパラメータのセットは、アプリケーションで使用されている認証方法によります。

以下に、最も一般的なAPIリクエストの認証方法の定義例を示します：

* `username`と`password`パラメータが`Cookie`リクエストヘッダで渡される場合

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* `token`パラメータが`Cookie`リクエストヘッダで渡される場合：

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```