# SAML SSO認証の設定

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png
[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

本記事では、Wallarmの[SAML SSO認証](intro.md)を有効化・設定する一般的な手順について説明します。

また、[G Suite](sso-gsuite.md)および[Okta](sso-okta.md)のSAML SSOソリューション向けの例も確認できます。

## 手順1：SSOサービスを有効化する

デフォルトでは、Wallarmでの認証用SSOサービスは無効であり、Wallarm Consoleの**Integrations**セクションに対応ブロックは表示されません。

SSOサービスを有効化するには、[Wallarm support team](https://support.wallarm.com/)に連絡してください。デフォルトでは[プロビジョニング](#step-4-saml-sso-solution-configure-provisioning)付きのSSOが提案されます。

* 有効化後は、ログインとパスワードによる認証はどのユーザーも利用できません。必要に応じてフォールバックアカウントをリクエストしてください。フォールバックアカウントではログインとパスワードの入力を維持します。
* ユーザーの無効化や削除はWallarm側では行えません。

<a name="step-2-wallarm-generate-metadata"></a>
## 手順2（Wallarm）：メタデータを生成

SAML SSOソリューション側で入力するためのWallarmメタデータが必要です。

1. 管理者権限でWallarm Consoleにログインしていることを確認します。
1. Wallarm Consoleで**Integrations** → **SSO SAML AUTHENTICATION**に移動し、該当するインテグレーションを開始します。

    Google、Okta、またはその他の（**Custom**）SAML SSOソリューションを統合できます。同時に有効化できるSSOのインテグレーションは1つのみです。

    ![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. SSO設定ウィザードの**Send details**ステップで、SAML SSOソリューションに送信するメタデータを確認します。
1. メタデータをコピーするか、XMLとして保存します。
1. SSOデータ交換に追加の検証が必要なSAML SSOソリューションの場合は、[**Extended security**](#extended-security)チェックボックスを選択します。

<a name="step-3-saml-sso-solution-configure-application"></a>
## 手順3（SAML SSOソリューション）：アプリケーションを設定

1. SAML SSOソリューションにログインします。
1. Wallarmへのアクセスを提供するアプリケーションを設定します。
1. アプリケーションのメタデータをコピーするか、XMLとして保存します。
1. アプリケーションが有効化され、ユーザーがアクセスできることを確認します。

<a name="step-4-saml-sso-solution-configure-provisioning"></a>
## 手順4（SAML SSOソリューション）：プロビジョニングを設定

**プロビジョニング**とは、SAML SSOソリューションからWallarmへのデータ自動転送です。SAML SSOソリューション側のユーザーとそのグループ所属がWallarmへのアクセスとそこでの権限を決定し、ユーザー管理はすべてSAML SSOソリューション側で実施します。

これを機能させるには、属性マッピングを設定します。

1. Wallarmにアクセスを提供するアプリケーションで、次の属性をマッピングします。

    * `email`
    * `first_name`
    * `last_name`
    * ユーザーグループを`wallarm_role:[role]`にマッピング。ここで`role`は次のいずれかです。

        * `admin` (**Administrator**)
        * `analytic` (**Analyst**)
        * `api_developer` (**API Developer**)
        * `auditor` (**Read Only**)
        * `partner_admin` (**Global Administrator**)
        * `partner_analytic` (**Global Analyst**)
        * `partner_auditor` (**Global Read Only**)

            ![Integrations - SSO、Oktaでのマッピング例](../../../images/admin-guides/configuration-guides/sso/okta/wallarm-sso-okta-mapping.png)

            すべてのロールの説明は[こちら](../../../user-guides/settings/users.md#user-roles)を参照してください。

            SAML SSOソリューションが異なる属性へのグループマッピングをサポートしない場合は、すべてのグループを`wallarm_roles`タグにマッピングします（Googleの[ケース](sso-gsuite.md#step-4-g-suite-configure-provisioning-part-1)と同様）。その後、Wallarm側でグループをロールにマッピングしてください — [手順6](#step-6-wallarm-configure-provisioning-optional)を参照してください。

            !!! warning "上書きのオプション"
                different permissions in different tenantsオプションが有効な場合、グループからロールへのマッピングは[異なる方法](#tenant-dependent-permissions)で構成され、[上書き](#override-general-sso-mapping)により基本のマッピングが置き換えられます。

1. 変更を保存します。

**プロビジョニングを無効にする**

[Wallarm support team](https://support.wallarm.com/)に連絡することで、プロビジョニングを無効にできます。無効な場合、SAML SSOソリューションに存在するユーザーに対応するユーザーをWallarm側で作成する必要があります。ユーザーロールもWallarm Consoleで定義してください。

プロビジョニングが無効な場合は、ユーザーを手動で作成し、ロールを設定し、SSOでログインさせるユーザーを選択します。その他のユーザーはログインとパスワードを使用します。リクエストに応じて、Wallarmサポートは**Strict SSO**オプションを有効にすることもできます。これは、会社アカウントのすべてのユーザーに対して一括でSSO認証を有効にします。Strict SSOのその他の特性は次のとおりです。

* アカウントの既存ユーザーすべての認証方法がSSOに切り替わります。
* 新規ユーザーはデフォルトでSSOを認証方法として取得します。
* 認証方法は、いずれのユーザーでもSSO以外に切り替えられません。

プロビジョニングが無効な場合のユーザー管理は、Wallarm Console → **Settings** → **Users**で、[こちら](../../../user-guides/settings/users.md)の説明に従って実施します。SAML SSOソリューションとのマッピングでは`email`属性のみを使用します。

## 手順5（Wallarm）：SSO SAMLソリューションのメタデータを入力

1. Wallarm Consoleで、SSO設定ウィザードの**Upload metadata**ステップに進みます。
1. 次のいずれかを実施します。

    * G SuiteのメタデータをXMLファイルとしてアップロードします。
    * メタデータを手動で入力します。

<a name="step-6-wallarm-configure-provisioning-optional"></a>
## 手順6（Wallarm）：プロビジョニングを設定（オプション）

この手順は、SAML SSOソリューションが異なる属性へのグループマッピングをサポートせず、すべてのグループが`wallarm_roles`タグにマッピングされる場合（Googleの[ケース](sso-gsuite.md#step-4-g-suite-configure-provisioning-part-1)と同様）にのみ実施してください。

1. **Roles mapping**ステップに進みます。
1. 1つ以上のSSOグループをWallarmのロールにマッピングします。利用可能なロールは次のとおりです。

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)

        すべてのロールの説明は[こちら](../../../user-guides/settings/users.md#user-roles)を参照してください。

    ![SSOグループからWallarmロールへのマッピング - Wallarmでのマッピング](../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

1. SSO設定ウィザードを完了します。Wallarmは、SAML SSOソリューションとの間でデータが送受信可能かをテストします。

<a name="extended-security"></a>
## Extended security

SAML SSOソリューション（KeycloakやOktaなど）は、Wallarmを含むアプリケーションとの接続時に追加のセキュリティ検証を必要とする場合があります。これには次が含まれます。

* 署名によるSAMLリクエストとレスポンスの検証要件
* SAMLリクエストとレスポンスの暗号化要件

このようなSAML SSOソリューションとの統合のために、Wallarmには**Extended security**機能があります。使用方法：

1. Wallarmで、[**Generate metadata**](#step-2-wallarm-generate-metadata)ステップにて**Extended security**オプションを選択します。
1. メタデータをXMLとして保存します。証明書データおよびSAML SSOソリューション向けの適切な設定がXMLに追加されます。
1. SAML SSOソリューションで、[**Configure application**](#step-3-saml-sso-solution-configure-application)ステップにて、提供されたXMLをインポートしてすべてのオプションを自動的に正しく設定します。以下のKeycloakの例を参照してください。

    ![Extended security - Keycloakの例](../../../images/admin-guides/configuration-guides/sso/sso-extended-security-keycloak-example.png)

<a name="tenant-dependent-permissions"></a>
## テナントごとの権限

[**different permissions in different tenants**](intro.md#tenant-dependent-permissions)オプションが有効な場合、次のように権限を構成します。

1. **Global administrator**としてWallarm Consoleにログインしていることを確認します。
1. **Settings** → **Groups**に移動します。
1. **Add group**をクリックし、SAML SSOソリューショングループ名にバインドします。
1. ロールを設定し、**Add**をクリックします。

    ![SSO、different permissions in different tenants、グループの作成](../../../images/admin-guides/configuration-guides/sso/sso-iam-group-create.png)

    グループが作成され、グループ一覧に表示されます。

1. グループのメニューから**Edit group settings**を選択します。
1. グループページが表示されます。テナントの一覧を設定します。

    ![SSO、different permissions in different tenants、グループへのテナント追加](../../../images/admin-guides/configuration-guides/sso/sso-iam-group-tenants.png)

    これにより、このSAML SSOソリューショングループのユーザーは、指定した権限（ロール）で、リストされたテナントにアクセスできるようになります。

1. 別のグループを追加し、同じSAML SSOソリューショングループ名にバインドします。
1. 別のロールを設定します。
1. 別のテナント一覧を設定します。

    これにより、このSAML SSOソリューショングループのユーザーは、別の権限（別のロール）で、これら他のテナントにアクセスできるようになります。

**特定のテナントへのアクセスのみ**：異なるSAML SSOソリューショングループのユーザーが、特定のテナントのみにアクセスでき、その他にはアクセスできないように構成することもできます。

同じSAML SSOユーザーが、同一テナントに対して異なる権限でのアクセスを付与する複数のグループに属している場合は、より広い権限が適用されます。

!!! info "管理者"

    特定のSAML SSOソリューショングループのユーザーに、Wallarm（すべてのテナント）への特権（管理）アクセスを付与したい場合は、Wallarm ConsoleのSSO設定ウィザードで**Roles mapping**ステップに進み、SSOグループを**Global administrator**ロールにバインドしてください。
    
    このSAML SSOソリューショングループのユーザーは、他のSAML SSOソリューショングループに含まれている場合でも、いかなる制限も受けません。

    ![SSO、different permissions in different tenants、Global administratorの例外](../../../images/admin-guides/configuration-guides/sso/sso-iam-global-administrators.png)

<a name="override-general-sso-mapping"></a>**一般マッピングの上書き**

different permissions in different tenantsオプションを有効にすると、[一般的なマッピング](#step-4-saml-sso-solution-configure-provisioning)が上書きされることに注意してください。例：

* `Analytic`グループを通常`wallarm_role:analytic`にマッピングしており、テナントが5つある場合、後からdifferent permissions in different tenantsオプションを有効にすると、**Groups**を作成・管理するまで`Analytic`グループのユーザーはどのテナントにもアクセスできなくなります（一般マッピングは無視されます）。
* その後、5つのテナントのうち3つへのアクセスを`Analytic`グループに付与するグループを作成した場合、残りの2つには引き続きアクセスできません（一般マッピングは無視されます）。
* 一部のグループのユーザーに管理者以外の権限で全テナントへのアクセスを提供したい場合は、[technical tenant account](../../../installation/multi-tenant/overview.md#tenant-accounts)にアクセスするための**Global something**ロールのグループを作成してください。

## 無効化と削除

**Integrations**セクションからSSOを無効化・削除できるのは、[プロビジョニング](#step-4-saml-sso-solution-configure-provisioning)がオフの場合のみです。オフにするには、[Wallarm support team](https://support.wallarm.com/)に連絡してください。