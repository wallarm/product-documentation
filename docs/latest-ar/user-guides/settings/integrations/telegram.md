# تيليجرام

[تيليجرام](https://telegram.org/) هو منصة للتراسل الفوري وتطبيق لوسائل التواصل الاجتماعي تعمل بالسحابة. يمكنك ضبط Wallarm لإرسال التقارير المجدولة والإشعارات الفورية إلى تيليجرام.

يمكن إرسال التقارير المجدولة يوميًا، أسبوعيًا، أو شهريًا. تتضمن التقارير معلومات تفصيلية عن الثغرات الأمنية، الهجمات، والحوادث التي تم اكتشافها في نظامك خلال الفترة المختارة. تشمل الإشعارات تفاصيل مختصرة عن الأحداث المثارة.

## إعداد التكامل

1. افتح قسم **التكاملات**.
1. انقر على كتلة **تيليجرام** أو انقر على زر **إضافة تكامل** واختر **تيليجرام**.
1. أضف [@WallarmUSBot](https://t.me/WallarmUSBot) (إذا كنت تستخدم Wallarm السحابة الأمريكية) أو [@WallarmBot](https://t.me/WallarmBot) (إذا كنت تستخدم Wallarm السحابة الأوروبية) إلى مجموعة تيليجرام التي تتلقى إشعارات Wallarm واتبع رابط المصادقة.
1. بعد التوجيه إلى واجهة Wallarm، صادق البوت.
1. أدخل اسمًا للتكامل.
1. اختر تواتر إرسال التقارير الأمنية. إذا لم يتم اختيار تواتر، فلن يتم إرسال التقارير.
1. اختر أنواع الأحداث لتشغيل الإشعارات.

    ![تكامل تيليجرام](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    تفاصيل عن الأحداث المتاحة:

    --8<-- "../include/integrations/events-for-integrations.md"

    يمكن اختبار التكامل مع تيليجرام فقط إذا تم إنشاء هذا التكامل بالفعل.

1. انقر **إضافة تكامل**.
1. افتح بطاقة التكامل المُنشأة مرة أخرى.
1. انقر **اختبار التكامل** للتحقق من صحة التكوين، توفر Wallarm Cloud، وتنسيق الإشعار.

    سيتم إرسال الإشعارات التجريبية بالبادئة `[رسالة اختبار]`:

    ```
    [رسالة اختبار] [شريك اختبار] تغير محيط الشبكة

    نوع الإشعار: new_scope_object_ips

    تم اكتشاف عناوين IP جديدة في محيط الشبكة:
    8.8.8.8

    العميل: TestCompany
    السحابة: الاتحاد الأوروبي
    ```

يمكنك أيضًا بدء الدردشة مباشرةً مع [@WallarmUSBot](https://t.me/WallarmUSBot) أو [@WallarmBot](https://t.me/WallarmBot). سوف يرسل البوت التقارير والإشعارات كذلك.

## إعداد تنبيهات إضافية

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## تعطيل وحذف التكامل

--8<-- "../include/integrations/integrations-disable-delete.md"

## عدم توفر النظام ومعلمات التكامل غير الصحيحة

--8<-- "../include/integrations/integration-not-working.md"