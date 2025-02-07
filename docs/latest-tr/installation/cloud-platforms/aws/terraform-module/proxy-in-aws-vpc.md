# AWS VPC'de Wallarm'ı Proxy Olarak Dağıtma

Bu örnek, mevcut bir AWS Virtual Private Cloud (VPC)'ye Wallarm'ı inline proxy olarak dağıtmayı, [Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanarak nasıl gerçekleştireceğinizi göstermektedir.

Wallarm proxy çözümü, WAAP ve API güvenlik fonksiyonları ile gelişmiş bir HTTP trafik yönlendiricisi olarak ek bir fonksiyonel ağ katmanı sunar.

Çözüm esnekliğini, [proxy advanced solution](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) deneyerek görebilirsiniz.

## Kullanım Senaryoları

Desteklenen tüm [Wallarm deployment options](https://docs.wallarm.com/installation/supported-deployment-options) arasında, Terraform modülü AWS VPC üzerinde Wallarm dağıtımı için aşağıdaki **kullanım senaryolarında** önerilmektedir:

* Mevcut altyapınız AWS üzerinde barındırılıyor.
* Altyapı kod olarak (IaC) uygulamasını kullanıyorsunuz. Wallarm'ın Terraform modülü, AWS üzerindeki Wallarm node'un otomatik yönetim ve sağlama işlemlerini mümkün kılarak verimliliği ve tutarlılığı artırır.

## Gereksinimler

* Terraform 1.0.5 veya daha yüksek sürümün [yerel olarak yüklü olması](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* US veya EU [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)'da bulunan Wallarm Console'da **Administrator** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip bir hesaba erişim
* US Wallarm Cloud ile çalışıyorsanız https://us1.api.wallarm.com veya EU Wallarm Cloud ile çalışıyorsanız https://api.wallarm.com adresine erişim. Lütfen erişimin herhangi bir güvenlik duvarı tarafından engellenmediğinden emin olun

## Çözüm Mimarisi

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Örnek Wallarm proxy çözümü aşağıdaki bileşenlere sahiptir:

* İnternete açık Application Load Balancer, trafiği Wallarm node örneklerine yönlendirir.
* Wallarm node örnekleri trafiği analiz eder ve gelen istekleri daha ileri proxy'ler. Şemadaki karşılık gelen elemanlar A, B, C EC2 örnekleridir.

    Örnek, tanımlanan davranışı yürüten izleme modunda Wallarm node'larını çalıştırır. Wallarm node'ları ayrıca kötü niyetli istekleri engellemeye ve yalnızca meşru olanları iletmeye yönelik diğer modlarda da çalışabilir. Wallarm node modları hakkında daha fazla bilgi için [our documentation](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* Wallarm node'larının proxy'lediği hizmetler. Hizmet herhangi bir türde olabilir, örneğin:

    * VPC Endpoints aracılığıyla VPC'ye bağlı AWS API Gateway uygulaması (ilgili Wallarm Terraform dağıtımı [API Gateway örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway) ele alınmıştır)
    * AWS S3
    * EKS kümesinde çalışan EKS node'ları (bu durum için Internal Load Balancer veya NodePort Service yapılandırması önerilir)
    * Başka herhangi bir backend hizmeti

    Varsayılan olarak, Wallarm node'ları trafiği `https://httpbin.org` adresine iletecektir. Bu örneğin başlatılması sırasında, AWS Virtual Private Cloud (VPC)'den proxy trafiği iletebileceğiniz herhangi bir diğer hizmet alan adını ya da yolunu belirleme imkânına sahip olacaksınız.

    `https_redirect_code = 302` modül yapılandırma seçeneği, AWS ALB tarafından HTTP isteklerini güvenli bir şekilde HTTPS'ye yönlendirmenize olanak tanır.

Listelemesi yapılan tüm bileşenler (proxy'lenen sunucu hariç) sağlanan `wallarm` örnek modülü ile dağıtılacaktır.

## Kod Bileşenleri

Bu örnek aşağıdaki kod bileşenlerine sahiptir:

* `main.tf`: bir proxy çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması. Yapılandırma, bir AWS ALB ve Wallarm örnekleri oluşturur.
* `ssl.tf`: `domain_name` değişkeninde belirtilen alan için otomatik olarak yeni bir AWS Certificate Manager (ACM) sertifikası oluşturan ve bunu AWS ALB'ye ilişkilendiren SSL/TLS offload yapılandırması.

    Bu özelliği devre dışı bırakmak için, `ssl.tf` ve `dns.tf` dosyalarını kaldırın veya yorum satırı haline getirin, ayrıca `wallarm` modül tanımındaki `lb_ssl_enabled`, `lb_certificate_arn`, `https_redirect_code`, `depends_on` seçeneklerini de yorum satırı haline getirin. Özellik devre dışı bırakıldığında, sadece HTTP portu (80) kullanabileceksiniz.
* `dns.tf`: AWS ALB için DNS kaydı sağlayan AWS Route 53 yapılandırması.

    Bu özelliği devre dışı bırakmak için yukarıdaki notu takip edin.

## Örnek Wallarm AWS Proxy Çözümünü Çalıştırma

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinden Wallarm Console'a kaydolun.
2. Wallarm Console'u açın → **Nodes** bölümüne gidin ve **Wallarm node** türünde bir node oluşturun.
3. Oluşturulan node token'ını kopyalayın.
4. Örnek kodu içeren repoyu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
5. Klonlanan repodaki `examples/proxy/variables.tf` dosyasındaki default seçenekler içerisindeki değişken değerlerini belirleyin ve değişiklikleri kaydedin.
6. `examples/proxy/main.tf` dosyasında `proxy_pass` altında proxy'lenen sunucunun protokolünü ve adresini ayarlayın.

    Varsayılan olarak, Wallarm trafiği `https://httpbin.org` adresine yönlendirecektir. Varsayılan değer ihtiyaçlarınızı karşılıyorsa, olduğu gibi bırakabilirsiniz.
7. Aşağıdaki komutları `examples/proxy` dizininden çalıştırarak yığını dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Sorun Giderme

### Wallarm Sürekli Olarak Örnekler Oluşturup Sonlandırıyor

Sağlanan AWS Auto Scaling grup yapılandırması, hizmetin en yüksek güvenilirlik ve sorunsuz çalışmasına odaklanmıştır. AWS Auto Scaling grup başlatılması sırasında EC2 örneklerinin sürekli oluşturulup sonlandırılması, başarısız sağlık kontrolleri nedeniyle meydana gelebilir.

Sorunu çözmek için, lütfen aşağıdaki ayarları gözden geçirip düzeltin:

* Wallarm node token geçerli olup Wallarm Console arayüzünden kopyalanmış olmalıdır
* NGINX yapılandırması geçerli olmalıdır
* NGINX yapılandırmasında belirtilen alan adları başarıyla çözümlenmiş olmalıdır (örneğin, `proxy_pass` değeri)

**AŞIRI YÖNTEM**  
Yukarıdaki ayarlar geçerli ise, sorunun sebebini manuel olarak Auto Scaling grup ayarlarında ELB sağlık kontrollerini devre dışı bırakarak bulmayı deneyebilirsiniz. Bu, hizmet yapılandırması geçersiz olsa bile örnekleri aktif durumda tutacaktır, böylece örnekler yeniden başlamayacaktır. Bu sayede sorunu birkaç dakika içinde araştırmak yerine logları detaylıca inceleyip hizmeti debug edebileceksiniz.

## Referanslar

* [AWS ACM certificates](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)