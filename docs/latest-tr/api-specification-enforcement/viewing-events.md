# API Spesifikasyonu Zorlaması Nedeniyle Oluşan Olayları Görüntüleme <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Spesifikasyon tabanlı güvenlik politikalarını uygulamak için API spesifikasyonunuzu [yüklediğiniz](setup.md) ve zorlamayı yapılandırdığınız anda, politikalar isteklere uygulanmaya başlar. Bu makale, Wallarm Console içinde politikaları ihlal eden istekleri nasıl görüntüleyip analiz edeceğinizi açıklar.

## Politikaları ihlal eden isteklere ilişkin istatistikler

Politika ihlali eğilimlerini izlemek için, Wallarm Console içinde **API Specifications** → your specification → **Policy violations** sütunundaki spesifikasyon ihlallerinin sayısını kontrol edin. Bu veriler son 7 güne ilişkin içgörü sağlar.

Bu sayıya tıklayarak ayrıntıları **Attacks** bölümünde görebilirsiniz.

## Politikaları ihlal eden isteklerin analizi 

Spesifikasyon tabanlı politika ihlalleriyle ilgili olayları bulmak için **Attacks** bölümünde [uygun arama anahtarlarını](../user-guides/search-and-filters/use-search.md#spec-violation-tags) veya ilgili filtreleri kullanın.

Yapılandırılmış politika ihlali eylemlerine bağlı olarak engellenen ve izlenen olaylar gösterilebilir. Olay ayrıntılarında ihlal türü ve buna neden olan spesifikasyona bağlantı görüntülenir.

![Spesifikasyon - güvenlik politikalarını uygulamak için kullanım](../images/api-specification-enforcement/api-specification-enforcement-events.png)

## Limit aşımı olayları

Spesifikasyon politikalarınızla ilgili olayları görüntülerken, istekler işlenirken API Spesifikasyonu Zorlaması için uygulanan limitlere ilişkin **Specification processing overlimit** türünde bir olaya rastlayabilirsiniz. Ayrıntılar ve olası eylemlerinizin açıklaması için [buraya](overview.md#how-it-works) bakın.

Limit aşımı olaylarını **Attacks** bölümünde `processing_overlimit` arama anahtarı veya **Processing overlimit** filtresiyle bulabilirsiniz.