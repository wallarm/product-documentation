```markdown
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
[oob-advantages-limitations]:       ../oob/overview.md#limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#configuration-examples-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[download-aio-step]:                #step-3-download-all-in-one-wallarm-installer
[enable-traffic-analysis-step]:     #step-5-enable-wallarm-node-to-analyze-traffic
[restart-nginx-step]:               #step-6-restart-nginx
[separate-postanalytics-installation-aio]:  ../../admin-en/installation-postanalytics-en.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md

# Tüm Bileşenli Kurulum Aracıyla Dağıtım

Bir **tüm bileşenli kurulum aracı**, farklı ortamlarda NGINX için dinamik modül olarak Wallarm node'un kurulumu sürecini standartlaştırmak ve kolaylaştırmak amacıyla tasarlanmıştır. Bu kurulum aracı, işletim sisteminizin ve NGINX sürümünüzün otomatik olarak tespit edilmesini sağlar ve gerekli tüm bağımlılıkları yükler.

**Tüm bileşenli kurulum aracı**, aşağıdaki işlemleri otomatik olarak gerçekleştirerek basit bir node kurulumu süreci sunar:

1. İşletim sisteminizi ve NGINX sürümünüzü kontrol eder.
1. Tespit edilen işletim sistemi ve NGINX sürümü için Wallarm depolarını ekler.
1. Bu depolardan Wallarm paketlerini kurar.
1. Kurulan Wallarm modülünü NGINX'inize bağlar.
1. Sağlanan token yardımıyla filtrasyon nodunu Wallarm Cloud'a bağlar.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## Adım 1: NGINX ve bağımlılıkların kurulumu

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Adım 2: Wallarm tokenini hazırlayın

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: Tüm bileşenli Wallarm kurulum aracını indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Tüm bileşenli Wallarm kurulum aracını çalıştırın

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

İleri adımlardaki komutlar, x86_64 ve ARM64 kurulumu için aynıdır.

## Adım 5: Wallarm node'unu trafiği analiz edecek şekilde etkinleştirin

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-all-in-one.md"

## Adım 6: NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Trafiğin Wallarm node'una gönderilmesini yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## Adım 8: Wallarm node'unun çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılan çözümü ince ayar yapın

Varsayılan ayarlarla dinamik Wallarm modülü kurulmuştur. Dağıtım sonrası filtrasyon node'u ek yapılandırma gerektirebilir.

Wallarm ayarları, [NGINX direktifleri](../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Direktifler, Wallarm node'unun bulunduğu makinedeki aşağıdaki dosyalarda ayarlanmalıdır:

* Sunucu ve konum düzeyindeki ayarlar için `/etc/nginx/sites-available/default`
* http düzeyindeki ayarlar için `/etc/nginx/nginx.conf`
* Wallarm node izleme ayarlarının yapıldığı `/etc/nginx/wallarm-status.conf` dosyası. Ayrıntılı açıklamaya [link][wallarm-status-instr] üzerinden ulaşılabilir.
* Tarantool'dan istatistik toplayan `collectd` eklentisi ayarlarının yapıldığı `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf`

Aşağıda, gerekirse uygulayabileceğiniz tipik ayarlardan bazıları verilmiştir:

* [Filtrasyon modunun yapılandırılması][waf-mode-instr]
* [Wallarm node'ları için kaynak ayrılması][memory-instr]
* [Wallarm node değişkenlerinin loglanması][logging-instr]
* [Filtrasyon node'unun arkasında bulunan proxy sunucusunun load balancer'ının kullanılması][proxy-balancer-instr]
* [`wallarm_process_time_limit` direktifinde tek isteğin işlenme süresinin sınırlandırılması][process-time-limit-instr]
* [NGINX direktifi `proxy_read_timeout` ile sunucu yanıt bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX direktifi `client_max_body_size` ile maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'de dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]

## Başlatma Seçenekleri

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## Kurulumu Baştan Başlatma

Mevcut Wallarm node kurulumunu silip tekrar başlatmanız gerekirse, aşağıdaki adımları izleyin.

!!! warning "Kurulumu Baştan Başlatmanın Etkisi"
    Kurulumu baştan başlatmak, halihazırda çalışan Wallarm servislerinin durdurulmasını ve silinmesini içerir; bu da yeniden kurulum tamamlanana kadar trafiğin filtrelenmemesine neden olur. Üretim veya kritik trafik ortamlarında dikkatli olun, çünkü bu durumda trafik filtrelenmemiş olur ve risk altında kalır.

    Mevcut bir node'u (örneğin 4.10'dan 5.0'a) yükseltmek için [güncelleme talimatlarına](../../updating-migrating/all-in-one.md) bakın.

1. Wallarm süreçlerini sonlandırın ve yapılandırma dosyalarını kaldırın:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. [2. adımda](#step-2-prepare-wallarm-token) verilen kurulum talimatlarını izleyerek yeniden kurulum işlemine devam edin.
```