# DoS Koruması <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

[Unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md), en ciddi API güvenlik risklerinden oluşan [OWASP API Top 10 2023](../user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023) listesinde yer almaktadır. Kendi başına bir tehdit olmakla birlikte (aşırı yüklenme nedeniyle hizmetin yavaşlaması veya tamamen durması), bu durum aynı zamanda numaralandırma saldırıları gibi farklı saldırı türleri için temel oluşturur. Belirli bir zaman diliminde çok fazla isteğe izin verilmesi bu risklerin başlıca nedenlerindendir.

Wallarm, API'nize aşırı trafiği önlemeye yardımcı olmak için **DoS protection** [önleme kontrolü](../about-wallarm/mitigation-controls-overview.md) sağlar.

[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 veya [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1 ya da daha yeni sürümlerini gerektirir.

## Önleme kontrolü oluşturma ve uygulama

Devam etmeden önce: herhangi bir önleme kontrolü için **Scope**, **Scope filters** ve **Mitigation mode** değerlerinin nasıl ayarlandığını öğrenmek üzere [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) makalesini kullanın.

Oran istismarı korumasını yapılandırmak için:

1. Wallarm Console → **Mitigation Controls** bölümüne gidin.
1. **Add control** → **DoS protection** seçeneğini kullanın.
1. Önleme kontrolünün uygulanacağı **Scope**'u tanımlayın.
1. Gerekirse, **Scope filters** içinde gelişmiş koşulları tanımlayın.
1. Zaman aralığı başına istek sayısını sınırlayacak eşik değerini ayarlayın.
1. **Mitigation mode** bölümünde, eşik aşıldığında yapılacak işlemi ayarlayın.
1. **Create**'e tıklayın.

## Önleme kontrolü örnekleri

### Kimlik doğrulama parametrelerine yönelik brute force saldırılarını önlemek için oturumlara göre bağlantıları sınırlama

Kullanıcı oturumlarına göre birim zamanda istekleri sınırlayarak, korunan kaynaklara yetkisiz erişim elde etmek için gerçek JWT'leri veya diğer kimlik doğrulama parametrelerini bulmaya yönelik brute force girişimlerini kısıtlayabilirsiniz. Örneğin, oturum başına 60 saniyede yalnızca 10 isteğe izin veren bir limit ayarlandıysa, farklı jeton değerleriyle çok sayıda istek yaparak geçerli bir JWT keşfetmeye çalışan bir saldırgan hızlıca limite ulaşır ve istekleri IP veya oturum bazında reddedilir.

Uygulamanızın `https://example.com/api/login` uç noktasında Bearer JWT içeren POST isteklerini kabul ettiğini varsayalım. Bu uç noktaya 60 saniyede 10'dan fazla isteğin gönderildiği oturumları 1 saat süreyle engellemek istiyoruz. Bu senaryo için, birim zamanda istekleri sınırlayan önleme kontrolü şu şekilde görünecektir:

![DoS koruması - JWT örneği](../images/api-protection/mitigation-controls-dos-protection-jwt.png)

## Oran sınırlama ile farkı

Kaynak tüketimini kısıtlamak ve çok sayıda istek kullanılarak gerçekleştirilen saldırıları önlemek için, burada açıklanan oran istismarı korumasına ek olarak, Wallarm [gelişmiş oran sınırlama](../user-guides/rules/rate-limiting.md) sağlar.

Oran istismarı koruması, saldırganları IP'lerine veya oturumlarına göre engeller, **oysa** gelişmiş oran sınırlama, oran çok yüksekse bazı istekleri geciktirir (tampona alır) ve tampon dolduğunda kalanları reddeder; oran normale döndüğünde tamponlanan istekler iletilir, IP veya oturum bazında herhangi bir engelleme uygulanmaz.