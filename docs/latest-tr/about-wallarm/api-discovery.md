# API envanterini keşfetme <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm platformunun **API Discovery** modülü, uygulamanızın gerçek API kullanımına dayalı olarak REST API envanterinizi [oluşturur](#enabling-and-configuring-api-discovery). Modül sürekli olarak gerçek trafik taleplerini analiz eder ve analiz sonuçlarına dayalı olarak API envanterini oluşturur. Bu makale, **API Discovery** hakkında genel bir bakış sunar: ele aldığı konular, amacı ve ana olanakları.

**API Discovery** modülünün nasıl kullanılacağına dair bilgi için, kullanıcı klavuzuna başvurun: [user guide](../api-discovery/exploring.md).

## API Discovery tarafından ele alınan meseleler

Gerçek ve tam bir API envanteri oluşturma, API Discovery modülünün ele aldığı ana konudur.

API envanterini güncel tutmak zor bir iştir. Farklı API'leri kullanan birden fazla ekip vardır ve farklı araçlar ve süreçlerin API belgelerini oluşturmak için kullanıldığı yaygın bir durumdur. Sonuç olarak, şirketler hem hangi API'lerinin olduğunu hem hangi verileri açıkladığını anlamakta hem de güncel API belgelerine sahip olmakta zorlanır.

API Discovery modülü, veri kaynağı olarak gerçek trafiği kullanır, bu da gerçekten işlem yapan tüm uç noktaları API envanterine dahil ederek güncel ve tam API belgelerine sahip olmanıza yardımcı olur.

**API envanterinizi Wallarm tarafından keşfettiğinizde, aşağıdaki işlemleri yapabilirsiniz**:

* Tüm API varlıklarınızı, [dış ve iç](#external-and-internal-apis) API'lerin listesini de içerir bir şekilde tam olarak görüntüleyin.
* Hangi verilerin [API'lere giriyor](../api-discovery/exploring.md#params) olduğunu görün.
* Hangi uç noktaların [muhtemelen](#endpoint-risk-score) bir saldırı hedefi olduğunu anlayın.
* Son 7 günlük en fazla saldırıya uğramış API'leri görüntüleyin.
* Yalnızca saldırıya uğramış API'leri filtreleyin, bunları hit sayısına göre sıralayın.
* Hassas veri alıp taşıyan API'leri filtreleyin.
* [Gölge, yetim ve zombi API'lerini](#shadow-orphan-and-zombie-apis) bulun.
* Keşfedilen uç noktaları OpenAPI v3 biçiminde bir şartname olarak [indirin](../api-discovery/exploring.md#download-openapi-specification-oas-of-your-api-inventory) ve Wallarm tarafından keşfedilmeyen (kullanılmayan, ayrıca "Zombi API" olarak bilinir) uç noktaları bulmak için bunları kendi API özelliklerinizle karşılaştırın.
* Seçilen bir süre içinde API'de gerçekleşen [değişiklikleri izleyin](#tracking-changes-in-api).
* Herhangi bir API uç noktası için hızlıca [kurallar oluşturun](../api-discovery/exploring.md#api-inventory-and-rules).
* Herhangi bir API uç noktası için kötü amaçlı taleplerin tam listesini alın.
* Geliştiricilerinize, oluşturulan API envanterinin gözden geçirilmesi ve indirilmesine erişim sağlayın.

## API Discovery nasıl çalışır?

API Discovery, talep istatistiklerine dayanır ve gerçek API kullanımına dayalı güncel API özelliklerini oluşturmak için karmaşık algoritmalar kullanır.

### Hibrit yaklaşım

API Discovery, yerel ve Cloud'da analiz gerçekleştirmek için hibrit bir yaklaşım kullanır. Bu yaklaşım, talep verilerinin ve hassas verilerin yerel olarak tutulduğu bir [gizlilik öncelikli süreç](#security-of-data-uploaded-to-the-wallarm-cloud) sağlar, aynı zamanda istatistik analizi için Cloud'un gücünden yaralanılır:

1. API Discovery, meşru trafiği yerel olarak analiz eder. Wallarm, taleplerin hangi uç noktalara yapıldığını ve hangi parametrelerin geçirildiğini analiz eder.
1. Bu verilere göre, istatistikler yapılır ve Cloud'a gönderilir.
1. Wallarm Cloud, alınan istatistikleri toplar ve bunlara dayanarak bir [API açıklaması](../api-discovery/exploring.md) oluşturur.

    !!! info "Gürültü tespiti"
        Nadir veya tek talepler [gürültü olarak belirlenir](#noise-detection) ve API envanterine dahil edilmez.

### Gürültü tespiti

API Discovery modülü, gürültü tespitini iki ana trafik parametresine dayandırır:

* Uç nokta stabilitesi - en az 5 talebin ilk talepten itibaren 5 dakika içinde kaydedilmesi gerekir.
* Parametre stabilitesi - parametrenin uç noktaya gelen talepler içinde tekrarlanma oranı %1'den fazla olmalıdır.

API envanteri, bu sınırları aşan uç noktaları ve parametreleri gösterecektir. Tam API envanterini oluşturmak için gereken süre, trafik çeşitliliği ve yoğunluğuna bağlıdır.

Ayrıca, API Discovery, aşağıdaki ölçütlere dayanarak taleplerin filtrelemesini gerçekleştirir:

* Sunucunun 2xx aralığında yanıt verdiği talepler işlenir.
* REST API tasarım ilkelelerine uymayan talepler işlenmez. Bu, yanıtların `Content-Type` başlık parametresini kontrol ederek yapılır: eğer `Content-Type` parametresi tür olarak `application` ve alt tür olarak `json` içermiyorsa, bu tür bir talep non-REST API olarak kabul edilir ve filtrelenir. REST API yanıtı örneği:  `Content-Type: application/json;charset=utf-8`. Parametre mevcut değilse, API Discovery talebi analiz eder.
* `Accept` gibi standart alanlar atılır.

### API envanteri unsurları

API envanteri, aşağıdaki unsurları içerir:

* API uç noktaları
* İstek metotları (GET, POST ve diğerleri)
* Her biri içinde gönderilen verinin türünü/biçimini de içeren, gerekli ve isteğe bağlı GET, POST, ve başlık parametreleri:
    * Parametre tarafından iletilen hassas verinin (PII) varlığı ve türü:

        * IP ve MAC adresleri gibi teknik veriler
        * Şifreli anahtarlar ve şifreler gibi giriş kimlik bilgileri
        * Banka kartı numaraları gibi finansal veriler
        * Tıbbi lisans numarası gibi medikal veriler
        * Tam ad, pasaport numarası veya SSN gibi kişiye özgü tanımlama bilgileri (PII)
    
    * Parametre bilgilerinin son güncellendiği tarih ve saat

### Parametre türleri ve biçimleri

Wallarm, her bir uç nokta parametresine geçirilen değerleri analiz eder ve formatlarını belirlemeye çalışır:

* Int32
* Int64
* Float
* Double
* Date
* Datetime
* Email
* IPv4
* IPv6
* UUID
* URI
* Hostname
* Byte
* MAC

Parametredeki değer belirli bir veri biçimine uymuyorsa, belirli bir veri tipi belirtilir:

* Integer
* Number
* String
* Boolean

Her parametre için **Tür** sütunu aşağıdaki bilgileri gösterir:

* Veri biçimi
* Eğer biçim belirlenmediyse - veri tipi

Bu veriler, her parametrede beklenen biçimde değerlerin geçirildiğinin kontrol edilmesini sağlar. Tutarsızlıklar, saldırının sonucu veya API'nizin taraması olabilir:

* `IP` alanına `String` değerler geçiriliyor.
* `Int32` değerinden fazlası olmaması gereken bir alana `Double` değerler geçiriliyor.

### Örnek önizleme

API Discovery ile [abonelik planınızı](subscription-plans.md#subscription-plans) satın almadan önce örnek verileri önizleyebilirsiniz. Bunu yapmak için **API Discovery** bölümünde, **Oyun alanında keşfet**'e tıklamanız yeterlidir.

![API Discovery – Örnek Veri](../images/about-wallarm-waf/api-discovery/api-discovery-sample-data.png)

## Oluşturulan API envanterinin kullanılması

**API Discovery** bölümü, oluşturulan API envanterinin kullanımı için birçok seçenek sunar.

![API Discovery tarafından keşfedilen uç noktalar](../images/about-wallarm-waf/api-discovery/discovered-api-endpoints.png)

Bu seçenekler arasında:

* Arama ve filtreler.
* İç ve dış API'lerin ayrı ayrı listelenmesi yeteneği.
* Uç nokta parametrelerinin görüntülenmesi.
* API'deki değişiklikleri izleme.
* Bazı uç noktalara ilişkin saldırılara hızlı navigasyon.
* Belirli bir uç nokta için özel kural oluşturma.
* Bireysel API uç noktaları ve tüm API için OpenAPI özelliklerini `swagger.json` dosyası olarak indirme.

Kullanılabilir seçenekler hakkında daha fazla bilgiyi [Kullanıcı rehberinde](../api-discovery/exploring.md) öğrenin.

## Uç nokta risk skoru

API Discovery, API envanterinizdeki her uç nokta için otomatik olarak bir **risk skoru** hesaplar. Risk skoru, hangi uç noktaların saldırı hedefi olmaya en yatkın olduğunu anlamanızı ve bu nedenle güvenlik çabalarınızın odağı olması gerektiğini anlamanızı sağlar.

Risk skoru, çeşitli faktörlerden oluşur, bunlar arasında:

* Yetkisiz veri erişimi veya bozulmasına yol açabilecek [**aktif zafiyetlerin**](detecting-vulnerabilities.md) varlığı.
* **Sunucuya dosya yükleme yeteneği** - uç noktalar, genellikle [Uzaktan Kod Yürütme (RCE)](../attacks-vulns-list.md#remote-code-execution-rce) saldırılarına hedef olur, burada dosyalar, sunucuya kötü amaçlı kod içerir bir şekilde yüklenir. Bu uç noktaları güvence altına almak için, yüklenen dosya uzantıları ve içerikleri [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) tarafından önerildiği gibi doğru bir şekilde doğrulanmalıdır.
* Kullanıcı kimlikleri gibi [**değişken yol bölümlerinin**](#variability-in-endpoints) varlığı, örneğin `/api/articles/author/{parameter_X}`. Saldırganlar nesne kimliklerini manipüle edebilir ve yetersiz talep kimlik doğrulaması durumunda nesnenin hassas verilerini okuyabilir veya değiştirebilir ([**BOLA saldırıları**](../admin-en/configuration-guides/protecting-against-bola.md)).
* [**Hassas veri**](#api-inventory-elements) içeren parametrelerin varlığı - saldırganlar, API'lere doğrudan saldırmaktansa, hassas verileri çalar ve bu verileri kaynaklarınıza sorunsuz bir şekilde ulaşmak için kullanabilir.
* **Büyük oranda parametre bulundurmak**, saldırı yönelimlerinin sayısını artırır.
* Uç nokta isteğinde iletilen **XML veya JSON nesneleri** saldırganlar tarafından, sunucuya kötü amaçlı XML dış etkinliklerini ve enjeksiyonlarını taşımak için kullanılabilir.

!!! info "Risk skoru hesaplamasını yapılandırma"
    Risk skoru tahminini faktörlerin önemine göre uyarlamanız gerekiyorsa, her faktörün risk skoru hesaplamasındaki ağırlığını ve hesaplama yöntemini [yapılandırabilirsiniz](../api-discovery/exploring.md#customizing-risk-score-calculation).

[Risk skoru ile nasıl çalışılacağını öğrenin →](../api-discovery/exploring.md#working-with-risk-score)

## API'deki değişiklikleri izleme

API'yi güncellediğinizde ve trafik yapısı ayarlandığında, API Discovery oluşturulan API envanterini günceller.

Şirketinizde birkaç ekip olabilir, farklı programlama dilleri ve çeşitli dil çerçeveleri bulunabilir. Bu nedenle değişiklikler herhangi bir zaman ve farklı kaynaklardan API'ye gelebilir ve bunları kontrol etmek zor olabilir. Güvenlik görevlileri için önemli olan, değişiklikleri olabildiğince hızlı bir şekilde algılamak ve analiz etmektir. Kaçırılması durumunda, bu tür değişiklikler bazı riskler taşıyabilir, örneğin:

* Geliştirme ekibi ayrı bir API ile bir üçüncü taraf kütüphaneyi kullanmaya başlayabilir ve güvenlik uzmanlarını bu konuda bilgilendirmeyebilir. Bu durumda şirket, izlenmeyen ve zafiyetler için kontrol edilmeyen uç noktalar elde eder. Bu uç noktalar, potansiyel saldırı yönleri olabilir.
* PII verileri uç noktaya aktarılmaya başlar. Planlanmamış bir PII transferi, düzenleyici gerekliliklere uyumluluğun ihlaline ve ayrıca itibar risklerine yol açabilir.
* İşletme mantığı için önemli olan uç nokta (örneğin, `/login`, `/order/{order_id}/payment/`), artık çağrılmaz duruma gelmiştir.
* Endpoint'e transfer edilmemesi gereken diğer parametreler, örneğin `is_admin` (birisi uç noktaya erişmeye çalışır ve bunu yönetici hakları ile yapmaya çalışır) uç noktaya aktarılmaya başlar.

Wallarm'ın **API Discovery** modülü kullanarak:

* Değişiklikleri izleyebilir ve mevcut iş süreçlerini bozmadığını kontrol edebilirsiniz.
* Altyapınızda, potansiyel bir tehdit vektörü olabilecek bilinmeyen uç noktaların belirmiş olup olmadığını kontrol etmeye yardımcı olabilir.
* PII ve diğer beklenmedik parametrelerin uç noktalara aktarılmaya başlamadığını kontrol edebilirsiniz.
* API'nizdeki değişiklikler hakkında [tetikleyiciler](../user-guides/triggers/trigger-examples.md#new-endpoints-in-your-api-inventory) ile **API'deki Değişiklikler** koşulu ile bildirimler yapılandırabilirsiniz.

Değişiklik izleme özelliği ile nasıl çalışılacağını [Kullanıcı rehberinde](../api-discovery/exploring.md#tracking-changes-in-api) öğrenin.

## Dış ve dahili API'ler

Dış ağdan erişilebilen uç noktalar ana saldırı yönleri olabilir. Bu yüzden dışarıdan neyin erişilebilir olduğunu görmek ve öncelikle bu uç noktalar üzerinde durmak önemlidir.

Wallarm, keşfedilen API'leri otomatik olarak dış ve iç olarak böler. Host ve tüm uç noktaları, aşağıdakiler üzerinde bulunuyorsa iç olarak kabul edilir:

* Özel bir IP veya yerel IP adresi
* Genel bir üst düzey alan adı (örneğin: localhost, dashboard, vb.)

Diğer durumlarda hostlar dış olarak kabul edilir.

Varsayılan olarak, tüm API hostları (dış ve iç) listesi görüntülenir. Oluşturulan API envanterinde, iç ve dış API'lerinizi ayrı ayrı görüntüleyebilirsiniz. Bunu yapmak için, **Dış** veya **Dahili**'ye tıklamanız yeterlidir.

## Uç noktalardaki değişkenlik

URL'ler çeşitli unsurlar içerebilir, örneğin kullanıcının ID'si gibi:

* `/api/articles/author/author-a-0001`
* `/api/articles/author/author-a-1401`
* `/api/articles/author/author-b-1401`

**API Discovery** modülü böyle unsurları uç nokta yollarında `{parameter_X}` biçimine getirir, bu sayede yukarıdaki örnekte 3 uç noktanız olmaz, bunun yerine bir tanesi olur:

* `/api/articles/author/{parameter_X}`

Uç noktasını tıklayın ve çeşitli parametrelerini genişletin ve çeşitli parametre için otomatik olarak tespit edilen tipi görüntüleyin.

![API Discovery - Yoldaki değişkenlik](../images/about-wallarm-waf/api-discovery/api-discovery-variability-in-path.png)

Algoritmanın yeni trafiği analiz ettiğini unutmayın. Eğer bir anda, birleştirilmesi gereken adresleri görürseniz ancak bu henüz gerçekleşmemişse, zaman verin. Daha fazla veri geldikçe, sistem yeni bulunan desene uyan adreslerle uç noktaları birleştirecektir.

## Otomatik BOLA koruması

Davranışsal saldırılar, adı verilen zafiyeti sömüren [Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi saldırılara hedef olabilir. Bu zafiyet, bir saldırganın bir API isteği aracılığıyla bir nesneye kimlik doğrulaması olmadan erişmesine ve verilerini okumasına veya değiştirmesine olanak sağlar.

BOLA saldırılarının potansiyel hedefleri uç noktalardaki değişkenliklerdir. Wallarm, **API Discovery** modülü tarafından araştırılan uç noktaları arasında otomatik olarak bu tür uç noktaları keşfedebilir ve koruyabilir.

Otomatik BOLA korumasını etkinleştirmek için, [Wallarm Konsolu → **BOLA koruması**](../user-guides/bola-protection.md) bölümüne gidin ve anahtarı etkin duruma getirin:

![BOLA tetikleyici](../images/user-guides/bola-protection/trigger-enabled-state.png)

Her korunan API uç noktası, API envanterinde ilgili simge ile vurgulanır, örnek:

![BOLA tetikleyici](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

API uç noktalarını BOLA oto koruması durumuna göre filtreleyebilirsiniz. İlgili parametre **Diğerleri** filtresi altında mevcuttur.

## Gölge, yetim ve zombi API'ler

API Discovery, gölge (gölge, yetim ve zombi) API'leri ortaya çıkarmanıza izin verir.

Bir **gölge API**, bir organizasyonun altyapısı içinde uygun yetkilendirme veya denetim olmadan var olan belgelenmemiş bir API'yi ifade eder. İşletmeler için risk oluşturlar, çünkü saldırganlar onları kullanarak kritik sistemlere erişebilir, değerli veriler çalabilir veya işlemleri bozabilir ve ayrıca API'lerin genellikle kritik verilere kapıları olduğunu ve bir dizi OWASP API güvenlik açığının API güvenliğini aşmak için istismar edilebileceğini de dikkate almalısınız.

Yüklenen API [belirtimlerinize](../api-discovery/rogue-api.md) göre, gölge API belirtiminizde sunulmayan ancak gerçek trafikte (API Discovery tarafından tespit edilen) bir uç noktadır.

Gölge API'leri Wallarm ile bulduğunuzda, belirtimlerinizi eksik uç noktaları içerecek şekilde güncelleyebilir ve API envanterinizin tam görünümüne yönelik izleme ve güvenlik faaliyetlerinizi daha fazla gerçekleştirebilirsiniz.

Bir **yetim API**, trafik almayan belgelenmiş bir API'yi ifade eder. Yetim API'lerin varlığı, bir doğrulama sürecinin nedeni olabilir. Bu, aşağıdakileri içerir:

* Wallarm trafiğini kontrol ederek trafik gerçekten alınmıyor mu yoksa tüm trafiğin geçtiği şekilde Wallarm düğümlerinin dağıtılması nedeniyle sadece Wallarm düğümlerine görünmez mi olduğunu anlamak için Wallarm trafik kontrol ayarlarını incelemek.
* Belirli uygulamaların bu belirli uç noktalarda herhangi bir trafiği alıp almayacağını veya bunun bir tür yanlış konfigürasyon olup olmayacağını belirlemek.
* Kullanımda olmayan uç noktalara karar verme: önceki uygulama sürümlerinde kullanılmış ve mevcut sürümde kullanılmamış - güvenlik kontrol çabasını azaltmak için belirtimlerden silinmeliler mi?

Bir **zombi API**, herkesin devre dışı bırakıldığını düşündüğü ancak aslında hala kullanımda olan önceki API'leri ifade eder. Onların riskleri, belgelenmemiş (gölge) API ile benzerdir ama daha kötü olabilir çünkü devre dışı bırakmanın nedeni genellikle daha kolay kırılabilen güvensiz tasarımlardır.

Yüklenen API belirtimleriniz açısından, zombi API önceki belirtim versiyonunuzda sunulan, mevcut versiyonda sunulmayan (yani, bu uç noktanın silinme niyeti vardı) ancak hala gerçek trafikte (API Discovery tarafından tespit edilen) bir uç noktadır.

Wallarm ile zombi API bulmanız, uygulamalarınızın API konfigürasyonunu kontrol etme ve gerçekte bu tür uç noktaları devre dışı bırakma nedeni olabilir.

API Discovery modülü, keşfedilen API envanterini müşterilerin sağladığı belirtimlerle karşılaştırarak otomatik olarak gölge, yetim ve zombi API'leri ortaya çıkartır. API belirtimlerinizi [**API Belirtimleri**](../api-discovery/rogue-api.md) bölümünde yüklersiniz ve modül otomatik olarak gölge, yetim ve zombi uç noktalarını vurgular.

![API Discovery - Kaçak API'nin belirtilmesi ve filtrelenmesi](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* [Kaçak API'leri bulmak için karşılaştırma için belirtimlerin nasıl yükleneceğini öğrenin →](../api-discovery/rogue-api.md#revealing-shadow-orphan-and-zombie-api)
* [API Discovery bölümünde bulunan kaçak API'lerin nasıl görüntüleneceğini öğrenin →](../api-discovery/exploring.md#displaying-shadow-and-orphan-api)

## Wallarm Bulutuna yüklenen verilerin güvenliği

API Discovery, trafiğin çoğunu yerel olarak analiz eder. Modül, Wallarm Cloud'a yalnızca keşfedilen uç noktaları, parametre isimleri ve çeşitli istatistiksel verileri (varış süresi, sayıları vb.) gönderir. Tüm veriler güvenli bir kanal üzerinden iletilir: Wallarm Cloud'a istatistikleri yüklemeden önce API Discovery modülü, istek parametrelerinin değerlerini [SHA-256](https://en.wikipedia.org/wiki/SHA-2) algoritması ile hashler.

Cloud tarafında, hashlenmiş veriler istatistiksel analiz için kullanılır (örneğin, aynı parametreler ile taleplerin sayısını sayma).

Diğer veriler (uç nokta değerleri, istek yöntemleri ve parametre isimleri) Wallarm Cloud'a yüklenmeden önce hashlenmez, çünkü hashlerin orijinal haline geri yüklenememesi API envanterinin oluşturulmasını imkansız kılardı.

!!! warning "Önemli"
    Wallarm, Cloud'a parametrelerin belirttiği değerleri göndermez. Sadece uç noktası, parametre isimleri ve onlara dair istatistikler gönderilir.

## API Discovery'yi etkinleştirme ve yapılandırma

`wallarm-appstructure` paketi, Debian 11.x ve Ubuntu 22.04 paketleri dışında tüm [Wallarm düğüm biçimleri](../installation/supported-deployment-options.md) içerisine dahil edilmiştir. Düğüm dağıtımı sırasında, API Discovery modülünü yükler, ancak onu varsayılan olarak devre dışı bırakır.

API Discovery'yi doğru bir şekilde etkinleştirmek ve çalıştırmak için:

1. Wallarm düğümünüzün [desteklenen bir versiyon](../updating-migrating/versioning-policy.md#version-list) olduğundan emin olun.

    API Discovery özelliklerinin tamamına sürekli olarak erişiminiz olması için, `wallarm-appstructure` paketini düzenli olarak güncellemeniz önerilir:


    === "Debian Linux"
        ```bash
        sudo apt update
        sudo apt install wallarm-appstructure
        ```
    === "RedHat Linux"
        ```bash
        sudo yum update
        sudo yum install wallarm-appstructure
        ```
1. [Abonelik planınızın](subscription-plans.md#subscription-plans) **API Discovery**'yi içerdiğinden emin olun. Abonelik planınızı değiştirmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) 'a bir istekte bulunun.
1. API Discovery'yi yalnızca belirli uygulamalar için etkinleştirmek istiyorsanız, bahsi geçen uygulamaların [Uygulamaları ayarlama](../user-guides/settings/applications.md) makalesinde açıklandığı gibi eklendiğinden emin olun.

    Uygulamalar yapılandırılmamışsa, tüm API yapıları bir ağaçta gruplanır.

1. Wallarm Console'dan → **API Discovery** → **Durum** → **Etkin**'e gidin

    ![API Discovery – Ayarlar](../images/about-wallarm-waf/api-discovery/api-discovery-settings.png)

    !!! info "API Discovery ayarlarına erişim"
        Şirketinizin Wallarm hesabının yalnızca yöneticileri API Discovery ayarlarına erişebilir. Bu kitaba erişiminiz yoksa yöneticinizle iletişime geçin.

API Discovery modülü etkinleştirildiğinde, trafik analizine ve API envanteri oluşturmasına başlar. API envanteri, Wallarm Console'un **API Discovery** bölümünde görüntülenir.

## API Discovery hata ayıklama

API Discovery günlüklerini almak ve analiz etmek için aşağıdaki yöntemleri kullanabilirsiniz:

* Eğer Wallarm düğümü kaynak paketlerinden kurulmuşsa: örnekleme içinde standart **journalctl** veya **systemctl** yardımcı programını çalıştırın.

    === "journalctl"
        ```bash
        journalctl -u wallarm-appstructure
        ```
    === "systemctl"
        ```bash
        systemctl status wallarm-appstructure
        ```
* Eğer Wallarm düğümü Docker konteynerinden dağıtılmışsa: konteyner içindeki `/var/log/wallarm/appstructure.log` dosyasını okuyun.
* Eğer Wallarm düğümü, Kubernetes Ingress denetleyicisi olarak dağıtılmışsa: Tarantool ve `wallarm-appstructure` konteynerlerini çalıştıran podun durumunu kontrol edin. Podun durumu **Running** olmalıdır.

    ```bash
    kubectl get po -l app=nginx-ingress,component=controller-wallarm-tarantool
    ```

    `wallarm-appstructure` konteynerinin günlüklerini okuyun:

    ```bash
    kubectl logs -l app=nginx-ingress,component=controller-wallarm-tarantool -c wallarm-appstructure
    ```