# NGINX, Envoy ve Benzeri Trafik Yansıtması için Wallarm OOB'nin Terraform Modülü Kullanılarak Dağıtımı

Bu makale, [Wallarm Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılarak AWS'ye Out-of-Band çözümü olarak Wallarm'ın nasıl dağıtılacağına ilişkin **örneği** göstermektedir. NGINX, Envoy, Istio ve/veya Traefik'in trafik yansıtması sağladığı varsayılmaktadır.

## Kullanım Senaryoları

Tüm desteklenen [Wallarm dağıtım seçenekleri](https://docs.wallarm.com/installation/supported-deployment-options) arasında, Terraform modülü AWS VPC üzerinde Wallarm dağıtımı için aşağıdaki **kullanım senaryolarında** önerilmektedir:

* Mevcut altyapınız AWS'de yer alıyorsa.
* Kod olarak altyapı (IaC) uygulamasını kullanıyorsanız. Wallarm'ın Terraform modülü, AWS üzerinde Wallarm düğümünün otomatik yönetimi ve sağlanmasını mümkün kılarak verimliliği ve tutarlılığı artırır.

## Gereksinimler

* Yerel olarak [kurulmuş](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya daha üstü
* US veya EU [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud) içindeki Wallarm Console'da **Administrator** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip hesaba erişim
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` erişimi. Lütfen erişimin firewall tarafından engellenmediğinden emin olun

## Çözüm Mimarisi

![Trafik Yansıtılan Wallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

Bu örnek Wallarm çözümünün aşağıdaki bileşenleri bulunmaktadır:

* Wallarm düğüm örneklerine trafiği yönlendiren internete açık yük dengeleyici. Yük dengeleyicinin daha önce dağıtılmış olması beklenmektedir, `wallarm` modülü bu kaynağı oluşturmayacaktır.
* Trafiği bir yük dengeleyiciden alıp dahili ALB uç noktasına ve arka uç hizmetlerine HTTP isteklerini yansıtan herhangi bir web veya proxy sunucusu (örneğin NGINX, Envoy). Trafik yansıtması için kullanılan bileşenin daha önce dağıtılmış olması beklenmektedir, `wallarm` modülü bu kaynağı oluşturmayacaktır.
* Web veya proxy sunucusundan yansıtılan HTTPS isteklerini kabul eden ve bu istekleri Wallarm düğüm örneklerine ileten dahili bir ALB.
* Dahili ALB'den gelen istekleri analiz eden ve kötü niyetli trafik verilerini Wallarm Cloud'a gönderen Wallarm düğümü.

    Örnek, tanımlanan davranışı yöneten izleme modunda Wallarm düğümlerini çalıştırmaktadır. [Modu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) başka bir değere geçirirseniz, düğümler yalnızca trafiği izlemeye devam eder çünkü [OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations) yaklaşımı saldırı engellemeyi mümkün kılmaz.

Son iki bileşen, sağlanan `wallarm` örnek modülü tarafından dağıtılacaktır.

## Kod Bileşenleri

Bu örnekte aşağıdaki kod bileşenleri bulunmaktadır:

* `main.tf`: Aynalama çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması. Yapılandırma, dahili bir AWS ALB ve Wallarm örnekleri oluşturur.

## Örnek Wallarm Aynalama Çözümünü Çalıştırma

Örnek Wallarm aynalama çözümünü çalıştırmak için, önce HTTP istek aynalamasını yapılandırmanız ve ardından çözümü dağıtmanız gerekmektedir.

### 1. HTTP İstek Yansıtmasını Yapılandırma

Trafik yansıtma, birçok web ve proxy sunucusunun sağladığı bir özelliktir. [Bağlantı](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring) bazılarıyla trafik yansıtmasının nasıl yapılandırılacağını anlatan dokümantasyonu sağlamaktadır.

### 2. Örnek Wallarm Aynalama Çözümünü Dağıtma

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinden Wallarm Console'a kaydolun.
1. Wallarm Console → **Nodes** bölümünü açın ve **Wallarm node** tipinde düğüm oluşturun.
1. Üretilen düğüm tokenını kopyalayın.
1. Örnek kodun bulunduğu depoyu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan deponun `examples/mirror/variables.tf` dosyasında `default` seçeneklerinde yer alan değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/mirror` dizininden aşağıdaki komutları çalıştırarak stack'i dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Referanslar

* [NAT kullanılan genel ve özel alt ağlara sahip AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)