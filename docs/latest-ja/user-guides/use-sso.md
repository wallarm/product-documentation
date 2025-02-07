[img-basic-auth]:       ../images/user-guides/sso/basic-auth.png
[img-sso-login-form]:   ../images/user-guides/sso/sso-login-form.png       
[img-idp-auth-pages]:   ../images/user-guides/sso/idp-auth-pages.png    
[img-wl-dashboard]:     ../images/user-guides/dashboard/dashboard.png

[link-gsuite]:      https://gsuite.google.com/
[link-okta]:        https://www.okta.com/

# Wallarmポータルへのシングルサインオンの使用

本ガイドでは、Single Sign‑On (SSO)技術を使用したWallarmポータルにおけるユーザー認証の手順について説明します.

!!! info "前提条件"
    SSO認証が有効になっており、アカウントのロールが*Admin*でない場合、Wallarmポータルにログインする際はSSO認証のみが使用可能です.
    
    本ガイドでは、[Okta][link-okta]や[G Suite][link-gsuite]などのIDプロバイダのいずれかに既にアカウントをお持ちであることを前提としています.該当しない場合は、管理者にお問い合わせください.

SSO認証を使用してログインするには、Wallarmログインページにアクセスしてください.

もし`<some_domain>.wallarm.com`（例：`my.wallarm.com`）のようなアドレスを使用してWallarmにログインする場合、SSOでログインするために*Sign in with SAML SSO*リンクをクリックする必要があります（ログイン/パスワードの組み合わせが優先されます）.

![ログイン/パスワードの組み合わせによるログインページ][img-basic-auth]

もし、Wallarmにログインする際に、アカウントが所属する企業に割り当てられたドメインである`<company_domain>.wallarm.io`のようなアドレスを使用する場合、ログインの優先方式はSSOログインとなり、ログインフォームは前述のものとは異なります.

![SSOログインフォーム][img-sso-login-form]

SSOを使用してWallarmにログインするには、メールアドレスを入力する必要があります.

入力されたメールアドレスが登録されており、SSO認証の設定がされている場合、OktaやG SuiteなどのIDプロバイダ(IdP)サービスへリダイレクトされます.これらのプロバイダで認証されない場合、ログインページへリダイレクトされます.以下に、OktaとG Suiteサービスのログインページを示します.

![OktaとG Suiteのログインページ][img-idp-auth-pages]

メールアドレスとパスワードを入力してください（二段階認証のオプションがあります）.

IDプロバイダによる認証と、要求されたリソース(Wallarm)へのアクセス権の確認が正常に完了すると、プロバイダはWallarmポータルへリダイレクトされます.同時に、プロバイダはWallarm側へあなたが正当なユーザーであることを確認するリクエストおよびその他の必要なパラメータを送信します.この手順により、Wallarmポータルにログインし、ダッシュボードページが表示されます.

![Wallarmポータルのダッシュボード][img-wl-dashboard]

これでSSO認証プロセスは完了です.