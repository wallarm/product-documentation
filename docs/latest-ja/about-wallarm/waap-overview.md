# Cloud-Native WAAP

Wallarm Cloud-Native WAAP (Web Application & API Protection) は、お客様の環境内のアプリケーションおよびAPIを高度に保護します。WallarmのWAAPは、REST、SOAP、GraphQLなどの複数のAPIプロトコルをサポートし、[OWASP Top 10](https://owasp.org/www-project-top-ten/)などを完全にカバーするためにディープパケットインスペクションを実施します。WAAPは、0-dayを含む[各種脅威](../attacks-vulns-list.md)の検出に高い精度を提供し、[誤検知](../about-wallarm/protecting-against-attacks.md#false-positives)の件数を低く抑えます。これにより、インフラストラクチャを迅速かつ効果的に保護できます。

![プロトコル別攻撃](../images/user-guides/dashboard/api-protocols.png)

## 一般原則

トラフィックはWallarm filtering nodesとWallarm Cloudの2つのコンポーネントによって処理されます。Wallarm filtering nodesはお客様のインフラストラクチャに展開され、トラフィックの解析および攻撃のブロックを担当します。収集された攻撃統計情報はWallarm Cloudへ送信され、統計分析およびイベント処理が実施されます。Wallarm Cloudは、中央管理および他のセキュリティツールとの統合も担当します。

![アーキテクチャ図1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

Wallarmは、public cloud、on-premises、完全なSaaS展開、およびKubernetes、Gateway APIs、Security Edges等との統合を含む各種[展開オプション](../installation/supported-deployment-options.md)をサポートします。Wallarm filtering nodesは、お客様のニーズとインフラストラクチャに応じて、[インライン](../installation/inline/overview.md)または[アウト・オブ・バンド](../installation/oob/overview.md)で展開できます。柔軟なセキュリティポリシーの構成オプションにより、monitoringとblockingの[modes](../admin-en/configure-wallarm-mode.md)を迅速に切り替え、正当なトラフィックのブロックへの不安を解消します。

## 保護措置

* XSS、SQLi、RCE等に対する最新のシグネチャ
* バーチャルパッチ
* カスタム検出器の作成
* [L7 DDoS保護](../admin-en/configuration-guides/protecting-against-ddos.md)
* [多重攻撃者に対する保護](../admin-en/configuration-guides/protecting-with-thresholds.md)
* レート制限
* [ブルートフォース攻撃対策](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [強制ブラウジング防御](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA防御](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [地理的位置およびソースタイプによるフィルタリング](../user-guides/ip-lists/overview.md)
* 悪意あるIPフィード

## 追加機能

アプリケーションの保護に加え、Wallarm Cloud Native WAAPは[公開資産](../user-guides/scanner.md)のスキャンおよびセキュリティレベルの評価機能を提供します。これにより、攻撃者による攻撃前に脆弱性を特定できます。

柔軟な[レポーティング](../user-guides/dashboards/owasp-api-top-ten.md)機能および他アプリケーションとの[統合](../user-guides/settings/integrations/integrations-intro.md)により、新たな脅威について迅速に把握し、適切な対応が可能です。

高度なAPI保護および解析機能は、必要に応じて簡単に[追加できます](../about-wallarm/subscription-plans.md)。