# G SuiteとのSSO接続

[img-gsuite-console]:       ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[link-gsuite-adm-console]:  https://admin.google.com
[img-sp-wizard-transfer-metadata]:  ../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png

本ガイドでは、アイデンティティプロバイダとしての[G Suite](https://gsuite.google.com/)(Google)サービスを、サービスプロバイダとして動作するWallarmに接続する手順を説明します。

手順を実行するには、WallarmとG Suiteの両方で管理者権限を持つアカウントが必要です。

## 手順1(Wallarm): SSOサービスを有効化する

デフォルトでは、Wallarmでの認証用SSOサービスは有効化されておらず、Wallarm Consoleの**Integrations**セクションに対応するブロックは表示されません。

SSOサービスを有効化するには、[Wallarmサポートチーム](https://support.wallarm.com/)に連絡してください。デフォルトでは[プロビジョニング](#step-4-g-suite-configure-provisioning-part-1)付きのSSOが提案されます:

* 有効化後は、ログインとパスワードによる認証は全ユーザーで使用できません。必要に応じてフォールバックアカウントを依頼してください。これにより、ログイン/パスワード入力での認証を維持できます。
* ユーザーの無効化や削除はWallarm側ではできません。
* [複数テナント](../../../installation/multi-tenant/overview.md)がある場合、Oktaでは[テナント依存の権限](intro.md#tenant-dependent-permissions)オプションを使用できます。この可否はWallarmサポートと相談して決定してください。

## 手順2(Wallarm): メタデータを生成する

G Suite側に入力するためにWallarmのメタデータが必要です:

1. Wallarm Consoleで、**Integrations** → **SSO SAML AUTHENTICATION**に移動し、**Google SSO**の設定を開始します。

    ![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. SSO configuration wizardの**Send details**ステップで、G Suiteサービスに渡す必要があるWallarmのメタデータを確認します。

    ![Wallarmのメタデータ](../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png)

    * **Wallarm Entity ID**は、アイデンティティプロバイダ向けにWallarmアプリケーションが生成する一意のアプリケーション識別子です。
    * **Assertion Consumer Service URL(ACS URL)**は、アイデンティティプロバイダがSamlResponseパラメータ付きのリクエストを送信する、Wallarm側アプリケーションのアドレスです。

1. メタデータをコピーするか、XMLとして保存します。 

## 手順3(G Suite): アプリケーションを設定する

G Suiteでアプリケーションを設定するには:

1. Googleの[admin console][link-gsuite-adm-console]にログインします。 
1. **Apps**に移動します。

    ![G Suite admin console][img-gsuite-console]

1. **SAML apps** → **Add a service/App to your domain**をクリックします。
1. **Setup my own custom app**をクリックします。

    ![G Suiteに新しいアプリケーションを追加][img-gsuite-add-app]

    G Suiteのメタデータが提供されます:

    * **SSO URL**
    * **Entity ID**
    * **Certificate** (X.509)

1. メタデータをコピーするか、XMLとして保存します。 
1. **Next**をクリックします。

    ![メタデータの保存][img-fetch-metadata]

1. Wallarmのメタデータを入力します。必須フィールド:

    * **ACS URL** = Wallarmの**Assertion Consumer Service URL**パラメータ
    * **Entity ID** = Wallarmの**Wallarm Entity ID**パラメータ

1. 必要に応じて残りのパラメータを入力し、**Next**をクリックします。

    ![サービスプロバイダ情報の入力][img-fill-in-sp-data]

1. **Finish**をクリックします。作成したアプリケーションのページにリダイレクトされます。

    ![G Suiteのアプリケーションページ][img-app-page]

1. **Edit Service** → **Service status** → **ON for everyone**で、作成したアプリケーションへのアクセスをG Suiteユーザーに付与します。
1. 変更を保存します。

## 手順4(G Suite): プロビジョニングを設定する - パート1

**プロビジョニング**とは、SAML SSOソリューション(G Suite)からWallarmへデータを自動転送する仕組みです。G Suiteのユーザーとそのグループ所属により、Wallarmへのアクセスと権限が決まります。ユーザー管理はすべてG Suite側で行います。

これを機能させるには、属性マッピングを設定します:

1. G Suiteのアプリケーションで、**Add new mapping**を使用して次をマッピングします:

    * `email`
    * `first_name`
    * `last_name`
    * ユーザーグループ(複数可)を`wallarm_roles`タグに

    ![SAML SSOソリューション - G Suite - マッピング](../../../images/admin-guides/configuration-guides/sso/simple-sso-mapping.png)

1. 変更を保存します。

    プロビジョニングの設定は、Wallarm側の[手順6](#step-6-wallarm-configure-provisioning-part-2)で続行します。

## 手順5(Wallarm): G Suiteのメタデータを入力する

1. Wallarm ConsoleのSSO configuration wizardで、**Upload metadata**ステップに進みます。
1. 次のいずれかを実行します:

    * G SuiteのメタデータをXMLファイルとしてアップロードします。

        ![メタデータのアップロード][img-sp-wizard-transfer-metadata]

    * 次のようにメタデータを手動で入力します:

        * **SSO URL** → **Identity provider SSO URL**
        * **Entity ID** → **Identity provider issuer**
        * **Certificate** → **X.509 Certificate**

            ![メタデータの手動入力][img-transfer-metadata-manually]


## 手順6(Wallarm): プロビジョニングを設定する - パート2

1. **Roles mapping**ステップに進みます。
1. 1つ以上のSSOグループをWallarmのロールにマッピングします。利用可能なロール:

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)

        すべてのロールの説明は[こちら](../../../user-guides/settings/users.md#user-roles)をご覧ください。

    ![SSOグループからWallarmロールへのマッピング - Wallarmでの設定](../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

1. SSO configuration wizardを完了します。Wallarmは、G Suiteとの間でデータを転送できるかをテストします。