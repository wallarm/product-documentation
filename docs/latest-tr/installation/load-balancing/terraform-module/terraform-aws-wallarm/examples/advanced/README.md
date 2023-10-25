# Wallarm AWS Terraform Modülünün örnek dağıtımı: Proxy ileri çözümü

Bu örnek, Terraform modülünü kullanarak mevcut bir AWS Sanal Özel Bulut (VPC) içerisine ileri ayarları olan inline bir proxy olarak Wallarm'ı nasıl dağıtacağınızı göstermektedir. Oldukça [basit bir proxy dağıtımı](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) gibidir fakat sık kullanılan ileri yapılandırma seçeneklerini sunar.

Bu örnekle daha kolay bir şekilde başlamak için ilk önce [basit proxy örneğine](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy) göz atınız. 

Wallam proxy ileri çözümü (basit bir proxy gibi) WAF ve API güvenlik işlevleriyle birlikte ileri düzey bir HTTP trafik yönlendiricisi olarak hizmet veren ek bir işlevsel ağ katmanını sağlar.

## Ana özellikler

Proxy ileri çözümü, basitinden aşağıdaki şekillerde farklılık gösterir:

* Çözüm hiçbir yük dengeleyici oluşturmaz (`lb_enabled=false`) fakat hala mevcut bir yük dengeleyiciye sonradan ekleyebileceğiniz bir hedef grup oluşturur.

    Bu, senkron trafik işleme yaklaşımına sorunsuz bir şekilde geçiş yapmayı sağlar.
* NGINX ve Wallarm yapılandırması sadece standart değişkenlerde değil aynı zamanda `global_snippet`, `http_snippet` ve `server_snippet` NGINX parçalarında belirtilir.
* Wallarm düğüm başlatma betiği (bulut-açılışı) tamamlandığında, özel `post-cloud-init.sh` betiği özel bir HTML anasayfayı `/var/www/mysite/index.html` örneği dizinine yerleştirir.
* Konuşlandırılan yığın, AWS S3'ye sınırlı erişim izni veren ek AWS IAM politikası ile ilişkilendirilir.

    Bu örneği olduğu gibi kullanıyorsanız, sağlanan erişime ihtiyacınız olmayacak. Yine de `post-cloud-init. sh` dosyası AWS S3'den genellikle özel erişim gerektiren dosyaları talep eden aktif olmayan bir örneği içerir. Eğer S3 kodunu `post-cloud-init.sh` dosyasından aktif ederseniz, `extra_policies` değişkeninde AWS S3 erişim IAM politikalarını belirtmeniz gerekecektir.
* Çözüm, `extra_ports` değişkeni ve `http_snippet.conf` ile yapılandırılmış ek bir dahili ağ portu, 7777, üzerinde Wallarm örneklerine gelen bağlantılara izin verir.

    Port 7777'yi `0.0.0.0/0` için izin vermek için `extra_public_ports` değişkenini ekstra olarak kullanabilirsiniz (isteğe bağlı).
* Wallarm düğümü trafiği engelleme modunda işler.

## Çözüm mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarm proxy ileri çözümünün örnek bileşenleri şunlardır:

* Yük dengeleyicisiz Auto Scaling grup ile bağlı hedef grup.
* Trafik analiz eden, kötü niyetli istekleri engelleyip ve meşru istekleri daha ileriye proxy eden Wallarm düğüm örnekleri.

    Örnek, belirtilen davranışı yönlendiren engelleme modunda Wallarm düğümlerini çalıştırır. Wallarm düğümleri kötü niyetli istek engelleme olmaksızın sadece trafik izlemeyi hedefleyen modlar da dahil olmak üzere diğer modlarda da çalışabilir. Wallarm düğüm modları hakkında daha fazla bilgi almak için [dokümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanınız.
* Wallarm düğümleri trafiği `https://httpbin.org`'a yönlendirir.

    Bu örneğin başlatılması sırasında, AWS Sanal Özel Bulut (VPC) içerisinden ulaşılabilir olan herhangi bir diğer hizmet alanı veya trafiği yönlendirmek için path belirtme olanağınız olacaktır.

Listedeki tüm bileşenler (proxylenen sunucu dışında) sağlanan `wallarm` örnek modülü tarafından konuşlandırılır.

## Kod bileşenleri

Bu örnek aşağıdaki kod bileşenlerine sahiptir:

* `main.tf`: Proxy ileri çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması.
* `global_snippet.conf`: `global_snippet` değişkenini kullanarak NGINX global yapılandırmasına eklenecek özel bir NGINX yapılandırma örneği. Monteli yapılandırma `load_module`, `stream`, `mail` veya `env` gibi direktifleri içerebilir.
* `http_snippet.conf`: `http_snippet` değişkenini kullanarak `http` NGINX bağlamına eklenecek özel bir NGINX yapılandırması. Monteli yapılandırma `map` veya `server` gibi direktifleri içerebilir.
* `server_snippet.conf`: `server_snippet` değişkenini kullanarak `server` NGINX bağlamına eklenecek özel NGINX yapılandırması. Monteli yapılandırma `if` NGINX mantığını ve gerekli `location` ayarlarını getirebilir.

    Bu parça yapılandırması sadece 80 portuna uygulanacaktır. Başka bir port açmak için, `http_snippet.warning` 'te ilgili `server` yönergelerini belirtin.

    `server_snippet.conf` dosyasında, ayrıca daha karmaşık bir yapılandırma örneği bulabilirsiniz.
* `post-cloud-init.sh`: Özel bir HTML anasayfasını `/var/www/mysite/index.html` instance dizinine yerleştiren özel bir betik. Betik, Wallarm düğümünün başlatılmasının ardından (bulut başlatma betiği) çalıştırılacaktır.

    `post-cloud-init.sh` dosyasında, örneği AWS S3 içeriğinin instance dizinine yerleştirme komutlarını da bulabilirsiniz. Bu seçeneği kullanıyorsanız, S3 erişim politikasını `extra_policies` değişkeninde belirtmeyi unutmayınız.

## Wallarm AWS proxy çözümünün örneğini çalıştırma

1. [AB Bulutu](https://my.wallarm.com/nodes) veya [ABD Bulutu](https://us1.my.wallarm.com/nodes) 'nda Wallarm Console için kaydolun.
1. Wallarm Console açınız → **Düğümler** ve **Wallarm düğümü** türünde bir düğüm oluşturun.
1. Oluşturulan düğüm tokenini kopyalayın.
1. Örnek kodu içeren repository'yi bilgisayarınıza klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan repository'nin `examples/advanced/variables.tf` dosyasında `default` seçeneklerindeki değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/advanced/main.tf` → `proxy_pass` üzerinde yönlendirdiğiniz sunucu protokolünü ve adresini ayarlayın.

    Varsayılan olarak Wallarm, trafiği `https://httpbin.org`'a yönlendirecektir. Eğer varsayılan değer, ihtiyaçlarınızı karşılarlarsa olduğu gibi bırakın.
1. Aşağıdaki komutları `examples/advanced` dizininden çalıştırarak yığını dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılmış çevreyi kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Referanslar

* [Bir AWS yük dengeleyicisini Auto Scaling grubuna eklemek](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)
* [Halka açık ve özel subnetler olan AWS VPC (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Wallarm dokümantasyonu](https://docs.wallarm.com)