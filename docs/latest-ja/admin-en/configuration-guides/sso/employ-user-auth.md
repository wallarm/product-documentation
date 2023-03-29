#   ユーザーのSSO認証の設定

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users
[anchor-disable]:           #disabling-sso-authentication-for-users

Wallarmポータルユーザーに対してSSO認証を[有効化][anchor-enable]または[無効化][anchor-disable]することができます。

##   ユーザーのSSO認証を有効にする

!!! warning
    *   ユーザーのSSO認証を有効にすると、ログイン/パスワードでのログインの仕組みと二要素認証は利用できません。SSO認証が有効になると、ユーザーのパスワードは削除され、二要素認証が無効になります。
    *   あなたはすでに設定されたWallarmアプリケーションに対して必要なユーザーグループのアクセスが[Okta][doc-allow-access-okta]か[G Suite][doc-allow-access-gsuite]のいずれかの側で与えられていることが想定されています。

WallarmユーザーのSSO認証を有効にするには：

1. **Settings** → **Users**に移動します。
1. ユーザーメニューから**Enable SSO login**を選択します。

![!WallarmユーザーのSSOを有効にする][img-enable-sso-for-user]

ポップアップウィンドウで、SSO認証が有効になったことをユーザーに通知するよう求められます。「通知を送信」ボタンをクリックします。通知が不要な場合は、「キャンセル」をクリックします。

その後、ユーザーはアイデンティティプロバイダーを通じて[認証できます][doc-user-sso-guide]。

[Strict SSOモード](#strict-sso-mode)を使用して、すべての企業アカウントユーザーのSSOも同時に有効にすることができます。

##  ユーザーのSSO認証を無効にする

WallarmユーザーのSSO認証を無効にするには：

1. **Settings** → **Users**に移動します。
1. ユーザーメニューから**Disable SSO**を選択します。

![!WallarmユーザーのSSOを無効にする][img-disable-sso-for-user]

その後、ユーザーはSSOを使ったログインが無効になったことを通知されたメールが送信され、ログイン/パスワードペアでログインするためのパスワードを復元するためのリンクが提供されます。また、二要素認証がユーザーに利用できるようになります。

## SSOとAPI認証

ユーザーにSSOが有効になっている場合、[Wallarm APIへのリクエストの認証](../../../api/overview.md#your-own-client)は、このユーザーには利用できません。API認証を動作する資格情報を入手するためには以下の2つの方法があります： 

* **strict SSO**モードが使用されていない場合は、企業アカウント内でSSOオプションが無いユーザーを作成し、このユーザーの[API認証情報](../../../api/overview.md#your-own-client)を使用します。
* **strict SSO**モードが使用されている場合は、**Administrator**ロールを持つSSOユーザーのAPI認証を有効にできます。これを行うには、ユーザーメニューから**Enable API access**を選択します。ユーザーに`SSO+API`認証方法が有効になります。

    後でユーザーのAPI認証を無効にする場合は、**Disable API access**を選択します。

## Strict SSOモード

Wallarmは**strict SSO**モードをサポートしており、これは一度にすべての企業アカウントユーザーのSSO認証を有効にする点で、通常のSSOと異なります。strict SSOモードの他の特徴は以下の通りです：

* すべての既存ユーザーの認証方法がSSOに切り替わります。
* すべての新規ユーザーがデフォルトでSSO認証方法を取得します。
* どのユーザーでも認証方法をSSO以外に切り替えることはできません。
* **Administrator**役割のユーザーに[APIアクセス](#sso-and-api-authentication)を追加することができます（`SSO+API`ユーザー認証モード）。

strict SSOモードを有効化または無効化するには、[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡してください。

!!! info "strict SSOを有効にした場合のアクティブなセッションの扱い"
    strict SSOモードに切り替えられた会社アカウントにログインしているユーザーがいる場合、これらのセッションはアクティブなままです。ログアウト後、ユーザーはSSOを使用するよう求められます。

## SSO認証のトラブルシューティング

SSO経由でログインできない場合、エラーメッセージが表示され、以下の表に記載されているエラーコードのいずれかが表示されます。ほとんどの場合、会社アカウントの管理者がこれらのエラーを修正できます：

| エラーコード | 説明 | 修正方法 |
|--|--|--|
| `saml_auth_not_found + userid` | ユーザーにはSSOが有効になっていません。 | [上記](#enabling-sso-authentication-for-users)のセクションで説明されているように、SSOを有効化します。 |
| `saml_auth_not_found + clientid` | **Integrations**セクションでクライアントにSSOインテグレーションがありません。 | [SAML SSOとの統合](intro.md)ドキュメントの手順に従ってください。 |
| `invalid_saml_response`または`no_mail_in_saml_response` | SSOプロバイダーから予期しない応答がありました。 SSO統合の設定が間違っている可能性があります。| 以下のいずれかを行ってください：<br><ul><li>Wallarm Consoleの**Integrations**セクションに設定されているSSO統合に誤りがないことを確認します。</li><li>SSOプロバイダー側の設定に誤りがないことを確認します。</li></ul> |
| `user_not_found` | Wallarmは指定されたメールアドレスのユーザーを見つけることができませんでした。 | Wallarm Consoleでこのメールアドレスのユーザーを作成します。 |
| `client_not_found` | Wallarmでは企業アカウントが見つかりませんでした。 | 適切なメールドメインを持つユーザーアカウントを作成し、すぐに企業アカウントが作成されるようにします。 |

 必要に応じて、管理者は[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡して、いずれかのエラーの修正を助けてもらうことができます。