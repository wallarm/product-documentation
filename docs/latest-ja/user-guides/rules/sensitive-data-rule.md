[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Masking Sensitive Data

リクエスト内のセンシティブデータが、お客様のインフラ内において安全に保たれ、[Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works)を含む第三者サービスへ送信されないことが重要です。この目的は、[shared responsibility model](../../about-wallarm/shared-responsibility.md)を用いることで達成されます。Wallarm側では悪質なリクエストに関するデータ以外は一切送信しないため、センシティブデータが漏洩する可能性は極めて低くなっています。一方で、お客様側でセンシティブデータのマスキングを実施する必要があり、これにより保護された情報フィールドが決してセキュリティパリメーターの外へ流出しない運用が保証されます。

Wallarmはデータマスキングを構成するために、**Mask sensitive data** [rule](../rules/rules.md)を提供します。Wallarmノードは、以下のデータをWallarm Cloudに送信します。

* 攻撃が含まれたシリアライズ済みリクエスト
* Wallarmシステムカウンター
* システム統計情報：CPU負荷、RAM使用量など
* Wallarmシステム統計情報：処理済みNGINXリクエスト数、Tarantool統計など
* アプリケーション構造を正しく検出するためにWallarmが必要とするトラフィックの性質に関する情報

**Mask sensitive data**ルールは、postanalyticsモジュールおよびWallarm Cloudへリクエストを送信する前に、指定されたリクエストポイントの元の値を切り詰めます。この方法により、センシティブデータが信頼できる環境の外部へ漏洩することが防がれます。

この設定は、攻撃の表示、攻撃（脅威）のアクティブな検証、およびブルートフォース攻撃の検出に影響を及ぼす可能性があります。

## ルールの作成と適用

データマスクを設定して適用するには:

--8<-- "../include/rule-creation-initial-step.md"
1. **Change requests/responses** → **Mask sensitive data** を選択します。
1. **If request is** において、ルールを適用する範囲を[記述します](rules.md#configuring)。
1. **In this part of request** にて、元の値を切り詰める対象となる[リクエストポイント](request-processing.md)を指定します。
1. [フィルタリングノードへのルールコンパイルおよびアップロードが完了する](rules.md#ruleset-lifecycle)までお待ちください。

## 例：クッキー値のマスキング

例えば、`example.com`ドメインで利用可能なアプリケーションがユーザー認証に`PHPSESSID`クッキーを使用しており、Wallarmを利用する従業員がこの情報にアクセスできないようにしたい場合は、スクリーンショットに表示されているように、**Mask sensitive data**ルールを設定してください。

--8<-- "../include/waf/features/rules/request-part-reference.md"

![センシティブデータのマスキング][img-masking]