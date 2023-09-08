# ステップ 4 : Okta側でWallarmアプリケーションへのアクセスを許可する

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md 

Oktaを通じて認証を行うには、Okta側でアカウントを作成し、ユーザーにはWallarmアプリケーションへのアクセス権が必要です。アクセス権を付与するための必要な手順は以下に説明されています。

Oktaポータルの右上にある*Admin* ボタンをクリックします。 *Dashboard* セクションで、*Assign Applications* のリンクをクリックします。

![Okta dashboard][img-dashboard]

選択したアプリケーションにアクセスできるように、適切なユーザーにアプリケーションを割り当てるように求められます。これを行うには、必要なアプリケーションとユーザーの横にあるチェックボックスにチェックを入れて*Next* をクリックします。

![Assigning users to the application][img-assignments]

次に、アプリケーションの割り当てを確認し、確認するように求められます。すべて正しい場合は、*Confirm Assignments* ボタンをクリックして割り当てを確認します。

その後、*Assignments* タブのアプリケーション設定ページに移動できます。ここでは、SSOが設定されているアプリケーションにアクセスできるユーザーのリストを見ることができます。

![User list for the Wallarm application][img-user-list]

Wallarmアプリケーションへのアクセス権が設定されました。これで、アプリケーションに割り当てられたユーザーは、Oktaサービスを介したSSO認証を使用してアプリケーションにアクセスできます。


##  設定完了

OktaベースのSSOの設定が完了しました。これで、Wallarm側で[ユーザー固有の][doc-use-user-auth]SSO認証の設定を開始できます。