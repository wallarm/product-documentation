| Wallarm node davranışı | `off` | `monitoring` | `safe_blocking` | `block` |
| ---------------------- | ----- | ------------ | --------------- | ----- |
| Gelen isteklerin, aşağıdaki tiplerde kötü amaçlı yükler içerip içermediğini analiz eder: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md) veya [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Kötü amaçlı istekleri, olay listesinde görüntülenmeleri için Wallarm Cloud'a yükler | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Yalnızca [graylisted IPs](../user-guides/ip-lists/graylist.md) kaynaklı olanlar | + |
| [denylisted IPs](../user-guides/ip-lists/denylist.md)<sup>bkz. istisnalar</sup> kaynaklı istekleri engeller | Denylist'i analiz etmez | - | + | + |
| [graylisted IPs](../user-guides/ip-lists/graylist.md) kaynaklı istekleri engeller | Graylist'i analiz etmez | - | Yalnızca kötü amaçlı yük içerenler | Graylist'i analiz etmez |
| [allowlisted IPs](../user-guides/ip-lists/allowlist.md) kaynaklı istekleri izin verir | Allowlist'i analiz etmez | + | + | + |

!!! warning "Exceptions"
    Eğer [`wallarm_acl_access_phase on`][acl-access-phase] aktifse, denylisted IP'lerden gelen istekler `off` ve `monitoring` modları dahil tüm modlarda engellenir