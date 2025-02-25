# AWS Üzerinde Terraform Kullanarak Wallarm Dağıtımı

Wallarm, Terraform uyumlu ortamdan [AWS](https://aws.amazon.com/) üzerinde düğümü dağıtmak için [Terraform modülünü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) sağlar. Bu modülü keşfetmek ve sağlanan dağıtım örneklerini denemek için bu yönergeleri kullanın.

Wallarm Terraform modülünü uygulayarak, iki temel Wallarm dağıtım seçeneğini mümkün kılan çözümü sunduk: **[in-line](../../../inline/overview.md) (bu dağıtım yönteminde proxy anlamına gelir)** ve [**Out‑of‑band (mirror)**](../../../oob/overview.md) güvenlik çözümleri. Dağıtım seçeneği, `preset` Wallarm modül değişkeni ile kolayca kontrol edilir.

## Kullanım Durumları

Desteklenen tüm [Wallarm dağıtım seçenekleri](../../../supported-deployment-options.md) arasında, Terraform modülü şu **kullanım durumlarında** Wallarm dağıtımı için önerilir:

* Mevcut altyapınız AWS üzerinde yer almaktadır.
* Altyapıyı Kod olarak (IaC) uyguluyorsunuz. Wallarm'un Terraform modülü, Wallarm düğümünün AWS üzerinde otomatik yönetim ve tahsis edilmesini sağlayarak verimliliği ve tutarlılığı artırır.

## Gereksinimler

* Yerel olarak yüklü [Terraform 1.0.5 veya daha yüksek](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* ABD veya AB [Cloud](../../../../about-wallarm/overview.md#cloud) ortamında Wallarm Console'da **Administrator** [rolüne](../../../../user-guides/settings/users.md#user-roles) sahip hesaba erişim
* ABD Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` adresine, AB Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` adresine erişim. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları güncellemelerini ve [API spesifikasyonlarını](../../../../api-specification-enforcement/overview.md) indirmek, ayrıca [izin verilen, reddedilen veya gri listelenmiş](../../../../user-guides/ip-lists/overview.md) ülkeler, bölgeler veya veri merkezleri için hassas IP'leri almak üzere aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

Bu konuda, Wallarm'ı dağıtmak için gerekli tüm AWS kaynaklarının, örneğin bir VPC kümesinin oluşturulmasına yönelik talimatlar yer almamaktadır. Detaylar için ilgili [Terraform kılavuzuna](https://learn.hashicorp.com/tutorials/terraform/module-use) bakın.

## Wallarm AWS Terraform Modülü Nasıl Kullanılır?

AWS Terraform modülü kullanarak üretim ortamında Wallarm'ı dağıtmak için:

1. [US Cloud](https://us1.my.wallarm.com/signup) veya [EU Cloud](https://my.wallarm.com/signup) üzerinden Wallarm Console için kayıt olun.
1. Wallarm Console → **Nodes** bölümünü açın ve **Wallarm node** tipinde bir düğüm oluşturun.

    ![Creation of a Wallarm node](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
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

| Değişken  | Açıklama | Tür | Gerekli? |
| --------- | ----------- | --------- | --------- |
| `instance_type` | Wallarm dağıtımı için kullanılacak [Amazon EC2 instance type](https://aws.amazon.com/ec2/instance-types/), örn: `t3.small`. | string | Evet |
| `vpc_id` | Wallarm EC2 instance'ını dağıtmak için kullanılacak [AWS Virtual Private Cloud ID'si](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html). | string | Evet |
| `token` | Wallarm Console UI'dan kopyalanan [Wallarm düğüm token'ı](../../../../user-guides/nodes/nodes.md#creating-a-node).<br><div class="admonition info"> <p class="admonition-title">Bir token'ı birden fazla kurulumda kullanma</p> <p>Seçilen [platform](../../../../installation/supported-deployment-options.md) ne olursa olsun, bir token'ı birden fazla kurulumda kullanabilirsiniz. Bu, Wallarm Console UI'da düğüm örneklerinin mantıksal olarak gruplandırılmasını sağlar. Örnek: bir geliştirme ortamına birkaç Wallarm düğümü dağıtırsınız; her düğüm, belirli bir geliştiriciye ait ayrı bir makinede bulunur.</p></div> | string | Evet |
| **Wallarm'a özgü değişkenler** | | | |
| `host` | [Wallarm API sunucusu](../../../../about-wallarm/overview.md#cloud). Olası değerler:<ul><li>ABD Cloud için `us1.api.wallarm.com`</li><li>AB Cloud için `api.wallarm.com`</li></ul>Varsayılan olarak, `api.wallarm.com`. | string | Hayır |
| `upstream` | Dağıtılacak [Wallarm düğüm versiyonu](../../../../updating-migrating/versioning-policy.md#version-list). Desteklenen minimum sürüm `4.0`'dır.<br><br>Varsayılan olarak, `4.8`. | string | Hayır |
| `preset` | Wallarm dağıtım şeması. Olası değerler:<ul><li>`proxy`</li><li>`mirror`</li></ul>Varsayılan olarak, `proxy`. | string | Hayır |
| `proxy_pass` | Proxy'lenen sunucu protokolü ve adresi. Wallarm düğümü, belirtilen adrese gönderilen istekleri işlemeye alacak ve geçerli olanları başka yere proxy olarak iletecektir. Protokol olarak 'http' veya 'https' belirtilebilir. Adres, alan adı veya IP adresi olarak ve isteğe bağlı olarak bir portla belirtilir. | string | Evet, eğer `preset` değeri `proxy` ise |
| `mode` | [Trafik filtreleme modu](../../../../admin-en/configure-wallarm-mode.md). Olası değerler: `off`, `monitoring`, `safe_blocking`, `block`.<br><br>Varsayılan olarak, `monitoring`. | string | Hayır |
| `libdetection` | Trafik analizi sırasında [libdetection kütüphanesinin kullanılıp kullanılmayacağı](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection).<br><br>Varsayılan olarak, `true`. | bool | Hayır |
| `global_snippet` | NGINX global yapılandırmasına eklenecek özel yapılandırma. Yapılandırma dosyasını Terraform kod dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17) bulabilirsiniz. | string | Hayır |
| `http_snippet` | NGINX'in `http` yapılandırma bloğuna eklenecek özel yapılandırma. Yapılandırma dosyasını Terraform kod dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18) bulabilirsiniz. | string | Hayır |
| `server_snippet` | NGINX'in `server` yapılandırma bloğuna eklenecek özel yapılandırma. Yapılandırma dosyasını Terraform kod dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19) bulabilirsiniz. | string | Hayır |
| `post_script` | [Wallarm düğüm başlatma scripti (`cloud-init.py`)](../../cloud-init.md) çalıştırıldıktan sonra çalıştırılacak özel script. Herhangi bir script içeren dosyayı Terraform kod dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34) bulabilirsiniz. | string | Hayır |
| **AWS dağıtım yapılandırması** | | | |
| `app_name` | Wallarm modülünün oluşturacağı AWS kaynak adları için ön ek.<br><br>Varsayılan olarak, `wallarm`. | string | Hayır |
| `app_name_no_template` | Wallarm modülünün oluşturacağı AWS kaynak adlarında büyük harf, sayı ve özel karakter kullanılacak mı. Eğer `false` ise, kaynak adları yalnızca küçük harflerden oluşacaktır.<br><br>Varsayılan olarak, `false`. | bool | Hayır |
| `lb_subnet_ids` | Bir Application Load Balancer'ın dağıtılacağı [AWS Virtual Private Cloud alt ağ ID'lerinin listesi](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). Önerilen değer, bir internet geçidine yönlendirme olan yönlendirme tablosuna bağlı genel alt ağlardır. | list(string) | Hayır |
| `instance_subnet_ids` | Wallarm EC2 instance'larının dağıtılacağı [AWS Virtual Private Cloud alt ağ ID'lerinin listesi](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). Önerilen değer, yalnızca çıkış bağlantıları için yapılandırılmış özel alt ağlardır. | list(string) | Hayır |
| `lb_enabled` | Bir AWS Application Load Balancer oluşturulup oluşturulmayacağı. `custom_target_group` değişkeninde özel bir hedef grup belirtilmediği sürece, bu değişkende verilen herhangi bir değerle bir hedef grup oluşturulacaktır.<br><br>Varsayılan olarak, `true`. | bool | Hayır |
| `lb_internal` | Bir Application Load Balancer'ın [iç yük dengeleyici](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html) olmasını isteyip istemediğiniz. Varsayılan olarak, bir ALB internet'e açık tiptedir. Bağlantıları asenkron bir yaklaşımla yönetiyorsanız, önerilen değer `true`'dur.<br><br>Varsayılan olarak, `false`. | bool | Hayır |
| `lb_deletion_protection` | Bir [Application Load Balancer'ın yanlışlıkla silinmesini engelleyecek korumanın](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection) etkinleştirilip etkinleştirilmeyeceği. Üretim dağıtımları için önerilen değer `true`'dur.<br><br>Varsayılan olarak, `true`. | bool | Hayır |
| `lb_ssl_enabled` | Bir istemci ile Application Load Balancer arasında [SSL bağlantılarının müzakere edilip edilmeyeceği](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). Eğer `true` ise, `lb_ssl_policy` ve `lb_certificate_arn` değişkenleri gereklidir. Üretim dağıtımları için önerilir.<br><br>Varsayılan olarak, `false`. | bool | Hayır |
| `lb_ssl_policy` | Bir Application Load Balancer için [güvenlik politikası](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). | string | Evet, eğer `lb_ssl_enabled` `true` ise |
| `lb_certificate_arn` | Bir AWS Certificate Manager (ACM) sertifikasının [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html). | string | Evet, eğer `lb_ssl_enabled` `true` ise |
| `custom_target_group` | Oluşturulan Auto Scaling grubuna [eklenecek mevcut hedef grubunun adı](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html). Varsayılan olarak, yeni bir hedef grup oluşturulup eklenir. Eğer değer varsayılan değilse, AWS ALB oluşturma devre dışı bırakılacaktır. | string | Hayır |
| `inbound_allowed_ip_ranges` | Wallarm instance'larına gelen bağlantılara izin verilmesi için kaynak IP'lerin ve ağların listesi. Unutmayın ki AWS, genel alt ağlardan kaynaklansa bile, yük dengeleyici trafiğini maskeleyebilir.<br><br>Varsayılan olarak:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | Hayır |
| `outbound_allowed_ip_ranges` | Wallarm instance'larının giden bağlantılara izin verilen kaynak IP'lerin ve ağların listesi.<br><br>Varsayılan olarak: `"0.0.0.0/0"`. | list(string) | Hayır |
| `extra_ports` | Wallarm instance'larına gelen bağlantılara izin verilmesi için iç ağdaki ekstra portların listesi. Yapılandırma, bir güvenlik grubuna uygulanacaktır. | list(number) | Hayır |
| `extra_public_ports` | Wallarm instance'larına gelen bağlantılara izin verilmesi için genel ağdaki ekstra portların listesi. | list(number) | Hayır |
| `extra_policies` | Wallarm yığınına ilişkilendirilecek AWS IAM politikaları. Amazon S3'ten veri talep eden scripti çalıştıran `post_script` değişkeni ile birlikte kullanmak yararlı olabilir. | list(string) | Hayır |
| `source_ranges` | AWS Application Load Balancer trafiğine izin verilecek kaynak IP'lerin ve ağların listesi.<br><br>Varsayılan olarak, `"0.0.0.0/0"`. | list(string) | Hayır |
| `https_redirect_code` | HTTP isteğinin HTTPS'ye yönlendirilmesi için kod. Olası değerler:<ul><li>`0` - yönlendirme devre dışı</li><li>`301` - kalıcı yönlendirme</li><li>`302` - geçici yönlendirme</li></ul>Varsayılan olarak, `0`. | number | Hayır |
| `asg_enabled` | Bir [AWS Auto Scaling grubunun](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) oluşturulup oluşturulmayacağı.<br><br>Varsayılan olarak, `true` | bool | Hayır |
| `min_size` | Oluşturulan AWS Auto Scaling grubundaki minimum instance sayısı.<br><br>Varsayılan olarak, `1`. | number | Hayır |
| `max_size` | Oluşturulan AWS Auto Scaling grubundaki maksimum instance sayısı.<br><br>Varsayılan olarak, `3`. | number | Hayır |
| `desired_capacity` | Oluşturulan AWS Auto Scaling grubundaki başlangıç instance sayısı. `min_size`'a eşit veya daha fazla, `max_size`'a eşit veya daha az olmalıdır.<br><br>Varsayılan olarak, `1`. | number | Hayır |
| `autoscaling_enabled` | Wallarm kümesi için [Amazon EC2 Auto Scaling]'i etkinleştirip etkinleştirmeyeceği.<br><br>Varsayılan olarak, `false`. | bool | Hayır |
| `autoscaling_cpu_target` | AWS Auto Scaling grubunda tutulacak ortalama CPU kullanım yüzdesi. Varsayılan olarak, `70.0`. | string | Hayır |
| `ami_id` | Wallarm instance'ının dağıtılmasında kullanılacak [Amazon Machine Image (AMI) ID'si](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html). Varsayılan olarak (boş string), upstream'den en son görüntü kullanılır. Wallarm düğümüne dayalı özel bir AMI oluşturabilirsiniz. | string | Hayır |
| `key_name` | Wallarm instance'larına SSH üzerinden bağlanmak için kullanılacak [AWS key pair]'in adı. Varsayılan olarak, SSH bağlantısı devre dışıdır. | string | Hayır |
| `tags` | Wallarm modülünün oluşturacağı AWS kaynakları için etiketler. | map(string) | Hayır |

## Wallarm Terraform Modülünü Örneklerle Deneme

Wallarm modülünü kullanmanın farklı yollarına dair örnekler hazırladık, böylece üretime dağıtmadan önce deneyebilirsiniz:

* [AWS VPC'de Proxy](proxy-in-aws-vpc.md)
* [Amazon API Gateway için Proxy](proxy-for-aws-api-gateway.md)

## Wallarm ve Terraform Hakkında Daha Fazla Bilgi

Terraform, çok sayıda entegrasyonu (**providers**) ve kullanıma hazır yapılandırmaları (**modules**), birçok satıcı tarafından doldurulan genel [registry](https://www.terraform.io/registry#navigating-the-registry) üzerinden kullanıcılara desteklemektedir.

Wallarm, bu registry'e şunları yayınladı:

* Terraform uyumlu ortamdan düğümü AWS'e dağıtmak için [Wallarm module](https://registry.terraform.io/modules/wallarm/wallarm/aws/). Mevcut makalede anlatılmıştır.
* Terraform üzerinden Wallarm'ı yönetmek için [Wallarm provider](../../../../admin-en/managing/terraform-provider.md).

Bu iki öğe birbirinden bağımsız olup farklı amaçlar için kullanılır, birbirlerine ihtiyaç duymazlar.

## Sınırlamalar
* [Credential stuffing detection](../../../../about-wallarm/credential-stuffing.md) şu anda desteklenmemektedir.