# ステップ 4: Okta 側で Wallarm アプリへのアクセスを許可する

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md 

Okta を介した認証を行うには、Okta 側でアカウントを作成し、ユーザーが Wallarm アプリケーションへのアクセス権を持っている必要があります。アクセス権を付与するための必要な一連の操作は以下のとおりです。

Oktaポータルの右上にある *Admin* ボタンをクリックします。*Dashboard* セクションで、*Assign Applications* リンクをクリックします。

![!Okta dashboard][img-dashboard]

これにより、選択したアプリケーションにアクセスできるように、適切なユーザーにアプリケーションを割り当てるよう求められます。これを行うには、必要なアプリケーションとユーザーの横にあるチェックボックスにチェックを入れて *Next* をクリックします。

![!Assigning users to the application][img-assignments]

次に、アプリケーションの割り当てを確認し、確認するよう求められます。すべて正しければ、*Confirm Assignments* ボタンをクリックして割り当てを確認します。

その後、*Assignments* タブのアプリケーション設定ページに移動できます。ここでは、SSO が設定されているアプリケーションにアクセスできるユーザーのリストを確認できます。

![!User list for the Wallarm application][img-user-list]

Wallarmアプリケーションへのアクセス権が設定されました。これで、アプリケーションに割り当てられたユーザーは、Okta サービスを介した SSO 認証を使用してアプリケーションにアクセスできます。

## 設定完了

これで Okta ベースの SSO の設定が完了し、Wallarm 側で [ユーザー固有の][doc-use-user-auth] SSO 認証の設定を開始できます。