# Wallarmのサブスクリプションプラン

Wallarmへのサブスクリプションでは、ビジネスニーズに最も対応したプランを選択します。このドキュメントから、利用可能なサブスクリプションプランとそれらが有効にする機能を学ぶことができます。

Wallarmでは次のサブスクリプションプランを提供しています：

* **Cloud Native WAAP (Web Application & API Protection)** は、一般的な脅威からウェブアプリケーションとAPIを保護するNext-Gen WAFです。
* **Advanced API Security** は、プロトコルに関係なく、ポートフォリオ全体での包括的なAPI発見と脅威防止を提供します。

    Advanced API Securityサブスクリプションプランは、Cloud Native WAAPのアドオンとして販売されています。

## サブスクリプションプラン

| 機能 | Cloud Native WAAP | WAAP + Advanced API Security |
| ------- | ----------------- | --------------------- |
| **OWASP coverage** | | |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | はい | はい |
| [OWASP API Top 10](https://owasp.org/www-project-api-security/) | 部分的<sup>⁕</sup> | はい |
| **保護されるリソースの種類** | | |
| ウェブアプリケーション | はい | はい |
| API | 部分的<sup>⁕</sup> | はい |
| **APIプロトコルのサポート** | | |
| レガシー(SOAP、XML-RPC、WebDAV、WebForm) | はい | はい |
| メインストリーム(REST、GraphQL) | はい | はい |
| モダンおよびストリーミング(gRPC、WebSocket) | いいえ | はい |
| **リアルタイムの脅威防止** | | |
| [入力検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、例えば、SQLインジェクション、RCE | はい | はい |
| [Virtual patching](../user-guides/rules/vpatch-rule.md) | はい | はい |
| [Geolocation filtering](../user-guides/ip-lists/overview.md) | はい | はい |
| **自動化された脅威からの保護** | | |
| [Brute-force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) | はい | はい |
| [BOLA (IDOR) protection](../admin-en/configuration-guides/protecting-against-bola.md) | 手動設定 | 自動保護 |
| [API Abuse Prevention](../api-abuse-prevention/overview.md) | いいえ | はい |
| **観察可能性のオプション** | | |
| [API Discovery](../api-discovery/overview.md) | いいえ | はい |
| API Discoveryを使用して[影のAPIを見つける](../api-discovery/rogue-api.md#shadow-api) | いいえ | はい |
| [Sensitive data detection](../api-discovery/overview.md) | いいえ | はい |
| **セキュリティテストと脆弱性の評価** | | |
| [Active threat verification](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) | いいえ | はい |
| [脆弱性スキャナ](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) | いいえ | はい |
| **セキュリティイベントの監視** | | |
| SIEM、メッセンジャー等との[Integrations](../user-guides/settings/integrations/integrations-intro.md) | すべて | すべて |
| [監査ログ](../user-guides/settings/audit-log.md) | はい | はい |
| **デプロイメント** | | |
| [デプロイメントのオプション](../installation/supported-deployment-options.md) | すべて | すべて |
| [マルチテナント](../installation/multi-tenant/overview.md) | 要求により(はい) | 要求により(はい) |
| **ユーザー管理** | | |
| [SSO (SAML) authentication for users](../admin-en/configuration-guides/sso/intro.md) | はい | はい |
| **Wallarm API** | | |
| [Wallarm APIへのアクセス](../api/overview.md) | はい | はい |

`⁕` 機能は、利用できない機能に依存している場合に**部分的に**働く可能性があります。例えば、WAAPはAPIプロトコルの一部のセットを介して送信されたリクエストを分析するので、APIを部分的に保護します。

サブスクリプションプランを有効にするには、[sales@wallarm.com](mailto:sales@wallarm.com) 宛にリクエストを送信してください。サブスクリプションの費用は、選択したプラン、その期間、および[インバウンドトラフィック量](../admin-en/operation/learn-incoming-request-number.md)に基づいて決定されます。

アクティブなプランに関する情報は、Wallarm Console → **Settings** → [**Subscriptions**](../about-wallarm/subscription-plans.md) に表示されます。

## サブスクリプションの通知

サブスクリプションに関する問題については、Wallarmがあなたのアカウントの**Administrators**と**Global Administrators**にメールで通知します：

* サブスクリプション期間の残り期間通知(60、30、15日前および期間満了時)
* 処理リクエストの月間クォータの超過(クォータの85％および100％が達成された時)

また、Wallarm Console UIはすべてのユーザーに対して、サブスクリプション問題についてのメッセージを表示します。

## フリーティアのサブスクリプションプラン（US Cloud）

新しいユーザーが**[US Cloud](overview.md#cloud)** のWallarm Consoleに登録すると、自動的にWallarmシステムで新しいクライアントアカウントが作成され、**Free Tier**のサブスクリプションプランが適用されます。

Free Tierのサブスクリプションには以下が含まれます：

* **毎月50万回のリクエスト**までの制限なしで無料で利用できるWallarmの機能。クォータは毎月の最初の日にリセットされます。
* [Advanced API Security](#subscription-plans)としてのWallarmプラットフォームへのアクセス、但し次の事項を除きます：

    * [脆弱性](detecting-vulnerabilities.md#vulnerability-scanner)と[露出した資産](../user-guides/scanner.md)のスキャナ
    * [Active threat prevention](detecting-vulnerabilities.md#active-threat-verification)の機能
    * [API Abuse Prevention](../api-abuse-prevention/overview.md)モジュール
    * [CDNノード](../installation/cdn-node.md)タイプのデプロイメント
    * 脆弱性スキャナの利用不可によるOWASP API Top 10の部分的カバレッジ
    * Wallarm APIへのアクセス

**クォータが超過した場合、何が起きるか？**

会社のアカウントがFree Tierの月間クォータの100％を超えた場合、Wallarm Consoleへのアクセスが無効化され、すべての統合が停止されます。200％を超えると、Wallarmノード上の保護が無効化されます。

これらの制限は、次の月の最初の日まで有効です。すぐにサービスを復元するには、Wallarmの[sales team](mailto:sales@wallarm.com)に連絡して、有料のサブスクリプションプランのいずれかに切り替えてください。

Free Tierのサブスクリプションの利用情報は、Wallarm Console → **Settings** → [**Subscriptions**](../about-wallarm/subscription-plans.md) に表示されます。

Wallarmは、無料リクエストクォータの85％、100％、185％、200％を超えたときに、アカウントの**Administrators**と**Global Administrators**にメールで通知します。

## トライアル期間(EU Cloud)

新しいユーザーが**[EU Cloud](overview.md#cloud)**のWallarm Consoleに登録すると、Wallarmシステムで自動的に新しいクライアントアカウントが作成され、試用期間が有効化されます。

* 試用期間は無料です。
* 試用期間は14日間です。
* Wallarmの試用期間は、APIセキュリティの[plan](#subscription-plans)に含めることができるモジュールと機能の最大セットを提供します。
* 試用期間は、14日間だけ一度だけ延長することができます。

    試用期間の延長は、Wallarm Console → **Settings** → [**Subscriptions**](../about-wallarm/subscription-plans.md) セクションと、試用期間の終了を通知するメールからのボタンを通じて可能です。このメールは、[role **Administrator** and **Global Administrator**](../user-guides/settings/users.md#user-roles)のユーザーにのみ送信されます。
* トライアル期間が終了した場合：

    * Wallarm Consoleでのアカウントはブロックされます。
    * WallarmノードとWallarm Cloudの同期が停止します。
    * Wallarmノードはローカルで動作しますが、Wallarm Cloudからのアップデートを得ることも、Cloudへのデータアップロードも行うことはありません。
    
    有料のWallarmサブスクリプションを開始すると、すべてのユーザーのクライアントアカウントへのアクセスが復元されます。

試用期間に関する情報はWallarm Console → **Settings** → [**Subscriptions**](../about-wallarm/subscription-plans.md) に表示されます。