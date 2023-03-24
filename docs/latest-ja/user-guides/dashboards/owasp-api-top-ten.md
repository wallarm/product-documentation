# OWASP APIセキュリティトップ10ダッシュボード

[OWASP APIセキュリティトップ10](https://owasp.org/www-project-api-security/) は、APIのセキュリティリスク評価のゴールドスタンダードです。Wallarmは、これらのAPI脅威に対するAPIのセキュリティ状態を測定するためのダッシュボードを提供しており、脅威の軽減のための明確な可視性とメトリックスを提供します。

OWASP APIセキュリティトップ10ダッシュボードを使用することで、全体的なセキュリティ状態を評価し、適切なセキュリティコントロールを設定して発見されたセキュリティ問題に積極的に対処することができます。

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-dash.png)

## 脅威カバレッジの見積もり

Wallarmは、[セキュリティコントロール](#wallarm-security-controls) のステータスと発見された脆弱性に基づいて、各API脅威に対するリスクを見積もります。

* **赤** - セキュリティコントロールが適用されていないか、APIにアクティブな高リスクの脆弱性がある場合に発生します。
* **黄色** - セキュリティコントロールが部分的に適用されている場合や、APIにアクティブな中リスクの脆弱性がある場合に発生します。
* **緑**は、その脅威に対してAPIが低い脆弱性を持っており、すべてのセキュリティコントロールが適用されていることを示します。

OWASP APIトップ10の各脅威について、脅威の詳細情報、利用可能なセキュリティコントロール、関連する脆弱性、関連する攻撃を調査することができます。

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-dash-details.png)

## Wallarmセキュリティコントロール

Wallarmセキュリティプラットフォームは、以下のセキュリティコントロールによってOWASP APIセキュリティトップ10に対する包括的な保護を提供しています。

| OWASP APIトップ10脅威 | Wallarmセキュリティコントロール |
| ----------------------- | ------------------------ |
| [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) | <ul><li>[自動BOLA軽減](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)</li></ul> |
| [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa2-broken-user-authentication.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) で該当タイプのアクティブな脆弱性を発見</li><li>[認証エンドポイントに対するブルートフォース攻撃を軽減するためのブルートフォーストリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)</li><li>[弱いJWTに基づいたリクエストに基づく弱い認証の脆弱性を発見するための弱JWT検出](../triggers/trigger-examples.md#detect-weak-jwts) トリガ</li></ul> |
| [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[DoS攻撃を引き起こすことがよくあるブルートフォース攻撃を軽減するためのブルートフォーストリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md) で、APIが応答しなくなるか、利用できなくなることがあります</li><li>[DoS攻撃を引き起こすことがよくある悪意のあるbotの行動を軽減するための[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) で、APIが応答しなくなるか、利用できなくなることがあります</li></ul> |
| [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[フォースドブラウジング試行を軽減するためのフォースドブラウジングトリガ](../../admin-en/configuration-guides/protecting-against-bruteforce.md)。これは、この脅威の悪用方法でもあります</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa6-mass-assignment.md) | |
| [API7:2019 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa7-security-misconfiguration.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) | <ul><li>[脆弱性スキャナ](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API9:2019 Improper Assets Management](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa9-improper-assets-management.md) | <ul><li>[実際のトラフィックに基づいて実際のAPIインベントリを自動的に発見するAPI Discovery](../../about-wallarm/api-discovery.md)</li></ul> |
| [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xaa-insufficient-logging-monitoring.md) | <ul><li>[SIEMs, SOAPs, メッセンジャーなどとの統合](../settings/integrations/integrations-intro.md) で、APIセキュリティステータスに関するタイムリーな通知とレポートを取得</li></ul> |