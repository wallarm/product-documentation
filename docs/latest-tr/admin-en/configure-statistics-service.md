[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[doc-selinux]:                  ../troubleshooting/detection-and-blocking.md#filtering-node-rps-and-aps-values-are-not-exported-to-cloud

# İstatistik Hizmeti

Wallarm [NGINX veya Native](../installation/nginx-native-node-internals.md) düğüm istatistiklerini `wallarm_status` hizmetini kullanarak elde edebilirsiniz. Bu makale, hizmetin nasıl yapılandırılacağını ve kullanılacağını açıklar.

!!! info "Native düğüm istatistik hizmeti"
    [Native](../installation/nginx-native-node-internals.md#native-node) düğümler için `wallarm_status` hâlâ mevcut olsa da eski (legacy) bir hizmettir. Esas olan, `curl localhost:9000/metrics` ile erişilebilen `metrics` hizmetidir (Native düğüm yapılandırmasındaki ["metrics"](../installation/native-node/all-in-one-conf.md#metricsenabled) parametrelerine bakın).

## Kurulum

!!! warning "Önemli"

    `wallarm_status` yönergesinin diğer NGINX kurulum dosyalarında kullanılmasından kaçınarak istatistik hizmetini kendi dosyasında yapılandırmanız şiddetle önerilir, çünkü ilki güvensiz olabilir. `wallarm-status` için yapılandırma dosyası şuralarda bulunur:

    * All-in-one yükleyici için `/etc/nginx/wallarm-status.conf`
    * Diğer kurulumlar için `/etc/nginx/conf.d/wallarm-status.conf`
    
    Ayrıca, varsayılan `wallarm-status` yapılandırmasının mevcut satırlarından hiçbirini değiştirmemeniz şiddetle tavsiye edilir.

Yönergeyi kullanırken, istatistikler JSON formatında veya [Prometheus][link-prometheus] ile uyumlu bir formatta verilebilir. Kullanım:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    Yönerge `server` ve/veya `location` bağlamında yapılandırılabilir.

    `format` parametresi, NGINX tabanlı Docker imajı hariç çoğu dağıtım seçeneğinde varsayılan olarak `json` değerine sahiptir; uç nokta `/wallarm-status` kapsül dışından çağrıldığında metrikleri Prometheus formatında döndürür.

### Varsayılan yapılandırma

Varsayılan olarak, filtre düğümü istatistik hizmeti en güvenli yapılandırmaya sahiptir. `/etc/nginx/conf.d/wallarm-status.conf` (All-in-one yükleyici için `/etc/nginx/wallarm-status.conf`) yapılandırma dosyası aşağıdaki gibidir:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.8/8;   # Filtre düğümü sunucusunun loopback adresleri için erişim mevcuttur
  # NGINX tabanlı Docker konteynerı çalıştırılıyorsa:
  # allow 127.0.0.0/8;
  deny all;

  wallarm_mode off;
  disable_acl "on";   # İstek kaynaklarının kontrolü devre dışı, yasaklı listedeki IP'lerin wallarm-status hizmetine istek göndermesine izin verilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  wallarm_enable_apifw off;
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### İstatistik istemesine izin verilen IP adreslerini sınırlandırma

`wallarm_status` yönergesini yapılandırırken, istatistik isteyebileceğiniz IP adreslerini belirleyebilirsiniz. Varsayılan olarak, Wallarm'ın kurulu olduğu sunucudan yalnızca `127.0.0.1` ve `::1` IP adresleri üzerinden istek yapılmasına izin verilir, diğer tüm yerlerden erişim reddedilir.

Başka bir sunucudan isteğe izin vermek için:

=== "All-in-one yükleyici"
    1. `/etc/nginx/wallarm-status.conf` dosyasında, yapılandırmaya hedef sunucunun IP adresini içeren `allow` yönergesini ekleyin. Örneğin:

        ```diff
        ...
        server_name localhost;

        allow 127.0.0.8/8;
        + allow 10.41.29.0;
        ...
        ```
    1. Ayarlar değiştirildikten sonra değişiklikleri uygulamak için NGINX'i yeniden başlatın:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
=== "Docker imajı"
    * Docker konteynerını yalnızca [ortam değişkenlerini geçirerek](installation-docker-en.md#run-the-container-passing-the-environment-variables) çalıştırıyorsanız, izin verilen CIDR'ları `WALLARM_STATUS_ALLOW` ortam değişkeninde geçirin.
    * Docker konteynerını [yapılandırma dosyalarını mount ederek](installation-docker-en.md#run-the-container-mounting-the-configuration-file) çalıştırıyorsanız:

        1. `allow` yönergesinde belirtilen izinli adreslerle `wallarm-status.conf` dosyasını hazırlayın, örn.:

            ```diff
            server {
                listen 127.0.0.8:80;

                server_name localhost;

                allow 127.0.0.0/8;
            +    allow 10.41.29.0;
                deny all;

                wallarm_mode off;
                disable_acl "on";
                wallarm_enable_apifw off;
                access_log off;

                location ~/wallarm-status$ {
                    wallarm_status on;
                }
            }
            ```
            
        1. Konteyner çalıştırılırken hazırlanan dosyayı konteyner içinde `/etc/nginx/conf.d/wallarm-status.conf` yoluna mount edin.

=== "AWS veya GCP makine imajı"
    1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasında, yapılandırmaya hedef sunucunun IP adresini içeren `allow` yönergesini ekleyin. Örneğin:

        ```diff
        ...
        server_name localhost;

        allow 127.0.0.8/8;
        + allow 10.41.29.0;
        ...
        ```
    1. Ayarlar değiştirildikten sonra değişiklikleri uygulamak için NGINX'i yeniden başlatın:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### İstatistik hizmetinin IP adresini ve/veya portunu değiştirme

İstatistik hizmetinin IP adresini ve/veya portunu değiştirmek için aşağıdaki talimatları izleyin.

=== "All-in-one yükleyici"
    1. `/etc/nginx/wallarm-status.conf` dosyasını açın ve `listen` yönergesinde yeni hizmet adresini belirtin.
    1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
=== "Docker imajı"
    * [NGINX tabanlı Docker imajında](installation-docker-en.md) yalnızca istatistik hizmetinin varsayılan portunu değiştirmek için, konteynerı `NGINX_PORT` değişkenini yeni porta ayarlayarak başlatın. Başka değişiklik gerekmez.
    * Hem IP adresini hem de portu değiştirmek için:

        1. `listen` yönergesinde yeni adres belirtilmiş şekilde `wallarm-status.conf` dosyasını hazırlayın:

            ```
            server {
                listen 127.0.0.8:80;

                server_name localhost;

                allow 127.0.0.8/8;
                # NGINX tabanlı Docker konteynerı çalıştırılıyorsa:
                # allow 127.0.0.0/8;
                deny all;

                wallarm_mode off;
                disable_acl "on";
                wallarm_enable_apifw off;
                access_log off;

                location ~/wallarm-status$ {
                    wallarm_status on;
                }
            }
            ```
            
        1. Konteyner çalıştırılırken hazırlanan dosyayı konteyner içinde `/etc/nginx/conf.d/wallarm-status.conf` yoluna mount edin.
=== "AWS veya GCP makine imajı"
    1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasını açın ve `listen` yönergesinde yeni hizmet adresini belirtin.
    1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

Filtre düğümü ana makinesinde SELinux kuruluysa, SELinux'un [yapılandırıldığından veya devre dışı bırakıldığından][doc-selinux] emin olun. Basit olması için bu doküman, SELinux'un devre dışı olduğunu varsayar.

Yukarıdaki ayarlar uygulandıktan sonra yerel `wallarm-status` çıktısının sıfırlanacağını unutmayın.

### Prometheus formatında istatistik alma

Çoğu dağıtım seçeneği varsayılan olarak istatistikleri JSON formatında döndürür. NGINX tabanlı Docker imajı bir istisnadır; `/wallarm-status` uç noktası kapsül dışından çağrıldığında metrikleri Prometheus formatında döndürür.

Varsayılanı JSON olan düğüm dağıtım seçeneklerinden Prometheus formatında istatistik almak için:

1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasına (All-in-one yükleyici için `/etc/nginx/wallarm-status.conf`) aşağıdaki yapılandırmayı ekleyin:


    ```diff
    ...

    location /wallarm-status {
      wallarm_status on;
    }

    + location /wallarm-status-prometheus {
    +   wallarm_status on format=prometheus;
    + }

    ...
    ```

    !!! warning "Varsayılan `/wallarm-status` yapılandırmasını silmeyin veya değiştirmeyin"
        Lütfen `/wallarm-status` konumunun varsayılan yapılandırmasını silmeyin veya değiştirmeyin. Bu uç noktanın varsayılan çalışması kritik önemdedir.
1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. Prometheus metriklerini almak için yeni uç noktayı çağırın:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  Kullanım

Filtre düğümü istatistiklerini almak için, izin verilen IP adreslerinden birinden (yukarıya bakın) bir istek yapın:

=== "JSON formatında istatistikler"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    Sonuç olarak aşağıdaki tipte bir yanıt alacaksınız:

    ```json
    {
        "requests": 0,
        "streams": 0,
        "messages": 0,
        "attacks": 0,
        "blocked": 0,
        "blocked_by_acl": 0,
        "acl_allow_list": 0,
        "abnormal": 0,
        "tnt_errors": 0,
        "api_errors": 0,
        "requests_lost": 0,
        "overlimits_time": 0,
        "segfaults": 0,
        "memfaults": 0,
        "softmemfaults": 0,
        "proton_errors": 0,
        "time_detect": 0,
        "db_id": 73,
        "lom_id": 102,
        "custom_ruleset_id": 102,
        "custom_ruleset_ver": 51,
        "db_apply_time": 1598525865,
        "lom_apply_time": 1598525870,
        "custom_ruleset_apply_time": 1598525870,
        "proton_instances": {
            "total": 3,
            "success": 3,
            "fallback": 0,
            "failed": 0
        },
        "stalled_workers_count": 0,
        "stalled_workers": [],
        "ts_files": [
            {
            "id": 102,
            "size": 12624136,
            "mod_time": 1598525870,
            "fname": "/etc/wallarm/custom_ruleset"
            }
        ],
        "db_files": [
            {
            "id": 73,
            "size": 139094,
            "mod_time": 1598525865,
            "fname": "/etc/wallarm/proton.db"
            }
        ],
        "startid": 1459972331756458216,
        "timestamp": 1664530105.868875,
        "rate_limit": {
            "shm_zone_size": 67108864,
            "buckets_count": 4,
            "entries": 1,
            "delayed": 0,
            "exceeded": 1,
            "expired": 0,
            "removed": 0,
            "no_free_nodes": 0
        },
        "split": {
            "clients": [
            {
                "client_id": null,
                "requests": 78,
                "streams": 0,
                "messages": 0,
                "attacks": 0,
                "blocked": 0,
                "blocked_by_acl": 0,
                "overlimits_time": 0,
                "time_detect": 0,
                "applications": [
                {
                    "app_id": 4,
                    "requests": 78,
                    "streams": 0,
                    "messages": 0,
                    "attacks": 0,
                    "blocked": 0,
                    "blocked_by_acl": 0,
                    "overlimits_time": 0,
                    "time_detect": 0
                }
                ]
            }
            ]
        }
    }
    ```
=== "Prometheus formatında istatistikler"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    Adres farklı olabilir, lütfen gerçek adres için `/etc/nginx/conf.d/wallarm-status.conf` dosyasını (All-in-one yükleyici için `/etc/nginx/wallarm-status.conf`) kontrol edin.

    Sonuç olarak aşağıdaki tipte bir yanıt alacaksınız:


    ```
    # HELP wallarm_requests istek sayısı
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_streams istek sayısı
    # TYPE wallarm_streams gauge
    wallarm_streams 0
    # HELP wallarm_messages istek sayısı
    # TYPE wallarm_messages gauge
    wallarm_messages 0
    # HELP wallarm_attacks saldırı isteklerinin sayısı
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked engellenen isteklerin sayısı
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl ACL tarafından engellenen isteklerin sayısı
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list izin listesi tarafından geçirilen istekler
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal anormal isteklerin sayısı
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors wstore yazma hatalarının sayısı
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API yazma hatalarının sayısı
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost kaybedilen isteklerin sayısı
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time sayısı
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults ayrışma (segmentation fault) sayısı
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults sanal bellek limitine ulaşılan olayların sayısı
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults istek bellek limitine ulaşılan olayların sayısı
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton ile ilgili bellek dışı libproton hata olaylarının sayısı
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds tespit için harcanan süre
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db dosya kimliği
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM dosya kimliği
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Özel Kurallar Dizisi dosya kimliği
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver özel kurallar dizisi dosya format sürümü
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db dosyasının uygulanma zamanı kimliği
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM dosyasının uygulanma zamanı
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Özel Kurallar Dizisi dosyasının uygulanma zamanı
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton örneklerinin sayısı
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds bir işçinin libproton içinde takılı kaldığı süre
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid benzersiz başlangıç kimliği
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

Aşağıdaki yanıt parametreleri mevcuttur (Prometheus metriklerinin öneki `wallarm_`):

*   `requests`: filtre düğümü tarafından işlenen istek sayısı.
*   `streams` (Wallarm 6.2.0 sürümünden itibaren kullanılabilir): işlenen gRPC/WebSocket akışlarının sayısı.
*   `messages` (Wallarm 6.2.0 sürümünden itibaren kullanılabilir): işlenen gRPC/WebSocket mesajlarının sayısı.
*   `attacks`: kaydedilen saldırıların sayısı.
*   `blocked`: [yasaklı listedeki](../user-guides/ip-lists/overview.md) IP’lerden gelenler de dahil engellenen isteklerin sayısı.
*   `blocked_by_acl`: [yasaklı listelenmiş](../user-guides/ip-lists/overview.md) istek kaynakları nedeniyle engellenen isteklerin sayısı.
* `acl_allow_list`: [izinli listelenmiş](../user-guides/ip-lists/overview.md) istek kaynaklarından gelen isteklerin sayısı.
*   `abnormal`: uygulamanın anormal olarak değerlendirdiği isteklerin sayısı.
*   `tnt_errors`: son-analitik modül tarafından analiz edilmeyen isteklerin sayısı. Bu istekler için engelleme nedenleri kaydedilir, ancak isteklerin kendisi istatistik ve davranış kontrollerine dahil edilmez.
*   `api_errors`: ileri analiz için API’ye iletilmeyen isteklerin sayısı. Bu istekler için engelleme parametreleri uygulanmıştır (örneğin, sistem engelleme modunda çalışıyorsa kötü amaçlı istekler engellenmiştir); ancak bu olaylara ilişkin veriler UI içinde görünmez. Bu parametre yalnızca Wallarm düğümü yerel bir son-analitik modülle çalıştığında kullanılır.
*   `requests_lost`: son-analitik modülde analiz edilmeyen ve API’ye aktarılmayan isteklerin sayısı. Bu istekler için engelleme parametreleri uygulanmıştır (örneğin, sistem engelleme modunda çalışıyorsa kötü amaçlı istekler engellenmiştir); ancak bu olaylara ilişkin veriler UI içinde görünmez. Bu parametre yalnızca Wallarm düğümü yerel bir son-analitik modülle çalıştığında kullanılır.
*   `overlimits_time`: filtreleme düğümü tarafından tespit edilen [Hesaplama kaynaklarının aşırı kullanımı](../attacks-vulns-list.md#resource-overlimit) türündeki saldırıların sayısı.
*   `segfaults`: worker sürecinin acil sonlandırılmasına yol açan sorunların sayısı.
*   `memfaults`: sanal bellek limitlerine ulaşılan sorunların sayısı.
* `softmemfaults`: proton.db +lom için sanal bellek limitinin aşıldığı durumların sayısı ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: sanal bellek limitinin aşılması durumları dışında proton.db hatalarının sayısı.
*   `time_detect`: isteklerin analizine harcanan toplam süre.
*   `db_id`: proton.db sürümü.
*   `lom_id`: yakında kullanımdan kaldırılacaktır, lütfen `custom_ruleset_id` kullanın.
*   `custom_ruleset_id`: [özel kurallar dizisi][gl-lom] yapısının sürümü.

    4.8 sürümünden başlayarak, Prometheus formatında `wallarm_custom_ruleset_id{format="51"} 386` olarak görünür; `custom_ruleset_ver`, `format` özniteliğinin içinde yer alır ve ana değer kurallar dizisi yapı sürümüdür.
*   `custom_ruleset_ver` (Wallarm 4.4.3 sürümünden itibaren kullanılabilir): [özel kurallar dizisi][gl-lom] formatı:

    * `4x` - [kullanım ömrünü doldurmuş](../updating-migrating/versioning-policy.md#version-list) 2.x Wallarm düğümleri için.
    * `5x` - 4.x ve 3.x (ikincisi [kullanım ömrünü doldurmuş](../updating-migrating/versioning-policy.md#version-list)) Wallarm düğümleri için.
*   `db_apply_time`: proton.db dosyasının son güncelleme zamanı (Unix zamanı).
*   `lom_apply_time`: yakında kullanımdan kaldırılacaktır, lütfen `custom_ruleset_apply_time` kullanın.
*   `custom_ruleset_apply_time`: [özel kurallar dizisi](../glossary-en.md#custom-ruleset-the-former-term-is-lom) dosyasının son güncelleme zamanı (Unix zamanı).
*   `proton_instances`: indirilen proton.db + LOM çiftleri hakkında bilgi:
    *   `total`: toplam çift sayısı.
    *   `success`: Wallarm Cloud’dan başarıyla indirilen çift sayısı.
    *   `fallback`: yedek dizinden indirilen çift sayısı. Bu, Cloud’dan en son proton.db + LOM indirirken sorunlar olduğunu, ancak [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) yönergesi `on` olduğundan NGINX’in yedek dizinden daha eski proton.db + LOM sürümlerini yükleyebildiğini gösterir.
    *   `failed`: başlatılamayan çiftlerin sayısı; yani NGINX’in proton.db + LOM’u ne Cloud’dan ne de yedek dizinden indirememesi. [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) etkin ve bu durum oluşursa, Wallarm modülü devre dışı bırakılır ve yalnızca NGINX modülü çalışır durumda kalır. Sorunu teşhis etmek için NGINX günlüklerini kontrol etmeniz veya [Wallarm desteğiyle iletişime geçmeniz](https://support.wallarm.com/) önerilir.
*   `stalled_workers_count`: istek işleme için zaman sınırını aşan worker sayısı (sınır [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) yönergesinde ayarlanır).
*   `stalled_workers`: istek işleme için zaman sınırını aşan worker’ların listesi (sınır [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) yönergesinde ayarlanır) ve istek işlemeye harcanan süre.
*   `ts_files`: [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom) dosyası hakkında bilgi:
    *   `id`: kullanılan LOM sürümü.
    *   `size`: LOM dosya boyutu (bayt).
    *   `mod_time`: LOM dosyasının son güncelleme zamanı (Unix zamanı).
    *   `fname`: LOM dosyasının yolu.
*   `db_files`: proton.db dosyası hakkında bilgi:
    *   `id`: kullanılan proton.db sürümü.
    *   `size`: proton.db dosya boyutu (bayt).
    *   `mod_time`: proton.db dosyasının son güncelleme zamanı (Unix zamanı).
    *   `fname`: proton.db dosyasının yolu.
* `startid`: filtreleme düğümünün rastgele oluşturulan benzersiz kimliği.
* `timestamp`: düğüm tarafından en son gelen isteğin işlendiği zaman ([Unix Zaman Damgası](https://www.unixtimestamp.com/) formatında).
* `rate_limit`: Wallarm [oransal sınırlandırma (rate limiting)](../user-guides/rules/rate-limiting.md) modülü hakkında bilgi:
    * `shm_zone_size`: Wallarm rate limiting modülünün bayt cinsinden tüketebileceği toplam paylaşımlı bellek miktarı (değer [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) yönergesine dayanır, varsayılan `67108864`).
    * `buckets_count`: kova sayısı (genellikle NGINX worker sayısına eşittir, maksimum 8).
    * `entries`: limitlerini ölçtüğünüz benzersiz istek noktası değerlerinin (anahtarların) sayısı.
    * `delayed`: `burst` ayarı nedeniyle rate limiting modülü tarafından arabelleğe alınan isteklerin sayısı.
    * `exceeded`: limiti aştığı için rate limiting modülü tarafından reddedilen isteklerin sayısı.
    * `expired`: bu anahtarlar için oran limiti aşılmadıysa, 60 saniyelik düzenli aralıklarla kovadan kaldırılan anahtarların toplam sayısı.
    * `removed`: kovadan aniden kaldırılan anahtarların sayısı. Değer `expired` değerinden yüksekse, [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) değerini artırın.
    * `no_free_nodes`: `0`’dan farklı bir değer, rate limit modülü için ayrılan bellek yetersizliğini gösterir; [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) değerinin artırılması önerilir.
* `split.clients`: her bir [kiracı](../installation/multi-tenant/overview.md) için temel istatistikler. Çoklu kiracılık özelliği etkin değilse, istatistikler statik `"client_id":null` değeriyle yalnızca tek kiracı (hesabınız) için döndürülür.
* `split.clients.applications`: her bir [uygulama](../user-guides/settings/applications.md) için temel istatistikler. Bu bölüme dahil edilmeyen parametreler tüm uygulamalar için istatistik döndürür.

Tüm sayaçların verileri NGINX başlatıldığı andan itibaren birikir. Wallarm, NGINX’li hazır bir altyapıya kurulmuşsa, istatistik toplamayı başlatmak için NGINX sunucusunun yeniden başlatılması gerekir.