# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) هي منصة تعاون وتواصل مصممة لتسهيل العمل الجماعي وتمكين المنظمات من التواصل والتعاون وإدارة المشاريع بفعالية، سواء كانوا يعملون في المكتب، عن بُعد، أو مزيج من الاثنين. يمكنك ضبط Wallarm لإرسال الإشعارات إلى قناة(قنوات) Microsoft Teams الخاصة بك. إذا أردت إرسال الإشعارات إلى عدة قنوات مختلفة، قم بإنشاء عدة تكاملات لـ Microsoft Teams.

## إعداد التكامل

1. افتح قسم **التكاملات**.
1. انقر على كتلة **Microsoft Teams** أو انقر على زر **إضافة تكامل** واختر **Microsoft Teams**.
1. أدخل اسم تكامل.
1. افتح إعدادات قناة Microsoft Teams حيث تريد نشر الإشعارات وقم بتكوين Webhook جديد باستخدام [التعليمات](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
1. انسخ عنوان URL لـ Webhook المُقدم والصق القيمة في حقل **Webhook URL** في لوحة تحكم Wallarm.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

      ![تكامل MS Teams](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      تفاصيل حول الأحداث المتاحة:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. انقر على **اختبار التكامل** للتحقق من صحة الإعدادات، وتوفر سحابة Wallarm، وتنسيق الإشعار.

      سيتم إرسال الإشعارات الاختبارية مع البادئة `[رسالة اختبار]`:

      ```
      [رسالة اختبار] [شريك اختبار] تغير محيط الشبكة

      نوع الإشعار: new_scope_object_ips

      تم اكتشاف عناوين IP جديدة في محيط الشبكة:
      8.8.8.8

      العميل: TestCompany
      السحابة: EU
      ```

1. انقر على **إضافة تكامل**.

## إعداد التنبيهات الإضافية

--8<-- "../include/integrations/integrations-trigger-setup-limited-ar.md"

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعايير التكامل الخاطئة

--8<-- "../include/integrations/integration-not-working.md"