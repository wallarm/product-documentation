# OWASP API 2023ダッシュボード

[OWASP API Security Top 10](https://owasp.org/www-project-api-security/) はAPIのセキュリティリスク評価におけるゴールドスタンダードです。こうしたAPI脅威に対するAPIのセキュリティ状況を評価するため、Wallarmは脅威緩和のための明確な可視化と指標を提供するダッシュボードを提供します。

[OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) をカバーし、このダッシュボードは全体のセキュリティ状態を評価し、検出された問題に対処するためのセキュリティ制御を積極的に実装することを可能にします。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/qgq0xmld3wzb" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## 脅威評価

Wallarmは適用された**セキュリティ制御**と検出された脆弱性に基づいて各API脅威のリスクを評価します:

* **赤** - セキュリティ制御が適用されていない場合、もしくはAPIに高リスクの脆弱性が存在する場合です。
* **黄** - セキュリティ制御が部分的にしか適用されていない場合、もしくはAPIに中リスクまたは低リスクの脆弱性が存在する場合です。
* **緑** はAPIが保護され、公開された脆弱性が存在しないことを示します。

## OWASP API 2023向けWallarmセキュリティ制御

Wallarmセキュリティプラットフォームは、以下のセキュリティ制御によりOWASP API Security Top 10 2023に対して完全な保護を提供します:

| OWASP API Top 10脅威2023 | Wallarmセキュリティ制御 |
| ----------------------- | ------------------------ |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatic BOLA mitigation](../../api-discovery/bola-protection.md) は脆弱なエンドポイントを保護するために自動的にトリガーを作成します</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) は対応する種類のアクティブな脆弱性を検出します</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) は認証エンドポイントを狙うブルートフォース攻撃を軽減します</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) は対応する種類のアクティブな脆弱性を検出します</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) はDoSを引き起こし、APIが応答しなくなるまたは利用できなくなることがあるブルートフォース攻撃を軽減します</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) は対応する種類のアクティブな脆弱性を検出します</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) は本脅威の悪用手段でもある強制ブラウジング試行を軽減します</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API Abuse Prevention](../../api-abuse-prevention/overview.md) は悪意あるボットの行動を軽減します</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) は対応する種類のアクティブな脆弱性を検出します</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) は対応する種類のアクティブな脆弱性を検出します</li><li>Wallarm node self-checkはノードバージョンとセキュリティポリシーを最新の状態に保ちます (詳細は[問題の対処方法](../../faq/node-issues-on-owasp-dashboards.md)を参照してください)</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md) は実際のトラフィックに基づいて実際のAPI在庫を自動的に検出します</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) は対応する種類のアクティブな脆弱性を検出します</li></ul> |