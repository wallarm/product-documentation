[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/rules.md


#   Filtre Düğümü Günlükleriyle Çalışma

Bir filtre düğümü, aşağıdaki günlük dosyalarını `/var/log/wallarm` klasöründe saklar:

*   `brute-detect.log`: filtre düğümü kümesinde zorla saldırı ile ilgili sayaçları getirme günlüğü.
*   `export-attacks.log`: saldırı verilerini postanalitik modülüden Wallarm buluta aktarma günlüğü.
*   `export-counters.log`: sayaçlar verisini aktarma günlüğü (bkz. [Filtre Düğümünü İzleme][doc-monitor-node]).
*   `export-environment.log`: kurulu Wallarm paket sürümlerini toplama ve bu verileri Wallarm buluta yükleme günlüğü. Bu işlemler saat başı çalıştırılır.
*   `syncnode.log`: filtre düğümünün Wallarm bulutu ile senkronizasyon günlüğü (bu, [LOM][doc-lom] ve proton.db dosyalarının buluttan getirilmesini içerir).
*   `tarantool.log`: postanalitik modül işlemlerinin günlük kaydı.
*   `sync-ip-lists.log` (önceki düğüm sürümlerinde `sync-blacklist.log` olarak adlandırılır): filtre düğümünün [IP listeleri](../user-guides/ip-lists/overview.md)ne tek nesneler veya alt ağlar olarak eklenen IP adresleri ile senkronizasyon günlüğü.
*   `sync-ip-lists-source.log` (önceki düğüm sürümlerinde `sync-mmdb.log` olarak adlandırılır): filtre düğümünün ülkelerde, bölgelerde ve veri merkezlerinde kayıtlı IP adresleri ile [IP listeleri](../user-guides/ip-lists/overview.md) üzerinden senkronizasyon günlüğü.
*   `appstructure.log` (yalnızca Docker konteynırlarında): [API Discovery](../api-discovery/overview.md) modül aktivitesinin günlüğü.
*   `registernode_loop.log` (yalnızca Docker konteynırlarında): başarılı oldukça `register-node` betiğini çalıştıran wrapper betiğin etkinliği günlüğü.
*   `weak-jwt-detect.log`: [JWT güvenlik açığı](../attacks-vulns-list.md#weak-jwt) tespit günlüğü.

##  NGINX Tabanlı Filtre Düğümü için Genişletilmiş Günlükleme Ayarlama

NGINX, işlenen taleplerin günlüklerini (erişim günlükleri) ayrı bir günlük dosyasına yazar ve varsayılan olarak önceden tanımlanmış `combined` günlükleme formatını kullanır.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

Bir veya birkaç filtre düğümü değişkenini (gerekirse diğer NGINX değişkenleri de dahil) içerecek şekilde özel bir günlükleme formatı tanımlayıp kullanabilirsiniz. NGINX günlük dosyası, filtre düğümü teşhisini çok daha hızlı yapmanızı sağlar.

### Filtre Düğümü Değişkenleri

NGINX günlükleme formatını tanımlarken aşağıdaki filtre düğümü değişkenlerini kullanabilirsiniz:

|İsim|Tür|Değer|
|---|---|---|
|`request_id`|String|İstek tanımlayıcı<br>Şu değer formuna sahiptir: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|Float|Filtre düğümünün bulunduğu makinenin CPU'sunun isteği işleme harcadığı saniye cinsinden süre.|
|`wallarm_request_mono_time`|Float|CPU'nun isteği işleme harcadığı süre + kuyruktaki süre. Örneğin, istek 3 saniye kuyrukta bekledi ve CPU tarafından 1 saniye işlendi ise: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Integer|Serileştirilmiş isteğin bayt cinsinden boyutu|
|`wallarm_is_input_valid`|Integer|İstek geçerliliği<br>`0`: istek geçerlidir. İstek filtre düğümü tarafından kontrol edildi ve LOM kurallarını karşılar.<br>`1`: istek geçersiz. İstek filtre düğümü tarafından kontrol edildi ve LOM kurallarını karşılamıyor.|
| `wallarm_attack_type_list` | String | İstekte [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) kütüphanesi ile tespit edilen [saldırı tipleri][doc-vuln-list]. Türler, metin formatında sunulur:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>Eğer bir istekte çoklu saldırı tipleri tespit edilmişse, bunlar `|` sembolüyle listelenir. Örneğin: XSS ve SQLi saldırıları tespit edilmişse, değişkenin değeri `xss|sqli`. |
|`wallarm_attack_type`|Integer|İstekte [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) kütüphanesi ile tespit edilen [saldırı tipleri][doc-vuln-list]. Türler, bit dizi formatında sunulur:<ul><li>`0x00000000`: saldırı yok: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>Eğer bir istekte çoklu saldırı tipleri tespit edilmişse, değerler özetlenir. Örneğin: XSS ve SQLi saldırıları tespit edilmişse, değişkenin değeri `6`. |

### Yapılandırma Örneği

Tüm `combined` formatında kullanılan değişkenleri ve
tüm filtre düğümü değişkenlerini içeren `wallarm_combined` adlı genişletilmiş günlükleme formatını belirtmiş olmanız gerektiğini varsayalım.

Bunu yapmak için, aşağıdaki işlemleri yapın:

1.  Aşağıdaki satırlar, istenen günlükleme formatını açıklar. Bunları NGINX konfigürasyon dosyasının `http` bloğuna ekleyin.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  Aşagıdaki yönergeyi aynı bloğa ekleyerek genişletilmiş günlükleme formatını aktive edin:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    İşlenen istek günlükleri, `/var/log/nginx/access.log` dosyasına `wallarm_combined` formatında yazılacaktır.
    
    !!! info "Koşullu Günlükleme"
        Yukarıdaki yönerge ile tüm işlenen istekler, saldırıyla ilgili olmayanlar dahil olmak üzere bir günlük dosyasına loglanır.
        
        Yalnızca bir saldırının parçası olan isteklerin günlüklerini yazmak için koşullu günlükleme ayarlayabilirsiniz (bu istekler için `wallarm_attack_type` değişken değeri sıfır değildir). Bunu yapmak için, bahsedilen yönergeye bir koşul ekleyin: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        Bu, bir günlük dosyasının boyutunu azaltmak veya filtre düğümünüzü bir [SIEM çözümleri](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1) ile entegre etmek isterseniz kullanışlı olabilir.          
        
3.  İşletim sistemine bağlı olarak aşağıdaki komutlardan birini çalıştırarak NGINX'i yeniden başlatın:

    --8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"

!!! info "Ayrıntılı bilgi"
    NGINX'te günlükleme ayarlaması hakkında detaylı bilgi için bu [link'e][link-nginx-logging-docs] gidin.