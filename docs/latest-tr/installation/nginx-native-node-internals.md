# NGINX ve Yerinde Barındırılan Native Wallarm Düğümlerinin İç Yapısı

Wallarm Node, Wallarm platformunun trafik filtreleme ve analizinden sorumlu temel bileşenidir. Bunu kendi ortamınızda (self-hosted) veya Wallarm'ın Security Edge üzerinde dağıtabilirsiniz. Bir **self-hosted node** dağıtırken iki seçeneğiniz vardır: **NGINX Node** veya **Native Node**.

Bu iki node, mimari olarak farklılık gösterir ve belirli dağıtım kullanım durumları için tasarlanmıştır.

## NGINX Node

NGINX Node, NGINX ile sorunsuz bir şekilde entegre olur ve trafiği yönetmek için zaten NGINX'e dayanan altyapılar için idealdir. NGINX'in yeteneklerinden yararlanırken Wallarm'ın güvenlik ve trafik filtreleme özelliklerini ekler.

NGINX Node dağıtımı için aşağıdaki [artifacts](../updating-migrating/node-artifact-versions.md) mevcuttur:

* [All-in-one installer](nginx/all-in-one.md)
* [Docker image](../admin-en/installation-docker-en.md)
* [AWS AMI](packages/aws-ami.md)
* [GCP Machine Image](packages/gcp-machine-image.md)
* [NGINX Ingress Controller](../admin-en/installation-kubernetes-en.md), [Sidecar Controller](kubernetes/sidecar-proxy/deployment.md), [eBPF](kubernetes/ebpf/deployment.md) dağıtımları için Helm chart

Aşağıda **kullanım durumunuzu** bulun ve NGINX Node'u uygun form faktöründe dağıtın.

### Kubernetes

Kubernetes ortamınız için bir NGINX Node dağıtım çözümü bulun:

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../admin-en/installation-kubernetes-en/">
            <img class="non-zoomable" src="../../images/platform-icons/ingress.svg" />
            <h3>NGINX Ingress Controller</h3>
            <p>Wallarm servisleriyle entegre NGINX Ingress Controller'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/sidecar-proxy/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/pod.svg" />
            <h3>Sidecar</h3>
            <p>Pod güvenliği için Wallarm Sidecar controller'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/kubernetes/ebpf/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/ebpf.svg" />
            <h3>eBPF</h3>
            <p>eBPF teknolojisini kullanarak Kubernetes üzerinde out-of-band dağıtım yapın</p>
        </a>
    </div>
</div>

### Connectors

API dağıtımı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve CloudFront gibi harici araçlar kullanılarak gerçekleştirilebilir. Bu API'leri Wallarm ile güvence altına almanın bir yolunu arıyorsanız, bu durumlara özel olarak tasarlanmış ["connectors"](connectors/overview.md) çözümümüzü sunuyoruz.

NGINX Node, aşağıda listelenen platformlar için kullanılır, ancak analiz yalnızca gelen isteklere yöneliktir.

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/connectors/apigee/">
            <img class="non-zoomable" src="../../images/platform-icons/apigee.svg" />
            <h3>Apigee</h3>
            <p>Apigee üzerinde çalışan API'leri güvence altına alın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/akamai-edgeworkers/">
            <img class="non-zoomable" src="../../images/platform-icons/akamai.svg" />
            <h3>Akamai EdgeWorkers</h3>
            <p>Akamai EdgeWorkers üzerinde çalışan API'leri güvence altına alın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/azion-edge/">
            <img class="non-zoomable" src="../../images/platform-icons/azion-edge.svg" />
            <h3>Azion Edge</h3>
            <p>Azion Edge üzerinde çalışan API'leri güvence altına alın</p>
        </a>
    </div>
</div>

### In-line

Korunan API'lere gelen trafik, API'ye ulaşmadan önce Wallarm NGINX Node örneklerinden geçer. Wallarm node'ların inline ve son kullanıcıların erişebileceği tek yol olması durumunda, bir saldırganın Wallarm node'ları atlatma şansı yoktur. [Daha fazla bilgi edinin](inline/overview.md)

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/inline/compute-instances/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Node'u Linux işletim sistemli bir makinede çalıştırın</p>
        </a>

        <div id="inline-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS üzerinde dağıtım için artifact'lar</p>
        </div>

        <div id="inline-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP üzerinde dağıtım için artifact'lar</p>
        </div>

        <div id="inline-public-clouds-azure" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azure üzerinde dağıtım için artifact'lar</p>
        </div>

        <div id="inline-public-clouds-alibaba" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloud üzerinde dağıtım için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/docker/nginx-based/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker image</h3>
            <p>Node'u konteynerleştirilmiş ortamda çalıştırın</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS üzerinde dağıtım için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ami/">
            <h3>AMI</h3>
            <p>Wallarm'ı dağıtmak için resmi Amazon Machine Image'i kullanın</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/aws-ecs/">
            <h3>ECS</h3>
            <p>Elastic Container Service ile Wallarm'ı dağıtmak için Docker image'i kullanın</p>
        </a>

        <div id="inline-public-clouds-aws-terraform" class="do-card">
            <h3>Terraform module</h3>
            <p>Inline Wallarm dağıtımı için Terraform modülünü kullanın</p>
        </div>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-aws-terraform">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/terraform.svg" />
            <h3>Terraform module</h3>
            <p>AWS üzerinde inline Wallarm dağıtımı için Terraform modülünü kullanın</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-vpc/">
            <h3>Proxy in AWS VPC</h3>
            <p>AWS Virtual Private Cloud içinde proxy olarak Wallarm</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/aws/terraform-module-for-aws-api-gateway/">
            <h3>Proxy for Amazon API Gateway</h3>
            <p>Amazon API Gateway koruması için proxy olarak Wallarm</p>
        </a>

    </div>

    <div class="do-nested" data-for="inline-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>GCP üzerinde dağıtım için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/machine-image/">
            <h3>Machine Image</h3>
            <p>Wallarm'ı dağıtmak için resmi Google Cloud Machine Image'i kullanın</p>
        </a>

        <a class="do-card" href="../../installation/inline/compute-instances/gcp/gce/">
            <h3>GCE</h3>
            <p>Google Compute Engine ile Wallarm'ı dağıtmak için Docker image'i kullanın</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-azure">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/azure-cloud.svg" />
            <h3>Microsoft Azure</h3>
            <p>Microsoft Azure üzerinde dağıtım için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/azure/docker-image/">
            <h3>Azure Container Instances</h3>
            <p>Azure Container Instances ile Wallarm'ı dağıtmak için Docker image'i kullanın</p>
        </a>
    </div>

    <div class="do-nested" data-for="inline-public-clouds-alibaba">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/alibaba-cloud.svg" />
            <h3>Alibaba Cloud</h3>
            <p>Alibaba Cloud üzerinde dağıtım için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/inline/compute-instances/alibaba/docker-image/">
            <h3>ECS</h3>
            <p>Elastic Compute Service ile Wallarm'ı dağıtmak için Docker image'i kullanın</p>
        </a>
    </div>

</div>

### Out-of-band

NGINX Node, trafik aynalamasının NGINX, Envoy veya başka bir web sunucusu tarafından sağlandığı durumlarda [out-of-band traffic](oob/overview.md) analizi için uygundur.

<div class="do-section">
    <div class="do-main">

        <a class="do-card" href="../../installation/oob/web-server-mirroring/linux/all-in-one/">
            <img class="non-zoomable" src="../../images/platform-icons/linux.svg" />
            <h3>All-in-one installer</h3>
            <p>Node'u Linux işletim sistemli bir makinede çalıştırın</p>
        </a>

        <div id="mirroring-by-web-servers-public-clouds-aws" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS üzerinde Wallarm OOB dağıtımı için artifact'lar</p>
        </div>

        <div id="mirroring-by-web-servers-public-clouds-gcp" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Google Cloud üzerinde Wallarm OOB dağıtımı için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/docker-image/">
            <img class="non-zoomable" src="../../images/platform-icons/docker.svg" />
            <h3>Docker image</h3>
            <p>Node'u konteynerleştirilmiş ortamda çalıştırın</p>
        </a>

    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds-aws">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Amazon Web Services</h3>
            <p>AWS üzerinde Wallarm OOB dağıtımı için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/oob/web-server-mirroring/aws-ami/">
            <h3>AMI</h3>
            <p>Wallarm OOB'yi AWS üzerinde dağıtmak için resmi Machine Image'i kullanın</p>
        </a>

        <a class="do-card" href="../../installation/oob/terraform-module/mirroring-by-web-server/">
            <h3>Terraform module</h3>
            <p>AWS üzerinde çalışan Kubernetes için Wallarm OOB dağıtımında Terraform modülünü kullanın</p>
        </a>
    </div>

    <div class="do-nested" data-for="mirroring-by-web-servers-public-clouds-gcp">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/gcp.svg" />
            <h3>Google Cloud</h3>
            <p>Google Cloud üzerinde Wallarm OOB dağıtımı için artifact'lar</p>
        </div>

        <a class="do-card" href="../../installation/cloud-platforms/gcp/machine-image/">
            <h3>Machine Image</h3>
            <p>Wallarm OOB'yi Google Cloud üzerinde dağıtmak için resmi Machine Image'i kullanın</p>
        </a>
    </div>

</div>

## Native Node

Native Node, NGINX'e bağlı değildir. NGINX'in gerekmediği veya daha hafif ve platform bağımsız bir çözüm tercih edilen ortamlarda geliştirilmiştir.

Native Node dağıtımı için aşağıdaki artifact'lar mevcuttur:

* [All-in-one installer](native-node/all-in-one.md)
* [Docker image](native-node/docker-image.md)
* [Helm chart](native-node/helm-chart.md)

Aşağıda **kullanım durumunuzu** bulun ve Native Node'u uygun form faktöründe dağıtın.

### Connectors

API dağıtımı, Azion Edge, Akamai Edge, MuleSoft, Apigee ve CloudFront gibi harici araçlar kullanılarak gerçekleştirilebilir. Bu API'leri Wallarm ile güvence altına almanın bir yolunu arıyorsanız, bu durumlara özel olarak tasarlanmış ["connectors"](connectors/overview.md) çözümümüzü sunuyoruz.

Native Node, aşağıdaki platformlarla herhangi bir kısıtlama olmaksızın çalışır:

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/connectors/mulesoft/">
            <img class="non-zoomable" src="../../images/platform-icons/mulesoft.svg" />
            <h3>MuleSoft</h3>
            <p>MuleSoft Anypoint platformunda dağıtılan API'leri güvence altına almak için Wallarm'ı dağıtın</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/aws-lambda/">
            <img class="non-zoomable" src="../../images/platform-icons/aws-cloudfront.svg" />
            <h3>CloudFront</h3>
            <p>Amazon CloudFront üzerinden iletilen trafiği güvence altına almak için Wallarm'ı dağıtın</p>
        </a>
        
        <a class="do-card" href="../../installation/connectors/cloudflare/">
            <img class="non-zoomable" src="../../images/platform-icons/cloudflare.png" />
            <h3>Cloudflare</h3>
            <p>Cloudflare üzerinden akan trafiği güvence altına almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/kong-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/kong-new.svg" />
            <h3>Kong API Gateway</h3>
            <p>Kong Ingress Controller tarafından yönetilen API'leri güvence altına almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/istio/">
            <img class="non-zoomable" src="../../images/platform-icons/istio.svg" />
            <h3>Istio</h3>
            <p>Istio tarafından yönetilen API'leri güvence altına almak için Wallarm'ı dağıtın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/layer7-api-gateway/">
            <img class="non-zoomable" src="../../images/platform-icons/layer7.png" />
            <h3>Broadcom Layer7 API Gateways</h3>
            <p>Layer7 API Gateways tarafından yönetilen API'leri güvence altına alın</p>
        </a>

        <a class="do-card" href="../../installation/connectors/fastly/">
            <img class="non-zoomable" src="../../images/platform-icons/fastly.png" />
            <h3>Fastly</h3>
            <p>Fastly üzerinde çalışan API'leri güvence altına almak için Wallarm'ı dağıtın</p>
        </a>
    </div>
</div>

### Out-of-band

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../../installation/oob/tcp-traffic-mirror/deployment/">
            <img class="non-zoomable" src="../../images/platform-icons/tcp-mirror-analysis.svg" />
            <h3>TCP Traffic Mirror Analysis</h3>
            <p>TCP trafik aynalama analizi için out-of-band dağıtım</p>
        </a>
    </div>
</div>

<link rel="stylesheet" href="/supported-platforms.min.css?v=1" />

<script src="/nginx-native-node-deployments.min.js?v=1"></script>