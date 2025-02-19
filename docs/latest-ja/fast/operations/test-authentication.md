# テスト実行の認証設定

アプリケーションへのリクエストが認証を必要とする場合、セキュリティテストにも認証が必要です。この手順では、テスト実行を正しく認証するために資格情報を渡す方法を説明します。

## テスト実行認証の設定方法

テスト実行認証のために資格情報を渡すには、FASTノードDockerコンテナを[デプロイする](../qsg/deployment.md#4-deploy-the-fast-node-docker-container)前に以下の手順を実施します。

1. ローカルに拡張子が`.yml`または`.yaml`のファイルを作成します。例：`auth_dsl.yaml`。
2. 作成したファイル内に[FAST DSL](../dsl/intro.md)の構文を使用して認証パラメータを定義します。
    1. ファイルに[`modify`](../dsl/phase-modify.md)セクションを追加します。
    2. `modify`セクションに、認証パラメータが渡されるリクエスト部分を指定します。リクエストの部分は[point](../dsl/points/basics.md)形式で指定する必要があります。
    
        !!! info "トークンパラメータのためのpointの例"
            リクエスト認証にトークンを使用し、その値が`Cookie`リクエストヘッダー内の`token`パラメータに渡される場合、pointは`HEADER_COOKIE_COOKIE_token_value`のようになります。
    
    3. 以下の方法で認証パラメータの値を指定します。
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        使用する認証パラメータの数に制限はありません。
3. コンテナをデプロイする際、`.yml`/`.yaml`ファイルを含むディレクトリを`-v {path_to_folder}:/opt/dsl_auths`オプションを使用してFASTノードDockerコンテナにマウントします。例：
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "マウントされたディレクトリ内のファイル"
        マウントされたディレクトリには認証資格情報のファイルのみを含める必要がありますのでご注意ください。

## 定義された認証パラメータを含む.yml/.yamlファイルの例

.yml/.yamlファイルに定義されるパラメータのセットは、アプリケーションで使用する認証方式に依存します。

以下に、APIリクエストで最も一般的な認証方式を定義する例を示します。

* `username`および`password`パラメータは`Cookie`リクエストヘッダーで渡されます。

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* `token`パラメータは`Cookie`リクエストヘッダーで渡されます。

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```