# ステップ2：G Suiteでのアプリケーションの作成と設定

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
    このガイドでは、次の値がデモンストレーション値として使用されています。
    
    * `WallarmApp`はG Suiteの**アプリケーション名**パラメータの値です。
    * `https://sso.online.wallarm.com/acs`はG Suiteの**ACS URL**パラメータの値です。
    * `https://sso.online.wallarm.com/entity-id`はG Suiteの**Entity ID**パラメータの値です。

!!! warning
    [前のステップ][doc-setup-sp]で取得した**ACS URL**および**Entity ID**パラメータのサンプル値と、実際の値を置き換えてください。

Google [管理コンソール][link-gsuite-adm-console]にログインします。「*Apps*」ブロックをクリックします。

![!G Suite管理コンソール][img-gsuite-console]

「*SAML apps*」ブロックをクリックします。新しいアプリケーションを追加するには、「*Add a service/App to your domain*」リンクまたは右下の「+」ボタンをクリックします。

「*Setup my own custom app*」ボタンをクリックします。

![!G Suiteに新しいアプリケーションを追加する][img-gsuite-add-app]

G Suite（認証プロバイダとして）からメタデータを提供されます。
*   **SSO URL**
*   **Entity ID**
*   **Certificate**（X.509）

メタデータは、SSOの設定に必要な認証プロバイダのプロパティを記述するパラメータのセットであり、（[ステップ1][doc-setup-sp]のサービスプロバイダに対して生成されたものと同様です）。

それらは、2つの方法でSSO Wallarm設定ウィザードに転送できます。
*   各パラメータをコピーし、証明書をダウンロードしてから、Wallarm設定ウィザードの対応するフィールドに貼り付け（アップロード）します。
*   メタデータのXMLファイルをダウンロードし、Wallarm側でアップロードします。

好きな方法でメタデータを保存し、「*Next*」をクリックしてアプリケーションの設定の次のステップに進みます。 Wallarm側での認証プロバイダのメタデータ入力は、 [ステップ3][doc-metadata-transfer]で説明されています。

![!メタデータの保存][img-fetch-metadata]
 
アプリケーションの設定の次のステージでは、サービスプロバイダ（Wallarm）のメタデータを提供する必要があります。必須フィールド：
* **ACS URL**は、Wallarm側で生成された**Assertion Consumer Service URL**パラメータに対応します。
* **Entity ID**は、Wallarm側で生成された**Wallarm Entity ID**パラメータに対応します。

必要に応じて残りのパラメータを入力し、「*Next*」をクリックします。

![!サービスプロバイダ情報の入力][img-fill-in-sp-data]

最終ステージで、サービスプロバイダの属性を利用可能なユーザープロファイルフィールドにマッピングするよう求められます。 Wallarm（サービスプロバイダとして）は、属性マッピングの作成が必要です。

「*Add new mapping*」をクリックし、「email」属性を「基本情報」グループ内の「Primary Email」ユーザープロファイルフィールドにマップします。

![!属性マッピングの作成][img-create-attr-mapping]

「*Finish*」をクリックします。

提供された情報が保存されたことが、ポップアップウィンドウで通知されます。SAML SSO設定を完了するには、サービスプロバイダ（Wallarm）の管理パネルで、認証プロバイダ（Google）に関するデータをアップロードする必要があります。「*Ok*」をクリックしてください。

その後、作成されたアプリケーションのページにリダイレクトされます。
アプリケーションが作成されると、G Suiteのすべての組織に対して無効になります。このアプリケーションに対するSSOを有効にするには、「*Edit Service*」ボタンをクリックします。

![!G Suiteでのアプリケーションページ][img-app-page]

**Service status**パラメータに「*ON for everyone*」を選択し、「*Save*」をクリックします。

これで、Wallarm側で[SSOの設定を続ける][doc-metadata-transfer]ことができます。