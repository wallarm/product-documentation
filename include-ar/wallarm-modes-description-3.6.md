| سلوك عقدة Wallarm | `off` | `monitoring` | `safe_blocking` | `block` |
| -------- | - | - | - | -|
| يحلّل ما إذا كانت الطلبات الواردة تحتوي على حمولات ضارة من الأنواع التالية: [هجمات التحقق من الإدخال](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)، [هجمات vpatch](../user-guides/rules/vpatch-rule.md)، أو [هجمات تم اكتشافها بناءً على التعابير النظامية](../user-guides/rules/regex-rule.md) | - | + | + | + |
| يقوم بتحميل الطلبات الضارة إلى سحابة Wallarm حتى يتم عرضها في قائمة الأحداث | - | + | + | + |
| يحظر الطلبات الضارة | - | - | فقط تلك التي نشأت من [العناوين الرمادية](../user-guides/ip-lists/graylist.md) | + |
| يحظر الطلبات النشأت من [العناوين المحظورة](../user-guides/ip-lists/denylist.md)<sup>انظر الاستثناءات</sup> | لا يحلل قائمة المحظورين | - | + | + |
| يحظر الطلبات النشأت من [العناوين الرمادية](../user-guides/ip-lists/graylist.md) | لا يحلل قائمة الرمادية | - | فقط تلك التي تحتوي على حمولات ضارة | لا يحلل قائمة الرمادية |
| يسمح بالطلبات النشأت من [العناوين المسموح بها](../user-guides/ip-lists/allowlist.md) | لا يحلل قائمة المسموح بهم | + | + | + |

!!! warning "الاستثناءات"
    إذا كان [`wallarm_acl_access_phase on`][acl-access-phase]، يتم حظر الطلبات من العناوين المحظورة في أي وضع بما في ذلك `off` و `monitoring`