# Manuel BOLA Koruması

Davranışsal saldırılar, [Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi saldırılar, aynı adı taşıyan güvenlik açığından yararlanır. Bu makale, [WAAP](../../about-wallarm/waap-overview.md)'nin tetikleyicileri tarafından sağlanan BOLA koruma önlemlerini tanımlar.

!!! info "Diğer BOLA koruma önlemleri"
    Alternatif olarak veya ek olarak, [API Keşfi tarafından bulunan uç noktalar için Otomatik BOLA korumasını](protecting-against-bola.md) yapılandırabilirsiniz.

## Yapılandırma

Varsayılan olarak, Wallarm yalnızca BOLA tipi (IDOR olarak da bilinir) güvenlik açıklarını keşfeder, ancak bu açığın sömürülme girişimlerini tespit etmez. Aşağıdaki örneği, BOLA saldırılarından korunmayı yapılandırmak için nasıl ayarlama yapacağınızı öğrenmek üzere göz önünde bulundurun.

Diyelim ki online mağazalar için e-ticaret platformunuz `wmall-example.com`, barındırılan her mağazanın bilgilerini `/shops/<PARTICULAR_SHOP>/` altında saklıyor. Kötü niyetli aktörlerin, barındırılan tüm mağaza isimlerinin listesini elde etmesini engellemek istiyorsunuz. Bu liste, URL'deki `<PARTICULAR_SHOP>` ifadesini değiştirerek, listede yer alan isimler üzerinde oynama yapan basit bir betik aracılığıyla elde edilebilir. Bunu önlemek için, mağaza barındırma yolunuzda belirli bir zaman dilimindeki istek sayısını sınırlandırabilir ve bu limiti aşan IP adreslerini engelleyecek şekilde ayarlayabilirsiniz:

1. Wallarm Console'u açın → **Triggers** ve tetikleyici oluşturma penceresini açın.
1. **BOLA** koşulunu seçin.
1. Aynı IP'den 30 saniyede 30 istek eşik değerini ayarlayın.

    Bu değerler örnek değerlerdir - Kendi trafiğiniz için tetikleyiciyi yapılandırırken meşru kullanım istatistiklerini dikkate alarak bir eşik tanımlamalısınız.

1. Ekran görüntüsünde gösterildiği gibi, **URI** filtresini aşağıdakileri içerecek şekilde ayarlayın:

    * Yol içinde `*` [joker karakter](../../user-guides/rules/rules.md#using-wildcards) kullanın; bu, "herhangi bir bileşen" anlamına gelir. Bu, tüm `wmall-example.com/shops/<PARTICULAR_SHOP>/financial_info` adreslerini kapsayacaktır.

        ![BOLA trigger](../../images/user-guides/triggers/trigger-example7-4.8.png)

1. Bu durumda şunları kullanmayın:

    * **Application** filtresi – ancak, yalnızca seçili uygulamaların alan adlarına veya belirli uç noktalara yönelik isteklerde tetikleyici ayarlamak için kullanılabileceğinin farkında olun.
    * **IP** filtresi – ancak, yalnızca belirli IP'lerden gelen isteklere tepki vermek üzere tetikleyici ayarlamak için kullanılabileceğinin farkında olun.
1. **Denylist IP address** - `Block for 4 hour` tetikleyici tepkisini seçin. Wallarm, eşik aşıldıktan sonra kaynak IP'yi [denylist](../../user-guides/ip-lists/overview.md) listesine ekler ve bundan sonraki tüm istekleri engeller.

    Unutmayın, manuel BOLA koruması ile bot IP denylist'e eklenmiş olsa bile, varsayılan olarak Wallarm, bu IP'den kaynaklanan engellenen isteklere ilişkin istatistikleri [gösterir](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

1. **Mark as BOLA** tetikleyici tepkisini seçin. Eşik aşıldıktan sonra alınan istekler BOLA saldırısı olarak işaretlenecek ve Wallarm Console'un **Attacks** bölümünde görüntülenecektir. Bazen, bu tepkiyi saldırı hakkında bilgi sahibi olmak için tek başına kullanabilirsiniz, ancak hiçbir şeyi engellemek için kullanamazsınız.
1. Tetikleyiciyi kaydedin ve [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) tamamlanmasını bekleyin (genellikle 2-4 dakika sürer).

## Test Etme

!!! info "Ortamınızda Test Etme"
    Ortamınızda **BOLA** tetikleyicisini test etmek için, aşağıdaki tetikleyici ve isteklerdeki alan adını herhangi bir genel alan adı ile değiştirin (örn. `example.com`).

[Configuring](#yapilandirma) bölümünde açıklanan tetikleyiciyi test etmek için:

1. Korunan URI'ye yapılandırılan eşik değerini aşan sayıda istek gönderin. Örneğin, endpoint `https://wmall-example.com/shops/{shop_id}/financial_info`'a, farklı `{shop_id}` değerleri ile 50 istek gönderin:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://wmall-example.com/shops/$i/financial_info ; done
    ```
1. Eğer tetikleyici tepkisi **Denylist IP address** ise, Wallarm Console'a gidin → **IP lists** → **Denylist** ve kaynak IP adresinin engellendiğini kontrol edin.

    Eğer tetikleyici tepkisi **Graylist IP address** ise, Wallarm Console'da **IP lists** → **Graylist** bölümünü kontrol edin.
1. **Attacks** bölümünü açın ve isteklerin listede BOLA saldırısı olarak görüntülendiğini kontrol edin.

    ![BOLA attack in the UI](../../images/user-guides/events/bola-attack.png)

    Görüntülenen istek sayısı, tetikleyici eşik aşıldıktan sonra gönderilen istek sayısına karşılık gelir ([davranışsal saldırıların tespiti hakkında daha fazla ayrıntı](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Bu sayı 5'ten fazla ise, istek örneklemesi uygulanır ve istek ayrıntıları yalnızca ilk 5 istek için görüntülenir ([istek örneklemesi hakkında daha fazla ayrıntı](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    BOLA saldırılarını aramak için `bola` arama etiketini kullanabilirsiniz. Tüm filtreler [arama kullanımı talimatlarında](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

## Gereksinimler ve Kısıtlamalar

**Gereksinimler**

BOLA saldırılarına karşı kaynakları korumak için, gerçek istemci IP adresleri gereklidir. Eğer filtreleme düğümü bir proxy sunucu veya yük dengeleyici arkasında dağıtıldıysa, gerçek istemci IP adreslerinin görüntülenmesini [configure](../using-proxy-or-balancer-en.md) edin.

**Kısıtlamalar**

BOLA saldırı belirtilerini ararken, Wallarm düğümleri yalnızca diğer saldırı tiplerine ait belirtileri içermeyen HTTP isteklerini analiz eder.