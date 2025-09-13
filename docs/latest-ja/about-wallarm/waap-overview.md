# クラウドネイティブWAAP

WallarmのクラウドネイティブWAAP（Webアプリケーション＆API保護）は、あらゆるお客様環境でアプリケーションとAPIを高度に保護します。WallarmのWAAPはREST、SOAP、GraphQLなど複数のAPIプロトコルをサポートし、[OWASP Top 10](https://owasp.org/www-project-top-ten/)をはじめそれ以上を包括的にカバーするためにディープパケットインスペクションを実施します。WAAPは、ゼロデイを含む[さまざまな脅威](../attacks-vulns-list.md)の検知精度が高く、[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)が少ないです。これにより、インフラストラクチャを迅速かつ効果的に保護できます。

![プロトコル別の攻撃](../images/user-guides/dashboard/api-protocols.png)

## 基本原則

トラフィックは2つのコンポーネントで処理します：WallarmフィルタリングノードとWallarm Cloudです。Wallarmフィルタリングノードはお客様のインフラストラクチャにデプロイされ、トラフィックの解析と攻撃のブロックを担当します。収集した攻撃の統計情報は統計分析とイベント処理のためにWallarm Cloudへ送信されます。Wallarm Cloudは集中管理や他のセキュリティツールとの連携も担当します。

![アーキテクチャ図1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

Wallarmは、[パブリッククラウド](../installation/supported-deployment-options.md)、オンプレミス、フルSaaSデプロイ、KubernetesやGateway APIsとの統合、[Security Edges](../installation/security-edge/overview.md)など、さまざまなデプロイオプションをサポートします。Wallarmフィルタリングノードは、ニーズとインフラストラクチャに応じて[インライン](../installation/inline/overview.md)または[アウトオブバンド](../installation/oob/overview.md)でデプロイできます。柔軟なセキュリティポリシー設定オプションにより、監視とブロッキングの[モード](../admin-en/configure-wallarm-mode.md)を迅速に切り替えられ、正当なトラフィックを誤ってブロックする不安を解消します。

## 保護対策

Wallarm WAAPは、あらゆる種類の脅威からアプリケーションを保護するため、次のような幅広いセキュリティ対策を提供します（これらに限定されません）：

* 最新のシグネチャによるXSS、SQLi、RCE等への対策 
* 仮想パッチ
* カスタムディテクタの作成
* [L7 DDoS保護](../admin-en/configuration-guides/protecting-against-ddos.md)
* [複数攻撃の実行者からの保護](../admin-en/configuration-guides/protecting-with-thresholds.md)
* レート制限
* [ブルートフォース攻撃からの保護](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [フォースドブラウジングからの保護](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA保護](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [ジオロケーションおよび送信元タイプによるフィルタリング](../user-guides/ip-lists/overview.md)
* 悪意あるIPフィード

## 追加の機能

アプリケーションの保護に加えて、Wallarm Cloud Native WAAPは、攻撃者に悪用される前に脆弱性を特定するための機能（[パッシブ検知](../about-wallarm/detecting-vulnerabilities.md#passive-detection)）を提供します。

柔軟な[レポーティング](../user-guides/dashboards/owasp-api-top-ten.md)機能と他のアプリケーションとの[連携](../user-guides/settings/integrations/integrations-intro.md)により、新たな脅威をすばやく把握し、タイムリーに対応できます。

高度なAPI保護および分析機能は、必要に応じて容易に[追加できます](../about-wallarm/subscription-plans.md)。