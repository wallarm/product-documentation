# NGINX ve Native Self-Hosted Wallarm Node'larının İç Yapısı

Wallarm Node, trafiği filtrelemek ve analiz etmekten sorumlu, Wallarm platformunun çekirdek bileşenidir. Kendi ortamınızda (self-hosted) veya Wallarm Security Edge üzerinde dağıtabilirsiniz. Bir self-hosted node dağıtırken iki seçeneğiniz vardır: **NGINX Node** veya **Native Node**.

Bu iki node mimari olarak farklıdır ve belirli dağıtım kullanım senaryoları için tasarlanmıştır.

## NGINX Node

NGINX Node, NGINX ile sorunsuz entegre olur ve trafiği yönetmek için halihazırda NGINX'e güvenen altyapılar için mükemmeldir. NGINX'in yeteneklerinden yararlanırken Wallarm'ın güvenlik ve trafik filtreleme özelliklerini ekler.

NGINX Node'u dağıtmak için aşağıdaki [artifaktler](../updating-migrating/node-artifact-versions.md) mevcuttur:

* [Hepsi bir arada yükleyici](nginx/all-in-one.md)
* [Docker imajı](../admin-en/installation-docker-en.md)
* [AWS AMI](packages/aws-ami.md)
* [GCP Makine İmajı](packages/gcp-machine-image.md)
* [NGINX Ingress Controller](../admin-en/installation-kubernetes-en.md), [Sidecar Controller](kubernetes/sidecar-proxy/deployment.md), [eBPF](kubernetes/ebpf/deployment.md) dağıtımları için Helm chart

Aşağıda **kullanım senaryonuzu bulun** ve NGINX Node'u uygun form faktörde dağıtın.

### Kubernetes

Kubernetes ortamınız için bir NGINX Node dağıtım çözümü bulun:

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Entegre Wallarm servisleriyle NGINX Ingress Controller'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar</h3>
            <p>Pod güvenliği için Wallarm Sidecar controller'ını dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>eBPF teknolojisini kullanarak Kubernetes üzerinde bant dışı dağıtım</p>
        </a>
    </div>
</div>

### Connectors

API dağıtımı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve CloudFront gibi harici araçlar kullanılarak dahil olmak üzere çeşitli şekillerde yapılabilir. Bu API'leri Wallarm ile güvence altına almanın bir yolunu arıyorsanız, bu tür durumlar için özel olarak tasarlanmış ["bağlayıcılar"](connectors/overview.md) biçiminde bir çözüm sunuyoruz.

NGINX Node, aşağıda listelenen platformlar için kullanılır, ancak analiz gelen isteklere sınırlıdır.

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Apigee üzerinde çalışan API'leri güvenceye alın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Akamai EdgeWorkers üzerinde çalışan API'leri güvenceye alın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Azion Edge üzerinde çalışan API'leri güvenceye alın</p>
        </a>
    </div>
</div>

### Hat içi

Korunan API'lere giden trafik, API'ye ulaşmadan önce Wallarm NGINX Node örneklerinden geçer. Düğümler hat içi konumda ve son kullanıcılara sunulan tek yol olduğu sürece, bir saldırganın Wallarm düğümlerini atlatma şansı yoktur. [Daha fazla bilgi edinin](inline/overview.md)

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>Hepsi bir arada yükleyici</h3>
            <p>Düğümü Linux işletim sistemli bir makinede çalıştırın</p>
        </a>

        <div id="inline-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS üzerinde dağıtım için artifaktler</p>
        </div>

        <div id="inline-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP üzerinde dağıtım için artifaktler</p>
        </div>

        <div id="inline-public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azure üzerinde dağıtım için artifaktler</p>
        </div>

        <div id="inline-public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloud üzerinde dağıtım için artifaktler</p>
        </div>

        <a class="do-card" href=../../installation/heroku/docker-image/>
            <img class="non-zoomable" src="../../images/platform-icons/heroku.svg" />
            <h3>Heroku</h3>
            <p>Bir Wallarm Docker imajı oluşturun ve Heroku üzerinde çalıştırın</p>
        </a>
        
        <a class="do-card" href="../../installation/inline/compute-instances/docker/nginx-based/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker imajı</h3>
            <p>Düğümü konteynerize ortamda çalıştırın</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS üzerinde dağıtım için artifaktler</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ami/">
            <h3>AMI</h3>
            <p>Wallarm'ı dağıtmak için resmi Amazon Machine Image'ı kullanın</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ecs/">
            <h3>ECS</h3>
            <p>Elastic Container Service ile Wallarm'ı dağıtmak için Docker imajını kullanın</p>
        </a>

        <div id="inline-public-clouds-aws-terraform" class="do-card">
            <h3>Terraform modülü</h3>
            <p>Hat içi Wallarm dağıtımı için Terraform modülünü kullanın</p>
        </div>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform modülü</h3>
            <p>AWS üzerinde hat içi Wallarm dağıtımı için Terraform modülünü kullanın</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-vpc/">
            <h3>AWS VPC'de Proxy</h3>
            <p>Wallarm, AWS Virtual Private Cloud içinde proxy olarak</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-api-gateway/">
            <h3>Amazon API Gateway için Proxy</h3>
            <p>Wallarm, Amazon API Gateway koruması için proxy olarak</p>
        </a>

    </div>

    <div class="do-nested" data-for="inline-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP üzerinde dağıtım için artifaktler</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/machine-image/">
            <h3>Makine İmajı</h3>
            <p>Wallarm'ı dağıtmak için resmi Google Cloud Machine Image'ı kullanın</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/gce/">
            <h3>GCE</h3>
            <p>Google Compute Engine ile Wallarm'ı dağıtmak için Docker imajını kullanın</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azure üzerinde dağıtım için artifaktler</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/azure/docker-image/">
            <h3>Azure Container Instances</h3>
            <p>Azure Container Instances ile Wallarm'ı dağıtmak için Docker imajını kullanın</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloud üzerinde dağıtım için artifaktler</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/alibaba/docker-image/">
            <h3>ECS</h3>
            <p>Elastic Compute Service ile Wallarm'ı dağıtmak için Docker imajını kullanın</p>
        </a>
    </div>

</div>

## Native Node

Native Node, NGINX'e dayanmaz. NGINX'in gerekliliğinin olmadığı ya da daha hafif ve platformdan bağımsız bir çözümün tercih edildiği ortamlar için geliştirilmiştir.

Native Node'u dağıtmak için aşağıdaki [artifaktler](../updating-migrating/native-node/node-artifact-versions.md) mevcuttur:

* [Hepsi bir arada yükleyici](native-node/all-in-one.md)
* [Docker imajı](native-node/docker-image.md)
* [AWS AMI](native-node/aws-ami.md)
* [Helm chart](native-node/helm-chart.md)

Aşağıda **kullanım senaryonuzu bulun** ve Native Node'u uygun form faktörde dağıtın.

### Connectors

API dağıtımı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve CloudFront gibi harici araçlar kullanılarak dahil olmak üzere çeşitli şekillerde yapılabilir. Bu API'leri Wallarm ile güvence altına almanın bir yolunu arıyorsanız, bu tür durumlar için özel olarak tasarlanmış ["bağlayıcılar"](connectors/overview.md) biçiminde bir çözüm sunuyoruz.

Native Node, aşağıdaki platformlarla herhangi bir sınırlama olmaksızın çalışır:

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>MuleSoft Mule Gateway</h3>
            <p>Mule Gateway tarafından yönetilen API'leri güvenceye almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/mulesoft-flex/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft-flex-gateway.png" />
            <h3>MuleSoft Flex Gateway</h3>
            <p>Flex Gateway tarafından yönetilen API'leri güvenceye almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Amazon CloudFront üzerinden iletilen trafiği güvenceye almak için Wallarm'ı dağıtın</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Cloudflare üzerinden çalışan trafiği güvenceye almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong API Gateway</h3>
            <p>Kong Ingress Controller tarafından yönetilen API'leri güvenceye almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>Istio tarafından yönetilen API'leri güvenceye almak için Wallarm'ı in-line veya OOB olarak dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Layer7 API Gateways ile yönetilen API'leri güvenceye alın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/fastly/">
            <img class="non-zoomable" src="../../images/platform-icons/fastly.png" />
            <h3>Fastly</h3>
            <p>Fastly üzerinde çalışan API'leri güvenceye almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/ibm-api-connect/">
            <img class="non-zoomable" src="../../images/platform-icons/ibm-api-connect.svg" />
            <h3>IBM API Connect</h3>
            <p>IBM API Connect üzerinden yönetilen API'leri güvenceye almak için Wallarm'ı dağıtın</p>
        </a>
    </div>
</div>

### Bant dışı

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCP Trafik Yansıtma Analizi</h3>
            <p>TCP trafik yansıtma analizi için bant dışı dağıtım</p>
        </a>
    </div>
</div>

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

<script src="/nginx-native-internals.js"></script>