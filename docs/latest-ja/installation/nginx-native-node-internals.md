# NGINXおよびNative自営型Wallarmノードの内部構造

WallarmノードはWallarmプラットフォームの中核コンポーネントで、トラフィックのフィルタリングと解析を担います。これはお客様の環境（自営型）またはWallarmのSecurity Edge上にデプロイできます。自営型ノードをデプロイする場合、選択肢はNGINXノードとNativeノードの2つです。

これら2つのノードはアーキテクチャが異なり、特定のデプロイユースケースに合わせて設計されています。

## NGINXノード

NGINXノードはNGINXとシームレスに統合し、トラフィック管理にNGINXを既に利用しているインフラストラクチャに最適です。NGINXの機能を活用しつつ、Wallarmのセキュリティおよびトラフィックフィルタリング機能を追加します。

NGINXノードのデプロイには、以下の[アーティファクト](../updating-migrating/node-artifact-versions.md)を利用できます：

* [All-in-oneインストーラー](nginx/all-in-one.md)
* [Dockerイメージ](../admin-en/installation-docker-en.md)
* [AWS AMI](packages/aws-ami.md)
* [GCP Machine Image](packages/gcp-machine-image.md)
* [NGINX Ingress Controller](../admin-en/installation-kubernetes-en.md)、[Sidecar Controller](kubernetes/sidecar-proxy/deployment.md)、[eBPF](kubernetes/ebpf/deployment.md)のデプロイ用Helmチャート

以下のユースケースから該当するものを選び、適切な形態でNGINXノードをデプロイしてください。

### Kubernetes

Kubernetes環境向けのNGINXノードのデプロイソリューションは次のとおりです。

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Wallarmサービスを統合したNGINX Ingress Controllerをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar</h3>
            <p>Podのセキュリティ向けにWallarm Sidecar Controllerをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>eBPFテクノロジーを使用したKubernetesでのアウトオブバンドデプロイ</p>
        </a>
    </div>
</div>

### コネクタ

APIのデプロイには、Azion Edge、Akamai Edge、MuleSoft、Apigee、CloudFrontなどの外部ツールを利用するなど、さまざまな方法があります。これらのAPIをWallarmで保護する方法をお探しの場合は、このようなケース向けに設計された「[コネクタ](connectors/overview.md)」という形のソリューションをご提供しています。

NGINXノードは以下のプラットフォームで使用できますが、解析は受信リクエストに限定されます。

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Apigee上で動作するAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Akamai EdgeWorkers上で動作するAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Azion Edge上で動作するAPIを保護します</p>
        </a>
    </div>
</div>

### インライン

保護対象APIへのトラフィックは、APIに到達する前にWallarm NGINXノードのインスタンスを通過します。ノードがインラインであり、エンドユーザーにとって唯一の経路である限り、攻撃者がWallarmノードをバイパスする余地はありません。 [詳細はこちら](inline/overview.md)

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-oneインストーラー</h3>
            <p>Linux OSを搭載したマシン上でノードを実行します</p>
        </a>

        <div id="inline-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWSでのデプロイ用アーティファクト</p>
        </div>

        <div id="inline-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCPでのデプロイ用アーティファクト</p>
        </div>

        <div id="inline-public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azureでのデプロイ用アーティファクト</p>
        </div>

        <div id="inline-public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloudでのデプロイ用アーティファクト</p>
        </div>

        <a class="do-card" href=../../installation/heroku/docker-image/>
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>WallarmのDockerイメージをビルドし、Herokuで実行します</p>
        </a>
        
        <a class="do-card" href="../../installation/inline/compute-instances/docker/nginx-based/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Dockerイメージ</h3>
            <p>コンテナ化された環境でノードを実行します</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWSでのデプロイ用アーティファクト</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ami/">
            <h3>AMI</h3>
            <p>公式のAmazon Machine Imageを使用してWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ecs/">
            <h3>ECS</h3>
            <p>Dockerイメージを使用してElastic Container ServiceでWallarmをデプロイします</p>
        </a>

        <div id="inline-public-clouds-aws-terraform" class="do-card">
            <h3>Terraformモジュール</h3>
            <p>インラインのWallarmデプロイにTerraformモジュールを使用します</p>
        </div>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraformモジュール</h3>
            <p>AWSでのインラインWallarmデプロイにTerraformモジュールを使用します</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-vpc/">
            <h3>AWS VPC内のプロキシ</h3>
            <p>AWS Virtual Private CloudにおいてWallarmをプロキシとして利用します</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-api-gateway/">
            <h3>Amazon API Gateway向けプロキシ</h3>
            <p>Amazon API Gatewayの保護用プロキシとしてWallarmを利用します</p>
        </a>

    </div>

    <div class="do-nested" data-for="inline-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCPでのデプロイ用アーティファクト</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/machine-image/">
            <h3>Machine Image</h3>
            <p>公式のGoogle Cloud Machine Imageを使用してWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/gce/">
            <h3>GCE</h3>
            <p>Dockerイメージを使用してGoogle Compute EngineでWallarmをデプロイします</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azureでのデプロイ用アーティファクト</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/azure/docker-image/">
            <h3>Azure Container Instances</h3>
            <p>Dockerイメージを使用してAzure Container InstancesでWallarmをデプロイします</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloudでのデプロイ用アーティファクト</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/alibaba/docker-image/">
            <h3>ECS</h3>
            <p>Dockerイメージを使用してElastic Compute ServiceでWallarmをデプロイします</p>
        </a>
    </div>

</div>

## Nativeノード

NativeノードはNGINXに依存しません。NGINXが不要な環境、またはより軽量でプラットフォーム非依存のソリューションが好まれる環境向けに開発されました。

Nativeノードのデプロイには、以下の[アーティファクト](../updating-migrating/native-node/node-artifact-versions.md)を利用できます：

* [All-in-oneインストーラー](native-node/all-in-one.md)
* [Dockerイメージ](native-node/docker-image.md)
* [AWS AMI](native-node/aws-ami.md)
* [Helmチャート](native-node/helm-chart.md)

以下のユースケースから該当するものを選び、適切な形態でNativeノードをデプロイしてください。

### コネクタ

APIのデプロイには、Azion Edge、Akamai Edge、MuleSoft、Apigee、CloudFrontなどの外部ツールを利用するなど、さまざまな方法があります。これらのAPIをWallarmで保護する方法をお探しの場合は、このようなケース向けに設計された「[コネクタ](connectors/overview.md)」という形のソリューションをご提供しています。

Nativeノードは以下のプラットフォームで制限なく動作します。

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>MuleSoft Mule Gateway</h3>
            <p>Mule Gatewayで管理されるAPIを保護するためにWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/connectors/mulesoft-flex/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft-flex-gateway.png" />
            <h3>MuleSoft Flex Gateway</h3>
            <p>Flex Gatewayで管理されるAPIを保護するためにWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Amazon CloudFront経由で配信されるトラフィックを保護するためにWallarmをデプロイします</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Cloudflare経由のトラフィックを保護するためにWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong API Gateway</h3>
            <p>Kong Ingress Controllerで管理されるAPIを保護するためにWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>Istioで管理されるAPIを保護するために、インラインまたはアウトオブバンド（OOB）でWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Layer7 API Gatewaysで管理されるAPIを保護します</p>
        </a>

        <a class="do-card" href="../../installation/connectors/fastly/">
            <img class="non-zoomable" src="../../images/platform-icons/fastly.png" />
            <h3>Fastly</h3>
            <p>Fastly上で動作するAPIを保護するためにWallarmをデプロイします</p>
        </a>

        <a class="do-card" href="../../installation/connectors/ibm-api-connect/">
            <img class="non-zoomable" src="../../images/platform-icons/ibm-api-connect.svg" />
            <h3>IBM API Connect</h3>
            <p>IBM API Connectで管理されるAPIを保護するためにWallarmをデプロイします</p>
        </a>
    </div>
</div>

### アウトオブバンド

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCPトラフィックミラー解析</h3>
            <p>TCPトラフィックのミラー解析のためのアウトオブバンドデプロイ</p>
        </a>
    </div>
</div>

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

<script src="/nginx-native-internals.js"></script>