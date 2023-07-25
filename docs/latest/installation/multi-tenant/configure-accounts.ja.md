# Wallarm Console でテナントアカウントを作成する

[マルチテナンシー](overview.ja.md)機能により、いくつかのリンクされたアカウントを1つのWallarm Consoleで使用できます。特定の企業や孤立した環境に割り当てられたアカウントは**テナントアカウント**と呼ばれます。

* Wallarm Consoleでテナントアカウントを正しくグループ化するために、各テナントアカウントはグローバルアカウントにリンクされ、パートナーまたは孤立した環境を持つクライアントを示します。
* ユーザーは各テナントアカウントに個別にアクセスが提供されます。
* 各テナントアカウントのデータは隔離され、アカウントに追加されたユーザーのみがアクセスできます。
* **グローバル**[ロール]（../../user-guides/settings/users.ja.md#user-roles）を持つユーザーは、新しいテナントアカウントを作成し、すべてのテナントアカウントのデータを表示および編集できます。

これらの手順は、テナントアカウントの正しい構成に関する手順を提供します。

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.ja.md"

## テナントアカウント構造

テナントアカウントは以下の構造に従って作成されます。

![!テナントアカウント構造](../../images/partner-waf-node/accounts-scheme.png)

* **グローバルアカウント**は、パートナーまたはクライアントごとにテナントアカウントをグループ化するためにのみ使用されます。
* **技術的なテナントアカウント**は、[グローバルユーザー]（../../user-guides/settings/users.ja.md#user-roles）を追加し、テナントアカウントへのアクセスを提供するために使用されます。グローバルユーザーは通常、Wallarmパートナー企業や孤立した環境のワラームクライアントの従業員です。
* **テナントアカウント**は以下を行うために使用されます。

    * テナントに検出された攻撃のデータおよびトラフィックフィルタリング設定へのアクセスを提供する。
    * 特定のテナントアカウントのデータへのユーザーアクセスを提供する。

[グローバルユーザー]（../../user-guides/settings/users.ja.md#user-roles）は次のことができます。

* Wallarm Consoleでアカウント間を切り替えます。
* テナントの[サブスクリプションとクォータ]（../../about-wallarm/subscription-plans.ja.md）を監視する。

![!Wallarm Consoleのテナントセレクタ]（../../images/partner-waf-node/clients-selector-in-console.png）

* `Technical tenant`は技術的なテナントアカウントです
* `Tenant 1`および`Tenant 2`はテナントアカウントです

## テナントアカウントの設定

テナントアカウントを設定するには：

1. Wallarm Consoleでサインアップし、アカウントのマルチテナンシー機能を有効にするリクエストをWallarmの技術サポートに送信します。
1. Wallarmの技術サポートからテナントアカウントの作成にアクセスします。
1. テナントアカウントを作成します。
1. 特定のトラフィックをテナントおよびそのアプリケーションに関連付けます。

### ステップ1：サインアップしてマルチテナンシー機能をアクティベートするリクエストを送信する

1. [US Cloud](https://us1.my.wallarm.com/signup)または[EU Cloud](https://my.wallarm.com/signup)のWallarm Consoleで登録フォームに記入し、確認してください。

    ![!登録フォーム]（../../images/signup-en.png）

    !!! info "法人メール"
        法人のメールアドレスを使用してサインアップしてください。
2. メール受信箱を開いて、受信メッセージからのリンクを使用してアカウントをアクティベートします。
3. アカウントのマルチテナンシー機能を有効にするリクエストを[Wallarmテクニカルサポート](mailto:support@wallarm.com)に送信します。リクエストに以下のデータを送信してください：
    * 使用中のWallarm Cloudの名前（US CloudまたはEU Cloud）
    * グローバルアカウントと技術的なテナントアカウントの名前
    * テナントアカウントへのアクセスを提供するための従業員のメールアドレス（マルチテナンシー機能をアクティブにした後、自分で従業員を追加できます）
    * Wallarm Consoleのブランド化がされたロゴ
    * Wallarm Consoleのカスタムドメイン、証明書、およびドメインの暗号化キー
    * お客様の技術サポートメールアドレス

### ステップ2：テナントアカウントの作成にアクセスする

リクエストを受け取った後、Wallarmの技術サポートは以下の操作を行います。

1. Wallarm Cloudにグローバルアカウントと技術的なテナントアカウントを作成します。
2. [ロール]（../../user-guides/settings/users.ja.md）が**グローバル管理者**である技術クライアントアカウントのユーザーリストに追加します。
3. 従業員のメールアドレスが提供されている場合、Wallarmの技術サポートは[ロール]（../../user-guides/settings/users.ja.md）が**グローバルリードオンリー**である技術的なテナントアカウントのユーザーリストに従業員を追加します。

    未登録の従業員は、技術的なテナントアカウントへのアクセスのための新しいパスワードを設定するためのリンクが記載されたメールを受け取ります。
4. UUID（Wallarmパートナー企業や孤立した環境のWallarmクライアントを示すメインテナントUUID）を送信します。

    これ以降のステップでは、受信したUUIDが必要になります。

### ステップ3：Wallarm APIを介したテナントの作成

テナントを作成するには、Wallarm APIに認証済みリクエストを送信する必要があります。認証済みリクエストをWallarm APIに送信する方法は、独自のクライアントまたは認証方法を定義したAPI Reference UIから送信できます。

* **API Reference UI**から送信されるリクエストの場合、**グローバル管理者**ユーザーロールでWallarm Consoleにサインインし、以下のリンクでAPI Referenceを更新する必要があります。
    * https://apiconsole.us1.wallarm.com/ for the US Cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU Cloud
* **独自のクライアント**から送信されるリクエストの場合、[グローバル管理者ユーザーのUUIDと秘密鍵]（../../api/overview.ja.md#your-own-client）をリクエストに渡す必要があります。

この段階では、グローバルアカウントにリンクされたテナントアカウントが作成されます。

1. 次のパラメータでルート`/v1/objects/client/create`へのPOSTリクエストを送信します。

    パラメータ | 説明 | リクエスト部分 | 必須
    --------- | -------- | ------------- | ---------
    `name` | テナント名。 | 本文 | はい
    `vuln_prefix` | Wallarmが脆弱性の追跡とテナントとの関連付けに使用する脆弱性プレフィックス。プレフィックスは4つの大文字または数字を含め、テナント名に関連している必要があります（例：`Tenant`のテナントは`TNNT`）。 | 本文 | はい
    `partner_uuid` | グローバルアカウント作成時に受け取った[メインテナントUUID](#step-2-get-access-to-the-tenant-account-creation)。 | 本文 | はい
    `X-WallarmAPI-UUID` | [グローバル管理者ユーザーのUUID](../../api/overview.ja.md#your-own-client)。 | ヘッダー | 独自のクライアントからリクエストを送信する場合は必須
    `X-WallarmAPI-Secret` | [グローバル管理者ユーザーの秘密鍵](../../api/overview.ja.md#your-own-client)。 | ヘッダー | 独自のクライアントからリクエストを送信する場合は必須

    ??? info "独自のクライアントから送信されたリクエストの例を表示"
        === "USクラウド"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "EUクラウド"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "レスポンスの例を表示"
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

2. リクエストの応答から`uuid`パラメータの値をコピーします。このパラメータは、テナントのトラフィックをテナントアカウントにリンクする際に使用されます。

作成されたテナントは、[グローバルユーザー]（../../user-guides/settings/users.ja.md#user-roles）向けにWallarm Consoleに表示されます。たとえば、`Tenant 1`および`Tenant 2`：

![!Wallarm Consoleでのテナントセレクタ]（../../images/partner-waf-node/clients-selector-in-console.png）### ステップ4：特定のトラフィックをテナントに関連付ける

!!! info "いつ設定するか？"
    この設定は、ノードのデプロイメント中に行われ、すべてのテナントのトラフィックが1つのWallarmノードで[処理されるか、処理される予定](deploy-multi-tenant-node.ja.md)である場合にのみ行われます。

    各テナントのトラフィックを個別のノードが処理する場合は、このステップをスキップして、[ノードのデプロイメントと設定](deploy-multi-tenant-node.ja.md)に進んでください。

Wallarm Cloudに、どのトラフィックがどのテナントアカウントに表示されるべきかについての情報を提供するために、特定のトラフィックを作成したテナントに関連付ける必要があります。これを行うには、NGINX設定ファイルで、`uuid`(ステップ3で取得) を[`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.ja.md#wallarm_partner_client_uuid)ディレクティブの値として使用してテナントを含めます。例えば:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

上記の設定では、`tenant1.com` に対象となるトラフィックがクライアント`11111111-1111-1111-1111-111111111111`と関連付けられます。

## アカウントへのユーザーアクセスの提供

* 技術的なテナントアカウントでは、**グローバル** と **通常** の[ロール](../../user-guides/settings/users.ja.md)がユーザーに提供されます。

    グローバルユーザーは、すべてのリンクされたテナントアカウントにアクセスできます。

    通常のユーザーは、技術的なテナントアカウントにのみアクセスできます。
* 特定のテナントアカウントでは、**通常** の[ロール](../../user-guides/settings/users.ja.md)のみがユーザーに提供されます。

    ユーザーは、特定のテナントアカウント内のフィルタリングノードの追加設定を行い、ブロックされたリクエストを追跡し、発見された脆弱性を分析することができます。ロールがこの操作を許可している場合、ユーザーは自分で他のユーザーを追加することができます。

[マルチテナントノードのデプロイメントと設定に進む →](deploy-multi-tenant-node.ja.md)

## Wallarm Consoleでテナントアカウントの無効化と有効化

Wallarm Consoleでは、**Global administrator**ロールを持つユーザーは、この管理者が管理するグローバルアカウントにリンクされたテナントアカウントを無効化できます。テナントアカウントが無効化されると:

* このテナントアカウントのユーザーは、Wallarm Consoleにアクセスできません。
* この[テナントレベル](deploy-multi-tenant-node.ja.md#multi-tenant-node-characteristics)にインストールされたフィルタリングノードは、トラフィック処理を停止します。

無効化されたアカウントは削除されず、再度有効化することができます。

テナントアカウントを無効化するには、テナントセレクターで、テナントメニューから**Deactivate**を選択し、確認してください。テナントアカウントは無効化され、テナントリストから非表示になります。

![!Tenant - Deactivate](../../images/partner-waf-node/tenant-deactivate.png)

以前に無効化されたテナントアカウントを有効化するには、テナントセレクターで、**Show deactivated tenants**をクリックし、テナントに対して**Activate**を選択します。