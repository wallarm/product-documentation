# Sumo Logic

[Sumo Logic](https://www.sumologic.com/) هي منصة تحليلات بيانات الآلة المُعتمِدة على السحابة، والتي تقدم للمنظمات رؤى لحظية حول عمليات تكنولوجيا المعلومات الخاصة بها، والأمن، وأداء التطبيقات. يمكنكَ إعداد Wallarm لإرسال الرسائل إلى Sumo Logic.

## إعداد الإدماج

في واجهة مستخدم Sumo Logic:

1. قم بتكوين مُجمِّع مستضاف وفقًا لل[تعليمات](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. قم بتكوين مصدر لسجلات HTTP والمقاييس وفقًا لل[تعليمات](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. انسخ عنوان **HTTP Source Address (URL)** المُقدَّم.

في واجهة مستخدم Wallarm:

1. افتح قسم **الإدماجات**.
1. انقر على كتلة **Sumo Logic** أو انقر على زر **إضافة إدماج** واختر **Sumo Logic**.
1. أدخل اسمًا للإدماج.
1. الصق القيمة المنسوخة لعنوان **HTTP Source Address (URL)** في حقل **HTTP Source Address (URL)**.
1. اختر أنواع الأحداث لتحفيز الإشعارات.

    ![إدماج Sumo Logic](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    تفاصيل حول الأحداث المتاحة:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. انقر على **اختبار الإدماج** لفحص صحة التكوين، وتوافر سحابة Wallarm، وتنسيق الإشعار.

    اختبار إشعار Sumo Logic:

    ```json
    {
        summary:"[رسالة اختبار] [شريك اختبار(US)] تم اكتشاف ثغرة جديدة",
        description:"نوع الإشعار: ثغرة

                    تم اكتشاف ثغرة جديدة في نظامك.

                    الهوية: 
                    العنوان: اختبار
                    النطاق: example.com
                    المسار: 
                    الطريقة: 
                    المكتشف من قبل: 
                    المعامل: 
                    النوع: معلومة
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
                type:"معلومة"
            }
        }
    }
    ```

1. انقر على **إضافة إدماج**.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup.md"

## تعطيل وحذف الإدماج

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات الإدماج غير صحيحة

--8<-- "../include/integrations/integration-not-working.md"