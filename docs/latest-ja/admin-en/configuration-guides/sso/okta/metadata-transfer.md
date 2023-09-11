# ステップ3：OktaメタデータをWallarm設定ウィザードに転送する

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

Wallarm ConsoleのOkta SSO設定ウィザードに戻り、*次へ*をクリックして次の設定ステップに進みます。

このステップでは、Oktaサービスが[生成した][link-metadata]メタデータを提供する必要があります。

IDプロバイダのメタデータ（この場合はOkta）をWallarm設定ウィザードに渡す方法は2つあります：
* メタデータのXMLファイルをアップロードする。

    *アップロード*ボタンをクリックし、適切なファイルを選択してXMLファイルをアップロードします。または、ファイルマネージャから“XML”アイコンフィールドにファイルをドラッグすることもできます。

* メタデータを手動で入力する。

    *手動で入力*リンクをクリックし、次のようにOktaサービスのパラメータを設定ウィザードのフィールドにコピーします：
    
    *   **Identity Provider Single Sign‑On URL**を**Identity provider SSO URL**フィールドに。
    *   **Identity Provider Issuer**を**Identity provider issuer**フィールドに。
    *   **X.509 Certificate**を**X.509 Certificate**フィールドに。
    
    ![メタデータを手動で入力する][img-transfer-metadata-manually]
    
次のステップに進むには*次へ*をクリックします。前のステップに戻りたい場合は*戻る*をクリックします。

##  SSOウィザードの完了

Wallarm設定ウィザードの最終ステップでは、Oktaサービスへのテスト接続が自動的に行われ、SSOプロバイダが確認されます。

テストが成功した場合（必要なすべてのパラメータが正しく入力されている場合）、設定ウィザードはOktaサービスがIDプロバイダとして接続されたこと、そしてユーザーを認証するためのSSOメカニズムの接続を開始できることをお知らせします。

*完了*ボタンをクリックするか、対応するボタンをクリックしてユーザーページに移動してSSOを設定します。

![SSOウィザードを完了する][img-sp-wizard-finish]

SSO設定ウィザードを完了した後、*インテグレーション*タブにOktaサービスがIDプロバイダとして接続され、他のSSOプロバイダは利用できないことが表示されます。

![SSOウィザード終了後の“インテグレーション”タブ][img-integration-tab]

これで、SSO設定プロセスの[次のステップ][doc-allow-access-to-wl]に進みます。