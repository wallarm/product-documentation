# AWS VPC'de Wallarm'ın Proxy Olarak Dağıtımı

Bu örnek, Wallarm'ı mevcut bir AWS Sanal Özel Bulut (VPC) içine bir çevrimiçi proxy olarak [Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanarak nasıl dağıtabileceğinizi gösterir.

Wallarm proxy çözümü, WAF ve API güvenlik işlevleriyle birlikte gelişmiş bir HTTP trafik yönlendiricisi olarak hizmet veren ek bir işlevsel ağ katmanı sağlar.

Çözümün esnekliğini, [proxy ileri çözümü](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) deneyerek görebilirsiniz.

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](https://docs.wallarm.com/installation/supported-deployment-options) arasında, Terraform modülünün AWS VPC'de Wallarm dağıtımı için bu **kullanım durumlarında** önerilir:

* Mevcut altyapınız AWS üzerindedir.
* Altyapı Kodu (IaC) olarak pratiği kullanıyorsunuz. Wallarm'ın Terraform modülü, AWS'deki Wallarm düğümünün otomatik yönetimini ve ayrıştırmasını sağlar, böylece verimliliği ve tutarlılığı artırır.
  
## Gereksinimler

* Yerel olarak yüklenmiş Terraform 1.0.5 veya daha yüksek [sürüm](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Wallarm Konsolunda ABD veya AB [Bulutunda](https://docs.wallarm.com/about-wallarm/overview/#cloud) **Yönetici** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip hesaba erişim.
* ABD Wallarm Bulutu ile çalışıyorsanız `https://us1.api.wallarm.com` ya da AB Wallarm Bulutu ile çalışıyorsanız `https://api.wallarm.com` adreslerine erişim olmalıdır. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.

## Çözüm Mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Örnekteki Wallarm proxy çözümü şu bileşenlere sahiptir:

* İnternet-yüzü Uygulama Yük Dengeleyicisi, trafik rotalandırmasını Wallarm düğüm örneklerine yapar.
* Wallarm düğüm örnekleri, trafik analizi yapıyor ve herhangi bir isteği daha ileri bir noktaya proxy olarak yönlendiriyor. Şemanın karşılık gelen elemanları A, B, C EC2 örnekleridir.

    Örnekteki Wallarm düğümleri, tarif edilen davranışı izleyen izleme modunda çalışır. Wallarm düğümleri, yalnızca meşru olanların daha ileri gönderilmesini amaçlayanlar da dahil olmak üzere diğer modlarda da çalışabilir. Wallarm düğüm modları hakkında daha fazla bilgi edinmek için [dökümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* Düğümlerin Wallarm'a talepleri yönlendirdiği hizmetler. Hizmet her türlü olabilir, örneğin:

    * VPC Uç Noktaları aracılığıyla VPC'ye bağlı AWS API Gateway uygulaması (karşılık gelen Wallarm Terraform dağıtımı [API Gateway örneği](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)nde ele alınmaktadır)
    * AWS S3
    * EKS hizmetleriving EKS kümesinde çalışan düğümler (bu durum için Dahili Yük Dengeleyici veya NodePort Hizmeti yapılandırması önerilir)
    * Diğer tüm arka uç hizmetler
    
    Varsayılan olarak, Wallarm düğümleri trafiği `https://httpbin.org` adresine yönlendirecektir. Bu örnekteki başlatma sırasında, trafiği proxy olarak yönlendirmek üzere AWS Sanal Özel Bulut (VPC) üzerinden erişilebilir herhangi başka bir hizmet alanı veya yolunu belirleyebilirsiniz.
    
    `https_redirect_code = 302` modül yapılandırma seçeneği, AWS ALB tarafından HTTP isteklerini güvenli bir şekilde HTTPS'ye yönlendirmenizi sağlar.

Belirtilen tüm bileşenler (proxy'lenen sunucu dışında) sağlanan `wallarm` örnek modülü tarafından dağıtılacaktır.

## Kod Bileşenleri

Bu örnek, aşağıdaki kod bileşenlerine sahiptir:

* `main.tf`: Bir proxy çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması. Yapılandırma, bir AWS ALB ve Wallarm örnekleri oluşturur.
* `ssl.tf`: Belirtilen 'Alan adı' değişkenindeki alan için otomatik olarak yeni bir AWS Sertifika Yöneticisi (ACM) veren ve bunu AWS ALB'ye bağlayan SSL/TLS hafifletme yapılandırması.

    Bu özelliği devre dışı bırakmak için, 'ssl.tf' ve 'dns.tf' dosyalarını kaldırın veya yorum satırına alın ve ayrıca `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` seçeneklerini `wallarm` modül tanımında yorum satırına alın. Özellik devre dışı bırakıldığında, yalnızca HTTP portunu (80) kullanabileceksiniz.
* `dns.tf`: AWS ALB için bir DNS kaydı oluşturan AWS Route 53 yapılandırması.

    Bu özelliği devre dışı bırakmak için yukarıdaki notu izleyin.

## Wallarm AWS Proxy Çözümünü Çalıştırmak

1. [AB Bulutunda](https://my.wallarm.com/nodes) ya da [ABD Bulutunda](https://us1.my.wallarm.com/nodes) Wallarm Konsolu'nda kayıt olun.
1. Wallarm Konsolu'nu açın → **Düğümler** ve **Wallarm düğümü** tipinde düğüm oluşturun.
1. Oluşturulan düğüm belirteci kopyalayın.
1. Örnek kodu içeren depoyu makinenize kopyalayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan depodaki `examples/proxy/variables.tf` dosyasındaki `default` opsiyonlarındaki değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/proxy/main.tf` → `proxy_pass` içinde yönlendirilmiş sunucunun protokolünü ve adresini ayarlayın.
   
   Varsayılan olarak, Wallarm trafiği `https://httpbin.org` adresine yönlendirecektir. Varsayılan değer ihtiyaçlarınızı karşılıyorsa olduğu gibi bırakın.
1. Aşağıdaki komutları `examples/proxy` dizininden çalıştırarak parçayı dağıtın:

    ```
    terraform init
    terraform apply
    ```
    
Dağıtılmış ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Sorun Giderme

### Wallarm sürekli olarak örnekleri oluşturur ve sonlandırır

Sağlanan AWS Otomatik Ölçekleme grup konfigürasyonu, hizmetin en yüksek güvenilirlik ve düzgünlüğüne odaklanmıştır. AWS Otomatik Ölçekleme grubunun başlatılması sırasında EC2 örneklerinin sürekli oluşturulması ve sonlandırılması, sağlık kontrollerinin başarısız olmasından kaynaklanabilir.

Problemi çözmek için lütfen aşağıdaki ayarları gözden geçirin ve düzeltin:

* Wallarm düğüm belirtecının Wallarm Konsolu UI'dan kopyalanan geçerli bir değeri var mı?
* NGINX yapılandırması geçerli mi?
* NGINX yapılandırmasında belirtilen alan adları başarıyla çözümlendi mi (örneğin, `proxy_pass` değeri)


**ACİL YOL** Eğer yukarıdaki ayarlar geçerliyse, ELB sağlık kontrollerini manuel olarak Otomatik Ölçekleme grup ayarlarında devre dışı bırakarak sorunun nedenini bulmaya çalışabilirsiniz. Hizmet yapılandırması geçersiz olsa bile, bu durumda örnekler aktif hale gelecek, örnekler yeniden başlatılmayacak. Günlükleri ayrıntılı olarak inceleyebilir ve hizmeti hata ayıklarsınız, sorunu birkaç dakika içindethe sorunu araştırmazsınız.

## Kaynaklar

* [AWS ACM sertifikaları](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [Herkese açık ve özel alt ağlarla AWS VPC (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)