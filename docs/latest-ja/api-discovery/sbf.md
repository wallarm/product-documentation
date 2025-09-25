# 機密性の高いビジネスフロー <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

機密性の高いビジネスフロー機能により、Wallarmの[API Discovery](overview.md)は、認証、アカウント管理、課金などのビジネスフローや機能にとって重要なエンドポイントを自動的に特定します。本記事では、機密性の高いビジネスフロー機能の使い方を説明します。

NGINX Node 5.2.11またはNative Node 0.10.1以上が必要です。

## 対象となる課題

機密性の高いビジネスフローの乱用は、OWASP API Top 10のリスクの中で6位（[API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)）に位置づけられています。これらのビジネスフローを保護することで、事業継続性を確保し、機密データの漏えい、評判リスク、金銭的損害を防ぎます。

機密性の高いビジネスフロー機能により、Wallarmはビジネスクリティカルな機能の健全性を可視化し、次のことに役立ちます:

* 機密性の高いビジネスフローに関連するエンドポイントを、脆弱性や侵害の観点から定期的に監視および監査します。
* 開発・保守・セキュリティ対応における優先順位付けを行います。
* より強固なセキュリティ対策（例: 暗号化、認証、アクセス制御、レート制限）を実装します。
* 監査証跡やデータ保護対策の証拠を容易に作成します。

## 自動タグ付け

利便性のため、API Discoveryはエンドポイントを機密性の高いビジネスフローに自動でタグ付けします。新しいエンドポイントを検出すると、そのエンドポイントが1つ以上の機密性の高いビジネスフローに該当する可能性があるかどうかを確認します:

--8<-- "../include/default-sbf.md"

自動チェックは、エンドポイントURL内のキーワードを用いて実行されます。例えば、`payment`、`subscription`、`purchase`といったキーワードは、そのエンドポイントを**Billing**フローに自動的に関連付けます。一方、`auth`、`token`、`login`といったキーワードは**Authentication**フローに関連付けます。一致が検出された場合、エンドポイントは適切なフローに自動的に割り当てられます。

自動タグ付けにより、多くの機密性の高いビジネスフローが検出されます。ただし、以下のセクションのとおり、割り当てられたビジネスフローの一覧は手動で調整することも可能です。

## エンドポイントの手動タグ付け

[自動タグ付け](#automatic-tagging)の結果を調整するには、そのエンドポイントが属する機密性の高いビジネスフローの一覧を手動で編集できます。キーワード一覧に直接該当しないエンドポイントにも、手動でタグ付けできます。

エンドポイントが属するフローの一覧を編集するには、Wallarm ConsoleでAPI Discoveryに移動し、対象のエンドポイントの**Business flow & sensitive data**で、リストから1つ以上のフローを選択します。

![API Discovery - 機密性の高いビジネスフロー](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

エンドポイントの詳細画面でも同様の操作ができます。

## API Sessionsにおけるビジネスフロー

Wallarmの[API Sessions](../api-sessions/overview.md)は、ユーザー活動の全シーケンスを提供し、攻撃者のロジックをより可視化するために使用します。セッション内のリクエストが、API Discoveryで特定の機密性の高いビジネスフローにとって重要とタグ付けされたエンドポイントに影響する場合、そのセッションにも同じビジネスフローに影響するものとして自動的に[タグ付け](../api-sessions/exploring.md#sensitive-business-flows)されます。

セッションに機密性の高いビジネスフローのタグが付与されると、特定のビジネスフローでフィルタリングできるようになり、分析対象として重要なセッションを選びやすくなります。

![!API Sessions - 機密性の高いビジネスフロー](../images/api-sessions/api-sessions-sbf-no-select.png)

## ビジネスフローによるフィルタリング

エンドポイントに機密性の高いビジネスフローのタグが付与されると、検出されたすべてのエンドポイントを特定のビジネスフローでフィルタリングできるようになり（**Business flow**フィルター）、最も重要なビジネス機能の保護を容易にします。

![API Discovery - 機密性の高いビジネスフローでのフィルタリング](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)