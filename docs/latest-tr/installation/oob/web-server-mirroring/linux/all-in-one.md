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
[oob-advantages-limitations]:       ../../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Tüm Bir Arada Kurucuyla Dağıtım

Bu talimatlar, Wallarm'ı çeşitli ortamlarda NGINX için bir dinamik modül olarak Wallarm düğümünü yüklemenin sürecini standardize etmek ve basitleştirmek için tasarlanmış bir **tüm bir arada kurucu** kullanarak bir [OOB](../overview.md) dinamik modül olarak kurma adımlarını anlatmaktadır. Bu kurucu, işletim sisteminizin ve NGINX sürümünüzü otomatik olarak tanımlar ve tüm gerekli bağımlılıkları yükler.

Wallarm tarafından [NGINX](nginx-stable.md), [NGINX Plus](nginx-plus.md) ve [dağıtım sağlanan NGINX](nginx-distro.md) için sunulan ayrı Linux paketlerine kıyasla, **tüm bir arada kurucu** aşağıdaki işlemleri otomatik olarak gerçekleştirerek süreci basitleştirir:

1. İşletim sisteminizin ve NGINX sürümünüzü kontrol eder.
2. Tespit edilen işletim sistemi ve NGINX sürümü için Wallarm depolarını ekler.
3. Bu depolardan Wallarm paketlerini yükler.
4. Yüklenen Wallarm modülünü NGINX'inize bağlar.
5. Filtreleme düğümünü sağlanan belirteç kullanılarak Wallarm Bulutuna bağlar.

![Tüm Bir Arada ile Manuel Karşılaştırıldı](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Kullanım Durumları

--8<-- "../include-tr/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/all-in-one-requirements.md"

## Adım 1: NGINX ve Bağımlılıkları Yükleme

--8<-- "../include-tr/waf/installation/all-in-one-nginx.md"

## Adım 2: Wallarm Belirteci Hazırlama

--8<-- "../include-tr/waf/installation/all-in-one-token.md"

## Adım 3: Tüm bir arada Wallarm Kurucusunu İndirme

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

## Adım 4: Tüm bir arada Wallarm Kurucusunu Çalıştırma

--8<-- "../include-tr/waf/installation/all-in-one-installer-run.md"

Daha ileri adımlardaki komutlar, x86_64 ve ARM64 kurulumları için aynıdır.

## Adım 5: Trafik Analizi İçin Wallarm Düğümünü Etkinleştirme

--8<-- "../include-tr/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## Adım 6: NGINX'i Yeniden Başlatma

--8<-- "../include-tr/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Trafik Gönderimini Wallarm Düğümüne Yapılandırma

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-oob.md"

## Adım 8: Wallarm Düğüm İşleminin Test Edilmesi

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılmış Çözümün İnce Ayarını Yapma

Varsayılan ayarlarla dinamik Wallarm modülü yüklendi. Filtreleme düğümü, dağıtımdan sonra bazı ek yapılandırmalar gerektirebilir.

Wallarm ayarları, [NGINX yönergeleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm düğümü ile makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* Wallarm düğümü izleme ayarları olan `/etc/nginx/wallarm-status.conf` ile NGINX ayarları olan `/etc/nginx/nginx.conf`
* Tarantool'den istatistikleri toplayan `collectd` eklentisi için ayarlarla `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` 

Aşağıda, gerektiğinde uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

* [Wallarm düğümleri için kaynak ayırma][memory-instr]
* [Wallarm düğüm değişkenlerini günlüğe kaydetme][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucu balancerını kullanma][proxy-balancer-instr]
* [`wallarm_process_time_limit` yönergesindeki tek istek işleme süresini sınırlama][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` içinde sunucu yanıt bekleme süresini sınırlama](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` içinde maksimum istek boyutunu sınırlama](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'te dinamik DNS çözünürlüğünün yapılandırılması][dynamic-dns-resolution-nginx]

## Başlatma Seçenekleri

Tüm bir arada betiği indirdiğinizde, şununla yardım alabilirsiniz:

```
sudo sh ./wallarm-4.8.0.x86_64-glibc.sh -- -h
```

Bu, döndürür:

```
...
Kullanım: setup.sh [seçenekler]... [argümanlar]... [filtrasyon/postanalitik]

SEÇENEK                      AÇIKLAMA
-b, --batch                 Toplu mod, etkileşimli olmayan kurulum.
-t, --token TOKEN           Düğüm belirteci, yalnızca toplu modda kullanılır.
-c, --cloud CLOUD           Wallarm Bulut, US/EU'dan biri, varsayılan EU, yalnızca toplu modda kullanılır.
-H, --host HOST             Wallarm API adresi, örneğin, api.wallarm.com veya us1.api.wallarm.com, yalnızca toplu modda kullanılır.
-P, --port PORT             Wallarm API pot, örneğin, 443.
    --no-ssl                Wallarm API erişimi için SSL'yi devre dışı bırakır.
    --no-verify             SSL sertifika doğrulamasını devre dışı bırakır.
-f, --force                 Eğer aynı ada sahip bir düğüm varsa, yeni bir örnek oluşturur.
-h, --help
    --version
```

Şunu not edin:

* `--batch` seçeneği, bir **toplu (etkileşimli olmayan) modu** etkinleştirir. Bu modda, ek parametreleri kullanmazsanız, düğüm betiği başlatıldıktan hemen sonra kurulur, kullanıcıdan ek etkileşim veya veri girişi gerektirmez. Toplu mod:
 
    * `--token` gerektirir
    * Varsayılan olarak düğümü EU Bulut'a yükler
    * Ek seçeneklerle betiğin davranışlarının değiştirmesine izin verir

* `filtering/postanalytics` anahtarı postanalytics modülünü [ayrı ayrı](../../../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) yüklemeyi sağlar. Anahtar kullanılmazsa, filtreleme ve postanalitik kısım birlikte yüklenir.