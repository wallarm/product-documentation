[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom

# İstatistik Servisinin Yapılandırılması

Filtre düğümü hakkında istatistikler almak için, NGINX yapılandırma dosyasına yazılan `wallarm_status` yönergesini kullanın.

## İstatistik Servisinin Yapılandırılması

!!! warning "Önemli"

    İstatistik servisinin, ayrı bir yapılandırma dosyası olan `/etc/nginx/conf.d/wallarm-status.conf` dosyası içerisinde yapılandırılması şiddetle tavsiye edilir ve NGINX'i ayarladığınız diğer dosyalarda `wallarm_status` yönergesini kullanmamalısınız çünkü bu yöntem güvensiz olabilir.
    
    Ayrıca, varsayılan `wallarm-status` yapılandırmasının mevcut satırlarından herhangi birini değiştirmemeniz, metrik verilerinin Wallarm buluta yüklenme sürecini bozabileceği için şiddetle tavsiye edilir.

Yönergeyi kullanırken, istatistikler JSON formatında veya [Prometheus][link-prometheus] ile uyumlu bir formatla verilebilir. Kullanım şekli:

```
wallarm_status [açık|kapalı] [format=json|prometheus];
``` 

!!! info
    Yönerge `sunucu` ve/veya `konum` bağlamında yapılandırılabilir.

    `format` parametresi varsayılan olarak `json` değerine sahiptir.

### Varsayılan Yapılandırma

Varsayılan olarak, filtre düğümü istatistik servisi en güvenli yapılandırmaya sahiptir. `/etc/nginx/conf.d/wallarm-status.conf` yapılandırma dosyası aşağıdaki gibi görünür:

```
sunucu {
  dinle 127.0.0.8:80;
  sunucu_adı localhost;

  izin 127.0.0.0/8;   # Erişim, yalnızca filtre düğümü sunucusunun döngüsel adresleri için mevcuttur  
  tümünü_yasakla;

  wallarm_mode off;
  disable_acl "açık";   # İstek kaynaklarının kontrolünü devre dışı bırakır, engellenmiş IP'ler wallarm-status servisini talep edebilir. https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  erişim_logu kapalı;

  konum /wallarm-status {
    wallarm_status açık;
  }
}
```

### İstatistikleri Talep Etme İzinli IP Adreslerinin Sınırlandırılması

`wallarm_status` yönergesini yapılandırırken, istatistik talebinde bulunabilecek IP adreslerini belirleyebilirsiniz. Varsayılan olarak, erişim  `127.0.0.1` ve `::1`  IP adresleri dışında hiçbir yerden çıkış yapılmasına izin verilmez; bu da, yalnızca Wallarm'ın yüklü olduğu sunucudan talep çalıştırma izni anlamına gelir.

Başka bir sunucudan taleplerin izinli olması için, istenen sunucunun IP adresiyle `izin` talimatını yapılandırmaya ekleyin. Örneğin:

```diff
...
sunucu_adı localhost;

izin 127.0.0.0/8;
+ izin 10.41.29.0;
...
```

Ayarlar değiştirildiğinde, değişikliklerin uygulanması için NGINX'i yeniden başlatın:

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### İstatistik Servisinin IP Adresini Değiştirme 

İstatistik servisinin IP adresini değiştirmek için:

1. `/etc/nginx/conf.d/wallarm-status.conf` dosyasındaki `dinle` yönergesine yeni bir adres belirtin.
1. Yeni adres değeri ile `/etc/nginx/conf.d/wallarm-status.conf` dosyasına `status_endpoint` parametresi ekleyin, örneğin:

    ```bash
    hostname: örnek-düğüm-adı
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. [`collectd`](monitoring/intro.md) yapılandırma dosyasındaki `URL` parametresini uygun şekilde düzeltin. Bu dosyanın konumu, kullandığınız işletim sistemine bağlıdır:

    --8<-- "../include/warning/wallarm-status-conf.md"
1. Grup dışı adreslerden erişime izin vermek için `izin` yönergesini ekleyin veya değiştirin (varsayılan yapılandırma dosyası yalnızca döngüsel adreslere erişime izin verir).
1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

    --8<-- "../include/warning/wallarm-status-conf.md"

### İstatistikleri Prometheus Formatında Alma

Varsayılan olarak, istatistikler yalnızca JSON formatında geri döner. İstatistikleri Prometheus formatında almak için:

1. Aşağıdaki yapılandırmayı `/etc/nginx/conf.d/wallarm-status.conf` dosyasına ekleyin:


    ```diff
    ...

    konum /wallarm-status {
      wallarm_status açık;
    }

    + konum /wallarm-status-prometheus {
    +   wallarm_status açık format=prometheus;
    + }

    ...
    ```

    !!! warning "Varsayılan `/wallarm-status` yapılandırmasını silmeyin veya değiştirmeyin"
        Lütfen `/wallarm-status` konumunun varsayılan yapılandırmasını silmeyin veya değiştirmeyin. Bu uç noktanın varsayılan işlemi, doğru verilerin Wallarm Bulut'a yüklenmesi için hayati öneme sahiptir.
1. Değişiklikleri uygulamak için NGINX'i yeniden başlatın:

    --8<-- "../include/warning/wallarm-status-conf.md"
1. Prometheus metriklerini almak için yeni uç noktayı çağırın:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  İstatistik Servisi ile Çalışma 

Filtre düğümü istatistiklerini elde etmek için, izinli IP adreslerinden birinden bir istek yapın (yukarıya bakınız):

=== "JSON formatında İstatistikler"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    Sonuç olarak, aşağıdaki türden bir yanıt alacaksınız:

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
=== "Prometheus formatında İstatistikler"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    Adres farklı olabilir, gerçek adresi kontrol etmek için lütfen `/etc/nginx/conf.d/wallarm-status.conf` dosyasına bakınız.

    Sonuç olarak, aşağıdaki türden bir yanıt alacaksınız:

    ```
    # HELP wallarm_requests istek sayısı
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_attacks saldırı isteği sayısı
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked engellenen istek sayısı
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl acl tarafından engellenen isteklerin sayısı
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list izin listesinden geçen isteklerin sayısı
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal anormal istek sayısı
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors tarantool yazma hatası sayısı
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API yazma hataları sayısı
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost kayıp istek sayısı
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time aşırı sınırlandırma süresi sayısı
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults segment hataları sayısı
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults vmem limitine ulaştı olayların sayısı
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults proton.db + lom için sanal bellek limitinin aşıldığı olayların sayısı
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton non-memory related libproton hatası olayları sayısı
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds tespit için harcanan süre
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db dosyası id
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM dosyası id
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Özel Kural Seti dosyası id
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver özel kural seti dosyası format versiyonu
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db dosyasının uygulama zamanı id
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM dosyasının uygulama zamanı
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Özel Kural Seti dosyası uygulama zamanı
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton örnek sayısı
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{durum="başarı"} 5
    wallarm_proton_instances{durum="fallback"} 0
    wallarm_proton_instances{durum="başarısız"} 0
    # HELP wallarm_stalled_worker_time_seconds libproton'da bir işçinin donma süresi
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid benzersiz başlangıç id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

Aşağıdaki yanıt parametreleri mevcuttur (Prometheus metrikleri `wallarm_` öneki ile başlar):

*   `requests`: filtre düğümü tarafından işlenen isteklerin sayısı.
*   `attacks`: kaydedilen saldırıların sayısı.
*   `blocked`: [engellenmiş](../user-guides/ip-lists/denylist.md) IP'lerden çıkanlar da dahil olmak üzere engellenen isteklerin sayısı.
*   `blocked_by_acl`: [engellenmiş](../user-guides/ip-lists/denylist.md) istek kaynakları nedeniyle engellenen isteklerin sayısı.
* `acl_allow_list`: [izin verilen](../user-guides/ip-lists/allowlist.md) istek kaynaklarından gelen isteklerin sayısı.
*   `abnormal`: uygulamanın anormal olarak kabul ettiği isteklerin sayısı.
*   `tnt_errors`: post-analitik modül tarafından analiz edilmeyen isteklerin sayısı. Bu istekler için engelleme nedenleri kaydedilir, ancak istekler istatistiklere dahil edilmez ve davranış kontrollerine tabi tutulmaz.
*   `api_errors`: API için ek analize sunulmayan isteklerin sayısı. Bu istekler için engelleme parametreleri uygulandı (yani, sistem engelleme modunda çalışıyorsa kötü niyetli istekler engellendi); ancak, bu olaylara dair veriler kullanıcı arayüzünde görünmez. Bu parametre, yalnızca Wallarm Node yerel bir post-analitik modül ile çalışmaktadır.
*   `requests_lost`: post-analitik modülde analiz edilmeyen ve API'ye aktarılmayan isteklerin sayısı. Bu istekler için engelleme parametreleri uygulandı (yani, sistem engelleme modunda çalışıyorsa kötü niyetli istekler engellendi); ancak, bu olaylara dair veriler kullanıcı arayüzünde görünmez. Bu parametre, yalnızca Wallarm Node yerel bir post-analitik modül ile çalışmaktadır.
*   `overlimits_time`: filtreleme düğümü tarafından tespit edilen [Hesaplama kaynaklarının aşırı sınırlandırılması](../attacks-vulns-list.md#overlimiting-of-computational-resources) türündeki saldırıların sayısı.
*   `segfaults`: işçi sürecinin acil durumla sona erdirilmesine yol açan sorunların sayısı.
*   `memfaults`: sanal bellek limitlerine ulaşıldığına dair sorunların sayısı.
* `softmemfaults`: proton.db +lom için sanal bellek limitinin aşıldığına dair sorunların sayısı ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: proton.db hatalarının sayısı, sanal bellek limitinin aşıldığı durumlar hariç.
*   `time_detect`: isteklerin analizi için toplam süre.
*   `db_id`: proton.db versiyonu.
*   `lom_id`: yakında kullanımdan kalkacak, lütfen `custom_ruleset_id` kullanın.
*   `custom_ruleset_id`: [özel kural seti][gl-lom] oluşturma versiyonu.

    4.8 sürümünden itibaren, Prometheus formatında `wallarm_custom_ruleset_id{format="51"} 386` olarak görünür, `custom_ruleset_ver``format` özniteliği içinde ve ana değer kural seti oluşturma versiyonudur.
*   `custom_ruleset_ver` (Wallarm sürüm 4.4.3'ten itibaren kullanılabilir): [özel kural seti][gl-lom] formatı:

    * `4x` - Wallarm düğümleri 2.x için, bunlar [eski](../updating-migrating/versioning-policy.md#version-list).
    * `5x` - Wallarm düğümleri 4.x ve 3.x için, bunların sonuncusu [eski](../updating-migrating/versioning-policy.md#version-list).
*   `db_apply_time`: proton.db dosyasının son güncellemesinin Unix zamanı.
*   `lom_apply_time`: yakında kullanımdan kalkacak, lütfen `custom_ruleset_apply_time` kullanın.
*   `custom_ruleset_apply_time`: [özel kural seti](../glossary-en.md#custom-ruleset-the-former-term-is-lom) dosyasının son güncellemesinin Unix zamanı.
*   `proton_instances`: proton.db + LOM çiftleri hakkında bilgi:
    *   `total`: proton.db + LOM çiftlerinin sayısı.
    *   `success`: başarıyla yüklenen proton.db + LOM çiftlerinin sayısı.
    *   `fallback`: son kaydedilen dosyalardan yüklenen proton.db + LOM çiftlerinin sayısı.
    *   `failed`: başlatılmadı ve "analiz etme" modunda çalışan proton.db + LOM çiftlerinin sayısı.
*   `stalled_workers_count`: istek işleme süre sınırını aşan işçilerin sayısı (sınır, [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) yönergesinde ayarlanır).
*   `stalled_workers`: istek işlemesi için süre sınırını aşan işçilerin listesi (sınır, [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) yönergesinde ayarlanır) ve istek işleme üzerinde harcanan süre.
*   `ts_files`: [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom) dosyası hakkında bilgi:
    *   `id`: kullanılan LOM versiyonu.
    *   `size`: LOM dosyasının boyutu baytlar cinsinden.
    *   `mod_time`: LOM dosyasının son güncellemesinin Unix zamanı.
    *   `fname`: LOM dosyasının yolu.
*   `db_files`: proton.db dosyası hakkında bilgi:
    *   `id`: kullanılan proton.db versiyonu.
    *   `size`: proton.db dosyasının boyutu baytlar cinsinden.
    *   `mod_time`: proton.db dosyasının son güncellemesinin Unix zamanı.
    *   `fname`: proton.db dosyasının yolu.
* `startid`: rastgele oluşturulan benzersiz bir id filtreleme düğümüdür.
* `timestamp`: düğüm tarafından son gelen isteğin işlenme zamanı ([Unix Zaman Damgası](https://www.unixtimestamp.com/) formatında).
* `rate_limit`: Wallarm [oran sınırlama](../user-guides/rules/rate-limiting.md) modülü hakkında bilgi:
    * `shm_zone_size`: Wallarm oran sınırlama modülünün tüketebileceği toplam paylaşımlı bellek miktarı bayt olarak (değer [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) yönergesine dayanır, varsayılan değer `67108864` dir).
    * `buckets_count`: bucketların sayısı (genellikle NGINX işçileri sayısına eşittir, 8 en fazladır).
    * `entries`: ölçülen sınırlar için benzersiz istek noktası değerleri (aka anahtarlar) sayısı.
    * `delayed`: oran sınırlamaları modülü tarafından `patlama` ayarı nedeniyle arabelleğe alınan isteklerin sayısı.
    * `exceeded`: sınırları aştığı için oran sınırlaması modülü tarafından reddedilen isteklerin sayısı.
    * `expired`: anahtarlar için oran sınırlası aşılmadığı için düzenli 60 saniyelik bazda bucket'tan kaldırılan toplam anahtar sayısı.
    * `removed`: bucket'tan hızlıca kaldırılan anahtarların sayısı. Eğer bu değer `expired`dan daha yüksekse, [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) değerini artırmak önerilir.
    * `no_free_nodes`: `0` değerinden farklı bir değer, oran sınırlaması modülü için yeterli belleğin ayrılmadığını belirtir, [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) değerini artırmak önerilir.
* `split.clients`: her [kiracı](../installation/multi-tenant/overview.md) için ana istatistikler. Çok kiracılı özellik aktivasyon değilse, istatistikler yalnızca tek bir kiracı (hesabınız) için statik "client_id":null" değeri ile döner.
* `split.clients.applications`: her [uygulama](../user-guides/settings/applications.md) için ana istatistikler. Bu bölüme dahil edilmeyen parametreler, tüm uygulamalarla ilgili istatistikleri döndürür.

Tüm sayaçların verileri NGINX başlatıldığından itibaren birikir. Wallarm, NGINX ile hazır bir altyapıya kurulmuşsa, NGINX sunucusu, istatistik toplamayı başlatmak için yeniden başlatılmalıdır.