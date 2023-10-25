| Wallarm düğüm davranışı | `kapalı` | `izleme` | `güvenli_blokaj` |`bloke` |
| -------- | - | - | - | -|
| Gelen isteklerin aşağıdaki tiplerde kötü amaçlı yükler içerip içermediğini analiz eder: [giriş doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md), veya [düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Kötü amaçlı istekleri Wallarm Bulut'a yükler, böylece olay listesinde görüntülenirler | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Sadece [gri liste IP'lerinden](../user-guides/ip-lists/graylist.md) gelenler | + |
| [Yasaklanmış IP'lerden](../user-guides/ip-lists/denylist.md) gelen istekleri engeller | Yasak listeyi analiz etmez | - | + | + |
| [Gri liste IP'lerinden](../user-guides/ip-lists/graylist.md) başlayan istekleri engeller | Gri listeyi analiz etmez | - | Sadece kötü amaçlı yük içerenler | Gri listeyi analiz etmez |
| [İzin verilen IP'lerden](../user-guides/ip-lists/allowlist.md) başlayan isteklere izin verir| İzin verilen listeyi analiz etmez | + | + | + |