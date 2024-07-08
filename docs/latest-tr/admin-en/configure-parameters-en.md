[doc-nginx-install]: ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-addresses.md
[doc-us-scanner-ip-addresses]: scanner-addresses.md
[acl-access-phase]: #wallarm_acl_access_phase

# NGINX tabanlı Wallarm düğümü için yapılandırma seçenekleri

Wallarm NGINX modüller için mevcut ince ayar seçeneklerini öğrenin ve Wallarm çözümünden en iyi şekilde yararlanın.

!!! info "NGINX Resmi Dokümantasyonu"
    Wallarm yapılandırması, NGINX yapılandırmasıyla büyük ölçüde benzerlik gösterir. 
    [Resmi NGINX dokümantasyonunu görün](https://www.nginx.com/resources/admin-guide/).
    Wallarm'a özgü yapılandırma seçeneklerinin yanında, NGINX yapılandırma yeteneklerine tam anlamıyla sahipsiniz.

## Wallarm yönergeleri

### disable_acl

İstek kökenlerinin analizini devre dışı bırakmayı sağlar. Devre dışı bırakıldığında (`on`), filtreleme düğümü Wallarm Bulut'tan [IP listelerini](../user-guides/ip-lists/overview.md) indirmez ve istek kaynağı IP'lerinin analizini atlar.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.

    Varsayılan değer `off`'tur.

### wallarm_acl_access_phase

Bu yönerge, NGINX tabanlı Wallarm düğümünü, [reddedilen](../user-guides/ip-lists/denylist.md) IP'lerden gelen istekleri NGINX erişim aşamasında engellemeye zorlar:

* `wallarm_acl_access_phase on` ile Wallarm düğümü, herhangi bir [filtreleme modunda](configure-wallarm-mode.md) reddedilen IP'lerden gelen tüm istekleri hemen engeller ve reddedilen IP'lerden gelen isteklerde saldırı belirtileri aramaz.

    Bu, reddetme listesinin standart olarak çalışmasını ve düğümün CPU yükünü önemli ölçüde azaltmasını sağladığı için **varsayılan ve önerilen** değerdir.

* `wallarm_acl_access_phase kapalı` ile Wallarm düğümü, ilk olarak saldırı belirtileri için istekleri analiz eder ve ardından `block` veya `safe_blocking` modunda çalışırken, reddedilen IP'lerden gelen istekleri engeller.

    `off` filtreleme modunda, düğüm istekleri analiz etmez ve reddetme listelerini kontrol etmez.

    `monitoring` filtreleme modunda, düğüm tüm isteklerde saldırı belirtileri arar ancak hiçbirini engellemez, kaynak IP reddedilmiş olsa bile.

    `wallarm_acl_access_phase kapalı` ile Wallarm düğümünün davranışı, düğümün CPU yükünü önemli ölçüde artırır.

!!! info "Varsayılan değer ve diğer yönergelerle etkileşim"
    **Varsayılan değer**: `on` (Wallarm düğümü 4.2'den başlayarak)

    Yönerge, yalnızca NGINX yapılandırma dosyasının http bloğu içinde ayarlanabilir.

    * [`disable_acl on`](#disable_acl) ile IP listeleri işlenmez ve `wallarm_acl_access_phase` ayarlamak mantıklı olmaz.
    * `wallarm_acl_access_phase` yönergesi, [`wallarm_mode`](#wallarm_mode) üzerinde önceliğe sahiptir, bu da filtreleme düğümü modunun `off` veya `monitoring` olmasına rağmen reddedilen IP'lerden gelen isteklerin engellenmesi sonucunu doğurur (`wallarm_acl_access_phase on` ile).

### wallarm_acl_export_enable

Yönerge, düğümden Buluta [reddedilen](../user-guides/ip-lists/denylist.md) IP'lerden gelen istekler hakkında istatistikleri göndermeyi `on` / `off` durumlarına getirir.

* `wallarm_acl_export_enable on` ile reddedilen IP'lerden gelen isteklere dair istatistikler, **Olaylar** bölümünde [gösterilecektir](../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips).
* `wallarm_acl_export_enable off` ile reddedilen IP'lerden gelen isteklere dair istatistikler gösterilmez.

!!! info
    Bu parametre, http bloğu içinde ayarlanır.
    
    **Varsayılan değer**: `on`

### wallarm_api_conf

Wallarm API için erişim gereksinimlerini içeren `node.yaml` adlı dosyanın bir yoludur.

**Örnek python içeriği:**

```python
# API bağlantı kimlik bilgileri

hostname: <bazı adlar>
uuid: <bazı uuid>
secret: <bazı sırlar>

# API bağlantı parametreleri (aşağıdaki parametreler varsayılan olarak kullanılır)

api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

Filtreleme düğümünden tarayıcı isteklerini doğrudan Wallarm API'sına (Bulut) yüklemek için kullanılır, aksi takdirde postanalitik modülüne (Tarantool) yükleyin.
**Yalnızca saldırıları olan istekler API'ye gönderilir.** Saldırısı olmayan istekler kaydedilmez.

### wallarm_application

Korunan uygulamanın benzersiz kimliğini Wallarm Bulut'ta kullanmak üzere ayarlanabilir. 
Değer, `0` dışında bir pozitif tamsayı olabilir.

Hem uygulama etki alanları için hem de etki alanı yolları için benzersiz kimlikler ayarlanabilir:

=== "Etki Alanları için Kimlikler"
    **example.com** etki alanı için konfigürasyon dosyası:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 1;
        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    **test.com** etki alanı için konfigürasyon dosyası:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 2;
        location / {
                proxy_pass http://test.com;
                include proxy_params;
        }
    }
    ```
=== "Etki Alanı Dizini için Kimlikler"
    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...
        
        wallarm_mode monitoring;
        location /login {
                proxy_pass http://example.com/login;
                include proxy_params;
                wallarm_application 3;
        }
        
        location /users {
                proxy_pass http://example.com/users;
                include proxy_params;
                wallarm_application 4;
        }
    }
    ```

    [Uygulamaların kurulumuna ilişkin daha fazla ayrıntı →](../user-guides/settings/applications.md)

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.

    **Varsayılan değer**: `-1`.

### wallarm_block_page

Engellenmiş isteğe gelen yanıt ayarlanabilir.

[Engelleme sayfası ve hata kodu yapılandırması hakkında daha fazla ayrıntı →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.


### wallarm_block_page_add_dynamic_path

Bu yönerge, kodunda NGINX değişkenleri bulunan ve yolunun da bir değişken kullanılarak ayarlandığı bir engelleme sayfasının başlatılması için kullanılır. Diğer durumlarda yönerge kullanılmaz.

[Engelleme sayfası ve hata kodu yapılandırması hakkında daha fazla ayrıntı →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Bu yönerge, NGINX yapılandırma dosyasının `http` bloğu içinde ayarlanabilir.

### wallarm_cache_path

Sunucu başlatıldığında proton.db ve özel kural seti dosya kopyası depolama için yedek kataloğun oluşturulduğu bir dizin. Bu dizin, NGINX'i çalıştıran istemci tarafından yazılabilir olmalıdır.

!! info
    Bu parametre yalnızca içinde http bloğu yapılandırılır.

### wallarm_custom_ruleset_path

Korunan uygulama hakkında bilgi içeren ve filtreleme düğümü ayarlarını içeren [özel kural seti](../user-guides/rules/rules.md) dosyasının bir yoludur.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `/etc/wallarm/custom_ruleset`

### wallarm_enable_libdetection

SQL Injection saldırılarının **libdetection** kütüphanesi aracılığıyla ek doğrulanmasını etkinleştirir/devre dışı bırakır. **libdetection** kullanımı, saldırıların çift tespitini sağlar ve yanlış pozitif sayısını azaltır.

İsteklerin **libdetection** kütüphanesiyle analizi, tüm [dağıtım seçeneklerinde](../installation/supported-deployment-options.md) varsayılan olarak etkindir. Yanlış pozitif sayısını azaltmak için analiz özelliğinin etkin kalması önerilir.

[**libdetection** hakkında daha fazla ayrıntı →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "Bellek tüketiminin artması"
    libdetection kütüphanesi kullanılarak saldırıların analiz edilmesi, NGINX ve Wallarm süreçleri tarafından tüketilen bellek miktarını yaklaşık %10 artırabilir.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.

    Varsayılan değer, tüm [dağıtım seçenekleri](../installation/supported-deployment-options.md) için `on`'dır.

### wallarm_fallback

Değer `on` olarak ayarlandığında, NGINX acil bir moda giriş yeteneğine sahip olur; proton.db veya özel kurallar indirilemezse, bu ayar http, sunucu ve konum blokları için Wallarm modülünü devre dışı bırakır, NGINX işlevine devam eder.

!!! info
    Varsayılan değer `on`'dur.

    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.

### wallarm_force

NGINX'in aynılandırılmış trafiği analizini ayarlar. [NGINX ile aynılandırılmış trafiğin analizine](../installation/oob/web-server-mirroring/overview.md) bakın.

### wallarm_general_ruleset_memory_limit

proton.db ve özel kural seti örneğinin kullanabileceği bellek miktarının azami limitini belirler.

Bellek sınırı aşıldığında, kullanıcıya 500 hata verilir.

Bu parametrede şu sonekler kullanılabilir:
* ‘k’ veya ‘K’ kilobayt için
* ‘m’ veya ‘M’ megabayt için
* ‘g’ veya ‘G’ gigabayt için

**0** değeri sınırlamayı kapatır.

!!! info
    Bu parametre, http, sunucu ve/veya konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `1` GB

### wallarm_global_trainingset_path

!!! warning "Yönerge kaldırıldı"
    Wallarm düğümü 3.6 ile başlayarak, lütfen [`wallarm_protondb_path`](#wallarm_protondb_path) yönergesini kullanın. Yalnızca yönerge adını değiştirin, mantığı değişmedi.

### wallarm_file_check_interval

proton.db ve özel kural seti dosyasında yeni verilerin kontrol edilmesi arasındaki süreyi tanımlar. Ölçü birimi, aşağıdakileri belirtir:

* hiçbir sonek: dakika için
* `s`: saniye için
* `ms`: milisaniye için

!!! info
    Bu parametre sadece http bloğu içinde ayarlanır.
    
    **Varsayılan değer**: `1` (bir dakika)

### wallarm_instance

!!! warning "Yönerge kaldırıldı"
    * Yönerge korunan uygulamanın benzersiz kimliğini ayarlamak için kullanıldıysa, yalnızca adı [`wallarm_application`](#wallarm_application)'a kadar değiştirin.
    * Çok kiracılı düğümler için kiracının benzersiz kimliğini ayarlamak yerine, `wallarm_instance` yerine [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) yönergesini kullanın.
    
    Filtreleme düğümünüzün, 4.0 öncesi bir sürüm için yapılandırmasını güncelliyorsanız:

    * Filtreleme düğümünü çok kiracılık özelliği olmadan yükseltiyorsanız ve uygulamanın benzersiz kimliğini ayarlamak için kullanılan herhangi bir `wallarm_instance`'ınız varsa, bunu `wallarm_application`'a adlandırın.
    * Filtreleme düğümünü çok kiracılık özelliği ile yükseltiyorsanız, `wallarm_instance`'ları `wallarm_application` olarak kabul edin, ardından yapılandırmayı [çok kiracılı yapılandırma talimatlarına göre](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy) yeniden yazın.

### wallarm_key_path

proton.db ve özel kural seti dosyalarının şifreleme/şifre çözme için kullanılan Wallarm özel anahtarına bir yoldur.

!!! info
    **Varsayılan değer**: `/etc/wallarm/private.key` (Wallarm düğüm 3.6 ve daha düşüklerinde `/etc/wallarm/license.key`)

### wallarm_local_trainingset_path

!!! warning "Yönerge kaldırıldı"
    Wallarm düğümü 3.6 ile başlayarak, lütfen [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) yönergesini kullanın. Yalnızca yönerge adını değiştirin, mantığı değişmedi.

### wallarm_mode

Trafik işleme modu:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include-tr/wallarm-modes-description-latest.md"

`wallarm_mode` kullanımı, `wallarm_mode_allow_override` yönergesi tarafından kısıtlanabilir.

[Filtreleme modu yapılandırması hakkında detaylı talimatlar →](configure-wallarm-mode.md)

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer** filtreleme düğümü dağıtım yöntemine bağlıdır ( `off` veya `monitoring` olabilir)

### wallarm_mode_allow_override

Wallarm Bulut'tan indirilen filtreleme kuralları (özel kurallar) üzerinden [`wallarm_mode`](#wallarm_mode) değerlerinin yoksayılma yeteneğini düzenler:

- `off` - özel kurallar yoksayılır.
- `strict` - özel kurallar sadece işlem modunu güçlendirebilir.
- `on` - işlem modunu hem güçlendirmek hem de yumuşatmak mümkündür.

Örneğin, `wallarm_mode monitoring` ve `wallarm_mode_allow_override strict` ayarlandıysa, Wallarm Konsolu bazı isteklerin engellenmesini sağlamak için kullanılabilir, ancak saldırı analizi tamamen devre dışı bırakılamaz.

[Filtreleme modu yapılandırması hakkında detaylı talimatlar →](configure-wallarm-mode.md)

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

### wallarm_parse_response

Uygulamanın yanıtlarını analiz edip etmeme durumu. Yanıt analizi, [pasif tespit](../about-wallarm/detecting-vulnerabilities.md#passive-detection) ve [aktif tehdit doğrulama](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) sırasında açığı tespit etmek için gereklidir.

Olası değerler `on` (yanıt analizi etkindir) ve `off` (yanıt analizi devre dışıdır).

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

!!! warning "Performansı İyileştirme"
    Performansı iyileştirmek için, `location` ile statik dosyaların işlenmesini devre dışı bırakmanız önerilir.

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm, API Security abonelik planı kapsamında tam WebSocket desteği sağlar. Varsayılan olarak, WebSocket mesajları saldırılar için analiz edilmez.

Özelliği kullanmaya başlamak için, API Security abonelik planını etkinleştirin ve `wallarm_parse_websocket` yönergesini kullanın.

Olası değerler:

- `on`: mesaj analizi etkinleştirilmiştir.
- `off`: mesaj analizi devre dışı bırakılmıştır.

!!! info
    Bu parametre, http, sunucu ve konum bloklarında ayarlanabilir.
    
    **Varsayılan değer**: `off`

### wallarm_parser_disable

Ayrıştırıcıları devre dışı bırakmayı sağlar. Yönerge değerleri, devre dışı bırakılacak ayrıştırıcının adına karşılık gelir:

- `cookie`
- `zlib`
- `htmljs`
- `json`
- `multipart`
- `base64`
- `percent`
- `urlenc`
- `xml`
- `jwt`

**Örnek**

```bash
wallarm_parser_disable base64;
wallarm_parser_disable xml;
location /ab {
    wallarm_parser_disable json;
    wallarm_parser_disable base64;
    proxy_pass http://example.com;
}
location /zy {
    wallarm_parser_disable json;
    proxy_pass http://example.com;
}
```

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.

### wallarm_parse_html_response

Uygulama yanıtında alınan HTML koduna HTML ayrıştırıcılarını uygulayıp uygulamamayı belirler. Olası değerler `on` (HTML ayrıştırıcısı uygulanır) ve `off` (HTML ayrıştırıcısı uygulanmaz).

Bu parametre, yalnızca `wallarm_parse_response on` durumunda etkilidir.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

### wallarm_partner_client_uuid

Çok kiracılı [Wallarm düğümü](../installation/multi-tenant/overview.md) için kiracının benzersiz tanımlayıcısı. Değer, aşağıdakine benzer bir biçimde [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) biçiminde bir dize olmalıdır:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.

    Nasıl yapılır bilin:
    
    * [Kiracı oluşturma sırasında kiracının UUID'sini alın →](../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)
    * [Mevcut kiracıların UUID listesini alın →](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)
    
Yapılandırma örneği:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

Yukarıdaki yapılandırmada:

* Kiracı, ortağın müşterisini temsil eder. Ortağın 2 müşterisi vardır.
* `tenant1.com` ve `tenant1-1.com`'a hedeflenen trafik, `11111111-1111-1111-1111-111111111111` müşterisiyle ilişkilendirilmiştir.
* `tenant2.com`'a hedeflenen trafik, `22222222-2222-2222-2222-222222222222` müşterisiyle ilişkilendirilmiştir.
* İlk müşterinin ayrıca 3 uygulaması vardır, bunlar [`wallarm_application`](#wallarm_application) yönergesi aracılığıyla belirlenir:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    Bu 3 yol için hedeflenen trafik, ilgili uygulama ile ilişkilendirilir, geri kalanı ilk müşterinin genel trafiğidir.

### wallarm_process_time_limit

!!! warning "Yönerge kaldırıldı"
    Sürüm 3.6 ile başlayarak, `overlimit_res` saldırı tespitini [**Fine-tune the overlimit_res attack detection** kuralı](../user-guides/rules/configure-overlimit-res-detection.md) kullanarak ince ayarlamanız önerilir.
    
    `wallarm_process_time_limit` yönergesi geçici olarak desteklenmektedir ancak gelecekteki sürümlerde kaldırılacaktır.

Wallarm düğümünün tek bir isteği işleme süresi için bir süre limiti belirler.

Süre, limiti aştığında, bir hata günlüğe kaydedilir ve istek [`overlimit_res`](../attacks-vulns-list.md#overlimiting-of-computational-resources) saldırısı olarak işaretlenir. [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block) değerine bağlı olarak, saldırı ya engellenebilir, izlenebilir veya göz ardı edilebilir.

Değer, milisaniye cinsinden birim belirtmeden belirtilir, örneğin:

```bash
wallarm_process_time_limit 1200; # 1200 milisaniye
wallarm_process_time_limit 2000; # 2000 milisaniye
```

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: 1000ms (bir saniye).

### wallarm_process_time_limit_block

!!! warning "Yönerge kaldırıldı"
    Sürüm 3.6 ile başlayarak, `overlimit_res` saldırı tespitini [**Fine-tune the overlimit_res attack detection** kuralı](../user-guides/rules/configure-overlimit-res-detection.md) kullanarak ince ayarlamanız önerilir.
    
    `wallarm_process_time_limit_block` yönergesi geçici olarak desteklenmektedir ancak gelecekteki sürümlerde kaldırılacaktır.

Wallarm tarafından reddedilen IP'lerden kaynaklanan isteklerin engellenmesi durumunu yönetir:

- `açık`: istekler her zaman engellenir, yalnızca `wallarm_mode off` olduğunda durum değişir
- `kapalı`: istekler her zaman göz ardı edilir

    !!! warning "Koruma riski"
        `kapalı` değeri, bu değerin `overlimit_res` saldırılarından koruma özelliğini devre dışı bırakır ve dikkatli kullanılmalıdır.
        
        `kapalı` değerinin, yalnızca büyük dosyaların yüklendiği ve koruma baypası ve açığın istismar riski olmayan belirgin konumlarda kullanılması önerilir.
        
        http veya sunucu blokları için global olarak `wallarm_process_time_limit_block`'un `kapalı` olarak ayarlanması **kesinlikle önerilmez**.
    
- `saldırı`: `wallarm_mode` yönergesinde ayarlanan saldırı engelleme moduna bağlıdır:
    - `kapalı`: istekler işleme alınmaz.
    - `monitoring`: istekler göz ardı edilir ancak `overlimit_res` saldırılarına dair ayrıntılar Wallarm Buluta yüklenir ve Wallarm Konsolu'nda gösterilir.
    - `safe_blocking`: yalnızca [gri listede](../user-guides/ip-lists/graylist.md) olan IP adreslerinden kaynaklanan istekler engellenir ve tüm `overlimit_res` saldırılarının ayrıntıları Wallarm Buluta yüklenir ve Wallarm Konsolu'nda gösterilir.
    - `block`: istekler engellenir.

Önerge değerine bakılmaksızın, `overlimit_res` saldırı türündeki istekler Wallarm Buluta yüklenir, tek istisna [`wallarm_mode off;`](#wallarm_mode)'tur.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `wallarm_process_time_limit_block attack`

### wallarm_proton_log_mask_master

NGINX ana işlemi için hata ayıklama günlüğü ayarları. 

!!! warning "Yönergenin kullanımı"
    Bu yönergeyi yalnızca Wallarm destek ekibi tarafından bu yönergeyi yapılandırmanız istendiğinde kullanın. Size bu yönergenin hangi değerleri kullanmanız gerektiğini söyleyeceklerdir.
    
!!! info
    Parametre yalnızca ana düzeyde yapılandırılabilir.


### wallarm_proton_log_mask_worker

NGINX işçi süreci için hata ayıklama günlüğü ayarları. 

!!! warning "Yönergenin kullanımı"
    Bu yönergeyi yalnızca Wallarm destek ekibi tarafından bu yönergeyi yapılandırmanız istendiğinde kullanın. Size bu yönergenin hangi değerleri kullanmanız gerektiğini söyleyeceklerdir.

!!! info
    Parametre yalnızca ana düzeyde yapılandırılabilir.

### wallarm_protondb_path

İsteği filtreleme ile ilgili global ayarları içeren ve uygulama yapısına bağlı olmayan [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) dosyasına bir yol.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `/etc/wallarm/proton.db`

### wallarm_rate_limit

Aşağıdaki biçimde hız sınırlama yapılandırmasını ayarlar:

```
wallarm_rate_limit <LIMITLERİN ÖLÇÜLDÜĞÜ ANAHTAR> rate=<HIZ> burst=<BURST> delay=<DELAY>;
```

* `LIMITLERİN ÖLÇÜLDÜĞÜ ANAHTAR` - limitleri ölçmek istediğiniz bir anahtar. Metin, [NGINX değişkenleri](http://nginx.org/en/docs/varindex.html) ve onların kombinasyonunu içerebilir.

    Örneğin: `"$remote_addr +login"` aynı IP'den gelen ve `/login` uç noktasına yönelik istekleri sınırlamak için.
* `rate=<HIZ>` (gerekli) - hız sınırlaması, `rate=<number>r/s` veya `rate=<number>r/m` olabilir.
* `burst=<BURST>` (isteğe bağlı) - belirlenen HIZ/SAYI aşıldığında tamponlanacak aşırı isteklerin en fazla sayısı ve oranın normal hale gelmesi durumunda işlenir. Varsayılan değeri `0`'dır.
* `delay=<DELAY>` - `<BURST>` değeri `0`'dan farklıysa, normal hız geri geldiğinde aşırı tamponlanmış isteklerin işlenmesi arasında belirlenen HIZ/SAYI arasını korumayı kontrol edebilirsiniz. `nodelay` belirlenen hız sınırı olmadan tüm fazla tamponlanmış isteklerin aynı anda işlenmesini gösterir. Sayı değeri, belirli sayıda fazla tamponlanmış isteğin aynı anda işlenmesini gösterir, diğerleri HIZ/SAYI ile belirlenen gecikmeyle işlenir.

Örnek:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **Varsayılan değer:** yok.

    Bu parametre, http, sunucu, konum bağlamlarında ayarlanabilir.

    [Hız sınırlama](../user-guides/rules/rate-limiting.md) kuralını ayarlarsanız, `wallarm_rate_limit` yönergesi daha düşük bir önceliğe sahip olur.

### wallarm_rate_limit_enabled

Wallarm hız sınırlamasını etkinleştirir/devre dışı bırakır.

`off` ise, ne [hız sınırlama kuralı](../user-guides/rules/rate-limiting.md) (tavsiye edilen) ne de `wallarm_rate_limit` yönergesi çalışır.

!!! info
    **Varsayılan değer:** `on` ancak Wallarm hız sınırlaması, çalışmak için ya [hız sınırlama kuralı](../user-guides/rules/rate-limiting.md) (tavsiye edilen) ya da `wallarm_rate_limit` yönergesini yapılandırmanız gerekmektedir.
    
    Bu parametre, http, sunucu, location bağlamlarında ayarlanabilir.

### wallarm_rate_limit_log_level

Hız sınırlama kontrolü tarafından reddedilen isteklerin günlüğe kaydedildiği düzey. Olabilir: `info`, `notice`, `warn`, `error`.

!!! info
    **Varsayılan değer:** `error`.
    
    Bu parametre, http, sunucu, location bağlamlarında ayarlanabilir.

### wallarm_rate_limit_status_code

Wallarm hız sınırlama modülü tarafından reddedilen isteklere yanıt olarak döndürülen kodu.

!!! info
    **Varsayılan değer:** `503`.
    
    Bu parametre, http, sunucu, location bağlamlarında ayarlanabilir.

### wallarm_rate_limit_shm_size

Wallarm hız sınırlama modülünün tüketebileceği paylaşılan belleğin maksimum miktarını ayarlar.

Ortalama bir anahtar uzunluğu 64 bayt (karakter) ve `wallarm_rate_limit_shm_size`'ın 64MB olduğunda, modül yaklaşık olarak 130.000 benzersiz anahtarı aynı anda işleyebilir. Belleği iki katına çıkarmanız modülün kapasitesini doğrusal olarak iki katına çıkarır.

Bir anahtar, modülün sınırları ölçmek için kullandığı istek noktasının benzersiz değeridir. Örneğin, modül IP adreslere dayalı olarak bağlantıları sınırlıyorsa, her benzersiz IP adresi tek bir anahtar olarak kabul edilir. Varsayılan yönerge değeri ile, modül ~130.000 farklı IP'den gelen istekleri aynı anda işleyebilir.

!!! info
    **Varsayılan değer:** `64m` (64 MB).
    
    Bu parametre yalnızca http bağlamında ayarlanabilir.


### wallarm_request_chunk_size

Tek bir iterasyonda işlenen isteğin parçasının boyutu için bir sınırlama belirler. `wallarm_request_chunk_size` yönergesine byte cinsinden bir özel değer atayarak belirtin. Yönerge ayrıca takip eden ekler de destekler:
* `k` veya `K` kilobayt için
* `m` veya `M` megabayt için
* `g` veya `G` gigabayt için

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    **Varsayılan değer**: `8k` (8 kilobayt).

### wallarm_request_memory_limit

Tek bir isteğin işlenmesi için kullanılabilen bellek miktarının maksimum sınırını belirler.

Sınır aşıldığında, isteğin işlenmesi hemen sonlandırılır ve kullanıcıya bir 500 hata mesajı gönderilir.

Bu parametrede şu sonekler kullanılabilir:
* `k` veya `K` kilobayt için
* `m` veya `M` megabayt için
* `g` veya `G` gigabayt için

`0` değeri sınırlamayı kapatır.

Varsayılan olarak, sınırlamalar kapatılır.

!!! info
    Bu parametre, http, sunucu ve/veya konum blokları içinde ayarlanabilir.

### wallarm_stalled_worker_timeout

Wallarm tarafından tek bir isteğin işlenmesi için ayrılan maksimum süreyi tanımlar. Bu süre, tek bir işlemde bir isteği işleme süresine eşittir.

Süre, zaman sınırlamasını aştığında, NGINX işçileri hakkındaki bilgiler, `stalled_workers_count` ve `stalled_workers` [istatistik](configure-statistics-service.md##working-with-the-statistics-service) parametrelerine yazılır.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `5` (beş saniye)

### wallarm_status

[Wallarm istatistik hizmeti](configure-statistics-service.md) işlemini kontrol eder.

Yönergenin değeri şu formattadır:

```
wallarm_status [on|off] [format=json|prometheus];
```

Istatistik hizmetini ayrı bir yapılandırma dosyası `/etc/nginx/conf.d/wallarm-status.conf` içinde yapılandırmanız ve `wallarm_status` yönergesini NGINX'i yapılandırma sırasında kullandığınız diğer dosyalarda kullanmamanız şiddetle önerilir, çünkü bu güvensiz olabilir.

Ayrıca, sistem performansını korumak için mevcut `wallarm-status` yapılandırmasının mevcut satırlarını değiştirmemeniz önemle önerilir.

!!! info
    Yönerge, NGINX’in `server` ve/veya `location` bağlamlarında yapılandırılabilir.

    `format` parametresi varsayılan olarak `json` değerine sahiptir.

### wallarm_tarantool_upstream

`wallarm_tarantool_upstream` ile birkaç postanalytics sunucusu arasında istekler dengelenir.

**Örnek:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# dahil edilmiş

wallarm_tarantool_upstream wallarm_tarantool;
```

Ayrıca [Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)'a bakın.

!!! warning "Gerekli koşullar"
    `max_conns` ve `keepalive` parametreleri için aşağıdaki koşulların sağlanması gerekmektedir:

    * `keepalive` parametresinin değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
    * `max_conns` parametresinin değeri, aşırı bağlantıların oluşturulmasını önlemek için her bir upstream Tarantool sunucusu için belirtilmelidir.

!!! info
    Bu parametre, yalnızca http bloğu içinde ayarlanabilir

### wallarm_timeslice

Filtreleme düğümünün bir iterasyonda tek bir isteği işleme için harcadığı zamanın sınırıdır. Zaman sınırına ulaşıldığında, filtreleme düğümü sıradaki isteği işlemeye geçer. Sıradaki tüm istekler üzerinde bir iterasyon gerçekleştirdikten sonra düğüm, sıradaki isteğin ikinci iterasyonunu işlemeye başlar.

Yönergeye, [NGINX Dokümantasyonunda](https://nginx.org/en/docs/syntax.html) açıklanan zaman aralığı soneklerini kullanarak belirli zaman birimi değerleri atayabilirsiniz.

!!! info
    Bu parametre, http, sunucu ve konum blokları içinde ayarlanabilir.
    **Varsayılan değer**: `0` (tek iterasyon için zaman sınırı devre dışıdır).

-----

!!! warning
    NGINX sunucu sınırlamaları nedeniyle, `wallarm_timeslice` yönergesinin çalışması için isteği tamponlamayı devre dışı bırakmak için NGINX yönergesi `proxy_request_buffering`'in `off` değerine ayarlanmalıdır.

### wallarm_ts_request_memory_limit

!!! warning "Yönerge kaldırıldı"
    Wallarm düğümü 4.0 ile başlayarak, lütfen [`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit) yönergesini kullanın. Yalnızca yönerge adını değiştirin, mantığı değişmedi.

### wallarm_unpack_response

Uygulamanın yanıtında döndürülen sıkıştırılmış verileri çıkartıp çıkartmamayı belirler. Olası değerler `on` (çözme işlemi etkindir) ve `off` (çözme işlemi devre dışıdır).

Bu parametre, yalnızca `wallarm_parse_response on` durumunda etkilidir.

!!! info
    **Varsayılan değer**: `on`.

### wallarm_upstream_backend

Serileştirilmiş istekleri gönderme yöntemidir. İstekler, Tarantool'a veya API'ye gönderilebilir.

Yönergenin olası değerleri:
*   `tarantool`
*   `api`

Diğer yönergelere bağlı olarak, varsayılan değer şu şekilde atanacaktır:
*   `tarantool` - yapılandırmada `wallarm_api_conf` yönergesi yoksa.
*   `api` - yapılandırmada bir `wallarm_api_conf` yönergesi var, ancak `wallarm_tarantool_upstream` yönergesi yoksa.

    !!! note
        `wallarm_api_conf` ve `wallarm_tarantool_upstream` yönergeleri yapılandırmada aynı anda bulunursa, **yönerge belirsiz wallarm upstream backend** biçiminde bir yapılandırma hatası oluşur.

!!! info
    Bu parametre, sadece http bloğu içinde ayarlanabilir.

### wallarm_upstream_connect_attempts

Tarantool veya Wallarm API'ye hemen yeniden bağlanma sayısını tanımlar.
Eğer Tarantool veya API ile bağlantı kesilirse, yeniden bağlanma girişimi olmaz. Ancak, daha fazla bağlantı olmadığında ve serileştirilmiş istek kuyruğu boş olmadığında, bu durum geçerli olmaz.

!!! note
    Yeniden bağlantı, başka bir sunucu üzerinden gerçekleşebilir çünkü sunucuyu seçme işlemi "upstream" alt sisteminden sorumludur.
    
    Bu parametre, sadece http bloğu içinde ayarlanabilir.

### wallarm_upstream_reconnect_interval

Başarısız olan bağlantı girişimlerinin sayısı `wallarm_upstream_connect_attempts` eşiğini aştığında, Tarantool veya Wallarm API'ye yeniden bağlantı girişimler arasındaki süreyi tanımlar.

!!! info
    Bu parametre, sadece http bloğu içinde ayarlanabilir.


### wallarm_upstream_connect_timeout

Tarantool veya Wallarm API'ye bağlanma süre aşımını tanımlar.

!!! info
    Bu parametre, sadece http bloğu içinde ayarlanabilir.


### wallarm_upstream_queue_limit

Serileştirilmiş isteklerin sayısına bir sınırlama belirler.
`wallarm_upstream_queue_limit` parametresini ayarlarken ve `wallarm_upstream_queue_memory_limit` parametresini ayarlamazsanız, ikincisinin üzerinde hiçbir sınırlama olmayacaktır.

!!! info
    Bu parametre, sadece http bloğu içinde ayarlanabilir.

### wallarm_upstream_queue_memory_limit

Serileştirilmiş isteklerin toplam hacmine bir sınırlama belirler.
`wallarm_upstream_queue_memory_limit` parametresini ayarlarken ve `wallarm_upstream_queue_limit` parametresini ayarlamazsanız, ikincisinin üzerinde hiçbir sınırlama olmayacaktır.

!!! info
    **Varsayılan değer:** `100m`.
    
    Bu parametre, sadece http bloğu içinde ayarlanabilir.