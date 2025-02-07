[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# ステップ1: Wallarm側(Okta)のパラメーター生成

OktaとSSOを接続するには、まずWallarm側でいくつかのパラメーターを生成する必要があります。

!!! warning "最初にWallarm側でSSOサービスを有効化してください"
    デフォルトでは、WallarmでSSO接続は対応するサービスを有効化しないと利用できません。SSOサービスを有効化するには、お客様のアカウントマネージャーまたは[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください。

    サービスを有効化すると、以下のSSO接続手順を実行することができます。

Administratorアカウントを使用してWallarmコンソールにログインし、**Settings → Integration → Okta SSO**に従ってOkta統合のセットアップを進めてください。

![「Okta SSO」ブロック][img-okta-sso-provider-wl]

これによりSSO構成ウィザードが表示されます。ウィザードの最初のステップでは、Oktaサービスに渡す必要があるパラメーター（サービスプロバイダーのメタデータ）が含まれたフォームが表示されます:
*   **Wallarm Entity ID**は、Wallarmアプリケーションがアイデンティティプロバイダー用に生成するユニークなアプリケーション識別子です。
*   **Assertion Consumer Service URL (ACS URL)**は、アイデンティティプロバイダーがSamlResponseパラメーターを含むリクエストを送信するWallarm側のアプリケーションのアドレスです。

![サービスプロバイダーのメタデータ][img-sp-metadata]

生成されたパラメーターは、Oktaサービス側の対応するフィールドに入力する必要があります（[Step 2][doc-setup-idp]を参照）。