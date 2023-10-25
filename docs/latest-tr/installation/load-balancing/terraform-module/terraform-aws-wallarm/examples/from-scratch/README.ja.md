# Wallarm AWS Terraform Modülü Örnek Dağıtımı: Sıfırdan Proxy Çözümü

Bu örnekte, Terraform modülünün Wallarm'ı bir AWS Virtual Private Cloud (VPC) içinde çevrimiçi bir proxy olarak nasıl dağıtılacağını gösteriyoruz. [Standart](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) veya [ileri seviye](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced) proxy dağıtım örneklerinden farklı olarak, bu örnekteki yapılandırmada, [AWS VPC Terraform modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) kullanılarak, bu örnekteki dağıtım sırasında doğrudan VPC kaynakları oluşturulur. Bu sebeple, bu örneğe "sıfırdan bir proxy çözümü" örneği denir.

Aşağıdakiler, **tavsiye edilen** dağıtım opsiyonlarıdır:

* Eğer subnetler, NAT, yönlendirme tabloları ve diğer VPC kaynakları ayarlanmamışsa. Bu dağıtım örneğinde, Wallarm Terraform modülü ile beraber [AWS VPC Terraform modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) başlatılır, VPC kaynakları oluşturulur ve Wallarm ile entegre edilir.
* Wallarm modülünün AWS VPC ile nasıl entegre olduğunu ve bu entegrasyon için gerekli olan VPC kaynakları ve modül değişkenleri hakkında bilgi edinmek istiyorsanız.

## Ana Özellikler

* Wallarm, işlevlerini kısıtlamadan ve tehditlerin hızlıca hafifletilmesini sağlayan senkron modda trafiği işler (`preset=proxy`).
* Wallarm çözümü, diğer katmanlardan bağımsız olarak kontrol edilebilir ve neredeyse her ağ yapısı konumunda bir katman yerleştirebilir, internete açık bir yük dengeleyicisi arkasında olması tavsiye edilir.
* Bu çözümde DNS ve SSL özelliklerini ayarlamanıza gerek yoktur.
* VPC kaynakları oluşturur ve Wallarm çevrimiçi proxy'yi oluşturulan VPC'ye otomatik olarak entegre eder, diğer taraftan standart proxy örneklerinde, VPC kaynakları bulunur ve onların tanımlayıcılarının talep edilmesi gereklidir.
* Bu örneği çalıştırmak için gerekli olan tek değişken, Wallarm düğümünün `token` taşımasıdır.

## Çözüm Mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Bu örneğin çözümü, [standart proxy çözümü](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) ile aynı mimariye sahiptir:

* Subnetler, NAT, yönlendirme tabloları, EIP gibi AWS VPC kaynakları, bu örneğin başlangıcında [`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) modülü tarafından otomatik olarak dağıtılır. Bunlar sağlanan şemada gösterilmez.
* İnternet tabanlı bir uygulama yük dengeleyicisinden Wallarm düğümü örneğine trafik yönlendiren. Bu bileşen, sağlanan `wallarm` örneği modülü tarafından dağıtılır.
* Trafik analizi ve tüm istekleri daha fazla proxy hizmetine sunan Wallarm düğümü örneği. Şemadaki karşılık gelen elemanlar A, B, C EC2 örnekleridir. Bu bileşen, sağlanan `wallarm` örnek modülü tarafından dağıtılır.

    Örnekte, Wallarm düğümü izleme modunda çalışır ve açıklanan davranışı sürdürür. Wallarm düğümü, kötü niyetli istekleri engellemek ve sadece meşru olanları daha fazla iletmek amacıyla farklı modlarda çalışabilir. Wallarm düğüm modü hakkında daha fazla bilgi için, lütfen [dökümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) inceleyin.
* Wallarm düğümünün istekleri proxylediği servis. Servis her türlü olabilir. Örneğin:

    * VPC endpoint üzerinden VPC'ye bağlanmış AWS API Gateway uygulaması (karşılık gelen Wallarm Terraform dağıtımı, [API Gateway örneği](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway) ile kapsanmıştır)
    * AWS S3
    * EKS kümesi üzerinde çalışan EKS düğümleri (bu durumda, Internal Load Balancer veya NodePort Service ayarı tavsiye edilir)
    * Diğer herhangi bir arka uç servis

    Varsayılan olarak, Wallarm düğümü trafiği `https://httpbin.org` adresine yönlendirir. Bu örneğin başlangıcında, AWS Virtual Private Cloud (VPC) 'den erişilebilir herhangi bir diğer servis etki alanı veya yol, proxy trafiği için hedef olarak belirtilebilir.

## Kod Bileşenleri

Bu örnekte, aşağıdaki modül yapılandırmalarına sahip tek bir `main.tf` yapılandırma dosyası bulunur:

* AWS VPS kaynaklarını oluşturmak için [`vpc` modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/) yapısı.
* AWS ALB ve Wallarm örneklerini oluşturan ve bir proxy çözümü olarak dağıtılan Wallarm yapısı ile `wallarm` modülü.

## Gerekli Şartlar

* Terraform 1.0.5 veya daha yüksek bir sürümün [yerel olarak yüklenmiş](https://learn.hashicorp.com/tutorials/terraform/install-cli) olması
* Wallarm konsoluna **yönetici** rolü ile erişim sahibi bir hesaba sahip olmanız. [EU Cloud](https://my.wallarm.com/) veya [US Cloud](https://us1.my.wallarm.com/)
* Eğer EU Wallarm Cloud kullanıyorsanız `https://api.wallarm.com`, eğer US Wallarm Cloud kullanıyorsanız `https://us1.api.wallarm.com`'a erişiminizin olması ve erişiminizin bir firewall tarafından engellenmemiş olması gerekmektedir.

## Wallarm AWS Proxy Çözümü Örneklerinin Çalıştırılması

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinde Wallarm konsoluna kaydolun.
1. Wallarm Konsolu → **Düğümler**'i açın ve **Wallarm düğümü** tipinde bir düğüm yaratın.
1. Oluşturulan düğüm tokenini kopyalayın.
1. Örneğin kodunun bulunduğu reponun bilgisayarınıza clone'layın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. `examples/from-scratch/variables.tf` dosyasında `default` opsiyonun değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/from-scratch` dizininden aşağıdaki komutları çalıştırın ve yığını dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan çevreyi kaldırmak için, aşağıdaki komutu kullanın:

```
terraform destroy
```

## Kaynaklar

* [Wallarm dökümantasyonu](https://docs.wallarm.com)
* [AWS üzerinde VPC kaynakları oluşturan Terraform modülü](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)
* [Halka açık ve özel subnetleri (NAT) olan AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)