Wallarmのドキュメントの次の部分を英語から日本語に翻訳してください：

[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png
[doc-setup-idp]:                setup-idp.md

#   ステップ1：Wallarm側でのパラメータ生成（Okta）

SSOをOktaに接続するには、まずWallarm側でいくつかのパラメータを生成する必要があります。

!!! warning "まずWallarm側でSSOサービスをアクティベートしてください"
デフォルトでは、WallarmでのSSO接続は、適切なサービスをアクティベートせずには利用できません。SSOサービスの有効化には、アカウントマネージャーや[Wallarmサポートチーム](mailto:support@wallarm.com)にお問い合わせください。

サービスをアクティベートすると、以下のSSO接続手順が実行できるようになります。

管理者アカウントでWallarm Consoleにログインし、**設定 → インテグレーション → Okta SSO**をたどってOktaとの連携設定に進んでください。

![!“Okta SSO”ブロック][img-okta-sso-provider-wl]

これによりSSO構成ウィザードが表示されます。ウィザードの最初のステップでは、Oktaサービスに渡す必要があるパラメータ（サービスプロバイダのメタデータ）が記載されているフォームが表示されます。
*   **Wallarm Entity ID**は、IDプロバイダに対してWallarmアプリケーションが生成する一意のアプリケーション識別子です。
*   **Assertion Consumer Service URL（ACS URL）**は、IDプロバイダがSamlResponseパラメータを含むリクエストを送信するアプリケーションのWallarm側のアドレスです。
![!サービスプロバイダのメタデータ][img-sp-metadata]
生成されたパラメータは、Oktaサービス側の対応するフィールドに入力する必要があります（[ステップ2][doc-setup-idp]を参照）。