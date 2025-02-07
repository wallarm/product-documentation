# Brute Force Koruması

Brute force saldırısı, Wallarm'ın varsayılan yapılandırmasında tespit edilmeyen saldırı türlerinden biridir; bu kıluzda açıklandığı şekilde tespiti uygun şekilde yapılandırılmalıdır.

[Düzenli brute force saldırıları](../../attacks-vulns-list.md#brute-force-attack) şifre brute forcing, oturum tanımlayıcı brute forcing ve credential stuffing saldırılarını içerir. Bu saldırılar, belirli bir URI'ye sınırlı bir zaman aralığı içerisinde farklı zorlanmış parametre değerleri ile gönderilen çok sayıda istekle karakterize edilir.

Şunu unutmayın:

* Bu makalede açıklanan brute force koruması, Wallarm tarafından sağlanan yük kontrol yöntemlerinden biridir. Alternatif olarak, [rate limiting](../../user-guides/rules/rate-limiting.md) uygulayabilirsiniz. Gelen trafiği yavaşlatmak için rate limiting'i, saldırganı tamamen engellemek için ise brute force korumasını kullanın.
* Brute force korumasının yanı sıra, benzer şekilde [forced browsing](protecting-against-forcedbrowsing.md) korumasını da yapılandırabilirsiniz.

## Yapılandırma

Brute force korumasının nasıl yapılandırılacağını öğrenmek için aşağıdaki örneğe göz atın.

Diyelim ki, kötü niyetli aktörlerin `rent-car` uygulamanıza doğrulama uç noktaları aracılığıyla yetkili erişim elde etmek için çeşitli şifreleri denemelerini engellemek istiyorsunuz (brute force saldırısı). Bu korumayı sağlamak için, doğrulama uç noktalarınızda zaman aralığı başına istek sayısını sınırlayabilir ve bu limiti aşan IP'leri engelleyecek şekilde ayarlayabilirsiniz:

1. Wallarm Console'u açın → **Triggers** ve tetikleyici oluşturma penceresini açın.
1. **Brute force** koşulunu seçin.
1. Aynı IP'den 30 saniyede 30 istek eşiğini ayarlayın.

    Bu değerlerin örnek değerler olduğunu unutmayın - kendi trafiğiniz için tetikleyici yapılandırırken, meşru kullanım istatistiklerini göz önünde bulundurarak bir eşik tanımlamalısınız.

1. **Application** filtresini `rent-car` olarak ayarlayın (uygulamanın Wallarm'da [kayıtlı](../../user-guides/settings/applications.md) olması gerekir).
1. **URI** filtresini ekran görüntüsünde gösterildiği gibi ayarlayın, şunları içerecek şekilde:

    * Yol içinde `**` [joker karakter](../../user-guides/rules/rules.md#using-wildcards) kullanımı, "herhangi sayıda bileşen" anlamına gelir.
    * İstek kısmında `.*login*` [düzenli ifade](../../user-guides/rules/rules.md#condition-type-regex) kullanımı, "uç nokta `login` içerir" demektir.

        Birleştirildiğinde, örneğin şunları kapsar:
        `https://rent-car-example.com/users/login`
        `https://rentappc-example.com/usrs/us/p-login/sq`
        (tüm tetikleyicinin çalışması için, alan adlarının seçilen uygulamaya [bağlanmış](../../user-guides/settings/applications.md#automatic-application-identification) olması gerektiğini unutmayın)

        ![Brute force tetikleyici örneği](../../images/user-guides/triggers/trigger-example6-4.8.png)
    
    * Bu örnekte ihtiyacımız olan deseni yapılandırmanın dışında, belirli URI'leri girebilir veya herhangi bir uç noktada çalışması için hiçbir URI belirtmeden tetikleyici ayarlayabilirsiniz.
    * İç içe URI'ler kullanıyorsanız, [tetikleyici işleme önceliklerini](../../user-guides/triggers/triggers.md#trigger-processing-priorities) göz önünde bulundurun.

1. Bu durumda **IP** filtresini kullanmayın, ancak yalnızca belirli IP'lerden gelen isteklere tepki vermek için kullanabileceğinizi unutmayın.
1. **Denylist IP address** - `Block for 1 hour` tetikleyici tepkisini seçin. Eşiğin aşılmasının ardından, Wallarm, kaynak IP'yi [denylist](../../user-guides/ip-lists/overview.md) listesine ekleyecek ve bundan sonraki tüm istekleri engelleyecektir.

    Not: Bot IP'si brute force koruması tarafından denylist'e yerleştirilse bile, varsayılan olarak Wallarm, buradan kaynaklanan engellenen isteklerle ilgili istatistikleri toplar ve [gösterir](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

1. **Mark as brute force** tetikleyici tepkisini seçin. Eşiğin aşılmasının ardından alınan istekler brute force saldırısı olarak işaretlenecek ve Wallarm Console'un **Attacks** bölümünde görüntülenecektir. Bazı durumlarda, bu tepkiyi yalnızca saldırı hakkında bilgi almak için kullanabilirsiniz, ancak hiçbir şeyi engellemek için değil.
1. Tetikleyiciyi kaydedin ve [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) işleminin tamamlanmasını bekleyin (genellikle 2-4 dakika sürer).

Brute force koruması için birkaç tetikleyici yapılandırabilirsiniz.

## Test Etme

!!! info "Ortamınızda Test Etme"
    Ortamınızda **Brute force** tetikleyiciyi test etmek için, aşağıdaki tetikleyicide ve isteklerde, alan adını herhangi bir genel alan adı (ör. `example.com`) ile değiştirin. Kendi [uygulamanızı](../../user-guides/settings/applications.md) ayarlayın ve alan adını ona bağlayın.

[Yapılandırma](#configuring) bölümünde anlatılan tetikleyiciyi test etmek için:

1. `rent-car-example.com` alan adının, Wallarm'a kayıtlı `rent-car` uygulamasının bir parçası olarak [tanımlandığından](../../user-guides/settings/applications.md#automatic-application-identification) emin olun.
1. Bu alan adının korunan uç noktasına, yapılandırılan eşiği aşan sayıda istek gönderin. Örneğin, `rent-car-example.com/users/login` adresine 50 istek gönderin:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://rent-car-example.com/users/login ; done
    ```
1. Wallarm Console'u açın → **IP lists** → **Denylist** ve kaynak IP adresinin engellendiğini kontrol edin.
1. **Attacks** bölümünü açın ve isteklerin liste içinde brute force saldırısı olarak görüntülendiğini kontrol edin.

    ![Arayüzde brute force saldırısı](../../images/user-guides/events/brute-force-attack.png)

    Görüntülenen istek sayısı, tetikleyici eşiğinin aşılmasından sonra gönderilen istek sayısıyla eşleşir ([davranışsal saldırıları tespit etme hakkında detaylar](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Eğer bu sayı 5'ten fazlaysa, istek örneklemesi uygulanır ve istek detayları yalnızca ilk 5 istek için görüntülenir ([istek örneklemesi hakkında ayrıntılar](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    Brute force saldırılarını aramak için `brute` filtresini kullanabilirsiniz. Tüm filtrelerin açıklaması [arama kullanımı talimatlarında](../../user-guides/search-and-filters/use-search.md) verilmiştir.

## Gereksinimler ve Kısıtlamalar

**Gereksinimler**

Kaynakları brute force saldırılarından korumak için gerçek istemci IP adresleri gereklidir. Eğer filtreleme düğümü bir proxy sunucusu veya yük dengeleyici arkasında dağıtılmışsa, gerçek istemci IP adreslerinin görüntülenmesi için [yapılandırın](../using-proxy-or-balancer-en.md).

**Kısıtlamalar**

Brute force saldırı belirtileri aranırken, Wallarm düğümleri yalnızca diğer saldırı türlerine ait belirtiler içermeyen HTTP isteklerini analiz eder.