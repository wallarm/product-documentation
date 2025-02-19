# Wallarm Consoleでテナントアカウントを作成

以下の手順は、[テナントアカウント](overview.md)を正しく構成するためのものです。

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## テナントアカウントの設定

テナントアカウントを設定するには、以下の手順を実施してください:

1. Wallarm Consoleにサインアップし、ご利用のアカウント向けにマルチテナンシー機能有効化のリクエストをWallarm technical supportへ送信します。
2. テナントアカウントを作成します。
3. テナント及びそのアプリケーションに特定のトラフィックを関連付けます。

### ステップ1: サインアップしてマルチテナンシー機能有効化リクエストを送信

1. [US Cloud](https://us1.my.wallarm.com/signup)または[EU Cloud](https://my.wallarm.com/signup)でWallarm Consoleにアクセスし、登録フォームに入力し内容を確認してください。

    ![登録フォーム](../../images/signup-en.png)

    !!! info "企業メールアドレス"
        企業メールアドレスを使用してサインアップしてください。
2. メールボックスを確認し、受信したメッセージ内のリンクをクリックしてアカウントを有効化してください。
3. [Wallarm technical support](mailto:support@wallarm.com)に対して、アカウントでのマルチテナンシー機能有効化リクエストを送信してください。リクエストには以下の情報を含めてください:
    * 使用しているWallarm Cloudの名前（US CloudまたはEU Cloud）
    * グローバルアカウント及びテクニカルテナントアカウントの名称
    * テナントアカウントへアクセスを付与する従業員のメールアドレス（マルチテナンシー機能有効化後は、従業員を自ら追加できます）
    * ブランディングされたWallarm Consoleのロゴ
    * Wallarm Consoleのカスタムドメイン、そのドメインの証明書と暗号化キー
    * あなたのテクニカルサポート用メールアドレス

リクエストを受領後、Wallarm technical supportは以下の処理を行います:

1. Wallarm Cloud内にグローバルアカウントとテクニカルテナントアカウントを作成します。
2. あなたをテクニカルクライアントアカウントのユーザーリストに[役割](../../user-guides/settings/users.md)「Global administrator」として追加します。
3. 従業員のメールアドレスが提供された場合、Wallarm technical supportはテクニカルテナントアカウントのユーザーリストに[役割](../../user-guides/settings/users.md)「Global read only」として従業員を追加します。

    未登録の従業員には、新たなパスワード設定リンクが記載されたメールが送信され、テクニカルテナントアカウントへのアクセスが可能となります。
4. あなたのUUID（マルチテナンシーを利用して分離環境を運用するWallarm partner companyまたはWallarm clientを示すメインテナントUUID）を送信します。  
    受領したUUIDは以降の手順で必要となります。

### ステップ2: テナントを作成

#### Wallarm Console経由

**Global administrator**アカウントで、Wallarm Console → tenant selector → **Create tenant**を使用してテナントを作成できます。

![Wallarm Console経由でテナントを作成](../../images/partner-waf-node/tenant-create-via-ui.png)

新しいテナント向けに、新たな**Administrator**[ユーザー](../../user-guides/settings/users.md#user-roles)を作成できます。招待メールは指定されたアドレスに送信されます。

#### Wallarm API経由

テナントを作成するには、Wallarm APIへ認証済みリクエストを送信します。認証済みリクエストは、ご自身のAPIクライアントまたは認証方式が定義されている[Wallarm API Console](../../api/overview.md)から送信できます:

* **Wallarm API Console**からリクエストを送信する場合は、**Global administrator**ユーザーとしてWallarm Consoleにサインインし、以下のURLで利用可能なWallarm API Consoleページを更新する必要があります:
    * US Cloudは https://apiconsole.us1.wallarm.com/
    * EU Cloudは https://apiconsole.eu1.wallarm.com/
* **ご自身のAPIクライアント**からリクエストを送信する場合、リクエストに[Global Administratorの権限を持つAPI token](../../user-guides/settings/api-tokens.md)を渡す必要があります.

この手順で、グローバルアカウントに連携したテナントアカウントが作成されます。

1. 以下のパラメーターを用いて、ルート `/v1/objects/client/create` へPOSTリクエストを送信してください:

    パラメーター | 説明 | リクエスト部 | 必須
    ------------ | ---- | ------------ | ----
    `X-WallarmApi-Token` | [Global Administratorの権限を持つAPI token](../../user-guides/settings/api-tokens.md). | Header | ご自身のAPIクライアントからリクエストを送信する場合は必須
    `name` | テナントの名称. | Body | 必須
    `vuln_prefix` | Wallarmが脆弱性追跡及びテナントとの関連付けに使用する脆弱性プレフィックス. このプレフィックスは4つの大文字または数字を含み、テナントの名称に関連している必要があります（例：テナント "Tenant" の場合は `TNNT`）. | Body | 必須
    `partner_uuid` | グローバルアカウント作成時に受領した[メインテナントUUID](#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature). | Body | 必須

    ??? info "ご自身のAPIクライアントから送信したリクエストの例"
        === "USクラウド"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "EUクラウド"
            ```bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "レスポンスの例を表示"
        ```bash
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

2. レスポンスから`uuid`パラメーターの値をコピーしてください。このパラメーターはテナントアカウントにトラフィックを関連付ける際に使用されます.

作成されたテナントは、[global users](../../user-guides/settings/users.md#user-roles)向けにWallarm Consoleに表示されます。例えば、`Tenant 1`や`Tenant 2`が該当します:

![Wallarm Consoleにおけるテナントのセレクター](../../images/partner-waf-node/clients-selector-in-console.png)

### ステップ3: テナントに特定のトラフィックを関連付ける

!!! info "設定のタイミング"
    この設定はノードのデプロイ時に実施され、すべてのテナントのトラフィックが単一のWallarmノードにより[処理されているまたは処理される](deploy-multi-tenant-node.md)場合にのみ適用されます。

    各テナントのトラフィックを別々のノードで処理している場合は、この手順をスキップし、[ノードのデプロイと設定](deploy-multi-tenant-node.md)に進んでください.

Wallarm Cloudにどのトラフィックがどのテナントアカウントに表示されるかの情報を提供するため、作成したテナントに特定のトラフィックを関連付ける必要があります。これを実現するには、NGINXの設定ファイルにおいて、テナントの`uuid`（**ステップ3**で取得）を[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid)ディレクティブの値として指定します。例えば:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

上記の設定では、`tenant1.com`を対象とするトラフィックがクライアント`11111111-1111-1111-1111-111111111111`に関連付けられます.

## アカウントへのユーザーアクセスの提供

* テクニカルテナントアカウントには、ユーザーに付与できる**global**および**regular**[役割](../../user-guides/settings/users.md)が存在します.
    
    Globalユーザーはすべての連携されたテナントアカウントへアクセスできます.
    
    Regularユーザーはテクニカルテナントアカウントのみへのアクセスが可能です.
* 一部のテナントアカウントには、ユーザーに付与できるのは**regular**[役割](../../user-guides/settings/users.md)のみです.
    
    ユーザーは特定のテナントアカウント内で、ブロックされたリクエストの追跡、発見された脆弱性の解析、およびフィルタリングノードの追加設定を行うことができます. 役割が許可している場合、ユーザーは相互に自らを追加することが可能です.

[マルチテナントノードのデプロイと設定に進む →](deploy-multi-tenant-node.md)

## Wallarm Consoleにおけるテナントアカウントの無効化と有効化

Wallarm Consoleでは、**Global administrator**ロールを持つユーザーが、その管理対象のグローバルアカウントに連携しているテナントアカウントを無効化できます。テナントアカウントが無効化されると:

* このテナントアカウントのユーザーはWallarm Consoleへアクセスできなくなります.
* この[テナントレベル](deploy-multi-tenant-node.md#multi-tenant-node-characteristics)に設置されたフィルタリングノードはトラフィックの処理を停止します.

無効化されたアカウントは削除されず、再度有効化することが可能です.

テナントアカウントを無効化するには、tenant selector内のテナントメニューから**Deactivate**を選択し、確認してください。テナントアカウントは無効化され、テナントリストから非表示となります.

![テナント - 無効化](../../images/partner-waf-node/tenant-deactivate.png)

以前に無効化されたテナントアカウントを再度有効化するには、tenant selectorで**Show deactivated tenants**をクリックし、該当テナントの**Activate**を選択してください.