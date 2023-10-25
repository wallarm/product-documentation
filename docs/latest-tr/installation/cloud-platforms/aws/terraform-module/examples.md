# Örneklerle Wallarm Terraform Modülünü Deneme

Farklı kullanım biçimlerinin örneklerini [Wallarm Terraform Modülü](https://registry.terraform.io/modules/wallarm/wallarm/aws/) kullanarak hazırladık, böylece üretimden önce deneyebilirsiniz.

Sık kullanılan dağıtım yaklaşımlarını temsil eden 4 örnek bulunmaktadır:

* Proxy çözümü
* Gelişmiş proxy çözümü
* Ayna çözümü

## Proxy çözümü

[Bu örnek](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy), Terraform modülünü kullanarak AWS Virtual Private Cloud (VPC) içinde Wallarm'ı çevrimiçi bir proxy olarak nasıl kullanacağınızı gösterir.

Wallarm proxy çözümü, Next-Gen WAF ve API güvenlik işlevlerini barındıran gelişmiş bir HTTP trafiği yönlendirici olarak hizmet veren ek bir işlevsel ağ katmanı sağlar. Bu, en fonksiyonel ve uygulaması kolay çözüm olduğundan **tavsiye edilen** dağıtım seçeneğidir.

![Proxy şeması](../../../../images/waf-installation/aws/terraform/wallarm-as-proxy.png)

Çözümün temel özellikleri:

* Wallarm, Wallarm yeteneklerini sınırlamayan ve anlık tehdit azaltmayı mümkün kılan senkron modda trafiği işler (`preset=proxy`).
* Wallarm çözümü, diğer katmanlardan bağımsız olarak kontrol edilebilecek bir ağ katmanı olarak ayrı ayrı dağıtılır ve katmanı hemen hemen her ağ yapısı konumuna yerleştirebilirsiniz. Önerilen konum, bir internet yüzlü yük dengeleyici arkasındadır.

[GitHub'da örnek dağıtım kılavuzuna bakın](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)

[Proxy gelişmiş çözümünü](#proxy-advanced-solution) deneyerek çözümün esnekliğini görebilirsiniz.

## Gelişmiş proxy çözümü

[Bu örnek](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced), AWS Virtual Private Cloud (VPC) içinde Wallarm'ı gelişmiş ayarları olan çevrimiçi bir proxy olarak nasıl kullanacağınızı gösterir. Sıklıkla kullanılan gelişmiş yapılandırma seçeneklerinin gösterildiği [basit proxy dağıtımı](#proxy-solution) Gibidir.

Wallarm gelişmiş proxy çözümü (basit bir proxy kadar), Next-Gen WAF ve API güvenlik işlevleriyle birlikte hizmet veren ileri düzey bir HTTP trafiği yönlendirici olarak ek bir işlevsel ağ katmanı sağlar.

[GitHub'da örnek dağıtım kılavuzuna bakın](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)

## Amazon API Gateway için Proxy çözümü

[Bu örnek](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway), Wallarm'ı AWS Virtual Private Cloud (VPC) içinde çevrimiçi bir proxy olarak konuşlandırarak [Amazon API Gateway](https://aws.amazon.com/api-gateway/)'yi nasıl koruyacağınızı gösterir.

Wallarm proxy çözümü, hemen hemen her hizmet türüne istekleri yönlendirebilen ve yeteneklerini sınırlamayan ileri düzey bir HTTP trafiği yönlendirici olarak hizmet veren ek bir işlevsel ağ katmanı sağlar. Bu, Next-Gen WAF ve API güvenlik işlevlerini de içerir.

[GitHub'da örnek dağıtım kılavuzuna bakın](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)

## Ayna çözümü

[Bu örnek](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror), Wallarm Terraform modülünü NGINX, Envoy, Istio ve/veya Traefik'in zaten trafiği aynaladığı tahmin edilen bir Ayrı Bant çözümü olarak analiz eden ayna trafiği olarak nasıl dağıtacağınızı gösterir.

![Ayna şeması](../../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

Çözümün temel özellikleri:

* Wallarm, mevcut trafik akışını etkilemeyen asenkron modda trafiği işler (`preset=mirror`) bu yaklaşımı en güvenli kılar.
* Wallarm çözümü, diğer katmanlardan bağımsız olarak kontrol edilebilecek bir ağ katmanı olarak ayrı ayrı dağıtılır ve katmanı hemen hemen her ağ yapısı konumuna yerleştirebilirsiniz. Önerilen konum, özel ağdadır.

[GitHub'da örnek dağıtım kılavuzuna bakın](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/mirror)