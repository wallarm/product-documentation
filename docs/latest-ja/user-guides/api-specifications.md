# API仕様のアップロード <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Console UIの**API仕様**セクションでは、WallarmがシャドウAPIを検出するために使用するAPI仕様を保管できます。この記事では、このセクションの使用方法について説明します。

**管理者**および**グローバル管理者**は、仕様の追加、削除、ダウンロード、およびシャドウAPI検出の設定変更が可能です。他の[役割](../user-guides/settings/users.md#user-roles)を持つユーザーは、アップロードされた仕様のリストのみを表示することができます。

## シャドウAPIの検出

[**API Discovery**](../api-discovery/overview.md)を使用している場合、**API仕様**セクションでアップロードしたAPI仕様は、API Discoveryによって自動的に検出されたものと比較されるかもしれません。比較の結果、Wallarmはあなたの仕様書には存在しない、Wallarmによって発見されたエンドポイント（欠落しているエンドポイント）である [シャドウAPIを見つけて表示します](../api-discovery/rogue-api.md#shadow-api)。

比較を行う手順は以下の通りです:

1. **API仕様**セクションに移動し、**仕様をアップロード**をクリックします。
1. アップロードする仕様を選択します。OpenAPI 3.0のJSONまたはYAML形式である必要があります。
1. 比較パラメータを設定します:

    * アプリケーションとホスト: 選択したアプリケーション/ホストに関連するエンドポイントのみが比較されます。 **すべての現在および未来のアプリケーションホストと比較する**を選択すると、現在知られているすべてのホスト（選択したアプリケーションの）と未来に発見されるすべてのホストが比較に含まれます。

        比較設定は、後からいつでも変更することができます - これにより、比較が再度行われ、新しい結果が提供されます。

    * アップロード元: ご自身のローカルマシンまたはURL。URLの場合、ヘッダーフィールドを介して認証のためのトークンを指定できます。
    * 比較は、仕様のアップロード直後に一度だけ行うか、毎時行うかを選択します（**定期的な比較を行う**オプションはデフォルトで選択されます）。毎時に行う比較により、API Discoveryがさらにエンドポイントを発見すると、追加のシャドウAPIを見つけることができます。URLからアップロードした仕様は、各比較の前に更新されます。

    ![API Discovery - API Specifications - uploading API specification to find shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    仕様メニュー → **比較の再開** から、手動で比較を再開することができることに注意してください。

1. アップロードを開始します。

    アップロードが完了すると、各仕様のシャドウAPIの数が**API仕様**のリストに表示されます。また、発見されたユニークなシャドウAPIの総数も表示されます。シャドウAPIは**API Discovery**セクションでも[表示されます](../api-discovery/rogue-api.md)。

    ![API Specifications section](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

## 以前にアップロードした仕様のダウンロード

**API仕様** → 仕様詳細ウィンドウ → **仕様をダウンロード** を通じて、以前にアップロードした仕様をダウンロードすることができます。