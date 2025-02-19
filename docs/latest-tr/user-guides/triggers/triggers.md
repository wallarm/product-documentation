# Tetikleyicilerle Çalışma

Tetikleyiciler, Wallarm’un çeşitli olaylara verdiği yanıtı yapılandırmak için kullanılan araçlardır. Tetikleyiciler, sistemin tepki verebileceği önemli sayıda olayı çeşitli olası tepkilerle birleştirir. Bu konstruktor benzeri süreç, şirketinizin benzersiz güvenlik ihtiyaçlarına uygun karmaşık davranışların yapılandırılmasına olanak tanır.

Tetikleyiciler, **Tetikleyiciler** bölümünde [US](https://us1.my.wallarm.com/triggers) veya [EU](https://my.wallarm.com/triggers) Cloud’da yapılandırılır.

![Tetikleyicileri yapılandırma bölümü](../../images/user-guides/triggers/triggers-section.png)

## Nasıl Çalışır

Her tetikleyici, yapılandırabileceğiniz aşağıdaki bileşenlerden oluşur:

* **Koşul**: Wallarm’un tepki vermesi gereken olay. Örneğin: belirli sayıda saldırı alması, denylisted IP adresi veya hesaba eklenen yeni kullanıcı.
* [**Filtreler**](#understanding-filters): koşulun detayları. Örneğin: koşul "Günde 10.000'den fazla saldırı" ise, **Tür** filtresini "SQLi" ve **Yanıt durumu**nu "200" olarak ayarlayın; bu, tetikleyicinin "Günde 10.000'den fazla SQLi saldırısı olup 200 yanıtı döndüyse harekete geç" anlamına gelir.
* **Tepki**: Belirtilen koşul ve filtreler karşılandığında gerçekleştirilecek eylem. Örneğin: Slack veya başka bir sistem olarak yapılandırılan [integration](../settings/integrations/integrations-intro.md)’a bildirim gönderme, IP adresini engelleme veya istekleri brute‑force saldırısı olarak işaretleme.

## Tetikleyicilerle Neler Yapabilirsiniz

Tetikleyicileri kullanarak:

* Uygulamalarınız ve API'leriniz için aşağıdaki koruma önlemlerini sağlayabilirsiniz:

    * [Protection from multi-attack perpetrators](../../admin-en/configuration-guides/protecting-with-thresholds.md)
    * [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)

* Farklı [integrations](../../user-guides/settings/integrations/integrations-intro.md) için genişletilmiş uyarılar ayarlayabilirsiniz.
* Saldırılar ve olayların temsilini [vuruşları gruplayarak](../../user-guides/events/grouping-sampling.md#grouping-of-hits) optimize edebilirsiniz.

## Filtreleri Anlama

Filtreler, [koşul](#how-it-works) detaylandırması için kullanılır. Örneğin, brute-force saldırıları, SQL enjeksiyonları gibi belirli saldırı türlerine yönelik tepkiler ayarlayabilirsiniz. Wallarm Console arayüzünde bir veya daha fazla filtre ekleyebilir ve bunlara değer atayabilirsiniz.

![Kullanılabilir filtreler](../../images/user-guides/triggers/trigger-filters.png)

Aşağıdaki filtreler mevcuttur:

* **URI** (sadece **Brute force**, **Forced browsing** ve **BOLA** koşulları için): İsteğin gönderildiği tam URI. URI, [URI constructor](../../user-guides/rules/rules.md#uri-constructor) veya [advanced edit form](../../user-guides/rules/rules.md#advanced-edit-form) aracılığıyla yapılandırılabilir.
* **Type**: İstekte tespit edilen [saldırı türü](../../attacks-vulns-list.md) veya isteğin yöneltildiği güvenlik açığı türü.
* **Application**: İsteği alan [uygulama](../settings/applications.md).
* **IP**: İsteğin gönderildiği IP adresi.

    Filtre yalnızca tek IP'leri kabul eder; alt ağlara, konumlara ve kaynak türlerine izin vermez.
* **Domain**: İsteği alan domain.
* **Response status**: İsteğe döndürülen yanıt kodu.
* **Target**: Saldırının yöneltildiği veya olayın tespit edildiği uygulama mimarisinin bölümü. Aşağıdaki değerleri alabilir: `Server`, `Client`, `Database`.
* **User's role**: Eklenen kullanıcının [rolü](../../user-guides/settings/users.md#user-roles). Aşağıdaki değerleri alabilir: `Deploy`, `Analyst`, `Administrator`, `Read only`, `API developer` ve eğer [multitenancy](../../installation/multi-tenant/overview.md) özelliği etkinse - `Global Administrator`, `Global Analyst`, `Global Read Only`.

## Varsayılan Tetikleyiciler

Yeni şirket hesapları aşağıdaki varsayılan (önceden yapılandırılmış) tetikleyicilerle birlikte gelir:

* Aynı IP'den gelen vuruşları tek bir saldırıda grupla

    Bu tetikleyici, olay listesinde aynı IP adresinden gelen tüm [vuruşları](../../glossary-en.md#hit) tek bir saldırı altında gruplar. Bu, olay listesini optimize eder ve saldırı analizinin daha hızlı yapılmasını sağlar.

    Bu tetikleyici, 15 dakika içinde tek bir IP adresinden 50'den fazla vuruş geldiğinde devreye girer. Eşik aşıldıktan sonra gelen vuruşlar saldırıda gruplanır.

    Vuruşlar farklı saldırı türlerine, zararlı yük içeriklerine ve URL'lere sahip olabilir. Bu saldırı parametreleri, olay listesinde `[multiple]` etiketi ile işaretlenecektir.

    Gruplanan vuruşların farklı parametre değerlerine sahip olması nedeniyle, [Yanlış pozitif olarak işaretle](../events/check-attack.md#false-positives) butonu tüm saldırı için kullanılamaz; ancak belirli vuruşlar yanlış pozitif olarak işaretlenebilir. [Saldırının aktif doğrulaması](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) de kullanılamaz.
    
    Brute force, Forced browsing, Resource overlimit, Data bomb veya Virtual patch saldırı türündeki vuruşlar bu tetikleyici kapsamında değerlendirilmez.
* 1 saat içinde 3'ten fazla farklı [malicious payloads](../../glossary-en.md#malicious-payload) üretilmesi durumunda IP'yi 1 saatliğine graylist'e al

    [Graylist](../ip-lists/overview.md), düğüm tarafından şu şekilde işlenen şüpheli IP adresleri listesidir: Graylist’e alınan bir IP zararlı istekler üretirse, düğüm bu istekleri engellerken meşru isteklerin geçmesine izin verir. Graylist’in aksine, [denylist](../ip-lists/overview.md) uygulamalarınıza ulaşmasına izin verilmeyen IP adreslerini işaretler – denylist’e alınan kaynakların oluşturduğu meşru trafik bile engellenir. IP graylisting, [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) oranını azaltmaya yönelik seçeneklerden biridir.

    Bu tetikleyici, düğümün hangi filtreleme modunda olursa olsun devreye girer, bu nedenle düğüm modu fark etmeksizin IP'ler graylist’e eklenir.

    Ancak, düğüm graylist’i yalnızca **güvenli engelleme** modunda analiz eder. Graylist’e alınan IP'lerden gelen zararlı istekleri engellemek için, düğümün [modunu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) önce öğrenip daha sonra güvenli engelleme moduna geçirin.

    Brute force, Forced browsing, Resource overlimit, Data bomb veya Virtual patch saldırı türündeki vuruşlar bu tetikleyici kapsamında değerlendirilmez.

Varsayılan tetikleyicileri geçici olarak devre dışı bırakabilirsiniz. Aynı zamanda, varsayılan tetikleyicinin sağladığı davranışı değiştirmek için aynı türde özel tetikleyiciler oluşturabilirsiniz. Herhangi bir özel tetikleyici oluşturduğunuzda, varsayılan tetikleyici silinir; tüm özel tetikleyicilerinizi sildiğinizde, varsayılan yeniden etkinleştirilir.

## Tetikleyici İşleme Öncelikleri

Aynı koşula sahip (örneğin, **Brute force**, **Forced browsing**, **BOLA**) birden fazla tetikleyici olduğunda ve bazıları URI hiyerarşi seviyesine sahipse, daha düşük hiyerarşi seviyesindeki URI filtresine sahip olan tetikleyiciye yalnızca o istekler dahil edilir.

URI filtresi olmayan tetikleyiciler daha yüksek hiyerarşi seviyesi olarak kabul edilir.

**Örnek:**

* İlk tetikleyici, belirli bir koşula sahip olup URI filtresine sahip değildir (herhangi bir uygulama veya bölümüne yapılan istekler bu tetikleyici tarafından sayılır).
* Aynı koşula sahip ikinci tetikleyicide, `example.com/api` URI filtresi vardır.

`example.com/api`'ye yapılan istekler, yalnızca `example.com/api` filtresine sahip ikinci tetikleyici tarafından sayılır.

## Tetikleyicileri Devre Dışı Bırakma ve Silme

* Bildirim ve olay tepkilerini geçici olarak durdurmak için, tetikleyiciyi devre dışı bırakabilirsiniz. Devre dışı bırakılan bir tetikleyici, **Tüm** ve **Devre Dışı** tetikleyiciler listesinde görüntülenecektir. Bildirim ve olay tepkilerinin yeniden gönderilmesi için **Enable** seçeneği kullanılır.
* Bildirim ve olay tepkilerini kalıcı olarak durdurmak için, tetikleyiciyi silebilirsiniz. Tetikleyici silindikten sonra geri dönüşü yoktur. Tetikleyici, tetikleyici listesinden kalıcı olarak kaldırılır.

Tetikleyiciyi devre dışı bırakmak veya silmek için, lütfen tetikleyici menüsünden uygun seçeneği seçin ve gerektiyse işlemi onaylayın.