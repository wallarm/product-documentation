# Terraform kullanarak AWS üzerinde Wallarm'ın Dağıtımı

Wallarm, [Terraform modülünü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) Terraform uyumlu ortamdan [AWS](https://aws.amazon.com/) üzerine düğüm dağıtmak için sağlar. Bu talimatları modülü keşfetmek ve sağlanan dağıtım örneklerini denemek için kullanın.

Wallarm Terraform modülünü uygulayarak, iki çekirdek Wallarm dağıtım seçeneğini sağladık: [**in-line**](../../../inline/overview.md) (bu dağıtım yönteminde proxy) ve [**Out‑of‑band (mirror)**](../../../oob/overview.md) güvenlik çözümleri. Dağıtım seçeneği, `preset` Wallarm modül değişkeni ile kolaylıkla kontrol edilir.

## Kullanım Durumları

Tüm desteklenen [Wallarm dağıtım seçenekleri](../../../supported-deployment-options.md) arasında, Terraform modülü aşağıdaki **kullanım durumlarında** Wallarm'ın dağıtımı için önerilir:

* Mevcut altyapınız AWS üzerinde bulunur.
* İnfrastructure as Code (IaC) pratiğini kullanıyorsunuz. Wallarm'ın Terraform modülü, Wallarm düğümünün AWS üzerinde otomatik yönetimini ve sağlanmasını sağlar, verimliliği ve tutarlılığı artırır.

## Gereksinimler

* Yerel olarak [kurulu](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya daha yüksek
* Wallarm Konsolu'ndaki hesaba **Yönetici** [rolü](../../../../user-guides/settings/users.md#user-roles) ile erişim sağlama, ABD veya AB [Bulutu](../../../../about-wallarm/overview.md#cloud)
* ABD Wallarm Bulutu ile çalışırken `https://us1.api.wallarm.com` veya AB Wallarm Bulutu ile çalışırken `https://api.wallarm.com` erişimi. Lütfen erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun

Bu konu, Wallarm'ı dağıtmak için gereken tüm AWS kaynaklarının oluşturulmasına yönelik talimatları içermez, örneğin bir VPC kümesi. Detaylar için ilgili [Terraform rehberine](https://learn.hashicorp.com/tutorials/terraform/module-use) başvurun.

## Wallarm AWS Terraform Modülü Nasıl Kullanılır?

Wallarm'ı üretim için AWS Terraform modülü kullanarak dağıtmak için:

1. [ABD Bulutu](https://us1.my.wallarm.com/signup) veya [AB Bulutu](https://my.wallarm.com/signup) üzerinde Wallarm Konsolu için kaydolun.
1. Wallarm Konsolu'nu açın → **Nodes** ve **Wallarm node** tipinde bir düğüm oluşturun.

    ![Wallarm düğümünün oluşturulması](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Oluşturulan düğüm tokenini kopyalayın.
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
1. `Wallarm` modül yapılandırmasındaki değişken değerlerini ayarlayın

| Değişken  | Açıklama | Tür | Gerekli mi? |
| --------- | ----------- | --------- | --------- |
| `instance_type` | Wallarm dağıtımı için kullanılacak [Amazon EC2 örneğinin türü](https://aws.amazon.com/ec2/instance-types/), ör. `t3.small`. | string | Evet |
| `vpc_id` | Wallarm EC2 örneğinin dağıtılacağı [AWS Sanal Özel Bulut ID'si](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html). | string | Evet |
| `token` | Wallarm Konsolu UI'dan kopyalanan [Wallarm düğümü tokeni](../../../../user-guides/nodes/nodes.md#creating-a-node).<br><div class="admonition info"> <p class="admonition-title">Birkaç kurulum için tek tokenın kullanılması</p> <p>Seçilen [platforma](../../../../installation/supported-deployment-options.md) bakmaksızın birkaç kurulumda bir token kullanabilirsiniz. Bu, Wallarm Konsolu UI'daki düğüm örneklerinin mantıksal gruplandırılmasına olanak sağlar. Örnek: bir geliştirme ortamına birkaç Wallarm düğümü dağıtıyorsunuz, her düğüm kendi makinasi olan belirli bir geliştiriciye aittir.</p></div> | string | Evet |
| **Wallarm'a Özgü Değişkenler** | | | |
| `host` | [Wallarm API Sunucusu](../../../../about-wallarm/overview.md#cloud). Olanaklı değerler:<ul><li>`us1.api.wallarm.com` US Cloud için</li><li>`api.wallarm.com` EU Cloud için</li></ul>Varsayılan olarak `api.wallarm.com`. | string | Hayır |
`upstream` | Dağıtılacak [Wallarm düğümü versiyonu](../../../../updating-migrating/versioning-policy.md#version-list). Minimum desteklenen versiyon `4.0`.<br><br>Varsayılan olarak `4.8`. | string | Hayır |
| `preset` | Wallarm dağıtım şeması. Olanaklı değerler:<ul><li>`proxy`</li><li>`mirror`</li></ul>Varsayılan olarak `proxy`. | string | Hayır |
| `proxy_pass` | Proxy edilen sunucu protokolü ve adresi. Wallarm düğümü belirtilen adresi istek olarak işler ve meşru kişileri proxy eder. Protokol olarak 'http' veya 'https' belirtilebilir. Adres, bir alan adı veya IP adresi olarak ve isteğe bağlı bir port olarak belirtilebilir. | string | Evet, eğer `preset` `proxy` ise |
| `mode` | [Trafik filtreleme modu](../../../../admin-en/configure-wallarm-mode.md). Olanaklı değerler: `off`, `monitoring`, `safe_blocking`, `block`.<br><br>Varsayılan olarak `monitoring`. | string | Hayır |
|`libdetection` | Trafik analizi sırasında [libdetection kütüphanesinin kullanılması](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection).<br><br>Varsayılan olarak `true`. | bool | Hayır |
|`global_snippet` | NGINX global yapılandırmasına eklenecek özel yapılandırma. Bu yapılandırmayı içeren dosyayı Terraform kodu dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini, [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17) bulabilirsiniz. | string | Hayır |
|`http_snippet` | NGINX 'http' yapılandırma bloku için eklenecek özel yapılandırma. Bu yapılandırmayı içeren dosyayı Terraform kodu dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini, [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18) bulabilirsiniz. | string | Hayır |
|`server_snippet` | NGINX 'server' yapılandırma bloku için eklenecek özel yapılandırma. Bu yapılandırmayı içeren dosyayı Terraform kodu dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini, [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19) bulabilirsiniz. | string | Hayır |
|`post_script` | [Wallarm düğümü başlatma betiği (`cloud-init.py`) ](../../cloud-init.md) sonrasında çalıştırılacak özel script. Herhangi bir script ile dosyayı Terraform kodu dizinine koyabilir ve bu dosyanın yolunu bu değişkende belirtebilirsiniz.<br><br>Değişken yapılandırma örneğini, [proxy gelişmiş çözüm dağıtım örneğinde](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34) bulabilirsiniz. | string | Hayır |
| **AWS Dağıtım Yapılandırması** | | | |
| `app_name` | Wallarm modülü tarafından oluşturulacak AWS kaynağı isimlerini öne koyar.<br><br>Varsayılan olarak `wallarm`. | string | Hayır |
| `app_name_no_template` | Wallarm modülü tarafından oluşturulacak AWS kaynaklarının isimlerinde büyük harflerin, numaraların ve özel karakterlerin kullanılmasını içerir. Eğer `false` is, kaynak isimleri sadece küçük harfler barındırır.<br><br>Varsayılan olarak `false`. | bool | Hayır |
| `lb_subnet_ids` | Application Load Balancer'ı dağıtmak için [AWS Sanal Özel Bulut subnets ID'ler listesi](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). Önerilen değerler, bir internet ağına bir rota ile ilişkilendirilmiş genel altnetlerdir. | list(string) | Hayır |
| `instance_subnet_ids` | Wallarm EC2 örneklerinin dağıtımı için [AWS Sanal Özel Bulut subnetler ID'ler listesi](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). Önerilen değerler, yalnızca egress bağlantıları için yapılandırılmış özel subnetlerdir. | list(string) | Hayır |
| `lb_enabled` | Bir AWS Application Load Balancer'ın oluşturulmasını içerir. Bu değişkene iletilen herhangi bir değerle bir hedef grubu oluşturulacaktır, aksi takdirde özel bir hedef grubu `custom_target_group` değişkeninde belirtilmiştir.<br><br>Varsayılan olarak `true`. | bool | Hayır |
| `lb_internal` | Bir Application Load Balancer'ı bir [internal load balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html) hale getirmeyi içerir. Varsayılan olarak bir ALB internete karşıt türdedir. Bağlantıları işlemek için asenkron yaklaşımı kullanıyorsanız önerilen değer `true`dir.<br><br>Varsayılan olarak `false`. | bool | Hayır |
| `lb_deletion_protection` | Bir [Application Load Balancer’ın kazara silinmesinin engellenmesi için korumayı](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection) etkinleştirir. Üretim dağıtımları için önerilen değer `true`dir.<br><br>Varsayılan olarak `true`. | bool | Hayır |
| `lb_ssl_enabled` | Bir müşteri ve bir Application Load Balancer arasında [SSL bağlantılarını müzakereyi](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) sağlar. Eğer `true` ise, `lb_ssl_policy` ve `lb_certificate_arn` değişkenleri gereklidir. Üretim dağıtımları için önerilir.<br><br>Varsayılan olarak `false`. | bool | Hayır |
| `lb_ssl_policy` | Bir Application Load Balancer için [güvenlik politikası](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies). | string | Evet, eğer `lb_ssl_enabled` `true` ise |
| `lb_certificate_arn` | Bir AWS Sertifikası Yöneticisi (ACM) sertifikasının [Amazon Kaynak Adı (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html). | string | Evet, eğer `lb_ssl_enabled` `true` ise |
| `custom_target_group` | Mevcut hedef grup adı, [oluşturulan Auto Scaling grubuna eklenecek](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html). Varsayılan olarak, yeni bir hedef grubu oluşturulacak ve eklenir. Eğer değer varsayılan olmayan bir değerse, AWS ALB oluşturulması devre dışı bırakılacaktır. | string | Hayır |
| `inbound_allowed_ip_ranges` | Gelen bağlantıların Wallarm örneklerine izin verilecek kaynak IP'leri ve ağları listesi. Yük dengelendiricinin trafiğinin hatta kamusal alt ağlardan kaynaklandığı AWS'nin trafiği maskelediğini aklınızda bulundurun.<br><br>Varsayılan olarak:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | Hayır |
| `outbound_allowed_ip_ranges` | Wallarm örneği çıkış bağlantılarına izin verilecek kaynak IP'leri ve ağları listesi.<br><br>Varsayılan olarak: `"0.0.0.0/0"`. | list(string) | Hayır |
| `extra_ports` | Güvenlik grubuna uygulanacak olan ağ içi ekstra portlara izin verilecek iç ağ bağlantıları listesi. | list(number) | Hayır |
| `extra_public_ports` | Dış ağ bağlantılarına ait ekstra portları içeren liste. | list(number) | Hayır |
| `extra_policies` | Wallarm yığını ile ilişkilendirilecek AWS IAM politikaları. Amazon S3'den veri talep eden betiği çalıştıran `post_script` değişkenniyle beraber kullanmak için yararlı olabilir. | list(string) | Hayır |
| `source_ranges` | AWS Application Load Balancer trafiğine izin verilecek kaynak IP'leri ve ağları listesi.<br><br>Varsayılan olarak, `"0.0.0.0/0"`. | list(string) | Hayır |
| `https_redirect_code` | HTTP isteğinin HTTPS'ye yönlendirilmesi için kod. Olanaklı değerler: <ul><li>`0` - yönlendirme devre dışı bırakıldı</li><li>`301` - kalıcı yönlendirme</li><li>`302` - geçici yönlendirme</li></ul>Varsayılan olarak, `0`. | number | Hayır |
| `asg_enabled` | Bir [AWS Autölçekleme grubu](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html) oluşturmaya izin verir.<br><br>Varsayılan olarak, `true` | bool | Hayır |
| `min_size` | Oluşturulan AWS Autölçekleme grubundaki minimum örnek sayısı.<br><br>Varsayılan olarak, `1`.| number | Hayır |
| `max_size` | Oluşturulan AWS Autölçekleme grubundaki maximum örnek sayısı.<br><br>Varsayılan olarak, `3`.| number | Hayır |
| `desired_capacity` | Oluşturulan AWS Autölçekleme grubündaki başlangıç örnek sayısı. `min_size` değerine eşit veya ondan büyük ve `max_size` değerine eşit olmalı veya ondan küçük olmalıdır.<br><br>Varsayılan olarak, `1`.| number | Hayır |
| `autoscaling_enabled` | Wallarm kümesi için [Amazon EC2 Auto Scaling'i](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) etkinleştirir.<br><br>Varsayılan olarak, `false`. | bool | Hayır |
| `autoscaling_cpu_target` | AWS Auto Scaling grubunu muhafaza etmek için ortalama CPU kullanımı yüzdesi. Varsayılan olarak, `70.0`. | string | Hayır |
| `ami_id` | Wallarm örneği dağıtımı için kullanılacak olan [Amazon Machine Image ID'si](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html). Varsayılan (boş dize), upstream'den en son resim kullanılır. Wallarm düğümüne dayalı özel AMI oluşturmak için hoş geldiniz. | string | Hayır |
| `key_name` | Wallarm örneklerine SSH üzerinden bağlantı kurmak için kullanılacak olan [AWS anahtar çiftinin adı](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html). Varsayılan olarak, SSH bağlantısı devre dışı bırakılmıştır. | string | Hayır |
| `tags` | Wallarm modülü tarafından yaratılacak AWS kaynakları için etiketler.| map(string) | Hayır |

## Örnekler ile Wallarm Terraform Modülünü Deneme

Farklı şekillerde Wallarm modülünü kullanabilirsiniz, böylece bunu üretime dağıtmadan önce deneyebilirsiniz:

* [AWS VPC'de Proxy](proxy-in-aws-vpc.md)
* [Amazon API Gateway için Proxy](proxy-for-aws-api-gateway.md)
* [NGINX, Envoy veya Benzeri Aynalamalar için Out-of-Band (OOB)](oob-for-web-server-mirroring.md)

## Wallarm ve Terraform Hakkında Daha Fazla Bilgi

Terraform, kullanıcılara bir dizi satıcı tarafından oluşturulmuş (populated) halka açık [kayıt defteri](https://www.terraform.io/registry#navigating-the-registry) aracılığıyla kullanılabilir olan bir dizi entegrasyon (**sağlayıcılar**) ve kullanıma hazır yapılandırmalar (**modüller**) destekler.

Bu kayıt defterine Wallarm yayınladı:

* Terraform uyumlu ortamdan AWS'ye düğüm dağıtmak için [Wallarm modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/). Şu andaki makalede tanımlanmıştır.
* [Wallarm sağlayıcısı](../../../../admin-en/managing/terraform-provider.md) Wallarm'ın Terraform üzerinden yönetilmesi için.

Bu ikisi birbirinden bağımsız elementlerdir ve birbirlerini gerektirmez.
