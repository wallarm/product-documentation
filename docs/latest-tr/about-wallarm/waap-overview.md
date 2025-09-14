# Bulut-Doğal WAAP

Wallarm Cloud-Native WAAP (Web Uygulaması ve API Koruması), herhangi bir müşteri ortamındaki uygulamalar ve API'ler için gelişmiş koruma sağlar. Wallarm'ın WAAP'i REST, SOAP, GraphQL ve diğerleri gibi birden çok API protokolünü destekler ve [OWASP Top 10](https://owasp.org/www-project-top-ten/) ve daha fazlasını tam kapsam altına almak için derin paket incelemesi uygular. WAAP, 0-day'ler dahil [çeşitli tehditleri](../attacks-vulns-list.md) yüksek doğrulukla tespit eder ve [yalancı pozitiflerin](../about-wallarm/protecting-against-attacks.md#false-positives) sayısını düşük tutar. Bu da altyapınızı hızlı ve etkili bir şekilde korumanızı sağlar.

![Protokollere göre saldırılar](../images/user-guides/dashboard/api-protocols.png)

## Genel ilkeler

Trafik iki bileşen tarafından işlenir: Wallarm filtering nodes ve Wallarm Cloud. Wallarm filtering nodes müşteri altyapısına kuruludur ve trafiği analiz edip saldırıları engellemekten sorumludur. Toplanan saldırı istatistikleri istatistiksel analiz ve olay işleme için Wallarm Cloud'a gönderilir. Wallarm Cloud ayrıca merkezi yönetimden ve diğer güvenlik araçlarıyla entegrasyondan sorumludur.

![!Mimari şema1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

Wallarm, [genel bulut](../installation/supported-deployment-options.md), şirket içi, tam SaaS kurulumları ve Kubernetes, Gateway APIs, [Security Edges](../installation/security-edge/overview.md) vb. ile entegrasyon dahil olmak üzere çeşitli kurulum seçeneklerini destekler. Wallarm filtering nodes, ihtiyaçlarınıza ve altyapınıza bağlı olarak ya [hat içi](../installation/inline/overview.md) ya da [bant dışı](../installation/oob/overview.md) konuşlandırılabilir. Esnek güvenlik politikası yapılandırma seçenekleri, [modlar](../admin-en/configure-wallarm-mode.md) arasında izleme ile engelleme arasında hızlıca geçiş yapmanıza olanak tanıyarak meşru trafiğin engellenmesi korkusunu ortadan kaldırır.

## Koruma önlemleri

Wallarm WAAP, uygulamalarınızı her türlü tehdide karşı korumak için, bunlarla sınırlı olmamak üzere, geniş bir güvenlik önlemleri yelpazesi sunar:

* XSS, SQLi, RCE vb. için güncel imzalar
* Sanal yamalama
* Özel dedektör oluşturma
* [L7 DDoS Protection](../admin-en/configuration-guides/protecting-against-ddos.md)
* [Birden çok saldırı faili koruması](../admin-en/configuration-guides/protecting-with-thresholds.md)
* İstek hızını sınırlandırma
* [Brute force koruması](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Zorla gezinmeye karşı koruma](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA koruması](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Coğrafi konumlara ve kaynak türlerine göre filtreleme](../user-guides/ip-lists/overview.md)
* Kötü amaçlı IP beslemeleri

## Ek yetenekler

Uygulamaları korumaya ek olarak, Wallarm Cloud Native WAAP, saldırganlar istismar etmeden önce güvenlik açıklarını belirleme ([pasif tespit](../about-wallarm/detecting-vulnerabilities.md#passive-detection)) yetenekleri sağlar.

Esnek [raporlama](../user-guides/dashboards/owasp-api-top-ten.md) yetenekleri ve diğer uygulamalarla [entegrasyon](../user-guides/settings/integrations/integrations-intro.md), ortaya çıkan tehditleri hızla öğrenmenizi ve zamanında yanıt vermenizi sağlar.

Gelişmiş API koruma ve analiz yetenekleri, ihtiyaç duyulduğunda kolayca [eklenebilir](../about-wallarm/subscription-plans.md).