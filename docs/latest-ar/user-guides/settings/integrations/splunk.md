[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk

[Splunk] (https://www.splunk.com/) هي منصة مصممة للبحث، والمراقبة، وتحليل البيانات التي تُولَّد آليًا، بما في ذلك السجلات والأحداث وأشكال أخرى من البيانات التشغيلية والتجارية. يمكنك إعداد Wallarm لإرسال التنبيهات إلى Splunk.

## إعداد التكامل

في واجهة استخدام Splunk:

1. افتح **الإعدادات** ➝ **إضافة بيانات** ➝ **مراقبة**.
2. اختر خيار **جامع الأحداث HTTP**، أدخل اسم التكامل وانقر **التالي**.
3. تخطَّ اختيار نوع البيانات في صفحة **إعدادات الإدخال** واستمر إلى **مراجعة الإعدادات**.
4. راجع و**أرسل** الإعدادات.
5. انسخ الرمز الموفر.

في واجهة استخدام Wallarm:

1. افتح قسم **التكاملات**.
1. انقر على كتلة **Splunk** أو انقر على زر **إضافة تكامل** واختر **Splunk**.
1. أدخل اسم التكامل.
1. الصق الرمز المنسوخ في حقل **رمز HEC**.
1. الصق URI ورقم المنفذ لمثيل Splunk الخاص بك في حقل **HEC URI:PORT**. على سبيل المثال: `https://hec.splunk.com:8088`.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![تكامل Splunk](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    تفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations-ar.md"

1. انقر **اختبار التكامل** للتحقق من صحة التكوين، وتوافر Wallarm Cloud، وتنسيق الإشعار.

    اختبار إشعار Splunk بتنسيق JSON:

    ```json
    {
        summary:"[رسالة اختبار] [شريك اختبار (US)] تم اكتشاف ثغرة جديدة",
        description:"نوع الإشعار: ثغرة

                    تم اكتشاف ثغرة جديدة في نظامك.

                    المعرف: 
                    العنوان: اختبار
                    النطاق: example.com
                    المسار: 
                    الطريقة: 
                    المكتشف من قبل: 
                    العامل: 
                    النوع: معلومات
                    التهديد: متوسط

                    المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                    العميل: شركة الاختبار
                    السحابة: US
                    ",
        details:{
            client_name:"شركة الاختبار",
            cloud:"US",
            notification_type:"ثغرة",
            vuln_link:"https://us1.my.wallarm.com/object/555",
            vuln:{
                domain:"example.com",
                id:null,
                method:null,
                parameter:null,
                path:null,
                title:"اختبار",
                discovered_by:null,
                threat:"متوسط",
                type:"معلومات"
            }
        }
    }
    ```

1. انقر **إضافة تكامل**.

--8<-- "../include/cloud-ip-by-request.md"

## إعداد التنبيهات الإضافية

--8<-- "../include/integrations/integrations-trigger-setup-ar.md"

## تنظيم الأحداث في لوحة تحكم

--8<-- "../include/integrations/application-for-splunk.md"

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام وأخطاء في معايير التكامل

--8<-- "../include/integrations/integration-not-working.md"