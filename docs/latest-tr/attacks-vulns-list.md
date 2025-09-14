#   Saldırı ve Güvenlik Açığı Türleri

[cwe-20]:   https://cwe.mitre.org/data/definitions/20.html
[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-88]:   https://cwe.mitre.org/data/definitions/88.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-93]:   https://cwe.mitre.org/data/definitions/93.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-113]:  https://cwe.mitre.org/data/definitions/113.html
[cwe-96]:   https://cwe.mitre.org/data/definitions/96.html
[cwe-97]:   https://cwe.mitre.org/data/definitions/97.html
[cwe-150]:  https://cwe.mitre.org/data/definitions/150.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-307]:  https://cwe.mitre.org/data/definitions/307.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-409]:  https://cwe.mitre.org/data/definitions/409.html
[cwe-425]:  https://cwe.mitre.org/data/definitions/425.html
[cwe-444]:  https://cwe.mitre.org/data/definitions/444.html
[cwe-511]:  https://cwe.mitre.org/data/definitions/511.html
[cwe-521]:  https://cwe.mitre.org/data/definitions/521.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[CWE-598]:  https://cwe.mitre.org/data/definitions/598.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-776]:  https://cwe.mitre.org/data/definitions/776.html
[cwe-799]:  https://cwe.mitre.org/data/definitions/799.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]: https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]: https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]:  https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]: https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]: https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]:           https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://owasp.org/www-community/attacks/Path_Traversal
[link-wl-process-time-limit-directive]:     admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]:   user-guides/rules/vpatch-rule.md

[anchor-brute]: #brute-force-attack
[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #serverside-request-forgery-ssrf

[link-imap-wiki]:                                https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]:                                https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]:     https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

Bu makale, Wallarm’ın, [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve [OWASP API Top 10](https://owasp.org/www-project-api-security/) güvenlik risk listelerinde yer alanlar da dahil tespit edebildiği saldırı ve güvenlik açıklarını listeler ve açıklar. Listedeki güvenlik açıklarının ve saldırıların çoğuna, [Common Weakness Enumeration][link-cwe] (CWE) olarak da bilinen yazılım zayıflık türleri listesinde yer alan bir veya daha fazla kod eşlik eder.

!!! info "Yapılandırma gerekmez"
    Saldırı/güvenlik açığı açıklamasında belirli bir yapılandırmadan bahsedilmiyorsa, bu Wallarm’ın bu saldırı/güvenlik açığını sizden herhangi bir yapılandırma gerektirmeden varsayılan olarak tespit ettiği ve bunu [filtration mode](admin-en/configure-wallarm-mode.md) ile uyumlu şekilde ele aldığı anlamına gelir.

## Saldırı türleri

Teknik olarak, Wallarm tarafından tespit edilebilen tüm saldırılar iki türe ayrılır:

* **Girdi doğrulama saldırıları**, isteklere gönderilen belirli sembol kombinasyonları ile karakterize edilir ([SQL enjeksiyonu](#sql-injection), [çapraz site betik çalıştırma](#crosssite-scripting-xss), [uzaktan kod yürütme](#remote-code-execution-rce), [yol geçişi](#path-traversal) ve diğerleri).

    Girdi doğrulama saldırılarını tespit etmek için isteklerin sözdizimsel analizi gerekir - belirli sembol kombinasyonlarını tespit etmek üzere bunları ayrıştırmak.

    Wallarm, SVG, JPEG, PNG, GIF, PDF vb. ikili dosyalar dahil olmak üzere bir isteğin herhangi bir bölümündeki girdi doğrulama saldırılarını tespit eder.

    Wallarm, girdi doğrulama saldırılarını ve ilgili güvenlik açıklarını **otomatik olarak tespit eder** ve [filtration mode](admin-en/configure-wallarm-mode.md) ile uyumlu şekilde işlem yapar. Varsayılan davranışta, özel [kurallarınızın](user-guides/rules/rules.md) ve [tetikleyicilerinizin](user-guides/triggers/triggers.md) yapmış olabileceği değişiklikler olabileceğini unutmayın.

* **Davranışsal saldırılar**, belirli istek sözdizimi **ve/veya** istek sayısı ile istekler arası zamanın belirli bir korelasyonu ile karakterize edilir ([kaba kuvvet](#brute-force-attack), [zorla gezinme](#forced-browsing), [BOLA](#broken-object-level-authorization-bola), [API suistimali](#suspicious-api-activity), [kimlik bilgisi doldurma](#credential-stuffing) ve diğerleri).

    Davranışsal saldırıları tespit etmek için isteklerin sözdizimsel analizinin ve istek sayısı ile istekler arası zamanın korelasyon analizinin yapılması gerekir.

<!-- ??? info "Watch video about how Wallarm protects against OWASP Top 10"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div> -->

## DDoS saldırıları

DDoS (Distributed Denial of Service - Dağıtık Hizmet Reddi) saldırısı, bir saldırganın bir web sitesini veya API’yi birden fazla kaynaktan gelen trafikle bunaltarak kullanılamaz hale getirmeye çalıştığı bir siber saldırı türüdür.

Saldırganların bir DDoS saldırısı başlatmak için kullanabileceği birçok teknik vardır ve kullandıkları yöntem ve araçlar önemli ölçüde değişebilir. Bazı saldırılar nispeten basittir ve bir sunucuya çok sayıda bağlantı isteği gönderme gibi düşük seviyeli teknikler kullanırken, diğerleri IP adresi sahteciliği veya ağ altyapısındaki güvenlik açıklarından yararlanma gibi karmaşık taktikler kullanır.

[DDoS’a karşı kaynakları koruma rehberimizi okuyun](admin-en/configuration-guides/protecting-against-ddos.md)

## Sunucu tarafı saldırılar

### SQL injection

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-89][cwe-89]

**Wallarm kodu:** `sqli`

**Açıklama:**

Bu saldırıya karşı zafiyet, kullanıcı girdisinin yetersiz filtrelenmesi nedeniyle ortaya çıkar. SQL enjeksiyonu saldırısı, bir SQL veritabanına özel olarak hazırlanmış bir sorgu enjekte edilerek gerçekleştirilir.

SQL enjeksiyonu saldırısı, bir [SQL sorgusuna](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1) rastgele SQL kodu enjekte etmeye olanak tanır. Bu, saldırgana gizli verileri okuma ve değiştirme erişimi ile birlikte DBMS yönetici haklarının verilmesine yol açabilir.

**Wallarm korumasına ek olarak:**

Wallarm’ın uyguladığı koruma önlemlerine ek olarak şu önerileri takip edebilirsiniz:

*   Kötü amaçlı öğelerin çalıştırılmasını önlemek için tüm API istek parametrelerini temizleyin ve filtreleyin.
*   [OWASP SQL Injection Önleme Kılavuzu][link-owasp-sqli-cheatsheet] önerilerini uygulayın.

### NoSQL injection

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-943][cwe-943]

**Wallarm kodu:** `nosqli`

**Açıklama:**

Bu saldırıya karşı zafiyet, kullanıcı girdisinin yetersiz filtrelenmesi nedeniyle ortaya çıkar. NoSQL enjeksiyonu saldırısı, bir NoSQL veritabanına özel olarak hazırlanmış bir sorgu enjekte edilerek gerçekleştirilir.

**Wallarm korumasına ek olarak:**

* Kötü amaçlı bir öğenin girdide çalıştırılmasını önlemek için tüm kullanıcı girdisini temizleyin ve filtreleyin.

### Remote code execution (RCE)

**Güvenlik açığı/Saldırı**

**CWE kodları:** [CWE-78][cwe-78], [CWE-94][cwe-94] ve diğerleri

**Wallarm kodu:** `rce`

**Açıklama:**

Bir saldırgan, API’nize gönderdiği isteğe kötü amaçlı kod enjekte edebilir ve bu betik sunucuda yürütülür. Ayrıca saldırgan, savunmasız uygulamanın çalıştığı işletim sistemi için belirli komutları çalıştırmayı deneyebilir. 

Bir RCE saldırısı başarılı olursa, bir saldırgan aşağıdakiler de dahil olmak üzere geniş bir eylem yelpazesi gerçekleştirebilir:

*   Savunmasız verilerin gizliliğini, erişilebilirliğini ve bütünlüğünü tehlikeye atma.
*   Uygulamanın çalıştığı işletim sistemi ve sunucunun kontrolünü ele geçirme.
*   Diğer olası eylemler.

Bu güvenlik açığı, kullanıcı girdisinin yanlış doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Girdideki bir öğenin çalıştırılmasını önlemek için tüm kullanıcı girdisini temizleyin ve filtreleyin.

### SSI enjeksiyonu

**Saldırı**

**CWE kodu:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarm kodu:** `ssi`

**Açıklama:**

[SSI (Server Side Includes)][ssi-wiki], bir web sunucusundaki bir web sayfasına bir veya daha fazla dosyanın içeriğini dahil etmek için en kullanışlı olan basit, yorumlanan sunucu tarafı bir betik dilidir. Apache ve NGINX web sunucuları tarafından desteklenir.

SSI Enjeksiyonu, HTML sayfalarına kötü amaçlı payload’lar enjekte edilerek veya uzaktan rastgele kodlar çalıştırılarak bir uygulamadan yararlanılmasına izin verir. Uygulamada kullanılan SSI’nin manipülasyonu yoluyla ya da kullanıcı girdi alanları üzerinden SSI kullanımını zorlayarak istismar edilebilir.

**Örnek:**

Bir saldırgan, mesaj çıktısını değiştirebilir ve kullanıcı davranışını değiştirebilir. SSI Enjeksiyonu örneği:

```bash
<!--#config errmsg="Access denied, please enter your username and password"-->
```

**Wallarm korumasına ek olarak:**

* Girdideki kötü amaçlı payload’ların çalıştırılmasını önlemek için tüm kullanıcı girdisini temizleyin ve filtreleyin.
* [OWASP Girdi Doğrulama Kılavuzu][link-owasp-inputval-cheatsheet] önerilerini uygulayın.

### Sunucu tarafı şablon enjeksiyonu (SSTI)

**Güvenlik açığı/Saldırı**

**CWE kodları:** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Wallarm kodu:** `ssti`

**Açıklama:**

Bir saldırgan, SSTI saldırılarına karşı savunmasız bir web sunucusundaki kullanıcı tarafından doldurulan bir forma yürütülebilir kod enjekte edebilir ve bu kod web sunucusu tarafından ayrıştırılıp yürütülür.

Başarılı bir saldırı, savunmasız bir web sunucusunun tamamen tehlikeye girmesine neden olabilir; potansiyel olarak bir saldırganın keyfi istekler yürütmesine, sunucunun dosya sistemlerini keşfetmesine ve belirli koşullar altında uzaktan keyfi kod yürütmesine (ayrıntılar için [RCE saldırısına][anchor-rce] bakın) ve daha pek çok şeye olanak tanır.   

Bu güvenlik açığı, kullanıcı girdisinin yanlış doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Girdideki bir öğenin çalıştırılmasını önlemek için tüm kullanıcı girdisini temizleyin ve filtreleyin.

### LDAP enjeksiyonu

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-90][cwe-90]

**Wallarm kodu:** `ldapi`

**Açıklama:**

LDAP enjeksiyonları, bir saldırganın bir LDAP sunucusuna yönelik istekleri değiştirerek LDAP arama filtrelerini değiştirmesine olanak tanıyan bir saldırı sınıfını temsil eder.

Başarılı bir LDAP enjeksiyonu saldırısı, potansiyel olarak LDAP kullanıcıları ve ana bilgisayarları hakkındaki gizli veriler üzerinde okuma ve yazma işlemlerine erişim sağlar.

Bu güvenlik açığı, kullanıcı girdisinin yanlış doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

Wallarm’ın uyguladığı koruma önlemlerine ek olarak şu önerileri takip edebilirsiniz:

*   Girdideki bir öğenin çalıştırılmasını önlemek için bir uygulamanın girdi olarak aldığı tüm parametreleri temizleyin ve filtreleyin.
*   [OWASP LDAP Injection Önleme Kılavuzu][link-owasp-ldapi-cheatsheet] önerilerini uygulayın.

### E-posta enjeksiyonu

**Saldırı**

**CWE kodu:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarm kodu:** `mail_injection`

**Açıklama:**

E-posta Enjeksiyonu, standart e-posta sunucusu davranışını değiştirmek için genellikle uygulama iletişim formu üzerinden gönderilen kötü amaçlı bir [IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki] ifadesidir.

Bu saldırıya karşı zafiyet, iletişim formuna girilen verilerin zayıf doğrulanması nedeniyle ortaya çıkar. E-posta Enjeksiyonu, e-posta istemcisi kısıtlamalarının atlanmasına, kullanıcı verilerinin çalınmasına ve spam gönderilmesine olanak tanır.

**Wallarm korumasına ek olarak:**

* Girdideki kötü amaçlı payload’ların çalıştırılmasını önlemek için tüm kullanıcı girdisini temizleyin ve filtreleyin.
* [OWASP Girdi Doğrulama Kılavuzu][link-owasp-inputval-cheatsheet] önerilerini uygulayın.

### Sunucu tarafı istek sahteciliği (SSRF)

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-918][cwe-918]

**Wallarm kodu:** `ssrf`

**Açıklama:**

Başarılı bir SSRF saldırısı, bir saldırganın saldırıya uğrayan web sunucusu adına istekler yapmasına izin verebilir; bu da kullanılan ağ bağlantı noktalarının ortaya çıkmasına, dahili ağların taranmasına ve yetkilendirmenin atlanmasına yol açabilir.

**Wallarm korumasına ek olarak:**

*   Girdideki kötü amaçlı bir öğenin çalıştırılmasını önlemek için tüm istek parametrelerini temizleyin ve filtreleyin.
*   [OWASP SSRF Önleme Kılavuzu][link-owasp-ssrf-cheatsheet] önerilerini uygulayın.

### Yol geçişi

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-22][cwe-22]

**Wallarm kodu:** `ptrav`

**Açıklama:**

Yol geçişi saldırısı, bir saldırganın var olan yolları istek parametreleri aracılığıyla değiştirerek savunmasız web uygulamasının veya API’nin bulunduğu dosya sisteminde depolanan gizli veri içeren dosya ve dizinlere erişmesine olanak tanır.

Bu saldırıya karşı zafiyet, bir kullanıcı bir dosya veya dizin talep ettiğinde kullanıcı girdisinin yetersiz filtrelenmesinden kaynaklanır.

**Wallarm korumasına ek olarak:**

Wallarm’ın uyguladığı koruma önlemlerine ek olarak şu önerileri takip edebilirsiniz:

*   Girdideki kötü amaçlı bir öğenin çalıştırılmasını önlemek için tüm istek parametrelerini temizleyin ve filtreleyin.
*   Bu tür saldırıları azaltmaya yönelik ek öneriler [burada][link-ptrav-mitigation] mevcuttur.

### XML dış varlık (XXE) saldırısı

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-611][cwe-611]

**Wallarm kodu:** `xxe`

**Açıklama:**

XXE güvenlik açığı, bir saldırganın bir XML belgesine harici bir varlık enjekte etmesine ve bunun bir XML ayrıştırıcı tarafından değerlendirilip hedef web sunucusunda yürütülmesine olanak tanır.

Başarılı bir saldırı sonucunda, bir saldırgan şunları yapabilir:

*   Gizli verilere erişmek
*   Dahili veri ağlarını taramak
*   Web sunucusunda bulunan dosyaları okumak
*   Bir [SSRF][anchor-ssrf] saldırısı gerçekleştirmek
*   Hizmet Reddi (DoS) saldırısı gerçekleştirmek

Bu güvenlik açığı, bir uygulamada XML harici varlıklarının ayrıştırılmasına yönelik kısıtlamaların olmamasından kaynaklanır.

**Wallarm korumasına ek olarak:**

*   Kullanıcı tarafından sağlanan XML belgeleriyle çalışırken XML harici varlıklarının ayrıştırılmasını devre dışı bırakın.
*   [OWASP XXE Önleme Kılavuzu][link-owasp-xxe-cheatsheet] önerilerini uygulayın.

### Kaynak taraması

**Saldırı**

**CWE kodu:** yok

**Wallarm kodu:** `scanner`

**Açıklama:**    

Bir HTTP isteğine, bu isteğin korunan bir kaynağa yönelik saldırı veya tarama amacı taşıyan üçüncü taraf tarayıcı yazılımlarının bir parçası olduğuna inanılıyorsa `scanner` kodu atanır. Wallarm Scanner’ın istekleri bir kaynak taraması saldırısı olarak değerlendirilmez. Bu bilgi sonrasında bu hizmetlere saldırmak için kullanılabilir.

**Wallarm korumasına ek olarak:**

*   IP adres allowlist/denylist kullanımı ve kimlik doğrulama/yetkilendirme mekanizmalarıyla birlikte ağ çevresi tarama olasılığını sınırlayın.
*   Ağ çevresini bir güvenlik duvarının arkasına yerleştirerek tarama yüzeyini en aza indirin.
*   Hizmetlerinizin çalışması için gerekli ve yeterli olan bağlantı noktaları kümesini tanımlayın.
*   Ağ düzeyinde ICMP protokolü kullanımını kısıtlayın.
*   BT altyapınızın donanım ve yazılımlarını periyodik olarak güncelleyin.

## İstemci tarafı saldırılar

### Çapraz site betik çalıştırma (XSS)

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-79][cwe-79]

**Wallarm kodu:** `xss`

**Açıklama:**

Çapraz site betik çalıştırma saldırısı, bir saldırganın kullanıcının tarayıcısında hazırlanmış rastgele bir kod çalıştırmasına olanak tanır.

Birkaç XSS saldırı türü vardır:

*   Kalıcı XSS, kötü amaçlı kodun web uygulamasının sayfasına önceden gömülü olduğu durumdur.

    Web uygulaması kalıcı XSS saldırısına karşı savunmasızsa, bir saldırgan web uygulamasının HTML sayfasına kötü amaçlı kod enjekte edebilir; dahası, bu kod, enfekte sayfayı isteyen herhangi bir kullanıcının tarayıcısı tarafından kalıcı olarak yürütülür.
    
*   Yansıtılmış XSS, bir saldırganın bir kullanıcıyı özel olarak hazırlanmış bir bağlantıyı açması için kandırdığı durumdur.      

*   DOM tabanlı XSS, web uygulamasının sayfasına gömülü bir JavaScript kod parçacığının girişi ayrıştırdığı ve bu kod parçacığındaki hatalar nedeniyle girişi bir JavaScript komutu olarak yürüttüğü durumdur.

Yukarıda listelenen güvenlik açıklarından herhangi birinin istismar edilmesi, rastgele bir JavaScript kodunun yürütülmesine yol açar. XSS saldırısı başarılı olduğunda, bir saldırgan bir kullanıcının oturumunu veya kimlik bilgilerini çalabilir, kullanıcı adına istekler yapabilir ve diğer kötü niyetli eylemleri gerçekleştirebilir.

Bu güvenlik açığı sınıfı, kullanıcı girdisinin yanlış doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Girdideki bir öğenin çalıştırılmasını önlemek için bir uygulamanın girdi olarak aldığı tüm parametreleri temizleyin ve filtreleyin.
* Web uygulamasının sayfalarını oluştururken, dinamik olarak oluşturulan tüm öğeleri temizleyin ve kaçışlayın.
* [OWASP XSS Önleme Kılavuzu][link-owasp-xss-cheatsheet] önerilerini uygulayın.

### Açık yönlendirme

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-601][cwe-601]

**Wallarm kodu:** `redir`

**Açıklama:**

Bir saldırgan, meşru bir web uygulaması aracılığıyla bir kullanıcıyı kötü amaçlı bir web sayfasına yönlendirmek için açık yönlendirme saldırısını kullanabilir.

Bu saldırıya karşı zafiyet, URL girdilerinin yanlış filtrelenmesinden kaynaklanır.

**Wallarm korumasına ek olarak:**

*   Girdideki bir öğenin çalıştırılmasını önlemek için bir uygulamanın girdi olarak aldığı tüm parametreleri temizleyin ve filtreleyin.
*   Kullanıcıları tüm bekleyen yönlendirmeler hakkında bilgilendirin ve açık izin isteyin.

### CRLF enjeksiyonu

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-93][cwe-93]

**Wallarm kodu:** `crlf`

**Açıklama:**

CRLF enjeksiyonları, bir saldırganın bir sunucuya (ör. HTTP isteği) gönderilen bir isteğe Satır Başı (CR) ve Satır Sonu (LF) karakterlerini enjekte etmesine olanak tanıyan bir saldırı sınıfını temsil eder.

Diğer faktörlerle birleştirildiğinde, bu tür CR/LF karakter enjeksiyonu, çeşitli güvenlik açıklarının istismar edilmesine yardımcı olabilir (ör. HTTP Yanıt Bölme [CWE-113][cwe-113], HTTP Yanıt Kaçakçılığı [CWE-444][cwe-444]).

Başarılı bir CRLF enjeksiyonu saldırısı, bir saldırgana güvenlik duvarlarını atlama, önbellek zehirleme yapma, meşru web sayfalarının yerine kötü amaçlı olanları koyma, “Açık yönlendirme” saldırısını gerçekleştirme ve daha pek çok eylemi yapma imkanı verebilir. 

Bu güvenlik açığı, kullanıcı girdisinin yanlış doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Girdideki bir öğenin çalıştırılmasını önlemek için tüm kullanıcı girdisini temizleyin ve filtreleyin.

## Numaralandırma saldırıları

Numaralandırma saldırısı, kötü niyetli bir aktörün, farklı girdileri sistemli bir şekilde deneyerek ve yanıtları gözlemleyerek hedef bir sistem, ağ veya uygulama hakkında geçerli bilgiler toplamaya çalıştığı bir siber saldırı türüdür. Amaç, sistem içinde var olan geçerli kullanıcı adlarını, e-postaları, hesap adlarını, kaynakları veya hizmetleri belirlemektir.

### Genel numaralandırma saldırısı

**Saldırı**

**Wallarm kodu:** `Enum`

**Açıklama:**

Uygulamalarınızın normalde açığa çıkarılmayan herhangi bir verisini numaralandırma girişimi (kullanıcı hesapları, isimler, e-postalar, belirteçler, kimlik bilgisi çiftleri, sistem yapılandırması, hizmetler, herhangi bir parametre).

**Gerekli yapılandırma:**

Wallarm, yalnızca bir veya daha fazla [numaralandırma azaltma kontrolü](api-protection/enumeration-attack-protection.md) varsa genel numaralandırma saldırılarını tespit eder ve azaltır (Advanced API Security [subscription](about-wallarm/subscription-plans.md#core-subscription-plans) gerektirir).

[Varsayılan kontroller](api-protection/enumeration-attack-protection.md#generic-enumeration), izleme modunda sunulur (yeni müşteriler için) veya devre dışıdır (gerekirse etkinleştirin).

**Wallarm korumasına ek olarak:**

*   Bir API veya belirli uç noktalar için belirli bir zaman aralığındaki istek sayısını sınırlayın.
*   Bir API veya belirli uç noktalar için belirli bir zaman aralığındaki kimlik doğrulama/yetkilendirme denemelerinin sayısını sınırlayın.
*   Belirli sayıda başarısız denemeden sonra yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
*   Uygulamayı, uygulamanın kapsamı dışında kalanlar hariç, üzerinde çalıştığı sunucudaki herhangi bir dosya veya dizine erişmekten kısıtlayın.

### Kaba kuvvet saldırısı

**Saldırı**

**CWE kodları:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Wallarm kodu:** `brute` (**Attacks** içinde), `Brute force` (**API Sessions** içinde)

**Açıklama:**

Kaba kuvvet saldırısı, önceden tanımlanmış bir payload ile çok sayıda isteğin sunucuya gönderilmesiyle meydana gelir. Bu payload’lar bir şekilde oluşturulmuş olabilir veya bir sözlükten alınmış olabilir. Ardından, sunucunun yanıtı, payload’daki verilerin doğru kombinasyonunu bulmak için analiz edilir.

Başarılı bir kaba kuvvet saldırısı, potansiyel olarak kimlik doğrulama ve yetkilendirme mekanizmalarını atlayabilir ve/veya gizli kaynakları (dizinler, dosyalar, web sitesi bölümleri vb.) ortaya çıkarabilir; böylece diğer kötü niyetli eylemleri gerçekleştirme imkanı verir.

**Gerekli yapılandırma:**

Wallarm, yalnızca aşağıdakilerden biri varsa kaba kuvvet saldırılarını tespit eder ve azaltır: 

* [Genel numaralandırmaya karşı koruma](#generic-enumeration-attack)
* Abonelik planınızda mevcut yöntemle yapılandırılmış [Brute force protection](admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Rate limit rules](user-guides/rules/rate-limiting.md)

[Varsayılan kontroller](api-protection/enumeration-attack-protection.md#default-protection), izleme modunda sunulur (yeni müşteriler için) veya devre dışıdır (gerekirse etkinleştirin).

**Wallarm korumasına ek olarak:**

*   Bir API veya belirli uç noktalar için belirli bir zaman aralığındaki istek sayısını sınırlayın.
*   Bir API veya belirli uç noktalar için belirli bir zaman aralığındaki kimlik doğrulama/yetkilendirme denemelerinin sayısını sınırlayın.
*   Belirli sayıda başarısız denemeden sonra yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
*   Uygulamayı, uygulamanın kapsamı dışında kalanlar hariç, üzerinde çalıştığı sunucudaki herhangi bir dosya veya dizine erişmekten kısıtlayın.

### Bozuk nesne düzeyi yetkilendirme (BOLA)

**Güvenlik açığı/Saldırı**

**CWE kodu:** [CWE-639][cwe-639]

**Wallarm kodu:** Güvenlik açıkları için `idor`, `bola` (**Attacks** içinde), `BOLA` (**API Sessions** içinde)

**Açıklama:**

Saldırganlar, isteğe gönderilen bir nesnenin kimliğini (ID) manipüle ederek bozuk nesne düzeyi yetkilendirmeye karşı savunmasız API uç noktalarından yararlanabilir. Bu, hassas verilere yetkisiz erişime yol açabilir.

Bu sorun, API tabanlı uygulamalarda son derece yaygındır çünkü sunucu bileşeni genellikle istemcinin durumunu tamamen takip etmez ve bunun yerine erişilecek nesneleri belirlemek için istemciden gönderilen nesne kimlikleri gibi parametrelere daha fazla güvenir.

API uç noktasının mantığına bağlı olarak, bir saldırgan web uygulamaları, API’ler ve kullanıcılar üzerindeki verileri yalnızca okuyabilir veya bunları değiştirebilir.

Bu güvenlik açığı IDOR (Insecure Direct Object Reference) olarak da bilinir.

[Güvenlik açığı hakkında daha fazla ayrıntı](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)

**Gerekli yapılandırma:**

Wallarm, bu tür güvenlik açıklarını otomatik olarak keşfeder ancak BOLA saldırılarını yalnızca aşağıdakilerden biri varsa tespit eder ve azaltır:

* [Genel numaralandırmaya karşı koruma](#generic-enumeration-attack)
* Abonelik planınızda mevcut yöntemle yapılandırılmış [BOLA koruması](admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [API Discovery](api-discovery/overview.md) tarafından keşfedilen uç noktalar için [Otomatik BOLA koruması](admin-en/configuration-guides/protecting-against-bola.md)

[Varsayılan kontroller](api-protection/enumeration-attack-protection.md#default-protection), izleme modunda sunulur (yeni müşteriler için) veya devre dışıdır (gerekirse etkinleştirin).

### Zorla gezinme

**Saldırı**

**CWE kodu:** [CWE-425][cwe-425]

**Wallarm kodu:** `dirbust` (**Attacks** içinde), `Forced browsing` (**API Sessions** içinde)

**Açıklama:**

Bu saldırının amacı, yani dizinler ve dosyalar gibi gizli kaynakları tespit etmektir. Bu, bir şablona göre oluşturulan veya hazırlanmış bir sözlük dosyasından çıkarılan farklı dosya ve dizin adlarının denenmesiyle başarılır.

Başarılı bir zorla gezinme saldırısı, uygulama arayüzünden açıkça erişilebilir olmayan ancak doğrudan erişildiğinde açığa çıkan gizli kaynaklara erişim sağlayabilir.

**Gerekli yapılandırma:**

Wallarm, yalnızca abonelik planınızda mevcut yöntemle yapılandırılmış [zorla gezinmeye karşı koruma](admin-en/configuration-guides/protecting-against-forcedbrowsing.md) varsa zorla gezinmeyi tespit eder ve azaltır.

[Varsayılan kontroller](api-protection/enumeration-attack-protection.md#forced-browsing), izleme modunda sunulur (yeni müşteriler için) veya devre dışıdır (gerekirse etkinleştirin).

**Wallarm korumasına ek olarak:**

*   Kullanıcıların doğrudan erişmesi gerekmeyen kaynaklara erişimini kısıtlayın veya sınırlayın (ör. bazı kimlik doğrulama veya yetkilendirme mekanizmalarını kullanarak).
*   Bir API veya belirli uç noktalar için belirli bir zaman aralığındaki istek sayısını sınırlayın.
*   Bir API veya belirli uç noktalar için belirli bir zaman aralığındaki kimlik doğrulama/yetkilendirme denemelerinin sayısını sınırlayın.
*   Belirli sayıda başarısız denemeden sonra yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
*   Dosya ve dizinler için gerekli ve yeterli erişim haklarını ayarlayın.

## Erişim düzeyi 

**Wallarm korumasına ek olarak:**

* Kullanıcı politikaları ve hiyerarşisine dayanan uygun bir yetkilendirme mekanizması uygulayın.
* Nesne kimlikleri için [GUID’ler](https://en.wikipedia.org/wiki/Universally_unique_identifier) gibi rastgele ve öngörülemeyen değerler kullanmayı tercih edin.
* Yetkilendirme mekanizmasını değerlendirecek testler yazın. Testleri bozan güvenlik açığı içeren değişiklikleri dağıtmayın.

### Toplu atama

**Saldırı**

**Wallarm kodu:** `mass_assignment`

**Açıklama:**

Bir toplu atama saldırısında saldırganlar, HTTP istek parametrelerini program kodu değişkenlerine veya nesnelere bağlamaya çalışır. Bir API savunmasızsa ve bağlamaya izin veriyorsa, saldırganlar, ortaya çıkarılması amaçlanmayan hassas nesne özelliklerini değiştirebilir; bu da ayrıcalık artırımı, güvenlik mekanizmalarının atlanması ve daha fazlasına yol açabilir.

Toplu Atama saldırılarına karşı savunmasız API’ler, uygun filtreleme olmadan istemci girdisini dahili değişkenlere veya nesne özelliklerine dönüştürmeye izin verir. Bu güvenlik açığı, en ciddi API güvenlik risklerinden biri olan [OWASP API Security Top 10 2023 (API3:2023 Broken Object Property Level Authorization)](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/) listesinde yer alır.

**Wallarm korumasına ek olarak:**

* İstemci girdisini kod değişkenlerine veya nesne özelliklerine otomatik olarak bağlayan fonksiyonları kullanmaktan kaçının.
* İstemci tarafından güncellenmesi gereken özellikleri yalnızca allowlist etmek ve özel özellikleri blocklist’e almak için yerleşik fonksiyon özelliklerini kullanın.
* Uygunsa, girdi veri payload’ları için şemaları açıkça tanımlayın ve zorunlu kılın.

## API suistimali

### Şüpheli API etkinliği

**Saldırı**

**Wallarm kodu:** `api_abuse`

**Açıklama:**

Sunucu yanıt süresinde artış, sahte hesap oluşturma ve scalping’i içeren temel bot türleri kümesi.

**Gerekli yapılandırma:**

Wallarm, yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkin ve düzgün yapılandırılmışsa API suistimali saldırılarını tespit eder ve azaltır.

**API Abuse Prevention** modülü, aşağıdaki bot türlerini tespit etmek için karmaşık bot tespit modelini kullanır:

* Sunucu yanıt süresini artırmaya veya sunucuyu kullanılamaz hale getirmeye yönelik API suistimali. Genellikle kötü amaçlı trafik artışları ile başarılır.
* [Sahte hesap oluşturma](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) ve [Spam gönderme](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming), sahte hesaplar oluşturma veya sahte içeriği (ör. geri bildirim) onaylamadır. Genellikle hizmetin kullanılamaz hale gelmesine yol açmaz ancak normal iş süreçlerini yavaşlatır veya bozar, örneğin:

    * Destek ekibinin gerçek kullanıcı isteklerini işlemesi
    * Pazarlama ekibinin gerçek kullanıcı istatistiklerini toplaması

* [Scalping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping), botların çevrimiçi mağaza ürünlerini gerçek müşteriler için kullanılamaz hale getirmesi ile karakterize edilir; örneğin, tüm ürünleri rezerve ederek stokta kalmamalarına yol açmak ancak kâr sağlamamak.

Metrikler bot saldırısı işaretlerine işaret ederse, modül anomali trafiğinin kaynağını 1 saatliğine [denylist’e veya graylist’e](api-abuse-prevention/setup.md#creating-profiles) alır.

**Wallarm korumasına ek olarak:**

* [Otomatik tehditlere ilişkin OWASP açıklamasıyla](https://owasp.org/www-project-automated-threats-to-web-applications/) tanışın.
* Uygulamanızla kesinlikle ilgili olmayan bölgelerin ve kaynakların (Tor gibi) IP adreslerini denylist’e alın.
* Sunucu tarafı istek hız sınırı yapılandırın.
* Ek CAPTCHA çözümleri kullanın.
* Uygulama analizlerinizde bot saldırısı işaretlerini arayın.

### Hesap ele geçirme

**Saldırı**

**Wallarm kodu:** `account_takeover` (4.10.6’dan önce `api_abuse`)

**Açıklama:**

Kötü niyetli bir aktörün başka birinin hesabına onun izni veya bilgisi olmadan erişim elde ettiği bir siber saldırı türü. Hesaba erişim sağladıktan sonra, hassas bilgileri çalmak, sahte işlemler yapmak veya spam ya da kötü amaçlı yazılım yaymak gibi çeşitli amaçlar için kullanılabilir.

**Gerekli yapılandırma:**

Wallarm, yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkin ve düzgün yapılandırılmışsa hesap ele geçirme saldırılarını tespit eder ve azaltır.

Ortak [dedektörlere](api-abuse-prevention/overview.md#how-api-abuse-prevention-works) ek olarak, API Abuse Prevention farklı hesap ele geçirme saldırılarını tespit etmeye yönelik özel dedektörler içerir: 

* **IP rotation** – bir IP adresleri havuzu kullanan hesap ele geçirme saldırıları için.
* **Session rotation** – bir IP oturumları havuzu kullanan hesap ele geçirme saldırıları için.
* **Persistent ATO** – uzun bir süre boyunca kademeli olarak gerçekleşen hesap ele geçirme saldırıları için.
* **Credential stuffing** – istikrarlı istek öznitelikleri korunurken farklı kimlik bilgileriyle tekrarlanan oturum açma denemelerini içeren hesap ele geçirme saldırıları için ([kimlik bilgisi doldurma](#credential-stuffing)).
* **Low-frequency credential stuffing** – sonrasında API etkileşimi olmadan ([kimlik bilgisi doldurma](#credential-stuffing)) izole veya minimal kimlik doğrulama denemeleri ile karakterize edilen hesap ele geçirme saldırıları için: saldırganlar tespitten kaçınmak için oturum veya istemci başına oturum açma denemelerini kasıtlı olarak sınırlar. Bu tür saldırılar genellikle çalıntı, sentetik veya otomatik oluşturulmuş kimlik bilgilerini kullanır ve birden çok IP adresi, oturum veya zaman dilimi arasında dağıtılır.

API Abuse Prevention, genellikle kritik uç noktalara ve/veya kimlik doğrulama ve/veya kayıt uç noktalarıyla ilişkili uç noktalara yönelik kaba kuvvet saldırısı olarak yapılan [kimlik bilgisi kırma](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html) işlemini gerçekleştiren botları tespit eder. Kabul edilebilir davranış metriklerinin otomatik eşiği, 1 saat boyunca meşru trafik temel alınarak hesaplanır.

**Wallarm korumasına ek olarak:**

* [Otomatik tehditlere ilişkin OWASP açıklamasıyla](https://owasp.org/www-project-automated-threats-to-web-applications/) tanışın.
* Güçlü parolalar kullanın.
* Farklı kaynaklar için aynı parolaları kullanmayın.
* İki faktörlü kimlik doğrulamayı etkinleştirin.
* Ek CAPTCHA çözümleri kullanın.
* Hesapları şüpheli etkinliklere karşı izleyin.

### Güvenlik tarayıcıları

**Saldırı**

**Wallarm kodu:** `security_crawlers` (4.10.6’dan önce `api_abuse`)

**Açıklama:**

Güvenlik tarayıcıları web sitelerini ve API’leri taramak, güvenlik açıklarını ve güvenlik sorunlarını tespit etmek için tasarlanmış olsa da kötü amaçlı amaçlarla da kullanılabilir. Kötü niyetli aktörler, savunmasız API’leri belirlemek ve kendi çıkarları için bunlardan yararlanmak için bunları kullanabilir.

Dahası, bazı güvenlik tarayıcıları kötü tasarlanmış olabilir ve sunucuları bunaltarak çökmesine veya diğer türde kesintilere yol açarak yanlışlıkla web sitelerine zarar verebilir.

**Gerekli yapılandırma:**

Wallarm, yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkin ve düzgün yapılandırılmışsa güvenlik tarayıcıları saldırılarını tespit eder ve azaltır.

**API Abuse Prevention** modülü, aşağıdaki güvenlik tarayıcı bot türlerini tespit etmek için karmaşık bot tespit modelini kullanır:

* [Fingerprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html), bir API’yi profillemek için bilgi ortaya çıkaran spesifik istekleri kullanır.
* [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html), API’nin bileşimi, yapılandırması ve güvenlik mekanizmaları hakkında mümkün olduğunca çok şey öğrenmeyi amaçlayan bilgi toplama faaliyetidir.
* [Zafiyet tarama](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning), hizmet güvenlik açıklarını arama ile karakterize edilir.

**Wallarm korumasına ek olarak:**

* [Otomatik tehditlere ilişkin OWASP açıklamasıyla](https://owasp.org/www-project-automated-threats-to-web-applications/) tanışın.
* SSL sertifikaları kullanın.
* Ek CAPTCHA çözümleri kullanın.
* Hız sınırlama uygulayın.
* Trafiğinizi, kötü amaçlı etkinliği gösterebilecek kalıpları bulmak için izleyin.
* Arama motoru tarayıcılarına hangi sayfaları tarayabileceklerini ve tarayamayacaklarını söylemek için robots.txt dosyası kullanın.
* Yazılımları düzenli olarak güncelleyin.
* İçerik dağıtım ağı (CDN) kullanın.

### Scraping

**Saldırı**

**Wallarm kodu:** `scraping` (4.10.6’dan önce `api_abuse`)

**Açıklama:**

Scraping, veri kazıma veya web hasadı olarak da bilinir, web sitelerinden ve API’lerden verilerin otomatik olarak çıkarılması sürecidir. Web sayfalarından ve API’lerden verileri almak ve çıkarmak ve bunları elektronik tablo veya veritabanı gibi yapılandırılmış bir biçimde kaydetmek için yazılım veya kod kullanmayı içerir.

Scraping kötü amaçlarla kullanılabilir. Örneğin, kazıyıcılar API’lerden oturum açma bilgileri, kişisel bilgiler veya finansal veriler gibi hassas bilgileri çalmak için kullanılabilir. Kazıyıcılar ayrıca, API’nın performansını düşürecek şekilde spam yapmak veya veri kazımak için de kullanılabilir ve bu da hizmet reddi (DoS) saldırılarına neden olabilir.

**Gerekli yapılandırma:**

Wallarm, yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkin ve düzgün yapılandırılmışsa scraping saldırılarını tespit eder ve azaltır.

**API Abuse Prevention** modülü, uygulamadan erişilebilir verileri ve/veya işlenmiş çıktıyı toplayan ve özel veya ücretsiz olmayan içeriğin herhangi bir kullanıcı için kullanılabilir hale gelmesiyle sonuçlanabilecek [scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping) bot türünü tespit etmek için karmaşık bot tespit modelini kullanır.

**Wallarm korumasına ek olarak:**

* [Otomatik tehditlere ilişkin OWASP açıklamasıyla](https://owasp.org/www-project-automated-threats-to-web-applications/) tanışın.
* Ek CAPTCHA çözümleri kullanın.
* Arama motoru tarayıcılarına hangi sayfaları tarayabileceklerini ve tarayamayacaklarını söylemek için robots.txt dosyası kullanın.
* Trafiğinizi, kötü amaçlı etkinliği gösterebilecek kalıpları bulmak için izleyin.
* Hız sınırlama uygulayın.
* Verileri gizleyin veya şifreleyin.
* Hukuki yollara başvurun.

### Sınırsız kaynak tüketimi

**Saldırı**

**Wallarm kodu:** `resource_consumption`

**Açıklama:**

Uygun sınırlar olmadan otomatik bir istemcinin aşırı API veya uygulama kaynaklarını tükettiği bir suistimal davranışı türü. Buna, büyük miktarda kötü amaçlı olmayan istek gönderme, işlemci, bellek veya bant genişliğini tüketme ve meşru kullanıcılar için hizmet bozulmasına neden olma dahil olabilir.

Uygun sınırların yokluğu şu şekillerde ortaya çıkabilir:

* **Yanıt zamanlaması** (**Yanıt süresi anomali** [bot dedektörü](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)) – API yanıtlarının gecikmesindeki normal dışı kalıplar, otomatik suistimal veya arka uç istismar girişimlerini işaret edebilir. İstekler, temel trafikle karşılaştırıldığında sürekli olarak olağan dışı yüksek veya düzensiz şekilde dalgalanan yanıt süreleri üretir. Bu anomaliler, botların hesaplama açısından pahalı sorgular göndermesinden, sistemi ölçmek için kasıtlı gecikmelerden veya hız sınırlarının altında kalmaya çalışan yavaş saldırı tekniklerinden kaynaklanabilir.
* **İstek boyutu** (**Aşırı istek tüketimi** [bot dedektörü](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)) – API’ya anormal derecede büyük istek payload’ları, arka uç işlem kaynaklarının suistimalini veya yanlış kullanımını gösterebilir. Bu davranış, aşırı büyük JSON gövdeleri, dosya yüklemeleri veya ayrıştırma, doğrulama veya depolama kapasitelerini tüketmeye yönelik derin iç içe yapılara başvurmayı içerebilir. Saldırganlar, arka uç yükünü artırmak, hız sınırlarını atlamak veya sistem sınırlarını keşfetmek için bu payload’lardan yararlanır.
* **Yanıt boyutu** (**Aşırı yanıt tüketimi** [bot dedektörü](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)) – yaşam döngüleri boyunca aktarılan toplam yanıt verisi hacminde şüpheli büyüklük. [Tüm bir oturum](api-sessions/overview.md) boyunca toplanan yanıt boyutları, yavaş damla veya dağıtılmış scraping saldırılarını ortaya çıkarır. Bu oturumlar istek başına zararsız görünebilir, ancak zamanla önemli veri sızıntısıyla sonuçlanır.

**Gerekli yapılandırma:**

!!! tip ""
    [NGINX Node](installation/nginx-native-node-internals.md#nginx-node) 6.3.0 veya üzeri gerektirir ve şu an için [Native Node](installation/nginx-native-node-internals.md#native-node) tarafından desteklenmez.

Wallarm, yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkin ve düzgün yapılandırılmışsa sınırsız kaynak tüketimi saldırılarını tespit eder ve azaltır.

Bu bot saldırı türü tespitinin hassas olması için, [API Sessions](api-sessions/overview.md) doğru şekilde [yapılandırılmalıdır](api-sessions/setup.md).

## GraphQL saldırıları

**Saldırı**

**Wallarm kodu:** `graphql_attacks`

**Açıklama:**

GraphQL, aşırı bilgi ifşası ve DoS ile ilgili protokole özgü saldırıların uygulanmasına izin veren özelliklere sahiptir; alt bölümlerde ayrıntıları görün.

Bu tür tehditleri önlemek için uygun bir tedbir, istek ve değer boyutları, sorgu derinliği, izin verilen toplu sorgu sayısı vb. gibi GraphQL istekleri için sınırlar belirlemektir. Wallarm’da bu sınırları [GraphQL policy](api-protection/graphql-rule.md) içinde belirlersiniz - sınırları aşan herhangi bir GraphQL isteği, GraphQL saldırısı olarak kabul edilir.

**Gerekli yapılandırma:**

Wallarm, yalnızca bir veya daha fazla [GraphQL saldırılarını tespit et] azaltma kontrolü veya kuralı yapılandırılmışsa (node 4.10.3 veya üzeri gerekir) GraphQL saldırılarını tespit eder ve azaltır.

[Varsayılan kontroller](api-protection/graphql-rule.md#default-protection), izleme modunda sunulur (yeni müşteriler için) veya devre dışıdır (gerekirse etkinleştirin).

**Wallarm korumasına ek olarak:**

* Hassas veya kısıtlı GraphQL API’lerine erişim için kimlik doğrulaması gerektirin.
* Enjeksiyon saldırılarını önlemek ve kötü amaçlı giriş değerlerine karşı korumak için girdileri ve çıktıları temizleyin.
* İstek ayrıntıları ve yanıt verileri dahil olmak üzere GraphQL sorgu etkinliğini izlemek ve analiz etmek için kapsamlı günlükleme mekanizmaları uygulayın.
* Sınırlı izinler ve erişim kontrolleriyle güvenli yürütme ortamlarında GraphQL sunucularını çalıştırın.

### GraphQL sorgu boyutu

**Wallarm kodu:** `gql_doc_size`: izin verilen maksimum toplam sorgu boyutu ihlali

**Açıklama:** 

Bir saldırgan, GraphQL uç noktaları için Hizmet Reddi (DoS) gerçekleştirmek veya sunucunun aşırı büyük girdileri nasıl ele aldığından yararlanarak başka sorunlara neden olmak isteyebilir.

### GraphQL değer boyutu

**Wallarm kodu:** `gql_value_size`: izin verilen maksimum değer boyutu ihlali

**Açıklama:**

Bir saldırgan, sunucu kaynaklarını bunaltmak için değişken veya argüman için aşırı uzun bir dize değeri içeren GraphQL isteği gönderebilir (Aşırı Değer Uzunluğu saldırısı).

### GraphQL sorgu derinliği

**Wallarm kodu:** `gql_depth`: izin verilen maksimum sorgu derinliği ihlali

**Açıklama:** 

GraphQL sorguları iç içe olabilir; bu, tek seferde karmaşık veri yapılarını istemeyi sağlar; ancak bu esneklik, potansiyel olarak sunucuyu bunaltabilecek derin iç içe sorgular oluşturmak için kötüye kullanılabilir.

### GraphQL takma adları

**Wallarm kodu:** `gql_aliases`: izin verilen maksimum takma ad sayısı ihlali

**Açıklama:** 

GraphQL’de takma adlar, sonuç alanlarını yeniden adlandırarak çakışmaları önleme ve daha iyi veri organizasyonu sağlama olanağı sunar; ancak, bir saldırgan bu özelliği Kaynak Tüketimi veya Hizmet Reddi (DoS) saldırısı başlatmak için kötüye kullanabilir.

### GraphQL batching

**Wallarm kodu:** `gql_docs_per_batch`: izin verilen maksimum toplu sorgu sayısı ihlali

**Açıklama:** 

GraphQL’de, bir tek HTTP isteğinde birden fazla sorgu (operasyon) toplu işlenebilir; birden fazla işlemi tek bir istekte birleştirerek, bir saldırgan hız sınırlama gibi güvenlik önlemlerini atlatmaya çalışarak batching saldırısı düzenleyebilir.

### GraphQL introspection

**Wallarm kodu:** `gql_introspection`: yasak introspection sorgusu

**Açıklama:** 

Bir saldırgan, GraphQL introspection sisteminden yararlanarak GraphQL API’sinin şeması hakkında ayrıntılar ortaya çıkarabilir; sistemi sorgulayarak, API’de mevcut tüm türler, sorgular, mutasyonlar ve alanlar hakkında bilgi edinme ve bu verileri daha kesin ve zarar verici sorgular oluşturmak için kullanma potansiyeline sahiptir.

### GraphQL debug

**Wallarm kodu:** `gql_debug`: yasak debug modu sorgusu

**Açıklama:**

GraphQL’de, debug modu geliştiriciler tarafından açık bırakıldığında, bir saldırgan tüm yığın izleri veya geri izlemeler gibi aşırı hata raporlama mesajlarından değerli bilgiler toplayabilir. Bir saldırgan, URI’de “debug=1“ parametresiyle debug moduna erişebilir.

## API spesifikasyonu

**Saldırı**

**Wallarm kodu:** `api_specification`, tüm spesifikasyon tabanlı ihlalleri gösterir. Özel ihlaller alt bölümlerde açıklanmıştır.

**Açıklama:**

[API Specification Enforcement](api-specification-enforcement/overview.md), yüklediğiniz spesifikasyonlara dayanarak API’lerinize güvenlik politikaları uygulamak için tasarlanmıştır. Birincil işlevi, spesifikasyonunuzdaki uç nokta açıklamaları ile REST API’lerinize yapılan gerçek istekler arasındaki tutarsızlıkları tespit etmektir. Bu tür tutarsızlıklar tespit edildiğinde, sistem bunları ele almak için önceden tanımlanmış eylemler gerçekleştirebilir.

API Specification Enforcement’ın, istekleri spesifikasyonlarla karşılaştırırken uygulanan sınırlara sahip olduğunu unutmayın - bu limitler aşıldığında, isteği işlemeyi durdurur ve bu konuda bilgi veren olayı oluşturur: bkz. [işleme limiti aşımı](#processing-overlimit).

### Tanımsız uç nokta

**Wallarm kodu:** `undefined_endpoint`

**Açıklama:**

Spesifikasyonunuzda yer almayan uç noktanın istenmesine yönelik bir girişim.

### Tanımsız parametre

**Wallarm kodu:** `undefined_parameter`

**Açıklama:**

Spesifikasyonunuzda bu uç nokta için yer almayan parametreleri içerdiği için saldırı olarak işaretlenen istekler.

### Geçersiz parametre

**Wallarm kodu:** `invalid_parameter_value`

**Açıklama:**

Parametrelerden bazılarının değerinin, spesifikasyonunuzda tanımlanan tür/format ile uyumlu olmaması nedeniyle saldırı olarak işaretlenen istekler.

### Eksik parametre

**Wallarm kodu:** `missing_parameter`

**Açıklama:**

Spesifikasyonunuzda gerekli olarak işaretlenen parametreyi veya değerini içermediği için saldırı olarak işaretlenen istekler.

### Eksik kimlik doğrulama

**Wallarm kodu:** `missing_auth`

**Açıklama:**

Gerekli kimlik doğrulama yöntemi hakkında bilgi içermediği için saldırı olarak işaretlenen istekler.

### Geçersiz istek

**Wallarm kodu:** `invalid_request`

**Açıklama:**

Geçersiz JSON içerdiği için saldırı olarak işaretlenen istekler.

## Veri işleme

### Veri bombası

**Saldırı**

**CWE kodu:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Wallarm kodu:** `data_bomb`

**Açıklama:**

Bir istek, Zip veya XML bombası içeriyorsa Wallarm isteği Veri bombası saldırısı olarak işaretler:

* [Zip bombası](https://en.wikipedia.org/wiki/Zip_bomb), onu okuyan programı veya sistemi çökertmek veya kullanışsız hale getirmek için tasarlanmış kötü amaçlı bir arşiv dosyasıdır. Zip bombası, programın amacı doğrultusunda çalışmasına izin verir, ancak arşiv, açılmasının orantısız miktarda zaman, disk alanı ve/veya bellek gerektirecek şekilde hazırlanmıştır.
* [XML bombası (billion laughs attack)](https://en.wikipedia.org/wiki/Billion_laughs_attack), XML belgelerinin ayrıştırıcılarını hedef alan bir DoS saldırı türüdür. Bir saldırgan, XML varlıklarında kötü amaçlı payload’lar gönderir.

    Örneğin, `entityOne` 20 adet `entityTwo` olarak tanımlanabilir; bunlar da 20 adet `entityThree` olarak tanımlanabilir. Aynı kalıp `entityEight`e kadar devam ederse, XML ayrıştırıcı tek bir `entityOne` oluşumunu 1 280 000 000 `entityEight`e açar — 5 GB bellek kullanır.

**Wallarm korumasına ek olarak:**

* Gelen isteklerin boyutunu, sisteminize zarar veremeyecek şekilde sınırlayın.

### Geçersiz XML

**Saldırı**

**Wallarm kodu:** `invalid_xml`

**Açıklama:**  

Bir isteğin gövdesi bir XML belgesi içeriyor ve belgenin kodlaması XML başlığında belirtilen kodlamadan farklıysa istek `invalid_xml` olarak işaretlenir.

### İşleme limiti aşımı

**Saldırı**

**Wallarm kodu:** `processing_overlimit`

**Açıklama:**

İstekleri işlerken [API Specification Enforcement](#api-specification) için uygulanan limitlerin ihlali durumunda, **Specification processing overlimit** olayı saldırı listesine eklenir.

### Kaynak limiti aşımı

**Saldırı**

**Wallarm kodu:** `overlimit_res`

**Açıklama:**

Wallarm düğümü, gelen isteklerin işlenmesine `N` milisaniyeden fazla zaman harcamayacak şekilde yapılandırılmıştır (varsayılan değer: `1000`). İstek belirtilen zaman aralığında işlenmezse, isteğin işlenmesi durdurulur ve istek `overlimit_res` saldırısı olarak işaretlenir. 

Sınır aşıldığında düğümün varsayılan davranışını değiştirmek ve özel zaman sınırı belirlemek için [**Limit request processing time**](user-guides/rules/configure-overlimit-res-detection.md) kuralını kullanabilirsiniz.

İstek işleme süresini sınırlamak, Wallarm düğümlerini hedefleyen atlatma saldırılarını önler. Bazı durumlarda, `overlimit_res` olarak işaretlenen istekler, Wallarm düğüm modülleri için ayrılan kaynakların yetersiz olduğuna ve uzun istek işleme sürelerine işaret edebilir.

## Engellenen kaynak

**Saldırı**

**Wallarm kodu:** `blocked_source`

**Açıklama:**

**Manuel** olarak [denylist’e alınmış](user-guides/ip-lists/overview.md) IP’lerden gelen saldırılar.

## Sanal yama

**Saldırı**

**Wallarm kodu:** `vpatch`

**Açıklama:**     

Bir istek, [sanal yama mekanizması][doc-vpatch] tarafından azaltılmış bir saldırının parçasıysa `vpatch` olarak işaretlenir.

**Gerekli yapılandırma:**

Sanal yama, mevcut [filtration mode](admin-en/configure-wallarm-mode.md)’dan bağımsız olarak belirli bir uç noktaya yönelik belirli veya tüm isteklerin engellenmesidir. Sanal yamalar, [manuel olarak][doc-vpatch] oluşturduğunuz özel kurallardır.

**Wallarm korumasına ek olarak:**

* Yamayla azaltılan güvenlik açığını analiz edin ve yamaya artık ihtiyaç duyulmayacak şekilde giderin.

<!--### API leak

**Wallarm code:** `apileak`

Description TBD (not presented in docs, but presented in UI)
-->

## Diğer

### Kimlik doğrulamayı atlatma

**Güvenlik açığı**

**CWE kodu:** [CWE-288][cwe-288]

**Wallarm kodu:** `auth`

**Açıklama:**

Bir uygulama veya API, kimlik doğrulama mekanizmalarına sahip olmasına rağmen, ana kimlik doğrulama mekanizmasını atlamaya veya bu mekanizmanın zayıflıklarından yararlanmaya izin veren alternatif kimlik doğrulama yöntemlerine sahip olabilir. Bu faktörlerin birleşimi, bir saldırganın kullanıcı veya yönetici izinleriyle erişim elde etmesiyle sonuçlanabilir.

Başarılı bir kimlik doğrulamayı atlatma saldırısı, potansiyel olarak kullanıcıların gizli bilgilerinin ifşa edilmesine veya yönetici izinleriyle savunmasız API’nin kontrolünün ele geçirilmesine yol açar.

**Wallarm korumasına ek olarak:**

* Mevcut kimlik doğrulama mekanizmalarını geliştirin ve güçlendirin.
* Önceden tanımlı mekanizmalar aracılığıyla gerekli kimlik doğrulama prosedürünü atlayarak bir API’ye erişime izin verebilecek alternatif kimlik doğrulama yöntemlerini ortadan kaldırın.
* [OWASP Authentication Kılavuzu][link-owasp-auth-cheatsheet] önerilerini uygulayın.

### Kimlik bilgisi doldurma

**Saldırı**

**Wallarm kodu:** `credential_stuffing`

**Açıklama:**

Saldırganların, birden fazla kaynaktaki kullanıcı hesaplarına yetkisiz erişim elde etmek için ele geçirilmiş kullanıcı kimlik bilgileri listelerini kullandıkları bir siber saldırı. Bu saldırı tehlikelidir çünkü birçok kişi farklı hizmetlerde aynı kullanıcı adı ve parolayı yeniden kullanır veya popüler zayıf parolalar kullanır. Başarılı bir kimlik bilgisi doldurma saldırısı daha az deneme gerektirir; bu nedenle saldırganlar istekleri çok daha seyrek gönderebilir, bu da kaba kuvvet koruması gibi standart önlemleri etkisiz hale getirir. 

**Gerekli yapılandırma:**

Wallarm, yalnızca filtreleme düğümü sürümü 4.10 veya üzeri ise ve [Credential Stuffing Detection](about-wallarm/credential-stuffing.md) işlevi etkinleştirilmiş ve düzgün yapılandırılmışsa kimlik bilgisi doldurma girişimlerini tespit eder.

**Wallarm korumasına ek olarak:**

* [OWASP kimlik bilgisi doldurma açıklamasıyla](https://owasp.org/www-community/attacks/Credential_stuffing), “Credential Stuffing Prevention Cheat Sheet” dahil tanışın.
* Kullanıcıları güçlü parolalar kullanmaya zorlayın.
* Kullanıcılara farklı kaynaklar için aynı parolaları kullanmamalarını önerin.
* İki faktörlü kimlik doğrulamayı etkinleştirin.
* Ek CAPTCHA çözümleri kullanın.

### Siteler arası istek sahteciliği (CSRF)

**Güvenlik açığı**

**CWE kodu:** [CWE-352][cwe-352]

**Wallarm kodu:** `csrf`

**Açıklama:**

Siteler arası istek sahteciliği (CSRF), son kullanıcının, halihazırda kimlik doğrulaması yapılmış olduğu bir uygulamada istenmeyen eylemler gerçekleştirmeye zorlandığı bir saldırıdır. Biraz sosyal mühendislik yardımıyla (e-posta veya sohbet yoluyla bağlantı gönderme gibi), bir saldırgan, bir uygulamanın kullanıcılarını saldırganın seçtiği eylemleri gerçekleştirmeleri için kandırabilir.

İlgili güvenlik açığı, kullanıcının tarayıcısının, çapraz site isteği gerçekleştirilirken hedef alan adı için ayarlanmış kullanıcı oturum çerezlerini otomatik olarak eklemesi nedeniyle ortaya çıkar.

Çoğu site için bu çerezler, siteyle ilişkili kimlik bilgilerini içerir. Bu nedenle, kullanıcı şu anda siteye kimlik doğrulaması yapmışsa, site mağdur tarafından gönderilen sahte istek ile mağdur tarafından gönderilen meşru istek arasında ayrım yapmanın bir yoluna sahip olmayacaktır.

Sonuç olarak, saldırgan, kötü amaçlı bir web sitesinden, meşru bir kullanıcı gibi davranarak, savunmasız web uygulamasına bir istek gönderebilir; saldırganın, o kullanıcının çerezlerine erişmesi bile gerekmez.

Wallarm yalnızca CSRF güvenlik açıklarını keşfeder, ancak CSRF saldırılarını tespit etmez ve dolayısıyla engellemez. CSRF sorunu tüm modern tarayıcılarda içerik güvenliği politikaları (CSP) ile çözülmüştür.

**Koruma:**

CSRF tarayıcılar tarafından çözülür, diğer koruma yöntemleri daha az faydalıdır ancak yine de kullanılabilir:

*   CSRF jetonları ve diğerleri gibi anti-CSRF koruma mekanizmalarını kullanın.
*   `SameSite` çerez özniteliğini ayarlayın.
*   [OWASP CSRF Önleme Kılavuzu][link-owasp-csrf-cheatsheet] önerilerini uygulayın.

### Dosya yükleme ihlali

**Saldırı**

**Wallarm kodu:** `file_upload_violation`

**Açıklama:**

[Unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md), [OWASP API Top 10 2023](user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) en ciddi API güvenlik riskleri listesine dahil edilmiştir. Kendi başına bir tehdit olmakla birlikte (aşırı yük nedeniyle hizmetin yavaşlaması veya tamamen çökmesi), bu aynı zamanda örneğin numaralandırma saldırıları gibi farklı saldırı türlerinin temelini oluşturur. Çok büyük dosya yüklemeye izin verilmesi, bu risklerin nedenlerinden biridir.

**Gerekli yapılandırma:**

Wallarm, yalnızca abonelik planınızda mevcut yöntemle yapılandırılmış bir veya daha fazla [policy](api-protection/file-upload-restriction.md) varsa dosya yükleme kısıtlamaları uygular.

Dosya boyutu yükleme kısıtlamalarının, Wallarm tarafından sunulan [sınırsız kaynak tüketimini önlemeye yönelik tek önlem](api-protection/file-upload-restriction.md#comparison-to-other-measures-for-preventing-unrestricted-resource-consumption) olmadığını unutmayın.

**Wallarm korumasına ek olarak:**

* İstemci tarafı JavaScript ile dosya boyutu doğrulaması kurun
* Büyük dosyaları reddedecek şekilde web sunucusunu (Nginx veya Apache gibi) yapılandırın
* Uygulamanızın kodu içerisinde dosya boyutu kontrolü kurun

### Bilgi ifşası

**Güvenlik açığı/Saldırı**

**CWE kodları:** [CWE-200][cwe-200] (ayrıca bkz.: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548], [CWE-598][cwe-598])

**Wallarm kodu:** `infoleak`

**Açıklama:**

Bu güvenlik açığı, bir uygulamanın hassas bilgileri yetkisiz olarak ifşa etmesini içerir ve potansiyel olarak saldırganlara daha fazla kötü niyetli faaliyet için hassas veriler sağlar.

Bazı hassas bilgi türleri:

* E-postalar, finansal veriler, iletişim bilgileri vb. gibi özel, kişisel bilgiler
* Hata mesajlarında, yığın izinde açığa çıkan teknik bilgiler
* İşletim sistemi ve yüklü paketler gibi sistem durumu ve ortam
* Kaynak kodu veya dahili durum

Wallarm, bilgi ifşasını iki şekilde tespit eder:

* Sunucu yanıtı analizi: Wallarm, sunucu yanıtlarını analiz etmek için pasif tespit, güvenlik açığı taraması ve tehdit yeniden oynatma testi gibi [teknikleri](about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) kullanır. Bu yöntemler, uygulama yanıtlarının yanlışlıkla hassas bilgileri ifşa edip etmediğini kontrol ederek güvenlik açıklarını belirlemeyi amaçlar.
* API Discovery içgörüleri: [API Discovery](api-discovery/overview.md) modülü tarafından tanımlanan uç noktalar, GET isteklerinin sorgu parametrelerinde Kişisel Olarak Tanımlanabilir Bilgileri (PII) aktardığında, Wallarm bunları savunmasız olarak tanır.

Wallarm, `infoleak` saldırılarını özel olarak sınıflandırmaz ancak ilgili güvenlik olaylarını gerçekleştiğinde tespit eder ve kaydeder. Ancak, olaylar nadirdir. Wallarm’ın tespit mekanizmaları, böyle bir ifşa başlarsa sizi derhal uyarır ve güvenlik açığının hızlı bir şekilde giderilmesini sağlar. Ek olarak, Wallarm’ın filtreleme düğümünü [blocking mode](admin-en/configure-wallarm-mode.md#available-filtration-modes)’da kullanmak, herhangi bir saldırı girişimini engelleyerek ifşaları önlemeye yardımcı olur ve veri sızıntısı olasılığını önemli ölçüde azaltır.

**Wallarm korumasına ek olarak:**

* Web uygulamalarının herhangi bir hassas bilgiyi görüntüleme yeteneğine sahip olmasını yasaklayın.
* Tercihen, kayıt ve oturum açma formları gibi hassas verileri iletmek için GET yerine POST HTTP yöntemini kullanın.

### Güvenlik açığı bulunan bileşen

**Güvenlik açığı**

**CWE kodları:** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Wallarm kodu:** `vuln_component`

**Açıklama:**

Uygulamanız veya API’niz güvenlik açığı bulunan veya güncel olmayan bir bileşen kullanıyorsa bu güvenlik açığı meydana gelir. Buna bir işletim sistemi, web/uygulama sunucusu, veritabanı yönetim sistemi (DBMS), çalışma zamanı ortamları, kütüphaneler ve diğer bileşenler dahil olabilir.

Bu güvenlik açığı, [A06:2021 – Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components) ile eşleştirilmiştir.

**Wallarm korumasına ek olarak:**

* Kullanılmayan bağımlılıkları, gereksiz özellikleri, bileşenleri, dosyaları ve dokümantasyonu kaldırın.
* OWASP Dependency Check, retire.js vb. gibi araçları kullanarak hem istemci hem de sunucu tarafı bileşenlerin (ör. framework’ler, kütüphaneler) ve bunların bağımlılıklarının sürümlerini sürekli olarak envanterleyin.
* Bileşenlerdeki güvenlik açıkları için Common Vulnerability and Exposures (CVE) ve National Vulnerability Database (NVD) gibi kaynakları sürekli izleyin.
* Bileşenleri yalnızca resmi kaynaklardan güvenli bağlantılar üzerinden edinin. Değiştirilmiş, kötü amaçlı bir bileşen dahil etme şansını azaltmak için imzalı paketleri tercih edin.
* Bakımı yapılmayan veya eski sürümler için güvenlik yamaları oluşturulmayan kütüphaneleri ve bileşenleri izleyin. Yama mümkün değilse, keşfedilen sorunu izlemek, tespit etmek veya ondan korumak için sanal yama dağıtmayı düşünün.

### Zayıf JWT

**Güvenlik açığı**

**CWE kodu:** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Wallarm kodu:** `weak_auth`

**Açıklama:**

[JSON Web Token (JWT)](https://jwt.io/), API’ler gibi kaynaklar arasında verileri güvenli bir şekilde değiş tokuş etmek için kullanılan popüler bir kimlik doğrulama standardıdır.

JWT’nin ele geçirilmesi, kimlik doğrulama mekanizmalarının kırılması saldırganlara uygulamalarınıza ve API’lerinize tam erişim sağladığından, yaygın bir saldırı amacıdır. JWT ne kadar zayıfsa, ele geçirilme olasılığı o kadar yüksektir.

Wallarm, JWT’leri zayıf olarak kabul eder, eğer:

* Şifrelenmemişse - imzalama algoritması yoksa (`alg` alanı `none` veya yok).
* Ele geçirilmiş gizli anahtarlarla imzalanmışsa.

Zayıf bir JWT tespit edildiğinde Wallarm, karşılık gelen [güvenlik açığını](user-guides/vulnerabilities.md) kaydeder.

**Wallarm korumasına ek olarak:**

* [OWASP JSON Web Token Kılavuzu](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) önerilerini uygulayın
* [JWT uygulamanızın bilinen zayıf sırlara karşı savunmasız olup olmadığını kontrol edin](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)