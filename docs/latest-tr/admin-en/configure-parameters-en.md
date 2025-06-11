```markdown
[doc-nginx-install]:    ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:            #wallarm_acl_access_phase

# NGINX Tabanlı Wallarm Node'u için Yapılandırma Seçenekleri

Wallarm çözümünden en iyi şekilde yararlanmak için [self-hosted Wallarm NGINX node](../installation/nginx-native-node-internals.md#nginx-node) üzerinde mevcut olan ince ayar seçeneklerini öğrenin.

!!! info "NGINX Resmi Belgeleri"
    Wallarm yapılandırması NGINX yapılandırmasına çok benzer. [Resmi NGINX belgelerine bakın](https://www.nginx.com/resources/admin-guide/). Wallarm’a özgü yapılandırma seçeneklerine ek olarak, NGINX yapılandırmasının tüm yeteneklerine sahipsiniz.

## Wallarm Yönergeleri

### disable_acl

İsteklerin kaynaklarının analizini devre dışı bırakmayı sağlar. Eğer devre dışı bırakılırsa (`on`), filtreleme node’u Wallarm Cloud’dan [IP listesini](../user-guides/ip-lists/overview.md) indirmez ve istek kaynak IP’lerinin analizini atlar.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    Varsayılan değer `off`'dur.

### wallarm_acl_access_phase

Bu yönerge, NGINX tabanlı Wallarm node’unun NGINX erişim aşamasında, [denylisted](../user-guides/ip-lists/overview.md) IP'lerden gelen istekleri engellemesini zorunlu kılar; bu da şunları ifade eder:

* `wallarm_acl_access_phase on` ile, Wallarm node denylisted IP’lerden gelen istekleri, herhangi bir [filtreleme modunda](configure-wallarm-mode.md) ( `off` hariç) derhal engeller ve denylisted IP’lerden gelen isteklerde saldırı belirtilerini aramaz.

    Bu, **varsayılan ve önerilen** değerdir çünkü denylistlerin standart şekilde çalışmasını sağlar ve node’un CPU yükünü önemli ölçüde azaltır.

* `wallarm_acl_access_phase off` ile, Wallarm node önce isteklerde saldırı belirtilerini analiz eder ve ardından `block` veya `safe_blocking` modunda çalışıyorsa denylisted IP’lerden gelen istekleri engeller.

    `monitoring` filtreleme modunda, node tüm isteklerde saldırı belirtilerini arar ama kaynak IP denylisted olsa bile bunları asla engellemez.

    `wallarm_acl_access_phase off` ile Wallarm node davranışı, node’un CPU yükünü önemli ölçüde arttırır.

!!! info "Varsayılan Değer ve Diğer Yönergelerle Etkileşim"
    **Varsayılan değer**: `on` (Wallarm node 4.2'den itibaren)

    Bu yönerge yalnızca NGINX yapılandırma dosyasının http bloğu içinde ayarlanabilir.

    * Wallarm mode `off` veya [`disable_acl on`](#disable_acl) kullanıldığında, IP listeleri işlenmez ve `wallarm_acl_access_phase` etkinleştirmenin bir anlamı yoktur.
    * `wallarm_acl_access_phase` yönergesi, [`wallarm_mode`](#wallarm_mode) üzerinde önceliğe sahiptir; bu, filtreleme node modunun `monitoring` olması durumunda bile denylisted IP’lerden gelen isteklerin engellenmesiyle sonuçlanır ( `wallarm_acl_access_phase on` ile).

### wallarm_acl_export_enable

Bu yönerge, node’dan Cloud’a denylisted [IP’lerden](../user-guides/ip-lists/overview.md) gelen isteklerle ilgili istatistiklerin gönderilmesini `on` ile/ `off` ile devre dışı bırakır.

* `wallarm_acl_export_enable on` ile denylisted IP’lerden gelen istek istatistikleri **Attacks** bölümünde [görüntülenecektir](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).
* `wallarm_acl_export_enable off` ile denylisted IP’lerden gelen istek istatistikleri görüntülenmeyecektir.

!!! info
    Bu parametre http bloğu içinde ayarlanır.
    
    **Varsayılan değer**: `on`

### wallarm_api_conf

Wallarm API için erişim gereksinimlerini içeren `node.yaml` dosyasının yolunu belirtir.

**Örnek**: 
```
wallarm_api_conf /etc/wallarm/node.yaml

# Docker NGINX-tabanlı imaj, Cloud imajı ve All-in-one installer kurulumları
# wallarm_api_conf /opt/wallarm/etc/wallarm/node.yaml
```

Filtreleme node’undan serileştirilmiş isteklerin, postanalytics modülü (Tarantool) yerine doğrudan Wallarm API’ya (Cloud) yüklenmesi için kullanılır.
**Saldırı içeren istekler yalnızca API’ya gönderilir.** Saldırı içermeyen istekler kaydedilmez.

**node.yaml dosya içeriğine örnek:**

``` yaml
# API bağlantı kimlik bilgileri

hostname: <some name>
uuid: <some uuid>
secret: <some secret>

# API bağlantı parametreleri (aşağıdaki parametreler varsayılan olarak kullanılır)

host: api.wallarm.com
port: 443
ca_verify: true
```

### wallarm_application

Wallarm Cloud’da kullanılacak korumalı uygulamanın benzersiz tanımlayıcısı. Değer `0` hariç pozitif bir tamsayı olabilir.

Benzersiz tanımlayıcılar, hem uygulama domain’leri hem de domain yolaları için ayarlanabilir, örneğin:

=== "Domainlar için Tanımlayıcılar"
    **example.com** domain’i için yapılandırma dosyası:

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

    **test.com** domain’i için yapılandırma dosyası:

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
=== "Domain Yolları için Tanımlayıcılar"
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

[Uygulama kurulumuna dair daha fazla ayrıntı →](../user-guides/settings/applications.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    **Varsayılan değer**: `-1`.

### wallarm_block_page

Engellenen isteğe verilecek yanıtı ayarlamanızı sağlar.

[Engelleme sayfası ve hata kodu yapılandırmasına dair daha fazla ayrıntı →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

### wallarm_block_page_add_dynamic_path

NGINX değişkenlerini içeren koda sahip engelleme sayfasını başlatmak için kullanılır ve bu engelleme sayfasının yolu da bir değişken kullanılarak ayarlanır. Aksi takdirde, yönerge kullanılmaz.

[Engelleme sayfası ve hata kodu yapılandırmasına dair daha fazla ayrıntı →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Yönerge yalnızca NGINX yapılandırma dosyasının `http` bloğu içinde ayarlanabilir.

### wallarm_cache_path

Sunucu başladığında proton.db ve özel kurallar seti dosya kopyalarının yedek kataloğunun oluşturulduğu dizin. Bu dizinin NGINX’i çalıştıran istemci için yazılabilir olması gerekir.

!!! info
    Bu parametre yalnızca http bloğu içinde yapılandırılır.

### wallarm_custom_ruleset_path

Korunan uygulama ve filtreleme node ayarları hakkında bilgiler içeren [özel kurallar seti](../user-guides/rules/rules.md) dosyasına giden yolu belirtir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**:
    
    * Docker NGINX-tabanlı imaj, Cloud imajları, NGINX Node all-in-one installer ve Native Node kurulumları için: `/opt/wallarm/etc/wallarm/custom_ruleset`
    * Diğer kurulum bileşenleri için: `/etc/wallarm/custom_ruleset`

### wallarm_enable_apifw

[API Specification Enforcement](../api-specification-enforcement/overview.md)'ı etkinleştirmek için `on` / devre dışı bırakmak için `off` değeri atar; özellik 4.10 sürümünden itibaren mevcuttur. Bu özelliği etkinleştirmenin Wallarm Console UI üzerinden gerekli abonelik ve yapılandırmanın yerini almadığına dikkat edin.

!!! info
    Bu parametre `server` blokları içinde ayarlanabilir.

    **Varsayılan değer**: `on`.

### wallarm_enable_libdetection

**libdetection** kütüphanesi aracılığıyla SQL Injection saldırılarının ek doğrulamasını etkinleştirir/devre dışı bırakır. **libdetection** kullanmak, saldırıların çift tespitini sağlar ve yanlış pozitiflerin sayısını azaltır.

**libdetection** kütüphanesini kullanarak isteklerin analizi, tüm [kurulum seçeneklerinde](../installation/supported-deployment-options.md) varsayılan olarak etkindir. Yanlış pozitiflerin sayısını azaltmak için analizin etkin kalmasını öneririz.

[**libdetection** hakkında daha fazla ayrıntı →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "Bellek tüketiminin artması"
    libdetection kütüphanesini kullanarak saldırıları analiz ettiğinizde, NGINX ve Wallarm süreçlerinin tükettiği bellek miktarı yaklaşık %10 artabilir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    Varsayılan değer, tüm [kurulum seçeneklerinde](../installation/supported-deployment-options.md) `on`'dur.

### wallarm_fallback

Değer `on` olarak ayarlandığında, NGINX acil moda geçme yeteneğine sahiptir; eğer proton.db veya özel kurallar seti indirilemezse, bu ayar ilgili http, server ve location blokları için Wallarm modülünü devre dışı bırakır. NGINX çalışmaya devam eder.

!!! info
    Varsayılan değer `on`'dur.

    Bu parametre http, server ve location blokları içinde ayarlanabilir.

### wallarm_file_check_interval

proton.db ve özel kurallar seti dosyasında yeni verilerin kontrolü arasındaki zaman aralığını tanımlar. Ölçü birimi aşağıdaki ekler ile belirtilir:
* Dakika için ek kullanılmaz.
* Saniye için `s`
* Milisaniye için `ms`

!!! info
    Bu parametre yalnızca http bloğu içinde yapılandırılır.
    
    **Varsayılan değer**: `1` (bir dakika)

### wallarm_force

NGINX aynalanan trafiğine dayalı istek analizini ve özel kural üretimini ayarlar. Detaylı bilgi için [NGINX ile aynalanan trafiğin analizi →](../installation/oob/web-server-mirroring/overview.md).

### wallarm_general_ruleset_memory_limit

proton.db ve özel kurallar setinin her bir instance’ı tarafından kullanılabilecek maksimum bellek miktarına limit koyar.

İşleme sırasında bellek limiti aşılırsa, kullanıcı 500 hatası alacaktır.

Bu parametrede aşağıdaki ekler kullanılabilir:
* Kilobayt için `k` veya `K`
* Megabayt için `m` veya `M`
* Gigabayt için `g` veya `G`

**0** değeri limiti kapatır.

!!! info
    Bu parametre http, server ve/veya location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `1` GB

### wallarm_global_trainingset_path

!!! warning "Yönerge kullanımdan kalkmıştır"
    Wallarm node 3.6'dan itibaren, lütfen yerine [`wallarm_protondb_path`](#wallarm_protondb_path) yönergesini kullanın. Yalnızca yönerge adını değiştirin, mantığı değişmedi.

### wallarm_http_v2_stream_max_len

Bu yönerge, bir HTTP/2 stream’inin bayt cinsinden izin verilen maksimum uzunluğunu belirler. Belirtilen değerin yarısına ulaşıldığında, HTTP/2 `GOAWAY` çerçevesi, stream’in düzgün sonlanabilmesi için istemciye gönderilir. Eğer stream kapatılmaz ve maksimum uzunluğa ulaşılırsa, NGINX bağlantıyı zorla sonlandırır.

Bu seçenek yapılandırılmamışsa, stream uzunlukları sınırsız kalır ve özellikle uzun ömürlü bağlantılara sahip gRPC ortamlarında NGINX sürecinde sınırlandırılmamış bellek tüketimine neden olabilir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    Yönergenin varsayılan değeri yoktur; HTTP/2 stream’lerinin uzunluğu için varsayılan olarak hiçbir limit yoktur.

### wallarm_instance

!!! warning "Yönerge kullanımdan kalkmıştır"
    * Eğer yönerge, korumalı uygulamanın benzersiz tanımlayıcısını ayarlamak için kullanıldıysa, adını sadece [`wallarm_application`](#wallarm_application) olarak değiştirin.
    * Multi-tenant node'lar için tenant’ın benzersiz tanımlayıcısını ayarlamak amacıyla, `wallarm_instance` yerine [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) yönergesini kullanın.

    4.0 öncesi sürümler için kullanılan filtreleme node yapılandırmanız güncellenirken:

    * Eğer multi-tenancy özelliği olmadan filtreleme node’unuzu yükseltiyorsanız ve korumalı uygulamanın benzersiz tanımlayıcısını ayarlamak için herhangi bir `wallarm_instance` kullanıyorsanız, ismini `wallarm_application` olarak değiştirin.
    * Eğer multi-tenancy özelliğiyle filtreleme node’unuzu yükseltiyorsanız, tüm `wallarm_instance` değerlerini `wallarm_application` olarak kabul edin, ardından [multi-tenancy yeniden yapılandırma talimatlarına](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy) göre yapılandırmayı yeniden düzenleyin.

### wallarm_key_path

proton.db ve özel kurallar seti dosyalarının şifreleme/çözme işlemi için kullanılan Wallarm özel anahtarına giden yol.

!!! info
    **Varsayılan değer**:
    
    * Docker NGINX-tabanlı imaj, Cloud imajları, NGINX Node all-in-one installer ve Native Node kurulumları için: `/opt/wallarm/etc/wallarm/private.key`
    * Diğer kurulum bileşenleri için: `/etc/wallarm/private.key`


### wallarm_local_trainingset_path

!!! warning "Yönerge kullanımdan kalkmıştır"
    Wallarm node 3.6'dan itibaren, lütfen yerine [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) yönergesini kullanın. Yalnızca yönerge adını değiştirin, mantığı değişmedi.

### wallarm_memlimit_debug

Bu yönerge, Wallarm NGINX modülünün, bir isteğin işlenmesi sırasında bellek limiti aşıldığında, istek detaylarını içeren `/tmp/proton_last_memlimit.req` dosyasını oluşturup oluşturmayacağını belirler. Bu, istek bellek limiti işlemesi ile ilgili sorunların giderilmesinde çok değerli olabilir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`.

### wallarm_mode

Trafik işleme modu:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-5.0.md"

`wallarm_mode` kullanımı, Wallarm Cloud’dan indirilen filtreleme kuralları aracılığıyla değerlerin değiştirilmesi `wallarm_mode_allow_override` yönergesi ile kısıtlanabilir.

[Filtreleme modu yapılandırmasına dair detaylı talimatlar →](configure-wallarm-mode.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**; filtreleme node kuruluma yöntemine bağlı olarak ( `off` veya `monitoring` olabilir)

### wallarm_mode_allow_override

Wallarm Cloud’dan indirilen filtreleme kuralları (özel kurallar seti) üzerinden [`wallarm_mode`](#wallarm_mode) değerlerinin geçersiz kılınabilme yeteneğini yönetir:

- `off` - özel kurallar göz ardı edilir.
- `strict` - özel kurallar yalnızca çalışma modunu güçlendirebilir.
- `on` - çalışma modunun güçlendirilmesi ve yumuşatılması mümkündür.

Örneğin, `wallarm_mode monitoring` ve `wallarm_mode_allow_override strict` ayarlandığında, Wallarm Console bazı isteklerin engellenmesini etkinleştirebilir, ancak saldırı analizinin tamamen devre dışı bırakılmasına izin vermez.

[Filtreleme modu yapılandırmasına dair detaylı talimatlar →](configure-wallarm-mode.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

### wallarm_parse_response

Uygulama yanıtlarını analiz edip etmeyeceğini belirler. Yanıt analizi, [passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection) sırasında ve [threat replay testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) sırasında zafiyet tespiti için gereklidir. 

Olası değerler `on` (yanıt analizi etkin) ve `off` (yanıt analizi devre dışı).

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

!!! warning "Performansı Artırma"
    Statik dosyaların işlenmesini `location` üzerinden devre dışı bırakmanızı öneririz.

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm, API Security abonelik planı kapsamında tam WebSockets desteği sağlar. Varsayılan olarak, WebSocket mesajları saldırı açısından analiz edilmez.

Özelliği zorunlu kılmak için, API Security abonelik planını etkinleştirin ve `wallarm_parse_websocket` yönergesini kullanın.

Olası değerler:

- `on`: mesaj analizi etkin.
- `off`: mesaj analizi devre dışı.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `off`

### wallarm_parser_disable

Parçacıları devre dışı bırakmayı sağlar. Yönerge değerleri, devre dışı bırakılacak parçacının adı ile eşleşir:

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

```
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
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

### wallarm_parse_html_response

Uygulama yanıtında alınan HTML koduna HTML parçacılarının uygulanıp uygulanmayacağını belirtir. Olası değerler `on` (HTML parçacısı uygulanır) ve `off` (HTML parçacısı uygulanmaz).

Bu parametre yalnızca `wallarm_parse_response on` olduğu durumda etkindir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

### wallarm_partner_client_uuid

[Multi-tenant](../installation/multi-tenant/overview.md) Wallarm node'u için tenant’ın benzersiz tanımlayıcısı. Değer, örneğin:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

olarak [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) formatında bir dize olmalıdır.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    Nasıl:
    
    * [Tenant oluşturulurken UUID’nin nasıl alınacağını →](../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)
    * [Mevcut tenantların UUID listesini nasıl alacağınızı →](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)
    
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

* Tenant, partner’ın müşterisini ifade eder. Partnerin 2 müşterisi vardır.
* `tenant1.com` ve `tenant1-1.com`'a yönelik trafik, `11111111-1111-1111-1111-111111111111` kimliğine sahip müşteriyle ilişkilendirilecektir.
* `tenant2.com`'a yönelik trafik, `22222222-2222-2222-2222-222222222222` kimliğine sahip müşteriyle ilişkilendirilecektir.
* İlk müşterinin ayrıca [`wallarm_application`](#wallarm_application) yönergesiyle belirtilen 3 uygulaması vardır:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    Bu 3 yola yönelik trafik, ilgili uygulamayla ilişkilendirilecek, kalan trafik ilk müşterinin genel trafiği olacaktır.

### wallarm_process_time_limit

!!! warning "Yönerge kullanımdan kalkmıştır"
    3.6 sürümünden itibaren, `overlimit_res` saldırı tespitini [**İstek İşleme Süresi Sınırını Ayarlama**](../user-guides/rules/configure-overlimit-res-detection.md) kuralı kullanılarak ince ayar yapmanız önerilir (önceki adıyla "Overlimit_res saldırı tespitini ince ayar yapma").
    
    `wallarm_process_time_limit` yönergesi geçici olarak desteklenmektedir, ancak gelecekte kaldırılacaktır.

Wallarm node tarafından tek bir isteğin işlenmesi için zaman sınırını ayarlar.

Eğer süre sınırı aşılırsa, günlükte bir hata kaydedilir ve istek [`overlimit_res`](../attacks-vulns-list.md#resource-overlimit) saldırısı olarak işaretlenir. [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block) değerine bağlı olarak, saldırı ya engellenir, izlenir ya da yok sayılır.

Değer, birim belirtmeden milisaniye cinsinden belirtilir, örneğin:

```bash
wallarm_process_time_limit 1200; # 1200 milisaniye
wallarm_process_time_limit 2000; # 2000 milisaniye
```

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: 1000ms (bir saniye).

### wallarm_process_time_limit_block

!!! warning "Yönerge kullanımdan kalkmıştır"
    3.6 sürümünden itibaren, `overlimit_res` saldırı tespitini [**İstek İşleme Süresi Sınırını Ayarlama**](../user-guides/rules/configure-overlimit-res-detection.md) kuralı kullanılarak ince ayar yapmanız önerilir (önceki adıyla "Overlimit_res saldırı tespitini ince ayar yapma").
    
    `wallarm_process_time_limit_block` yönergesi geçici olarak desteklenmektedir, ancak gelecekte kaldırılacaktır.

`wallarm_process_time_limit` yönergesi ile belirlenen süre sınırını aşan isteklerin engellenmesini yönetme yeteneğini belirler:

- `on`: istekler her zaman, `wallarm_mode off` dışında engellenir.
- `off`: istekler her zaman yok sayılır.

    !!! warning "Koruma atlatma riski"
        `off` değeri, `overlimit_res` saldırılarından korumayı devre dışı bırakır, bu sebeple dikkatli kullanılmalıdır.
        
        `off` değerini yalnızca büyük dosya yüklemelerinin yapıldığı ve koruma atlatma riski olmayan, zafiyet istismarı riski bulunmayan belirli konumlarda kullanmanız önerilir.
        
        **http veya server blokları için global olarak `wallarm_process_time_limit_block` değerini `off` olarak ayarlamanız kesinlikle önerilmez.**
    
- `attack`: `wallarm_mode` yönergesi ile ayarlanan saldırı engelleme moduna bağlı:
    - `off`: istekler işlenmez.
    - `monitoring`: istekler yok sayılır, ancak `overlimit_res` saldırılarıyla ilgili detaylar Wallarm Cloud’a yüklenir ve Wallarm Console’da görüntülenir.
    - `safe_blocking`: yalnızca [graylisted](../user-guides/ip-lists/overview.md) IP adreslerinden gelen istekler engellenir ve tüm `overlimit_res` saldırılarına ait detaylar Wallarm Cloud’a yüklenir ve Wallarm Console’da görüntülenir.
    - `block`: istekler engellenir.

Yönerge değerinden bağımsız olarak, [`wallarm_mode off;`](#wallarm_mode) dışındaki durumlarda, `overlimit_res` saldırı tipine ait istekler Wallarm Cloud’a yüklenir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `wallarm_process_time_limit_block attack`

### wallarm_proton_log_mask_master

NGINX master sürecinin hata ayıklama günlüğü için ayarlar.

!!! warning "Yönergeyi kullanırken"
    Bu yönergeyi yalnızca Wallarm destek ekibi tarafından size belirtilen değeri kullanmanız gerektiğinde yapılandırmanız gerekir.

!!! info
    Parametre yalnızca ana düzeyde yapılandırılabilir.


### wallarm_proton_log_mask_worker

NGINX worker sürecinin hata ayıklama günlüğü için ayarlar.

!!! warning "Yönergeyi kullanırken"
    Bu yönergeyi yalnızca Wallarm destek ekibi size belirtilen değeri kullanmanız gerektiğinde yapılandırmanız gerekir.

!!! info
    Parametre yalnızca ana düzeyde yapılandırılabilir.

### wallarm_protondb_path

Uygulama yapısına bağlı olmayan, istek filtrelemesi için küresel ayarları içeren [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) dosyasına giden yol.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**:
    
    * Docker NGINX-tabanlı imaj, Cloud imajları, NGINX Node all-in-one installer ve Native Node kurulumları için: `/opt/wallarm/etc/wallarm/proton.db`
    * Diğer kurulum bileşenleri için: `/etc/wallarm/proton.db`

### wallarm_rate_limit

Aşağıdaki formatta rate limiting yapılandırmasını ayarlar:

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - limit ölçmek istediğiniz anahtar. Metin, [NGINX değişkenleri](http://nginx.org/en/docs/varindex.html) ve bunların kombinasyonunu içerebilir.

    Örneğin: `/login` uç noktasına yönelik aynı IP’den gelen istekleri sınırlamak için `"$remote_addr +login"`.
* `rate=<RATE>` (zorunlu) - rate limiti, `rate=<number>r/s` veya `rate=<number>r/m` formatında olabilir.
* `burst=<BURST>` (opsiyonel) - belirtilen RPS/RPM aşıldığında tamponlanacak maksimum fazla istek sayısı; RPS/RPM normale döndüğünde işlenecektir. Varsayılan `0`'dır.
* `delay=<DELAY>` - `<BURST>` değeri `0`'dan farklıysa, tanımlı RPS/RPM arasında tamponlanan fazla isteklerin yürütülmesi sırasında gecikmeyi kontrol edebilirsiniz. `nodelay`, tüm tamponlanan fazla isteklerin hız limitlendirmesi olmadan eşzamanlı işlenmesini, sayısal bir değer ise belirtilen fazla istek sayısının eşzamanlı işlenmesini ve kalanların RPS/RPM’de ayarlanan gecikme ile işlenmesini belirtir.

Örnek:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **Varsayılan değer:** bulunmamaktadır.

    Bu parametre http, server ve location bağlamları içinde ayarlanabilir.

    [Rate limiting](../user-guides/rules/rate-limiting.md) kuralını ayarlarsanız, `wallarm_rate_limit` yönergesinin önceliği daha düşüktür.

### wallarm_rate_limit_enabled

Wallarm rate limiting’i etkinleştirir/devre dışı bırakır.

`off` ise, [rate limiting kuralı](../user-guides/rules/rate-limiting.md) (önerilir) veya `wallarm_rate_limit` yönergesi çalışmaz.

!!! info
    **Varsayılan değer:** `on`, ancak Wallarm rate limiting, [rate limiting kuralı](../user-guides/rules/rate-limiting.md) (önerilir) veya `wallarm_rate_limit` yönergesi yapılandırılmadan çalışmaz.
    
    Bu parametre http, server ve location bağlamları içinde ayarlanabilir.

### wallarm_rate_limit_log_level

Rate limiting kontrolü tarafından reddedilen isteklerin günlüğe kaydedilmesinde kullanılacak log seviyesini ayarlar. Olası değerler: `info`, `notice`, `warn`, `error`.

!!! info
    **Varsayılan değer:** `error`.
    
    Bu parametre http, server ve location bağlamları içinde ayarlanabilir.

### wallarm_rate_limit_status_code

Wallarm rate limiting modülü tarafından reddedilen isteklere cevap olarak döndürülecek kodu ayarlar.

!!! info
    **Varsayılan değer:** `503`.
    
    Bu parametre http, server ve location bağlamları içinde ayarlanabilir.

### wallarm_rate_limit_shm_size

Wallarm rate limiting modülünün kullanabileceği paylaşılan belleğin maksimum miktarını ayarlar.

Ortalama 64 bayt (karakter) uzunluğunda bir anahtar ile, `wallarm_rate_limit_shm_size` 64MB olarak ayarlanırsa, modül yaklaşık 130.000 benzersiz anahtarı aynı anda işleyebilir. Belleğin iki katına çıkarılması, modül kapasitesini lineer olarak ikiye katlar.

Bir anahtar, modülün limit ölçümü için kullandığı bir isteğin benzersiz değeridir. Örneğin, modül IP adreslerine dayalı bağlantıları sınırlıyorsa, her benzersiz IP bir anahtar olarak kabul edilir. Varsayılan yönerge değeriyle, modül ~130.000 farklı IP’den gelen istekleri aynı anda işleyebilir.

!!! info
    **Varsayılan değer:** `64m` (64 MB).
    
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_request_chunk_size

Bir yineleme sırasında işlenen istek parçasının boyutunu sınırlar. İstek için kullanılacak özel `wallarm_request_chunk_size` değeri bayt cinsinden bir tamsayı atanarak ayarlanabilir. Yönerge ayrıca aşağıdaki eklere de destek verir:
* Kilobayt için `k` veya `K`
* Megabayt için `m` veya `M`
* Gigabayt için `g` veya `G`

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    **Varsayılan değer**: `8k` (8 kilobayt).

### wallarm_request_memory_limit

Tek bir isteğin işlenmesi için kullanılabilecek maksimum bellek miktarına limit koyar.

Limit aşıldığında, istek işlenmesi kesilir ve kullanıcı 500 hatası alır.

Bu parametrede aşağıdaki ekler kullanılabilir:
* Kilobayt için `k` veya `K`
* Megabayt için `m` veya `M`
* Gigabayt için `g` veya `G`

`0` değeri limiti kapatır.

Varsayılan olarak, limit kapalıdır. 

!!! info
    Bu parametre http, server ve/veya location blokları içinde ayarlanabilir.

### wallarm_srv_include

[API Specification Enforcement](../api-specification-enforcement/overview.md) için yapılandırma dosyasına giden yolu belirtir. Bu dosya varsayılan olarak tüm kurulum bileşenleriyle birlikte gelir ve genellikle herhangi bir değişiklik gerekmez.

Ancak, [özel `nginx.conf` dosyasına sahip NGINX-tabanlı Docker imajı](installation-docker-en.md#run-the-container-mounting-the-configuration-file) kullanıyorsanız, bu yönergeyi belirtmeniz ve dosyayı belirtilen yola yerleştirmeniz gerekir.

Yönerge 4.10.7 sürümünden itibaren mevcuttur.

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.

    **Varsayılan değer**: `/etc/nginx/wallarm-apifw-loc.conf;`.

### wallarm_stalled_worker_timeout

Bir NGINX worker’ın tek bir isteği işleme süresi için zaman sınırını saniye cinsinden ayarlar.

Süre sınırı aşıldığında, NGINX worker'lara ilişkin veriler `stalled_workers_count` ve `stalled_workers` adlı [istatistik](configure-statistics-service.md#usage) parametrelerine yazılır.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `5` (beş saniye)

### wallarm_status

[Wallarm istatistik hizmetini](configure-statistics-service.md) kontrol eder.

Yönerge değeri aşağıdaki formatta olmalıdır:

```
wallarm_status [on|off] [format=json|prometheus];
```

İstatistik hizmetini ayrı bir dosyada yapılandırmanız, diğer NGINX yapılandırma dosyalarında `wallarm_status` yönergesinin kullanılmasından kaçınmanız şiddetle tavsiye edilir, çünkü bu yöntem güvensiz olabilir. `wallarm-status` için yapılandırma dosyası:
 
* All-in-one installer için: `/etc/nginx/wallarm-status.conf`
* Diğer kurulumlar için: `/etc/nginx/conf.d/wallarm-status.conf`

Ayrıca, metric verilerinin Wallarm Cloud’a yükleme sürecini bozabileceği için varsayılan `wallarm-status` yapılandırmasındaki hiçbir satırın değiştirilmemesi şiddetle tavsiye edilir.

!!! info
    Yönerge NGINX’in `server` ve/veya `location` bağlamında yapılandırılabilir.

    `format` parametresinin varsayılan değeri `json`'dur.

### wallarm_tarantool_upstream

`wallarm_tarantool_upstream` ile postanalytics sunucuları arasında istek dengelemesi yapabilirsiniz.

**Örnek:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# atlandı

wallarm_tarantool_upstream wallarm_tarantool;
```

Ayrıca [Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)'a da bakın.

!!! warning "Gerekli koşullar"
    `max_conns` ve `keepalive` parametreleri için aşağıdaki koşullar sağlanmalıdır:

    * `keepalive` parametresinin değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
    * Her Tarantool upstream sunucusu için `max_conns` parametresi belirtilmelidir, böylece aşırı bağlantı kurulmasının önüne geçilir.

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.

### wallarm_timeslice

Filtreleme node’unun, bir isteğin işlenmesinde bir yineleme için harcadığı zamanı sınırlar. Bir istekte belirlenen zaman sınırına ulaşıldığında, filtreleme node kuyruğundaki bir sonraki isteğe geçer. Kuyruktaki her istekte bir kez yineleme yaptıktan sonra, node kuyruğun ilk isteğinde ikinci yinelemeyi gerçekleştirir.

Bu yönergeye, NGINX belgelerinde tarif edilen [zaman aralığı eklerini](https://nginx.org/en/docs/syntax.html) kullanarak farklı zaman birimlerinin atanması mümkündür.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    **Varsayılan değer**: `0` (tek yineleme için zaman sınırı devre dışıdır).

-----

!!! warning
    NGINX sunucu sınırlamaları nedeniyle, `wallarm_timeslice` yönergesinin çalışabilmesi için NGINX `proxy_request_buffering` yönergesine `off` değeri atanarak istek tamponlaması devre dışı bırakılmalıdır.

### wallarm_ts_request_memory_limit

!!! warning "Yönerge kullanımdan kalkmıştır"
    Wallarm node 4.0'dan itibaren, lütfen yerine [`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit) yönergesini kullanın. Yalnızca yönerge adını değiştirin, mantığı değişmedi.

### wallarm_unpack_response

Uygulama yanıtında dönen sıkıştırılmış verilerin açılıp açılmayacağını belirler. Olası değerler `on` (sıkıştırma açılır) ve `off` (sıkıştırma açılmaz).

Bu parametre yalnızca `wallarm_parse_response on` olduğu durumda etkindir.

!!! info
    **Varsayılan değer**: `on`.

### wallarm_upstream_backend

Serileştirilmiş isteklerin gönderilme yöntemini belirler. İstekler ya Tarantool’a ya da API’ye gönderilebilir.

Olası yönerge değerleri:
*   `tarantool`
*   `api`

Diğer yönergelere bağlı olarak, varsayılan değer aşağıdaki şekilde atanır:
*   `tarantool` - yapılandırmada `wallarm_api_conf` yönergesi yoksa.
*   `api` - yapılandırmada `wallarm_api_conf` yönergesi varsa, ancak `wallarm_tarantool_upstream` yönergesi yoksa.

    !!! note
        Eğer yapılandırmada hem `wallarm_api_conf` hem de `wallarm_tarantool_upstream` yönergeleri aynı anda mevcutsa, **directive ambiguous wallarm upstream backend** şeklinde bir yapılandırma hatası alınır.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_upstream_connect_attempts

Tarantool ya da Wallarm API’ye anında yeniden bağlanma denemelerinin sayısını belirler.
Tarantool veya API'ye yapılan bağlantı kesilirse yeniden bağlanma denemesi yapılmaz. Ancak, artık başka bağlantı kalmadığında ve serileştirilmiş istek kuyruğu boş olmadığında durum farklılık gösterir.

!!! note
    Yeniden bağlanma, "upstream" alt sisteminin sunucuyu seçmesinden dolayı başka bir sunucu üzerinden gerçekleşebilir.
    
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_upstream_reconnect_interval

Tarantool veya Wallarm API’ye yeniden bağlanma denemelerinin, `wallarm_upstream_connect_attempts` eşiği aşıldıktan sonra yapılacak olan deneme aralığını belirler.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_upstream_connect_timeout

Tarantool veya Wallarm API’ye bağlanmak için zaman aşımını belirler.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_upstream_queue_limit

Serileştirilmiş isteklerin sayısına getirilecek limiti belirler.
Aynı anda `wallarm_upstream_queue_limit` parametresi ayarlanıp `wallarm_upstream_queue_memory_limit` parametresi ayarlanmazsa, arka planda bellek limiti olmayacaktır.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_upstream_queue_memory_limit

Serileştirilmiş isteklerin toplam hacmine getirilecek limiti belirler.
Aynı anda `wallarm_upstream_queue_memory_limit` parametresi ayarlanıp `wallarm_upstream_queue_limit` parametresi ayarlanmazsa, işlem üzerindeki limit olmayacaktır.

!!! info
    **Varsayılan değer:** `100m`.
    
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

```