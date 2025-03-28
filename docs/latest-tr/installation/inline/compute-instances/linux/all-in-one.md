[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../../../admin-en/installation-postanalytics-en.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# All-in-One Kurulum Aracılığıyla Dağıtım

Bir **all-in-one installer**, çeşitli ortamlarda Wallarm node'un NGINX için dinamik modül olarak kurulumu sürecini kolaylaştırmak ve standartlaştırmak amacıyla tasarlanmıştır. Bu yükleyici, işletim sisteminizin ve NGINX sürümünüzün tespitini otomatik olarak gerçekleştirir ve tüm gerekli bağımlılıkları kurar.

**all-in-one installer**, aşağıdaki işlemleri otomatik olarak gerçekleştirerek basit bir node kurulum süreci sunar:

1. İşletim sisteminizin ve NGINX sürümünüzün kontrolü.
1. Tespit edilen işletim sistemi ve NGINX sürümü için Wallarm depolarının eklenmesi.
1. Bu depolardan Wallarm paketlerinin kurulması.
1. Kurulan Wallarm modülünün NGINX ile entegrasyonu.
1. Sağlanan token kullanılarak filtering node'un Wallarm Cloud'a bağlanması.

## Kullanım Durumları

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## Adım 1: NGINX ve Bağımlılıkların Kurulumu

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 2: Wallarm Token'ının Hazırlanması

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: All-in-One Wallarm Kurulum Aracının İndirilmesi

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: All-in-One Wallarm Kurulum Aracının Çalıştırılması

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

Sonraki adımlarda verilen komutlar, x86_64 ve ARM64 kurulumu için aynıdır.

## Adım 5: Wallarm Node'un Trafiği Analiz Etmeye Etkinleştirilmesi

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## Adım 6: NGINX'in Yeniden Başlatılması

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Wallarm Node'a Trafik Yönlendirilmesinin Yapılandırılması

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## Adım 8: Wallarm Node İşleyişinin Test Edilmesi

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılan Çözümün İnce Ayarlanması

Varsayılan ayarlarla dinamik Wallarm modülü kurulmuştur. Dağıtım sonrasında filtering node ek konfigürasyon gerektirebilir.

Wallarm ayarları [NGINX direktifleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Direktifler, Wallarm node'un bulunduğu makinede aşağıdaki dosyalara eklenmelidir:

* Sunucu ve konum seviyesindeki ayarlar için: `/etc/nginx/sites-available/default`
* Http seviyesindeki ayarlar için: `/etc/nginx/nginx.conf`
* Wallarm node izleme ayarları için: `/etc/nginx/wallarm-status.conf` – Detaylı açıklama [linkte][wallarm-status-instr] mevcuttur.
* Tarantool'dan istatistik toplayan `collectd` eklentisinin ayarları için: `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf`

Gerekirse uygulayabileceğiniz tipik ayarlardan bazıları şunlardır:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm node'lar için kaynak tahsisi][memory-instr]
* [Wallarm node değişkenlerinin kaydedilmesi (logging)][logging-instr]
* [Filtering node arkasında proxy sunucusunun balancer'ının kullanılması][proxy-balancer-instr]
* Direktif `wallarm_process_time_limit` içerisinde tek istek işleme süresinin sınırlandırılması [ayarı][process-time-limit-instr]
* NGINX direktifi `proxy_read_timeout` içerisinde sunucunun yanıt bekleme süresinin sınırlandırılması (https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* NGINX direktifi `client_max_body_size` içerisinde maksimum istek boyutunun sınırlandırılması (https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* NGINX'de dinamik DNS çözümlemesinin yapılandırılması [ayarı][dynamic-dns-resolution-nginx]

## Başlatma Seçenekleri

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## Kurulumu Baştan Başlatma

Eğer mevcut Wallarm node kurulumu silinip yeniden başlatılacaksa, aşağıdaki adımları izleyin.

!!! warning "Kurulumu Baştan Başlatmanın Etkisi"
    Kurulumu yeniden başlatmak, mevcut Wallarm servislerinin durdurularak silinmesini içerir; bu da yeniden kurulum tamamlanana kadar trafik filtrelemesinin durmasına neden olur. Üretim veya kritik trafik ortamlarında dikkatli olun, çünkü bu durumda trafik filtrelenmemiş olur ve risk altına girer.

    Mevcut bir node'u yükseltmek (örneğin, 4.10'dan 5.0'a) için, [yükseltme talimatlarına](../../../../updating-migrating/all-in-one.md) bakın.

1. Wallarm süreçlerini sonlandırın ve yapılandırma dosyalarını kaldırın:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. [2. adım](#step-2-prepare-wallarm-token)den setup (kurulum) talimatlarını izleyerek yeniden kurulum sürecine devam edin.