[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# ステップ 1: Wallarm側でのパラメータ生成 (G Suite)

G SuiteとのSSO接続には、まずWallarm側でいくつかのパラメータを生成する必要があります。

!!! 警告 "まずWallarm側でSSOサービスを有効にしてください"
    デフォルトでは、適切なサービスを有効化しない限り、Wallarm側ではSSO接続を利用できません。SSOサービスを有効にするためには、アカウントマネージャーまたは[Wallarmサポートチーム](mailto:support@wallarm.com)へお問い合わせください。

    サービス有効化後、以下のSSO接続手順を実行できるようになります。

管理者アカウントでWallarm Consoleにログインし、**Settings → Integration → Google SSO**に従ってG Suite統合のセットアップを進めてください。

![「Google SSO」ブロック][img-gsuite-sso-provider-wl]

これにより、SSO設定ウィザードが表示されます。ウィザードの最初のステップでは、G Suiteサービスに送信すべきパラメータ（サービスプロバイダーのメタデータ）が記載されたフォームが表示されます：
* **Wallarm Entity ID** は、アイデンティティプロバイダーのためにWallarmアプリケーションによって生成された一意のアプリケーション識別子です。
* **Assertion Consumer Service URL (ACS URL)** は、アイデンティティプロバイダーがSamlResponseパラメータを付与してリクエストを送信するWallarm側のアプリケーションのアドレスです。

![サービスプロバイダーのメタデータ][img-sp-metadata]

生成されたパラメータは、G Suiteサービス側の対応するフィールドに入力する必要があります（[ステップ 2][doc-setup-idp]を参照）。