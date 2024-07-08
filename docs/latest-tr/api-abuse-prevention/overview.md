# API Kötüye Kullanma Önleme <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm platformunun **API Kötüye Kullanma Önleme** modülü, kimlik bilgisi doldurma, sahte hesap oluşturma, içerik kazıma ve API'larınıza yönelik diğer kötü amaçlı eylemler gerçekleştiren botların algılanmasını ve azaltılmasını sağlar. 

## API Kötüye Kullanma Önleme tarafından engellenecek otomatik tehditler

**API Kötüye Kullanma Önleme** modülü, aşağıdaki bot türlerini varsayılan olarak tespit eder:

* [API kötüye kullanma](../attacks-vulns-list.md#api-abuse)
* [Hesap devralma](../attacks-vulns-list.md#api-abuse-account-takeover)
* [Güvenlik tarama botları](../attacks-vulns-list.md#api-abuse-security-crawlers)
* [Kazıma](../attacks-vulns-list.md#api-abuse-scraping)

[API kötüye kullanma profilinin kurulması](../api-abuse-prevention/setup.md#creating-api-abuse-profile) sırasında, **API Kötüye Kullanma Önleme** modülünü tüm bot türlerinden korumayı veya korumayı yalnızca belirli tehditlerle sınırlamayı yapılandırabilirsiniz.

## API Kötüye Kullanma Önleme nasıl çalışır?

**API Kötüye Kullanma Önleme** modülü, ML tabanlı yöntemlerin yanı sıra istatistiksel ve matematiksel sapma arama yöntemleri ve doğrudan kötüye kullanma hallerini içeren karmaşık bir bot algılama modeli kullanır. Modül, normal trafik profili öğrenir ve dramatik şekilde farklı davranışları sapma olarak belirler.

API Kötüye Kullanma Önleme, kötü amaçlı botları belirlemek için çoklu dedektörler kullanır. Modül, hangi dedektörlerin işaretleme sürecine katıldığı hakkında istatistikler sağlar.

Aşağıdaki detektörlerin katılması mümkün olabilir:

* **İstek Aralığı** ardışık istekler arasındaki zaman aralıklarını analiz ederek bot davranışının belirtisi olan rastgeleliğin eksik olup olmadığını bulur.
* **İstek Tekizliği** bir oturum sırasında ziyaret edilen benzersiz uç nokta sayısını analiz eder. Eğer bir istemci tutarlı bir şekilde düşük oranda benzersiz uç noktaları ziyaret ederse, yani %10 veya daha az, muhtemelen bu bir bot düşünülür, bir insan kullanıcı değil.
* **İstek Oranı** belirli bir zaman aralığında yapılan istek sayısını analiz eder. Eğer bir API istemcisi, belirli bir eşiği aşan bir yüzde oranında istekler yapma huyunda ise, muhtemelen bu bir bot düşünülür, bir insan kullanıcı değil.
* **Kötü Kullanıcı-Agent** isteklere dahil edilen `Kullanıcı-Agent` başlıklarını analiz eder. Bu dedektör, taramacılara, kazıyıcılara ve güvenlik denetleyicilerine ait belirli imzaları kontrol eder. 
* **Eski Tarayıcı** isteklerde kullanılan tarayıcı ve platformu analiz eder. Eğer bir istemci eski veya desteklenmeyen bir tarayıcı veya platform kullanıyorsa, muhtemelen bu bir bot düşünülür, bir insan kullanıcı değil.
* **Şüpheli Davranış Skoru** bir oturum sırasında normal ve anormal iş süreçleri API isteklerinin ise analizini gerçekleştirir. 
* **İş Süreci Skoru** uygulamanızın davranışı bağlamında kritik veya hassas API uç noktalarının kullanımını analiz eder. 
* **Geniş Kapsam** IP etkinliklerinin genişliğini analiz etmek için davranışlarına dayanarak tarama botları gibi botları tanımlar.

!!! bilgi "Güven" 
    Dedektörlerin çalışmasının bir sonucu olarak, her tespit edilen bot, bu bir bot olduğuna ne kadar emin olduğumuzun **yüzdesini**: elde eder. Her bot türünde, dedektörlerin farklı göreceli önemi / oy sayısı vardır. Bu yüzden, güven yüzdesi, bu bot türünde (çalışan dedektörler tarafından sağlanan) tüm olası oydan elde edilen oylardır.

![API Kötüye Kullanma Önleme İstatistikleri](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

Bir ya da daha fazla dedektör [bot saldırı işaretlerini](#automated-threats-blocked-by-api-abuse-prevention) belirtirse, modül anomali trafik kaynağını 1 saat için [reddetme veya gri listelere](#reaction-to-malicious-bots) ekler. Wallarm, son 30 gün içinde red ve gri listelere eklenen bot IP'lerini hesaplar ve bu miktarların önceki 30 günlük döneme göre yüzde kaç arttığını veya azaldığını gösterir.

Çözüm, kötü amaçlı bot eylemleri olarak onlara atfedilmeden önce trafik sapmalarını derinlemesine gözlemler ve onların kökenlerini engeller. Ölçüm toplama ve analiz biraz zaman aldığından, modül ilk kötü amaçlı istek oluşturulduğunda kötü amaçlı botları gerçek zamanlı olarak engellemez, ancak ortalama olarak anormal aktiviteyi önemli ölçüde azaltır.

## API Kötüye Kullanma Önlemenin Aktifleştirilmesi

CDN düğümü de dahil olmak üzere, **API Kötüye Kullanma Önleme** modülü, devre dışı durumda Wallarm düğümü 4.2 ve üst tüm formlarında sunulur.

API Kötüye Kullanmayı önlemeyi etkinleştirmek için:

1. Trafiklerinizin Wallarm düğümü 4.2 veya sonraki bir sürüm tarafından filtrelendiğinden emin olun.
1. [Abonelik planınızın](../about-wallarm/subscription-plans.md) **API Kötüye Kullanma Önlemeyi** içerdiğinden emin olun. Abonelik planını değiştirmek için lütfen [sales@wallarm.com](mailto:sales@wallarm.com) adresine bir talep gönderin.
1. Wallarm Konsolunda → **API Kötüye Kullanma Önleme**, en az bir [API Kötüye Kullanma Profili](../api-abuse-prevention/setup.md) oluşturun veya etkinleştirin.

    !!! bilgi "API Kötüye Kullanma Önlemenin ayarlarına Erişim"
        Şirketinizin Wallarm hesabının yalnızca [yöneticileri](../user-guides/settings/users.md#user-roles), **API Kötüye Kullanma Önleme** bölümüne erişebilir. Bu erişiminiz yoksa yöneticinizle iletişime geçin.

    ![API Kötüye Kullanma Önleme profili](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## Hoş görü

Kötü amaçlı bir botun belirtilerini ne kadar sıkı bir şekilde izlemeyi yapılandırabilir ve böylece yanlış pozitif tespitlerin sayısını kontrol edebilirsiniz. Bu, [API Kötüye Kullanma Profilleri](../api-abuse-prevention/setup.md#creating-api-abuse-profile) içindeki **Hoş görü** parametresi ile ayarlanır.

Üç seviye bulunmaktadır:

* **Düşük** hoşgörüyle botlara, daha AZ bot uygulamalarınıza erişir, ancak bu yanlış pozitifler nedeniyle bazı meşru istekleri engelleyebilir.
* **Normal** hoşgörü, birçok yanlış pozitifi önlemek ve çoğu kötü amaçlı bot isteğinin API'lere ulaşmasını engellemek için en uygun kuralları kullanır.
* **Yüksek** hoşgörüyle botlara, DAHA FAZLA bot uygulamalarınıza erişir, ancak daha sonra hiçbir meşru istek düşmez.

## Kötü amaçlı botlara tepki

API Kötüye Kullanma Önlemeyi, kötü amaçlı botlara aşağıdaki yollarla tepki vermek üzere yapılandırabilirsiniz:

* **Reddedilenler listesine ekle**: Wallarm, seçilen süre boyunca botların IP'lerini [reddeder](../user-guides/ip-lists/denylist.md) (varsayılan değer `Bir gün ekleyin` - 24 saat) ve bu IP'lerin ürettiği tüm trafiği engeller.
* **Gri listeye ekle**: Wallarm, seçilen süre boyunca botların IP'lerini [gri listelere](../user-guides/ip-lists/graylist.md) ekler (varsayılan değer `Bir gün ekleyin` - 24 saat) ve yalnızca bu IP'lerden gelen ve aşağıdaki saldırı belirtilerini içeren istekleri engeller:

    * [Giriş doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
    * [Vpatch türünde saldırılar](../user-guides/rules/vpatch-rule.md)
    * [Düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md)

* **Yalnızca İzle**: Wallarm, tespit edilen bot etkinliğini [**Olaylar**](../user-guides/events/check-attack.md) bölümünde gösterir, ancak botun IP'sini ne red listesine nede gri listeye ekler. 

    Bu tür olay ayrıntılarından, hızlı bir şekilde botu **Kaynak IP'yi reddedilenlere ekleyin** düğmesiyle engelleyebilirsiniz. IP, sonsuza dek reddedilenlere eklenir, ancak **IP Listeleri** bölümünde onu silebilir veya listede kalma süresini değiştirebilirsiniz.

## Kötü amaçlı botlar ve saldırılarına göz atma

Botların etkinliğini Wallarm Console UI'da aşağıdaki şekillerde keşfedebilirsiniz:

* **IP listeleri** bölümünde kötü amaçlı botları inceleyin
* **Olaylar** bölümünde botlar tarafından gerçekleştirilen API kötüye usullerini görüntüleyin

[Botların etkinliğini nasıl keşfedeceğinizi öğrenin →](../api-abuse-prevention/setup.md#exploring-blocked-malicious-bots-and-their-attacks)

## İstisna listesi

Bir istisna listesi, meşru botlar veya taramalarla bilinen şekilde ilişkilendirilen IP adresleri, alt ağlar, konumlar ve kaynak tiplerinin listesidir ve bu nedenle API Kötüye Kullanma Önleme modülünün engelleme veya kısıtlama yapmasından muaftırlar.

IP adreslerini önceden veya zaten yanlışlıkla kötü amaçlı bot etkinliği ile ilişkilendirilmiş olduğu durumlarda istisna listesine ekleyebilirsiniz. [İstisna listesiyle nasıl çalışacağınızı öğrenin →](../api-abuse-prevention/setup.md#working-with-exception-list)

![API Kötüye Kullanma Önleme - İstisna Listesi](../images/about-wallarm-waf/abi-abuse-prevention/exception-list.png)

## Belirli URL'ler ve istekler için bot korumasını devre dışı bırakma

İyi botların IP'lerini [istisna listesi](#exception-list) ile işaretlemenin yanı sıra, bot korumasını, hedeflediği URL'ler için ve belirli istek türleri için, örneğin belirli başlıklar içeren istekler için devre dışı bırakabilirsiniz.

Bu, yanlış pozitif tespitlerden kaçınmaya yardımcı olabilir ve uygulamalarınızı test etme durumunda, bu uygulamaların bazı uç noktaları için bot korumasını geçici olarak devre dışı bırakmanız gerekebilir.

Diğer API Kötüye Kullanma Önleme konfigürasyonu karşılaştırıldığında, bu yetenek **API Kötüye Kullanma** [profili](../api-abuse-prevention/setup.md) içinde değil, ayrı ayrı yapılandırılır - [**Set API Kötüye Kullanma Önleme modu**](../api-abuse-prevention/exceptions.md) kuralının yardımıyla.
