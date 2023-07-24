[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm機能付きAzionエッジファイアウォール

[Azionエッジ機能](https://www.azion.com/en/products/edge-functions/) は、ネットワークエッジでカスタムコードの実行を可能にし、顧客のルールを実装してリクエストを処理します。Wallarmのカスタムコードを組み込むことで、受信トラフィックが分析とフィルタリングのためにWallarmノードにプロキシされます。この設定により、[Azionエッジファイアウォール](https://www.azion.com/en/products/edge-firewall/) によって既に提供されているセキュリティ対策が強化されます。このガイドでは、Azionエッジ上で稼働するサービスを保護するために、WallarmノードをAzionエッジと統合する方法について説明します。

このソリューションでは、Wallarmノードを外部にデプロイしてカスタムコードやポリシーを特定のプラットフォームに挿入し、トラフィックが外部のWallarmノードに向けられて分析し、潜在的な脅威に対する保護を可能にします。これはWallarmのコネクターとして知られており、Azionエッジ、Akamaiエッジ、Mulesoft、Apigee、およびAWS Lambdaなどのプラットフォームと外部のWallarmノードとの間の重要なリンクとして機能します。このアプローチにより、シームレスな統合、安全なトラフィック分析、リスク軽減、および全体的なプラットフォームセキュリティが確保されます。

## 使用ケース

サポートされているすべての[Wallarmデプロイメントオプション](../supported-deployment-options.md)の中でも、このソリューションは次の使用ケースにおいて推奨されています：

* Azionエッジで稼働しているAPIやトラフィックのセキュリティを強化する。
* 攻撃の観測、レポート、悪意のあるリクエストの即時ブロックを提供するセキュリティソリューションが必要とする。

## 制限事項

このソリューションは、受信リクエストだけを対象とするため、いくつかの制限があります：

* [パッシブ検出](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) 方法を使用した脆弱性の発見は適切に機能しません。このソリューションはAPIが脆弱であるか否かを決定します、それはテストする脆弱性に典型的な悪意のあるリクエストへのサーバー応答に基づいています。
* [Wallarm API Discovery](../../about-wallarm/api-discovery.md) は、このソリューションが応答分析に依存しているため、トラフィックに基づいてAPIインベントリを探索することはできません。
* [強制的なブラウジングに対する保護](../../admin-en/configuration-guides/protecting-against-bruteforce.md)は、この対応が応答コードの分析を必要とするため利用できません。

## 要件

デプロイメントを進めるためには、以下の要件を満たしていることを確認してください：

* Azionエッジテクノロジーの理解
* Azionエッジで稼働するAPIまたはトラフィック

## デプロイメント

AzionエッジのAPIをWallarmで保護するためのステップは以下の通りです：

1. 利用可能なデプロイメントオプションの一つを使用してWallarmノードをデプロイします。
1. Azionで実行するためのEdge Functions用Wallarmコードを取得し、実行します。

### 1. Wallarmノードをデプロイする

AzionエッジでWallarmを利用する際には、トラフィックの流れはインラインです。

1. インラインデプロイメントのための[サポートされているWallarmノードデプロイメントソリューションまたはアーティファクト](../supported-deployment-options.md)のうち、一つを選んで、提供されているデプロイメント手順に従います。