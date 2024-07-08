[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[platform]:                         ../supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# Tüm Bir Arada Yükleyici ile Dağıtım

Bir **tüm bir arada yükleyici** Wallarm düğümünü çeşitli ortamlarda NGINX için bir dinamik modül olarak yüklemenin sürecini basitleştirmek ve standartlaştırmak için tasarlanmıştır. Bu yükleyici işletim sisteminizin ve NGINX sürümlerini otomatik olarak belirler ve gerekli tüm bağımlılıkları yükler.

Wallarm'ın sunduğu bireysel Linux paketlerine kıyasla [NGINX](dynamic-module.md), [NGINX Plus](../nginx-plus.md) ve [dağıtım tarafından sağlanan NGINX](dynamic-module-from-distr.md), **tüm bir arada yükleyici** aşağıdaki işlemleri otomatik olarak gerçekleştirerek süreci basitleştirir:

1. İşletim sisteminizi ve NGINX sürümünüzü kontrol eder.
1. Algılanan işletim sistemi ve NGINX sürümü için Wallarm deposu ekler.
1. Bu depolardan Wallarm paketlerini yükler.
1. Yüklenen Wallarm modülünü NGINX'inize bağlar.
1. Filtreleme düğümünü sağlanan token kullanarak Wallarm Buluta bağlar.

![Tüm bir arada yükleme ile manuel karşılaştırma](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Kullanım durumları

--8<-- "../include-tr/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/all-in-one-requirements.md"

## Adım 1: NGINX ve bağımlılıkları yükleyin

--8<-- "../include-tr/waf/installation/all-in-one-nginx.md"

## Adım 2: Wallarm token'ı hazırlayın

--8<-- "../include-tr/waf/installation/all-in-one-token.md"

## Adım 3: Tüm bir arada Wallarm yükleyicisini indirin

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

## Adım 4: Tüm bir arada Wallarm yükleyicisini çalıştırın

--8<-- "../include-tr/waf/installation/all-in-one-installer-run.md"

Sonraki adımlardaki komutlar aynı zamanda x86_64 ve ARM64 yüklemeleri için de geçerlidir.

## Adım 5: Wallarm düğümünün trafiği analiz etmesini sağlayın

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis-all-in-one.md"

## Adım 6: NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Trafiği Wallarm düğümüne göndermeyi yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline-oob.md"

## Adım 8: Wallarm düğümünün operasyonunu test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılmış çözümü ince ayarlayın

Varsayılan ayarlarla dinamik Wallarm modülü yüklendi. Filtreleme düğümü, dağıtımdan sonra bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları [NGINX yönergeleri](../../admin-en/configure-parameters-en.md) veya Wallarm Konsol UI kullanılarak belirlenir. Yönergeler, Wallarm düğümü olan makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* NGINX ayarları ile `/etc/nginx/nginx.conf` 
* Wallarm düğümü izleme ayarları ile `/etc/nginx/wallarm-status.conf`. Detaylı açıklama [link][wallarm-status-instr] içinde mevcuttur
* Tarantool'dan istatistikleri toplayan `collectd` eklentisi için ayarlarla `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf`

Aşağıda, gerektiğinde uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

* [Filtrasyon modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğümleri için kaynak ayırma][memory-instr]
* [Wallarm düğümü değişkenlerinin kaydedilmesi][logging-instr]
* [Filtreleme düğümünün ardındaki yük dengeleyici veya proxy sunucusunun kullanılması][proxy-balancer-instr]
* [Yönergedeki `wallarm_process_time_limit` tek bir isteğin işlem süresini sınırlama][process-time-limit-instr]
* [NGINX yönerge `proxy_read_timeout` içinde sunucu yanıt bekleme süresini sınırlama](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönerge `client_max_body_size` içinde maksimum istek boyutunu sınırlama](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'de dinamik DNS çözümlemesini yapılandırma][dynamic-dns-resolution-nginx]

## Başlatma seçenekleri

Tüm bir arada scripti indirdiğinizde, yardımı aşağıdaki şekilde alabilirsiniz:

```
sudo sh ./wallarm-4.8.0.x86_64-glibc.sh -- -h
```

Hangi döndürür:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      AÇIKLAMA
-b, --batch                 Toplu mod, etkileşimli olmayan kurulum.
-t, --token TOKEN           Düğüm tokeni, yalnızca toplu modda kullanılır.
-c, --cloud CLOUD           Wallarm Cloud, US/EU olan, varsayılan EU, yalnızca toplu modda kullanılır.
-H, --host HOST             Wallarm API adresi, örneğin, api.wallarm.com veya us1.api.wallarm.com, yalnızca toplu modda kullanılır.
-P, --port PORT             Wallarm API potu, örneğin, 443.
    --no-ssl                Wallarm API erişimi için SSL'i devre dışı bırakır.
    --no-verify             SSL sertifikaları doğrulamasını devre dışı bırakır.
-f, --force                 Aynı isme sahip bir düğüm varsa, yeni bir örnek oluşturur.
-h, --help
    --version
```

Not:

* `--batch` seçeneği **toplu (etkileşimli olmayan) modu** etkinleştirir. Bu modda, ek parametreleri kullanmazsanız, düğüm scriptin hemen ardından yüklenir, kullanıcının ek ek etkileşimleri veya veri girişi gerektirmez. Toplu mod:
 
    * `--token` Gerektirir
    * Varsayılan olarak düğümü AB Buluta yükler
    * Ek seçeneklerle script davranışını değiştirmeye izin verir

* `filtering/postanalytics` değiştirici , postanalytics modülünün [ayrı](../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) bir şekilde kurulmasını sağlar. Eğer değiştirici kullanılmazsa, filtreleme ve postanalytics kısmı birlikte kurulur.