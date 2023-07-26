# API仕様のアップロード <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

WallarmコンソールUIの**API Specifications**セクションでは、WallarmがシャドウAPIを見つけるために使用するAPI仕様を保持できます。この記事では、このセクションの使用方法について情報を提供します。

**管理者**と**グローバル管理者**は仕様の追加、削除、ダウンロードおよびシャドウAPI検出の設定変更ができます。他の[役割](../user-guides/settings/users.md#user-roles)のユーザーは、アップロードされた仕様のリストのみを閲覧できます。

## シャドウAPIの検出

[**API Discovery**](../about-wallarm/api-discovery.md)を使用して、**API Specifications**セクションにアップロードされたAPI仕様がAPI Discoveryによって自動的に検出されたものと比較される可能性があります。この比較の結果、Wallarmは[見つけて**シャドウAPI**を表示します](../about-wallarm/api-discovery.md#shadow-api) - Wallarmによって発見されましたが、あなたの仕様には存在しないエンドポイント（欠落しているエンドポイント）。

比較を行うには：

1. **API Specifications**セクションに移動し、**Upload specification**をクリックします。
1. アップロードする仕様を選択します。OpenAPI 3.0 JSONまたはYAML形式でなければなりません。
1. 比較パラメータを設定します：

    * アプリケーションとホスト - 選択したアプリケーション/ホストに関連するエンドポイントのみが比較されます。**Compare with all current and future discovered applications hosts**を選択した場合、現在知られているすべてのホスト（選択したアプリケーション）および将来発見されるすべてのホストが比較に含まれます。

        あなたはいつでも比較設定を変更することができます - その後、比較が再度実行され、新しい結果が提供されます。

    * どこからアップロードするか：あなたのローカルマシンまたはURL。URLの場合、ヘッダーフィールドを通じて認証のためのトークンを指定できます。
    * 比較は仕様のアップロード後に一度だけ行うべきか、または毎時行うべきか（**Perform regular comparison**オプションはデフォルトで選択されています）。毎時の比較により、API Discoveryがより多くのエンドポイントを見つけると、追加のシャドウAPIが見つかります。URLからアップロードされた仕様は、各比較の前に更新されます。

    ![!API Discovery - API Specifications - uploading API specification to find shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    仕様メニュー→**Restart comparison**でいつでも手動で比較を再開できることを覚えておいてください。

1. アップロードを開始します。

    アップロードが完了すると、**API Specifications**のリストにある各仕様に対するシャドウAPIの数が表示されます。また、見つかった一意のシャドウAPIの総数も表示されます。さらに、シャドウAPIは**API Discovery**セクションの[表示](api-discovery.md#displaying-shadow-api)されます。

    ![!API Specifications section](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

## 前にアップロードした仕様のダウンロード

あなたは**API Specifications**→仕様詳細ウィンドウ→**Download specification**で以前にアップロードした仕様をダウンロードできます。