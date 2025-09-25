# Manuel BOLA Koruması

[Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi davranışsal saldırılar, aynı adlı güvenlik açığından yararlanır. Bu güvenlik açığı, bir saldırganın bir nesneye API isteği ile tanımlayıcısı üzerinden erişmesine ve bir yetkilendirme mekanizmasını atlayarak verilerini okumasına veya değiştirmesine olanak tanır.

## Yapılandırma yöntemi

Abonelik planınıza bağlı olarak, BOLA saldırılarına karşı koruma için aşağıdaki yapılandırma yöntemlerinden biri kullanılabilir:

* Azaltma kontrolleri ([Advanced API Security](../../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)
* Triggers ([Cloud Native WAAP](../../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)

## Azaltma kontrollerine dayalı koruma <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm'ın Advanced API Security [aboneliği](../../about-wallarm/subscription-plans.md#core-subscription-plans) gelişmiş [numaralandırma saldırısı koruması](../../api-protection/enumeration-attack-protection.md) sağlar; buna BOLA saldırılarına karşı koruma da dahildir.

## Trigger tabanlı koruma

### Yapılandırma {#configuring}

Varsayılan olarak, Wallarm yalnızca BOLA türü (IDOR olarak da bilinir) güvenlik açıklarını otomatik olarak keşfeder, ancak bunların sömürü girişimlerini tespit etmez. Aşağıdaki örneği inceleyerek BOLA saldırılarına karşı korumayı nasıl yapılandıracağınızı öğrenin.

Diyelim ki çevrimiçi mağazalar (shops) için e-ticaret platformunuz `wmall-example.com`, barındırdığı her mağazaya ait bilgileri `/shops/<PARTICULAR_SHOP>/` altında tutuyor. Kötü niyetli kişilerin barındırılan tüm mağaza adlarının listesini elde etmesini engellemek istiyorsunuz. Böyle bir liste, listedeki adları değiştirip URL’deki `<PARTICULAR_SHOP>` bölümünü farklılaştıran basit bir komut dosyasıyla elde edilebilir. Bunu önlemek için, mağaza barındırma rotanızda belirli bir zaman aralığındaki istek sayısını sınırlayabilir ve limiti aşan IP’leri engelleyebilirsiniz:

1. Wallarm Console → **Triggers**'ı açın ve yeni bir trigger oluşturma penceresini açın.
1. **BOLA** koşulunu seçin.
1. Eşiği aynı IP'den 30 saniyede 30 istek olarak ayarlayın.

    Bunların örnek değerler olduğunu unutmayın—kendi trafiğiniz için trigger yapılandırırken, meşru kullanım istatistiklerini dikkate alarak bir eşik belirlemelisiniz.

1. **URI** filtresini ekran görüntüsünde gösterildiği gibi ayarlayın; şunları içerecek şekilde:

    * Yolda "herhangi bir tek bileşen" anlamına gelen `*` [wildcard](../../user-guides/rules/rules.md#using-wildcards). Bu, `wmall-example.com/shops/<PARTICULAR_SHOP>/financial_info` adreslerinin tümünü kapsayacaktır.

        ![BOLA trigger](../../images/user-guides/triggers/trigger-example7-4.8.png)

1. Bu durumda şunları kullanmayın: 

    * **Application** filtresi; ancak yalnızca seçili uygulamaların alan adlarını veya belirli uç noktalarını hedefleyen isteklere tepki verecek şekilde trigger'ı kısıtlamak için kullanılabileceğini bilin.
    * **IP** filtresi; ancak yalnızca belirli kaynak IP'lerden gelen isteklere tepki verecek şekilde trigger'ları kısıtlamak için kullanılabileceğini bilin.

1. Trigger tepkisi olarak **Denylist IP address** - `Block for 4 hour` seçeneğini belirleyin. Eşik aşıldığında, Wallarm kaynak IP'yi [denylist](../../user-guides/ip-lists/overview.md)'e ekler ve bu IP'den gelen tüm sonraki istekleri engeller.

    Manuel BOLA koruması tarafından bot IP'si denylist'e alınsa bile, varsayılan olarak Wallarm bu IP'den gelen engellenmiş isteklere ilişkin istatistikleri [görüntüler](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips).

1. **Mark as BOLA** trigger tepkisini seçin. Eşik aşıldıktan sonra alınan istekler BOLA saldırısı olarak işaretlenir ve Wallarm Console'un **Attacks** bölümünde görüntülenir. Bazen, herhangi bir şeyi engellemeden saldırı hakkında bilgi sahibi olmak için sadece bu tepkiyi kullanabilirsiniz.
1. Trigger'ı kaydedin ve [Cloud ve node senkronizasyonunun tamamlanmasını](../configure-cloud-node-synchronization-en.md) bekleyin (genellikle 2-4 dakika sürer).

### Test

!!! info "Ortamınızda test"
    Ortamınızda **BOLA** trigger'ını test etmek için, aşağıdaki trigger ve istekteki alan adını herhangi bir genel alan adıyla değiştirin (örn. `example.com`).

[Yapılandırma](#configuring) bölümünde açıklanan trigger'ı test etmek için:

1. Korumalı URI’ye, yapılandırılan eşiği aşacak sayıda istek gönderin. Örneğin, `https://wmall-example.com/shops/{shop_id}/financial_info` uç noktasına farklı `{shop_id}` değerleriyle 50 istek gönderin:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://wmall-example.com/shops/$i/financial_info ; done
    ```
1. Trigger tepkisi **Denylist IP address** ise, Wallarm Console → **IP lists** → **Denylist**'i açın ve kaynak IP adresinin engellendiğini kontrol edin.

    Trigger tepkisi **Graylist IP address** ise, Wallarm Console'un **IP lists** → **Graylist** bölümünü kontrol edin.
1. **Attacks** bölümünü açın ve isteklerin BOLA saldırısı olarak listelendiğini doğrulayın.

    ![UI'de BOLA saldırısı](../../images/user-guides/events/bola-attack.png)

    Görüntülenen istek sayısı, trigger eşiği aşıldıktan sonra gönderilen istek sayısına karşılık gelir ([davranışsal saldırıların tespiti hakkında daha fazla ayrıntı](../../attacks-vulns-list.md#attack-types)). Bu sayı 5'ten büyükse, istek örneklemesi uygulanır ve istek ayrıntıları yalnızca ilk 5 Hits için görüntülenir ([istek örneklemesi hakkında daha fazla ayrıntı](../../user-guides/events/grouping-sampling.md#sampling-of-hits)).

    BOLA saldırılarını aramak için `bola` arama etiketini kullanabilirsiniz. Tüm filtreler [arama kullanımına ilişkin talimatlarda](../../user-guides/search-and-filters/use-search.md) açıklanmıştır.

### Gereksinimler ve kısıtlamalar

**Gereksinimler**

Kaynakları BOLA saldırılarına karşı korumak için gerçek istemci IP adresleri gereklidir. Filtreleme düğümü bir proxy sunucu veya yük dengeleyicinin arkasına kuruluysa, gerçek istemci IP adreslerinin görüntülenmesini [yapılandırın](../using-proxy-or-balancer-en.md).

**Kısıtlamalar**

BOLA saldırı işaretlerini ararken, Wallarm düğümleri yalnızca diğer saldırı türlerinin işaretlerini içermeyen HTTP isteklerini analiz eder.

## Otomatik koruma  <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Diğer BOLA koruma önlemlerine alternatif olarak veya ek olarak, [API Discovery tarafından bulunan uç noktalar için otomatik BOLA korumasını](protecting-against-bola.md) yapılandırabilirsiniz.