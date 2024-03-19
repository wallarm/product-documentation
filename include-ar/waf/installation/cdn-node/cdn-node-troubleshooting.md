### ماذا تعني حالات عقد CDN؟

قد تظهر الحالات التالية في قسم **العقد** بوحدة تحكم Wallarm لعقد CDN:

* **قيد التسجيل**: Wallarm يقوم بتسجيل عقدة CDN في مزود خدمة السحاب.

    الإجراء المطلوب: الانتظار حتى حالة **يتطلب CNAME** لإضافة سجل CNAME الخاص بWallarm إلى سجلات DNS للنطاق المحمي.
* **يتطلب CNAME**: سجل CNAME الخاص بWallarm لم يتم إضافته إلى سجلات DNS للنطاق المحمي أو تمت إضافته ولكن لم ينتشر بعد.

    الإجراء المطلوب: إضافة سجل CNAME الذي يوفره Wallarm إلى سجلات DNS للنطاق المحمي أو الانتظار حتى تصبح التغييرات فعالة على الإنترنت.
    
    إذا لم تصبح التغييرات فعالة لأكثر من 24 ساعة، الرجاء التحقق من أن مزود النطاق الخاص بك قام بتحديث سجلات DNS بنجاح. إذا كان الأمر كذلك، ولكن حالة **لم ينتشر بعد** ما زالت معروضة في وحدة تحكم Wallarm، يرجى الاتصال ب[دعم فني Wallarm](mailto:support@wallarm.com).

    الحالة المتوقعة التالية هي **نشطة**.
* **قيد التكوين**: Wallarm يعالج التغيير في عنوان المنشأ أو شهادة SSL/TLS.

    الإجراء المطلوب: الانتظار حتى حالة **نشطة**.
* **نشطة**: عقدة CDN الخاصة بWallarm تخفف من حركة الإنترنت الضارة.

    الإجراء المطلوب: لا شيء. يمكنك مراقبة [الأحداث][events-docs] التي تكتشفها عقدة CDN.
* **قيد الحذف**: Wallarm يحذف عقدة CDN.

    الإجراء المطلوب: لا شيء، الرجاء الانتظار حتى يتم الانتهاء من الحذف.

### كيف يمكن تحديد انتشار سجل CNAME؟

قسم **العقد** في وحدة تحكم Wallarm يعرض الحالة الفعلية لمدى تأثير سجل CNAME الخاص بWallarm على الإنترنت. إذا تم انتشار سجل CNAME، فإن حالة العقدة CDN تكون **نشطة**.

بالإضافة إلى ذلك، يمكنك التحقق من رؤوس استجابة HTTP باستخدام الطلب التالي:

```bash
curl -v <PROTECTED_DOMAIN>
```

إذا تم انتشار سجل CNAME الخاص بWallarm، ستحتوي الاستجابة على رؤوس `section-io-*`.

إذا لم يتم انتشار سجل CNAME لأكثر من 24 ساعة، الرجاء التأكد من أن مزود النطاق قام بتحديث سجلات DNS بنجاح. إذا كان الأمر كذلك، ولكن حالة **لم ينتشر بعد** ما زالت معروضة في وحدة تحكم Wallarm، يرجى الاتصال ب[دعم فني Wallarm](mailto:support@wallarm.com).

### العقدة CDN مميزة باللون الأحمر في قسم **العقد**. ماذا يعني هذا؟

إذا كانت العقدة CDN مميزة باللون الأحمر في قسم **العقد**، فقد حدث خطأ أثناء تسجيلها أو تكوينها للأسباب التالية المحتملة:

* خطأ غير معروف أثناء تسجيل العقدة في مزود السحاب الخارجي

    الإجراء المطلوب: الاتصال ب[دعم فني Wallarm](mailto:support@wallarm.com).
* شهادة SSL/TLS مخصصة غير صالحة

    الإجراء المطلوب: التأكد من صلاحية الشهادة المرفوعة. إذا لم تكن كذلك، قم برفع الشهادة الصالحة.

العقدة CDN المميزة باللون الأحمر لا تعمل كوكيل للطلبات ونتيجة لذلك، لا تخفف من حركة الإنترنت الضارة.

### لماذا قد تختفي عقدة CDN من قائمة العقد في وحدة تحكم Wallarm؟

Wallarm يحذف عقد CDN التي ظل سجل CNAME الخاص بها دون تغيير لمدة 10 أيام أو أكثر منذ لحظة إنشاء العقدة.

إذا وجدت أن عقدة CDN قد اختفت، قم بإنشاء عقدة جديدة.

### لماذا يوجد تأخير في تحديث المحتوى المحمي بعقدة CDN؟

إذا كان موقعك محميًا بعقدة CDN ولاحظت أنك عندما تغير بياناتك، يتم تحديث الموقع بتأخير ملحوظ، فقد يكون السبب المحتمل هو [Varnish Cache][using-varnish-cache] الذي يسرع توصيل المحتوى الخاص بك، ولكن قد يتم تحديث النسخة المخزنة مؤقتًا على CDN بتأخير.

مثال:

1. لديك Varnish Cache ممكِن لعقدة CDN الخاصة بك.
1. قمت بتحديث أسعار على موقعك.
1. جميع الطلبات تتم عبر CDN، والذاكرة المخبأة لا تتم تحديثها على الفور.
1. يرى المستخدمون الأسعار القديمة لبعض الوقت.

لحل المشكلة، يمكنك تعطيل Varnish Cache. للقيام بذلك، انتقل إلى **العقد** → قائمة عقدة CDN → **تعطيل Varnish Cache**.