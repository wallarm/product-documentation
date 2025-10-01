# Wallarm node’un inline dağıtımı

Wallarm, tehditleri gerçek zamanlı olarak azaltmak için inline dağıtılabilir. Bu durumda, korunan API’lere gelen trafik, API’ye ulaşmadan önce Wallarm node örneklerinden geçer. Node’lar inline olduğu ve son kullanıcılara sunulan tek yol olduğu sürece, bir saldırganın Wallarm node’larını atlaması mümkün değildir. Bu makale yaklaşımı ayrıntılarıyla açıklar.

Wallarm node örnekleri, istemci ile sunucular arasında yer alır; gelen trafiği analiz eder, kötü niyetli istekleri azaltır ve meşru istekleri korunan sunucuya iletir. 

## Kullanım senaryaları

Wallarm’ın inline çözümü aşağıdaki kullanım senaryoları için uygundur:

* SQLi, XSS enjeksiyonları, API kötüye kullanımı, brute force gibi kötü niyetli istekleri uygulama sunucusuna ulaşmadan önce önleyin.
* Sisteminizdeki aktif güvenlik zafiyetlerini öğrenin ve uygulama kodunu düzeltmeden önce sanal yamalar uygulayın.
* API envanterini gözlemleyin ve hassas veriyi takip edin.

## Avantajlar ve özel gereksinimler

Wallarm’ın inline dağıtım yaklaşımı, [OOB](../oob/overview.md) dağıtımları gibi diğer dağıtım yöntemlerine göre birkaç avantaj sunar:

* Trafik analizi gerçek zamanlı olarak ilerlediğinden, Wallarm kötü niyetli istekleri anında engeller.
* Wallarm’ın tüm özellikleri, [API Discovery](../../api-discovery/overview.md) ve [zafiyet tespiti](../../about-wallarm/detecting-vulnerabilities.md) dahil, Wallarm hem gelen isteklere hem de sunucu yanıtlarına erişebildiğinden sınırlama olmaksızın çalışır.

Inline bir şema uygulamak için, altyapınızdaki trafik rotasını değiştirmeniz gerekecektir. Ek olarak, kesintisiz hizmet için Wallarm node’ları için [kaynak tahsisini](../../admin-en/configuration-guides/allocate-resources-for-node.md) dikkatle düşünün.

Üretim ortamları için AWS veya GCP gibi genel bulutlarda Wallarm node’larını dağıtırken, en iyi performans, ölçeklenebilirlik ve dayanıklılık için düzgün yapılandırılmış bir otomatik ölçekleme grubunun kullanılması gerekir (bkz. [AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) veya [GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md) makaleleri).

## Dağıtım modelleri ve desteklenen dağıtım yöntemleri

Wallarm’ı inline dağıtırken, göz önünde bulundurulacak yaygın modeller şunlardır:

* Wallarm Security Edge
* Kendi barındırdığınız node’un bir bilgi işlem örneğinde (compute instance) dağıtımı
* Kendi barındırdığınız node’un Kubernetes üzerinde dağıtımı

Altyapınızın özelliklerine göre dağıtım modelini ve yöntemini seçebilirsiniz. Doğru dağıtım modeli ve yöntemini seçmede yardıma ihtiyacınız olursa, lütfen [satış ekibimizle](mailto:sales@wallarm.com) iletişime geçin ve özel yönlendirme için altyapınız hakkında ek bilgiler sağlayın.

### Wallarm Security Edge’i çalıştırma

Security Edge platformu, Wallarm tarafından barındırılan bir ortam içinde coğrafi olarak dağıtılmış konumlara node’lar dağıtmak için yönetilen bir hizmet sunar. [Daha fazla bilgi edinin](../security-edge/inline/overview.md)

### Wallarm’ı bilgi işlem örneklerinde çalıştırma

Bu modelde, Wallarm’ı altyapınız içinde bir sanal aygıt olarak dağıtırsınız. Sanal aygıt bir VM, konteyner veya bulut örneği olarak kurulabilir.

Bir Wallarm node’u dağıtırken, onu ağ topolojinize göre farklı konumlara yerleştirme esnekliğine sahipsiniz. Ancak önerilen yaklaşım, node örneğini genel (public) bir yük dengeleyicinin arkasına ve arka uç servislerinin önüne veya genellikle arka uç servislerinden önce konumlandırılan özel (private) bir yük dengeleyicinin önüne yerleştirmektir. Aşağıdaki diyagram bu kurulumdaki tipik trafik akışını göstermektedir:

![Inline filtreleme şeması](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

Yük dengeleyiciler iki türe ayrılabilir: L4 ve L7. Yük dengeleyici türü, SSL sonlandırmanın nasıl ele alındığını belirler; bu, Wallarm’ı mevcut altyapınıza entegre ederken kritik öneme sahiptir.

* L4 yük dengeleyici kullanıyorsanız, genellikle SSL sonlandırma yük dengeleyicinin arkasına konumlandırılmış bir web sunucusu tarafından veya Wallarm örneği olmadan altyapınızdaki diğer yollarla gerçekleştirilir. Ancak, Wallarm node’unu dağıtırken SSL sonlandırmayı Wallarm örneğinde yapılandırmanız gerekir.
* L7 yük dengeleyici kullanıyorsanız, genellikle SSL sonlandırma yük dengeleyicinin kendisi tarafından yapılır ve Wallarm node’u düz HTTP alır.

Wallarm, Wallarm’ı bilgi işlem örneklerinde çalıştırmak için aşağıdaki yapıtları ve çözümleri sunar:

**Amazon Web Services (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Terraform modülü:
    * [AWS VPC’de Proxy](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Amazon API Gateway için Proxy](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [Machine image](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Container Instances](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Docker imajları**

* [NGINX tabanlı](compute-instances/docker/nginx-based.md)

**Linux paketleri**

* [Tümü bir arada yükleyici](compute-instances/linux/all-in-one.md)

### Wallarm’ı Kubernetes üzerinde çalıştırma

Konteyner orkestrasyonu için Kubernetes kullanıyorsanız, Wallarm Kubernetes-yerel bir çözüm olarak dağıtılabilir. Ingress veya sidecar denetleyicileri gibi özelliklerden yararlanarak Kubernetes kümeleriyle sorunsuz entegre olur.

Wallarm, Wallarm’ı Kubernetes üzerinde çalıştırmak için aşağıdaki yapıtları ve çözümleri sunar:

* [NGINX Ingress controller](../../admin-en/installation-kubernetes-en.md)
* [Sidecar controller](../kubernetes/sidecar-proxy/deployment.md)