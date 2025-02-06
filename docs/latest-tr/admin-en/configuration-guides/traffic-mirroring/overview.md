# Aynalanmış Trafiği Filtreleme

Wallarm node dağıtım yaklaşımlarından biri, aynalanmış HTTP trafiği filtrasyonu için asenkron tabanlı dağıtımdır. Bu makale, bu dağıtım uygulaması için gerekli yapılandırmayı anlatır ve bazı örnekler sunar.

Trafik yansıtma, orijinal gelen trafiğin paralel olarak birden fazla backend'e gönderilmesini sağlar. Ek bir backend olarak bir Wallarm node kurulumu, istemcilere hiçbir etkisi olmadan trafik yansı kopyasının filtrelenmesini gerçekleştirmenize olanak tanır – gelen her istek, hedeflendiği sunuculara ulaşır.

Aşağıda, yansıtma seçeneği etkinleştirilmiş trafik akış diyagramının bir örneği verilmiştir:

![Mirror scheme](../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

## Yaklaşım Kullanım Durumları

Aynalanmış trafiği filtrelemek için Wallarm node kurulumu aşağıdaki durumlar için faydalıdır:

* Güvenlik çözümünün uygulamanın performansını etkilemediğinden emin olun.
* Wallarm çözümünü, modül üretim sisteminde çalıştırılmadan önce trafik kopyası üzerinde eğitin.

## Aynalanmış Trafik Filtrasyonunun Sınırlamaları

Dağıtım yaklaşımının güvenli olmasına rağmen, bazı sınırlamaları bulunmaktadır:

* Yalnızca NGINX tabanlı Wallarm node'ları aynalanmış trafik filtrasyonunu destekler.
* Wallarm node, mevcut trafik akışından bağımsız olarak trafik analizi gerçekleştirildiği için zararlı istekleri anında engellemez.
* Wallarm, yalnızca gelen isteklerin kopyalarına sahip olduğu ve sunucu yanıtlarının yansıtılamadığı için uygulama ve API [vulnerabilities](../../../about-wallarm/detecting-vulnerabilities.md) tespit edemez.
* Çözüm, ek bir bileşen gerektirir – trafik yansıtma sağlayan web sunucusu veya benzer bir araç (ör. NGINX, Envoy, Istio, Traefik, custom Kong module, vb).

## Yapılandırma

Aynalanmış trafiği filtrelemek için Wallarm'ı uygulamak amacıyla:

1. Gelen trafiği ek bir backend'e yansıtacak şekilde web sunucunuzu yapılandırın.
1. [Wallarm node'u](../../../installation/supported-deployment-options.md) ek bir backend olarak kurun ve aynalanmış trafiği filtreleyecek şekilde yapılandırın.

Trafik yansıtma, birçok web sunucusu tarafından desteklenmektedir. Aşağıdaki bağlantılarda, en popüler olanları için **örnek yapılandırmaları** bulabilirsiniz:

* [NGINX](nginx-example.md)
* [Traefik](traefik-example.md)
* [Envoy](envoy-example.md)
* [Istio](istio-example.md)