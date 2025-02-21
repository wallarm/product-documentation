[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]:         ../../attacks-vulns-list.md#brute-force-attack
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]:          ../../attacks-vulns-list.md#data-bomb
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]:       ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]:     ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]:        ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]:           ../../attacks-vulns-list.md#resource-overlimit
[email-injection]:        ../../attacks-vulns-list.md#email-injection
[ssi-injection]:          ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]:            ../../attacks-vulns-list.md#invalid-xml
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]:          ../../attacks-vulns-list.md#resource-overlimit

# Olay Arama ve Filtreler

Wallarm, tespit edilen olayları (saldırılar ve olaylar) aramak için kullanışlı yöntemler sunar. Wallarm Console'da **Attacks** ve **Incidents** bölümlerinde aşağıdaki arama yöntemleri mevcuttur:

* **Filtreler**: Filtreleme kriterlerini seçmek için
* **Arama Alanı**: İnsan diline benzer öznitelikler ve modifikatörlerle arama sorguları girmek için

Filtrelerde belirlenen değerler otomatik olarak arama alanına aktarılır ve tersi de geçerlidir.

Herhangi bir arama sorgusu veya filtre kombinasyonunu **Save a query** seçeneğine tıklayarak kaydedebilirsiniz.

## Filtreler

Mevcut filtreler, Wallarm Console'da çeşitli biçimlerde sunulur:

* **Filtreler Paneli**: **Filter** butonuyla genişletilip daraltılabilen panel
* Belirli parametre değerlerine sahip olayları hariç tutmak veya yalnızca göstermek için hızlı filtreler

![Filters in the UI](../../images/user-guides/search-and-filters/filters.png)

Farklı filtrelerden değerler seçildiğinde, sonuçlar bu koşulların tümünü karşılar. Aynı filtre için farklı değerler belirtilirse, sonuçlardan herhangi biri karşılanır.

## Arama Alanı

Arama alanı, insan diline benzer öznitelikler ve modifikatörler içeren sorguları kabul eder; bu da sorgu göndermeyi sezgisel hale getirir. Örneğin:

* `attacks xss`: Tüm [XSS saldırılarını][al-xss] aramak için
* `attacks today`: Bugün gerçekleşen tüm saldırıları aramak için
* `xss 12/14/2020`: 14 Aralık 2020 tarihinde gerçekleşen [cross‑site scripting][al-xss] ile ilgili tüm şüphe, saldırı ve olayları aramak için
* `p:xss 12/14/2020`: 14 Aralık 2020 itibariyle xss HTTP istek parametresi içinde (örneğin, `http://localhost/?xss=attack-here`) tüm şüphe, saldırı ve olayları aramak için
* `attacks 9-12/2020`: Eylül'den Aralık 2020'ye kadar olan tüm saldırıları aramak için
* `rce /catalog/import.php`: Dünden itibaren `/catalog/import.php` yolundaki tüm [RCE][al-rce] saldırılarını ve olaylarını aramak için

Farklı parametrelerin değerleri belirtildiğinde, sonuçlar bu koşulların tümünü karşılar; aynı parametre için farklı değerler belirtilirse, sonuçlardan herhangi biri karşılanır.

!!! info "Öznitelik Değerini NOT Yapma"
    Bir öznitelik değerini olumsuzlamak için, öznitelik veya modifikatör adından önce `!` kullanın. Örneğin: `attacks !ip:111.111.111.111` ifadesi, kaynak adresi `111.111.111.111` hariç tüm IP adreslerinden gelen saldırıları gösterir.

Aşağıda, arama sorgularında kullanılabilecek öznitelik ve modifikatörlerin listesi verilmiştir.

### Nesne Türüne Göre Arama

Arama dizesinde belirtin:

* `attack`, `attacks`: Bilinen açıkları hedeflemeyen saldırıları aramak için.
* `incident`, `incidents`: Bilinen bir açığı kullanan saldırıların gerçekleştiği olayları aramak için.

### Saldırı Tipine Göre Arama

Arama dizesinde belirtin:

* `sqli`: [SQL injection][al-sqli] saldırılarını aramak için.
* `xss`: [Cross Site Scripting][al-xss] saldırılarını aramak için.
* `rce`: [OS Commanding][al-rce] saldırılarını aramak için.
* `brute`: [brute-force][al-brute-force] saldırıları ve bu tipe ait saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `ptrav`: [path traversal][al-path-traversal] saldırılarını aramak için.
* `crlf`: [CRLF injection][al-crlf] saldırılarını aramak için.
* `redir`: [open redirect][al-open-redirect] saldırılarını aramak için.
* `nosqli`: [NoSQL injection][al-nosqli] saldırılarını aramak için.
* `data_bomb`: [logic bomb][al-logic-bomb] saldırılarını aramak için.
* `ssti`: [Server‑Side Template Injections][ssti-injection] saldırılarını aramak için.
* `invalid_xml`: [güvensiz XML başlığının kullanımı][invalid-xml] saldırılarını aramak için.
* `overlimit_res`: [hesaplama kaynaklarının aşırı kullanımına yönelik saldırıları][al-overlimit] aramak için.
* `xxe`: [XML External Entity][al-xxe] saldırılarını aramak için.
* `vpatch`: [virtual patches][al-virtual-patch] aramak için.
* `dirbust`: [forced browsing][al-forced-browsing] saldırıları ve bu tipe ait saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `ldapi`: [LDAP injection][al-ldapi] saldırılarını aramak için.
* `scanner`: [port scanner][al-port-scanner] saldırılarını aramak için.
* `infoleak`: [information disclosure][al-infoleak] saldırılarını aramak için.
* `mail_injection`: [Email Injections][email-injection] saldırılarını aramak için.
* `ssi`: [SSI Injections][ssi-injection] saldırılarını aramak için.
* `overlimit_res`: [kaynak aşırı kullanımı][overlimit-res] tipindeki saldırıları aramak için.
* `experimental`: [özel düzenli ifade tabanlı](../rules/regex-rule.md) tespit edilen deneysel saldırıları aramak için.
* `bola`: [BOLA (IDOR) açığını][../../attacks-vulns-list.md#broken-object-level-authorization-bola] kullanan saldırıları ve bu nedenle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `mass_assignment`: [Mass Assignment](../../attacks-vulns-list.md#mass-assignment) saldırı girişimlerini aramak için.
* `api_abuse`: [şüpheli API etkinliğini](../../attacks-vulns-list.md#suspicious-api-activity) aramak için.
* `account_takeover` (`api_abuse` 4.10.6 öncesinde): [hesap ele geçirme girişimlerini](../../attacks-vulns-list.md#account-takeover) aramak için.
* `scraping` (`api_abuse` 4.10.6 öncesinde): [scraping girişimlerini](../../attacks-vulns-list.md#scraping) aramak için.
* `security_crawlers` (`api_abuse` 4.10.6 öncesinde): [security crawlers tarafından yapılan tarama girişimlerini](../../attacks-vulns-list.md#security-crawlers) aramak için.
* `ssrf`: [Server‑side Request Forgery (SSRF) saldırılarını](../../attacks-vulns-list.md#serverside-request-forgery-ssrf) aramak için.
* `blocked_source`: **manuel** olarak [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP'lerden gelen saldırıları aramak için.
* `multiple_payloads`: [Number of malicious payloads](../../admin-en/configuration-guides/protecting-with-thresholds.md) tetikleyicisi ile tespit edilen saldırılar ile bu tip saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP'lerden gelen engellenmiş istekleri aramak için.
* `credential_stuffing`: Çalınan kimlik doğrulama bilgilerini kullanma girişimlerini ([credential stuffing](../../about-wallarm/credential-stuffing.md)) aramak için.
* `ebpf`: [Wallarm eBPF tabanlı çözümü](../../installation/oob/ebpf/deployment.md) tarafından tespit edilen saldırıları aramak için.
* <a name="graphql-tags"></a> `graphql_attacks`: Organizasyonun GraphQL politikasını ihlal eden tüm olayları aramak için. Ayrıca, belirli ihlaller şu şekilde aranabilir:
    * `gql_doc_size`: İzin verilen maksimum toplam sorgu boyutunun ihlali
    * `gql_value_size`: İzin verilen maksimum değer boyutunun ihlali
    * `gql_depth`: İzin verilen maksimum sorgu derinliğinin ihlali
    * `gql_aliases`: İzin verilen maksimum alias sayısının ihlali
    * `gql_docs_per_batch`: İzin verilen maksimum toplu sorgu sayısının ihlali
    * `gql_introspection`: Yasaklanmış introspection sorgusu
    * `gql_debug`: Yasaklanmış debug modu sorgusu
* <a name="spec-violation-tags"></a>`api_specification`: [spesifikasyona dayalı](../../api-specification-enforcement/overview.md) ihlalleri aramak için. Ayrıca, belirli ihlaller şu şekilde aranabilir:
    * `undefined_endpoint`: Spesifikasyonunuzda yer almayan bir uç noktaya yapılan istek girişimi
    * `undefined_parameter`: Spesifikasyonunuzda yer almayan parametreleri içerdiği için saldırı olarak işaretlenen istekler
    * `missing_parameter`: Spesifikasyonunuzda gerekli olarak işaretlenen parametre veya değeri içermediği için saldırı olarak işaretlenen istekler
    * `invalid_parameter_value`: Parametre değerlerinden bazılarının, spesifikasyonunuzda tanımlanan tür/formatla uyumsuz olması nedeniyle saldırı olarak işaretlenen istekler
    * `missing_auth`: Gerekli kimlik doğrulama bilgilerini içermediği için saldırı olarak işaretlenen istekler
    * `invalid_request`: Geçersiz bir JSON içerdiği için saldırı olarak işaretlenen istekler
    * Yardımcı arama etiketi - `processing_overlimit`: API Specification Enforcement, istekleri spesifikasyonlara karşı değerlendirirken sınırlamalara tabidir – bu sınırlamalar aşıldığında, isteği işlemeyi durdurur ve bu durum hakkında bilgi veren bir olay oluşturur
    * bkz: `spec:'<SPECIFICATION-ID>'` [buradan](#search-by-specification)

Bir saldırı adı, büyük ve küçük harflerle belirtilebilir: `SQLI`, `sqli` ve `SQLi` aynıdır.

### OWASP En Üst Tehditlere Göre Arama

OWASP tehdidi etiketlerini kullanarak, OWASP en üst tehditlerle ilişkili saldırıları bulabilirsiniz. Bu saldırıları aramak için kullanılan format `owasp_api1_2023` şeklindedir.

Bu etiketler, OWASP tarafından tanımlanan tehditlerin orijinal numaralandırmasını temsil eder. Wallarm, saldırıları 2023 versiyonuna ait OWASP API Top tehditleriyle ilişkilendirir.

### Bilinen Saldırılara Göre Arama (CVE ve İyi Bilinen Exploitler)

* `known`: CVE açıklarını veya diğer iyi bilinen zafiyet tiplerini kullanan istekleri kesin olarak aramak için.

    Belirli bir CVE veya başka iyi bilinen bir zafiyet tipine göre saldırıları filtrelemek için `known` etiketiyle birlikte veya ondan ayrı olarak ilgili etiketi geçebilirsiniz. Örneğin: `known:CVE-2004-2402 CVE-2018-6008` veya `CVE-2004-2402 CVE-2018-6008` ifadesi, [CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) ve [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) açıklıklarını kullanan saldırıları arayacaktır.
* `!known`: Potansiyel yanlış pozitifler. Bu istekler, pek bilinmeyen exploitler içerebilir veya exploitlerin meşru parametre değerlerine dönüştüğü bağlamları içerebilir.

CVE ve iyi bilinen exploitlere göre saldırıları filtrelemek için, olay türlerine göre hızlı filtreler ve **CVE and exploits** kullanılabilir.

### API Protokollerine Göre Arama

API protokollerine göre istekleri filtrelemek için `proto:` veya `protocol:` etiketini kullanın.

Bu etiket aşağıdaki değerleri kabul eder:

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### Kimlik Doğrulama Protokollerine Göre Arama

Saldırganların kullandığı kimlik doğrulama protokollerine göre istekleri filtrelemek için `auth:` etiketini kullanın.

Bu etiket aşağıdaki değerleri kabul eder:

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

### Saldırı Hedefine Göre Arama

Arama dizesinde belirtin:

* `client`: İstemci verilerini hedef alan saldırıları aramak için.
* `database`: Veritabanı saldırılarını aramak için.
* `server`: Uygulama sunucusu saldırılarını aramak için.

### Risk Seviyesine Göre Arama

Arama dizesinde risk seviyesini belirtin:

* `low`: Düşük risk seviyesi.
* `medium`: Orta risk seviyesi.
* `high`: Yüksek risk seviyesi.

### Olay Zamanına Göre Arama

Arama dizesinde zaman aralığı belirtin. Eğer dönem belirtilmezse, arama son 24 saat içinde gerçekleşen olaylar arasında yapılır.

Aşağıdaki yöntemlerle dönem belirtebilirsiniz:

* Tarih ile: `11/10/2020-11/14/2020`
* Tarih ve saat ile (saniyeler göz ardı edilir): `11/10/2020 11:11`, `11:30-12:22`, `11/10/2020 11:12-01/14/2020 12:14`
* Belirli bir zamana göre: `>11/10/20`
* Dize takma adları kullanarak:
    * `yesterday`: Dünkü tarihi temsil eder
    * `today`: Bugünkü tarihi temsil eder
    * `last <unit>`: Geçmiş birimin başından mevcut tarih ve saate kadar olan periyodu ifade eder

        `week`, `month`, `year` veya bu birimlerin sayısı `<unit>` yerine kullanılabilir. Örneğin: `last week`, `last 3 month` veya `last 3 months`.
    
    * `this <unit>`: Geçerli birimi temsil eder

        `week`, `month`, `year` gibi birimler `<unit>` olarak kullanılabilir. Örneğin: `this week`, bugün Çarşamba ise Pazartesi, Salı ve Çarşamba günleri tespit edilen olayları döndürür.

Tarih ve saat formatı, [profile](../settings/account.md) bölümünde belirlenen ayarlara bağlıdır:

* **MDY** seçili ise MM/DD/YYYY
* **DMY** seçili ise DD/MM/YYYY
* **24‑hour** seçili ise `13:00`
* **24‑hour** seçili değilse `1pm`

Ay, hem sayı hem de isim olarak belirtilebilir: Ocak ayı için `01`, `1`, `January`, `Jan` gibi. Yıl ise tam (örneğin, `2020`) veya kısaltılmış (örneğin, `20`) olarak belirtilebilir. Eğer tarihte yıl belirtilmemişse, mevcut yıl kullanılır.

### IP Adresine Göre Arama

IP adresine göre arama yapmak için `ip:` önekini kullanın; ardından şunları belirtebilirsiniz:
*   Belirli bir IP adresi, örneğin `192.168.0.1`—bu durumda saldırı ve olay kaynak adresi bu IP ile eşleşen tüm sonuçlar bulunur.
*   Bir IP adres aralığını ifade eden bir ifade.
*   Bir saldırı veya olaya ilişkin toplam IP adresi sayısı.

#### IP Adresi Aralığına Göre Arama

Gerekli IP aralığını belirlemek için aşağıdakileri kullanabilirsiniz:
*   Açıkça belirlenmiş IP adres aralığı:
    *   `192.168.0.0-192.168.63.255`
    *   `10.0.0.0-10.255.255.255`
*   IP adresinin bir kısmı:
    *   `192.168.` — `192.168.0.0-192.168.255.255` ile eşdeğerdir. `*` modifikatörüyle de kullanılabilir — `192.168.*`
    *   `192.168.0.` — `192.168.0.0-192.168.0.255` ile eşdeğerdir.
*   Son oktet içinde değer aralığı bulunan bir IP adresi veya kısmı:
    *   `192.168.1.0-255` — `192.168.1.0-192.168.1.255` ile eşdeğerdir.
    *   `192.168.0-255` — `192.168.0.0-192.168.255.255` ile eşdeğerdir.
    
    !!! warning "Önemli"
        Bir oktet içinde değer aralığı kullanılırken, sonunda nokta kullanılmaz.

*   Alt ağ ön ekleri ([CIDR notasyonu](https://tools.ietf.org/html/rfc4632)):
    *   `192.168.1.0/24` — `192.168.1.0-192.168.1.255` ile eşdeğerdir.
    *   `192.168.0.0/17` — `192.168.0.1-192.168.127.255` ile eşdeğerdir.

!!! note
    IP adres aralıklarını tanımlamak için yukarıdaki yöntemleri birleştirebilirsiniz. Bunu yapmak için, ip: ön ekiyle gereken tüm aralıkları ayrı ayrı listeleyin.
    
    **Örnek**: `ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IP Adresi Sayısına Göre Arama

Bir saldırı veya olaya ilişkin toplam IP adresi sayısına göre arama yapılabilir (sadece saldırılar ve olaylar için):
*   `ip:1000+ last month` — Geçen ay içerisinde 1000'den fazla benzersiz IP adresine sahip saldırı ve olayları arar (eşdeğer: `attacks incidents ip:1000+ last month`).
*   `xss ip:100+` — Tüm cross‑site scripting saldırılarını ve olaylarını aramak için. Saldırgan IP sayısı 100'den az ise sonuç boş döner.
*   `xss p:id ip:100+` — `id` parametresine yönelik tüm XSS saldırılarını aramak için (`?id=aaa`). Bu, yalnızca farklı IP adreslerinin sayısı 100'ü aşarsa sonuç verir.

### Saldırının Geldiği Veri Merkezine Göre Arama

Saldırının geldiği IP adresinin ait olduğu veri merkezine göre arama yapmak için `source:` önekini kullanın.

Bu öznitelik değeri şunlardan biri olabilir:

* `tor` – Tor ağı için
* `proxy` – Genel veya web proxy sunucusu için
* `vpn` – VPN için
* `aws` – Amazon için
* `azure` – Microsoft Azure için
* `gce` – Google Cloud Platform için
* `ibm` – IBM Cloud için
* `alibaba` – Alibaba Cloud için
* `huawei` – Huawei Cloud için
* `rackspace` – Rackspace Cloud için
* `plusserver` – PlusServer için
* `hetzner` – Hetzner için
* `oracle` – Oracle Cloud için
* `ovh` – OVHcloud için
* `tencent` – Tencent için
* `linode` – Linode için
* `docean` – Digital Ocean için

### IP Adresinin Kayıtlı Olduğu Ülke veya Bölgeye Göre Arama

Saldırının geldiği IP adresinin kayıtlı olduğu ülke veya bölgeye göre arama yapmak için `country:` önekini kullanın.

Ülke/bölge adı, [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standardına uygun formatta, büyük veya küçük harflerle belirtilmelidir. Örneğin: `country:CN` veya `country:cn` Çin'den gelen saldırılar için.

### İyi Bilinen Kötü Amaçlı IP'lerden Gelen Olayları Arama

Wallarm, kötü niyetli etkinliklerle ilişkili geniş çapta bilinen IP adreslerini kamu kaynaklarından tarar. Ardından, doğruluğu sağlamak için bu bilgileri doğrularız; bu sayede, bu IP'leri denylist'e eklemek gibi gerekli önlemleri almanız daha kolay hale gelir.

Bu kötü amaçlı IP adreslerinden gelen olayları aramak için `source:malicious` etiketini kullanın. Bu, **Malicious IPs**'i temsil eder ve denylist'te, kaynak türüne göre engellemede bu şekilde adlandırılır.

Bu nesneye ilişkin veriler aşağıdaki kaynakların kombinasyonundan alınır:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### Sunucu Yanıt Durumuna Göre Arama

Sunucu yanıt durumuna göre arama yapmak için `statuscode:` önekini kullanın.

Yanıt durumu şu şekilde belirtilebilir:
* 100 ile 999 arasında bir sayı.
* «N–M» aralığı, burada N ile M 100 ile 999 arasındaki rakamlardır.
* «N+» veya «N-» aralıkları, burada N 100 ile 999 arasında bir sayıdır.

### Sunucu Yanıt Boyutuna Göre Arama

Sunucu yanıt boyutuna göre arama yapmak için `s:` veya `size:` önekini kullanın.

Herhangi bir tam sayı değeri aranabilir. 999 üzerindeki rakamlar ön ek olmaksızın belirtilebilir. «N–M», «N+» ve «N-» aralıkları, 999 üzerindeki rakamlar için de ön ek olmadan belirtilebilir.

### HTTP İstek Yöntemine Göre Arama

HTTP istek yöntemine göre arama yapmak için `method:` önekini kullanın.

`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` gibi değerleri aramak için büyük harf kullanıldığında, ön ek olmadan da belirtebilirsiniz; diğer değerler için ön ek gereklidir.

### Hit Sayısına Göre Arama

Saldırıları ve olayları hit (vuruş) sayısına göre aramak için `N:` önekini kullanın.

Örneğin, 100'den fazla hite sahip saldırıları aramak için: `attacks N:>100`. Veya 10'dan az hite sahip saldırıları aramak için `attacks N:<10` kullanabilirsiniz.

### Domain'e Göre Arama

Domain'e göre arama yapmak için `d:` veya `domain:` önekini kullanın.

İkinci seviye veya daha yüksek bir domain olabilecek herhangi bir dize, önek olmaksızın belirtilebilir. Dilerseniz, herhangi bir dize önekle de belirtilebilir.

Domain içinde maske kullanılabilir. `*` sembolü, herhangi bir karakter dizisini; `?` sembolü ise tek bir karakteri temsil eder.

### Yol (Path) Göre Arama

Yolu aramak için:

* `u:` veya `url:` önekini kullanarak ve `/` ile başlayan yolu tırnak içine alarak belirtin, örneğin: `url:"/api/users"`, veya
* Ön ek kullanmadan, `/` ile başlayarak belirtin, örneğin: `/api/users`

### Uygulamaya Göre Arama

Saldırının gönderildiği uygulamaya göre arama yapmak için `application:` veya `app:` önekini kullanın (önceden desteklenen `pool:` öneki hala desteklenmektedir ancak önerilmez).

Öznitelik değeri, **Settings** bölümündeki **Applications** sekmesinde ayarlanan uygulama adıdır. Örneğin: `application:'Example application'`.

### Parametre veya Parser'e Göre Arama

Parametre veya parser'e göre arama yapmak için `p:`, `param:`, veya `parameter:` önekini ya da `=` sonekini kullanın. Sonek kullanıldığında, `/` ile başlamayan dize parametre olarak kabul edilir (sonundaki `=` karakteri değere dahil edilmez).

Mümkün öznitelik değerleri:

* Hedef alınan parametrenin adı.

    Örneğin, `xss` parametresine yönelik saldırıları aramak, ancak XSS saldırıları aramamak için (örneğin, GET parametresinde `xss` bulunan SQL injection saldırıları), arama dizesinde `attacks sqli p:xss` belirtin.
* Wallarm node'unun parametre değerini okumak için kullandığı [parser](../rules/request-processing.md) adı. Ad büyük harflerle yazılmalıdır.

    Örneğin, herhangi bir parametre için BASE64 parser tarafından değerlendirilen saldırıları bulmak amacıyla `attacks p:*BASE64` kullanılabilir.
* Parametreler ve parser'ların sıralaması.

    Örneğin: `attacks p:"POST_JSON_DOC_HASH_from"` ifadesi, JSON gövdesindeki `from` parametresinde gönderilen saldırıları bulur.

Değer içerisinde maske kullanılabilir. `*` sembolü herhangi bir karakter dizisini, `?` sembolü ise tek bir karakteri temsil eder.

### Olaylarda Anomali Arama

Olaylardaki anomalileri aramak için `a:` veya `anomaly:` önekini kullanın.

Bir anomali aramasını daraltmak için şu parametreleri kullanabilirsiniz:

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

Örnek:

`attacks sqli a:size` ifadesi, isteklerinde yanıt boyutu anomalileri bulunan tüm SQL injection saldırılarını arar.

### İstek Tanımlayıcısına Göre Arama

Saldırıları ve olayları istek tanımlayıcısına göre aramak için `request_id` önekini kullanın.
`request_id` parametresinin biçimi şu şekildedir: `a79199bcea606040cc79f913325401fb`. Kolay okunabilmesi için, aşağıdaki örneklerde bu parametre `<requestId>` kısaltmasıyla değiştirilmiştir.

Örnekler:
*   `attacks incidents request_id:<requestId>`: `request_id` değeri `<requestId>` olan bir saldırı veya olayı aramak için.
*   `attacks incidents !request_id:<requestId>`: `request_id` değeri `<requestId>` olmayan saldırı ve olayları aramak için.
*   `attacks incidents request_id`: Herhangi bir `request_id`'ye sahip saldırı ve olayları aramak için.
*   `attacks incidents !request_id`: Herhangi `request_id`'si olmayan saldırı ve olayları aramak için.

### Örneklenmiş (Sampled) Hit'lere Göre Arama

[Sampled hits](../events/grouping-sampling.md#sampling-of-hits) aramak için arama dizesine `sampled` ekleyin.

### Node UUID'ye Göre Arama

Belirli bir node tarafından tespit edilen saldırıları aramak için `node_uuid` önekini, ardından node UUID'sini yazın.

Örnekler:

* `attacks incidents today node_uuid:<NODE UUID>`: Bugüne dair, bu `<NODE UUID>`'ye sahip node tarafından tespit edilen tüm saldırı ve olayları aramak için.
* `attacks today !node_uuid:<NODE UUID>`: Bugünkü saldırılar arasında, bu `<NODE UUID>`'ye sahip olmayan tüm node'lar tarafından tespit edilenleri aramak için.

!!! info "Sadece Yeni Saldırıları Ara"
    31 Mayıs 2023'ten sonra tespit edilen saldırılar, node UUID ile arama yapıldığında gösterilecektir.

Node UUID'sini **Nodes** bölümünde, [node detaylarında](../../user-guides/nodes/nodes.md#viewing-details-of-a-node) bulabilirsiniz. UUID'e tıklayarak kopyalayabilir veya **View events from this node for the day** seçeneğine tıklayarak (saldırılar bölümüne geçiş yapar) görüntüleyebilirsiniz.

### Spesifikasyona Göre Arama

Belirli [spesifikasyon politikası ihlallerine](../../api-specification-enforcement/overview.md) ilişkin olayları listelemek için arama alanına `spec:'<SPECIFICATION-ID>'` ifadesini yazın. `<SPECIFICATION-ID>`'yi almak için, **API Specifications** bölümünde spesifikasyonunuzu düzenlemek üzere açın – tarayıcı adres çubuğunda `specid` görüntülenecektir.

![Specification - use for applying security policies](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

Engellenmiş ve izlenen olaylar, yapılandırılmış politika ihlali eylemlerine bağlı olarak sunulabilir. Olay detaylarında, ihlal tipi ve ilgili spesifikasyona bağlantı gösterilir.

### Düzenli İfade Tabanlı Müşteri Kuralına Göre Arama

[Regexp tabanlı müşteri kuralları](../../user-guides/rules/regex-rule.md) tarafından tespit edilen saldırıları listelemek için arama alanına `custom_rule` yazın.

Bu tip saldırılardan her birinin detaylarında ilgili kurallara bağlantılar sunulur (birden fazla olabilir). Kurala erişmek ve gerekirse düzenlemek için bağlantıya tıklayın.

![Attack detected by regexp-based customer rule - editing rule](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

`!custom_rule` kullanarak, regexp tabanlı herhangi bir müşteri kuralıyla ilişkili olmayan saldırıları listeleyebilirsiniz.