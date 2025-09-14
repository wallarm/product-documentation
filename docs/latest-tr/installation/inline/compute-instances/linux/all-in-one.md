# Hepsi-bir-arada Yükleyici ile Dağıtım

**Hepsi-bir-arada yükleyici**, Linux tabanlı ortamlarda NGINX için dinamik bir modül olarak Wallarm düğümünü [inline trafik filtreleme][inline-docs] amacıyla kurmak üzere tasarlanmıştır. Bu yükleyici, işletim sistemi ve NGINX sürümlerinizi otomatik olarak belirler ve gerekli tüm bağımlılıkları kurar.

**Hepsi-bir-arada yükleyici**, aşağıdaki işlemleri otomatikleştirerek basit bir düğüm kurulum süreci sağlar:

1. İşletim sistemi ve NGINX sürümünüzü denetleme.
1. Algılanan işletim sistemi ve NGINX sürümü için Wallarm depolarını ekleme.
1. Bu depolardan Wallarm paketlerini yükleme.
1. Yüklenen Wallarm modülünü NGINX'inize bağlama.
1. Sağlanan token kullanılarak filtreleme düğümünü Wallarm Cloud'a bağlama.

## Kullanım örnekleri

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/all-in-one-requirements-latest.md"

## Adım 1: NGINX ve bağımlılıkları yükleyin

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Step 2: Prepare Wallarm token

--8<-- "../include/waf/installation/all-in-one-token.md"

## Adım 3: Hepsi-bir-arada Wallarm yükleyicisini indirin

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Adım 4: Hepsi-bir-arada Wallarm yükleyicisini çalıştırın

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

İlerleyen adımlardaki komutlar x86_64 ve ARM64 kurulumları için aynıdır.

## Adım 5: Wallarm düğümünün trafiği analiz etmesini etkinleştirin

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## Adım 6: NGINX'i yeniden başlatın

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Adım 7: Trafiğin Wallarm düğümüne gönderilmesini yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## Adım 8: Wallarm düğümünün çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 9: Dağıtılan çözüme ince ayar yapın

Varsayılan ayarlarla dinamik Wallarm modülü kurulmuştur. Filtreleme düğümü, dağıtımdan sonra ek bazı yapılandırmalar gerektirebilir.

Wallarm ayarları [NGINX yönergeleri][waf-directives-instr] veya Wallarm Console UI üzerinden tanımlanır. Yönergeler, Wallarm düğümünün bulunduğu makinede aşağıdaki dosyalara eklenmelidir:

* Sunucu ve location seviyesindeki ayarlar için `/etc/nginx/sites-available/default`
* http seviyesindeki ayarlar için `/etc/nginx/nginx.conf`
* Wallarm düğümü izleme ayarlarını içeren `/etc/nginx/wallarm-status.conf`. Ayrıntılı açıklama bu [bağlantıda][wallarm-status-instr] mevcuttur

Aşağıda gerekirse uygulayabileceğiniz tipik ayarlardan bazıları yer almaktadır:

* [Filtreleme modunun yapılandırılması][waf-mode-instr]
* [Wallarm düğümleri için kaynak ayırma][memory-instr]
* [Wallarm düğümü değişkenlerinin günlüğe kaydedilmesi][logging-instr]
* [Filtreleme düğümünün arkasındaki proxy sunucusunun dengeleyicisinin kullanılması][proxy-balancer-instr]
* [`wallarm_process_time_limit` yönergesinde tek bir isteğin işleme süresini sınırlama][process-time-limit-instr]
* [NGINX `proxy_read_timeout` yönergesinde sunucu yanıtını bekleme süresinin sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINX `client_max_body_size` yönergesinde azami istek boyutunun sınırlandırılması](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINX'te dinamik DNS çözümlemesinin yapılandırılması][dynamic-dns-resolution-nginx]

## Başlatma seçenekleri

--8<-- "../include/waf/installation/all-in-one/launch-options.md"

## Kurulumu yeniden başlatma

Wallarm düğümü kurulumunu silmeniz ve yeniden başlamanız gerekiyorsa, aşağıdaki adımları izleyin.

!!! warning "Kurulumu yeniden başlatmanın etkisi"
    Kurulumu yeniden başlatmak, hâlihazırda çalışan Wallarm servislerini durdurmayı ve silmeyi içerir; bu da yeniden kurulum tamamlanana kadar trafik filtrelemesini duraklatır. Üretim veya kritik trafik ortamlarında dikkatli olun; çünkü bu durum trafiği filtresiz ve risk altında bırakır.

    Mevcut bir düğümü yükseltmek için (örn. 4.10'dan 5.0'a), [yükseltme talimatlarına][upgrade-docs] bakın.

1. Wallarm süreçlerini sonlandırın ve yapılandırma dosyalarını kaldırın:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```
1. Yeniden kurulum işlemine, [2. adım](#step-2-prepare-wallarm-token) kurulum talimatlarını izleyerek devam edin.