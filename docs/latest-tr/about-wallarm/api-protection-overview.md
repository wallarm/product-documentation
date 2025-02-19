# Wallarm API Protection <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın API Protection özelliği, API'larınızı temel [cloud-native WAAP](../about-wallarm/waap-overview.md) korumasını geliştiren ileri düzey yetenekler setidir. Temel korumanın; tüm API protokollerine destek, saldırı tespiti, L7 DDoS gibi ek koruma özellikleri sunmasının yanı sıra, modern uygulamalar ve API'lar daha fazla riske maruz kalır ve gelişmiş koruma önlemleri gerektirir. API Protection paketi bu ihtiyaçlar için gerekli araçları sağlar.

API Protection şunları içerir:

* [API Specification Enforcement](#api-specification-enforcement), yüklediğiniz spesifikasyonlara dayanarak API'larınıza güvenlik politikaları uygulamak üzere tasarlanmıştır. Spesifikasyonunuzdaki uç nokta açıklamaları ile REST API'larınıza yapılan gerçek istekler arasındaki uyumsuzlukları tespit eder ve bu farklılıklar belirlenirse önceden tanımlanmış işlemler gerçekleştirir.
* [Automatic BOLA Protection](#automatic-bola-protection), OWASP API Top 10'da birincil tehdit olarak işaretlenen BOLA saldırılarına karşı otomatik koruma sağlar. Wallarm, savunmasız uç noktaları otomatik olarak tespit eder ve bunları numaralandırmaya yönelik saldırılara karşı korur.
* [API Abuse Prevention](#api-abuse-prevention), uygulamalarınızı ve API'larınızı credential stuffing, sahte hesap oluşturma, içerik kazıma gibi çeşitli otomatik tehditlere karşı korur. Davranış analizine dayalı olarak, Wallarm Scrappers, Security Crawlers vb. kötü niyetli botları kolayca tespit edip engelleyebilir.
* [Credential Stuffing Detection](#credential-stuffing-detection), Hesap Ele Geçirme saldırılarına karşı ek bir koruma katmanı sağlar. Wallarm, tehlikeye girmiş kimlik bilgilerini tek bile olsa tanımlamanıza olanak tanır; bu da düşük ve yavaş Credential Stuffing saldırılarını tespit etmek açısından önemlidir.
* [GraphQL API Protection](#graphql-api-protection), toplu istek, iç içe sorgular, introspection vb. protokole özgü işlemleri istismar eden saldırılara karşı GraphQL API'larınızı korur. Bu, Resource Exhaustion, Denial of Service (DoS), Excessive Information Exposure ve diğer saldırıların önlenmesine yardımcı olur.

<!--Diagram for API Protection bundle of Wallarm products, being prepared by Iskandar-->

Temel Cloud Native WAAP abonelik planı kapsamında WAAP mevcutken, API Protection paketindeki araçlar [Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) aboneliğine dahildir.

## API Specification Enforcement

**API Specification Enforcement**, yüklediğiniz spesifikasyonlara dayanarak API'larınıza güvenlik politikaları uygulamak üzere tasarlanmıştır. Ana işlevi, spesifikasyonunuzdaki uç nokta açıklamaları ile REST API'larınıza yapılan gerçek istekler arasındaki tutarsızlıkları tespit etmektir. Bu uyumsuzluklar saptandığında, sistem bunları gidermek için önceden tanımlı işlemler gerçekleştirir.

![Specification - use for applying security policies](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

[Detaylı açıklama ve yapılandırmaya geç →](../api-specification-enforcement/overview.md)

## Automatic BOLA Protection

Wallarm'ın API Discovery modülünü kullanarak, broken object level authorization (BOLA) tehdidine açık uç noktaları keşfedin ve bu zaafiyeti istismar etmeye yönelik saldırılara karşı otomatik koruma sağlayın.

![BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

Otomatik BOLA koruması, [manuel olarak oluşturulmuş](../admin-en/configuration-guides/protecting-against-bola-trigger.md) BOLA koruma kurallarına mükemmel bir ek veya alternatif oluşturur. Wallarm'ın davranışını kuruluşunuzun güvenlik profiliyle uyumlu hale getirmek için otomatik BOLA korumasını yapılandırabilirsiniz.

[Detaylı açıklama ve yapılandırmaya geç →](../admin-en/configuration-guides/protecting-against-bola.md)

## API Abuse Prevention

**API Abuse Prevention**, credential stuffing, sahte hesap oluşturma, içerik kazıma ve API'larınıza yönelik diğer kötü niyetli eylemler gibi API kötüye kullanımlarını tespit eder ve etkisiz hale getirir.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

**API Abuse Prevention**, ML tabanlı yöntemlerin yanı sıra istatistiksel ve matematiksel anomali arama yöntemlerini ve doğrudan kötüye kullanım vakalarını içeren karmaşık bir bot tespit modeli kullanır. Modül, normal trafik profilini kendiliğinden öğrenir ve belirgin şekilde farklı davranışları anomali olarak tanımlar.

[Detaylı açıklama ve yapılandırmaya geç →](../api-abuse-prevention/overview.md)

## Credential Stuffing Detection

Wallarm'ın **Credential Stuffing Detection** özelliği, uygulamalarınıza erişimde kullanılan tehlikeye girmiş veya zayıf kimlik bilgilerini kullanma girişimlerini gerçek zamanlı olarak toplar ve görüntüler; ayrıca bu tür girişimler hakkında anında bildirim gönderir. Ayrıca, uygulamalarınıza erişim sağlayan tehlikeye girmiş veya zayıf kimlik bilgilerini içeren indirilebilir bir liste oluşturur.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

Tehlikeye girmiş ve zayıf şifreleri tespit etmek için, Wallarm, kamuya açık [HIBP](https://haveibeenpwned.com/) tehlikeye girmiş kimlik bilgileri veritabanından toplanan **850 milyondan fazla kayıt** içeren kapsamlı bir veritabanı kullanır.

[Detaylı açıklama ve yapılandırmaya geç →](credential-stuffing.md)

## GraphQL API Protection

Wallarm, temel [WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) abonelik planı kapsamında bile GraphQL'deki geleneksel saldırıları (SQLi, RCE, [vb.](../attacks-vulns-list.md)) varsayılan olarak tespit eder. Ancak, protokolün bazı özellikleri, aşırı bilgi ifşası ve DoS ile ilgili [GraphQL'e özgü](../attacks-vulns-list.md#graphql-attacks) saldırıların uygulanmasına imkan tanır.

Wallarm, API'larınızı bu saldırılardan korumak için GraphQL isteklerine yönelik belirli sınırlamalar getiren **GraphQL policy**'yi ayarlar.

![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

[Detaylı açıklama ve yapılandırmaya geç →](../api-protection/graphql-rule.md)