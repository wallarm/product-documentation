# Datadog

[Datadog](https://www.datadoghq.com/) هي منصة شهيرة قائمة على السحابة للرصد والتحليلات توفر رؤية شاملة على أداء التطبيقات الحديثة، توافرها، وأمانها. يمكنك إعداد Wallarm لإرسال إشعارات الأحداث المكتشفة مباشرة إلى خدمة Datadog Logs من خلال إنشاء تكامل مناسب عبر [مفتاح API الخاص بـDatadog](https://docs.datadoghq.com/account_management/api-app-keys/) في واجهة Wallarm.

## إعداد التكامل

1. افتح واجهة Datadog → **إعدادات المنظمة** → **مفاتيح API** وأنشئ مفتاح API للتكامل مع Wallarm.
1. افتح واجهة Wallarm → **التكاملات** وتابع إلى إعداد التكامل مع **Datadog**.
1. أدخل اسم التكامل.
1. الصق مفتاح API الخاص بـDatadog في حقل **مفتاح API**.
1. اختر [منطقة Datadog](https://docs.datadoghq.com/getting_started/site/).
1. اختر أنواع الأحداث لتحريك الإشعارات.

    ![تكامل Datadog](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    التفاصيل على الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations-ar.md"

1. اضغط **اختبار التكامل** للتحقق من صحة الإعدادات، توافر سحابة Wallarm، وتنسيق الإشعار.

    سجل Datadog التجريبي:

    ![سجل Datadog التجريبي](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    للعثور على سجلات Wallarm بين السجلات الأخرى، يمكنك استخدام علامة البحث `source:wallarm_cloud` في خدمة Datadog Logs.

1. اضغط **إضافة التكامل**.

## إعداد التنبيهات الإضافية

--8<-- "../include/integrations/integrations-trigger-setup-ar.md"

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توافر النظام ومعاملات التكامل الخاطئة

--8<-- "../include/integrations/integration-not-working.md"