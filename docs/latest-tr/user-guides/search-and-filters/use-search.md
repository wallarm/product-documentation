[al-sqli]: ../../attacks-vulns-list.md#sql-injection
[al-xss]: ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]: ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]: ../../attacks-vulns-list.md#brute-force-attack
[al-path-traversal]: ../../attacks-vulns-list.md#path-traversal
[al-crlf]: ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]: ../../attacks-vulns-list.md#open-redirect
[al-nosqli]: ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]: ../../attacks-vulns-list.md#data-bomb
[al-xxe]: ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]: ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]: ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]: ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]: ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]: ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]: ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]: ../../attacks-vulns-list.md#overlimiting-of-computational-resources
[email-injection]: ../../attacks-vulns-list.md#email-injection
[ssi-injection]: ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]: ../../attacks-vulns-list.md#unsafe-xml-header
[ssti-injection]: ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]: ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# Arama ve Filtrelerin Kullanılması

Wallarm, algılanan saldırıları ve olayları aramak için kullanışlı yöntemler sunmaktadır. Wallarm Konsolu'ndaki **Etkinlikler** bölümünde aşağıdaki arama yöntemleri kullanılabilir:

* **Filtreler** ile filtreleme kriterlerini seçin
* **Arama alanı** ile insan diline benzer özelliklere ve değiştiricilere sahip arama sorgularını girebilirsiniz

Filtrelerde belirlenen değerler otomatik olarak arama alanına kopyalanır ve tersi de geçerlidir.

Herhangi bir arama sorgusu veya filtre kombinasyonu, **Sorguyu Kaydet** seçeneğine tıklayarak kaydedilebilir.

## Filtreler

Kullanılabilir filtreler, Wallarm Konsolu'nda çeşitli şekillerde sunulmaktadır:

* **Filtre** düğmesini kullanarak genişletilip daraltılan Filtreler paneli
* Spesifik parametre değerleri olan olayları hariç tutmak veya sadece göstermek için Hızlı filtreler

![Arayüzdeki Filtreler](../../images/user-guides/search-and-filters/filters.png)

Farklı filtrelerin değerleri seçildiğinde, sonuçlar bu koşulların tümünü karşılar. Aynı filtreye yönelik farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini karşılar.

## Arama Alanı

Arama alanı, insan diline benzer özelliklere ve değiştiricilere sahip sorguları kabul eder, bu da sorgu göndermeyi sezgisel hale getirir. Örneğin:

* `attacks xss`: Tüm [XSS-saldırıları][al-xss] için arama yapmak.
* `attacks today`: Bugün gerçekleşen tüm saldırıları aramak.
* `xss 12/14/2020`: 14 Aralık 2020'deki tüm şüpheli, saldırı ve olaylarını aramak[XSS-saldırıları][al-xss].
* `p:xss 12/14/2020`: 14 Aralık 2020 itibariyle tüm şüpheli, saldırı ve olayları (örn. `http://localhost/?xss=attack-here`) xss HTTP istek parametresi içinde aramak.
* `attacks 9-12/2020`: Eylül'den Aralık 2020'ye kadar olan tüm saldırıları aramak.
* `rce /catalog/import.php`: Dünden itibaren `/catalog/import.php` yolundaki tüm [RCE][al-rce] saldırıları ve olayları aramak.

Farklı parametrelerin değerleri belirtildiğinde, sonuçlar bu koşulların tümünü karşılar. Aynı parametre için farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini karşılar.

!!! bilgi "Özelliğin değeri NOT olarak ayarlama"
    Özelliğin değerini inkar etmek için, lütfen özelliğin veya değiştiricinin adından önce `!` kullanın. Örneğin: `attacks !ip:111.111.111.111` komutunu kullanarak, `111.111.111.111` dışında herhangi bir IP adresinden kaynaklanan tüm saldırıları gösterin.

Aşağıda arama sorgularında kullanılabilecek özellikler ve değiştiricilerin listesini bulabilirsiniz.

### Nesne türüne göre arama

Arama dizesinde belirtin:

* `attack`, `attacks`: Sadece bilinen zafiyetleri hedef *almayan* saldırıları aramak için.
* `incident`, `incidents`: Yalnızca olayları (bilinen bir zafiyeti hedef alan saldırıları) aramak için.

### Saldırı tipine göre arama

Arama dizesinde belirtin:

* `sqli`: [SQL enjeksiyonu][al-sqli] saldırılarını aramak için.
* `xss`: [Siteler arası betik oluşturma][al-xss] saldırılarını aramak için.
* `rce`: [OS Commanding][al-rce] saldırılarını aramak için.
* `brute`: [kaba kuvvet][al-brute-force] saldırılarını ve bu tip saldırılardan dolayı [redlisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `ptrav`: [path traversal][al-path-traversal] saldırıları aramak için.
* `crlf`: [CRLF enjeksiyonu][al-crlf] saldırılarını aramak için.
* `redir`: [açık yönlendirme][al-open-redirect] saldırılarını aramak için.
* `nosqli`: [NoSQL enjeksiyonu][al-nosqli] saldırılarını aramak için.
* `data_bomb`: [mantık bombası][al-logic-bomb] saldırılarını aramak için.
* `ssti`: [Sunucu Tarafı Şablon Enjeksiyonları][ssti-injection] için arama yapmak.
* `invalid_xml`: [güvensiz XML başlığının kullanımı][invalid-xml] için arama yapmak.
* `overlimit_res`: [hesaplama kaynaklarının aşırı limitini][al-overlimit] hedefleyen saldırıları aramak için.
* `xxe`: [XML External Entity][al-xxe] saldırılarını aramak için.
* `vpatch`: [sanal yamalar][al-virtual-patch] için arama yapmak.
* `dirbust`: [zorla gezinme][al-forced-browsing] saldırılarını ve bu tip saldırılardan dolayı [redlisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `ldapi`: [LDAP enjeksiyonu][al-ldapi] saldırılarını aramak için.
* `scanner`: [port tarama][al-port-scanner] saldırıları aramak için.
* `infoleak`: [bilgi ifşa][al-infoleak] saldırıları aramak için.
* `mail_injection`: [Email Enjeksiyonları][email-injection] aramak için.
* `ssi`: [SSI Enjeksiyonları][ssi-injection] aramak için.
* `overlimit_res`: [kaynak aşırı limitli][overlimit-res] türünde saldırıları aramak için.
* `experimental`: [özel düzenli ifadelere dayalı](../rules/regex-rule.md) deneysel saldırıları tespit etmek.
* `bola`: [broken-object-level-authorization-bola][al-bola] (broken-object-level-authorization) zafiyetini hedefleyen saldırıları ve bu tip saldırılardan dolayı [redlisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `mass_assignment`: [Mass Assignment](../../attacks-vulns-list.md#mass-assignment) saldırı girişimlerini aramak için.
* `api_abuse`: [botlar tarafından yapılan API saldırıları](../../attacks-vulns-list.md#api-abuse) aramak için.
* `ssrf`: [Server‑side Request Forgery (SSRF) ve saldırıları](../../attacks-vulns-list.md#serverside-request-forgery-ssrf) aramak için.
* `blocked_source`: **manually** [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) IP'lerden kaynaklanan saldırıları aramak için.
* `multiple_payloads`: [Kötü amaçlı yük sayısı](../../user-guides/triggers/triggers.md#step-1-choosing-a-condition) tetiğine dayalı saldırıları ve bu tip saldırılardan dolayı [redlisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) IPlerden gelen engellenmiş istekleri aramak için.

Bir saldırı adı hem büyük harf hem de küçük harfle belirtilebilir: `SQLI`, `sqli` ve `SQLi` eşit derecede doğru.

### OWASP en iyi tehditlerle ilişkili saldırıları arayın

OWASP tehdit etiketlerini kullanarak, OWASP en iyi tehditlerle ilişkili saldırıları bulabilirsiniz. Bu saldırıları aramak için format `owasp_api1_2023`.

Bu etiketler, OWASP tarafından tanımlanan tehditlerin orijinal numaralandırmasına karşılık gelir. Wallarm, saldırıları 2019 ve 2023 versiyonlarındaki OWASP API Top tehditleriyle ilişkilendirir.

### Bilinen saldırılara (CVE ve iyi bilinen istismarlar) göre arama

* `known`: Kesin olarak saldıran istekleri aramak için, çünkü bunlar CVE zafiyetlerini veya diğer iyi bilinen zafiyet türlerini hedef alırlar.

    Belirli bir CVE veya başka bir iyi bilinen zafiyet türüne göre saldırıları filtrelemek için, uygun etiketi, `known` etiketine ek olarak veya ondan ayrı olarak geçirebilirsiniz. Örneğin: `known:CVE-2004-2402 CVE-2018-6008` veya `CVE-2004-2402 CVE-2018-6008` seçeneklerini kullanarak [CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) ve [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) zafiyetlerini hedefleyen saldırıları aramak.
* `!known`: Potansiyel yanıltıcı pozitifler. Bu istekler, az bilinen istismarları içerebilir veya istismarları meşru parametre değerlerine dönüştüren bağlamları içerebilir.

CVE ve iyi bilinen istismarlarına göre saldırıları filtrelemek için, olay türleri ve **CVE ve istismarlar** tarafından hızlı filtreler kullanılabilir.

### API protokolleri tarafından arama isabetleri

Belluli isabetleri API protokolleri tarafından filtrelemek için, `proto:` veya `protocol:` etiketini kullanın.

Bu etiket aşağıdaki değerlere izin verir:

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### Kimlik doğrulama protokolleri tarafından arama isabetleri

Saldırganların kullandığı kimlik doğrulama protokolleri tarafından yapının isabetlerini belirlemek için, `auth:` etiketini kullanın.

Bu etiket aşağıdaki değerlere izin verir:

* `auth:none`
* `auth:api-key`
* `auth:aws`
* `auth:basic`
* `auth:bearer`
* `auth:cookie`
* `auth:digest`
* `auth:hawk`
* `auth:jwt`
* `auth:ntlm`
* `auth:oauth1`
* `auth:oauth2`
* `auth:scram`

### Saldırı hedefine göre arama

Arama dizesinde belirtin:

* `client`: Müşterilerin veri saldırılarını aramak için.
* `database`: Veritabanı saldırılarını aramak için.
* `server`: Uygulama sunucusu saldırılarını aramak için.

### Risk seviyesine göre arama

Risk seviyesini arama dizesinde belirtin:

* `low`: Düşük risk seviyesi.
* `medium`: Orta risk seviyesi.
* `high`: Yüksek risk seviyesi.

### Olay zamanına göre arama

Zaman dilimini arama dizesinde belirtin. Eğer dönem belirtilmemişse, son 24 saat boyunca meydana gelen olaylar içinde arama yapılır.

Dönemi belirtmek için aşağıdaki yöntemler kullanılabilir:

* Tarih belirterek: `11/10/2020-11/14/2020`
* Tarih ve saat belirterek (saniye dikkate alınmaz): `11/10/2020 11:11`, `11:30-12:22`, `11/10/2020 11:12-01/14/2020 12:14`
* Belirli bir zamana göre: `>11/10/20`
* Metin takma adlarını kullanarak:
    * `yesterday` dünkü tarihe eşittir
    * `today` bugünkü tarihe eşittir
    * `last <unit>` geçmiş birimin tamamının başlangıcı ile mevcut tarih ve saate eşittir

        `<unit>` olarak `hafta`, `ay`, `yıl` veya bu birimlerin sayısı kullanılabilir. Örneğin: `last week`, `last 3 month` veya `last 3 months`.
    
    * `this <unit>` mevcut birimi ifade eder

        `hafta`, `ay`, `yıl` `<unit>` olarak kullanılabilir. Örneğin: `this week` bugün Çarşamba olduğunda, bu haftanın Pazartesi, Salı ve Çarşamba günlerinde tespit edilen olayları döndürecektir.

Tarih ve saat formatı, [profilinizde](../settings/account.md) belirtilen ayarlara bağlıdır:

* **MDY** seçilmişse MM/DD/YYYY
* **DMY** seçilmişse DD/MM/YYYY
* **24‑hour** işaretliyse `13:00`
* **24‑hour** işaretli değilse `1pm`

Ay hem numara hem de isimle belirtilebilir: Ocak için `01`, `1`, `January`, `Jan`. Yıl hem tam formda (`2020`) hem de kısaltılmış formda (`20`) belirtilebilir. Tarih belirtilmezse, geçerli yıl kullanılır.

### IP adresine göre arama

IP adresine göre arama yapmak için, `ip:` önekinin ardından aşağıdakileri belirtebilirsiniz
*   Belirli bir IP adresi, örneğin `192.168.0.1`—bu durumda, saldırının kaynak adresinin bu IP adresine karşılık geldiği tüm saldırılar ve olaylar bulunur.
*   Bir IP adresi aralığını tanımlayan bir ifade.
*   Bir saldırı veya olayla ilgili toplam IP adresi sayısı.

#### IP adresi aralığına göre arama

Gerekli IP adresi aralığını belirlemek için aşağıdakileri kullanabilirsiniz:
*   Açık bir IP adresi aralığı:
    *   `192.168.0.0-192.168.63.255`
    *   `10.0.0.0-10.255.255.255`
*   Bir IP adresinin bir bölümü:
    *   `192.168.`—`192.168.0.0-192.168.255.255` ile eşittir. `*` değiştiricisi ile gereksiz format izin verilir—`192.168.*`
    *   `192.168.0.`—`192.168.0.0-192.168.0.255` ile eşittir
*   Bir ifade içinde son oktetin bir aralığı ile bir IP adresi veya parçası:
    *   `192.168.1.0-255`—`192.168.1.0-192.168.1.255` ile eşittir
    *   `192.168.0-255`—`192.168.0.0-192.168.255.255` ile eşittir
    
    !!! uyarı "Önemli"
        Bir oktet içinde değer aralığı kullanıldığında, sonuna nokta koyulmaz.

*   Alt ağ önekleri ([CIDR gösterim](https://tools.ietf.org/html/rfc4632)):
    *   `192.168.1.0/24`—`192.168.1.0-192.168.1.255` ile eşittir
    *   `192.168.0.0/17`—`192.168.0.1-192.168.127.255` ile eşittir

!!! not
    Yukarıdaki IP adresi aralığını tanımlama yöntemlerini birleştirebilirsiniz. Bunu yapmak için, gerekli tüm aralıkları ip: öneki ile ayrı ayrı listeleyin.
    
    **Örnek**: `ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IP adresi sayısına göre arama

Bir saldırı veya olayla ilgili (yalnızca saldırılar ve olaylar için) toplam IP adresi sayısına göre arama yapabilirsiniz:
*   `ip:1000+ last month`—geçtiğimiz ay içinde, benzersiz IP adreslerinin sayısı 1000'den fazla olan saldırıları ve olayları aramak (`attacks incidents ip:1000+ last month` ile eşittir).
*   `xss ip:100+`: Bütün cross‑site scripting saldırıları ve olaylarını aramak. Eğer saldıran IP adreslerinin (XSS saldırı tipi ile) sayısı 100'den azsa, arama sonucu boş olacaktır.
*   `xss p:id ip:100+`: `from` parametresinde (`?id=aaa`) JSON isteğin gövdesinde ilgili bütün XSS saldırıları ve olaylarını aramak. Bu sadece farklı IP adreslerinin sayısı 100'ü aştığında sonuçları döndürecektir.

### IP adresinin ait olduğu data merkezi tarafından saldırının kökeni

Saldırının kökeninin IP adresinin ait olduğu data merkezi tarafından aramak için `source:` önekinin ardından aşağıdakileri belirtebilirsiniz:

* `tor` Tor ağı için
* `proxy` halka açık veya web proxy sunucusu için
* `vpn` VPN için
* `aws` Amazon için
* `azure` Microsoft Azure için
* `gce` Google Cloud Platform için
* `ibm` IBM Bulutu için
* `alibaba` Alibaba Cloud için
* `huawei` Huawei Cloud için
* `rackspace` Rackspace Cloud için
* `plusserver` PlusServer için
* `hetzner` Hetzner için
* `oracle` Oracle Bulutu için
* `ovh` OVHcloud için
* `tencent` Tencent için
* `linode` Linode için
* `docean` Digital Ocean için

### IP adresinin kayıtlı olduğu ülke veya bölgeye göre arama

Saldırının kökeninin IP adresinin kayıtlı olduğu ülke veya bölgeye göre arama yapmak için, `country:` önekini kullanın.

Ülke/bölge adı, özelliği [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standartına uygun formatta büyük harf veya küçük harf şeklinde geçmelidir. Örneğin: `country:CN` veya `country:cn` Çin'den kaynaklanan saldırıları aramak için.

### Well-known kötü niyetli IP'lerden kaynaklanan etkinlikler için arama

Wallarm, kötü niyetli etkinliklere ait olduğu genel olarak kabul gören IP adresleri için halka açık kaynakları tarar. Ardından bu bilgilerin doğruluğunu doğrularız, böylece bu IP'leri redlisteye almak gibi gerekli eylemleri daha kolay şekilde alabilirsiniz.

Bu kötü niyetli IP adreslerinden kaynaklanan etkinlikleri aramak için `source:malicious` etiketini kullanınız. Bu, **Kötü Niyetli IPler** için ifade eder ve bloklama listesinde **kaynak tipine göre engelleme** bölümünde bu şekilde adlandırılmıştır.

Bu nesnenin verilerini, aşağıdaki kaynakların bir kombinasyonundan çekiyoruz:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [Digital Side Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [Green Snow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### Sunucu yanıt durumuna göre arama

Sunucu yanıt durumuna göre aramak için, `statuscode:` önekinin ardından aşağıdakileri belirtebilirsiniz:

* 100 ile 999 arasında bir numara.
* «N–M» aralığı, burada N ve M, 100 ile 999 arasında bir rakam.
* «N+» ve «N-» aralıkları, burada N, 100 ile 999 arasında bir rakam.

### Sunucu yanıt boyutuna göre arama

Sunucu yanıt boyutuna göre arama yapmak için, `s:` veya `size:` önekinin ardından aşağıdakileri belirtebilirsiniz.

Herhangi bir tam sayı değeri arayabilirsiniz. 999'dan büyük sayılar önek olmadan belirtilebilir. «N–M», «N+» ve «N-» aralıkları belirtilebilir, burada 999'dan büyük sayılar da önek olmadan belirtilebilir.

### HTTP istek yöntemine göre arama

HTTP istek yöntemine göre arama yapmak için, `method:` önekinin ardından aşağıdakileri belirtebilirsiniz:

* `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`: eğer büyük harf kullanılırsa, arama dizesi önek olmadan belirtilebilir. Bu değerler dışındaki tüm değerler için bir önek belirtmelisiniz.

### Saldırı/olay içindeki isabet sayısına göre arama

Saldırı ve olayları isabet sayısına göre aramak için, `N:` önekini belirtin.

Örneğin, 100'den fazla isabet olacak şekilde olan tüm saldırıları aramak için `attacks N:>100` aramasını kullanabilirsiniz. Ya da 10'dan az isabet içeren tüm saldırıları aramak için `attacks N:<10` komutunu kullanabilirsiniz.

### Domain'e göre arama

Domain'e göre aramak için, `d:` veya `domain:` öneki veya `=` sonekini kullanın. Eğer sondan kullanılırsa, bir `/` ile başlamayan dize parametre olarak kabul edilir (burada bitiş `=` karakteri değere dahil edilmez).

Olabilir özellik değerleri:

* Hedeflenen parametre adı.

    Örneğin, `xss` parametresini hedef almak ancak XSS-saldırıları hedef almayan (örneğin, `xss` nın GET-parametresinde olan SQL-enjeksiyonu saldırılarını) bulmak için, arama dizesinde `attacks sqli p:xss` belirtin.
* Wallarm node'unun parametre değerini okumak için kullandığı [parserin](../rules/request-processing.md) adı. İsim büyük harflerle yazılmalıdır.

    Örneğin, `attacks p:*BASE64` komutunu kullanarak base64 parserı tarafından ayrıştırılmış olan herhangi bir parametreyi hedefleyen saldırıları bulun.
* Parametre ve parser işlemlerin bir sırası.

    Örneğin: `attacks p:"POST_JSON_DOC_HASH_from"` kullanarak, bir isteğin JSON gövdesinde `from` parametresi ile ilgili tüm saldırıları bulabilir.

Bir değer içinde joker karakter kullanabilirsiniz. `*` karakteri herhangi bir sayıdaki karakteri, `?` karakteri ise herhangi bir tek karakteri değiştirir.

### Anormalliklerde saldırıları arama

Saldırılardaki anormallikleri aramak için, `a:` veya `anomaly:` öneki kullanın.

Bir anormal aramayı detaylandırmak için aşağıdaki parametreleri kullanabilirsiniz:

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

Örnek:

`attacks sqli a:size` komutunu kullanarak, isteklerinde yanıt boyutu anormallikleri olan tüm SQL-enjeksiyonu saldırılarını bulun.

### İstek tanımlayıcısına göre arama

Saldırı ve olayları istek tanımlayıcısına göre aramak için, `request_id` öneki belirtin.
`request_id` parametresinin aşağıdaki değer formu vardır: `a79199bcea606040cc79f913325401fb`. Daha kolay okunabilirlik için, bu parametre aşağıdaki örneklerde yer tutucu kısaltma `<requestId>` ile değiştirilmiştir.

Örnekler:
*   `attacks incidents request_id:<requestId>`: `request_id`’si `<requestId>` olan bir saldırı veya olayı aramak için.
*   `attacks incidents !request_id:<requestId>`: `request_id`’si `<requestId>` olmayan saldırıları ve olayları aramak için.
*   `attacks incidents request_id`: Herhangi bir `request_id` olan saldırıları ve olayları aramak için.
*   `attacks incidents !request_id`: Hiçbir `request_id` içermeyen saldırıları ve olayları aramak için.

### Örneklenmiş isabetler için arama

[Örneklenmiş isabetler](../events/analyze-attack.md#sampling-of-hits) için arama yapmak için, arama dizesine `sampled` ekleyin.

### Node UUID’ye göre arama

Saldırıları, belirli bir node tarafından tespit edilenlere göre aramak için, `node_uuid` öneki belirtin, ardından node UUID'si gelmelidir.

Örnekler:

* `attacks incidents today node_uuid:<NODE UUID>`: Bugün için bu `<NODE UUID>’ye sahip node tarafından bulunan tüm saldırılar ve olayları aramak için.
* `attacks today !node_uuid:<NODE UUID>`: Bugün için bu `<NODE UUID>’ye sahip node dışında herhangi bir node tarafından bulunan tüm saldırıları aramak için.

!!! bilgi "Yalnızca yeni saldırıları arama"
    Node UUID ile yapılan aramada, sadece 31 Mayıs 2023 tarihinden sonra tespit edilen saldırılar görüntülenir.

Node UUID'yi **Nodes** bölümünde, [node detayları](../../user-guides/nodes/nodes.md#viewing-details-of-a-node)nden bulabilirsiniz. UUID'yi kopyalamak için tıklayınız veya **Bu node'dan bugünkü etkinliklere bak** seçeneğine tıklayınız (**Etkinlikler** bölümüne geçer).

### Regexp-tabanlı müşteri kuralına göre arama

[Regexp-tabanlı müşteri kurallarına](../../user-guides/rules/regex-rule.md) dayalı saldırıları bulunanlar listesini almak için, arama alanında `custom_rule` belirtin.

Herhangi böyle bir saldırı için, detaylarında ilgili kurallara linkler sunulur (birden fazla olabilir). Bağlantıya tıklayarak kural detaylarına erişebilir ve gerekirse düzenleyebilirsiniz.

![Regexp-tabanlı müşteri kuralı tarafından tespit edilen saldırı - kuralı düzenleme](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

Hiçbir regexp-tabanlı müşteri kuralıyla ilişkisi olmayan saldırıların listesini almak için `!custom_rule` kullanabilirsiniz.