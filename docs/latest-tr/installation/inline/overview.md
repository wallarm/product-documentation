# Wallarm Node'un In-line Dağıtımı

Wallarm, tehditleri gerçek zamanlı olarak hafifletmek için in-line olarak dağıtılabilir. Bu durumda, korunan API'lere gelen trafik, API'ye ulaşmadan önce Wallarm node örneklerinden geçer. Wallarm node'larının in-line olması ve son kullanıcılar için tek mevcut yol olması durumunda, saldırganların Wallarm node'larını atlatma şansı olmaz. Bu makale yaklaşımı ayrıntılarıyla açıklamaktadır.

Wallarm node örnekleri, istemci ile sunucular arasında yer alarak gelen trafiği analiz eder, zararlı istekleri hafifletir ve meşru istekleri korunan sunucuya iletir.

## Kullanım Durumları

Wallarm in-line çözümü aşağıdaki kullanım durumları için uygundur:

* SQLi, XSS enjeksiyonları, API kötüye kullanımı, brute force gibi zararlı istekleri, uygulama sunucusuna ulaşmadan önce hafifletir.
* Sistemin aktif güvenlik açıkları hakkında bilgi edinmenizi sağlar ve uygulama kodunu düzeltmeden önce sanal yamalar uygulamanıza imkan tanır.
* API envanterini izler ve hassas verileri takip eder.

## Avantajlar ve Özel Gereksinimler

Wallarm dağıtımında in-line yaklaşım, [OOB](../oob/overview.md) dağıtımlara göre birkaç avantaj sunar:

* Wallarm, trafik analizi gerçek zamanlı gerçekleştirildiği için zararlı istekleri anında engeller.
* Gelen istekler ve sunucu yanıtlarına erişim sağladığından, [API Discovery](../../api-discovery/overview.md) ve [vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md) gibi tüm Wallarm özellikleri hiçbir kısıtlama olmaksızın çalışır.

In-line şemayı uygulamak için altyapınızdaki trafik rotasını değiştirmeniz gerekecektir. Ayrıca, kesintisiz hizmet sağlamak için Wallarm node'ları için [resource allocation](../../admin-en/configuration-guides/allocate-resources-for-node.md)'u dikkatlice göz önünde bulundurun.

Üretim ortamlarında AWS veya GCP gibi kamu bulutlarında Wallarm node'larını dağıtırken, optimal performans, ölçeklenebilirlik ve dayanıklılık için düzgün yapılandırılmış bir autoscaling grubunun kullanılması gerekmektedir (bkz. [AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) veya [GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md)).

## Dağıtım Modelleri ve Desteklenen Dağıtım Yöntemleri

Wallarm in-line dağıtımı söz konusu olduğunda, aşağıdaki yaygın modeller dikkate alınmalıdır:

* Wallarm Security Edge
* Compute instance üzerinde self-hosted node dağıtımı
* Kubernetes üzerinde self-hosted node dağıtımı

Dağıtım modelini ve yöntemini altyapınızın özelliklerine göre seçebilirsiniz. Doğru dağıtım modelini ve yöntemini seçme konusunda yardıma ihtiyaç duyarsanız, lütfen altyapınız hakkında ek bilgileri belirterek [sales team](mailto:sales@wallarm.com)'imizle iletişime geçiniz.

### Wallarm Security Edge'in Çalıştırılması

Security Edge platformu, coğrafi olarak dağıtılmış konumlarda, Wallarm tarafından barındırılan bir ortamda node dağıtımını yöneten bir hizmet sunar. [Read more](../security-edge/deployment.md)

### Compute Instance'larda Wallarm'ın Çalıştırılması

Bu modelde, Wallarm altyapınız içerisinde sanal bir cihaz olarak dağıtılır. Sanal cihaz bir VM, konteyner veya bulut instance'ı olarak kurulabilir.

Wallarm node dağıtırken, node'unuzu ağ topolojiniz içinde farklı konumlarda yerleştirme esnekliğine sahipsiniz. Ancak, önerilen yaklaşım, node örneğini arka uç hizmetlerinizin önünde, genel bir load balancer'ın arkasında veya arka uç hizmetlerinden önce tipik olarak bulunan özel bir load balancer'ın önünde konumlandırmaktır. Aşağıdaki şema, bu yapıdaki tipik trafik akışını göstermektedir:

![In-line filtering scheme](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

Load balancer'lar L4 ve L7 olmak üzere iki tipe ayrılabilir. Load balancer tipi, mevcut altyapınıza Wallarm'ı entegre ederken kritik öneme sahip olan SSL offloading'in nasıl yönetileceğini belirler.

* Eğer L4 load balancer kullanıyorsanız, genellikle SSL offloading, load balancer'ın arkasında bulunan bir web sunucusu veya altyapınızdaki diğer yöntemlerle, Wallarm örneği olmadan gerçekleştirilir. Ancak, Wallarm node dağıtılırken, Wallarm örneği üzerinde SSL offloading yapılandırmanız gerekmektedir.
* Eğer L7 load balancer kullanıyorsanız, genellikle SSL offloading load balancer tarafından kendisi gerçekleştirilir ve Wallarm node düz metin HTTP trafiği alır.

Wallarm, compute instance'larında Wallarm'ı çalıştırmak için aşağıdaki bileşenleri ve çözümleri sunmaktadır:

**Amazon Web Services (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Terraform modülü:
    * [Proxy in AWS VPC](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Proxy for Amazon API Gateway](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [Machine image](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Container Instances](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Docker images**

* [NGINX-based](compute-instances/docker/nginx-based.md)
* [Envoy-based](compute-instances/docker/envoy-based.md)

**Linux paketleri**

* [All-in-one installer](compute-instances/linux/all-in-one.md)

### Kubernetes Üzerinde Wallarm'ın Çalıştırılması

Eğer konteyner orkestrasyonu için Kubernetes kullanıyorsanız, Wallarm Kubernetes-native bir çözüm olarak dağıtılabilir. Ingress veya sidecar controller gibi özelliklerden faydalanarak Kubernetes kümeleriyle sorunsuz entegrasyon sağlar.

Wallarm, Kubernetes üzerinde Wallarm'ı çalıştırmak için aşağıdaki bileşenleri ve çözümleri sunmaktadır:

* [NGINX Ingress controller](../../admin-en/installation-kubernetes-en.md)
* [Sidecar controller](../kubernetes/sidecar-proxy/deployment.md)