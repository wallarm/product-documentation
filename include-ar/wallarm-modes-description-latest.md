| سلوك عقدة Wallarm | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| يحلل ما إذا كانت الطلبات الواردة تحتوي على حمولات ضارة من الأنواع التالية: [هجمات التحقق من صحة الإدخال](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)، [هجمات vpatch](../user-guides/rules/vpatch-rule.md)، أو [الهجمات المكتشفة بناءً على التعبيرات النظامية](../user-guides/rules/regex-rule.md) | - | + | + | + |
| يرفع الطلبات الضارة إلى سحابة Wallarm حتى يتم عرضها في قائمة الأحداث | - | + | + | + |
| يحجب الطلبات الضارة | - | - | فقط تلك الصادرة من [عناوين IPs الرمادية](../user-guides/ip-lists/overview.md) | + |
| يحجب الطلبات الصادرة من [عناوين IPs المحظورة](../user-guides/ip-lists/overview.md)<sup>انظر الاستثناءات</sup> | + | + | + | + |
| يحجب الطلبات الصادرة من [عناوين IPs الرمادية](../user-guides/ip-lists/overview.md) | لا يحلل القائمة الرمادية | - | فقط تلك التي تحتوي على حمولات ضارة | لا يحلل القائمة الرمادية |
| يسمح بالطلبات الصادرة من [عناوين IPs المسموح بها](../user-guides/ip-lists/overview.md) | + | + | + | + |

!!! warning "الاستثناءات"
    إذا كانت [`wallarm_acl_access_phase off`][acl-access-phase]، فإن عقدة Wallarm لا تحلل القائمة السوداء في وضع `off` ولا تحجب الطلبات من عناوين IPs المحظورة في وضع `monitoring`.