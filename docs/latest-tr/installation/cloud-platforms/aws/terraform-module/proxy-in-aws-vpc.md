# AWS VPC'de Proxy olarak Wallarm'ı Dağıtma

Bu örnek, [Terraform modülünü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanarak mevcut bir AWS Virtual Private Cloud (VPC) içine satır içi (inline) proxy olarak Wallarm'ı nasıl dağıtacağınızı gösterir.

Wallarm proxy çözümü, WAAP ve API güvenlik işlevleriyle gelişmiş bir HTTP trafik yönlendiricisi olarak hizmet veren ek bir işlevsel ağ katmanı sağlar.

[ileri seviye proxy çözümünü](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) deneyerek çözümün esnekliğini pratikte görebilirsiniz.

!!! info "Güvenlik notu"
    Bu çözüm, AWS güvenlik en iyi uygulamalarını takip edecek şekilde tasarlanmıştır. Dağıtım için AWS root hesabının kullanılmamasını öneririz. Bunun yerine, yalnızca gerekli izinlere sahip IAM kullanıcılarını veya rollerini kullanın.
    
    Dağıtım süreci, Wallarm bileşenlerini sağlamak ve işletmek için yalnızca asgari erişimin verildiği en az ayrıcalık ilkesini varsayar.

## Kullanım senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](https://docs.wallarm.com/installation/supported-deployment-options) arasında, aşağıdaki kullanım senaryolarında AWS VPC üzerinde Wallarm dağıtımı için Terraform modülü önerilir:

* Mevcut altyapınız AWS üzerinde bulunuyor.
* Infrastructure as Code (IaC) uygulamasını benimsiyorsunuz. Wallarm'ın Terraform modülü, Wallarm node'unun AWS üzerinde otomatik yönetimi ve sağlanmasına olanak tanıyarak verimliliği ve tutarlılığı artırır.

## Gereksinimler

* Terraform 1.0.5 veya üzeri [yerel olarak kurulu](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* US veya EU [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud) içindeki Wallarm Console'da **Administrator** [rolü](https://docs.wallarm.com/user-guides/settings/users/#user-roles) olan hesaba erişim
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` erişimi. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Tercih ettiğiniz herhangi bir AWS bölgesi; Wallarm node dağıtımı için bölgeye ilişkin özel bir kısıtlama yoktur
* Terraform, AWS EC2, Security Groups ve diğer AWS servisleri hakkında bilgi
* AWS root hesabı hiçbir zaman kaynak dağıtımı için kullanılmamalıdır

    Lütfen bu kılavuzda açıklanan dağıtımı gerçekleştirmek için gerekli en az izinlere sahip özel bir IAM kullanıcısı veya rolü kullanın.
* Geniş yetkilerden (örn. `AdministratorAccess`) kaçının ve bu modülün çalışması için gereken belirli işlemleri atayın

    Bu dağıtımda kullanılan IAM roller ve izinler, en az ayrıcalık ilkesine göre tasarlanmıştır. Yalnızca gerekli AWS kaynaklarını (örn. EC2, ağ, günlükleme) oluşturmak ve yönetmek için gereken izinler verilmelidir.

## Çözüm mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Örnek Wallarm proxy çözümü aşağıdaki bileşenlere sahiptir:

* İnternete açık Application Load Balancer, trafiği Wallarm node instance'larına yönlendirir.
* Wallarm node instance'ları trafiği analiz eder ve istekleri ileriye proxy'ler. Şemadaki karşılık gelen öğeler A, B, C EC2 instance'larıdır.

    Örnek, Wallarm node'larını açıklanan davranışı sağlayan izleme modunda çalıştırır. Wallarm node'ları, kötü amaçlı istekleri engellemeye ve yalnızca meşru olanları iletmeye yönelik olanlar da dahil olmak üzere diğer modlarda da çalışabilir. Wallarm node modları hakkında daha fazla bilgi için [belgelerimizi](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* Wallarm node'larının istekleri proxy'lediği servisler. Servis herhangi bir türde olabilir, örneğin:

    * VPC Endpoints aracılığıyla VPC'ye bağlı AWS API Gateway uygulaması (ilgili Wallarm Terraform dağıtımı [API Gateway için örnek](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)te ele alınmıştır)
    * AWS S3
    * EKS kümesinde çalışan EKS node'ları (bu durum için Internal Load Balancer veya NodePort Service yapılandırılması önerilir)
    * Diğer herhangi bir backend servis

    Varsayılan olarak, Wallarm node'ları trafiği `https://httpbin.org` adresine iletir. Bu örneği başlatırken, AWS Virtual Private Cloud (VPC) içinden erişilebilen başka herhangi bir servis alan adını veya yolunu belirterek trafiği oraya proxy'leyebilirsiniz.

    `https_redirect_code = 302` modül yapılandırma seçeneği, AWS ALB tarafından HTTP isteklerini HTTPS'e güvenli şekilde yönlendirmenizi sağlar.

Yukarıda listelenen bileşenlerin tamamı (proxy'lenen sunucu hariç) sağlanan `wallarm` örnek modülü tarafından dağıtılacaktır.

## Kod bileşenleri

Bu örnek aşağıdaki kod bileşenlerine sahiptir:

* `main.tf`: proxy çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması. Bu yapılandırma bir AWS ALB ve Wallarm instance'ları üretir.
* `ssl.tf`: `domain_name` değişkeninde belirtilen alan adı için otomatik olarak yeni bir AWS Certificate Manager (ACM) sertifikası çıkaran ve bunu AWS ALB'ye bağlayan SSL/TLS offload yapılandırması.

    Özelliği devre dışı bırakmak için `ssl.tf` ve `dns.tf` dosyalarını kaldırın veya yorum satırı yapın ve ayrıca `wallarm` modül tanımındaki `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` seçeneklerini yorum satırı yapın. Özellik devre dışı bırakıldığında yalnızca HTTP portunu (80) kullanabileceksiniz.
* `dns.tf`: AWS ALB için DNS kaydı sağlayan AWS Route 53 yapılandırması.

    Özelliği devre dışı bırakmak için yukarıdaki notu izleyin.

## Örnek Wallarm AWS proxy çözümünü çalıştırma

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) içinde Wallarm Console'a kaydolun.
1. Wallarm Console'u açın → **Nodes** ve **Wallarm node** türünde bir node oluşturun.
1. Oluşturulan node token'ını kopyalayın.
1. Örnek kodu içeren depoyu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan depodaki `examples/proxy/variables.tf` dosyasında `default` seçeneklerindeki değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. Proxy'lenen sunucunun protokol ve adresini `examples/proxy/main.tf` → `proxy_pass` içinde ayarlayın.

    Varsayılan olarak, Wallarm trafiği `https://httpbin.org` adresine proxy'ler. Varsayılan değer ihtiyaçlarınızı karşılıyorsa olduğu gibi bırakın.
1. Yığını `examples/proxy` dizininden aşağıdaki komutları çalıştırarak dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Sorun giderme

### Wallarm sürekli instance oluşturup sonlandırıyor

Sağlanan AWS Auto Scaling grup yapılandırması, en yüksek güvenilirlik ve hizmet sürekliliğine odaklanır. AWS Auto Scaling grubu başlatma sırasında EC2 instance'larının tekrarlı oluşturulup sonlandırılması, başarısız sağlık kontrollerinden kaynaklanabilir.

Sorunu gidermek için lütfen aşağıdaki ayarları gözden geçirip düzeltin:

* Wallarm node token'ı, Wallarm Console UI'dan kopyalanmış geçerli değere sahiptir
* NGINX yapılandırması geçerlidir
* NGINX yapılandırmasında belirtilen alan adları başarıyla çözümlenmiştir (örn. `proxy_pass` değeri)


**AŞIRI YÖNTEM** Yukarıdaki ayarlar geçerliyse, Auto Scaling grup ayarlarında ELB sağlık kontrollerini manuel olarak devre dışı bırakarak sorunun nedenini bulmayı deneyebilirsiniz. Bu, hizmet yapılandırması geçersiz olsa bile instance'ları aktif tutar, instance'lar yeniden başlatılmaz. Böylece birkaç dakika içinde sorunu araştırmak yerine günlükleri ayrıntılı şekilde inceleyip hizmeti hata ayıklayabilirsiniz.

## Başvurular

* [AWS ACM sertifikaları](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [Genel ve özel alt ağlara (NAT) sahip AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)