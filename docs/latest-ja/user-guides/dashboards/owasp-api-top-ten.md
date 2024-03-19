# OWASP APIセキュリティトップ10ダッシュボード

[OWASP APIセキュリティトップ10](https://owasp.org/www-project-api-security/)はAPIのセキュリティリスク評価のゴールドスタンダードです。これらのAPI脅威に対するあなたのAPIのセキュリティ状況を測定するために、Wallarmは明確な可視性と脅威緩和のための指標を提供するダッシュボードを提供しています。

ダッシュボードは、OWASP APIセキュリティトップ10のリスクを[2019](https://owasp.org/API-Security/editions/2019/en/0x00-header/)版と[2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/)版の両方をカバーしています。

これらのダッシュボードを使用することで、全体のセキュリティ状態を評価し、適切なセキュリティコントロールを設定することで発見されたセキュリティ問題に積極的に対応することができます。

=== "OWASP API Top 10 2019ダッシュボード"
    ![OWASP API Top 10 2019](../../images/user-guides/dashboard/owasp-api-top-ten-2019-dash.png)
=== "OWASP API Top 10 2023ダッシュボード"
    ![OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## 脅威評価

Wallarmは、適用された**セキュリティコントロール**と発見された脆弱性に基づいて、各API脅威のリスクを推定します：

* **赤** - セキュリティコントロールが適用されていないか、APIに高リスクの脆弱性が存在する場合に発生します。
* **黄色** - セキュリティコントロールが部分的にしか適用されていない場合や、APIに中リスクまたは低リスクの脆弱性が存在する場合に発生します。
* **緑**は、APIが保護されており開放された脆弱性がないことを示しています。

OWASP APIトップ10の各脅威については、脅威の詳細情報、利用可能なセキュリティコントロール、対応する脆弱性、関連する攻撃を調査することができます：

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## WallarmのOWASP API 2019向けセキュリティコントロール

Wallarmセキュリティプラットフォームは、以下のセキュリティコントロールによってOWASP APIセキュリティトップ10 2019に対する包括的な保護を提供します：

| OWASP API Top 10 2019 脅威 | Wallarmセキュリティコントロール |
| ---------------------- | --------------------------- |
| [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md) | <ul><li>[自動BOLA緩和](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)は脆弱なエンドポイントを保護するトリガーを自動的に作成します</li></ul> |
| [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa2-broken-user-authentication.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li><li>[ブルートフォーストリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は認証エンドポイントを対象としたブルートフォース攻撃を軽減します</li><li>[弱いJWT検出](../triggers/trigger-examples.md#detect-weak-jwts)トリガーは、弱いJWTのリクエストに基づいて弱い認証脆弱性を発見します</li></ul> |
| [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa3-excessive-data-exposure.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li></ul> |
| [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[ブルートフォーストリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、APIが反応しなくなったり完全に利用できなくなったりすることがよくあるDoSを引き起こすブルートフォース攻撃を軽減します</li><li>[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md)は、APIが反応しなくなったり完全に利用できなくなったりすることがよくあるDoSを引き起こす悪意のあるボットの行為を緩和します</li></ul> |
| [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa5-broken-function-level-authorization.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li><li>[強制ブラウジングトリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、この脅威を利用するもう一つの方法である強制ブラウジングの試みを軽減します</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) | <ul><li>Mass Assignmentの攻撃は自動的に検出され、特定のセキュリティコントロールは必要ありません</li></ul> |
| [API7:2019 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa7-security-misconfiguration.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li><li>Wallarmノードの自己チェック機能は、ノードバージョンとセキュリティポリシーを最新の状態に保ちます（[問題の対処方法](../../faq/node-issues-on-owasp-dashboards.md)を参照してください）</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) | <ul><li>悪意のあるインジェクションは自動的に検出され、特定のセキュリティコントロールは必要ありません</li></ul> |
| [API9:2019 Improper Assets Management](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa9-improper-assets-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md)は実際のトラフィックに基づいて実際のAPIインベントリを自動的に発見します</li></ul> |
| [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) | <ul><li>[SIEMs、SOAPs、messengersなどとの統合](../settings/integrations/integrations-intro.md)により、あなたのAPIセキュリティステータスに関するタイムリーな通知とレポートを受け取ることができます</li></ul> |

## WallarmのOWASP API 2023向けセキュリティコントロール

Wallarmセキュリティプラットフォームは、以下のセキュリティコントロールによってOWASP APIセキュリティトップ10 2023に対する包括的な保護を提供します：

| OWASP API Top 10 2023 脅威 | Wallarmセキュリティコントロール |
| ---------------------- | --------------------------- |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[自動BOLA緩和](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)は脆弱なエンドポイントを保護するトリガーを自動的に作成します</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li><li>[ブルートフォーストリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は認証エンドポイントを対象としたブルートフォース攻撃を軽減します</li><li>[弱いJWT検出](../triggers/trigger-examples.md#detect-weak-jwts)トリガーは、弱いJWTのリクエストに基づいて弱い認証脆弱性を発見します</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[ブルートフォーストリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、APIが反応しなくなったり完全に利用できなくなったりすることがよくあるDoSを引き起こすブルートフォース攻撃を軽減します</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li><li>[強制ブラウジングトリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、この脅威を利用するもう一つの方法である強制ブラウジングの試みを軽減します</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md)は悪意のあるボットの行為を軽減します</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li><li>Wallarmノードの自己チェック機能は、ノードバージョンとセキュリティポリシーを最新の状態に保ちます（[問題の対処方法](../../faq/node-issues-on-owasp-dashboards.md)を参照してください）</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md)は実際のトラフィックに基づいて実際のAPIインベントリを自動的に発見します</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)は対応するタイプの活動的な脆弱性を発見します</li></ul> |

## OWASP API Top 10 2019と2023の比較

OWASPプロジェクトによると、2023年のトップセキュリティ脅威は2019年に特定されたものと大部分が一致していますが、いくつか明確な例外があります：

* [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md)の脅威は[API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md)と統合されています。
* [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md)の脅威は別個には挙げられず、新たな[API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md)のカテゴリに含まれています。
* [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md)の脅威はOWASP APIセキュリティトップ10から削除されました。
* リストには新たなAPI脅威、すなわち[API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md)（自動化された脅威を導入しています）、および[API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md)が含まれており、これらの脅威の重要性を強調しています。