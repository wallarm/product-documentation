# Saldırı ve Zafiyet Türleri

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

[anchor-main-list]:     #ana-saldiri-ve-zafiyetler-listesi        
[anchor-ozel-liste]:  #ozel-saldiri-ve-zafiyetler-listesi

[anchor-brutalaysia]: #brutal-force-saldiri
[anchor-rce]:   #uzaktan-kod-yurutme-rce
[anchor-ssrf]:  #sunucu-tarafi-sanal-istek-saldiisi-ssrf

[link-imap-wiki]:                                https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]:                                https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]:     https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

Wallarm filtreleme düğümü, OWASP API Top 10 tehdit listesinde yer alanları da içeren birçok saldırıyı ve zafiyeti tespit edebilir. Bu saldırılar ve zafiyetler [aşağıda][anchor-main-list] listelenmiştir.

Listedeki her bir öge:

* Ya **Saldırı**, **Zafiyet** olarak etiketlenmiştir ya da her ikisiyle de.

    Belirli bir saldırının adı, bu saldırının sömürdüğü zafiyetin adıyla aynı olabilir. Bu durumda, bu tür bir öge, birleştirilmiş **Zafiyet / Saldırı** etiketiyle etiketlenir.

* Bu ögeye karşılık gelen Wallarm koduna sahiptir.

Bu listedeki çoğu zafiyet ve saldırı ayrıca, Yazılım zayıflığı türleri listesi olarak da bilinen [Common Weakness Enumeration][link-cwe] veya CWE'den bir veya daha fazla kodla birlikte gelir.

Ayrıca, Wallarm filtreleme düğümü, işlenen trafiği işaretlemek amacıyla birkaç özel saldırı ve zafiyet türünü kullanır. Bu tür öğeler CWE kodlarıyla eşlik etmez, ancak [ayrı bir liste][anchor-ozel-liste] olarak listelenir.

??? info "Wallarm'ın OWASP Top 10'a karşı nasıl koruma sağladığına dair videoyu izleyin"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

##  Ana saldırı ve zafiyetler listesi

### XML Harici Varlıkta (XXE) Saldırı

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-611][cwe-611]

**Wallarm kodu:** `xxe`

**Açıklama:**

XXE zafiyeti, bir saldırganın bir XML belgesine bir dış varlık enjekte etmesine olanak sağlar ve daha sonra bu belge hedef web sunucusunda bir XML ayrıştırıcı tarafından değerlendirilir.

Başarılı bir saldırı sonucunda bir saldırgan:

*   Web uygulamasının gizli verilerine erişebilir
*   Dahili veri ağlarını tarayabilir
*   Web sunucusunda bulunan dosyaları okuyabilir
*   Bir [SSRF][anchor-ssrf] saldırısı gerçekleştirebilir
*   Bir Hizmet Dışı Bırakma (DoS) saldırısı gerçekleştirebilir

Bu zafiyet, bir web uygulamasında XML dış varlıkların ayrıştırılması üzerindeki kısıtlamanın eksik olmasından kaynaklanır.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Kullanıcının sunduğu XML belgeleriyle çalışırken XML dış varlıkların ayrıştırılmasını devre dışı bırakın.
*   [OWASP XXE Önleme Hile Sayfasındaki][link-owasp-xxe-cheatsheet] önerileri uygulayın.


### Brute-force saldırı

**Saldırı**

**CWE kodları:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Wallarm kodu:** `brute`

**Açıklama:**

Brute-force saldırı, bir sunucuya önceden belirlenmiş bir yük içeren çok sayıda istek gönderdiğinde meydana gelir. Bu yükler belirli bir şekilde oluşturulmuş olabilir veya bir sözlükten alınabilir. Ardından sunucunun yük verilerinde bulunan doğru veri kombinasyonunu bulmak için yanıtları analiz eder.

Başarılı bir brute‑force saldırı, kimlik doğrulama ve yetkilendirme mekanizmalarını aşarak ve/veya bir web uygulamasının gizli kaynaklarını (örneğin dizinler, dosyalar, web sitesi parçaları vb.) ortaya çıkararak potansiyel olarak diğer kötü amaçlı eylemleri gerçekleştirebilir.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Bir web uygulamasına belirli bir zaman diliminde gönderilen istek sayısını sınırlayın.
*   Bir web uygulamasına belirli bir zaman dilimindeki kimlik doğrulama/yetkilendirme denemelerini sınırlayın.
*   Belirli bir sayıda başarısız denemeden sonra yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
*   Web uygulamanızın üzerinde çalıştığı sunucudaki herhangi bir dosya veya dizine erişimi sınırlayın, yalnızca uygulamanın kapsamı dahilinde olanlara izin verin.

[Brute force saldırılarına karşı uygulamaları korumak için Wallarm çözümünü nasıl yapılandıracağınıza dair →](admin-en/configuration-guides/protecting-against-bruteforce.md)

### Kaynak tarama

**Saldırı**

**CWE kodu:** yok

**Wallarm kodu:** `scanner`

**Açıklama:**    

Bir istek bir `scanner` olarak işaretlenir, eğer bu istek, üçüncü taraf tarayıcı yazılımlarının bir korunan kaynağa saldırmak veya tarayı hedefleyen faaliyetinin bir parçası olarak geliyor ama bu tanımlanan Wallarm Tarayıcı'nın isteklerini bir kaynak tarama saldırısı olarak kabul etmiyoruz.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Bir ağ çevre taramasının olasılığını sınırlayın, IP adres izin ve yasaklama listeleri ile kimlik doğrulama/yetkilendirme mekanizmalarını kullanın.
*   Tarayıcı yüzeyini asgariye indirin, ağ çevresini bir firewall arkasına yerleştirin.
*   Servislerinizin çalışması için açılması gereken gerek ve yeter limanları tanımlayın.
*   Ağ düzeyinde ICMP protokolünün kullanımını sınırlayın.
*   Donanım ve diğer ekipmanlarınızın sürekli olarak güncellenmesini sağlayın. Bu içerir:

    *   Sunucular ve diğer ekipmanların firmware
    *   İşletim sistemleri
    *   Diğer yazılımlar


### Sunucu Tarafı Şablon Enjeksiyonu (SSTI)

**Zafiyet/Saldırı**

**CWE kodları:** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Wallarm kodu:** `ssti`

**Açıklama:**

Bir saldırgan, web sunucusuna saldıran bir SSTI saldırısında bulunarak web sunucusu tarafında yürütülecek bir kodu bir kullanıcının doldurduğu forma enjekte edebilir.

Başarılı bir SSTI saldırısı, bir saldırganın (ayrıntılar için [RCE saldırısı][anchor-rce]na bakın) potansiyel olarak; web sunucusunu tamamen ele geçirmesi, ayrıca sunucuyu ya da hizmeti devre dışı bırakmaya neden olabilecek bir durumlardaki ayrıştırıcıyı etkileme ve birçok diğer durumu gerçekleştirmeye izin verir.   

Bu zafiyet, kullanıcı girişi doğrulamanın ve ayrıştırılmasının yanlış olmasından kaynaklanır.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.


### Veri bombası

**Saldırı**

**CWE kodu:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Wallarm kodu:** `data_bomb`

**Açıklama:**

Wallarm, bir isteği Veri bombası saldırısı olarak işaretler, eğer bu istek Zip veya XML bombası içeriyorsa:

* [Zip bomba](https://en.wikipedia.org/wiki/Zip_bomb) bir programı çökertmek veya hizmet dışı bırakmak için tasarlanmış kötü amaçlı bir arşiv dosyasıdır. Zip bomba, programın planlandığı gibi çalışmasına izin verir, ancak arşiv o kadar hazırlanmıştır ki, bunu açmak sıra dışı miktarda zaman, disk alanı ve/veya hafıza gerektirir.
* [XML bomba (milyar gülen saldırısı) ](https://en.wikipedia.org/wiki/Billion_laughs_attack) XML belgelerinin ayrıştırıcılarına yönelik bir DoS saldırısı türüdür. Bir saldırgan, XML varlıklarında kötü amaçlı yükler gönderir.

    Örneğin, `entityOne` 20 `entityTwo` olarak tanımlanabilir, onlar da 20 `entityThree` olarak tanımlanabilir. Eğer aynı düzen `entityEight` dahil olmak üzere devam ederse, XML ayrıştırıcı bir `entityOne`'un tek bir oluşumunu 1 280 000 000 `entityEight`e açar - bunu açmak 5 GB hafıza gerektirir.

**Düzeltme:**

Gelen isteklerin boyutunu sınırlayın, böylece sisteme zarar veremez.

### Cross-Site Scripting (XSS)

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-79][cwe-79]

**Wallarm kodu:** `xss`

**Açıklama:**

Cross-site scripting saldırısı, bir saldırganın bir kullanıcının tarayıcısında hazırlandığı şekilde kendi belirlenen kodunu çalıştırmasına imkan sağlar.

Birkaç XSS saldırı türü vardır:

*   Depolanan XSS, kötü amaçlı bir kodun, web uygulamasının sayfasında önceden yerleştirilmiştir.

    Eğer web uygulaması, depolanan XSS saldırısına karşı savunmasızsa, o zaman bir saldırganın, kötü amaçlı bir kodu web uygulamasının HTML sayfasına enjekte etmesi mümkün olur; ayrıca, bu kod, enfekte olan web sayfasını talep eden herhangi bir kullanıcının tarayıcısından çıktığında kalıcı olacaktır.
    
*   Yansıtılmış bir XSS, bir saldırganın bir kullanıcının özellikle oluşturulmuş bir bağlantıyı açmasını sağladığında gerçekleşir.      

*   DOM tabanlı XSS, bir JavaScript kod parçacığına yerleştirilen web uygulamasının sayfasının girişi ayrıştırır ve bu kod parçacığındaki hatalar nedeniyle bir JavaScript komutu olarak çıkarılmasını sağlar.

Yukarıdaki zafiyetlerden herhangi birinin sömürülmesi, keyfi bir JavaScript kodunun yürütülmesine yol açar. XSS saldırısı başarılı olduğunda, bir saldırgan bir kullanıcının oturumunu veya kimlik bilgilerini çalabilir, kullanıcının adına istekler yapabilir ve diğer kötü amaçlı eylemleri gerçekleştirebilir. 

Bu zafiyet sınıfı, kullanıcı girişinin yanlış doğrulanması ve ayrıştırılması sonucu meydana gelir.


**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.
*   Web uygulamasının sayfalarını oluştururken, dinamik olarak oluşturulan tüm varlıkları düzeltin ve kaçınılır hale getirin.
*   [OWASP XSS Önleme Hile Sayfası][link-owasp-xss-cheatsheet]ndaki önerileri uygulayın.

### Broken Object Level Authorization (BOLA)

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-639][cwe-639]

**Wallarm kodu:** `idor` zafiyetleri için , `bola` saldırıları için

**Açıklama:**

Saldırganlar, kimlik doğrulamanın kırıldığı nesne seviyesine izin veren API uç noktalarını sıcaklıkla, istekte yollanan bir nesnenin ID'sini değiştirerek istismar edebilir. Bu genellikle izinsiz olarak hassas verilere erişime neden olur.

Bu sorun, API tabanlı uygulamalarda son derece yaygındır çünkü sunucu bileşeni genellikle istemci durumunu tam olarak takip etmez ve bunun yerine nesne kimlikleri gibi istemciden gönderilen parametlere daha çok güvendirilir.

API uç noktasının mantığına bağlı olarak, bir saldırgan sadece web uygulamalarını, API'leri ve kullanıcıları okumayabilir aynı zamanda değiştirebilir.

Bu zafiyet ayrıca IDOR (Güvenliksiz Doğrudan Nesne Referansı) olarak da bilinir.

[Zafiyet hakkında daha fazla detay](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md)

**Düzeltme:**

* Kullanıcı politikalarına ve hiyerarşisine dayanan doğru bir yetkilendirme mekanizması uygulayın.
* Nesnelerin kimliklerinin rastgele ve tahmin edilemez değerler olan [GUID'ları](https://en.wikipedia.org/wiki/Universally_unique_identifier) kullanmayı tercih edin.
* Yetkilendirme mekanizmasını değerlendirmek için testler yazın. Testleri bozan hassas değişiklikleri yayınlamayın.

**Wallarm davranışı:**

* Wallarm bu tür zafiyetleri otomatik olarak keşfeder.
* Wallarm, bu zafiyeti sömüren saldırıları varsayılan olarak algılamaz. BOLA saldırılarını tespit etmek ve engellemek için [**BOLA** tetiğini](admin-en/configuration-guides/protecting-against-bola.md) yapılandırın.

### Açık yönlendirme

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-601][cwe-601]

**Wallarm kodu:** `redir`

**Açıklama:**

Bir saldırgan, açık yönlendirme saldırısını kullanarak, bir kullanıcıyı meşru bir web uygulaması aracılığıyla kötü amaçlı bir web sayfasına yönlendirebilir.

Bu saldırıya karşı savunmasızlık, URL girişlerinin yetersiz filtrelenmesinden kaynaklanır.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.
*   Tüm bekleyen yönlendirmeler hakkında kullanıcılara bilgi verin ve açık izin isteyin.


### Sunucu-Tarafı İstek Sahteciliği (SSRF)

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-918][cwe-918]

**Wallarm kodu:** `ssrf`

**Açıklama:**

Başarılı bir SSRF saldırısı, bir saldırganın saldırılan web sunucusu adına istekler yapmasına izin verebilir; bu potansiyel olarak web uygulamasının kullanılan ağ portlarını ifşa etme, iç ağları taratma ve yetkilendirme aşılmasına yol açabilir.

Wallarm, SSRF saldırı girişimlerinde bulunmaktadır. SSRF zafiyetleri, tüm [desteklenen Wallarm sürümleri](updating-migrating/versioning-policy.md) tarafından algılanır.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.
*   [OWASP SSRF Önleme Hile Sayfası][link-owasp-ssrf-cheatsheet]ndaki önerileri uygulayın.

### Cross-Site Request Forgery (CSRF)

**Zafiyet**

**CWE kodu:** [CWE-352][cwe-352]

**Wallarm kodu:** `csrf`

**Açıklama:**

Cross-Site Request Forgery (CSRF) bir saldırıdır, bu saldırıyı gerçekleştirenler, kullanıcıların şu an yetkilendirildikleri bir web uygulamasında kullanıcının istenmeyen eylemler yapmasını sağlar. Biraz sosyal mühendislik yardımı (örneğin bir bağlantıyı e-posta veya sohbet üzerinden göndermek) ile, bir saldırgan, bir web uygulamasının kullanıcılarını saldırganın seçtiği eylemleri gerçekleştirmek zorunda bırakabilir.

İlgili zafiyet, çoğu sitede, hedef alan adı için ayarlanmış olan oturum çerezlerini bu çerezler, sitenin kimlik bilgileriyle ilgili çerezleri içerdiğinden bunlarla birlikte otomatik olarak bir web trafiği üzerinden kullanıcının tarayıcısını ekler. Bu nedenle, eğer kullanıcı şu anda siteye kimlik doğrulamışsa, site sahte saldırgan tarafından gönderilen isteği ve meşru kullanıcı tarafından gönderilen isteği ayırt edemez.

Sonuç olarak, saldırgan kimliği doğrulanmış gerçek bir kullanıcı gibi görünerek daha önce oluşturulmuş bir web sayfasından kötü amaçlı bir web sitesinden bir istek gönderebilir; saldırganın bu kullanıcının çerezlerine erişmesi bile gerekmez.

**Wallarm davranışı:**

Wallarm sadece CSRF zafiyetlerini keşfeder, ancak CSRF saldırılarını tespit etmez ve bu nedenle CSRF saldırılarını bloke etmez. CSRF problemi, içerik güvenlik politikaları (CSP) ile tüm modern tarayıcılarda çözülür.

**Düzeltme:**

CSRF, tarayıcılar tarafından çözülür, diğer koruma yöntemleri daha az kullanışlıdır ancak hala kullanılabilir.

Aşağıdaki önerileri takip edebilirsiniz:

*   Anti-CSRF koruma mekanizmaları kullanın, örneğin CSRF belirteçleri ve diğerleri.
*   `SameSite` çerez özelliğini ayarlayın.
*   [OWASP CSRF Önleme Hile Sayfası][link-owasp-csrf-cheatsheet]ndaki önerileri uygulayın.

### Zorla tarama

**Saldırı**

**CWE kodu:** [CWE-425][cwe-425]

**Wallarm kodu:** `dirbust`

**Açıklama:**

Bu saldırı, brute‑force saldırıları sınıfına aittir. Bu saldırının amacı, bir web uygulamasının gizli kaynaklarını, yani dizinleri ve dosyaları tespit etmektir. Bu, web uygulamasının parametrelerini değiştirerek farklı dosya ve dizin adlarını deneyerek elde edilir.

Başarılı bir zorlama tarama saldırısı, potansiyel olarak web uygulaması arayüzünden açıkça erişilebilir olmayan, ancak doğrudan erişildiğinde ifşa olan gizli kaynaklara erişim sağlar.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Kullanıcıların, doğrudan erişim olmaması gereken kaynaklara erişimini sınırlayın veya kısıtlayın (örneğin, bazı kimlik doğrulama veya yetkilendirme mekanizmaları kullanarak).
*   Bir web uygulamasına belirli bir zaman diliminde gönderilen istek sayısını sınırlayın.
*   Bir web uygulamasına belirli bir zaman dilimindeki kimlik doğrulama/yetkilendirme denemelerini sınırlayın.
*   Belirli bir sayıda başarısız denemeden sonra yeni kimlik doğrulama/yetkilendirme denemelerini engelleyin.
*   Web uygulamasının dosyaları ve dizinleri için gerekli ve yeterli erişim yetkilerini ayarlayın.

[Brute force saldırılarına karşı uygulamaları korumak için Wallarm çözümünü nasıl yapılandıracağınıza dair →](admin-en/configuration-guides/protecting-against-bruteforce.md)

### Bilgi maruz kalma

**Zafiyet/Saldırı**

**CWE kodları:** [CWE-200][cwe-200] (ayrıca bakınız: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])

**Wallarm kodu:** `infoleak`

**Açıklama:**

Uygulama, kasıtlı veya kasıtsız olarak, hassas bilgileri yetkili olmayan bir konuya açıklar.

Bu zafiyet türü sadece pasif tespit yöntemi ile tespit edilebilir. İsteğin yanıtı hassas bilgileri ifşa ederse, Wallarm bir olay kaydeder ve aktif bir zafiyet "Bilgi maruz kalma" türünde kaydeder. Wallarm tarafından algılanabilen bazı hassas bilgi türleri aşağıdaki gibidir:

* Sistem ve çevre durumu (örneğin: stack izi, uyarılar, fatal hatalar)
* Ağ durumu ve yapılandırması
* Uygulama kodu veya dahili durumu
* Meta veri (örneğin: bağlantıları veya mesaj başlıklarını günlüğe kaydetmek)

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Web uygulamanızın herhangi bir hassas bilgiyi görüntüleme yeteneğini reddetmek için bir öneride bulunabilirsiniz.

### Hassas Komponent

**Zafiyet**

**CWE kodları:** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Wallarm kodu:** `vuln_component`

**Açıklama:**

Bu zafiyet, web uygulamanızın veya API'nizin, hassas veya güncel olmayan bir bileşeni kullanması durumunda ortaya çıkar. Bu, bir işletim sistemi, web/uygulama sunucusu, veri tabanı yönetim sistemi (DBMS), çalışma zamanı ortamları, kütüphaneler ve diğer bileşenleri içerebilir.

Bu zafiyet, en ciddi API güvenlik risklerinin listesi olan [A06:2021 – Hassas ve Eski Bileşenler](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components) ile eşleştirilmiştir.

**Düzeltme:**

Uygulamanızın veya API'nin ömrü boyunca güncellemeleri veya yapılandırma değişikliklerini zamanında uygulamanızı öneririz:

* Kullanılmayan bağımlılıkları, gereksiz özellikleri, bileşenleri, dosyaları ve belgelemeyi kaldırın.
* OWASP Bağımlılık Kontrolü, retire.js vb. Araçları kullanarak hem istemci tarafı hem de sunucu tarafı bileşenlerinin (örneğin, çerçeveler, kütüphaneler) ve bağımlılıklarının sürümlerini sürekli olarak envanterinize alın.
* Bileşenlerdeki zafiyetler için ortak Zafiyet ve Maruz Kalma (CVE) ve Ulusal Zafiyet Veritabanı (NVD) gibi kaynakları sürekli olarak izleyin.
* Yalnızca resmi kaynaklardan güvenli bağlantılar üzerinden bileşenler elde edin. İmzalı paketleri, değiştirilmiş, kötü amaçlı bir bileşeni içeren bir paketi azaltmak için tercih edin.
* Bakım yapılmayan kütüphaneler ve bileşenler veya eski sürümler için güvenlik yamaları oluşturmayanlar için izleyin. Yamalama mümkün olmazsa, keşfedilen soruna karşı izlemek, algılamak veya korumak için bir sanal yama oluşturmayı düşünün.

### Uzaktan Kod Yürütme (RCE)

**Zafiyet/Saldırı**

**CWE kodları:** [CWE-78][cwe-78], [CWE-94][cwe-94] ve diğerleri

**Wallarm kodu:** `rce`

**Açıklama:**

Bir saldırgan, kötü amaçlı bir kodu bir isteğe bir web uygulamasına enjekte edebilir ve uygulama bu kodu yürütür. Ayrıca, saldırganın zafiyeti olan web uygulaması üzerinde çalıştığı belirli işletim sistemine belirli komutları çalıştırmayı deneyebilir.

Bir RCE saldırısı gerçekleştiğinde, saldırgan bir dizi eylem gerçekleştirebilir, aralarında:

*   Savunmasız web uygulamasının verilerinin gizliliğine, erişilebilirliğine ve bütünlüğüne büyük bir tehlike oluşturur.
*   İşletim sistemini ve web uygulamasının üzerinde çalıştığı sunucuyu kontrol edebilir.
*   Diğer mümkün durumları.

Bu zafiyet, kullanıcı girişinin yanlış doğrulanması ve ayrışması sonucu meydana gelir.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.


### Kimlik Doğrulama Geçişi

**Zafiyet**

**CWE kodu:** [CWE-288][cwe-288]

**Wallarm kodu:** `auth`

**Açıklama:**

Kimlik doğrulama mekanizmaları bulunmasına rağmen, bir web uygulaması alternatif kimlik doğrulama yöntemlerine sahip olabilir ve bunlar, ana kimlik doğrulama mekanizmasını aşmaya veya zayıflıklarından yararlanmaya izin verebilir. Bu faktörlerin birleşimi, bir saldırganın kullanıcı veya yönetici izinleri ile erişim sağlama potansiyeline yol açabilir.

Başarılı bir kimlik doğrulama aşılama saldırısı, kullanıcıların gizli verilerinin ifşa edilmesine veya yönetici izinleri ile savunmasız uygulamaya erişimin sağlanmasına potansiyel olarak yol açar.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Mevcut kimlik doğrulama mekanizmalarını iyileştirin ve güçlendirin.
*   Kimlik doğrulama işlemi gerektiren alternatif kimlik doğrulama yöntemlerini ortadan kaldırın.
*   [OWASP Kimlik Doğrulama Hile Sayfası][link-owasp-auth-cheatsheet]ndaki önerileri uygulayın.


### CRLF Enjeksiyonu

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-93][cwe-93]

**Wallarm kodu:** `crlf`

**Açıklama:**

CRLF enjeksiyonları, bir saldırganın bir sunucuya (örneğin HTTP isteği) isteklerine Dönüş Arabası (CR) ve Satır Besleme (LF) karakterlerini enjekte ederek bir saldırı serisini temsil eder.

Diğer faktörlerle bir araya getirilmiş olan bu tür bir CR/LF karakter enjeksiyonu, çeşitli zafiyetlerin (örneğin, HTTP Yanıt Bölme [CWE-113][cwe-113], HTTP Yanıt Kaçakçılığı [CWE-444][cwe-444]) sömürülmesine yardımcı olabilir.

Başarılı bir CRLF enjeksiyon saldırısı, bir saldırganın güvenlik duvarlarını aşmasına, önbellek zehirlemesini gerçekleştirmesine, meşru web sayfalarını kötü amaçlı olanlarla değiştirebilmesine, "Açık yönlendirme" saldırısını gerçekleştirebilmesine ve çok daha fazlasına olanak verebilir.

Bu zafiyet, kullanıcı girişinin yanlış doğrulanması ve ayrıştırılması sonucu meydana gelir.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.


### LDAP Enjeksiyonu

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-90][cwe-90]

**Wallarm kodu:** `ldapi`

**Açıklama:**

LDAP enjeksiyonları, bir saldırganın LDAP sunucusuna istekleri değiştiren kullanıcı girişini geçirerek LDAP arama filtrelerini değiştirmesini sağlar.

Başarılı bir LDAP enjeksiyon saldırısı, LDAP kullanıcıları ve ana bilgisayarları hakkında gizli verilere erişim sağlar.

Bu zafiyet, kullanıcı girişinin yanlış doğrulanması ve ayrışması sonucu meydana gelir.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.
*  [OWASP LDAP Enjeksiyonu Önleme Hile Sayfası][link-owasp-ldapi-cheatsheet]ndaki önerileri uygulayın.


### NoSQL Enjeksiyonu

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-943][cwe-943]

**Wallarm kodu:** `nosqli`

**Açıklama:**

NoSQL enjeksiyonuna olan zafiyet, kullanıcı girişi yetersiz filtrelendiğinde oluşur. Bir NoSQL enjeksiyon saldırısı, bir NoSQL veritabanına özel olarak hazırlanmış bir sorguyu enjekte ederek gerçekleştirilir.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.


### Yol Seyir

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-22][cwe-22]

**Wallarm kodu:** `ptrav`

**Açıklama:**

Bir yol seyir saldırısı, bir saldırganın, savunmasız web uygulamasında bulunan ve web uygulamasının parametreleri aracılığıyla değiştirilen mevcut yolları değiştirerek, gizli verileri içeren dosyalara ve dizinlere erişmesine olanak sağlar.

Bu saldırıya karşı savunmasızlık, bir kullanıcının bir dosya veya dizini web uygulaması aracılığıyla talep ettiğinde kullanıcı girişinin yetersiz filtrelenmesinden kaynaklanır.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.
*   Bu tür saldırıları hafifletmek için ilave öneriler [burada][link-ptrav-mitigation] mevcuttur.


### SQL Enjeksiyonu

**Zafiyet/Saldırı**

**CWE kodu:** [CWE-89][cwe-89]

**Wallarm kodu:** `sqli`

**Açıklama:**

SQL enjeksiyonuna karşı zafiyet, kullanıcı girişinin yetersiz filtrelenmesi durumunda meydana gelir. Bir SQL enjeksiyon saldırısı, bir SQL veritabanına özellikle oluşturulmuş bir sorguyu enjekte ederek gerçekleştirilir.

Bir SQL enjeksiyon saldırısı, bir saldırganın keyfi SQL kodunu bir [SQL sorgusu](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)'na enjekte etmesine izin verir. Bu potansiyel olarak saldırganın gizli verileri okuma ve değiştirme yeteneği ile DBMS yönetici haklarına erişim sağlar.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.
*   [OWASP SQL Enjeksiyonu Önleme Hile Sayfası][link-owasp-sqli-cheatsheet]'ndaki önerileri uygulayın.

### E-posta Enjeksiyonu

**Saldırı**

**CWE kodu:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarm kodu:** `mail_injection`

**Açıklama:** 

E-posta Enjeksiyonu kötü amaçlı bir [IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki] ifadesidir ve genellikle standart e-posta sunucusu davranışını değiştirmek için web uygulaması iletişim formu aracılığıyla gönderilir.

Bu saldırının zafiyeti, iletişim formunda girilen verilerin yetersiz doğrulanmasından kaynaklanır. E-posta Enjeksiyonu, e-posta istemci kısıtlamalarını aşmaya, kullanıcı verilerini çalmaya ve spam göndermeye olanak sağlar.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Temizleyin ve filtreleyin, böylece girişteki kötü amaçlı yüklerin hepsi yürütülmesin.
*   [OWASP Giriş Doğrulama Hile Sayfası][link-owasp-inputval-cheatsheet]'ndaki önerileri uygulayın.


### SSI Enjeksiyonu

**Saldırı**

**CWE kodu:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarm kodu:** `ssi`

**Açıklama:**

[SSI (Server Side Includes)][ssi-wiki] bir web sayfasında bir veya daha fazla dosyanın içeriğini içermek için en çok kullanılan basit yorumlanabilir sunucu tarafı betik dilidir. Apache ve NGINX gibi web sunucuları tarafından desteklenmektedir.

SSI Enjeksiyonu, bir web hizmet attağına olanak sağlar. Bir saldırgan bir SSI içeren ayrıştırıcıyı etkileyebilme ve diğer birçok durumu gerçekleştirebilme olanağı sağlar.   


**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.


### VBScript Enjeksiyonu

**Saldırı**

**CWE kodu:** yok

**Wallarm kodu:** `vbsi`

**Açıklama:**     

Nesne etiketi veya HTML form elemanı tarafından bildirilen bir ActiveX bileşenini belirtmek amacıyla bir VBScript metoud ayarına bir kod enjekte eder.

**Düzeltme:**

Aşağıdaki önerileri takip edebilirsiniz:

*   Tüm kullanıcı girişlerini temizleyin ve filtreleyin, böylece girişteki bir öğenin yürütülmesini önleyin.


##  Özel saldırı ve zafiyetler listesi

### Virtual yama

**Saldırı**

**Wallarm kodu:** `vpatch`

**Açıklama:**     

Bir istek, bir [sanal yama mekanizması][doc-vpatch] tarafından hafifletilen bir saldırının parçasıysa, bir `vpatch` olarak işaretlenir.


### Güvensiz XML başlığı

**Saldırı**

**Wallarm kodu:** `invalid_xml`

**Açıklama:**  

Bir istek, eğer bunun gövdesi bir XML belgesi içeriyorsa ve belgenin kodlaması, XML başlığında belirtilen kodlamadan farklıysa, bir `invalid_xml` olarak işaretlenir.

### Hesaplama kaynaklarının aşırı sınırlandırılması

**Saldırı**

**Wallarm kodu:** `overlimit_res`

**Açıklama:**

Wallarm düğümü, bir isteği `overlimit_res` saldırısı olarak işaretler:

*   Wallarm düğümü, gelen isteklerin işlenmesi için `N` milisaniyeden fazla harcamamalıdır (varsayılan değer: `1000`). Eğer istek belirtilen zaman dilimi içinde işlenmezse, isteğin işlenmesi durdurulur ve istek bir `overlimit_res` saldırısı olarak işaretlenir.

    Özel bir zaman sınırı belirtebilir ve varsayılan düğüm davranışını değiştirebilirsiniz, zaman sınırı aşıldığında [**overlimit_res saldırı tespitini iyileştirme kuralı**](user-guides/rules/configure-overlimit-res-detection.md) kullanılarak.

    İsteğin işlenme süresini sınırlama, Wallarm düğümlerine yönelik baypas saldırılarını önler. Bazı durumlarda, `overlimit_res` olarak işaretlenen istekler, uzun istek işleme süresine yol açan Wallarm düğüm modülleri için ayrılan kaynakların yetersiz olduğunu gösterebilir.
*   İstek mevcut zincir içerisinde 512 MB'dan daha fazla tartan bir gzip dosyasını yükler.

### DDoS (Dağıtılmış Hizmet Dışı Bırakma) saldırısı

Bir DDoS (Dağıtılmış Hizmet Dışı Bırakma) saldırısı, bir saldırganın bir web sitesini veya çevrimiçi hizmeti, çoklu kaynaklardan gelen trafiğe boğarak kullanılamaz hale getirmeyi amaçlayan bir saldırı türüdür.

Saldırganların bir DDoS saldırısı başlatmak için kullanabileceği birçok teknik vardır ve kullanacakları yöntemler ve araçlar önemli ölçüde değişebilir. Bazı saldırılar nispeten basittir ve geniş miktarda bağlantı isteği göndermek gibi düşük seviye teknikler kullanırken, diğerleri daha karmaşıktır ve IP adreslerini sahte kullanma veya ağ altyapısındaki zafiyetleri sömürme gibi karmaşık taktikler kullanır.

[DDoS saldırılarına karşı kaynakları koruma hakkında rehberimize göz atın →](admin-en/configuration-guides/protecting-against-ddos.md)
