# API Specification Enforcementによって発生したイベントの表示 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

仕様に基づくセキュリティポリシーの適用に使用するAPI仕様を[アップロード](setup.md)し、エンフォースメントを構成すると、ポリシーの適用がリクエストに対して開始されます。本記事では、Wallarm Consoleでポリシーに違反したリクエストを表示および分析する方法を説明します。

## ポリシー違反リクエストの統計

ポリシー違反の傾向を把握するには、Wallarm Consoleの**API Specifications**→対象の仕様→**Policy violations**列に表示される仕様違反件数を確認します。このデータは直近7日間の状況を示します。

この数値をクリックすると、**Attacks**セクションで詳細を確認できます。

## ポリシー違反リクエストの分析

**Attacks**セクションでは、仕様に基づくポリシー違反に関連するイベントを見つけるために、[該当する検索キー](../user-guides/search-and-filters/use-search.md#spec-violation-tags)または対応するフィルターを使用します。

設定したポリシー違反時のアクションに応じて、ブロックされたイベントや監視対象のイベントが表示される場合があります。イベントの詳細には、違反の種類と原因となった仕様へのリンクが表示されます。

![仕様 - セキュリティポリシー適用に使用](../images/api-specification-enforcement/api-specification-enforcement-events.png)

## 上限超過イベント

対象の仕様ポリシーに関連するイベントを表示する際、リクエストを処理する間にAPI Specification Enforcementに適用される制限に関連した**Specification processing overlimit**という種類のイベントが表示されることがあります。詳細と可能な対処方法の説明は[こちら](overview.md#how-it-works)を参照してください。

**Attacks**セクションでは、上限超過イベントは`processing_overlimit`検索キーまたは**Processing overlimit**フィルターで見つけることができます。