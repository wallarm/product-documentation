[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md

[img-analyze-attack]:       ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]:   ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Saldırıları Analiz Etme

Wallarm Console'un **Olaylar** bölümünde saldırıları kontrol edebilirsiniz. Wallarm otomatik olarak ilişkili kötü amaçlı talepleri bir saldırı adı altında gruplar.

## Bir Saldırıyı Analiz Etme

[Saldırıları ve Olayları Kontrol Etme][link-check-attack] başlığındaki tüm tablo sütunlarını inceleyerek bir saldırı hakkında bilgi edinebilirsiniz.

## Bir Saldırıdaki Talepleri Analiz Etme

1. Bir saldırı seçin.
2. *Talepler* sütunundaki sayıya tıklayın.

Sayıya tıklamak seçili saldırıdaki tüm talepleri açar.

![Saldırıdaki Talepler][img-analyze-attack]

Her talep, aşağıdaki sütunlarda ilişkili bilgileri görüntüler:

* *Tarih*: Talebin tarihi ve saati.
* *Yük*: [kötü amaçlı yük][glossary-attack-vector]. Yük sütunundaki değeri tıklamak saldırı türüne ilişkin referans bilgileri görüntüler.
* *Kaynak*: Talebin köken aldığı IP adresi. IP adresini tıklamak, IP adresi değerini arama alanına ekler. IP2Location veya benzeri bir veritabanında bulunursa aşağıdaki bilgiler de görüntülenir:
     * IP adresinin kayıtlı olduğu ülke/bölge.
     * Kaynak türü, örn. **Proxy**, **Tor** veya IP'nin kayıtlı olduğu bulut platformu, vb.
     * Kötü amaçlı faaliyetlerde bulunan bir IP adresi ise **Kötü Amaçlı IP'ler** etiketi görünür. Bu, kamuya açık kayıtlar ve uzman doğrulamalarına dayanmaktadır.
* *Durum*: Talebin engelleme durumu ([trafik filtreleme moduna göre](../../admin-en/configure-wallarm-mode.md) değişiklik gösterir).
* *Kod*: Sunucunun talep için yanıt durum kodu. Filtreleme düğümü talebi engelliyorsa, kod `403` veya başka bir [özel değer](../../admin-en/configuration-guides/configure-block-page-and-code.md) olacaktır.
* *Boyut*: Sunucunun yanıt boyutu.
* *Zaman*: Sunucunun yanıt süresi.

Saldırı şu an gerçekleşiyorsa, talep grafiğinin altında *"şimdi"* etiketi gösterilir.

![Şu anda gerçekleşen bir saldırı][img-current-attack]

Talep görünümü, Wallarm davranışının ince ayarını yapmak için aşağıdaki seçenekleri sağlar:

* [**Yanlış pozitif olarak işaretle** ve **Yanlış**](false-attack.md) talep ögelerine hatalı şekilde uygulanan base64 ayrıştırıcısını belirtmek için **base64'ü devre dışı bırak**.
  
    Buton, ayrıştırıcıyı devre dışı bırakan [kuralı](../rules/disable-request-parsers.md) ayarlamak için önceden doldurulmuş bir form açar.
* Belirli talepleri ele almak için [herhangi bir özel kural](../rules/rules.md#rule) oluşturmak için **Kural**.

    Buton, talep verisiyle doldurulmuş bir kural kurulum formu açar.

* Saldırı, bir [regex tabanlı müşteri kuralı](../../user-guides/rules/regex-rule.md) tarafından algılanmışsa **Özel kurallar tarafından algılandı** bölümü görüntülenir. Bölüm, ilgili kurala (birden fazla olabilir) bağlantı içerir - kural detaylarına erişmek ve gerekirse düzenlemek için bağlantıya tıklayın.

    ![Regex tabanlı müşteri kuralı tarafından algılanan saldırı - kuralı düzenleme](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

    [Bu tür saldırıları nasıl arayacağınızı öğrenin →](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule)

## Ham Formatta Bir Talebi Analiz Etme

Bir talebin ham formatı, en fazla ayrıntı seviyesidir. Wallarm Console'daki ham format görünümü, bir talebin cURL formatında kopyalanmasını da sağlar.

Bir talebi ham formatında görüntülemek için, gerekli bir saldırıyı ve ardından içindeki talebi genişletin.

![Talebin ham formatı][img-analyze-attack-raw]

## Reddedilen IP'lerden talepleri analiz etme

[Reddedilme](../../user-guides/ip-lists/denylist.md), farklı türlerdeki yüksek hacimli saldırılara karşı etkili bir savunma önlemi olarak kanıtlanmıştır. Bu, talepleri işleme sürecinin en erken aşamasında engelleyerek elde edilir. Aynı zamanda, tüm engellenen talepler hakkında kapsamlı bilgi toplamanın eşit derecede önemli olduğu kabul edilir.

Wallarm, reddedilmiş kaynak IP'lerden gelen engellenen taleplere ilişkin istatistikleri toplama ve görüntüleme yeteneği sunar. Bu, reddedilmiş IP'lerden kaynaklanan saldırıların gücünü değerlendirmenizi ve bu IP'lerden gelen taleplerin çeşitli parametrelerini incelemenizi sağlar.

!!! Bilgi "Özellik kullanılabilirliği"
    Özellik, düğüm sürümü 4.8'den itibaren NGINX tabanlı düğümler için mevcuttur. Varsayılan olarak [açıktır](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable).
   
Wallarm'da, bir IP'nin reddedilme listesine girmesi için birkaç yol vardır. Kullanılan yola bağlı olarak, ilişkili olayları [aramak](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) için farklı etiketler/filtreler kullanmanız gerekecektir:

* Kendiniz elle ekler ( **Olaylar** bölümünde, `blocked_source` aramasını veya `Blocked Source` filtresini kullanın)
* Davranışsal bir saldırı gerçekleştirir ve otomatik olarak:
    * [API Abuse Prevention](../../user-guides/ip-lists/denylist.md#automatic-bots-ips-denylisting) modülü tarafından reddedilir (`api_abuse` arama, `API Abuse` filtre)
    * [`Brute force`](../../admin-en/configuration-guides/protecting-against-bruteforce.md) tetikleyici tarafından reddedilir (`brute`, `Brute force`)
    * [`Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md) tetikleyici tarafından reddedilir (`dirbust`, `Forced browsing`)
    * [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md) tetikleyici tarafından reddedilir (`bola`, `BOLA`)
    * `Kötü amaçlı yüklerin sayısı` tetikleyici tarafından reddedilir (`multiple_payloads`, `Multiple payloads`)

Listelenen davranışsal saldırılar, belirli istatistikleri biriken ve buna bağlı olarak tetikleyici eşik değerlerine bağlanır. Böylece, ilk aşamada, reddedilme öncesinde, Wallarm bu bilgileri toplar ancak tüm talepler geçer ve `Monitoring` olayları içinde görüntülenir.

Tetikleyici eşik değerleri aşıldığında, kötü amaçlı aktivite algılandığı kabul edilir ve Wallarm IP'yi reddetme listesine alır, düğüm bu IP'lerden gelen tüm talepleri hemen engeller.

Reddedilmiş IP'lerden gelen talepler hakkında bilgi gönderme etkinleştirildiğinde, bu IP'lerden `Engellenen` talepleri olay listesinde göreceksiniz. Bu, manuel olarak reddedilen IP'ler için de geçerlidir.

![Reddedilen IP'lere ilişkin olaylar - veri gönderme etkin](../../images/user-guides/events/events-denylisted-export-enabled.png)

Reddedilen IP'ler için bir `Monitoring` olayı hiç var olmadığını, arama/filtrelerin her saldırı türü için hem `Monitoring` hem de - bilgi gönderimi etkinleştirilmişse - `Blocked` olayları görüntüleyeceğini unutmayın.

`Engellenen` olaylar içinde, etiketleri reddetme nedenine geçmek için kullanın - BOLA ayarları, API Abuse Prevention, tetikleyici veya reddetme listesindeki kayıt.

## İsabetlerin örnekleme

Kötü amaçlı trafik genellikle karşılaştırılabilir ve aynı [isabetler](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components)den oluşur. Tüm isabetlerin saklanması hem olay analizi süresini hem de Wallarm Bulut üzerindeki yükü artırır.

Isabet örnekleme, benzersiz olmayan isabetlerin Wallarm Buluta yüklenmesini engelleyerek veri depolama ve analizi optimize eder.

!!! UYARI "Düşürülen isabetlerin RPS numarası"
    Düşürülen istekler yine de Wallarm düğümü tarafından işlenen istekler olduğundan, RPS değeri her düşürülen istekle artar.
    
    [Tehdit Önleme kontrol paneli](../dashboards/threat-prevention.md)ndeki istekler ve isabetler sayısı da düşürülen isabetlerin sayısını içerir.

Örnekleme isabeti, saldırı tespitinin kalitesini etkilemez ve yavaşlamasını önlemeye yardımcı olur. Wallarm düğümü, isabet örnekleme etkinleştirildiğinde bile saldırı tespitine ve [engellemeye](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) devam eder.

### Örnekleme algoritmasının etkinleştirilmesi

* [Giriş doğrulama saldırıları](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) için isabet örnekleme varsayılan olarak devre dışıdır. Trafikteki saldırıların yüzdesi yüksekse, isabet örnekleme isabet örnekleme iki ardışık aşama ile gerçekleştirilir: **aşırı** ve **düzenli**.
* [Davranışsal saldırılar](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Veri bombası](../../attacks-vulns-list.md#data-bomb) ve [Kaynak aşırı kullanımı](../../attacks-vulns-list.md#overlimiting-of-computational-resources) saldırıları için: **düzenli** örnekleme algoritması varsayılan olarak etkinleştirilmiştir. **Aşırı** örnekleme, trafikteki saldırıların yüzdesi yüksek olduğunda başlar.
* Reddedilen IP'lerden gelen olaylar için, örnekleme düğüm tarafında ayarlanır. İlk 10 aynı talebi Buluta yüklerken, geri kalan isabetlere bir örnekleme algoritması uygular.

Örnekleme algoritması etkinleştirildiğinde, **Olaylar** bölümünde, **Isabetlerin örneklemesi etkinleştirildi** bildirimi görüntülenir.

Örnekleme, trafikteki saldırıların yüzdesi azaldığında otomatik olarak devre dışı bırakılır.

### Isabet örnekleme temel mantığı

Isabet örnekleme iki ardışık aşamada gerçekleştirilir: **aşırı** ve **düzenli**.

Düzenli algoritma, yalnızca aşırı aşamanın ardından kaydedilen isabetleri işler, aksi takdirde isabetler [davranışsal](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Veri bombası](../../attacks-vulns-list.md#data-bomb) veya [Kaynak aşırı kullanımı](../../attacks-vulns-list.md#overlimiting-of-computational-resources) türündedir. Aşırı örnekleme bu türler için devre dışı bırakılırsa, düzenli algoritma orijinal isabet setini işler.

**Aşırı örnekleme**

Aşırı örnekleme algoritmasının temel mantığı şu şekildedir:

* Isabetler [giriş doğrulama](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) türündeyse, algoritma yalnızca benzersiz [kötü amaçlı yükler](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) içerenleri Buluta yükler. Aynı yük ile bir saat içinde birkaç isabet algılanırsa, yalnızca ilkine Buluta yüklenir ve diğerleri düşürülür.
* Isabetler [davranışsal](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Veri bombası](../../attacks-vulns-list.md#data-bomb) veya [Kaynak aşırı kullanımı](../../attacks-vulns-list.md#overlimiting-of-computational-resources) türündeyse, algoritma bir saat içinde algılananların yalnızca ilk %10'unu Buluta yükler.

**Düzenli örnekleme**

Düzenli örnekleme algoritmasının temel mantığı şu şekildedir:

1. İlk 5 aynı isabet her saat için Wallarm Bulutundaki örnekte saklanır. Diğer isabetler örneklemde saklanmaz, ancak sayıları ayrı bir parametrede kaydedilir.

     İsabetler, aşağıdaki tüm parametrelerin aynı değerlere sahip olması durumunda aynıdır:

     * Saldırı türü
     * Kötü amaçlı yükle ilgili parametre
     * Hedef adres
     * İstek yöntemi
     * Yanıt kodu
     * Köken IP adresi
2. Isabet örnekleri, olay listesindeki [saldırılar](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) a gruplanır.

Gruplanmış isabetler, Wallarm Console'un **Olaylar** bölümünde şu şekilde görüntülenir:

![Düşürülen isabetler](../../images/user-guides/events/bruteforce-dropped-hits.png)

Olay listesini yalnızca örneklenmiş isabetleri görüntüleyecek şekilde filtrelemek için, **Isabetlerin örneklemesi etkinleştirildi** bildirimine tıklayın. `sampled` özelliği arama alanına [eklenir](../search-and-filters/use-search.md#search-for-sampled-hits) ve olay listesi yalnızca örneklenmiş isabetleri görüntüler.

!!! Bilgi "Olay listesinde düşürülen isabetlerin görüntülenmesi"
    Düşürülen isabetler Wallarm Buluta yüklenmediğinden, olay listesinde belli isabetler veya tüm saldırılar olmayabilir.

<!-- ## Demo videoları

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/spD3BnI6fq4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->