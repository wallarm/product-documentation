# Tehdit Önleme Gösterge Paneli

Wallarm, işlenen trafiğe ilişkin metrikleri otomatik olarak toplar ve bunları Wallarm Konsolu'nun **Gösterge Panelleri → Tehdit Önleme** bölümünde sunar. Gösterge tablosu, herhangi bir kullanıcının kötü amaçlı ve meşru trafik eğilimlerini analiz etmesine ve belirli bir zaman aralığı için uygulama açıklığı durumunu elde etmesine olanak sağlar.

Metrikler şu widgetlerde sunulmaktadır:

* Güncel ay istatistikleri ve talep karşılaşma hızı
* Normal ve kötü amaçlı trafik
* Saldırı türleri
* API protokolleri
* Saldırı kaynakları
* Saldırı hedefleri
* Zafiyet Tarayıcısı

Widget verilerini [uygulamalar](../settings/applications.md) ve zaman dilimine göre filtreleyebilirsiniz. Varsayılan olarak, widgetler son ay boyunca tüm uygulamalara ilişkin istatistikleri sunar.

Herhangi bir widget, istatistiklerin toplandığı [olay listesini](../events/check-attack.md) açmaya olanak sağlar.

!!! bilgi "Getting started with Wallarm"
    Eğer Wallarm hesabı ABD [Cloud](../../about-wallarm/overview.md#cloud) 'da kaydettiyseniz, Wallarm Konsolu bölümüne salt okunur erişimle **Oyun Alanı**'nda çekirdek Wallarm özelliklerini keşfedebilirsiniz. Hizmetinizde hiçbir bileşen dağıtmadan Wallarm platformunun önemli özelliklerini denemek için kullanın.
    
    Gösterge tablosu bölümü ayrıca yeni kullanıcılar için **Başlayın** düğmesini içerir. Düğmeye tıkladığınızda, bunlardan bazıları aşağıdaki ürün keşif seçeneklerinin listesini alırsınız:
    
    * **Tanıtım turu** seçeneği, Wallarm tarafından desteklenen dağıtım seçeneklerini ve ilgili dağıtım talimatlarına bağlantıları tedarik edecektir.
    * **Wallarm Oyun Alanı** seçeneği, salt okunur erişimle onun bölümlerine Wallarm Konsolu oyun alanına sizleri yönlendirecektir. Bu seçenek yalnızca ABD Bulutu kullanıcıları için kullanılabilir.

## Güncel ay istatistikleri ve talep karşılaşma hızı

Bu gadget aşağıdaki verileri gösterir:

* [Abonelik planında](../../about-wallarm/subscription-plans.md) belirtilen aylık talep kotası
* Güncel ay boyunca tespit edilen [vuruşlar](../../about-wallarm/protecting-against-attacks.md#hit) ve [engellenen](../../admin-en/configure-wallarm-mode.md)lerin sayısı
* Taleplerin ve vuruşların gerçek zamanlı olarak karşılaştığı hız

![Current month statistics](../../images/user-guides/dashboard/current-month-stats.png)

## Bir dönem için normal ve kötü amaçlı trafik

Bu widget, seçilen dönem boyunca işlenen trafiğe ilişkin özet istatistiklerini gösterir:

* Grafiği, en aktif aktivite dönemlerini takip etmenizi sağlayan zamanla veri dağılımını temsil eder.
* İşlenen taleplerin, [vuruşların](../../glossary-en.md#hit), ve [olayların](../../glossary-en.md#security-incident) toplam sayısı ve engellenen vuruşların sayısı
* Eğilimler: seçili bir dönem ve aynı önceki dönem için olay sayısındaki değişiklik

![Normal and malicious traffic](../../images/user-guides/dashboard/traffic-stats.png)

## Saldırı türleri

Bu widget, kötü amaçlı trafik modellerini ve saldırgan davranışını analiz etmeyi sağlayan [tespit edilen saldırı türlerinin en yaygınlarını](../../attacks-vulns-list.md) gösterir.

Bu veriyi kullanarak, hizmetlerinizin farklı saldırı türlerine olan açıklığını analiz edebilir ve hizmet güvenliğini artırmak için uygun önlemleri alabilirsiniz.

![Attack types](../../images/user-guides/dashboard/attack-types.png)

## API protokolleri

Bu gadget, saldırganlar tarafından kullanılan API protokolleri üzerindeki istatistikleri gösterir. Wallarm aşağıdaki API protokollerini tanımlayabilir:

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* JSON-RPC
* WebDAV

Bu widgeti kullanarak, belirli protokoller aracılığıyla gönderilen kötü amaçlı talepleri ve sisteminizin bu tür taleplere karşı açıklığını değerlendirebilirsiniz.

![Attack types](../../images/user-guides/dashboard/api-protocols.png)

## CVE'ler

**CVE'ler** gadgeti, seçilen zaman diliminde saldırganların sömürdüğü CVE açıklıklarının en yaygın listesini gösterir. Sıralama türünü değiştirerek, en son CVE'lerin farkında olabilir, en çok saldırıya uğrayan CVE'leri takip edebilirsiniz.

Her CVE, [Zafiyet veritabanı](https://vulners.com/)ndan alınan CVSS v3.0 puanı, saldırı karmaşıklığı, gereken ayrıcalıklar ve diğerler gibi ayrıntılarla birlikte verilir. 2015'ten önce kaydedilen zafiyetler için CVSS v3.0 puanı sağlanmamaktadır.

![CVE](../../images/user-guides/dashboard/cves.png)

Sisteminizi vurgulanan zafiyetler için inceleyebilir ve bulunan zafiyetler varsa uygulanması uygun olan düzeltme önerilerini uygulayarak, zafiyet sömürme riskini ortadan kaldırabilirsiniz.

## Kimlik Doğrulama

Bu gadget, belirlenen zaman aralığında saldırganların kullandığı kimlik doğrulama yöntemlerini gösterir, örneğin:

* API Anahtarı
* Temel Auth
* Taşıyıcı Token
* Çerez Auth, vb.

![Auth](../../images/user-guides/dashboard/authentication.png)

Bu bilgi, zayıf kimlik doğrulama yöntemlerini belirlemenize ve ardından koruma önlemleri almaya olanak sağlar.

## Saldırı kaynakları

Bu gadget, saldırı kaynağı gruplarına ilişkin istatistikleri gösterir:

* Konumlar
* Türler, örneğin Tor, Proxy, VPN, AWS, GCP, vb.

Bu veri, kötü amaçlı saldırı kaynaklarını tanımlama ve gri veya reddetmeye [IP adreslerinin listeleri](../ip-lists/overview.md)ni kullanarak bunlardan kaynaklanan talepleri engelleme olanağı sağlayabilir.

Her kaynak grubu hakkındaki verileri ayrı sekmelerde görebilirsiniz.

![Attack sources](../../images/user-guides/dashboard/attack-sources.png)

## Saldırı hedefleri

Bu gadget, en çok saldırıya uğrayan domainleri ve [uygulamaları](../settings/applications.md) gösterir. Her nesne için aşağıdaki metrikler gösterilir:

* Tespit edilen olayların sayısı
* Tespit edilen vuruşların sayısı
* Eğilimler: seçilen bir dönem ve aynı önceki dönem için vuruş sayısındaki değişiklik. Örneğin: eğer son ayın istatistiklerini kontrol ederseniz, eğilim, son ve önceki aylar arasındaki vuruş sayısındaki farkı yüzde olarak gösterir

Domainler ve uygulamalar hakkındaki verileri ayrı sekmelerde görebilirsiniz.

![Attack targets](../../images/user-guides/dashboard/attack-targets.png)

## Zafiyet Tarayıcısı

Tarayıcı gadgeti, [genel aktiflerde](../scanner.md) tespit edilen zafiyetler hakkındaki istatistikleri gösterir:

* Seçilen dönem boyunca tespit edilen tüm risk seviyelerindeki zafiyetlerin sayısı
* Seçilen dönemin sonunda tüm risk seviyelerindeki aktif zafiyetlerin sayısı
* Seçilen dönem için tüm risk seviyelerindeki zafiyetlerin sayısındaki değişiklikler

![Scanner widget](../../images/user-guides/dashboard/dashboard-scanner.png)