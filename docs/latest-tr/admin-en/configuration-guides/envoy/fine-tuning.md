# Envoy tabanlı Wallarm düğümü için yapılandırma seçenekleri

[link-lom]:                     ../../../user-guides/rules/rules.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-tsets]:                 #filtering-mode-settings

Envoy, gelen istekleri işlemek için Envoy yapılandırma dosyasında tanımlanan eklenti filtrelerini kullanır. Bu filtreler, istek üzerinde gerçekleştirilecek eylemleri tanımlar. Örneğin, HTTP isteklerini proxylemek için `envoy.http_connection_manager` filtresi kullanılır. Bu filtrenin, isteğe uygulanabilecek kendi HTTP filtreleri seti vardır.

Wallarm modülü, Envoy HTTP filtresi olarak tasarlanmıştır. Modülün genel ayarları, `wallarm` HTTP filtresine ayrılmış bir bölümde yer alır:

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
              <the Wallarm module configuration>
              ...  
```

!!! warning "İstek gövdesi işlemesini etkinleştir"
    Wallarm modülünün bir HTTP istek gövdesini işlemesini sağlamak için, buffer filtresinin Envoy HTTP filtre zincirinde filtering node'dan önce yerleştirilmesi gerekir. Örneğin:
    
    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <maximum request size (in bytes)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <the Wallarm module configuration>
        ...
    ```
    
    Gelen istek boyutu `max_request_bytes` parametresinin değerini aşarsa, bu istek düşürülür ve Envoy `413` yanıt kodunu (“Payload Too Large”) geri döndürür.

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

`rs0` ... `rsN` girdileri, bir veya daha fazla parametre grubudur. Gruplar, daha sonra `conf` bölümündeki [`ruleset`](#ruleset_param) parametresi aracılığıyla onlara başvurulabilmesi için herhangi bir isimde olabilir. Filtering node yapılandırmasında en az bir grup bulunmalıdır (örneğin, `rs0`).

Bu bölümün varsayılan değeri yoktur. Yapılandırma dosyasında değerleri açıkça belirtmeniz gerekir.

!!! info "Tanımlama seviyesi"
    Bu bölüm sadece filtering node seviyesinde tanımlanabilir.

Parameter | Açıklama | Varsayılan Değer
--- | ---- | -----
`pdb` | `proton.db` dosyasına giden yol. Bu dosya, uygulama yapısına bağlı olmayan istek filtreleme için küresel ayarları içerir. | `/etc/wallarm/proton.db`
`custom_ruleset` | Korunan uygulama ve filtering node ayarlarını içeren [custom ruleset][link-lom] dosyasına giden yol. | `/etc/wallarm/custom_ruleset`
`key` | proton.db ve custom ruleset dosyalarının şifreleme/şifre çözme işlemlerinde kullanılan Wallarm özel anahtarının bulunduğu dosyaya giden yol. | `/etc/wallarm/private.key`
`general_ruleset_memory_limit` | proton.db ve custom ruleset’in bir örneği tarafından kullanılabilecek maksimum bellek miktarı için sınır. Bellek sınırı, istek işlenirken aşılırsa, kullanıcı 500 hatası alır. Bu parametrede aşağıdaki son ekler kullanılabilir:<ul><li>kilobyte için `k` veya `K`</li><li>megabyte için `m` veya `M`</li><li>gigabyte için `g` veya `G`</li></ul> `0` değeri limiti devre dışı bırakır. | `0`
`enable_libdetection` | [**libdetection** library](../../../about-wallarm/protecting-against-attacks.md#library-libdetection) kullanılarak SQL enjeksiyon saldırılarının ek doğrulamasını etkinleştirir/devre dışı bırakır. Kütüphane kötü amaçlı yükü onaylamazsa, istek meşru kabul edilir. **libdetection** kütüphanesinin kullanılması, SQL enjeksiyon saldırıları arasındaki yanlış pozitiflerin sayısını azaltır.<br><br>Varsayılan olarak, **libdetection** kütüphanesi etkindir. En iyi saldırı tespiti için kütüphanenin etkin kalması önerilir.<br><br>**libdetection** kütüphanesiyle saldırı analizi yapılırken, NGINX ve Wallarm süreçleri tarafından tüketilen bellek yaklaşık %10 artabilir. | `on`

## Postanalytics modül ayarları

Filtering node’un `tarantool` bölümü, postanalytics modülü ile ilgili parametreleri içerir:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

`server` girdisi, Tarantool server için ayarları tanımlayan bir parametre grubudur.

!!! info "Tanımlama seviyesi"
    Bu bölüm sadece filtering node seviyesinde tanımlanabilir.

Parameter | Açıklama | Varsayılan Değer
--- | ---- | -----
`uri` | Tarantool server ile bağlantı için kullanılan kimlik bilgilerini içeren dize. Dize formatı `IP address` veya `domain name:port` şeklindedir. | `localhost:3313`
`max_packets` | Tarantool'a gönderilecek serileştirilmiş istek sayısı limiti. Sınırı kaldırmak için, parametre değeri olarak `0` ayarlayın. | `512`
`max_packets_mem` | Tarantool'a gönderilecek serileştirilmiş isteklerin toplam hacmi (bayt cinsinden) limiti. | `0` (hacim sınırlı değildir)
`reconnect_interval` | Tarantool ile yeniden bağlantı denemeleri arasındaki aralık (saniye cinsinden). `0` değeri, filtering node sunucu kullanılamazsa mümkün olan en kısa sürede yeniden bağlantı kurmaya çalışacağı anlamına gelir (önerilmez). | `1`

## Temel ayarlar

Wallarm yapılandırmasının `conf` bölümü, filtering node'un temel işlemlerini etkileyen parametreleri içerir:

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

!!! info "Tanımlama seviyesi"
    Daha esnek bir koruma seviyesi için, bu bölüm route veya virtual host seviyesinde geçersiz kılınabilir:

    * Route seviyesinde:
    
        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
        
    * Virtual host seviyesinde:
        ```
        virtual_hosts:
        - name: <the name of the virtual host>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
    Route seviyesinde geçersiz kılınan `conf` bölümündeki parametreler, virtual host seviyesinde tanımlanan bölümdeki parametrelerin üzerinde önceliğe sahiptir; bu da filtering node seviyesinde listelenen parametrelerden daha yüksek öneme sahiptir.

Parameter | Açıklama | Varsayılan Değer
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | `rulesets` bölümünde tanımlanan parametre gruplarından biri. Bu parametre grubu, kullanılacak istek filtreleme kurallarını belirler.<br>Eğer bu parametre filtering node'un `conf` bölümünden çıkarılırsa, route veya virtual host seviyesinde geçersiz kılınan `conf` bölümünde bulunmalıdır. | -
`mode` | Filtering node modu:<ul><li>`block` - kötü amaçlı istekleri engellemek.</li><li>`monitoring` - istekleri analiz etmek ancak engellememek.</li><li>`safe_blocking` - yalnızca [graylisted IP addresses](../../../user-guides/ip-lists/overview.md) kaynaklı kötü amaçlı istekleri engellemek.</li><li>`monitoring` - istekleri analiz etmek ancak engellememek.</li><li>`off` - trafik analizini ve işlemlerini devre dışı bırakmak.</li></ul><br>[Filtrasyon modlarının ayrıntılı açıklaması →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | Filtering node modunun, `mode` parametresiyle belirlenmiş halinin [custom ruleset][link-lom] ile geçersiz kılınmasına izin verir:<ul><li>`off` - custom ruleset göz ardı edilir.</li><li>`strict` - custom ruleset yalnızca operasyon modunu güçlendirebilir.</li><li>`on` - operasyon modunu güçlendirmek veya yumuşatmak mümkündür.</li></ul>Örneğin, `mode` parametresi `monitoring` olarak ayarlanır ve `mode_allow_override` parametresi `strict` olarak belirlenirse, bazı istekler engellenebilir (`block`), ancak filtering node tamamen devre dışı bırakılamaz (`off`). | `off`
<a name="application_param"></a>`application` | Wallarm Cloud'da kullanılmak üzere, korunan uygulamanın benzersiz tanımlayıcısı. Değer, `0` hariç pozitif bir tam sayı olmalıdır.<br><br>[Uygulamaların kurulumu hakkında daha fazla detay →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | Çok kullanıcılı (multi-tenant) Wallarm node için [tenant](../../../installation/multi-tenant/overview.md)ın benzersiz tanımlayıcısı. Değer, [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) formatında bir string olmalıdır, örneğin: <ul><li> `11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>Nasıl yapılır:</p><ul><li>[Tenant oluşturulması sırasında tenant'ın UUID'sini alın →](../../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)</li><li>[Mevcut tenant'ların UUID listesini alın →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul> | -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">Parametre kullanım dışı bırakıldı</p> <p>3.6 sürümünden itibaren, `overlimit_res` saldırı tespitinin <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">**İstek işleme zamanını sınırla**</a> kuralı kullanılarak incelenmesi önerilmektedir (eski adıyla "overlimit_res saldırı tespitinin incelenmesi").<br>`process_time_limit` parametresi geçici olarak desteklenmektedir ancak gelecekteki sürümlerde kaldırılacaktır.</p></div>
Limit, tek bir isteğin işlenme süresi içindir (milisaniye cinsinden). İstek, belirlenen süre içinde işlenemezse, hata mesajı log dosyasına kaydedilir ve istek `overlimit_res` saldırısı olarak işaretlenir. | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">Parametre kullanım dışı bırakıldı</p> <p>3.6 sürümünden itibaren, `overlimit_res` saldırı tespitinin <a href="../../../../user-guides/rules/configure-overlimit-res-detection/">**İstek işleme zamanını sınırla**</a> kuralı kullanılarak incelenmesi önerilmektedir (eski adıyla "overlimit_res saldırı tespitinin incelenmesi").<br>`process_time_limit_block` parametresi geçici olarak desteklenmektedir ancak gelecekteki sürümlerde kaldırılacaktır.</p></div>
İstek işleme süresi, `process_time_limit` parametresiyle belirlenen sınırı aştığında alınacak eylem:
<ul><li>`off` - istekler her zaman göz ardı edilir.</li><li>`on` - istekler, `mode: "off"` haricinde her zaman engellenir.</li><li>`attack` - `mode` parametresiyle belirlenen saldırı engelleme moduna bağlı olarak:<ul><li>`off` - istekler işlenmez.</li><li>`monitoring` - istekler göz ardı edilir.</li><li>`block` - istekler engellenir.</li></ul></li></ul> | `attack`
`wallarm_status` | [Filtering node istatistik servisini](../../configure-statistics-service.md) etkinleştirip etkinleştirmeyeceğini belirler. | `false`
`wallarm_status_format` | [Filtering node istatistiklerinin](../../configure-statistics-service.md) formatı: `json` veya `prometheus`. | `json`
`disable_acl` | İstek kaynaklarının analizini devre dışı bırakmaya izin verir. Devre dışı bırakılırsa (`on`), filtering node Wallarm Cloud'dan [IP listelerini](../../../user-guides/ip-lists/overview.md) indirmez ve istek kaynak IP analizini atlar. | `off`
`parse_response` | Uygulama yanıtlarının analiz edilip edilmeyeceğini belirler. Yanıt analizi, [passive detection](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) ve [threat replay testing](../../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) sırasında güvenlik açığı tespiti için gereklidir.<br><br>Olası değerler: `true` (yanıt analizi etkin) ve `false` (yanıt analizi devre dışı). | `true`
`unpack_response` | Uygulama yanıtında dönen sıkıştırılmış verilerin açılıp açılmayacağını belirler. Olası değerler: `true` (açma etkin) ve `false` (açma devre dışı).<br><br>Bu parametre yalnızca `parse_response true` iken etkindir. | `true`
`parse_html_response` | Uygulama yanıtında alınan HTML koduna HTML ayrıştırıcılarının uygulanıp uygulanmayacağını belirler. Olası değerler: `true` (HTML ayrıştırıcı uygulanır) ve `false` (uygulanmaz).<br><br>Bu parametre yalnızca `parse_response true` iken etkindir. | `true`