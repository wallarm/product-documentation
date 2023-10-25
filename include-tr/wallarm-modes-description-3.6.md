| Wallarm düğüm davranışı | `kapalı` | `izleme` | `güvenli_blokaj` |`blok` |
| -------- | - | - | - | -|
| Gelen isteklerin aşağıdaki türlerde zararlı yükler içerip içermediğini analiz eder: [giriş doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md) veya [düzenli ifadelere dayalı olarak tespit edilen saldırılar](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Zararlı istekleri Wallarm Bulut'a yükler, böylece olay listesinde görüntülenirler | - | + | + | + |
| Zararlı istekleri engeller | - | - | Yalnızca [gri listeye alınan IP'lerden](../user-guides/ip-lists/graylist.md) gelenler | + |
| [Kara listeye alınan IP'lerden](../user-guides/ip-lists/denylist.md)<sup>istisnaları görün</sup> gelen istekleri engeller | Kara listeyi analiz etmez | - | + | + |
| [Gri listeye alınan IP'lerden](../user-guides/ip-lists/graylist.md) gelen istekleri engeller | Gri listeyi analiz etmez | - | Yalnızca zararlı yük içerenler | Gri listeyi analiz etmez |
| [Beyaz listeye alınan IP'lerden](../user-guides/ip-lists/allowlist.md) gelen isteklere izin verir | Beyaz listeyi analiz etmez | + | + | + |

!!! uyarı "İstisnalar"
    Eğer [`wallarm_acl_access_phase on`][acl-access-phase] ise, `kapalı` ve `izleme` modları dahil olmak üzere kara listeye alınan IP'lerden gelen istekler engellenir.