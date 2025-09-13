# Wallarmをコネクターとしてデプロイする

APIのデプロイは、Azion Edge、Akamai Edge、MuleSoft、Apigee、CloudFrontなどの外部ツールを活用するなど、さまざまな方法で実行できます。これらのAPIをWallarmで保護する方法をお探しの場合、そのようなケース向けに設計された「コネクター」という形のソリューションをご提供しています。

## 仕組み

Wallarmのコネクターソリューションは、APIゲートウェイやエッジプラットフォームなどのサードパーティプラットフォームと連携して、トラフィックをフィルタリングおよび分析します。このソリューションは主に2つのコンポーネントで動作します：

* [Wallarm](../security-edge/se-connector.md)またはお客様のいずれかがホストする**Wallarm node**が、トラフィックの解析とセキュリティチェックを実行します。
* サードパーティプラットフォームに注入され、分析のためにトラフィックをWallarm nodeへルーティングする**Wallarm提供のコードバンドルまたはポリシー**。

コネクターを使用すると、トラフィックは[インライン](../inline/overview.md)または[アウトオブバンド](../oob/overview.md)で分析できます：

=== "インラインのトラフィックフロー"

    Wallarmが悪意のあるアクティビティを[block](../../admin-en/configure-wallarm-mode.md)するように設定されている場合：

    ![画像](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "アウトオブバンドのトラフィックフロー"
    ![画像](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## サポート対象プラットフォーム

Wallarmは以下のプラットフォーム向けのコネクターを提供しています。

| コネクター | サポートされるトラフィックフローモード | ホスティング形態 |
| --- | ---- | ---- |
| [MuleSoft Mule Gateway](mulesoft.md) | インライン | Security Edge、セルフホスト |
| [MuleSoft Flex Gateway](mulesoft-flex.md) | インライン、アウトオブバンド | セルフホスト |
| [Apigee](apigee.md) | インライン | セルフホスト |
| [Akamai](akamai-edgeworkers.md) | インライン、アウトオブバンド | セルフホスト |
| [Azion Edge](azion-edge.md) | インライン | セルフホスト |
| [Amazon CloudFront](aws-lambda.md) | インライン、アウトオブバンド | Security Edge、セルフホスト |
| [Cloudflare](cloudflare.md) | インライン、アウトオブバンド | Security Edge、セルフホスト |
| [Kong Ingress Controller](kong-api-gateway.md) | インライン | セルフホスト |
| [Istio Ingress](istio.md) | インライン、アウトオブバンド | セルフホスト |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | インライン | セルフホスト |
| [Fastly](fastly.md) | インライン、アウトオブバンド | Security Edge、セルフホスト |
| [IBM DataPower](ibm-api-connect.md) | インライン | Security Edge、セルフホスト |

お探しのコネクターが見つからない場合は、要件のご相談や可能な解決策の検討のため、[営業チーム](mailto:sales@wallarm.com)までお気軽にご連絡ください。

!!! info "デプロイの代替案"
    マネージドのインラインオプションをご希望ですか？[Security Edge](../security-edge/overview.md)をご覧ください。

    従来型のセルフマネージドデプロイ（VM、Kubernetes、クラウド環境）の場合は、[セルフホストNodeのデプロイ](../supported-deployment-options.md)をご参照ください。