# AWS VPC İçinde Proxy Olarak Wallarm'ı Kullanma

Bu örnek, mevcut bir AWS Virtual Private Cloud (VPC) içinde inline proxy olarak Wallarm'ı kullanma yolunu [Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) ile açıklar.

Wallarm'ın proxy çözümü, WAF ve API güvenlik özelliklerine sahip gelişmiş bir HTTP trafik yönlendiricisi olarak hareket eden ek bir ağ katmanı sağlar.

[Proxy gelişmiş çözümünü](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) deneyerek çözümün esnekliğini gerçekten deneyimleyebilirsiniz.

## Ana Özellikler

* Wallarm, trafiği senkron modda işler, Wallarm'ın özelliklerini kısıtlamaz ve anında tehdit azaltmayı mümkün kılar (`preset=proxy`).
* Wallarm çözümü, diğer katmanlardan bağımsız olarak kontrol edilebilen ayrı bir ağ katmanı olarak konuşlandırılır ve hemen hemen her ağ yapısı konumuna katman yerleştirebilir. Önerilen konum, internet yüzü olan yük dengeleyicinin arkasıdır.

## Çözümün Mimarisi

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarm'ın proxy çözüm örneğinde aşağıdaki bileşenler bulunur:

* Trafik Wallarm düğüm örneğine yönlendiren yüz yüzeyli Uygulama Yük Dengeleyici.
* Trafik analiz eder ve herhangi bir isteği daha fazla proxy eden Wallarm düğüm örneği. İlgili öğeler, şema üzerindeki A, B, C EC2 örnekleridir.

    Bu örnekte, anlatılan davranışları tetikleyen izleme modunda Wallarm düğümünü çalıştırıyoruz. Wallarm düğümü, kötü niyetli taleplerin engellenmesi ve yalnızca meşru taleplerin daha fazla iletilmesi amacıyla diğer modlarda da çalışabilir. Wallarm düğüm modu hakkında daha fazla ayrıntı için, lütfen [dokümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) inceleyin.
* Wallarm düğümünün istekleri proxy edeceği hizmet. Hizmetin herhangi bir türde olabilir. Örneğin:

    * VPC uç noktası üzerinden VPC'ye bağlanan bir AWS API Gateway uygulaması (İlgili Wallarm Terraform dağıtımı, [API Gateway örneği](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway) ile kapsanmıştır).
    * AWS S3
    * EKS kümeleri içinde çalışan EKS düğümleri (Bu durum için, iç yük dengeleyici veya NodePort Hizmeti ayarları önerilir)
    * Diğer arka uç hizmetler

    Wallarm düğümü varsayılan olarak `https://httpbin.org` adresine trafik yönlendirir. Bu örneğin başlatılması sırasında, AWS Virtual Private Cloud (VPC) üzerinden erişilebilen herhangi bir diğer hizmet alan adını veya yolu belirleyerek trafiği proxy olarak yönlendirebilirsiniz.

    `https_redirect_code = 302` modül ayarı seçeneği kullanılarak, HTTP isteklerinin AWS ALB tarafından güvenli bir şekilde HTTPS'ye yönlendirilebilir.

Listelenen bileşenler (proxy edilen sunucu dışında), sağlanan `wallarm` örnek modülü ile dağıtılır.

## Kod Bileşenleri

Bu örnekte, aşağıdaki kod bileşenleri bulunmaktadır:

* `main.tf`: Proxy çözümü olarak dağıtılan `wallarm` modülünün ana ayarları. Ayarlar AWS ALB ve Wallarm örneği oluşturur.
* `ssl.tf`: `variable_name` ile belirtilen alan adı için yeni bir AWS Certificate Manager (ACM) otomatik olarak verir ve bunu AWS ALB'ye bağlar olan SSL / TLS offload ayarı.

    Bu özelliği devre dışı bırakmak için, `ssl.tf` ve `dns.tf` dosyalarını kaldırın veya yorumlayın ve ayrıca `wallarm` modül tanımındaki `lb_ssl_enabled`,`lb_certificate_arn`,`https_redirect_code`,`depends_on` seçeneklerini yorumlayın. Bu özellik devre dışı bırakıldığında, yalnızca HTTP portunu (80) kullanabilirsiniz.
* `dns.tf`: AWS ALB için DNS kayıtlarının kullanılabilir hale getirilmesini sağlayan AWS Route 53 ayarı.

    Özelliği devre dışı bırakmak için, yukarıdaki bilgilere uygun davranın.

## Gereklilikler

* [Yerel olarak yüklenen](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya üzeri
* [EU Cloud](https://my.wallarm.com/) veya [US Cloud](https://us1.my.wallarm.com/) üzerindeki Wallarm konsolunda **yönetici** rolüne erişim sahibi hesaplar
* Eğer Wallarm's EU Cloud ile birlikte çalışıyorsanız `https://api.wallarm.com` adresine, Wallarm's US Cloud ile birlikte çalışıyorsanız `https://us1.api.wallarm.com` adresine erişiminiz olmalıdır. Firewall tarafından bu erişime engel olunmadığından emin olun
* SSL ve DNS özelliğinin etkin olan örneği çalıştırmak için, bir [Route 53 hosting zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html) yapın

## Wallarm AWS Proxy Çözüm Örneğinin Çalıştırılması

1. Wallarm konsolunda [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinden kaydolun.
1. Wallarm Konsolu → **Nodes** açın ve **Wallarm Node** tipinde bir düğüm oluşturun.
1. Oluşturulan düğüm belirtecini kopyalayın.
1. Örneğin kodunu içeren depoyu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanmış depodaki `examples/proxy/variables.tf` dosyasındaki `default` seçeneğinde değişkenlerin değerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/proxy/main.tf` → `proxy_pass` adresinde proxy sunucunun protokol ve adresini ayarlayın.

    İlk kurulumda, Wallarm trafiği `https://httpbin.org` adresine proxy olarak yönlendirecektir. Başlangıç değerleri ihtiyaçlarınıza uygunsa, her şeyi olduğu gibi bırakın.
1. `examples/proxy` dizininden aşağıdaki komutları çalıştırarak stack'i dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Sorun Giderme

### Wallarm, örnek oluşturma ve bitirme işlemlerini tekrarlıyor

Sağlanan AWS Auto Scaling grubu ayarı, hizmetin en iyi güvenilirliği ve pürüzsüzlüğü üzerinde yoğunlaşır. AWS Auto Scaling grubunun başlatılması sırasında EC2 örneklerinin birkaç kez oluşturulup sona erdirilmesi, sağlık kontrolünün başarısız olmasından kaynaklanabilir.

Bu sorunu çözmek için aşağıdaki ayarları kontrol edin ve düzeltin:

* Wallarm düğüm belirteci, Wallarm Konsol UI'dan kopyalanmış geçerli bir değere sahip olmalıdır
* NGINX yapılandırmanın geçerli olduğunu
* NGINX yapılandırmasında belirtilen alan adının doğru bir şekilde çözüldüğünden emin olun (örneğin `proxy_pass` değeri)

**Son Çözüm** Yukarıdaki ayarların geçerli olmasına rağmen sorun çözülmezse, Auto Scaling grubu ayarında manuel olarak ELB sağlık kontrolü devre dışı bırakmayı ve sorunun kaynağını bulmayı deneyin. Bu durumda, hizmet yapılandırması geçersiz olmasına rağmen, örnekleme aktif durumda kalır ve örnekleme yeniden başlatılmaz. Bu, logları ayrıntılı inceleme ve hizmeti hata ayıklama süresini artırıyor ve sorunun birkaç dakika içinde çözülebileceği anlamına geliyor.

## Referanslar

* [AWS ACM sertifikaları](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [Hem Kamu Hem de Özel Alt Ağlara (NAT) Sahip AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)