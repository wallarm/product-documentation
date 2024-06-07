# Wallarm abonelik planları

Wallarm'a abone olurken, işletmenizin ihtiyaçlarını en iyi şekilde karşılayan bir plan seçersiniz. Bu belgeden, mevcut abonelik planları ve etkinleştirdikleri işlevleri öğrenebilirsiniz.

Wallarm aşağıdaki abonelik planlarını sunmaktadır:

* **Cloud Native WAAP (Web Uygulaması ve API Koruması)** adı verilen Nex-Gen WAF, web uygulamalarına ve API'lere genel tehditlere karşı koruma sağlar.
* **Gelişmiş API Güvenliği** protokolden bağımsız olarak tüm portföyünüzde kapsamlı API bulmayı ve tehdit önlemeyi sağlar.

    Gelişmiş API Güvenlik abonelik planı, Cloud Native WAAP için bir eklenti olarak satılmaktadır.

## Abonelik planları

| Özellik | Cloud Native WAAP | WAAP + Gelişmiş API Güvenliği |
| ------- | ----------------- | --------------------- |
| **OWASP kapsamı** | | |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | Evet | Evet |
| [OWASP API Top 10](https://owasp.org/www-project-api-security/) | Kısmen <sup>⁕</sup> | Evet |
| **Korunan kaynak türleri** | | |
| Web uygulamaları | Evet | Evet |
| API'ler | Kısmen <sup>⁕</sup> | Evet |
| **API protokol desteği** | | |
| Eski (SOAP, XML-RPC, WebDAV, WebForm) | Evet | Evet |
| Ana akım (REST, GraphQL) | Evet | Evet |
| Modern ve sürekli (gRPC, WebSocket) | Hayır | Evet |
| **Gerçek zamanlı tehdit önleme** | | |
| [Giriş doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), örneğin SQL enjeksiyonu, RCE | Evet | Evet |
| [Sanal yamalar](../user-guides/rules/vpatch-rule.md) | Evet | Evet |
| [Coğrafi konum filtreleme](../user-guides/ip-lists/overview.md) | Evet | Evet |
| **Otomatik tehditlerden korunma** | | |
| [Brute-force koruması](../admin-en/configuration-guides/protecting-against-bruteforce.md) | Evet | Evet |
| [BOLA (IDOR) koruması](../admin-en/configuration-guides/protecting-against-bola.md) | Manuel kurulum | Otomatik koruma |
| [API İstismarı Önleme](../api-abuse-prevention/overview.md) | Hayır | Evet |
| **Gözlem opsiyonları** | | |
| [API Taraması](../about-wallarm/api-discovery.md) | Hayır | Evet |
| [API Taraması ile varolan gölge, öksüz ve zombi API'lerin bulunması](../about-wallarm/api-discovery.md#shadow-orphan-and-zombie-apis) | Hayır | Evet |
| [Hassas veri tespiti](../about-wallarm/api-discovery.md) | Hayır | Evet |
| **Güvenlik testi ve zafiyet değerlendirmesi** | | |
| [Aktif tehdit doğrulaması](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) | Hayır | Evet |
| [Zaafiyet Tarayıcısı](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) | Hayır | Evet |
| **Güvenlik olay monitörü** | | |
| SIEM'ler, mesajlaşma uygulamaları etc ile [entegrasyonlar](../user-guides/settings/integrations/integrations-intro.md) | Hepsi | Hepsi |
| [Denetim günlüğü](../user-guides/settings/audit-log.md) | Evet | Evet |
| **Dağıtım** | | |
| [Dağıtım seçenekleri](../installation/supported-deployment-options.md) | Hepsi | Hepsi |
| [Çoklu kiracılık](../installation/multi-tenant/overview.md) | Talep üzerine evet | Talep üzerine evet |
| **Kullanıcı yönetimi** | | |
| Kullanıcılar için [SSO (SAML) doğrulama](../admin-en/configuration-guides/sso/intro.md) | Evet | Evet |
| **Wallarm API** | | |
| [Wallarm API'ye erişim](../api/overview.md) | Evet | Evet |

`⁕` Özellikler, WAAP'ın sınırlı bir API protokol seti aracılığıyla gönderilen istekleri analiz ettiği için API'leri kısmen korur çünkü bu özellikler, mevcut olmayan işlevlere bağlı olarak **Kısmen** çalışabilir.

Bir abonelik planını etkinleştirmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) adresine bir istekte bulunun. Abonelik maliyeti, seçilen plana, süresine ve [gelen trafik hacmi](../admin-en/operation/learn-incoming-request-number.md)ne dayalı olarak belirlenecektir.

Aktif plan hakkında bilgiler Wallarm Konsolu → **Ayarlar** → [**Abonelikler**](../user-guides/settings/subscriptions.md) bölümünde görüntülenir.

## Abonelik bildirimleri

Wallarm, hesabınızdaki **Yöneticiler** ve **Küresel Yöneticilere** bir abonelikle ilgili herhangi bir sorun hakkında e-postalar yoluyla bildirimlerde bulunur:

* Abonelik süresinin sona ermesi (60, 30, 15 gün önce ve süre dolduğunda)
* İşlenen istekler için aylık kota aşıldığında (kotanın %85'i ve %100'üne ulaşıldığında)

Buna ek olarak, Wallarm Konsolu UI tüm kullanıcılar için abonelik sorunları hakkında mesaj gösterir.

## Ücretsiz katman abonelik planı (US Cloud)

Yeni bir kullanıcı **[US Cloud](overview.md#cloud)** Wallarm Konsolu'nda kaydedildiğinde, Wallarm sistemine otomatik olarak **Ücretsiz Katman** abonelik planına sahip yeni bir müşteri hesabı oluşturulur.

Ücretsiz Katman aboneliği şunları içerir:

* Ayın ilk günü her ay sıfırlanan diğer hiçbir kısıtlama olmaksızın **500 bin istek/ay** kotalı ücretsiz Wallarm özellikler.
* Şu özellikler hariç olmak üzere Wallarm platformuna [Gelişmiş API Güvenlik](#subscription-plans) olarak erişim:

    * [Zaafiyet](detecting-vulnerabilities.md#vulnerability-scanner) ve [Tespite maruz varlık](../user-guides/scanner.md) Tarayıcıları
    * [Aktif tehditleri önleme](detecting-vulnerabilities.md#active-threat-verification) özelliği
    * [API İstismarı Önleme](../api-abuse-prevention/overview.md) modülü
    * [CDN node](../installation/cdn-node.md) türü dağıtımı
    * Zaafiyet Tarayıcısı'nın kullanılamaması nedeniyle OWASP API Top 10'un kısmi kapsamı
    * Wallarm API'ye erişim

**Kotanın aşıldığı durumda ne olur?**

Şirket hesabı Ücretsiz Katman aylık kotasının %100'ünü aşarsa, Wallarm Konsolu'na erişim, tüm entegrasyonlarla birlikte devre dışı bırakılır. %200'e ulaşıldığında, Wallarm düğümlerinizdeki koruma devre dışı bırakılır.

Bu kısıtlamalar, bir sonraki ayın ilk gününe kadar etkili olacaktır. Hizmeti hemen geri almak için Wallarm [satış ekibi](mailto:sales@wallarm.com) ile iletişime geçerek ücretli abonelik planlarından birine geçin.

Ücretsiz Katman aboneliği kullanımı hakkında bilgiler Wallarm Konsolu → **Ayarlar** → [**Abonelikler**](../user-guides/settings/subscriptions.md) bölümünde görüntülenir.

Wallarm, hesabınızdaki **Yöneticilere** ve **Küresel Yöneticilere** ücretsiz istek kotasının %85'i, %100'ü, %185'i ve %200'ü aşıldığında e-posta yoluyla bildirim yapar.

## Deneme süresi (EU Cloud)

Yeni bir kullanıcı **[EU Cloud](overview.md#cloud)** Wallarm Konsolu'nda kaydedildiğinde, Wallarm sistemine aktif bir deneme süresi olan yeni bir müşteri hesabı otomatik olarak oluşturulur.

* Deneme süresi ücretsizdir.
* Deneme süresi 14 gündür.
* Wallarm denemesi, API Güvenlik [planında](#subscription-plans) yer alabilecek modüller ve özelliklerin en fazla setini sunar.
* Deneme süresi sadece bir kez daha 14 gün uzatılabilir.

    Deneme süresi, Wallarm Konsolu → **Ayarlar** → [**Abonelikler**](../user-guides/settings/subscriptions.md) bölümünde ve deneme süresinin sona ermesi hakkında e-posta gönderen düğme üzerinden uzatılabilir. E-posta, sadece [**Yönetici** ve **Küresel Yönetici** rolüne](../user-guides/settings/users.md#user-roles) sahip kullanıcılara gönderilir.
* Deneme süresi sona ererse:

    * Wallarm Konsolu'ndaki hesap engellenir.
    * Wallarm düğümü ve Wallarm Cloud senkronizasyonu durdurulur.
    * Wallarm düğümü yerel olarak çalışır, ancak Wallarm Cloud'dan güncelleme alamaz ve Cloud'a veri yükleyemez.
    
    Wallarm'a ücretli bir abonelik etkinleştirildiğinde, tüm kullanıcılar için müşteri hesabına erişim yeniden sağlanır.

Deneme süresi hakkındaki bilgiler Wallarm Konsolu → **Ayarlar** → [**Abonelikler**](../user-guides/settings/subscriptions.md) bölümünde görüntülenir.