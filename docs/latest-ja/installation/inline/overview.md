# Wallarmノードのインライン展開

Wallarmはリアルタイムで脅威を軽減するためにインライン展開できます。この場合、保護されたAPIへのトラフィックはAPIに到達する前にWallarmノードインスタンスを通過します。Wallarmノードがインラインであり、エンドユーザーが利用できる唯一の経路である限り、攻撃者がWallarmノードを回避する可能性はありません。本記事では、このアプローチについて詳述します。

Wallarmノードインスタンスはクライアントとサーバーの間に位置し、受信トラフィックを解析、悪意あるリクエストを軽減し、正当なリクエストを保護されたサーバーに転送します。

## ユースケース

Wallarmのインラインソリューションは、以下のユースケースに適しています:

* SQLi、XSSインジェクション、API乱用、ブルートフォースなどの悪意あるリクエストをアプリケーションサーバーに到達する前に軽減します。
* システム上の現行のセキュリティ脆弱性について情報を取得し、アプリケーションコードを修正する前に仮パッチを適用します。
* APIのインベントリを監視し、機微なデータを追跡します。

## メリットと特定の要件

Wallarmのインライン展開方式は、[OOB](../oob/overview.md)展開など他の展開方式に比べ、いくつかの利点を提供します:

* Wallarmはリアルタイムでトラフィック解析が行われるため、悪意あるリクエストを即座にブロックします。
* Wallarmは、受信リクエストとサーバーレスポンスの両方にアクセスできるため、[API Discovery](../../api-discovery/overview.md)や[脆弱性検出](../../about-wallarm/detecting-vulnerabilities.md)を含む全ての機能が制限なく動作します。

インライン方式を実装するには、インフラストラクチャ内のトラフィックルートを変更する必要があります。さらに、サービスの中断が発生しないよう、Wallarmノードの[リソース割当](../../admin-en/configuration-guides/allocate-resources-for-node.md)を慎重に検討してください。

本番環境向けにAWSやGCPなどのパブリッククラウド上にWallarmノードを展開する場合、最適なパフォーマンス、スケーラビリティおよび回復性を確保するため、適切に構成された自動スケーリンググループを使用する必要があります（[AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md)または[GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md)の記事を参照してください）.

## 展開モデルとサポートされる展開方法

Wallarmのインライン展開に関して、考慮すべき一般的なモデルは以下の通りです:

* Wallarm Security Edge
* セルフホスト型ノードのコンピュートインスタンスへの展開
* セルフホスト型ノードのKubernetes上での展開

インフラストラクチャの状況に応じて、展開モデルおよび方法を選択できます。適切な展開モデルおよび方法の選択に関して支援が必要な場合は、どうぞお気軽に[sales team](mailto:sales@wallarm.com)にご連絡いただき、環境に関する詳細情報をご提供ください。

### Wallarm Security Edgeの実行

Security Edgeプラットフォームは、Wallarmがホストする環境内において、地理的に分散したロケーションにノードを展開するためのマネージドサービスを提供します。[続きを読む](../security-edge/deployment.md)

### コンピュートインスタンス上でのWallarmの実行

このモデルでは、インフラストラクチャ内に仮想アプライアンスとしてWallarmを展開します。仮想アプライアンスは、VM、コンテナまたはクラウドインスタンスとしてインストールできます。

Wallarmノードを展開する際、ネットワークトポロジ内の異なる場所に配置する柔軟性があります。しかし、推奨される方法は、ノードインスタンスをパブリックロードバランサーの背後またはプライベートロードバランサーの背後に配置し、バックエンドサービスの前に置くことです。以下の図は、このセットアップにおける一般的なトラフィックフローを示しています:

![In-line filtering scheme](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

ロードバランサーは、L4とL7の2種類に分類されます。ロードバランサーのタイプは、SSLオフロードの処理方法を決定し、これは既存のインフラストラクチャにWallarmを統合する際に重要です。

* L4ロードバランサーを使用する場合、一般的には、ロードバランサーの後ろに配置されたWebサーバーやその他の方法によってSSLオフロードが処理されます。しかし、Wallarmノードを展開する際には、Wallarmノード上でSSLオフロードを構成する必要があります。
* L7ロードバランサーを使用する場合、通常はロードバランサー自体がSSLオフロードを処理し、Wallarmノードには平文のHTTPが届きます。

コンピュートインスタンス上でのWallarm実行のため、Wallarmは以下のアーティファクトおよびソリューションを提供します:

**Amazon Web Services (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Terraformモジュール:
    * [AWS VPC内のプロキシ](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Amazon API Gateway用プロキシ](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [マシンイメージ](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Container Instances](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Dockerイメージ**

* [NGINXベース](compute-instances/docker/nginx-based.md)
* [Envoyベース](compute-instances/docker/envoy-based.md)

**Linuxパッケージ**

* [オールインワンインストーラー](compute-instances/linux/all-in-one.md)

### Kubernetes上でのWallarmの実行

もしKubernetesをコンテナオーケストレーションに利用している場合、WallarmはKubernetesネイティブのソリューションとして展開できます。Kubernetesクラスターとシームレスに統合し、ingressまたはsidecarコントローラーなどの機能を活用します。

Wallarmは、Kubernetes上でのWallarm実行のため、以下のアーティファクトおよびソリューションを提供します:

* [NGINX Ingressコントローラー](../../admin-en/installation-kubernetes-en.md)
* [Kong Ingressコントローラー](../kubernetes/kong-ingress-controller/deployment.md)
* [Sidecarコントローラー](../kubernetes/sidecar-proxy/deployment.md)