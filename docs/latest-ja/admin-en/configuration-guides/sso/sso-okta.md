#   OktaとのSSO接続

[link-okta]:                        https://www.okta.com/
[img-dashboard]:            ../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm
[img-transfer-metadata-manually]:   ../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-sp-metadata]:              ../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png
[img-assignments]:  ../../../images/admin-guides/configuration-guides/sso/okta/assignments.png

本ガイドでは、サービスプロバイダーとして動作するWallarmに、アイデンティティプロバイダーとして[Okta][link-okta]サービスを接続する手順を説明します。

手順を実行するには、WallarmとOktaの両方で管理者権限を持つアカウントが必要です。

## 手順1 (Wallarm): SSOサービスを有効化する

デフォルトでは、Wallarmでの認証用SSOサービスは有効化されておらず、Wallarm Consoleの**Integrations**セクションに対応するブロックは表示されません。

SSOサービスを有効化するには、[Wallarmサポートチーム](https://support.wallarm.com/)に連絡してください。既定では[プロビジョニング](#step-4-okta-configure-provisioning)ありのSSOが提案されます:

* 有効化後は、ログインIDとパスワードによる認証はユーザーは行えません。必要に応じてフォールバックアカウントを依頼してください - そのアカウントではログインID/パスワードの入力が可能なままです。
* ユーザーの無効化や削除はWallarm側からは行えません。
* [複数テナント](../../../installation/multi-tenant/overview.md)がある場合、Oktaと併用することで[テナント依存の権限](intro.md#tenant-dependent-permissions)オプションを使用できます。この可否はWallarmサポートと相談して決定してください。

## 手順2 (Wallarm): メタデータを生成する

!!! info "拡張セキュリティ"
    OktaとWallarm間の接続に追加のセキュリティ検証を適用したい、または適用する必要がある場合は、本手順で利用できる[拡張セキュリティ](setup.md#extended-security)オプションの使用をご検討ください。

Okta側で入力するためにWallarmのメタデータが必要です:

1. Wallarm Consoleで**Integrations** → **SSO SAML AUTHENTICATION**に進み、**Okta SSO**の構成を開始します。

    ![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. SSO構成ウィザードで、**Send details**手順にて、Oktaサービスへ渡す必要があるWallarmのメタデータを確認します。

    ![Wallarmのメタデータ][img-sp-metadata]

    * **Wallarm Entity ID**は、アイデンティティプロバイダー向けにWallarmアプリケーションが生成する一意のアプリケーション識別子です。
    * **Assertion Consumer Service URL (ACS URL)**は、アイデンティティプロバイダーがSamlResponseパラメータ付きのリクエストを送信する、Wallarm側アプリケーションのアドレスです。

1. メタデータをコピーするか、XMLとして保存します。

## 手順3 (Okta): アプリケーションを構成する

Oktaでアプリケーションを構成するには:

1. 管理者としてOktaにログインします。
1. **Applications** → **Applications** → **Create App Integration**をクリックします。

    ![Oktaダッシュボード][img-dashboard]

1. **Sign‑on method** → “SAML 2.0”を設定します。
1. 続行し、**Create SAML Integration**ウィザードで、**App Name**や任意で**App logo**などの統合の一般設定を行います。

    ![一般設定][img-general]

1. 続行し、Wallarmのメタデータを入力します。必須フィールド:

    * **Single sign‑on URL** = Wallarmの**Assertion Consumer Service URL (ACS URL)**。
    * **Audience URI (SP Entity ID)** = Wallarmの**Wallarm Entity ID**。

        ![SAMLの設定][img-saml]

1. 必要に応じて、[Oktaドキュメント][link-okta-docs]に記載の他のパラメータを設定します。

    ![SAML設定のプレビュー][img-saml-preview]

1. 続行し、**Are you a customer or partner**を「I'm an Okta customer adding an internal app」に設定します。
1. 必要に応じて、他のパラメータを設定します。

    ![フィードバックフォーム][img-feedback]

1. **Finish**をクリックします。作成されたアプリケーションのページにリダイレクトされます。
1. Oktaメタデータを取得するには、**Sign On**タブに移動し、次のいずれかを実行します:

    * **Identity Provider metadata**をクリックし、表示されたデータをXMLとして保存します。
    * **View Setup instructions**をクリックし、表示されたデータをコピーします。

1. **Applications** → **Applications** → **Assign Users to App**に移動して、作成したアプリケーションにOktaユーザーへのアクセス権を付与します。

    ![アプリケーションへのユーザー割り当て][img-assignments]

## 手順4 (Okta): プロビジョニングを設定する

**プロビジョニング**は、SAML SSOソリューション（Okta）からWallarmへのデータ自動転送です: OktaのユーザーおよびそのグループメンバーシップがWallarmへのアクセスとそこでの権限を決定し、ユーザー管理はすべてOkta側で行います。

これを機能させるには、属性マッピングを設定します:

1. Oktaのアプリケーションで、**Applications** → **Applications** → **General** → **SAML Settings (Edit)** → **Next**をクリックします。

1. 属性ステートメントをマッピングします:

    * email - user.email
    * first_name - user.firstName
    * last_name user.lastName

1. ユーザーグループを`wallarm_role:[role]`にマッピングします。ここで`role`は次のいずれかです:

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)
    
        すべてのロールの説明は[こちら](../../../user-guides/settings/users.md#user-roles)を参照してください。

    ![Integrations - SSO、Oktaでのマッピング](../../../images/admin-guides/configuration-guides/sso/okta/wallarm-sso-okta-mapping.png)

1. 変更を保存します。

## 手順5 (Wallarm): Oktaメタデータを入力する

1. Wallarm ConsoleのSSO構成ウィザードで、**Upload metadata**手順に進みます。
1. 次のいずれかを実行します:

    * OktaメタデータをXMLファイルとしてアップロードします。
    * 次のようにメタデータを手動で入力します:
    
        * **Identity Provider Single Sign‑On URL** → **Identity provider SSO URL**。
        * **Identity Provider Issuer** → **Identity provider issuer**。
        * **X.509 Certificate** → **X.509 Certificate**フィールド。
    
            ![メタデータの手動入力][img-transfer-metadata-manually]
    
1. SSO構成ウィザードを完了します。WallarmはOktaとの間でデータを転送できるかをテストします。

## 手順6 (Wallarm): プロビジョニングを設定する（SKIP）

Oktaの場合、この手順はWallarmではスキップします。

![SSOグループからWallarmロールへのマッピング - Wallarmでのマッピング](../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

次の手順に進み、SSO構成ウィザードを完了してください。WallarmはSAML SSOソリューションとの間でデータを転送できるかをテストします。