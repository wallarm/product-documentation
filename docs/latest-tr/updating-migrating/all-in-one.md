[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[tarantool-status]:                         ../images/tarantool-status.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[sqli-attack-docs]:                         ../attacks-vulns-list.md#sql-injection
[xss-attack-docs]:                          ../attacks-vulns-list.md#crosssite-scripting-xss

# Tüm-Bir-Arada Yükleyici ile Wallarm düğümünü yükseltme

Bu talimatlar, [tüm-bir-arada yükleyici](../installation/nginx/all-in-one.md) kullanılarak yüklenen Wallarm düğümü 4.x'ün sürüm 4.8'e yükseltme adımlarını açıklar.

## Gereklilikler

--8<-- "../include-tr/waf/installation/all-in-one-upgrade-requirements.md"

## Yükseltme prosedürü

Yükseltme işlemi, filtreleme düğümü ve postanalytics modüllerinin nasıl yüklendiğine bağlı olarak değişir:

* [Aynı sunucuda](#filtering-node-and-postanalytics-on-the-same-server): modüller birlikte yükseltilir
* [Farklı sunucularda](#filtering-node-and-postanalytics-on-different-servers): **önce** postanalytics modülü, **sonra** filtreleme modülü yükseltilir

## Filtreleme düğümü ve postanalytics aynı sunucu üzerinde

Aynı sunucuya tüm-bir-arada yükleyici kullanılarak yüklenen filtreleme düğümü ve postanalytics modüllerini bir arada yükseltmek için aşağıdaki prosedürü kullanın.

### Adım 1: Wallarm belirteci hazırla

Düğümü yükseltmek için, [belirteç türlerinden birine](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) ihtiyacınız olacaktır. Bir belirteç hazırlamak için:

=== "API belirteci"

    1. Wallarm Konsolu'nu açın → **Ayarlar** → **API belirteçleri** [ABD Bulutu](https://us1.my.wallarm.com/settings/api-tokens) veya [AB Bulutu](https://my.wallarm.com/settings/api-tokens).
    1. `Dağıtım` kaynak rolüne sahip API belirtecini bulun veya oluşturun.
    1. Bu belirteci kopyalayın.

=== "Düğüm belirteci"

    Yükseltme için, kurulum için kullanılan aynı düğüm belirtecini kullanın:

    1. Wallarm Konsolu'nu açın → **Düğümler** [ABD Bulutu](https://us1.my.wallarm.com/nodes) veya [AB Bulutu](https://my.wallarm.com/nodes).
    1. Mevcut düğüm grubunuzda, düğümün menüsü → **Belirteci Kopyala** kullanarak belirteci kopyalayın.

### Adım 2: Tüm-bir-arada Wallarm yükleyicinin en yeni sürümünü indirin

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

### Adım 3: Tüm-bir-arada Wallarm yükleyicisini çalıştırın

--8<-- "../include-tr/waf/installation/all-in-one-installer-run.md"

### Adım 4: NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/installation/restart-nginx-systemctl.md"

### Adım 5: Wallarm düğüm işlemini test et

Yeni düğüm işlemini test etmek için:

1. Korunan kaynak adresine test [SQLI][sqli-attack-docs] ve [XSS][xss-attack-docs] saldırılarıyla istek gönderin:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

1. Wallarm Konsolu'nu açın → **Olaylar** bölümü [ABD Bulutu](https://us1.my.wallarm.com/search) veya [AB Bulutu](https://my.wallarm.com/search) ve saldırıların listede görüntülendiğinden emin olun.
1. Bulutunuzdaki depolanan veriler (kurallar, IP listeleri) yeni düğüme senkronize edildiğinde, kurallarınızın beklendiği gibi çalıştığından emin olmak için bazı test saldırıları yapın.

## Filtreleme düğümü ve postanalytics farklı sunucularda

!!! warning "Filtreleme düğümü ve postanalytics modüllerini yükseltme adımlarının sırası"
    Filtreleme düğümü ve postanalytics modülleri farklı sunucularda yüklüyse, postanalytics paketlerini filtreleme düğümü paketlerini güncellemeden önce yükseltmek gereklidir.

### Adım 1: Wallarm belirteci hazırla

Düğümü yükseltmek için, [belirteç türlerinden birine](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) ihtiyacınız olacaktır. Bir belirteç hazırlamak için:

=== "API belirteci"

    1. Wallarm Konsolu'nu açın → **Ayarlar** → **API belirteçleri** [ABD Bulutu](https://us1.my.wallarm.com/settings/api-tokens) veya [AB Bulutu](https://my.wallarm.com/settings/api-tokens).
    1. `Dağıtım` kaynak rolüne sahip API belirtecini bulun veya oluşturun.
    1. Bu belirteci kopyalayın.

=== "Düğüm belirteci"

    Yükseltme için, kurulum için kullanılan aynı düğüm belirtecini kullanın:

    1. Wallarm Konsolu'nu açın → **Düğümler** [ABD Bulutu](https://us1.my.wallarm.com/nodes) veya [AB Bulutu](https://my.wallarm.com/nodes).
    1. Mevcut düğüm grubunuzda, düğümün menüsü → **Belirteci Kopyala** kullanarak belirteci kopyalayın.

### Adım 2: Tüm-bir-arada Wallarm yükleyicinin en yeni sürümünü postanalytics makinesine indirin

Bu adım postanalytics makinesinde gerçekleştirilir.

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

### Adım 3: Postanalytics'i yükseltmek için tüm-bir-arada Wallarm yükleyicisini çalıştırın

Bu adım postanalytics makinesinde gerçekleştirilir.

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics.md"

### Adım 4: Tüm-bir-arada Wallarm yükleyicinin en yeni sürümünü filtreleme düğümü makinesine indirin

Bu adım filtreleme düğümü makinesinde gerçekleştirilir.

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

### Adım 5: Filtreleme düğümünü yükseltmek için tüm-bir-arada Wallarm yükleyicisini çalıştırın

Bu adım filtreleme düğümü makinesinde gerçekleştirilir.

Filtreleme düğümünü tüm-bir-arada yükleyici ile ayrı ayrı yükseltmek için, kullanın:

=== "API belirteci"
    ```bash
    # Eğer x86_64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh filtering

    # Eğer ARM64 sürümünü kullanıyorsanız:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh filtering
    ```        

    `WALLARM_LABELS` değişkeni, düğümün ekleneceği grubu belirler (Wallarm Konsolu kullanıcı arayüzünde düğümlerin mantıksal gruplama için kullanılır).

=== "Düğüm belirteci"
    ```bash
    # Eğer x86_64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.8.0.x86_64-glibc.sh filtering

    # Eğer ARM64 sürümünü kullanıyorsanız:
    sudo sh wallarm-4.8.0.aarch64-glibc.sh filtering
    ```

### Adım 6: Filtreleme düğümü ve ayrı postanalytics modüllerinin etkileşimini kontrol edin

--8<-- "../include-tr/waf/installation/all-in-one-postanalytics-check.md"