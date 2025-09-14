# Yansıtılmış trafiğin filtrelenmesi

Wallarm node dağıtım yaklaşımlarından biri, yansıtılmış HTTP trafiğinin filtrelenmesi için asenkron temelli bir dağıtımdır. Bu makale, bu dağıtımın uygulanması için gereken yapılandırma konusunda talimatlar verir ve bazı örnekler sunar.

Trafik yansıtma, gelen özgün trafiğin paralel olarak birden fazla backend'e gönderilmesini sağlar. Wallarm node'u ek bir backend olarak kurmak, trafiğin yansımasını (kopyasını) müşteriler üzerinde hiçbir etki olmadan filtrelemenizi sağlar - gelen tüm istekler yine hedeflendikleri sunuculara ulaşır.

Yansıtma seçeneği etkinleştirilmiş trafik akış diyagramı örneği:

![Yansıtma şeması](../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

## Yaklaşımın kullanım senaryaları

Yansıtılmış trafiği filtrelemek için Wallarm node'unun kurulması şu amaçlar için yararlıdır:

* Güvenlik çözümünün uygulamanın performansını etkilemeyeceğinden emin olmak.
* Modülü üretim sisteminde çalıştırmadan önce Wallarm çözümünü trafik kopyası üzerinde eğitmek.

## Yansıtılmış trafik filtrelemenin sınırlamaları

Bu dağıtım yaklaşımı güvenli olmakla birlikte, bazı sınırlamaları vardır:

* Yalnızca NGINX tabanlı Wallarm node'ları yansıtılmış trafik filtrelemeyi destekler.
* Wallarm node, trafik analizi gerçek trafik akışından bağımsız olarak ilerlediği için kötü amaçlı istekleri anında engellemez.
* Wallarm, düğüm yalnızca gelen isteklerin kopyalarına sahip olduğundan ve sunucu yanıtları yansıtılamadığından uygulama ve API [zafiyetlerini](../../../about-wallarm/detecting-vulnerabilities.md) tespit etmez.
* Çözüm ek bir bileşen gerektirir - trafik yansıtma sağlayan web sunucusu veya benzer bir araç (örn. NGINX, Envoy, Istio, Traefik, özel Kong modülü vb.).

## Yapılandırma

Yansıtılmış trafiği filtrelemek için Wallarm'ı uygulamak:

1. Gelen trafiği ek bir backend'e yansıtacak şekilde web sunucunuzu yapılandırın.
1. Wallarm node'u ek bir backend olarak [kurun](../../../installation/supported-deployment-options.md) ve yansıtılmış trafiği filtreleyecek şekilde yapılandırın.

Trafik yansıtma birçok web sunucusu tarafından desteklenir. Aşağıdaki bağlantılarda, en popülerleri için **örnek yapılandırma**yı bulabilirsiniz:

* [NGINX](nginx-example.md)
* [Traefik](traefik-example.md)
* [Envoy](envoy-example.md)
* [Istio](istio-example.md)