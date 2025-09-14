[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle
[antibot]:                  ../api-abuse-prevention/overview.md
[resource-overlimit]:        ../attacks-vulns-list.md/#resource-overlimit
[acl]:                       ../user-guides/ip-lists/overview.md

#   Filtreleme Düğümü Günlükleriyle Çalışma

Bu makale, bir Wallarm filtreleme düğümünün günlük dosyalarını nasıl bulacağınız konusunda yol gösterir.

Günlük dosyaları `/opt/wallarm/var/log/wallarm` dizininde bulunur. Karşılaşacağınız günlük dosyalarının dökümü ve her birinin içerdiği bilgi türü aşağıdadır:

* `api-firewall-out.log`: [API specification enforcement](../api-specification-enforcement/overview.md) günlüğü.
* `appstructure-out.log` (yalnızca Docker konteynerlerinde): [API Discovery](../api-discovery/overview.md) modülü etkinliği günlüğü.
* `wstore-out.log` ([NGINX Node 5.x ve daha eski sürümlerde](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) `tarantool-out.log`): postanalytics modülünün işlemlerinin günlüğü.
* `wcli-out.log`: çoğu Wallarm servisinin günlükleri; kaba kuvvet tespiti, saldırıların Cloud’a aktarımı ve düğümün Cloud ile senkronizasyon durumu vb. dahil.
* `supervisord-out.log`: servis başlatmaları, durum değişiklikleri ve uyarılar dahil olmak üzere Supervisor süreç yönetimi günlükleri.
* `go-node.log`: [Native Node](../installation/nginx-native-node-internals.md#native-node) günlükleri.

##  NGINX‑Tabanlı Filtreleme Düğümü için Genişletilmiş Günlüklemeyi Yapılandırma

NGINX, işlenen isteklerin günlüklerini (erişim günlükleri) varsayılan olarak önceden tanımlı `combined` günlük biçimini kullanarak ayrı bir günlük dosyasına yazar.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

Gerekirse diğer NGINX değişkenleriyle birlikte bir veya birkaç filtre düğümü değişkeni ekleyerek özel bir günlük biçimi tanımlayıp kullanabilirsiniz. NGINX günlük dosyası, filtre düğümünün çok daha hızlı teşhis edilmesine olanak tanır.

### Filtre Düğümü Değişkenleri

NGINX günlük biçimini tanımlarken aşağıdaki filtre düğümü değişkenlerini kullanabilirsiniz:

|Ad|Tür|Değer|
|---|---|---|
|`request_id`|String|İstek tanımlayıcısı<br>Şu biçimdedir: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|Float|Filtreleme düğümünün bulunduğu makinenin CPU’sunun isteği işlerken harcadığı süre (saniye cinsinden).|
|`wallarm_request_mono_time`|Float|CPU’nun isteği işlerken harcadığı süre + kuyruktaki süre (saniye cinsinden). Örneğin, istek 3 saniye kuyrukta bekledi ve CPU tarafından 1 saniyede işlendi ise: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Integer|Serileştirilmiş isteğin boyutu (bayt cinsinden)|
|`wallarm_is_input_valid`|Integer|İsteğin geçerliliği<br>`0` - istek geçerli. İstek filtre düğümü tarafından kontrol edilmiştir ve LOM kuralları ile eşleşmektedir.<br>`1` - istek geçersiz. İstek filtre düğümü tarafından kontrol edilmiştir ve LOM kuralları ile eşleşmemektedir.|
| `wallarm_attack_type_list` | String | İstekte tespit edilen [saldırı türleri][doc-vuln-list]. Türler metin formatında sunulur:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li><li>file_upload_violation</li><li>[API specification violations](../api-specification-enforcement/overview.md):<ul><li>undefined_endpoint</li><li>undefined_parameter</li><li>missing_auth</li><li>missing_parameter</li><li>invalid_parameter_value</li><li>invalid_request</li><li>processing_overlimit</li></ul></li><li>blocked_source</li><li>GraphQL saldırıları:<ul><li>gql_aliases</li><li>gql_debug</li><li>gql_depth</li><li>gql_doc_size</li><li>gql_docs_per_batch</li><li>gql_introspection</li><li>gql_value_size</li></ul></li><li>[Trigger](../user-guides/triggers/triggers.md) tabanlı saldırılar (tür yalnızca bir trigger kaynağı denylist’e veya graylist’e aldığında döndürülür):<ul><li>brute</li><li>dirbust</li><li>bola</li><li>[vectors](configuration-guides/protecting-with-thresholds.md)</li></ul></li><li>[API Abuse](../api-abuse-prevention/overview.md) (tür yalnızca modül kaynağı denylist’e veya graylist’e aldığında döndürülür):<ul><li>bot</li><li>api_abuse</li><li>account_takeover</li><li>security_crawlers</li><li>scraping</li><li>resource_consumption</li></ul></li><li>credential_stuffing</li></ul>Bir istek içinde birden fazla saldırı türü tespit edilirse, türler `|` simgesiyle listelenir. Örneğin: XSS ve SQLi saldırıları tespit edilirse değişken değeri `xss|sqli` olur. 
|`wallarm_attack_type`|Integer|İstekte tespit edilen [saldırı türleri][doc-vuln-list]. Türler bit dizesi formatında sunulur:<ul><li>`0x00000000` - saldırı yok - `"0"`</li><li>`0x00000002` - xss - `"2"`</li><li>`0x00000004` - sqli - `"4"`</li><li>`0x00000008` - rce - `"8"`</li><li>`0x00000010` - xxe - `"16"`</li><li>`0x00000020` - ptrav - `"32"`</li><li>`0x00000040` - crlf - `"64"`</li><li>`0x00000080` - redir - `"128"`</li><li>`0x00000100` - nosqli - `"256"`</li><li>`0x00000200` - infoleak - `"512"`</li><li>`0x20000000` - overlimit_res - `"536870912"`</li><li>`0x40000000` - data_bomb - `"1073741824"`</li><li>`0x80000000` - vpatch - `"2147483648"`</li><li>`0x00002000` - ldapi - `"8192"`</li><li>`0x4000` - scanner - `"16384"`</li><li>`0x20000` - mass_assignment - `"131072"`</li><li>`0x80000` - ssrf - `"524288"`</li><li>`0x02000000`- ssi - `"33554432"`</li><li>`0x04000000` - mail_injection - `"67108864"`</li><li>`0x08000000` - ssti - `"134217728"`</li><li>`0x10000000` - invalid_xml - `"268435456"`</li><li>`0x8000000000000`- file_upload_violation - `2251799813685248`</li><li>API Abuse (bot saldırıları): <ul><li>`0x10000000000000` - resource_consumption - `4503599627370496`</li></ul></li><li>[API specification violations](../api-specification-enforcement/overview.md):<ul><li>`0x100000000` - undefined_endpoint - `"4294967296"`</li><li>`0x200000000` - undefined_parameter - `"8589934592"`</li><li>`0x400000000`- missing_auth - `"17179869184"`</li><li>`0x800000000`- missing_parameter - `"34359738368"`</li><li>`0x1000000000` - invalid_parameter_value - `"68719476736"`</li><li>`0x2000000000` - invalid_request - `"137438953472"`</li><li>`0x4000000000` - processing_overlimit - `"274877906944"`</li></ul></li><li>`0x100000` - blocked_source - `"1048576"`</li><li>GraphQL saldırıları: <ul><li>`0x20000000000` - gql_aliases - `"2199023255552"`</li><li>`0x200000000000` - gql_debug - `"35184372088832"`</li><li>`0x8000000000` - gql_depth - `"549755813888"`</li><li>`0x40000000000` - gql_doc_size - `"4398046511104"`</li><li>`0x80000000000` - gql_docs_per_batch - `"8796093022208"`</li><li>`0x100000000000` - gql_introspection - `"17592186044416"`</li><li>`0x10000000000` - gql_value_size - `"1099511627776"`</li></ul></li><li>[Trigger](../user-guides/triggers/triggers.md) tabanlı saldırılar (tür yalnızca bir trigger kaynağı denylist’e veya graylist’e aldığında döndürülür):<ul><li>`0x400` - brute - `"1024"`</li><li>`0x800` - dirbust - `"2048"`</li><li>`0x10000` - bola - `"65536"`</li><li>`0x400000` - [vectors](configuration-guides/protecting-with-thresholds.md) - `"4194304"`</li></ul></li><li>[API Abuse](../api-abuse-prevention/overview.md) (tür yalnızca modül kaynağı denylist’e veya graylist’e aldığında döndürülür):<ul><li>`0x8000` - bot - `"32768"`</li><li>`0x200000` - api_abuse - `"2097152"`</li><li>`0x400000000000` - account_takeover - `"70368744177664"`</li><li>`0x800000000000` - security_crawlers - `"140737488355328"`</li><li>`0x1000000000000` - scraping - `"281474976710656"`</li></ul></li><li>`0x1000000` - credential_stuffing - `"16777216"`</li></ul>Bir istek içinde birden fazla saldırı türü tespit edilirse, değerler toplanır. Örneğin: XSS ve SQLi saldırıları tespit edilirse değişken değeri `6` olur. |
| `wallarm_attack_point_list` (NGINX node 5.2.1 veya daha yenisi) | String | Kötü niyetli payload içeren istek noktalarını listeler. Bir nokta birden fazla [parser](../user-guides/rules/request-processing.md) tarafından ardışık olarak işlenirse, bu parser’lar değere dahil edilir. Kötü niyetli payload içeren birden fazla nokta `|` ile birleştirilir.<br>Örnek: `[post][json][json_obj, 'data'][base64]` ifadesi, JSON gövdesindeki base64 olarak kodlanmış `data` parametresinde kötü niyetli bir payload tespit edildiğini gösterir.<br>Bu günlük verilerinin, Wallarm Console UI içinde sunulan basitleştirilmiş, kullanıcı dostu görünümden farklı olabileceğini unutmayın. |
| `wallarm_attack_stamp_list` (NGINX node 5.2.1 veya daha yenisi) | String | Bir istek içinde tespit edilen her saldırı işareti için dahili Wallarm kimliklerini listeler. Birden fazla işaret kimliği `|` ile birleştirilir. Aynı saldırı işareti birden fazla ayrıştırma aşamasında tespit edilirse kimlikler tekrarlanabilir. Örneğin, `union+select+1` gibi bir SQLi saldırısı `7|7` döndürebilir ve birden fazla tespiti gösterebilir.<br>Bu günlük verilerinin, Wallarm Console UI içinde sunulan basitleştirilmiş, kullanıcı dostu görünümden farklı olabileceğini unutmayın. |
|`wallarm_block_reason` (NGINX node 6.4.0 veya daha yenisi)|String|Engelleme nedeni (uygulanabilirse). Nedenler metin formatında sunulur: <ul><li>`not blocked` - istek engellenmedi (örneğin, [allowlisted IP][acl] üzerinden gönderildi).</li><li>`antibot` - istek [API Abuse Prevention modülü][antibot] tarafından engellendi.</li><li>`attack mask=<MASK>` - bir saldırı tespit edildi. `MASK`, bit dizesi formatında saldırı türüdür (ör. `mask=0000000000000020` bir ptrav saldırısını gösterir). Tüm saldırı türleri yukarıdaki `wallarm_attack_type` bölümünde listelenmiştir. </li><li>`overlimit` - maskede bir [resource overlimit][resource-overlimit] saldırısı tespit edildi.</li><li>`acl blacklist SRC TYPE` - istek [denylist’te olan istek kaynakları][acl] nedeniyle engellendi. Değişken bölümler aşağıdaki değerlere sahip olabilir: <ul>`SRC`:<ul><li>`ip`</li><li>`country`</li><li>`proxy`</li><li>`datacenter`</li><li>`tor`</li></ul></li><li>`TYPE`: <ul><li>`blocked_source`</li><li>`brute`</li><li>`dirbust`</li><li>`bola`</li><li>`bot`</li><li>`api_abuse`</li><li>`vectors`</li><li>`account_takeover`</li><li>`security_crawlers`</li><li>`scraping`</li><li>`resource_consumption`</li><li>`session_anomaly`</li><li>`enum`</li><li>`rate_limit`</li><li>`query_anomaly`</li><li>`ai_prompt_injection`</li><li>`ai_prompt_retrieval`</li></ul></li></ul>|

### Yapılandırma Örneği

Aşağıdaki değişkenleri içeren `wallarm_combined` adlı genişletilmiş günlükleme biçimini belirtmeniz gerektiğini varsayalım:
*   `combined` biçiminde kullanılan tüm değişkenler
*   tüm filtre düğümü değişkenleri

Bunu yapmak için aşağıdaki adımları uygulayın:

1.  Aşağıdaki satırlar istenen günlükleme biçimini tanımlar. Bunları NGINX yapılandırma dosyasının `http` bloğuna ekleyin.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list $wallarm_attack_point_list $wallarm_attack_stamp_list';
    ```

2.  Aynı bloğa aşağıdaki yönergeyi ekleyerek genişletilmiş günlükleme biçimini etkinleştirin:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    İşlenen istek günlükleri `/var/log/nginx/access.log` dosyasına `wallarm_combined` biçiminde yazılacaktır.
    
    !!! info "Koşullu Günlükleme"
        Yukarıda listelenen yönerge ile, bir saldırıyla ilişkili olmayanlar da dahil olmak üzere tüm işlenen istekler bir günlük dosyasına yazılır.
        
        Yalnızca bir saldırının parçası olan istekler için günlük yazmak üzere koşullu günlüklemeyi yapılandırabilirsiniz (bu isteklerde `wallarm_attack_type` değişkeninin değeri sıfır değildir). Bunu yapmak için, anılan yönergeye bir koşul ekleyin: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        Bu, günlük dosyası boyutunu küçültmek veya bir filtre düğümünü [SIEM çözümleri](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1) ile entegre ediyorsanız faydalı olabilir.          
        
3.  Kullandığınız işletim sistemine bağlı olarak aşağıdaki komutlardan birini çalıştırarak NGINX’i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "Ayrıntılı bilgi"
    NGINX’te günlüklemeyi yapılandırma hakkında ayrıntılı bilgi için bu [bağlantıya][link-nginx-logging-docs] gidin.


<!-- wallarm_attack_type_list - notes causing questions

not released yet (do not know yet whether with the mitigation control release they will be available or not):
ai_prompt_injection
ai_prompt_retrieval
session_anomaly - not sure if they really exist
query_anomaly - not sure if they really exist
enum


once file upload restriction policy and unrestricted resource consumption are released and announced in 6.3:

wallarm_attack_type_list - the following new values:
<li>resource_consumption</li><li>file_upload_violation</li>

wallarm_attack_type - the following new values:
<li>0x10000000000000: resource_consumption: 4503599627370496</li><li>0x8000000000000: file_upload_violation: 2251799813685248</li>
-->