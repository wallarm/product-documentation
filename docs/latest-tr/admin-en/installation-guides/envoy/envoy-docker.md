# Docker Envoy‑tabanlı Görüntünün Çalıştırılması

Bu talimatlar, [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4) temel alınarak oluşturulan Wallarm Docker görüntüsünü çalıştırma adımlarını anlatır. Görüntü, doğru Wallarm node çalışması için gerekli tüm sistemleri içerir:

* Wallarm module'lü Envoy proxy hizmetleri
* Postanalytics için Tarantool modülleri
* Diğer hizmetler ve script'ler

Wallarm module, istek yönlendirme için bir Envoy HTTP filtresi olarak tasarlanmıştır.

!!! warning "Desteklenen yapılandırma parametreleri"
    Lütfen unutmayın ki NGINX‑tabanlı filtering node yapılandırması için geçerli olan çoğu [directives][nginx-directives-docs] Envoy‑tabanlı filtering node yapılandırması için desteklenmemektedir. Sonuç olarak, [rate limiting][rate-limit-docs] ve [credential stuffing detection][cred-stuffing-docs] bu dağıtım yöntemiyle kullanılamaz.
    
    [Envoy‑tabanlı filtering node yapılandırması için mevcut parametrelerin →][docker-envoy-configuration-docs] listesini inceleyin.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/docker-images/envoy-based-use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/docker-images/envoy-requirements.md"

## Konteyneri Çalıştırma Seçenekleri

Filtering node yapılandırma parametreleri, `docker run` komutuna aşağıdaki yollarla geçirilebilir:

* **Ortam değişkenleri aracılığıyla**. Bu seçenek yalnızca temel filtering node parametrelerinin yapılandırılmasına olanak sağlar; [parameters][docker-envoy-configuration-docs] listesindeki çoğu parametre ortam değişkenleri aracılığıyla değiştirilemez.
* **Mount edilmiş yapılandırma dosyası aracılığıyla**. Bu seçenek, filtering node [parametrelerinin][docker-envoy-configuration-docs] tamamının yapılandırılmasına olanak tanır.

## Ortam Değişkenleri Kullanarak Konteyneri Çalıştırma

Konteyneri çalıştırmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Node ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

Konteyner, aşağıdaki temel filtering node ayarlarını `-e` seçeneği ile alabilir:

Environment variable | Açıklama | Gereklilik
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm node veya API token. | Evet
`ENVOY_BACKEND` | Wallarm çözümü ile korunacak kaynağın domain veya IP adresi. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için: `us1.api.wallarm.com`</li><li>EU Cloud için: `api.wallarm.com`</li></ul>Varsayılan: `api.wallarm.com`. | Hayır
`WALLARM_MODE` | Node modu:<ul><li>`block` – kötü niyetli istekleri engellemek için</li><li>`safe_blocking` – yalnızca [graylisted IP addresses][graylist-docs] kaynaklı kötü niyetli istekleri engellemek için</li><li>`monitoring` – istekleri analiz eder fakat engellemez</li><li>`off` – trafik analizi ve işleme devre dışı bırakılır</li></ul>Varsayılan: `monitoring`.<br>[Filtrasyon modlarının detaylı açıklaması →][wallarm-mode-docs] | Hayır
`WALLARM_LABELS` | <p>Node 4.6'dan itibaren kullanılabilir. Sadece `WALLARM_API_TOKEN`'in [API token][api-tokens-docs] ile `Deploy` rolünde ayarlanmış olması durumunda çalışır. Node örneklerinin gruplandırılması için `group` etiketini belirler, örneğin:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...node örneğini `<GROUP>` grubuna yerleştirir (varsa mevcut olan, yoksa oluşturulur).</p> | API token'ler için Evet
`TARANTOOL_MEMORY_GB` | Tarantool için ayrılan [bellek miktarı][allocate-resources-for-wallarm-docs]. Değer tamsayı veya ondalık sayı (ondalık ayırıcı olarak nokta <code>.</code> kullanılır). Varsayılan: 0.2 gigabayt. | Hayır

Komut aşağıdaki işlemleri gerçekleştirir:

* Konteynerin `/etc/envoy` dizininde minimum Envoy yapılandırması içeren `envoy.yaml` dosyasını oluşturur.
* Konteynerin `/etc/wallarm` dizininde Wallarm Cloud'a erişim için filtering node kimlik bilgilerini içeren dosyaları oluşturur:
    * Filtering node UUID ve gizli anahtarı içeren `node.yaml`
    * Wallarm private key içeren `private.key`
* `http://ENVOY_BACKEND:80` kaynağını korur.

## envoy.yaml Dosyası Mount Edilerek Konteyneri Çalıştırma

Hazırlanmış `envoy.yaml` dosyasını `-v` seçeneği ile Docker konteynerine mount edebilirsiniz. Dosya aşağıdaki ayarları içermelidir:

* [Talimatlarda][docker-envoy-configuration-docs] tarif edildiği üzere filtering node ayarları
* [Envoy talimatlarında](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview) belirtildiği şekilde Envoy ayarları

Konteyneri çalıştırmak için:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Node ile konteyneri çalıştırın:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * `-e` seçeneği, konteynere aşağıdaki zorunlu ortam değişkenlerini aktarır:

    Environment variable | Açıklama | Gereklilik
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarm node token.<br><div class="admonition info"> <p class="admonition-title">Birden Fazla Kurulumda Tek Token Kullanımı</p> <p>Seçilen [platform][supported-deployments] ne olursa olsun, aynı token'ı birden fazla kurulumda kullanabilirsiniz. Bu, Wallarm Console arayüzünde node örneklerinin mantıksal olarak gruplandırılmasını sağlar. Örnek: Bir geliştirme ortamına birden fazla Wallarm node dağıtırsınız; her node, ilgili bir geliştiriciye ait ayrı bir makinededir.</p></div> | Evet
    `WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>US Cloud için: `us1.api.wallarm.com`</li><li>EU Cloud için: `api.wallarm.com`</li></ul>Varsayılan: `api.wallarm.com`. | Hayır

    * `-v` seçeneği, `envoy.yaml` yapılandırma dosyasını içeren dizini konteynerin `/etc/envoy` dizinine mount eder.

Komut aşağıdaki işlemleri gerçekleştirir:

* `envoy.yaml` dosyasını konteynerin `/etc/envoy` dizinine mount eder.
* Konteynerin `/etc/wallarm` dizininde Wallarm Cloud'a erişim için filtering node kimlik bilgilerini içeren dosyaları oluşturur:
    * Filtering node UUID ve gizli anahtarı içeren `node.yaml`
    * Wallarm private key içeren `private.key`
* Mount edilmiş yapılandırma dosyasında belirtilen kaynağı korur.

## Log Döndürme Yapılandırması (İsteğe Bağlı)

Log dosyası döndürme, önceden yapılandırılmış olup varsayılan olarak etkindir. Gerekirse döndürme ayarlarını değiştirebilirsiniz. Bu ayarlar konteynerin `/etc/logrotate.d` dizininde yer alır.

## Wallarm Node Çalışmasını Test Etme

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"