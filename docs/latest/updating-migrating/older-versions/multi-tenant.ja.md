[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# EOL マルチテナントノードのアップグレード

この手順は、EOL マルチテナントノード（バージョン 3.6 およびそれ以前）を 4.4 にアップグレードする手順を説明しています。

## 要件

* [技術テナントアカウント](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)で **Global administrator** 役割が追加されたユーザーによって実行されるその後のコマンド
* 米国 Wallarm クラウドで作業している場合は `https://us1.api.wallarm.com` へのアクセス、またはヨーロッパ Wallarm クラウドで作業している場合は `https://api.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください

## ステップ1：Wallarm サポートチームに連絡する

マルチテナントノードのアップグレード中に、[カスタムルールセットの構築](../../user-guides/rules/compiling.md)機能の最新バージョンを取得するために、[Wallarm サポートチーム](mailto:support@wallarm.com)にサポートを依頼してください。

!!! info "ブロックされたアップグレード"
    カスタムルールセットの構築機能の誤ったバージョンを使用すると、アップグレードプロセスがブロックされる可能性があります。

サポートチームは、マルチテナントノードのアップグレードや必要な再構成に関連するすべての質問にもお答えします。

## ステップ2：標準アップグレード手順に従う

標準手順は以下のとおりです：

* [Wallarm NGINX モジュールのアップグレード](nginx-modules.md)
* [postanalytics モジュールのアップグレード](separate-postanalytics.md)
* [Wallarm Docker NGINX または Envoy ベースのインテグレーションされた Wallarm モジュールを含む NGINX Ingress コントローラ](docker-container.md)
* [クラウドノードイメージのアップグレード](cloud-image.md)

!!! warning "マルチテナントノードの作成"
    Wallarm ノードを作成する際には、**Multi-tenant node** オプションを選択してください：

    ![!マルチテナントノードの作成](../../images/user-guides/nodes/create-multi-tenant-node.png)

## ステップ3：マルチテナントの再構成

テナントとそのアプリケーションに関連付けられたトラフィックの設定を書き換えます。以下の例を考慮してください。この例では：

* テナントはパートナーのクライアントを指します。パートナーには2つのクライアントがあります。
* `tenant1.com` および `tenant1-1.com` に対象とされるトラフィックは、クライアント1に関連付ける必要があります。
* `tenant2.com` に対象とされるトラフィックは、クライアント2に関連付ける必要があります。
* クライアント1には3つのアプリケーションがあります。
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

これらの3つのパスを対象とするトラフィックは、対応するアプリケーションに関連付ける必要があります。それ以外のトラフィックは、クライアント1の一般的なトラフィックとみなされます。

### 以前のバージョンの設定を調べる

3.6では、次のように設定できました。

```
server {
  server_name  tenant1.com;
  wallarm_application 20;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_application 24;
  ...
}
...
}
```

上記の設定に関する注意事項：

* トラフィックが `tenant1.com` および `tenant1-1.com` を対象としているため、これらのトラフィックは [API リクエスト](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account) を介して `20` および `23` の値でクライアント1に関連付けられます。
* テナントとアプリケーションを関連付けるための同様の API リクエストが送信されている必要があります。
* テナントとアプリケーションは別々のエンティティであるため、異なるディレクティブでそれらを構成することが理にかなっています。また、追加の API リクエストを回避することも便利です。設定自体でテナントとアプリケーション間の関係を定義することが理にかなっています。これは現在の設定では欠けていますが、以下で説明する新しい4.xアプローチで利用可能になります。

### 4.x アプローチを調べる

バージョン4.xでは、ノード設定でテナントを定義する方法として UUID が使用されます。

設定を書き換えるには、次の手順を実行してください。

1. テナントの UUID を取得します。
1. NGINX 設定ファイルにテナントを含め、それらのアプリケーションを設定します。

### テナントの UUID を取得する

テナントのリストを取得するには、Wallarm APIに認証付きのリクエストを送信します。認証手法は、[テナント作成時に使用されるもの](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)と同じです。

1. 後で関連する UUID を見つけるために `clientid`(s) を取得します。

    === "Wallarm Console経由"

        Wallarm Console ユーザーインターフェースの **ID** 列から `clientid`(s) をコピーします。

        ![!Wallarmコンソールでのテナントのセレクター](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "APIへのリクエストの送信"
        1. ルート `/v2/partner_client` に GET リクエストを送信します：

            !!! info "お客様のクライアントから送信されるリクエストの例"
                === "US Cloud"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
                    -H 'x-wallarmapi-uuid: YOUR_UUID'
                    ```
                === "EU Cloud"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
                    -H 'x-wallarmapi-uuid: YOUR_UUID'
                    ```
            
            `PARTNER_ID` は、テナント作成手順の [**ステップ2**](../../installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation) で取得したものです。

            レスポンスの例：

            ```
            {
            "body": [
                {
                    "id": 1,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_1_ID>,
                    "params": null
                },
                {
                    "id": 3,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_2_ID>,
                    "params": null
                }
            ]
            }
            ```

        1. レスポンスから `clientid`(s) をコピーします。
1. 各テナントの UUID を取得するには、ルート `v1/objects/client` に POST リクエストを送信します：

    !!! info "お客様のクライアントから送信されるリクエストの例"
        === "US Cloud"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
            -H 'x-wallarmapi-uuid: YOUR_UUID' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "EU Cloud"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
            -H 'x-wallarmapi-uuid: YOUR_UUID' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        

    レスポンスの例：

    ```
    {
    "status": 200,
    "body": [
        {
            "id": <CLIENT_1_ID>,
            "name": "<CLIENT_1_NAME>",
            ...
            "uuid": "11111111-1111-1111-1111-111111111111",
            ...
        },
        {
            "id": <CLIENT_2_ID>,
            "name": "<CLIENT_2_NAME>",
            ...
            "uuid": "22222222-2222-2222-2222-222222222222",
            ...
        }
    ]
    }
    ```

1. レスポンスから `uuid`(s) をコピーします。### NGINX設定ファイルにテナントを含め、そのアプリケーションを設定する

NGINX設定ファイルで:

1. 上記で受け取ったテナントUUIDを [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) ディレクティブで指定します。
1. 保護対象のアプリケーションIDを [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) ディレクティブで設定します。 

    ノード3.6以前でアプリケーション構成が含まれるNGINX設定を使用している場合は、テナントUUIDのみを指定し、アプリケーション構成を変更しないでください。

例:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

上記の設定において：

* テナントとアプリケーションは異なるディレクティブで設定されています。
* テナントとアプリケーションの関連性は、NGINX設定ファイルの対応するブロック内の `wallarm_application` ディレクティブを介して定義されています。

## ステップ4：Wallarmマルチテナントノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"