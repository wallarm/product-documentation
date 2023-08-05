[img-masking]: ../../images/user-guides/rules/sensitive-data-rule.png

# データマスキングのルール

Wallarmノードは以下のデータをWallarmクラウドに送信します：

* 攻撃のあるシリアライズされたリクエスト
* Wallarmシステムカウンタ
* システム統計：CPUの負荷、RAMの使用率など
* Wallarmシステム統計：処理されたNGINXリクエストの数、Tarantool統計など
* Wallarmがアプリケーション構造を正しく検出するために必要なトラフィックの性質の情報

一部のデータは、それが処理されているサーバーの外部には転送されるべきではありません。通常、このカテゴリーには認証（クッキー、トークン、パスワード）、個人データ、および支払い情報が含まれます。

Wallarm Nodeはリクエストにおけるデータマスキングをサポートしています。このルールは、リクエストをpostanalyticsモジュールおよびWallarmクラウドに送信する前に指定されたリクエストポイントの元の値をカットします。この方法は、機密データが信頼できる環境の外部に漏れ出ることがないことを保証します。

これにより、攻撃の表示、アクティブな攻撃（脅威）の検証、およびブルートフォース攻撃の検出に影響を与える可能性があります。

## ルールの作成と適用

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## 例：Cookie値のマスキング

**もし**以下の条件が満たされている場合：

* アプリケーションはドメイン*example.com*で利用可能
* アプリケーションはユーザー認証に*PHPSESSID*クッキーを使用
* セキュリティポリシーはWallarmを使用する従業員からのこの情報へのアクセスを拒否

**その後**、このクッキーのデータマスキングルールを作成するためには、以下のアクションが必要です：

1. *Rules*タブに移動
1. `example.com/**/*.*`のブランチを見つけて、*Add rule*をクリック
1. *Mask sensitive data*を選択
1. *Header*パラメータを選択し、その値として`COOKIE`を入力；*cookie*パラメータを選択し、*in this part of request*の後に`PHPSESSID`を入力

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. *Create*をクリック

![!機微なデータをマーク][img-masking]