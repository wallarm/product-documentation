# Wallarmのサブスクリプションプラン

Wallarmは、APIディスカバリ、リスク管理、リアルタイム保護、テスト機能を統合し、マルチクラウド、クラウドネイティブ、オンプレミス環境でお客様のAPIポートフォリオ全体を保護する唯一のソリューションです。ニーズに最適な機能セットを簡単に選択できます。

## コアサブスクリプションプラン

**Cloud Native WAAP** - WAAP（Web Application & API Protection）サブスクリプションは、SQLi、XSS、ブルートフォースなどの一般的な脅威からWebアプリケーションとAPIを保護します。すべてのAPIプロトコルをサポートしますが、一部の特定のAPI脅威は対象外です。

**WAAP + Advanced API Security**。このバンドルは、包括的なAPI Securityツールによって一般的なWAAP機能を強化し、OWASP API Top-10の脅威をすべてカバーします。

**Security Testing**。このバンドルは、攻撃者より先にアプリケーションやAPIのセキュリティ脆弱性を能動的に発見するのに役立ちます。

| 機能 | WAAP | WAAP + API Security | Security Testing |
| ------- | ----------------- | --------------------- | --------------------- |
| **リアルタイム保護** | | | |
| [DDoS対策（L7）](../admin-en/configuration-guides/protecting-against-ddos.md) | はい | はい | いいえ |
| [地理/送信元フィルタリング](../user-guides/ip-lists/overview.md) | はい | はい | いいえ |
| [IPレピュテーションフィード](../user-guides/ip-lists/overview.md#malicious-ip-feeds) | はい | はい | いいえ |
| [攻撃スタンプ（SQLi、XSS、SSRFなど）](../attacks-vulns-list.md#attack-types) | はい | はい | いいえ |
| [カスタムシグネチャ](../user-guides/rules/regex-rule.md) | はい | はい | いいえ |
| [仮想パッチ](../user-guides/rules/vpatch-rule.md) | はい | はい | いいえ |
| [ブルートフォース対策](../admin-en/configuration-guides/protecting-against-bruteforce.md) | はい | はい | いいえ |
| [強制ブラウジング対策](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) | はい | はい | いいえ |
| [分散レート制限](../user-guides/rules/rate-limiting.md) | はい | はい | いいえ |
| [BOLA対策](../admin-en/configuration-guides/protecting-against-bola.md) | 手動トリガー | 自動保護 | いいえ |
| [API Abuse Prevention（ボット管理）](../api-abuse-prevention/overview.md) | いいえ | はい | いいえ |
| [Credential Stuffing検知](../about-wallarm/credential-stuffing.md) | いいえ | はい | いいえ |
| [API Specification Enforcement](../api-specification-enforcement/overview.md) | いいえ | はい | いいえ |
| [GraphQLセキュリティポリシー](../api-protection/graphql-rule.md) | いいえ | はい | いいえ |
| [列挙攻撃対策](../api-protection/enumeration-attack-protection.md) | いいえ | はい | いいえ |
| [緩和制御](../about-wallarm/mitigation-controls-overview.md) | いいえ | はい | いいえ |
| **セキュリティ態勢** | | | |
| [API Attack Surface Management（AASM）](../api-attack-surface/overview.md) | いいえ | はい | いいえ |
| [脆弱性アセスメント](../user-guides/vulnerabilities.md) | はい | はい | いいえ |
| [API Sessions](../api-sessions/overview.md) | いいえ | はい | いいえ |
| [API Discovery](../api-discovery/overview.md) | いいえ | はい | いいえ |
| [機密データ検出](../api-discovery/overview.md#sensitive-data-detection) | いいえ | はい | いいえ |
| [Rogue API検出（shadow、orphan、zombie）](../api-discovery/rogue-api.md) | いいえ | はい | いいえ |
| **セキュリティテスト** | | | |
| [Threat Replayテスト](../vulnerability-detection/threat-replay-testing/overview.md) | いいえ | はい | はい（API Securityと併用時） |
| [スキーマベースのセキュリティテスト](../vulnerability-detection/schema-based-testing/overview.md) | いいえ | いいえ | はい |
| **追加オプション** | | | |
| [セルフホスト型ノードのデプロイ](../installation/supported-deployment-options.md) | すべて | すべて | いいえ |
| [Security Edge](../installation/security-edge/overview.md) | いいえ | いいえ | いいえ |
| [Integrations](../user-guides/settings/integrations/integrations-intro.md) | すべて | すべて | すべて |
| [ユーザー数](../user-guides/settings/users.md) | 無制限 | 無制限 | 無制限 |
| [SSO認証](../admin-en/configuration-guides/sso/intro.md) | はい | はい | はい |
| [ロールベースのアクセス制御（RBAC）](../user-guides/settings/users.md#user-roles) | はい | はい | はい |
| [マルチテナント](../installation/multi-tenant/overview.md) | はい（リクエストにより） | はい（リクエストにより） | はい（リクエストにより） |
| イベント保存期間 | 6か月 | 6か月 | 6か月 |
| サポート | Standard/<br>Advanced/<br>Platinum | Standard/<br>Advanced/<br>Platinum | Standard/<br>Advanced/<br>Platinum |

サブスクリプションプランを有効化するには、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。

## API Attack Surface

!!! info "他プランとの関係"

    このサブスクリプションプランは次のとおりです。

    * [Advanced API Security](#core-subscription-plans)プランに含まれます
    * [Cloud Native WAAP](#core-subscription-plans)プランに追加できます
    * 単体で利用できます（他のプランやフィルタリングノードは不要です）

**API Attack Surface**サブスクリプションプランは、デプロイ不要かつ最小限の設定で、公開されているAPIと関連情報の包括的な可視化を提供します。

このサブスクリプションプランには[API Attack Surface Management（AASM）](../api-attack-surface/overview.md)が含まれ、次を提供します。

* [API Attack Surface Discovery](../api-attack-surface/api-surface.md)
* [Security Issues Detection](../api-attack-surface/security-issues.md)

サブスクリプションプランを有効化するには、次のいずれかを行います。

* まだWallarmアカウントがない場合は、Wallarmの公式サイト[こちら](https://www.wallarm.com/product/aasm)で料金情報を確認し、AASMを有効化してください。

    有効化すると、使用したメールアドレスのドメインのスキャンが、営業チームとのやり取りの間も直ちに開始されます。有効化後は、スコープに追加のドメインを追加できます。

* すでにWallarmアカウントをお持ちの場合は、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。

## Security Edge (Paid Plan)

!!! info "他プランとの関係"

    このサブスクリプションプランは次のとおりです。

    * [Cloud Native WAAP](#core-subscription-plans)または[Advanced API Security](#core-subscription-plans)プランに追加できます
    * 単体では利用できません

Security Edgeサブスクリプションプランにより、管理された環境にWallarmノードをデプロイできるため、オンサイトでのインストールや管理が不要になります。

Wallarmがノードのホスティングとメンテナンスを担当することで、堅牢なトラフィックフィルタリング、攻撃検知、安全な通信のメリットを享受しながら、中核となるインフラストラクチャに集中できます。

利用可能なSecurity Edgeのデプロイ方式は次のとおりです。

* [Security Edge Inline](../installation/security-edge/inline/overview.md)
* [Security Edge Connectors](../installation/security-edge/se-connector.md)

本サブスクリプションに関するお問い合わせは、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。

## Security Edge Free Tier

中小規模の企業や教育目的向けに、Wallarmは[Security Edge](#security-edge-paid-plan)のFree Tierアカウントをお客様自身で作成できるオプションを提供します。データ保管場所の希望に最適なWallarm Cloudを選択できます。

* [US Wallarm CloudでFree Tierアカウントを作成](https://us1.my.wallarm.com/signup)
* [EU Wallarm CloudでFree Tierアカウントを作成](https://my.wallarm.com/signup)

Security Edge Free Tierアカウントでは、次が可能です。

* 一部の機能制限付きでSecurity Edgeの機能を利用できます。
* 期間の制限なく、月あたり最大50万リクエストを処理できます。
* 次を除き、Advanced API SecurityとしてWallarmプラットフォームにアクセスできます。

    * [脆弱性アセスメント](../user-guides/vulnerabilities.md)
    * [API Abuse Prevention](../api-abuse-prevention/overview.md)
    * Security Edgeのテレメトリポータル
    * マルチクラウドのSecurity Edgeデプロイ

Free Tierアカウントが月間クォータの100%を超えると、すべてのインテグレーションとともにWallarm Consoleへのアクセスが無効化されます。200%に達すると、Wallarmノードでの保護が無効化されます。これらの制限は翌月の1日まで適用されます。

すべての制限を解除するには、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。