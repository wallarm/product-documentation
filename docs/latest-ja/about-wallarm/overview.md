[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md
[link-deployment-on-prem]:      ../installation/on-premise/overview.md

# Wallarmプラットフォームの概要

今日のデジタル世界では、AIの台頭に伴い、APIが直面する脅威が増大しています。従来型のセキュリティではAPIの脆弱性を見落としたり、導入が難しかったりすることがあります。Wallarmを使用すると、クラウドネイティブおよびオンプレミス環境全体でAPI保護とインベントリの可視化を一元的に提供する単一のプラットフォームを利用できます。

企業は、強化されたAPIセキュリティ、容易な導入、そして価値の高さからWallarmを選択します。高度なAPIセキュリティ機能とともに、APIディスカバリ、リスク管理、リアルタイム保護、テストを組み合わせています。

![図](../images/about-wallarm-waf/overview/wallarm-features.png)

## 検出

保護するには、対象を把握する必要があります。Wallarmは、お客様の環境内のAPIを特定し、そのセキュリティリスクを評価するための包括的なAPIディスカバリ機能を提供します。WallarmのAPIディスカバリが行うことは次のとおりです:

* [お客様のAPIエンドポイントとそのパラメータを検出](../api-discovery/overview.md)し、継続的なトラフィック解析によってAPIビューを継続的に更新します。
* [不正なエンドポイントを特定](../api-discovery/rogue-api.md)し、Shadow API、Orphan API、Zombie APIも対象にします。
* PIIなどの機微データを露出させる可能性があるエンドポイントを特定します。
* 各エンドポイントのセキュリティリスクや脆弱性を[評価](../api-discovery/risk-score.md)し、リスクスコアを提供します。

![API Discoveryで検出されたエンドポイント](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## 保護

Wallarmは、トラフィック内のアプリケーションおよびAPIへの攻撃を検知してブロックすることで、ディスカバリを拡張し実効的な保護を実現します。Wallarmの独自検知技術は高い精度を提供し、[OWASP Top 10](https://owasp.org/www-project-top-ten/)および[OWASP API Top 10](https://owasp.org/www-project-api-security/)の脆弱性を悪用する攻撃の検知も含みます。Wallarmが保護を実現する方法は次のとおりです:

* [インライン](../installation/inline/overview.md)および[アウトオブバンド](../installation/oob/overview.md)の両方で攻撃を検知します。
* コードインジェクション、リモートコード実行、ブルートフォース、BOLAなど、WebベースからAPI特有のものまで、[多様な脅威](../attacks-vulns-list.md)に対処します。
* [API特有の悪意あるボットによる悪用](../api-abuse-prevention/overview.md)を検知します。
* カスタマイズ可能な[レート制限](../user-guides/rules/rate-limiting.md)により、レイヤ7のサービス拒否攻撃に対抗します。
* 組み込み対策を補完するため、独自の脅威定義を設定して[カスタム防御](../user-guides/rules/regex-rule.md)を作成できます。
* 攻撃をお客様のシステムの脆弱性とマッピングし、重大なインシデントを浮き彫りにします。
* [クレデンシャルスタッフィングの試行](../about-wallarm/credential-stuffing.md)を検知します。

## 対応

Wallarmは、詳細なデータ、幅広い連携、ブロッキング機構を提供し、セキュリティ脅威へ効果的に対応するためのツールを提供します。まず詳細な情報を提示し、セキュリティアナリストが脅威の性質と深刻度を判断できるようにします。そのうえで、対応を調整し、脅威へ対処し、関連するシステムへアラートを送信できます。Wallarmが支援する内容は次のとおりです:

* [攻撃の詳細調査](../user-guides/events/check-attack.md)。エンコードされたリクエストの展開を含み、ヘッダーからボディまで攻撃のあらゆる側面を詳細に示します。
* VPNやTorネットワークなどの疑わしいトラフィックソースをブロックするための[ジオロケーションベースの制御](../user-guides/ip-lists/overview.md)。
* 悪意のあるアクティビティがAPIに到達するのを防ぐための[攻撃ブロッキング手段](../admin-en/configure-wallarm-mode.md#available-filtration-modes)。
* 検知されたセキュリティ脅威に関するデータの配信、チケットや通知の作成のために、広く利用されているセキュリティ/運用/開発ツールとの[連携](../user-guides/settings/integrations/integrations-intro.md)。対応プラットフォームにはSlack、Sumo Logic、Splunk、Microsoft Sentinelなどがあります。
* Wallarmの脆弱性検出で明らかになった緊急の問題に対する[仮想パッチ](../user-guides/rules/vpatch-rule.md)。

![イベント](../images/about-wallarm-waf/overview/events-with-attacks.png)

## テスト

デプロイ後のリスクを管理することは第一の防衛線ですが、製品のアプリケーションとAPIが抱えるリスク自体を低減することが、インシデントを減らす最も効果的な方法です。Wallarmは、以下のテスト機能群を提供し、脆弱性リスクを見つけて排除することで、アプリケーションとAPIのセキュリティ対策を一連のサイクルとして完結させます:

* パッシブトラフィック解析により[脆弱性を特定](../user-guides/vulnerabilities.md)します。
* 特定されたAPIの弱点を検査します。
* 観測されたトラフィックから[APIセキュリティテストを動的に生成](../vulnerability-detection/threat-replay-testing/overview.md)します。
* 公開リポジトリに露出したAPIトークンを[チェック](../api-attack-surface/security-issues.md)します。

![脆弱性](../images/about-wallarm-waf/overview/vulnerabilities.png)

<a id="how-wallarm-works"></a>
## Wallarmの仕組み

Wallarmのプラットフォームは主に2つのコンポーネント、WallarmフィルタリングノードとWallarm Cloudで構成されています。

![アーキテクチャ図1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### フィルタリングノード

インターネットとお客様のAPIの間に配置されるWallarmフィルタリングノードは、次のことを行います:

* 企業のネットワーク全体のトラフィックを解析し、悪意のあるリクエストを阻止します。
* ネットワークトラフィックのメトリクスを収集し、Wallarm Cloudにアップロードします。
* Wallarm Cloudで定義したリソース固有のセキュリティルールをダウンロードし、トラフィック解析時に適用します。
* リクエスト内の機微データを検出し、そのデータがお客様のインフラ内に安全に留まり、第三者サービスであるWallarm Cloudに送信されないようにします。

Wallarmフィルタリングノードは、[お客様自身のネットワーク](../installation/supported-deployment-options.md)内にセットアップすることも、[Wallarm Security Edge](../installation/security-edge/overview.md)を選択することもできます。

### クラウド

Wallarm Cloudは次のことを行います:

* フィルタリングノードがアップロードするメトリクスを処理します。
* リソース固有のカスタムセキュリティルールを生成します。
* 企業の公開アセットをスキャンし、脆弱性を検出します。
* フィルタリングノードから受け取ったトラフィックメトリクスに基づいてAPI構造を構築します。
* Wallarmプラットフォームのナビゲーションと設定を行うためのコマンドセンターであるWallarm Console UIをホストし、あらゆるセキュリティインサイトを包括的に把握できるようにします。

Wallarmは米国と欧州の両方にクラウドインスタンスを提供しており、データ保管の方針や地域でのサービス運用要件を考慮して最適なリージョンを選択できます。

[US Wallarm Cloudでサインアップに進む](https://us1.my.wallarm.com/signup)

[EU Wallarm Cloudでサインアップに進む](https://my.wallarm.com/signup)

## Wallarmが動作する場所

上記の[説明した](#how-wallarm-works)Wallarmコンポーネント（フィルタリングノードとクラウド）は、次の3つの形態のいずれかでデプロイできます:

--8<-- "../include/deployment-forms.md"