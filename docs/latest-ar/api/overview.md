[user-roles-article]: ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]: ../images/api-tokens-edit.png

# نظرة عامة على Wallarm API

Wallarm API يوفر التفاعل بين مكونات نظام Wallarm. يمكن استخدام طرق Wallarm API لإنشاء أو استرداد أو تحديث الحالات التالية:

* الثغرات الأمنية
* الهجمات
* الحوادث
* المستخدمين
* العملاء
* عقد الفلترة
* إلخ.

يتم تقديم وصف طرق API في **واجهة Wallarm API Console** المتاحة من واجهة Wallarm → الزاوية العلوية اليمنى → `؟` → **واجهة Wallarm API Console** أو مباشرةً عبر الرابط:

* https://apiconsole.us1.wallarm.com/ لـ[سحابة الولايات المتحدة](../about-wallarm/overview.md#us-cloud)
* https://apiconsole.eu1.wallarm.com/ لـ[سحابة الاتحاد الأوروبي](../about-wallarm/overview.md#eu-cloud)

![واجهة Wallarm API Console](../images/wallarm-api-reference.png)

## نقطة نهاية API

تُرسل طلبات API إلى عنوان URL التالي:

* `https://us1.api.wallarm.com/` لـ[سحابة الولايات المتحدة](../about-wallarm/overview.md#us-cloud)
* `https://api.wallarm.com/` لـ[سحابة الاتحاد الأوروبي](../about-wallarm/overview.md#eu-cloud)

## مصادقة طلبات API

يجب أن تكون مستخدمًا موثقًا لإجراء طلبات Wallarm API. تعتمد طريقة مصادقة طلبات API على العميل الذي يرسل الطلب:

* [واجهة مرجع API](#api-reference-ui)
* [عميل API الخاص بك](#your-own-api-client)

### واجهة Wallarm API Console

يُستخدم رمز لمصادقة الطلب. يتم توليد الرمز بعد المصادقة الناجحة في حسابك على Wallarm.

1. قم بتسجيل الدخول إلى واجهة Wallarm الخاصة بك باستخدام الرابط:
    * https://us1.my.wallarm.com/ لـسحابة الولايات المتحدة
    * https://my.wallarm.com/ لـسحابة الاتحاد الأوروبي
2. قم بتحديث صفحة واجهة Wallarm API Console باستخدام الرابط:
    * https://apiconsole.us1.wallarm.com/ لـسحابة الولايات المتحدة
    * https://apiconsole.eu1.wallarm.com/ لـسحابة الاتحاد الأوروبي
3. انتقل إلى طريقة API المطلوبة → قسم **جربها الآن**، أدخل قيم المعلمات و**نفذ** الطلب.

### عميل API الخاص بك

لمصادقة الطلبات من عميل API الخاص بك إلى Wallarm API:

1. قم بتسجيل الدخول إلى حسابك على Wallarm في [سحابة الولايات المتحدة](https://us1.my.wallarm.com/) أو [سحابة الاتحاد الأوروبي](https://my.wallarm.com/)  → **الإعدادات** → **رموز API**.
1. [إنشاء](../user-guides/settings/api-tokens.md#configuring-tokens) رمز للوصول إلى Wallarm API.
1. افتح رمزك وانسخ القيمة من قسم **الرمز**.
1. أرسل الطلب المطلوب لـAPI مرورًا بقيمة **الرمز** في معيار رأس `X-WallarmApi-Token`.

[المزيد عن رموز API →](../user-guides/settings/api-tokens.md)

## نهج Wallarm في تطوير API والتوثيق

Wallarm API Reference هو تطبيق صفحة واحدة (SPA) حيث يتم جلب جميع البيانات المعروضة ديناميكيًا من الـAPI. يدفع هذا التصميم Wallarm لاستخدام نهج [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) عندما يتم أولاً جعل البيانات والوظائف الجديدة متاحة في الـAPI العام وكخطوة تالية يتم وصفها في مرجع الـAPI. عادةً، يتم إصدار جميع الوظائف الجديدة بشكل متوازي في كل من الـAPI العام ومرجع الـAPI، لكن أحيانًا يتم إصدار تغييرات الـAPI الجديدة قبل تغييرات مرجع الـAPI، وبعض الوظائف متاحة عبر الـAPI العام فقط.

يتم إنشاء Wallarm API Reference من ملف Swagger باستخدام أداة [Swagger UI](https://swagger.io/tools/swagger-ui/). يوفر مرجع الـAPI طريقة سهلة للتعرف على نقاط النهاية للـAPI والطرق وهياكل البيانات المتاحة. كما يوفر طريقة بسيطة لتجربة جميع نقاط النهاية المتاحة.