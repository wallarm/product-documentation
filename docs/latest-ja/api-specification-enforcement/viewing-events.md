# API仕様適用が原因となるイベントの表示 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API仕様を[アップロード](setup.md)し、仕様に基づくセキュリティポリシーの適用の設定を行った直後から、これらのポリシーがリクエストに適用され始めます。本記事ではWallarm Consoleでポリシー違反となるリクエストの確認および解析方法について説明します。

## ポリシー違反リクエストの統計情報

ポリシー違反の傾向を把握するため、Wallarm Consoleの**API Specifications**→your specification→**Policy violations**列に表示される仕様違反数をご確認ください。このデータは過去7日間の動向を示します。

この数値をクリックすると、**Attacks**セクションで詳細が確認できます。

## ポリシー違反リクエストの分析

**Attacks**セクションでは、仕様に基づくポリシー違反に関連するイベントを見つけるため、[適切な検索キー](../user-guides/search-and-filters/use-search.md#spec-violation-tags)または該当するフィルターを使用してください。

ブロックされたイベントおよびモニタリングされたイベントが、設定されたポリシー違反アクションに応じて表示される場合があります。イベント詳細には、違反の種類と原因となった仕様へのリンクが表示されます。

![仕様―セキュリティポリシーの適用に使用](../images/api-specification-enforcement/api-specification-enforcement-events.png)

## 上限超過イベント

ご自身の仕様ポリシーに関連するイベントを表示する際、リクエスト処理中にAPI Specification Enforcementに適用される制限に関連する**Specification processing overlimit**タイプのイベントが発生する場合があります。詳細および実施可能なアクションの説明については[こちら](overview.md#how-it-works)をご参照ください。

**Attacks**セクションでは、上限超過イベントは`processing_overlimit`検索キーまたは**Processing overlimit**フィルターを使用して見つけることができます。