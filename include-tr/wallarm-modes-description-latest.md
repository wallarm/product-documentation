| Wallarm düğümü davranışı | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Gelen istekleri [girdi doğrulaması](../attacks-vulns-list.md#attack-types), [sanal yama](../user-guides/rules/vpatch-rule.md) ve [regex tabanlı](../user-guides/rules/regex-rule.md) kötü amaçlı yükler için analiz eder | - | + | + | + |
| Kötü amaçlı istekleri olay listesinde görüntülenmeleri için Wallarm Cloud'a yükler | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Yalnızca [gri listeye alınmış IP'ler](../user-guides/ip-lists/overview.md)den gelenler | + |
| [denylisted IP'ler](../user-guides/ip-lists/overview.md)den gelen istekleri engeller<sup>bkz. istisna</sup> <br> ([çoklu saldırı koruması](../admin-en/configuration-guides/protecting-with-thresholds.md) ve davranışsal koruma: [API kötüye kullanımının önlenmesi](../api-abuse-prevention/setup.md), [manuel BOLA](../admin-en/configuration-guides/protecting-against-bola-trigger.md), [kaba kuvvet](../admin-en/configuration-guides/protecting-against-bruteforce.md), [zorla gezinme](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) ve [genel numaralandırma](../api-protection/enumeration-attack-protection.md) tarafından manuel ve otomatik olarak eklenen IP'ler) | - | + | + | + |
| [gri listeye alınmış IP'ler](../user-guides/ip-lists/overview.md)den gelen istekleri engeller <br> (IP'ler, denylist için geçerli olan aynı koruma önlemleriyle manuel ve otomatik olarak eklenir) | - | - | Yalnızca kötü amaçlı yük içerenler | - |
| [izinli listedeki IP'ler](../user-guides/ip-lists/overview.md)den gelen isteklere izin verir | - | + | + | + |

!!! warning "Denylist için istisna"
    Eğer [`wallarm_acl_access_phase off`][acl-access-phase] ise, Wallarm düğümü `monitoring` modunda denylist'teki IP'lerden gelen istekleri engellemez.