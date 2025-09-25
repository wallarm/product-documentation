# Terraform kullanarak AWS üzerinde Wallarm dağıtımı

Wallarm, Terraform uyumlu bir ortamdan [AWS](https://aws.amazon.com/)'ye düğüm dağıtımı için [Terraform modülünü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) sağlar. Modülü keşfetmek ve sağlanan dağıtım örneklerini denemek için bu talimatları kullanın.

Wallarm Terraform modülünü uygulayarak, Wallarm Node'un **[in-line](../../../inline/overview.md) (bu dağıtım yönteminde proxy)** dağıtımını sağlayan bir çözüm sunuyoruz. Dağıtım seçeneği, `preset` Wallarm modül değişkeniyle kolayca kontrol edilir.

## Kullanım senaryoları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../../../supported-deployment-options.md) arasında, aşağıdaki kullanım senaryolarında Wallarm dağıtımı için Terraform modülü önerilir:

* Mevcut altyapınız AWS üzerinde bulunuyorsa.
* Infrastructure as Code (IaC) pratiğini benimsiyorsanız. Wallarm'ın Terraform modülü, AWS üzerinde Wallarm düğümünün otomatik yönetimi ve sağlanmasını mümkün kılarak verimlilik ve tutarlılığı artırır.

## Gereksinimler

* Yerel olarak [kurulu](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya üzeri
* US veya EU [Cloud](../../../../about-wallarm/overview.md#cloud) içindeki Wallarm Console'da **Administrator** [rolüne](../../../../user-guides/settings/users.md#user-roles) sahip hesaba erişim
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` adresine erişim. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları ve [API spesifikasyonları](../../../../api-specification-enforcement/overview.md) güncellemelerini indirmek ve [izinli, engelli veya gri listede](../../../../user-guides/ip-lists/overview.md) yer alan ülke, bölge veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

Bu konu, Wallarm'ı dağıtmak için gerekli tüm AWS kaynaklarının (ör. bir VPC kümesi) oluşturulmasına yönelik talimatları içermez. Ayrıntılar için ilgili [Terraform rehberine](https://learn.hashicorp.com/tutorials/terraform/module-use) bakın.

## Wallarm AWS Terraform Modülü nasıl kullanılır?

AWS Terraform modülünü kullanarak üretimde Wallarm'ı dağıtmak için:

1. [US Cloud](https://us1.my.wallarm.com/signup) veya [EU Cloud](https://my.wallarm.com/signup) içinde Wallarm Console'a kaydolun.
1. Wallarm Console → **Nodes** bölümünü açın ve **Wallarm node** türünde bir düğüm oluşturun.

    ![Bir Wallarm düğümünün oluşturulması](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Oluşturulan düğüm token'ını kopyalayın.
1. Terraform yapılandırmanıza `wallarm` modül kodunu ekleyin:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      instance_type = "..."

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."
      token      = "..."

      ...
    }
    ```
1. `wallarm` modül yapılandırmasında değişken değerlerini ayarlayın:

| Değişken  | Açıklama | Tür | Gerekli mi? |
| --------- | ----------- | --------- | --------- |
| `instance_type` | Wallarm dağıtımı için kullanılacak [Amazon EC2 örnek türü](https://aws.amazon.com/ec2/instance-types/), ör.: `t3.small`. | string | Evet
| `vpc_id` | Wallarm EC2 örneğinin dağıtılacağı [AWS Virtual Private Cloud kimliği](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html). | string | Evet
| `token` | Wallarm Console UI'dan kopyalanan [Wallarm düğüm token'ı](../../../../user-guides/nodes/nodes.md#creating-a-node).<br><div class="admonition info"> <p class="admonition-title">Birden fazla kurulum için tek bir token kullanma</p> <p>Seçilen [platformdan](../../../../installation/supported-deployment-options.md) bağımsız olarak tek bir token'ı birden çok kurulumda kullanabilirsiniz. Bu, Wallarm Console UI içinde düğüm örneklerini mantıksal olarak gruplamanıza olanak tanır. Örnek: bir geliştirme ortamına birden çok Wallarm düğümü dağıtırsınız; her düğüm, belirli bir geliştiriciye ait kendi makinesindedir.</p></div> | string | Evet
| **Wallarm'a özgü değişkenler** | | | |
| `host` | [Wallarm API sunucusu](../../../../about-wallarm/overview.md#cloud). Olası değerler:<ul><li>US Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul>Varsayılan olarak `api.wallarm.com`. | string | Hayır
`upstream` | Dağıtılacak [Wallarm düğüm sürümü](../../../../updating-migrating/versioning-policy.md#version-list). Desteklenen en düşük sürüm `4.0`.<br><br>Varsayılan olarak `4.8`. | string | Hayır
| `preset` | Wallarm dağıtım şeması. Olası değerler: `proxy` (varsayılan). | string | Hayır
| `proxy_pass` | Proxy'lenen sunucu protokolü ve adresi. Wallarm düğümü belirtilen adrese gönderilen istekleri işleyip meşru olanları bu adrese proxy'ler. Protokol olarak 'http' veya 'https' belirtilebilir. Adres bir alan adı veya IP adresi ve isteğe bağlı bir port olarak belirtilebilir. | string | Evet, `preset` `proxy` ise
| `mode` | [Trafik filtreleme modu](../../../../admin-en/configure-wallarm-mode.md). Olası değerler: `off`, `monitoring`, `safe_blocking`, `block`.<br><br>Varsayılan olarak `monitoring`. | string | Hayır
|`libdetection` | Trafik analizi sırasında [libdetection kütüphanesinin kullanılıp](../../../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) kullanılmayacağı.<br><br>Varsayılan olarak `true`. | bool | Hayır
|`global_snippet` | NGINX genel yapılandırmasına eklenecek özel yapılandırma. Yapılandırmayı içeren dosyayı Terraform kod dizinine koyup bu değişkende dosya yolunu belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtımı örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17) bulabilirsiniz. | string | Hayır
|`http_snippet` | NGINX'in `http` yapılandırma bloğuna eklenecek özel yapılandırma. Yapılandırmayı içeren dosyayı Terraform kod dizinine koyup bu değişkende dosya yolunu belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtımı örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18) bulabilirsiniz. | string | Hayır
|`server_snippet` | NGINX'in `server` yapılandırma bloğuna eklenecek özel yapılandırma. Yapılandırmayı içeren dosyayı Terraform kod dizinine koyup bu değişkende dosya yolunu belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtımı örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19) bulabilirsiniz. | string | Hayır
|`post_script` | [Wallarm düğümü başlatma betiğinden (`cloud-init.py`)](../../cloud-init.md) sonra çalıştırılacak özel betik. İstediğiniz betiği içeren dosyayı Terraform kod dizinine koyup bu değişkende dosya yolunu belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtımı örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34) bulabilirsiniz. | string | Hayır
| **AWS dağıtım yapılandırması** | | | |
| `app_name` | Wallarm modülünün oluşturacağı AWS kaynak adları için ön ek.<br><br>Varsayılan olarak `wallarm`. | string | Hayır
| `app_name_no_template` | Wallarm modülünün oluşturacağı AWS kaynak adlarında büyük harflerin, sayıların ve özel karakterlerin kullanılıp kullanılmayacağı. `false` ise, kaynak adları yalnızca küçük harfleri içerir.<br><br>Varsayılan olarak `false`. | bool | Hayır
| `lb_subnet_ids` | Application Load Balancer'ın dağıtılacağı [AWS Virtual Private Cloud alt ağ kimliklerinin listesi](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). Önerilen değer, internet ağ geçidine rotası olan bir yönlendirme tablosuyla ilişkilendirilmiş genel alt ağlardır. | list(string) | Hayır
| `instance_subnet_ids` | Wallarm EC2 örneklerinin dağıtılacağı [AWS Virtual Private Cloud alt ağ kimliklerinin listesi](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). Önerilen değer, yalnızca çıkış bağlantılarına göre yapılandırılmış özel alt ağlardır. | list(string) | Hayır
| `lb_enabled` | Bir AWS Application Load Balancer oluşturulup oluşturulmayacağı. `custom_target_group` değişkeninde özel bir hedef grup belirtilmediği sürece bu değişkende verilen herhangi bir değerle bir hedef grup oluşturulacaktır.<br><br>Varsayılan olarak `true`. | bool | Hayır
| `lb_internal` | Bir Application Load Balancer'ın [dahili yük dengeleyici](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html) yapılıp yapılmayacağı. Varsayılan olarak, bir ALB internet-facing türündedir. Bağlantıları eşzamansız yaklaşımla ele alıyorsanız önerilen değer `true`'dur.<br><br>Varsayılan olarak `false`. | bool | Hayır
| `lb_deletion_protection` | [Bir Application Load Balancer'ın yanlışlıkla silinmeye karşı korunmasının](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection) etkinleştirilip etkinleştirilmeyeceği. Üretim dağıtımları için önerilen değer `true`'dur.<br><br>Varsayılan olarak `true`. | bool | Hayır
| `lb_ssl_enabled` | Bir istemci ile Application Load Balancer arasında [SSL bağlantılarının müzakere edilip](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) edilmeyeceği. `true` ise `lb_ssl_policy` ve `lb_certificate_arn` değişkenleri gereklidir. Üretim dağıtımları için önerilir.<br><br>Varsayılan olarak `false`. | bool | Hayır
| `lb_ssl_policy` | [Application Load Balancer için güvenlik politikası](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). | string | `lb_ssl_enabled` `true` ise Evet
| `lb_certificate_arn` | AWS Certificate Manager (ACM) sertifikasının [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) değeri. | string | `lb_ssl_enabled` `true` ise Evet
| `custom_target_group` | [Oluşturulan Auto Scaling grubuna eklenecek](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html) mevcut hedef grubun adı. Varsayılan olarak yeni bir hedef grup oluşturulup eklenir. Değer varsayılan dışındaysa AWS ALB oluşturma devre dışı bırakılır. | string | Hayır
| `inbound_allowed_ip_ranges` | Wallarm örneklerine gelen bağlantılara izin verilecek kaynak IP ve ağların listesi. AWS'nin, trafik genel alt ağlardan başlasa bile yük dengeleyici trafiğinin kaynağını maskelediğini unutmayın.<br><br>Varsayılan olarak:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | Hayır
| `outbound_allowed_ip_ranges` | Wallarm örneklerinden giden bağlantılara izin verilecek kaynak IP ve ağların listesi.<br><br>Varsayılan olarak: `"0.0.0.0/0"`. | list(string) | Hayır
| `extra_ports` | Wallarm örneklerine gelen bağlantılara izin verilecek, dahili ağ için ek portların listesi. Yapılandırma bir güvenlik grubuna uygulanacaktır. | list(number) | Hayır
| `extra_public_ports` | Wallarm örneklerine gelen bağlantılara izin verilecek, genel ağ için ek portların listesi. | list(number) | Hayır
| `extra_policies` | Wallarm yığınıyla ilişkilendirilecek AWS IAM ilkeleri. Amazon S3'ten veri isteyen bir betiği çalıştıran `post_script` değişkeniyle birlikte kullanmak faydalı olabilir. | list(string) | Hayır
| `source_ranges` | Bir AWS Application Load Balancer'dan gelen trafiğe izin verilecek kaynak IP ve ağların listesi.<br><br>Varsayılan olarak `"0.0.0.0/0"`. | list(string) | Hayır
| `https_redirect_code` | HTTP isteklerinin HTTPS'e yönlendirilmesi için kod. Olası değerler: <ul><li>`0` - yönlendirme devre dışı</li><li>`301` - kalıcı yönlendirme</li><li>`302` - geçici yönlendirme</li></ul>Varsayılan olarak `0`. | number | Hayır
| `asg_enabled` | [AWS Auto Scaling grubu](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) oluşturulup oluşturulmayacağı.<br><br>Varsayılan olarak `true` | bool | Hayır
| `min_size` | Oluşturulan AWS Auto Scaling grubundaki minimum örnek sayısı.<br><br>Varsayılan olarak `1`.| number | Hayır
| `max_size` | Oluşturulan AWS Auto Scaling grubundaki maksimum örnek sayısı.<br><br>Varsayılan olarak `3`.| number | Hayır
| `desired_capacity` | Oluşturulan AWS Auto Scaling grubundaki başlangıç örnek sayısı. `min_size` değerine eşit veya ondan büyük ve `max_size` değerine eşit veya ondan küçük olmalıdır.<br><br>Varsayılan olarak `1`.| number | Hayır
| `autoscaling_enabled` | Wallarm kümesi için [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)'in etkinleştirilip etkinleştirilmeyeceği.<br><br>Varsayılan olarak `false`. | bool | Hayır
| `autoscaling_cpu_target` | AWS Auto Scaling grubunun korunacağı ortalama CPU kullanım yüzdesi. Varsayılan olarak `70.0`. | string | Hayır
| `ami_id` | Wallarm örneği dağıtımı için kullanılacak [Amazon Machine Image kimliği](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html). Varsayılan olarak (boş dize), en güncel imaj üst kaynaktan kullanılır. Wallarm düğümüne dayalı özel bir AMI oluşturabilirsiniz. | string | Hayır
| `key_name` | Wallarm örneklerine SSH ile bağlanmak için kullanılacak [AWS anahtar çiftinin adı](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html). Varsayılan olarak SSH bağlantısı devre dışıdır. | string | Hayır
| `tags` | Wallarm modülünün oluşturacağı AWS kaynakları için etiketler.| map(string) | Hayır

## Örneklerle Wallarm Terraform Modülünü denemek

Wallarm modülünü üretime dağıtmadan önce denemeniz için farklı kullanım şekillerine ait örnekler hazırladık:

* [AWS VPC'de Proxy](proxy-in-aws-vpc.md)
* [Amazon API Gateway için Proxy](proxy-for-aws-api-gateway.md)

## Wallarm ve Terraform hakkında daha fazla bilgi

Terraform, birçok sağlayıcı (**provider**) ve kullanıma hazır yapılandırmaya (**module**) sahip olup, çeşitli üreticiler tarafından doldurulan herkese açık [kayıt](https://www.terraform.io/registry#navigating-the-registry) üzerinden kullanıcılara sunulur.

Wallarm bu kayıt defterine şunları yayımladı:

* Terraform uyumlu ortamdan AWS'ye düğüm dağıtımı için [Wallarm modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/). Bu makalede açıklanmıştır.
* Terraform aracılığıyla Wallarm'ı yönetmek için [Wallarm provider](../../../../admin-en/managing/terraform-provider.md).

Bunlar, farklı amaçlar için kullanılan bağımsız öğelerdir; birbirlerini gerektirmezler.

## Sınırlamalar
* [Kimlik bilgisi doldurma (credential stuffing) tespiti](../../../../about-wallarm/credential-stuffing.md) şu anda desteklenmemektedir