# Sumo Logic

[Sumo Logic](https://www.sumologic.com/) ده منصة تحليلات بيانات الآلة الأصلية للسحابة، بتوفر للمؤسسات رؤى فورية عن عمليات تكنولوجيا المعلومات بتاعتهم، الأمان، وأداء التطبيقات. يمكنك إعداد Wallarm عشان يبعت رسائل لـ Sumo Logic.

## إعداد الدمج

في واجهة Sumo Logic الاستخدام:

1. إعداد مُجمِّع مُستضاف باتباع [التعليمات](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. إعداد مصدر لسجلات ومقاييس HTTP باتباع [التعليمات](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. نسخ عنوان المصدر **HTTP Source Address (URL)** المُقدم.

في واجهة Wallarm الاستخدام:

1. افتح قسم **الدمج**.
1. اضغط على كتلة **Sumo Logic** أو اضغط على زر **أضف دمج** واختار **Sumo Logic**.
1. أدخِل اسم دمج.
1. الصق قيمة عنوان المصدر المُنسوخة في حقل **HTTP Source Address (URL)**.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![دمج Sumo Logic](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    تفاصيل عن الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. اضغط **اختبر الدمج** عشان تتأكد من صحة الإعدادات، توافر سحابة Wallarm، وصيغة الإشعار.

    اختبار إشعار Sumo Logic:

    ```json
    {
        summary:"[رسالة اختبار] [شريك الاختبار (US)] تم الكشف عن ثغرة جديدة",
        description:"نوع الإشعار: ثغرة

                    تم الكشف عن ثغرة جديدة في النظام الخاص بك.

                    الرقم التعريفي: 
                    العنوان: اختبار
                    النطاق: example.com
                    المسار: 
                    الطريقة: 
                    الكشف بواسطة: 
                    المعامل: 
                    النوع: معلومات
                    التهديد: متوسط

                    المزيد من التفاصيل: https://us1.my.wallarm.com/object/555


                    العميل: TestCompany
                    السحابة: US
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

1. اضغط **أضِف دمج**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## تعطيل وحذف الدمج

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توافر النظام وخطأ في مُعاملات الدمج

--8<-- "../include/integrations/integration-not-working.md"