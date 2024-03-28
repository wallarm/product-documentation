# نظرة عامة على API لـ Wallarm

توفر واجهة برمجة التطبيقات (API) من Wallarm تفاعلًا بين مكونات نظام Wallarm. يمكنك استخدام طرق API في Wallarm لإنشاء، الحصول على، أو تحديث الحالات التالية:

* الثغرات الأمنية
* الهجمات
* الحوادث
* المستخدمين
* العملاء
* عقد الفلترة
* إلخ.

يتم تقديم وصف طرق API في **واجهة Wallarm API** المتاحة من واجهة Wallarm ← أعلى اليمين ← `؟` → **واجهة Wallarm API** أو مباشرةً عبر الرابط:

* https://apiconsole.us1.wallarm.com/ لـ[السحابة الأمريكية](../about-wallarm/overview.md#us-cloud)
* https://apiconsole.eu1.wallarm.com/ لـ[السحابة الأوروبية](../about-wallarm/overview.md#eu-cloud)

![واجهة Wallarm API](../images/wallarm-api-reference.png)

## نقطة نهاية API

يتم إرسال طلبات API إلى عنوان URL التالي:

* `https://us1.api.wallarm.com/` لـ[السحابة الأمريكية](../about-wallarm/overview.md#us-cloud)
* `https://api.wallarm.com/` لـ[السحابة الأوروبية](../about-wallarm/overview.md#eu-cloud)

## مصادقة طلبات API

يجب أن تكون مستخدمًا مُعتمدًا لتقديم طلبات API إلى Wallarm. تعتمد طريقة مصادقة طلبات API على العميل الذي يرسل الطلب:

* [واجهة مرجع API](#api-reference-ui)
* [عميل API الخاص بك](#your-own-api-client)

### واجهة Wallarm API

يتم استخدام رمز لمصادقة الطلب. يتم توليد الرمز بعد المصادقة الناجحة في حساب Wallarm الخاص بك.

1. قم بتسجيل الدخول إلى واجهة Wallarm باستخدام الرابط: 
    * https://us1.my.wallarm.com/ للسحابة الأمريكية
    * https://my.wallarm.com/ للسحابة الأوروبية
2. قم بتحديث صفحة واجهة Wallarm API باستخدام الرابط:
    * https://apiconsole.us1.wallarm.com/ للسحابة الأمريكية
    * https://apiconsole.eu1.wallarm.com/ للسحابة الأوروبية
3. انتقل إلى طريقة API المطلوبة → القسم **جربها**، أدخل قيم الوسائط و**نفِّذ** الطلب.

### عميل API الخاص بك

لمصادقة الطلبات من عميل API الخاص بك إلى API لـ Wallarm:

1. قم بتسجيل الدخول إلى حساب Wallarm الخاص بك في [السحابة الأمريكية](https://us1.my.wallarm.com/) أو [السحابة الأوروبية](https://my.wallarm.com/) → **الإعدادات** → **رموز API**.
1. [قم بإنشاء](../user-guides/settings/api-tokens.md#configuring-tokens) رمز للوصول إلى API لـ Wallarm.
1. افتح رمزك وانسخ القيمة من القطاع **الرمز**.
1. أرسل طلب API المطلوب مرورًا بقيمة **الرمز** في معامل الرأس `X-WallarmApi-Token`.

[مزيد من التفاصيل حول رموز API →](../user-guides/settings/api-tokens.md)

## نهج Wallarm في تطوير وتوثيق API

مرجع API من Wallarm هو تطبيق صفحة واحدة (SPA) مع جميع البيانات المعروضة يتم جلبها ديناميكيًا من API. يدفع هذا التصميم Wallarm إلى استخدام نهج [إعطاء الأولوية لـ API](https://swagger.io/resources/articles/adopting-an-api-first-approach/) عندما يصبح البيانات والوظائف الجديدة متاحة أولاً في API العام وكخطوة تالية يتم وصفها في مرجع API. عادةً ما يتم إصدار جميع الوظائف الجديدة بالتوازي في كل من API العام ومرجع API، ولكن أحيانًا يتم إصدار تغييرات API الجديدة قبل تغييرات مرجع API، وبعض الوظائف متاحة عبر API العام فقط.

يتم إنشاء مرجع API من Wallarm من ملف Swagger باستخدام أداة [Swagger UI](https://swagger.io/tools/swagger-ui/). يوفر مرجع API طريقة سهلة للتعرف على نقاط النهاية، والطرق، وهياكل البيانات المتاحة في API. كما يوفر طريقة بسيطة لتجربة جميع نقاط النهاية المتاحة.