| Wallarm düğüm davranışı | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Gelen isteklerin aşağıdaki türlerden kötü amaçlı yükler içerip içermediğini analiz eder: [girdi doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md) veya [düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Kötü amaçlı istekleri Wallarm Cloud'a yükleyerek olay listesinde görüntülenmelerini sağlar | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Yalnızca [graylisted IP'lerden](../user-guides/ip-lists/overview.md) gelenler | + |
| [Denylisted IP'lerden](../user-guides/ip-lists/overview.md) gelen istekleri engeller | - | - | + | + |
| [Graylisted IP'lerden](../user-guides/ip-lists/overview.md) gelen istekleri engeller | - | - | Yalnızca kötü amaçlı yükler içerenler | - |
| [Allowlisted IP'lerden](../user-guides/ip-lists/overview.md) gelen isteklere izin verir | - | + | + | + |