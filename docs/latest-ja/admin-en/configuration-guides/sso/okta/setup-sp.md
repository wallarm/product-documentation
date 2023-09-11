[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

#   ステップ1：Wallarm側でパラメータを生成する（Okta）

OktaとSSOを接続するには、まずWallarm側でいくつかのパラメータを生成する必要があります。

!!! warning "先にWallarm側でSSOサービスを活性化してください"
    デフォルトでは、Wallarm上でSSO接続は適切なサービスを活性化しない限り利用できません。SSOサービスを活性化するには、アカウントマネージャーまたは[Wallarm サポートチーム](mailto:support@wallarm.com)にお問い合わせください。

    サービスを活性化した後、次のSSO接続手順を行うことができます。

あなたの管理者アカウントでWallarm Consoleにログインし、**設定 → インテグレーション → Okta SSO**の順に進んでOktaのインテグレーション設定を行います。

![“Okta SSO”ブロック][img-okta-sso-provider-wl]

これにより、SSO設定ウィザードが表示されます。ウィザードの最初のステップでは、Oktaサービスに渡すべきパラメータ（サービスプロバイダのメタデータ）が記載されたフォームが表示されます。
*   **Wallarm Entity ID**は、IdentityプロバイダーのためにWallarmアプリケーションが生成するユニークなアプリケーション識別子です。
*   **Assertion Consumer Service URL (ACS URL)**は、IdentityプロバイダーがSamlResponseパラメータを持つリクエストを送信するアプリケーションのWallarm側のアドレスです。

![Service provider's metadata][img-sp-metadata]

生成されたパラメータは、Oktaサービス側の対応するフィールドに入力する必要があります（[ステップ2][doc-setup-idp]を参照してください）。