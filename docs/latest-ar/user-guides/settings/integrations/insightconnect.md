# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/) هو منصة تنسيق وأتمتة واستجابة للأمان (SOAR) مصممة لمساعدة المنظمات على تسهيل وأتمتة عمليات الأمان السيبراني لديهم، مما يجعل من الأسهل اكتشاف، والتحقيق، والرد على الحوادث الأمنية والتهديدات. يمكنك إعداد Wallarm لإرسال الإشعارات إلى InsightConnect.

## إعداد التكامل

أولًا، قم بتوليد ونسخ مفتاح API كالتالي:

1. افتح واجهة المستخدم لـ InsightConnect → **الإعدادات** → [**صفحة مفاتيح API**](https://insight.rapid7.com/platform#/apiKeyManagement) وانقر على **مفتاح مستخدم جديد**.
2. أدخل اسم مفتاح API (مثل `Wallarm API`) وانقر على **توليد**.
3. انسخ مفتاح API المُولد.
4. اذهب إلى واجهة مستخدم Wallarm → **التكاملات** في [السحابة الأمريكية](https://us1.my.wallarm.com/integrations/) أو [السحابة الأوروبية](https://my.wallarm.com/integrations/) وانقر **InsightConnect**.
4. الصق مفتاح API الذي نسخته سابقًا في حقل **مفتاح API**.

ثانيًا، قم بتوليد ونسخ عنوان URL لـ API كالتالي:

1. ارجع إلى واجهة مستخدم InsightConnect، افتح **الأتمتة** → صفحة **السير العملي** وأنشئ سير عمل جديد لإشعار Wallarm.
2. عندما يُطلب منك اختيار مُحفِّز، اختر **مُحفِّز API**.
3. انسخ عنوان URL المُولد.
4. عد إلى واجهة مستخدم Wallarm → تكوين **InsightConnect** والصق عنوان URL لـ API الذي نسخته سابقًا في حقل **عنوان URL لـ API**.

ثالثًا، أنهِ الإعداد في واجهة مستخدم Wallarm:

1. أدخل اسم التكامل.
1. اختر أنواع الأحداث لتفعيل الإشعارات.

    ![تكامل InsightConnect](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    تفاصيل عن الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations-ar.md"

1. انقر على **اختبار التكامل** للتحقق من صحة التكوين، وتوفر سحابة Wallarm، وصيغة الإشعار.

    سيتم إرسال إشعارات الاختبار بالبادئة `[رسالة اختبار]`:

    ![إشعار اختبار InsightConnect](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. انقر على **إضافة تكامل**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup-ar.md"

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعايير التكامل غير صحيحة

--8<-- "../include/integrations/integration-not-working.md"