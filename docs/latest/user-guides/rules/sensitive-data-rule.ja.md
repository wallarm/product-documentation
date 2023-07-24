[img-masking]:      ../../images/user-guides/rules/sensitive-data-rule.png

# データマスキングのルール

Wallarmノードは以下のデータをWallarm Cloudに送信します。

* 攻撃のあるシリアル化されたリクエスト
* Wallarmシステムカウンター
* システム統計：CPU負荷、RAM使用量など
* Wallarmシステム統計：処理されたNGINXリクエストの数、Tarantool統計など
* Wallarmがアプリケーション構造の検出に正確に使用するために必要なトラフィックの性質に関する情報

いくつかのデータは、処理されるサーバーの外部に転送しないでください。通常、このカテゴリには、認証（クッキー、トークン、パスワード）、個人データ、および支払い情報が含まれます。

Wallarmノードは、リクエストでのデータマスキングをサポートしています。このルールは、リクエストをポストアナリティクスモジュールおよびWallarm Cloudに送信する前に指定されたリクエストポイントの元の値を切り取ります。この方法により、機密データが信頼できる環境の外部に漏れることがありません。

攻撃の表示、アクティブ攻撃（脅威）検証、およびブルートフォース攻撃の検出に影響を与えることがあります。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

## 例：クッキー値のマスキング

以下の条件が適用される **場合**：

* アプリケーションは *example.com* ドメインでアクセス可能
* アプリケーションはユーザー認証に *PHPSESSID* クッキーを使用
* セキュリティポリシーでは、Wallarmを使用する従業員がこの情報にアクセスすることを禁じている

**その場合**、このクッキーのデータマスキングルールを作成するには、次の操作を行う必要があります。

1. *Rules* タブに移動します
1. `example.com/**/*.*` のブランチを見つけて、*Add rule* をクリックします
1. *Mask sensitive data* を選択します
1. *Header* パラメーターを選択し、その値として `COOKIE` を入力します。*cookie* パラメータを選択し、*in this part of request* の後にその値として `PHPSESSID` を入力します

    --8<-- "../include-ja/waf/features/rules/request-part-reference.md"

1. *Create* をクリックします

![!Marking sensitive data][img-masking]