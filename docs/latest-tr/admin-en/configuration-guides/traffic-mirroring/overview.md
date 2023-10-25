# Aynalanmış trafiği filtreleme

Wallarm düğüm dağıtım yaklaşımlarından biri, aynalanmış HTTP trafiği filtresi için asenkron tabanlı bir dağıtımdır. Bu makale, bu dağıtım uygulaması için gereken konfigürasyonu ve bazı örnekleri sizlere anlatır.

Trafik aynalama, orijinal gelen trafiğin paralel olarak birden çok arka uca gönderilmesini sağlar. Wallarm düğümünü ek bir arka uç olarak yüklemek, trafiği aynalama (kopya) filtresini çalıştırmanızı sağlar ve bu, müşteriler üzerinde herhangi bir etkisi olmaz - herhangi bir gelen talep, onların adreslerindeki sunuculara ulaşacaktır.

İşte aynalama seçeneği etkin olan trafik akış diyagramı örneği:

![Ayna şeması](../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

## Yaklaşım kullanım durumları

Aynalanmış trafiği filtrelemek için Wallarm düğümünü yüklemek şunlar için faydalıdır:

* Güvenlik çözümünün uygulamanın performansını etkilemeyeceğinden emin olun.
* Wallarm çözümünü, modülü üretim sistemine koymadan önce trafiğin kopyasında eğitin.

## Aynalanmış trafik filtrelemesinin sınırlamaları

Dağıtım yaklaşımının güvenliği ne olursa olsun, bazı sınırlamaları vardır:

* Yalnızca NGINX tabanlı Wallarm düğümleri aynalanmış trafik filtrelemeyi destekler.
* Wallarm düğümü, trafik analizinin fiili trafik akışından bağımsız olarak ilerlemesi nedeniyle kötü amaçlı istekleri anında engellemez.
* Wallarm, düğümün yalnızca gelen taleplerin kopyalarına sahip olması ve sunucu yanıtlarının aynalanamaması nedeniyle uygulama ve API [saldırı noktalarını](../../../about-wallarm/detecting-vulnerabilities.md) tespit etmez.
* Çözüm, trafik aynalamayı sağlayan web sunucusu veya benzer bir araç (ör. NGINX, Envoy, Istio, Traefik, özel Kong modülü, vb) gibi ek bir bileşen gerektirir.

## Konfigürasyon

Aynalanmış trafiği filtrelemek için Wallarm'ı uygulamak:

1. Web sunucunuzu, gelen trafiği ek bir arka uca yansıtmak üzere yapılandırın.
1. Wallarm düğümünü ek bir arka uç olarak [kurun](../../../installation/supported-deployment-options.md) ve onu aynalanmış trafiği filtrelemek üzere yapılandırın.

Trafik aynalaması birçok web sunucusu tarafından desteklenir. Aşağıdaki linklerde, en popüler olanlarının **örnek konfigürasyonlarını** bulabilirsiniz:

* [NGINX](nginx-example.md)
* [Traefik](traefik-example.md)
* [Envoy](envoy-example.md)
* [Istio](istio-example.md)