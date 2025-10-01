# SAML SSO認証のトラブルシューティング

本記事では、Wallarmの[SAML SSO認証](intro.md)のトラブルシューティング方法を説明します。

### SSOとAPI認証

ユーザーにSSOが有効な場合、このユーザーは[Wallarm APIへのリクエスト](../../../api/overview.md#your-own-api-client)に対する認証を利用できなくなります。有効なAPI認証情報を取得する方法は、使用しているSSOの[オプション](intro.md#available-options)によって異なります:

* provisioningがオンまたはオフで、strict SSOオプションを使用している場合、**Administrator**ロールのSSOユーザーに対してAPI認証を有効化できます。そのためには、このユーザーのメニューから**Enable API access**を選択します。これにより、このユーザーには`SSO+API`の認証方式が有効になり、APIトークンを作成できるようになります。

    後で、**Disable API access**を選択してこのユーザーのAPI認証を無効化できます。これを行うと、既存のAPIトークンはすべて削除され、1週間後に完全に削除されます。

* provisioningがオフでstrict SSOを使用していない場合は、会社アカウントでSSOオプションなしのユーザーを作成し、[APIトークン](../../../api/overview.md#your-own-api-client)を作成します。

### サインインできない場合

ユーザーがSSO経由でサインインできない場合、以下の表に記載のいずれかのエラーコードを含むエラーメッセージが表示されます。多くの場合、会社アカウントの管理者がこれらのエラーを解決できます:

| エラーコード | 説明 | 対処方法 |
|--|--|--|
| `saml_auth_not_found + userid` | provisioningはオフで、ユーザーにSSOが有効化されていません。 | Wallarm ConsoleでSSOを有効化します → **Settings** → **Users** → user menu → **Enable SSO**。 |
| `saml_auth_not_found + clientid` | クライアントには**Integrations**セクションにSSO統合がありません。 | ドキュメント「[SAML SSOとの統合](intro.md)」の手順に従います。 |
| `invalid_saml_response` または `no_mail_in_saml_response` | SSOプロバイダーが予期しないレスポンスを返しました。SSO統合の設定ミスを示している可能性があります。 | 次のいずれかを実行します:<br><ul><li>Wallarm Consoleの**Integrations**セクションで設定したSSO統合に誤りがないことを確認します。</li><li>SSOプロバイダー側の設定に誤りがないことを確認します。</li></ul> |
| `user_not_found` | Wallarmは指定されたメールアドレスのユーザーを見つけられませんでした。 | Wallarm Consoleでこのメールアドレスのユーザーを作成します。 |
| `client_not_found` | Wallarmで会社アカウントが見つかりませんでした。 | 適切なメールドメインでユーザーアカウントを作成します。これにより会社アカウントが即座に作成されます。 |

必要に応じて、管理者は[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡して、これらのエラーの修正に関する支援を受けることができます。