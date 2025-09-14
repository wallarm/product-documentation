[variability-in-endpoints-docs]:       ../../api-discovery/exploring.md#variability
[changes-in-api-docs]:       ../../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../../api-discovery/bola-protection.md

# API Discovery tarafından bulunan uç noktalar için Otomatik BOLA Koruması <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, [API Discovery](../../api-discovery/overview.md) (APID) tarafından keşfedilen uç noktalar için otomatik BOLA korumasını açıklar.

!!! info "Diğer BOLA koruma önlemleri"
    Alternatif olarak veya ek olarak, [tetikleyicilerle BOLA koruması](protecting-against-bola-trigger.md) yapılandırabilirsiniz.

--8<-- "../include/bola-intro.md"

## Koruma mantığı

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## Yapılandırma

!!! info "API Discovery gerekli"
    Otomatik BOLA koruması, **[API Discovery](../../api-discovery/overview.md)** modülünü kullanıyorsanız kullanılabilir.

Otomatik korumayı etkinleştirmek için Wallarm Console → **BOLA protection** bölümüne gidin ve anahtarı etkin konuma getirin:

![BOLA tetikleyici](../../images/user-guides/bola-protection/trigger-enabled-state.png)

Ardından, BOLA otomatik algılama şablonunu aşağıdaki gibi düzenleyerek varsayılan Wallarm davranışını ince ayar yapabilirsiniz:

* Aynı IP'den gelen isteklerin BOLA saldırıları olarak işaretlenmesi için eşiği değiştirin.
* Eşik aşıldığında tepkiyi değiştirin:

    * **Denylist IP** - Wallarm, BOLA saldırı kaynağının IP’lerini [denylist](../../user-guides/ip-lists/overview.md)’e alır ve böylece bu IP’lerin ürettiği tüm trafiği engeller.
    * **Graylist IP** - Wallarm, BOLA saldırı kaynağının IP’lerini [graylist](../../user-guides/ip-lists/overview.md)’e alır ve böylece bu IP’lerden gelen yalnızca kötü amaçlı istekleri ve yalnızca filtreleme düğümü safe blocking [mode](../../admin-en/configure-wallarm-mode.md) içindeyse engeller.

![BOLA tetikleyici](../../images/user-guides/bola-protection/trigger-template.png)

## Devre dışı bırakma

Otomatik BOLA korumasını devre dışı bırakmak için **BOLA protection** bölümünde anahtarı devre dışı konuma getirin.

API Discovery aboneliğinizin süresi dolduğunda, otomatik BOLA koruması otomatik olarak devre dışı bırakılır.