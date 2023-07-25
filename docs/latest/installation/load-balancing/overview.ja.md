# ロードバランサとのWallarmのインライン型展開

Wallarmは、ロードバランサまたは他のトラフィック分散サービスがあるインフラ内で、リアルタイムで脅威を軽減するリバースプロキシとしてインラインで展開できます。この記事ではそのアプローチについて詳しく説明します。

WallarmがリバースプロキシとしてAPIを保護すると、そのリソースへのトラフィックはバックエンドサーバに到達する前にWallarmを経由します。インラインになっており、エンドユーザにとって唯一の利用可能なパスであれば、攻撃者がWallarmノードをバイパスするチャンスはありません。

## トラフィックフロー

Wallarmリバースプロキシはクライアントとサーバの間に配置されます。それは着信トラフィックを分析し、悪意のあるリクエストを緩和し、正当なリクエストを保護されたサーバに転送します：

![インラインフィルタリングスキーム](../../images/waf-installation/load-balancing/wallarm-inline-deployment-scheme.png)

## 利点と限界

Wallarmのインライン展開へのアプローチは、[OOB](../oob/overview.ja.md) 展開などの他の展開方法と比べていくつかの利点を提供します：

* Wallarmはトラフィック分析がリアルタイムで進行するため、悪意のあるリクエストを即座にブロックします。
* Wallarmが着信リクエストとサーバ応答の両方にアクセスできるため、[API Discovery](../../about-wallarm/api-discovery.ja.md) および [vulnerability detection](../../about-wallarm/detecting-vulnerabilities.ja.md) などのすべてのWallarm機能が制限なく動作します。

一方、[OOB](../oob/overview.ja.md)アプローチとは対照的に、インライン展開は特にハイトラフィックのシナリオでは追加のレイテンシを導入する可能性があります。これは、各リクエストの分析に少しの時間が必要であるためです、それほど重要ではありませんが。 [Wallarmノードのための十分なリソースの割り当て](../../admin-en/configuration-guides/allocate-resources-for-node.ja.md)が問題を防ぎます。

## 使用例

Wallarmのインラインソリューションは以下の使用例に適しています：

* アプリケーションサーバに到達する前に、SQli、XSSインジェクション、APIの悪用、ブルートフォースなどの悪意のあるリクエストを軽減します。
* システムのアクティブなセキュリティ脆弱性について認識し、アプリケーションコードを修正する前に仮想パッチを適用します。
* APIインベントリを観察し、機密データを追跡します。

## サポートされている展開オプション

Wallarmは、使用しているウェブサーバによって異なる、インライン展開のための様々なアーティファクトを提供します：

* NGINX stable:
   * DEB/RPMパッケージ
   * Docker image
   * K8s Ingress Controller
   * K8s Sidecar Proxy
   * AWS AMIイメージ
   * GCPクラウドイメージ
   * AWS ECS
   * GCE
   * Azure Container Instancesサービス
   * Alibaba ECS
   * AWSのTerraformモジュール
* NGINX Plus:
    * DEB/RPMパッケージ
* Distribution-provided NGINX:
   * DEB/RPMパッケージ
* Kong:
   * K8s Kong Ingress Controller
* Envoy:
    * Docker image

保護する範囲に応じて、Wallarmソリューションを既存のロードバランサの背後、後、レベルに配置するか、またはWallarm K8sソリューションに置き換えることができます。

<!-- 
1. внути самих инструкйи надо в backend-server указывать адрес балансировщика?
1. specify somewhere that +++ correct real IP identification is needed.
-->