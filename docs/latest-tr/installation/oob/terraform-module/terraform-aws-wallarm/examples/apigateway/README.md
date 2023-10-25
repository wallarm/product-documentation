# Amazon API Gateway için Wallarm'ın Proxy Olarak Dağıtımı

Bu örnek, Wallarm'ın [Terraform modülünü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanarak AWS Virtual Private Cloud (VPC) üzerine bir inline proxy olarak dağıtılarak [Amazon API Gateway](https://aws.amazon.com/api-gateway/)'i nasıl koruyacağını göstermektedir.

Wallarm proxy çözümü, WAF ve API güvenlik işlevleriyle birlikte gelişmiş bir HTTP trafiği yönlendirici olarak hizmet veren ek bir işlevsel ağ katmanı sağlar. Amazon API Gateway dahil hemen hemen her türlü hizmete sınırlamalar olmaksızın istekleri yönlendirebilir.

## Kullanım Senaryoları

Tüm desteklenen [Wallarm dağıtım seçenekleri](https://docs.wallarm.com/installation/supported-deployment-options) arasında, AWS VPC'deki Wallarm dağıtımı için Terraform modülü şu **kullanım durumları** için önerilir:

* Mevcut altyapınız AWS üzerinde yer alıyor.
* Altyapı bir Kod (IaC) pratiğini kullanıyorsunuz. Wallarm'ın Terraform modülü, Wallarm düğümünün AWS'de otomatik yönetim ve hazırlığını sağlar, verimliliği ve tutarlılığı artırır.

## Gereksinimler

* [Yerel olarak kurulu](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya daha yeni bir sürüm 
* ABD veya AB [Bulutlarındaki](https://docs.wallarm.com/about-wallarm/overview/#cloud) Wallarm Konsolunda **Yönetici** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip bir hesaba erişim
* ABD Wallarm Bulutu ile çalışırken `https://us1.api.wallarm.com` veya AB Wallarm Burutu ile çalışırken, `https://api.wallarm.com` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden lütfen emin olun.

## Çözüm Mimari

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

Örnek Wallarm proxy çözümü aşağıdaki bileşenlere sahiptir:

* Internet üzerinden ulaşılabilen Uygulama Yük Dengeleyicisi, trafiği Wallarm düğüm örneklerine yönlendirir.
* Wallarm düğüm örnekleri, trafiği analiz eder ve tüm istekleri API Gateway'e proxyler.

    Örnek, Wallarm düğümlerini belirtilen davranışı sürdüren izleme modunda çalıştırır. Wallarm düğümleri, yalnızca meşru olanların daha ileriye yönlendirilmesi için tasarlananlar da dahil olmak üzere diğer modlarda da çalışabilir. Wallarm düğüm modları hakkında daha fazla bilgi için, [belgelerimizi](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* API Gateway, Wallarm düğümlerinin istekleri proxylediği yer. API Gateway'in aşağıdaki ayarları vardır:

    * `/demo/demo` yolu atanmıştır.
    * Tek bir mock yapılandırılmıştır.
    * Bu Terraform modülünün dağıtımı sırasında, API Gateway için "bölgesel" veya "özel" [uç nokta tipini](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html) seçebilirsiniz. Bu türler ve aralarında göç hakkında daha fazla ayrıntı aşağıda verilmiştir.

    Lütfen sağlanan örneğin düzenli bir Amazon API Gateway dağıttığını ve bu nedenle işleyişinin Wallarm düğümleri tarafından etkilenmeyeceğini unutmayın.

Tüm listelenen bileşenler, API Gateway dahil olmak üzere sağlanan `wallarm` örnek modülü tarafından dağıtılacak.

## Kod Bileşenleri

Bu örnekte aşağıdaki kod bileşenleri bulunur:

* `main.tf`: Proxy çözümü olarak dağıtılacak `wallarm` modülünün ana konfigürasyonu. Konfigürasyon, bir AWS ALB ve Wallarm örnekleri oluşturur.
* `apigw.tf`: Amazon API Gateway'i oluşturan ve tek bir mock entegrasyonu yapılandırılan `/demo/demo` yolu altında erişilebilir hale getiren konfigürasyon. Modülün dağıtımı sırasında, "bölgesel" veya "özel" uç noktası türünü de seçebilirsiniz (detaylar aşağıda).
* `endpoint.tf`: "Özel" API Gateway uç noktası türü için AWS VPC Uç Noktası konfigürasyonu.

## "Bölgesel" ve "Özel" API Gateway Uç Noktaları Arasındaki Fark

`apigw_private` değişkeni API Gateway uç noktası tipini belirler:

* "Bölgesel" seçeneği ile Wallarm düğüm örnekleri, halka açık olan API Gateway ['execute-api'](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) hizmetine istekleri gönderir.
* "Özel" seçeneği ile - `execute-api` hizmetine bağlı AWS VPC Uç Noktalarına. **Üretim dağıtımı için "özel" seçeneği önerilir.**

### API Gateway'e Erişimi Kısıtlama Seçenekler

Amazon, aşağıdaki gibi "özel" veya "bölgesel" uç nokta türüne bakılmaksızın API Gateway'inize erişimi kısıtlamanıza olanak sağlar:

* Her iki uç nokta türü için belirtilen [kaynak politikaları](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) kullanarak.
* Uç nokta türü "özel" ise [kaynak IP'ler](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) ile erişimi yönetme.
* Uç nokta türü "özel" yani API Gateway'in tasarım tarafından halka açık ağlardan erişilemez olduğu varsayılırsa [VPC ve/veya Uç Nokta](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) ile erişimin yönetilmesi.

### API Gateway Uç Nokta Türleri Arasında Göç

API Gateway uç noktası türünü bileşeni yeniden oluşturmadan değiştirebilirsiniz, ancak aşağıdakileri dikkate alın:

* Türü "bölgesel"den "özel"e değiştirdiğinizde, halka açık uç noktalar özel hale gelir ve bu nedenle halka açık kaynaklardan erişilemez olur. Bu, hem `execute-api` uç noktaları hem de alan adları için geçerlidir.
* Türü "özel"den "bölgesel"e değiştirdiğinizde, API Gateway'inize yönlendirilen AWS VPC Uç Noktaları hemen ayrılır ve API Gateway erişilemez hale gelir.
* Topluluk sürümündeki NGINX, DNS adı değişikliklerini otomatik olarak algılayamaz, bu nedenle değiştirilen uç nokta türü, Wallarm düğüm örneklerinde manuel NGINX yeniden başlatmayı takip etmelidir.

    Düğümleri yeniden başlatabilir, örnekleri yeniden oluşturabilir veya her örnekte `nginx -s reload` komutunu çalıştırabilirsiniz. 

Uç nokta türünü "bölgesel"den "özel"e değiştiriyorsanız:

1. AWS VPC Uç Noktası oluşturun ve onu `execute-api`ye ekleyin. Örneğini `endpoint.tf` konfigürasyon dosyasında bulabilirsiniz.
1. API Gateway uç noktası türünü değiştirin ve API Gateway konfigürasyonunda AWS VPC Uç Noktasını belirtin. Tamamlandığında, trafik akışı duracaktır.
1. Her Wallarm düğüm örneğinde `nginx -s reload` komutunu çalıştırın veya sadece her Wallarm düğümünü yeniden oluşturun. Tamamlandığında, trafik akışı restore edilecektir.

Uç nokta türünü "özel"den "bölgesel"e değiştirmeniz önerilmez ancak eğer yaparsanız:

1. "Özel" modda çalıştırmak için gereken uç noktasını kaldırın ve sadece sonra API Gateway uç noktasını "bölgesel"e değiştirin.
1. Her Wallarm düğüm örneğinde `nginx -s reload` komutunu çalıştırın veya sadece her Wallarm düğümünü yeniden oluşturun. Tamamlandığında, trafik akışı restore edilecektir.

**Üretim için, API Gateway'inizi "özel" olarak değiştirmeniz önerilir**, aksi takdirde Wallarm düğümlerinden API Gateway'e trafik, halka açık ağ üzerinden geçer ve ek ücretlere neden olabilir.

## API Gateway İçin Örnek Wallarm AWS Proxy Çözümünü Çalıştırma

1. [AB Bulutunda](https://my.wallarm.com/nodes) veya [ABD Bulutunda](https://us1.my.wallarm.com/nodes) Wallarm Konsolu için kaydolun.
1. Wallarm Konsolunu açın → **Düğümler** ve **Wallarm düğümü** tipinde bir düğüm oluşturun.
1. Oluşturulan düğüm tokenini kopyalayın.
1. Örnek kodu içeren depoyu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. `default` seçeneklerindeki `examples/apigateway/variables.tf` dosyasında değişken değerlerini belirleyin ve değişiklikleri kaydedin.
1. `examples/apigateway` dizininden aşağıdaki komutları çalıştırarak yığını dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılmış ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Referanslar

* [Halka Açık ve Özel Alt Ağlara Sahip AWS VPC (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Özel API'ler](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Politikaları](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Politika Örnekleri](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Türleri](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)
