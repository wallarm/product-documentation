---
description: Bu belge, FAST'in tespit ettiği yazılım güvenlik açıklarını listeler. Listedeki her öğe, bu güvenlik açığına karşılık gelen Wallarm kodunu içerir. Çoğu güvenlik açığı, CWE kodlarıyla da desteklenmiştir.
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

# FAST tarafından Tespit Edilebilen Güvenlik Açıkları

Bu belge, FAST'in tespit ettiği yazılım güvenlik açıklarını listeler. Listedeki her öğe, bu güvenlik açığına karşılık gelen [Common Weakness Enumeration (CWE)][link-cwe] kodlarıyla da çoğunlukla birlikte gelir.

Listedeki her öğe, bu güvenlik açığına karşılık gelen Wallarm kodunu içerir.

## Güvenlik Açıkları Listesi

### Anomali

**CWE kodu:** yok<br>
**Wallarm kodu:** `anomaly`

####    Açıklama

Anomali, uygulamanın aldığı bir isteğe alışılmadık bir tepki vermesiyle karakterize edilir.

Tespit edilen anomali, uygulamanın zayıf ve potansiyel olarak savunmasız bir alanını gösterir. Bu güvenlik açığı, bir saldırganın uygulamaya doğrudan saldırmasına veya saldırıdan önce veri toplamasına izin verir.

### XML External Entity (XXE) Saldırısı

**CWE kodu:** [CWE-611][cwe-611]<br>
**Wallarm kodu:** `xxe`

####    Açıklama

XXE güvenlik açığı, bir saldırganın bir XML belgesine harici bir varlık enjekte etmesine, bunun bir XML ayrıştırıcısı tarafından değerlendirilmesine ve ardından hedef web sunucusunda yürütülmesine olanak tanır.

Başarılı bir saldırının sonucunda, bir saldırgan
* web uygulamasının gizli verilerine erişim elde edebilir
* dahili veri ağlarını tarayabilir
* web sunucusunda bulunan dosyaları okuyabilir
* bir [SSRF][anchor-ssrf] saldırısı gerçekleştirebilir
* Hizmet Reddi (DoS) saldırısı gerçekleştirebilir

Bu güvenlik açığı, bir web uygulamasında XML harici varlıklarının ayrıştırılmasına yönelik kısıtlamaların bulunmaması nedeniyle ortaya çıkar.

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Kullanıcı tarafından sağlanan XML belgeleriyle çalışırken XML harici varlıklarının ayrıştırılmasını devre dışı bırakın.
* [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet] içindeki önerileri uygulayın.


### Sunucu Taraflı Şablon Enjeksiyonu (SSTI)

**CWE kodları:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarm kodu:** `ssti`

####    Açıklama

SSTI saldırılarına karşı savunmasız bir web sunucusundaki kullanıcı tarafından doldurulan bir forma bir saldırgan yürütülebilir kod enjekte edebilir; böylece bu kod web sunucusu tarafından ayrıştırılır ve yürütülür.

Başarılı bir saldırı, savunmasız bir web sunucusunun tamamen ele geçirilmesine yol açabilir; bu da bir saldırgana keyfi istekler yürütme, sunucunun dosya sistemlerini keşfetme ve belirli koşullar altında uzaktan keyfi kod çalıştırma (ayrıntılar için bkz. [“RCE saldırısı”][anchor-rce]) gibi birçok şeyi yapma imkânı verebilir.   

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Giderme

Girdi içerisindeki varlıkların yürütülmesini engellemek için tüm kullanıcı girdilerini temizleme ve filtreleme önerisini uygulayabilirsiniz.


### Cross-Site Request Forgery (CSRF)

**CWE kodu:** [CWE-352][cwe-352]<br>
**Wallarm kodu:** `csrf`

####    Açıklama

Bir CSRF saldırısı, bir saldırganın meşru bir kullanıcı adına savunmasız bir uygulamaya istek göndermesine olanak tanır.

İlgili güvenlik açığı, kullanıcının tarayıcısının, siteler arası istek yapılırken hedef alan adı için ayarlanmış çerezleri otomatik olarak eklemesi nedeniyle ortaya çıkar. 

Sonuç olarak, saldırgan, savunmasız web uygulamasına, savunmasız sitede kimliği doğrulanmış meşru bir kullanıcı gibi davranarak kötü amaçlı bir web sitesinden istek gönderebilir; saldırganın bu kullanıcının çerezlerine erişmesine bile gerek yoktur.

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* CSRF belirteçleri ve diğerleri gibi anti-CSRF koruma mekanizmalarını kullanın.
* `SameSite` çerez özniteliğini ayarlayın.
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet] içindeki önerileri uygulayın.


### Cross-site Scripting (XSS)

**CWE kodu:** [CWE-79][cwe-79]<br>
**Wallarm kodu:** `xss`

####    Açıklama

Bir cross-site scripting saldırısı, bir saldırganın bir kullanıcının tarayıcısında hazırlanmış keyfi kod yürütmesine olanak tanır.

Birkaç XSS saldırı türü vardır:
* Kalıcı (Stored) XSS: Kötü amaçlı kodun web uygulamasının sayfasına önceden gömülmesidir.

    Web uygulaması kalıcı XSS saldırısına karşı savunmasızsa, bir saldırganın web uygulamasının HTML sayfasına kötü amaçlı kod enjekte etmesi mümkündür; dahası, bu kod kalıcı olur ve bulaşmış web sayfasını isteyen herhangi bir kullanıcının tarayıcısı tarafından yürütülür.
    
* Yansıtılan (Reflected) XSS: Bir saldırganın bir kullanıcıyı özel olarak hazırlanmış bir bağlantıyı açması için kandırmasıdır.      

* DOM tabanlı XSS: Web uygulamasının sayfasına gömülü bir JavaScript kod parçasının giriş verisini ayrıştırması ve bu kod parçasındaki hatalar nedeniyle bunu bir JavaScript komutu olarak yürütmesidir.

Yukarıda listelenen güvenlik açıklarından herhangi birinin istismarı, keyfi bir JavaScript kodunun yürütülmesine yol açar. XSS saldırısının başarılı olması durumunda, bir saldırgan bir kullanıcının oturumunu veya kimlik bilgilerini çalabilir, kullanıcı adına istekler yapabilir ve diğer kötü niyetli eylemleri gerçekleştirebilir. 

Bu güvenlik açığı sınıfı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.


####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdi içerisindeki varlıkların yürütülmesini engellemek için bir web uygulamasının aldığı tüm giriş parametrelerini temizleyin ve filtreleyin.
* Web uygulamasının sayfalarını oluştururken, dinamik olarak oluşturulan tüm varlıkları temizleyin ve kaçışlayın.
* [OWASP XXS Prevention Cheat Sheet][link-owasp-xss-cheatsheet] içindeki önerileri uygulayın.


### Insecure Direct Object References (IDOR)

**CWE kodu:** [CWE-639][cwe-639]<br>
**Wallarm kodu:** `idor`

####    Açıklama

IDOR güvenlik açığında, savunmasız bir web uygulamasının kimlik doğrulama ve yetkilendirme mekanizmaları, bir kullanıcının başka bir kullanıcının verilerine veya kaynaklarına erişmesini engellemez. 

Bu güvenlik açığı, web uygulamasının, isteğin bir kısmını değiştirerek bir nesneye (ör. bir dosya, bir dizin, bir veritabanı kaydı) erişim imkânı vermesi ve uygun erişim kontrol mekanizmalarını uygulamaması nedeniyle ortaya çıkar.  

Bu güvenlik açığını istismar etmek için, bir saldırgan istek dizgesini manipüle ederek, ya savunmasız web uygulamasına ya da kullanıcılarına ait gizli bilgilere yetkisiz erişim sağlar. 

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Web uygulamasının kaynakları için uygun erişim kontrol mekanizmalarını uygulayın.
* Kullanıcılara atanan rollere dayalı olarak kaynaklara erişim vermek için rol tabanlı erişim kontrol mekanizmalarını uygulayın.
* Dolaylı nesne referansları kullanın.
* [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet] içindeki önerileri uygulayın.


### Açık Yönlendirme

**CWE kodu:** [CWE-601][cwe-601]<br>
**Wallarm kodu:** `redir`

####    Açıklama

Bir saldırgan, meşru bir web uygulaması aracılığıyla bir kullanıcıyı kötü amaçlı bir web sayfasına yönlendirmek için açık yönlendirme saldırısını kullanabilir.

Bu saldırıya karşı savunmasızlık, URL girdilerinin hatalı filtrelenmesi nedeniyle oluşur.

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdi içerisindeki varlıkların yürütülmesini engellemek için bir web uygulamasının aldığı tüm giriş parametrelerini temizleyin ve filtreleyin.
* Tüm bekleyen yönlendirmeler hakkında kullanıcıları bilgilendirin ve açık izin isteyin.


### Sunucu Taraflı İstek Sahteciliği (SSRF)

**CWE kodu:** [CWE-918][cwe-918]<br>
**Wallarm kodu:** `ssrf`

####    Açıklama

Başarılı bir SSRF saldırısı, bir saldırganın saldırıya uğrayan web sunucusu adına istekler yapmasına izin verebilir; bu da potansiyel olarak savunmasız web uygulamasının kullanılan ağ portlarının açığa çıkmasına, dahili ağların taranmasına ve yetkilendirmenin atlatılmasına yol açar.  

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdi içerisindeki varlıkların yürütülmesini engellemek için bir web uygulamasının aldığı tüm giriş parametrelerini temizleyin ve filtreleyin.
* [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet] içindeki önerileri uygulayın.


### Bilgi İfşası

**CWE kodları:** [CWE-200][cwe-200] (ayrıca bkz.: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Wallarm kodu:** `info`

####    Açıklama

Savunmasız web uygulaması, gizli bilgileri erişim yetkisi olmayan bir özneye kasıtlı veya kasıtsız olarak açıklar. 

####    Giderme

Bir web uygulamasının herhangi bir gizli bilgiyi görüntüleme yeteneğine sahip olmasını yasaklama önerisini uygulayabilirsiniz.


### Uzaktan Kod Yürütme (RCE)

**CWE kodları:** [CWE-78][cwe-78], [CWE-94][cwe-94] ve diğerleri<br>
**Wallarm kodu:** `rce`

####    Açıklama

Bir saldırgan, bir web uygulamasına yapılan bir isteğe kötü amaçlı kod enjekte edebilir ve uygulama bu kodu yürütür. Ayrıca saldırgan, savunmasız web uygulamasının çalıştığı işletim sistemi için belirli komutları yürütmeye çalışabilir. 

Bir RCE saldırısının başarılı olması durumunda, bir saldırgan aşağıdakiler de dâhil olmak üzere geniş bir yelpazede eylemler gerçekleştirebilir:
* Savunmasız web uygulamasının verilerinin gizliliğinin, erişilebilirliğinin ve bütünlüğünün tehlikeye atılması.
* Web uygulamasının çalıştığı işletim sistemi ve sunucunun kontrolünün ele geçirilmesi.
* Diğer olası eylemler.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Giderme

Girdi içerisindeki varlıkların yürütülmesini engellemek için tüm kullanıcı girdilerini temizleme ve filtreleme önerisini uygulayabilirsiniz.


### Kimlik Doğrulamayı Atlatma

**CWE kodu:** [CWE-288][cwe-288]<br>
**Wallarm kodu:** `auth`

####    Açıklama

Bir web uygulamasında kimlik doğrulama mekanizmaları bulunsa da, ana kimlik doğrulama mekanizmasını atlamaya veya onun zayıflıklarını kullanmaya izin veren alternatif kimlik doğrulama yöntemleri bulunabilir. Bu faktörlerin kombinasyonu, bir saldırganın kullanıcı veya yönetici izinleriyle erişim elde etmesiyle sonuçlanabilir.

Başarılı bir kimlik doğrulamayı atlatma saldırısı, kullanıcıların gizli bilgilerinin ifşa edilmesine veya yönetici izinleriyle savunmasız uygulamanın kontrolünün ele geçirilmesine yol açabilir.

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Mevcut kimlik doğrulama mekanizmalarını iyileştirin ve güçlendirin.
* Önceden tanımlı mekanizmalar aracılığıyla gerekli kimlik doğrulama prosedurunu atlayarak uygulamaya erişime izin verebilecek tüm alternatif kimlik doğrulama yöntemlerini ortadan kaldırın.
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet] içindeki önerileri uygulayın.


### LDAP Enjeksiyonu

**CWE kodu:** [CWE-90][cwe-90]<br>
**Wallarm kodu:** `ldapi`

####    Açıklama

LDAP enjeksiyonları, bir saldırganın bir LDAP sunucusuna yapılan istekleri değiştirerek LDAP arama filtrelerini değiştirmesine izin veren bir saldırı sınıfını temsil eder.

Başarılı bir LDAP enjeksiyonu saldırısı, LDAP kullanıcıları ve ana bilgisayarları hakkındaki gizli verilere okuma ve yazma işlemleri için erişim sağlayabilir.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdi içerisindeki varlıkların yürütülmesini engellemek için bir web uygulamasının aldığı tüm giriş parametrelerini temizleyin ve filtreleyin.
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet] içindeki önerileri uygulayın.


### NoSQL Enjeksiyonu

**CWE kodu:** [CWE-943][cwe-943]<br>
**Wallarm kodu:** `nosqli`

####    Açıklama

Bu saldırıya karşı savunmasızlık, kullanıcı girdisinin yetersiz şekilde filtrelenmesi nedeniyle ortaya çıkar. Bir NoSQL enjeksiyonu saldırısı, NoSQL veritabanına özel olarak hazırlanmış bir sorgunun enjekte edilmesiyle gerçekleştirilir.

####    Giderme

Girdi içerisindeki varlıkların yürütülmesini engellemek için tüm kullanıcı girdilerini temizleme ve filtreleme önerisini uygulayabilirsiniz.


### Yol Geçişi (Path Traversal)

**CWE kodu:** [CWE-22][cwe-22]<br>
**Wallarm kodu:** `ptrav`

####    Açıklama

Bir yol geçişi saldırısı, bir saldırganın, savunmasız web uygulamasının bulunduğu dosya sisteminde depolanan gizli verileri içeren dosya ve dizinlere, web uygulamasının parametreleri aracılığıyla mevcut yolları değiştirerek erişmesine olanak tanır.

Bu saldırıya karşı savunmasızlık, bir kullanıcının web uygulaması aracılığıyla bir dosya veya dizin talep ettiğinde kullanıcı girdisinin yetersiz şekilde filtrelenmesi nedeniyle ortaya çıkar.

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdi içerisindeki varlıkların yürütülmesini engellemek için bir web uygulamasının aldığı tüm giriş parametrelerini temizleyin ve filtreleyin.
* Bu tür saldırıların hafifletilmesine yönelik ek öneriler [burada][link-ptrav-mitigation] mevcuttur.


### SQL Enjeksiyonu

**CWE kodu:** [CWE-89][cwe-89]<br>
**Wallarm kodu:** `sqli`

####    Açıklama

Bu saldırıya karşı savunmasızlık, kullanıcı girdisinin yetersiz süzülmesi nedeniyle ortaya çıkar. [Bir SQL enjeksiyonu saldırısı](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1), bir SQL veritabanına özel olarak hazırlanmış bir sorgunun enjekte edilmesiyle gerçekleştirilir.

Bir SQL enjeksiyonu saldırısı, bir saldırganın bir SQL sorgusuna keyfi SQL kodu enjekte etmesine olanak tanır. Bu da potansiyel olarak saldırgana, gizli verileri okuma ve değiştirme ile birlikte VTYS (DBMS) üzerinde yönetici hakları elde etme imkânı verir. 

####    Giderme

Aşağıdaki önerileri uygulayabilirsiniz:
* Girdi içerisindeki varlıkların yürütülmesini engellemek için bir web uygulamasının aldığı tüm giriş parametrelerini temizleyin ve filtreleyin.
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet] içindeki önerileri uygulayın.