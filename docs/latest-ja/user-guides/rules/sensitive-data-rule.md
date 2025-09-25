[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# 機密データのマスキング

[ハイブリッド](../../about-wallarm/shared-responsibility.md#overview)のWallarmインストールにおいて、貴社のインフラ内でWallarmフィルタリングノードを管理し、WallarmがWallarm Cloudコンポーネントを管理する場合、リクエスト内の機密データが貴社のインフラ内で安全に保たれ、[Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works)を含むいかなる第三者サービスにも送信されないことが極めて重要です。この目的は[共有責任モデル](../../about-wallarm/shared-responsibility.md)によって実現します。Wallarm側では、悪意のあるリクエストに関するデータ以外は送信しないため、機密データが露出する可能性は極めて低くなります。貴社側では、機密データのマスキングを行うことが期待されており、これにより保護すべき情報フィールドがセキュリティ境界の外へ決して出ないことをさらに保証します。

!!! info "その他のデプロイ形態"
    **on-premise**[インストール](../../about-wallarm/shared-responsibility.md#overview)ではデータはセキュリティ境界の外へ出ることはなく、**security edge**ではすべてのデータがこのセキュリティ境界の外にありますが、Wallarm Consoleユーザーによる機密データへのアクセスを制限するためにマスキングルールを引き続き使用できます。

Wallarmはデータマスキングを構成するための**Mask sensitive data**[ルール](../rules/rules.md)を提供します。Wallarmノードは以下のデータをWallarm Cloudに送信します。

* 攻撃を含むシリアライズされたリクエスト
* Wallarmシステムカウンター
* システム統計（CPU負荷、RAM使用量など）
* Wallarmシステム統計（処理済みNGINXリクエスト数、wstoreの統計など）
* アプリケーション構造を正しく検出するためにWallarmが必要とする、トラフィックの性質に関する情報

**Mask sensitive data**ルールは、postanalyticsモジュールおよびWallarm Cloudへリクエストを送信する前に、指定されたリクエストポイントの元の値をマスクします。この方法により、機密データが信頼できる環境の外へ漏洩しないことを確実にします。

これは、攻撃の表示やブルートフォース攻撃の検出に影響する場合があります。

## ルールの作成と適用

データマスクを設定して適用するには：

--8<-- "../include/rule-creation-initial-step.md"
1. **Change requests/responses** → **Mask sensitive data**を選択します。
1. **If request is**で、このルールを適用する対象範囲を[記述](rules.md#configuring)します。
1. **In this part of request**で、元の値をマスクする対象となる[リクエストポイント](request-processing.md)を指定します。
1. [ルールのコンパイルとフィルタリングノードへのアップロードの完了](rules.md#ruleset-lifecycle)を待ちます。

## 例：Cookie値のマスキング

たとえば、`example.com`ドメインで公開されているアプリケーションがユーザー認証に`PHPSESSID` Cookieを使用しており、Wallarmを使用する従業員にこの情報へのアクセスを許可したくないとします。

その場合は、スクリーンショットのとおりに**Mask sensitive data**ルールを設定します。

--8<-- "../include/waf/features/rules/request-part-reference.md"

![機密データのマスキング][img-masking]