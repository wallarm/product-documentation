# OWASP API Güvenlik Top 10 Panoları

[OWASP API Güvenlik Top 10](https://owasp.org/www-project-api-security/), API'lerde güvenlik riskinin değerlendirilmesi için altın standarttır. API'nizin güvenlik duruşunu bu API tehditlerine karşı ölçmenize yardımcı olmak için, Wallarm, tehdit azaltma ile ilgili net görünürlük ve metrikler sunan panolar sunmaktadır.

Panolar, hem [2019](https://owasp.org/API-Security/editions/2019/en/0x00-header/) hem de [2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) sürümlerinin OWASP API Güvenliği Top 10 risklerini kapsamaktadır.

Bu panoları kullanarak, genel güvenlik durumunu değerlendirebilir ve uygun güvenlik kontrollerini ayarlayarak bulunan güvenlik sorunlarını proaktif olarak ele alabilirsiniz.

![OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Tehdit değerlendirmesi

Wallarm, uygulanan **güvenlik kontrolleri**ne ve keşfedilen güvenlik zaafiyetlerine dayanarak her API tehdidi için riski tahmin eder:

* **Kırmızı** - güvenlik kontrolleri uygulanmamışsa veya API'lerinizde aktif yüksek riskli güvenlik açıkları varsa oluşur.
* **Sarı** - güvenlik kontrolleri yalnızca kısmen uygulanmışsa veya API'lerinizde aktif orta veya düşük riskli güvenlik açıkları varsa oluşur.
* **Yeşil**, API'lerinizin korunduğunu ve açık güvenlik açıklığı olmadığını gösterir.

Her OWASP API Top 10 tehditi için tehdit hakkında detaylı bilgi, mevcut güvenlik kontrolleri, ilgili güvenlik açıkları ve ilgili saldırıları araştırabilirsiniz:

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## Wallarm'ın OWASP API 2023 için güvenlik kontrolleri

Wallarm güvenlik platformu, aşağıdaki güvenlik kontrolleri ile OWASP API Güvenlik Top 10 2023'a karşı tam teşekküllü koruma sağlar:

| 2023 OWASP API Top 10 tehdidi | Wallarm güvenlik kontrolleri |
| ----------------------- | ------------------------ |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Otomatik BOLA mitigasyonu](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) otomatik olarak hassas uç noktaları korumak için tetikleyiciler oluşturur</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Zafiyet Taraıcı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ilgili türde aktif güvenlik açıklarını keşfeder</li><li>[Kaba kuvvet tetikleyici](../../admin-en/configuration-guides/protecting-against-bruteforce.md) kimlik doğrulama uç noktalarını hedef alan kaba kuvvet saldırılarını hafifletir</li><li>[Zayıf JWT tespiti](../triggers/trigger-examples.md#detect-weak-jwts) tetikleyici, zayıf JWT'ler ile yapılan isteklere dayanarak zayıf kimlik doğrulama güvenlik açıklarını keşfeder</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[Zafiyet Taraıcı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ilgili türde aktif güvenlik açıklarını keşfeder</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Kaba kuvvet tetikleyici](../../admin-en/configuration-guides/protecting-against-bruteforce.md) sıklıkla DoS'a yol açan kaba kuvvet saldırılarını hafifletir, bu da API'nin yanıt verememesine veya hatta kullanılamaz hale gelmesine neden olur</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Zafiyet Taraıcı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ilgili türde aktif güvenlik açıklarını keşfeder</li><li>[Zorla gezinme tetikleyici](../../admin-en/configuration-guides/protecting-against-bruteforce.md) aynı zamanda bu tehdidin sömürülme yolu olan zorla gezinme girişimlerini hafifletir</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API İstismar Önleme](../../api-abuse-prevention/overview.md) kötü niyetli bot eylemlerini hafifletir</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[Zafiyet Taraıcı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ilgili türde aktif güvenlik açıklarını keşfeder</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[Zafiyet Taraıcı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ilgili türde aktif güvenlik açıklarını keşfeder</li><li>Wallarm düğümü kendini kontrol eder ve düğüm sürümlerini ve güvenlik politikalarını güncel tutar (sorunların [nasıl ele alınacağına](../../faq/node-issues-on-owasp-dashboards.md) bakınız)</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Keşfi](../../api-discovery/overview.md) gerçek trafiğe dayanarak otomatik olarak güncel API envanterini keşfeder</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[Zafiyet Taraıcı](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ilgili türde aktif güvenlik açıklarını keşfeder</li></ul> |
