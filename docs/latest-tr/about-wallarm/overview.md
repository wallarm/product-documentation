# Wallarm Platform Genel Bakış

Bugünün dijital dünyasında, uygulamalar, özellikle API'ler, giderek artan tehditlerle karşı karşıya. Geleneksel güvenlik, API zafiyetlerini gözden kaçırabilir veya dağıtım sorunlarına neden olabilir. Wallarm ile, bulut yerel ve kurum içi ortamlar için uygun olan, Web Uygulama ve API Koruması için tek bir platform elde edersiniz.

Kuruluşlar, geliştirilmiş uygulama ve API güvenliği, kolay dağıtım ve sağladığı değeri nedeniyle Wallarm'i tercih eder. Wallarm, en iyi API keşfi, risk yönetimi, koruma ve test yeteneklerini, bulut yerel WAAP ve API güvenlik özellikleriyle birleştirir.

![Diagram](../images/about-wallarm-waf/overview/wallarm-features.png)

## Keşfet

Korumak için bilmeniz gerekir. Wallarm, ortamınızdaki API'leri tanımlamak ve bunların güvenlik risklerini değerlendirmek için kapsamlı API keşif yetenekleri sunar. İşte Wallarm'in API keşfinin yaptığı işler:

* [API uç noktalarınızı ve parametrelerini algılar](../api-discovery/overview.md) ve sürekli trafik analizi ile API görünümünü güncel tutar.
* [Gölge, yetimsiz ve zombi API'ler de dahil olmak üzere sahte uç noktaları tanımlar](../api-discovery/rogue-api.md).
* Kişisel veri (PII) gibi hassas bilgilerin açığa çıkabileceği uç noktaları tespit eder.
* [Her bir uç noktanın güvenlik risklerini, zafiyetleri ve risk puanını değerlendirir](../api-discovery/risk-score.md).

![Endpoints discovered by API Discovery](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## Koru

Wallarm, keşfi gerçek bir korumaya dönüştürerek trafiğe yönelik uygulama ve API saldırılarını tespit edip engeller. Wallarm’in özel algılama teknikleri, [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve [OWASP API Top 10](https://owasp.org/www-project-api-security/) zafiyetlerine karşı yapılan saldırıları da algılayarak son derece doğru sonuçlar verir. İşte Wallarm'in korumayı nasıl sağladığı:

* Hem [inline](../installation/inline/overview.md) hem de [out-of-band](../installation/oob/overview.md) saldırıları tespit eder.
* Web tabanlı saldırılardan kod enjeksiyonları, uzaktan kod çalıştırma, kaba kuvvet, BOLA ve daha fazlası gibi [çeşitli tehditlerle](../attacks-vulns-list.md) mücadele eder.
* [API’ye özgü kötü niyetli bot istismarını](../api-abuse-prevention/overview.md) belirler.
* Özelleştirilebilir [rate limiting](../user-guides/rules/rate-limiting.md) ile Katman 7 Denial of Service saldırılarına karşı önlem alır.
* Dahili önlemleri desteklemek amacıyla, kullanıcıların kendi tehdit tanımlarını belirleyerek [özel savunmalar oluşturmasına](../user-guides/rules/regex-rule.md) olanak tanır.
* Saldırıları, sisteminizin zafiyetleriyle eşleştirerek kritik olayları ön plana çıkarır.
* [Credential stuffing girişimlerini](../about-wallarm/credential-stuffing.md) tespit eder.

## Tepki Ver

Wallarm, kapsamlı veri, geniş entegrasyonlar ve engelleme mekanizmaları sunarak güvenlik tehditlerine etkili bir şekilde yanıt vermeniz için gerekli araçları sağlar. Öncelikle, tehdidin doğası ve şiddeti hakkında detaylı bilgi sunarak güvenlik analistlerinin değerlendirme yapmasını sağlar. Ardından, yanıtları kişiselleştirebilir, tehdide müdahale edebilir ve ilgili sistemlere uyarı gönderebilirsiniz. İşte Wallarm'in desteği:

* Her yönüyle saldırıyı detaylandıran [derin saldırı incelemesi](../user-guides/events/check-attack.md); bu incelemede başlıklar, kod çözümlenmiş istekler ve gövde detaylandırılır.
* VPN'ler ve Tor ağları gibi şüpheli trafik kaynaklarını engellemek için [coğrafi konum tabanlı kontroller](../user-guides/ip-lists/overview.md) sunar.
* API'lerinize kötü niyetli aktivitelerin ulaşmasını engelleyen [saldırı engelleme önlemleri](../admin-en/configure-wallarm-mode.md#available-filtration-modes) sağlar.
* Slack, Sumo Logic, Splunk, Microsoft Sentinel ve daha fazlasını içeren en yaygın kullanılan güvenlik, operasyon ve geliştirme araçları ile [entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) sunar; böylece bilet, bildirim oluşturabilir ve tespit edilen tehditler hakkında veri iletebilirsiniz.
* Wallarm'in zafiyet tespitine dayanarak acil durumlar için [sanal yamalar](../user-guides/rules/vpatch-rule.md) uygular.

![Events](../images/about-wallarm-waf/overview/events-with-attacks.png)

## Test Et

Dağıtılmış riski yönetmek ilk savunma hattı olsa da, ürün uygulamaları ve API'ler tarafından sergilenen riski azaltmanın en etkili yolu, olayları ortadan kaldırmaktır. Wallarm, uygulama ve API güvenliğinde devreyi kapatan ve zafiyet risklerini bulup ortadan kaldırmak için aşağıdaki test yeteneklerini sunar:

* Pasif trafik analizi yoluyla [zafiyetleri tespit eder](../user-guides/vulnerabilities.md).
* Tespit edilen API'leri zayıf noktalar açısından inceler.
* Gözlemlenen trafikten yola çıkarak [dinamik API güvenlik testleri oluşturur](../vulnerability-detection/threat-replay-testing/overview.md).
* Açığa çıkmış API tokenlarını kontrol etmek için [kamu depolarını tarar](../api-attack-surface/security-issues.md).

![Vulns](../images/about-wallarm-waf/overview/vulnerabilities.png)

## Wallarm Nasıl Çalışır

Wallarm platformu esas olarak iki ana bileşen üzerine kuruludur: Wallarm filtering node ve Wallarm Cloud.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### Filtering Node

İnternet ile API'leriniz arasında konumlanan Wallarm filtering node:

* Şirketin tüm ağ trafiğini analiz eder ve kötü niyetli istekleri engeller.
* Ağ trafiği metriklerini toplar ve bu metrikleri Wallarm Cloud'a yükler.
* Wallarm Cloud'da tanımladığınız kaynaklara özgü güvenlik kurallarını indirir ve trafik analizi sırasında uygular.
* İsteklerinizde yer alan hassas verileri tespit ederek, bunların altyapınız içinde güvenli kalmasını ve üçüncü taraf bir hizmet gibi Cloud'a iletilmemesini sağlar.

Wallarm filtering node'u kendi ağınız içinde kurabilir veya [mevcut dağıtım seçenekleri](../installation/supported-deployment-options.md) aracılığıyla Wallarm Security Edge'i tercih edebilirsiniz.

### Cloud

Wallarm Cloud şu işlemleri gerçekleştirir:

* Filtering node'un yüklediği metrikleri işler.
* Özel kaynaklara özgü güvenlik kurallarını derler.
* Şirketin dışa açık varlıklarını tarayarak zafiyetleri tespit eder.
* Filtering node'dan alınan trafik metriklerine dayanarak API yapısını oluşturur.
* Wallarm platformunu yönetmek ve tüm güvenlik içgörülerine kapsamlı bakış sağlamak amacıyla komuta merkezi işlevi gören Wallarm Console UI'yi barındırır.

Wallarm, veri depolama tercihlerinizi ve bölgesel hizmet gereksinimlerinizi göz önünde bulundurarak en uygun seçeneği sağlayan ABD ve Avrupa'da cloud örnekleri sunar.

[Proceed to signup on the US Wallarm Cloud](https://us1.my.wallarm.com/signup)

[Proceed to signup on the EU Wallarm Cloud](https://my.wallarm.com/signup)