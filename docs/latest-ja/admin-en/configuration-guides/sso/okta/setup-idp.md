# ステップ2：Oktaでのアプリケーションの作成と設定

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
[anchor-fetch-metadata]:    #metadata-download

!!! info "次の要素が必要です"
    以下の値は、このガイド中でデモンストレーションの値として使用されます：

    *   **App name**フィールド（Okta内）に対する値として`WallarmApp`
    *   **Single sign‑on URL**フィールド（Okta内）に対する値として `https://sso.online.wallarm.com/acs`
    *   **Audience URI**フィールド（Okta内）に対する値として`https://sso.online.wallarm.com/entity-id`

!!! warning
    **Single sign‑on URL**と**Audience URI**のパラメータについては、[前のステップ][doc-setup-sp]で得られた実際のものにサンプル値を置き換えてください。

Oktaサービスに（アカウントは管理者権限が必要です）ログインし、右上の*Administrator* ボタンをクリックします。

*Dashboard* セクションで、右側の*Add Applications* ボタンをクリックします。

![!Okta dashboard][img-dashboard]

新しいアプリケーションセクションで、右側の*Create New App* ボタンをクリックします。

ポップアップウィンドウで、以下のオプションを設定します：
1.  **Platform** → “Web”
2.  **Sign‑on method** → “SAML 2.0”

*Create* ボタンをクリックします。

その後、次の三つのステージを完了するように求められ、SAML統合ウィザード（*Create SAML Integration*）に進みます：
1.  [General Settings.][anchor-general-settings]
2.  [Configure SAML.][anchor-configure-saml]
3.  [Feedback.][anchor-feedback]

その後、新しく作成した統合のメタデータを[ダウンロードする必要があります][anchor-fetch-metadata]。


##  1.  一般設定

**App Name**フィールドに作成するアプリケーションの名前を入力します。

必要に応じて、アプリケーションのロゴ（**App logo**）をダウンロードし、OktaホームページおよびOktaモバイルアプリケーションでユーザーがアプリケーションを表示する設定を行うことができます。

*Next* ボタンをクリックします。

![!General settings][img-general]


##  2.  SAMLの設定

このステージでは、以前にWallarm側で生成したパラメータが必要になります：

*   **Wallarm Entity ID**
*   **Assertion Consumer Service URL (ACS URL)**

!!! info "Okta のパラメータ"
    この手順書では、OktaでSSOを設定する際に入力が必要なパラメータのみを説明しています。
    
    デジタル署名やSAMLメッセージ暗号化設定など、他のパラメータについて詳しく知りたい場合は、[Oktaのドキュメンテーション][link-okta-docs]を参照してください。

以下の基本的なパラメータを入力します：
*   **Single sign‑on URL**—以前にWallarm側で得られた**Assertion Consumer Service URL (ACS URL)**の値を入力します。
*   **Audience URI (SP Entity ID)**—以前にWallarm側で得られた**Wallarm Entity ID**の値を入力します。

初期設定のためのその他のパラメータはデフォルトのままにしておけます。

![!Configure SAML][img-saml]

設定を続けるには、*Next* をクリックします。前のステップに戻りたい場合は、*Previous* をクリックします。

![!SAML settings preview][img-saml-preview]


##  3.  フィードバック

このステージでは、アプリケーションの種類、Oktaの顧客またはパートナーであるかどうか、その他のデータについて、Oktaに追加情報を提供するよう求められます。**Are you a customer or partner?**のパラメーターについては、「I'm an Okta customer adding an internal app」を選択するだけで足ります。

必要に応じて、他の利用可能なパラメータを入力します。

その後、*Finish* ボタンをクリックしてSAML統合ウィザードを終了します。前のステップに戻りたい場合は、*Previous* ボタンをクリックします。

![!Feedback form][img-feedback]

このステージの後、作成したアプリケーションの設定ページに進みます。

次に、作成した統合のメタデータを[ダウンロードし][anchor-fetch-metadata]、Wallarm側で[SSOプロバイダの設定を続行する][doc-metadata-transfer]必要があります。

メタデータは、SSOの設定に必要なIDプロバイダのプロパティを記述した一連のパラメータ（[ステップ1][doc-setup-sp]でサービスプロバイダに生成されたものなど）です。


##  メタデータのダウンロード

メタデータはXMLファイルとして、またはテキスト形式の「そのまま」（設定を続行する際にメタデータを手動で入力する必要があります）でダウンロードすることができます。

XMLファイルとしてダウンロードするには：
1.  作成したアプリケーションの設定ページで、*Identity Provider metadata*リンクをクリックします：

    ![!Metadata download link][img-fetch-metadata-xml]
    
    結果として、次のような内容の新しいタブがブラウザに表示されます：
    
    ![!Example of XML-formatted metadata][img-xml-metadata]
    
2.  内容をXMLファイルに保存します（ブラウザや他の適切な方法を用いて）。

メタデータを「そのまま」ダウンロードするには：
1.  作成したアプリケーションの設定ページで、*View Setup instructions*ボタンをクリックします。

    ![!The “View Setup instructions” button][img-fetch-metadata-manually]
    
2.  提供されたすべてのデータをコピーします。

これで、Wallarm側で[SSOの設定を続行することができます][doc-metadata-transfer].