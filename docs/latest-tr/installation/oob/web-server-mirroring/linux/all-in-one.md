---
search:
  exclude: true
---

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
[oob-advantages-limitations]:       ../../../oob/overview.md#limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../../../admin-en/installation-postanalytics-en.md
[api-spec-enforcement-docs]:        ../../../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../../../admin-en/uat-checklist-en.md

# Tüm Bir Arada Yükleyici ile Kurulum

Bu talimatlar, Wallarm'ı çeşitli ortamlarda NGINX için dinamik modül olarak kurmak amacıyla süreci basitleştirmek ve standartlaştırmak için tasarlanmış bir **tüm bir arada yükleyici** kullanarak [OOB](../overview.md) dinamik modülü olarak yükleme adımlarını açıklamaktadır. Bu yükleyici, işletim sisteminizin ve NGINX sürümünüzün otomatik olarak tespit edilmesini sağlar ve tüm gerekli bağımlılıkları kurar.

**Tüm bir arada yükleyici**, aşağıdaki işlemleri otomatik olarak gerçekleştiren basit bir node kurulum süreci sunar:

1. İşletim sisteminizi ve NGINX sürümünüzü kontrol eder.
2. Tespit edilen OS ve NGINX sürümü için Wallarm depolarını ekler.
3. Bu depolardan Wallarm paketlerini kurar.
4. Yüklenen Wallarm modülünü NGINX'inize bağlar.
5. Sağlanan tokeni kullanarak filtreleme node'unu Wallarm Cloud'a bağlar.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## Adım 1: NGINX ve Bağımlılıklarını Yükleyin

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 2: Wallarm Tokenini Hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: Tüm Bir Arada Wallarm Yükleyicisini İndirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Tüm Bir Arada Wallarm Yükleyicisini Çalıştırın

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

İlerleyen adımlardaki komutlar, x86_64 ve ARM64 kurulumları için aynıdır.

## Adım 5: Wallarm Node'unu Trafiği Analiz Etmek Üzere Etkinleştirin

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## Adım 6: NGINX'i Yeniden Başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Trafiğin Wallarm Node'a Gönderilmesini Yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## Adım 8: Wallarm Node'unun Çalışmasını Test Edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılan Çözümü İnce Ayarlayın

Dinamik Wallarm modülü, varsayılan ayarlarla yüklenmiştir. Dağıtımdan sonra, filtreleme node'u ek yapılandırmalara ihtiyaç duyabilir.

Wallarm ayarlarını, [NGINX yönergeleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Console UI üzerinden tanımlayabilirsiniz. Yönergeler, Wallarm node'unun bulunduğu makinede aşağıdaki dosyalarda ayarlanmalıdır:

* Sunucu ve konum seviyeleri için: `/etc/nginx/sites-available/default`
* http seviyesi için: `/etc/nginx/nginx.conf`
* Wallarm node izleme ayarları için: `/etc/nginx/wallarm-status.conf` (Detaylı açıklama [linkte](wallarm-status-instr) mevcuttur)
* Tarantool'dan istatistik toplayan `collectd` eklentisi için ayarlar: `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf`

Aşağıda, gerekirse uygulayabileceğiniz tipik ayarlardan bazıları verilmiştir:

* [Wallarm node'ları için kaynak tahsisi][memory-instr]
* [Wallarm node değişkenlerinin kaydedilmesi][logging-instr]
* [Filtreleme node'unun arkasındaki proxy sunucusunun balancer'ının kullanılması][proxy-balancer-instr]
* [`wallarm_process_time_limit` yönergesi içinde tek bir isteğin işlenme süresinin sınırlandırılması][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` içinde sunucu yanıt bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` içinde maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'de dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]

## Başlatma Seçenekleri

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## Kurulumu Baştan Başlatma

Wallarm node kurulumunu silip yeniden başlatmanız gerekirse, aşağıdaki adımları izleyin.

!!! warning "Kurulumu Baştan Başlatmanın Etkisi"
    Kurulumu yeniden başlatmak, çalışan Wallarm servislerinin durdurulmasını ve silinmesini içerir, bu da yeniden yüklenene kadar trafik filtrasyonunun duraklamasına neden olur. Üretim veya kritik trafik ortamlarında dikkatli olun, çünkü bu durum trafiğin filtrelenmemesine ve risk altına girmesine yol açar.

    Mevcut bir node'u yükseltmek için (örneğin, 4.10'dan 5.0'a), [yükseltme talimatlarına](../../../../updating-migrating/all-in-one.md) bakın.

1. Wallarm süreçlerini sonlandırın ve yapılandırma dosyalarını kaldırın:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. [2. adımda](#step-2-prepare-wallarm-token) verilen kurulum talimatlarını izleyerek yeniden yükleme sürecine devam edin.