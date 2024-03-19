# WAAP/WAF

WallarmのクラウドネイティブWAAP（Web Application & API Protection）は、お客様の環境におけるアプリケーションとAPIに高度な保護を提供します。WallarmのWAAPは、REST、SOAP、GraphQLなどの複数のAPIプロトコルをサポートし、[OWASPトップ10](https://owasp.org/www-project-top-ten/)などを完全にカバーするためのディープパケットインスペクションを含む次世代WAF（Web Application Firewall）です。WAAPは、0-dayや少数の[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)を含む[様々な脅威](../attacks-vulns-list.md)を高精度で検出し、迅速かつ効果的にインフラを保護することができます。

![攻撃プロトコル別](../images/user-guides/dashboard/api-protocols.png)

## 一般原則

トラフィックは2つのコンポーネントによって処理されます：WallarmフィルタリングノードとWallarm Cloud。Wallarmフィルタリングノードは顧客のインフラストラクチャ内に展開され、トラフィックの分析と攻撃のブロックを担当します。収集された攻撃統計は統計分析とイベント処理のためにWallarm Cloudに送信されます。Wallarm Cloudは、集中管理と他のセキュリティツールとの統合を担当します。

![アーキテクチャ図1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

Wallarmは、公共クラウド、オンプレミス、完全なSaaS展開、Kubernetes、Gateway APIs、Security Edgesなどとの統合を含む、様々な[展開オプション](../installation/supported-deployment-options.md)をサポートしています。Wallarmフィルタリングノードは、お客様のニーズとインフラストラクチャに応じて、[インライン](../installation/inline/overview.md)または[アウトオブバンド](../installation/oob/overview.md)で展開することができます。柔軟なセキュリティポリシー設定オプションにより、合法的なトラフィックをブロックする恐れなく、監視とブロック[モード](../admin-en/configure-wallarm-mode.md)間を迅速に切り替えることができます。

## 保護対策

Wallarm WAAPは、XSS、SQLi、RCEなどに対する最新の対策や、カスタム検出器の作成、バーチャルパッチングを含む、あらゆる種類の脅威からアプリケーションを保護するための広範なセキュリティ対策を提供します。

* [L7 DDoS保護](../admin-en/configuration-guides/protecting-against-ddos.md)
* [多攻撃者からの保護](../admin-en/configuration-guides/protecting-with-thresholds.md)
* レート制限
* [ブルートフォース保護](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [強制ブラウジング保護](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA保護](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [地理位置情報とソースタイプによるフィルタリング](../user-guides/ip-lists/overview.md)
* 悪意のあるIPフィード

## 追加機能

Wallarm Cloud Native WAAPはアプリケーションの保護だけでなく、公開された[資産のスキャン](../user-guides/scanner.md)とセキュリティレベルの評価機能も提供しています。これにより、攻撃者に標的にされる前に脆弱性を特定できます。

柔軟な[レポーティング](../user-guides/dashboards/owasp-api-top-ten.md)機能と他のアプリケーションとの[統合](../user-guides/settings/integrations/integrations-intro.md)により、新たに発生する脅威について迅速に学び、適時に対応することができます。

必要に応じて簡単に追加できる高度なAPI保護と分析機能があります。