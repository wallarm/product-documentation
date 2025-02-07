# Step 3: G SuiteのメタデータをWallarmセットアップウィザードに転送する

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:               ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

Wallarm ConsoleのG Suite SSOセットアップウィザードに戻り、*Next*をクリックして次のセットアップステップに進みます。

この段階では、G Suiteサービスによって生成されたメタデータをWallarm SSOセットアップウィザードに提供する必要があります。

メタデータの転送方法は2通りあります：
*   [WallarmセットアップウィザードでXMLファイルをアップロードする。][anchor-upload-metadata-xml]
*   [Wallarmセットアップウィザードに必要なパラメータを手動でコピー＆ペーストする。][anchor-upload-metadata-manually]


##  XMLファイルを使用したメタデータのアップロード

以前にG Suiteでアプリケーションを設定するときにメタデータをXMLファイルとして保存している場合（[Step 2][doc-setup-idp]）、*Upload*ボタンをクリックして目的のファイルを選択します。ファイルマネージャーからファイルを「XML」アイコンにドラッグしても実行できます。ファイルをアップロードした後、*Next*をクリックして次のステップに進みます。

![メタデータのアップロード][img-sp-wizard-transfer-metadata]


##  パラメータの手動コピー

G Suiteでアプリケーションを設定するときに提供されたIDプロバイダーのパラメータをコピーしている場合、*Enter manually*リンクをクリックしてコピーしたパラメータを手動で入力し、フォームに記入してください。

G Suiteで生成されたパラメータをWallarmセットアップウィザードの各フィールドに以下のように入力します：

*   **SSO URL** → **Identity provider SSO URL**
*   **Entity ID** → **Identity provider issuer**
*   **Certificate** → **X.509 Certificate**

*Next*をクリックして次のステップに進みます。前のステップに戻る場合は*Back*をクリックしてください。

![メタデータを手動で入力][img-transfer-metadata-manually]


##  SSOウィザードの完了

Wallarmセットアップウィザードの最終ステップでは、G Suiteサービスへのテスト接続が自動で実行され、SSOプロバイダーが確認されます。

すべての必要なパラメータが正しく入力されテストが正常に完了すると、セットアップウィザードはG SuiteサービスがIDプロバイダーとして接続され、ユーザー認証のためにSSOメカニズムを接続できることを通知します。

*Finish*ボタンをクリックしてSSOの構成を完了するか、該当するボタンをクリックしてユーザーページに移動し、SSOの構成を行います。

![SSOウィザードの完了][img-sp-wizard-finish]

SSO構成ウィザードを完了すると、IntegrationタブにG SuiteサービスがIDプロバイダーとして接続され、他のSSOプロバイダーが存在しないことが表示されます。

![SSOウィザード完了後の「Integration」タブ][img-integration-tab]

次に、SSO構成プロセスの[次のステップ][doc-allow-access-to-wl]に移動してください。