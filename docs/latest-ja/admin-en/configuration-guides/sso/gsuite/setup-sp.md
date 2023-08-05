[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# ステップ1：Wallarm側でのパラメータ生成（G Suite）

SSOをG Suiteと連携するためには、まずWallarm側でいくつかのパラメータを生成する必要があります。

!!! warning "先にWallarm側でSSOサービスをアクティブにしてください"
    デフォルトでは、Wallarm上でのSSO接続は適切なサービスをアクティブにしないと利用できません。SSOサービスをアクティブにするためには、アカウントマネージャーまたは[Wallarmサポートチーム](mailto:support@wallarm.com)にご連絡ください。

    サービスをアクティブにした後で、以下のSSO接続手順を実行できます。

Wallarmコンソールへ管理者アカウントでログインし、**設定 → インテグレーション → Google SSO** の順に進み、G Suiteのインテグレーション設定に取り組んでください。

![!“Google SSO”ブロック][img-gsuite-sso-provider-wl]

すると、SSO設定ウィザードが表示されます。ウィザードの最初のステップでは、G Suiteサービスに渡すべきパラメータ（サービスプロバイダのメタデータ）がフォームに表示されます：
*   **Wallarm Entity ID** は、アイデンティティプロバイダ用にWallarmアプリケーションによって生成されたユニークなアプリケーション識別子です。
*   **Assertion Consumer Service URL (ACS URL)** は、アイデンティティプロバイダがSamlResponseパラメータと共にリクエストを送信するWallarm側のアプリケーションのアドレスです。

![!Service provider's metadata][img-sp-metadata]

生成されたパラメータは、G Suiteサービス側の対応するフィールドに入力する必要があります（[ステップ2][doc-setup-idp]を参照してください）。