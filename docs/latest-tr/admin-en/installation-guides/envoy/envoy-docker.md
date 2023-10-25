# Docker Tabanlı Envoy Görselini Çalıştırma

Bu talimatlar, [Envoy 1.18.4](https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.18.4) tabanlı Wallarm Docker görüntüsünü çalıştırmak için gerekli adımları anlatmaktadır. Görsel, doğru bir Wallarm düğümü operasyonu için gerekli tüm sistemleri içerir:

* Gömülü Wallarm modülü bulunan Envoy proxy hizmetleri
* Postanalytics için Tarantool modülleri
* Diğer hizmetler ve scriptler

Wallarm modülü, taleplerin proxy'ini gerçekleştirmek için bir Envoy HTTP filtresi olarak tasarlanmıştır.

!!! uyarı "Desteklenen yapılandırma parametreleri"
    NGINX tabanlı filtreleme düğümü yapılandırmasına yönelik çoğu [yönerge][nginx-directives-docs]nın, Envoy tabanlı filtre düğümü yapılandırması için desteklenmediğini lütfen not edin. Sonuç olarak, [hız limiti][rate-limit-docs] yapılandırması bu dağıtım yönteminde mevcut değildir.

    [Envoy tabanlı filtreleme düğümü yapılandırması →][docker-envoy-configuration-docs] için mevcut parametrelerin listesini görün.

## Kullanım senaryoları

--8<-- "../include-tr/waf/installation/docker-images/envoy-based-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/docker-images/envoy-requirements.md"

## Konteynırı çalıştırma seçenekleri

Filtreleme düğümü yapılandırma parametreleri, aşağıdaki yollarla `docker run` komutuna iletebilir:

* **Çevre değişkenlerine**. Bu seçenek, yalnızca temel filtreleme düğümü parametrelerinin yapılandırılmasını sağlar, çoğu [parametre][docker-envoy-configuration-docs] çevre değişkenleri aracılığıyla değiştirilemez.
* **Monte edilen yapılandırma dosyasına**. Bu seçenek, filtreleme düğümünün tüm [parametrelerinin][docker-envoy-configuration-docs] yapılandırılmasını sağlar.

## Konteynırı çevre değişkenlerini ileterek çalıştırın

Konteynırı çalıştırmak için:

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. Düğümle birlikte konteynırı çalıştırmak için:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e ENVOY_BACKEND='example.com' -p 80:80 wallarm/envoy:4.8.0-1
        ```

Aşağıdaki temel filtreleme düğümü ayarları, `-e` seçeneği aracılığıyla konteynıra iletilir:

Çevre değişkeni | Açıklama | Gereklilik
--- | ---- | ----
`WALLARM_API_TOKEN` | Wallarm düğümü veya API tokeni. | Evet
`ENVOY_BACKEND` | Wallarm çözümü ile korunacak kaynağın alan adı veya IP adresi. | Evet
`WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` US Cloud için</li><li>`api.wallarm.com` EU Cloud için</li></ul>Varsayılan: `api.wallarm.com`. | Hayır
`WALLARM_MODE` | Düğüm modu:<ul><li>`block` zararlı istekleri engeller</li><li>`safe_blocking` [gri listeli IP adreslerinden][graylist-docs] çıkan sadece zararlı istekleri engeller</li><li>`monitoring` istekleri analiz eder ama engellemez</li><li>`off` trafik analizini ve işlemeyi devre dışı bırakır</li></ul>Varsayılan: `monitoring`.<br>Filtrasyon modlarının ayrıntılı açıklaması için [tıklayın →][wallarm-mode-docs] | Hayır
`WALLARM_LABELS` | <p>Düğüm 4.6’dan itibaren kullanılabilir. `WALLARM_API_TOKEN` ‘Deploy’ rolündeki [API tokeni][api-tokens-docs] olarak ayarlandığında çalışır. Düğüm örneğinin gruplaması için `group` etiketini ayarlar, örneğin:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...düğüm örneğini `<GROUP>` örneği grubuna yerleştirir (varolan ya da eğer mevcut değilse, oluşturulmuştur).</p> | Evet (API tokenları için)
`TARANTOOL_MEMORY_GB` | Tarantool'a ayrılan [bellek miktarı][allocate-resources-for-wallarm-docs]. Değer, bir tam sayı veya bir ondalık sayı (ondalık ayırıcı biru nokta <code>.</code>) olabilir. Varsayılan: 0.2 gigabyte. | Hayır

Komut aşağıdakileri yapar:

* Konteynır /etc/envoy dizininde minimal Envoy yapılandırması ile `envoy.yaml` dosyasını oluşturur.
* Konteynır /etc/wallarm dizininde Wallarm Cloud'a erişim için filtreleme düğümü kimlik bilgileri ile dosyalar oluşturur:
    * Filtreleme düğümü UUID ve gizli anahtarı ile `node.yaml`
    * Wallarm özel anahtarı ile `private.key`
* `http://ENVOY_BACKEND:80` kaynağını korur.

## Konteynırı envoy.yaml'i monte ederek çalıştırın

Hazırlanan `envoy.yaml` dosyasını `-v` seçeneği aracılığıyla Docker konteynırına monte edebilirsiniz. Dosyanın aşağıdaki ayarları içermesi gerekmektedir:

* [Talimatlarda][docker-envoy-configuration-docs] belirtildiği gibi filtreleme düğümü ayarları
* [Envoy talimatlarında](https://www.envoyproxy.io/docs/envoy/v1.15.0/configuration/overview/overview) belirtildiği gibi Envoy ayarları

Konteynırı çalıştırmak için:

--8<-- "../include-tr/waf/installation/get-api-or-node-token.md"

1. Düğümle birlikte konteynırı çalıştırmak için:

    === "US Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```
    === "EU Cloud"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/envoy.yaml:/etc/envoy/envoy.yaml -p 80:80 wallarm/envoy:4.8.0-1
        ```

    * `-e` seçeneği, aşağıdaki zorunlu çevre değişkenlerini konteynıra ileterek:

    Çevre değişkeni | Açıklama | Gereklilik
    --- | ---- | ----
    `WALLARM_API_TOKEN` | Wallarm düğüm tokeni.<br><div class="admonition info"> <p class="admonition-title">Bir kaç yükleme için tek token kullanımı</p> <p>Seçtiğiniz [platforma][supported-deployments] bakılmaksızın birkaç yüklemede tek bir token kullanabilirsiniz. Bu, Wallarm Konsol Arayüzünde düğüm örneklerinin mantıksal gruplandırılmasına olanak sağlar. Örnek: bir geliştirme ortamına birkaç Wallarm düğümü yerleştirirsiniz, her düğüm belirli bir geliştiriciye ait olan kendi makinesi üzerinde bulunur.</p></div> | Evet
    `WALLARM_API_HOST` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` US Cloud için</li><li>`api.wallarm.com` EU Cloud için</li></ul> Varsayılan: `api.wallarm.com`. | Hayır

    * `-v` seçeneği, `/etc/envoy` konteynır dizinine `envoy.yaml` yapılandırma dosyasıyla dizini monte eder.

Komut aşağıdakileri yapar:

* `/etc/envoy` konteynır dizinine `envoy.yaml` dosyasını monte eder.
* Konteynır /etc/wallarm dizininde Wallarm Cloud'a erişim için filtreleme düğümü kimlik bilgileri ile dosyalar oluşturur:
    * Filtreleme düğümü UUID ve gizli anahtarı ile `node.yaml`
    * Wallarm özel anahtarı ile `private.key`
* Monte edilen yapılandırma dosyasında belirtilen kaynağı korur.

## Log döndürme yapılandırması (isteğe bağlı)

Log dosyasının döndürülmesi önceden yapılandırılmış ve varsayılan olarak etkindir. Gerekirse döndürme ayarlarını ayarlayabilirsiniz. Bu ayarlar konteynırın `/etc/logrotate.d` dizininde bulunmaktadır.

## Wallarm düğüm operasyonunun test edilmesi

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"