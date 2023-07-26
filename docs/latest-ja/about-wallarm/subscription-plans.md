# Wallarm サブスクリプションプラン

Wallarmにサブスクリプションする際には、あなたのビジネスニーズに最も適したプランを選択します。この文書からは、使用可能なサブスクリプションプランとそれらが活性化する機能について学ぶことができます。

Wallarmは以下のサブスクリプションプランを提供しています：

* **Cloud Native WAAP（Webアプリケーション＆API保護）**は、一般的な脅威からWebアプリケーションとAPIを保護する次世代型WAF（Web Application Firewall）です。
* **Advanced API Security**は、プロトコルに関係なく、あなたのポートフォリオ全体にわたる包括的なAPI検出と脅威防止を提供します。

    Advanced API Securityサブスクリプションプランは、Cloud Native WAAPの追加オプションとして販売されています。

## サブスクリプションプラン

| 機能 | Cloud Native WAAP | WAAP + Advanced API Security |
| ------- | ----------------- | --------------------- |
| **OWASPカバレッジ** | | |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | はい | はい |
| [OWASP API Top 10](https://owasp.org/www-project-api-security/) | 部分的<sup>⁕</sup> | はい |
| **保護対象のリソースの種類** | | |
| Webアプリケーション | はい | はい |
| API | 部分的<sup>⁕</sup> | はい |
| **API プロトコルのサポート** | | |
| Legacy (SOAP, XML-RPC, WebDAV, WebForm) | はい | はい |
| Mainstream (REST, GraphQL) | はい | はい |
| Modern and streaming (gRPC, WebSocket) | いいえ | はい |
| **リアルタイム脅威防止** | | |
| [Input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、例えば SQL injection、RCE | はい | はい |
| [Virtual patching](../user-guides/rules/vpatch-rule.md) | はい | はい |
| [Geolocation filtering](../user-guides/ip-lists/overview.md) | はい | はい |
| **自動化された脅威からの保護** | | |
| [Brute-force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) | はい | はい |
| [BOLA (IDOR) protection](../admin-en/configuration-guides/protecting-against-bola.md) | 手動設定 | 自動保護 |
| [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) | いいえ | はい |
| **観察可能性オプション** | | |
| [API Discovery](../about-wallarm/api-discovery.md) | いいえ | はい |
| [Finding shadow API](../about-wallarm/api-discovery.md#shadow-api) with API Discovery | いいえ | はい |
| [Sensitive data detection](../about-wallarm/api-discovery.md) | いいえ | はい |
| **セキュリティーテストおよび脆弱性評価** | | |
| [Active threat verification](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) | いいえ | はい |
| [Vulnerability Scanner](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) | いいえ | はい |
| **セキュリティーイベントの監視** | | |
| [Integrations](../user-guides/settings/integrations/integrations-intro.md) with SIEMs, messengers, etc | 全部 | 全部 |
| [Audit log](../user-guides/settings/audit-log.md) | はい | はい |
| **デプロイメント** | | |
| [Deployment options](../installation/supported-deployment-options.md) | 全部 | 全部 |
| [Multitenancy](../installation/multi-tenant/overview.md) |	要請によりあり | 要請によりあり |
| **ユーザーマネージメント** | | |
| [SSO (SAML) authentication for users](../admin-en/configuration-guides/sso/intro.md) | はい | はい |
| **Wallarm API** | | |
| [Access to Wallarm API](../api/overview.md) | はい | はい |

`⁕` 機能は**部分的に**機能し、利用可能な機能に依存します。例えば、WAAPはAPIプロトコルの一部のリクエストを分析するため、APIを部分的に保護します。

サブスクリプションプランを有効化するためには、選択したプラン、その期間、[受信トラフィック量](../admin-en/operation/learn-incoming-request-number.md)に基づいたサブスクリプションの費用を判断した上で、[sales@wallarm.com](mailto:sales@wallarm.com)にリクエストを送信してください。

有効なプランに関する情報は、Wallarm Console → **設定** → [**サブスクリプション**](../user-guides/settings/subscriptions.md)で表示されます。

## サブスクリプション通知

Wallarmはあなたのアカウントの**管理者**と**グローバル管理者**に、サブスクリプションの問題についてメールで通知します：

* サブスクリプション期間の終了（60日、30日、15日前および期間が終了したとき）
* 処理したリクエストの月間クオータを超過（クオータの85％と100％が達成したとき）

このほかにも、Wallarm Console UIは、すべてのユーザーに対してサブスクリプションの問題についてのメッセージを表示します。

## 無料層サブスクリプションプラン（US Cloud）

**[US Cloud](overview.md#cloud)**のWallarm Consoleに新規ユーザーが登録されると、Wallarmシステム内に**Free Tier**サブスクリプションプランを持つ新規クライアントアカウントが自動的に作成されます。

Free Tier サブスクリプションには以下が含まれます：

* Wallarmの機能が、期間に関係なく**それぞれの月に500,000リクエスト**まで無料で利用可能です。このクオータは毎月最初の日にリセットされます。
* [Advanced API Security](#subscription-plans)としてのWallarmプラットフォームへのアクセス、ただし以下は除く：

    * [Vulnerability](detecting-vulnerabilities.md#vulnerability-scanner)と[Exposed asset](../user-guides/scanner.md)スキャナー
    * [Active threat prevention](detecting-vulnerabilities.md#active-threat-verification)機能
    * [API Abuse Prevention](api-abuse-prevention.md)モジュール
    * [CDN node](../installation/cdn-node.md)タイプのデプロイメント
    * Vulnerability Scannerの利用不可によるOWASP API Top 10の部分的なカバレッジ
    * Wallarm APIへのアクセス

**クオータが超過した場合はどうなりますか？**

会社のアカウントがFree Tierの月間クオータの100％を超えた場合、Wallarm Consoleへのアクセスが無効になり、すべての統合も無効になります。200％を達すると、Wallarmノード上の保護が無効になります。

これらの制限は次の月の最初の日まで適用されます。Wallarmの[sales team](mailto:sales@wallarm.com)に連絡して、有料のサブスクリプションプランに切り替えることで、すぐにサービスを復旧することができます。

Free Tierサブスクリプションの使用情報は、Wallarm Console→ **設定** → [**サブスクリプション**](../user-guides/settings/subscriptions.md)で表示されます。

Wallarmは、あなたのアカウントの**管理者**と**グローバル管理者**に、無償リクエストのクオータが85％、100％、185％、200％を超えたときにメールで通知します。

## 試用期間（EU Cloud）

**[EU Cloud](overview.md#cloud)**のWallarm Consoleに新規ユーザーが登録されると、Wallarmシステム内に試用期間が設定された新規クライアントアカウントが自動的に作成されます。

* 試用期間は無料です。
* 試用期間は14日間です。
* Wallarmの試用はAPI Security [plan](#subscription-plans)に含められるモジュールと機能の最大セットを提供します。
* 試用期間は1度だけさらに14日間延長することができます。

    試用期間は、Wallarm Console → **設定** → [**サブスクリプション**](../user-guides/settings/subscriptions.md)セクションと、試用期間終了について通知するメールからのボタンを通じて延長できます。このメールは[role **管理者**および**グローバル管理者**](../user-guides/settings/users.md#user-roles)を持つユーザーにのみ送信されます。
* 試用期間が終了した場合：

    * Wallarm Consoleのアカウントがブロックされます。
    * WallarmノードとWallarm Cloudの同期が停止します。
    * Wallarmノードはローカルで動作しますが、Wallarm Cloudからの更新を受けることも、Cloudへデータをアップロードすることもありません。
    
    Wallarmへの有料サブスクリプションが有効化されると、すべてのユーザーにクライアントアカウントへのアクセスが復元されます。

試用期間に関する情報は、Wallarm Console → **設定** → [**サブスクリプション**](../user-guides/settings/subscriptions.md)に表示されます。