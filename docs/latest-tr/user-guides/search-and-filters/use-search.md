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

Wallarm, tespit edilen olaylar (saldırılar ve olaylar) için uygun arama yöntemleri sağlar. Wallarm Console içindeki **Attacks** ve **Incidents** bölümlerinde aşağıdaki arama yöntemleri mevcuttur:

* Filtreleme kriterlerini seçmek için **Filters**
* İnsan diline benzer öznitelik ve değiştiricilerle arama sorguları girmek için **Search field**

Filtrelerde ayarlanan değerler otomatik olarak arama alanına kopyalanır ve tersi de geçerlidir.

Herhangi bir arama sorgusu veya filtre kombinasyonu **Save a query** tıklanarak kaydedilebilir.

## Filters

Mevcut filtreler, Wallarm Console içinde birden fazla biçimde sunulur:

* **Filter** düğmesi kullanılarak genişletilen ve daraltılan Filters paneli
* Belirli parametre değerlerine sahip olayları hariç tutmak veya yalnızca bunları göstermek için Quick filters

![UI'de Filters](../../images/user-guides/search-and-filters/filters.png)

Farklı filtrelerin değerleri seçildiğinde, sonuçlar bu koşulların tümünü sağlayacaktır. Aynı filtre için farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini sağlayacaktır.

## Search field

Arama alanı, sorgu göndermeyi sezgisel hale getiren, insan diline benzer öznitelik ve değiştiricilere sahip sorguları kabul eder. Örneğin:

* `attacks xss`: tüm [XSS saldırılarını][al-xss] aramak için
* `attacks today`: bugün gerçekleşen tüm saldırıları aramak için
* `xss 12/14/2020`: 14 Aralık 2020 tarihindeki tüm [cross‑site scripting][al-xss] şüpheleri, saldırıları ve olaylarını aramak için
* `p:xss 12/14/2020`: 14 Aralık 2020 itibarıyla xss HTTP istek parametresi içinde (örn. `http://localhost/?xss=attack-here`) tüm türlerdeki tüm şüpheleri, saldırıları ve olaylarını aramak için
* `attacks 9-12/2020`: Eylül-Aralık 2020 arasındaki tüm saldırıları aramak için
* `rce /catalog/import.php`: dünden beri `/catalog/import.php` yolundaki tüm [RCE][al-rce] saldırılarını ve olaylarını aramak için

Farklı parametrelerin değerleri belirtildiğinde, sonuçlar bu koşulların tümünü karşılar. Aynı parametre için farklı değerler belirtildiğinde, sonuçlar bu koşullardan herhangi birini karşılar.

!!! info "Öznitelik değerini NOT olarak ayarlama"
    Öznitelik değerini olumsuzlamak için, lütfen öznitelik veya değiştirici adından önce `!` kullanın. Örneğin: `attacks !ip:111.111.111.111`, `111.111.111.111` dışındaki herhangi bir IP adresinden kaynaklanan tüm saldırıları göstermek için.

Aşağıda, arama sorgularında kullanılabilen öznitelik ve değiştiricilerin listesini bulacaksınız.

### Nesne türüne göre arama

Arama dizgesine belirtin:

* `attack`, `attacks`: yalnızca bilinen güvenlik açıklarını hedef almayan saldırıları aramak için.
* `incident`, `incidents`: yalnızca olayları (bilinen bir güvenlik açığından yararlanan saldırılar) aramak için.

### Saldırı türüne göre arama

Arama dizgesine belirtin:

* `sqli`: [SQL injection][al-sqli] saldırılarını aramak için.
* `xss`: [Cross Site Scripting][al-xss] saldırılarını aramak için.
* `rce`: [OS Commanding][al-rce] saldırılarını aramak için.
* `brute`: [brute-force][al-brute-force] saldırılarını ve bu tür saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP’lerden gelen engellenen istekleri aramak için.
* `ptrav`: [path traversal][al-path-traversal] saldırılarını aramak için.
* `crlf`: [CRLF injection][al-crlf] saldırılarını aramak için.
* `redir`: [open redirect][al-open-redirect] saldırılarını aramak için.
* `nosqli`: [NoSQL injection][al-nosqli] saldırılarını aramak için.
* `data_bomb`: [logic bomb][al-logic-bomb] saldırılarını aramak için.
* `ssti`: [Server‑Side Template Injections][ssti-injection] aramak için.
* `invalid_xml`: [güvensiz XML başlığının kullanımı][invalid-xml]nı aramak için.
* `overlimit_res`: [hesaplama kaynaklarının aşırı kullanımını][al-overlimit] hedefleyen saldırıları aramak için.
* `xxe`: [XML External Entity][al-xxe] saldırılarını aramak için.
* `vpatch`: [virtual patches][al-virtual-patch] aramak için.
* `dirbust`: [forced browsing][al-forced-browsing] saldırılarını ve bu tür saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP’lerden gelen engellenen istekleri aramak için.
* `ldapi`: [LDAP injection][al-ldapi] saldırılarını aramak için.
* `scanner`: [port scanner][al-port-scanner] saldırılarını aramak için.
* `infoleak`: [bilgi ifşası][al-infoleak] saldırılarını aramak için.
* `mail_injection`: [Email Injections][email-injection] aramak için.
* `ssi`: [SSI Injections][ssi-injection] aramak için.
* `overlimit_res`: [resource overlimiting][overlimit-res] türündeki saldırıları aramak için.
* `experimental`: [custom regular expression](../rules/regex-rule.md) temelinde tespit edilen deneysel saldırıları aramak için.
* `bola`: [BOLA (IDOR) güvenlik açığını](../../attacks-vulns-list.md#broken-object-level-authorization-bola) istismar eden saldırıları ve bu tür saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP’lerden gelen engellenen istekleri aramak için.
* `mass_assignment`: [Mass Assignment](../../attacks-vulns-list.md#mass-assignment) saldırı girişimlerini aramak için.
* `api_abuse`: [şüpheli bot etkinliğini](../../attacks-vulns-list.md#suspicious-api-activity) aramak için.
* `account_takeover` (4.10.6’dan önce `api_abuse`): [hesap ele geçirme girişimlerini](../../attacks-vulns-list.md#account-takeover) aramak için.
* `scraping` (4.10.6’dan önce `api_abuse`): [scraping girişimlerini](../../attacks-vulns-list.md#scraping) aramak için.
* `security_crawlers` (4.10.6’dan önce `api_abuse`): [security crawlers tarafından gerçekleştirilen tarama girişimlerini](../../attacks-vulns-list.md#security-crawlers) aramak için.
* `resource_consumption`: [unrestricted resource consumption](../../attacks-vulns-list.md#unrestricted-resource-consumption) bot girişimlerini aramak için
* `ssrf`: [Server‑side Request Forgery (SSRF) ve saldırıları](../../attacks-vulns-list.md#serverside-request-forgery-ssrf) aramak için.
* `blocked_source`: **manuel** olarak [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP’lerden gelen saldırıları aramak için.
* `multiple_payloads`: [Number of malicious payloads](../../admin-en/configuration-guides/protecting-with-thresholds.md) tetikleyicisiyle tespit edilen saldırıları ve bu tür saldırılar nedeniyle [denylisted](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) IP’lerden gelen engellenen istekleri aramak için.
* `credential_stuffing`: çalıntı kimlik doğrulama bilgilerini kullanma girişimlerini ([credential stuffing](../../about-wallarm/credential-stuffing.md)) aramak için.
* `ebpf`: [Wallarm eBPF tabanlı çözümü](../../installation/oob/ebpf/deployment.md) tarafından tespit edilen saldırıları aramak için.
* `file_upload_violation`: [dosya yükleme kısıtlama politikalarının](../../api-protection/file-upload-restriction.md) ihlallerini aramak için.
* <a name="graphql-tags"></a> `graphql_attacks`: [kuruluşun GraphQL politikasının](../../api-protection/graphql-rule.md) tüm ihlallerini aramak için. Ayrıca, belirli ihlaller şu şekilde aranabilir:
    * `gql_doc_size`: izin verilen maksimum toplam sorgu boyutunun ihlali
    * `gql_value_size`: izin verilen maksimum değer boyutunun ihlali
    * `gql_depth`: izin verilen maksimum sorgu derinliğinin ihlali
    * `gql_aliases`: izin verilen maksimum takma ad sayısının ihlali
    * `gql_docs_per_batch`: izin verilen maksimum toplu sorgu sayısının ihlali
    * `gql_introspection`: yasaklanmış içgözlem sorgusu
    * `gql_debug`: yasaklanmış debug modu sorgusu
* <a name="spec-violation-tags"></a>`api_specification`: [specification-based](../../api-specification-enforcement/overview.md) tüm ihlalleri aramak için. Ayrıca, belirli ihlaller şu şekilde aranabilir:
    * `undefined_endpoint`: spesifikasyonunuzda yer almayan endpoint’i talep etme girişimi
    * `undefined_parameter`: spesifikasyonunuzda bu endpoint için yer almayan parametreleri içerdiği için saldırı olarak işaretlenen istekler
    * `missing_parameter`: spesifikasyonunuzda gerekli olarak işaretlenen parametreyi veya değerini içermediği için saldırı olarak işaretlenen istekler
    * `invalid_parameter_value`: bazı parametre değerleri, spesifikasyonunuzda tanımlanan tür/format ile uyumlu olmadığı için saldırı olarak işaretlenen istekler
    * `missing_auth`: gerekli kimlik doğrulama yöntemi bilgilerini içermediği için saldırı olarak işaretlenen istekler
    * `invalid_request`: geçersiz JSON içerdiği için saldırı olarak işaretlenen istekler
    * yardımcı arama etiketi - `processing_overlimit`: API Specification Enforcement, istekleri spesifikasyonlarla karşılaştırırken sınırlara sahiptir - bu sınırlar aşıldığında, isteği işlemeyi durdurur ve bunu bildiren bir olay oluşturur
    * ayrıca bakınız: `spec:'<SPECIFICATION-ID>'` [burada](#search-by-specification)

Bir saldırı adı hem büyük hem de küçük harflerle belirtilebilir: `SQLI`, `sqli` ve `SQLi` eşit derecede doğrudur.

### OWASP en önemli tehditleriyle ilişkili saldırıları arayın

OWASP tehdit etiketlerini kullanarak OWASP en önemli tehditleriyle ilişkili saldırıları bulabilirsiniz. Bu saldırıları aramak için biçim `owasp_api1_2023` şeklindedir.

Bu etiketler, OWASP tarafından tanımlanan tehditlerin orijinal numaralandırmasına karşılık gelir. Wallarm, saldırıları 2023 sürümünün OWASP API Top tehditleriyle ilişkilendirir.

### Bilinen saldırılara göre arama (CVE ve iyi bilinen exploit’ler)

* `known`: CVE güvenlik açıklarını veya diğer iyi bilinen güvenlik açığı türlerini istismar ettikleri için kesin olarak saldırı olan istekleri aramak için.

    Belirli bir CVE veya başka bir iyi bilinen güvenlik açığı türüne göre saldırıları filtrelemek için, `known` etiketine ek olarak veya ondan ayrı uygun etiketi iletebilirsiniz. Örneğin: `known:CVE-2004-2402 CVE-2018-6008` veya `CVE-2004-2402 CVE-2018-6008`, [CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) ve [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) güvenlik açıklarını istismar eden saldırıları aramak için.
* `!known`: potansiyel false positive’ler. Bu istekler az bilinen exploit’ler veya exploit’leri meşru parametre değerlerine dönüştüren bağlam içerebilir.

CVE ve iyi bilinen exploit’lere göre saldırıları filtrelemek için, olay türleri ve **CVE and exploits** için Quick filters kullanılabilir.

### API protokollerine göre hits arama

Hits’i API protokollerine göre filtrelemek için `proto:` veya `protocol:` etiketini kullanın.

Bu etiket aşağıdaki değerleri alır:

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### Kimlik doğrulama protokollerine göre hits arama

Saldırganların kullandığı kimlik doğrulama protokollerine göre hits’i filtrelemek için `auth:` etiketini kullanın.

Bu etiket aşağıdaki değerleri alır:

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

Arama dizgesine belirtin:

* `client`: istemci verilerine yönelik saldırıları aramak için.
* `database`: veritabanına yönelik saldırıları aramak için.
* `server`: uygulama sunucusuna yönelik saldırıları aramak için.

### Risk seviyesine göre arama

Arama dizgesinde risk seviyesini belirtin:

* `low`: düşük risk seviyesi.
* `medium`: orta risk seviyesi.
* `high`: yüksek risk seviyesi.

### Olay zamanına göre arama

Arama dizgesinde zaman aralığını belirtin. Eğer dönem belirtilmezse, arama son 24 saat içinde gerçekleşen olaylar içinde yapılır.

Dönemi belirtmenin şu yöntemleri vardır:

* Tarihe göre: `11/10/2020-11/14/2020`
* Tarih ve saate göre (saniyeler dikkate alınmaz): `11/10/2020 11:11`, `11:30-12:22`, `11/10/2020 11:12-01/14/2020 12:14`
* Belirli bir zamana göre ilişkili: `>11/10/20`
* Dize takma adlarını kullanarak:
    * `yesterday` dünkü tarihe eşittir
    * `today` bugünün tarihine eşittir
    * `last <unit>`, geçmişteki ilgili birimin başından mevcut tarih ve zamana kadar olan döneme eşittir

        `<unit>` olarak `week`, `month`, `year` veya bu birimlerin sayısı kullanılabilir. Örneğin: `last week`, `last 3 month` veya `last 3 months`.
    
    * `this <unit>` mevcut birime eşittir

        `<unit>` olarak `week`, `month`, `year` kullanılabilir. Örneğin: bugün Çarşamba ise `this week`, bu hafta Pazartesi, Salı ve Çarşamba günü tespit edilen olayları döndürür.

Tarih ve saat biçimi, [profilinizde](../settings/account.md) belirtilen ayarlara bağlıdır:

* **MDY** seçilirse MM/DD/YYYY
* **DMY** seçilirse DD/MM/YYYY
* **24‑hour** işaretliyse `13:00`
* **24‑hour** işaretli değilse `1pm`

Ay hem sayı hem de ad olarak belirtilebilir: Ocak için `01`, `1`, `January`, `Jan`. Yıl hem tam biçimde (`2020`) hem de kısaltılmış biçimde (`20`) belirtilebilir. Eğer tarihte yıl belirtilmemişse, geçerli yıl kullanılır.

### IP adresine göre arama

IP adresine göre arama yapmak için `ip:` önekini kullanın, ardından şunları belirtebilirsiniz:
*   Belirli bir IP adresi, örneğin `192.168.0.1` — bu durumda, saldırının kaynak adresi bu IP adresine karşılık gelen tüm saldırılar ve olaylar bulunacaktır.
*   IP adres aralığını tanımlayan bir ifade.
*   Bir saldırı veya olayla ilişkili toplam IP adresi sayısı.

#### IP adresi aralığına göre arama

Gerekli IP adresi aralığını ayarlamak için şunları kullanabilirsiniz:
*   Açık bir IP adres aralığı:
    *   `192.168.0.0-192.168.63.255`
    *   `10.0.0.0-10.255.255.255`
*   Bir IP adresinin bir kısmı:
    *   `192.168.` — `192.168.0.0-192.168.255.255` ile eşdeğerdir. `*` değiştiricisiyle gereksiz biçim de kabul edilir — `192.168.*`
    *   `192.168.0.` — `192.168.0.0-192.168.0.255` ile eşdeğerdir
*   İfadedeki son oktet içinde değer aralığı olan bir IP adresi veya onun bir kısmı:
    *   `192.168.1.0-255` — `192.168.1.0-192.168.1.255` ile eşdeğerdir
    *   `192.168.0-255` — `192.168.0.0-192.168.255.255` ile eşdeğerdir
    
    !!! warning "Önemli"
        Bir oktet içinde değer aralığı kullanıldığında, sonda nokta konulmaz.

*   Alt ağ önekleri ([CIDR notasyonu](https://tools.ietf.org/html/rfc4632)):
    *   `192.168.1.0/24` — `192.168.1.0-192.168.1.255` ile eşdeğerdir
    *   `192.168.0.0/17` — `192.168.0.1-192.168.127.255` ile eşdeğerdir

!!! note
    Yukarıdaki IP adres aralıklarını tanımlama yöntemlerini birleştirebilirsiniz. Bunu yapmak için, gerekli tüm aralıkları ip: önekiyle ayrı ayrı listeleyin.
    
    **Örnek**: `ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### IP adresi sayısına göre arama

Bir saldırı veya olayla ilişkili toplam IP adresi sayısına göre arama yapmak mümkündür (yalnızca saldırılar ve olaylar için):
*   `ip:1000+ last month` — son bir ay içinde benzersiz IP adresi sayısı 1000’den fazla olan saldırı ve olayları aramak için (`attacks incidents ip:1000+ last month` ile eşdeğer).
*   `xss ip:100+` — tüm cross‑site scripting saldırılarını ve olaylarını aramak için. Saldıran IP adreslerinin (XSS saldırı türü ile) sayısı 100’den azsa, arama sonucu boş olacaktır.
*   `xss p:id ip:100+` — id parametresiyle (`?id=aaa`) ilgili tüm XSS saldırılarını ve olaylarını aramak için. Bu, yalnızca farklı IP adreslerinin sayısı 100’ü aştığında sonuç döndürecektir.

### IP adresinin ait olduğu veri merkezine göre arama

Saldırıların geldiği IP adresinin ait olduğu veri merkezine göre arama yapmak için `source:` önekini kullanın.

Bu öznitelik değeri şunlar olabilir:

* `tor` Tor ağı için
* `proxy` genel veya web proxy sunucusu için
* `vpn` VPN için
* `aws` Amazon için
* `azure` Microsoft Azure için
* `gce` Google Cloud Platform için
* `ibm` IBM Cloud için
* `alibaba` Alibaba Cloud için
* `huawei` Huawei Cloud için
* `rackspace` Rackspace Cloud için
* `plusserver` PlusServer için
* `hetzner` Hetzner için
* `oracle` Oracle Cloud için
* `ovh` OVHcloud için
* `tencent` Tencent için
* `linode` Linode için
* `docean` Digital Ocean için

### IP adresinin kayıtlı olduğu ülke veya bölgeye göre arama

Saldırıların geldiği IP adresinin kayıtlı olduğu ülke veya bölgeye göre arama yapmak için `country:` önekini kullanın.

Ülke/bölge adı, [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) standardına uygun biçimde, büyük veya küçük harflerle özniteliğe iletilmelidir. Örneğin: Çin’den kaynaklanan saldırılar için `country:CN` veya `country:cn`.

### İyi bilinen kötü amaçlı IP’lerden kaynaklanan olayları arama

Wallarm, kötü amaçlı etkinliklerle ilişkilendirildiği yaygın olarak kabul edilen IP adresleri için herkese açık kaynakları tarar. Ardından, bu bilgiyi doğrulayıp doğruluğunu sağlarız; böylece bu IP’leri denylist’e eklemek gibi gerekli adımları atmanız kolaylaşır.

Bu kötü amaçlı IP adreslerinden kaynaklanan olayları aramak için `source:malicious` etiketini kullanın. Bu, **Malicious IPs** anlamına gelir ve denylist’te, kaynak türüne göre engelleme bölümünde buna göre adlandırılmıştır.

Bu nesne için verileri aşağıdaki kaynakların bir kombinasyonundan çekiyoruz:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### Sunucu yanıt durumuna göre arama

Sunucu yanıt durumuna göre arama yapmak için `statuscode:` önekini belirtin.

Yanıt durumu şu şekilde belirtilebilir:
* 100 ile 999 arasında bir sayı.
* «N–M» aralığı, burada N ve M 100 ile 999 arasında rakamlardır.
* «N+» ve «N-» aralıkları, burada N 100 ile 999 arasında bir sayıdır.

### Sunucu yanıt boyutuna göre arama

Sunucu yanıt boyutuna göre arama yapmak için `s:` veya `size:` önekini kullanın.

Herhangi bir tam sayı değeri arayabilirsiniz. 999’un üzerindeki rakamlar önek olmadan belirtilebilir. «N–M», «N+» ve «N-» aralıkları belirtilebilir, bu aralıklarda 999’un üzerindeki rakamlar da önek olmadan belirtilebilir.

### HTTP istek yöntemine göre arama

HTTP istek yöntemine göre arama yapmak için `method:` önekini belirtin.

`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` için: büyük harf kullanılıyorsa, arama dizgesi öneksiz belirtilebilir. Diğer tüm değerler için önek belirtilmelidir.

### Saldırı/olay içindeki hits sayısına göre arama

Saldırıları ve olayları hits sayısına göre aramak için `N:` önekini belirtin.

Örneğin, 100’den fazla hits’e sahip saldırıları arayabilirsiniz: `attacks N:>100`. Veya `attacks N:<10` ile 10’dan az hits’e sahip saldırıları arayabilirsiniz.

### Alan adına göre arama

Alan adına göre arama yapmak için `d:` veya `domain:` önekini kullanın.

İkinci veya daha yüksek seviyedeki bir alan adı olabilecek herhangi bir dize önek olmadan belirtilebilir. Herhangi bir dize önek ile belirtilebilir. 

Bir alan içinde maskeler kullanabilirsiniz. `*` sembolü herhangi bir sayıda karakteri, `?` sembolü ise tek bir karakteri değiştirir.

### Path’e göre arama

Path’e göre arama yapmak için ya:

* `u:` veya `url:` önekini kullanın ve `/` ile başlayan path’i tırnak içinde belirtin, örn.: `url:"/api/users"`, veya
* Girişi herhangi bir önek olmadan `/` ile başlatın, örn.: `/api/users`

### Uygulamaya göre arama

Saldırının gönderildiği uygulamaya göre arama yapmak için `application:` veya `app:` önekini kullanın (eski `pool:` öneki hâlâ desteklenir ancak önerilmez).

Öznitelik değeri, **Settings** bölümündeki **Applications** sekmesinde ayarlanmış uygulama adıdır. Örneğin: `application:'Example application'`.

### Parametre veya ayrıştırıcıya göre arama

Parametre veya ayrıştırıcıya göre arama yapmak için `p:`, `param:` veya `parameter:` önekini ya da `=` sonekinı kullanın. Sonek kullanılıyorsa, `/` ile başlamayan bir dize parametre olarak kabul edilir (bu durumda sondaki `=` karakteri değere dahil edilmez).

Olası öznitelik değerleri:

* Hedeflenen parametrenin adı.

    Örneğin, `xss` parametresini hedef alan saldırıları (örneğin, GET parametresinde `xss` bulunan bir SQL enjeksiyon saldırısı) ancak XSS saldırılarını değil bulmanız gerekiyorsa, arama dizgesine `attacks sqli p:xss` belirtin.
* Wallarm node’un parametre değerini okumak için kullandığı [parser](../rules/request-processing.md) adı. Ad büyük harf olmalıdır.

    Örneğin, `attacks p:*BASE64`, base64 ayrıştırıcı tarafından ayrıştırılan herhangi bir parametreyi hedef alan saldırıları bulmak için.
* Parametreler ve ayrıştırıcılar dizisi.

    Örneğin: `attacks p:"POST_JSON_DOC_HASH_from"`, bir isteğin JSON gövdesindeki `from` parametresinde gönderilen saldırıları bulmak için.

Bir değer içinde maskeler kullanabilirsiniz. `*` sembolü herhangi bir sayıda karakteri, `?` sembolü tek bir karakteri değiştirir.

### Olaylarda anomalileri arama

Olaylarda anomalileri aramak için `a:` veya `anomaly:` önekini kullanın.

Anomali aramasını daraltmak için aşağıdaki parametreleri kullanın:

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

Örnek:

`attacks sqli a:size`, isteklerinde yanıt boyutu anomalileri olan tüm SQL enjeksiyon saldırılarını arayacaktır.

### İstek tanımlayıcısına göre arama

Saldırıları ve olayları istek tanımlayıcısına göre aramak için `request_id` önekini belirtin.
`request_id` parametresi şu değer biçimine sahiptir: `a79199bcea606040cc79f913325401fb`. Okumayı kolaylaştırmak için, aşağıdaki örneklerde bu parametre `<requestId>` kısaltma yer tutucusuyla değiştirilmiştir.

Örnekler:
*   `attacks incidents request_id:<requestId>`: `request_id`’si `<requestId>`’e eşit olan bir saldırı veya olayı aramak için.
*   `attacks incidents !request_id:<requestId>`: `request_id`’si `<requestId>`’e eşit olmayan saldırıları ve olayları aramak için.
*   `attacks incidents request_id`: herhangi bir `request_id`’ye sahip saldırıları ve olayları aramak için.
*   `attacks incidents !request_id`: herhangi bir `request_id` bulunmayan saldırıları ve olayları aramak için.

### Örneklenen hits’i arama

[Örneklenen hits](../events/grouping-sampling.md#sampling-of-hits) için arama yapmak üzere arama dizgesine `sampled` ekleyin.

### Node UUID’sine göre arama

Belirli bir node tarafından tespit edilen saldırıları aramak için `node_uuid` önekini ve ardından node UUID’sini belirtin.

Örnekler:

* `attacks incidents today node_uuid:<NODE UUID>`: bu `<NODE UUID>`’ye sahip node tarafından bugün bulunan tüm saldırıları ve olayları aramak için.
* `attacks today !node_uuid:<NODE UUID>`: `<NODE UUID>`’ye sahip node hariç herhangi bir node tarafından bugün bulunan tüm saldırıları aramak için.

!!! info "Yalnızca yeni saldırıları arayın"
    Node UUID’sine göre arama yaparken yalnızca 31 Mayıs 2023’ten sonra tespit edilen saldırılar görüntülenecektir.

Node UUID’sini **Nodes** bölümünde, [node details](../../user-guides/nodes/nodes.md#viewing-details-of-a-node) içinde bulabilirsiniz. Kopyalamak için UUID’ye tıklayın veya **View events from this node for the day** öğesine tıklayın (bu, **Attacks** bölümüne geçer).

### Spesifikasyona göre arama

Belirli [spesifikasyon politikası ihlalleri](../../api-specification-enforcement/overview.md) ile ilgili olayların listesini almak için arama alanına `spec:'<SPECIFICATION-ID>'` belirtin. `<SPECIFICATION-ID>`’yi almak için **API Specifications** içinde spesifikasyonunuzu düzenleme için açın - `specid` tarayıcınızın adres alanında görüntülenecektir.

![Spesifikasyon - güvenlik politikalarını uygulamak için kullanın](../../images/api-specification-enforcement/api-specification-enforcement-events.png)

Yapılandırılan politika ihlali eylemlerine bağlı olarak engellenen ve izlenen olaylar sunulabilir. Olay ayrıntılarında, ihlal türü ve neden olan spesifikasyona bağlantı görüntülenir.

### Regexp tabanlı müşteri kuralına göre arama

[Regexp tabanlı müşteri kuralları](../../user-guides/rules/regex-rule.md) tarafından tespit edilen saldırıların listesini almak için arama alanına `custom_rule` belirtin.

Bu tür saldırıların her biri için, ayrıntılarında ilgili kurallara bağlantılar sunulur (birden fazla olabilir). Gerekirse kuralların ayrıntılarına erişmek ve düzenlemek için bağlantıya tıklayın.

![Regexp tabanlı müşteri kuralı tarafından tespit edilen saldırı - kuralı düzenleme](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

Herhangi bir regexp tabanlı müşteri kuralıyla ilişkili olmayan saldırıların listesini almak için `!custom_rule` kullanabilirsiniz.