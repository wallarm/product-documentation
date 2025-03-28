[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# EOL多テナントノードのアップグレード

この手順では、バージョン3.6以下のEOL多テナントノードをバージョン5.0までアップグレードする手順について説明します。

## Requirements

* 以降のコマンドは、[technical tenant account](../../installation/multi-tenant/overview.md#tenant-accounts)に追加された**Global administrator**ロールを持つユーザーによって実行される必要があります
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudをご利用の場合は`https://api.wallarm.com`にアクセスできることが必要です。ファイアウォールでアクセスがブロックされていないことをご確認ください
* 攻撃検知ルールおよびAPI仕様のアップデートのダウンロード、並びにホワイトリスト、ブラックリスト、またはグレイリストに登録された国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへのアクセスが必要です

    --8<-- "../include/wallarm-cloud-ips.md"

## Step 1: Wallarmサポートチームに連絡

多テナントノードのアップグレード中に最新バージョンの[custom ruleset building](../../user-guides/rules/rules.md#ruleset-lifecycle)機能を入手するために、[Wallarm support team](mailto:support@wallarm.com)の支援を依頼してください

!!! info "アップグレードのブロック"
    間違ったバージョンのcustom ruleset building機能を使用すると、アップグレードプロセスがブロックされる可能性があります

サポートチームは、多テナントノードのアップグレードおよび必要な再構成に関するあらゆる質問にお答えします

## Step 2: 標準アップグレード手順に従う

以下は標準の手順です：

* [Upgrading Wallarm NGINX modules](nginx-modules.md)
* [Upgrading the postanalytics module](separate-postanalytics.md)
* [Upgrading the Wallarm Docker NGINX-based image](docker-container.md)
* [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
* [Upgrading the cloud node image](cloud-image.md)

!!! warning "多テナントノードの作成"
    Wallarmノードの作成時に、必ず**Multi-tenant node**オプションを選択してください：

    ![多テナントノードの作成](../../images/user-guides/nodes/create-multi-tenant-node.png)

## Step 3: マルチテナンシーの再構成

テナントおよびそのアプリケーションとトラフィックの関連付け方法を設定し直してください。以下の例を参照してください。

例では：

* テナントはパートナーのクライアントを表します。パートナーは2つのクライアントを持ちます。
* `tenant1.com`および`tenant1-1.com`宛のトラフィックはクライアント1に関連付ける必要があります。
* `tenant2.com`宛のトラフィックはクライアント2に関連付ける必要があります。
* クライアント1にはさらに3つのアプリケーションがあります：
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    これら3つのパス宛のトラフィックは、それぞれ対応するアプリケーションに関連付ける必要があります。それ以外はクライアント1の汎用トラフィックとして扱います。

### 以前のバージョンの構成を確認する

バージョン3.6では、以下のように設定できます：

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

上記の構成に関する注意点：

* `tenant1.com`および`tenant1-1.com`宛のトラフィックは、`20`と`23`の値を介してクライアント1に関連付けられており、[API request](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account)を通じてこのクライアントにリンクされています。
* 同様に、他のアプリケーションをテナントにリンクするためにAPIリクエストが送信されているはずです。
* テナントとアプリケーションは別個のエンティティであるため、異なるディレクティブで設定するのが合理的です。また、追加のAPIリクエストを避けるため、構成自体でテナントとアプリケーション間の関係を定義するのが望ましいです。これらは現在の構成では欠落していますが、以下で説明する新しい5.xのアプローチにより利用可能になります。

### 5.xのアプローチを確認する

バージョン5.xでは、ノード構成においてテナントを定義する方法としてUUIDを使用します。

構成を変更するには、以下の手順を実行してください：

1. テナントのUUIDを取得します。
1. NGINX構成ファイルにテナントを含め、それぞれのアプリケーションを設定します。

### テナントのUUIDを取得する

テナントの一覧を取得するには、Wallarm APIへ認証済みのリクエストを送信します。認証方法は[tenant creationに使用されたもの](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)と同じです。

1. 後で関連するUUIDを特定するために、`clientid`を取得します：

    === "Wallarm Consoleを使用して"

        Wallarm Consoleのユーザーインターフェイスの**ID**列から`clientid`をコピーしてください：
        
        ![Wallarm Consoleのテナントセレクター](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "APIへリクエストを送信して"
        1. ルート`/v2/partner_client`へGETリクエストを送信します：

            !!! info "自前のクライアントから送信したリクエストの例"
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
            
            ここで`PARTNER_ID`は、tenant作成手順の[**Step 2**](../../installation/multi-tenant/configure-accounts.md#step-4-link-tenants-applications-to-the-appropriate-tenant-account)で取得したものです。

            レスポンス例：

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

        1. レスポンスから`clientid`をコピーします。
1. 各テナントのUUIDを取得するために、ルート`v1/objects/client`へPOSTリクエストを送信します：

    !!! info "自前のクライアントから送信したリクエストの例"
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

    レスポンス例：

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

### NGINX構成ファイルにテナントを含め、それぞれのアプリケーションを設定する

NGINX構成ファイルでは：

1. 上記で取得したテナントUUIDを[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブに指定します。
1. 保護されたアプリケーションIDを[`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)ディレクティブに設定します。

    もしノード3.6以下用に使用されたNGINX構成にアプリケーション設定が含まれている場合は、テナントUUIDのみを指定し、アプリケーションの設定は変更しないでください。

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

上記の構成では：

* テナントとアプリケーションは異なるディレクティブで設定されています。
* テナントとアプリケーション間の関係は、NGINX構成ファイルの各ブロック内の`wallarm_application`ディレクティブを通じて定義されています。

## Step 4: Wallarm多テナントノードの動作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"