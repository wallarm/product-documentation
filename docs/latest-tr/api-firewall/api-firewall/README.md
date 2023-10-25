# Wallarm tarafından Açık Kaynak API Güvenlik Duvarı [![Black Hat Arsenal USA 2022](https://github.com/wallarm/api-firewall/blob/main/images/BHA2022.svg?raw=true)](https://www.blackhat.com/us-22/arsenal/schedule/index.html#open-source-api-firewall-new-features--functionalities-28038)

API Güvenlik Duvarı, [OpenAPI](https://wallarm.github.io/api-firewall/installation-guides/docker-container/) ve [GraphQL](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/) şemalarına göre API isteği ve yanıt doğrulaması sağlayan yüksek performanslı bir proxy'dir. Bulut yerel ortamlardaki REST ve GraphQL API uç noktalarını korumak üzere tasarlanmıştır. API Güvenlik Duvarı, istekler ve yanıtlar için önceden tanımlanmış bir API spesifikasyonuna uyan aramalara izin veren olumlu bir güvenlik modeli kullanarak API sertleştirmesi sağlar, diğer her şeyi reddeder.

API Güvenlik Duvarının **ana özellikleri** şunlardır:

* Kötü amaçlı istekleri engelleyerek REST ve GraphQL API uç noktalarını korur
* Hatalı oluşturulmuş API yanıtlarını engelleyerek API veri ihlallerini durdurur
* Shadow API uç noktalarını keşfeder
* OAuth 2.0 protokol tabanlı kimlik doğrulama için JWT erişim jetonlarını doğrular
* Zarar görmüş API jetonları, anahtarları ve Çerezleri kara listeye alır

Ürün **açık kaynaklıdır**, DockerHub'da mevcuttur ve zaten 1 milyar (!!!) indirme almıştır. Bu projeyi desteklemek için [depoyu](https://hub.docker.com/r/wallarm/api-firewall) yıldızlayabilirsiniz.

## Çalışma modları

Wallarm API Güvenlik Duvarı birkaç çalışma modu sunar:

* [`PROXY`](https://wallarm.github.io/api-firewall/installation-guides/docker-container/): HTTP isteklerini ve yanıtlarını OpenAPI 3.0'a karşı doğrular ve eşleşen istekleri arka uca yönlendirir.
* [`API`](https://wallarm.github.io/api-firewall/installation-guides/api-mode/): OpenAPI 3.0'a karşı bireysel istekleri doğrular ve daha fazla proxy olmaksızın gerçekleştirir.
* [`graphql`](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/): HTTP ve WebSocket isteklerini GraphQL şemasına karşı doğrular ve eşleşen istekleri arka uca yönlendirir.

## Kullanım durumları 

### Engelleme modunda çalıştırma

* Spesifikasyona uymayan kötü amaçlı istekleri engelle
* Data ihlallerini durdurmak ve hassas bilgilerin ifşa olmasını engellemek için hatalı oluşturulmuş API yanıtlarını engelle

### İzleme modunda çalıştırma

* Gölge API'leri ve belgelenmemiş API uç noktalarını keşfet
* Spesifikasyona uymayan hatalı istek ve yanıtları kaydet

## API şeması doğrulama ve olumlu güvenlik modeli

API Güvenlik Duvarını başlatırken, API Güvenlik Duvarı ile korunması gereken uygulamanın REST veya GraphQL API spesifikasyonunu sağlamalısınız. Başlatılan API Güvenlik Duvarı, bir ters proxy olarak çalışacak ve isteklerin ve yanıtların spesifikasyonda tanımlanan şemaya uyup uymadığını doğrulayacaktır.

Şemaya uymayan trafik, [`STDOUT` ve `STDERR` Docker hizmetleri](https://docs.docker.com/config/containers/logging/) kullanılarak kaydedilir veya engellenir (yapılandırılan API Güvenlik Duvarı işletim moduna bağlıdır). REST API üzerindeki kayıt modunda çalışırken, API Güvenlik Duvarı ayrıca, API spesifikasyonunda kapsanmayan ancak isteklere yanıt veren (kod `404` dönen uç noktalar hariç) gölgeli API uç noktalarını da kaydeder.

![API Güvenlik Duvarı şeması](https://github.com/wallarm/api-firewall/blob/main/images/Firewall%20opensource%20-%20vertical.gif?raw=true)

API spesifikasyonu ile trafik gereksinimlerini belirlemenize olanak sağlayarak, API Güvenlik Duvarı olumlu bir güvenlik modeline dayanır.

## Teknik veriler

[API Güvenlik Duvarı](https://www.wallarm.com/what/the-concept-of-a-firewall), yerleşik bir OpenAPI 3.0 veya GraphQL isteği ve yanıt doğrulayıcısı olan bir ters proxy olarak çalışır. Golang'de yazılmıştır ve hızlı bir http proxy olan fasthttp'i kullanır. Proje, aşırı performans ve neredeyse sıfır eklenen gecikme için optimize edilmiştir.

## API Güvenlik Duvarını Başlatma

API Güvenlik Duvarını Docker'da indirmek, kurmak ve başlatmak için şu kaynaklara başvurun:

* [REST API rehberi](https://wallarm.github.io/api-firewall/installation-guides/docker-container/)
* [GraphQL API rehberi](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/)

## Demolar

API Güvenlik Duvarını denemek için, API Güvenlik Duvarı ile korunan bir örnek uygulamanın konuşlandığı demo ortamını çalıştırabilirsiniz. İki demo ortamı mevcuttur:

* [Docker Compose ile API Güvenlik Duvarı demosu](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)
* [Kubernetes ile API Güvenlik Duvarı demosu](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)

## API Güvenlik Duvarı ile ilgili Wallarm'ın blog yazıları

* [API Güvenlik Duvarı ile Gölge API'lerin Keşfi](https://lab.wallarm.com/discovering-shadow-apis-with-a-api-firewall/)
* [Wallarm API Güvenlik Duvarı, üretim ortamında NGINX'i geride bırakıyor](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)
* [OSS APIFW ile REST API'lerinin ücretsiz olarak güvence altına alınması](https://lab.wallarm.com/securing-rest-with-free-api-firewall-how-to-guide/)

## Performans

API Güvenlik Duvarı oluştururken, müşterilerimizin mümkün olan en hızlı API'lere sahip olmasını sağlamak için hızı ve verimliliği öncelikli hale getirdik. En son testlerimiz, API Güvenlik Duvarı'nın bir isteği işleme süresinin ortalama 1.339 ms olduğunu ve bu sürenin Nginx'e göre %66 daha hızlı olduğunu gösteriyor:

```
API Güvenlik Duvarı 0.6.2 JSON doğrulaması ile

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1:8282/test/signup

Saniyedeki istekler:    13005.81 [#/sec] (ortalama)
Her bir istek için süre:       15.378 [ms] (ortalama)
Tüm eşzamanlı istekler üzerinden her bir istek için süre:       0.077 [ms] (ortalama)

JSON doğrulaması olmaksızın NGINX 1.18.0

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1/test/signup

Saniyedeki istekler:    7887.76 [#/sec] (ortalama)
Her bir istek için süre:       25.356 [ms] (ortalama)
Tüm eşzamanlı istekler üzerinden her bir istek için süre:       0.127 [ms] (ortalama)
```

Bu performans sonuçları, API Güvenlik Duvarı testi sırasında elde ettiğimiz tek sonuçlar değildir. Diğer sonuçlar ve API Güvenlik Duvarı performansını iyileştirmek için kullanılan yöntemler, bu [Wallarm'ın blog yazısında](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/) açıklanmaktadır.
