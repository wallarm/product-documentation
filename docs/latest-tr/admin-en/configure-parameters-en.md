[doc-nginx-install]:    ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:            #wallarm_acl_access_phase

# NGINX tabanlı Wallarm düğümü için yapılandırma seçenekleri

[Self-hosted Wallarm NGINX düğümü](../installation/nginx-native-node-internals.md#nginx-node) için Wallarm çözümünden en iyi şekilde yararlanmanızı sağlayan ince ayar seçeneklerini öğrenin.

!!! info "Resmi NGINX belgeleri"
    Wallarm yapılandırması, NGINX yapılandırmasına çok benzer. [Resmi NGINX belgelerine bakın](https://www.nginx.com/resources/admin-guide/). Wallarm'a özgü yapılandırma seçeneklerinin yanı sıra, NGINX yapılandırmasının tüm yeteneklerine sahipsiniz.

## Wallarm direktifleri

### disable_acl

İstek kaynaklarının analizini devre dışı bırakmaya izin verir. Devre dışı bırakıldığında (`on`), filtreleme düğümü Wallarm Cloud'dan [IP listelerini](../user-guides/ip-lists/overview.md) indirmez ve isteklerin kaynak IP analizini atlar.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    Varsayılan değer `off`.

### wallarm_acl_access_phase

Direktif, [yasaklı listede](../user-guides/ip-lists/overview.md) bulunan IP'lerden gelen istekleri NGINX access aşamasında engellemesi için NGINX tabanlı Wallarm düğümünü zorlar, bu şu anlama gelir:

* `wallarm_acl_access_phase on` ile, Wallarm düğümü yasaklı listedeki IP'lerden gelen tüm istekleri herhangi bir [filtreleme modunda](configure-wallarm-mode.md) (yalnızca `off` hariç) anında engeller ve yasaklı listedeki IP'lerden gelen isteklerde saldırı işaretlerini aramaz.

    Bu, yasaklı liste davranışını standart hale getirdiği ve düğümün CPU yükünü önemli ölçüde azalttığı için **varsayılan ve önerilen** değerdir.

* `wallarm_acl_access_phase off` ile, Wallarm düğümü önce istekleri saldırı işaretleri için analiz eder ve ardından `block` veya `safe_blocking` modunda çalışıyorsa yasaklı listedeki IP'lerden gelen istekleri engeller.

    `monitoring` filtreleme modunda, düğüm tüm isteklerde saldırı işaretlerini arar ancak kaynak IP yasaklı listede olsa bile bunları asla engellemez.

    `wallarm_acl_access_phase off` ile Wallarm düğüm davranışı, düğümün CPU yükünü önemli ölçüde artırır.

!!! info "Varsayılan değer ve diğer direktiflerle etkileşim"
    **Varsayılan değer**: `on` (Wallarm düğümü 4.2’den itibaren)

    Direktif yalnızca NGINX yapılandırma dosyasının http bloğu içinde ayarlanabilir.

    * Duvar kağıdı modu `off` iken veya [`disable_acl on`](#disable_acl) ile, IP listeleri işlenmez ve `wallarm_acl_access_phase` etkinleştirilmesinin bir anlamı yoktur.
    * `wallarm_acl_access_phase` direktifi, [`wallarm_mode`](#wallarm_mode) üzerinde önceliğe sahiptir; bu da yasaklı listedeki IP'lerden gelen isteklerin, filtreleme düğümü modu `monitoring` olsa bile engellenmesiyle sonuçlanır (`wallarm_acl_access_phase on` ile).

### wallarm_acl_export_enable

Direktif, düğümden Cloud’a [yasaklı listedeki](../user-guides/ip-lists/overview.md) IP’lerden gelen isteklerle ilgili istatistiklerin gönderilmesini `on` ile etkinleştirir / `off` ile devre dışı bırakır.

* `wallarm_acl_export_enable on` ile yasaklı listedeki IP’lerden gelen isteklerle ilgili istatistikler **Attacks** bölümünde [görüntülenir](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).
* `wallarm_acl_export_enable off` ile yasaklı listedeki IP’lerden gelen isteklerle ilgili istatistikler görüntülenmez.

!!! info
    Bu parametre http bloğu içinde ayarlanır.
    
    **Varsayılan değer**: `on`

### wallarm_api_conf

Wallarm API için erişim gereksinimlerini içeren `node.yaml` dosyasının yolu.

**Varsayılan**:

```
wallarm_api_conf /opt/wallarm/etc/wallarm/node.yaml
```

Filtreleme düğümünden seri hale getirilmiş istekleri postanalytics modülüne (wstore) yüklemek yerine doğrudan Wallarm API’sine (Cloud) yüklemek için kullanılır.
**Yalnızca saldırı içeren istekler API’ye gönderilir.** Saldırı içermeyen istekler kaydedilmez.

node.yaml dosya içeriği örneği:

``` yaml
# API bağlantı parametreleri (aşağıdaki parametreler varsayılan olarak kullanılır)
api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

[Daha fazla parametre](configure-cloud-node-synchronization-en.md#access-parameters)

### wallarm_application

Wallarm Cloud’da kullanılacak korunmakta olan uygulamanın benzersiz tanımlayıcısı. Değer `0` hariç pozitif bir tamsayı olabilir.

Benzersiz tanımlayıcılar hem uygulama alan adları hem de alan adı yolları için ayarlanabilir, örneğin:

=== "Alan adları için tanımlayıcılar"
    **example.com** alan adı için yapılandırma dosyası:

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

    **test.com** alan adı için yapılandırma dosyası:

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
=== "Alan adı yolları için tanımlayıcılar"
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

[Uygulamaların ayarlanması hakkında daha fazla bilgi →](../user-guides/settings/applications.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    **Varsayılan değer**: `-1`.

### wallarm_block_page

Engellenen isteğe verilecek yanıtı ayarlamanıza olanak tanır.

[Engelleme sayfası ve hata kodu yapılandırması hakkında daha fazla bilgi →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

### wallarm_block_page_add_dynamic_path

Bu direktif, kodunda NGINX değişkenleri bulunan ve bu engelleme sayfasının yolunun da bir değişken kullanılarak ayarlandığı engelleme sayfasını başlatmak için kullanılır. Aksi halde direktif kullanılmaz.

[Engelleme sayfası ve hata kodu yapılandırması hakkında daha fazla bilgi →](configuration-guides/configure-block-page-and-code.md)

!!! info
    Direktif, NGINX yapılandırma dosyasının `http` bloğu içinde ayarlanabilir.

### wallarm_cache_path

Sunucu başladığında proton.db ve özel kural seti dosya kopyası depolaması için yedek kataloğun oluşturulacağı dizin. Bu dizinin NGINX’i çalıştıran istemci tarafından yazılabilir olması gerekir.

!!! info
    Bu parametre yalnızca http bloğu içinde yapılandırılır.

### wallarm_custom_ruleset_path

Korunan uygulama ve filtreleme düğümü ayarları hakkında bilgi içeren [özel kural seti](../user-guides/rules/rules.md) dosyasının yolu.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**:
    
    * Docker NGINX tabanlı imaj, bulut imajları, NGINX Node all-in-one yükleyici ve Native Node kurulumları için `/opt/wallarm/etc/wallarm/custom_ruleset`
    * Diğer kurulum ürünleri için `/etc/wallarm/custom_ruleset`

### wallarm_enable_apifw

Direktif, 4.10 sürümünden itibaren kullanılabilen [API Specification Enforcement](../api-specification-enforcement/overview.md)'u `on` ile etkinleştirir / `off` ile devre dışı bırakır. Lütfen bu özelliğin etkinleştirilmesinin, gerekli abonelik ve Wallarm Console UI üzerinden yapılandırmanın yerini almadığını unutmayın.

!!! info
    Bu parametre `server` blokları içinde ayarlanabilir.

    **Varsayılan değer**: `on`.

### wallarm_enable_libdetection

!!! info "Diğer dağıtım seçenekleri"
    Bu bölüm, NGINX [all-in-one yükleyici](../installation/inline/compute-instances/linux/all-in-one.md) ve [Docker](../admin-en/installation-docker-en.md) kurulumları için seçeneğin nasıl ayarlanacağını açıklar - diğer dağıtım seçenekleri için bkz.:

    * [NGINX Ingress controller](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode), 
    * [Sidecar](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list) (`wallarm-enable-libdetection` pod anotasyonu)
    * [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module) (`libdetection` değişkeni).

[**libdetection**](https://github.com/wallarm/libdetection) kütüphanesi aracılığıyla SQL injection saldırılarının ek doğrulamasını etkinleştirir/devre dışı bırakır. **libdetection** kullanımı saldırıların çift tespiti sağlar ve yanlış pozitifleri azaltır.

**libdetection** kütüphanesiyle isteklerin analiz edilmesi, tüm [dağıtım seçeneklerinde](../installation/supported-deployment-options.md) varsayılan olarak etkindir. Yanlış pozitifleri azaltmak için analizin etkin kalmasını öneririz.

Ek doğrulamayı kontrol etmek için, korunan kaynağa aşağıdaki isteği gönderin:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* [Temel dedektör seti](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) (**libproton** kütüphanesi) `UNION SELECT` ifadesini SQL Injection saldırı işareti olarak tespit edecektir. `UNION SELECT` başka komutlar olmadan SQL Injection saldırısının bir işareti olmadığından, **libproton** bir yanlış pozitif tespit eder.
* Eğer isteklerin **libdetection** kütüphanesiyle analizi etkinse, SQL injection saldırı işareti istek içinde doğrulanmayacaktır. İstek meşru sayılır, saldırı Wallarm Cloud’a yüklenmez ve engellenmez (filtreleme düğümü `block` modunda çalışıyorsa).

!!! warning "Bellek tüketiminde artış"
    Saldırıları libdetection kütüphanesi kullanarak analiz ederken, NGINX ve Wallarm süreçlerinin tükettiği bellek miktarı yaklaşık %10 artabilir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    Varsayılan değer tüm [dağıtım seçenekleri](../installation/supported-deployment-options.md) için `on`’dur.

### wallarm_fallback

Değer `on` olarak ayarlandığında, NGINX’in acil durum moduna geçme yeteneği vardır; proton.db veya özel kural seti indirilemezse, bu ayar, verilerin indirilemediği http, server ve location blokları için Wallarm modülünü devre dışı bırakır. NGINX çalışmaya devam eder.

!!! info
    Varsayılan değer `on`.

    Bu parametre http, server ve location blokları içinde ayarlanabilir.

### wallarm_file_check_interval

proton.db ve özel kural seti dosyasındaki yeni verilerin kontrolü arasındaki aralığı tanımlar. Ölçü birimi aşağıdaki şekilde sonek ile belirtilir:
* dakikalar için sonek yok
* saniyeler için `s`
* milisaniyeler için `ms`

!!! info
    Bu parametre yalnızca http bloğu içinde yapılandırılır.
    
    **Varsayılan değer**: `1` (bir dakika)

### wallarm_general_ruleset_memory_limit

Bir proton.db ve özel kural seti örneği tarafından kullanılabilecek maksimum bellek miktarı için bir limit ayarlayın.

Bazı istekleri işlerken bellek limiti aşılırsa, kullanıcı 500 hatası alır.

Bu parametrede aşağıdaki sonekler kullanılabilir:
* kilobayt için `k` veya `K`
* megabayt için `m` veya `M`
* gigabayt için `g` veya `G`

**0** değeri limiti kapatır.

!!! info
    Bu parametre http, server ve/veya location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `1` GB

### wallarm_global_trainingset_path

!!! warning "Direktif kullanımdan kaldırıldı"
    Wallarm düğümü 3.6’dan itibaren, lütfen bunun yerine [`wallarm_protondb_path`](#wallarm_protondb_path) direktifini kullanın. Sadece direktif adını değiştirin, mantığı değişmedi.

### wallarm_http_v2_stream_max_len

Bu direktif, bayt cinsinden bir HTTP/2 akışının izin verilen maksimum uzunluğunu ayarlar. Belirtilen değerin yarısına ulaşıldığında, akışın zarif şekilde sonlandırılmasını kolaylaştırmak için istemciye bir HTTP/2 `GOAWAY` çerçevesi gönderilir. Akış kapanmaz ve maksimum uzunluğa ulaşılırsa, bağlantı NGINX tarafından zorla sonlandırılır.

Bu seçenek yapılandırılmamışsa, akış uzunlukları sınırsız kalır ve özellikle uzun ömürlü bağlantıların bulunduğu gRPC ortamlarında NGINX sürecinin sınırsız bellek tüketimine neden olabilir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    Direktifin varsayılan bir değeri yoktur, varsayılan olarak HTTP/2 akışlarının uzunluğu için bir sınır yoktur.

### wallarm_instance

!!! warning "Direktif kullanımdan kaldırıldı"
    * Direktif, korunmakta olan uygulamanın benzersiz tanımlayıcısını ayarlamak için kullanıldıysa, sadece adını [`wallarm_application`](#wallarm_application) olarak değiştirin.
    * Çok kiracılı (multi-tenant) düğümler için kiracının benzersiz tanımlayıcısını ayarlamak üzere `wallarm_instance` yerine [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) direktifini kullanın.

    4.0 sürümünden önceki filtreleme düğümü sürümü için kullandığınız yapılandırmayı güncellerken:

    * Çok kiracılık özelliği olmadan filtreleme düğümünü yükseltiyorsanız ve korunmakta olan uygulamanın benzersiz tanımlayıcısını ayarlamak için kullanılan herhangi bir `wallarm_instance` varsa, sadece adını `wallarm_application` olarak değiştirin.
    * Çok kiracılık özelliğiyle filtreleme düğümünü yükseltiyorsanız, tüm `wallarm_instance` kayıtlarını `wallarm_application` olarak değerlendirin, ardından yapılandırmayı [çok kiracılık yeniden yapılandırma talimatında](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy) açıklandığı gibi yeniden yazın.

### wallarm_key_path

proton.db ve özel kural seti dosyalarının şifrelenmesi/şifresinin çözülmesi için kullanılan Wallarm özel anahtarının yolu.

!!! info
    **Varsayılan değer**:
    
    * Docker NGINX tabanlı imaj, bulut imajları, NGINX Node all-in-one yükleyici ve Native Node kurulumları için `/opt/wallarm/etc/wallarm/private.key`
    * Diğer kurulum ürünleri için `/etc/wallarm/private.key`


### wallarm_local_trainingset_path

!!! warning "Direktif kullanımdan kaldırıldı"
    Wallarm düğümü 3.6’dan itibaren, lütfen bunun yerine [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) direktifini kullanın. Sadece direktif adını değiştirin, mantığı değişmedi.

### wallarm_max_request_body_size

Genel kullanımdan gizlenmiştir

Düğüm tarafından analiz edilecek bir HTTP istek gövdesinin maksimum boyutunu (bayt cinsinden) tanımlar. İstek gövdesi belirtilen sınırı aşarsa, aşan kısım atlanır ve tehditler açısından incelenmez.

Direktif 6.2.0 sürümünden itibaren kullanılabilir.

!!! info
    Parametre http, server, location blokları içinde yapılandırılır.

    **Varsayılan değer**: sınırsız.

### wallarm_max_request_stream_message_size

Düğüm tarafından analiz edilecek gRPC veya WebSocket akışı içindeki tek bir mesaj yükünün maksimum boyutunu (bayt cinsinden) tanımlar. Mesaj belirtilen sınırı aşarsa, aşan kısım atlanır ve tehditler açısından incelenmez.

gRPC mesaj başlıkları boyut hesaplamasına dahil edilmez.

Direktif 6.2.0 sürümünden itibaren kullanılabilir.

!!! info
    Parametre http, server, location blokları içinde yapılandırılır.

    **Varsayılan değer**: 1Mb

    * 5 MB’lık bir dosyayı tek bir gRPC mesajı olarak gönderirseniz, sadece ilk 1 MB analiz edilir.
    * Dosya 1 MB veya daha küçük birden çok gRPC mesajına bölünürse, tüm parçalar analiz edilir.

### wallarm_max_request_stream_size

Düğüm tarafından analiz edilecek bir gRPC veya WebSocket istek akışı gövdesinin toplam maksimum boyutunu (bayt cinsinden) tanımlar. Akış gövdesi belirtilen sınırı aşarsa, aşan kısım atlanır ve tehditler açısından incelenmez.

* HTTP başlıkları hesaplamaya DAHİL DEĞİLDİR
* gRPC mesaj başlıkları (genellikle mesaj başına 5 bayt) dahildir

Örneğin, her biri 1000 bayt olan 2 gRPC mesajı gönderirseniz, toplam akış boyutu `(1000 + 5) × 2 = 2010 bayt` olacaktır - burada 5 bayt, her gRPC mesaj başlığının uzunluğudur.

Direktif 6.2.0 sürümünden itibaren kullanılabilir.

!!! info
    Parametre http, server, location blokları içinde yapılandırılır.

    **Varsayılan değer**: sınırsız.

### wallarm_memlimit_debug

Bu direktif, bellek limiti aşıldığında istek ayrıntılarını içeren `/tmp/proton_last_memlimit.req` dosyasının Wallarm NGINX modülü tarafından oluşturulup oluşturulmayacağını belirler. Bu, istek bellek limiti işleme ile ilgili sorunları hata ayıklamak için çok değerli olabilir.

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

`wallarm_mode` kullanımı, `wallarm_mode_allow_override` direktifi ile kısıtlanabilir.

[Filtreleme modu yapılandırmasına ilişkin ayrıntılı talimatlar →](configure-wallarm-mode.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer** filtreleme düğümü dağıtım yöntemine bağlıdır (`off` veya `monitoring` olabilir)

### wallarm_mode_allow_override

Wallarm Cloud’dan indirilen filtreleme kuralları (özel kural seti) aracılığıyla [`wallarm_mode`](#wallarm_mode) değerlerinin geçersiz kılınabilme yeteneğini yönetir:

- `off` - özel kurallar yok sayılır.
- `strict` - özel kurallar yalnızca çalışma modunu sıkılaştırabilir.
- `on` - hem sıkılaştırma hem de yumuşatma mümkündür.

Örneğin, `wallarm_mode monitoring` ve `wallarm_mode_allow_override strict` ayarlandığında, Wallarm Console bazı isteklerin engellenmesini etkinleştirmek için kullanılabilir, ancak saldırı analizi tamamen devre dışı bırakılamaz.

[Filtreleme modu yapılandırmasına ilişkin ayrıntılı talimatlar →](configure-wallarm-mode.md)

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`


### wallarm_parse_response

Uygulama yanıtlarının analiz edilip edilmeyeceği. Yanıt analizi, [pasif tespit](../about-wallarm/detecting-vulnerabilities.md#passive-detection) ve [tehdit tekrar testi](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) sırasında güvenlik açığı tespiti için gereklidir. 

Olası değerler `on` (yanıt analizi etkin) ve `off` (yanıt analizi devre dışı) şeklindedir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

!!! warning "Performansı iyileştirin"
    Performansı iyileştirmek için, statik dosyaların `location` üzerinden işlenmesini devre dışı bırakmanız önerilir.

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarm, API Security abonelik planı kapsamında tam WebSockets desteği sağlar. Varsayılan olarak, WebSockets mesajları saldırılar için analiz edilmez.

Özelliği zorlamak için, API Security abonelik planını etkinleştirin ve `wallarm_parse_websocket` direktifini kullanın.

Olası değerler:

- `on`: mesaj analizi etkin.
- `off`: mesaj analizi devre dışı.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `off`

### wallarm_parser_disable

Parçalayacıları (parser) devre dışı bırakmaya izin verir. Direktif değerleri, devre dışı bırakılacak ayrıştırıcının adına karşılık gelir:

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

Uygulama yanıtında alınan HTML koduna HTML ayrıştırıcılarının uygulanıp uygulanmayacağı. Olası değerler `on` (HTML ayrıştırıcı uygulanır) ve `off` (HTML ayrıştırıcı uygulanmaz).

Bu parametre yalnızca `wallarm_parse_response on` ise etkilidir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `on`

### wallarm_partner_client_uuid

[Çok kiracılı](../installation/multi-tenant/overview.md) Wallarm düğümü için kiracının benzersiz tanımlayıcısı. Değer, [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) formatında bir dize olmalıdır, örneğin:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.

    Bilin:
    
    * [Kiracı oluşturma sırasında kiracının UUID’sini alma →](../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)
    * [Mevcut kiracıların UUID’lerinin listesini alma →](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)
    
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

* Kiracı, iş ortağının müşterisini temsil eder. İş ortağının 2 müşterisi vardır.
* `tenant1.com` ve `tenant1-1.com` hedefli trafik `11111111-1111-1111-1111-111111111111` müşterisi ile ilişkilendirilecektir.
* `tenant2.com` hedefli trafik `22222222-2222-2222-2222-222222222222` müşterisi ile ilişkilendirilecektir.
* İlk müşterinin ayrıca [`wallarm_application`](#wallarm_application) direktifi ile belirtilen 3 uygulaması vardır:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    Bu 3 yola yönelik trafik ilgili uygulama ile ilişkilendirilecek, geri kalan ise ilk müşterinin genel trafiği olacaktır.

### wallarm_process_time_limit

!!! warning "Direktif kullanımdan kaldırılmıştır"
    3.6 sürümünden itibaren, `overlimit_res` saldırı tespitini [**İstek işleme süresini sınırla**](../user-guides/rules/configure-overlimit-res-detection.md) kuralını (eski adıyla “overlimit_res saldırı tespitini ince ayar”) kullanarak ince ayar yapmanız önerilir.
    
    `wallarm_process_time_limit` direktifi geçici olarak desteklenmektedir ancak gelecekteki sürümlerde kaldırılacaktır.

Wallarm düğümü tarafından tek bir isteğin işlenmesi için zaman sınırını ayarlar.

Zaman sınırı aşılırsa, günlükte bir hata kaydedilir ve istek [`overlimit_res`](../attacks-vulns-list.md#resource-overlimit) saldırısı olarak işaretlenir. [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block) değerine bağlı olarak saldırı engellenebilir, izlenebilir veya yok sayılabilir.

Değer, birim olmadan milisaniye cinsinden belirtilir, örneğin:

```bash
wallarm_process_time_limit 1200; # 1200 milisaniye
wallarm_process_time_limit 2000; # 2000 milisaniye
```

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: 1000ms (bir saniye).

### wallarm_process_time_limit_block

!!! warning "Direktif kullanımdan kaldırılmıştır"
    3.6 sürümünden itibaren, `overlimit_res` saldırı tespitini [**İstek işleme süresini sınırla**](../user-guides/rules/configure-overlimit-res-detection.md) kuralını (eski adıyla “overlimit_res saldırı tespitini ince ayar”) kullanarak ince ayar yapmanız önerilir.
    
    `wallarm_process_time_limit_block` direktifi geçici olarak desteklenmektedir ancak gelecekteki sürümlerde kaldırılacaktır.

[`wallarm_process_time_limit`](#wallarm_process_time_limit) direktifinde ayarlanan zaman sınırını aşan isteklerin engellenmesini yönetme yeteneği:

- `on`: `wallarm_mode off` olmadıkça istekler her zaman engellenir
- `off`: istekler her zaman yok sayılır

    !!! warning "Koruma atlatma riski"
        `off` değeri dikkatli kullanılmalıdır çünkü bu değer `overlimit_res` saldırılarına karşı korumayı devre dışı bırakır.
        
        `off` değerinin yalnızca gerçekten gerekli olan, örneğin büyük dosya yüklemelerinin yapıldığı ve korumayı atlatma veya güvenlik açığı istismarı riski olmayan kesinlikle belirli location’larda kullanılması önerilir.
        
        **Kesinlikle tavsiye edilmez**, `wallarm_process_time_limit_block` değerini http veya server blokları için küresel olarak `off` olarak ayarlamak.
    
- `attack`: `wallarm_mode` direktifinde ayarlanan saldırı engelleme moduna bağlıdır:
    - `off`: istekler işlenmez.
    - `monitoring`: istekler yok sayılır ancak `overlimit_res` saldırılarıyla ilgili ayrıntılar Wallarm Cloud’a yüklenir ve Wallarm Console’da görüntülenir.
    - `safe_blocking`: yalnızca [gri listede](../user-guides/ip-lists/overview.md) bulunan IP adreslerinden gelen istekler engellenir ve tüm `overlimit_res` saldırılarıyla ilgili ayrıntılar Wallarm Cloud’a yüklenir ve Wallarm Console’da görüntülenir.
    - `block`: istekler engellenir.

Direktif değerinden bağımsız olarak, [`wallarm_mode off;`](#wallarm_mode) olmadıkça `overlimit_res` saldırı türündeki istekler Wallarm Cloud’a yüklenir.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `wallarm_process_time_limit_block attack`

### wallarm_proton_log_mask_master

NGINX master sürecinin hata ayıklama günlükleme ayarları. 

!!! warning "Direktifin kullanımı"
    Direktifi yalnızca bir Wallarm destek ekibi üyesi tarafından yapmanız istenirse yapılandırmanız gerekir. Size direktif ile kullanılacak değeri sağlayacaklardır.

!!! info
    Parametre yalnızca main seviyesinde yapılandırılabilir.


### wallarm_proton_log_mask_worker

NGINX worker süreci için hata ayıklama günlükleme ayarları. 

!!! warning "Direktifin kullanımı"
    Direktifi yalnızca bir Wallarm destek ekibi üyesi tarafından yapmanız istenirse yapılandırmanız gerekir. Size direktif ile kullanılacak değeri sağlayacaklardır.

!!! info
    Parametre yalnızca main seviyesinde yapılandırılabilir.

### wallarm_protondb_path

Uygulama yapısından bağımsız olan istek filtrelemesi için global ayarları içeren [proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) dosyasının yolu.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**:
    
    * Docker NGINX tabanlı imaj, bulut imajları, NGINX Node all-in-one yükleyici ve Native Node kurulumları için `/opt/wallarm/etc/wallarm/proton.db`
    * Diğer kurulum ürünleri için `/etc/wallarm/proton.db`

### wallarm_rate_limit

Oran sınırlama yapılandırmasını aşağıdaki formatta ayarlar:

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - sınırları ölçmek istediğiniz anahtar. Metin, [NGINX değişkenleri](http://nginx.org/en/docs/varindex.html) ve bunların kombinasyonunu içerebilir.

    Örneğin: `/login` uç noktasına yönelik ve aynı IP’den kaynaklanan istekleri sınırlamak için `"$remote_addr +login"`.
* `rate=<RATE>` (gerekli) - oran limiti, `rate=<sayı>r/s` veya `rate=<sayı>r/m` olabilir.
* `burst=<BURST>` (isteğe bağlı) - belirtilen RPS/RPM aşıldığında tamponlanacak ve oran normale döndüğünde işlenecek aşırı isteklerin maksimum sayısı. Varsayılan `0`.
* `delay=<DELAY>` - `<BURST>` değeri `0`’dan farklıysa, tamponlanan aşırı isteklerin yürütülmesi arasında tanımlanan RPS/RPM’in korunup korunmayacağını kontrol edebilirsiniz. `nodelay`, tüm tamponlanan aşırı isteklerin oran limiti gecikmesi olmadan eşzamanlı işlenmesini belirtir. Sayısal değer, belirtilen sayıda aşırı isteğin eşzamanlı işlenmesini, diğerlerinin ise RPS/RPM’de ayarlanan gecikmeyle işlenmesini ifade eder.

Örnek:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **Varsayılan değer:** yok.

    Bu parametre http, server, location bağlamlarında ayarlanabilir.

    [Oran sınırlama](../user-guides/rules/rate-limiting.md) kuralını ayarlarsanız, `wallarm_rate_limit` direktifi daha düşük önceliğe sahiptir.

### wallarm_rate_limit_enabled

Wallarm oran sınırlamayı etkinleştirir/devre dışı bırakır.

`off` ise, ne [oran sınırlama kuralı](../user-guides/rules/rate-limiting.md) (önerilen) ne de `wallarm_rate_limit` direktifi çalışır.

!!! info
    **Varsayılan değer:** `on` ancak Wallarm oran sınırlama, [oran sınırlama kuralı](../user-guides/rules/rate-limiting.md) (önerilen) veya `wallarm_rate_limit` direktifi yapılandırılmadan çalışmaz.
    
    Bu parametre http, server, location bağlamlarında ayarlanabilir.

### wallarm_rate_limit_log_level

Oran sınırlama kontrolü tarafından reddedilen isteklerin günlüğe kaydedilme seviyesi. Şunlar olabilir: `info`, `notice`, `warn`, `error`.

!!! info
    **Varsayılan değer:** `error`.
    
    Bu parametre http, server, location bağlamlarında ayarlanabilir.

### wallarm_rate_limit_status_code

Wallarm oran sınırlama modülü tarafından reddedilen isteklere yanıt olarak döndürülecek kod.

!!! info
    **Varsayılan değer:** `503`.
    
    Bu parametre http, server, location bağlamlarında ayarlanabilir.

### wallarm_rate_limit_shm_size

Wallarm oran sınırlama modülünün tüketebileceği maksimum paylaşımlı bellek miktarını ayarlar.

Ortalama anahtar uzunluğu 64 bayt (karakter) ve `wallarm_rate_limit_shm_size` 64MB iken, modül aynı anda yaklaşık 130.000 benzersiz anahtarı işleyebilir. Belleğin iki katına çıkarılması modülün kapasitesini doğrusal olarak iki katına çıkarır.

Bir anahtar, modülün limitleri ölçmek için kullandığı bir istek noktasının benzersiz değeridir. Örneğin, modül bağlantıları IP adreslerine göre sınırlıyorsa, her benzersiz IP adresi tek bir anahtar olarak kabul edilir. Varsayılan direktif değeriyle, modül yaklaşık 130.000 farklı IP’den gelen istekleri aynı anda işleyebilir.

!!! info
    **Varsayılan değer:** `64m` (64 MB).
    
    Bu parametre yalnızca http bağlamı içinde ayarlanabilir.

### wallarm_request_chunk_size

Bir iterasyon sırasında işlenen istek parçasının boyutunu sınırlar. `wallarm_request_chunk_size` direktifine bir tamsayı atayarak bayt cinsinden özel bir değer belirleyebilirsiniz. Direktif ayrıca aşağıdaki son ekleri destekler:
* kilobayt için `k` veya `K`
* megabayt için `m` veya `M`
* gigabayt için `g` veya `G`

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    **Varsayılan değer**: `8k` (8 kilobayt).

### wallarm_request_memory_limit

Tek bir isteğin işlenmesi için kullanılabilecek maksimum bellek miktarı için bir limit ayarlayın.

Limit aşılırsa, istek işleme kesilir ve kullanıcı 500 hatası alır.

Bu parametrede aşağıdaki sonekler kullanılabilir:
* kilobayt için `k` veya `K`
* megabayt için `m` veya `M`
* gigabayt için `g` veya `G`

`0` değeri limiti kapatır.

Varsayılan olarak, limitler kapalıdır. 

!!! info
    Bu parametre http, server ve/veya location blokları içinde ayarlanabilir.


### wallarm_srv_include

[API Specification Enforcement](../api-specification-enforcement/overview.md) için yapılandırma dosyasının yolunu belirtir. Bu dosya varsayılan olarak tüm dağıtım ürünlerine dahil edilmiştir ve genellikle değişiklik gerekmez.

Ancak, [özel bir `nginx.conf` ile NGINX tabanlı Docker imajı](installation-docker-en.md#run-the-container-mounting-the-configuration-file) kullanıyorsanız, bu direktifi belirtmeli ve dosyayı belirtilen yola yerleştirmelisiniz.

Direktif 4.10.7 sürümünden itibaren kullanılabilir.

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.

    **Varsayılan değer**: `/etc/nginx/wallarm-apifw-loc.conf;`.

### wallarm_stalled_worker_timeout

Bir NGINX worker için tek bir isteğin işlenmesi için zaman sınırını saniye cinsinden ayarlar.

Zaman sınırı aşılırsa, NGINX worker’ları hakkında veriler `stalled_workers_count` ve `stalled_workers` [istatistik](configure-statistics-service.md#usage) parametrelerine yazılır.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    
    **Varsayılan değer**: `5` (beş saniye)

### wallarm_status

[Wallarm istatistik hizmetinin](configure-statistics-service.md) çalışmasını kontrol eder.

Direktif değeri aşağıdaki formata sahiptir:

```
wallarm_status [on|off] [format=json|prometheus];
```

`wallarm_status` direktifini diğer NGINX kurulum dosyalarında kullanmaktan kaçınarak, istatistik hizmetini kendi dosyasında yapılandırmanız şiddetle önerilir, çünkü ikincisi güvensiz olabilir. `wallarm-status` için yapılandırma dosyası şurada bulunur:

* all-in-one yükleyici için `/etc/nginx/wallarm-status.conf`
* diğer kurulumlar için `/etc/nginx/conf.d/wallarm-status.conf`

Ayrıca, varsayılan `wallarm-status` yapılandırmasının mevcut satırlarından herhangi birini değiştirmemeniz şiddetle tavsiye edilir, çünkü bu, metrik veri yüklemesini Wallarm cloud’a bozabilir.

!!! info
    Direktif, NGINX’in `server` ve/veya `location` bağlamında yapılandırılabilir.

    `format` parametresinin varsayılan değeri `json`’dur.

### wallarm_tarantool_upstream

!!! warning "`wallarm_tarantool_upstream` adını `wallarm_wstore_upstream` olarak değiştirin"
    NGINX Node sürüm 6.x ve sonrasında, bu parametre, mantığında herhangi bir değişiklik olmaksızın [`wallarm_wstore_upstream`](#wallarm_wstore_upstream) olarak [yeniden adlandırılmıştır](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics).

    Geriye dönük uyumluluk bir kullanım dışı uyarısı ile korunur, ancak eski direktif kaldırıldığında gelecekteki hatalardan kaçınmak için yeniden adlandırma önerilir. Uyarı örneği:

    ```
    2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
    ```

### wallarm_timeslice

Bir filtreleme düğümünün bir isteği işlemeye ayırdığı süre sınırı; süre dolduğunda düğüm sıradaki bir sonraki isteği işlemeye geçer. Zaman sınırına ulaşıldığında, filtreleme düğümü kuyruktaki bir sonraki isteği işlemeye geçer. Kuyruktaki her istekte birer iterasyon gerçekleştirdikten sonra, düğüm kuyruktaki ilk istekte ikinci iterasyonu gerçekleştirir.

Direktife farklı zaman birimi değerleri atamak için [NGINX belgelerinde](https://nginx.org/en/docs/syntax.html) açıklanan zaman aralığı soneklerini kullanabilirsiniz.

!!! info
    Bu parametre http, server ve location blokları içinde ayarlanabilir.
    **Varsayılan değer**: `0` (tek iterasyon için zaman limiti devre dışıdır).

-----

!!! warning
    NGINX sunucu sınırlamaları nedeniyle, `wallarm_timeslice` direktifinin çalışması için `proxy_request_buffering` NGINX direktifine `off` değeri atanarak istek tamponlamasının devre dışı bırakılması gerekir.

### wallarm_ts_request_memory_limit

!!! warning "Direktif kullanımdan kaldırıldı"
    Wallarm düğümü 4.0’dan itibaren, lütfen bunun yerine [`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit) direktifini kullanın. Sadece direktif adını değiştirin, mantığı değişmedi.

### wallarm_unpack_response

Uygulama yanıtında döndürülen sıkıştırılmış verilerin sıkıştırmasının açılıp açılmayacağı. Olası değerler `on` (sıkıştırma açma etkin) ve `off` (sıkıştırma açma devre dışı).

Bu parametre yalnızca `wallarm_parse_response on` ise etkilidir.

!!! info
    **Varsayılan değer**: `on`.


### wallarm_upstream_backend

Seri hale getirilmiş isteklerin gönderilmesi için yöntem. İstekler ya wstore’a ya da API’ye gönderilebilir.

Direktifin olası değerleri:
*   `wstore`
*   `api`

Diğer direktiflere bağlı olarak, varsayılan değer aşağıdaki şekilde atanır:
*   Yapılandırmada `wallarm_api_conf` direktifi yoksa `wstore`.
*   Yapılandırmada `wallarm_api_conf` direktifi var ancak `wallarm_wstore_upstream` direktifi yoksa `api`.

    !!! note
        `wallarm_api_conf` ve `wallarm_wstore_upstream` direktifleri yapılandırmada aynı anda bulunursa, **directive ambiguous wallarm upstream backend** biçiminde bir yapılandırma hatası oluşur.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.


### wallarm_upstream_connect_attempts

wstore veya Wallarm API’ye yapılacak anlık tekrar bağlanma denemelerinin sayısını tanımlar.
wstore veya API’ye bağlantı kesilirse, tekrar bağlanma denemesi gerçekleşmez. Ancak, başka bağlantı kalmadığında ve seri hale getirilmiş istek kuyruğu boş olmadığında bu durum geçerli değildir.

!!! note
    Yeniden bağlanma başka bir sunucu üzerinden gerçekleşebilir, çünkü sunucu seçimi “upstream” alt sistemi tarafından yapılır.
    
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.


### wallarm_upstream_reconnect_interval

`wallarm_upstream_connect_attempts` eşiğini aşan başarısız denemelerden sonra wstore veya Wallarm API’ye yeniden bağlanma denemeleri arasındaki aralığı tanımlar.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.


### wallarm_upstream_connect_timeout

wstore veya Wallarm API’ye bağlanma için zaman aşımını tanımlar.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.


### wallarm_upstream_queue_limit

Seri hale getirilmiş istek sayısına bir sınır tanımlar.
`wallarm_upstream_queue_limit` parametresinin aynı anda ayarlanması ve `wallarm_upstream_queue_memory_limit` parametresinin ayarlanmaması, ikincisi için bir sınır olmayacağı anlamına gelir.

!!! info
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.


### wallarm_upstream_queue_memory_limit

Seri hale getirilmiş isteklerin toplam hacmine bir sınır tanımlar.
`wallarm_upstream_queue_memory_limit` parametresinin aynı anda ayarlanması ve `wallarm_upstream_queue_limit` parametresinin ayarlanmaması, ikincisi için bir sınır olmayacağı anlamına gelir.

!!! info
    **Varsayılan değer:** `100m`.
    
    Bu parametre yalnızca http bloğu içinde ayarlanabilir.

### wallarm_wstore_upstream

NGINX-Wallarm modülünün [ayrı postanalytics modülüne](installation-postanalytics-en.md) nasıl bağlanacağını tanımlar: postanalytics sunucu upstream’i ve SSL/TLS bağlantı ayarları.

Sözdizimi:

```
wallarm_wstore_upstream <UPSTREAM> ssl=on|off skip_host_check=on|off insecure=on|off;
```

* `<UPSTREAM>` - postanalytics modül adresine işaret eden upstream bloğunun adı.
* `ssl` (6.2.0 sürümünden itibaren kullanılabilir) — [postanalytics modülüne bağlantı için SSL/TLS’i](installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) etkinleştirir veya devre dışı bırakır. Kabul edilen değerler: `on` veya `off`.

    Varsayılan olarak `off`.

    `on` olarak ayarlanırsa, ayrıca şu ayarların yapılması gerekir:

    * [`wallarm_wstore_ssl_cert_file`](#wallarm_wstore_ssl_cert_file)
    * [`wallarm_wstore_ssl_key_file`](#wallarm_wstore_ssl_key_file)
    * [`wallarm_wstore_ssl_ca_cert_file`](#wallarm_wstore_ssl_ca_cert_file)
* `skip_host_check` (6.2.0 sürümünden itibaren, yalnızca `ssl=on` ise) - TLS el sıkışması sırasında ana bilgisayar adı doğrulamasını atlar.

    Common Name (CN) eşleşmeyen bir sertifika ile localhost veya bir IP adresine bağlanırken kullanışlıdır. Üretimde önerilmez.
* `insecure` (6.2.0 sürümünden itibaren, yalnızca `ssl=on` ise) - tam sertifika doğrulamasını (CA ve ana bilgisayar adı kontrolleri dahil) devre dışı bırakır.

    Yalnızca self-signed veya geçici sertifikalar kullanılırken geliştirme veya test ortamlarında kullanın.

Örnek:

```
upstream wallarm_wstore {
    server 1.1.1.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# omitted

wallarm_wstore_upstream wallarm_wstore ssl=on;
```

!!! info "Postanalytics için upstream yapılandırması"
    Postanalytics modülü için `upstream` bloğunda (`wallarm_wstore_upstream` direktifi tarafından referans verilen), aşağıdaki [standart upstream ayarlarını](https://nginx.org/en/docs/http/ngx_http_upstream_module.html) yapılandırabilirsiniz:

    * Postanalytics modülünün IP adresi ve portu
    * `max_fails`
    * `fail_timeout`
    * `max_conns` - aşırı bağlantı oluşturmayı önlemek için her upstream wstore sunucusu için belirtilmelidir
    * `keepalive` - wstore sunucularının sayısından düşük olmamalıdır

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.

### wallarm_wstore_ssl_cert_file

NGINX-Wallarm modülü tarafından postanalytics modülüne SSL/TLS bağlantısı kurulurken kendini doğrulamak için kullanılan istemci sertifikasının yolunu belirtir.

Bu direktif, NGINX-Wallarm ve ayrı sunuculara kurulmuş postanalytics modülleri için [karşılıklı TLS (mTLS)](installation-postanalytics-en.md#mutual-tls-mtls) etkinleştirildiğinde gereklidir.

Direktif 6.2.0 sürümünden itibaren kullanılabilir.

```
wallarm_wstore_ssl_cert_file /path/to/client.crt;
```

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.

### wallarm_wstore_ssl_key_file

[`wallarm_wstore_ssl_cert_file`](#wallarm_wstore_ssl_cert_file) ile sağlanan istemci sertifikasına karşılık gelen özel anahtarın yolunu belirtir.

Bu direktif, NGINX-Wallarm ve ayrı sunuculara kurulmuş postanalytics modülleri için [karşılıklı TLS (mTLS)](installation-postanalytics-en.md#mutual-tls-mtls) etkinleştirildiğinde gereklidir.

Direktif 6.2.0 sürümünden itibaren kullanılabilir.

```
wallarm_wstore_ssl_key_file /path/to/client.key;
```

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.

### wallarm_wstore_ssl_ca_cert_file

[Postanalytics modülü tarafından sunulan TLS sertifikasını](installation-postanalytics-en.md#ssltls-connection-to-the-postanalytics-module) doğrulamak için kullanılan güvenilir bir Sertifika Yetkilisi (CA) sertifikasının yolunu belirtir.

Özel bir CA tarafından verilmiş bir sertifika kullanan bir sunucuya bağlanırken gereklidir.

Direktif 6.2.0 sürümünden itibaren kullanılabilir.

```
wallarm_wstore_ssl_ca_cert_file /path/to/ca.crt;
```

!!! info
    Parametre yalnızca http bloğu içinde yapılandırılır.