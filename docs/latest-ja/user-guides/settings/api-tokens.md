[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# APIトークン

Wallarm Console → **設定** → **APIトークン**で、[APIリクエスト認証](../../api/overview.md)のためのトークンを管理できます。

![!Wallarm APIトークン][img-api-tokens-edit]

このセクションは **読み込み専用** および **API開発者** を除く **[全てのロール][user-roles-article]**のユーザーが利用できます。

## トークンの設定

ユーザーは自分のトークンを作成し、それらを使用することができます（つまり、トークン値を閲覧し、APIリクエストにその値を含めて認証します）。各トークンには、ユーザーが持つ権限範囲内で権限を設定できます。また、必要に応じてトークンの有効期限を設定することができます - 期限が設定されている場合、その期日を過ぎるとトークンは無効になります。さらに、手動でトークンを無効/有効にすることも可能です。

いつでもトークン値を更新することができます。

**管理者** / **グローバル管理者**は、会社のアカウント内のすべてのトークンを閲覧し、管理することができます。プライベートトークンの他に、他の管理者が閲覧/使用できる共有トークンを作成することもできます。トークンの権限を指定する際には、選択したロールからこれらの権限を取得することを選択できます：

* 管理者
* アナリスト
* API開発者
* 読み取り専用
* デプロイ - この役割のAPIトークンは、[Wallarmノードのデプロイ](../../user-guides/nodes/nodes.md#creating-a-node)に使用されます
* カスタム - 手動で権限の選択に切り替えます

!!! info "トークンのプライバシー"
    他のユーザー（管理者であっても）はあなたのプライベートトークン（つまり、トークンの値を閲覧またはコピー）を使用できません。また、非管理者はあなたのトークンさえ見ることはできません。

以下のことを考慮してください：

* トークンの所有者が[無効化](../../user-guides/settings/users.md#disable-access-for-a-user)されている場合、その人のすべてのトークンが自動的に無効化されます。
* トークンの所有者が権限を削減された場合、対応する権限がその人のすべてのトークンから削除されます。
* すべての無効化されたトークンは、無効化から1週間後に自動的に削除されます。
* 以前に無効化されたトークンを有効化するには、新しい有効期限を設定して保存します。

## グローバルロール権限を持つトークンの作成

グローバル管理者、グローバルアナリスト、またはグローバル読み取り専用などのグローバル[ロール](../../user-guides/settings/users.md#user-roles)に基づく権限でAPIトークンを作成するには、以下の手順を実行します：

1. [US](https://us1.my.wallarm.com/)または[EU](https://my.wallarm.com/)のWallarm Consoleで、[適切なユーザー](#configuring-tokens)としてログインします。
1. 右上で`?` → **Wallarm APIコンソール**を選択します。Wallarm APIコンソールが開きます：

   * USクラウドの場合：https://apiconsole.us1.wallarm.com/
   * EUクラウドの場合：https://apiconsole.eu1.wallarm.com/

    Wallarm APIコンソールがWallarmコンソールから認証データを取得することに注意してください。Wallarm Consoleのユーザーを変更した場合、新しい認証のためにWallarm API Consoleのページを更新してください。

1. `/v2/api_tokens`ルートに以下のパラメータを持つPOSTリクエストを送信します：

    ```bash
    {
    "client_id": <CLIENT_ID>,
    "realname": "<YOUR_API_TOKEN_NAME>",
    "user_id": <USER_ID>,
    "enabled": true,
    "expire_at": "<TOKEN_EXPIRATION_DATE_AND_TIME>",
    "permissions": [
        "<REQUIRED_GLOBAL_ROLE>"
    ]
    }
    ```

    ここで：

    * `<YOUR_API_TOKEN_NAME>`はトークンの目的を説明することを推奨します。
    * `<USER_ID>`はトークンの所有者を定義し、`<CLIENT_ID>`はこのユーザーが所属する会社アカウントを定義します。
    
        `/v1/user`のルートへのPOSTリクエストを送信することにより、これらのIDを取得します。

    * `<TOKEN_EXPIRATION_DATE_AND_TIME>`は[ISO 8601形式](https://www.cl.cam.ac.uk/~mgk25/iso-time.html)で、例えば`2033-06-13T04:56:01.037Z`。
    * `<REQUIRED_GLOBAL_ROLE>`は以下のいずれかとなります：
        
        * `パートナー管理者`：グローバル管理者用
        * `パートナーアナリティック`：グローバルアナリスト用
        * `パートナーオーディター`：グローバル読み取り専用用

    ??? info "例"
        ```bash
        {
        "client_id": 1010,
        "realname": "テナント作成用トークン",
        "user_id": 10101011,
        "enabled": true,
        "expire_at": "2033-06-13T04:56:01.037Z",
        "permissions": [
            "partner_admin"
        ]
        }
        ```

        このリクエストは、[テナント作成](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)に使用できるグローバル管理者の権限を持つAPIトークンを作成します。

1. レスポンスから作成したトークンの`id`を取得し、この`id`を使用して`/v2/api_tokens/{id}/secret`ルートにGETリクエストを送信します。
1. レスポンスから`secret`値をコピーし、リクエスト認証のためのAPIトークンとして使用します。

    !!! info "Wallarm Consoleからトークンをコピーする"
        作成したAPIトークンがWallarm Consoleに表示されるため、**設定** → **APIトークン**のトークンメニューからコピーすることもできます。

## 後方互換性のあるトークン

以前はUUIDとシークレットキーがリクエスト認証に使用されていましたが、これらは現在トークンで置き換えられています。あなたが使用していたUUIDとシークレットキーは、自動的に **後方互換性のある** トークンに変換されます。このトークンを使用して、UUIDとシークレットキーで認証したリクエストが引き続き動作します。

!!! warning "トークンを更新するか、SSOを有効化する"
    後方互換性のあるトークンの値を更新するか、このトークンの所有者の[SSO/strict SSO](../../admin-en/configuration-guides/sso/employ-user-auth.md)を有効化すると、後方互換性は終了します - 古いUUIDとシークレットキーで認証したすべてのリクエストが停止します。

リクエストの`X-WallarmApi-Token` ヘッダーパラメータに後方互換性のあるトークンの生成された値を渡すこともできます。

後方互換性のあるトークンは、ユーザーロールが持つと同じ権限を持ち、これらの権限はトークンウィンドウには表示されず、変更することもできません。権限を制御したい場合は、後方互換性のあるトークンを削除し、新しいトークンを作成する必要があります。

## APIトークン対ノードトークン

この記事で説明されているAPIトークンは、任意のクライアントから、および任意の権限セットで、Wallarm Cloud API[リクエスト認証](../../api/overview.md)に使用できます。

Wallarm Cloud APIにアクセスするクライアントの一つとして、Wallarmフィルタリングノード自体があります。APIトークンの他に、ノードトークンを使用してフィルタリングノードにWallarm Cloud APIへのアクセスを許可できます。[違いとどちらが優れているかを理解する→](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "一部のデプロイオプションではAPIトークンがサポートされていません"
    APIトークンは現在、 [NGINX](../../admin-en/installation-kubernetes-en.md)および [Kong](../../installation/kubernetes/kong-ingress-controller/deployment.md)イングレスコントローラ、 [Sidecarプロキシ](../../installation/kubernetes/sidecar-proxy/deployment.md)デプロイメント、または[Terraformモジュール](../../installation/cloud-platforms/aws/terraform-module/overview.md)に基づくAWSデプロイメントで使用することはできません。代わりにノードトークンを使用してください。