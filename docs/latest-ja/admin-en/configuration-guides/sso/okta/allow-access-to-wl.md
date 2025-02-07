# ステップ4: Okta側でWallarmアプリケーションへのアクセスの許可

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md 

Oktaで認証するためには、Okta側でアカウントが作成され、ユーザーにWallarmアプリケーションへのアクセス権が与えられている必要があります。以下にアクセス権の付与に必要な操作手順を説明します。

Oktaポータルの右上にある*Admin*ボタンをクリックします。*Dashboard*セクションで*Assign Applications*リンクをクリックします。

![Okta dashboard][img-dashboard]

選択されたアプリケーションへのアクセス権をユーザーに付与するため、適切なユーザーにアプリケーションを割り当てるよう促されます。必要なアプリケーションおよびユーザーの横にあるチェックボックスにチェックを入れ、*Next*をクリックします。

![Assigning users to the application][img-assignments]

次に、アプリケーションの割り当て内容を確認するよう求められます。すべて問題なければ、*Confirm Assignments*ボタンをクリックして割り当て内容を確定します。

その後、*Assignments*タブのアプリケーション設定ページに移動できます。ここではSSOが設定されているアプリケーションにアクセスできるユーザーの一覧が表示されます。

![User list for the Wallarm application][img-user-list]

Wallarmアプリケーションへのアクセス権はこれで設定完了です。これ以降、アプリケーションに割り当てられたユーザーはOktaサービスを通じたSSO認証を使用してアプリケーションにアクセスできます。

## セットアップ完了

これでOktaベースのSSOの構成は完了です。次にWallarm側で[user specific][doc-use-user-auth]SSO認証の設定を開始できます。