# Wallarm Abonelik Planları

Wallarm, çoklu bulut, cloud-native ve yerinde ortamlarda tüm API ve web uygulama portföyünüzü korumak için en iyi sınıf API Security ve WAAP yeteneklerini bir araya getiren tek çözümdür. İhtiyaçlarınıza en uygun işlevsellik setini kolayca seçebilirsiniz.

## WAAP ve Gelişmiş API Güvenliği

**Cloud Native WAAP** – WAAP (Web Application & API Protection) aboneliği, web uygulamalarını ve API’leri SQLi, XSS, brute force vb. yaygın tehditlere karşı korur. Tüm API protokollerini destekler ancak bazı belirli API tehditlerini kapsamamaktadır.

**WAAP + Advanced API Security**. Bu paket, tüm OWASP API Top-10 tehditlerini kapsayacak şekilde genel WAAP yeteneklerini kapsamlı API Security araçlarıyla güçlendirir.

| Özellik | WAAP | WAAP + API Security |
| ------- | ----------------- | --------------------- |
| **Gerçek zamanlı koruma** | | |
| [DDoS protection (L7)](../admin-en/configuration-guides/protecting-against-ddos.md) | Evet | Evet |
| [Geo/source filtering](../user-guides/ip-lists/overview.md) | Evet | Evet |
| [IP reputation feeds](../user-guides/ip-lists/overview.md#malicious-ip-feeds) | Evet | Evet |
| [Attack stamps (SQLi, XSS, SSRF, etc.)](../about-wallarm/protecting-against-attacks.md#input-validation-attacks) | Evet | Evet |
| [Customer defined signatures](../user-guides/rules/regex-rule.md) | Evet | Evet |
| [Virtual patching](../user-guides/rules/vpatch-rule.md) | Evet | Evet |
| [Brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md) | Evet | Evet |
| [Forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) | Evet | Evet |
| [Distributed rate limiting](../user-guides/rules/rate-limiting.md) | Evet | Evet |
| [BOLA protection](../admin-en/configuration-guides/protecting-against-bola.md) | Manuel tetiklemeler | Otomatik koruma |
| [API Abuse Prevention (bot management)](../api-abuse-prevention/overview.md) | Hayır | Evet |
| [Credential Stuffing Detection](../about-wallarm/credential-stuffing.md) | Hayır | Evet |
| [API Specification Enforcement](../api-specification-enforcement/overview.md) | Hayır | Evet |
| [GraphQL security policies](../api-protection/graphql-rule.md) | Hayır | Evet |
| **Güvenlik durumu** | | |
| [Exposed asset scanner](../user-guides/scanner.md) | Evet | Evet |
| [Vulnerability assessment](../user-guides/vulnerabilities.md) | Evet | Evet |
| [API Sessions](../api-sessions/overview.md) | Hayır | Evet |
| [API Discovery](../api-discovery/overview.md) | Hayır | Evet |
| [Sensitive data detection](../api-discovery/overview.md#sensitive-data-detection) | Hayır | Evet |
| [Rogue API Detection (shadow, orphan zombie)](../api-discovery/rogue-api.md) | Hayır | Evet |
| **Ek Seçenekler** | | |
| [Deployment options](../installation/supported-deployment-options.md) | Tümü | Tümü |
| [Integrations](../user-guides/settings/integrations/integrations-intro.md) | Tümü | Tümü |
| [Number of users](../user-guides/settings/users.md#inviting-a-user) | Sınırsız | Sınırsız |
| [SSO authentication](../admin-en/configuration-guides/sso/intro.md) | Evet | Evet |
| [Role-based access control (RBAC)](../user-guides/settings/users.md#user-roles) | Evet | Evet |
| [Multi-tenant](../installation/multi-tenant/overview.md) | Evet (talep üzerine) | Evet (talep üzerine) |
| Olay saklama süresi | 6 ay | 6 ay |
| Destek | Standard/Advanced/Platinum | Standard/Advanced/Platinum |

Abonelik planını etkinleştirmek için [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

## API Saldırı Yüzeyi

API Saldırı Yüzeyi abonelik planı, hiçbir kurulum gerektirmeden ve minimum yapılandırma ile halka açık API’ler ve ilgili bilgilerin kapsamlı bir görünümünü sağlar.

Abonelik planı, aşağıdakileri içeren [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) ürününü sunar:

* [API Attack Surface Discovery](../api-attack-surface/api-surface.md)
* [Security Issues Detection](../api-attack-surface/security-issues.md)

Abonelik planını etkinleştirmek için aşağıdakilerden birini yapın:

* Eğer henüz bir Wallarm hesabınız yoksa, fiyatlandırma bilgilerini alıp AASM'yi Wallarm'ın resmi sitesinden [buradan](https://www.wallarm.com/product/aasm) etkinleştirin.

    Etkinleştirme sırasında, kullanılan e-postanın alan adı taraması hemen başlar ve satış ekibiyle müzakereleriniz sürerken çalışır. Etkinleştirdikten sonra, kapsam alanına ek domainler ekleyebilirsiniz.

* Eğer zaten bir Wallarm hesabınız varsa, [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

## Security Edge

Security Edge abonelik planı, Wallarm node'unu yönetilen ortamda dağıtmanıza olanak tanır ve bu sayede yerinde kurulum ve yönetim gereksinimini ortadan kaldırır.

Wallarm, node barındırma ve bakımını üstlenirken, sağlam trafik filtreleme, saldırı tespiti ve güvenli iletişim gibi avantajlardan yararlanarak temel altyapınıza odaklanmanızı sağlar – tüm bunlar Wallarm tarafından desteklenmektedir.

Kullanılabilir Security Edge dağıtım seçenekleri şunlardır:

* [Security Edge Inline](../installation/security-edge/deployment.md)
* [Security Edge Connectors](../installation/se-connector.md)

Bu abonelik hakkında bilgi almak için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

## Free Tier

Küçük işletmeler ve eğitim amaçları için Wallarm, kendi Free Tier hesabınızı oluşturma seçeneğini sunar. Depolama tercihlerinize en uygun olan Wallarm Cloud’u seçebilirsiniz:

* [Create Free Tier account on the US Wallarm Cloud](https://us1.my.wallarm.com/signup)
* [Create Free Tier account on the EU Wallarm Cloud](https://my.wallarm.com/signup)

Free Tier hesapları şunlara izin verir:

* Zaman sınırlaması olmaksızın, ayda **500 thousand requests per month** kadar işlem yapma imkânı.
* Aşağıdakiler dışında Wallarm platformuna [Advanced API Security](#waap-and-advanced-api-security) olarak erişim:

    * Security Edge [Inline](../installation/security-edge/deployment.md) ve [Connectors](../installation/se-connector.md)
    * [Exposed assets scanner](../user-guides/scanner.md)
    * [Vulnerability assessment](../user-guides/vulnerabilities.md)
    * [API Abuse Prevention](../api-abuse-prevention/overview.md)

Eğer bir Free Tier hesabı aylık kotanın %100'ünü aşarsa, Wallarm Console erişiminiz ile tüm entegrasyonlar devre dışı bırakılır. %200'e ulaşıldığında ise Wallarm node’larınız üzerindeki koruma devre dışı kalır. Bu kısıtlamalar, bir sonraki ayın ilk gününe kadar geçerli olacaktır.

Tüm kısıtlamaları [ücretli aboneliklere](mailto:sales@wallarm.com) geçerek kolayca kaldırabilirsiniz.