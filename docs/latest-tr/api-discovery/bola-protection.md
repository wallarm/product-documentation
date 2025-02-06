# BOLA Saldırılarına Karşı Otomatik Koruma <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola) gibi davranışsal saldırılar, aynı adı taşıyan açığı istismar eder. Bu açık, bir saldırganın bir API isteği aracılığıyla nesnenin tanımlayıcısını kullanarak erişim sağlamasına ve yetkilendirme mekanizmasını atlayarak verileri okuma veya değiştirme imkânı verir.

BOLA saldırılarının potansiyel hedefleri, değişkenliğe sahip uç noktalardır. Wallarm, [API Discovery](overview.md) modülü tarafından keşfedilen bu uç noktaları otomatik olarak tespit edip koruyabilir.

Otomatik BOLA korumasını etkinleştirmek için, Wallarm Console → [**BOLA protection**](../admin-en/configuration-guides/protecting-against-bola.md) yolunu izleyin ve anahtarı etkin duruma getirin:

![BOLA trigger](../images/user-guides/bola-protection/trigger-enabled-state.png)

Korunan her API uç noktası, API envanterinde ilgili simgeyle vurgulanır, örneğin:

![BOLA trigger](../images/about-wallarm-waf/api-discovery/endpoints-protected-against-bola.png)

API uç noktalarını, BOLA otomatik koruma durumuna göre filtreleyebilirsiniz. İlgili parametre **Others** filtresi altında mevcuttur.