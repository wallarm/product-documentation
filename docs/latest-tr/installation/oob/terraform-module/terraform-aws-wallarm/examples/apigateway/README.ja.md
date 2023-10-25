# Wallarm'ı Amazon API Gateway Proxy olarak Konuşlandırmak

Bu örnekte, Wallarm'ı AWS Virtual Private Cloud (VPC) içinde inline proxy olarak konuşlandırma ve [Amazon API Gateway](https://aws.amazon.com/api-gateway/) koruma yöntemleri, [Terraform Modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanılarak gösterilmektedir.

Wallarm'ın proxy çözümü, WAF ve API güvenlik özelliklerine sahip gelişmiş bir HTTP trafik yönlendirici olarak hizmet veren ek bir ağ katmanı sağlar. Amazon API Gateway dahil olmak üzere hemen hemen tüm servis türlerine yönlendirme yapabilir ve bu fonksiyonları kısıtlamaz.

## Ana Özellikler  

* Wallarm, Wallarm özelliklerini kısıtlamadan ve anında tehdit hafifletme olanakını sağlayan senkronizasyon modunda trafiği işler (`preset=proxy`).
* Wallarm çözümü, API Gateway'i bağımsız olarak kontrol edebileceğiniz ek bir ağ katmanı olarak konuşlandırılır.

## Çözüm Mimarisi

![Wallarm Proxy Şeması](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

Belirtildiği gibi Wallarm proxy çözümü aşağıdaki bileşenleri içerir:

* Trafik yönlendirebilen internete açık bir uygulama yük dengeleyiciye Wallarm düğüm örnekleri.
* Trafik analizi yapıp tüm istekleri API gatewaye yönlendiren Wallarm düğüm örnekleri.
    Bu örnekte, Wallarm düğümü belirtilen davranışları işleyen izleme modunda çalışır. Wallarm düğümü, kötü niyetli istekleri engellemeyi ve yalnızca meşru talepleri daha fazla iletmeyi amaçlayan diğer modlarda da çalışabilir. Wallarm düğüm modları hakkında daha fazla bilgi için, [dokümantasyonu](https://docs.wallarm.com/admin-en/configure-wallarm-mode/) kullanın.
* Wallarm düğümünün proxy olarak hizmet verdiği API gateway. API gatewayde şu ayarlar bulunur:
    * `/demo/demo` yolu atanmıştır.
    * Tek bir mock ayarlanmıştır.
    * Bu Terraform modülünün konuşlandırılması sırasında, API gateway için 'bölgesel' veya 'özel' [endpoint türleri](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html) seçebilirsiniz. Bunlar ve aralarındaki geçiş hakkındaki detaylar aşağıdaki gibi sağlanır.
   
   Verilen örneğin normal bir Amazon API Gateway konuşlandırması olduğunu ve faaliyetinin Wallarm düğümü tarafından etkilenmeyeceğini unutmayın.

Listelenen tüm bileşenler, sağlanan `wallarm` örnek modülü ile dağıtılır.

## Kod Bileşenleri

Bu örnekte aşağıdaki kod bileşenleri bulunmaktadır:

* `main.tf`: Proxy çözümü olarak konuşlandırılan `wallarm` modülinin ana yapılandırmasıdır. AWS ALB ve Wallarm örneklerini oluşturan yapılandırma.
* `apigw.tf`: Amazon API gateway oluşturan `/demo/demo` yoluna erişilebilen yapılandırma. Tek bir mock entegrasyonu ayarlanmıştır. Modülün konuşlandırılması sırasında, 'bölgesel' veya 'özel' endpoint tipini de seçebilirsiniz (detaylar için aşağıya bakınız).
* `endpoint.tf`: AWS VPC Endpoint yapılandırmasıdır. Bu, 'private' tipinde API Gateway endpointi içindir.

## "Bölgesel" ve "Özel" API Gateway Endpoint Farkları

`apigw_özel` değişkeni, API Gateway endpoint tipini belirler:

* "Bölgesel" seçeneğinde, Wallarm düğüm örnekleri, herkese açık API Gateway [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) hizmetine istek gönderir.
* "Özel" seçeneğinde, istekler AWS VPC endpointine gönderilir, `execute-api` hizmetine bağlanır. **Üretim konuşlandırmaları için "özel" seçeneği önerilir.**

### API Gateway'ye Erişimi Sınırlamak İçin Diğer Seçenekler

Amazon, "özel" ya da "bölgesel" endpoint tiplerinden bağımsız olarak, aşağıdaki gibi API Gateway'ye erişimi sınırlama olanağı da sunar:

* İki endpoint türünü belirlemek için [kaynak politikaları](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html) kullanımı.
* Endpoint tipi "özel" ise, [kaynak IP](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html) ile erişim yönetimi.
* Endpoint tipi "özel" olup API Gateway'ın tasarım gereği genel halka açık olmaması varsayılıyorsa, [VPC ve/veya Endpoint](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)ler ile erişim yönetimi.

### API Gateway Endpoint Türleri Arasındaki Geçiş

Komponentleri yeniden oluşturmadan API Gateway endpoint türünü değiştirebilirsiniz, ancak aşağıdakileri göz önünde bulundurun:

* Tür "bölgesel"den "özel"e değiştirildiğinde, genel endpoint özel olur ve dolayısıyla genel kaynaklardan erişilemez hale gelir. Bu, `execute-api` endpointi ve etki alanı adı için de geçerlidir.
* Tür "özel"den "bölgesel"e değiştirildiğinde, hedeflenen AWS VPC endpointinizi hemen çıkarır ve API Gateway'iniz kullanılamaz hale gelir.
* Topluluk sürümü NGINX, DNS adı değişikliklerini otomatik olarak tespit edemez, bu nedenle değiştirilen endpoint türü, Wallarm düğüm örneği ile manuel NGINX yeniden başlatmasının ardından yapılmalıdır.
    Örneklerinizi yeniden başlatabilir, yeniden oluşturabilir veya her bir örnekte `nginx -s reload` çalıştırabilirsiniz.

Endpoint türünü "bölgesel"den "özel"e değiştirmek durumunda:

1. AWS VPC Endpoint oluşturun ve `execute-api`'ye bağlanın. `endpoint.tf` yapılandırma dosyasında bir örnek var.
1. API Gateway'e VPC endpoint atamanızı sağlayacak şekilde API Gateway endpoint türünü değiştirin. Bu tamamlandığında, trafik akışı durur.
1. Her bir Wallarm düğüm örneğinde `nginx -s reload` komutunu çalıştırın veya sadece her bir Wallarm düğümünü yeniden oluşturun. Bu tamamlandığında trafik akışı devam eder.
   
Endpoint türünü "özel"den "bölgesel"e değiştirmek önerilmez, ancak eğer yapmak isterseniz:

1. Kendi çalıştırdığınız "özel" moddaki gereksiz endpointleri silin, daha sonra API Gateway endpointini "bölgesel"e geçirin.
1. Her bir Wallarm düğüm örneğinde `nginx -s reload` komutunu çalıştırın veya sadece her bir Wallarm düğümünü yeniden oluşturun. Bu tamamlandığında trafik akışı devam eder.

**Prodüksiyonda, API Gateway'ı "özel" olarak değiştirmeniz önerilir**. Aksi takdirde, Wallarm düğümü ile API Gateway arasındaki trafik genel ağ üzerinden gönderilir ve ek ücretlere neden olabilir.

## Gereklilikler

* Yerel olarak yüklenmiş Terraform 1.0.5 veya üstü ([Buradan indirin](https://learn.hashicorp.com/tutorials/terraform/install-cli))
* Wallarm Konsolundan erişilen **yönetici** rolüne sahip bir hesap ([EU Cloud](https://my.wallarm.com/) ya da [US Cloud](https://us1.my.wallarm.com/))
* Eğer EU Wallarm Bulutunda çalışıyorsanız `https://api.wallarm.com`'a erişim, US Wallarm Bulutunda çalışıyorsanız `https://us1.api.wallarm.com`'a erişim gerekmektedir. Güvenlik duvarlarının erişimi engellemediğinden emin olun.

## API Gateway İçin Wallarm AWS Proxy Çözümü Uygulama Örneği

1. Wallarm Konsoluna [EU Cloud](https://my.wallarm.com/nodes) veya [US Cloud](https://us1.my.wallarm.com/nodes) üzerinden kaydolun.
1. Wallarm Console → **Node** sekmesini açıp, **Wallarm Node** tipinde bir düğüm oluşturun.
1. Oluşturulan düğümü kopyalayın.
1. Örnekteki kodları içeren bir depoyu yerel bilgisayarınıza kopyalayın:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Kopyalanan deposun `examples/apigateway/variables.tf` dosyasında değişkenlerin değerlerini belirleyin ve değişiklikleri kaydedin.
1. `examples/apigateway` dizininden yığını dağıtmak için aşağıdaki komutları çalıştırın:

    ```
    terraform init
    terraform apply
    ```

Açılan ortamı silmek için aşağıdaki komutu kullanın: 

```
terraform destroy
```

## Referanslar

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Policies examples](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)
