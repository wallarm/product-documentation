# ステップ2：G Suite内でのアプリケーション作成および設定

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
    このガイドでは、以下の値がデモンストレーションの値として使用されています。

    ＊ **アプリケーション名**パラメータの値として`WallarmApp`（G Suite内）。
    ＊ **ACS URL**パラメータの値として`https://sso.online.wallarm.com/acs`（G Suite内）。
    ＊ **エンティティID**パラメータの値として`https://sso.online.wallarm.com/entity-id`（G Suite内）。

!!! warning
    **ACS URL**および**エンティティID**パラメータのサンプル値を、[前のステップ][doc-setup-sp]で取得した実際の値に置き換えてください。

Google [管理コンソール][link-gsuite-adm-console]にログインします。*アプリケーション*ブロックをクリックします。

![G Suite管理コンソール][img-gsuite-console]

*SAMLアプリケーション*ブロックをクリックします。右下の*ドメインにサービス/アプリケーションを追加する*リンクまたは“+”ボタンをクリックして新しいアプリケーションを追加します。

*独自のカスタムアプリを設定する*ボタンをクリックします。

![G Suiteに新しいアプリケーションを追加します][img-gsuite-add-app]

あなたのIDプロバイダとしてG Suiteから情報（メタデータ）が提供されます：
*   **SSO URL**
*   **エンティティID**
*   **証明書**（X.509）

メタデータは、SSOの設定に必要なIDプロバイダのプロパティを記述する一種の情報です（[ステップ1][doc-setup-sp]でサービスプロバイダに生成されたものと同様）。

SSO Wallarm設定ウィザードへそれらを2つの方法で転送できます：
* 各パラメータをコピーし、証明書をダウンロードしてから、Wallarm設定ウィザードの対応するフィールドにペースト（アップロード）します。
* XMLメタデータファイルをダウンロードして、Wallarm側でアップロードします。

好きな方法でメタデータを保存し、*次へ*をクリックしてアプリケーションの次の設定ステップに進みます。 Wallarm側にIDプロバイダのメタデータを入力する方法は[ステップ3][doc-metadata-transfer]で説明されます。

![メタデータを保存します][img-fetch-metadata]

アプリケーションの設定の次のステップは、サービスプロバイダ（Wallarm）のメタ情報を提供することです。必要なフィールド：
*   **ACS URL**はWallarm側で生成された**Assertion Consumer Service URL**パラメータに対応します。
*   **エンティティID**はWallarm側で生成された**WallarmエンティティID**パラメータに対応します。

必要に応じて残りのパラメータを入力します。*次へ*をクリックします。

![サービスプロバイダ情報を記入します][img-fill-in-sp-data]

アプリケーションの設定の最終段階では、サービスプロバイダの属性と利用可能なユーザープロファイルフィールド間のマッピングを提供するように求められます。 Wallarm（サービスプロバイダ）では、属性マッピングを作成する必要があります。

*新しいマッピングを追加*をクリックし、「基本情報」グループ内の「Primary Email」というユーザプロファイルフィールドに`email`属性をマッピングします。

![属性マッピングを作成します][img-create-attr-mapping]

*完了*をクリックします。

その後、ポップアップウィンドウに提供された情報が保存され、SAML SSO設定を完了するためには、サービスプロバイダの管理パネル（Wallarm）にIDプロバイダ（Google）のデータをアップロードする必要があることが表示されます。*OK*をクリックします。

その後、作成されたアプリケーションのページにリダイレクトされます。
アプリケーションが作成されると、G Suite内のすべての組織に対して無効になります。このアプリケーションでSSOを有効にするには、*サービスの編集*ボタンをクリックします。

![G Suiteにおけるアプリケーションのページ][img-app-page]

**サービスステータス**パラメータに対して、*全員にオン*を選択し*保存*をクリックします。

現在、Wallarm側で[SSOの設定を続ける][doc-metadata-transfer]ことができます。