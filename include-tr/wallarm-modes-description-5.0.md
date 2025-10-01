| Wallarm düğüm davranışı | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Gelen istekleri [girdi doğrulama](../attacks-vulns-list.md#attack-types), [sanal yama](../user-guides/rules/vpatch-rule.md) ve [regex tabanlı](../user-guides/rules/regex-rule.md) kötü amaçlı yükler açısından analiz eder | - | + | + | + |
| Kötü amaçlı istekleri olay listesinde görüntülenmeleri için Wallarm Cloud'a yükler | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Yalnızca [graylisted IPs](../user-guides/ip-lists/overview.md) kaynaklı olanlar | + |
| [denylisted IPs](../user-guides/ip-lists/overview.md) kaynaklı istekleri engeller<sup>istisnaya bakın</sup> <br> (IP'ler, [multi-attack protection](../admin-en/configuration-guides/protecting-with-thresholds.md) ve davranışsal koruma tarafından manuel ve otomatik olarak eklenenler: [API abuse prevention](../api-abuse-prevention/setup.md), [manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md), [brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md) ve [forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)) | - | + | + | + |
| [graylisted IPs](../user-guides/ip-lists/overview.md) kaynaklı istekleri engeller <br> (IP'ler, denylist için geçerli olanlarla aynı koruma önlemleri tarafından manuel ve otomatik olarak eklenir) | - | - | Yalnızca kötü amaçlı yük içerenler | - |
| [allowlisted IPs](../user-guides/ip-lists/overview.md) kaynaklı isteklere izin verir | - | + | + | + |

!!! warning "Denylist için istisna"
    Eğer [`wallarm_acl_access_phase off`][acl-access-phase] ise, Wallarm düğümü `monitoring` modunda denylisted IPs kaynaklı istekleri engellemez.