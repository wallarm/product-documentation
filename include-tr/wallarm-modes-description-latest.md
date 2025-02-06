| Wallarm node davranışı | `off` | `monitoring` | `safe_blocking` | `block` |
| ---------------------- | ----- | ------------ | --------------- | ------- |
| Gelen istekleri [input validation](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [virtual patch](../user-guides/rules/vpatch-rule.md) ve [regex-based](../user-guides/rules/regex-rule.md) kötü amaçlı veri yükleri açısından analiz eder | - | + | + | + |
| Kötü amaçlı istekleri Wallarm Cloud'a yükleyerek olay listesinin görüntülenmesini sağlar | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Sadece [graylisted IPs](../user-guides/ip-lists/overview.md) kaynaklı olanları | + |
| [denylisted IPs](../user-guides/ip-lists/overview.md)<sup>istisna için bkz.</sup> kaynaklı istekleri engeller <br> (IP'ler, [multi-attack protection](../admin-en/configuration-guides/protecting-with-thresholds.md) ile manuel ve otomatik olarak; ayrıca davranışsal koruma kapsamında: [API abuse prevention](../api-abuse-prevention/setup.md), [manual BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md), [brute force](../admin-en/configuration-guides/protecting-against-bruteforce.md) ve [forced browsing](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) kullanılarak eklenir) | - | + | + | + |
| [graylisted IPs](../user-guides/ip-lists/overview.md) kaynaklı istekleri engeller <br> (denylist için uygulananlarla aynı koruma önlemleriyle manuel ve otomatik olarak eklenen IP'ler) | - | - | Sadece kötü amaçlı veri yükü içerenler | - |
| [allowlisted IPs](../user-guides/ip-lists/overview.md) kaynaklı isteklerin geçişine izin verir | - | + | + | + |

!!! warning "Exception for denylist"
    Eğer [`wallarm_acl_access_phase off`][acl-access-phase] kullanılıyorsa, Wallarm node `monitoring` modunda denylisted IPs kaynaklı istekleri engellemez.