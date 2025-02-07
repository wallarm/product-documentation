# Amazon API Gateway için Wallarm'ı Proxy Olarak Dağıtma

Bu örnek, [Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılarak AWS Virtual Private Cloud (VPC) içine inline proxy olarak dağıtılan Wallarm ile [Amazon API Gateway](https://aws.amazon.com/api-gateway/)’in nasıl korunacağını göstermektedir.

Wallarm proxy çözümü, WAAP ve API güvenlik işlevlerine sahip gelişmiş bir HTTP trafik yönlendiricisi olarak hizmet veren ek bir fonksiyonel ağ katmanı sağlar. Bu çözüm, yeteneklerini sınırlamadan Amazon API Gateway de dahil neredeyse tüm hizmet tiplerine istekleri yönlendirebilir.

## Kullanım Durumları

Desteklenen tüm [Wallarm deployment options](https://docs.wallarm.com/installation/supported-deployment-options) arasında, Terraform module, Wallarm'ın AWS VPC üzerindeki dağıtımı için aşağıdaki **kullanım durumları**’nda önerilir:

* Mevcut altyapınız AWS’de yer almaktadır.
* Altyapıyı Kod olarak (IaC) yönetme uygulamasını kullanıyorsunuz. Wallarm’ın Terraform module, AWS üzerindeki Wallarm node'unun otomatik yönetimi ve sağlanmasını mümkün kılarak verimlilik ve tutarlılığı artırır.

## Gereksinimler

* Terraform 1.0.5 veya daha yüksek [yerel olarak kurulmuş](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* US veya EU [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)’da Wallarm Console’da **Administrator** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip hesaba erişim
* US Wallarm Cloud kullanıyorsanız `https://us1.api.wallarm.com` ya da EU Wallarm Cloud kullanıyorsanız `https://api.wallarm.com` erişimi. Lütfen erişimin herhangi bir güvenlik duvarı tarafından engellenmediğinden emin olun

## Çözüm Mimarisi

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

Örnek Wallarm proxy çözümü aşağıdaki bileşenlere sahiptir:

* İnternete açık Application Load Balancer, trafiği Wallarm node instance’larına yönlendirir.
* Wallarm node instance’ları, trafiği analiz ederek API Gateway’e gelen istekleri proxy’ler.

    Örnek, tanımlanan davranışı sağlayan izleme modunda Wallarm node’larını çalıştırır. Wallarm node’ları, kötü niyetli istekleri engellemek ve yalnızca meşru istekleri iletmek gibi diğer modlarda da çalışabilir. Wallarm node modları hakkında daha fazla bilgi için [belgelere](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) bakınız.
* Wallarm node’larının proxy ettiği istekleri alacak API Gateway. API Gateway aşağıdaki ayarlara sahiptir:

    * `/demo/demo` yolu atanmıştır.
    * Tek bir mock yapılandırılmıştır.
    * Bu Terraform module dağıtımı sırasında API Gateway için "regional" veya "private" [endpoint tiplerinden](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html) birini seçebilirsiniz. Bu tipler ve aralarındaki geçiş hakkında daha fazla bilgi aşağıda sağlanmıştır.

    Lütfen sağlanan örneğin normal bir Amazon API Gateway dağıttığını ve bu nedenle Wallarm node’larından etkilenmeyeceğini unutmayın.

Listeye dahil tüm bileşenler, API Gateway de dahil olmak üzere, sağlanan `wallarm` örnek module tarafından dağıtılacaktır.

## Kod Bileşenleri

Bu örnek aşağıdaki kod bileşenlerine sahiptir:

* `main.tf`: Proxy çözümü olarak dağıtılacak `wallarm` module’unun ana yapılandırması. Yapılandırma, bir AWS ALB ve Wallarm instance’ları oluşturur.
* `apigw.tf`: `/demo/demo` yolu altında erişilebilir olan, tek bir mock entegrasyonu yapılandırılmış Amazon API Gateway’i üreten yapılandırma. Module dağıtımı sırasında ayrıca "regional" veya "private" endpoint tiplerinden birini seçebilirsiniz (ayrıntılar için bkz. aşağıya).
* `endpoint.tf`: API Gateway endpoint’inin "private" tipi için AWS VPC Endpoint yapılandırması.

## "regional" ve "private" API Gateway Endpoint’leri Arasındaki Farklar

`apigw_private` değişkeni API Gateway endpoint tipini ayarlar:

* "regional" seçeneği ile Wallarm node instance’ları, halka açık API Gateway [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) servisine istek gönderir.
* "private" seçeneği ile istekler, `execute-api` servisine bağlı AWS VPC Endpoints üzerinden gönderilir. **Üretim dağıtımları için "private" seçeneği önerilir.**

### API Gateway Erişimini Sınırlamak için Diğer Seçenekler

Amazon, "private" veya "regional" endpoint tipi fark etmeksizin API Gateway’inize erişimi aşağıdaki şekilde sınırlamanıza olanak tanır:

* Belirtilen iki endpoint tipiyle birlikte [resource policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) kullanarak.
* Endpoint tipi "private" ise [kaynak IP’leri](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) kullanılarak erişimi yönetmek.
* Endpoint tipi "private" olup API Gateway’in tasarım gereği kamuya açık ağlardan erişilemez olduğu varsayımıyla [VPC ve/veya Endpoint](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) kullanılarak erişimi yönetmek.

### API Gateway Endpoint Tipleri Arasında Geçiş

Bileşeni yeniden oluşturmadan API Gateway endpoint tipini değiştirebilirsiniz, ancak aşağıdakileri göz önünde bulundurun:

* Tip "regional"den "private"a değiştirildiğinde, halka açık endpoint’ler özel hale gelir ve bu nedenle kamu kaynaklarından erişilemez hale gelir. Bu durum hem `execute-api` endpoint’leri hem de alan adları için geçerlidir.
* Tip "private"den "regional"a değiştirildiğinde, API Gateway’inize yönlendirilmiş AWS VPC Endpoints hemen bağlantısı kesilir ve API Gateway erişilemez hale gelir.
* Community sürümündeki NGINX, DNS adı değişikliklerini otomatik olarak algılayamadığından, değiştirilen endpoint tipini takip eden bir manuel NGINX yeniden başlatması yapılmalıdır.

    Her bir instance’da yeniden başlatabilir, yeniden oluşturabilir veya `nginx -s reload` komutunu çalıştırabilirsiniz.

Eğer endpoint tipini "regional"den "private"a değiştiriyorsanız:

1. AWS VPC Endpoint oluşturun ve bunu `execute-api`’ye ekleyin. Örneğini `endpoint.tf` yapılandırma dosyasında bulacaksınız.
2. API Gateway endpoint tipini değiştirin ve API Gateway yapılandırmasında AWS VPC Endpoint’i belirtin. İşlem tamamlandığında, trafik akışı duracaktır.
3. Her Wallarm node instance’ında `nginx -s reload` çalıştırın veya her Wallarm node’unu yeniden oluşturun. İşlem tamamlandığında, trafik akışı yeniden sağlanacaktır.

Endpoint tipini "private"den "regional"a değiştirmek önerilmemektedir, ancak bunu yapmanız gerekirse:

1. "private" modda çalışmak için gerekli endpoint’i kaldırın, ardından API Gateway endpoint’ini "regional"a geçirin.
2. Her Wallarm node instance’ında `nginx -s reload` çalıştırın veya her Wallarm node’unu yeniden oluşturun. İşlem tamamlandığında, trafik akışı yeniden sağlanacaktır.

**Üretim ortamı için API Gateway’inizi "private"a geçirmeniz önerilir**, aksi halde Wallarm node’larından API Gateway’e giden trafik, kamu ağı üzerinden geçecek ve ek ücrete neden olabilir.

## API Gateway için Örnek Wallarm AWS Proxy Çözümünü Çalıştırma

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinden Wallarm Console için kayıt olun.
2. Wallarm Console’u açın → **Nodes** bölümüne gidin ve **Wallarm node** tipinde bir node oluşturun.
3. Oluşturulan node token’ını kopyalayın.
4. Örnek kodu içeren repository’i makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
5. Klonlanan repository’nin `examples/apigateway/variables.tf` dosyasında yer alan `default` seçeneklerindeki değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
6. `examples/apigateway` dizininden aşağıdaki komutları çalıştırarak stack’i dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılmış ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Kaynaklar

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Policies examples](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)