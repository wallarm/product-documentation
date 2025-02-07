# Cloud-Native WAAP

Wallarm Cloud-Native WAAP (Web Application & API Protection), herhangi bir müşteri ortamındaki uygulamalar ve API'ler için gelişmiş koruma sağlar. Wallarm'ın WAAP'ı, REST, SOAP, GraphQL ve diğerleri gibi çoklu API protokollerini destekler ve [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve daha fazlasını tam olarak kapsamak için derin paket incelemesi yapar. WAAP, sıfır gün saldırılar da dahil olmak üzere [çeşitli tehditleri](../attacks-vulns-list.md) algılamada yüksek doğruluk ve [yanlış pozitiflerin](../about-wallarm/protecting-against-attacks.md#false-positives) düşük oranını sunar. Bu sayede altyapınızı hızlı ve etkili bir biçimde koruyabilirsiniz.

![Saldırı protokollere göre](../images/user-guides/dashboard/api-protocols.png)

## Genel Prensipler

Trafik, iki bileşen tarafından yönetilir: Wallarm filtreleme düğümleri ve Wallarm Cloud. Wallarm filtreleme düğümleri, müşterinin altyapısına dağıtılır ve trafiği analiz edip saldırıları engellemekten sorumludur. Toplanan saldırı istatistikleri, istatistiksel analiz ve olay işleme için Wallarm Cloud'a gönderilir. Wallarm Cloud ayrıca merkezi yönetim ve diğer güvenlik araçlarıyla entegrasyondan da sorumludur.

![!Mimari Şema1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

Wallarm, kamu bulutu, şirket içi, tam SaaS dağıtımı ve Kubernetes, Gateway API'leri, Security Edges vb. entegrasyonu dahil olmak üzere çeşitli [dağıtım seçeneklerini](../installation/supported-deployment-options.md) destekler. Wallarm filtreleme düğümleri, ihtiyaçlarınıza ve altyapınıza bağlı olarak [in-line](../installation/inline/overview.md) veya [out-of-band](../installation/oob/overview.md) olarak dağıtılabilir. Esnek güvenlik politikası yapılandırma seçenekleri, gerçek trafiği engelleme korkusunu ortadan kaldırarak izleme ve engelleme [modları](../admin-en/configure-wallarm-mode.md) arasında hızlı geçiş yapmanıza olanak tanır.

## Koruma Önlemleri

Wallarm WAAP, uygulamalarınızı aşağıdakiler dahil tüm tehdit türlerine karşı korumak için geniş bir güvenlik önlemleri yelpazesi sunar:

* XSS, SQLi, RCE vb. saldırılara karşı güncel yamalar
* Sanal yamalama
* Özel algılayıcı oluşturma
* [L7 DDoS Koruması](../admin-en/configuration-guides/protecting-against-ddos.md)
* [Çoklu saldırı faillerine karşı koruma](../admin-en/configuration-guides/protecting-with-thresholds.md)
* Rate limiting (oran sınırlama)
* [Brute force koruması](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing koruması](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA koruması](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Coğrafi konumlar ve kaynak tiplerine göre filtreleme](../user-guides/ip-lists/overview.md)
* Kötü niyetli IP beslemeleri

## Ek Yetkinlikler

Uygulamaları korumanın ötesinde, Wallarm Cloud Native WAAP, [açığa çıkan varlıklarınızı](../user-guides/scanner.md) tarama ve güvenlik seviyelerini değerlendirme yeteneği sağlar. Bu özellik, kötü niyetli kişilerin saldırmadan önce güvenlik açıklarını tespit etmenize yardımcı olur.

Esnek [raporlama](../user-guides/dashboards/owasp-api-top-ten.md) yetenekleri ve diğer uygulamalarla [entegrasyon](../user-guides/settings/integrations/integrations-intro.md) sayesinde, ortaya çıkan tehditler hakkında hızlıca bilgi sahibi olabilir ve zamanında müdahale edebilirsiniz.

Gelişmiş API koruma ve analiz yetenekleri ihtiyaç duyulduğunda kolayca [eklenebilir](../about-wallarm/subscription-plans.md).