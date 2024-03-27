# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/) هي منصة تنسيق الأمان، والأتمتة، والاستجابة (SOAR) مصممة لمساعدة المنظمات على تبسيط وأتمتة عمليات الأمان السيبراني لديهم، مما يجعل من الأسهل اكتشاف وتحقيق والاستجابة لحوادث الأمان والتهديدات. يمكنك ضبط Wallarm لإرسال إشعارات إلى InsightConnect.

## إعداد التكامل

أولا، قم بتوليد ونسخ مفتاح API كما يلي:

1. افتح واجهة المستخدم لـ InsightConnect → **الإعدادات** → [**صفحة مفاتيح API**](https://insight.rapid7.com/platform#/apiKeyManagement) وانقر على **مفتاح مستخدم جديد**.
2. أدخل اسم مفتاح API (مثل `Wallarm API`) وانقر على **توليد**.
3. انسخ مفتاح API المولد.
4. اذهب إلى واجهة مستخدم Wallarm → **التكاملات** في [السحابة الأمريكية](https://us1.my.wallarm.com/integrations/) أو [السحابة الأوروبية](https://my.wallarm.com/integrations/) وانقر على **InsightConnect**.
4. ألصق مفتاح API الذي نسخته في حقل **مفتاح API**.

ثانياً، قم بتوليد ونسخ عنوان URL لAPI كما يلي:

1. ارجع إلى واجهة مستخدم InsightConnect، افتح ال**أتمتة** → **صفحة سير العمل** وأنشئ سير عمل جديد لإشعار Wallarm.
2. عندما يُطلب منك اختيار مشغل، اختر **مشغل API**.
3. انسخ عنوان URL المولد.
4. ارجع إلى واجهة مستخدم Wallarm → إعدادات **InsightConnect** وألصق عنوان URL لAPI الذي نسخته في حقل **عنوان URL لAPI**.

ثالثا، أنه التجهيز في واجهة مستخدم Wallarm:

1. أدخل اسم التكامل.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![تكامل InsightConnect](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    تفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر على **اختبار التكامل** للتحقق من صحة الإعداد، توافر سحابة Wallarm، وتنسيق الإشعار.

    سيتم إرسال الإشعارات التجريبية بالبادئة `[رسالة تجريبية]`:

    ![إشعار تجريبي InsightConnect](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. انقر على **إضافة تكامل**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توافر النظام وخطأ في معلمات التكامل

--8<-- "../include/integrations/integration-not-working.md"