[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# ステップ1： Wallarm側でのパラメータ生成（G Suite）

G SuiteとSSOを接続するには、まずWallarm側でいくつかのパラメータを生成する必要があります。

!!! warning "まずWallarm側でSSOサービスを有効にしてください"
    デフォルトでは、適切なサービスを有効にしないとWallarm上でSSO接続が利用できません。SSOサービスを有効にするには、アカウントマネージャーや[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。

    サービスを有効にした後、以下のSSO接続手順を実行できます。

Wallarmコンソールに管理者アカウントでログインし、**設定 → インテグレーション → Google SSO**に従ってG Suiteインテグレーションをセットアップします。

![!「Google SSO」ブロック][img-gsuite-sso-provider-wl]

これにより、SSO設定ウィザードが表示されます。ウィザードの最初のステップでは、G Suiteサービスに渡す必要があるパラメータ（サービスプロバイダのメタデータ）が含まれたフォームが表示されます。
*   **Wallarm Entity ID** は、IDプロバイダーに対してWallarmアプリケーションが生成した一意のアプリケーションIDです。
*   **Assertion Consumer Service URL（ACS URL）** は、IDプロバイダーがSamlResponseパラメータを含むリクエストを送信するWallarmアプリケーションのアドレスです。

![!サービスプロバイダのメタデータ][img-sp-metadata]

生成されたパラメータは、G Suiteサービス側の対応するフィールドに入力する必要があります（[ステップ2][doc-setup-idp]参照）。