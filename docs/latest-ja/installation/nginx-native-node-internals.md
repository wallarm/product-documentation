# NGINXおよびネイティブセルフホスト型Wallarmノードの内部構造

WallarmノードはWallarmプラットフォームの中核コンポーネントであり、トラフィックのフィルタリングおよび解析を担当します。自環境（セルフホスト）またはWallarmのSecurity Edgeに展開できます。**セルフホスト型ノード**を展開する場合、**NGINXノード**または**ネイティブノード**の2つのオプションがあります。

これらの2つのノードはアーキテクチャ的に異なり、特定の展開ユースケース向けに設計されています。

## NGINXノード

NGINXノードはNGINXとシームレスに統合され、既にNGINXに依存しているトラフィック管理インフラに最適です。NGINXの機能を活用しながら、Wallarmのセキュリティおよびトラフィックフィルタリング機能を追加します。

NGINXノードを展開するために、以下の[アーティファクト](../updating-migrating/node-artifact-versions.md)が利用可能です：

* [オールインワンインストーラー](nginx/all-in-one.md)
* [Dockerイメージ](../admin-en/installation-docker-en.md)
* [AWS AMI](packages/aws-ami.md)
* [GCPマシンイメージ](packages/gcp-machine-image.md)
* Helmチャート（[NGINX Ingress Controller](../admin-en/installation-kubernetes-en.md)、[Sidecar Controller](kubernetes/sidecar-proxy/deployment.md)、[eBPF](kubernetes/ebpf/deployment.md)展開用）

下記の**ユースケース**に合わせた形状でNGINXノードを展開してください。

### Kubernetes

Kubernetes環境向けのNGINXノード展開ソリューションは以下をご確認ください：

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>統合Wallarmサービス付きNGINX Ingress Controllerを展開します</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar</h3>
            <p>Podセキュリティ向けにWallarm Sidecarコントローラーを展開します</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>eBPF技術を利用したKubernetes上のアウトオブバンドデプロイです</p>
        </a>
    </div>
</div>

### Connectors

APIの展開はAzion Edge、Akamai Edge、Mulesoft、Apigee、CloudFrontなどの外部ツールを活用するなど、様々な方法で実施可能です。WallarmでこれらのAPIを保護する方法をお探しの場合は、これらのケース向けに特化した["connectors"](connectors/overview.md)形式のソリューションをご提供します。

NGINXノードは以下のプラットフォームで使用されますが、解析は受信リクエストに限定されます。

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Apigee上で稼働するAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Akamai EdgeWorkers上で稼働するAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Azion Edge上で稼働するAPIを保護します</p>
        </a>
    </div>
</div>

### In-line

保護されたAPIへのトラフィックは、Wallarm NGINXノードのインスタンスを通過してからAPIへ到達します。Wallarmノードがインラインであり、エンドユーザーに対して唯一の経路である限り、攻撃者がWallarmノードをバイパスする可能性はありません。[詳細はこちら](inline/overview.md)

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>オールインワンインストーラー</h3>
            <p>Linux OS搭載のマシン上でノードを実行します</p>
        </a>

        <div id="inline-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS上での展開用アーティファクトです</p>
        </div>

        <div id="inline-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP上での展開用アーティファクトです</p>
        </div>

        <div id="inline-public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azure上での展開用アーティファクトです</p>
        </div>

        <div id="inline-public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloud上での展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/docker/nginx-based/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Dockerイメージ</h3>
            <p>コンテナ化環境でノードを実行します</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS上での展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ami/">
            <h3>AMI</h3>
            <p>公式Amazon Machine Imageを使用してWallarmを展開します</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ecs/">
            <h3>ECS</h3>
            <p>Dockerイメージを利用してElastic Container Service上でWallarmを展開します</p>
        </a>

        <div id="inline-public-clouds-aws-terraform" class="do-card">
            <h3>Terraformモジュール</h3>
            <p>インラインWallarm展開用のTerraformモジュールです</p>
        </div>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraformモジュール</h3>
            <p>AWS上でのインラインWallarm展開用Terraformモジュールです</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-vpc/">
            <h3>AWS VPCでのプロキシ</h3>
            <p>AWS Virtual Private Cloud上でプロキシとしてWallarmを展開します</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-api-gateway/">
            <h3>Amazon API Gateway用プロキシ</h3>
            <p>Amazon API Gateway保護用にWallarmをプロキシとして展開します</p>
        </a>

    </div>

    <div class="do-nested" data-for="inline-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP上での展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/machine-image/">
            <h3>マシンイメージ</h3>
            <p>公式Google Cloud Machine Imageを使用してWallarmを展開します</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/gce/">
            <h3>GCE</h3>
            <p>Dockerイメージを使用してGoogle Compute Engine上でWallarmを展開します</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azure上での展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/azure/docker-image/">
            <h3>Azure Container Instances</h3>
            <p>Dockerイメージを使用してAzure Container Instances上でWallarmを展開します</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloud上での展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/alibaba/docker-image/">
            <h3>ECS</h3>
            <p>Dockerイメージを使用してElastic Compute Service上でWallarmを展開します</p>
        </a>
    </div>

</div>

### Out-of-band

NGINXノードは、NGINX、Envoyまたはその他のWebサーバーにより生成されたトラフィックミラーを用いた[アウトオブバンドトラフィック](oob/overview.md)解析に適しています。

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>オールインワンインストーラー</h3>
            <p>Linux OS搭載のマシン上でノードを実行します</p>
        </a>

        <div id="mirroring-by-web-servers-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS上でのWallarm OOB展開用アーティファクトです</p>
        </div>

        <div id="mirroring-by-web-servers-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP上でのWallarm OOB展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/docker-image/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Dockerイメージ</h3>
            <p>コンテナ化環境でノードを実行します</p>
        </a>

    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS上でのWallarm OOB展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/aws-ami/">
            <h3>AMI</h3>
            <p>公式Machine Imageを使用してAWS上でWallarm OOBを展開します</p>
        </a>

        <a class="do-card" href="../../installation/oob/terraform-module/mirroring-by-web-server/">
            <h3>Terraformモジュール</h3>
            <p>AWS上で稼働するKubernetes向けWallarm OOB展開用Terraformモジュールです</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Google Cloud上でのWallarm OOB展開用アーティファクトです</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/gcp/machine-image/">
            <h3>マシンイメージ</h3>
            <p>公式Machine Imageを使用してGoogle Cloud上でWallarm OOBを展開します</p>
        </a>
    </div>

</div>

## ネイティブノード

ネイティブノードはNGINXに依存せず、NGINXが不要な環境や、より軽量でプラットフォームに依存しないソリューションが望まれる環境向けに開発されました。

ネイティブノードを展開するために、以下のアーティファクトが利用可能です：

* [オールインワンインストーラー](native-node/all-in-one.md)
* [Dockerイメージ](native-node/docker-image.md)
* [Helmチャート](native-node/helm-chart.md)

下記の**ユースケース**に合わせた形状でネイティブノードを展開してください。

### Connectors

APIの展開はAzion Edge、Akamai Edge、Mulesoft、Apigee、CloudFrontなどの外部ツールを活用するなど、様々な方法で実施可能です。WallarmでこれらのAPIを保護する方法をお探しの場合は、これらのケース向けに特化した["connectors"](connectors/overview.md)形式のソリューションをご提供します。

ネイティブノードは下記のプラットフォームで制約なく動作します：

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>Mulesoft</h3>
            <p>MuleSoft Anypointプラットフォーム上で展開されるAPIを保護します</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Amazon CloudFront経由で配信されるトラフィックを保護します</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Cloudflare経由で稼働するトラフィックを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong API Gateway</h3>
            <p>Kong Ingress Controllerで管理されるAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>Istioで管理されるAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Layer7 API Gatewaysで管理されるAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/fastly/">
            <img class="non-zoomable" src="../../images/platform-icons/fastly.png" />
            <h3>Fastly</h3>
            <p>Fastly上で稼働するAPIを保護します</p>
        </a>
    </div>
</div>

### Out-of-band

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCPトラフィックミラー解析</h3>
            <p>TCPトラフィックミラー解析用のアウトオブバンドデプロイです</p>
        </a>
    </div>
</div>

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

<script src="/nginx-native-node-deployments.min.js?v=1"></script>