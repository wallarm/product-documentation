# OWASP API 2023 Dashboard

[OWASP API Security Top 10](https://owasp.org/www-project-api-security/) API'lerde güvenlik risklerinin değerlendirilmesi için altın standarttır. API'nizin bu API tehditlerine karşı güvenlik durumunu ölçmenize yardımcı olmak için, Wallarm, tehdit azaltımı için net görünürlük ve metrikler sunan bir gösterge paneli sağlar.

[OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) kapsamındaki bu gösterge paneli, genel güvenlik durumunu değerlendirmenize ve belirlenen sorunları gidermek için proaktif olarak güvenlik kontrolleri uygulamanıza olanak tanır.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/qgq0xmld3wzb" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Tehdit Değerlendirmesi

Wallarm, uygulanan **güvenlik kontrollerine** ve tespit edilen zaafiyetlere dayanarak her API tehdidi için riski değerlendirir:

* **Kırmızı** - Hiçbir güvenlik kontrolü uygulanmamışsa veya API'lerinizde aktif yüksek riskli zaafiyetler varsa ortaya çıkar.
* **Sarı** - Güvenlik kontrolleri kısmen uygulanmışsa veya API'lerinizde aktif orta veya düşük riskli zaafiyetler varsa ortaya çıkar.
* **Yeşil** - API'lerinizin korunduğunu ve açık zaafiyet bulunmadığını belirtir.

## OWASP API 2023 için Wallarm güvenlik kontrolleri

Wallarm güvenlik platformu, aşağıdaki güvenlik kontrolleri ile OWASP API Security Top 10 2023'e karşı tam kapsamlı koruma sağlar:

| OWASP API Top 10 threat 2023 | Wallarm security controls |
| ---------------------------- | ------------------------- |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatic BOLA mitigation](../../api-discovery/bola-protection.md) ile zayıf uç noktaları korumak için tetikleyicileri otomatik olarak oluşturur</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ile ilgili türdeki aktif zaafiyetleri keşfeder</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) ile kimlik doğrulama uç noktalarını hedef alan brute force saldırılarını hafifletir</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ile ilgili türdeki aktif zaafiyetleri keşfeder</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) ile DoS'e yol açarak API'nin tepkisiz veya kullanılamaz hale gelmesini önleyen brute force saldırılarını hafifletir</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ile ilgili türdeki aktif zaafiyetleri keşfeder</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) ile bu tehdidin kötüye kullanılmasının bir yolu olan zorlanmış gezinti girişimlerini hafifletir</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API Abuse Prevention](../../api-abuse-prevention/overview.md) ile kötü niyetli bot eylemlerini hafifletir</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ile ilgili türdeki aktif zaafiyetleri keşfeder</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ile ilgili türdeki aktif zaafiyetleri keşfeder</li><li>Wallarm node kendi kendine kontrol yaparak node sürümlerini ve güvenlik politikalarını güncel tutar (bkz. [how to address the issues](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md) ile gerçek trafiğe dayalı olarak mevcut API envanterini otomatik olarak keşfeder</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) ile ilgili türdeki aktif zaafiyetleri keşfeder</li></ul> |