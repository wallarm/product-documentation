# Wallarm Abonelik Planları

Wallarm, çoklu bulut, buluta özgü ve şirket içi ortamlarda tüm API portföyünüzü korumak için API keşfini, risk yönetimini, gerçek zamanlı korumayı ve test yeteneklerini birleştiren tek çözümdür. İhtiyaçlarınıza en uygun işlev setini kolayca seçebilirsiniz.

## Temel abonelik planları

**Cloud Native WAAP** - WAAP (Web Application & API Protection) aboneliği, web uygulamalarını ve API’leri SQLi, XSS, kaba kuvvet (brute force) vb. gibi yaygın tehditlere karşı korur. Tüm API protokollerini destekler ancak bazı spesifik API tehditlerini kapsamaz.

**WAAP + Advanced API Security**. Bu paket, genel WAAP yeteneklerini, OWASP API Top-10 tehditlerinin tümünü kapsayacak kapsamlı API Security araçlarıyla güçlendirir.

**Security Testing**. Bu paket, saldırganlardan önce uygulamalarınızdaki ve API’lerinizdeki güvenlik açıklarını proaktif olarak ortaya çıkarmanıza yardımcı olur.

| Özellik | WAAP | WAAP + API Security | Security Testing |
| ------- | ----------------- | --------------------- | --------------------- |
| **Gerçek zamanlı koruma** | | | |
| [DDoS koruması (L7)](../admin-en/configuration-guides/protecting-against-ddos.md) | Evet | Evet | Hayır |
| [Coğrafi/kaynak filtreleme](../user-guides/ip-lists/overview.md) | Evet | Evet | Hayır |
| [IP itibar beslemeleri](../user-guides/ip-lists/overview.md#malicious-ip-feeds) | Evet | Evet | Hayır |
| [Saldırı damgaları (SQLi, XSS, SSRF, vb.)](../attacks-vulns-list.md#attack-types) | Evet | Evet | Hayır |
| [Müşteri tanımlı imzalar](../user-guides/rules/regex-rule.md) | Evet | Evet | Hayır |
| [Sanal yamalama](../user-guides/rules/vpatch-rule.md) | Evet | Evet | Hayır |
| [Kaba kuvvet koruması](../admin-en/configuration-guides/protecting-against-bruteforce.md) | Evet | Evet | Hayır |
| [Forced browsing’e karşı koruma](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) | Evet | Evet | Hayır |
| [Dağıtık hız sınırlama](../user-guides/rules/rate-limiting.md) | Evet | Evet | Hayır |
| [BOLA koruması](../admin-en/configuration-guides/protecting-against-bola.md) | Manuel tetikleyiciler | Otomatik koruma | Hayır |
| [API Abuse Prevention (bot yönetimi)](../api-abuse-prevention/overview.md) | Hayır | Evet | Hayır |
| [Credential Stuffing Detection](../about-wallarm/credential-stuffing.md) | Hayır | Evet | Hayır |
| [API Specification Enforcement](../api-specification-enforcement/overview.md) | Hayır | Evet | Hayır |
| [GraphQL güvenlik politikaları](../api-protection/graphql-rule.md) | Hayır | Evet | Hayır |
| [Numaralandırma saldırısına karşı koruma](../api-protection/enumeration-attack-protection.md) | Hayır | Evet | Hayır |
| [Mitigation kontrolleri](../about-wallarm/mitigation-controls-overview.md) | Hayır | Evet | Hayır |
| **Güvenlik duruşu** | | | |
| [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) | Hayır | Evet | Hayır |
| [Zafiyet değerlendirmesi](../user-guides/vulnerabilities.md) | Evet | Evet | Hayır |
| [API Sessions](../api-sessions/overview.md) | Hayır | Evet | Hayır |
| [API Discovery](../api-discovery/overview.md) | Hayır | Evet | Hayır |
| [Hassas veri tespiti](../api-discovery/overview.md#sensitive-data-detection) | Hayır | Evet | Hayır |
| [Rogue API Detection (shadow, orphan zombie)](../api-discovery/rogue-api.md) | Hayır | Evet | Hayır |
| **Güvenlik testi** | | | |
| [Threat Replay Testing](../vulnerability-detection/threat-replay-testing/overview.md) | Hayır | Evet | Evet, API Security ile |
| [Schema-Based Security Testing](../vulnerability-detection/schema-based-testing/overview.md) | Hayır | Hayır | Evet |
| **Ek seçenekler** | | | |
| [Self-hosted Node kurulumu](../installation/supported-deployment-options.md) | Tümü | Tümü | Hayır |
| [Security Edge](../installation/security-edge/overview.md) | Hayır | Hayır | Hayır |
| [Entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) | Tümü | Tümü | Tümü |
| [Kullanıcı sayısı](../user-guides/settings/users.md) | Sınırsız | Sınırsız | Sınırsız |
| [SSO kimlik doğrulaması](../admin-en/configuration-guides/sso/intro.md) | Evet | Evet | Evet |
| [Rol tabanlı erişim denetimi (RBAC)](../user-guides/settings/users.md#user-roles) | Evet | Evet | Evet |
| [Çok kiracılı](../installation/multi-tenant/overview.md) | Evet (talep üzerine) | Evet (talep üzerine) | Evet (talep üzerine) |
| Olay saklama süresi | 6 ay | 6 ay | 6 ay |
| Destek | Standard/<br>Advanced/<br>Platinum | Standard/<br>Advanced/<br>Platinum | Standard/<br>Advanced/<br>Platinum |

Abonelik planını etkinleştirmek için [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

## API Attack Surface

!!! info "Diğer planlarla ilişkisi"

    Bu abonelik planı:

    * [Advanced API Security](#core-subscription-plans) planına dahildir
    * [Cloud Native WAAP](#core-subscription-plans) planına eklenebilir
    * Tek başına kullanılabilir (başka plan veya filtreleme Node'u gerekmez)

**API Attack Surface** abonelik planı, **sıfır kurulum** ve minimum yapılandırma ile herkese açık olarak maruz kalan API’lere ve ilgili bilgilere kapsamlı bir görünüm sunar.

Abonelik planı, aşağıdakileri içeren [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) ürününü sağlar:

* [API Attack Surface Discovery](../api-attack-surface/api-surface.md)
* [Security Issues Detection](../api-attack-surface/security-issues.md)

Abonelik planını etkinleştirmek için aşağıdakilerden birini yapın:

* Henüz Wallarm hesabınız yoksa, fiyat bilgisi almak ve AASM’yi etkinleştirmek için Wallarm’ın resmi sitesini [buradan](https://www.wallarm.com/product/aasm) ziyaret edin.

    Etkinleştirme sırasında, satış ekibiyle görüşmeler devam ederken kullandığınız e-postanın etki alanının taranması hemen başlar. Etkinleştirmeden sonra kapsama alanına ek etki alanları ekleyebilirsiniz.

* Zaten Wallarm hesabınız varsa, [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

## Security Edge (Ücretli Plan)

!!! info "Diğer planlarla ilişkisi"

    Bu abonelik planı:

    * [Cloud Native WAAP](#core-subscription-plans) veya [Advanced API Security](#core-subscription-plans) planına eklenebilir
    * Tek başına kullanılamaz

Security Edge abonelik planı, Wallarm node’unu yönetilen ortamda dağıtmanıza olanak tanır; bu da yerinde kurulum ve yönetim ihtiyacını ortadan kaldırır.

Node barındırma ve bakımını Wallarm üstlendiğinde, güçlü trafik filtreleme, saldırı tespiti ve güvenli iletişimin avantajlarından yararlanırken temel altyapınıza odaklanabilirsiniz — tümü Wallarm tarafından desteklenir.

Mevcut Security Edge dağıtımları şunları içerir:

* [Security Edge Inline](../installation/security-edge/inline/overview.md)
* [Security Edge Connectors](../installation/security-edge/se-connector.md)

Bu abonelik hakkında bilgi almak için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.

## Security Edge Free Tier

Daha küçük şirketler ve eğitim amaçları için Wallarm, [Security Edge](#security-edge-paid-plan) Free Tier hesabını kendiniz oluşturma seçeneği sunar. Depolama tercihlerinize en uygun Wallarm cloud’u seçebilirsiniz:

* [US Wallarm Cloud üzerinde Free Tier hesap oluşturun](https://us1.my.wallarm.com/signup)
* [EU Wallarm Cloud üzerinde Free Tier hesap oluşturun](https://my.wallarm.com/signup)

Security Edge Free Tier hesabı şunlara izin verir:

* Bazı özellik kısıtlarıyla Security Edge işlevselliği.
* Zaman sınırlaması olmadan ayda **500 bin isteğe** kadar işleme.
* Aşağıdakiler hariç olmak üzere [Advanced API Security](#core-subscription-plans) olarak Wallarm platformuna erişim:

    * [Zafiyet değerlendirmesi](../user-guides/vulnerabilities.md)
    * [API Abuse Prevention](../api-abuse-prevention/overview.md)
    * Security Edge’in telemetri portalı
    * Çoklu bulutta Security Edge kurulumu

Bir Free Tier hesabı aylık kotanın %100’ünü aşarsa, Wallarm Console erişiminiz tüm entegrasyonlarla birlikte devre dışı bırakılır. %200’e ulaşıldığında, Wallarm node’larınızdaki koruma devre dışı bırakılır. Bu kısıtlamalar bir sonraki ayın ilk gününe kadar yürürlükte kalacaktır.

Tüm kısıtlamaları kaldırmak için [sales@wallarm.com](mailto:sales@wallarm.com) ile iletişime geçin.