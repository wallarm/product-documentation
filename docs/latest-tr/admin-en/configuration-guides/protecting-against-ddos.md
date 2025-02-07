# DDoS Koruması

DDoS (Dağıtılmış Hizmet Reddi) saldırısı, saldırganın bir web sitesi veya çevrimiçi hizmeti, birden fazla kaynaktan gelen trafikle aşırı yükleyerek kullanılamaz hale getirmeyi hedeflediği bir siber saldırı türüdür. Bu belge, Wallarm ile kaynaklarınızı korumanız için DDoS koruması önerilerini ve yöntemlerini açıklamaktadır.

DDoS saldırıları genellikle botnet olarak adlandırılan, ele geçirilmiş bilgisayar sistemleri ağlarından başlatılır. Saldırganlar, hedefe büyük miktarda trafik göndererek sunucuyu aşırı yükler ve bunun gerçek taleplere yanıt vermesini engeller. DDoS saldırıları; web siteleri, çevrimiçi oyunlar ve hatta sosyal medya platformları gibi herhangi bir çevrimiçi hizmeti hedef alabilir.

Saldırganların DDoS saldırısı başlatmak için kullanabileceği birçok teknik bulunmaktadır ve kullandıkları yöntemler ile araçlar önemli ölçüde farklılık gösterebilir. Bazı saldırılar nispeten basit olup, sunucuya çok sayıda bağlantı isteği gönderme gibi düşük seviyeli teknikler kullanırken, bazıları IP adreslerini taklit etme veya ağ altyapısındaki güvenlik açıklarından yararlanma gibi daha karmaşık taktikler kullanır.

## DDoS Saldırı Sınıflandırması

| OSI Katmanı / Saldırı Türü | [Hacimsel ve amplifikasyon saldırıları](#volum-amplif-attacks) | [Protokol sömürüleri ve Mantık bombaları](#proto-attacks-logicbombs) |
| ---- | ----------- | -------- |
| L3/L4 | <ul><li>UDP flood: Bu saldırılar, mevcut bant genişliğini tüketmek ve hizmeti aksatmak amacıyla hedefe çok sayıda UDP paketi gönderir.</li><li>ICMP flood (Smurf saldırıları): Bu saldırılar, bant genişliğini tüketmek ve hizmeti aksatmak amacıyla hedefe büyük sayıda eko istek paketi (genellikle "ping" istekleri olarak bilinir) gönderir.</li></ul> | <ul><li>SYN flood: Bu saldırılar, TCP bağlantılarının kurulma şeklini sömürür. Saldırgan, hedefe çok sayıda SYN paketi gönderir ancak bağlantı kurulumu için gerekli üç aşamalı el sıkışma sürecini tamamlamaz. Bu durum, hedef sunucunun kaynaklarının el sıkışmanın tamamlanmasını beklerken tüketilmesine neden olabilir.</li><li>Ping of Death: Bu saldırılar, hedefe, işleyebileceğinden daha büyük boyutlu paketler göndererek çökmesine yol açmayı amaçlar. Bu paketler, hedefin işleyebileceği maksimum boyuttan daha büyüktür ve işlenmeye çalışıldığında hedefin çökmesine veya kullanılamaz hale gelmesine neden olabilir.</li></ul> |
| L7 | <ul><li>HTTP flood: Bu saldırılar, hedefi aşırı yüklemek amacıyla sunucuya veya web uygulamasına çok sayıda görünüşte meşru GET veya POST isteği gönderir. Bu tür saldırılar genellikle, kötü amaçlı yazılımla enfekte edilmiş ele geçirilmiş bilgisayar sistemlerinin oluşturduğu botnetler kullanılarak gerçekleştirilir.</li><li>Amplifikasyon saldırıları: Bu saldırılar, hedefe gönderilen trafik hacmini artırmak amacıyla amplifikasyon tekniklerinden yararlanır. Örneğin, saldırgan küçük bir istek gönderip, sunucunun çok daha büyük bir yanıt döndürmesiyle etkin olarak hedefe gönderilen trafik hacmini artırabilir. Saldırganların amplifikasyon saldırısı başlatmak için kullanabileceği birkaç farklı teknik bulunmaktadır: NTP amplifikasyonu, DNS amplifikasyonu, vb.</li></ul> | <ul><li>Slowloris: Slowloris saldırıları, minimal bant genişliği gerektirdiği ve yalnızca tek bir bilgisayar kullanılarak gerçekleştirilebildiği için benzersizdir. Saldırı, bir web sunucusuna aynı anda birden fazla bağlantı başlatarak ve bu bağlantıları uzun süre açık tutarak gerçekleştirilir. Saldırgan, bağlantıların tamamlanmasını engellemek amacıyla ara ara HTTP başlıkları ekleyerek kısmi istekler gönderir.</li></ul>
| API/Uygulama özel (L7+) | <ul><li>Heavy Request: Bu saldırılar, sunucunun yanıt olarak çok miktarda veri göndermesine sebep olacak şekilde özel olarak hazırlanmış istekler kullanır. Bu tür saldırılar, web uygulamanızın ön analizini gerektirdiğinden ve güvenlik açıklarının sömürülmesine dayalı olduğundan, genellikle hedefe yönelik saldırılarda kullanılır.</li></ul> | <ul><li>Logic Bomb: Bu saldırılar, hedef sistemlerde büyük kaynak tüketimine yol açan, istek işleme sırasında güvenlik açıklarını sömürmek amacıyla özel olarak hazırlanmış, büyük miktarda veri içeren istekler kullanır. Farklı mantık bombası türleri mevcuttur: XML Bomb, JSON Bomb, vb.</li></ul> |

<a name="volum-amplif-attacks"></a>**Hacimsel ve amplifikasyon saldırıları**; hedefin bant genişliği veya hesaplama kaynaklarını doygunluğa çıkartarak, meşru istekleri yanıt veremez hale getirmeyi amaçlar.

<a name="proto-attacks-logicbombs"></a>**Protokol sömürüleri ve Mantık bombaları** ise, bir hizmetin veya ağın iletişim şeklindeki güvenlik açıklarını sömüren DDoS saldırılarıdır. Bu saldırılar, belirli protokollerin sömürülmesi veya hedefin işleyemeyeceği şekilde bozuk paketlerin gönderilmesi yoluyla normal trafik akışını aksatabilir.

## DDoS Saldırılarının Hafifletilmesi

DDoS saldırıları farklı biçimlerde ortaya çıktığından ve farklı OSI katmanlarını hedef aldığından, tek bir önlemin yeterli olmadığı durumlarda, DDoS saldırılarına karşı kapsamlı bir koruma sağlamak için birden fazla önlemin kombinasyonunu kullanmak önemlidir.

* İnternet Servis Sağlayıcıları ve Cloud Service Providers (bulut servis sağlayıcıları) genellikle L3-L4 DDoS saldırılarına karşı ilk savunma hattını sağlar. Yüksek şiddette L3-L4 DDoS saldırıları için ek hafifletme araçları gereklidir, örneğin:

    1 Gbps veya daha yüksek hızda trafik üreten DDoS saldırıları, trafiğin temizlenmesini sağlayan özel DDoS koruma hizmetleri gerektirebilir. Trafik temizleme, kötü amaçlı trafiği filtreleyen üçüncü taraf bir hizmet üzerinden trafiğin yönlendirilmesi tekniğidir ve bu sayede servisinize yalnızca meşru istekler iletilir. L3-L4 DDoS saldırılarına karşı ek bir koruma önlemi olarak NGFW gibi çözümleri de kullanabilirsiniz.
* L7 DDoS saldırıları, aynı zamanda “uygulama katmanı” saldırıları olarak da bilinir, L3-L4 saldırılarından daha hedefe yönelik ve sofistike saldırılardır. Genellikle, L7 DDoS saldırıları, uygulamalara özgü özelliklere yönelik olup, meşru trafik ile ayırt edilmesi zor olabilir. L7 DDoS saldırılarına karşı koruma sağlamak için WAAP veya uygulama katmanında trafiği analiz eden özel Anti-DDoS çözümlerini kullanın. Ayrıca, API Gateway veya WEB sunucusunun pik yükleri kaldırabilecek şekilde yapılandırılması tavsiye edilir.

Koruma önlemlerini seçerken, aşağıdaki faktörler doğrultusunda bir organizasyonun ihtiyaçları ve kaynakları dikkatlice değerlendirilmelidir:

* Saldırı türü
* Saldırı hacmi
* Bir web uygulamasının veya API'nın karmaşıklığı ve maliyetleri

Ayrıca, DDoS saldırısını en kısa sürede tespit edip zamanında karşı önlemler alabilmek için bir müdahale planının hazırlanması gerekmektedir.

## Wallarm ile L7 DDoS Koruması

Wallarm, L7 DDoS tehditlerine karşı geniş bir yelpazede koruma önlemleri sunar:

* [API Abuse Prevention](../../api-abuse-prevention/overview.md). Çeşitli kötü amaçlı botları tespit etmek ve durdurmak için API Abuse Prevention özelliğini etkinleştirin.
* [Brute force trigger](protecting-against-bruteforce.md) belirli parametre değerlerinin, örneğin şifrelerin kaba kuvvetle denenmesini engellemek için massive sayıda isteği durdurur.
* [Forced browsing trigger](protecting-against-bruteforce.md) bir web uygulamasının gizli kaynaklarını, yani dizinleri ve dosyaları tespit etmeye yönelik kötü niyetli girişimleri önler.
* [denylists and graylists](../../user-guides/ip-lists/overview.md) kullanılarak coğrafi konum filtreleme. Saldırı yayan belirli bölgelerden uygulamalara ve API'lara erişimi engeller.
* [denylists and graylists](../../user-guides/ip-lists/overview.md) ile güvenilmeyen kaynakları engelleyin. Hedefe yönelik saldırılara karşı, saldırganın konumunu gizlemesine ve coğrafi filtreleri aşmasına olanak tanıyan güvenilmez (Tor, Proxy, VPN) kaynakları engellemek yararlı olabilir.
* [Logic (Data) bomb](#proto-attacks-logicbombs) tespiti. Wallarm, Zip veya XML bomb içeren kötü amaçlı istekleri otomatik olarak tespit eder ve engeller.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) yapılandırması. Belirli bir API kapsamına yapılabilecek maksimum bağlantı sayısını belirleyin. Bir istek tanımlı sınırı aştığında, Wallarm bu isteği reddeder.

NGINX tabanlı Wallarm node kullanıyorsanız, L7 DDoS saldırılarına karşı güvenliğinizi artırmak için NGINX'i aşağıdaki şekilde yapılandırmanız önerilir:

* Caching. DDoS saldırıları sırasında üretilen trafiğin bir kısmını karşılamak ve bu trafiğin web uygulamanıza veya API'nıza ulaşmasını önlemek için yaygın isteklere verilen yanıtları önbelleğe alın.
* Rate limiting. Hedef web uygulaması veya API'ya gönderilebilecek trafik hacmini sınırlamak için gelen istekler üzerinde rate limiting kuralları oluşturun.
* Bağlantı sayısını sınırlama. Gerçek kullanıcılara uygun bir değere tek bir istemci IP adresi tarafından açılabilecek bağlantı sayısına sınır koyarak kaynak aşımını engelleyebilirsiniz.
* Yavaş bağlantıları kapatma. Bir bağlantı yeterince sık veri göndermiyorsa, uzun süre açık kalmasını ve sunucunun yeni bağlantıları kabul etme yeteneğini engellemesini önlemek için kapatılabilir.

[NGINX yapılandırması örnekleri ve diğer önerilere bakın](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/)

Wallarm servisleri ile [Kong-based Ingress controller](../../installation/kubernetes/kong-ingress-controller/deployment.md) kullanıyorsanız, [API Gateway'i güvence altına almak için en iyi uygulamaları](https://konghq.com/learning-center/api-gateway/secure-api-gateway) takip etmeniz önerilir.