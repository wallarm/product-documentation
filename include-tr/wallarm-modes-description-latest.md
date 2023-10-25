| Wallarm düğüm davranışı | `kapalı` | `izleme` | `güvenli_blokaj` |`blok` |
| -------- | - | - | - | -|
| Gelen taleplerin aşağıdaki türlerden zararlı yükler içerip içermediğini analiz eder: [giriş doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md), veya [düzenli ifadelere dayalı olarak algılanan saldırılar](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Zararlı istekleri Wallarm Buluta yükler, böylece olay listesinde görüntülenirler | - | + | + | + |
| Zararlı istekleri engeller | - | - | Sadece [gri listeye alınmış IP'lerden](../user-guides/ip-lists/graylist.md) kaynaklananlar | + |
| [Reddedilen IP'lerden](../user-guides/ip-lists/denylist.md)<sup>istisnaları görün</sup> kaynaklanan istekleri engeller | + | + | + | + |
| [Gri listeye alınmış IP'lerden](../user-guides/ip-lists/graylist.md) kaynaklanan istekleri engeller | Gri listeyi analiz etmez | - | Sadece zararlı yük içerenleri | Gri listeyi analiz etmez |
| [İzin verilen IP'lerden](../user-guides/ip-lists/allowlist.md) kaynaklanan isteklere izin verir | + | + | + | + |

!!! uyarı "İstisnalar"
    Eğer [`wallarm_acl_access_phase kapalı`][acl-access-phase], Wallarm düğümü `kapalı` modda reddetme listesini analiz etmez ve `izleme` modunda reddedilen IP'lerden gelen talepleri engellemez.