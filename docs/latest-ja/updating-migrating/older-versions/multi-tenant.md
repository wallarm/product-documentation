[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# EOLマルチテナントノードのアップグレード

本手順では、サポート終了（EOL）のマルチテナントノード（バージョン3.6以下）を最新の6.xへアップグレードする手順を説明します。

## 要件

* [テクニカルテナントアカウント](../../installation/multi-tenant/overview.md#tenant-accounts)配下で**Global administrator**ロールが付与されたユーザーによる以降のコマンド実行
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認します
* 以下のIPアドレスへのアクセス（攻撃検出ルールとAPI仕様の更新ダウンロード、ならびにallowlisted、denylisted、graylistedの国・地域・データセンターに対する正確なIPの取得のため）

    --8<-- "../include/wallarm-cloud-ips.md"

## ステップ1: Wallarmサポートチームに連絡

マルチテナントノードのアップグレード中に[カスタムルールセットのビルド](../../user-guides/rules/rules.md#ruleset-lifecycle)機能の最新バージョンを利用できるようにするため、[Wallarmサポートチーム](mailto:support@wallarm.com)に支援を依頼します。

!!! info "アップグレードのブロック"
    カスタムルールセットのビルド機能のバージョンが正しくない場合、アップグレード処理がブロックされる可能性があります。

サポートチームは、マルチテナントノードのアップグレードや必要な再設定に関するすべての質問にも対応します。

## ステップ2: 標準的なアップグレード手順に従う

標準手順は以下のとおりです:

* [Wallarm NGINXモジュールのアップグレード](nginx-modules.md)
* [postanalyticsモジュールのアップグレード](separate-postanalytics.md)
* [WallarmのDocker NGINXベースイメージのアップグレード](docker-container.md)
* [Wallarmモジュール統合版NGINX Ingress Controllerのアップグレード](ingress-controller.md)
* [クラウドノードイメージのアップグレード](cloud-image.md)

!!! warning "マルチテナントノードの作成"
    Wallarmノードを作成する際は、**Multi-tenant node**オプションを選択してください:

    ![マルチテナントノードの作成](../../images/user-guides/nodes/create-multi-tenant-node.png)

## ステップ3: マルチテナンシーを再設定

トラフィックをテナントおよびそのアプリケーションに関連付ける設定を書き換えます。以下に例を示します。この例では:

* テナントはパートナーのクライアントを表します。パートナーには2人のクライアントがいます。
* `tenant1.com`および`tenant1-1.com`宛てのトラフィックはクライアント1に関連付ける必要があります。
* `tenant2.com`宛てのトラフィックはクライアント2に関連付ける必要があります。
* クライアント1には3つのアプリケーションもあります:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    これら3つのパス宛てのトラフィックは対応するアプリケーションに関連付け、それ以外はクライアント1の汎用トラフィックと見なす必要があります。

### 以前のバージョンの設定を確認

3.6では、次のように設定できます:

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

上記設定に関する注意事項:

* `tenant1.com`および`tenant1-1.com`宛てのトラフィックは、`/v2/partner/111/partner_client`へのAPIリクエスト経由でこのクライアントに紐づけられた`20`および`23`の値によってクライアント1に関連付けられています。
* 他のアプリケーションをテナントに関連付けるには、同様のAPIリクエストを送信する必要がありました。
* テナントとアプリケーションは別個のエンティティであるため、異なるディレクティブで設定するのが理にかなっています。また、追加のAPIリクエストを避けられると便利です。設定自体でテナントとアプリケーションの関係を定義できるのが理想です。これらは現行の設定にはありませんが、後述する新しい6.xのアプローチで可能になります。

### 6.xのアプローチを確認

バージョン6.xでは、ノード設定におけるテナントの指定はUUIDで行います。

設定を書き換えるには、次を実施します:

1. テナントのUUIDを取得します。
1. テナントを含めてアプリケーションをNGINX設定ファイルで指定します。

### テナントのUUIDを取得

テナント一覧を取得するには、Wallarm APIに認証付きリクエストを送信します。認証方法は、[テナント作成に使用する方法](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)と同じです。

1. 後で紐づくUUIDを特定するために、`clientid`（複数可）を取得します:

    === "Wallarm Console経由"

        Wallarm Consoleのユーザーインターフェイスの**ID**列から`clientid`（複数可）をコピーします:
        
        ![Wallarm Consoleのテナントセレクター](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "APIへのリクエスト送信"
        1. `/v2/partner_client`ルートにGETリクエストを送信します:

            !!! info "独自クライアントから送信するリクエストの例"
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
            
            ここで、`PARTNER_ID`はテナント作成手順の[**ステップ2**](../../installation/multi-tenant/configure-accounts.md#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature)で取得したIDです。

            レスポンス例:

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

        1. レスポンスから`clientid`（複数可）をコピーします。
1. 各テナントのUUIDを取得するには、`v1/objects/client`ルートにPOSTリクエストを送信します:

    !!! info "独自クライアントから送信するリクエストの例"
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

    レスポンス例:

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

1. レスポンスから`uuid`（複数可）をコピーします。

### NGINX設定ファイルにテナントを含め、アプリケーションを設定

NGINX設定ファイルで次を実施します:

1. 取得したテナントUUIDを[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブに指定します。
1. 保護対象のアプリケーションIDを[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)ディレクティブに設定します。 

    ノード3.6以下で使用していたNGINX設定にアプリケーション設定が含まれている場合は、テナントUUIDのみを指定し、アプリケーション設定は変更せずに維持します。

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

上記の設定では:

* テナントとアプリケーションは異なるディレクティブで設定されています。
* テナントとアプリケーションの関係は、NGINX設定ファイル内の該当ブロックにある`wallarm_application`ディレクティブで定義されています。

## ステップ4: Wallarmマルチテナントノードの動作をテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"