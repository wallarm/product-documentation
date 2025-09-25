[link-aasm-security-issue-risk-level]:  #issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# Güvenlik Sorunlarını Tespit Etme <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

[API Attack Surface Discovery](api-surface.md), [seçili alan adlarınızın](setup.md) harici hostlarını bulduğunda, Wallarm bu hostlarda herhangi bir güvenlik sorunu olup olmadığını kontrol eder. Bulunduğunda, sorunlar **Security Issues** bölümünde listelenir ve açıklanır. Bu makale sunulan bilgilerin nasıl kullanılacağını açıklar.

## Güvenlik sorunlarını inceleme

Harici hostlarınız için bulunan güvenlik sorunlarını incelemek için, Wallarm Console içinde AASM'in **Security Issues** bölümüne gidin.

![Security Issues](../images/api-attack-surface/security-issues.png)

Burada, bulunan sorunlara ilişkin ayrıntılı bilgiler sunulur, bunlar şunları içerir:

* Her bir sorun için kısa ve [ayrıntılı açıklama](#issue-details-and-lifecycle) içeren, filtrelenebilir tam sorun listesi
* En savunmasız hostların listesi
* Türlere göre güvenlik sorunlarının dağılımı
* [Risk seviyesi](#issue-risk-level) değerlendirmesi ve sorunların bu seviyelere göre dağılımı
* Son 6 ay için tespit edilen ve çözülen sorunlara ilişkin aylık geçmiş bilgileri

## Tespit edilen sorunların listesi

Wallarm aşağıdaki güvenlik sorunlarını otomatik olarak tespit eder:

| Tür | Açıklama |
| ------- | ------- |
| Management interface | Uzak yönetim arayüzü veya yönetim paneli İnternet üzerinden herkese açık olarak erişilebilir, bu da sistemi potansiyel saldırılara maruz bırakır. Kötü niyetli kişiler, parola tahmin saldırıları, kimlik bilgisi doldurma veya hizmette bilinen güvenlik açıklarından yararlanarak yetkisiz erişim elde etmek için bunu kötüye kullanabilir. |
| Authentication bypass | Kimlik doğrulama atlatma zafiyeti, bir saldırganın kimlik doğrulama mekanizmasını atlayarak korunmakta olan kaynaklara yetkisiz erişim kazanmasına olanak tanır. Bu güvenlik açığı, hassas verilere yetkisiz erişime, ayrıcalık yükseltmeye veya sistemin tamamen ele geçirilmesine yol açabilir. |
| BOLA | Saldırganlar, istekle gönderilen bir nesnenin kimliğini manipüle ederek bozuk nesne düzeyi yetkilendirmeye (broken object-level authorization) karşı savunmasız API uç noktalarından yararlanabilir. Bu, hassas verilere yetkisiz erişime yol açabilir. [ayrıntılar](../attacks-vulns-list.md#broken-object-level-authorization-bola) |
| File read | Uygulamada, bir saldırganın sunucudaki dosyaları uygun yetkilendirme olmadan okumasına izin veren keyfi dosya okuma zafiyeti bulunmaktadır. Bu güvenlik açığı, yapılandırma dosyaları, kaynak kodu veya kullanıcı verileri dahil olmak üzere hassas bilgilere yetkisiz erişime yol açarak tüm sistemin güvenliğini tehlikeye atabilir. |
| File upload | Keyfi dosya yükleme zafiyeti, kötü niyetli bir kullanıcının amaçlanan kısıtlamaları atlayarak potansiyel olarak zararlı dosyaları bir sunucuya yüklemesine izin verir. Bu güvenlik açığı, web shell'ler aracılığıyla uzaktan komut yürütmeye, kritik sistem dosyalarının üzerine yazılmasına, kötü amaçlı yazılım dağıtımına veya hatta sunucunun tamamen ele geçirilmesine yol açabilir. |
| Information exposure | Bu zafiyet, bir uygulama tarafından hassas bilgilerin yetkisiz şekilde ifşa edilmesini içerir ve saldırganlara daha sonraki kötü amaçlı faaliyetler için hassas veriler sağlayabilir. [ayrıntılar](../attacks-vulns-list.md#information-exposure) |
| LFI | Yerel dosya dahil etme (LFI) zafiyeti, yetersiz girdi doğrulaması nedeniyle bir saldırganın bir uygulama içindeki dosya yollarını manipüle etmesine olanak tanır. Bu güvenlik açığı, hassas sistem dosyalarına yetkisiz erişime, kod yürütmeye ve genellikle daha ciddi sömürülerin basamağı olarak tüm sistemin ele geçirilmesine yol açabilir. |
| Misconfiguration | Güvenlik yanlış yapılandırmaları; etkin hata ayıklama modu, hata mesajlarında aşırı bilgi, TLS/SSL yanlış yapılandırması ve eksik veya yanlış ayarlanmış CORS ilkesi gibi hatalı yapılandırılmış sistemlerden kaynaklanan zafiyetleri içerir. |
| Missing authentication | Hassas uygulama veya API uç noktası, uygun kimlik doğrulama mekanizmaları olmadan erişilebilir durumdadır. Bu zafiyet, hassas verilere yetkisiz erişim ve manipülasyona yol açarak veri ihlallerine, hizmet kesintilerine veya tüm sistem bütünlüğünün tehlikeye girmesine neden olabilir. |
| RCE | Uzaktan kod yürütme (Remote code execution) - bu zafiyet, kullanıcı girdisinin hatalı doğrulanması ve ayrıştırılması nedeniyle ortaya çıkar. Bir saldırgan, bir API isteğine kötü amaçlı kod enjekte edebilir ve bu kod yürütülür. Ayrıca saldırgan, savunmasız uygulamanın çalıştığı işletim sistemi için belirli komutları yürütmeyi deneyebilir. [ayrıntılar](../attacks-vulns-list.md#remote-code-execution-rce) |
| Open redirect | Açık yönlendirme zafiyeti, kullanıcı kontrollü girdinin yönlendirme için harici bir siteye bağlantı belirtmesine izin verir. Saldırganlar bunu kullanıcıları kimlik avı saldırılarına veya diğer güvenlik risklerine yol açabilecek kötü amaçlı web sitelerine yönlendirmek için kullanabilir. |
| Sensitive API exposure | Uygun güvenlik önlemleri veya yanlış yapılandırma nedeniyle bir API uç noktası, dokümantasyonu veya işlevselliği istemeden ifşa edilir veya yetkisiz kullanıcılar tarafından erişilebilir hale gelir. Bu ifşa, daha hedefli saldırılara, hassas verilere yetkisiz erişime veya sistemin yapısı hakkında saldırganlara değerli bilgiler sağlayarak sistem zafiyetlerinin sömürülmesine yol açabilir. |
| SQLi | SQL enjeksiyonu - bu saldırıya karşı savunmasızlık, kullanıcı girdisinin yetersiz filtrelenmesi nedeniyle ortaya çıkar. SQL enjeksiyon saldırısı, SQL veritabanına özel hazırlanmış bir sorgu enjekte edilerek gerçekleştirilir. [ayrıntılar](../attacks-vulns-list.md#sql-injection) |
| SSRF | Sunucu taraflı istek sahteciliği (Server‑side request forgery) - başarılı bir SSRF saldırısı, saldırgana saldırıya uğrayan web sunucusu adına istekler yapma olanağı tanıyabilir; bu, kullanımda olan ağ portlarının ortaya çıkmasına, dahili ağların taranmasına ve yetkilendirmenin atlanmasına yol açabilir. [ayrıntılar](../attacks-vulns-list.md#serverside-request-forgery-ssrf) |
| Subdomain takeover | Bir alt alan adı, var olmayan kaynaklara işaret ettiğinden potansiyel el geçirmeye karşı savunmasızdır. Bu zafiyet, saldırganların bu alt alan adlarını talep edip kontrol etmelerine olanak tanır; bu da kimlik avı saldırılarına, veri hırsızlığına veya asıl alan adı sahibinin itibarına zarar verilmesine yol açabilir. |
| User enumeration | Bir zafiyet, sistem yanıtları aracılığıyla kullanıcı hesaplarının veya hassas verilerin yetkisiz numaralandırılmasına izin verir. Bu zayıflık, yetkisiz erişime, hedefli saldırılara veya daha ileri sistem sömürüleri için bir başlangıç noktası olarak kullanılabilir. |
| Vulnerable component | Bilinen zafiyetler içeren eski yazılım bileşenlerinin kullanılması, potansiyel saldırganların bilinen zafiyetlerden yararlanmasına izin verdiği için risk teşkil eder. Ayrıca bu durum, kuruluş içinde yetersiz yama yönetimi süreçlerine işaret eder. |
| XSS | Siteler arası betik çalıştırma (Cross‑site scripting) - siteler arası betik çalıştırma saldırısı, bir saldırganın bir kullanıcının tarayıcısında hazırlanmış keyfi bir kod yürütmesine izin verir. [ayrıntılar](../attacks-vulns-list.md#crosssite-scripting-xss) |
| XXE | XML harici varlık saldırısı - bu zafiyet, bir saldırganın bir XML belgesine harici bir varlık enjekte etmesine, bunun bir XML ayrıştırıcısı tarafından değerlendirilmesine ve ardından hedef web sunucusunda yürütülmesine izin verir. [ayrıntılar](../attacks-vulns-list.md#attack-on-xml-external-entity-xxe) |
| API leak | Sızdırılmış bir API anahtarı, saldırganların yetkili kullanıcıları taklit etmesine, gizli finansal verilere erişmesine ve hatta işlem akışlarını manipüle etmesine olanak tanıyabilir. [ayrıntılar](#api-leaks) |
| Vulnerable software | Zafiyetli yazılım sürümleri, sistemlere yetkisiz erişim, verilerin çalınması, kötü amaçlı yazılım bulaşması veya operasyonların kesintiye uğraması gibi önemli riskler taşır. Saldırganlar, eski yazılımlardaki bilinen zafiyetleri aktif olarak aradıkları için sömürü riski yüksektir. |

## Sorun ayrıntıları ve yaşam döngüsü

Wallarm, neler olup bittiğinin ve neler yapılabileceğinin net şekilde anlaşılmasını sağlamak için tespit edilen her güvenlik sorunu hakkında ayrıntılı bilgiler sunar. 

### Sorun ayrıntıları

Listeden soruna tıklayarak aşağıdakiler gibi ayrıntılarını açın:

* Temel bilgiler (tür, ana makine ve URL, ilk ve son görülme zamanı)
* Ayrıntılı **Description**
* **Mitigation** için önlemler
* **Additional information** olarak riske göre sıralanmış bağlı CVE'ler hakkında bilgiler

![Güvenlik sorunları ayrıntıları - Details](../images/api-attack-surface/security-issue-details.png)

### Sorunun yaşam döngüsü

Bir güvenlik sorunu tespit edildiğinde, onu azaltmak için bazı önlemler alınması gerektiği anlamına gelen **Open** durumunu alır. Sorun ayrıntılarında, sorunu kapatabilir (çözüldüğü anlamına gelir) veya false olarak işaretleyebilirsiniz.

Her durum değişikliğine yorum eklemek yararlıdır; bu, diğerlerine değişikliğin nedenine ilişkin tam bir görünüm sağlar. Değişikliğin yazarı ve zamanı otomatik olarak izlenir.

Güvenlik sorunları, aşağıdaki durumlarda bir sonraki [otomatik](setup.md#auto-rescan) veya [manuel](setup.md#manual-rescan) taramadan sonra Wallarm tarafından otomatik olarak kapatılabilir:

* Son taramada port bulunamadı
* Ağ hizmeti değişti
* Ürünün yeni sürümü tespit edildi
* Zafiyetli sürüm artık mevcut değil
* Son taramada zafiyet tespit edilmedi

Sorunlar bir sonraki taramadan sonra otomatik olarak veya manuel olarak yeniden açılabilir. false olarak işaretlenmiş sorunların hiçbir zaman otomatik olarak yeniden açılmadığını unutmayın.

![Güvenlik sorunları - yaşam döngüsü diyagramı](../images/api-attack-surface/security-issue-lifecycle.png)

### Risk seviyesini değiştirme

Sorunun [risk seviyesini](#issue-risk-level) yeniden değerlendirirseniz, ayrıntılarına gidin ve listeden yeni risk seviyesini seçin.

### Yorum ekleme

Durum değişikliklerine (kapama, yeniden açma) yorum eklemek her zaman yararlı olsa da, başka hiçbir şeyi değiştirmeden istediğiniz anda soruna yorum ekleyebilirsiniz. Bunu yapmak için **Add comment** düğmesini kullanın: yorumunuz **Status history**'nin bir parçası olur.

### Durum geçmişi

Takipte olmanız için, değişikliklerin ve yorumların tam geçmişi güvenlik sorununun **Status history** bölümünde görüntülenir.

![Güvenlik sorunları - yaşam döngüsü diyagramı](../images/api-attack-surface/aasm-sec-issue-history.png)

## Sorun risk seviyesi

Keşfedilen her güvenlik sorunu, tabloda açıklandığı şekilde yarattığı risk düzeyine göre otomatik olarak değerlendirilir.

| Risk | Açıklama | Örnekler |
| ----- | ----- | ----- |
|  **Critical** | Zafiyetin varlığı, bir saldırganın uzaktan kod yürütmesine veya hizmet reddi (DoS) ya da hizmet kalitesi düşüşüne neden olarak sistemin ele geçirilmesine yol açabilir. Derhal müdahale gereklidir. | <ul><li>Uzaktan kod yürütme</li><li>İhlal göstergesi (ör. herkese açık erişilebilir web shell)</li></ul> |
|  **High** | Zafiyetin varlığı, veritabanı erişimi veya dosya sistemine sınırlı erişim gibi kısmi sistem ele geçirilmesine yol açabilir. Belirli koşullarda (ör. özel gereksinimler karşılanırsa veya diğer zafiyetlerle zincirlendiğinde) zafiyet sistemin ele geçirilmesine (ör. uzaktan kod yürütme) yol açabilir. | <ul><li>Yol dolaşımı (Path traversal)</li><li>XML harici varlık (XXE) enjeksiyonu</li><li>Kritik ve yüksek riskli CVE'ler içeren zafiyetli yazılım sürümü<sup>*</sup></li></ul> |
|  **Medium** | Zafiyet, güvenlik kontrollerinin atlanmasına, sınırlı ifşa veya erişime neden olabilir ancak tam ele geçirmeye yol açmaz. Hassas verilere veya yapılandırmalara erişim sağlayabilir ve daha karmaşık bir saldırı zincirinde kaldıraç olarak kullanılabilir. | <ul><li>Siteler arası betik çalıştırma (XSS)</li><li>GraphQL yanlış yapılandırmaları</li><li>Yapılandırma dosyalarının ifşası</li><li>Uzun ömürlü kimlik bilgilerine ilişkin API sızıntısı (parolalar, API anahtarları)</li><li>Yüksek riskli CVE'ler içeren zafiyetli yazılım sürümü<sup>*</sup></li></ul> |
|  **Low** | Zafiyetin etkisi en az düzeydedir ve gereksinimler/koşullar çok karmaşık olduğundan doğrudan önemli hasara veya sömürüye yol açmaz. Ancak diğer zafiyetlerle birleştirilerek bir saldırının tırmandırılmasında kullanılabilir. | <ul><li>TLS/SSL yanlış yapılandırmaları</li><li>Kısa ömürlü kimlik doğrulama belirteçlerine ilişkin API sızıntısı (ör. JWT belirteçleri)</li></ul> |
|  **Info** | Sorun, acil bir güvenlik riski oluşturmaz ancak potansiyel manuel doğrulama için yine de gözden geçirilmelidir. Genellikle kritik olmayan verilerin ifşasını veya en iyi uygulamaların ihlalini içerir. | <ul><li>OpenAPI şemasının ifşası</li><li>E-posta adresleri veya kullanıcı adları gibi kişisel olarak tanımlanabilir bilgilerin (PII) sızması</li><li></li></ul> |

<small><sup>*</sup> Yazılım sürümü, kritik olanlar da dahil olmak üzere birden fazla CVE içeriyorsa, genel risk seviyesi yüksek olarak değerlendirilir. Zafiyetli bir sürümün varlığı, zafiyetin fiilen mevcut olduğunu açıkça göstermediğinden risk seviyesi bir kademe düşürülür. Örneğin, zafiyet yalnızca belirli, varsayılan olmayan bir yapılandırmada ortaya çıkabilir veya belirli koşulların sağlanmasını gerektirebilir.</small>

Risk seviyesini istediğiniz anda yeniden değerlendirebilir ve manuel olarak ayarlayabilirsiniz.

## Güvenlik sorunu raporları

**Download report** düğmesini kullanarak, tüm veya filtrelenmiş güvenlik sorunları için CSV veya JSON formatında rapor alabilirsiniz.

![Güvenlik sorunları ayrıntıları - Lifecycle controls](../images/api-attack-surface/security-issues-report.png)

Seçtiğiniz güvenlik sorunları bilgileri ayrıca API saldırı yüzeyinizle ilgili [ayrıntılı DOCX rapora](api-surface.md#api-attack-surface-reports) da dahil edilir.

## Bildirimler

--8<-- "../include/api-attack-surface/aasm-notifications.md"

## API sızıntıları

Diğer güvenlik sorunları türleri arasında, Wallarm API kimlik bilgilerinin (API leaks) kamuya açık şekilde ifşa edilmesi durumlarını da tespit eder. Sızdırılmış API anahtarları, saldırganların yetkili kullanıcıları taklit etmesine, gizli finansal verilere erişmesine ve hatta işlem akışlarını manipüle etmesine olanak tanır.

Wallarm, API sızıntısı güvenlik sorunlarını aşağıdaki iki aşamalı yöntemle arar:

1. **Pasif tarama**: bu alan adlarıyla ilgili yayımlanmış (sızdırılmış) veriler için kamuya açık kaynakları kontrol eder.
1. **Aktif tarama**: listelenen alan adlarında alt alan adlarını otomatik olarak arar. Ardından - kimliği doğrulanmamış bir kullanıcı olarak - uç noktalarına istekler gönderir ve yanıtlarda ve sayfaların kaynak kodunda hassas verilerin varlığını kontrol eder. Şu veriler aranır: kimlik bilgileri, API anahtarları, istemci sırları, yetkilendirme belirteçleri, e-posta adresleri, genel ve özel API şemaları (API spesifikasyonları).

Bulunan sızıntılarla ne yapılacağına ilişkin kararları yönetebilirsiniz:

* Dağıtılmış Wallarm [node(s)](../user-guides/nodes/nodes.md) varsa, sızdırılmış API kimlik bilgilerinin kullanılmasına yönelik tüm girişimleri engellemek için bir virtual patch uygulayın.

    Bir [sanal yama kuralı](../user-guides/rules/vpatch-rule.md) oluşturulacaktır.
    
    Bir virtual patch oluşturmanın yalnızca sızdırılmış gizli değerin 6 veya daha fazla karakter olması ya da düzenli ifadenin 4096 karakteri geçmemesi durumunda mümkün olduğunu unutmayın - bu koşullar karşılanmazsa `Not applicable` iyileştirme durumu görüntülenecektir. Bu sınırlamalar, yasal trafiğin engellenmesini önlemeyi amaçlar.

* Hatalı eklendiğini düşünüyorsanız sızıntıyı false olarak işaretleyin.
* Sorunun çözüldüğünü belirtmek için sızıntıları kapatın.
* Bir sızıntı kapatılsa bile silinmez. Sorunun hala geçerli olduğunu belirtmek için yeniden açın.

**Sanal yamalar tarafından engellenen isteklerin görüntülenmesi**

[Virtual patch](../user-guides/rules/vpatch-rule.md) ile engellenen istekleri, Wallarm Console → **Attacks** içinde **Type** filtresini `Virtual patch` (`vpatch`) olarak ayarlayarak görüntüleyebilirsiniz.

![Olaylar - Security Issues (API leaks) vpatch aracılığıyla](../images/api-attack-surface/api-leaks-in-events.png)

Bu filtrenin, **Security Issues** işlevselliğinin neden olduğu virtual patch olaylarının yanı sıra farklı amaçlarla oluşturulmuş diğer tüm virtual patch'leri de listeleyeceğini unutmayın.