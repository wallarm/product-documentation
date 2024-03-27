# Datadog

[Datadog](https://www.datadoghq.com/) هو منصة تحليلات ومراقبة قائمة على السحابة تُقدم رؤية شاملة لأداء، إمكانية الوصول، وأمان التطبيقات الحديثة. يمكنك ضبط Wallarm لإرسال إشعارات الأحداث المُكتشفة مباشرةً إلى خدمة سجلات Datadog من خلال إنشاء تكامل مناسب عبر [مفتاح API الخاص بDatadog](https://docs.datadoghq.com/account_management/api-app-keys/) في واجهة Wallarm.

## إعداد التكامل

1. افتح واجهة Datadog → **إعدادات المؤسسة** → **مفاتيح API** وقم بإنشاء المفتاح الخاص بالتكامل مع Wallarm.
1. افتح واجهة Wallarm → **التكاملات** وتابع إلى إعداد تكامل **Datadog**.
1. أدخل اسم التكامل.
1. الصق مفتاح API الخاص ب Datadog في حقل **مفتاح API**.
1. اختر [منطقة Datadog](https://docs.datadoghq.com/getting_started/site/).
1. اختر أنواع الأحداث لتفعيل الإشعارات.

    ![تكامل Datadog](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    تفاصيل الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. اضغط على **اختبار التكامل** لفحص صحة الإعداد، توفر Wallarm Cloud، وصيغة الإشعار.

    سجل Datadog الاختباري:

    ![سجل Datadog الاختباري](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    للبحث عن سجلات Wallarm بين السجلات الأخرى، يمكنك استخدام علامة البحث `source:wallarm_cloud` في خدمة سجلات Datadog.

1. اضغط على **إضافة تكامل**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير صحيحة

--8<-- "../include/integrations/integration-not-working.md"