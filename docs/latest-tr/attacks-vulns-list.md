# Saldırı ve Güvenlik Açığı Türleri

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

Bu makale, [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve [OWASP API Top 10](https://owasp.org/www-project-api-security/) güvenlik risk listelerinde yer alan saldırılar dahil olmak üzere, Wallarm filtreleme düğümünün tespit edebileceği saldırı ve güvenlik açıklarını listelemekte ve kısaca açıklamaktadır. Listedeki güvenlik açıklarının ve saldırıların çoğu, [Common Weakness Enumeration][link-cwe] (CWE) olarak da bilinen yazılım zayıflığı türleri listesinden biri ya da daha fazla kodla birlikte verilmektedir.

Wallarm, listelenen güvenlik açıklarını ve saldırıları **otomatik olarak tespit eder** ve [filtrasyon modu](admin-en/configure-wallarm-mode.md) uyarınca işlem yapar. Özel [kurallarınız](user-guides/rules/rules.md) ve [tetikleyicileriniz](user-guides/triggers/triggers.md) tarafından varsayılan davranışta değişiklik yapılabileceğini unutmayın.

!!! info "Bazı saldırı türleri için gerekli yapılandırma"
    Zira davranışsal saldırılar ([brute force](#brute-force-attack), [forced browsing](#forced-browsing), [BOLA](#broken-object-level-authorization-bola)), [API suiistimali](#suspicious-api-activity), [GraphQL](#graphql-attacks) ve [credential stuffing](#credential-stuffing) gibi bazı saldırılar varsayılan olarak tespit edilmez. Bu tür saldırılar/güvenlik açıkları için gerekli yapılandırma özel olarak tanımlanmıştır.

<!-- ??? info "Wallarm'ın OWASP Top 10'a karşı koruma sağladığına dair videoyu izle"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div> -->

## DDoS Saldırıları

DDoS (Dağıtılmış Hizmet Reddi) saldırısı, bir saldırganın bir web sitesi veya çevrimiçi hizmeti, çoklu kaynaklardan gelen trafikle aşırı yükleyerek hizmet dışı bırakmayı amaçladığı siber saldırı türüdür.

Saldırganların DDoS saldırısı başlatmak için kullanabileceği birçok teknik vardır ve kullandıkları yöntemler ile araçlar önemli ölçüde farklılık gösterebilir. Bazı saldırılar nispeten basit olup, bir sunucuya çok sayıda bağlantı isteği gönderme gibi düşük seviye teknikler kullanırken, bazıları IP adreslerini sahte olarak gösterme veya ağ altyapısındaki güvenlik açıklarından yararlanma gibi karmaşık taktikler kullanır.

[DDoS'e Karşı Kaynak Koruma Kılavuzumuzu okuyun](admin-en/configuration-guides/protecting-against-ddos.md)

## Sunucu Tarafı Saldırıları

### SQL enjeksiyonu

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-89][cwe-89]

**Wallarm kodu:** `sqli`

**Açıklama:**

Bu saldırıya karşı açıklık, kullanıcı girdisinin yetersiz filtrelenmesinden kaynaklanır. Bir SQL enjeksiyonu saldırısı, SQL veritabanına özel olarak hazırlanmış bir sorgunun enjekte edilmesiyle gerçekleştirilir.

Bir SQL enjeksiyonu saldırısı, saldırgana [SQL sorgusuna](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1) keyfi SQL kodu enjekte etme imkanı tanır. Bu durum, saldırganın gizli verilere erişim sağlama, bu verileri okuma ve değiştirme ile DBMS yönetici haklarını elde etmesine neden olabilir.

**Wallarm korumasına ek olarak:**

* Bir web uygulamasının girdi olarak aldığı tüm parametreleri zararlı kodların çalıştırılmasını önlemek amacıyla temizleyin ve filtreleyin.
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet] önerilerini uygulayın.

### NoSQL enjeksiyonu

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-943][cwe-943]

**Wallarm kodu:** `nosqli`

**Açıklama:**

Bu saldırıya açıklık, kullanıcı girdisinin yetersiz filtrelenmesinden kaynaklanır. Bir NoSQL enjeksiyonu saldırısı, NoSQL veritabanına özel olarak hazırlanmış bir sorgunun enjekte edilmesiyle gerçekleştirilir.

**Wallarm korumasına ek olarak:**

* Kullanıcı girdisinin içindeki zararlı kodların çalıştırılmasını önlemek amacıyla tüm girişleri temizleyin ve filtreleyin.

### Uzaktan kod çalıştırma (RCE)

**Güvenlik Açığı/Saldırı**

**CWE kodları:** [CWE-78][cwe-78], [CWE-94][cwe-94] ve diğerleri

**Wallarm kodu:** `rce`

**Açıklama:**

Bir saldırgan, bir web uygulamasına yapılacak isteğe kötü niyetli kod enjekte edebilir ve uygulama bu kodu çalıştırır. Ayrıca, saldırgan web uygulamasının çalıştığı işletim sistemi üzerinde belirli komutları çalıştırmayı deneyebilir.

Bir RCE saldırısının başarılı olması durumunda, saldırgan;

* Kırılgan web uygulamasının verilerinin gizliliğini, erişilebilirliğini ve bütünlüğünü tehlikeye atabilir.
* Web uygulamasının çalıştığı sunucu ve işletim sistemi üzerinde kontrol sağlayabilir.
* Diğer pek çok işlemi gerçekleştirebilir.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Zararlı kodların çalıştırılmasını önlemek amacıyla tüm kullanıcı girdilerini temizleyin ve filtreleyin.

### SSI enjeksiyonu

**Saldırı**

**CWE kodu:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarm kodu:** `ssi`

**Açıklama:**

[SSI (Server Side Includes)][ssi-wiki], sunucu tarafında çalıştırılan ve bir web sayfasına bir veya daha fazla dosya içeriğini eklemek için kullanılan basit bir yorumlanabilir betik dilidir. Apache ve NGINX web sunucuları tarafından desteklenmektedir.

SSI enjeksiyonu, bir web uygulamasında kötü niyetli yükleri HTML sayfalarına enjekte ederek veya uzaktan keyfi kod çalıştırarak istismar yapılmasına imkan tanır. Uygulamada kullanılan SSI'nin manipülasyonu veya kullanıcı giriş alanları üzerinden zorunlu hale getirilmesi yoluyla istismar edilebilir.

**Örnek:**

Saldırgan, çıktı mesajını değiştirip kullanıcı davranışını etkileyebilir. SSI enjeksiyonu örneği:

```bash
<!--#config errmsg="Erişim reddedildi, lütfen kullanıcı adınızı ve şifrenizi girin"-->
```

**Wallarm korumasına ek olarak:**

* Zararlı yüklerin çalıştırılmasını önlemek amacıyla tüm kullanıcı girdilerini temizleyin ve filtreleyin.
* [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet] önerilerini uygulayın.

### Sunucu Tarafı Şablon Enjeksiyonu (SSTI)

**Güvenlik Açığı/Saldırı**

**CWE kodları:** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Wallarm kodu:** `ssti`

**Açıklama:**

Saldırgan, bir web sunucusunda SSTI saldırılarına karşı savunmasız olan kullanıcı tarafından doldurulan form alanına çalıştırılabilir kod enjekte edebilir; böylece kod, web sunucusu tarafından ayrıştırılıp çalıştırılır.

Başarılı bir saldırı, savunmasız bir web sunucusunun tamamen ele geçirilmesine yol açabilir; bu durum, saldırgana keyfi istekler gönderme, sunucu dosya sistemlerini inceleme ve belirli koşullarda uzaktan keyfi kod çalıştırma (detaylar için [RCE saldırısına][anchor-rce] bakınız) gibi pek çok işlemi yapabilme imkanı tanır.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Zararlı kodların çalıştırılmasını önlemek amacıyla tüm kullanıcı girdilerini temizleyin ve filtreleyin.

### LDAP enjeksiyonu

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-90][cwe-90]

**Wallarm kodu:** `ldapi`

**Açıklama:**

LDAP enjeksiyonları, saldırgana, LDAP sunucusuna yapılacak istekleri modifiye ederek LDAP arama filtrelerini değiştirme imkanı tanıyan saldırı sınıfını temsil etmektedir.

Başarılı bir LDAP enjeksiyonu saldırısı, LDAP kullanıcıları ve hostları hakkındaki gizli verilere okuma ve yazma işlemleri için yetki verebilir.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Bir web uygulamasının girdi olarak aldığı tüm parametreleri zararlı kodların çalıştırılmasını önlemek amacıyla temizleyin ve filtreleyin.
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet] önerilerini uygulayın.

### E-posta enjeksiyonu

**Saldırı**

**CWE kodu:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarm kodu:** `mail_injection`

**Açıklama:**

E-posta enjeksiyonu, bir web uygulaması iletişim formu aracılığıyla gönderilen kötü niyetli [IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki] ifadesidir ve standart e-posta sunucu davranışını değiştirmeyi amaçlar.

Bu saldırıya açıklık, iletişim formuna girilen verilerin yetersiz doğrulanmasından kaynaklanır. E-posta enjeksiyonu, e-posta istemcisi kısıtlamalarını aşmak, kullanıcı verilerini çalmak ve spam göndermek için kullanılabilir.

**Wallarm korumasına ek olarak:**

* Zararlı yüklerin çalıştırılmasını önlemek amacıyla tüm kullanıcı girdilerini temizleyin ve filtreleyin.
* [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet] önerilerini uygulayın.

### Sunucu Tarafı İstek Sahteciliği (SSRF)

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-918][cwe-918]

**Wallarm kodu:** `ssrf`

**Açıklama:**

Başarılı bir SSRF saldırısı, saldırgana hedef web sunucusu adına istek gönderme imkanı tanıyabilir; bu durum, web uygulamasında kullanılan ağ portlarının tespit edilmesi, dahili ağların taranması ve yetkilendirme mekanizmalarının aşılması gibi sonuçlar doğurabilir.

**Wallarm korumasına ek olarak:**

* Bir web uygulamasının girdi olarak aldığı tüm parametreleri zararlı kodların çalıştırılmasını önlemek amacıyla temizleyin ve filtreleyin.
* [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet] önerilerini uygulayın.

### Yol Gezintisi (Path Traversal)

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-22][cwe-22]

**Wallarm kodu:** `ptrav`

**Açıklama:**

Bir yol gezintisi saldırısı, saldırgana, web uygulamasındaki parametrelerin değiştirilmesi yoluyla, dosya veya dizin yolunu manipüle ederek dosya sisteminde saklanan gizli verilere erişim imkanı sağlar.

Bu saldırıya açıklık, kullanıcı tarafından bir dosya veya dizin talep edilirken girdinin yetersiz filtrelenmesinden kaynaklanır.

**Wallarm korumasına ek olarak:**

* Bir web uygulamasının girdi olarak aldığı tüm parametreleri zararlı kodların çalıştırılmasını önlemek amacıyla temizleyin ve filtreleyin.
* Bu tür saldırıları önlemeye yönelik ek öneriler [burada][link-ptrav-mitigation] mevcuttur.

### XML dış varlık saldırısı (XXE)

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-611][cwe-611]

**Wallarm kodu:** `xxe`

**Açıklama:**

XXE açığı, saldırgana, bir XML ayrıştırıcısı tarafından değerlendirilecek ve hedef web sunucusu üzerinde çalıştırılacak dış bir varlığın XML belgesine enjekte edilmesine imkan tanır.

Başarılı bir saldırı sonucunda, saldırgan;

* Web uygulamasının gizli verilerine erişim sağlayabilir,
* Dahili veri ağlarını tarayabilir,
* Web sunucusunda bulunan dosyaları okuyabilir,
* [SSRF][anchor-ssrf] saldırısı gerçekleştirebilir,
* Hizmet Reddi (DoS) saldırısı yapabilir.

Bu güvenlik açığı, XML dış varlıklarının ayrıştırılmasına yönelik kısıtlamaların olmamasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Kullanıcı tarafından sağlanan XML belgeleriyle çalışırken XML dış varlıklarının ayrıştırılmasını devre dışı bırakın.
* [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet] önerilerini uygulayın.

### Kaynak taraması

**Saldırı**

**CWE kodu:** yok

**Wallarm kodu:** `scanner`

**Açıklama:**

Bir HTTP isteğine, bu isteğin, korunan bir kaynağa yönelik saldırı veya tarama amacıyla yapılan üçüncü taraf tarayıcı yazılım aktivitesinin parçası olduğuna inanılırsa, `scanner` kodu atanır. Wallarm Tarayıcı isteği, kaynak taraması saldırısı olarak kabul edilmez. Bu bilgi, daha sonra bu hizmetlere yönelik saldırıda kullanılabilir.

**Wallarm korumasına ek olarak:**

* Ağ çevresi taramalarının önlenmesi için IP adresi beyaz listeleme ve kara listeleme uygulayın, ayrıca kimlik doğrulama/yetkilendirme mekanizmaları kullanın.
* Sunucuya yönelik tarama alanını, ağ duvarı arkasına yerleştirerek en aza indirin.
* Hizmetlerinizin çalışması için gerekli ve yeterli olan portları tanımlayın.
* Ağ seviyesinde ICMP protokolünün kullanımını sınırlayın.
* BT altyapınızın donanım ve yazılımını periyodik olarak güncelleyin.

## İstemci Tarafı Saldırıları

### Cross‑site Scripting (XSS)

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-79][cwe-79]

**Wallarm kodu:** `xss`

**Açıklama:**

Cross‑site scripting saldırısı, saldırgana, kullanıcının tarayıcısında önceden hazırlanmış keyfi kodu çalıştırma imkanı tanır.

XSS saldırısının birkaç türü vardır:

*   Stored XSS: Kötü niyetli kodun, web uygulamasının sayfasına önceden gömülü olmadığı durumdur.

    Web uygulaması, stored XSS saldırısına karşı savunmasızsa, saldırgan, kötü niyetli kodu web uygulamasının HTML sayfasına enjekte edebilir; ayrıca, bu kod kalıcı olarak saklanır ve enfekte olmuş web sayfasını talep eden herhangi bir kullanıcının tarayıcısı tarafından çalıştırılır.
    
*   Reflected XSS: Saldırganın, kullanıcının özel olarak hazırlanmış bir linki açmasını sağlaması durumudur.      

*   DOM‑tabanlı XSS: Web uygulamasının sayfasına yerleşmiş JavaScript kod parçası, girdiyi ayrıştırıp, bir hata nedeniyle, JavaScript komutu olarak çalıştırması durumudur.

Yukarıda belirtilen güvenlik açıklarından herhangi biri istismar edildiğinde, keyfi bir JavaScript kodunun çalıştırılması söz konusu olur. XSS saldırısının başarılı olması durumunda, saldırgan bir kullanıcının oturumunu veya kimlik bilgilerini çalabilir, kullanıcı adına istek gönderebilir ve diğer zararlı işlemleri gerçekleştirebilir.

Bu güvenlik açıkları, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Bir web uygulamasının girdi olarak aldığı tüm parametreleri zararlı kodların çalıştırılmasını önlemek amacıyla temizleyin ve filtreleyin.
* Web uygulaması sayfalarını oluştururken, dinamik olarak üretilen tüm girdileri temizleyin ve uygun şekilde kaçış karakterlerini kullanın.
* [OWASP XSS Prevention Cheat Sheet][link-owasp-xss-cheatsheet] önerilerini uygulayın.

### Açık Yönlendirme

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-601][cwe-601]

**Wallarm kodu:** `redir`

**Açıklama:**

Saldırgan, meşru bir web uygulaması aracılığıyla kullanıcıyı kötü niyetli bir web sayfasına yönlendirmek için açık yönlendirme saldırısını kullanabilir.

Bu saldırıya açıklık, URL girdilerinin hatalı filtrelenmesinden kaynaklanır.

**Wallarm korumasına ek olarak:**

* Bir web uygulamasının girdi olarak aldığı tüm parametreleri zararlı kodların çalıştırılmasını önlemek amacıyla temizleyin ve filtreleyin.
* Kullanıcılara yapılacak tüm yönlendirmeler hakkında bilgi verin ve açık izinlerini isteyin.

### CRLF enjeksiyonu

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-93][cwe-93]

**Wallarm kodu:** `crlf`

**Açıklama:**

CRLF enjeksiyonları, saldırgana, bir sunucuya (ör. HTTP isteği) Carriage Return (CR) ve Line Feed (LF) karakterleri enjekte etme imkanı tanıyan saldırı sınıfını temsil eder.

Diğer faktörlerle birleştiğinde, bu CR/LF karakter enjeksiyonu, HTTP Response Splitting [CWE-113][cwe-113], HTTP Response Smuggling [CWE-444][cwe-444] gibi pek çok güvenlik açığını istismar etmeye yardımcı olabilir.

Başarılı bir CRLF enjeksiyonu saldırısı, saldırgana;

* Güvenlik duvarlarını aşma,
* Önbellek zehirlemesi,
* Meşru web sayfalarını kötü niyetli olanlarla değiştirme,
* "Açık yönlendirme" saldırısını gerçekleştirme ve daha birçok işlemi yapma imkanı tanır.

Bu güvenlik açığı, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılmasından kaynaklanır.

**Wallarm korumasına ek olarak:**

* Zararlı kodların çalıştırılmasını önlemek amacıyla tüm kullanıcı girdilerini temizleyin ve filtreleyin.

## Toplu Saldırılar

### Brute-force Saldırısı

**Saldırı**

**CWE kodları:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Wallarm kodu:** `brute`

**Açıklama:**

Brute-force saldırısı, belirli bir yük içeren çok sayıda isteğin sunucuya gönderilmesiyle gerçekleşir. Bu yükler, belirli yöntemlerle üretilebilir veya bir sözlükten alınmış olabilir. Sunucunun yanıtı, yük verisindeki doğru kombinasyonu bulmak üzere analiz edilir.

Başarılı bir brute-force saldırısı, kimlik doğrulama ve yetkilendirme mekanizmalarının aşılmasına veya web uygulamasının gizli kaynaklarının (diziler, dosyalar, site bölümleri vb.) açığa çıkmasına yol açabilir; böylece saldırgana diğer zararlı işlemleri gerçekleştirme imkanı tanır.

**Gerekli yapılandırma:**

Wallarm, brute-force saldırılarını yalnızca en az bir veya daha fazla [brute-force tetikleyicisi](admin-en/configuration-guides/protecting-against-bruteforce.md) ve/veya [rate limit kuralı](user-guides/rules/rate-limiting.md) yapılandırılmışsa tespit edip hafifletir.

**Wallarm korumasına ek olarak:**

* Belirli bir zaman dilimindeki istek sayısını sınırlayın.
* Bir web uygulaması için belirli bir zaman dilimi içerisindeki kimlik doğrulama/yetkilendirme denemelerini sınırlayın.
* Belirli sayıda başarısız denemeden sonra yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
* Uygulamanın çalıştığı sunucuda, erişim izni olmayan dosya veya dizinlere erişimi kısıtlayın.

### Zorunlu Gözatma (Forced Browsing)

**Saldırı**

**CWE kodu:** [CWE-425][cwe-425]

**Wallarm kodu:** `dirbust`

**Açıklama:**

Bu saldırı, brute-force saldırıları sınıfına girer. Bu saldırının amacı, bir web uygulamasının gizli kaynaklarını, yani dizin ve dosyaları tespit etmektir. Bu, belirli bir şablona dayalı olarak üretilen veya hazır bir sözlük dosyasından çıkarılan farklı dosya ve dizin isimleri denenerek gerçekleştirilir.

Başarılı bir zorunlu gözatma saldırısı, web uygulaması arayüzünden açıkça erişilemeyen ama doğrudan erişim sağlandığında ortaya çıkan gizli kaynaklara erişim imkanı tanır.

**Gerekli yapılandırma:**

Wallarm, zorunlu gözatma saldırılarını yalnızca en az bir veya daha fazla [zorunlu gözatma tetikleyicisi](admin-en/configuration-guides/protecting-against-forcedbrowsing.md) yapılandırılmışsa tespit edip hafifletir.

**Wallarm korumasına ek olarak:**

* Kullanıcıların, doğrudan erişmeleri yasak olan kaynaklara erişimini (örneğin, kimlik doğrulama veya yetkilendirme mekanizmaları ile) sınırlayın.
* Belirli bir zaman dilimindeki istek sayısını sınırlayın.
* Belirli bir zaman diliminde kimlik doğrulama/yetkilendirme denemelerini sınırlayın.
* Başarısız denemeler belirli bir sayıya ulaştığında yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
* Web uygulamasının dosya ve dizinleri için gerekli ve yeterli erişim haklarını tanımlayın.

### Credential Stuffing

**Saldırı**

**Wallarm kodu:** `credential_stuffing`

**Açıklama:**

Hackerların, ele geçirilmiş kullanıcı kimlik bilgileri listelerini kullanarak, birden fazla web sitesinde yetkisiz erişim elde ettiği siber saldırı türüdür. Bu saldırı tehlikelidir çünkü birçok kişi farklı hizmetlerde aynı kullanıcı adı ve şifreyi kullanır veya yaygın zayıf şifreler tercih eder. Başarılı bir credential stuffing saldırısı daha az deneme gerektirir; bu nedenle saldırganlar istekleri çok daha seyrek gönderebilir, bu da brute force koruması gibi standart önlemleri etkisiz hale getirebilir.

**Gerekli yapılandırma:**

Wallarm, credential stuffing girişimlerini yalnızca filtreleme düğümü 4.10 veya daha yüksek sürümdeyse ve [Credential Stuffing Detection](about-wallarm/credential-stuffing.md) işlevselliği etkinleştirilmiş ve uygun şekilde yapılandırılmışsa tespit eder.

**Wallarm korumasına ek olarak:**

* [OWASP credential stuffing açıklamasını](https://owasp.org/www-community/attacks/Credential_stuffing) ve "Credential Stuffing Prevention Cheat Sheet"i inceleyin.
* Kullanıcıları güçlü şifreler kullanmaları konusunda zorlayın.
* Kullanıcıların farklı kaynaklar için aynı şifreyi kullanmamalarını önerin.
* İki faktörlü kimlik doğrulamayı etkinleştirin.
* Ek CAPTCHA çözümleri kullanın.

## Erişim Düzeyi 

### Broken Object Level Authorization (BOLA)

**Güvenlik Açığı/Saldırı**

**CWE kodu:** [CWE-639][cwe-639]

**Wallarm kodu:** `idor` güvenlik açıkları için, `bola` saldırılar için

**Açıklama:**

Saldırganlar, istekte gönderilen nesne ID'sini manipüle ederek, broken object level authorization'a karşı savunmasız API uç noktalarını istismar edebilir. Bu durum, hassas verilere izinsiz erişime yol açabilir.

Bu sorun, API tabanlı uygulamalarda son derece yaygındır çünkü sunucu bileşeni genellikle istemcinin durumunu tam olarak takip etmez; bunun yerine, istemciden gönderilen nesne ID'si gibi parametrelere dayanarak hangi nesnelere erişileceğine karar verir.

API uç noktası mantığına bağlı olarak, saldırgan yalnızca web uygulamalarındaki, API'lerdeki ve kullanıcı verilerindeki bilgileri okuyabilir veya değiştirebilir.

Bu güvenlik açığı aynı zamanda IDOR (Insecure Direct Object Reference) olarak da bilinir.

[Bu güvenlik açığı hakkında daha fazla detay](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)

**Gerekli yapılandırma:**

Wallarm, bu tür güvenlik açıklarını otomatik olarak keşfeder. BOLA saldırılarını tespit edip engellemek için şunlardan birini veya birkaçını yapın:

* [API Discovery](api-discovery/overview.md) modülünü etkinleştirin ve bu modül tarafından tespit edilen uç noktalar için [otomatik BOLA korumasını](admin-en/configuration-guides/protecting-against-bola.md) yapılandırın.
* Bir veya daha fazla [**BOLA** tetikleyicisi](admin-en/configuration-guides/protecting-against-bola.md) yapılandırın.

**Wallarm korumasına ek olarak:**

* Kullanıcı politikaları ve hiyerarşisine dayalı, uygun bir yetkilendirme mekanizması uygulayın.
* Nesnelerin ID'leri için [GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) olarak rastgele ve öngörülemez değerler kullanmaya özen gösterin.
* Yetkilendirme mekanizmasını değerlendiren testler yazın. Testleri bozan kırılgan değişiklikleri dağıtmayın.

### Toplu Atama (Mass Assignment)

**Saldırı**

**Wallarm kodu:** `mass_assignment`

**Açıklama:**

Toplu atama saldırısında, saldırganlar HTTP istek parametrelerini, program kodu değişkenlerine ya da nesnelere bağlamaya çalışır. Bir API savunmasızsa ve bağlama işlemi yapılabiliyorsa, saldırganlar ifşa edilmemesi gereken hassas nesne özelliklerini değiştirebilir; bu durum yetki yükselmesi, güvenlik mekanizmalarının atlatılması gibi sonuçlara yol açabilir.

Toplu atama saldırısına karşı savunmasız API'ler, istemci girdilerini uygun filtreleme olmaksızın içsel değişkenlere veya nesne özelliklerine dönüştürmeye izin verir. Bu güvenlik açığı, [OWASP API Security Top 10 2023 (API3:2023 Broken Object Property Level Authorization)](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/) listesinde yer almaktadır.

**Wallarm korumasına ek olarak:**

* İstemci girdisini otomatik olarak kod değişkenlerine veya nesne özelliklerine bağlayan fonksiyonlardan kaçının.
* Sadece istemcinin güncellemesi gereken özellikleri beyaz listeye alın ve özel özellikleri kara listeleyin.
* Varsa, girdiler için açıkça tanımlanmış ve zorunlu kılınmış şemaları tanımlayın ve uygulayın.

## API Suiistimali

### Şüpheli API Aktivitesi

**Saldırı**

**Wallarm kodu:** `api_abuse`

**Açıklama:**

Sunucu yanıt süresinin artması, sahte hesap oluşturma ve scalping gibi temel bot tiplerini içeren bir saldırı kümesidir.

**Gerekli yapılandırma:**

Wallarm, API suiistimali saldırılarını yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkinleştirilmiş ve doğru yapılandırılmışsa tespit edip hafifletir.

**API Abuse Prevention** modülü, aşağıdaki bot türlerini tespit etmek için karmaşık bot tespit modelini kullanır:

* Sunucu yanıt süresini artırmaya ya da sunucunun hizmet veremez hale gelmesine yönelik nüfuz amacıyla yapılan API suiistimali; genellikle kötü niyetli trafik artışları ile sağlanır.
* [Sahte hesap oluşturma](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) ve [Spamming](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) gerçek kullanıcıların işlemlerini yavaşlatan, destek ekibi veya pazarlama ekibinin gerçek kullanıcı isteklerini işleme sürecini aksatabilecek saldırılardır.
* [Scalping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping), çevrimiçi mağaza ürünlerinin gerçek müşterilerin erişimine kapatılması amacıyla, tüm ürünleri (satış yapılmadan) rezerve ederek stoğu tükettirme saldırısıdır.

Eğer metrikler, bot saldırısına yönelik belirtileri işaret ediyorsa, modül anomali kaynağını 1 saat boyunca [kara listeye veya gri listeye](api-abuse-prevention/setup.md#creating-profiles) alır.

**Wallarm korumasına ek olarak:**

* [OWASP, otomatik tehditlere ilişkin açıklamaları](https://owasp.org/www-project-automated-threats-to-web-applications/) inceleyin.
* Uygulamanızla alakasız bölgelerin ve kaynakların (örneğin, Tor gibi) IP adreslerini kara listeye alın.
* Sunucu tarafında istekler için rate limit (oran sınırı) yapılandırın.
* Ek CAPTCHA çözümleri kullanın.
* Bot saldırısına ilişkin belirtileri tespit etmek için uygulama analitiklerinizi izleyin.

### Hesap Ele Geçirme

**Saldırı**

**Wallarm kodu:** `account_takeover` (`api_abuse` 4.10.6 öncesinde)

**Açıklama:**

Bir saldırganın, başka bir kişinin hesabına, o kişinin izni veya bilgisi olmaksızın erişim sağlaması durumudur. Hesaba erişim sağlandıktan sonra, saldırgan hesabı, hassas bilgileri çalmak, dolandırıcılık işlemleri gerçekleştirmek, spam veya kötü amaçlı yazılım yaymak gibi çeşitli amaçlarla kullanabilir.

**Gerekli yapılandırma:**

Wallarm, hesap ele geçirme saldırılarını yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkinleştirilmiş ve doğru yapılandırılmışsa tespit edip hafifletir.

API Abuse Prevention, [detektörlerin](api-abuse-prevention/overview.md#how-api-abuse-prevention-works) yanı sıra, aşağıdaki hesap ele geçirme saldırılarını tespit edecek şekilde özel detektörler içerir:

* IP havuzu kullanılarak gerçekleştirilen hesap ele geçirme saldırıları için **IP rotasyonu**.
* Oturum havuzu kullanılarak gerçekleştirilen hesap ele geçirme saldırıları için **Session rotasyonu**.
* Uzun süre boyunca kademeli olarak gerçekleşen hesap ele geçirme saldırıları için **Persistent ATO**.

API Abuse Prevention, kritik uç noktalar veya kimlik doğrulama/ kayıt uç noktalarına yönelik brute force saldırısı şeklinde gerçekleştirilen [credential cracking](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html) girişimlerini tespit eder. Kabul edilebilir davranış metriklerinin otomatik eşiği, 1 saat boyunca meşru trafiğe dayanarak hesaplanır.

**Wallarm korumasına ek olarak:**

* [OWASP, otomatik tehditlere ilişkin açıklamaları](https://owasp.org/www-project-automated-threats-to-web-applications/) inceleyin.
* Güçlü şifreler kullanın.
* Farklı kaynaklar için aynı şifreleri kullanmayın.
* İki faktörlü kimlik doğrulamayı etkinleştirin.
* Ek CAPTCHA çözümleri kullanın.
* Hesapları şüpheli etkinliklere karşı izleyin.

### Güvenlik Tarayıcıları

**Saldırı**

**Wallarm kodu:** `security_crawlers` (`api_abuse` 4.10.6 öncesinde)

**Açıklama:**

Güvenlik tarayıcıları, web sitelerindeki güvenlik açıklarını tespit etmek üzere tasarlanmış olmakla birlikte, kötü niyetli amaçlar için de kullanılabilir. Saldırganlar, savunmasız web sitelerini belirleyip, bunları istismar etmek amacıyla bu tarayıcıları kullanabilir.

Ayrıca, bazı güvenlik tarayıcıları kötü tasarlanmış olabilir ve sunucuları aşırı yükleyerek, çökmelere veya diğer türde kesintilere neden olabilir.

**Gerekli yapılandırma:**

Wallarm, güvenlik tarayıcılarına yönelik saldırıları yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkinleştirilmiş ve doğru yapılandırılmışsa tespit edip hafifletir.

**API Abuse Prevention** modülü, aşağıdaki güvenlik tarayıcı bot türlerini tespit etmek için karmaşık bot tespit modelini kullanır:

* Uygulamayı profil çıkarmak amacıyla, bilgi çıkarmak için spesifik istekler gönderilen [Fingerprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html)
* Uygulamanın bileşimi, konfigürasyonu ve güvenlik mekanizmaları hakkında mümkün olduğunca bilgi toplamak amacıyla gerçekleştirilen [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html)
* Servis güvenlik açığı taraması yapılan [Vulnerability scanning](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning)

**Wallarm korumasına ek olarak:**

* [OWASP, otomatik tehditlere ilişkin açıklamaları](https://owasp.org/www-project-automated-threats-to-web-applications/) inceleyin.
* SSL sertifikaları kullanın.
* Ek CAPTCHA çözümleri kullanın.
* Rate limiting (oran sınırı) uygulayın.
* Zararlı etkinlikleri gösterebilecek trafik desenlerini izlemek için trafiğinizi kontrol edin.
* Arama motoru tarayıcılarına hangi sayfaları tarayabileceklerini veya tarayamayacaklarını belirten robots.txt dosyasını kullanın.
* Yazılımları düzenli olarak güncelleyin.
* Bir içerik dağıtım ağı (CDN) kullanın.

### Scraping

**Saldırı**

**Wallarm kodu:** `scraping` (`api_abuse` 4.10.6 öncesinde)

**Açıklama:**

Web scraping, veri kazıma ya da web haritalaması olarak da bilinir; web sitelerinden otomatik olarak veri çıkarma sürecidir. Web sayfalarından veri çekmek ve bunu yapılandırılmış bir formatta (ör. elektronik tablo veya veritabanı) kaydetmek için yazılım veya kod kullanılır.

Web scraping, kötü niyetli amaçlarla da kullanılabilir. Örneğin, scraping araçları, giriş bilgileri, kişisel bilgiler veya finansal veriler gibi hassas bilgileri çalmak için kullanılabilir. Ayrıca, scraping araçları, bir web sitesinde erişilebilir olan verileri aşırı derecede çekerek hizmetin performansını düşürebilir veya Hizmet Reddi (DoS) saldırısına yol açabilir.

**Gerekli yapılandırma:**

Wallarm, scraping saldırılarını yalnızca [API Abuse Prevention](api-abuse-prevention/overview.md) modülü etkinleştirilmiş ve doğru yapılandırılmışsa tespit edip hafifletir.

**API Abuse Prevention** modülü, uygulamadan erişilebilen verilerin veya işlenmiş çıktının toplanması sonucu, özel veya ücretli içeriğin kullanıcıya açığa çıkmasına neden olabilecek [scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping) bot türünü tespit etmek için karmaşık bot tespit modelini kullanır.

**Wallarm korumasına ek olarak:**

* [OWASP, otomatik tehditlere ilişkin açıklamaları](https://owasp.org/www-project-automated-threats-to-web-applications/) inceleyin.
* Ek CAPTCHA çözümleri kullanın.
* Arama motoru tarayıcılarına hangi sayfaları tarayabileceklerini veya tarayamayacaklarını belirten robots.txt dosyasını kullanın.
* Zararlı etkinlikleri gösterebilecek trafik desenlerini izlemek için trafiğinizi kontrol edin.
* Rate limiting (oran sınırı) uygulayın.
* Verileri şifreleyin veya karma hale getirin.
* Yasal işlem başlatın.

## GraphQL Saldırıları

**Saldırı**

**Wallarm kodu:** `graphql_attacks`

**Açıklama:**

GraphQL, aşırı bilgi açığa çıkarma ve Hizmet Reddi (DoS) saldırılarına yönelik protokole özgü saldırıların uygulanmasına imkan tanıyan özelliklere sahiptir; detaylar alt bölümlerde açıklanmıştır.

Bu tür tehditleri önlemenin yeterli bir önlemi, GraphQL istekleri için istek ve değer boyutları, sorgu derinliği, toplu sorgu sayısı gibi limitlerin belirlenmesidir. Wallarm'da, bu limitleri [GraphQL policy](api-protection/graphql-rule.md) içerisinde ayarlarsınız; limitleri aşan herhangi bir GraphQL isteği, GraphQL saldırısı olarak değerlendirilir.

**Gerekli yapılandırma:**

Wallarm, GraphQL saldırılarını yalnızca en az bir veya daha fazla [GraphQL saldırılarını tespit eden kural](api-protection/graphql-rule.md) yapılandırılmışsa tespit edip hafifletir (node 4.10.3 veya daha yüksek gerektirir).

**Wallarm korumasına ek olarak:**

* Hassas veya kısıtlanmış GraphQL API'lerine erişim için kimlik doğrulamayı zorunlu kılın.
* Enjeksiyon saldırılarını önlemek ve kötü niyetli girdi değerlerini korumak amacıyla girdileri ve çıktıları temizleyin.
* İstek detayları ve yanıt verileri de dahil olmak üzere, GraphQL sorgu etkinliğini izlemek ve analiz etmek için kapsamlı günlükleme mekanizmaları uygulayın.
* GraphQL sunucularını, kısıtlı izinler ve erişim kontrollerine sahip güvenli çalışma ortamlarında çalıştırın.

### GraphQL Sorgu Boyutu

**Wallarm kodu:** `gql_doc_size`: izin verilen maksimum toplam sorgu boyutunun ihlali

**Açıklama:** 

Saldırgan, GraphQL uç noktalarına yönelik Hizmet Reddi (DoS) saldırısı gerçekleştirmek veya diğer sorunlara yol açmak amacıyla aşırı büyük girdilerden yararlanabilir.

### GraphQL Değer Boyutu

**Wallarm kodu:** `gql_value_size`: izin verilen maksimum değer boyutunun ihlali

**Açıklama:**

Saldırgan, sunucunun kaynaklarını zorlamak amacıyla, bir değişken veya argüman için aşırı uzun bir dize değeri içeren GraphQL isteği gönderebilir (Aşırı Değer Uzunluğu saldırısı).

### GraphQL Sorgu Derinliği

**Wallarm kodu:** `gql_depth`: izin verilen maksimum sorgu derinliğinin ihlali

**Açıklama:** 

GraphQL sorguları iç içe geçebilir; bu durum, tek bir istekle karmaşık veri yapıları talep etme esnekliği sağlasa da, saldırgan tarafından aşırı iç içe geçmiş sorgu oluşturularak sunucunun zorlanmasına yol açabilir.

### GraphQL Takma Adlar

**Wallarm kodu:** `gql_aliases`: izin verilen maksimum takma ad sayısının ihlali

**Açıklama:** 

GraphQL'de, takma adlar, çakışmaları önlemek ve daha iyi veri organizasyonu sağlamak amacıyla sonuç alanlarını yeniden adlandırma imkanı sunar; ancak, saldırgan bu özelliği, Kaynak Tüketimi veya Hizmet Reddi (DoS) saldırısı başlatmak için istismar edebilir.

### GraphQL Toplu Sorgulama

**Wallarm kodu:** `gql_docs_per_batch`: izin verilen maksimum toplu sorgu sayısının ihlali

**Açıklama:** 

GraphQL'de, birden fazla sorgu (işlem), tek bir HTTP isteğinde toplu olarak gönderilebilir; saldırgan, toplu sorgu saldırısı düzenleyip, rate limiting (oran sınırı) gibi güvenlik önlemlerini aşmaya çalışabilir.

### GraphQL Introspection

**Wallarm kodu:** `gql_introspection`: yasak introspection sorgusu

**Açıklama:** 

Saldırgan, GraphQL introspection sistemini kullanarak, GraphQL API şeması hakkında detaylı bilgi edinebilir; bu sorgulama ile API'deki tüm tipler, sorgular, mutasyonlar ve alanlar hakkında bilgi toplayarak, daha hassas ve zararlı sorgular oluşturabilir.

### GraphQL Debug

**Wallarm kodu:** `gql_debug`: yasak debug modu sorgusu

**Açıklama:**

GraphQL'de, geliştiriciler tarafından debug modu açık bırakıldığında, saldırgan aşırı hata raporlama mesajlarından (örneğin, tüm yığın izleri veya traceback'ler) değerli bilgiler toplayabilir. Saldırgan, URI'de “debug=1“ parametresiyle debug moduna erişim sağlayabilir.

## API Spesifikasyonu

**Saldırı**

**Wallarm kodu:** `api_specification` tüm spesifikasyon tabanlı ihlalleri gösterir. Özel ihlaller alt bölümlerde açıklanmıştır.

**Açıklama:**

[API Specification Enforcement](api-specification-enforcement/overview.md), yüklediğiniz spesifikasyonlara dayalı olarak API'larınıza güvenlik politikaları uygulamak üzere tasarlanmıştır. Birincil işlevi, spesifikasyonunuzdaki uç nokta açıklamaları ile REST API'larınıza yapılan istekler arasındaki uyumsuzlukları tespit etmektir. Bu tür uygunsuzluklar tespit edildiğinde, sistem bunları ele almak için önceden tanımlanmış işlemleri gerçekleştirebilir.

API Specification Enforcement, isteklerin spesifikasyonla karşılaştırılması sırasında uygulanan limitler aşıldığında, isteğin işlenmesini durdurur ve bu durumu belirten bir etkinlik oluşturur (bkz. [işleme aşımı](#processing-overlimit)).

### Tanımsız Uç Nokta

**Wallarm kodu:** `undefined_endpoint`

**Açıklama:**

Spesifikasyonunuzda yer almayan bir uç noktanın istenmesidir.

### Tanımsız Parametre

**Wallarm kodu:** `undefined_parameter`

**Açıklama:**

Spesifikasyonunuzda bu uç nokta için belirtilmeyen parametreleri içeren istekler saldırı olarak işaretlenir.

### Geçersiz Parametre

**Wallarm kodu:** `invalid_parameter_value`

**Açıklama:**

Parametrenin değerinin, spesifikasyonunuzda tanımlanan tip/format ile uyumlu olmaması nedeniyle istekler saldırı olarak işaretlenir.

### Eksik Parametre

**Wallarm kodu:** `missing_parameter`

**Açıklama:**

Spesifikasyonunuzda zorunlu olarak işaretlenen parametre veya değerin istek içinde yer almaması nedeniyle saldırı olarak işaretlenir.

### Eksik Kimlik Doğrulama

**Wallarm kodu:** `missing_auth`

**Açıklama:**

Gerekli kimlik doğrulama yöntemine ilişkin bilgilerin eksik olduğu istekler saldırı olarak işaretlenir.

### Geçersiz İstek

**Wallarm kodu:** `invalid_request`

**Açıklama:**

Geçersiz JSON içeren istekler saldırı olarak işaretlenir.

## Veri İşleme

### Data Bomb

**Saldırı**

**CWE kodu:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Wallarm kodu:** `data_bomb`

**Açıklama:**

Wallarm, içeriğinde Zip veya XML bombası geçen istekleri Data bomb saldırısı olarak işaretler:

* [Zip bomb](https://en.wikipedia.org/wiki/Zip_bomb) — okuyan program veya sistemi çökertecek ya da işlevsiz hale getirecek şekilde tasarlanmış kötü niyetli bir arşiv dosyasıdır. Zip bomb, programın niyetinde olduğu gibi çalışmasına izin verir, fakat arşiv, açılması için aşırı miktarda zaman, disk alanı ve/veya hafıza gerektirecek şekilde hazırlanmıştır.
* [XML bombası (billion laughs attack)](https://en.wikipedia.org/wiki/Billion_laughs_attack) — XML ayrıştırıcılarına yönelik Hizmet Reddi (DoS) saldırısı türüdür. Saldırgan, XML varlıklarında kötü niyetli yükler gönderir.

    Örneğin, `entityOne` 20 adet `entityTwo` olarak tanımlanabilir; bu da kendileri 20 adet `entityThree` olarak tanımlanabilir. Aynı desen `entityEight`e kadar tekrarlandığında, XML ayrıştırıcısı, `entityOne`in tek bir örneğini 1.280.000.000 adet `entityEight` olarak açar — yaklaşık 5 GB hafıza tüketir.

**Wallarm korumasına ek olarak:**

* Gelen istek boyutlarını sınırlayarak sistemin zarar görmesini engelleyin.

### Geçersiz XML

**Saldırı**

**Wallarm kodu:** `invalid_xml`

**Açıklama:**  

Bir istek, gövdesinde bir XML belgesi içeriyor ve belgedeki kodlama, XML başlığında belirtilen kodlamadan farklı ise, `invalid_xml` olarak işaretlenir.

### İşleme Aşım

**Saldırı**

**Wallarm kodu:** `processing_overlimit`

**Açıklama:**

**Spesifikasyon işleme aşımı** olayı, [API Specification Enforcement](#api_specification) işleminde uygulanan limitlerin ihlal edilmesi durumunda saldırı listesine eklenir.

### Kaynak Aşımı

**Saldırı**

**Wallarm kodu:** `overlimit_res`

**Açıklama:**

Wallarm düğümü, gelen isteklerin işlenmesi için harcanacak sürenin `N` milisaniyeden (varsayılan değer: `1000`) fazla olmamasını sağlayacak şekilde yapılandırılmıştır. İstek, belirtilen zaman dilimi içerisinde işlenemezse, isteğin işlenmesi durdurulur ve istek `overlimit_res` saldırısı olarak işaretlenir.

Özel zaman sınırı belirleyerek, limiti aştığında düğümün varsayılan davranışını değiştirmek için [**Limit request processing time**](user-guides/rules/configure-overlimit-res-detection.md) kuralını kullanabilirsiniz.

İstek işleme süresinin sınırlandırılması, Wallarm düğümlerine yönelik bypass saldırıları önlemeye yardımcı olur. Bazı durumlarda, `overlimit_res` olarak işaretlenen istekler, Wallarm düğüm modüllerine tahsis edilen kaynakların yetersizliğini gösterebilir.

## Engellenmiş Kaynak

**Saldırı**

**Wallarm kodu:** `blocked_source`

**Açıklama:**

Manuel olarak [kara listeye alınmış](user-guides/ip-lists/overview.md) IP'lerden gelen saldırılar.

## Sanal Yama (Virtual patch)

**Saldırı**

**Wallarm kodu:** `vpatch`

**Açıklama:**     

Bir istek, [sanal yama mekanizması][doc-vpatch] tarafından hafifletilen saldırının parçası ise `vpatch` olarak işaretlenir.

**Gerekli yapılandırma:**

Sanal yamalama, [filtrasyon modu](admin-en/configure-wallarm-mode.md) ne bakılmaksızın, belirli veya tüm isteklerin engellenmesi işlemidir. Sanal yamalar, [manuel olarak][doc-vpatch] oluşturulan özel kurallardır.

**Wallarm korumasına ek olarak:**

* Yamayla hafifletilen güvenlik açığını analiz edin ve yamanın gereksiz hale gelmesi için giderin.

<!--### API Leak

**Wallarm kodu:** `apileak`

Açıklama: TBD (dokümanlarda belirtilmemiş, ancak UI'da yer almaktadır)
-->

## Diğer

### Kimlik Doğrulama Atlatma

**Güvenlik Açığı**

**CWE kodu:** [CWE-288][cwe-288]

**Wallarm kodu:** `auth`

**Açıklama:**

Kimlik doğrulama mekanizmaları bulunsa bile, bir web uygulaması, ana kimlik doğrulama mekanizmasını atlatan veya zayıflıklarını istismar eden alternatif kimlik doğrulama yöntemlerine sahip olabilir. Bu durum, saldırgana kullanıcı veya yönetici izinleriyle erişim sağlama imkanı tanıyabilir.

Başarılı bir kimlik doğrulama atlatma saldırısı, kullanıcıların gizli verilerinin açığa çıkmasına veya savunmasız uygulamanın yönetici izinleriyle ele geçirilmesine neden olabilir.

**Wallarm korumasına ek olarak:**

* Mevcut kimlik doğrulama mekanizmalarını geliştirin ve güçlendirin.
* Saldırganların, önceden tanımlı mekanizmalar vasıtasıyla kimlik doğrulama prosedürünü atlayarak uygulamaya erişim sağlamasına neden olabilecek alternatif kimlik doğrulama yöntemlerini ortadan kaldırın.
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet] önerilerini uygulayın.

### Cross-site Request Forgery (CSRF)

**Güvenlik Açığı**

**CWE kodu:** [CWE-352][cwe-352]

**Wallarm kodu:** `csrf`

**Açıklama:**

Cross-site request forgery (CSRF), hedef web uygulamasında o an kimlik doğrulaması yapılmış olan bir kullanıcının, istenmeyen işlemleri gerçekleştirmeye zorlanmasıdır. Sosyal mühendislik (örneğin, e-posta veya sohbet yoluyla link gönderme) yardımıyla saldırgan, bir web uygulamasının kullanıcısını, saldırganın belirlediği işlemleri gerçekleştirmeye ikna edebilir.

İlgili güvenlik açığı, kullanıcının tarayıcısının, hedef alan adı için ayarlanmış oturum çerezlerini otomatik olarak eklemesinden kaynaklanır.

Çoğu site için, bu çerezler site ile ilişkili kimlik bilgilerini içerir. Bu nedenle kullanıcı, o an siteye giriş yapmışsa, site, saldırgan tarafından gönderilen sahte istek ile kullanıcının gönderdiği meşru istek arasında ayrım yapamaz.

Sonuç olarak, saldırgan, savunmasız web uygulamasına, kötü niyetli bir web sitesi aracılığıyla, meşru bir kullanıcının yerine geçerek istek gönderebilir; saldırganın, kullanıcının çerezlerine bile erişmesine gerek yoktur.

Wallarm, CSRF saldırılarını tespit eder ancak engellemez. CSRF problemi, modern tarayıcılar tarafından içerik güvenlik politikaları (CSP) vasıtasıyla çözülmüştür.

**Koruma:**

CSRF, tarayıcılar tarafından çözülmektedir; diğer koruma yöntemleri daha az faydalı olsa da yine de uygulanabilir:

* CSRF tokenları gibi anti-CSRF koruma mekanizmaları uygulayın.
* `SameSite` çerez özelliğini ayarlayın.
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet] önerilerini uygulayın.

### Bilgi Açığa Çıkması

**Güvenlik Açığı/Saldırı**

**CWE kodları:** [CWE-200][cwe-200] (ayrıca bkz: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548], [CWE-598][cwe-598])

**Wallarm kodu:** `infoleak`

**Açıklama:**

Bu güvenlik açığı, bir uygulamanın, saldırganlara gelecekteki zararlı işlemler için kullanılabilecek hassas verileri yetkisiz olarak ifşa etmesi anlamına gelir.

Hassas bilgilerin bazı türleri:

* E-posta, finansal veri, iletişim bilgileri gibi özel, kişisel bilgiler.
* Hata mesajları, yığın izleri vs. gibi teknik bilgiler.
* İşletim sistemi, yüklü paketler gibi sistem durumu ve ortam bilgisi.
* Kaynak kodu veya içsel durum.

Wallarm, bilgi açığa çıkmasını iki şekilde tespit eder:

* Sunucu yanıtı analizi: Wallarm, [güvenlik açığı tespit yöntemleri](about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) kullanarak, uygulama yanıtlarının yanlışlıkla hassas bilgileri ifşa edip etmediğini analiz eder.
* API Discovery içgörüleri: [API Discovery](api-discovery/overview.md) modülü tarafından tespit edilen uç noktalar, GET isteklerinin sorgu parametrelerinde Kişisel Tanımlanabilir Bilgiler (PII) içerdiğinde, Wallarm bunları savunmasız olarak değerlendirir.

Wallarm, `infoleak` saldırılarını özel olarak sınıflandırmaz ancak gerçekleştiğinde ilgili güvenlik olaylarını tespit eder. Bu tür olaylar nadirdir. Wallarm tespit mekanizmaları, böyle bir durumun ortaya çıkması halinde sizi hızlıca uyarır, böylece açığı hızla giderebilirsiniz. Ayrıca, Wallarm filtreleme düğümünün [engelleme modunda](admin-en/configure-wallarm-mode.md#available-filtration-modes) kullanılması, saldırı girişimlerini engelleyerek veri sızıntısı ihtimalini azaltır.

**Wallarm korumasına ek olarak:**

* Web uygulamalarının hassas bilgileri görüntüleme yeteneğini kaldırın.
* Kayıt ve giriş formları gibi hassas verilerin iletiminde GET yerine POST HTTP metodunu tercih edin.

### Savunmasız Bileşen

**Güvenlik Açığı**

**CWE kodları:** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Wallarm kodu:** `vuln_component`

**Açıklama:**

Bu güvenlik açığı, web uygulamanızın veya API'nizin savunmasız veya güncel olmayan bir bileşen kullanması durumunda ortaya çıkar. Bu, işletim sistemi, web/uygulama sunucusu, veritabanı yönetim sistemi (DBMS), çalışma ortamları, kütüphaneler ve diğer bileşenleri içerebilir.

Bu güvenlik açığı, [A06:2021 – Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components) ile eşleştirilir.

**Wallarm korumasına ek olarak:**

* Kullanılmayan bağımlılıkları, gereksiz özellikleri, bileşenleri, dosyaları ve dokümantasyonu ortadan kaldırın.
* Hem istemci hem de sunucu tarafı bileşenlerinin (örneğin; framework, kütüphane) versiyonlarının ve bağımlılıklarının envanterini sürekli olarak çıkartın (OWASP Dependency Check, retire.js gibi araçlar kullanın).
* Bileşenlerdeki güvenlik açıklarını izlemek için Common Vulnerabilities and Exposures (CVE) ve National Vulnerability Database (NVD) gibi kaynakları sürekli takip edin.
* Bileşenleri güvenli bağlantılar üzerinden, resmi kaynaklardan edinin. Değiştirilmiş, kötü amaçlı bileşenlerin dahil edilme olasılığını azaltmak için imzalı paketleri tercih edin.
* Bakımı yapılmayan veya eski versiyonlar için güvenlik yamaları oluşturulmayan kütüphane ve bileşenleri izleyin; yamalama mümkün değilse, sanal yama uygulamasını devreye alın.

### Zayıf JWT

**Güvenlik Açığı**

**CWE kodu:** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Wallarm kodu:** `weak_auth`

**Açıklama:**

[JSON Web Token (JWT)](https://jwt.io/), API’ler gibi kaynaklar arasında güvenli veri alışverişi sağlamak için kullanılan popüler bir kimlik doğrulama standardıdır.

JWT’nin tehlikeye girmesi, kimlik doğrulama mekanizmalarının kırılması nedeniyle saldırganlara web uygulamalarına ve API’lere tam erişim imkanı tanır. JWT ne kadar zayıfsa, ele geçirilme ihtimali de o kadar yüksek olur.

Wallarm, JWT’lerin zayıf olduğunu şu durumlarda kabul eder:

* Şifrelenmemiş – imzalama algoritması yok ( `alg` alanı `none` veya yok).
* Kırılmış gizli anahtarlar kullanılarak imzalanmış olması.

Zayıf bir JWT tespit edildiğinde, Wallarm ilgili [güvenlik açığını](user-guides/vulnerabilities.md) kaydeder.

**Wallarm korumasına ek olarak:**

* [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) önerilerini uygulayın.
* [JWT uygulamanızın yaygın anahtarları kontrol edin](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)
