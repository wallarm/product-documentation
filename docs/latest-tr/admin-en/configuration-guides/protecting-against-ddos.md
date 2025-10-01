# DDoS koruması

DDoS (Distributed Denial of Service) saldırısı, bir saldırganın bir web sitesini veya çevrimiçi hizmeti birden çok kaynaktan gelen trafikle aşırı yükleyerek kullanılamaz hale getirmeye çalıştığı bir siber saldırı türüdür. Bu belge, DDoS korumasına yönelik önerileri ve kaynaklarınızı Wallarm ile koruma yöntemlerini açıklar.

DDoS saldırıları genellikle ele geçirilmiş bilgisayar sistemlerinden oluşan, botnet olarak da adlandırılan bir ağ üzerinden başlatılır. Saldırganlar, hedefe büyük miktarda trafik göndermek için bu sistemleri kullanarak sunucuyu aşırı yükler ve meşru taleplere yanıt veremez hale getirir. DDoS saldırıları web siteleri, çevrimiçi oyunlar ve hatta sosyal medya platformları dahil olmak üzere her tür çevrimiçi hizmeti hedef alabilir.

Saldırganların DDoS saldırısı başlatmak için kullanabileceği birçok teknik vardır ve kullandıkları yöntem ve araçlar önemli ölçüde değişkenlik gösterebilir. Bazı saldırılar nispeten basittir ve bir sunucuya çok sayıda bağlantı isteği göndermek gibi düşük seviyeli teknikler kullanırken, diğerleri daha sofistike olup IP adresi sahteciliği (spoofing) veya ağ altyapısındaki güvenlik açıklarını istismar etmek gibi karmaşık taktikler kullanır.

## DDoS saldırı taksonomisi

Saldırganların bir web sitesinin veya çevrimiçi hizmetin kullanılabilirliğini bozmak için kullanabileceği birkaç DDoS saldırı türü vardır. İşte yaygın DDoS saldırı türleri:

| OSI katmanı / Saldırı Türü | [Hacimsel ve amplifikasyon saldırıları](#volum-amplif-attacks) | [Protokol istismarları ve Mantık bombaları](#proto-attacks-logicbombs) |
| ---- | ----------- | -------- |
| L3/L4 | <ul><li>UDP flood: Bu saldırılar, kullanılabilir bant genişliğini tüketmek ve hizmeti aksatmak amacıyla hedefe çok sayıda UDP paketi gönderir.</li><li>ICMP flood (Smurf saldırıları): Bu saldırılar, bant genişliğini tüketmek ve hizmeti aksatmak amacıyla hedefe çok sayıda yankı isteği paketi (genellikle "ping" istekleri olarak bilinir) göndermek için ICMP kullanır.</li></ul> | <ul><li>SYN flood: Bu saldırılar, TCP bağlantılarının kurulma biçiminden yararlanır. Saldırgan hedefe çok sayıda SYN paketi gönderir, ancak bağlantı kurmak için kullanılan üç yönlü el sıkışma sürecini asla tamamlamaz. Bu durum, hedef sunucu kaynaklarını el sıkışmanın tamamlanmasını beklerken meşgul ederek tüketebilir.</li><li>Ping of Death: Bu saldırılar, hedefi çökertmek amacıyla aşırı büyük boyutlu paketler gönderir. Paketler, hedefin işleyebileceği maksimum boyuttan daha büyüktür ve bunları işleme girişimi hedefin çökmesine veya kullanılamaz hale gelmesine neden olabilir.</li></ul> |
| L7 | <ul><li>HTTP flood: Bu saldırılar, bir sunucuya veya web uygulamasına çok sayıda meşru görünümlü GET veya POST isteği göndererek hedefi bunaltır. Bu tür bir saldırı genellikle, saldırgan tarafından kontrol edilen, kötü amaçlı yazılımla enfekte edilmiş ele geçirilmiş bilgisayarlardan oluşan botnetler kullanılarak gerçekleştirilir.</li><li>Amplifikasyon saldırıları: Bu saldırılar, hedefe gönderilen trafik hacmini büyütmek için amplifikasyon tekniklerinden yararlanır. Örneğin, bir saldırgan, çok daha büyük bir yanıtla cevap veren bir sunucuya küçük bir istek gönderebilir; bu da hedefe gönderilen trafik hacmini etkili bir şekilde artırır. Saldırganların amplifikasyon saldırısı başlatmak için kullanabileceği çeşitli teknikler vardır, örneğin: NTP amplifikasyonu, DNS amplifikasyonu vb.</li></ul> | <ul><li>Slowloris: Slowloris saldırıları, minimum bant genişliği gerektirmeleri ve yalnızca tek bir bilgisayar kullanılarak gerçekleştirilebilmeleri bakımından benzersizdir. Saldırı, bir web sunucusuna birden çok eşzamanlı bağlantı başlatıp bunları uzun süre açık tutarak çalışır. Saldırgan, tamamlanma aşamasına ulaşmalarını engellemek için kısmi istekler gönderir ve bunları zaman zaman HTTP üstbilgileriyle tamamlar.</li></ul> |
| API/Uygulamaya özgü (L7+) | <ul><li>Ağır İstek (Heavy Request): Bu saldırılar, sunucunun yanıt olarak büyük miktarda veri göndermesine yol açan özel hazırlanmış istekler kullanır. Bu tür saldırılar, genellikle hedefli saldırılarda kullanılır; çünkü uygulamanızın ve API’nizin ön incelemesini gerektirir ve güvenlik açıklarının istismarına dayanır.</li></ul> | <ul><li>Mantık Bombası (Logic Bomb): Bu saldırılar, istek işleme sırasında güvenlik açıklarından yararlanmak üzere tasarlanmış ve büyük miktarda veri içeren özel hazırlanmış istekler kullanır; bu da hedef sistemlerde yüksek kaynak tüketimine yol açar. Farklı mantık bombası türleri vardır: XML Bomb, JSON Bomb, vb.</li></ul> |

<a name="volum-amplif-attacks"></a>**Hacimsel ve amplifikasyon saldırıları**, hedefi büyük hacimli trafikle bunaltmayı amaçlar. Amaç, hedef sunucunun veya ağın bant genişliğini veya bilgi işlem kaynaklarını doyurarak meşru isteklere yanıt veremez hale getirmektir.

<a name="proto-attacks-logicbombs"></a>**Protokol istismarları ve Mantık bombaları**, bir hizmetin veya ağın iletişim kurma biçimindeki güvenlik açıklarından yararlanmayı amaçlayan DDoS saldırılarıdır. Bu saldırılar, belirli protokolleri istismar ederek veya hedefin işlemesi zor hatalı biçimlendirilmiş paketler göndererek normal trafik akışını bozabilir.

## DDoS saldırılarının azaltılması

DDoS saldırıları birçok farklı biçimde olabilir ve farklı OSI katmanlarını hedef alabilir; tekil önlemler etkili değildir, bu nedenle DDoS saldırılarına karşı kapsamlı koruma sağlamak için önlemlerin bir kombinasyonunu kullanmak önemlidir.

* İnternet Servis Sağlayıcıları ve Bulut Servis Sağlayıcıları genellikle L3-L4 DDoS saldırılarına karşı ilk savunma hattını sağlar. Yüksek şiddetli L3-L4 DDoS saldırıları için ise ek azaltma araçları gereklidir; örneğin:

    1 Gbps veya daha yüksek hızda trafik üreten bir DDoS saldırısı, trafik temizleme (traffic scrubbing) için uzmanlaşmış DDoS koruma hizmetleri gerektirebilir. Trafik temizleme, trafiği kötü amaçlı trafiği filtreleyen ve yalnızca meşru istekleri hizmetinize ileten üçüncü taraf bir hizmet üzerinden yönlendirme tekniğidir. L3-L4 DDoS saldırılarına karşı ek bir koruma önlemi olarak NGFW gibi çözümler de kullanılabilir.
* L7 DDoS saldırıları, "uygulama katmanı" saldırıları olarak da bilinir, L3-L4 saldırılarına göre daha hedefli ve sofistike olur. Genellikle, L7 DDoS saldırıları saldırıya uğrayan uygulamaların özelliklerini hedef alır ve meşru trafikten ayırt edilmesi zor olabilir. L7 DDoS saldırılarına karşı koruma için, uygulama katmanındaki trafiği analiz eden WAAP veya özel Anti-DDoS çözümleri kullanın. Ayrıca, API Gateway veya Web sunucusunu, tepe yükleri karşılayabilecek şekilde yapılandırmanız önerilir.

Koruma önlemlerini seçerken, aşağıdaki faktörlere göre bir kuruluşun ihtiyaç ve kaynaklarını dikkatlice değerlendirin:

* Saldırı türleri
* Saldırıların hacmi
* Bir web uygulamasının veya API’nin karmaşıklığı ve maliyetler

DDoS saldırısını mümkün olan en kısa sürede tespit etmek ve onları azaltmak için zamanında karşı önlemler almak amacıyla bir müdahale planı hazırlamak da gereklidir.

## Wallarm ile L7 DDoS koruması

Wallarm, L7 DDoS tehditlerine karşı geniş bir koruma önlemi yelpazesi sunar:

* [API Abuse Prevention](../../api-abuse-prevention/overview.md). Çeşitli türlerde kötü niyetli botları tespit edip durdurmak için API Abuse Prevention işlevselliğini etkinleştirin.
* [Brute force trigger](protecting-against-bruteforce.md), bazı parametre değerlerini (ör. parolalar) kaba kuvvetle denemeye yönelik çok sayıda isteği engellemek için.
* [Forced browsing trigger](protecting-against-bruteforce.md), bir web uygulamasının gizli kaynaklarını, yani dizin ve dosyaları tespit etmeye yönelik kötü amaçlı girişimleri engellemek için.
* [denylists and graylists](../../user-guides/ip-lists/overview.md) kullanarak coğrafi konuma göre filtreleme. Saldırıların dağıtıldığı belirli bölgelere uygulamalara ve API’lere erişimi engelleyin.
* [denylists and graylists](../../user-guides/ip-lists/overview.md) kullanarak güvenilmez kaynakları engelleyin. Hedefli saldırılara karşı korunmak için, saldırganın konumunu gizlemesine ve coğrafi filtreleri atlatmasına olanak tanıyan güvenilmez kaynakları (Tor, Proxy, VPN) engellemek yararlı olabilir.
* [Mantık (Veri) bombası](#proto-attacks-logicbombs) tespiti. Wallarm, Zip veya XML bombası içeren kötü amaçlı istekleri otomatik olarak algılar ve engeller.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) yapılandırması. Belirli bir API kapsamına yapılabilecek maksimum bağlantı sayısını belirtin. Bir istek tanımlı sınırı aşarsa, Wallarm isteği reddeder.

NGINX tabanlı Wallarm düğümü kullanıyorsanız, L7 DDoS genelinde güvenliğinizi artırmak için NGINX’i aşağıdaki şekilde yapılandırmanız önerilir:

* Önbellekleme. DDoS saldırıları sırasında oluşturulan trafiğin bir kısmını absorbe etmek ve web uygulamanıza veya API’nize ulaşmasını engellemek için yaygın isteklere verilen yanıtların önbelleğe alınmasını yapılandırın.
* Oran sınırlama (Rate limiting). Hedef web uygulamasına veya API’ye gönderilebilecek trafik hacmini kısıtlamak için gelen isteklere yönelik oran sınırlama kuralları oluşturun.
* Bağlantı sayısını sınırlama. Tek bir istemci IP adresi tarafından açılabilecek bağlantı sayısını gerçek kullanıcılar için uygun bir değere ayarlayarak kaynakların aşırı kullanımını önleyebilirsiniz.
* Yavaş bağlantıları kapatma. Bir bağlantı yeterince sık veri yazmıyorsa, uzun süre açık kalmasını ve sunucunun yeni bağlantıları kabul etme yeteneğini engellemesini önlemek için kapatılabilir.

[NGINX yapılandırma örneklerini ve diğer önerileri görün](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)

Kong API Gateway kullanıyorsanız, ayrıca [API Gateway’i güvenli hale getirmek için en iyi uygulamaları](https://konghq.com/learning-center/api-gateway/secure-api-gateway) izlemeniz önerilir.