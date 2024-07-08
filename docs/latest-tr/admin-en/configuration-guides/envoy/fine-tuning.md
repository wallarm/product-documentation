# Envoy tabanlı Wallarm düğümünü ayarlama seçenekleri

[link-lom]:                     ../../../user-guides/rules/rules.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-tsets]:                 #filtering-mode-settings

Envoy, gelen istekleri işlemek için Envoy konfigürasyon dosyasında tanımlanan takılabilir filtreleri kullanır. Bu filtreler, istekte gerçekleştirilecek işlemleri tanımlar. Örneğin, bir `envoy.http_connection_manager` filtresi, HTTP isteklerini yönlendirmek için kullanılır. Bu filtrenin kendi HTTP filtre seti vardır, bu filtreler isteğe uygulanabilir.

Wallarm modülü, bir Envoy HTTP filtresi olarak tasarlanmıştır. Modülün genel ayarları, `wallarm` HTTP filtresine ayrılmış bir bölümde yer alır:

```
listeners:
   - address:
     filter_chains:
     - filters:
       - name: envoy.http_connection_manager
         typed_config:
           http_filters:
           - name: wallarm
             typed_config:
              "@type": type.googleapis.com/wallarm.Wallarm
              <Wallarm modülünün konfigürasyonu>
              ...  
```

!!! warning "İsteği işleme etkinleştirmek"
    Wallarm modülünün bir HTTP istek gövdesini işlemesini sağlamak için, tampon filtresi, Envoy HTTP filtre zincirinde filtreleme düğümünden önce yerleştirilmelidir. Örneğin:
    
    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <maksimum istek boyutu (bayt olarak)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <Wallarm modülünün konfigürasyonu>
        ...
    ```
    
    Gelen istek boyutu, `max_request_bytes` parametresinin değerini aşarsa, bu istek düşürülür ve Envoy, `413` yanıt kodunu ("Yük Kapasitesi Büyük") döndürür.

## İstek filtreleme ayarları

Dosyanın `rulesets` bölümü, istek filtreleme ayarlarıyla ilgili parametreleri içerir:

```
rulesets:
- name: rs0
  pdb: /etc/wallarm/proton.db
  custom_ruleset: /etc/wallarm/custom_ruleset
  key: /etc/wallarm/private.key
  general_ruleset_memory_limit: 0
  enable_libdetection: "on"
  ...
- name: rsN:
  ...
```

`rs0` ... `rsN` girdileri, bir veya daha fazla parametre grubudur. Gruplar herhangi bir isme sahip olabilir (`conf` bölümündeki [`ruleset`](#ruleset_param) parametresi aracılığıyla daha sonra başvurulabilirler). Filtreleme düğümü konfigürasyonunda en az bir grup bulunmalıdır (örneğin, `rs0` adı ile).

Bu bölümün varsayılan değerleri yoktur. Değerleri açıkça config dosyasında belirtmeniz gerekmektedir.

!!! info "Tanımlama Seviyesi"
    Bu bölüm sadece filtreleme düğümü seviyesinde tanımlanabilir.

Parametre | Açıklama | Varsayılan değer
--- | ---- | -----
`pdb` | `proton.db` dosyasının yolu. Bu dosya, uygulama yapısına bağlı olmayan istek filtreleme için küresel ayarları içerir. | `/etc/wallarm/proton.db`
`custom_ruleset` | Korunan uygulama ve filtreleme düğümü ayarları hakkında bilgi içeren [özel kurallar listesi][link-lom] dosyasının yolu. |/etc/wallarm/custom_ruleset
`key` | proton.db ve özel kurallar listesi dosyalarının şifreleme/şifre çözmek için kullanılan Wallarm özel anahtarının olduğu dosyanın yolu. |/etc/wallarm/private.key
`general_ruleset_memory_limit` | proton.db ve özel kurallar listesi olan bir örneğin tarafından kullanılabilecek en fazla bellek miktarı için sınır. Bellek sınırı aşıldığında veya bazı talepler işlenirken, kullanıcı 500 hatası alır. Bu parametrede şu ekler kullanılabilir: <ul><li>`k` veya `K` kilobyt için</li><li>`m` veya `M` megabyte için</li><li>`g` veya `G` gigabyte için</li></ul> `0` değeri, sınırı kapatır. | `0`
`enable_libdetection` | [**libdetection** kütüphanesi](../../../about-wallarm/protecting-against-attacks.md#library-libdetection) ile SQL Enjeksiyon saldırılarının ek doğrulamasını etkinleştirir/devre dışı bırakır. Kütüphane zararlı yükü onaylamazsa, istek meşru olarak kabul edilir. **libdetection** kütüphanesinin kullanılması, SQL Enjeksiyon saldırıları arasında yanlış pozitiflerin sayısını azaltmaya olanak sağlar.<br><br>Varsayılan olarak, **libdetection** kütüphanesi etkindir. En iyi saldırı algılama için, kütüphanenin etkin kalması önerilir.<br><br>**libdetection** kütüphanesi kullanılarak saldırıları analiz ederken, NGINX ve Wallarm süreçlerinin tükettiği bellek miktarı yaklaşık%10 artabilir. | `on`

##  Postanalitik modül ayarları

Filtreleme düğümünün `tarantool` bölümü, postanalitik modülle ilgili parametreleri içerir:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

`server` girdisi, Tarantool sunucusu için ayarları tanımlayan bir parametre grubudur.

!!! info "Tanımlama Seviyesi"
    Bu bölüm sadece filtreleme düğümü seviyesinde tanımlanabilir.

Parametre | Açıklama | Varsayılan değer
--- | ---- | -----
`uri` | Tarantool sunucusuna bağlanmak için kullanılan kimlik bilgileri ile dize. Dize formatı `IP adresi` veya `alan adı:port`. | `localhost:3313`
`max_packets` | Tarantool'a gönderilecek sıralanmış isteklerin sayısı için limit. Limiti kaldırmak için `0` parametre değeri olarak ayarlayın. | `512`
`max_packets_mem` | Tarantool'a gönderilecek sıralanmış isteklerin toplam hacmi (bayt cinsinden) için limit. | `0` (hacim sınırlı değil)
`reconnect_interval` | Tarantool sunucusuna yeniden bağlanma girişimleri arasındaki aralık (saniye cinsinden). `0` değeri, sunucu kullanılamaz hale geldiğinde, filtreleme düğümünün olabildiğince hızlı bir şekilde sunucuya yeniden bağlanmaya çalışacağı anlamına gelir (önerilmez). | `1`

##  Temel ayarlar

Wallarm konfigürasyonunun `conf` bölümü, filtreleme düğümünün temel operasyonlarını etkileyen parametreleri içerir:

```
conf:
  ruleset: rs0
  mode: "monitoring"
  mode_allow_override: "off"
  application: 42
  process_time_limit: 1000
  process_time_limit_block: "attack"
  request_memory_limit: 104857600
  wallarm_status: "off"
  wallarm_status_format: "json"
  parse_response: true
  unpack_response: true
  parse_html_response: true
```

!!! info "Tanımlama Seviyesi"
    Daha esnek koruma seviyesi için, bu bölüm, rota veya sanal ana bilgisayar seviyesinde geçersiz kılınabilir:

    * Rota düzeyinde:

        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <bölüm parametreleri>
        ```
        
    * Sanal ana bilgisayar düzeyinde:
        ```
        virtual_hosts:
        - name: <sanal ana bilgisayarın adı>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <bölüm parametreleri>
        ```
    `conf` bölümündeki parametrelerin, rota seviyesinde geçersiz kılınmış `conf` bölümündeki parametrelerle örtüşmesi durumunda rota seviyesindeki parametreler öncelikli olacaktır. Bu da sanal ana bilgisayar seviyesinde tanımlanan parametrelerin, filtreleme düğümü seviyesinde tanımlanan parametrelerden daha öncelikli olduğu anlamına gelir.

Parametre | Açıklama | Varsayılan değer
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | `rulesets` bölümünde tanımlanmış olan parametre gruplarından biri. Bu parametre grubu, kullanılacak istek filtreleme kurallarını belirler.<br>Eğer `conf` bölümündeki bir filtreleme düğümünden bu parametre çıkarılırsa, bu parametre, rota veya sanal ana bilgisayar seviyesinde geçersiz kılınmış `conf` bölümüne dahil olmalıdır. | -
`mode` | Düğüm modu:<ul><li>`block` - zararlı istekleri engeller.</li><li>`monitoring` - istekleri analiz eder ancak engellemez.</li><li>`safe_blocking` - sadece [gri listeli IP adreslerinden](../../../user-guides/ip-lists/graylist.md) kaynaklanan zararlı istekleri engeller.</li><li>`monitoring` - istekleri analiz eder ancak engellemez.</li><li>`off` - trafik analizi ve işlemeyi devre dışı bırakır.</li></ul><br>[Filtrasyon modlarının ayrıntılı açıklaması →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | `mode` parametresi ile ayarlanmış filtreleme düğümü modunu, özel kurallar listesi[link-lom] ile geçersiz kılmanızı sağlar:<ul><li>`off` - özel kurallar listesi dikkate alınmaz.</li><li>`strict` - özel kurallar listesi yalnızca işlem modunu güçlendirir.</li><li>`on` - işlem modunu hem sertleştirmek hem de yumuşatmak mümkündür.</li></ul>Örneğin, eğer `mode` parametresi `monitoring` değerine ve `mode_allow_override` parametresi `strict` değerine ayarlanırsa, bazı istekleri engellemek (`block`) mümkün olacak, ancak filtreleme düğümünü tamamen devre dışı bırakmak (`off`) mümkün olmayacaktır. | `off`
<a name="application_param"></a>`application` | Wallarm Bulutunda kullanılacak olan korunan uygulamanın benzersiz tanımlayıcısı. Değer, `0` dışındaki pozitif bir tamsayı olabilir.<br><br>[Uygulamaların kurulumuyla ilgili daha fazla ayrıntı →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | [Çoklu kiracı](../../../installation/multi-tenant/deploy-multi-tenant-node.md) Wallarm düğümü için [kiracı](../../../installation/multi-tenant/overview.md) benzersiz tanımlayıcısı. Değer, aşağıdaki gibi bir [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) formatında bir dize olmalıdır: <ul><li> `11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>Ne kadar:</p><ul><li>[Kiracının UUID'sini kiracı oluşturma sırasında alın →](../../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[Mevcut kiracıların UUID listesini alın →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">Bu parametre kullanımdan kaldırılmıştır</p> <p>3.6 versiyonundan itibaren, `overlimit_res` saldırı algılamasını <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">**Fine-tune the overlimit_res attack detection** kuralını</a> kullanarak ince ayarlamak önerilir.<br> `process_time_limit` parametresi geçici olarak desteklenmektedir, ancak gelecekteki sürümlerde kaldırılacaktır.</p></div>Tek bir isteğin işlenme süresinin sınırı (milisaniye cinsinden). İstek belirlenen süre içinde işlenemezse, hata mesajı günlük dosyasına kaydedilir ve istek bir `overlimit_res` saldırısı olarak işaretlenir. | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">Bu parametre kullanımdan kaldırılmıştır</p> <p>3.6 versiyonundan itibaren, `overlimit_res` saldırı algılamasını <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">**Fine-tune the overlimit_res attack detection** kuralını</a> kullanarak ince ayarlamak önerilir.<br> `process_time_limit_block` parametresi geçici olarak desteklenmektedir, ancak gelecekteki sürümlerde kaldırılacaktır.</p></div>Istek işleme süresi, `process_time_limit` parametresi aracılığıyla ayarlanan limiti aştığında alınacak eylem:<ul><li>`off` - istekler her zaman yoksayılır.</li><li>`on` - istekler her zaman engellenir, `mode: "off"` olmadıkça.</li><li>`attack` - `mode` parametresi aracılığıyla ayarlanan saldırı engelleme moduna bağlıdır:<ul><li>`off` - istekler işlenmez.</li><li>`monitoring` - istekler yoksayılır.</li><li>`block` - istekler engellenir.</li></ul></li></ul> | `attack`
`wallarm_status` | [Filtreleme düğümü istatistik servisini](../../configure-statistics-service.md) etkinleştirir. | `false`
`wallarm_status_format` | [Filtreleme düğümü istatistiklerinin](../../configure-statistics-service.md) formatı: `json` veya `prometheus`. | `json`
`disable_acl` | İsteklerin kökenlerinin analizini devre dışı bırakmaya izin verir. Devre dışı bırakılırsa (`on`), filtreleme düğümü Wallarm Bulut'undan [IP listelerini](../../../user-guides/ip-lists/overview.md) indirmez ve istek kaynak IPs analizini atlar. | `off`
`parse_response` | Uygulamanın yanıtlarını analiz etmek gerekir. Yanıt analizi, [pasif tespit](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) ve [aktif tehdit doğrulaması](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) sırasında açığının tespit edilmesi için gereklidir.<br><br>Olası değerler `true` (yanıt analizi etkindir) ve `false` (yanıt analizi devre dışıdır). | `true`
`unpack_response` | Uygulamanın yanıtında dönen sıkıştırılmış verilerin açılması gerekir. Olası değerler `true` (deşifre etme etkindir) ve `false` (deşifre etme devre dışıdır).<br><br>Bu parametre, yalnızca `parse_response true` ise etkilidir. | `true`
`parse_html_response` | Uygulamanın yanıtında alınan HTML koduna HTML ayrıştırıcılarını uygulamak gerekir. Olası değerler `true` (HTML ayrıştırıcısı uygulanır) ve `false` (HTML ayrıştırıcısı uygulanmaz).<br><br>Bu parametre, yalnızca `parse_response true` ise etkilidir. | `true`