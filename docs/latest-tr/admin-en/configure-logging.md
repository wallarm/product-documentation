[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle

# Filtre Düğümü Günlükleri ile Çalışma

Bu makale, bir Wallarm filtre düğümünün günlük dosyalarını nasıl bulacağınız konusunda size rehberlik eder.

Günlük dosyaları, `/opt/wallarm/var/log/wallarm` dizininde yer almaktadır. Aşağıda, karşılaşacağınız günlük dosyalarının bir özeti ve her birinin içerdiği bilgi türleri verilmiştir:

* `api-firewall-out.log`: [API specification enforcement](../api-specification-enforcement/overview.md) günlükleri.
* `appstructure-out.log` (sadece Docker konteynerlerinde): [API Discovery](../api-discovery/overview.md) modül etkinlik günlükleri.
* `tarantool-out.log`: postanalytics modül işlemlerinin günlükleri.
* `wcli-out.log`: Brute force tespiti, saldırıların Cloud'a aktarılması ve düğümün Cloud ile senkronizasyon durumu vb. dahil olmak üzere Wallarm servislerinin büyük bir bölümünün günlükleri.
* `go-node.log`: [Native Node](../installation/nginx-native-node-internals.md#native-node) günlükleri.

## NGINX Tabanlı Filtre Düğümü için Genişletilmiş Günlük Kaydının Yapılandırılması

NGINX, işlenen isteklerin günlüklerini (erişim günlükleri) varsayılan olarak önceden tanımlanmış `combined` günlük formatını kullanarak ayrı bir günlük dosyasına yazar.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

Gerekirse bir veya daha fazla filtre düğümü değişkenini (ve diğer NGINX değişkenlerini) dahil ederek özel bir günlük formatı tanımlayabilir ve kullanabilirsiniz. NGINX günlük dosyası, filtre düğümü tanılamasını çok daha hızlı hale getirecektir.

### Filtre Düğümü Değişkenleri

NGINX günlük formatını tanımlarken aşağıdaki filtre düğümü değişkenlerini kullanabilirsiniz:

|Name|Type|Değer|
|---|---|---|
|`request_id`|String|İstek tanımlayıcı<br>Şu formatta bir değere sahiptir: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|Float|Filtre düğümüne ait makinenin CPU'sunun isteği işlerken harcadığı süre (saniye cinsinden).|
|`wallarm_request_mono_time`|Float|İsteğin işlenmesinde CPU'nun harcadığı süre ile kuyruk bekleme süresinin toplamı (saniye cinsinden). Örneğin, eğer istek 3 saniye kuyrukta beklemiş ve CPU tarafından 1 saniye işlenmişse: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Integer|Serileştirilen isteğin bayt cinsinden boyutu.|
|`wallarm_is_input_valid`|Integer|İstek geçerliliği<br>`0`: İstek geçerli. İstek filtre düğümü tarafından kontrol edilmiş ve [LOM kuralları](../user-guides/rules/rules.md#ruleset-lifecycle)'na uygundur.<br>`1`: İstek geçersiz. İstek filtre düğümü tarafından kontrol edilmiş ve [LOM kuralları](../user-guides/rules/rules.md#ruleset-lifecycle)'na uymamaktadır.|
|`wallarm_attack_type_list`|String|İstek içerisinde, [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) kütüphanesi kullanılarak tespit edilen [saldırı türleri][doc-vuln-list]. Türler metin formatında sunulur:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>Eğer istekte birden fazla saldırı türü tespit edilirse, bunlar `|` sembolüyle ayrılır. Örneğin: XSS ve SQLi saldırıları tespit edildiğinde, değişken değeri `xss|sqli` olur.|
|`wallarm_attack_type`|Integer|İstek içerisinde, [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton) kütüphanesi kullanılarak tespit edilen [saldırı türleri][doc-vuln-list]. Türler bit dizisi formatında sunulur:<ul><li>`0x00000000`: saldırı yok: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>Eğer istekte birden fazla saldırı türü tespit edilirse, değerler toplanır. Örneğin: XSS ve SQLi saldırıları tespit edildiğinde, değişken değeri `6` olur.|
|`wallarm_attack_point_list` (NGINX node 5.2.1 ve üzeri)|String|Kötü niyetli yük içeren istek noktalarını listeler. Bir nokta birden fazla [parser](../user-guides/rules/request-processing.md) tarafından sırasıyla işleniyorsa, tüm aşamalardaki noktalar değere dahil edilir. Kötü niyetli yük içeren birden fazla nokta, `|` ile birleştirilir.<br>Örnek: `[post][json][json_obj, 'data'][base64]`, JSON'da base64 kodlamalı `data` gövde parametresinde tespit edilen kötü niyetli yükü belirtir.<br>Bu günlük verilerinin, Wallarm Console UI'da sunulan basitleştirilmiş, kullanıcı dostu görünümden farklı olabileceğini unutmayın.|
|`wallarm_attack_stamp_list` (NGINX node 5.2.1 ve üzeri)|String|İstek içerisinde tespit edilen her saldırı işareti için dahili Wallarm kimliklerini listeler. Birden fazla işaret kimliği `|` ile birleştirilir. Aynı saldırı işareti birden fazla ayrıştırma aşamasında tespit edilirse, kimlikler tekrarlanabilir. Örneğin, `union+select+1` içeren bir SQLi saldırısı `7|7` döndürebilir, bu da birden fazla tespiti gösterir.<br>Bu günlük verilerinin, Wallarm Console UI'da sunulan basitleştirilmiş, kullanıcı dostu görünümden farklı olabileceğini unutmayın.|

### Konfigürasyon Örneği

Aşağıdaki değişkenleri içeren `wallarm_combined` adlı genişletilmiş günlük formatını belirtmeniz gerektiğini varsayalım:
*   `combined` formatında kullanılan tüm değişkenler
*   Tüm filtre düğümü değişkenleri

Bunu yapmak için aşağıdaki adımları izleyin:

1.  Aşağıdaki satırlar, istenen günlük formatını tanımlar. Bu satırları NGINX yapılandırma dosyasındaki `http` bloğuna ekleyin.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list $wallarm_attack_point_list $wallarm_attack_stamp_list';
    ```

2.  Genişletilmiş günlük formatını etkinleştirmek için, ilk adımda belirtilen aynı bloğa aşağıdaki yönergeyi ekleyin:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    İşlenmiş istek günlükleri, `/var/log/nginx/access.log` dosyasına `wallarm_combined` formatında yazılacaktır.
    
    !!! info "Koşullu Günlük Kaydı"
        Yukarıda listelenen yönerge ile, saldırı ile ilişkili olmayanlar da dahil olmak üzere tüm işlenmiş istekler bir günlük dosyasına kaydedilir.
        
        Sadece saldırıya ait istekler için günlük kaydı yapmak üzere koşullu günlük kaydını yapılandırabilirsiniz (bu istekler için `wallarm_attack_type` değişken değeri sıfır değildir). Bunu yapmak için, yukarıdaki yönergeye şu koşulu ekleyin: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        Bu, günlük dosyası boyutunu küçültmek veya bir filtre düğümünü [SIEM solutions](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1) ile entegre etmek istediğinizde yararlı olabilir.
        
3.  Kullandığınız işletim sistemine bağlı olarak aşağıdaki komutlardan birini çalıştırarak NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "Detaylı Bilgi"
    NGINX'de günlük kaydı yapılandırması hakkında detaylı bilgi görmek için bu [link][link-nginx-logging-docs]'e gidin.