# テスト実行の認証設定

アプリケーションへのリクエストに認証が必要な場合、セキュリティテストにも認証が必要です。この手順では、テスト実行を正常に認証するために資格情報を渡す方法を示します。

## テスト実行の認証を設定する方法

テスト実行の認証のために資格情報を渡すには、FASTノードのDockerコンテナを[デプロイ](../qsg/deployment.md#4-deploy-the-fast-node-docker-container)する前に次の手順を実行します:

1. `.yml`または`.yaml`拡張子のローカルファイルを作成します。例: `auth_dsl.yaml`。
2. 作成したファイルに[FAST DSL](../dsl/intro.md)の構文を使用して認証パラメータを次のように定義します:
    1. ファイルに[`modify`](../dsl/phase-modify.md)セクションを追加します。
    2. `modify`セクションで、認証パラメータが渡されるリクエストの箇所を指定します。リクエストの箇所は[ポイント](../dsl/points/basics.md)形式で指定する必要があります。

        !!! info "tokenパラメータのポイントの例"
            リクエストの認証にトークンが使用され、その値が`Cookie`リクエストヘッダーの`token`パラメータで渡される場合、ポイントは`HEADER_COOKIE_COOKIE_token_value`のようになります。
    
    3. 認証パラメータの値を次のように指定します:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        使用する認証パラメータの数に制限はありません。
3. コンテナをデプロイする際に`-v {path_to_folder}:/opt/dsl_auths`オプションを使用して、`.yml`/`.yaml`ファイルを含むディレクトリをFASTノードのDockerコンテナにマウントします。例:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "マウントしたディレクトリ内のファイル"
        マウントしたディレクトリには、認証用の資格情報が記載されたファイルのみを含める必要がある点にご注意ください。

## 認証パラメータを定義した.yml/.yamlファイルの例

`.yml`/`.yaml`ファイルで定義するパラメータのセットは、アプリケーションで使用される認証方式に依存します。

以下は、APIリクエストの最も一般的な認証方法を定義する例です:

* `username`と`password`パラメータが`Cookie`リクエストヘッダーで渡される場合

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* `token`パラメータが`Cookie`リクエストヘッダーで渡される場合

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```