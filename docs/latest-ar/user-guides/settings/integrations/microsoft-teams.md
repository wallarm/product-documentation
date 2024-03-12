# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) هو منصة تعاون وتواصل صُممت لتسهيل العمل الجماعي وتمكين المنظمات من التواصل والتعاون وإدارة المشاريع بفعالية، سواء كانوا يعملون في المكتب، عن بُعد، أو مزيج من الاثنين. يمكنك ضبط Wallarm لإرسال الإشعارات إلى قناة(قنوات) Microsoft Teams الخاصة بك. إذا كنت ترغب في إرسال الإشعارات إلى عدة قنوات مختلفة، أنشئ عدة تكاملات مع Microsoft Teams.

## إعداد التكامل

1. افتح قسم **التكاملات**.
1. اضغط على كتلة **Microsoft Teams** أو اضغط على زر **إضافة تكامل** واختر **Microsoft Teams**.
1. أدخل اسم التكامل.
1. افتح إعدادات قناة Microsoft Teams التي ترغب في نشر الإشعارات بها وقم بتهيئة Webhook جديد باستخدام [التعليمات](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
1. انسخ عنوان URL المقدم لـ Webhook والصق القيمة في حقل **عنوان URL لـ Webhook** في لوحة تحكم Wallarm.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

      ![تكامل MS Teams](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      التفاصيل حول الأحداث المتاحة:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. اضغط على **تجربة التكامل** للتحقق من صحة الإعدادات، توافر Wallarm Cloud، وتنسيق الإشعار.

      سيتم إرسال الإشعارات التجريبية بالبادئة `[رسالة تجريبية]`:

      ```
      [رسالة تجريبية] [شريك تجريبي] تغيرت حدود الشبكة

      نوع الإشعار: new_scope_object_ips

      تم اكتشاف عناوين IP جديدة في حدود الشبكة:
      8.8.8.8

      العميل: TestCompany
      السحابة: EU
      ```

1. اضغط على **إضافة تكامل**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعاملات التكامل غير صحيحة

--8<-- "../include/integrations/integration-not-working.md"