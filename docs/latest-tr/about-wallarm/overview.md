[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md
[link-deployment-on-prem]:      ../installation/on-premise/overview.md

# Wallarm Platform’a Genel Bakış

Günümüzün dijital dünyasında, özellikle yapay zekânın yükselişiyle birlikte API’ler artan tehditlerle karşı karşıya. Geleneksel güvenlik, API zafiyetlerini gözden kaçırabilir veya devreye almak zor olabilir. Wallarm ile bulut-yerel ve şirket içi ortamlar genelinde API koruması ve envanter gözlemlenebilirliği için tek bir platform elde edersiniz.

Kuruluşlar, gelişmiş API güvenliği, kolay dağıtım ve sağladığı değer nedeniyle Wallarm’ı tercih ediyor. Wallarm; API keşfi, risk yönetimi, gerçek zamanlı koruma ve testleri gelişmiş API güvenlik yetenekleriyle birleştirir.

![Diyagram](../images/about-wallarm-waf/overview/wallarm-features.png)

## Keşfet

Korumak için önce bilmek gerekir. Wallarm, ortamınızdaki API’leri belirlemek ve güvenlik risklerini değerlendirmek için kapsamlı API keşfi yetenekleri sunar. Wallarm’ın API keşfi şunları yapar:

* [API uç noktalarınızı ve bunların parametrelerini algılar](../api-discovery/overview.md) ve tutarlı trafik analiziyle API görünümünü sürekli günceller.
* Gölge, yetim ve zombi API’ler dahil [sapkın uç noktaları tanımlar](../api-discovery/rogue-api.md).
* Kişisel tanımlanabilir bilgi (PII) gibi hassas verileri açığa çıkarabilecek uç noktaları belirler.
* [Her bir uç noktayı güvenlik riskleri ve zafiyetler açısından değerlendirir](../api-discovery/risk-score.md) ve bir risk skoru sağlar.

![API Discovery tarafından keşfedilen uç noktalar](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

## Koru

Wallarm, keşfi genişleterek trafikteki uygulama ve API saldırılarını tespit edip engelleyerek gerçek koruma sağlar. Wallarm’ın tescilli tespit teknikleri, [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve [OWASP API Top 10](https://owasp.org/www-project-api-security/) zafiyetlerine yönelik saldırıların tespiti dâhil yüksek doğrulukta sonuçlar sunar. Wallarm korumayı şöyle sağlar:

* Saldırıları hem [inline](../installation/inline/overview.md) hem de [out-of-band](../installation/oob/overview.md) olarak tespit eder.
* Kod enjeksiyonları, uzaktan kod yürütme, kaba kuvvet, BOLA ve daha fazlası gibi web tabanlı olanlardan API’ye özgü olanlara kadar [çeşitli tehditlerle](../attacks-vulns-list.md) mücadele eder.
* [API’ye özgü kötü amaçlı bot suistimalini](../api-abuse-prevention/overview.md) belirler.
* Özelleştirilebilir [rate limiting](../user-guides/rules/rate-limiting.md) ile Katman 7 Hizmet Engelleme (DoS) saldırılarını bertaraf eder.
* Yerleşik önlemleri tamamlayacak şekilde kendi tehdit tanımlarını belirleyerek [özel savunmalar](../user-guides/rules/regex-rule.md) oluşturmanıza olanak tanır.
* Kritik olayları vurgulamak için saldırıları sisteminizdeki zafiyetlerle eşleştirir.
* [Kimlik bilgisi doldurma (credential stuffing) girişimlerini](../about-wallarm/credential-stuffing.md) tespit eder.

## Yanıtla

Wallarm, derinlemesine veriler, geniş entegrasyonlar ve engelleme mekanizmaları sunarak güvenlik tehditlerine etkin biçimde yanıt vermeniz için araçlar sağlar. Önce ayrıntılı bilgiler sunar, böylece güvenlik analistleri tehdidin doğasını ve ciddiyetini değerlendirir. Ardından yanıtları özelleştirip tehditlere karşı harekete geçebilir ve ilgili sistemlere uyarılar gönderebilirsiniz. Wallarm sizi şöyle destekler:

* Başlıklardan gövdeye bir saldırının her yönünü ayrıntılandıran, kodlanmış isteklerin açılmış hâlini de içeren [derin saldırı incelemesi](../user-guides/events/check-attack.md).
* VPN’ler ve Tor ağları gibi şüpheli trafik kaynaklarını engellemek için [coğrafi konuma dayalı kontroller](../user-guides/ip-lists/overview.md).
* Kötü amaçlı etkinliklerin API’lerinize ulaşmasını önleyen [saldırı engelleme önlemleri](../admin-en/configure-wallarm-mode.md#available-filtration-modes).
* Tespit edilen güvenlik tehditleri hakkında biletler, bildirimler ve veriler oluşturmak için en yaygın güvenlik, operasyon ve geliştirme araçlarıyla [Integrations](../user-guides/settings/integrations/integrations-intro.md). Uyumlu platformlar arasında Slack, Sumo Logic, Splunk, Microsoft Sentinel ve daha fazlası bulunur.
* Wallarm’ın zafiyet tespitiyle vurgulanan acil sorunlar için [Virtual patches](../user-guides/rules/vpatch-rule.md).

![Olaylar](../images/about-wallarm-waf/overview/events-with-attacks.png)

## Test Et

Dağıtılmış riski yönetmek birinci savunma hattıdır, ancak ürün uygulamaları ve API’lerin sergilediği riski azaltmak, olay sayısını düşürmenin en etkili yoludur. Wallarm, aşağıdaki gibi zafiyet riskini bulup ortadan kaldırmaya yönelik bir test yetenekleri paketi sağlayarak uygulama ve API güvenliği döngüsünü kapatır:

* [Pasif trafik analiziyle zafiyetleri belirler](../user-guides/vulnerabilities.md).
* Belirlenen API’leri zayıf noktalar açısından inceler.
* Gözlemlenen trafikten [dinamik olarak API güvenlik testleri oluşturur](../vulnerability-detection/threat-replay-testing/overview.md).
* [Açığa çıkan API belirteçleri için herkese açık depoları kontrol eder](../api-attack-surface/security-issues.md).

![Zafiyetler](../images/about-wallarm-waf/overview/vulnerabilities.png)

## Wallarm nasıl çalışır

Wallarm’ın platformu esas olarak iki ana bileşen üzerine kuruludur: Wallarm filtreleme düğümü ve Wallarm Cloud.

![Mimari şema1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### Filtreleme düğümü

İnternet ile API’leriniz arasına konumlanan Wallarm filtreleme düğümü:

* Şirketin tüm ağ trafiğini analiz eder ve kötü niyetli istekleri etkisizleştirir.
* Ağ trafiği metriklerini toplar ve bu metrikleri Wallarm Cloud’a yükler.
* Wallarm Cloud’da tanımladığınız kaynağa özel güvenlik kurallarını indirir ve bunları trafik analizi sırasında uygular.
* İsteklerinizdeki hassas verileri tespit eder; bu verilerin altyapınız içinde güvende kalmasını sağlar ve üçüncü taraf bir hizmet olan Bulut’a iletilmemesini temin eder.

Wallarm filtreleme düğümünü [kendi ağınız içinde](../installation/supported-deployment-options.md) kurabilir veya [Wallarm Security Edge](../installation/security-edge/overview.md) seçeneğini tercih edebilirsiniz.

### Bulut

Wallarm Cloud şunları yapar:

* Filtreleme düğümünün yüklediği metrikleri işler.
* Özel, kaynağa özgü güvenlik kuralları derler.
* Şirketin açıkta olan varlıklarını zafiyetleri tespit etmek üzere tarar.
* Filtreleme düğümünden alınan trafik metriklerine dayanarak API yapısını oluşturur.
* Wallarm Console UI barındırır; Wallarm platformunda gezinmek ve yapılandırmak için komuta merkeziniz olup tüm güvenlik içgörülerine kapsamlı bir bakış sağlar.

Wallarm, ABD ve Avrupa’da bulut örnekleri sunar; veri depolama tercihlerinizi ve bölgesel hizmet işletim gereksinimlerinizi göz önünde bulundurarak en uygun olanı seçmenize olanak tanır.

[US Wallarm Cloud’da kaydolmaya devam edin](https://us1.my.wallarm.com/signup)

[EU Wallarm Cloud’da kaydolmaya devam edin](https://my.wallarm.com/signup)

## Wallarm nerede çalışır

[açıklanan](#how-wallarm-works) Wallarm bileşenleri: filtreleme düğümü ve Bulut — üç biçimden birinde dağıtılabilir:

--8<-- "../include/deployment-forms.md"