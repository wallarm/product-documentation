# 重要なビジネスフロー <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

この重要なビジネスフロー機能により、Wallarmの[API Discovery](overview.md)は認証、アカウント管理、請求などのビジネスフローや機能にとって重要なエンドポイントを自動的に識別できます。本記事では、この重要なビジネスフロー機能の使用方法について解説します。

NGINX Node 5.2.11またはNative Node 0.10.1以上が必要です。

## 対象の課題

重要なビジネスフローの濫用は、OWASP API Top 10リスクのうち6番目（[API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)）に位置づけられます。これらの重要なビジネスフローを保護することで、事業継続性を確保し、機微なデータの漏洩、信用リスク、財務的損失を防ぐことができます。

この重要なビジネスフロー機能により、Wallarmは事業上重要な機能の状態を明示し、以下の点で支援します:

* 重要なビジネスフローに関連するエンドポイントを定期的に監視・監査し、脆弱性や侵害の有無を確認します。
* 開発、保守、およびセキュリティ対策の優先順位を付けます。
* 暗号化、認証、アクセス制御、レートリミットなどの強固なセキュリティ対策を実施します。
* データ保護対策の監査証跡や証拠を容易に作成できるようにします。

## 自動タグ付け

利便性のため、API Discoveryはエンドポイントを自動的に重要なビジネスフローに属するものとしてタグ付けします。新しいエンドポイントを発見すると、そのエンドポイントが1つ以上の重要なビジネスフローに属する可能性があるかどうかをチェックします。

--8<-- "../include/default-sbf.md"

エンドポイントURL内のキーワードを使用して自動チェックが実施されます。たとえば、`payment`、`subscription`、`purchase`といったキーワードは自動的にエンドポイントを**Billing**フローに関連付け、`auth`、`token`、`login`などのキーワードは**Authentication**フローに紐付けます。該当するキーワードが検出された場合、そのエンドポイントは自動的に適切なビジネスフローに割り当てられます。

## エンドポイントを手動でタグ付け

[自動タグ付け](#automatic-tagging)の結果を調整するために、エンドポイントが属する重要なビジネスフローのリストを手動で編集できます。また、キーワードリストに直接該当しないエンドポイントにも手動でタグを付与することができます。

エンドポイントが属するフローのリストを編集するには、Wallarm ConsoleのAPI Discoveryに移動し、対象エンドポイントの**Business flow & sensitive data**内でリストから1つまたは複数のフローを選択します。

![API Discovery - Sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

## セッション内のビジネスフロー

Wallarmの[API Sessions](../api-sessions/overview.md)は、ユーザーの操作シーケンスを完全に把握できるため、悪意のある行為者のロジックをより明確に把握できます。セッションのリクエストがAPI Discoveryにて重要なビジネスフローとしてタグ付けされたエンドポイントに影響を与える場合、そのセッションは自動的に[タグ付け](../api-sessions/exploring.md#sensitive-business-flows)され、このビジネスフローに影響を及ぼしていると判断されます。

セッションに重要なビジネスフロータグが割り当てられると、特定のビジネスフローでフィルターをかけることが可能となり、分析に最も重要なセッションを容易に選択できます。

![API Sessions - 重要なビジネスフロー](../images/api-sessions/api-sessions-sbf-no-select.png)

## ビジネスフローによるフィルター

エンドポイントに重要なビジネスフロータグが割り当てられると、特定のビジネスフロー（**Business flow**フィルター）で全ての発見されたエンドポイントをフィルターすることが可能となり、最も重要なビジネス機能の保護がより容易になります。

![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)