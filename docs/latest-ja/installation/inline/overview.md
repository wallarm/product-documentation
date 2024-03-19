# Wallarmノードのインラインデプロイメント

Wallarmは、リアルタイムで脅威を軽減するためにインラインでデプロイすることができます。この場合、保護されたAPIへの通信は、APIに到達する前にWallarmノードインスタンスを通過します。インラインであり、エンドユーザーに利用可能な唯一のパスである限り、攻撃者がWallarmノードをバイパスする可能性はありません。この記事では、そのアプローチについて詳しく説明します。
Wallarmノードインスタンスはクライアントとサーバーの間に位置し、着信トラフィックを分析し、悪意のあるリクエストを軽減し、正当なリクエストを保護されたサーバーに転送します。

## ユースケース

下記のケースに対して、Wallarmのインラインソリューションが適しています：

* アプリケーションサーバーに到達する前にSQli、XSSインジェクション、APIの悪用、総当たり攻撃などの悪意のあるリクエストを軽減します。
* システムの現在のセキュリティ脆弱性についての知識を得て、アプリケーションコードの修正前に仮想パッチを適用します。
* APIインベントリを監視し、機密データを追跡します。

## 利点と具体的な要件

Wallarmのデプロイメントに対するインラインデプロイメントアプローチは、他のデプロイメント方法、例えば[OOB](../oob/overview.md)デプロイメントに比べていくつかの利点があります：

* トラフィック解析はリアルタイムで行われるため、Wallarmは即座に悪意のあるリクエストをブロックします。
* Wallarmは着信リクエストとサーバーの応答の両方にアクセス可能なため、[API Discovery](../../api-discovery/overview.md) や [vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) などのすべてのWallarm機能が制限なく動作します。

インラインスキームを実装するためには、インフラストラクチャ内のトラフィックルートを変更する必要があります。さらに、サービスの中断を防ぐために、Wallarmノードの[resource allocation](../../admin-en/configuration-guides/allocate-resources-for-node.md)について慎重に考慮してください。

本番環境のAWSやGCPなどのパブリッククラウドにWallarmノードをデプロイする際は、最適なパフォーマンス、スケーラビリティ、耐障害性を得るために、適切に設定されたオートスケーリンググループの使用が必須です（[AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) や [GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md) の記事を参照してください）。

## デプロイメントモデルと対応するデプロイメント方法

Wallarmをインラインでデプロイする場合、考慮すべき2つの一般的なモデルがあります：コンピュートインスタンスデプロイメントとKubernetesデプロイメント。

あなたのインフラストラクチャの特性に基づいてデプロイメントモデルと方法を選択できます。適切なデプロイメントモデルと方法を選択するためのアシスタンスが必要な場合は、適切なガイダンスを提供するためにあなたのインフラストラクチャに関する追加情報を提供して、私たちの[sales team](mailto:sales@wallarm.com)にお気軽にお問い合わせください。

### コンピュートインスタンスでのWallarmの実行

このモデルでは、Wallarmをあなたのインフラストラクチャ内の仮想アプライアンスとしてデプロイします。仮想アプライアンスはVM、コンテナ、またはクラウドインスタンスとしてインストールすることができます。

Wallarmノードをデプロイする際には、ネットワークトポロジー内のさまざまな位置に配置する柔軟性があります。しかし、推奨されるアプローチは、ノードインスタンスをパブリックロードバランサーの後ろ、あるいはバックエンドサービスの前、または通常はバックエンドサービスの前に位置するプライベートロードバランサーの前に配置することです。以下の図では、このセットアップでの一般的なトラフィックフローが示されています：

![In-line filtering scheme](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

ロードバランサーはL4とL7の2つのタイプに分類することができます。ロードバランサーのタイプは、SSLオフローディングの処理方法を決定します。これはWallarmを既存のインフラストラクチャに統合する際に重要です。

* L4ロードバランサーを使用する場合、通常はロードバランサーの後ろに配置されたWebサーバーやインフラ内の他の手段でSSLオフローディングが処理されます。Wallarmインスタンスは使用されません。しかし、Wallarmノードをデプロイする際には、WallarmインスタンスでSSLオフローディングを設定する必要があります。
* L7ロードバランサーを使用する場合、通常はロードバランサー自体がSSLオフローディングを処理し、Wallarmノードは平文のHTTPを受け取ります。

Wallarmは、コンピュートインスタンスでWallarmを実行するための以下のアーティファクトとソリューションを提供します：

**Amazon Web Services (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Terraformモジュール:
    * [Proxy in AWS VPC](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Proxy for Amazon API Gateway](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [Machine image](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Container Instances](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Dockerイメージ**

* [NGINX-based](compute-instances/docker/nginx-based.md)
* [Envoy-based](compute-instances/docker/envoy-based.md)

**Linuxパッケージ**

* [個別のパッケージ for NGINX stable](compute-instances/linux/individual-packages-nginx-stable.md)
* [個別のパッケージ for NGINX Plus](compute-instances/linux/individual-packages-nginx-plus.md)
* [個別のパッケージ for distribution-provided NGINX](compute-instances/linux/individual-packages-nginx-distro.md)
* [All-in-one installer](compute-instances/linux/all-in-one.md)

### Kubernetes上でのWallarmの実行

コンテナオーケストレーションにKubernetesを使用している場合、WallarmはKubernetesネイティブソリューションとしてデプロイされます。それはIngressやSidecarコントローラーなどの機能を利用してKubernetesクラスターとシームレスに統合します。

Wallarmは、Kubernetes上でWallarmを実行するための以下のアーティファクトとソリューションを提供します：

* [NGINX Ingress controller](../../admin-en/installation-kubernetes-en.md)
* [Kong Ingress controller](../kubernetes/kong-ingress-controller/deployment.md)
* [Sidecarコントローラー](../kubernetes/sidecar-proxy/deployment.md)