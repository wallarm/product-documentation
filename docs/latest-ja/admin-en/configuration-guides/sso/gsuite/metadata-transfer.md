#   ステップ3：G SuiteメタデータのWallarm設定ウィザードへの転送

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:               ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                   setup-idp.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

Wallarm ConsoleのG Suite SSO設定ウィザードに戻り、*次へ*をクリックして次の設定ステップに進みます。

この段階では、G Suiteサービスによって生成されたメタデータをWallarm SSO設定ウィザードに提供する必要があります。

メタデータの転送方法は2つあります:
*   [Wallarm設定ウィザードでメタデータのXMLファイルをアップロードします。][anchor-upload-metadata-xml]
*   [必要なパラメータを手動でWallarm設定ウィザードにコピー＆ペーストします。][anchor-upload-metadata-manually]


##  XMLファイルを使用してメタデータをアップロードする

以前にG Suiteでアプリケーションを設定する際にG SuiteのメタデータをXMLファイルとして保存した場合（[ステップ2][doc-setup-idp]参照）、*アップロード*ボタンをクリックし、必要なファイルを選択します。これは、ファイルマネージャーから「XML」アイコンにファイルをドラッグすることでも行うことができます。ファイルをアップロードした後、*次へ*をクリックして次のステップに進みます。

![!メタデータのアップロード][img-sp-wizard-transfer-metadata]


##  手動でパラメータをコピーする

以前にG Suiteでアプリケーションを設定する際に提供されたIDプロバイダのパラメータをコピーした場合、*手動で入力する*リンクをクリックして、コピーしたパラメータを手動で入力し、フォームを完成させます。 

G Suiteによって生成されたパラメータを、以下のようにWallarm設定ウィザードのフィールドに挿入します：

*   **SSO URL** → **IDプロバイダのSSO URL**
*   **エンティティID** → **IDプロバイダの発行者**
*   **証明書** → **X.509証明書**

*次へ*をクリックして次のステップに進みます。前のステップに戻りたい場合は、*戻る*をクリックします。

![!メタデータを手動で入力する][img-transfer-metadata-manually]


##  SSOウィザードの完了

Wallarm設定ウィザードの最終ステップでは、G Suiteサービスへのテスト接続が自動的に行われ、SSOプロバイダがチェックされます。

テストが正常に完了した後（すべての必要なパラメータが正しく記入されている場合）、設定ウィザードはG SuiteサービスがIDプロバイダとして接続され、ユーザの認証にSSOメカニズムを接続することができることを通知します。

*完了*ボタンをクリックしてSSOの設定を完了させるか、対応するボタンをクリックしてユーザーページでSSOを設定します。

![!SSOウィザードの完了][img-sp-wizard-finish]

SSO設定ウィザードを完了した後、Integrationタブで、G SuiteサービスがIDプロバイダとして接続され、他のSSOプロバイダは利用できないことが確認できます。

![!SSOウィザードを終了した後の「Integration」タブ][img-integration-tab]


次に、SSO設定プロセスの[次のステップ][doc-allow-access-to-wl]に進みます。