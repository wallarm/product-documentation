---
description: Bu belge, FAST'ın tespit ettiği yazılım güvenlik açıklarını listeler. Listedeki her öğenin, bu güvenlik açığına karşılık gelen Wallarm kodu vardır. Çoğu güvenlik açığı, ayrıca CWE kodları ile birlikte sunulmaktadır.
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
[anchor-ssrf]:  #server-side-request-forgery-ssrf

# FAST Tarafından Tespit Edilebilen Güvenlik Açıkları

Bu belge, FAST'ın tespit ettiği yazılım güvenlik açıklarını listeler. Listedeki her öğenin, bu güvenlik açığına karşılık gelen Wallarm kodu vardır. Çoğu güvenlik açığı, ayrıca [Common Weakness Enumeration (CWE)][link-cwe] kodları ile birlikte sunulmaktadır.

Listedeki her öğenin, bu güvenlik açığına karşılık gelen Wallarm kodu vardır.

## Güvenlik Açıkları Listesi

### Anomali

**CWE kodu:** yok<br>
**Wallarm kodu:** `anomaly`

####    Açıklama

Anomali, uygulamanın alınan bir isteğe alışılmadık bir tepki vermesiyle karakterize edilir.

Tespit edilen anomali, uygulamanın zayıf ve potansiyel olarak savunmasız bir alanına işaret eder. Bu güvenlik açığı, bir saldırganın uygulamaya doğrudan saldırmasına veya saldırı öncesinde verileri toplamasına olanak tanır.

### XML Dış Varlık Saldırısı (XXE)

**CWE kodu:** [CWE-611][cwe-611]<br>
**Wallarm kodu:** `xxe`

####    Açıklama

XXE açığı, bir saldırganın XML ayrıştırıcısı tarafından değerlendirilecek ve ardından hedef web sunucusunda çalıştırılacak şekilde bir XML belgesine dış varlık enjekte etmesine izin verir.

Başarılı bir saldırı sonucunda, bir saldırgan;
* Web uygulamasının gizli verilerine erişebilir,
* Dahili veri ağlarını tarayabilir,
* Web sunucusunda bulunan dosyaları okuyabilir,
* Bir [SSRF][anchor-ssrf] saldırısı gerçekleştirebilir,
* Bir Hizmet Reddi (DoS) saldırısı düzenleyebilir.

Bu güvenlik açığı, web uygulamasında XML dış varlıklarının ayrıştırılmasına yönelik kısıtlamaların olmamasından kaynaklanır.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Kullanıcı tarafından sağlanan XML belgeleriyle çalışırken, XML dış varlıkların ayrıştırılmasını devre dışı bırakın.
* [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet] tavsiyelerini uygulayın.

### Sunucu Taraflı Şablon Enjeksiyonu (SSTI)

**CWE kodları:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarm kodu:** `ssti`

####    Açıklama

Bir saldırgan, SSTI saldırılarına savunmasız bir web sunucusundaki kullanıcı tarafından doldurulan form üzerine çalıştırılabilir kod enjekte edebilir; bu kod, web sunucusu tarafından ayrıştırılır ve çalıştırılır.

Başarılı bir saldırı, savunmasız web sunucusunun tamamen ele geçirilmesine yol açabilir; bu durum, bir saldırgana istekleri keyfi olarak yürütme, sunucunun dosya sistemlerini keşfetme ve belirli durumlarda [“RCE attack”][anchor-rce] (uzaktan kod yürütme) gerçekleştirme gibi pek çok olanağı sağlayabilir.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Çözüm

Girdideki herhangi bir varlığın çalıştırılmasını önlemek için tüm kullanıcı girdilerini temizleyip filtrelemenizi öneririz.

### Cross-Site Request Forgery (CSRF)

**CWE kodu:** [CWE-352][cwe-352]<br>
**Wallarm kodu:** `csrf`

####    Açıklama

CSRF saldırısı, bir saldırganın, meşru bir kullanıcı adına savunmasız bir uygulamaya istek göndermesine olanak tanır.

İlgili güvenlik açığı, kullanıcının tarayıcısının, çapraz site isteği yaparken hedef alan adı için ayarlanmış çerezleri otomatik olarak eklemesinden kaynaklanır.

Sonuç olarak, bir saldırgan, savunmasız web uygulamasına kötü amaçlı bir web sitesinden istek göndererek, savunmasız sitede kimliği doğrulanmış meşru bir kullanıcı kılığına girebilir; saldırganın, kullanıcının çerezlerine erişmesi bile gerekmez.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* CSRF jetonları gibi anti-CSRF koruma mekanizmalarını kullanın.
* `SameSite` çerez özniteliğini ayarlayın.
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet] tavsiyelerini uygulayın.

### Cross-site Scripting (XSS)

**CWE kodu:** [CWE-79][cwe-79]<br>
**Wallarm kodu:** `xss`

####    Açıklama

Cross-site scripting saldırısı, bir saldırganın, kullanıcının tarayıcısında önceden hazırlanmış keyfi kodu çalıştırmasına olanak tanır.

XSS saldırısının birkaç türü vardır:
* Stored XSS, kötü amaçlı kodun web uygulamasının sayfasında önceden gömülü olması durumudur.

    Web uygulaması stored XSS saldırısına karşı savunmasızsa, bir saldırgan kötü amaçlı kodu web uygulamasının HTML sayfasına enjekte edebilir; ayrıca bu kod kalıcı hale gelir ve enfekte edilmiş web sayfasını talep eden herhangi bir kullanıcının tarayıcısı tarafından çalıştırılır.
    
* Reflected XSS, bir saldırganın, kullanıcıyı özel olarak hazırlanmış bir bağlantıyı açmaya ikna etmesi durumudur.      

* DOM tabanlı XSS, web uygulaması sayfasına gömülü JavaScript kod parçacığının girdiyi ayrıştırıp, bu hatalı kod parçacığı nedeniyle JavaScript komutu olarak çalıştırması durumudur.

Yukarıda listelenen güvenlik açıklarından herhangi birinin istismarı, keyfi bir JavaScript kodunun çalıştırılmasına yol açar. Başarılı bir XSS saldırısı durumunda, bir saldırgan kullanıcının oturumunu veya kimlik bilgilerini çalabilir, kullanıcı adına istek gönderebilir ve diğer kötü niyetli işlemleri gerçekleştirebilir.

Bu güvenlik açığı sınıfı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, web uygulamasının aldığı tüm parametreleri temizleyip filtreleyin.
* Web uygulamasının sayfalarını oluştururken, dinamik olarak oluşturulan tüm varlıkları temizleyip kaçış (escape) işlemlerini uygulayın.
* [OWASP XXS Prevention Cheat Sheet][link-owasp-xss-cheatsheet] tavsiyelerini uygulayın.

### Güvensiz Doğrudan Nesne Referansları (IDOR)

**CWE kodu:** [CWE-639][cwe-639]<br>
**Wallarm kodu:** `idor`

####    Açıklama

IDOR güvenlik açığıyla, savunmasız bir web uygulamasının kimlik doğrulama ve yetkilendirme mekanizmaları, bir kullanıcının başka bir kullanıcının verilerine veya kaynaklarına erişmesini engellemez.

Bu güvenlik açığı, web uygulamasının, istekte bulunan parametrelerdeki belirli bir kısmı değiştirerek (örneğin, dosya, dizin, veritabanı girişi) bir nesneye erişim yetkisi vermesi ve uygun erişim kontrol mekanizmalarını uygulamamasından kaynaklanır.

Bu güvenlik açığından yararlanmak için, bir saldırgan istek dizgisini manipüle ederek, savunmasız web uygulamasına veya kullanıcılarına ait gizli bilgilere yetkisiz erişim sağlayabilir.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Web uygulamasının kaynakları için uygun erişim kontrol mekanizmalarını uygulayın.
* Kullanıcılara atanmış rollere dayalı olarak kaynaklara erişim sağlamak için rol tabanlı erişim kontrol mekanizmalarını uygulayın.
* Dolaylı nesne referanslarını kullanın.
* [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet] tavsiyelerini uygulayın.

### Açık Yönlendirme

**CWE kodu:** [CWE-601][cwe-601]<br>
**Wallarm kodu:** `redir`

####    Açıklama

Bir saldırgan, meşru bir web uygulaması aracılığıyla kullanıcıyı zararlı bir web sayfasına yönlendirmek için açık yönlendirme saldırısını kullanabilir.

Bu saldırıya karşı savunmasızlık, URL girdilerinin hatalı filtrelenmesinden kaynaklanır.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, web uygulamasının aldığı tüm parametreleri temizleyip filtreleyin.
* Bekleyen tüm yönlendirmeler hakkında kullanıcılara bilgi verin ve açık onaylarını isteyin.

### Sunucu Tarafından İstek Sahteciliği (SSRF)

**CWE kodu:** [CWE-918][cwe-918]<br>
**Wallarm kodu:** `ssrf`

####    Açıklama

Başarılı bir SSRF saldırısı, bir saldırganın, saldırıya uğrayan web sunucusu adına istek göndermesine olanak tanır; bu durum, savunmasız web uygulamasında kullanılan ağ portlarının ifşasına, dahili ağların taranmasına ve yetkilendirmenin atlatılmasına yol açabilir.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, web uygulamasının aldığı tüm parametreleri temizleyip filtreleyin.
* [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet] tavsiyelerini uygulayın.

### Bilgi Sızıntısı

**CWE kodları:** [CWE-200][cwe-200] (ayrıca bkz: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Wallarm kodu:** `info`

####    Açıklama

Savunmasız web uygulaması, doğru ya da yanlış şekilde, gizli bilgileri yetkili olmayan bir kişiye ifşa edebilir.

####    Çözüm

Web uygulamasının, gizli bilgi göstermesini engelleyecek şekilde yapılandırılmasını sağlayın.

### Uzaktan Kod Yürütme (RCE)

**CWE kodları:** [CWE-78][cwe-78], [CWE-94][cwe-94] ve diğerleri<br>
**Wallarm kodu:** `rce`

####    Açıklama

Bir saldırgan, web uygulamasına gönderilen isteğe kötü amaçlı kod enjekte edebilir ve uygulama bu kodu çalıştırır. Ek olarak, saldırgan, savunmasız web uygulamasının çalıştığı işletim sistemi için bazı komutları çalıştırmaya çalışabilir.

Başarılı bir RCE saldırısı durumunda, bir saldırgan;
* Savunmasız web uygulamasının verilerinin gizlilik, erişilebilirlik ve bütünlüğünü tehlikeye atabilir,
* Web uygulamasının çalıştığı işletim sistemi ve sunucu üzerinde kontrol sağlayabilir,
* Diğer pek çok işlemi gerçekleştirebilir.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Çözüm

Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, tüm kullanıcı girdilerini temizleyip filtrelemenizi öneririz.

### Kimlik Doğrulama Atlatma

**CWE kodu:** [CWE-288][cwe-288]<br>
**Wallarm kodu:** `auth`

####    Açıklama

Mevcut kimlik doğrulama mekanizmalarına rağmen, bir web uygulaması, ana kimlik doğrulama mekanizmasını atlatmaya veya zayıflıklarını kullanmaya olanak tanıyan alternatif kimlik doğrulama yöntemlerine sahip olabilir. Bu faktörlerin kombinasyonu, bir saldırganın kullanıcı veya yönetici izinleriyle erişim sağlamasına neden olabilir.

Başarılı bir kimlik doğrulama atlatma saldırısı, kullanıcıların gizli verilerinin ifşa edilmesine veya yönetici izinleriyle savunmasız uygulamanın ele geçirilmesine yol açabilir.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Mevcut kimlik doğrulama mekanizmalarını geliştirin ve güçlendirin.
* Önceden tanımlı mekanizmalar üzerinden gerekli kimlik doğrulama prosedürünü atlatmaya olanak tanıyan alternatif kimlik doğrulama yöntemlerini ortadan kaldırın.
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet] tavsiyelerini uygulayın.

### LDAP Enjeksiyonu

**CWE kodu:** [CWE-90][cwe-90]<br>
**Wallarm kodu:** `ldapi`

####    Açıklama

LDAP enjeksiyonları, bir saldırganın, LDAP sunucusuna yapılan istekleri değiştirerek LDAP arama filtrelerini değiştirmesine olanak sağlayan saldırı sınıfını temsil eder.

Başarılı bir LDAP enjeksiyonu saldırısı, LDAP kullanıcıları ve ana bilgisayarlar hakkındaki gizli veriler üzerinde okuma ve yazma işlemlerine erişim izni verebilir.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, web uygulamasının aldığı tüm parametreleri temizleyip filtreleyin.
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet] tavsiyelerini uygulayın.

### NoSQL Enjeksiyonu

**CWE kodu:** [CWE-943][cwe-943]<br>
**Wallarm kodu:** `nosqli`

####    Açıklama

Bu saldırıya karşı savunmasızlık, kullanıcı girdisinin yetersiz filtrelenmesinden kaynaklanır. NoSQL enjeksiyonu, özel olarak hazırlanmış bir sorgunun NoSQL veritabanına enjekte edilmesiyle gerçekleştirilir.

####    Çözüm

Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, tüm kullanıcı girdilerini temizleyip filtreleyin.

### Yol Gezinimi (Path Traversal)

**CWE kodu:** [CWE-22][cwe-22]<br>
**Wallarm kodu:** `ptrav`

####    Açıklama

Yol gezinimi saldırısı, bir saldırganın, web uygulamasının parametreleri aracılığıyla mevcut yolları değiştirerek, savunmasız web uygulamasının bulunduğu dosya sisteminde depolanan gizli verilere sahip dosya ve dizinlere erişim sağlamasına olanak tanır.

Bu saldırıya karşı savunmasızlık, kullanıcı tarafından bir dosya veya dizin istenirken girdinin yetersiz filtrelenmesinden kaynaklanır.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, web uygulamasının aldığı tüm parametreleri temizleyip filtreleyin.
* Bu tür saldırıların hafifletilmesine yönelik ek öneriler [burada][link-ptrav-mitigation] mevcuttur.

### SQL Enjeksiyonu

**CWE kodu:** [CWE-89][cwe-89]<br>
**Wallarm kodu:** `sqli`

####    Açıklama

Bu saldırıya karşı savunmasızlık, kullanıcı girdisinin yetersiz filtrelenmesinden kaynaklanır. [SQL enjeksiyonu saldırısı](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1), özel olarak hazırlanmış bir sorgunun SQL veritabanına enjekte edilmesiyle gerçekleştirilir.

SQL enjeksiyonu saldırısı, bir saldırganın, SQL sorgusuna keyfi SQL kodu enjekte etmesine olanak tanır. Bu durum, saldırganın gizli verileri okumasına, değiştirmesine ve hatta DBMS yönetici haklarına erişim sağlamasına yol açabilir.

####    Çözüm

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdideki herhangi bir varlığın çalıştırılmasını önlemek için, web uygulamasının aldığı tüm parametreleri temizleyip filtreleyin.
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet] tavsiyelerini uygulayın.