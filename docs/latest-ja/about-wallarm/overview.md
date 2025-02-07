# Wallarmプラットフォーム概要

今日のデジタル時代において、アプリケーション、特にAPIは増大する脅威に直面しています。従来のセキュリティ対策では、APIの脆弱性が見逃される場合や、導入に課題が生じる場合があります。Wallarmを使用すれば、クラウドネイティブ環境やオンプレミス環境に適したWebアプリケーションおよびAPIの保護を単一のプラットフォームで実現できます。

企業は、高度なアプリケーションとAPIセキュリティ、容易な導入、およびコストパフォーマンスの高さからWallarmを選びます。Wallarmは、優れたAPIディスカバリー、リスク管理、保護、テスト機能をクラウドネイティブのWAAPおよびAPIセキュリティ機能と組み合わせています。

![Diagram](../images/about-wallarm-waf/overview/wallarm-features.png)

## 発見

保護するには対象を把握する必要があります。Wallarmはお客様の環境内のAPIを特定し、そのセキュリティリスクを評価する包括的なAPIディスカバリー機能を提供します。以下は、WallarmのAPIディスカバリーが実施する内容です:

* [APIのエンドポイントおよびそのパラメータを検出](../api-discovery/overview.md)し、継続的なトラフィック分析によりAPIビューを更新します。
* シャドウ、オーファン、ゾンビAPIを含む、不正なエンドポイントを[特定](../api-discovery/rogue-api.md)します。
* 個人情報などの機微なデータを流出させる可能性のあるエンドポイントを検出します。
* 各エンドポイントのセキュリティリスクや脆弱性を[評価](../api-discovery/risk-score.md)し、リスクスコアを提供します。

![APIディスカバリーで検出されたエンドポイント](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## 保護

Wallarmはディスカバリー機能を拡張し、トラフィック中のアプリケーションおよびAPI攻撃を検出・ブロックすることで、実質的な保護を実現します。Wallarm独自の検出技術は、高精度な結果を提供し、[OWASP Top 10](https://owasp.org/www-project-top-ten/)および[OWASP API Top 10](https://owasp.org/www-project-api-security/)の脆弱性に対する攻撃検出を含みます。以下は、Wallarmが保護を確実にする方法です:

* 攻撃を[inline](../installation/inline/overview.md)および[out-of-band](../installation/oob/overview.md)の両方で検出します。
* ウェブベースおよびAPI固有の攻撃、たとえばコードインジェクション、リモートコード実行、ブルートフォース、BOLAなどの[さまざまな脅威](../attacks-vulns-list.md)に対抗します。
* API固有の悪意あるボットの乱用を[特定](../api-abuse-prevention/overview.md)します。
* カスタマイズ可能な[レート制限](../user-guides/rules/rate-limiting.md)により、Layer7のDoS攻撃に対応します。
* 組み込みの対策を補完するために、お客様自身の脅威定義を設定して、[カスタム防御策](../user-guides/rules/regex-rule.md)を作成できるようにします。
* 攻撃をお客様のシステムに存在する脆弱性と関連付け、重要な事象を明示します。
* [クレデンシャルスタッフィング](../about-wallarm/credential-stuffing.md)の試みを検出します。

## 対応

Wallarmは、セキュリティ脅威に効果的に対応するためのツールを提供し、詳細なデータ、広範な統合、及びブロック機能を備えています。まず、詳細な情報を提示することで、セキュリティアナリストがお客様の脅威の性質と深刻度を把握できるよう支援します。その後、お客様固有の対応策を調整し、脅威に対処し、関連システムへアラートを送信することが可能です。以下は、Wallarmがどのように支援するかです:

* [詳細な攻撃検査](../user-guides/events/check-attack.md)により、エンコードされたリクエストの展開を含む、ヘッダーから本文に至るまで攻撃のあらゆる側面を明らかにします。
* [ジオロケーションに基づく制御](../user-guides/ip-lists/overview.md)により、VPNやTorネットワークなどの疑わしいトラフィックソースをブロックします。
* [攻撃ブロック対策](../admin-en/configure-wallarm-mode.md#available-filtration-modes)により、悪意ある活動がお客様のAPIに到達するのを防止します。
* 最も一般的なセキュリティ、運用、開発ツールとの[統合](../user-guides/settings/integrations/integrations-intro.md)により、検出されたセキュリティ脅威に関するチケット、通知の作成や、データの提供が可能です。対応プラットフォームにはSlack、Sumo Logic、Splunk、Microsoft Sentinelなどが含まれます。
* Wallarmの脆弱性検出で強調された緊急の問題に対する[バーチャルパッチ](../user-guides/rules/vpatch-rule.md)を提供します。

![攻撃が含まれるイベント](../images/about-wallarm-waf/overview/events-with-attacks.png)

## テスト

展開中のリスク管理は防御の第一線ですが、製品アプリケーションやAPIに存在するリスクを低減することが、インシデントを削減する最も効果的な方法です。Wallarmは、以下のテスト機能群を提供することで、アプリケーションおよびAPIのセキュリティ対策を完結させます:

* パッシブなトラフィック分析により[脆弱性](../user-guides/vulnerabilities.md)を検出します。
* 検出されたAPIに対して脆弱点を精査します。
* 観測されたトラフィックから[動的にAPIセキュリティテスト](../vulnerability-detection/threat-replay-testing/overview.md)を作成します。
* 公開リポジトリ上で露出しているAPIトークンをチェックします。[APIトークン露出のセキュリティ課題](../api-attack-surface/security-issues.md)も確認します。

![脆弱性](../images/about-wallarm-waf/overview/vulnerabilities.png)

## Wallarmの動作原理

Wallarmプラットフォームは主に、WallarmフィルタリングノードとWallarm Cloudの2つの主要コンポーネントで構成されています。

![アーキテクチャ図1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### フィルタリングノード

インターネットとお客様のAPIとの間に配置されるWallarmフィルタリングノードは、以下の機能を果たします:

* 企業全体のネットワークトラフィックを分析し、悪意あるリクエストを軽減します。
* ネットワークトラフィックのメトリクスを収集し、Wallarm Cloudにアップロードします。
* Wallarm Cloudで定義したリソース固有のセキュリティルールをダウンロードし、トラフィック分析時に適用します。
* リクエスト内の機微なデータを検出し、お客様のインフラ内で安全に保持するとともに、Cloudや第三者サービスへの送信を防ぎます。

Wallarmフィルタリングノードは、お客様ご自身のネットワーク内に設置するか、[対応する展開オプション](../installation/supported-deployment-options.md)を通じてWallarm Security Edgeを選択できます。

### Cloud

Wallarm Cloudは以下の機能を提供します:

* フィルタリングノードがアップロードしたメトリクスを処理します。
* カスタムのリソース固有セキュリティルールを作成します。
* 企業の公開資産をスキャンし、脆弱性を検出します。
* フィルタリングノードから受け取ったトラフィックメトリクスに基づいてAPI構造を構築します。
* Wallarm Console UIをホストし、Wallarmプラットフォームの操作と設定の指令センターとして、すべてのセキュリティ情報の総合的なビューを提供します。

Wallarmは米国および欧州の両方でCloudインスタンスを提供しており、お客様のデータ保管のご希望や地域サービス運用の要件に合わせた最適な選択が可能です。

[US Wallarm Cloudに登録する](https://us1.my.wallarm.com/signup)

[EU Wallarm Cloudに登録する](https://my.wallarm.com/signup)