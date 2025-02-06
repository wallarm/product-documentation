[variability-in-endpoints-docs]:       ../../api-discovery/exploring.md#variability
[changes-in-api-docs]:       ../../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../../api-discovery/bola-protection.md

# API Discovery Tarafından Bulunan Uç Noktalar için Otomatik BOLA Koruması <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, [API Discovery](../../api-discovery/overview.md) (APID) modülü tarafından bulunan uç noktalar için otomatik BOLA korumasını açıklamaktadır.

!!! info "Diğer BOLA koruma önlemleri"
    Alternatif olarak veya ek olarak, [BOLA korumasını tetikleyicilerle](protecting-against-bola-trigger.md) yapılandırabilirsiniz.

--8<-- "../include/bola-intro.md"

## Koruma Mantığı

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## Yapılandırma

!!! info "API Discovery gerekli"
    Otomatik BOLA koruması, **[API Discovery](../../api-discovery/overview.md)** modülünü kullanıyorsanız mevcuttur.

Otomatik korumayı etkinleştirmek için, Wallarm Console → **BOLA protection** bölümüne gidin ve anahtarı etkin konuma getirin:

![BOLA trigger](../../images/user-guides/bola-protection/trigger-enabled-state.png)

Ardından, BOLA otomatik algılama şablonunu aşağıdaki gibi düzenleyerek varsayılan Wallarm davranışını ince ayar yapabilirsiniz:

* Aynı IP'den gelen isteklerin BOLA saldırıları olarak işaretlenmesi için eşiği değiştirin.
* Eşik aşıldığında tepkiyi değiştirin:

    * **Denylist IP** - Wallarm, BOLA saldırı kaynağının IP'lerini [denylist](../../user-guides/ip-lists/overview.md) yapacak ve bu sayede bu IP'lerden gelen tüm trafiği engelleyecektir.
    * **Graylist IP** - Wallarm, BOLA saldırı kaynağının IP'lerini [graylist](../../user-guides/ip-lists/overview.md) yapacak ve bu sayede yalnızca zararlı istekleri, yalnızca filtreleme düğümü güvenli engelleme [modunda](../../admin-en/configure-wallarm-mode.md) ise engelleyecektir.

![BOLA trigger](../../images/user-guides/bola-protection/trigger-template.png)

## Devre Dışı Bırakma

Otomatik BOLA korumasını devre dışı bırakmak için, **BOLA protection** bölümünde anahtarı devre dışı konuma getirin.

API Discovery aboneliğiniz sona erdiğinde, otomatik BOLA koruması otomatik olarak devre dışı bırakılır.