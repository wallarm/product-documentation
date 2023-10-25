# Wallarm AWS Terraform Modülünün Örnek Dağıtımı: Sıfırdan Proxy Çözümü

Bu örnek, Wallarm'ı Terraform modülünü kullanarak bir AWS Sanal Özel Bulut (VPC) 'ye çevrimiçi bir proxy olarak nasıl dağıtacağınızı gösterir. [Düzenli](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) veya [ileri düzey](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) proxy dağıtım örneklerinin aksine, bu örnek konfigürasyon [AWS VPC Terraform modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) kullanarak VPC kaynaklarını bu örnek dağıtım sırasında doğrudan oluşturacak. İşte örneğin "sıfırdan proxy çözümü" olarak adlandırılmasının nedeni budur.

Eğer aşağıdakiler geçerliyse bu, **tavsiye edilen** dağıtım seçeneğidir:

* Alt ağlar, NAT'lar, route tabloları ve diğer VPC kaynaklarınız yapılandırılmış değilse. Bu dağıtım örneği, VPC kaynaklarını oluşturmak ve Wallarm'ı onlarla entegre etmek için Wallarm Terraform modülüyle birlikte [AWS VPC Terraform Modülünü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) başlatır.
* Wallarm'ın AWS VPC ile nasıl entegre edildiğini, bu entegrasyon için gereken VPC kaynakları ve modül değişkenleri öğrenmek istiyorsanız.

## Ana Özellikler

* Wallarm, anında tehdit giderme becerisi sağlayan ve Wallarm yeteneklerini kısıtlamayan senkronize modda trafik işler (`preset=proxy`).
* Wallarm çözümü, diğer katmanlardan bağımsız olarak kontrol etmenizi sağlayan ayrı bir ağ katmanı olarak dağıtılır ve katmanın neredeyse herhangi bir ağ yapısı pozisyonunda yer almasını sağlar. Tavsiye edilen pozisyon, bir internet-facing load balancer'in arkasıdır.
* Bu çözüm, DNS ve SSL özelliklerinin yapılandırılmasını gerektirmez.
* VPC kaynakları oluşturur ve otomatik olarak Wallarm çevrimiçi proxy'i oluşturulan VPC'ye entegre eder, oysa düzenli proxy örnekleri, VPC kaynaklarının mevcut olmasını ve tanımlayıcılarının talep edilmesini gerektirir.
* Bu örneği çalıştırmak için gereken tek değişken, Wallarm node token'i olan `token` 'dır.

## Çözüm Mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Bu örnek çözümün mimarisi, [düzenli proxy çözümü](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) ile aynıdır:

* AWS VPC kaynakları arasında alt ağlar, NAT'lar, route tabloları, EIP'ler vb. bu örnek başlantı sırasında [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) modülü tarafından otomatik olarak dağıtılır. Bunlar sağlanan şemada gösterilmez.
* İnternet-facing Uygulama Yük Dengeleyicisi, trafiği Wallarm düğüm örneklerine yönlendirir. Bu bileşen sağlanan `wallarm` örnek modülü tarafından dağıtılır.
* Wallarm düğüm örnekleri, trafiği analiz eder ve tüm istekleri daha ileri proxyler. Şemanın üzerindeki ilgili öğeler A, B, C EC2 örnekleridir. Bu bileşen sağlanan `wallarm` örnek modülü tarafından dağıtılır.

    Örnek, Wallarm düğümlerini, açıklanan davranışı yönlendiren izleme modunda çalıştırır. Wallarm düğümleri, yalnızca meşru olanları daha ileriye taşıyan kötü niyetli istekleri engellemeyi hedefleyen diğer modlarda da çalışabilir. Wallarm düğüm modları hakkında daha fazla bilgi edinmek için [dokümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* Wallarm düğümlerinin proxy taleplerine oluşturduğu hizmetler. Hizmet her türden olabilir, örneğin:

    * VPC Endpoints aracılığıyla VPC'ye bağlı AWS API Gateway uygulaması ([API Gateway için örnek](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway) 'da karşılık gelen Wallarm Terraform dağıtımı ele alınmıştır))
    * AWS S3
    * EKS düğümlerini EKS kümesinde çalıştırma (bu durum için Dahili Yük Dengeleyici veya NodePort Hizmeti yapılandırması tavsiye edilir)
    * Diğer herhangi bir backend servisi

    Varsayılan olarak, Wallarm düğümleri trafiği `https://httpbin.org` 'a yönlendirecektir. Bu örnek başlatma sırasında, trafiği proxy olarak kullanabileceğiniz herhangi bir diğer servis domaini veya AWS Sanal Özel Bulut (VPC) 'den erişilebilen yol belirleyebilirsiniz.

## Kod Bileşenleri

Bu örnekte, aşağıdaki modül ayarlarına sahip tek bir `main.tf` yapılandırma dosyası bulunmaktadır:

* AWS VPS kaynaklarını oluşturmak için [`vpc` modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) ayarları.
* Proxy çözümü olarak dağıtılacak Wallarm yapılandırması için `wallarm` modülü. Yapılandırma bir AWS ALB ve Wallarm örnekleri oluşturur.

## Gereksinimler

* Yerel olarak [kurulumu yapılmış](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya daha yüksek sürüm
* [EU Cloud](https://my.wallarm.com/) veya [US Cloud](https://us1.my.wallarm.com/) 'daki Wallarm Konsolu'nda **Yönetici** rolüne sahip bir hesaba erişim
* EU Wallarm Cloud ile çalışırken `https://api.wallarm.com` 'a veya US Wallarm Cloud ile çalışırken `https://us1.api.wallarm.com` 'a erişim. Erişimin bir firewall tarafından engellenmediğinden emin olun

## Örnek Wallarm AWS proxy çözümünün çalıştırılması

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) 'daki Wallarm Konsolu'na kayıt olun.
1. Wallarm Konsolu → **Nodes** 'u açın ve **Wallarm node** tipinde bir düğüm oluşturun.
1. Oluşturulan node token'i kopyalayın.
1. Örnekleme ait kodu içeren repo'yu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan repo'nun `examples/from-scratch/variables.tf` dosyasındaki `default` seçeneklerinde değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/from-scratch` klasöründen aşağıdaki komutları çalıştırarak stack'i dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Referanslar

* [Wallarm dokümantasyonu](https://docs.wallarm.com)
* [AWS üzerinde VPC kaynakları oluşturan Terraform modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws)
* [Halka açık ve özel alt ağlara sahip AWS VPC (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
