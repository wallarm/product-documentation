```markdown
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

# ユーザー管理

Wallarmアカウントにチームメンバーを招待し、各メンバーに特定の役割を割り当てることで、機密情報の保護およびアカウント操作の制限を実現できます。**Settings** → **Users**でユーザーを管理してください。

ユーザー管理の権限は、**Administrator**および**Global Administrator**のみが有します。

## ユーザーの役割

Wallarmクライアントのユーザーには、以下の役割を割り当てることができます。

- **Administrator**：すべてのWallarm設定にアクセスできます。
- **Analyst**：主要なWallarm設定の表示、および攻撃、[incidents][link-glossary-incident]、[vulnerabilities][link-glossary-vulnerability]に関する情報の管理が可能です。
- **Read Only**：主要なWallarm設定の表示のみ可能です。
- **API Developer**：[API Discovery](../../api-discovery/overview.md)モジュールで検出されたAPIのインベントリを表示およびダウンロードできます。この役割は、会社のAPIに関する最新データを取得するためだけにWallarmを利用するユーザーを区別するためのものです。これらのユーザーは、**API Discovery**、そのダッシュボード、および**Settings → Profile**以外のWallarm Consoleのセクションにはアクセスできません。
- **Deploy**：`addnode`スクリプトを使用してWallarmのフィルタリングノードを作成できますが、Wallarm Consoleへのアクセスはありません。

!!! warning "Wallarmノード4.0のインストールにDeploy役割を使用する場合"
    **Deploy**ユーザーの役割は、バージョン4.0のリリースで[`addnode`スクリプトが非推奨になった](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens)ため、ノード3.6以下のみのインストールで使用することを推奨します。

[multitenancy](../../installation/multi-tenant/overview.md)機能により、グローバル役割である**Global Administrator**、**Global Analyst**、**Global Read Only**を使用することも可能です。グローバル役割は技術テナントアカウントおよびリンクされたテナントアカウントへのアクセスを提供し、通常の役割は技術テナントアカウントのみへのアクセスを提供します。

Wallarmの各エンティティに対する異なるユーザー役割のアクセス権に関する詳細な情報は、以下の表に示されています。エンティティ管理にはエンティティの作成、編集、削除が含まれます。

| エンティティ                              | Administrator/Global Administrator | Analyst/Global Analyst | Read Only/Global Read Only | API Developer         |
|-------------------------------------------|--------------------------------------|------------------------|----------------------------|-----------------------|
| **フィルタリングノード**                  | 表示および管理                       | 表示                   | 表示                       | -                     |
| **ダッシュボード**                        | 表示                                 | 表示                   | 表示                       | -                     |
| **攻撃**                                  | 表示および管理                       | 表示および管理         | 表示                       | -                     |
| **インシデント**                          | 表示および管理                       | 表示および管理         | 表示                       | -                     |
| **APIセッション**                         | 表示および管理                       | 表示                   | 表示                       | -                     |
| **脆弱性**                                | 表示および管理                       | 表示および管理         | 表示                       | -                     |
| **API DiscoveryによるAPIインベントリ**    | 表示および管理                       | 表示および管理         | -                          | 表示およびダウンロード|
| **API仕様**                               | 表示および管理                       | 表示                   | 表示                       | 表示                  |
| **スキャナー**                            | 表示および管理                       | 表示および管理         | 表示                       | -                     |
| **トリガー**                              | 表示および管理                       | -                      | -                          | -                     |
| **IPリスト**                              | 表示、管理、およびエクスポート         | 表示、管理、およびエクスポート | 表示およびエクスポート         | -                     |
| **ルール**                                | 表示および管理                       | 表示および管理         | 表示                       | -                     |
| **クレデンシャルスタッフィング検出**      | 表示および管理                       | 表示および管理         | 表示                       | -                     |
| **BOLA保護**                              | 表示および管理                       | 表示                   | -                          | -                     |
| **Security Edge**                         | 表示および管理                       | 表示                   | -                          | -                     |
| **統合**                                  | 表示および管理                       | -                      | -                          | -                     |
| **フィルトレーションモード**              | 表示および管理                       | 表示                   | 表示                       | -                     |
| **アプリケーション**                      | 表示および管理                       | 表示                   | 表示                       | -                     |
| **ユーザー**                              | 表示および管理                       | -                      | 表示                       | -                     |
| **APIトークン**                           | 個人および共有トークンの管理           | 個人トークンの管理     | -                          | -                     |
| **アクティビティログ**                    | 表示                                 | -                      | 表示                       | -                     |

## ユーザーの招待

アカウントにユーザーを追加する方法は2通りあり、いずれも招待リンクの作成および共有を伴います。Wallarmがユーザーの指定するメールアドレスに自動的に招待リンクを送信するか、リンクを直接ユーザーと共有するかのいずれかです。

### 自動メール招待

この方法では、あらかじめユーザーの役割、メールアドレス、および氏名を設定しておくと、Wallarmが指定されたユーザーのメールアドレスにログインおよびパスワード設定用のリンク付き招待メールを自動的に送信します。ユーザーはそのリンクに従ってサインアップ手続きを完了してください。

招待リンクを自動的に送信するには、**Add new user**ボタンをクリックし、フォームに入力してください：

![New user form][img-add-user]

フォーム送信後、ユーザーはユーザー一覧に追加され、招待リンク付きのメールが送信されます。

### 手動招待リンクの共有

**Invite by link**オプションを使用して、チームメンバーのメールアドレス、役割、およびリンクの有効期間を選択することで招待リンクを生成してください。その後、このリンクを対象のユーザーと共有してください。

![New user inv link][img-add-user-invitation-link]

このリンクは、Wallarmサインアップページへ誘導し、パスワードの設定と氏名の入力によりアカウント作成を行います。

サインアップ完了後、ユーザー一覧に追加され、確認メールが送信されます。

## ユーザー設定の変更

ユーザーが一覧に表示されたら、対応するユーザーメニューの**Edit user settings**オプションを使用して設定を編集できます。これにより、割り当てられたユーザー役割、ファーストネーム、およびラストネームを変更できます。

## 2FAの無効化

ユーザーが[二要素認証(2FA)を有効にしている](account.md#enabling-two-factor-authentication)場合にリセットが必要なときは、ユーザーメニューから**Disable 2FA**オプションを選択してください。Wallarm管理者アカウントのパスワードを入力して操作を確認してください。

![User actions menu][img-user-menu-disable-2fa]

これにより、対象ユーザーの2FAが無効化されます。ユーザーはプロフィール設定から2FAを再度有効化できます。

## ユーザーの無効化と削除

* アカウント情報を削除せずに一時的にユーザーのWallarmアカウントのログイン機能を停止する場合は、その名前の横にある**Disable access**オプションを使用してください。この操作により、メインのユーザー一覧でグレー表示となり、**Disabled**タブに一覧表示されます。**Enable access**を選択することでアカウントを再有効化でき、再度Wallarmにログインしてアクセスできるようになります。
* 永続的に削除し、ログインアクセス権を永久に取り消すには、ユーザーメニューから**Delete**を選択してください。この操作はユーザー一覧から完全に削除され、取り消すことはできません。

## 新規ユーザーアラート

**User added**条件の[トリガー](../triggers/triggers.md)を設定することで、Wallarmアカウントに新規ユーザーが追加された際に即時通知を受け取れます。特定の役割または任意の新規ユーザー追加について通知を受け取るように選択できます。

これらの通知に興味のあるチームメンバーは、それぞれ自身でトリガーの設定を行ってください。

**トリガー例：Slackへの新規ユーザーアラート**

Wallarm Consoleの会社アカウントに**Administrator**または**Analyst**役割の新規ユーザーが追加されると、このイベントに関する通知が統合で指定されたメールアドレスおよびSlackチャンネルに送信されます。

![Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

**トリガーのテスト方法：**

1. Wallarm Consoleの**Settings** → **Users**を開き、新規ユーザーを追加してください。
2. メール受信トレイを確認し、以下のメッセージが届いていることを確認してください：

    ![Email about new user added](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Slackチャンネルを開き、ユーザー**wallarm**から以下の通知が届いていることを確認してください：

    ```
    [Wallarm] Trigger: New user was added to the company account

    Notification type: create_user

    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith`および`johnsmith@example.com`は、追加されたユーザーに関する情報です
    * `Analyst`は、追加されたユーザーの役割です
    * `John Doe`および`johndoe@example.com`は、新規ユーザーを追加したユーザーに関する情報です
    * `Added user`は、トリガー名です
    * `TestCompany`は、Wallarm Consoleの会社アカウント名です
    * `EU`は、会社アカウントが登録されているWallarm Cloudです

## ログアウト管理

**Administrator**および**Global Administrator**[roles](users.md#user-roles)は、**Settings** → **General**で会社アカウントのログアウトタイムアウトを設定できます。この設定はすべてのアカウントユーザーに影響します。アイドルタイムアウトおよび絶対タイムアウトを設定可能です。

![General tab](../../images/user-guides/settings/general-tab.png)
```