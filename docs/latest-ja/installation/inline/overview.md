# Wallarmノードのインラインデプロイ

Wallarmはインラインでデプロイでき、リアルタイムに脅威を軽減できます。この場合、保護対象APIへのトラフィックはAPIに到達する前にWallarmノードインスタンスを経由します。ノードがインラインでありエンドユーザーにとって唯一の経路である限り、攻撃者がWallarmノードを迂回する余地はありません。本記事ではこのアプローチを詳しく説明します。

Wallarmノードインスタンスはクライアントとサーバーの間に配置され、受信トラフィックを解析し、不正リクエストを軽減し、正当なリクエストを保護対象サーバーへ転送します。 

## ユースケース

Wallarmのインラインソリューションは次のユースケースに適しています。

* SQLi、XSSインジェクション、API悪用、ブルートフォースなどの不正リクエストをアプリケーションサーバーに到達する前に軽減します。
* システムのアクティブなセキュリティ脆弱性を把握し、アプリケーションコードを修正する前に仮想パッチを適用します。
* APIインベントリを可視化し、機密データを追跡します。

## 利点と特有の要件

Wallarmのインラインデプロイ手法は、[OOB](../oob/overview.md)デプロイなど他の方式に比べていくつかの利点があります。

* トラフィック解析がリアルタイムに行われるため、不正リクエストを即時にブロックします。
* 受信リクエストとサーバーレスポンスの両方にアクセスできるため、[API Discovery](../../api-discovery/overview.md)や[脆弱性の検出](../../about-wallarm/detecting-vulnerabilities.md)を含むすべてのWallarm機能が制限なく動作します。

インライン方式を実装するには、インフラストラクチャ内のトラフィック経路を変更する必要があります。さらに、サービスを中断なく提供できるよう、Wallarmノードの[リソース割り当て](../../admin-en/configuration-guides/allocate-resources-for-node.md)を慎重に検討してください。

本番環境でAWSやGCPなどのパブリッククラウド上にWallarmノードをデプロイする場合、最適なパフォーマンス、スケーラビリティ、回復性を確保するため、適切に構成されたオートスケーリンググループの使用が必要です（[AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md)または[GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md)の記事を参照してください）。

## デプロイモデルとサポートされるデプロイ方法

Wallarmをインラインでデプロイする際には、以下の一般的なモデルを検討できます。

* Wallarm Security Edge
* コンピュートインスタンス上でのセルフホスト型ノードのデプロイ
* Kubernetes上でのセルフホスト型ノードのデプロイ

インフラストラクチャの要件に基づいて、デプロイモデルと方法を選択できます。適切なデプロイモデルと方法の選定に支援が必要な場合は、[営業チーム](mailto:sales@wallarm.com)までお気軽にお問い合わせのうえ、インフラストラクチャに関する追加情報をご提供ください。お客様に合わせたガイダンスをご案内します。

### Wallarm Security Edgeの実行

Security Edgeプラットフォームは、Wallarmがホストする環境内の地理的に分散したロケーションにノードをデプロイするためのマネージドサービスを提供します。[詳細はこちら](../security-edge/inline/overview.md)

### コンピュートインスタンス上でWallarmを実行する

このモデルでは、Wallarmをインフラストラクチャ内の仮想アプライアンスとしてデプロイします。仮想アプライアンスはVM、コンテナ、またはクラウドインスタンスとしてインストールできます。

Wallarmノードをデプロイする際、ネットワークトポロジ内のさまざまな場所に柔軟に配置できます。推奨アプローチは、ノードインスタンスをパブリックロードバランサーの背後（バックエンドサービスの前段）またはプライベートロードバランサーの背後（通常バックエンドサービスの前段）に配置することです。次の図は、この構成における典型的なトラフィックフローを示します。

![インラインフィルタリングの構成](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

ロードバランサーはL4とL7の2種類に分類できます。ロードバランサーの種類によりSSLオフロードの扱いが決まり、既存インフラストラクチャにWallarmを統合する際の重要な要素になります。

* L4ロードバランサーを使用する場合、一般的にSSLオフロードはロードバランサー背後のWebサーバーや、Wallarmインスタンス以外のインフラ手段で処理されます。ただし、Wallarmノードをデプロイする際は、Wallarmインスタンス側でSSLオフロードを構成する必要があります。
* L7ロードバランサーを使用する場合、一般的にSSLオフロードはロードバランサー自体が処理し、Wallarmノードは平文HTTPを受け取ります。

コンピュートインスタンス上でWallarmを実行するために、以下のアーティファクトおよびソリューションを提供します。

**Amazon Web Services (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Terraformモジュール：
    * [AWS VPC内のプロキシ](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Amazon API Gateway向けプロキシ](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [マシンイメージ](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Container Instances](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Dockerイメージ**

* [NGINXベース](compute-instances/docker/nginx-based.md)

**Linuxパッケージ**

* [オールインワンインストーラー](compute-instances/linux/all-in-one.md)

### Kubernetes上でWallarmを実行する

コンテナオーケストレーションにKubernetesを利用している場合、WallarmはKubernetesネイティブなソリューションとしてデプロイできます。Ingressやサイドカーのコントローラーなどの機能を活用し、Kubernetesクラスターにシームレスに統合します。

Kubernetes上でWallarmを実行するために、以下のアーティファクトおよびソリューションを提供します。

* [NGINX Ingressコントローラー](../../admin-en/installation-kubernetes-en.md)
* [サイドカーコントローラー](../kubernetes/sidecar-proxy/deployment.md)