# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) هي حل يوفره Microsoft كجزء من منصة السحاب Azure لمساعدة المؤسسات على مراقبة، الكشف، التحقيق، والاستجابة للتهديدات الأمنية والحوادث عبر بيئات السحاب والموقع بالكامل. يمكنك إعداد Wallarm لتسجيل الأحداث في Microsoft Sentinel.

## إعداد التكامل

في واجهة المستخدم لـ Microsoft:

1. [تشغيل Microsoft Sentinel على مساحة العمل](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. انتقل إلى إعدادات مساحة العمل Sentinel → **Agents** → **Log Analytics agent instructions** وانسخ المعلومات التالية:

    * مُعرف مساحة العمل
    * المفتاح الأساسي

في واجهة مستخدم Wallarm Console:

1. افتح قسم **التكاملات**.
1. انقر على كتلة **Microsoft Sentinel** أو انقر على زر **إضافة تكامل** واختر **Microsoft Sentinel**.
1. أدخل اسم تكامل.
1. الصق مُعرف مساحة العمل والمفتاح الأساسي المنسوخ.
1. اختياريًا، حدد جدول Azure Sentinel لأحداث Wallarm. إذا لم يكن موجودًا، سيتم إنشاؤه تلقائيًا.

    بدون اسم، يتم إنشاء جداول منفصلة لكل نوع حدث.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![تكامل Sentinel](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    تفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر **اختبار التكامل** للتحقق من صحة الإعداد، توفر السحابة Wallarm، وتنسيق الإشعار.

    يمكنك العثور على سجلات Wallarm في مساحة عملك Microsoft → **Logs** → **Custom Logs**، على سبيل المثال، سجل اختبار `create_user_CL` في Microsoft Sentinel يظهر كما يلي:

    ![رسالة اختبار Sentinel](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "تأخير في إرسال البيانات إلى مساحات العمل الجديدة"
        قد يستغرق إنشاء مساحة عمل على Sentinel لتكامل Wallarm ما يصل إلى ساعة واحدة لكي تعمل جميع الخدمات. يمكن أن يؤدي هذا التأخير إلى ظهور أخطاء أثناء اختبار التكامل واستخدامه. إذا كانت جميع إعدادات التكامل صحيحة لكن الأخطاء تستمر في الظهور، يُرجى المحاولة مرة أخرى بعد ساعة واحدة.

1. انقر **إضافة تكامل**.

## أنواع سجلات Wallarm

بشكل عام، يمكن لـ Wallarm تسجيل السجلات من الأنواع التالية في Sentinel:

| الحدث | نوع سجل Sentinel |
| ----- | ----------------- |
| حدث جديد [hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| [مستخدم](../../../user-guides/settings/users.md) جديد في حساب شركة | `create_user_CL` |
| حذف مستخدم من حساب شركة | `delete_user_CL` |
| تحديث دور المستخدم | `update_user_CL` |
| حذف [تكامل](integrations-intro.md) | `delete_integration_CL` |
| تعطيل تكامل | `disable_integration_CL` أو `integration_broken_CL` إذا تم تعطيله بسبب إعدادات غير صحيحة |
| [تطبيق](../../../user-guides/settings/applications.md) جديد | `create_application_CL` |
| حذف تطبيق | `delete_application_CL` |
| تحديث اسم تطبيق | `update_application_CL` |
| [ثغرة أمنية](../../../glossary-en.md#vulnerability) جديدة بمخاطر عالية | `vuln_high_CL` |
| ثغرة أمنية جديدة بمخاطر متوسطة | `vuln_medium_CL` |
| ثغرة أمنية جديدة بمخاطر منخفضة | `vuln_low_CL` |
| [قاعدة](../../../user-guides/rules/rules.md) جديدة | `rule_create_CL` |
| حذف قاعدة | `rule_delete_CL` |
| تغييرات في قاعدة موجودة | `rule_update_CL` |
| [محفز](../../../user-guides/triggers/triggers.md) جديد | `trigger_create_CL` |
| حذف محفز | `trigger_delete_CL` |
| تغييرات في محفز موجود | `trigger_update_CL` |
| التحديثات في المضيفين، الخدمات، والنطاقات في [الأصول المكشوفة](../../scanner.md) | `scope_object_CL` |
| تغييرات في جرد API (إذا كان المحفز المقابل [trigger](../../triggers/triggers.md) نشطًا) | `api_structure_changed_CL` |
| عدد الهجمات يتجاوز العتبة (إذا كان المحفز المقابل [trigger](../../triggers/triggers.md) نشطًا) | `attacks_exceeded_CL` |
| IP مدرج على القائمة السوداء جديد (إذا كان المحفز المقابل [trigger](../../triggers/triggers.md) نشطًا) | `ip_blocked_CL` |

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير صحيحة

--8<-- "../include/integrations/integration-not-working.md"