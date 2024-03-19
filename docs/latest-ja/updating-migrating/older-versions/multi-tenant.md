[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# EOL マルチテナントノードのアップグレード

これらの手順では、EOL（End-Of-Life）マルチテナントノード（バージョン3.6以下）を4.6までアップグレードする方法を説明します。

## 要件

* ユーザーが[技術テナントアカウント](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)に追加された**グローバル管理者**ロールで以降のコマンドを実行する
* US Wallarm Cloudで作業している場合は`https://us1.api.wallarm.com`へ、EU Wallarm Cloudで作業している場合は`https://api.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください

## ステップ1：Wallarmサポートチームに連絡する

マルチテナントノードのアップグレード中に、[Wallarmサポートチーム](mailto:support@wallarm.com)の助けを借りて、[カスタムルールセットのビルド](../../user-guides/rules/rules.md)機能の最新バージョンを取得してください。

!!! info "ブロックされたアップグレード"
    カスタムルールセットビルド機能の不正確なバージョンを使用すると、アップグレードプロセスがブロックされる可能性があります。

サポートチームは、マルチテナントノードのアップグレードと必要な再構成に関連するすべての質問に対応するのにも役立ちます。

## ステップ2：標準アップグレード手順に従う

標準的な手順は次のものです：

* [Wallarm NGINXモジュールのアップグレード](nginx-modules.md)
* [postanalyticsモジュールのアップグレード](separate-postanalytics.md)
* [Wallarm Docker NGINX-またはEnvoyベースのイメージのアップグレード](docker-container.md)
* [統合されたWallarmモジュールを備えたNGINX Ingressコントローラのアップグレード](ingress-controller.md)
* [クラウドノードイメージのアップグレード](cloud-image.md)

!!! warning "マルチテナントノードの作成"
    Wallarmノードを作成する際には、**マルチテナントノード**オプションを選択してください：

    ![マルチテナントノードの作成](../../images/user-guides/nodes/create-multi-tenant-node.png)

## ステップ3：マルチテナンシーの再構成

テナントとそのアプリケーションとの関連付け方法の設定を書き換えます。以下に示す例を考慮してください。この例では：

* テナントはパートナーのクライアントを表します。パートナーには2つのクライアントがあります。
* `tenant1.com`と`tenant1-1.com`に対するトラフィックは、クライアント1と関連付けられるべきです。
* `tenant2.com`に対するトラフィックは、クライアント2と関連付けられるべきです。
* クライアント1には3つのアプリケーションもあります：
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    これら3つのパスに対するトラフィックは、それぞれ対応するアプリケーションと関連付けられ、残りはクライアント1の一般的なトラフィックとみなされるべきです。

### 以前のバージョンの設定を調査する

3.6では、次のように設定することができました：

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

上記の設定についての注意事項：

* `tenant1.com`と`tenant1-1.com`に対するトラフィックは、`20`と`23`の値を介してクライアント1と関連付けられており、このクライアントは[APIリクエスト](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account)によってリンクされています。
* テナントとその他のアプリケーションにリンクするためには同様のAPIリクエストを送信しているはずです。
* テナントとアプリケーションは別々のエンティティであるため、それらを異なるディレクティブで設定することは論理的です。また、それにより追加のAPIリクエストを回避するのに便利です。テナントとアプリケーション間の関係を設定自体で定義することは論理的です。これらすべてが現在の設定には欠けていますが、以下で説明する新しい4.xのアプローチで利用可能になります。

### 4.xのアプローチを調査する

バージョン4.xでは、ノード設定でテナントを定義する方法はUUIDです。

設定を書き換えるには、以下のことを行います：

1. テナントのUUIDを取得します。
1. NGINX設定ファイルにテナントを含め、それらのアプリケーションを設定します。

### テナントのUUIDを取得する

テナントのリストを取得するために、Wallarm APIへの認証済みリクエストを送信します。認証方法は[テナント作成で使用されるもの](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)と同じです。

1. 後でそれらに関連するUUIDを見つけるための`clientid`を取得します：

    === "Wallarm Console から"
         Wallarm Consoleユーザーインターフェイスの**ID**列から `clientid` をコピーします：
        
        ![Wallarm Console内のテナントのセレクタ](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "APIへのリクエストを送信する"
        1. `/v2/partner_client`ルートにGETリクエストを送信します：

            !!! info "あなた自身のクライアントから送信されたリクエストの例"
                === "US Cloud"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
                === "EU Cloud"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
            
            ここで、`PARTNER_ID`はテナント作成手順の[**ステップ2**](../../installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation)で得たものです。

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

        1. レスポンスから `clientid` をコピーします。
1. 各テナントのUUIDを取得するために、`v1/objects/client`ルートにPOSTリクエストを送信します：

    !!! info "あなた自身のクライアントから送信されたリクエストの例"
        === "US Cloud"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "EU Cloud"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
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

1. レスポンスから`uuid`をコピーします。

### NGINX設定ファイルにテナントを含め、それらのアプリケーションを設定する

NGINX設定ファイルでは：

1. 上記の手順で受け取ったテナントUUIDを[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)のディレクティブで指定します。
1. 保護されたアプリケーションIDを[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)ディレクティブで設定します。

    ノード3.6以下のNGINX設定がアプリケーション設定を使用している場合、テナントUUIDのみを指定し、アプリケーション設定は変更なしに保持します。

例：

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

上記の設定では：

* テナントとアプリケーションは異なるディレクティブで設定されています。
* テナントとアプリケーション間の関連性は、NGINX設定ファイルの対応するブロック内の`wallarm_application`ディレクティブを使用して定義されています。

## ステップ4：Wallarmマルチテナントノードの動作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"