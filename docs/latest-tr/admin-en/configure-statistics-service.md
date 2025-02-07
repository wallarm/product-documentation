```markdown
[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[doc-selinux]:                  configure-selinux.md

# İstatistik Servisi

Wallarm [NGINX veya Native](../installation/nginx-native-node-internals.md) node istatistiklerini `wallarm_status` servisini kullanarak elde edebilirsiniz. Bu makale, servisin nasıl yapılandırılacağını ve kullanılacağını anlatmaktadır.

!!! info "Native node istatistik servisi"
    [Native](../installation/nginx-native-node-internals.md#native-node) nodeları için, hâlâ mevcut olsa da `wallarm_status` eski bir servistir. Ana servis, Native node yapılandırmasında ["metrics"](../installation/native-node/all-in-one-conf.md#metricsenabled) parametreleri ile `curl localhost:9000/metrics` komutuyla erişilebilen `metrics` servisidir.

## Kurulum

!!! warning "Önemli"

    İstatistik servisini, diğer NGINX yapılandırma dosyalarında `wallarm_status` yönergesinin kullanılmasından kaçınarak, kendi dosyasında yapılandırmanız şiddetle tavsiye edilir; çünkü diğer dosyalar güvensiz olabilir. `wallarm-status` için yapılandırma dosyası konumları:

    * all-in-one yükleyici için: `/etc/nginx/wallarm-status.conf`
    * Diğer kurulumlar için: `/etc/nginx/conf.d/wallarm-status.conf`
    
    Ayrıca, varsayılan `wallarm-status` yapılandırmasının mevcut satırlarını değiştirmemeniz şiddetle tavsiye edilir; aksi halde metrik verilerin Wallarm Cloud'a yüklenmesi süreci bozulabilir.

Yönerge kullanılırken, istatistikler JSON formatında veya [Prometheus][link-prometheus] ile uyumlu formatta verilebilir. Kullanım:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    Yönerge, `server` ve/veya `location` bağlamında yapılandırılabilir.

    Çoğu dağıtım seçeneğinde `format` parametresi varsayılan olarak `json` değerini alır, NGINX tabanlı Docker imajında ise; konteyner dışında `/wallarm-status` endpoint'i çağrıldığında metrikler Prometheus formatında döner.

### Varsayılan yapılandırma

Varsayılan olarak, filtre node istatistik servisi en güvenli yapılandırmaya sahiptir. `/etc/nginx/conf.d/wallarm-status.conf` (all-in-one yükleyici için `/etc/nginx/wallarm-status.conf`) yapılandırma dosyası şu şekilde görünür:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # Filtre node sunucusunun loopback adresleri dışındaki erişime kapalıdır  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # İstek kaynaklarının kontrolü devre dışı bırakılmıştır, denylisted IP'lerin wallarm-status servisine erişimine izin verilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### İstatistik İsteklerine İzin Verilen IP Adreslerini Sınırlandırma

`wallarm_status` yönergesini yapılandırırken, istatistik isteklerinin yapılabileceği IP adreslerini belirleyebilirsiniz. Varsayılan olarak, yalnızca `127.0.0.1` ve `::1` adreslerine izin verilir; böylece yalnızca Wallarm'ın kurulu olduğu sunucudan istek yapılabilir.

Başka bir sunucudan istek yapılmasına izin vermek için, yapılandırmaya istenen sunucunun IP adresini içeren `allow` talimatını ekleyin. Örneğin:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

Ayarlar değiştirildikten sonra, değişiklikleri uygulamak için NGINX'i yeniden başlatın:

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### İstatistik Servisi IP Adresini ve/veya Portunu Değiştirme

İstatistik servisi için IP adresini ve/veya portunu değiştirmek için aşağıdaki adımları uygulayın.

!!! info "NGINX Docker imajında istatistik servisi portunun değiştirilmesi"
    [NGINX tabanlı Docker imajında](installation-docker-en.md) istatistik servisi için varsayılan portu değiştirmek adına, konteyneri `NGINX_PORT` değişkenini yeni port değeriyle başlatın. Başka bir değişiklik gerekmez.

1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasını (all-in-one yükleyici için `/etc/nginx/wallarm-status.conf`) açın ve aşağıdakileri belirtin:

    * `listen` yönergesinde yeni servis adresi.
    * Gerekirse, loopback adresleri dışındaki adreslerden erişime izin vermek için `allow` yönergesini değiştirin (varsayılan yapılandırma dosyası yalnızca loopback adreslerine izin verir).
1. `node.yaml` dosyasına (Docker NGINX tabanlı imaj, cloud imajları, NGINX Node all-in-one yükleyici ve Native Node için `/opt/wallarm/etc/wallarm/node.yaml` konumunda bulunur, diğer kurulumlarda dosya konumunu aramak için arama yapın) yeni adres değerini içeren `status_endpoint` parametresini ekleyin, örneğin:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. [`collectd`](monitoring/intro.md) yapılandırma dosyasında `URL` parametresini uygun şekilde düzeltin. Bu dosyanın konumu, kullandığınız işletim sistemi ve kurulum yöntemine bağlıdır:

    === "DEB-tabanlı dağıtımlar"
        ```bash
        /etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf

        # all-in-one yükleyici için:
        /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
        ```
    === "RPM-tabanlı dağıtımlar"
        ```bash
        /etc/wallarm-collectd.d/nginx-wallarm.conf

        # all-in-one yükleyici için:
        /opt/wallarm/etc/wallarm-collectd.d/nginx-wallarm.conf
        ```
    === "AMI, GCP imajı veya Docker imajı"
        ```bash
        /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
        ```
1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. all-in-one yükleyici veya cloud imajları ile dağıtılan filtre nodeları için, `/opt/wallarm/env.list` dosyasını açın ve `NGINX_PORT` değişkenini yeni servis port değeriyle ekleyin (değiştirildiyse), örneğin:

    ```
    NGINX_PORT=8082
    ```
1. Tarantool için standart dışı bir IP adresi veya port kullanılıyorsa, Tarantool yapılandırma dosyasını buna uygun olarak düzeltin. Bu dosyanın konumu, kullandığınız işletim sistemi dağıtımına bağlıdır:

    === "DEB-tabanlı dağıtımlar"
        ```bash
        /etc/collectd/collectd.conf.d/wallarm-tarantool.conf

        # all-in-one yükleyici için:
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```
    === "RPM-tabanlı dağıtımlar"
        ```bash
        /etc/collectd.d/wallarm-tarantool.conf

        # all-in-one yükleyici için:
        /opt/wallarm/etc/collectd.d/wallarm-tarantool.conf
        ```
    === "AMI, GCP imajı veya Docker NGINX tabanlı imaj"
        ```bash
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```

Eğer filtre node hostunda SELinux yüklüyse, SELinux'un [yapılandırıldığından veya devre dışı bırakıldığından][doc-selinux] emin olun. Bu belge, basitlik açısından SELinux'un devre dışı olduğunu varsayar.

Yukarıdaki ayarlar uygulandıktan sonra, yerel `wallarm-status` çıktısının sıfırlanacağını unutmayın.

### İstatistiklerin Prometheus Formatında Alınması

Çoğu dağıtım seçeneği varsayılan olarak istatistikleri JSON formatında döner. NGINX tabanlı Docker imajı bir istisnadır; konteyner dışında `/wallarm-status` endpoint'i çağrıldığında metrikler Prometheus formatında döner.

Varsayılan olarak JSON dönen node dağıtım seçeneklerinden Prometheus formatında istatistik almak için:

1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasına (all-in-one yükleyici için `/etc/nginx/wallarm-status.conf`) aşağıdaki yapılandırmayı ekleyin:

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
        Lütfen `/wallarm-status` lokasyonunun varsayılan yapılandırmasını silmeyin veya değiştirmeyin. Bu endpoint'in varsayılan çalışması, Wallarm Cloud'a doğru veri yüklenmesi açısından kritik öneme sahiptir.
1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. Yeni endpoint'i çağırarak Prometheus metriklerini alın:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

## Kullanım

Filtre node istatistiklerini almak için, yukarıda belirtilen izinli IP adreslerinden birinden istek yapın:

=== "JSON formatında istatistikler"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    Sonuç olarak, aşağıdaki biçimde bir yanıt alacaksınız:

    ```
    { "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"acl_allow_list":0,"abnormal":0,
    "tnt_errors":0,"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
    "softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
    "custom_ruleset_ver":51,"db_apply_time":1598525865,"lom_apply_time":1598525870,
    "custom_ruleset_apply_time":1598525870,"proton_instances": { "total":3,"success":3,"fallback":0,
    "failed":0 },"stalled_workers_count":0,"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,
    "mod_time":1598525870,"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,
    "mod_time":1598525865,"fname":"\/etc\/wallarm\/proton.db"}],"startid":1459972331756458216,
    "timestamp":1664530105.868875,"rate_limit":{"shm_zone_size":67108864,"buckets_count":4,"entries":1,
    "delayed":0,"exceeded":1,"expired":0,"removed":0,"no_free_nodes":0},"split":{"clients":[
    {"client_id":null,"requests": 78,"attacks": 0,"blocked": 0,"blocked_by_acl": 0,"overlimits_time": 0,
    "time_detect": 0,"applications":[{"app_id":4,"requests": 78,"attacks": 0,"blocked": 0,
    "blocked_by_acl": 0,"overlimits_time": 0,"time_detect": 0}]}]} }
    ```
=== "Prometheus formatında istatistikler"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    Adres farklı olabilir, lütfen gerçek adres için all-in-one yükleyici durumunda `/etc/nginx/wallarm-status.conf` veya diğer kurulumlarda `/etc/nginx/conf.d/wallarm-status.conf` dosyasını kontrol edin.

    Sonuç olarak, aşağıdaki biçimde bir yanıt alacaksınız:

    ```
    # HELP wallarm_requests requests count
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_attacks attack requests count
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked blocked requests count
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl blocked by acl requests count
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list requests passed by allow list
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal abnormal requests count
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors tarantool write errors count
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API write errors count
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost lost requests count
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time count
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults segmentation faults count
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults vmem limit reached events count
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults request memory limit reached events count
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton non-memory related libproton faults events count
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds time spent for detection
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db file id
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM file id
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Custom Ruleset file id
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver custom ruleset file format version
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db file apply time id
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM file apply time
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Custom Ruleset file apply time
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton instances count
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds time a worker stalled in libproton
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid unique start id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

Aşağıdaki yanıt parametreleri kullanılabilir (Prometheus metriklerinin `wallarm_` öneki vardır):

*   `requests`: Filtre node tarafından işlenen istek sayısı.
*   `attacks`: Kayıt altına alınan saldırı sayısı.
*   `blocked`: [denylisted](../user-guides/ip-lists/overview.md) IP'lerden gelenler dahil, engellenen istek sayısı.
*   `blocked_by_acl`: [denylisted](../user-guides/ip-lists/overview.md) istek kaynakları nedeniyle engellenen istek sayısı.
*   `acl_allow_list`: [allowlisted](../user-guides/ip-lists/overview.md) istek kaynaklarından gelen istek sayısı.
*   `abnormal`: Uygulamanın anormal kabul ettiği istek sayısı.
*   `tnt_errors`: post-analytics modülü tarafından analiz edilmeyen istek sayısı. Bu istekler için engelleme sebepleri kaydedilir, ancak istekler istatistik veya davranış kontrollerine dahil edilmez.
*   `api_errors`: API’ye gönderilmeden analiz edilen istek sayısı. Bu isteklerde engelleme parametreleri uygulanır (örneğin, sistem blocking modunda çalışıyorsa kötü niyetli istekler engellenir); ancak bu olaylara dair veriler UI’da görünmez. Bu parametre yalnızca Wallarm Node yerel post-analytics modülü ile çalışırken kullanılır.
*   `requests_lost`: post-analytics modülünde analiz edilmeyip API’ye aktarılan istek sayısı. Bu isteklerde engelleme parametreleri uygulanır; ancak bu olaylara dair veriler UI’da görünmez. Bu parametre yalnızca Wallarm Node yerel post-analytics modülü ile çalışırken kullanılır.
*   `overlimits_time`: Filtre node tarafından tespit edilen [Hesaplama Kaynaklarının Aşımı](../attacks-vulns-list.md#resource-overlimit) saldırı sayısı.
*   `segfaults`: worker işleminin acil sonlandırılmasına neden olan hata sayısı.
*   `memfaults`: sanal bellek sınırının aşıldığı durumların sayısı.
*   `softmemfaults`: proton.db + lom için belirtilen sanal bellek limitinin aşıldığı durumların sayısı ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
*   `proton_errors`: sanal bellek limitinin aşıldığı durumlar hariç, proton.db hatalarının sayısı.
*   `time_detect`: istek analizi için harcanan toplam süre.
*   `db_id`: proton.db versiyonu.
*   `lom_id`: yakında kaldırılacaktır, lütfen `custom_ruleset_id` kullanın.
*   `custom_ruleset_id`: [custom ruleset][gl-lom] derlemesinin versiyonu.

    4.8 sürümünden itibaren, Prometheus formatında `wallarm_custom_ruleset_id{format="51"} 386` olarak gösterilir; `custom_ruleset_ver` ise `format` özniteliği içinde belirtilir ve ana değer, ruleset derlemesidir.
*   `custom_ruleset_ver` (Wallarm 4.4.3 sürümünden itibaren mevcut): [custom ruleset][gl-lom] formatı:
    * `4x` - Wallarm node'ları 2.x için (bu node'lar [güncelliğini yitirmiştir](../updating-migrating/versioning-policy.md#version-list)).
    * `5x` - Wallarm node'ları 4.x ve 3.x için (3.x'ler [güncelliğini yitirmiştir](../updating-migrating/versioning-policy.md#version-list)).
*   `db_apply_time`: proton.db dosyasının en son güncellenme Unix zamanı.
*   `lom_apply_time`: yakında kaldırılacaktır, lütfen `custom_ruleset_apply_time` kullanın.
*   `custom_ruleset_apply_time`: [custom ruleset](../glossary-en.md#custom-ruleset-the-former-term-is-lom) dosyasının en son güncellenme Unix zamanı.
*   `proton_instances`: indirilen proton.db + LOM çiftleri hakkında bilgiler:
    *   `total`: çiftlerin toplam sayısı.
    *   `success`: Wallarm Cloud'dan başarıyla indirilen çiftlerin sayısı.
    *   `fallback`: yedek dizinden indirilen çiftlerin sayısı. Bu, Cloud'dan en güncel proton.db + LOM indirilemediğini, ancak [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) yönergesinin `on` olarak ayarlanması nedeniyle NGINX'in yedek dizinden eski versiyonu yükleyebildiğini gösterir.
    *   `failed`: başlatılamayan çiftlerin sayısı; yani, NGINX, proton.db + LOM çiftini ne Cloud'dan ne de yedek dizinden indirememiştir. Eğer [`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback) etkinse ve böyle bir durum olursa, Wallarm modülü devre dışı bırakılır ve yalnızca NGINX modülü çalışır. Sorunu teşhis etmek için, NGINX loglarını kontrol etmeniz veya [Wallarm destek ekibi ile iletişime geçmeniz](https://support.wallarm.com/) önerilir.
*   `stalled_workers_count`: istek işleme süresi için belirlenmiş sınıra uymayan worker sayısı (süre [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) yönergesiyle ayarlanır).
*   `stalled_workers`: isteğin işlenmesi için zaman sınırını aşan worker'ların listesi (süre [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) yönergesiyle belirlenir) ve harcanan süre.
*   `ts_files`: [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom) dosyası hakkında bilgiler:
    *   `id`: kullanılan LOM versiyonu.
    *   `size`: LOM dosyasının bayt cinsinden boyutu.
    *   `mod_time`: LOM dosyasının en son güncellenme Unix zamanı.
    *   `fname`: LOM dosyasının yolu.
*   `db_files`: proton.db dosyası hakkında bilgiler:
    *   `id`: kullanılan proton.db versiyonu.
    *   `size`: proton.db dosyasının bayt cinsinden boyutu.
    *   `mod_time`: proton.db dosyasının en son güncellenme Unix zamanı.
    *   `fname`: proton.db dosyasının yolu.
* `startid`: filtre node'un rastgele oluşturulmuş benzersiz başlangıç ID'si.
* `timestamp`: son gelen isteğin işlenme zamanı (Unix Timestamp formatında: https://www.unixtimestamp.com/).
* `rate_limit`: Wallarm [rate limiting](../user-guides/rules/rate-limiting.md) modülü hakkında bilgiler:
    * `shm_zone_size`: Wallarm rate limiting modülünün bayt cinsinden tüketebileceği toplam paylaşılan bellek miktarı (değer, [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) yönergesine dayalıdır, varsayılan `67108864`).
    * `buckets_count`: kovaların sayısı (genellikle NGINX worker sayısına eşittir, maksimum 8).
    * `entries`: limit ölçümü yapılan benzersiz istek anahtarlarının sayısı.
    * `delayed`: rate limiting modülü tarafından `burst` ayarı nedeniyle tamponlanan istek sayısı.
    * `exceeded`: rate limiting modülü tarafından sınırı aştıkları için reddedilen istek sayısı.
    * `expired`: limit aşılmayan anahtarların, düzenli 60 saniyede bir kovadan kaldırılan toplam sayısı.
    * `removed`: kovanın aniden kaldırılan anahtar sayısı. Eğer bu değer `expired` değerinden yüksekse, [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) değerinin artırılması önerilir.
    * `no_free_nodes`: değeri `0` dışında ise, rate limit modülü için yetersiz bellek tahsis edildiğini gösterir; [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) değerinin artırılması tavsiye edilir.
* `split.clients`: her [tenant](../installation/multi-tenant/overview.md) için ana istatistikler. Multitenancy özelliği etkin değilse, istatistik yalnızca tek bir tenant (hesabınız) için döner ve `"client_id":null` olarak gösterilir.
* `split.clients.applications`: her [application](../user-guides/settings/applications.md) için ana istatistikler. Bu bölümde yer almayan parametreler, tüm uygulamalara ait istatistikleri döner.

Tüm sayaçlardaki veriler, NGINX başlatıldığı andan itibaren toplanır. Eğer Wallarm, hazır bir NGINX altyapısında kurulduysa, istatistik toplamaya başlamak için NGINX yeniden başlatılmalıdır.
```