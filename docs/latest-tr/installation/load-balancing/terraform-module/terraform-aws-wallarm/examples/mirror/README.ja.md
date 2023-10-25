# Wallarm OOB NGINX, Envoy ve Benzer Aynaları Terraform Modülü ile Dağıtma

Bu makalede, AWS'ye Wallarm'ı Out-of-Band çözümü olarak dağıtmak için [Wallarm Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılarak bir **örnek** sunulmaktadır. NGINX, Envoy, Istio ve/veya Traefik'in trafik aynalama sağlaması beklenmektedir.

## Ana Özellikler

* Wallarm, trafik akışını `preset=mirror` (peşinci ayna) deseninde asenkron modda işleyebildiği için bu yaklaşım en güvenli olanıdır.
* Wallarm çözümü, diğer katmanlardan bağımsız olarak kontrol edilebilen ayrı bir ağ katmanı olarak dağıtılır ve bu katmanı neredeyse herhangi bir ağ yapı pozisyonuna yerleştirebilirsiniz. Tavsiye edilen konum özel bir ağdır.

## Çözüm Mimarisi

![Wallarm for mirrored traffic](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

Bu örnekteki Wallarm çözümü aşağıdaki bileşenleri içerir:

* Trafik Wallarm düğüm örneklerine yönlendiren İnternet-facing yük dengeleyici. Yük dengeleyicinin zaten dağıtılmış olması beklenir ve `wallarm` modülü bu kaynağı oluşturmaz.
* Web veya proxy sunucularından HTTP taleplerini iç ALB uç noktalarına ve arka uç hizmetlerine aynalayan yük dengeleyiciden trafik sağlar (örneğin: NGINX, Envoy). Trafik aynalaması için kullanılan bileşenin zaten dağıtılmış olması beklenir ve `wallarm` modülü bu kaynağı oluşturmaz.
* İç ALB, aynalanan HTTPS isteklerini kabul eder ve bunları Wallarm düğüm örneklerine iletir.
* Wallarm düğüm örnekleri, iç ALB'den gelen istekleri analiz eder ve kötü niyetli trafik verilerini Wallarm bulutuna gönderir.

    Bu örnekte, Wallarm düğümleri tanımlanan davranışı yönlendiren izleme modunda çalıştırırız. [Mod](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) bir başka değere çevrilirse, düğüm trafik izlemeyi sürdürür, çünkü [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) yaklaşımı saldırı bloklarına izin vermiyor.

Son iki bileşen, sağlanan `wallarm` örneği modülü tarafından dağıtılır.

## Kod Bileşenleri

Bu örnekte aşağıdaki kod bileşenleri bulunmaktadır:

* `main.tf`: Ayna çözümü olarak dağıtılan `wallarm` modülünün ana yapılandırması. Bu yapılandırma iç AWS ALB ve Wallarm örneklerini oluşturur.

## HTTP İstek Aynalama Yapılandırması

Trafik aynalama, birçok web ve proxy sunucunun sağladığı bir özelliktir. [Link](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring), birkaç sunucuda trafik aynalama yapılandırmasının nasıl yapılacağına dair belgeleri sağlar.

## Sınırlamalar

Tanımlanan örneğin çözümü en işlevsel Out-of-Band Wallarm çözümü olsa da, asenkron yaklaşıma özgü bazı sınırlamalar vardır:

* Wallarm düğümü, trafik analizinin gerçek trafik akışından bağımsız olarak gerçekleştiği için kötü niyetli talepleri hemen engellemez.
* Bu çözüm, ek bileşenlere ihtiyaç duyar ve bu, trafik aynalaması veya benzer araçları sunan bir web veya proxy sunucusudur (örneğin: NGINX, Envoy, Istio, Traefik, özel Kong modülü vb.).

## Örnek Wallarm Ayna Çözümünün Çalıştırılması

1. Wallarm konsoluna [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinden kaydolun.
1. Wallarm Console'a gidin → **Nodes**'u açın ve **Wallarm node** tipinde bir düğüm oluşturun.
1. Oluşturulan düğüm tokenini kopyalayın.
1. Makinenize örnek kodu içeren repoyu klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan repo'nun `examples/mirror/variables.tf` dosyasında `default` seçeneğinde değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/mirror` dizininden aşağıdaki komutları çalıştırarak yığını dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan çevreyi kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Kaynaklar

* [AWS VPC ile Kamu ve Özel Alt Ağlar (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)