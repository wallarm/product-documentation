# Zorla Tarama Saldırısından Korunma

Zorla tarama saldırısı, Wallarm tarafından kutudan çıkar çıkmaz tespit edilmeyen saldırı türlerinden biridir ve tespiti, bu kılavuzda açıklandığı şekilde uygun şekilde yapılandırılmalıdır.

[Forced browsing](../../attacks-vulns-list.md#forced-browsing) saldırıları, sınırlı bir zaman dilimi boyunca farklı URI'lere yapılan isteklere çok sayıda 404 yanıt kodu döndürülmesiyle karakterize edilir.

Bu saldırının amacı, gizli kaynakları (ör. uygulama bileşenleri hakkında bilgileri içeren dizinler ve dosyalar) sıralamak ve erişmektir. Zorla tarama saldırısı türü, saldırganların uygulama hakkında bilgi toplamasına ve bu bilgiyi kullanarak diğer saldırı türlerini gerçekleştirmesine olanak tanır.

Zorla taramaya karşı korumanın yanı sıra, benzer şekilde [brute-force saldırılara](protecting-against-bruteforce.md) karşı da koruma yapılandırabilirsiniz.

## Yapılandırma

Aşağıdaki örneğe bakarak zorla tarama korumasının nasıl yapılandırılacağını öğrenin.

Diyelim ki, online `book-sale` uygulamasına sahipsiniz. `book-sale-example.com` alanı altındaki gizli dizin ve dosya adlarını kötü niyetli aktörlerin denemesini (zorla tarama saldırısı) engellemek istiyorsunuz. Bu korumayı sağlamak için, alan adınıza gelen belirli bir zaman aralığındaki 404 yanıtı sayısını sınırlayabilir ve bu sınırı aşan IP'leri engelleyecek şekilde ayarlayabilirsiniz:

Bu korumayı sağlamak için:

1. Wallarm Console → **Triggers** bölümünü açın ve tetikleyici oluşturma penceresini açın.
1. **Forced browsing** koşulunu seçin.
1. Aynı kaynak IP'den gelen isteklere döndürülmüş 404 yanıt kodu sayısı eşiğini, 30 saniyede 30 olacak şekilde ayarlayın.

    Dikkat edin, bunlar örnek değerlerdir - kendi trafiğiniz için bir tetikleyici yapılandırırken, meşru kullanım istatistiklerini göz önünde bulundurarak uygun bir eşik belirlemelisiniz.

1. Aşağıdaki gibi **URI** filtresini ayarlayın:

    * Yol içinde yer alan `**` [joker karakter](../../user-guides/rules/rules.md#using-wildcards), "herhangi bir sayıda bileşen" anlamına gelir. Bu, `book-sale-example.com` altındaki tüm adresleri kapsayacaktır.

        ![Forced browsing trigger example](../../images/user-guides/triggers/trigger-example5-4.8.png)

    * Bu örnekte ihtiyaç duyduğunuz deseni yapılandırmanın yanı sıra belirli URI'ler (örneğin, kaynak dosya dizininizin URI'si) girebilir veya herhangi bir URI belirtilmeden tetikleyicinin herhangi bir uç noktada çalışmasını sağlayabilirsiniz.
    * İç içe URI'ler kullanıyorsanız, [tetikleyici işleme önceliklerini](../../user-guides/triggers/triggers.md#trigger-processing-priorities) göz önünde bulundurun.

1. Bu durumda şunları kullanmayın:

    * **Application** filtresi – ancak, yalnızca belirli uygulamaların alan adlarına veya uç noktalarına yönelik isteklere tepki veren tetikleyiciler ayarlamak için kullanabileceğinizi unutmayın.
    * **IP** filtresi – ancak, yalnızca belirli IP'lerden gelen isteklere tepki veren tetikleyiciler ayarlamak için kullanabileceğinizi unutmayın.
    
1. **Denylist IP address** tetikleyici tepkisini seçin – `Block for 4 hour`. Wallarm, eşik aşıldıktan sonra kaynak IP'yi [denylist'e](../../user-guides/ip-lists/overview.md) ekleyecek ve bundan sonraki tüm istekleri engelleyecektir.

    Dikkat edin, bot IP'si zorla tarama koruması tarafından denylist'e eklense bile, varsayılan olarak Wallarm, ondan gelen engellenmiş isteklerin istatistiklerini toplar ve [gösterir](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

1. **Mark as forced browsing** tetikleyici tepkisini seçin. Eşik aşıldıktan sonra gelen istekler zorla tarama saldırısı olarak işaretlenecek ve Wallarm Console'un **Attacks** bölümünde görüntülenecektir. Bazen, saldırı hakkında bilgi edinmek için yalnızca bu tepkiyi almak, herhangi bir şeyi engellememek amacıyla yeterli olabilir.
1. Tetikleyiciyi kaydedin ve [Cloud ve node senkronizasyonunun tamamlanmasını](../configure-cloud-node-synchronization-en.md) bekleyin (genellikle 2-4 dakika sürer).

Zorla tarama koruması için birden fazla tetikleyici yapılandırabilirsiniz.

## Test Etme

!!! info "Ortamınızda Test Etme"
    Ortamınızda **Forced browsing** tetikleyicisini test etmek için, aşağıdaki tetikleyici ve isteklerde, alan adını herhangi bir genel alan adı ile (ör. `example.com`) değiştirin.

[Yapılandırma](#yapılandırma) bölümünde açıklanan tetikleyiciyi test etmek için:

1. Korunan URI'ye yapılandırılan eşik değeri aşan sayıda istek gönderin. Örneğin, `https://book-sale-example.com/config.json` adresine 50 istek gönderin (eşleşme: `https://book-sale-example.com/**.**`):

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://book-sale-example.com/config.json ; done
    ```
2. Eğer tetikleyici tepkisi **Denylist IP address** ise, Wallarm Console → **IP lists** → **Denylist** bölümünü açın ve kaynak IP adresinin engellendiğini kontrol edin.

    Eğer tetikleyici tepkisi **Graylist IP address** ise, Wallarm Console'un **IP lists** → **Graylist** bölümünü kontrol edin.
3. **Attacks** bölümünü açın ve isteklerin zorla tarama saldırısı olarak listelendiğini kontrol edin.

    ![Forced browsing attack in the interface](../../images/user-guides/events/forced-browsing-attack.png)

    Görüntülenen istek sayısı, tetikleyici eşik değerini aştıktan sonra gönderilen istek sayısıyla uyumludur ([davranışsal saldırıların tespiti hakkında daha fazla bilgi](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Bu sayı 5'ten fazla ise, istek örneklemesi uygulanır ve istek detayları yalnızca ilk 5 istek için gösterilir ([istek örneklemesi hakkında daha fazla bilgi](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    Zorla tarama saldırılarını aramak için `dirbust` filtresini kullanabilirsiniz. Tüm filtreler [arama kullanımı yönergelerinde](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

## Gereksinimler ve Kısıtlamalar

**Gereksinimler**

Zorla tarama saldırılarına karşı kaynakları korumak için gerçek istemci IP adresleri gereklidir. Eğer filtreleme düğümü bir proxy sunucusu veya yük dengeleyicinin arkasında dağıtıldıysa, gerçek istemci IP adreslerini gösterecek şekilde [yapılandırın](../using-proxy-or-balancer-en.md).

**Kısıtlamalar**

Zorla tarama saldırısı belirtileri aranırken, Wallarm düğümleri yalnızca diğer saldırı türlerinin belirtilerini taşımayan HTTP isteklerini analiz eder.