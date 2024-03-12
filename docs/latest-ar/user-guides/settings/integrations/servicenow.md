# ServiceNow

[ServiceNow](https://www.servicenow.com/) هو منصة قائمة على السحابة تقدم مجموعة من حلول إدارة خدمات تكنولوجيا المعلومات (ITSM) وأتمتة العمليات التجارية للمؤسسات. يمكنك ضبط Wallarm لإنشاء تذاكر المشاكل في ServiceNow.

## متطلبات

ServiceNow هو منصة لمساعدة الشركات على إدارة سير العمل الرقمي للعمليات المؤسسية. تحتاج شركتك إلى [نسخة وتطبيقات workflow مبنية داخلها](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) من ServiceNow لدمج هذه التطبيقات مع Wallarm.

## إعداد التكامل

في واجهة مستخدم ServiceNow:

1. احصل على اسم [نسخة ServiceNow](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html) الخاصة بك.
1. احصل على اسم المستخدم وكلمة المرور للوصول إلى النسخة.
1. قم بتمكين المصادقة OAuth واحصل على معرف العميل والسر كما هو موضح [هنا](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html).

في واجهة مستخدم Wallarm:

1. افتح واجهة Wallarm → **التكاملات** → **ServiceNow**.
1. أدخل اسم التكامل.
1. أدخل اسم نسخة ServiceNow.
1. أدخل اسم المستخدم وكلمة المرور للوصول إلى النسخة المحددة.
1. أدخل بيانات المصادقة OAuth: معرف العميل والسر.
1. اختر أنواع الأحداث لتشغيل الإخطارات.

    ![تكامل ServiceNow](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    تفاصيل حول الأحداث المتاحة:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. اضغط على **اختبار التكامل** للتحقق من صحة التكوين، وتوفر Cloud Wallarm، وشكل الإخطار.

    سيتم إرسال الإخطارات التجريبية بالبادئة `[رسالة تجريبية]`.

1. اضغط على **إضافة التكامل**.

## تعطيل وحذف تكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"