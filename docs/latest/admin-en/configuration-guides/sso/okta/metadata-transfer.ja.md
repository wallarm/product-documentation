# ステップ3：OktaメタデータをWallarmセットアップウィザードに転送する

[img-transfer-metadata-manually]: ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]: ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]: ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]: allow-access-to-wl.md

[link-metadata]: setup-idp.md#downloading-metadata

Wallarm ConsoleのOkta SSOセットアップウィザードに戻り、*次へ*をクリックして次の設定手順に進みます。

このステップでは、Oktaサービスによって[生成された][link-metadata]メタデータを提供する必要があります。

WallarmセットアップウィザードにIDプロバイダー（この場合はOkta）のメタデータを渡す方法は2つあります：

* メタデータのXMLファイルをアップロードする。

    ＊アップロード＊ボタンをクリックし、適切なファイルを選択してXMLファイルをアップロードします。また、ファイルマネージャから＊XML＊アイコンフィールドにファイルをドラッグしてこれを行うこともできます。

* メタデータを手動で入力する。

    *手動で入力*リンクをクリックし、Oktaサービスのパラメータをセットアップウィザードのフィールドに以下のようにコピーしてください：

    *   **Identity Provider Single Sign‑On URL** を **Identity provider SSO URL**フィールドに。
    *   **Identity Provider Issuer** を **Identity provider issuer**フィールドに。
    *   **X.509 Certificate** を **X.509証明書**フィールドに。
    
    ![!メタデータを手動で入力する][img-transfer-metadata-manually]

*次へ*をクリックして次のステップに進むか、*戻る*をクリックして前のステップに戻ります。


##  SSOウィザードの完了

Wallarmセットアップウィザードの最終ステップでは、Oktaサービスへのテスト接続が自動的に行われ、SSOプロバイダーがチェックされます。

テストが成功し（必要なすべてのパラメータが正しく入力されている場合）、セットアップウィザードでOktaサービスがIDプロバイダーとして接続されていることが通知され、ユーザーの認証にSSOメカニズムを接続することができます。

＊完了＊ボタンをクリックしてSSOの設定を終了するか、対応するボタンをクリックしてユーザーページに移動してSSOを設定します。

![!SSOウィザードの完了][img-sp-wizard-finish]

SSO設定ウィザードを完了すると、*インテグレーション*タブで、OktaサービスがIDプロバイダーとして接続されており、他のSSOプロバイダーは利用できないことがわかります。

![!SSOウィザード完了後の「統合」タブ][img-integration-tab]

これで、SSO設定プロセスの[次のステップ][doc-allow-access-to-wl]に進むことができます。