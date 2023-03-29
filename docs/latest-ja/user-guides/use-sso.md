[img-basic-auth]:       ../images/user-guides/sso/basic-auth.png
[img-sso-login-form]:   ../images/user-guides/sso/sso-login-form.png       
[img-idp-auth-pages]:   ../images/user-guides/sso/idp-auth-pages.png    
[img-wl-dashboard]:     ../images/user-guides/dashboard/dashboard.png

[link-gsuite]:      https://gsuite.google.com/
[link-okta]:        https://www.okta.com/

#   Wallarmポータルへのシングルサインオンの使用

このガイドでは、シングルサインオン（SSO）技術を使用してWallarmポータルでのユーザー認証プロセスについて説明します。

!!! info "前提条件"
    SSO認証が有効になっており、アカウントのロールが*Admin*でない場合、WallarmポータルにログインするためにはSSO認証のみを使用できます。
    
    このガイドでは、[Okta][link-okta]や[G Suite][link-gsuite]などのidentity providerのアカウントが既にあることを前提としています。このようなアカウントがない場合、管理者に連絡してください。

SSOを使って認証するには、Wallarmのログインページにアクセスします。

`<some_domain>.wallarm.com`（例：`my.wallarm.com`）のようなアドレスを使用してWallarmにログインする場合、*SAML SSOでサインイン*リンクをクリックしてSSOでログインする必要があります（ログイン/パスワードのペアが優先されます）。

![!The “login/password” pair login page][img-basic-auth]

`_company_domain_.wallarm.io`（あなたのアカウントが所属する企業に割り当てられたドメイン）のようなアドレスを使用してWallarmにログインする場合、優先されるログイン方法はSSOログインであり、ログインフォームは上記とは異なります。

![!SSO login form][img-sso-login-form]

WallarmにSSOでログインするには、メールアドレスを入力する必要があります。

入力されたメールアドレスが登録されており、それに対してSSO認証が設定されている場合、IdP（Identity Provider）サービス（例：OktaやG Suite）にリダイレクトされます。このプロバイダーによっても認証されていない場合、ログインページにリダイレクトされます。OktaおよびGスイートサービスのログインページは以下に示されています。

![!Okta and G Suite login pages][img-idp-auth-pages]

メールアドレスとパスワードを入力してください（二要素認証の追加オプション）。identity providerによる認証が成功し、要求されたリソース（Wallarm）へのアクセス権が確認されると、プロバイダーはあなたをWallarmポータルにリダイレクトします。同時に、プロバイダーは、あなたが正当なユーザーであることを確認するリクエストや、他の必要なパラメータをWallarm側に送信します。このようにして、Wallarmポータルにログインし、ダッシュボードページが開かれます。

![!Wallarm portal's Dashboard][img-wl-dashboard]

これでSSO認証プロセスが完了します。