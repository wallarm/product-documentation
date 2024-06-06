# DDoS Koruması

DDoS (Dağıtılmış Hizmet Engelleme) saldırısı, bir saldırganın bir web sitesini veya çevrimiçi hizmeti birçok kaynaktan gelen trafikle boğarak kullanılamaz hale getirmeye çalıştığı bir tür siber saldırıdır. Bu belge, DDoS koruması için tavsiyeleri ve kaynaklarınızı Wallarm ile nasıl koruyabileceğinizi anlatır.

DDoS saldırıları genellikle, bir botnet olarak adlandırılan, ele geçirilmiş bilgisayar sistemlerinin ağından başlatılır. Saldırganlar, bu sistemleri hedefe büyük miktarda trafik göndermek için kullanır, sunucuyu aşırı yükler ve meşru isteklere yanıt vermesini engeller. DDoS saldırıları, web siteleri, çevrimiçi oyunlar ve hatta sosyal medya platformları dahil olmak üzere her türlü çevrimiçi hizmete yönelik olabilir.

Saldırganların bir DDoS saldırısını başlatmak için kullanabileceği birçok teknik vardır ve kullandıkları yöntemler ve araçlar önemli ölçüde değişebilir. Bazı saldırılar, bir sunucuya büyük miktarda bağlantı isteği göndermek gibi düşük seviye teknikler kullanan oldukça basittir, diğerleri ise IP adreslerini taklit etmek veya ağ altyapısındaki açıklıkları istismar etmek gibi karmaşık taktikler kullanır.

## DDoS saldırı taksonomisi

Saldırganların bir web sitesinin veya çevrimiçi hizmetin kullanılabilirliğini bozmak için kullanabileceği birkaç tür DDoS saldırısı vardır. İşte DDoS saldırılarının yaygın türleri:

| OSI katmanı / Saldırı Türü | [Hacim artırma ve genişletme saldırıları](#volum-amplif-attacks) | [Protokol istismarları ve Mantık bombaları](#proto-attacks-logicbombs) |
| ---- | ----------- | -------- |
| L3/L4 | <ul><li>UDP taşkını: Bu saldırılar, mevcut bant genişliğini tüketmeye ve hizmeti bozmaya çalışan bir hedefe büyük miktarda UDP paketi gönderir.</li><li>ICMP taşkını (Smurf saldırıları): Bu saldırılar, bant genişliğini tüketmeye ve hizmeti bozmaya çalışan bir hedefe büyük miktarda yankı talep paketi (genellikle "ping" talepleri olarak bilinir) göndermek için ICMP kullanır.</li></ul> | <ul><li>SYN taşkını: Bu saldırılar, TCP bağlantılarının kurulma şeklini istismar eder. Saldırgan, hedefe büyük miktarda SYN paketi gönderir, ancak bir bağlantı kurmak için kullanılan üç aşamalı tokalaşma sürecini asla tamamlamaz. Bu, hedef sunucunun kaynaklarını bağlayabilir, çünkü tokalaşma sürecinin tamamlanmasını bekler.</li><li>Ölüm Ping'i: Bu saldırılar, hedefi çökertmeye çalışan aşırı büyük paketleri bir hedefe gönderir. Paketler, hedefin işleyebileceği maksimum boyuttan daha büyüktür ve bunları ele almaya çalışma hedefin çökmesine veya kullanılamaz hale gelmesine neden olabilir.</li></ul> |
| L7 | <ul><li>HTTP taşkını: Bu saldırılar, bir hedefi boğmak için bir sunucuya veya web uygulamasına görünüşte meşru çok sayıda GET veya POST isteği kullanır. Bu tür saldırılar genellikle botnetler kullanılarak yapılır; botnetler, saldırgan tarafından kontrol edilen zararlı yazılımlarla enfekte olmuş kompromize bilgisayar ağlarıdır.</li><li>Amplifikasyon saldırıları: Bu saldırılar, bir hedefe gönderilen trafik miktarını artırmak için genişletme tekniklerinin kullanılmasını kullanır. Örneğin, bir saldırgan, çok daha büyük bir yanıtla yanıt veren bir sunucuya küçük bir istek gönderebilir, etkili bir şekilde hedefe gönderilen trafik miktarını genişletir. Saldırganlar bir genişletme saldırısı başlatmak için birçok farklı teknik kullanabilir, bunlar arasında NTP amplifikasyonu, DNS amplifikasyonu vb. bulunur.</li></ul> | <ul><li>Slowloris: Slowloris saldırıları, minimum bant genişliğini gerektirir ve sadece bir bilgisayar kullanılarak gerçekleştirilebilir. Saldırı, bir web sunucusuna birçok eşzamanlı bağlantı başlatarak ve bunları uzun bir süre boyunca sürdürerek çalışır. Saldırgan, kısmi istekler gönderir ve bunları bir tamamlama aşamasına ulaşmalarını engellemek için ara sıra HTTP başlıklarıyla tamamlar.</li></ul> |
| API/Uygulama özel (L7+) | <ul><li>Ağır İstek: Bu saldırılar, sunucunun yanıt olarak büyük miktarda veri göndermesine neden olan özel olarak oluşturulan istekleri kullanır. Bu tür bir saldırı genellikle hedefli saldırılarda kullanılır çünkü web uygulamanızın ön çalışmasını gerektirir ve bu açıklıklarını istismar etmeye dayanır.</li></ul> | <ul><li>Mantık Bombası: Bu saldırılar, büyük miktarda veri içeren ve istek işleme sırasında büyük kaynak tüketimine yol açan açıklıkları istismar etmek üzere tasarlanmış özel olarak oluşturulan istekleri kullanır. Farklı mantık bomba türleri vardır: XML Bombası, JSON Bombası, vb.</li></ul> |

<a name="volum-amplif-attacks"></a>**Hacim artırma ve genişletme saldırıları** hedefi büyük miktarda trafikle boğmayı hedefler. Amaç, hedeflenen sunucunun veya ağın bant genişliğini veya hesaplama kaynaklarını doyurmak, böylece meşru isteklere yanıt verme yeteneğini engellemektir.

<a name="proto-attacks-logicbombs"></a>**Protokol istismarları ve Mantık bombaları**, bir hizmetin veya ağın iletişim kurma şeklindeki açıklıkları istismar etmeyi hedefleyen DDoS saldırılarıdır. Bu saldırılar, belirli protokollerin istismarını kullanarak veya hedefin işlemekte zorlandığı bozuk paketler göndererek normal trafik akışını bozabilir.

## DDoS saldırılarından korunma

DDoS saldırıları birçok farklı formda olabilir ve farklı OSI katmanlarını hedefleyebilir, tek ölçüler etkili olmaz, DDoS saldırılarına karşı kapsamlı koruma sağlamak için bir dizi önlem kullanmak önemlidir.

* İnternet Servis Sağlayıcıları ve Bulut Servis Sağlayıcıları genellikle L3-L4 DDoS saldırı savunmasının ilk hattını sağlar. Yüksek şiddetteki L3-L4 DDoS saldırıları için ek koruma araçları gereklidir, örneğin:

    Saniyede 1 Gbps veya daha fazla trafik üreten DDoS saldırısı, trafik filtrelemenin (traffic scrubbing) gerçekleştirilmesi için özelleştirilmiş DDoS koruma hizmetlerini gerektirebilir. Traffic scrubbing, trafiği tüm kötü niyetli trafiği filtreleyen üçüncü taraf bir hizmete yönlendirecek bir tekniktir ve yalnızca meşru istekleri hizmetinize aktarır. L3-L4 DDoS saldırılarına karşı ek bir koruma önlemi olarak, NGFW gibi çözümleri de kullanabilirsiniz.
* L7 DDoS saldırıları, aynı zamanda "uygulama katmanı" saldırıları olarak da bilinir, L3-L4 saldırılardan daha hedefe yönelik ve karmaşıktır. Genellikle, L7 DDoS saldırıları saldırıya uğrayan uygulamaların özelliklerine yöneliktir ve meşru trafikten ayırt etmek zor olabilir. L7 DDoS saldırılarına karşı korunmak için, uygulama katmanındaki trafiği analiz eden WAF/WAAP veya özelleştirilmiş Anti-DDoS çözümlerini kullanın. Ayrıca API Gateway veya WEB sunucunun en yüksek yükleri yönetebilmesini ayarlamak da önerilir.

Koruma önlemlerini seçerken, aşağıdaki faktörlere dayanarak bir organizasyonun ihtiyaçlarını ve kaynaklarını dikkatlice değerlendirin:

* Saldırı türleri
* Saldırıların boyutu
* Bir web uygulaması veya API'nin karmaşıklığı ve maliyeti

Ayrıca, bir DDoS saldırısını mümkün olduğunca hızlı bir şekilde belirlemek ve zamanında önlemler almak için bir yanıt planı hazırlamanız gereklidir.

## Wallarm ile L7 DDoS Koruması

Wallarm, L7 DDoS tehditlerine karşı çeşitli koruma önlemleri sunar:

* [API İstismarı Önleme](../../api-abuse-prevention/overview.md). Çeşitli türdeki kötü niyetli botları tanımlayıp durdurmaya yardımcı olmak için API İstismarı Önleme işlevini etkinleştirin.
* [Kaba kuvvet tetikleyicisi](protecting-against-bruteforce.md) bazı parametre değerlerini, örneğin şifreleri zorla çözmeye çalışan büyük miktarda isteği önlemek için.
* [Zorla gezinme tetiği](protecting-against-bruteforce.md) bir web uygulamasının gizli kaynaklarını, yani dizinleri ve dosyaları tespit etmeye çalışan kötü niyetli girişimleri önlemek için.
* Saldırıları dağıtan belirli bölgeler için uygulamalara ve API'lere erişimi önlemek amacıyla [yasaklı listeler ve gri listeler](../../user-guides/ip-lists/overview.md) kullanarak coğrafi konum filtrelemesi.
* Hedefli saldırılardan korunmak için, saldırganın yerini saklamasına ve jeofiltreleri atlatmasına olanak sağlayan güvenilmez kökenlerin (Tor, Proxy, VPN) [yasaklı listeler ve gri listeler](../../user-guides/ip-lists/overview.md) kullanılarak engellenmesi yardımcı olabilir.
* [Mantık (Veri) bombası](#data-bomb) algılama. Wallarm, Zip veya XML bomba içeren zararlı istekleri otomatik olarak algılar ve engeller.
* [Hız limiti](../../user-guides/rules/rate-limiting.md) yapılandırması. Belirli bir API kapsamına yapılabilecek maksimum bağlantı sayısını belirtin. Bir istek belirlenen limiti aşarsa, Wallarm onu reddeder.

NGINX tabanlı Wallarm düğümünü kullanıyorsanız, L7 DDoS hakkında güvenliğinizi güçlendirmek için NGINX'i yapılandırmanız önerilir:

* Önbellekleme. DDoS saldırıları altında oluşturulan bazı trafiklerin emilmesi ve web uygulamanıza veya API'nize ulaşmasını engellemek için yaygın isteklere yanıtları önbelleğe almayı yapılandırın.
* Hız limiti. Gelen istekler için hız sınırlama kuralları oluşturun ve hedef web uygulamanıza veya API'nıza gönderilebilecek trafik miktarını sınırlayın.
* Bağlantı sayısını sınırlama. Bir tek müşteri IP adresi tarafından açılan bağlantı sayısına bir sınır koymak suretiyle kaynakların aşırı kullanılmasını önleyebilirsiniz.
* Yavaş bağlantıları kapatma. Bir bağlantı yeterli sıklıkta veri yazmazsa, bu bağlantı, uzun bir süre için açık kalmasını ve potansiyel olarak sunucunun yeni bağlantıları kabul etme yeteneğini engellemesini önlemek amacıyla kapatılabilir.

[NGINX yapılandırma örneklerini ve diğer önerileri görün](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)

Eğer [Wallarm hizmetleri ile Kong tabanlı Ingress denetleyicisi](../../installation/kubernetes/kong-ingress-controller/deployment.md) kullanıyorsanız, [API Gateway'yi güvenli hale getirmek için en iyi uygulamaları](https://konghq.com/learning-center/api-gateway/secure-api-gateway) izlemeniz önerilir.