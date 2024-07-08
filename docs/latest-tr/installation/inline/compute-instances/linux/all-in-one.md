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

# Her şey Bir Arada Yükleyici ile Dağıtım

**Her şey bir arada yükleyici**, çeşitli ortamlarda NGINX için dinamik bir modül olarak Wallarm düğümünün kurulum sürecini basitleştirmek ve standartlaştırmak için tasarlanmıştır. Bu yükleyici, işletim sisteminizin ve NGINX sürümünüzü otomatik olarak belirler ve tüm gerekli bağımlılıkları yükler.

Wallarm'ın [NGINX](individual-packages-nginx-stable.md), [NGINX Plus](individual-packages-nginx-plus.md) ve dağıtılan [NGINX](individual-packages-nginx-distro.md) için sunduğu bireysel Linux paketlerine kıyasla, **her şey bir arada yükleyici** aşağıdaki işlemleri otomatik olarak gerçekleştirerek süreci daha da basitleştirir:

1. İşletim sisteminizin ve NGINX sürümünü kontrol edin.
1. Algılanan İS ve NGINX sürümü için Wallarm depolarını ekleyin.
1. Bu depolardan Wallarm paketlerini yükleyin.
1. Yüklenen Wallarm modülünü NGINX'inize bağlayın.
1. Sağlanan belirteç kullanılarak filtreleme düğümünü Wallarm Cloud'a bağlayın.

![Her şey bir arada ile manuele karşılaştırma](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Kullanım Durumları

--8<-- "../include-tr/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/all-in-one-requirements.md"

## Adım 1: NGINX ve bağımlılıkları yükleyin

--8<-- "../include-tr/waf/installation/all-in-one-nginx.md"

## Adım 2: Wallarm belirteci hazırlayın

--8<-- "../include-tr/waf/installation/all-in-one-token.md"

## Adım 3: Her şey bir arada Wallarm yükleyiciyi indirin

--8<-- "../include-tr/waf/installation/all-in-one-installer-download.md"

## Adım 4: Her şey bir arada Wallarm yükleyiciyi çalıştırın

--8<-- "../include-tr/waf/installation/all-in-one-installer-run.md"

İlerleyen adımlardaki komutlar, x86_64 ve ARM64 kurulumları için aynıdır.

## Adım 5: Wallarm düğümünü trafiği analiz etmek için etkinleştirin

--8<-- "../include-tr/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## Adım 6: NGINX'i yeniden başlatın

--8<-- "../include-tr/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Trafiği Wallarm düğümüne göndermeyi yapılandırın

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-inline.md"

## Adım 8: Wallarm düğüm işlemini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılmış çözümü ince ayar yapın

Varsayılan ayarlarla dinamik Wallarm modülü yüklenir. Filtreleme düğümü, dağıtım sonrası bazı ek konfigürasyonlar gerektirebilir.

Wallarm ayarları [NGINX yönergeleri](../../../../admin-en/configure-parameters-en.md) veya Wallarm Console UI kullanılarak tanımlanır. Yönergeler, Wallarm düğümü olan makinedeki aşağıdaki dosyalara ayarlanmalıdır:

* NGINX ayarları ile `/etc/nginx/nginx.conf`
* Detaylı açıklama [bağlantı][wallarm-status-instr] içinde mevcut olan Wallarm düğüm izleme ayarlarıyla `/etc/nginx/wallarm-status.conf`
* `collectd` eklentisi için ayarlarla `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` 

Aşağıda ihtiyaç durumunda uygulayabileceğiniz tipik ayarların birkaçı bulunmaktadır:

* [Filtrasyon modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğümleri için kaynak tahsisi][memory-instr]
* [Wallarm düğüm değişkenlerinin günlük kaydı][logging-instr]
* [Filtreleme düğümünün arkasında yük dengeleyici ya da proxy sunucusunun kullanılması][proxy-balancer-instr]
* [`wallarm_process_time_limit` yönergesindeki tek istek işleme süresinin sınırlandırılması][process-time-limit-instr]
* [NGINX yönergesi `proxy_read_timeout` içindeki sunucu yanıt bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX yönergesi `client_max_body_size` içindeki maksimum istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX içinde dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]

## Başlatma seçenekleri

Her şey bir arada betiği indirdiğinizde yardım almak için:

```
sudo sh ./wallarm-4.8.0.x86_64-glibc.sh -- -h
```

Betik bu döndürür:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 Batch mode, non-interactive installation.
-t, --token TOKEN           Node token, only used in a batch mode.
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU, default is EU, only used in a batch mode.
-H, --host HOST             Wallarm API address, for example, api.wallarm.com or us1.api.wallarm.com, only used in a batch mode.
-P, --port PORT             Wallarm API pot, for example, 443.
    --no-ssl                Disable SSL for Wallarm API access.
    --no-verify             Disable SSL certificates verification.
-f, --force                 If there is a node with the same name, create a new instance.
-h, --help
    --version
```

Not:

* `--batch` seçeneği **toplu (etkileşimsiz) modu** etkinleştirir. Bu modda, ek parametreler kullanmazsanız, düğüm betiğin hemen sonra kurulur ve kullanıcıdan ekstra etkileşim veya veri girişi gerektirmez. Toplu mod:
 
    * `--token` gerektirir
    * Varsayılan olarak düğümü EU Cloud'a yükler
    * Ek seçeneklerle betiğin davranışını değiştirmeye izin verir

* `filtering/postanalytics` switcher, postanalytics modülünü [ayrıca](../../../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) yüklemeye izin verir. Switcher kullanılmazsa, filtreleme ve postanalytics bileşenleri birlikte yüklenir.