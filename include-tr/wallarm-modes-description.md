| Wallarm düğüm davranışı | off | monitoring | safe_blocking | block |
| ------------------------ | --- | ---------- | ------------- | ----- |
| Gelen isteklerin aşağıdaki türde kötü amaçlı yükler içerip içermediğini analiz eder: [girdi doğrulama saldırıları](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch saldırıları](../user-guides/rules/vpatch-rule.md) veya [düzenli ifadeler temelinde tespit edilen saldırılar](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Wallarm Cloud'a kötü amaçlı istekleri olay listesinde görüntülenecek şekilde yükler | - | + | + | + |
| Kötü amaçlı istekleri engeller | - | - | Yalnızca [gri listeye alınmış IP'lerden](../user-guides/ip-lists/overview.md) kaynaklananlar | + |
| [Kara listeye alınmış IP'lerden](../user-guides/ip-lists/overview.md) kaynaklanan istekleri engeller | - | - | + | + |
| [Gri listeye alınmış IP'lerden](../user-guides/ip-lists/overview.md) kaynaklanan istekleri engeller | - | - | Yalnızca kötü amaçlı yük içerenler | - |
| [Beyaz listeye alınmış IP'lerden](../user-guides/ip-lists/overview.md) kaynaklanan isteklere izin verir | - | + | + | + |