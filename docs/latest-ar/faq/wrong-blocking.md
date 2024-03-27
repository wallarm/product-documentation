# طلب مشروع محظور

إذا أبلغك المستخدم أن طلباً مشروعاً قد تم حظره رغم تدابير Wallarm، يمكنكم مراجعة وتقييم طلباتهم كما يشرح هذا المقال.

لحل مشكلة حظر طلب مشروع بواسطة Wallarm، اتبع هذه الخطوات:

1. اطلب من المستخدم تقديم **كنص** (ليس لقطة شاشة) المعلومات المتعلقة بالطلب المحظور، والتي قد تكون أحد الآتي:

    * المعلومات التي يوفرها [صفحة الحظر](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) من Wallarm إذا تم تكوينها (قد تتضمن عنوان IP للمستخدم، وUUID للطلب وعناصر مُعدة مسبقاً أخرى).

        ![صفحة حظر Wallarm](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! تحذير "استخدام صفحة الحظر"
            إذا لم تستخدم صفحة الحظر الافتراضية أو المخصصة من Wallarm، يُنصح بشدة أن [تقوم بتكوينها](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) للحصول على المعلومات المناسبة من المستخدم. تذكر أن حتى صفحة نموذجية تجمع وتسمح بنسخ سهل للمعلومات ذات الصلة بالطلب المحظور. بالإضافة إلى ذلك، يمكنك تخصيص أو إعادة بناء هذه الصفحة لإرجاع رسالة حظر معلوماتية للمستخدمين.
    
    * نسخة من طلب العميل للمستخدم والاستجابة. رمز مصدر صفحة المتصفح أو الإدخال والإخراج النصي لعميل الطرفية يناسب جيداً.

1. في وحدة تحكم Wallarm → قسم [**الهجمات**](../user-guides/events/check-attack.md) أو [**الحوادث**](../user-guides/events/check-incident.md)، [ابحث](../user-guides/search-and-filters/use-search.md) عن الحدث المتعلق بالطلب المحظور. على سبيل المثال، [ابحث بمعرف الطلب](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. فحص الحدث لتحديد ما إذا كان يشير إلى حظر خاطئ أو مشروع.
1. إذا كان حظراً خاطئاً، حل المشكلة بتطبيق تدبير واحد أو مزيج من التدابير:

    * تدابير ضد [الإيجابيات الخاطئة](../user-guides/events/false-attack.md)
    * إعادة تكوين [القواعد](../user-guides/rules/rules.md)
    * إعادة تكوين [المشغلات](../user-guides/triggers/triggers.md)
    * تعديل [قوائم الـ IP](../user-guides/ip-lists/overview.md)

1. إذا كانت المعلومات المقدمة في البداية من المستخدم غير كاملة أو لم تكن متأكداً من التدابير التي يمكن تطبيقها بأمان، شارك التفاصيل مع [دعم Wallarm](mailto:support@wallarm.com) للمزيد من المساعدة والتحقيق.