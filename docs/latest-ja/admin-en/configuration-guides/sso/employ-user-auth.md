#   ユーザーのためのSSO認証設定

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users 
[anchor-disable]:           #disabling-sso-authentication-for-users      

Wallarmポータルのユーザーに対して、SSO認証を[有効化][anchor-enable]あるいは[無効化][anchor-disable]することができます。

##   ユーザーのためのSSO認証を有効にする

!!! warning
    *   ユーザーのためのSSO認証を有効にすると、ログイン/パスワードによるログイン方法や二要素認証が利用できなくなります。SSO認証が有効になると、ユーザーのパスワードが消去され、二要素認証が無効になります。
    *   [Okta][doc-allow-access-okta]や[G Suite][doc-allow-access-gsuite]側にて設定したWallarmアプリケーションへのアクセスを、必要なユーザーグループに既に許可していることが前提となります。

WallarmユーザーのためのSSO認証を有効にするには：

1. **設定** → **ユーザー**へ移動します。
1. ユーザーメニューから、**SSOログインを有効化**を選択します。

![WallarmユーザーのためのSSOを有効にする][img-enable-sso-for-user]

ポップアップウィンドウでは、ユーザーにSSO認証が有効になった旨の通知を送るよう求められます。必要であれば**通知を送る**ボタンをクリックします。通知が不要であれば、**キャンセル**をクリックします。

その後、ユーザーはIDプロバイダを通じて[認証する][doc-user-sso-guide]ことができます。

[Strict SSO](#strict-sso-mode)モードを使用して、全ての企業アカウントユーザーに対してSSOを有効にすることも可能です。

##  ユーザーのためのSSO認証を無効にする

WallarmユーザーのためのSSO認証を無効にするには：

1. **設定** → **ユーザー**へ移動します。
1. ユーザーメニューから、**SSOを無効化**を選択します。

![WallarmユーザーのためのSSOを無効にする][img-disable-sso-for-user]

その後、ユーザーにはメールでSSOを使用したログインが無効化された旨が通知され、ログイン/パスワード組み合わせでのログインに復旧するためのリンクが案内されます。また、ユーザーは二要素認証を利用できるようになります。

## SSOとAPI認証

ユーザーに対してSSOが有効化されると、そのユーザーは[Wallarm APIへのリクエスト](../../../api/overview.md#your-own-client)での認証が利用できなくなります。APIの認証情報を取得するためには、次の2つの選択肢があります：

 * **strict SSO**モードが利用されていない場合、企業アカウント下にSSOのオプション無しでユーザーを作成し、[APIトークン](../../../api/overview.md#your-own-client)を生成してください。
 * **strict SSO**モードが利用されている場合、**管理者**ロールのSSOユーザーに対してAPI認証を有効にすることができます。これには、ユーザーメニューから**APIアクセスを有効にする**を選択します。`SSO+API`認証方法がユーザーに対して有効になり、APIトークンの生成が可能になります。

    その後、ユーザーメニューから**APIアクセスを無効にする**を選択し、API認証を無効にすることもできます。これを行うと、既に存在するすべてのAPIトークンが削除され、1週間後には全て削除されます。

## Strict SSOモード

Wallarmは**Strict SSO**モードをサポートしており、これは通常のSSOとは異なり、全ての企業アカウントユーザーに対して一度にSSO認証を有効にします。Strict SSOモードの特徴は以下の通りです：

* アカウントの既存ユーザー全員の認証方法がSSOに切り替えられます。
* 新たに作成される全てのユーザーデフォルトの認証方法としてSSOが割り当てられます。
* どのユーザーに対しても認証方法をSSO以外に切り替えることはできません。

Strict SSOモードを有効化あるいは無効化するには、[Wallarmサポートチーム](mailto:support@wallarm.com)に問い合わせてください。

!!! info "strict SSOを有効にする際のアクティブセッションの扱い"
    Strict SSOモードに切り替える際に企業アカウントにサインインしているユーザーがいる場合、これらのセッションはアクティブなままドラドラします。サインアウト後、ユーザーはSSOを使用するように求められます。

## SSO認証のトラブルシューティング

ユーザーがSSOを通じてサインインできない場合、エラーメッセージが表示され、それには下表に説明されている各エラーコードのいずれかが表示されます。ほとんどの場合、企業アカウントの管理者がこれらのエラーを修復することができます：

| エラーコード | 説明 | 修正方法 |
|--|--|--|
| `saml_auth_not_found + userid` | SSOがユーザーに対して有効化されていません。 |  上記のセクションで説明したように、SSOを有効にします。 |
| `saml_auth_not_found + clientid` | クライアントは**インテグレーション**セクションにSSO連携を持っていません。 | [SAML SSOとの連携](intro.md)のドキュメント内説明に従って操作してください。 |
| `invalid_saml_response` または `no_mail_in_saml_response` | SSOプロバイダから予期しない応答がありました。SSO連携の設定に誤りがある可能性があります。 | 下記のいずれかを行ってください：<br><ul><li>Wallarmコンソールの**インテグレーション**セクションで設定されたSSO連携に誤りがないことを確認します。</li><li>SSOプロバイダーサイドでの設定に誤りがないことを確認します。</li></ul> |
| `user_not_found` | Wallarmは指定されたメールアドレスのユーザーを見つけることができませんでした。 | このメールアドレスのユーザーをWallarm Consoleにて作成します。 |
| `client_not_found` | Wallarmは企業アカウントを見つけることができませんでした。 | 適切なメールドメインを持つユーザーアカウントを作成します。これにより、企業アカウントが同時に作成されます。 |

 必要に応じて、管理者はこれらのエラーの修正を手伝ってもらうために、[Wallarmサポートチーム](mailto:support@wallarm.com)に問い合わせることができます。
