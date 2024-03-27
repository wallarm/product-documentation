[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

[Splunk](https://www.splunk.com/) هو منصة تم تصميمها للبحث، المراقبة، وتحليل البيانات التي تنتجها الآلات، بما في ذلك السجلات، الأحداث، وأشكال أخرى من البيانات التشغيلية والتجارية. يمكنك إعداد Wallarm لإرسال التنبيهات إلى Splunk.

##  إعداد التكامل

في واجهة مستخدم Splunk:

1. افتح **الإعدادات** ➝ **إضافة بيانات** ➝ **مراقبة**.
2. اختر خيار **جامع الأحداث الHTTP**، أدخل اسم التكامل وانقر على **التالي**.
3. تجاوز اختيار نوع البيانات في صفحة **إعدادات الإدخال** واستمر إلى **مراجعة الإعدادات**.
4. راجع و**قدم** الإعدادات.
5. انسخ الرمز المقدم.

في واجهة مستخدم Wallarm:

1. افتح قسم **التكاملات**.
1. اضغط على كتلة **Splunk** أو اضغط على زر **إضافة تكامل** واختر **Splunk**.
1. أدخل اسم التكامل.
1. الصق الرمز المنسوخ في حقل **رمز HEC**.
1. الصق الـURI الخاص بHEC ورقم المنفذ لنسختك من Splunk في حقل **HEC URI:PORT**. مثال: `https://hec.splunk.com:8088`.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![Splunk integration](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    تفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. اضغط على **اختبار التكامل** للتحقق من صحة الإعدادات، توفر cloud من Wallarm، وصيغة الإشعار.

    اختبار إشعار Splunk بصيغة JSON:

    ```json
    {
        summary:"[رسالة اختبار] [شريك اختبار (US)] تم اكتشاف ثغرة جديدة",
        description:"نوع الإشعار: ثغرة

                    تم اكتشاف ثغرة جديدة في نظامك.

                    الرقم التعريفي: 
                    العنوان: اختبار
                    النطاق: example.com
                    المسار: 
                    الطريقة: 
                    المكتشف بواسطة: 
                    البارامتر: 
                    النوع: معلومات
                    الخطر: متوسط

                    المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                    العميل: TestCompany
                    السحاب: US
                    ",
        details:{
            client_name:"TestCompany",
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

1. اضغط على **إضافة تكامل**.

--8<-- "../include/cloud-ip-by-request.md"

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## تنظيم الأحداث في لوحة تحكم

--8<-- "../include/integrations/application-for-splunk.md"

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعايير التكامل الغير صحيحة

--8<-- "../include/integrations/integration-not-working.md"