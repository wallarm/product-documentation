#   Step 2: Creating and Configuring an Application in Okta

[img-dashboard]:            ../../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[img-fetch-metadata-xml]:   ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-xml.png
[img-xml-metadata]:         ../../../../images/admin-guides/configuration-guides/sso/okta/xml-metadata-example.png
[img-fetch-metadata-manually]:  ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-manually.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm

[anchor-general-settings]:  #1-general-settings
[anchor-configure-saml]:    #2-configure-saml
[anchor-feedback]:          #3-feedback
[anchor-fetch-metadata]:    #downloading-metadata  

!!! info "前提条件"
    以下の値は、このガイドで例示値として使用します:
    
    *   `WallarmApp`を**App name**パラメータの値として使用します（Oktaにおいて）。
    *   `https://sso.online.wallarm.com/acs`を**Single sign‑on URL**パラメータの値として使用します（Oktaにおいて）。
    *   `https://sso.online.wallarm.com/entity-id`を**Audience URI**パラメータの値として使用します（Oktaにおいて）。

!!! warning
    **Single sign‑on URL**および**Audience URI**パラメータのサンプル値を、[前のステップ][doc-setup-sp]で取得した実際の値に置き換えるように確認してください。

Oktaにログインします（アカウントは管理者権限を有しています）ので、画面右上の*Administrator*ボタンをクリックします。

Dashboardセクションで、右側の*Add Applications*ボタンをクリックします。

![Okta dashboard][img-dashboard]

新しいアプリケーションセクションで、右側の*Create New App*ボタンをクリックします。

ポップアップウィンドウで、以下のオプションを設定します:
1.  **Platform** → “Web”.
2.  **Sign‑on method** → “SAML 2.0”.

*Create*ボタンをクリックします。

その後、SAML統合ウィザード（*Create SAML Integration*）に遷移します。SAML統合の作成および設定のため、3つの段階を完了するよう求められます:
1.  [一般設定.][anchor-general-settings]
2.  [SAMLの設定.][anchor-configure-saml]
3.  [フィードバック.][anchor-feedback]

その後、新しく作成された統合のためにメタデータを[ダウンロードする必要があります][anchor-fetch-metadata]。


##  1.  一般設定

作成中のアプリケーション名を**App Name**フィールドに入力します。

必要に応じて、アプリケーションのロゴ（**App logo**）をダウンロードし、OktaホームページおよびOktaモバイルアプリでユーザー向けのアプリケーション表示を設定できます。

*Next*ボタンをクリックします。

![一般設定][img-general]


##  2.  SAMLの設定

この段階では、Wallarm側で[以前に生成された][doc-setup-sp]以下のパラメータが必要です:

*   **Wallarm Entity ID**
*   **Assertion Consumer Service URL (ACS URL)**

!!! info "Oktaパラメータ"
    本マニュアルでは、OktaでSSOを設定する際に入力する必須パラメータのみを説明します.
    
    デジタル署名やSAMLメッセージ暗号化設定に関連するその他のパラメータについては、[Okta documentation][link-okta-docs]を参照してください.

以下の基本パラメータを入力します:
*   **Single sign‑on URL**—Wallarm側で以前に取得した**Assertion Consumer Service URL (ACS URL)**の値を入力します.
*   **Audience URI (SP Entity ID)**—Wallarm側で以前に取得した**Wallarm Entity ID**の値を入力します.

初期設定の他のパラメータはデフォルトのままで構いません.

![SAMLの設定][img-saml]

設定を続行するには*Next*をクリックします。前のステップに戻るには*Previous*をクリックします.

![SAML設定のプレビュー][img-saml-preview]


##  3.  フィードバック

この段階で、アプリケーションの種類やOktaのお客様またはパートナーであるかどうかなど、Oktaに追加情報を提供するよう求められます。**Are you a customer or partner**パラメータには、“I'm an Okta customer adding an internal app”を選択するだけで十分です.

必要に応じて、その他のパラメータを入力します.

その後、*Finish*ボタンをクリックすることでSAML統合ウィザードを終了できます。前のステップに戻るには*Previous*ボタンをクリックします.

![フィードバックフォーム][img-feedback]

このステージの後、作成されたアプリケーションの設定ページに移動します。

次に、Wallarm側で[SSOプロバイダの設定を継続][doc-metadata-transfer]するため、作成された統合のメタデータを[ダウンロードする必要があります][anchor-fetch-metadata].

メタデータは、SSOの設定に必要なアイデンティティプロバイダの特性（[Step 1][doc-setup-sp]でサービスプロバイダ向けに生成されたものなど）を記述したパラメータの集合です.


##  メタデータのダウンロード

メタデータは、XMLファイルとして、またはテキスト形式のまま（後続の設定で手動で入力する必要があります）でダウンロードできます.

XMLファイルとしてダウンロードするには:
1.  作成されたアプリケーションの設定ページで*Identity Provider metadata*リンクをクリックします:

    ![メタデータダウンロードリンク][img-fetch-metadata-xml]
    
    その結果、ブラウザで新しいタブが開き、同様の内容が表示されます:
    
    ![XML形式のメタデータ例][img-xml-metadata]
    
2.  ブラウザまたは他の適切な方法で、内容をXMLファイルとして保存します.

テキスト形式のままメタデータをダウンロードするには:
1.  作成されたアプリケーションの設定ページで*View Setup instructions*ボタンをクリックします.

    ![View Setup instructionsボタン][img-fetch-metadata-manually]
    
2.  表示されるすべてのデータをコピーします.

これで、Wallarm側で[SSOの設定を継続][doc-metadata-transfer]できます.