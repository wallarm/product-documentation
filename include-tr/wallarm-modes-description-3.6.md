| Wallarm düğümünün davranışı | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Gelen isteklerin aşağıdaki türlerden kötü amaçlı payload içerip içermediğini analiz eder: [girdi doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md) veya [düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Kötü amaçlı istekleri, olay listesinde görüntülenmeleri için Wallarm Cloud'a yükler | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Yalnızca [Graylist'teki IP'lerden](../user-guides/ip-lists/graylist.md) gelenler | + |
| [Denylist'teki IP'lerden](../user-guides/ip-lists/denylist.md) gelen istekleri engeller <sup>istisnalara bakın</sup> | Denylist'i analiz etmez | - | + | + |
| [Graylist'teki IP'lerden](../user-guides/ip-lists/graylist.md) gelen istekleri engeller | Graylist'i analiz etmez | - | Yalnızca kötü amaçlı payload içerenler | Graylist'i analiz etmez |
| [Allowlist'teki IP'lerden](../user-guides/ip-lists/allowlist.md) gelen isteklere izin verir | Allowlist'i analiz etmez | + | + | + |

!!! warning "İstisnalar"
    Eğer [`wallarm_acl_access_phase on`][acl-access-phase] ise, Denylist'teki IP'lerden gelen istekler `off` ve `monitoring` dahil herhangi bir modda engellenir