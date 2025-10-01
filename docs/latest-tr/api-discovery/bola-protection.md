# BOLA Saldırılarına Karşı Otomatik Koruma <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Kırık Nesne Düzeyi Yetkilendirme (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi davranışsal saldırılar, aynı adlı zafiyetten yararlanır. Bu zafiyet, bir saldırganın bir API isteği aracılığıyla bir nesneye tanımlayıcısıyla erişmesine ve yetkilendirme mekanizmasını atlayarak verilerini okumasına veya değiştirmesine olanak tanır.

BOLA saldırılarının potansiyel hedefleri, değişkenliğe sahip uç noktalardır. Wallarm, [API Discovery](overview.md) modülünün keşfettiği uç noktalar arasında bu tür uç noktaları otomatik olarak bulup koruyabilir.

Otomatik BOLA korumasını etkinleştirmek için, Wallarm Console → [**BOLA protection**](../admin-en/configuration-guides/protecting-against-bola.md) bölümüne gidin ve anahtarı etkin duruma getirin:

![BOLA tetikleyicisi](../images/user-guides/bola-protection/trigger-enabled-state.png)

Her korunan API uç noktası, API envanterinde ilgili simgeyle vurgulanacaktır, örn.:

![BOLA tetikleyicisi](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

API uç noktalarını BOLA otomatik koruma durumuna göre filtreleyebilirsiniz. İlgili parametre **Others** filtresi altında mevcuttur.