# ステップ3：G SuiteメタデータをWallarm設定ウィザードに転送する

[img-sp-wizard-transfer-metadata]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-transfer-metadata.png
[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-wizard-finish.png
[img-integration-tab]:               ../../../../images/admin-guides/configuration-guides/sso/gsuite/integration-tab.png

[doc-setup-idp]:                    setup-idp.ja.md
[doc-allow-access-to-wl]:           allow-access-to-wl.ja.md

[anchor-upload-metadata-xml]:       #uploading-metadata-using-an-xml-file
[anchor-upload-metadata-manually]:  #copying-parameters-manually

Wallarm Console の G Suite SSO 設定ウィザードに戻って、*次へ*をクリックして次の設定ステップに進みます。

この段階では、G Suite サービスによって生成されたメタデータを Wallarm SSO 設定ウィザードに提供する必要があります。

メタデータを転送するには2つの方法があります：
*   [Wallarm設定ウィザードでメタデータが含まれたXMLファイルをアップロードする][anchor-upload-metadata-xml]
*   [必要なパラメータをコピーして、Wallarm 設定ウィザードに手動で貼り付ける][anchor-upload-metadata-manually]

##  XMLファイルを使用してメタデータをアップロードする

以前に ([ステップ2][doc-setup-idp] で) G Suite のアプリケーションを設定する際に、G Suite のメタデータをXMLファイルとして保存した場合は、*アップロード* ボタンをクリックして、目的のファイルを選択します。また、「XML」アイコンにファイルマネージャからファイルをドラッグすることでもこれを行うことができます。ファイルをアップロードした後、*次へ* をクリックして次のステップに進みます。

![!Metadata uploading][img-sp-wizard-transfer-metadata]

##  パラメータを手動でコピーする

G Suite のアプリケーションを設定する際に、提供されたアイデンティティプロバイダのパラメータをコピーした場合は、*手動で入力* リンクをクリックして、コピーしたパラメータを手動で入力してフォームを記入します。

G Suite によって生成されたパラメータを、次のようにして Wallarm 設定ウィザードのフィールドに挿入します：

*   **SSO URL** → **アイデンティティプロバイダ SSO URL**
*   **エンティティID** → **アイデンティティプロバイダ発行者**
*   **証明書** → **X.509 証明書**

*次へ* をクリックして次のステップに進むか、*戻る* をクリックして前のステップに戻ります。

![!Entering the metadata manually][img-transfer-metadata-manually]

##  SSOウィザードの完了

Wallarm 設定ウィザードの最後のステップでは、G Suite サービスへのテスト接続が自動的に実行され、SSOプロバイダがチェックされます。

テストが成功した場合（必要なすべてのパラメータが正しく入力されている場合）、設定ウィザードは G Suite サービスがアイデンティティプロバイダとして接続され、ユーザーを認証する SSO メカニズムの接続を開始できることを通知します。

*完了* ボタンをクリックして SSO の設定を終了するか、対応するボタンをクリックしてユーザーページに移動し、SSO の設定に進みます。

![!Completing SSO wizard][img-sp-wizard-finish]

SSO 設定ウィザードが完了すると、「インテグレーション」タブに G Suite サービスがアイデンティティプロバイダとして接続され、他の SSO プロバイダは利用できないことが示されます。

![!The “Integration” tab after finishing the SSO wizard][img-integration-tab]


さあ、SSO 設定プロセスの[次のステップ][doc-allow-access-to-wl]に進みましょう。