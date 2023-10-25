# Terraform Modülü Kullanarak Wallarm OOB'un NGINX, Envoy ve Benzeri Yansıtma İçin Dağıtımı

Bu makale, AWS'ye [Wallarm Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılarak Out-of-Band çözüm olarak Wallarm'ın nasıl dağıtıldığını **örneklendirmektedir**. NGINX, Envoy, Istio ve/veya Traefik'in trafik yansıtma sağladığı beklenmektedir.

## Kullanım durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](https://docs.wallarm.com/installation/supported-deployment-options) arasında, Terraform modülü Wallarm'ın AWS VPC'ye dağıtılması için bu **kullanım durumlarında** önerilmektedir:

* Mevcut altyapınız AWS'de bulunmaktadır.
* Infrastructure as Code (IaC) uygulamasını kullanıyorsunuz. Wallarm'ın Terraform modülü, AWS'deki Wallarm düğümünün otomatik yönetimini ve provizyonunu sağlar, verimliliği ve tutarlılığı artırır.

## Gereksinimler

* [Yerel olarak kurulu](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya daha yüksek sürüm
* Wallarm Konsolunda ABD veya AB [Bulutunda](https://docs.wallarm.com/about-wallarm/overview/#cloud) **Yönetici** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip bir hesaba erişim
* ABD Wallarm Bulutu ile çalışıyorsanız `https://us1.api.wallarm.com` veya AB Wallarm Bulutu ile çalışıyorsanız `https://api.wallarm.com`e erişim. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun

## Çözüm mimarisi

![Wallarm for mirrored traffic](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

Bu örnek Wallarm çözümü aşağıdaki bileşenlere sahiptir:

* İnternet'e açık yük dengeleyici, trafiği Wallarm düğüm örneklerine yönlendirir. Bir yük dengeleyicinin zaten dağıtılmış olduğu beklenmektedir, `wallarm` modülü bu kaynağı oluşturmayacaktır.
* Bir yük dengeleyicisinden trafik sağlayan ve HTTP isteklerini dahili bir ALB uç noktasına ve arka uç hizmetlere yansıtan herhangi bir web veya proxy sunucu (ör. NGINX, Envoy). Trafik yansıtma için kullanılan bileşenin zaten dağıtılmış olduğu beklenir, `wallarm` modülü bu kaynağı oluşturmayacaktır.
* Bir web veya proxy sunucusundan yansıtılan HTTPS isteklerini kabul eden ve bunları Wallarm düğüm örneklerine ileten iç ALB.
* Dahili bir ALB'den gelebilecek istekleri analiz eden ve kötü amaçlı trafik verilerini Wallarm Bulutuna gönderen Wallarm düğümü.

    Örnek, belirtilen davranışa sebep olacak şekilde Wallarm düğümlerini izleme modunda çalıştırır. [Modu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) başka bir değere değiştirirseniz, düğümler sadece trafiği izlemeye devam eder çünkü [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) yaklaşımı saldırı engellemesine izin vermez.

Son iki bileşen sağlanan `wallarm` örnek modülü tarafından dağıtılacaktır.

## Kod bileşenleri

Bu örneğin şu kod bileşenleri vardır:

* `main.tf`: Eşleme çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması. Yapılandırma dahili bir AWS ALB ve Wallarm örneklerini üretir.

## Örnek Wallarm ayna çözümünü çalıştırma

Örnek Wallarm ayna çözümünü çalıştırmak için, HTTP istek yansıtmasını yapılandırmanız ve ardından çözümü dağıtmanız gerekmektedir.

### 1. HTTP istek yansıtmasını yapılandırma

Trafik yansıtma birçok web ve proxy sunucu tarafından sağlanan bir özelliktir. [Link](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring), bunlardan bazıları ile trafik yansıtmasını nasıl yapılandıracağınıza dair belgeleri sağlamaktadır.

### 2. Örnek Wallarm ayna çözümünün dağıtılması

1. [AB Bulutunda](https://my.wallarm.com/nodes) veya [ABD Bulutunda](https://us1.my.wallarm.com/nodes) Wallarm Konsolu için kaydolun.
1. Wallarm Konsolu → **Düğümler**i açın ve **Wallarm düğümü** tipinde bir düğüm oluşturun.
1. Oluşturulan düğüm belirteci kopyalayın.
1. Örnek kodu içeren depoyu bilgisayarınıza klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. `examples/mirror/variables.tf` dosyasındaki `default` seçeneklerinde değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/mirror` dizininden aşağıdaki komutları çalıştırarak yığılı dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Referanslar

* [Halka açık ve özel alt ağı bulunan AWS VPC (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)