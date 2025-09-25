# Brute Force Koruması

Kaba kuvvet (brute force) saldırısı, Wallarm tarafından kutudan çıktığı gibi tespit edilmeyen saldırı türlerinden biridir; bu kılavuzda açıklandığı şekilde tespitinin uygun şekilde yapılandırılması gerekir.

[Düzenli (yaygın) brute force saldırıları](../../attacks-vulns-list.md#brute-force-attack), parola brute forcing, oturum tanımlayıcısı brute forcing ve kimlik bilgisi doldurma (credential stuffing) içerir. Bu saldırılar, sınırlı bir zaman dilimi içinde tipik bir URI’ye farklı zorlanmış parametre değerleriyle gönderilen çok sayıda istekle karakterize edilir.

## Yapılandırma yöntemi

Abonelik planınıza bağlı olarak, brute force koruması için aşağıdaki yapılandırma yöntemlerinden biri kullanılabilir:

* Mitigation controls ([Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)
* Triggers ([Cloud Native WAAP](../../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)

## Azaltma kontrollerine dayalı koruma <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın Advanced API Security [aboneliği](../../about-wallarm/subscription-plans.md#core-subscription-plans), brute force saldırılarına karşı koruma dahil olmak üzere gelişmiş [enumeration attack protection](../../api-protection/enumeration-attack-protection.md) sağlar.

## Tetikleyiciye dayalı koruma

Bu bölümde açıklanan brute force koruması, Wallarm tarafından sağlanan temel yük kontrolü yollarından biridir. Alternatif olarak [hız sınırlandırma](../../user-guides/rules/rate-limiting.md) uygulayabilirsiniz. Gelen trafiği yavaşlatmak için hız sınırlandırmayı, saldırganı tamamen engellemek için brute force korumasını kullanın.

Temel brute force korumasına ek olarak, benzer şekilde [zorla gezinme](protecting-against-forcedbrowsing.md) için de temel koruma yapılandırabilirsiniz.

### Yapılandırma

Brute force korumasını tetikleyicilerle nasıl yapılandıracağınızı öğrenmek için aşağıdaki örneği inceleyin.

Diyelim ki kötü niyetli aktörlerin `rent-car` uygulamanızın kimlik doğrulama uç noktaları üzerinden yetkili erişim elde etmek için çeşitli parolaları denemesini (brute force saldırısı) engellemek istiyorsunuz. Bu korumayı sağlamak için kimlik doğrulama uç noktalarınız için zaman aralığı başına istek sayısını sınırlayabilir ve bu sınırı aşan IP’leri engelleyecek şekilde ayarlayabilirsiniz:

1. Wallarm Console → **Triggers**’ı açın ve tetikleyici oluşturma penceresini açın.
1. **Brute force** koşulunu seçin.
1. 30 saniyede aynı IP’den 30 istek eşiğini ayarlayın.

    Bunların örnek değerler olduğunu unutmayın - tetikleyiciyi kendi trafiğiniz için yapılandırırken, eşiği meşru kullanım istatistiklerinizi dikkate alarak tanımlamalısınız.
    
    !!! info "İzin verilen eşik zaman aralıkları"
        Eşik zaman aralığını ayarlarken, seçilen birime bağlı olarak değer 30 saniyenin veya 10 dakikanın katı olmalıdır.

1. **Application** filtresini `rent-car` olarak ayarlayın (uygulama Wallarm’da [kayıtlı](../../user-guides/settings/applications.md) olmalıdır).
1. **URI** filtresini ekrandaki ekran görüntüsünde gösterildiği gibi aşağıdakileri içerecek şekilde ayarlayın:

    * Yolda “herhangi bir sayıda bileşen” anlamına gelen `**` [joker karakter (wildcard)](../../user-guides/rules/rules.md#using-wildcards)
    * İstek kısmında “uç noktada `login` içerir” anlamına gelen `.*login*` [düzenli ifade](../../user-guides/rules/rules.md#condition-type-regex)

        Birlikte, örneğin şunları kapsar:
        `https://rent-car-example.com/users/login`
        `https://rentappc-example.com/usrs/us/p-login/sq`
        (tüm tetikleyicinin çalışması için alan adlarının seçili uygulamaya [bağlı](../../user-guides/settings/applications.md#automatic-application-identification) olması gerektiğini unutmayın)

        ![Kaba kuvvet tetikleyici örneği](../../images/user-guides/triggers/trigger-example6-4.8.png)
    
    * Bu örnekte ihtiyacımız olan deseni yapılandırmanın yanı sıra, belirli URI’ler girebilir veya herhangi bir URI belirtmeyerek tetikleyicinin herhangi bir uç noktada çalışmasını sağlayabilirsiniz.
    * İç içe URI’ler kullanıyorsanız, [tetikleyici işleme önceliklerini](../../user-guides/triggers/triggers.md#trigger-processing-priorities) dikkate alın.

1. Bu durumda **IP** filtresini kullanmayın, ancak yalnızca belirli IP’lerden gelen isteklere tepki verecek tetikleyiciler ayarlamak için bunu kullanabileceğinizi bilin.
1. **Denylist IP address** - `Block for 1 hour` tetikleyici tepkisini seçin. Eşik aşıldıktan sonra Wallarm kaynak IP’yi [denylist](../../user-guides/ip-lists/overview.md)’e ekleyecek ve ondan gelen tüm sonraki istekleri engelleyecektir.

    Brute force koruması tarafından bot IP’si denylist’e yerleştirilmiş olsa bile, varsayılan olarak Wallarm ondan gelen engellenen isteklere ilişkin istatistikleri toplar ve [görüntüler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

1. **Mark as brute force** tetikleyici tepkisini seçin. Eşik aşıldıktan sonra alınan istekler brute force saldırısı olarak işaretlenecek ve Wallarm Console’un **Attacks** bölümünde görüntülenecektir. Bazı durumlarda, bu tepkiyi tek başına kullanarak saldırı hakkında bilgi edinebilir, ancak hiçbir şeyi engellemezsiniz.
1. Tetikleyiciyi kaydedin ve [Bulut ve düğüm senkronizasyonunun tamamlanmasını](../configure-cloud-node-synchronization-en.md) bekleyin (genellikle 2-4 dakika sürer).

Brute force koruması için birden fazla tetikleyici yapılandırabilirsiniz.

### Test

!!! info "Ortamınızda test etme"
    **Brute force** tetikleyicisini ortamınızda test etmek için, aşağıdaki tetikleyicide ve isteklerde alan adını herhangi bir genel alan adıyla (ör. `example.com`) değiştirin. Kendi [uygulamanızı](../../user-guides/settings/applications.md) ayarlayın ve alan adını ona bağlayın.

[**Yapılandırma**](#configuring) bölümünde açıklanan tetikleyiciyi test etmek için:

1. `rent-car-example.com` alan adının, Wallarm’da kayıtlı `rent-car` uygulamasının bir parçası olarak [tanımlandığından](../../user-guides/settings/applications.md#automatic-application-identification) emin olun.
1. Bu alan adının korunan uç noktasına, yapılandırılan eşiği aşan sayıda istek gönderin. Örneğin, `rent-car-example.com/users/login` adresine 50 istek:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://rent-car-example.com/users/login ; done
    ```
1. Wallarm Console → **IP lists** → **Denylist**’i açın ve kaynak IP adresinin engellendiğini kontrol edin.
1. **Attacks** bölümünü açın ve isteklerin listede bir brute force saldırısı olarak görüntülendiğini kontrol edin.

    ![Arayüzde brute force saldırısı](../../images/user-guides/events/brute-force-attack.png)

    Görüntülenen istek sayısı, tetikleyici eşiği aşıldıktan sonra gönderilen istek sayısına karşılık gelir ([davranışsal saldırıların tespiti hakkında daha fazla bilgi](../../attacks-vulns-list.md#attack-types)). Bu sayı 5’ten büyükse, istek örneklemesi uygulanır ve istek ayrıntıları yalnızca ilk 5 hit için görüntülenir ([istek örneklemesi hakkında daha fazla bilgi](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    Brute force saldırılarını aramak için `brute` filtresini kullanabilirsiniz. Tüm filtreler [arama kullanımına ilişkin talimatlarda](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

### Gereksinimler ve kısıtlamalar

**Gereksinimler**

Kaynakları brute force saldırılarına karşı korumak için gerçek istemci IP adresleri gereklidir. Filtreleme düğümü bir proxy sunucusunun veya yük dengeleyicinin arkasına konuşlandırıldıysa, gerçek istemci IP adreslerini görüntülemek için [yapılandırın](../using-proxy-or-balancer-en.md).

**Kısıtlamalar**

Brute force saldırısı belirtilerini ararken, Wallarm düğümleri yalnızca diğer saldırı türlerinin belirtilerini içermeyen HTTP isteklerini analiz eder.