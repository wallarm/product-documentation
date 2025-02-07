# ユーザー向けSSO認証の設定

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users 
[anchor-disable]:           #disabling-sso-authentication-for-users      

ユーザー向けWallarmポータルのSSO認証は、[有効にする][anchor-enable]または[無効にする][anchor-disable]ことができます。

## ユーザー向けSSO認証の有効化

!!! warning
    *   ユーザー向けSSO認証を有効にすると、login/passwordログイン機構および二要素認証が使用できなくなります。SSO認証が有効な場合、ユーザーのパスワードは削除され、二要素認証は無効になります。
    *   既に[Okta][doc-allow-access-okta]または[G Suite][doc-allow-access-gsuite]側で構成されたWallarmアプリケーションへのアクセス権を目的のユーザーグループに付与済みであるものとします。

Wallarmユーザー向けにSSO認証を有効にするには:

1. **Settings** → **Users** に移動してください。
1. ユーザーメニューから **Enable SSO login** を選択してください。

![Enabling SSO for Wallarm user][img-enable-sso-for-user]

ポップアップウィンドウが表示され、ユーザーにSSO認証が有効になった旨を通知するかどうかを確認します。**Send notification**ボタンをクリックしてください。通知が不要な場合は**Cancel**をクリックしてください。

その後、ユーザーはアイデンティティプロバイダーを通じて[認証を行えます][doc-user-sso-guide].

なお、[厳格SSOモード](#strict-sso-mode)を使用すると、企業アカウントのすべてのユーザーに対してSSOを有効にすることもできます。

## ユーザー向けSSO認証の無効化

Wallarmユーザー向けにSSO認証を無効にするには:

1. **Settings** → **Users** に移動してください。
1. ユーザーメニューから **Disable SSO** を選択してください。

![Disabling SSO for Wallarm user][img-disable-sso-for-user]

その後、ユーザーにはSSOを使用したログインが無効になった旨のメールが通知され、パスワードを復元してlogin/passwordペアでログインするための提案（リンク）が表示されます。さらに、二要素認証が再び利用可能となります。

## SSOとAPI認証

ユーザー向けにSSOが有効な場合、そのユーザーに対して[Wallarm APIへのリクエスト](../../../api/overview.md#your-own-api-client)の認証が使用できなくなります。API認証情報を取得するには、次の2つのオプションがあります: 

* **厳格SSOモード**が使用されていない場合、企業アカウントの下でSSOオプションを使用しないユーザーを作成し、[APIトークン(s)](../../../api/overview.md#your-own-api-client)を作成してください。
* **厳格SSOモード**が使用されている場合、**Administrator**ロールのSSOユーザーに対してAPI認証を有効にできます。これを行うには、該当ユーザーメニューから **Enable API access** を選択してください。これにより、`SSO+API`認証方式が有効になり、APIトークンの作成が可能となります。

後で、**Disable API access** を選択することで当該ユーザーに対するAPI認証を無効にできます。これを行うと、すべての既存のAPIトークンが削除され、1週間後に完全に削除されます。

## 厳格SSOモード

Wallarmは、通常のSSOと異なり企業アカウントのすべてのユーザーに対して一括でSSO認証を有効にする**厳格SSOモード**をサポートしています。厳格SSOモードのその他の特徴は以下のとおりです:

* 既存のすべてのアカウントユーザーの認証方式がSSOに切り替わります。
* 新規のすべてのユーザーはデフォルトでSSOを認証方式として使用します。
* どのユーザーに対しても認証方式をSSO以外に切り替えることはできません。

厳格SSOモードの有効化または無効化については、[Wallarmサポートチーム](mailto:support@wallarm.com)にご連絡ください。

!!! info "厳格SSO有効化時のアクティブセッションの取り扱い"
    企業アカウントが厳格SSOモードに切り替えられた時点でサインイン中のユーザーがいる場合、そのセッションは引き続き有効です。サインアウト後、ユーザーにはSSOの使用が求められます.

## SSO認証のトラブルシューティング

ユーザーがSSO経由でサインインできない場合、以下の表に記載のエラーコードのいずれかと共にエラーメッセージが表示されます。ほとんどのケースでは、企業アカウントの管理者がこれらのエラーを修正できます:

| エラーコード | 説明 | 修正方法 |
|--|--|--|
| `saml_auth_not_found + userid` | ユーザーはSSOが有効になっていません。 | 上記の[ユーザー向けSSO認証の有効化](#enabling-sso-authentication-for-users)に記載の手順でSSOを有効にしてください。 |
| `saml_auth_not_found + clientid` | クライアントは**Integrations**セクションにSSO統合が存在しません。 | [SAML SSOとの統合](intro.md)のドキュメントの指示に従って、Wallarm Consoleの**Integrations**セクションでSSO統合を構成してください。 |
| `invalid_saml_response` または `no_mail_in_saml_response` | SSOプロバイダーから予期しないレスポンスが返されました。これはSSO統合の設定ミスの兆候である可能性があります。 | 次のいずれかを実施してください:<br><ul><li>Wallarm Consoleの**Integrations**セクションで構成されたSSO統合に誤りがないことを確認してください。</li><li>SSOプロバイダー側の設定に誤りがないことを確認してください。</li></ul> |
| `user_not_found` | Wallarmは指定されたメールアドレスのユーザーを見つけられませんでした。 | このメールアドレスのユーザーをWallarm Consoleで作成してください。 |
| `client_not_found` | 企業アカウントがWallarmに見つかりませんでした。 | 適切なメールドメインを持つユーザーアカウントを作成すると、企業アカウントが直ちに作成されます。 |

必要に応じて、管理者はこれらのエラーの修正について[Wallarmサポートチーム](mailto:support@wallarm.com)に問い合わせることができます。