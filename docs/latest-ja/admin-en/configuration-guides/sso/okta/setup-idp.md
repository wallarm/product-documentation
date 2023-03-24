					#   ステップ2：Oktaでアプリケーションの作成と設定

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
    このガイドでは、以下のデモンストレーション値が使用されています：
    
    *   Okta の **App name** パラメータに「WallarmApp」の値。
    *   Okta の **Single sign‑on URL** パラメータに「https://sso.online.wallarm.com/acs」の値。
    *   Okta の **Audience URI** パラメータに「https://sso.online.wallarm.com/entity-id」の値。

!!! warning
    **Single sign‑on URL** と **Audience URI** のパラメータのサンプル値を、[前のステップ][doc-setup-sp]で取得した実際の値に置き換えてください。

Oktaサービスにログインし（アカウントは管理者権限が必要）、右上の*アドミニストレータ*ボタンをクリックしてください。

*ダッシュボード*セクションで、右側の*アプリケーションを追加*ボタンをクリックします。

![!Okta dashboard][img-dashboard]

新しいアプリケーションセクションで、右側の*Create New App*ボタンをクリックします。

ポップアップウィンドウで、次のオプションを設定します：
1.  **Platform** → 「Web」。
2.  **Sign‑on method** → 「SAML 2.0」。

*Create* ボタンをクリックします。

その後、SAML統合ウィザード（*Create SAML Integration*）に移動します。SAML統合の作成と設定の完了には以下の3つのステージが必要です。
1.  [一般設定.][anchor-general-settings]
2.  [SAMLの設定.][anchor-configure-saml]
3.  [フィードバック.][anchor-feedback]

その後、新しく作成された統合用のメタデータが[ダウンロードされる必要があります][anchor-fetch-metadata]。


##  1.  一般設定

**App Name**フィールドに作成するアプリケーションの名前を入力します。

オプションで、アプリケーションのロゴ（**App logo**）をダウンロードし、OktaホームページやOktaモバイルアプリケーションでユーザー向けのアプリケーション表示設定を行うことができます。

*次へ*ボタンをクリックします。

![!General settings][img-general]


##  2.  SAMLの設定

この段階では、Wallarm側で[事前に生成した][doc-setup-sp]以下のパラメータが必要です：

*   **Wallarm Entity ID**
*   **Assertion Consumer Service URL (ACS URL)**

!!! info "Oktaのパラメータ"
    このマニュアルでは、OktaでのSSO設定時に入力が必須となるパラメータについてのみ説明されています。
    
    その他のパラメータ（デジタル署名およびSAMLメッセージ暗号化設定に関連するものを含む）に関しては、[Oktaのドキュメント][link-okta-docs]を参照してください。

以下の基本パラメータを入力してください：
*   **Single sign‑on URL** — Wallarm側で事前に取得した**Assertion Consumer Service URL (ACS URL)**の値を入力します。
*   **Audience URI (SP Entity ID)** — Wallarm側で事前に取得した**Wallarm Entity ID**の値を入力します。

初期設定のための残りのパラメータはデフォルトのままにしておいてください。

![!Configure SAML][img-saml]

設定を続行するには、*次へ*をクリックします。前のステップに戻るには、*前へ*をクリックしてください。

![!SAML settings preview][img-saml-preview]


##  3.  フィードバック

この段階では、アプリケーションのタイプやOktaのお客様かパートナーかどうか、その他のデータについてOktaに追加情報を提供するよう求められます。**あなたはお客様ですか、パートナーですか？** のパラメータで、「I'm an Okta customer adding an internal app」を選択するだけで十分です。

必要に応じて、他の利用可能なパラメータに記入してください。

その後、*終了* ボタンをクリックしてSAML統合ウィザードを終了するか、*前へ* ボタンをクリックして前のステップに戻ります。

![!Feedback form][img-feedback]

この段階を終えると、作成されたアプリケーションの設定ページに移動します。

次に[メタデータをダウンロードする][anchor-fetch-metadata]必要があります。これにより、Wallarm側で[SSOプロバイダーの設定を続行する][doc-metadata-transfer]ことができます。

メタデータは、SSOを設定するために必要なアイデンティティプロバイダーのプロパティを記述するパラメータのセットです（[ステップ1][doc-setup-sp]でサービスプロバイダー用に生成されたものと同様です）。## メタデータのダウンロード

メタデータは、XMLファイルまたはテキスト形式の「そのまま」でダウンロードできます（その後の設定でメタデータを手動で入力する必要があります）。

XMLファイルとしてダウンロードする方法：
1. 作成したアプリケーションの設定ページで、*Identity Provider metadata* リンクをクリックします：

    ![!Metadata download link][img-fetch-metadata-xml]
    
    その結果、次のような内容が表示される新しいタブがブラウザに表示されます：

    ![!Example of XML-formatted metadata][img-xml-metadata]
    
2. 内容をXMLファイルに保存します（ブラウザまたは他の適切な方法で）。

メタデータを「そのまま」ダウンロードする方法：
1. 作成したアプリケーションの設定ページで、*View Setup instructions* ボタンをクリックします。

    ![!The “View Setup instructions” button][img-fetch-metadata-manually]
    
2. 与えられたすべてのデータをコピーします。


これで、Wallarm側でSSOの設定を[続行することができます][doc-metadata-transfer]。