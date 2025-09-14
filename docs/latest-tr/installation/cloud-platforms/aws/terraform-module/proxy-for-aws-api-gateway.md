# Amazon API Gateway için Proxy olarak Wallarm’ın Dağıtımı

Bu örnek, [Amazon API Gateway](https://aws.amazon.com/api-gateway/)’i, [Terraform modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılarak AWS Virtual Private Cloud (VPC) içine inline proxy olarak dağıtılan Wallarm ile nasıl koruyacağınızı göstermektedir.

Wallarm proxy çözümü, WAAP ve API güvenliği işlevleriyle gelişmiş bir HTTP trafik yönlendiricisi olarak görev yapan ek bir fonksiyonel ağ katmanı sağlar. Yeteneklerini kısıtlamadan Amazon API Gateway dahil neredeyse her hizmet türüne istekleri yönlendirebilir.

!!! info "Güvenlik notu"
    Bu çözüm, AWS güvenlik en iyi uygulamalarını takip edecek şekilde tasarlanmıştır. Dağıtım için AWS root hesabını kullanmaktan kaçınmanızı öneririz. Bunun yerine, yalnızca gerekli izinlere sahip IAM kullanıcılarını veya rollerini kullanın.
    
    Dağıtım süreci, Wallarm bileşenlerini sağlamak ve işletmek için gereken en az erişimi vermeyi amaçlayan en az ayrıcalık ilkesine dayanır.

## Kullanım durumları

Desteklenen [Wallarm dağıtım seçenekleri](https://docs.wallarm.com/installation/supported-deployment-options) arasında, aşağıdaki kullanım durumlarında AWS VPC üzerinde Wallarm dağıtımı için Terraform modülü önerilir:

* Mevcut altyapınız AWS üzerinde çalışıyor.
* Altyapı olarak Kod (IaC) uygulamasını benimsiyorsunuz. Wallarm’ın Terraform modülü, AWS üzerinde Wallarm node’unun otomatik yönetimini ve provizyonunu sağlar; verimliliği ve tutarlılığı artırır.

## Gereksinimler

* Yerel olarak [yüklü](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 veya üzeri
* US veya EU [Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud) içindeki Wallarm Console’da **Administrator** [rolüne](https://docs.wallarm.com/user-guides/settings/users/#user-roles) sahip hesaba erişim
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com`’a, EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com`’a erişim. Lütfen erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* Tercih ettiğiniz herhangi bir AWS bölgesi; Wallarm node dağıtımı için bölgede özel bir kısıtlama yoktur
* Terraform, AWS EC2, Security Groups ve diğer AWS hizmetlerine dair bilgi
* AWS root hesabı asla kaynak dağıtımı için kullanılmamalıdır

    Bu kılavuzda açıklanan dağıtımı gerçekleştirmek için, gerekli en az izinlere sahip özel bir IAM kullanıcısı veya rolü kullanın.
* Geniş izinlerin (örn. `AdministratorAccess`) kullanımından kaçının ve bu modülün çalışması için gereken spesifik eylemleri yalnızca gerekli olduğu kadar atayın

    Bu dağıtımda kullanılan IAM roller ve izinleri en az ayrıcalık ilkesine göre tasarlanmıştır. Yalnızca gerekli AWS kaynaklarını (örn. EC2, ağ, günlükleme) oluşturmak ve yönetmek için gereken izinler verilmelidir.

## Çözüm mimarisi

![Wallarm proxy şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

Örnek Wallarm proxy çözümü aşağıdaki bileşenlerden oluşur:

* Trafiği Wallarm node örneklerine yönlendiren, internete açık bir Application Load Balancer.
* Trafiği analiz eden ve tüm istekleri API Gateway’e proxy eden Wallarm node örnekleri.

    Bu örnek, Wallarm node’larını anlatılan davranışı sağlayan monitoring mode’da çalıştırır. Wallarm node’ları, kötü amaçlı istekleri engellemeye ve yalnızca meşru olanları iletmeye yönelik olanlar dahil, başka modlarda da çalışabilir. Wallarm node modları hakkında daha fazla bilgi için [dokümantasyonumuzu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* Wallarm node’larının istekleri proxy ettiği API Gateway. API Gateway aşağıdaki ayarlara sahiptir:

    * `/demo/demo` yolu atanmıştır.
    * Tek bir mock yapılandırılmıştır.
    * Bu Terraform modülü dağıtımı sırasında, API Gateway için "regional" veya "private" [uç nokta türlerinden](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html) birini seçebilirsiniz. Bu türlere ve aralarındaki geçişe dair daha fazla ayrıntı aşağıda verilmiştir.

    Sağlanan örneğin sıradan bir Amazon API Gateway dağıttığını ve bu nedenle çalışmasının Wallarm node’larından etkilenmeyeceğini lütfen unutmayın.

Listelenen tüm bileşenler, API Gateway dahil, sağlanan `wallarm` örnek modülü tarafından dağıtılacaktır.

## Kod bileşenleri

Bu örnek aşağıdaki kod bileşenlerine sahiptir:

* `main.tf`: proxy çözümü olarak dağıtılacak `wallarm` modülünün ana yapılandırması. Bu yapılandırma bir AWS ALB ve Wallarm örnekleri üretir.
* `apigw.tf`: `/demo/demo` yolundan erişilebilen ve tek bir mock entegrasyonu yapılandırılmış Amazon API Gateway’i üretir. Modül dağıtımı sırasında ayrıca "regional" veya "private" uç nokta türlerinden birini seçebilirsiniz (ayrıntılar aşağıda).
* `endpoint.tf`: API Gateway uç noktasının "private" türü için AWS VPC Endpoint yapılandırması.

## "Regional" ve "private" API Gateway uç noktaları arasındaki fark

API Gateway uç nokta türünü `apigw_private` değişkeni belirler:

* "Regional" seçeneğinde, Wallarm node örnekleri genel erişime açık API Gateway [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) servisine istekleri iletir.
* "Private" seçeneğinde ise `execute-api` servisine bağlı AWS VPC Endpoint’lerine iletir. **Üretim dağıtımı için "private" seçeneği önerilir.**

### API Gateway’e erişimi kısıtlama için ek seçenekler

Amazon ayrıca, uç nokta türü "private" veya "regional" olsun olmasın, API Gateway’e erişimi aşağıdaki şekillerde kısıtlamanıza olanak tanır:

* Her iki uç nokta türüyle de [resource policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) kullanarak.
* Uç nokta türü "private" ise, [kaynak IP’lere göre](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) erişimi yöneterek.
* Uç nokta türü "private" ise, zaten tasarım gereği API Gateway’in genel ağlardan erişilemez olmasını varsaydığından, [VPC ve/veya Endpoint’e göre](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) erişimi yöneterek.

### API Gateway uç nokta türleri arasında geçiş

API Gateway uç nokta türünü bileşeni yeniden oluşturmadan değiştirebilirsiniz, ancak lütfen şunları dikkate alın:

* Tür "regional"dan "private"a değiştirildiğinde, genel uç noktalar özel hale gelir ve genel kaynaklardan erişilemez olur. Bu, hem `execute-api` uç noktaları hem de alan adları için geçerlidir.
* Tür "private"tan "regional"a değiştirildiğinde, API Gateway’inize hedeflenen AWS VPC Endpoint’leri derhal ayrılır ve API Gateway kullanılamaz hale gelir.
* Topluluk sürümündeki NGINX DNS adı değişikliklerini otomatik olarak tespit edemediğinden, değiştirilen uç nokta türünü Wallarm node örneklerinde elle NGINX yeniden başlatması izlemelidir.

    Her bir örneği yeniden başlatabilir, yeniden oluşturabilir veya her örnekte `nginx -s reload` komutunu çalıştırabilirsiniz. 

Uç nokta türünü "regional"dan "private"a değiştiriyorsanız:

1. Bir AWS VPC Endpoint oluşturun ve `execute-api`ye bağlayın. Örneğini `endpoint.tf` yapılandırma dosyasında bulacaksınız.
1. API Gateway uç nokta türünü değiştirin ve API Gateway yapılandırmasında AWS VPC Endpoint’i belirtin. Tamamlandığında trafik akışı duracaktır.
1. Her Wallarm node örneğinde `nginx -s reload` çalıştırın veya her Wallarm node’u yeniden oluşturun. Tamamlandığında trafik akışı geri gelecektir.

Uç nokta türünü "private"tan "regional"a değiştirmek önerilmez, ancak yine de yaparsanız:

1. "Private" modda çalışmak için gerekli endpoint’i kaldırın ve ancak bundan sonra API Gateway uç noktasını "regional"a çevirin.
1. Her Wallarm node örneğinde `nginx -s reload` çalıştırın veya her Wallarm node’u yeniden oluşturun. Tamamlandığında trafik akışı geri gelecektir.

**Üretim için, API Gateway’inizi "private"a değiştirmeniz önerilir**, aksi halde Wallarm node’larından API Gateway’e trafik genel ağ üzerinden geçecek ve ek ücretlere neden olabilir.

## API Gateway için örnek Wallarm AWS proxy çözümünü çalıştırma

1. [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) içinde Wallarm Console’a kaydolun.
1. Wallarm Console → **Nodes**’u açın ve **Wallarm node** türünde node oluşturun.
1. Oluşturulan node token’ını kopyalayın.
1. Örnek kodu içeren depoyu makinenize klonlayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Klonlanan deponun `examples/apigateway/variables.tf` dosyasındaki `default` seçeneklerinde değişken değerlerini ayarlayın ve değişiklikleri kaydedin.
1. `examples/apigateway` dizininden aşağıdaki komutları çalıştırarak yığını dağıtın:

    ```
    terraform init
    terraform apply
    ```

Dağıtılan ortamı kaldırmak için aşağıdaki komutu kullanın:

```
terraform destroy
```

## Referanslar

* [Genel ve özel alt ağlara (NAT) sahip AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private API’ler](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway İlkeleri](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway İlkeleri örnekleri](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Türleri](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)