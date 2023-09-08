[img-basic-auth]:       ../images/user-guides/sso/basic-auth.png
[img-sso-login-form]:   ../images/user-guides/sso/sso-login-form.png       
[img-idp-auth-pages]:   ../images/user-guides/sso/idp-auth-pages.png    
[img-wl-dashboard]:     ../images/user-guides/dashboard/dashboard.png

[link-gsuite]:      https://gsuite.google.com/
[link-okta]:        https://www.okta.com/


#   Wallarmポータルへのシングルサインオンの使用

このガイドでは、シングルサインオン（SSO）技術を使用したWallarmポータルへのユーザー認証のプロセスをカバーしています。

!!! info "前提条件"
    SSO認証が有効になっており、アカウントの役割が*Admin*でない場合、現在はSSO認証のみを使用してWallarmポータルにログインできます。
    
    このガイドは、[Okta][link-okta]や[G Suite][link-gsuite]などのアイデンティティプロバイダーのアカウントをすでに持っていることを前提としています。このような事例がない場合は、あなたの管理者に連絡してください。

SSOを使用した認証のためには、Wallarmのログインページに移動します。

あなたが`<あるドメイン>.wallarm.com`（例：`my.wallarm.com`）のようなアドレスを使用してWallarmにログインする場合は、SSOでログインするために*SAML SSOでログインする*リンクをクリックする必要があります（ログイン/パスワードペアは優先されます）。

![“ログイン/パスワードペア”ログインページ][img-basic-auth]

あなたが`<会社のドメイン>.wallarm.io`（あなたのアカウントが属する会社に割り当てられたドメイン）のようなアドレスを使用してWallarmにログインする場合は、優先的なログイン方法はSSOログインで、ログインフォームは上記とは異なります。

![SSOログインフォーム][img-sso-login-form]

WallarmにSSOを使用してログインするためには、メールアドレスを入力する必要があります。

入力されたメールが登録されており、それに対してSSO認証が設定されている場合、あなたはOktaやG Suiteなどのアイデンティティプロバイダー（IdP）サービスにリダイレクトされます。また、このプロバイダーによっても認証が行われていない場合、あなたはログインページにリダイレクトされます。下に、OktaとG Suiteサービスのログインページを示します。

![OktaとG Suiteのログインページ][img-idp-auth-pages]

あなたのメールアドレスとパスワード（二段階認証オプション有り）を入力します。アイデンティティプロバイダーによる認証が成功し、要求されたリソース（Wallarm）へのアクセス権を確認した後、プロバイダーはあなたをWallarmポータルにリダイレクトします。同時に、プロバイダーは有効なユーザーであること、ならびに他の必要なパラメータを確認するためのリクエストをWallarm側に送信します。このようにして、あなたはWallarmポータルにログインし、ダッシュボードページが開かれます。

![Wallarmポータルのダッシュボード][img-wl-dashboard]

これにより、SSO認証プロセスが終了します。