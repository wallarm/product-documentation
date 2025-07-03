# コネクタとしてWallarmを展開する

APIの展開は、Azion Edge、Akamai Edge、MuleSoft、Apigee、CloudFrontなどの外部ツールを利用するなど、さまざまな方法で実施可能です。これらのAPIをWallarmで保護したい場合、特定のケース向けに設計された「コネクタ」形式のソリューションをご提供します。

## 仕組み

Wallarmのコネクタソリューションは、APIゲートウェイやエッジプラットフォームなどのサードパーティプラットフォームと統合し、トラフィックのフィルタリングと解析を行います。このソリューションは主に2つのコンポーネントで構成されます。

* **Wallarmノード**は、[Wallarm](../se-connector.md)またはクライアントによってホストされ、トラフィック解析とセキュリティチェックを実行します。
* サードパーティプラットフォームにインジェクトされ、トラフィックをWallarmノードへ解析のためにルーティングする**Wallarmが提供したコードバンドルまたはポリシー**です。

コネクタを使用することで、トラフィック解析は[in-line](../inline/overview.md)または[out-of-band](../oob/overview.md)で実施できます。

=== "インライントラフィックフロー"

    Wallarmが悪意のあるアクティビティを[block](../../admin-en/configure-wallarm-mode.md)するように設定されている場合:

    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-inline.png)
=== "アウトオブバンドトラフィックフロー"
    ![image](../../images/waf-installation/general-traffic-flow-for-connectors-oob.png)

## 対応プラットフォーム

Wallarmは以下のプラットフォーム向けにコネクタを提供します:

| コネクタ | 対応トラフィックフローモード | コネクタのホスティング |
| --- | ---- | ---- |
| [MuleSoft](mulesoft.md) | インライン | Security Edge, セルフホステッド |
| [Apigee](apigee.md) | インライン | セルフホステッド |
| [Akamai EdgeWorkers](akamai-edgeworkers.md) | インライン | セルフホステッド |
| [Azion Edge](azion-edge.md) | インライン | セルフホステッド |
| [Amazon CloudFront](aws-lambda.md) | インライン, アウトオブバンド | Security Edge, セルフホステッド |
| [Cloudflare](cloudflare.md) | インライン, アウトオブバンド | Security Edge, セルフホステッド |
| [Kong Ingress Controller](kong-api-gateway.md) | インライン | セルフホステッド |
| [Istio Ingress](istio.md) | アウトオブバンド | セルフホステッド |
| [Broadcom Layer7 API Gateways](layer7-api-gateway.md) | インライン | セルフホステッド |
| [Fastly](fastly.md) | インライン, アウトオブバンド | Security Edge, セルフホステッド |

ご希望のコネクタが見つからない場合は、どうぞお気軽に[Sales team](mailto:sales@wallarm.com)までお問い合わせいただき、ご要件のご相談および検討可能なソリューションについてご確認ください。