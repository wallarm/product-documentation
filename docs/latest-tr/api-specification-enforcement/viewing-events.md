# API Specification Enforcement Nedeniyle Oluşan Olayların Görüntülenmesi <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API spesifikasyonunuzu, spesifikasyona dayalı güvenlik politikalarını uygulamak için kullanıma almak ve enforcement'ı yapılandırmak üzere [yüklediğiniz](setup.md) andan itibaren, politikalar gelen isteklere uygulanmaya başlanır. Bu makale, Wallarm Console’da politika ihlali gerçekleştiren isteklerin nasıl görüntüleneceğini ve analiz edileceğini açıklamaktadır.

## Politika İhlali Gerçeğe Dönen İstekler Hakkında İstatistikler

Politika ihlallerindeki eğilimleri takip etmek için, Wallarm Console’daki **API Specifications** → seçtiğiniz spesifikasyon → **Policy violations** sütunundaki spesifikasyon ihlallerinin sayısını kontrol edin. Bu veri, son 7 güne ait iç görüler sağlar.

Bu sayıya tıklayarak **Attacks** bölümündeki ayrıntıları görebilirsiniz.

## Politika İhlali Gerçeğe Dönen İsteklerin Analizi

Spesifikasyona dayalı politika ihlalleriyle ilgili olayları bulmak için, **Attacks** bölümünde [uygun arama anahtarlarını](../user-guides/search-and-filters/use-search.md#spec-violation-tags) veya ilgili filtreleri kullanın.

Yapılandırılmış politika ihlali eylemlerine bağlı olarak, engellenen ve izlenen olaylar görüntülenebilir. Olay ayrıntılarında, ihlal türü ve ihlale neden olan spesifikasyona bağlantı gösterilir.

![Specification - use for applying security policies](../images/api-specification-enforcement/api-specification-enforcement-events.png)

## Aşım (Overlimit) Olayları

Spesifikasyon politikalarınıza ilişkin olayları incelerken, API Specification Enforcement tarafından istekleri işlerken uygulanan limitlerle ilgili **Specification processing overlimit** türündeki olayı görebilirsiniz. Ayrıntılar ve olası eylemlerinizin tanımını [buradan](overview.md#how-it-works) inceleyin.

**Attacks** bölümünde, aşım olaylarını `processing_overlimit` arama anahtarı veya **Processing overlimit** filtresi ile bulabilirsiniz.