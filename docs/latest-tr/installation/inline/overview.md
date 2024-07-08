# Wallarm Node'un Çevrimiçi (Inline) Yerleştirmesi

Wallarm, tehditleri gerçek zamanlı olarak hafifletmek için çevrimiçi olarak dağıtılabilir. Bu durumda, korunan API'lere yönlendirilen trafik, API'ye ulaşmadan önce Wallarm düğüm örneklerinden geçer. Kullanıcılar için tek yol olduğu sürece ve çevrimiçi oldukları sürece bir saldırganın Wallarm düğümlerini atlaması mümkün değildir. Bu makale yaklaşımı ayrıntılı olarak açıklar.
Wallarm düğüm örnekleri, müşteri ile sunucular arasında yer alır, gelen trafiği analiz eder, kötü niyetli istekleri hafifletir ve meşru istekleri korunan sunucuya iletir.

## Kullanım Senaryoları

Wallarm'ın çevrimiçi çözümü, aşağıdaki kullanım senaryoları için uygundur:

* Uygulama sunucusuna ulaşmadan önce SQli, XSS enjeksiyonları, API kötüye kullanımı, brute force gibi kötü niyetli istekleri hafifletir.
* Sisteminizin aktif güvenlik açıkları hakkında bilgi edinin ve uygulama kodunu düzeltmeden önce sanal düzeltmeler uygulayın.
* API envanterini gözlemleyin ve hassas verileri izleyin.

## Avantajları ve Özel Gereklilikler

Wallarm dağıtımına çevrimiçi (inline) bir yaklaşımla, diğer dağıtım yöntemlerine göre, [OOB](../oob/overview.md) dağıtımları gibi, birkaç avantaj sunar:

* Wallarm, trafik analizinin gerçek zamanlı olarak ilerlemesi nedeniyle kötü amaçlı istekleri anında engeller.
* Wallarm'ın [API Keşif](../../api-discovery/overview.md) ve [açıklık tespiti](../../about-wallarm/detecting-vulnerabilities.md) dahil olmak üzere tüm özellikleri, hem gelen isteklere hem de sunucu yanıtlarına erişimi olduğu için herhangi bir kısıtlama olmadan çalışır.

Inline şemayı uygulamak için, altyapınızdaki trafik rotasını değiştirmeniz gerekecektir. Ayrıca, kesintisiz hizmet sağlamak için Wallarm düğümleri için [kaynak tahsisini](../../admin-en/configuration-guides/allocate-resources-for-node.md) dikkatlice göz önünde bulundurun.

AWS veya GCP gibi halka açık bulutlarda Wallarm düğümlerini üretim ortamlarında dağıtırken, en iyi performans, ölçeklenebilirlik ve direnç için düzgün yapılandırılmış bir otomatik ölçeklendirme grubu kullanılması gerekmektedir (makalelere bakınız [AWS](../../admin-en/installation-guides/amazon-cloud/autoscaling-overview.md) veya [GCP](../../admin-en/installation-guides/google-cloud/autoscaling-overview.md)).

## Dağıtım Modelleri ve Desteklenen Dağıtım Yöntemleri

Wallarm'ı çevrimiçi olarak konumlandırmak söz konusu olduğunda, düşünülmesi gereken iki yaygın model vardır: hesaplama örneği dağıtımı ve Kubernetes dağıtımı.

Dağıtım modelini ve yöntemini altyapınızın özelliklerine göre seçebilirsiniz. Doğru dağıtım modelini ve yöntemini seçme konusunda yardıma ihtiyaç duyarsanız, lütfen [satış ekibimizle](mailto:sales@wallarm.com) iletişime geçmekten çekinmeyin ve size özel yönlendirmeler için altyapınız hakkında ek bilgiler sağlayın.

### Wallarm'ı Hesaplama Örneklerinde Çalıştırma

Bu modelde, Wallarm'ı altyapınızda bir sanal cihaz olarak konuşlandırırsınız. Sanal cihaz, bir VM, konteyner veya bulut örneği olarak kurulabilir.

Bir Wallarm düğümünü konuşlandırırken, ağınızın topolojisi içinde farklı konumlara yerleştirme esnekliğine sahip olabilirsiniz. Ancak, önerilen yaklaşım, düğüm örneğini halka açık bir yük dengeleyici arkasına, arkadaki hizmetlerinizin önüne veya genellikle arka taraf hizmetlerinden önce bulunan özel bir yük dengeleyicinin önüne yerleştirmektir. Aşağıdaki diyagram, bu kurulumdaki tipik trafik akışını gösterir:

![Çevrimiçi filtreleme şeması](../../images/waf-installation/inline/wallarm-inline-deployment-scheme.png)

Yük dengeleyiciler iki tipe ayrılabilir: L4 ve L7. Yük dengeleyicinin tipi, Wallarm'ı mevcut altyapınıza entegre ederken SSL offloading'in nasıl ele alındığını belirler.

* L4 tipi bir yük dengeleyici kullanıyorsanız, genellikle SSL offloading, yük dengeleyicinin arkasında bulunan bir web sunucu tarafından veya Wallarm örneği olmadan altyapınızdaki diğer araçlarla yapılır. Ancak, Wallarm düğümünü dağıtırken, Wallarm örneğinde SSL offloading'i yapılandırmanız gerekmektedir.
* L7 tipi bir yük dengeleyici kullanıyorsanız, genellikle SSL offloading yük dengeleyici tarafından ele alınır ve Wallarm düğümü düz HTTP alır.

Wallarm, hesaplama örneklerinde çalıştırma için aşağıdaki eserleri ve çözümleri sunar:

**Amazon Web Hizmetleri (AWS)**

* [AMI](compute-instances/aws/aws-ami.md)
* [ECS](compute-instances/aws/aws-ecs.md)
* Terraform modülü:
    * [AWS VPC'de Proxy](compute-instances/aws/terraform-module-for-aws-vpc.md)
    * [Amazon API Gateway için Proxy](compute-instances/aws/terraform-module-for-aws-api-gateway.md)

**Google Cloud Platform (GCP)**

* [Makine imajı](compute-instances/gcp/machine-image.md)
* [GCE](compute-instances/gcp/gce.md)

**Microsoft Azure**

* [Azure Konteyner Örnekleri](compute-instances/azure/docker-image.md)

**Alibaba Cloud**

* [ECS](compute-instances/alibaba/docker-image.md)

**Docker imajları**

* [NGINX tabanlı](compute-instances/docker/nginx-based.md)
* [Envoy tabanlı](compute-instances/docker/envoy-based.md)

**Linux paketleri**

* [NGINX sabit için bireysel paketler](compute-instances/linux/individual-packages-nginx-stable.md)
* [NGINX Plus için bireysel paketler](compute-instances/linux/individual-packages-nginx-plus.md)
* [Dağıtım sağlanan NGINX için bireysel paketler](compute-instances/linux/individual-packages-nginx-distro.md)
* [Hepsi bir arada yükleyici](compute-instances/linux/all-in-one.md)

### Wallarm'ı Kubernetes'te Çalıştırma

Komu kabuk düzenlemesine yönelik olarak Kubernetes'i kullanıyorsanız, Wallarm, bir Kubernetes yerli çözümü olarak konuşlandırılabilir. Ingress veya yanlı teknik kontrolörler gibi özellikleri kullanarak Kubernetes kümelere sorunsuz bir şekilde entegre olur.

Wallarm, Kubernetes'te çalıştırmak için aşağıdaki eserleri ve çözümleri sunar:

* [NGINX Ingress Controller](../../admin-en/installation-kubernetes-en.md)
* [Kong Ingress Controller](../kubernetes/kong-ingress-controller/deployment.md)
* [Sidecar Controller](../kubernetes/sidecar-proxy/deployment.md)