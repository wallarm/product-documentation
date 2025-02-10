[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# APIトークン

Wallarm Console → **設定** → **APIトークン** で、[APIリクエスト認証](../../api/overview.md)用のトークンを管理できます。

![Wallarm APIトークン][img-api-tokens-edit]

このセクションは、**Read Only** および **API developer** を除く **[すべてのロールのユーザ][user-roles-article]** が利用できます。

## トークンの設定

ユーザは自分のトークンを作成し、それらを使用することができます（つまり、トークンの値を表示し、APIリクエストにそれを含めて認証します）。自分のトークンごとに権限を設定できますが、ユーザが持つ権限よりも広範囲には設定できません。必要に応じて、トークンの有効期限を設定することもできます - 設定した場合、その日付後にトークンは無効になります。また、トークンを手動で無効化/有効化することもできます。

トークンの値はいつでも更新することができます。

**管理者** / **グローバル管理者**は、企業アカウント内のすべてのトークンを表示および管理することができます。プライベートトークンの他に、他の管理者に表示/使用される共有トークンを作成することもできます。トークンの権限を指定する際には、選択したロールからこれらの権限を引き継ぐことを選択できます：

* 管理者
* アナリスト
* API開発者
* Read only
* デプロイ - このロールを持つAPIトークンは、[Wallarmノードの展開](../../user-guides/nodes/nodes.md#creating-a-node)に使用されます
* カスタム - 手動で権限を選択するように戻ります

!!! info "トークンのプライバシー"
    他のユーザー（管理者であっても）は自分のプライバシートークンを使用することはできません（つまり、トークンの値を表示またはコピーすること）。
また、非管理者ユーザーはあなたのトークンを表示することさえできません。

以下のことを考慮してください：

* トークンの所有者が[無効化された](../../user-guides/settings/users.md#disabling-and-deleting-users)場合、そのユーザーのすべてのトークンも自動的に無効化されます。
* トークンの所有者の権限が剥奪された場合、対応する権限はそのユーザーのすべてのトークンから削除されます。
* 無効化されたトークンは、無効化後1週間で自動的に削除されます。
* 以前に無効化されたトークンを有効化するには、新たな有効期限日付を設定して保存します。

## グローバルロールの権限を持つトークンの作成

Global Administrator、Global Analyst、または Global Read Only のようなグローバル[ロール](../../user-guides/settings/users.md#user-roles)に基づく権限を持つAPIトークンを作成するには、次の手順を行います。

1. [適切なユーザー](#configuring-tokens)として [US](https://us1.my.wallarm.com/) または [EU](https://my.wallarm.com/) の Wallarm Console にログインします。
1. 右上で、 `?` → **Wallarm APIアドミンコンソール** を選択します。 Wallarm API コンソールが開きます:

    * USクラウドの場合： https://apiconsole.us1.wallarm.com/
    * EUクラウドの場合： https://apiconsole.eu1.wallarm.com/

    Wallarm APIアドミンコンソールは、Wallarm コンソールから認証データを取得します。Wallarmコンソール内でユーザーを変更した場合は、新しい認証データの取得のために、Wallarm APIアドミンコンソールのページを更新してください。

1. 以下のパラメータを使用して、`/v2/api_tokens` ルートに POST リクエストを送信します：

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

    * `<YOUR_API_TOKEN_NAME>` はトークンの目的を説明することが推奨されます。
    * `<USER_ID>`はトークンの所有者を、`<CLIENT_ID>`はこのユーザーが所属する企業アカウントを定義します。
    
        これらのIDは、`/v1/user` ルートに POST リクエストを送信することによって取得します。

    * `<TOKEN_EXPIRATION_DATE_AND_TIME>`は[ISO 8601形式](https://www.cl.cam.ac.uk/~mgk25/iso-time.html)で、例えば `2033-06-13T04:56:01.037Z`とします。
    * `<REQUIRED_GLOBAL_ROLE>`は以下のいずれかにできます：
        
        * グローバル管理者の場合は `partner_admin`
        * グローバルアナリストの場合は `partner_analytic`
        * グローバル読み取り専用の場合は `partner_auditor`

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

        このリクエストは、[テナントの作成](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)に使用できる、グローバル管理者の権限を持つAPIトークンを作成します。

1. 応答から作成したトークンの `id` を取得し、この `id` を使用して `/v2/api_tokens/{id}/secret` ルートに GET リクエストを送信します。
1. 応答から `secret` 値をコピーし、リクエストの認証用のAPIトークンとして使用します。

    !!! info "Wallarm Consoleからトークンをコピーする"
         作成したAPIトークンはWallarm Consoleに表示されるので、**設定** → **APIトークン**のトークンメニューからもコピーできます。

## 後方互換性のあるトークン

以前はUUIDとシークレットキーがリクエストの認証に使用されていましたが、これがトークンに置き換えられました。あなたが使用していたUUIDとシークレットキーは、自動的に**後方互換性のある**トークンに変換されます。このトークンを持つと、UUIDとシークレットキーを使ったリクエスト認証を引き続き使用することができます。

!!! warning "トークンを更新するか SSO を有効化する"
    後方互換性のあるトークンの値を更新するか、このトークンの所有者のために [SSO/strict SSO](../../admin-en/configuration-guides/sso/setup.md)を有効化すると、後方互換性は終了します - 旧UUIDとシークレットキーを使ったすべてのリクエストは動作しなくなります。

あなたはまた、後方互換性のあるトークンの生成された値を使用して、その値をリクエストの`X-WallarmApi-Token` ヘッダーパラメータに渡すこともできます。

後方互換性のあるトークンは、ユーザーロールが持っているのと同じ権限を持ち、これらの権限はトークンウィンドウに表示されず、変更することはできません。権限を制御したい場合は、後方互換性のあるトークンを削除し、新しいトークンを生成する必要があります。

## APIトークン vs ノードトークン

この記事で説明されているAPIトークンは、任意のクライアントからおよび任意の権限セットでWallarm Cloud APIの[リクエスト認証](../../api/overview.md)に使用できます。

Wallarm Cloud APIにアクセスするクライアントの一つがWallarmフィルタリングノード自体です。APIトークンに加えて、ノードトークンを使用して、フィルタリングノードにWallarm CloudのAPIへのアクセスを許可することができます。[差異を理解し、何を選ぶべきかを知る→](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "APIトークンは一部のデプロイオプションではサポートされていない"
    APIトークンは現在、[NGINX](../../admin-en/installation-kubernetes-en.md)と[Kong](../../installation/kubernetes/kong-ingress-controller/deployment.md) Ingressコントローラー、[Sidecarプロキシ](../../installation/kubernetes/sidecar-proxy/deployment.md)デプロイメント、および[Terraformモジュール](../../installation/cloud-platforms/aws/terraform-module/overview.md)に基づくAWSデプロイメントでは使用できません。その代わりにノードトークンを使用してください。