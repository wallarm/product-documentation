---
açıklama: Bu belge, FAST'ın algıladığı yazılım güvenlik açıklarını listeler. Listede yer alan her birim, bu açığa karşılık gelen Wallarm koduna sahiptir. Açıklıkların çoğu ayrıca CWE kodları ile de eşlik edilir.
---

[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://owasp.org/www-community/attacks/Path_Traversal

[anchor-vuln-list]:     #vulnerabilities-list

[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #serverside-request-forgery-ssrf

# FAST Tarafından Belirlenebilecek Güvenlik Açıkları

Bu belge, FAST'ın tespit ettiği yazılım güvenlik açıklarını listeler. Listede yer alan her birim, bu açığa karşılık gelen Wallarm koduna sahiptir. Açıklıkların çoğu Genel Zayıflık Numaralandırması (CWE) kodları ile beraber sunulmaktadır.

Listede yer alan her birim, bu açığa karşılık gelen Wallarm koduna sahiptir.

## Güvenlik Açıkları Listesi

### Anomali

**CWE kodu:** yok<br>
**Wallarm kodu:** `anomaly`

####    Açıklama

Anomali, uygulamanın aldığı bir isteğe atipik bir tepki olarak karakterize edilir.

Tespit edilen anomali, uygulamanın zayıf ve potansiyel olarak savunmasız bir alanını gösterir. Bu güvenlik açığı, bir saldırganın uygulamayı doğrudan saldırmasına veya saldırıdan önce veri toplamasına olanak sağlar.

### XML Dış Varlık Salıdırısı (XXE)

**CWE kodu:** [CWE-611][cwe-611]<br>
**Wallarm kodu:** `xxe`

####    Açıklama

XXE güvenlik açığı, bir saldırganın hedef web sunucusunda değerlendirilmek üzere XML belgesine dış bir varlık enjekte etmesine izin verir.

Başarılı bir saldırı sonucunda, bir saldırgan,
* web uygulamasının gizli verilerine erişebilir 
* dahili veri ağlarını tarayabilir 
* web sunucusunda bulunan dosyaları okuyabilir 
* bir [SSRF][anchor-ssrf] saldırısı gerçekleştirir
* Hizmet Reddetme (DoS) saldırısı gerçekleştirebilir

Bu güvenlik açığı, bir web uygulamasında XML dış varlıklarının ayrıştırılmasına ilişkin kısıtlamanın olmaması durumunda meydana gelir.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Kullanıcı tarafından sağlanan XML belgeleriyle çalışırken XML dış varlık ayrıştırmasını devre dışı bırakın.
* [OWASP XXE Önleme Hile Sayfası][link-owasp-xxe-cheatsheet]"ndeki önerileri uygulayın.


### Sunucu Tarafı Şablon Enjeksiyonu (SSTI)

**CWE kodları:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarm kodu:** `ssti`

####    Açıklama

Bir saldırgan, SSTI saldırılarına savunmasız bir web sunucusundaki kullanıcı doldurma formuna çalıştırılabilir bir kod enjekte edebilir, böylece bu kod web sunucusu tarafından ayrıştırılır ve çalıştırılır.

Başarılı bir saldırı, savunmasız bir web sunucusunun tamamen ele geçirilmesine neden olabilir, belirli koşullarda saldırganın keyfi istekleri gerçekleştirmesine, server'in dosya sistemlerini keşfetmesine ve uzaktan keyfi bir kodun çalıştırılabilmesine (detaylar için [“RCE saldırısı”][anchor-rce]na bakınız), yardımcı olur.   

Bu güvenlik açığı, kullanıcı girişinin yanlış doğrulanması ve ayrıştırılması sonucunda ortaya çıkar.

####    Düzeltme Önerisi

Bir girişteki birimin çalışmasını önlemek için tüm kullanıcı girişlerini temizleme ve filtreleme önerisini takip edebilirsiniz.


### Cross-Site İstek Sahteciliği (CSRF)

**CWE kodu:** [CWE-352][cwe-352]<br>
**Wallarm kodu:** `csrf`

####    Açıklama

Bir CSRF saldırısı, bir saldırganın yasal bir kullanıcıymış gibi bir istek göndermesini sağlar.

İlgili güvenlik açığı, kullanıcının tarayıcısının çapraz site isteği yaparken hedef alan adı için ayarlanan çerezleri otomatik olarak eklemesi nedeniyle meydana gelir. 

Sonuç olarak, saldırgan, yasal bir kullanıcıymış gibi görünerek saldırganın o kullanıcının çerezlerine erişimi olmasa bile savunmasız web uygulamasına zararlı bir web sitesinden bir istek gönderebilir.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* CSRF tokenleri ve diğerleri gibi anti-CSRF koruma mekanizmalarını kullanın.
* `SameSite` çerez özelliğini ayarlayın.
* [OWASP CSRF Önleme Hile Sayfası][link-owasp-csrf-cheatsheet]ndeki önerileri uygulayın.


### Cross-site Scripting (XSS)

**CWE kodu:** [CWE-79][cwe-79]<br>
**Wallarm kodu:** `xss`

####    Açıklama

Bir cross-site scripting saldırısı, bir saldırganın bir kullanıcının tarayıcısında hazırlanan keyfi bir kodu çalıştırmasını sağlar.

Birkaç XSS saldırı türü vardır:
* Depolanmış XSS, bir kötü amaçlı kodun web uygulamasının sayfasına önceden yerleştirilmesidir.

    Web uygulaması depolanmış XSS saldırısına savunmasızsa, bir saldırgan bir kötü amaçlı kodu web uygulamasının HTML sayfasına enjekte edebilir; dahası, bu kod tutarlı kalacak ve enfekte web sayfasını isteyen herhangi bir kullanıcının tarayıcısı tarafından çalıştırılacaktır.
    
* Yansıtılmış XSS, bir saldırganın bir kullanıcıyı özel olarak hazırlanmış bir bağlantıyı açmaya kandırmasıdır.      

* DOM tabanlı XSS, web uygulamasının sayfasına yerleştirilen bir JavaScript kod parçacığının, bu kod parçacığında bulunan hatalar nedeniyle girişi ayrıştırıp bir JavaScript komutu olarak çalıştırmasıdır.

Herhangi bir güvenlik açığının istismarı, keyfi bir JavaScript kodunun çalıştırılmasına yol açar. XSS saldırısı başarılı olduktan sonra, saldırgan bir kullanıcının oturumunu çalabilir veya kimlik bilgilerini, kullanıcının yerine istekte bulunabilir ve diğer zararlı eylemleri gerçekleştirebilir. 

Bu güvenlik açığı sınıfı, kullanıcı girişinin yanlış doğrulanması ve ayrıştırılması sonucunda oluşur.


####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının giriş olarak aldığı tüm parametreleri temizleyin ve filtreleyin, böylece girişteki bir birimin çalıştırılmasını önleyin.
* Web uygulamasının sayfalarını oluştururken, dinamik olarak oluşturulan tüm varlıkları temizleyin ve kaçın.
* [OWASP XXS Önleme Hile Sayfası][link-owasp-xss-cheatsheet]'ndeki önerileri uygulayın.


### Güvensiz Doğrudan Nesne Referansları (IDOR)

**CWE kodu:** [CWE-639][cwe-639]<br>
**Wallarm kodu:** `idor`

####    Açıklama

IDOR açığı ile, savunmasız web uygulamasının kimlik doğrulama ve yetkilendirme mekanizmaları, kullanıcının başka bir kullanıcının verileri veya kaynaklarına erişmesini önlemez. 

Bu güvenlik açığı, web uygulamasının bir nesneye erişme yeteneği (örneğin, bir dosya, bir dizin, bir veritabanı girişi) sunması ve düzgün erişim kontrol mekanizmaları uygulamaması nedeniyle gerçekleşir.  

Bu güvenlik açığından yararlanmak için, bir saldırgan istek dizesini manipüle eder ve gizli bilgilere yetkisiz erişim kazanır.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının kaynakları için uygun erişim kontrol mekanizmaları uygulayın.
* Kullanıcılara verilmiş roller temelinde kaynaklara erişim hakkı veren rol tabanlı erişim kontrol mekanizmalarını uygulayın.
* Dolaylı nesne referansları kullanın.
* [OWASP IDOR Önleme Hile Sayfası][link-owasp-idor-cheatsheet]'ndeki önerileri uygulayın.


### Açık Yönlendirme

**CWE kodu:** [CWE-601][cwe-601]<br>
**Wallarm kodu:** `redir`

####    Açıklama

Bir saldırgan, kullanıcının zararlı bir web sayfasına açık yönlendirme saldırısı yoluyla yasal bir web uygulaması üzerinden yönlendirilmesini sağlar.

Web uygulamasının URL girişlerinin yanlış filtrelenmesi nedeniyle bu saldırıya karşı savunmasızlık oluşur.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının giriş olarak aldığı tüm parametreleri temizleyin ve filtreleyin, böylece girişteki bir birimin çalıştırılmasını önleyin.
* Kullanıcıları tüm bekleyen yönlendirmeler hakkında bilgilendirin ve açık izin isteyin.


### Sunucu Tarafı İstek Sahteciliği (SSRF)

**CWE kodu:** [CWE-918][cwe-918]<br>
**Wallarm kodu:** `ssrf`

####    Açıklama

Başarılı bir SSRF saldırısı, bir saldırganın saldırılan web sunucusu adına istekte bulunmasını sağlayabilir; bu da potansiyel olarak savunmasız web uygulamasının ağ bağlantı noktalarının ortaya çıkarılmasına, dahili ağların taranmasına ve yetki aşımı yapmaya yol açar.  

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının giriş olarak aldığı tüm parametreleri temizleyin ve filtreleyin, böylece girişteki bir birimin çalıştırılmasını önleyin.
* [OWASP SSRF Önleme Hile Sayfası][link-owasp-ssrf-cheatsheet]'ndeki önerileri uygulayın.


### Bilgi Maruziyeti

**CWE kodları:** [CWE-200][cwe-200] (bkz: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Wallarm kodu:** `info`

####    Açıklama

Savunmasız web uygulaması, ya kasıtlı ya da yanlışlıkla yetkili olmayan bir özneye gizli bilgiyi ifşa eder. 

####    Düzeltme Önerisi

Web uygulamasının herhangi bir gizli bilgiyi görüntüleme yeteneğini engelleme önerisini takip edebilirsiniz.


### Uzaktan Kod Yürütme (RCE)

**CWE kodları:** [CWE-78][cwe-78], [CWE-94][cwe-94] ve diğerleri<br>
**Wallarm kodu:** `rce`

####    Açıklama

Bir saldırgan, kötü amaçlı bir kodu bir web uygulamasına yönelik bir isteğe enjekte edebilir ve uygulama bu kodu çalıştırır. Ayrıca, saldırgan aynı işletim sistemi üzerinde belirli komutları yürütebilmeyi deneyebilir.

Bir RCE saldırısı başarılı olduğunda, bir saldırgan çeşitli eylemler gerçekleştirebilir, gibi
* Savunmasız web uygulamasının verilerinin mahremiyetinin, erişilebilirliğinin ve bütünlüğünün aşılması.
* Web uygulamasının çalıştığı işletim sistemi ve sunucunun kontrolünün ele geçirilmesi.
* Diğer mümkün olan aksiyonlar.

Bu güvenlik açığı, kullanışı girişin yanlış doğrulanması ve ayrıştırılması sonucu ortaya çıkar.

####    Düzeltme Önerisi

Girişteki bir birimin çalıştırılmasını önlemek için tüm kullanıcı girişlerini temizleme ve filtreleme önerisini takip edebilirsiniz.


### Kimlik Doğrulama Aşma

**CWE kodu:** [CWE-288][cwe-288]<br>
**Wallarm kodu:** `auth`

####    Açıklama

Kimlik doğrulama mekanizmaları mevcut olsa bile, web uygulaması ana kimlik doğrulama mekanizmasını aşmaya veya zayıflıklarını işletmeye izin veren alternatif kimlik doğrulama yöntemlerine sahip olabilir. Bu faktörlerin birleşimi, bir saldırganın kullanıcı veya yönetici izinleriyle erişim kazanmasına neden olabilir.

Başarılı bir kimlik doğrulama bypass saldırısı potansiyel olarak kullanıcıların gizli verilerinin ifşa edilmesine veya yönetici izinleriyle savunmasız uygulamanın kontrol edilmesine neden olur.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Mevcut kimlik doğrulama mekanizmalarını iyileştirin ve güçlendirin.
* Saldırganların belirlenmiş mekanizmalar aracılığıyla gereken kimlik doğrulama işleminden kaçınarak bir uygulamaya erişebilecek yeni kimlik doğrulama yöntemlerinin tanımlanmasını önleyin.
* [OWASP Kimlik Doğrulama Hile Sayfası][link-owasp-auth-cheatsheet]'ndeki önerileri uygulayın.


### LDAP Enjeksiyonu

**CWE kodu:** [CWE-90][cwe-90]<br>
**Wallarm kodu:** `ldapi`

####    Açıklama

LDAP enjeksiyonları, bir saldırganın LDAP sunucusuna yapılan istekleri değiştirerek LDAP arama filtrelerini değiştirmesine izin veren bir saldırı sınıfını temsil eder.

Başarılı bir LDAP enjeksiyon saldırısı, LDAP kullanıcıları ve ev sahipleri hakkında gizli verilere okuma ve yazma işlemlerine erişim sağlar.

Bu güvenlik açığı, kullanıcı girişinin yanlış doğrulanması ve ayrıştırılması sonucunda oluşur.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının giriş olarak aldığı tüm parametreleri temizleyin ve filtreleyin, böylece girişteki bir birimin çalıştırılmasını önleyin.
* [OWASP LDAP Enjeksiyonu Önleme Hile Sayfası][link-owasp-ldapi-cheatsheet]'ndeki önerileri uygulayın.


### NoSQL Enjeksiyonu

**CWE kodu:** [CWE-943][cwe-943]<br>
**Wallarm kodu:** `nosqli`

####    Açıklama

Bu saldırıya karşı savunmasızlık, kullanıcı girişinin yetersiz filtrelenmesi nedeniyle oluşur. Bir NoSQL enjeksiyon saldırısı, NoSQL veritabanına özel olarak hazırlanmış bir sorgu enjekte ederek gerçekleştirilir.

####    Düzeltme Önerisi

Bir girişteki birimin çalıştırılmasını önlemek için tüm kullanıcı girişlerini temizleme ve filtreleme önerisini takip edebilirsiniz.


### Path Traversal

**CWE kodu:** [CWE-22][cwe-22]<br>
**Wallarm kodu:** `ptrav`

####    Açıklama

Bir path traversal saldırısı, bir saldırganın savunmasız web uygulamasının bulunduğu dosya sistemine yerleşmiş gizli veri içeren dosya ve dizinlere erişmesine izin veren web uygulamasının parametrelerini değiştirerek mevcut yolları değiştirir.

Bir kullanıcı, web uygulaması aracılığıyla bir dosya veya dizin talep ettiğinde kullanıcı girişinin yeterli filtreleme yapmaması nedeniyle bu saldırıya savunmasızlık oluşur.

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının giriş olarak aldığı tüm parametreleri temizleyin ve filtreleyin, böylece girişteki bir birimin çalıştırılmasını önleyin.
* Bu tür saldırıları hafifletmek için ek öneriler [burada][link-ptrav-mitigation] bulunabilir.


### SQL Enjeksiyonu

**CWE kodu:** [CWE-89][cwe-89]<br>
**Wallarm kodu:** `sqli`

####    Açıklama

Web uygulamasının kullanıcı girişinin yetersiz filtreleme yapmaması nedeniyle bu saldırıya karşı savunmasızlık oluşur. [Bir SQL enjeksiyon saldırısı](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1), bir SQL veritabanına özel olarak hazırlanmış bir sorgu enjekte ederek gerçekleştirilir.

Bir SQL enjeksiyon saldırısı, bir saldırganın keyfi SQL kodunu bir SQL sorgusuna enjekte etmesine olanak sağlar. Bu durum, saldırganın gizli verilere okuma ve değiştirme erişimine ve DBMS yönetici haklarına erişime potansiyel olarak yol açar. 

####    Düzeltme Önerisi

Aşağıdaki önerileri takip edebilirsiniz:
* Web uygulamasının giriş olarak aldığı tüm parametreleri temizleyin ve filtreleyin, böylece girişteki bir birimin çalıştırılmasını önleyin.
* [OWASP SQL Enjeksiyonu Önleme Hile Sayfası][link-owasp-sqli-cheatsheet]'ndeki önerileri uygulayın.