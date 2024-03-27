# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) هو حل يقدمه Microsoft كجزء من منصة Azure السحابية لمساعدة المؤسسات في مراقبة، اكتشاف، التحقيق في، والاستجابة للتهديدات الأمنية والحوادث عبر بيئاتهم السحابية والمحلية بالكامل. يمكنك ضبط Wallarm لتسجيل الأحداث في Microsoft Sentinel.

## إعداد التكامل

في واجهة Microsoft UI:

1. [شغّل Microsoft Sentinel على Workspace](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. انتقل إلى إعدادات مساحة العمل Sentinel → **Agents** → **تعليمات وكيل Log Analytics** وانسخ البيانات التالية:

    * معرف Workspace
    * المفتاح الأساسي

في واجهة Wallarm Console UI:

1. افتح قسم **التكاملات**.
1. انقر على كتلة **Microsoft Sentinel** أو انقر على الزر **إضافة تكامل** واختر **Microsoft Sentinel**.
1. أدخل اسم التكامل.
1. الصق معرف Workspace والمفتاح الأساسي المنسوخ.
1. اختياريًا، حدد جدول Azure Sentinel لأحداث Wallarm. إذا لم يكن موجودًا، سيتم إنشاؤه تلقائيًا.

    بدون اسم، يتم إنشاء جداول منفصلة لكل نوع حدث.
1. اختر أنواع الأحداث لتشغيل الإخطارات.

    ![تكامل Sentinel](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    تفاصيل الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر على **تجربة التكامل** للتحقق من صحة التكوين، توفر Cloud Wallarm، وتنسيق الإخطار.

    يمكن العثور على سجلات Wallarm في Microsoft Workspace → **Logs** → **Custom Logs**، على سبيل المثال يبدو السجل `create_user_CL` في Microsoft Sentinel كما يلي:

    ![رسالة تجربة Sentinel](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "تأخر في إرسال البيانات إلى مساحات العمل الجديدة"
        إنشاء Workspace على Sentinel لتكامل Wallarm يمكن أن يستغرق حتى ساعة واحدة لتعمل كل الخدمات. يمكن أن يؤدي هذا التأخير إلى حدوث أخطاء أثناء اختبار التكامل واستخدامه. إذا كانت كل إعدادات التكامل صحيحة لكن الأخطاء تستمر في الظهور، الرجاء معاودة المحاولة بعد ساعة.

1. انقر على **إضافة تكامل**.

## أنواع سجلات Wallarm

بشكل عام، يمكن لـ Wallarm تسجيل السجلات من الأنواع التالية في Sentinel:

| الحدث | نوع سجل Sentinel |
| ----- | ----------------- |
| [الضربة](../../../glossary-en.md#hit) الجديدة | `new_hits_CL` |
| [المستخدم](../../../user-guides/settings/users.md) الجديد في حساب الشركة | `create_user_CL` |
| حذف المستخدم من حساب الشركة | `delete_user_CL` |
| تحديث دور المستخدم | `update_user_CL` |
| حذف [التكامل](integrations-intro.md) | `delete_integration_CL` |
| تعطيل التكامل | `disable_integration_CL` أو `integration_broken_CL` إذا تم تعطيله بسبب إعدادات غير صحيحة |
| [التطبيق](../../../user-guides/settings/applications.md) الجديد | `create_application_CL` |
| حذف التطبيق | `delete_application_CL` |
| تحديث اسم التطبيق | `update_application_CL` |
| [الثغرة الأمنية](../../../glossary-en.md#vulnerability) الجديدة ذات المخاطر العالية | `vuln_high_CL` |
| الثغرة الأمنية الجديدة ذات المخاطر المتوسطة | `vuln_medium_CL` |
| الثغرة الأمنية الجديدة ذات المخاطر المنخفضة | `vuln_low_CL` |
| [القاعدة](../../../user-guides/rules/rules.md) الجديدة | `rule_create_CL` |
| حذف قاعدة | `rule_delete_CL` |
| تغييرات قاعدة موجودة | `rule_update_CL` |
| [المشغل](../../../user-guides/triggers/triggers.md) الجديد | `trigger_create_CL` |
| حذف مشغل | `trigger_delete_CL` |
| تغييرات مشغل موجود | `trigger_update_CL` |
| التحديثات في الأصول المعرضة كالمضيفين والخدمات والنطاقات في [الأصول المكشوفة](../../scanner.md) | `scope_object_CL` |
| التغييرات في جرد API (إذا كان [المشغل](../../triggers/triggers.md) المقابل نشطًا) | `api_structure_changed_CL` |
| تجاوز عدد الهجمات العتبة (إذا كان [المشغل](../../triggers/triggers.md) المقابل نشطًا) | `attacks_exceeded_CL` |
| IP جديد في القائمة السوداء (إذا كان [المشغل](../../triggers/triggers.md) المقابل نشطًا) | `ip_blocked_CL` |

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"