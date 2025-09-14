# Zorla Gezintiye Karşı Koruma

Zorla gezinti saldırısı, Wallarm tarafından varsayılan olarak tespit edilmeyen saldırı türlerinden biridir; tespiti bu kılavuzda açıklandığı şekilde uygun şekilde yapılandırılmalıdır.

[Zorla gezinti](../../attacks-vulns-list.md#forced-browsing) saldırıları, sınırlı bir zaman aralığında farklı URI’lere yapılan isteklere 404 yanıt kodlarının yüksek sayıda dönmesi ile karakterize edilir.
    
Bu saldırı, gizli kaynakları (ör. uygulama bileşenlerine ilişkin bilgileri içeren dizinler ve dosyalar) numaralandırmayı ve bunlara erişmeyi amaçlar. Zorla gezinti saldırı türü genellikle saldırganların uygulama hakkında bilgi toplamasına ve bu bilgiyi kötüye kullanarak diğer saldırı türlerini gerçekleştirmesine olanak tanır.

## Yapılandırma yöntemi

Abonelik planınıza bağlı olarak, kaba kuvvet koruması için aşağıdaki yapılandırma yöntemlerinden biri kullanılabilir:

* Mitigation kontrolleri ([Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)
* Triggers ([Cloud Native WAAP](../../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)

## Mitigation kontrolüne dayalı koruma <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın Advanced API Security [aboneliği](../../about-wallarm/subscription-plans.md#core-subscription-plans), zorla gezinti saldırılarına karşı koruma da dahil olmak üzere gelişmiş [numaralandırma saldırı koruması](../../api-protection/enumeration-attack-protection.md) sağlar.

## Trigger tabanlı koruma

### Configuring

Aşağıdaki örneği inceleyerek zorla gezinti korumasını nasıl yapılandıracağınızı öğrenin.

Diyelim ki çevrimiçi `book-sale` uygulamasına sahipsiniz. `book-sale-example.com` alan adınız altında gizli dizin ve dosya adlarını denemeye çalışan kötü niyetli aktörleri (zorla gezinti saldırısı) engellemek istiyorsunuz. Bu korumayı sağlamak için alan adınız için belirli bir zaman aralığında 404 yanıtlarının sayısını sınırlayabilir ve bu limiti aşan IP’leri engelleyecek şekilde ayarlayabilirsiniz:

Bu korumayı sağlamak için:

1. Wallarm Console → **Triggers**’ı açın ve tetikleyici oluşturma penceresini açın.
1. **Forced browsing** koşulunu seçin.
1. Aynı kaynak IP’den gelen isteklere dönen 404 yanıt kodları sayısı için eşiği 30 saniyede 30 olarak ayarlayın.

    Bunların örnek değerler olduğunu unutmayın - kendi trafiğiniz için tetikleyiciyi yapılandırırken, meşru kullanım istatistiklerinizi dikkate alarak bir eşik tanımlamalısınız.
    
    !!! info "İzin verilen eşik zaman aralıkları"
        Eşik zaman aralığını ayarlarken, seçilen birime bağlı olarak değer 30 saniyenin veya 10 dakikanın katı olmalıdır.

1. **URI** filtresini aşağıdaki ekran görüntüsünde gösterildiği gibi ayarlayın; şunları içerecek şekilde:

    * Yolda "bileşen sayısı sınırsız" anlamına gelen `**` [joker karakteri](../../user-guides/rules/rules.md#using-wildcards). Bu, `book-sale-example.com` altındaki tüm adresleri kapsar.

        ![Zorla gezinti tetikleyicisi örneği](../../images/user-guides/triggers/trigger-example5-4.8.png)

    * Bu örnekte ihtiyaç duyduğumuz deseni yapılandırmanın yanı sıra, belirli URI’ler girebilir (örneğin, kaynak dosya dizininizin URI’si) veya herhangi bir URI belirtmeyerek tetikleyicinin tüm uç noktalarda çalışmasını sağlayabilirsiniz.
    * İç içe URI’ler kullanıyorsanız, [tetikleyici işleme önceliklerini](../../user-guides/triggers/triggers.md#trigger-processing-priorities) göz önünde bulundurun.

1. Bu durumda şunları kullanmayın: 

    * **Application** filtresi, ancak seçili uygulamaların alan adlarını veya belirli uç noktalarını hedefleyen isteklere yalnızca tepki verecek şekilde tetikleyiciler ayarlamak için bunu kullanabileceğinizi unutmayın.
    * **IP** filtresi, ancak belirli IP’lerden gelen isteklere yalnızca tepki verecek şekilde tetikleyiciler ayarlamak için bunu kullanabileceğinizi unutmayın.

1. **Denylist IP address** - `Block for 4 hour` tetikleyici tepkisini seçin. Eşik aşıldığında Wallarm, kaynak IP’yi [denylist](../../user-guides/ip-lists/overview.md) listesine ekleyecek ve bundan sonraki tüm istekleri engelleyecektir.

    Bot IP’si zorla gezinti koruması tarafından denylist’e eklense bile, varsayılan olarak Wallarm, ondan gelen engellenen isteklere ilişkin istatistikleri toplar ve [görüntüler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

1. **Mark as forced browsing** tetikleyici tepkisini seçin. Eşik aşıldıktan sonra alınan istekler zorla gezinti saldırısı olarak işaretlenecek ve Wallarm Console’un **Attacks** bölümünde görüntülenecektir. Bazen, herhangi bir şeyi engellemeden saldırı hakkında bilgi sahibi olmak için bu tepkiyi tek başına kullanabilirsiniz.
1. Tetikleyiciyi kaydedin ve [Cloud ve node senkronizasyonunun tamamlanmasını](../configure-cloud-node-synchronization-en.md) bekleyin (genellikle 2-4 dakika sürer).

Zorla gezinti koruması için birden fazla tetikleyici yapılandırabilirsiniz.

### Test

!!! info "Ortamınızda test"
    Kendi ortamınızda **Forced browsing** tetikleyicisini test etmek için, aşağıdaki tetikleyicide ve isteklerde alan adını herkese açık herhangi biriyle (ör. `example.com`) değiştirin.

[Configuring](#configuring) bölümünde açıklanan tetikleyiciyi test etmek için:

1. Korumalı URI’ye, yapılandırılmış eşiği aşacak sayıda istek gönderin. Örneğin, `https://book-sale-example.com/config.json` adresine 50 istek ( `https://book-sale-example.com/**.**` ile eşleşir):

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://book-sale-example.com/config.json ; done
    ```
2. Tetikleyici tepkisi **Denylist IP address** ise, Wallarm Console → **IP lists** → **Denylist**’i açın ve kaynak IP adresinin engellendiğini kontrol edin.

    Tetikleyici tepkisi **Graylist IP address** ise, Wallarm Console’un **IP lists** → **Graylist** bölümünü kontrol edin.
3. **Attacks** bölümünü açın ve isteklerin zorla gezinti saldırısı olarak listede görüntülendiğini kontrol edin.

    ![Arayüzde zorla gezinti saldırısı](../../images/user-guides/events/forced-browsing-attack.png)

    Görüntülenen istek sayısı, tetikleyici eşiği aşıldıktan sonra gönderilen istek sayısına karşılık gelir ([davranışsal saldırıların tespiti hakkında daha fazla bilgi](../../attacks-vulns-list.md#attack-types)). Bu sayı 5’ten büyükse, istek örnekleme uygulanır ve istek ayrıntıları yalnızca ilk 5 hit için görüntülenir ([istek örnekleme hakkında daha fazla bilgi](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    Zorla gezinti saldırılarını aramak için `dirbust` filtresini kullanabilirsiniz. Tüm filtreler [arama kullanımına ilişkin talimatlarda](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

### Gereksinimler ve kısıtlamalar

**Gereksinimler**

Kaynakları zorla gezinti saldırılarından korumak için gerçek istemci IP adresleri gereklidir. Filtreleme node’u bir proxy sunucusunun veya yük dengeleyicinin arkasına konuşlandırılmışsa, gerçek istemci IP adreslerinin görüntülenmesini [yapılandırın](../using-proxy-or-balancer-en.md).

**Kısıtlamalar**

Zorla gezinti saldırısı işaretlerini ararken, Wallarm node’ları yalnızca diğer saldırı türlerinin işaretlerini içermeyen HTTP isteklerini analiz eder.