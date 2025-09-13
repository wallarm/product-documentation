[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/integrations/webhook-examples/adding-user.png
[img-add-user-invitation-link]: ../../images/user-guides/settings/invite-user-by-link.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    

# ユーザーの管理

チームメンバーをWallarmアカウントに招待し、機密情報を保護してアカウントでの操作を制限するために各メンバーに特定のロールを割り当てます。ユーザーの管理は**Settings** → **Users**で行います。

**Administrator**および**Global Administrator**ロールのみがユーザー管理権限を持ちます。

## ユーザーロール

Wallarmクライアントのユーザーには次のロールがあります。

* **Administrator**: Wallarmのすべての設定にアクセスできます。
* **Analyst**: 主要なWallarm設定の閲覧が可能で、攻撃、[インシデント][link-glossary-incident]、[脆弱性][link-glossary-vulnerability]に関する情報を管理できます。
* **Read Only**: 主要なWallarm設定を閲覧できます。
* **API Developer**: [API Discovery](../../api-discovery/overview.md)モジュールが検出したAPIインベントリの閲覧とダウンロードが可能です。このロールは、会社のAPIに関する最新データをWallarmで取得することのみが必要なユーザーを区別するためのものです。これらのユーザーは**API Discovery**、そのdashboard、**Settings → Profile**以外のWallarm Consoleのセクションにはアクセスできません。
* **Deploy**: `addnode`スクリプトを使用してWallarmフィルタリングノードを作成できますが、Wallarm Consoleにはアクセスできません。

    !!! warning "Wallarmノード4.0のインストールにDeployロールを使用する場合"
        [バージョン4.0のリリースで`addnode`スクリプトは非推奨になった](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens)ため、**Deploy**ユーザーロールの使用はノード3.6以下のインストールにのみ推奨されます。

[マルチテナンシー](../../installation/multi-tenant/overview.md)機能により、グローバルロールの**Global Administrator**、**Global Analyst**、**Global Read Only**も使用できます。グローバルロールはテクニカルテナントアカウントおよびリンクされたテナントアカウントへのアクセスを付与し、通常ロールはテクニカルテナントアカウントのみにアクセスを付与します。

各ユーザーロールのWallarmエンティティへのアクセス権の詳細は以下の表のとおりです。エンティティの管理には、作成・編集・削除が含まれます。

| エンティティ              | Administrator / Global Administrator | Analyst / Global Analyst | Read Only / Global Read Only | API Developer |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **Filtering nodes**       | 閲覧・管理                      | 閲覧                     | 閲覧                         | - |
| **Dashboard**       | 閲覧                                 | 閲覧                     | 閲覧                         | - |
| **Attacks**          | 閲覧・管理                      | 閲覧・管理          | 閲覧                         | - |
| **Incidents**          | 閲覧・管理                      | 閲覧・管理          | 閲覧                         | - |
| **API Sessions**          | 閲覧・管理                      | 閲覧          | 閲覧                         | - |
| **Vulnerabilities** | 閲覧・管理                      | 閲覧・管理          | 閲覧              | - |
| **API inventory by API Discovery**   | 閲覧・管理                      | 閲覧・管理          | -                            | 閲覧・ダウンロード |
| **API Specifications**   | 閲覧・管理                      | 閲覧          | 閲覧                            | 閲覧 |
| **Triggers**        | 閲覧・管理                      | -                        | -                            | - |
| **IP lists**       | 閲覧・管理・エクスポート             | 閲覧・管理・エクスポート | 閲覧・エクスポート              | - |
| **Rules**           | 閲覧・管理                      | 閲覧・管理          | 閲覧                         | - |
| **Credential Stuffing Detection**           | 閲覧・管理                      | 閲覧・管理          | 閲覧                         | - |
| **BOLA protection**           | 閲覧・管理                      | 閲覧          | - | - |
| **Security Edge**    | 閲覧・管理                      | 閲覧                        | -                            | - |
| **Integrations**    | 閲覧・管理                      | -                        | -                            | - |
| **Filtration mode**        | 閲覧・管理                      | 閲覧                     | 閲覧                         | - |
| **Applications**    | 閲覧・管理                      | 閲覧                     | 閲覧                         | - |
| **Users**           | 閲覧・管理                      | -                        | 閲覧                         | - |
| **API tokens**           | 個人用および共有トークンの管理 | 個人用トークンの管理 | - | - |
| **Activity log**    | 閲覧                                 | -                        | 閲覧                         | - |

## ユーザーの招待

ユーザーをアカウントに追加する方法は2つあります。どちらも招待リンクの作成と共有を伴います。Wallarmから指定したユーザーのメールアドレスに招待リンクを自動送信するか、生成したリンクを直接共有できます。

### メールによる自動招待

この方法では、あらかじめユーザーのロール、メールアドレス、氏名を設定しておくと、Wallarmがログイン用リンク付きの招待メールをそのユーザーのメールアドレスへ自動送信します。ユーザーはリンクに従ってサインアップを完了します。

招待リンクを自動送信するには、**Add user**ボタンをクリックしてフォームに入力します。

![新規ユーザーのフォーム][img-add-user]

フォームを送信すると、ユーザーはユーザー一覧に追加され、招待リンクを含むメールを受信します。

### 招待リンクの手動共有

**Invite by link**オプションを使用して、チームメンバーのメールアドレス、ロール、リンクの有効期間を選択し、招待リンクを生成します。その後、リンクを対象ユーザーに共有します。

![新規ユーザーの招待リンク][img-add-user-invitation-link]

このリンクはWallarmのサインアップページに遷移し、ユーザーはパスワードの選択と氏名の入力によってアカウントを作成できます。

サインアップ後、ユーザーはユーザー一覧に追加され、確認メールを受信します。

## SSOによる自動作成

SAML SSOソリューションから直接、Wallarm Consoleのユーザーとその権限を管理できます。この場合、SAML SSOソリューションでWallarmのロールにマッピングされたグループを用意します。これらのグループ内で新しいユーザーを作成すると、Wallarm側に自動的にユーザーが作成され、以下が付与されます。

* 対応するWallarmロール
* SSOの認証情報で即座にWallarm Consoleへアクセス
* ロールで規定された権限

これを機能させるには、[こちら](../../admin-en/configuration-guides/sso/setup.md#step-4-saml-sso-solution-configure-provisioning)の説明に従って、WallarmとSAML SSOソリューション間のインテグレーションを**provisioning**オプション有効で構成する必要があります。

## ユーザー設定の変更

ユーザーがユーザー一覧に表示されたら、該当ユーザーのメニューから**Edit user settings**オプションを使用して設定を編集できます。割り当てられたユーザーロール、名、姓を変更できます。

## 2FAの管理

<a id="enforcing-for-all-users"></a>
### 全ユーザーへの強制

会社の全ユーザーに二要素認証(2FA)の使用を強制できます。実施するには次のとおりです。

1. Wallarm Console → **Settings** → **General**を開きます。
1. **Sign-in management**セクションで、**Enforce two-factor authentication for all company users**オプションを選択し、確認します。

![2FA - 全会社ユーザーに対して有効化](../../images/user-guides/settings/2fa-enforce.png)

有効化すると、会社アカウントのすべてのユーザーは回避できず、ログイン前に2FAを設定する必要があります。次回ログイン時に2FAが必須であることが通知され、2FAの構成オプションが提示されます。ただし、このオプションを有効化しても現在のユーザーセッションには影響しません。

強制モードは後からいつでも無効化できます。無効化後、ユーザーには通知されず、[ユーザー本人](account.md#enabling-two-factor-authentication)または[あなた（管理者）](#disabling-for-selected-users)がそのユーザーに対して手動で無効化するまで、引き続き2FAを使用します。

<a id="disabling-for-selected-users"></a>
### 特定ユーザーの無効化

ユーザーに[二要素認証(2FA)が有効](account.md#enabling-two-factor-authentication)で、リセットする必要がある場合、ユーザーメニューから**Disable 2FA**オプションを選択します。Wallarm管理者アカウントのパスワードを入力して操作を確認します。[2FAの強制モード](#enforcing-for-all-users)が有効な場合、個別ユーザーの2FAを無効化することはできません。

![ユーザー操作メニュー][img-user-menu-disable-2fa]

これで選択したユーザーの2FAが無効になります。ユーザーは自分のProfile設定から2FAを再度有効化できます。

## ユーザーの無効化と削除

* アカウント情報を削除せずに一時的にユーザーのWallarmアカウントへのログインを停止するには、名前の横の**Disable access**オプションを使用します。この操作により、メインのユーザー一覧でグレー表示となり、**Disabled**タブに表示されます。**Enable access**を選択してアカウントを再有効化すると、再びWallarmへログイン・アクセスできるようになります。
* 永久に削除してログインアクセスを恒久的に取り消すには、ユーザーメニューから**Delete**を選択します。この操作によりユーザーはユーザー一覧から完全に削除され、元に戻せません。

## 新規ユーザーのアラート

[trigger](../triggers/triggers.md)で**User added**条件を設定すると、Wallarmアカウントに新しいユーザーが追加された際に即時アラートを受け取れます。特定のロール、またはすべての新規ユーザー追加について通知を受けるように選択できます。

これらの通知を受け取りたいチームメンバーは、各自でトリガーを設定する必要があります。

**トリガー例: Slackへの新規ユーザーアラート**

Wallarm Consoleの会社アカウントに**Administrator**または**Analyst**ロールの新規ユーザーが追加された場合、インテグレーションで指定したメールアドレスおよびSlackチャンネルにこのイベントの通知が送信されます。

![Slackおよびメールに通知を送るトリガーの例](../../images/user-guides/triggers/trigger-example2.png)

**トリガーをテストする手順:**

1. Wallarm Console → **Settings** → **Users**を開き、新しいユーザーを追加します。
2. メールのInboxを開き、次のメッセージが受信されていることを確認します。

    ![新規ユーザー追加に関するメール](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slackチャンネルを開き、ユーザー**wallarm**から次の通知が受信されていることを確認します。

    ```
    [Wallarm] Trigger: 会社アカウントに新しいユーザーが追加されました
    
    Notification type: create_user
    
    新しいユーザー John Smith <johnsmith@example.com>（ロール: Analyst）が、John Doe <johndoe@example.com>により会社アカウントに追加されました。
    この通知は "Added user" トリガーによってトリガーされました。

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` と `johnsmith@example.com` は追加されたユーザーの情報です
    * `Analyst` は追加されたユーザーのロールです
    * `John Doe` と `johndoe@example.com` は新しいユーザーを追加したユーザーの情報です
    * `Added user` はトリガー名です
    * `TestCompany` はWallarm Consoleにおける貴社の会社アカウント名です
    * `EU` は貴社の会社アカウントが登録されているWallarm Cloudです

## ログアウト管理

**Administrator**および**Global Administrator**の[ロール](users.md#user-roles)は、**Settings** → **General**で会社アカウントのログアウトタイムアウトを設定できます。設定はすべてのアカウントユーザーに適用されます。アイドルタイムアウトと絶対タイムアウトを設定できます。

![Generalタブ](../../images/user-guides/settings/general-tab.png)