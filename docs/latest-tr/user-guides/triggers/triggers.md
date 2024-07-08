# Tetikleyiciler ile Çalışma

Tetikleyiciler, özel bildirimler ve olaylara tepkiler ayarlamak için kullanılan araçlardır. Tetikleyicileri kullanarak, şunları yapabilirsiniz:

* Kurumsal mesajlaşma veya olay yönetim sistemleri gibi günlük iş akışınız için kullandığınız araçlar aracılığıyla önemli olaylarda uyarı alabilirsiniz.
* Belirli bir sayıda istek veya saldırı vektörü gönderilen IP adreslerini engelleyebilirsiniz.
* Belirli API uç noktalarına gönderilen istek sayısı ile [davranışsal saldırıları](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks) belirleyebilirsiniz.
* Olay listesini, aynı IP adresinden gelen darbeleri bir saldırıya [gruplayarak](../../about-wallarm/protecting-against-attacks.md#attack) optimize edebilirsiniz.
* Wallarm düğümleri tarafından tespit edilen artan sayıda kötü niyetli istekleri izleyebilir ve bu da devam eden bir saldırıya işaret edebilir ve zamanında eylem alabilirsiniz, örneğin saldırgan IP adreslerini manuel olarak engelleyerek tehdidi hafifletebilirsiniz.

Tetikleyici bileşenlerinin tümünü yapılandırabilirsiniz:

* **Koşul**: Hakkında bilgilendirilecek sistem olayı. Örneğin: belirli bir miktar saldırı almak, kara listeye alınmış IP adresi ve hesaba yeni kullanıcı eklemek.
* **Filtreler**: koşul detayları. Örneğin: saldırı türleri.
* **Tepki**: Belirtilen koşul ve filtreler karşılandığında gerçekleştirilmesi gereken eylem. Örneğin: Bildirimi Slack veya başka bir sistem olarak gönderme, IP adresini engelleme veya istekleri kaba kuvvet saldırısı olarak işaretleme [entegrasyonu](../settings/integrations/integrations-intro.md).

Tetikleyiciler, Wallarm Konsolu'nun **Tetikleyiciler** bölümünde yapılandırılır. Bölüm yalnızca **Yönetici** [rolüne](../settings/users.md) sahip kullanıcılar için geçerlidir.

![Tetikleyicileri yapılandırma bölümü](../../images/user-guides/triggers/triggers-section.png)

## Tetikleyiciler oluşturma

1. **Tetikleyici oluştur** düğmesine tıklayın.
2. [Koşulları](#step-1-choosing-a-condition) seçin.
3. [Filtreleri](#step-2-adding-filters) ekleyin.
4. [Tepkileri](#step-3-adding-reactions) ekleyin.
5. Tetikleyiciyi [kaydedin](#step-4-saving-the-trigger).

### Adım 1: Bir koşul seçme

Bir koşul, hakkında bilgilendirilecek bir sistem olayıdır. Bildirim için aşağıdaki koşullar kullanılabilir:

* [Kaba kuvvet](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Zorla tarama](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA](../../admin-en/configuration-guides/protecting-against-bola.md)
* [Zayıf JWT](trigger-examples.md#detect-weak-jwts)
* [Saldırı vektörleri (kötü niyetli yükler)](../../glossary-en.md#malicious-payload) sayısı ([özel düzenli ifadeler](../rules/regex-rule.md) temelli deneysel yükler dikkate alınmaz)
* [Saldırılar](../../glossary-en.md#attack) sayısı ([özel düzenli ifadeler](../rules/regex-rule.md) temelli deneysel saldırılar dikkate alınmaz)
* Aşağıdakiler dışındaki [darbeler](../../glossary-en.md#hit) sayısı:

    * [Özel düzenli ifade](../rules/regex-rule.md) temelli tespit edilen deneysel darbeler. Deneysel olmayan darbeler sayılır.
    * [Örnekte](../events/analyze-attack.md#sampling-of-hits) kaydedilmeyen darbeler.
* Olay sayısı
* Kara listeye alınmış IP
* [API envanterindeki değişiklikler](../../api-discovery/overview.md#tracking-changes-in-api)
* Aynı IP'den gelen darbeler, Kaba kuvvet, Zorla tarama, BOLA (IDOR), Kaynak aşırı sınırı, Veri bombası ve Sanal yama saldırı türlerinden olanlar hariç
* Kullanıcı eklendi

![Mevcut koşullar](../../images/user-guides/triggers/trigger-conditions.png)

Wallarm Konsolu arayüzünde bir koşul seçin ve tepkinin alt sınırını ayarlayın, eğer ayar mevcutsa.

### Adım 2: Filtreler eklemek

Filtreler, koşulun ayrıntılandırılması için kullanılır. Örneğin, belirli türdeki saldırılara, örneğin kaba kuvvet saldırılarına, SQL enjeksiyonlarına ve diğerlerine tepkiler ayarlayabilirsiniz.

Aşağıdaki filtreler kullanılabilir:

* **URI** (yalnızca **Kaba Kuvvet**, **Zorla Tarama** ve **BOLA** koşulları için): İsteğin gönderildiği tam URI. URI, [URI yapılandırıcısı](../../user-guides/rules/rules.md#uri-constructor) veya [gelişmiş düzenleme formu](../../user-guides/rules/rules.md#advanced-edit-form) aracılığıyla yapılandırılabilir.
* **Tür** istekte tespit edilen bir saldırı türü veya isteğin yönlendirildiği bir zafiyet türüdür.
* **Uygulama** isteği alan veya bir olayın tespit edildiği [uygulama](../settings/applications.md)dır.
* **IP** isteğin gönderildiği bir IP adresidir.

    Filtre yalnızca tek IP'leri bekler, alt ağlara, konumlara ve kaynak türlerine izin vermez.
* **Alan adı** isteği alan veya bir olayın tespit edildiği alan adıdır.
* **Yanıt durumu** isteğe dönen yanıt kodudur.
* **Hedef** saldırının yönlendirildiği veya olayın tespit edildiği bir uygulama mimarisi bölümüdür. `Sunucu`, `İstemci`, `Veritabanı` değerlerini alabilir.
* **Kullanıcının rolü** eklenen kullanıcının rolüdür. `Dağıt`, `Analiz`, `Yönetici` değerlerini alabilir.

Wallarm Konsolu arayüzünde bir veya daha fazla filtre seçin ve bunlar için değerler ayarlayın.

![Mevcut filtreler](../../images/user-guides/triggers/trigger-filters.png)

### Adım 3: Tepkiler eklemek

Tepki, belirli bir koşulu ve filtreleri karşıladığı takdirde gerçekleştirilmesi gereken bir eylemdir. Mevcut tepkiler seçilen koşulla belirlenir. Tepkiler aşağıdaki türlerde olabilir:

* İstekleri kaba kuvvet veya zorla tarama saldırısı olarak [işaretleyin](../../admin-en/configuration-guides/protecting-against-bruteforce.md). İstekler olay listesinde saldırılar olarak işaretlenecektir ancak engellenmeyecektir. İstekleri engelleme, ek bir tepki ekleyerek yapabilirsiniz: IP adresini [karalisteye al](../ip-lists/denylist.md).
* İstekleri BOLA saldırısı olarak [işaretleyin](../../admin-en/configuration-guides/protecting-against-bola.md). İstekler olay listesinde saldırılar olarak işaretlenecektir ancak engellenmeyecektir. İstekleri engelleme, ek bir tepki ekleyerek yapabilirsiniz: IP adresini [karalisteye al](../ip-lists/denylist.md).
* JWT zafiyetini [kaydedin](trigger-examples.md#detect-weak-jwts).
* IP'yi [karalisteye](../ip-lists/denylist.md) ekleyin.
* IP'yi [gri listeye](../ip-lists/graylist.md) ekleyin.
* [Entegrasyonlarda](../settings/integrations/integrations-intro.md) yapılandırılmış olan SIEM sistemine veya Webhook URL'ye bildirim gönderin.
* [Entegrasyonlarda](../settings/integrations/integrations-intro.md) yapılandırılmış olan mesajlaşmaya bildirim gönderin.

    !!! uyarı "Karalisteye alınan IP'ler hakkında mesajlaşma yoluyla bildirim"
        Tetikleyiciler, karalisteye alınan IP'ler hakkında yalnızca SIEM sistemlerine veya Webhook URL'ye bildirim göndermeye izin verir. **Karalisteye alınan IP** tetikleyici koşulu için mesajlaşma kullanılamaz.
* Tetikleyici koşulu, **Aynı IP'den gelen darbeler**se, sonraki darbeleri [bir saldırıya gruplayın](trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack).

    Bu saldırılar için [**Yanlış pozitif olarak işaretle**](../events/false-attack.md#mark-an-attack-as-a-false-positive) düğmesi ve [aktif doğrulama](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) seçeneği kullanılamaz.

Wallarm Konsolu arayüzünde bir veya daha fazla tepki seçin. Koşul için geçerli olan tepkiler **Saldırı sayısı**nda bulunur:

![Bir entegrasyon seçmek](../../images/user-guides/triggers/select-integration.png)

### Adım 4: Tetikleyiciyi kaydetmek

1. Tetikleyici oluşturma modal penceresindeki **Oluştur** düğmesine tıklayın.
2. Tetikleyicinin adını ve açıklamasını (gerekirse) belirtin ve **Bitti** düğmesine tıklayın.

Eğer tetikleyici adı ve açıklaması belirtilmezse, tetikleyici `Yeni tetikleyici tarafından <kullanıcı_adı>, <oluşturma_tarihi>` adıyla ve boş bir açıklamayla oluşturulur.

## Önceden yapılandırılmış tetikleyiciler (varsayılan tetikleyiciler)

Yeni şirket hesapları, aşağıdaki önceden yapılandırılmış tetikleyiciler (varsayılan tetikleyiciler) özelliklerine sahiptir:

* Aynı IP'den gelen darbeleri bir saldırıya grupla

    Tetikleyici, aynı IP adresinden gönderilen tüm [darbeleri](../../glossary-en.md#hit) olay listesindeki bir saldırıya gruplar. Bu, olay listesini optimize eder ve saldırı analizini hızlandırır.

    Bu tetikleyici, tek bir IP adresi 15 dakika içinde 50'den fazla darbe ürettiğinde serbest bırakılır. Eşiği aştıktan sonra gönderilen darbeler saldırıya gruplanır.

    Darbeler farklı saldırı türleri, kötü niyetli yükler ve URL'ler olabilir. Bu saldırı parametreleri, olay listesinde `[birden fazla]` etiketiyle işaretlenecektir.

    Gruplanan darbelerin farklı parametre değerleri nedeniyle, tüm saldırı için [Yanlış pozitif olarak işaretle](../events/false-attack.md#mark-an-attack-as-a-false-positive) düğmesi kullanılamaz, ancak belirli darbeleri yanlış pozitif olarak işaretleyebilirsiniz. [Saldırının aktif doğrulaması](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) da kullanılamaz.

    Bu tetikleyici, Kaba kuvvet, Zorla tarama, Kaynak aşırı sınırı, Veri bombası veya Sanal yama saldırı türleri ile darbeleri dikkate almaz.
* 1 saat içinde 3'ten fazla farklı [kötü niyetli yük](../../glossary-en.md#malicious-payload) ürettiğinde 1 saat boyunca IP'yi gri listeye al

    [Gri liste](../ip-lists/graylist.md), şüpheli IP adreslerinin bir listesidir ve düğüm tarafından şu şekilde işlenir: gri listeye alınan IP, kötü niyetli istekler başlatırsa, düğüm bu istekleri engellerken geçerli isteklere izin verir. Gri liste ile karşılaştırıldığında, [karaliste](../ip-lists/denylist.md), uygulamalarınıza hiçbir şekilde ulaşmalarına izin verilmeyen IP adreslerine işaret eder - düğüm, karalisteye alınan kaynaklar tarafından üretilen hatta geçerli trafiği bile engeller. IP gri listeye alınması, [yanlış pozitiflerin](../../about-wallarm/protecting-against-attacks.md#false-positives) azaltılmasına yönelik seçeneklerden biridir.

    Tetikleyici, herhangi bir düğüm filtreleme modunda tetiklenir, yani IP'leri düğüm moduna bakılmaksızın gri listeye alır.

    Ancak, düğüm gri listeyi yalnızca **güvenli engelleme** modunda analiz eder. Gri listeye alınan IP'lerden gelen kötü niyetli istekleri engellemek için, düğüm [modunu](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) güvenli engelleme özelliklerini öğrenerek değiştirin.

    Bu tetikleyici, Kaba kuvvet, Zorla tarama, Kaynak aşırı sınırı, Veri bombası veya Sanal yama saldırı türleri ile darbeleri dikkate almaz.
* Zayıf JWT'leri tespit et

    [JSON Web Token (JWT)](https://jwt.io/), API'ler gibi kaynaklar arasında veri alışverişini güvenli bir şekilde gerçekleştirmek için kullanılan popüler bir kimlik doğrulama standardıdır. JWT'nin ele geçirilmesi, saldırganların web uygulamalarına ve API'lere tam erişim sağlamaları amacıyla yaygın bir saldırı türüdür. JWT'ler ne kadar zayıfsa, ele geçirilme olasılıkları o kadar yüksektir.

    Bu tetikleyici, Wallarm'ın gelen isteklerdeki zayıf JWT'leri otomatik olarak tespit etmesini ve ilgili [zafiyetleri](../vulnerabilities.md) kaydetmesini sağlar.

Tetikleyiciler, varsayılan olarak bir şirket hesabındaki tüm trafiği çalıştırır ancak tetikleyici ayarlarını değiştirebilirsiniz.

## Tetikleyicileri devre dışı bırakma ve silme

* Bildirimleri ve olaylara tepkileri geçici olarak durdurmak için tetikleyiciyi devre dışı bırakabilirsiniz. Devre dışı bırakılan bir tetikleyici, **Tüm** ve **Devre Dışı** tetikleyiciler listesinde görüntülenir. Bildirimleri ve olaylara tepkileri yeniden etkinleştirmek için, **Etkinleştir** seçeneği kullanılır.
* Bildirimleri ve olaylara tepkileri kalıcı olarak durdurmak için tetikleyiciyi silebilirsiniz. Bir tetikleyicinin silinmesi geri alınamaz. Tetikleyici, tetikleyici listesinden kalıcı olarak kaldırılır.

Tetikleyiciyi devre dışı bırakmak veya silmek için lütfen tetikleyici menüsünden uygun bir seçeneği seçin ve gerektiğinde eylemi onaylayın.

<!-- ## Demo videoları

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->