# Wallarmサブスクリプションプラン

Wallarmは、最高レベルのAPIセキュリティとWAAP機能を統合し、マルチクラウド、クラウドネイティブ、オンプレミス環境において全てのAPIおよびWebアプリケーションポートフォリオを保護する唯一のソリューションです。お客様のニーズに最も適した機能セットを簡単に選択できます。

## WAAPおよび高度なAPIセキュリティ

**Cloud Native WAAP** - WAAP（Web Application & API Protection）サブスクリプションは、SQLi、XSS、ブルートフォースなどの一般的な脅威からWebアプリケーションやAPIを保護します。すべてのAPIプロトコルに対応しますが、一部の特定のAPI脅威には対応していません。

**WAAP + Advanced API Security**. このバンドルは、全般的なWAAP機能に加えて、包括的なAPIセキュリティツールを提供し、OWASP API Top-10の全脅威をカバーします。

| 機能 | WAAP | WAAP + API Security |
| ------- | ----------------- | --------------------- |
| **リアルタイム保護** |  |  |
| [DDoS保護 (L7)](../admin-en/configuration-guides/protecting-against-ddos.md) | はい | はい |
| [ジオ/ソースフィルタリング](../user-guides/ip-lists/overview.md) | はい | はい |
| [IP評判フィード](../user-guides/ip-lists/overview.md#malicious-ip-feeds) | はい | はい |
| [攻撃スタンプ (SQLi, XSS, SSRF, 等)](../about-wallarm/protecting-against-attacks.md#input-validation-attacks) | はい | はい |
| [顧客定義シグネチャ](../user-guides/rules/regex-rule.md) | はい | はい |
| [バーチャルパッチ](../user-guides/rules/vpatch-rule.md) | はい | はい |
| [ブルートフォース保護](../admin-en/configuration-guides/protecting-against-bruteforce.md) | はい | はい |
| [強制ブラウジング保護](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) | はい | はい |
| [分散レート制限](../user-guides/rules/rate-limiting.md) | はい | はい |
| [BOLA保護](../admin-en/configuration-guides/protecting-against-bola.md) | 手動トリガー | 自動保護 |
| [API悪用防止 (ボット管理)](../api-abuse-prevention/overview.md) | いいえ | はい |
| [クレデンシャルスタッフィング検出](../about-wallarm/credential-stuffing.md) | いいえ | はい |
| [API仕様強制](../api-specification-enforcement/overview.md) | いいえ | はい |
| [GraphQLセキュリティポリシー](../api-protection/graphql-rule.md) | いいえ | はい |
| **セキュリティ態勢** |  |  |
| [公開資産スキャナー](../user-guides/scanner.md) | はい | はい |
| [脆弱性評価](../user-guides/vulnerabilities.md) | はい | はい |
| [APIセッション](../api-sessions/overview.md) | いいえ | はい |
| [APIディスカバリー](../api-discovery/overview.md) | いいえ | はい |
| [機微データ検出](../api-discovery/overview.md#sensitive-data-detection) | いいえ | はい |
| [ローグAPI検出 (シャドウ、孤児ゾンビ)](../api-discovery/rogue-api.md) | いいえ | はい |
| **追加オプション** |  |  |
| [デプロイメントオプション](../installation/supported-deployment-options.md) | すべて | すべて |
| [統合機能](../user-guides/settings/integrations/integrations-intro.md) | すべて | すべて |
| [ユーザー数](../user-guides/settings/users.md#inviting-a-user) | 無制限 | 無制限 |
| [SSO認証](../admin-en/configuration-guides/sso/intro.md) | はい | はい |
| [ロールベースアクセス制御 (RBAC)](../user-guides/settings/users.md#user-roles) | はい | はい |
| [マルチテナント](../installation/multi-tenant/overview.md) | はい(要請に応じて) | はい(要請に応じて) |
| イベント保存期間 | 6か月 | 6か月 |
| サポート | Standard/Advanced/Platinum | Standard/Advanced/Platinum |

サブスクリプションプランを有効化するには、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。

## API攻撃サーフェス

**API攻撃サーフェス**サブスクリプションプランは、ゼロデプロイメントで最小限の構成により、公開されているAPIおよび関連情報の包括的なビューを提供します。

このサブスクリプションプランは、[API Attack Surface Management (AASM)](../api-attack-surface/overview.md)製品を提供し、以下を含みます：

* [API攻撃サーフェス検出](../api-attack-surface/api-surface.md)
* [セキュリティ問題検出](../api-attack-surface/security-issues.md)

サブスクリプションプランを有効化するには、以下のいずれかを実行してください：

* もしWallarmアカウントをまだお持ちでない場合は、価格情報を取得し、Wallarm公式サイトの[こちら](https://www.wallarm.com/product/aasm)でAASMを有効化してください。

    有効化時には、使用中のメールアドレスのドメインのスキャンが直ちに開始され、営業担当との打ち合わせが行われます。有効化後は、対象に追加のドメインを追加できます。

* 既にWallarmアカウントをお持ちの場合は、[sales@wallarm.com](mailto:sales@wallarm.com)にご連絡ください。

## Security Edge

Security Edgeサブスクリプションプランにより、管理対象環境にWallarmノードをデプロイでき、オンサイトでのインストールや管理の必要がなくなります。

Wallarmがノードのホスティングおよび保守を担当するため、堅牢なトラフィックフィルタリング、攻撃検出、そして安全な通信を享受しつつ、コアインフラストラクチャに注力できます―すべてWallarmのサポートによるものです。

利用可能なSecurity Edgeデプロイメントは以下を含みます：

* [Security Edge Inline](../installation/security-edge/deployment.md)
* [Security Edge Connectors](../installation/se-connector.md)

このサブスクリプションに関するお問い合わせは、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。

## Free Tier

中小企業および教育目的向けに、WallarmはFree Tierアカウントの作成オプションを提供します。お客様のストレージの好みに最も適したWallarm Cloudを選択できます：

* [US Wallarm CloudでFree Tierアカウントを作成](https://us1.my.wallarm.com/signup)
* [EU Wallarm CloudでFree Tierアカウントを作成](https://my.wallarm.com/signup)

Free Tierアカウントでは、以下が可能です：

* 時間制限なく、月最大**50万件のリクエスト**を処理可能です。
* 以下を除き、Wallarmプラットフォームへの[Advanced API Security](#waap-and-advanced-api-security)としてのアクセスが可能です：
    * Security Edgeの[Inline](../installation/security-edge/deployment.md)および[Connectors](../installation/se-connector.md)
    * [公開資産スキャナー](../user-guides/scanner.md)
    * [脆弱性評価](../user-guides/vulnerabilities.md)
    * [API悪用防止](../api-abuse-prevention/overview.md)

Free Tierアカウントが月間クオータの100％を超えた場合、Wallarm Consoleへのアクセスおよびすべての統合機能が無効になります。200％に達すると、Wallarmノードの保護が無効になります。これらの制限は翌月の初日まで適用されます。

有料サブスクリプションに[移行](mailto:sales@wallarm.com)することで、これらの制限を簡単に解除できます。