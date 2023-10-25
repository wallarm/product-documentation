[variability-in-endpoints-docs]:       ../../about-wallarm/api-discovery.md#variability-in-endpoints
[changes-in-api-docs]:       ../../user-guides/api-discovery.md#tracking-changes-in-api
[bola-protection-for-endpoints-docs]:  ../../about-wallarm/api-discovery.md#automatic-bola-protection

# BOLA (IDOR) Korumasının Konfigürasyonu

Davranışsal saldırılar, [Kırık Nesne Düzeyi Yetkilendirmesi (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi aynı adı taşıyan güvenlik zaafiyetini suiistimal eder. Bu zafiyet, bir saldırganın bir API isteği aracılığıyla bir nesnenin kimliğine erişmesini ve yetkilendirme mekanizmasını atlatarak verilerini okumasını veya değiştirmesini sağlar. Bu makale, uygulamalarınızı BOLA saldırılarına karşı koruma konusunda size yönerge verir.

Varsayılan olarak, Wallarm yalnızca BOLA türündeki zafiyetleri (aynı zamanda IDOR olarak da bilinir) otomatik olarak keşfeder, ancak sömürme girişimlerini algılamaz.

BOLA saldırılarını algılamak ve engellemek için Wallarm ile aşağıdaki seçenekleri kullanabilirsiniz:

* [Manuel olarak **BOLA** tetikleyici oluşturma](#manual-creation-of-bola-trigger)
* [API Discovery modülünü kullanma ve otomatik BOLA korumasını - Wallarm Console UI üzerinden etkinleştirme](#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)

!!! warning "BOLA koruma sınırlamaları"
    Yalnızca Wallarm düğümü 4.2 ve üzeri BOLA saldırı algılama özelliğini destekler.

    Wallarm düğümü 4.2 ve üzeri, yalnızca aşağıdaki istekleri BOLA saldırı belirtileri için analiz eder:

    * HTTP protokolü üzerinden gönderilen istekler.
    * Diğer saldırı türlerinin belirtilerini içermeyen istekler, örneğin, bir BOLA saldırısı olarak değerlendirilmez:

        * Bu istekler [input validation saldırıları](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) belirtileri içerir.
        * Bu istekler [**Oluştur regexp-tabanlı saldırı göstergesi** kurallarındaki](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule) düzenli ifadeyi eşleştirir.

## Gereksinimler

Kaynakları BOLA saldırılarından korumak için, ortamınızın aşağıdaki gereksinimleri karşıladığından emin olun:

* Wallarm düğümünüz 4.2 veya üzeri olmalıdır.
* Filtreleme düğümü bir proxy sunucu veya yük dağıtıcının arkasına konuşlandırılmışsa, gerçek müşteri IP adreslerinin [görüntülenmesini](../using-proxy-or-balancer-en.md) yapılandırın.

## BOLA tetikleyicisinin manuel olarak oluşturulması

Wallarm düğümünün BOLA saldırılarını tanımlaması için:

1. Wallarm Console → **Triggers** ı açın ve **BOLA** tetikleyici kurulumuna devam edin.
1. Bir isteğin BOLA saldırısı olarak tanımlanması için koşulları belirleyin:

    * Belirli bir süre boyunca **aynı IP'den Gelen İsteklerin** sayısı.
    * BOLA saldırılarına karşı korunacak ve belirlenen sayıda istek alacak **URI**. Değer, bir nesneyi kimliğine göre işaret eden bir API uç noktası olmalıdır çünkü bu uç nokta türü potansiyel olarak BOLA saldırılarına açıktır.

        Bir nesneyi tanımlayan PATH parametresini belirtmek için `*` sembolünü kullanın, örneğin:

        ```bash
        example.com/shops/*/financial_info
        ```

        URI, tetikleyici oluşturma penceresindeki [URI constructor](../../user-guides/rules/add-rule.md#uri-constructor) veya [advanced edit form](../../user-guides/rules/add-rule.md#advanced-edit-form) aracılığıyla yapılandırılabilir.

    * (İsteğe Bağlı) BOLA saldırılarına karşı korunacak ve belirlenen sayıda istek alacak [**Uygulama**](../../user-guides/settings/applications.md).

        Eğer birkaç domain için aynı adı kullanıyorsanız, bu filtre **URI** filtresinde atanmış olan uygulamayı göstermesi için önerilir.

    * (İsteğe Bağlı) İstekleri oluşturan bir veya daha fazla **IP**.
1. Tetikleyici tepkilerini seçin:

    * **BOLA olarak İşaretle**. Eşiği aşan istekler BOLA saldırısı olarak işaretlenir ve Wallarm Console'un **Events** bölümünde görüntülenir. Wallarm düğümü bu kötü niyetli istekleri ENGELLEMEZ.
    * Kötü niyetli isteklerin kaynağını oluşturan [**IP adreslerinieno Deny Listesi**](../../user-guides/ip-lists/denylist.md)'ne ekleyin ve engelleme süresini belirleyin.
    
        Wallarm düğümü, deny listesindeki IP'den gelen hem meşru hem de kötü niyetli istekleri (BOLA saldırıları dahil) engeller.
    
    * Kötü niyetli isteklerin kaynağını oluşturan [**IP adreslerini Gray List**](../../user-guides/ip-lists/graylist.md)'e ekleyin ve engelleme süresini belirleyin.
    
        Wallarm düğümü, graylist'teki IP'lerden gelen istekleri yalnızca [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) saldırı belirtilerini içeriyorsa engeller.
        
        !!! info "Graylist'teki IP'lerden kaynaklanan BOLA saldırıları"
            Graylist'teki IP'lerden kaynaklanan BOLA saldırıları engellenmez.
1. Tetikleyiciyi kaydedin ve [Bulut düğümünün senkronizasyonunun](../configure-cloud-node-synchronization-en.md) tamamlanmasını bekleyin (genellikle 2-4 dakika sürer).

Mağaza finansal verilerine yönelik BOLA saldırılarını algılamak ve engellemek için oluşturulan tetikleyici örneği (API uç noktası `https://example.com/shops/{shop_id}/financial_info`):

![BOLA tetikleyici](../../images/user-guides/triggers/trigger-example7.png)

BOLA koruması için farklı filtrelerle birkaç tetikleyici yapılandırabilirsiniz.

## API Discovery tarafından keşfedilen uç noktalar için otomatik BOLA koruması <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Otomatik BOLA koruması, **[API Discovery](../../about-wallarm/api-discovery.md)** modülünü kullanmanız durumunda mevcuttur.

Otomatik korumayı etkinleştirmek için, Wallarm Console → **BOLA koruması**'na gidin ve anahtarı etkin duruma getirin:

![BOLA tetikleyici](../../images/user-guides/bola-protection/trigger-enabled-state.png)

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

**BOLA koruma** bölümü UI, [BOLA otodetection şablonunu düzenleyerek](../../user-guides/bola-protection.md) varsayılan Wallarm davranışını (BOLA saldırı engelleme dahil) ince ayarlamanıza olanak tanır.

## BOLA koruma konfigürasyonunun test edilmesi

1. Belirlenen eşiği aşan bir sayıda istek gönderin (örneğin, `https://example.com/shops/{shop_id}/financial_info` uç noktasına `{shop_id}` değerlerinin değişik olduğu 50 istek):

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/shops/$i/financial_info ; done
    ```
1. Tetikleyici tepkisi **IP Adresini Deny listeye Ekleyin** ise, Wallarm Console → **IP lists** → **Deny list**'e gidin ve kaynak IP adresinin engellendiğini kontrol edin.

    Tetikleyici tepkisi **IP Adresini Gray listeye Ekleyin** ise, Wallarm Console'un **IP lists** → **Gray list** bölümünü kontrol edin.
1. **Events** bölümünü açın ve isteklerin BOLA saldırısı olarak listelendiğini kontrol edin.

    ![BOLA saldırısı UI'da](../../images/user-guides/events/bola-attack.png)

    Yakalanan isteklerin sayısı, tetikleyici eşiği aşıldıktan sonra gönderilen isteklerin sayısına karşılık gelir ([davranışsal saldırıların algılanması hakkında daha fazla detay](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Bu sayı 5'ten fazla ise, örnekleme kullanılır ve detaylar yalnızca ilk 5 isabet için görüntülenir ([request örnekleme hakkında daha fazla bilgi](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    BOLA saldırılarını aramak için `bola` arama tagını kullanabilirsiniz. Tüm filtreler [search use ile ilgili talimatlarda](../../user-guides/search-and-filters/use-search.md) anlatılmıştır.