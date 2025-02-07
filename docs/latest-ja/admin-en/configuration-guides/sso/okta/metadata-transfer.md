# ステップ 3：OktaメタデータをWallarmセットアップウィザードへ転送する

[img-transfer-metadata-manually]:   ../../../../images/admin-guides/configuration-guides/sso/okta/transfer-metadata-manually.png
[img-sp-wizard-finish]:             ../../../../images/admin-guides/configuration-guides/sso/okta/sp-wizard-finish.png
[img-integration-tab]:              ../../../../images/admin-guides/configuration-guides/sso/okta/integration-tab.png

[doc-allow-access-to-wl]:           allow-access-to-wl.md

[link-metadata]:                    setup-idp.md#downloading-metadata

Wallarm ConsoleのOkta SSOセットアップウィザードに戻り*Next*をクリックして次のセットアップステップに進んでください。

このステップでは、Oktaサービスによって[生成された][link-metadata]メタデータを提供する必要があります。

IdPメタデータ（この場合はOkta）をWallarmセットアップウィザードに渡す方法は2種類あります：
*   メタデータが含まれるXMLファイルをアップロードする方法

    XMLファイルをアップロードするには*Upload*ボタンをクリックし、適切なファイルを選択してください。ファイルマネージャーからファイルを“XML”アイコンフィールドにドラッグすることも可能です。

*   メタデータを手動で入力する方法

    *Enter manually*リンクをクリックし、Oktaサービスのパラメータを以下のセットアップウィザードのフィールドにコピーしてください：
    
    *   **Identity Provider Single Sign‑On URL**を**Identity provider SSO URL**フィールドに入力してください。
    *   **Identity Provider Issuer**を**Identity provider issuer**フィールドに入力してください。
    *   **X.509 Certificate**を**X.509 Certificate**フィールドに入力してください。
    
    ![メタデータを手動で入力する][img-transfer-metadata-manually]
    
*Next*をクリックして次のステップに進んでください。前のステップに戻るには*Back*をクリックしてください。


## SSOウィザードの完了

Wallarmセットアップウィザードの最終ステップでは、自動的にOktaサービスへのテスト接続が実行され、SSOプロバイダーがチェックされます。

必要なパラメータがすべて正しく入力された場合、テストが正常に完了するとセットアップウィザードはOktaサービスがIdPとして接続されていることを通知し、ユーザー認証のためにSSOメカニズムを接続することができます。

SSOの設定を完了するには*Finish*ボタンをクリックするか、ユーザーページに移動して対応するボタンをクリックしてください。

![SSOウィザードの完了][img-sp-wizard-finish]

SSO構成ウィザードの完了後、*Integration*タブに移動すると、OktaサービスがIdPとして接続されており、他のSSOプロバイダーが利用できないことが表示されます。

![「Integration」タブ（SSOウィザード完了後）][img-integration-tab]


次のステップは[こちら][doc-allow-access-to-wl]からご確認ください。