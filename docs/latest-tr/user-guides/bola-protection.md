[variability-in-endpoints-docs]:       ../api-discovery/overview.md#variability-in-endpoints
[changes-in-api-docs]:       api-discovery.md#tracking-changes-in-api
[bola-protection-for-endpoints-docs]:  ../api-discovery/overview.md#automatic-bola-protection

# BOLA Koruması <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

**BOLA Koruması** bölümü, Wallarm Konsol Arayüzünde, **API Keşif** modülü tarafından keşfedilen API endpointlerine yönelik [BOLA (IDOR) saldırıları](../attacks-vulns-list.md#broken-object-level-authorization-bola) hafifletmek için ayarlamalar yapmanıza olanak sağlar.

Bu bölüm, aşağıdaki koşullar altında mevcuttur:

* [API Keşif](../api-discovery/overview.md) modülü etkindir
* Kullanıcı [rolü](settings/users.md#user-roles) ya **Yönetici** ya da **Global Yönetici'dir**
  
    Bu bölüm ayrıca **Analizciler** ve **Global Analizciler** içinde salt okunur modda mevcuttur.

!!! bilgi "BOLA hafifletme varyasyonları"

    BOLA hafifletme aşağıdaki varyasyonlarda mevcuttur:

    * **API Keşif** modülü tarafından keşfedilen endpointler için otomatik hafifletme (bu makalede ayar arayüzü anlatılıyor)
    * Wallarm düğümleri tarafından korunan herhangi bir endpoint için hafifletme - bu seçenek ilgili tetikleyici aracılığıyla manuel olarak ayarlanır

    Daha fazla ayrıntıyı, [BOLA (IDOR) korumasına genel talimatlarda](../admin-en/configuration-guides/protecting-against-bola.md) bulabilirsiniz.

## Otomatik BOLA Korumasını Ayarlama

Wallarm'ın, API Keşif modülü tarafından keşfedilen endpointlerdeki BOLA zafiyetlerini analiz edip risk altındaki endpointleri koruması için, **anahtarı etkin duruma getirin**.

![BOLA tetikleyici](../images/user-guides/bola-protection/trigger-enabled-state.png)

Sonra BOLA otomatik algılama şablonunu düzenleyerek varsayılan Wallarm davranışını aşağıdaki şekilde ayarlayabilirsiniz:

* Aynı IP'den gelen isteklerin BOLA saldırıları olarak işaretlenmesi için eşiği değiştirin.
* Eşiği aşma durumunda tepkiyi değiştirin:

    * **IP'yi Karalisteye Al** - Wallarm, BOLA saldırısının kaynağının IP'lerini [karalisteye](ip-lists/denylist.md) alacak ve bu nedenle bu IP'lerin ürettiği tüm trafiği engelleyecektir.
    * **IP'yi Gri Listeye Al** - Wallarm, BOLA saldırısının kaynağının IP'lerini [grilisteye](ip-lists/graylist.md) alacak ve bu nedenle bu IP'lerden gelen yalnızca zararlı istekleri engelleyecektir ve bu sadece filtreleme düğümü güvenli engelleme [modunda](../admin-en/configure-wallarm-mode.md) ise.

![BOLA tetikleyici](../images/user-guides/bola-protection/trigger-template.png)

## Otomatik BOLA Koruması Mantığı

--8<-- "../include-tr/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## Otomatik BOLA Korumasını Devre Dışı Bırakma

Otomatik BOLA korumasını devre dışı bırakmak için, **BOLA Koruması** bölümünde anahtarı devre dışı duruma getirin.

API Keşif aboneliğinizin süresi dolduğunda, otomatik BOLA koruması otomatik olarak devre dışı bırakılır.