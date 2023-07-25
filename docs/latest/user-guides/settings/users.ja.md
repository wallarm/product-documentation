					[link-audit-log]:               audit-log.ja.md

[link-glossary-incident]:       ../../glossary-en.ja.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.ja.md#vulnerability

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

*設定* にある *ユーザー* タブでユーザーアカウントを管理できます。

!!! warning "管理者アクセス"
    この設定にアクセスできるのは、**管理者** ロールのユーザーのみです。

## ユーザーロール

Wallarm クライアントのユーザーには、次のロールがあります。

* **管理者** は、すべての Wallarm セッティングにアクセスできます
* **アナリスト**は、主要な Wallarm 設定の表示と攻撃、[インシデント][link-glossary-incident] および[脆弱性][link-glossary-vulnerability]に関する情報の管理ができます。
* **読み取り専用** は、主要な Wallarm 設定を表示できます。
* **API開発者**は、[APIディスカバリー](../../about-wallarm/api-discovery.ja.md) モジュールで発見されたAPIの目録を表示およびダウンロードできるロールです。このロールでは、Wallarmでの作業がAPIデータの取得に限定されているユーザーを区別することができます。これらのユーザーは、** APIディスカバリー **および**設定 → プロフィール** 以外のWallarmコンソールセクションにアクセスできません。
* **デプロイ** は `addnode` スクリプトを使って Wallarm のフィルタリングノードを作成し、Wallarm コンソールにアクセスできません

    !!! warning "Wallarmノード 4.0インストールする際のデプロイロールの利用"
        **デプロイ** ユーザーロールは、[バージョン 4.0のリリースで`addnode`スクリプトが廃止された](/4.0/updating-migrating/what-is-new/#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)ため、ノード3.6およびそれ以降のノードのインストールにのみ推奨されています。

[多重認証](../../installation/multi-tenant/overview.ja.md) 機能を使って、**グローバル管理者**、**グローバルアナリスト**、**グローバル読み取り専用** といったグローバルロールも使用できます。グローバルロールでは、技術テナントアカウントと関連するテナントアカウントにアクセスできますが、通常のロールでは技術テナントアカウントにのみアクセスできます。

個々のユーザーロールによる Wallarm エンティティへのアクセスの詳細情報は、下記の表に記載されています。エンティティ管理では、エンティティの作成、編集、削除がカバーされています。

| エンティティ | 管理者/グローバル管理者 | アナリスト/グローバルアナリスト | 読み取り専用/グローバル読み取り専用 | API開発者 |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **フィルタリングノード** | 表示および管理 | 表示 | 表示 | - |
| **ダッシュボード** | 表示 | 表示 | 表示 | - |
| **イベント** | 表示および管理 | 表示および管理 | 表示 | - |
| **脆弱性** | 表示および管理 | 表示および管理 | 表示 | - |
| **APIディスカバリーからのAPIインベントリを含む** | 表示および管理 | 表示および管理 | - | 表示およびダウンロード |
| **スキャナー** | 表示および管理 | 表示および管理   | 表示                                       | -                       |
| **トリガー**        | 表示および管理                          | -                        | -                            | -                         |
| **IPリスト**     | 表示、管理、およびエクスポート    | 表示、管理、およびエクスポート   | 表示およびエクスポート    | -                       |
| **ルール**         | 表示および管理                    | 表示および管理            | 表示                         | -                         |
| **BOLA保護**     | 表示および管理                   | 表示  | - | - |
| **インテグレーション** | 表示および管理                    | _                           |-                            | -                         |
| **フィルタリングモード**     | 表示および管理                   | 表示                   | 表示                           | -                       |
| **アプリケーション** | 表示および管理                   | 表示                   | 表示                           | -                       |
| **ユーザー**           | 表示および管理                   | -                          | 表示                           | -                       |
| **アクティビティログ** | 表示                               | -                          | 表示                           | -                       |

## ユーザーの表示

次のタブでユーザーのリストを表示できます。
*   メインとなる *ユーザー* タブには、Wallarm クラウドに登録されている企業のすべてのユーザーが表示されます。このタブの無効なユーザーは灰色に表示されます。

    ![!User list][img-configure-user]

*   *無効* タブには、無効なユーザーのみが表示されます。

    ![!Disabled users list][img-disabled-users]

テーブル ヘッダーのセルをクリックすることで、氏名、ロール、メール、および最後にログインした日からユーザーをソートできます。

また、ユーザー名の左のチェックボックスから一つまたは複数のユーザーを選択し、一連のユーザーに対して操作を行うことができます。

## ユーザーの検索

テーブルの上にある検索欄を使って、氏名、メール、またはシステムロールでユーザーを検索できます。

![!Searching a user][img-search-user]

## ユーザーの作成

1.  *設定* セクションの *ユーザー* タブで、*ユーザーを追加* ボタンをクリックします。
2.  ドロップダウンリストからユーザーロールを選択します。
3.  ユーザーの名前、姓、およびメールを入力します。

    ![!New user form][img-add-user]

4.  *ユーザーを追加* ボタンをクリックします。

新しいユーザーには、パスワードを設定してログインするためのリンクが記載された自動送信メールが届きます。

新しく追加されたユーザーについて通知を受け取るには、適切な[トリガー](../triggers/triggers.ja.md)を設定できます。通知は、メッセージャーやSOARシステム（Slack、Microsoft Teams、OpsGenie など）に送信されます。

## ユーザー情報の変更

ユーザーのデータを変更するには、以下の手順を実行します。
1.  *設定* セクションの *ユーザー* タブで、編集するユーザーを選択します。
2.  対応するユーザーの右側にあるボタンをクリックして、ユーザーアクションメニューを開きます。

    ![!User actions menu][img-user-menu]

3.  *ユーザー設定の編集* をクリックします。
4.  表示されるフォームに新しいユーザー情報を入力し、*保存* ボタンをクリックします。

    ![!User info editing form][img-edit-user]

古いユーザー情報が新しい情報に置き換えられます。

## 二要素認証設定のリセット

二要素認証設定をリセットするには、以下の手順を実行します。
1.  *設定* セクションの *ユーザー* タブで、対象のユーザーを選択します。
2.  対応するユーザーの右側にあるボタンをクリックして、ユーザーアクションメニューを開きます。

    ![!User actions menu][img-user-menu-disable-2fa]

3.  *2FAを無効にする* をクリックします。
4.  表示されるフォームに、Wallarmの管理者アカウントのパスワードを入力し、*2FAを無効にする* ボタンをクリックします。

    ![!Disabling 2-factor authentication][img-user-disable-2fa]

選択されたユーザーの2要素認証機能が無効になります。ユーザーは、[プロファイル設定](account.ja.md#enabling-two-factor-authentication)で2要素認証を再度有効に設定できます。## ユーザーのアクセスを無効にする

ユーザーのアクセスを無効にすると、そのユーザーのWallarmアカウントが無効になります。

特定のユーザーのWallarmアカウントを無効にするには、次の操作を行ってください：
1. ＊設定＊セクションの＊ユーザー＊タブで、対象のユーザーを選択します。
2. 対応するユーザーの右にあるボタンをクリックして、ユーザー操作メニューを開きます。

    ![!User actions menu][img-user-menu]

3. ＊アクセスを無効にする＊をクリックします。

これで、選択したユーザーは会社のWallarmアカウントを使用できなくなります。

複数のユーザーアカウントのアクセスを無効にする必要がある場合は、アクセスを取り消す必要があるユーザーを選択します。アクションパネルが表示されます。このパネル上の＊アクセスを無効にする＊ボタンをクリックしてください。

![!Disabling several users' accounts][img-disable-delete-multi]

## ユーザーのアクセスを有効にする

ユーザーのアクセスを有効にすると、そのユーザーのWallarmアカウントが有効になります。

特定のユーザーのWallarmアカウントを有効にするには、以下の操作を行ってください：
1. ＊設定＊セクションの＊ユーザー＊タブで、アクセスが無効になっている対象のユーザーを選択します。
2. 対応するユーザーの右にあるボタンをクリックして、ユーザー操作メニューを開きます。

    ![!Disabled user actions menu][img-disabled-user-menu]

3. ＊アクセスを有効にする＊をクリックします。

これで、選択したユーザーは会社のWallarmアカウントを使用できるようになります。

複数のユーザーアカウントのアクセスを有効にする必要がある場合は、アクセスを許可する必要があるユーザーを選択します。アクションパネルが表示されます。このパネル上の＊アクセスを有効にする＊ボタンをクリックしてください。

![!Enabling several users' accounts][img-enable-delete-multi]

## ユーザーの削除

特定のユーザーアカウントを削除するには、以下の操作を行ってください：
1. ＊設定＊セクションの＊ユーザー＊タブで、削除するユーザーを選択します。
2. 対応するユーザーの右にあるボタンをクリックして、ユーザー操作メニューを開きます。

    ![!User actions menu][img-user-menu]

3. ＊削除＊をクリックします。

複数のユーザーアカウントを削除する必要がある場合は、削除する必要があるユーザーを選択します。アクションパネルが表示されます。このパネル上の＊削除＊ボタンをクリックしてください。

![!Deleting several users' accounts][img-disable-delete-multi]