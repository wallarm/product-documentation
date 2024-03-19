[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/integrations/webhook-examples/adding-user.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    

# ユーザーの設定

*設定*で*ユーザー*タブを配置してユーザーアカウントを管理できます。

!!! warning "管理者アクセス"
    **管理者**ロールのユーザーのみがこの設定にアクセスできます。

## ユーザーロール

Wallarmのクライアントのユーザーは次のロールを持つことができます：

* すべてのWallarm設定へのアクセスを持つ**管理者**
* 主なWallarm設定を視覚化し、攻撃、[インシデント][link-glossary-incident]と[脆弱性][link-glossary-vulnerability]に関する情報を管理するためのアクセスを持つ**分析者**
* 主要なWallarm設定を視覚化するためのアクセスを持つ**読取専用**
* [API Discovery](../../api-discovery/overview.md)モジュールによって検出されたAPIのインベントリを視覚化し、ダウンロードするためのアクセスを持つ**API開発者**。このロールは、Wallarmを使用して会社のAPIに関する最新データを取得するだけのタスクを担っているユーザーを区別することを可能にします。これらのユーザーは **API Discovery**および**設定→プロフィール**を除く、任意のWallarmコンソールセクションへのアクセスを持っていません。

[multitenancy](../../installation/multi-tenant/overview.md)機能も、**グローバル管理者**、**グローバルアナリスト**、**グローバル読取専用**というグローバルロールを使用することを可能にします。グローバルロールは、ユーザーに技術テナントアカウントとリンクされたテナントアカウントへのアクセスを提供し、通常のロールは技術テナントアカウントへのアクセスのみをユーザーに提供します。

Wallarmのエンティティに対する異なるユーザーロールのアクセスについての詳細な情報は、以下の表に示されています。エンティティ管理では、エンティティの作成、編集および削除が含まれます。

| エンティティ              | 管理者 / グローバル管理者 | 分析者 / グローバルアナリスト | 読取専用 / グローバル読取専用 | API開発者 |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **フィルタリングノード**       | 視覚化と管理                      | 視覚化                    | 視覚化                        | - |
| **ダッシュボード**       | 視覚化                                 | 視覚化                    | 視覚化                        | - |
| **イベント**          | 視覚化と管理                      | 視覚化と管理          | 視覚化                        | - |
| **脆弱性** | 視覚化と管理                      | 視覚化と管理          | 視覚化            | - |
| **API Discovery によるAPI のインベントリ**   | 視覚化と管理                      | 視覚化と管理          | -                            | 視覚化とダウンロード |
| **API 仕様**   | 視覚化と管理                      | 視覚化          | 視覚化                        | 視覚化 |
| **スキャナー**         | 視覚化と管理                      | 視覚化と管理                 | 視覚化                       | - |
| **トリガー**        | 視覚化と管理                      | -                        | -                            | - |
| **IPリスト**       | 視覚化、管理、エクスポート            | 視覚化、管理、エクスポート | 視覚化とエクスポート              | - |
| **ルール**           | 視覚化と管理                      | 視覚化と管理          | 視覚化                        | - |
| **BOLA 保護**           | 視覚化と管理                      | 視覚化          | - | - |
| **統合**    | 視覚化と管理                      | -                        | -                            | - |
| **フィルタリングモード**        | 視覚化と管理                      | 視覚化                     | 視覚化                         | - |
| **アプリケーション**    | 視覚化と管理                      | 視覚化                     | 視覚化                         | - |
| **ユーザー**           | 視覚化と管理                      | -                        | 視覚化                         | - |
| **活動ログ**    | 視覚化                                 | -                        | 視覚化                         | - |

## ユーザーの観覧

以下のタブでユーザーリストを視覚化できます：
*   会社のすべてのユーザーがWallarmクラウドに登録されているメインの*ユーザー*タブ。このタブでは、無効化されたユーザーはグレーでハイライト表示されます。

    ![User list][img-configure-user]

*   *無効化*タブは無効化されたユーザーだけを含みます。

    ![Disabled users list][img-disabled-users]

表のヘッダーのセルをクリックして、名前、役割、メール、及び最終ログイン日時でユーザーをソートできます。

また、ユーザーネームの左側のチェックボックスをチェックして一つまたは複数のユーザーを選択することもできます。その結果、ユーザーグループに操作を行うことができます。 

## ユーザーの検索

表の上部にある検索フィールドを使用して、名前、メール、またはシステムロールでユーザーを検索できます。

![Searching a user][img-search-user]

## ユーザーの作成

1.  *設定*セクションの*ユーザー*タブで、*ユーザーを追加*ボタンをクリックします。
2.  ドロップダウンリストからユーザーロールを選択します。
3.  ユーザーの名前、姓、メールを入力します。

    ![New user form][img-add-user]

4.  *ユーザーを追加*ボタンをクリックします。

    新しいユーザーは自動的にパスワードを設定してログインするためのリンクが含まれたメールを受け取ります。

新しく追加されたユーザーに関する通知を受け取るためには、適切な[トリガー](../triggers/triggers.md)を設定できます。通知はメッセンジャーやSOARシステム（例：Slack、Microsoft Teams、OpsGenie）に送信されます。

## ユーザー情報の変更

ユーザーのデータを変更するために、次のアクションを実行します：
1.  *設定*セクションの*ユーザー*タブで、編集するユーザーを選択します。
2.  対応ユーザーの右のボタンをクリックしてユーザーアクションメニューを開きます。

    ![User actions menu][img-user-menu]

3.  *ユーザー設定を編集*をクリックします。
4.  出現したフォームに新しいユーザー情報を入力し、*保存*ボタンをクリックします。

    ![User info editing form][img-edit-user]

旧ユーザー情報は新しいものに置き換えられます。

## 二段階認証設定のリセット

二段階認証の設定をリセットするために、次のアクションを実行します：
1.  *設定*セクションの*ユーザー*タブで、希望するユーザーを選択します。
2.  対応するユーザーの右のボタンをクリックしてユーザーアクションメニューを開きます。

    ![User actions menu][img-user-menu-disable-2fa]

3.  *2FAを無効化*をクリックします。
4.  出現したフォームにWallarm管理者アカウントのパスワードを入力し、*2FAを無効化*ボタンをクリックします。

    ![Disabling 2-factor authentication][img-user-disable-2fa]

選択したユーザーに対する二段階認証機能が無効化されます。ユーザーは[プロフィール設定](account.md#enabling-two-factor-authentication)で二段階認証を再度有効化することができます。

## ユーザーへのアクセスを無効化する

ユーザーへのアクセスを無効化すると、そのユーザーのWallarmアカウントが無効化されます。

特定のユーザーのWallarmアカウントを無効化するには、次のアクションを実行します：
1.  *設定*セクションの*ユーザー*タブで、希望するユーザーを選択します。
2.  対応するユーザーの右のボタンをクリックしてユーザーアクションメニューを開きます。

    ![User actions menu][img-user-menu]

3.  *アクセスを無効化*をクリックします。

これで、選択したユーザーはWallarmアカウントを利用できなくなります。

複数のユーザーアカウントへのアクセスを無効化する必要がある場合は、無効化が必要なユーザーを選択します。アクションパネルが表示されます。このパネル上の*アクセスを無効化*ボタンをクリックします。

![Disabling several users' accounts][img-disable-delete-multi]

## ユーザーへのアクセスを有効化する

ユーザーへのアクセスを有効化すると、そのユーザーのWallarmアカウントが有効化されます。

特定のユーザーのWallarmアカウントを有効化するには、次のアクションを実行します：
1.  *設定*セクションの*ユーザー*タブで、アクセスが無効されている希望するユーザーを選択します。
2.  対応するユーザーの右のボタンをクリックしてユーザーアクションメニューを開きます。

    ![Disabled user actions menu][img-disabled-user-menu]

3.  *アクセスを有効化*をクリックします。

これで、選択したユーザーはWallarmアカウントを利用することができます。

複数のユーザーアカウントへのアクセスを有効化する必要がある場合は、アクセスを許可する必要のあるユーザーを選択します。アクションパネルが表示されます。このパネル上の*アクセスを有効化*ボタンをクリックします。

![Enabling several users' accounts][img-enable-delete-multi]

## ユーザーの削除

特定のユーザーアカウントを削除するには、次のアクションを実行します：
1.  *設定*セクションの*ユーザー*タブで、削除するユーザーを選択します。
2.  対応するユーザーの右のボタンをクリックしてユーザーアクションメニューを開きます。

    ![User actions menu][img-user-menu]

3.  *削除*をクリックします。

複数のユーザーアカウントを削除する必要がある場合は、削除が必要なユーザーを選択します。アクションパネルが表示されます。このパネル上の*削除*ボタンをクリックします。

![Deleting several users' accounts][img-disable-delete-multi]