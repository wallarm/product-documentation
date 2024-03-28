# يتم حظر الطلب المشروع

إذا أبلغ المستخدم عن حظر طلب مشروع رغم إجراءات Wallarm، يمكنك مراجعةوتقييم طلباتهم كما توضح هذه المقالة.

لحل مشكلة حظر طلب مشروع بواسطة Wallarm، اتبع الخطوات التالية:

1. اطلب من المستخدم أن يُوفر **كنص** (وليس لقطة شاشة) المعلومات المتعلقة بالطلب المحظور، والتي قد تكون أحد العناصر التالية:

    * المعلومات الموفرة بواسطة [صفحة الحظر](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) من Wallarm إذا تم تكوينها (قد تشمل عنوان IP للمُستخدم، UUID الطلب وعناصر مُعدة مسبقًا أخرى).

        ![صفحة الحظر من Wallarm](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)
        
        !!! تحذير "استخدام صفحة الحظر"
            إذا لم تستخدم صفحة الحظر الافتراضية أو المُخصصة من Wallarm، يُنصح بشدة بـ[تكوينها](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) للحصول على المعلومات المناسبة من المستخدم. تذكر أن حتى صفحة العينة تجمعوتسمح بنسخ سهل للمعلومات ذات الصلة بالطلب المحظور. بالإضافة إلى ذلك، يمكنك تخصيص أو إعادة بناء مثل هذه الصفحة لإرجاع رسالة الحظر المعلوماتية للمستخدمين.

    * نسخة من طلب العميل والاستجابة. يناسب كود مصدر صفحة المتصفح أو إدخال وخروج العميل النصي في الطرفية جيدًا.

1. في وحدة تحكم Wallarm → قسم [**الهجمات**](../user-guides/events/check-attack.md) أو [**الحوادث**](../user-guides/events/check-incident.md)، [ابحث](../user-guides/search-and-filters/use-search.md) عن الحدث المتعلق بالطلب المحظور. على سبيل المثال، [البحث بواسطة معرف الطلب](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. فحص الحدث لتحديد إذا كان يشير إلى حظر خاطئ أو مشروع.
1. إذا كان الحظر خاطئًا، حل المشكلة بتطبيق إجراء أو مجموعة من الإجراءات:

    * إجراءات ضد [الإيجابيات الكاذبة](../user-guides/events/false-attack.md)
    * إعادة تكوين [القواعد](../user-guides/rules/rules.md)
    * إعادة تكوين [المشغلات](../user-guides/triggers/triggers.md)
    * تعديل [قوائم الـIP](../user-guides/ip-lists/overview.md)

1. إذا كانت المعلومات التي وفرها المستخدم في البداية غير كاملة أو كنت غير متأكد من الإجراءات التي يمكن تطبيقها بأمان، شارك التفاصيل مع [دعم Wallarm](mailto:support@wallarm.com) لمزيد من المساعدة والتحقيق.