| سلوك عقدة Wallarm | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| تحلل ما إذا كانت الطلبات الواردة تحتوي على بيانات ضارة من الأنواع التالية: [هجمات التحقق من صحة الإدخال](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)، [هجمات vpatch](../user-guides/rules/vpatch-rule.md)، أو [الهجمات المكتشفة بناءً على التعابير النظامية](../user-guides/rules/regex-rule.md) | - | + | + | + |
| ترفع الطلبات الضارة إلى سحابة Wallarm حتى يتم عرضها في قائمة الأحداث | - | + | + | + |
| تحجب الطلبات الضارة | - | - | فقط تلك الصادرة من [العناوين الموضوعة في القائمة الرمادية](../user-guides/ip-lists/graylist.md) | + |
| تحجب الطلبات الصادرة من [العناوين الموضوعة في القائمة السوداء](../user-guides/ip-lists/denylist.md)<sup>انظر الاستثناءات</sup> | لا تحلل القائمة السوداء | - | + | + |
| تحجب الطلبات الصادرة من [العناوين الموضوعة في القائمة الرمادية](../user-guides/ip-lists/graylist.md) | لا تحلل القائمة الرمادية | - | فقط تلك التي تحتوي على بيانات ضارة | لا تحلل القائمة الرمادية |
| تسمح بالطلبات الصادرة من [العناوين الموضوعة في القائمة البيضاء](../user-guides/ip-lists/allowlist.md) | لا تحلل القائمة البيضاء | + | + | + |

!!! warning "الاستثناءات"
    إذا تم تفعيل [`wallarm_acl_access_phase on`][acl-access-phase]، يتم حجب الطلبات من العناوين الموضوعة في القائمة السوداء في أي وضع بما في ذلك `off` و`monitoring`