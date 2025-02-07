#   Step 2: G Suiteでのアプリケーションの作成と設定

[img-gsuite-console]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[img-create-attr-mapping]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-attr-mapping.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-gsuite-adm-console]:  https://admin.google.com

!!! info "前提条件"
    このガイドでは、以下の値がデモ用の値として使用されています:

    * **Application Name**パラメータに`WallarmApp`が設定されています(G Suite内)。
    * **ACS URL**パラメータに`https://sso.online.wallarm.com/acs`が設定されています(G Suite内)。
    * **Entity ID**パラメータに`https://sso.online.wallarm.com/entity-id`が設定されています(G Suite内)。

!!! warning
    [前のステップ][doc-setup-sp]で取得した実際の値に、**ACS URL**および**Entity ID**パラメータのサンプル値を置き換えることを確認してください。

Googleの[admin console][link-gsuite-adm-console]にログインしてください。*Apps*ブロックをクリックします。

![G Suite admin console][img-gsuite-console]

*SAML apps*ブロックをクリックします。*Add a service/App to your domain*リンクまたは右下の「+」ボタンをクリックして、新しいアプリケーションを追加してください。

*Setup my own custom app*ボタンをクリックします。

![Adding a new application to G Suite][img-gsuite-add-app]

G Suiteから、アイデンティティプロバイダーとして以下の情報（メタデータ）が提供されます:
*   **SSO URL**
*   **Entity ID**
*   **Certificate** (X.509)

メタデータは、SSOの設定に必要なアイデンティティプロバイダーのプロパティを記述したパラメータのセットです([Step 1][doc-setup-sp]でサービスプロバイダー用に生成されたものと同様です)。

これらの情報は、WallarmのSSOセットアップウィザードに次の2通りの方法で転送できます:
*   各パラメータをコピーし、証明書をダウンロードしてから、Wallarmセットアップウィザードの対応するフィールドに貼り付け（アップロード）ます。
*   メタデータを含むXMLファイルをダウンロードし、Wallarm側にアップロードます。

メタデータを任意の方法で保存し、*Next*をクリックしてアプリケーションの設定の次のステップに進んでください。Wallarm側でアイデンティティプロバイダーのメタデータを入力する方法は、[Step 3][doc-metadata-transfer]で説明します。

![Saving metadata][img-fetch-metadata]

アプリケーションの設定の次の段階では、サービスプロバイダー(Wallarm)のメタデータを提供します。必須のフィールドは以下のとおりです:
*   **ACS URL**は、Wallarm側で生成された**Assertion Consumer Service URL**パラメータに対応します。
*   **Entity ID**は、Wallarm側で生成された**Wallarm Entity ID**パラメータに対応します。

必要に応じて、残りのパラメータも入力してください。*Next*をクリックします。

![Filling in service provider information][img-fill-in-sp-data]

アプリケーションの設定の最終段階では、サービスプロバイダーの属性を利用可能なユーザープロファイルフィールドにマッピングするよう求められます。Wallarm(サービスプロバイダー)は属性マッピングの作成を要求します。

*Add new mapping*をクリックし、`email`属性を“Basic Information”グループ内の“Primary Email”ユーザープロファイルフィールドにマッピングしてください。

![Creating an attribute mapping][img-create-attr-mapping]

*Finish*をクリックします。

その後、ポップアップウィンドウで情報が保存されたことが通知され、SAML SSO設定を完了するために、管理パネルでアイデンティティプロバイダー(Google)のデータをアップロードする必要があると表示されます。*Ok*をクリックしてください。

その後、作成したアプリケーションのページにリダイレクトされます。
アプリケーションが作成されると、G Suite内のすべての組織で無効になっています。このアプリケーションのSSOを有効にするには、*Edit Service*ボタンをクリックしてください。

![Application page in G Suite][img-app-page]

**Service status**パラメータで*ON for everyone*を選択し、*Save*をクリックしてください。

これでWallarm側での[SSOの設定の続行][doc-metadata-transfer]が可能になります。