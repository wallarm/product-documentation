# ServiceNow

[ServiceNow](https://www.servicenow.com/) هي منصة مستندة إلى السحابة توفر مجموعة من حلول إدارة خدمات تكنولوجيا المعلومات (ITSM) وأتمتة العمليات التجارية للمؤسسات. يمكنك ضبط Wallarm لإنشاء تذاكر مشاكل في ServiceNow.

## المتطلبات

ServiceNow هي منصة لمساعدة الشركات على إدارة تدفقات العمل الرقمية لعمليات المؤسسات. تحتاج شركتك إلى امتلاك [نسخة ServiceNow وتطبيقات تدفق العمل المنشأة داخلها](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) لدمج هذه التطبيقات مع Wallarm.

## إعداد الدمج

في واجهة مستخدم ServiceNow:

1. احصل على اسم [نسخة ServiceNow](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html) الخاصة بك.
1. احصل على اسم المستخدم وكلمة المرور للوصول إلى النسخة.
1. قم بتمكين المصادقة OAuth واحصل على معرف العميل والسر كما هو موضح [هنا](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html).

في واجهة مستخدم Wallarm:

1. افتح وحدة تحكم Wallarm → **Integrations** → **ServiceNow**.
1. أدخل اسم الدمج.
1. أدخل اسم نسخة ServiceNow.
1. أدخل اسم المستخدم وكلمة المرور للوصول إلى النسخة المحددة.
1. أدخل بيانات المصادقة OAuth: معرف العميل والسر.
1. اختر أنواع الأحداث لتشغيل الإخطارات.

    ![دمج ServiceNow](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    تفاصيل حول الأحداث المتاحة:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. اضغط **Test integration** للتحقق من صحة التكوين وتوفر سحابة Wallarm وتنسيق الإخطار.

    سيتم إرسال الإخطارات التجريبية مع البادئة `[Test message]`.

1. اضغط **Add integration**.

## تعطيل وحذف دمج

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعاملات الدمج غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"