# Wallarmサブスクリプションプラン

Wallarmに登録する際に、最もビジネスニーズに適したプランを選択します。このドキュメントでは、利用可能なサブスクリプションプランとそれらが有効にする機能について学ぶことができます。

Wallarmは次のサブスクリプションプランを提供しています：

* **クラウドネイティブWAAP(Webアプリケーション＆API保護)** は、一般的な脅威からの保護を提供する次世代WAFです。
* **アドバンストAPIセキュリティ** は、プロトコルに関係なく、ポートフォリオ全体でのAPIの発見と脅威の防止を総合的に提供します。

    アドバンストAPIセキュリティのサブスクリプションプランは、クラウドネイティブWAAPのアドオンとして販売されています。

## サブスクリプションプラン

| 機能 | クラウドネイティブWAAP | WAAP + アドバンストAPIセキュリティ |
| ------- | ----------------- | --------------------- |
| **OWASP対応** | | |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | はい | はい |
| [OWASP API Top 10](https://owasp.org/www-project-api-security/) | 一部<sup>⁕</sup> | はい |
| **保護されたリソースタイプ** | | |
| Webアプリケーション | はい | はい |
| API | 一部<sup>⁕</sup> | はい |
| **APIプロトコルのサポート** | | |
| レガシー（SOAP、XML-RPC、WebDAV、WebForm） | はい | はい |
| メインストリーム（REST、GraphQL） | はい | はい |
| モダンおよびストリーミング（gRPC、WebSocket） | いいえ | はい |
| **リアルタイム脅威防止** | | |
| [入力検証アタック](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、例えばSQLインジェクション、RCE | はい | はい |
| [仮想パッチング](../user-guides/rules/vpatch-rule.md) | はい | はい |
| [ジオロケーションフィルタリング](../user-guides/ip-lists/overview.md) | はい | はい |
| **自動化された脅威からの保護** | | |
| [ブルートフォース保護](../admin-en/configuration-guides/protecting-against-bruteforce.md) | はい | はい |
| [BOLA（IDOR）保護](../admin-en/configuration-guides/protecting-against-bola.md) | 手動設定 | 自動保護 |
| [API悪用防止](../about-wallarm/api-abuse-prevention.md) | いいえ | はい |
| **可観測性オプション** | | |
| [API発見](../about-wallarm/api-discovery.md) | いいえ | はい |
| [機密データ検出](../about-wallarm/api-discovery.md) | いいえ | はい |
| **セキュリティテストと脆弱性評価** | | |
| [アクティブな脅威検証](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) | いいえ | はい |
| [脆弱性スキャナ](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) | いいえ | はい |
| **セキュリティイベント監視** | | |
| [インテグレーション](../user-guides/settings/integrations/integrations-intro.md) SIEM、メッセンジャーなど | すべて | すべて |
| [監査ログ](../user-guides/settings/audit-log.md) | はい | はい |
| **デプロイメント** | | |
| [デプロイメントオプション](../admin-en/supported-platforms.md) | すべて | すべて |
| [マルチテナント](../installation/multi-tenant/overview.md) | 要求により | 要求により |
| **ユーザー管理** | | |
| [ユーザー用のSSO（SAML）認証](../admin-en/configuration-guides/sso/intro.md) | はい | はい |
| **Wallarm API** | | |
| [Wallarm APIへのアクセス](../api/overview.md) | はい | はい |

`⁕` 機能は、利用できない機能に依存する場合に**一部**動作する場合があります。例えば、WAAPはAPIプロトコルのセットに制限があるため、APIを一部保護します。

サブスクリプションプランをアクティブにするには、[sales@wallarm.com](mailto:sales@wallarm.com)にリクエストを送信してください。サブスクリプションのコストは、選択したプラン、その期間、および[着信トラフィック量](../admin-en/operation/learn-incoming-request-number.md)に基づいて決定されます。

アクティブなプランに関する情報は、Wallarmコンソール→**設定**→[**サブスクリプション**](../user-guides/settings/subscriptions.md)に表示されます。

## サブスクリプション通知

Wallarmは、サブスクリプションに関する問題について、アカウントの**管理者**および**グローバル管理者**にメールで通知します：

* サブスクリプション期間の有効期限（5日前と期限が切れた場合）
* 月次処理リクエストの上限（85%および100%のクオータに達した場合）

さらに、WallarmコンソールUIでは、すべてのユーザーにサブスクリプションの問題に関するメッセージが表示されます。

## Free tierサブスクリプションプラン（USクラウド）

新しいユーザーが**[US Cloud](overview.md#cloud)**のWallarmコンソールに登録されると、Wallarmシステムで新しいクライアントアカウントが自動的に**Free Tier**サブスクリプションプランで作成されます。

Free Tierサブスクリプションには以下が含まれます：

* 毎月**500,000リクエスト**の上限まで無料で利用できるWallarmの機能。上限は毎月の最初の日にリセットされます。
* 次のものを除く、Wallarmプラットフォームへの[Advanced API Security](#subscription-plans)としてのアクセス：

    * [脆弱性](detecting-vulnerabilities.md#vulnerability-scanner)および[公開アセット](../user-guides/scanner/check-scope.md)スキャナ
    * [アクティブな脅威防止](detecting-vulnerabilities.md#active-threat-verification)機能
    * [API悪用防止](api-abuse-prevention.md)モジュール
    * [CDNノード](../installation/cdn-node.md)タイプのデプロイメント
    * 脆弱性スキャナの利用不可によるOWASP API Top 10の部分的なカバレッジ
    * Wallarm APIへのアクセス

**クオータが超過した場合はどうなるか？**

企業アカウントがFree Tierの月次クオータを超過した場合：

* 企業アカウントへのアクセスが一時的に無効になります。
* インテグレーションが一時的に無効になります。

これらの制限は、翌月の最初の日まで適用されます。サービスをすぐに復元するには、Wallarmの[営業チーム](mailto:sales@wallarm.com)に連絡し、有料のサブスクリプションプランのいずれかに切り替えてください。

Free Tierサブスクリプションの使用に関する情報は、Wallarmコンソール→**設定**→[**サブスクリプション**](../user-guides/settings/subscriptions.md)に表示されます。

Wallarmは、無料リクエストのクオータが85%および100%超過した場合、アカウントの**管理者**および**グローバル管理者**にメールで通知します。## トライアル期間（EUクラウド）

新規ユーザーが**[EUクラウド](overview.md#cloud)**の Wallarmコンソールに登録されると、Wallarmシステムでアクティブなトライアル期間を持つ新しいクライアントアカウントが自動的に作成されます。

* トライアル期間は無料です。
* トライアル期間は14日間です。
* Wallarm トライアルは、API セキュリティ[プラン](#subscription-plans) に含めることができるモジュールと機能の最大セットを提供します。
* トライアル期間は、もう一度だけ14日間延長できます。

    トライアル期間の延長は、Wallarmコンソール → **設定** → [**サブスクリプション**](../user-guides/settings/subscriptions.md)セクションと、トライアル期間終了の通知メールのボタンから行うことができます。このメールは、[**Administrator** および **Global Administrator**の役割](../user-guides/settings/users.md#user-roles) を持つユーザーにのみ送信されます。
* トライアル期間が終了した場合：

    * Wallarmコンソールのアカウントがブロックされます。
    * WallarmノードとWallarmクラウドの同期が停止されます。
    * Wallarmノードはローカルで動作しますが、Wallarmクラウドからのアップデートを受け取らず、クラウドにデータをアップロードすることもありません。

    Wallarmへの有料サブスクリプションがアクティブになると、すべてのユーザーのクライアントアカウントへのアクセスが復元されます。

トライアル期間に関する情報は、Wallarmコンソール → **設定** → [**サブスクリプション**](../user-guides/settings/subscriptions.md) で表示されます。