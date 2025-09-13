# Wallarm Consoleでテナントアカウントを作成する

本手順では、[テナントアカウント](overview.md)を正しく設定するための手順を説明します。

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## テナントアカウントの設定

テナントアカウントを設定するには、次の手順を実行します。

1. Wallarm Consoleにサインアップし、マルチテナンシー機能の有効化をWallarmテクニカルサポートに依頼します。
1. テナントアカウントを作成します。
1. 特定のトラフィックをテナントおよびそのアプリケーションに関連付けます。

### ステップ1: サインアップし、マルチテナンシー機能の有効化を依頼する

1. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/signup)または[EU Cloud](https://my.wallarm.com/signup)で登録フォームに入力し、確認します。

    ![登録フォーム](../../images/signup-en.png)

    !!! info "企業メールアドレス"
        企業のメールアドレスでサインアップしてください。
2. メールを開き、受信したメッセージのリンクからアカウントを有効化します。
3. ご利用のアカウントのマルチテナンシー機能を有効化するよう、[Wallarmテクニカルサポート](mailto:support@wallarm.com)に依頼を送信します。依頼には次の情報を含めてください。
    * 使用中のWallarm Cloud名（US CloudまたはEU Cloud）
    * グローバルアカウントおよびテクニカルテナントアカウントの名称
    * テナントアカウントへのアクセスを付与する従業員のメールアドレス（マルチテナンシー機能の有効化後は、従業員を自身で追加できるようになります）
    * ブランド適用用のWallarm Consoleロゴ
    * Wallarm Console用のカスタムドメイン、そのドメインの証明書と暗号化キー
    * 貴社のテクニカルサポート用メールアドレス

依頼を受領後、Wallarmテクニカルサポートは次を実施します。

1. Wallarm Cloudにグローバルアカウントとテクニカルテナントアカウントを作成します。
2. テクニカルクライアントアカウントのユーザー一覧に、**Global administrator**の[ロール](../../user-guides/settings/users.md)であなたを追加します。
3. 従業員のメールアドレスが提供されている場合、Wallarmテクニカルサポートは、テクニカルテナントアカウントのユーザー一覧に**Global read only**の[ロール](../../user-guides/settings/users.md)で従業員を追加します。

    未登録の従業員には、テクニカルテナントアカウントにアクセスするための新しいパスワードを設定するリンクを含むメールが届きます。
4. あなたのUUID（隔離環境向けにマルチテナンシーを使用するWallarmパートナー企業またはWallarmクライアントを示すメインテナントUUID）を送付します。

    受領したUUIDは後続の手順で必要になります。

### ステップ2: テナントを作成する

#### Wallarm Console経由

Global administratorアカウントで、Wallarm Console → tenant selector → **Create tenant**からテナントを作成できます。

![!Wallarm Consoleでのテナント作成](../../images/partner-waf-node/tenant-create-via-ui.png)

新しいテナント向けに新規のAdministrator[ユーザー](../../user-guides/settings/users.md#user-roles)を作成できます。指定したアドレスに招待メールが送信されます。

#### Wallarm API経由

テナントを作成するには、Wallarm APIに対して認証済みリクエストを送信できます。認証済みリクエストは、独自のAPIクライアントから送信するか、認証方法が定義された[Wallarm API Console](../../api/overview.md)から送信できます。

* **Wallarm API Console**からリクエストを送信する場合は、**Global administrator**ユーザーロールでWallarm Consoleにサインインし、以下のWallarm API Consoleページを更新します。
    * https://apiconsole.us1.wallarm.com/ US Cloud向け
    * https://apiconsole.eu1.wallarm.com/ EU Cloud向け
* **独自のAPIクライアント**からリクエストを送信する場合は、リクエストに[Global Administratorの権限を持つAPIトークン](../../user-guides/settings/api-tokens.md)を渡す必要があります。

このステップでは、グローバルアカウントに紐づいたテナントアカウントが作成されます。

1. 次のパラメータを指定して、ルート`/v1/objects/client/create`にPOSTリクエストを送信します。

    パラメータ | 説明 | リクエスト部位 | 必須
    --------- | -------- | ------------- | ---------
    `X-WallarmApi-Token` | **Global Administrator**の権限を持つ[APIトークン](../../user-guides/settings/api-tokens.md)。 | ヘッダー | はい（独自のAPIクライアントからリクエストを送信する場合）
    `name` | テナント名。 | ボディ | はい
    `vuln_prefix` | 脆弱性トラッキングおよびテナントとの関連付けにWallarmが使用する脆弱性プレフィックス。プレフィックスは4文字の大文字または数字で構成し、テナント名に関連したものにします。例: テナント`Tenant`に対しては`TNNT`。 | ボディ | はい
    `partner_uuid` | グローバルアカウント作成時に受領した[メインテナントUUID](#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature)。 | ボディ | はい

    ??? info "独自のAPIクライアントから送信するリクエスト例を表示"
        === "US Cloud"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "EU Cloud"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "レスポンス例を表示"
        ``` bash
        {
        "status":200,
        "body": {
            "id":10110,
            "name":"Tenant 1",
            "components":["waf"],
            "vuln_prefix":"TNTST",
            ...
            "uuid":"11111111-1111-1111-1111-111111111111",
            ...
            }
        }
        ```

2. レスポンスの`uuid`パラメータの値を控えます。このパラメータは、テナントのトラフィックをテナントアカウントに紐付ける際に使用します。

作成したテナントは、[グローバルユーザー](../../user-guides/settings/users.md#user-roles)に対してWallarm Consoleに表示されます。例えば、`Tenant 1`や`Tenant 2`です。

![Wallarm Consoleのテナントセレクタ](../../images/partner-waf-node/clients-selector-in-console.png)

### ステップ3: 特定のトラフィックをテナントに関連付ける

!!! info "設定のタイミング"
    この設定は、ノードのデプロイ時に実施し、すべてのテナントのトラフィックが1つのWallarmノードのみで[処理されている、または処理される予定](deploy-multi-tenant-node.md)の場合に限ります。

    各テナントのトラフィックを個別のノードが処理する場合は、このステップをスキップして[ノードのデプロイと設定](deploy-multi-tenant-node.md)に進んでください。

どのトラフィックをどのテナントアカウントの配下に表示すべきかをWallarm Cloudに伝えるため、特定のトラフィックを作成したテナントに関連付ける必要があります。そのために、NGINXの設定ファイルにテナントを含め、`wallarm_partner_client_uuid`ディレクティブの値としてその`uuid`（**ステップ3**で取得）を指定します。例:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

上記の設定では、`tenant1.com`宛のトラフィックはクライアント`11111111-1111-1111-1111-111111111111`に関連付けられます。

## アカウントへのアクセス権をユーザーに付与する

* テクニカルテナントアカウントには、ユーザーに付与できる**グローバル**および**通常**の[ロール](../../user-guides/settings/users.md)があります。

    グローバルユーザーは、リンクされたすべてのテナントアカウントにアクセスできます。

    通常ユーザーは、テクニカルテナントアカウントのみにアクセスできます。
* 各テナントアカウント上では、ユーザーに付与できるのは**通常**の[ロール](../../user-guides/settings/users.md)のみです。

    ユーザーは、特定のテナントアカウント内でブロックされたリクエストの追跡、検出された脆弱性の分析、フィルタリングノードの追加設定を実行できます。ロールが許可している場合、ユーザーは相互にユーザーを追加できます。

[マルチテナントノードのデプロイと設定へ →](deploy-multi-tenant-node.md)

## Wallarm Consoleでのテナントアカウントの無効化と有効化

Wallarm Consoleでは、**Global administrator**ロールのユーザーが、その管理対象のグローバルアカウントにリンクされたテナントアカウントを無効化できます。テナントアカウントを無効化すると、次の影響があります。

* このテナントアカウントのユーザーはWallarm Consoleにアクセスできません。
* この[テナントレベル](deploy-multi-tenant-node.md#multi-tenant-node-characteristics)にインストールされているフィルタリングノードはトラフィックの処理を停止します。

無効化されたアカウントは削除されず、再度有効化できます。

テナントアカウントを無効化するには、tenant selectorでtenant menuから**Deactivate**を選択し、確認します。テナントアカウントは無効化され、テナント一覧から非表示になります。

![テナント - Deactivate](../../images/partner-waf-node/tenant-deactivate.png)

以前に無効化したテナントアカウントを有効化するには、tenant selectorで**Show deactivated tenants**をクリックし、対象テナントで**Activate**を選択します。