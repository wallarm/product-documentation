# OWASP API 2023 Dashboard

[OWASP API Security Top 10](https://owasp.org/www-project-api-security/), API'lerdeki güvenlik risklerinin değerlendirilmesi için altın standarttır. API'nizin bu tehditlere karşı güvenlik duruşunu ölçmenize yardımcı olmak için Wallarm, tehdit azaltımı için net görünürlük ve metrikler sağlayan bir dashboard sunar.

[OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) kapsamını ele alan dashboard, genel güvenlik durumunu değerlendirmenize ve belirlenen sorunları gidermek üzere proaktif güvenlik kontrolleri uygulamanıza olanak tanır.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/qgq0xmld3wzb" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Tehdit değerlendirmesi

Wallarm, uygulanan **güvenlik kontrolleri** ve keşfedilen güvenlik açıklarına dayanarak her API tehdidinin riskini tahmin eder:

* **Kırmızı** - hiçbir güvenlik kontrolü uygulanmadıysa veya API'lerinizde aktif yüksek riskli güvenlik açıkları varsa ortaya çıkar.
* **Sarı** - güvenlik kontrolleri yalnızca kısmen uygulandıysa veya API'lerinizde aktif orta veya düşük riskli güvenlik açıkları varsa ortaya çıkar.
* **Yeşil**, API'lerinizin korunduğunu ve açık güvenlik açığı olmadığını gösterir.

## OWASP API 2023 için Wallarm güvenlik kontrolleri

Wallarm güvenlik platformu, aşağıdaki güvenlik kontrolleriyle OWASP API Security Top 10 2023'e karşı tam kapsamlı koruma sağlar:

| OWASP API Top 10 tehdidi 2023 | Wallarm güvenlik kontrolleri |
| ----------------------- | ------------------------ |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>Güvenlik açığı bulunan uç noktaları korumak için tetikleyicileri otomatik oluşturmak amacıyla [Otomatik BOLA azaltımı](../../api-discovery/bola-protection.md)</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>Kimlik doğrulama uç noktalarını hedefleyen brute-force saldırılarını azaltmak için [Brute force tetikleyicisi](../../admin-en/configuration-guides/protecting-against-bruteforce.md)</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>Güvenlik açıklarını tespit etmek için [Güvenlik Sorunlarını Algılama](../../api-attack-surface/security-issues.md) etkin</li><li>[BOLA tetikleyicileri](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)</li><li>[API Keşfi](../../api-discovery/overview.md) ile bulunan uç noktalar için [Otomatik BOLA koruması](../../admin-en/configuration-guides/protecting-against-bola.md)</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>Çoğunlukla Hizmet Reddi'ne (DoS) yol açarak API'yi tepkisiz hatta kullanılamaz hale getiren brute-force saldırılarını azaltmak için [Brute force tetikleyicisi](../../admin-en/configuration-guides/protecting-against-bruteforce.md)</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>Bu tehdidin sömürülmesine de imkan veren zorla gezinme girişimlerini azaltmak için [Zorla gezinme tetikleyicisi](../../admin-en/configuration-guides/protecting-against-bruteforce.md)</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>Kötü niyetli bot eylemlerini azaltan [API Kötüye Kullanımının Önlenmesi](../../api-abuse-prevention/overview.md)</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>Güvenlik açıklarını tespit etmek için [Güvenlik Sorunlarını Algılama](../../api-attack-surface/security-issues.md) etkin</li><li>Uygun [mode](../../admin-en/configure-wallarm-mode.md)'da çalışan [Filtreleme düğümü](../../about-wallarm/overview.md#how-wallarm-works)</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>Düğüm sürümlerini ve güvenlik ilkelerini güncel tutmak için Wallarm düğüm öz-denetimleri (bkz. [sorunların nasıl ele alınacağı](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>Gerçek trafiğe dayalı olarak fiili API envanterini otomatik keşfetmek için [API Keşfi](../../api-discovery/overview.md)</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>Güvenlik açıklarını tespit etmek için [Güvenlik Sorunlarını Algılama](../../api-attack-surface/security-issues.md) etkin</li></ul> |