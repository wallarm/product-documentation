# OWASP API 2023 Dashboard

[OWASP API Security Top 10](https://owasp.org/www-project-api-security/)は、APIにおけるセキュリティリスクの評価に関するゴールドスタンダードです。これらのAPI脅威に対するAPIのセキュリティ体制を測定できるよう、Wallarmは脅威軽減に関する可視性と指標を明確に提供するDashboardを提供しています。

[OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/)を網羅しており、Dashboardによって全体的なセキュリティ状態を評価し、特定された問題に対処するためのセキュリティコントロールを積極的に実装できます。

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/qgq0xmld3wzb" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## 脅威評価

Wallarmは、適用されているセキュリティコントロールと検出された脆弱性に基づいて、各API脅威のリスクを評価します。

* 赤 - セキュリティコントロールが適用されていない場合、またはAPIに高リスクのアクティブな脆弱性が存在する場合に該当します。
* 黄 - セキュリティコントロールの適用が一部にとどまっている場合、またはAPIに中または低リスクのアクティブな脆弱性が存在する場合に該当します。
* 緑 - APIが保護され、未対応の脆弱性が存在しないことを示します。

## OWASP API 2023向けWallarmのセキュリティコントロール

Wallarmセキュリティプラットフォームは、次のセキュリティコントロールにより、OWASP API Security Top 10 2023に対して包括的な保護を提供します。

| OWASP API Top 10 2023の脅威 | Wallarmのセキュリティコントロール |
| ----------------------- | ------------------------ |
| [API1:2023 オブジェクトレベル認可の不備](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[BOLAの自動軽減](../../api-discovery/bola-protection.md)により、脆弱なエンドポイントを保護するtriggerを自動的に作成します</li></ul> |
| [API2:2023 認証の不備](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md)により、認証エンドポイントを狙うブルートフォース攻撃を軽減します</li></ul> |
| [API3:2023 オブジェクトプロパティレベルの認可の不備](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>脆弱性を検出するために[Detecting Security Issues](../../api-attack-surface/security-issues.md)を有効化します</li><li>[BOLA triggers](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)を使用します</li><li>[API Discovery](../../api-discovery/overview.md)で見つかったエンドポイントに対して[Automatic BOLA protection](../../admin-en/configuration-guides/protecting-against-bola.md)を適用します</li></ul> |
| [API4:2023 無制限のリソース消費](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md)により、しばしばDoSにつながりAPIが応答しなくなる、または利用不能になるブルートフォース攻撃を軽減します</li></ul> |
| [API5:2023 機能レベルの認可の不備](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md)により、この脅威の悪用手段でもある強制閲覧の試行を軽減します</li></ul> |
| [API6:2023 機微なビジネスフローへの無制限アクセス](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API Abuse Prevention](../../api-abuse-prevention/overview.md)により、悪意あるボットの行動を軽減します</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>脆弱性を検出するために[Detecting Security Issues](../../api-attack-surface/security-issues.md)を有効化します</li><li>適切な[mode](../../admin-en/configure-wallarm-mode.md)で動作する[Filtering node](../../about-wallarm/overview.md#how-wallarm-works)を使用します</li></ul> |
| [API8:2023 セキュリティの設定不備](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>Wallarm nodeのセルフチェックにより、ノードのバージョンとセキュリティポリシーを最新に保ちます（[問題への対処方法](../../faq/node-issues-on-owasp-dashboards.md)をご参照ください）</li></ul> |
| [API9:2023 不適切なインベントリ管理](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md)により、実トラフィックに基づいて実際のAPIインベントリを自動発見します</li></ul> |
| [API10:2023 APIの安全でない利用](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>脆弱性を検出するために[Detecting Security Issues](../../api-attack-surface/security-issues.md)を有効化します</li></ul> |