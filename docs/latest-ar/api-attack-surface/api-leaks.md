# تسريبات واجهة برمجة التطبيقات

يقوم وحدة **تسريبات واجهة برمجة التطبيقات** في منصة Wallarm بفحص الأماكن العامة والمصادر المختارة بنشاط للتحقق من تسريبات رموز واجهة برمجة التطبيقات. توفر هذه المقالة نظرة عامة حول تسريبات واجهة برمجة التطبيقات: القضايا التي يتناولها، الغرض منه والإمكانيات الرئيسية.

يمكن أن تعمل الوحدة في وضعين مختلفين:

* **الكشف فقط** عن تسريبات واجهة برمجة التطبيقات وإبلاغ المستخدمين عن ذلك عبر قسم **تسريبات واجهة برمجة التطبيقات** في Wallarm Cloud.
* الكشف و[**تنفيذ إجراءات لمنع**](#making-decisions) استخدام البيانات المسربة حتى يتم إعادة توليدها أو إزالتها. يتطلب ذلك توزيع [عقدة](../user-guides/nodes/nodes.md) أو أكثر من عقد Wallarm.

![تسريبات واجهة برمجة التطبيقات](../images/api-attack-surface/api-leaks.png)

!!! معلومة "تفعيل تسريبات واجهة برمجة التطبيقات"
    بشكل افتراضي، وحدة تسريبات واجهة برمجة التطبيقات معطلة. للحصول على الوصول إلى الوحدة، الرجاء إرسال طلب إلى [الدعم الفني لـ Wallarm](mailto:support@wallarm.com).

## القضايا التي تعالجها تسريبات واجهة برمجة التطبيقات

قد تستخدم منظمتك عددا من رموز واجهة برمجة التطبيقات لتوفير الوصول إلى أجزاء مختلفة من واجهة برمجة التطبيقات الخاصة بك. إذا تم تسريب هذه الرموز، فإنها تصبح تهديدا أمنيا.

لحماية واجهات برمجة التطبيقات الخاصة بك، تحتاج إلى مراقبة الأماكن العامة للعثور على أي رموز واجهة برمجة التطبيقات مسربة، دون تفويت أي حالة - وإلا، فإنك لا تزال تحت التهديد. لتحقيق ذلك، يجب عليك تحليل كمية هائلة من البيانات مرارا وتكرارا.

إذا تم العثور على أسرار واجهة برمجة التطبيقات المسربة، فإن الاستجابة متعددة الجوانب مطلوبة لمنع الضرر بواجهات برمجة التطبيقات الخاصة بك. يتضمن ذلك العثور على جميع الأماكن التي تُستخدم فيها الأسرار المسربة، إعادة توليدها في جميع هذه الأماكن، ومنع استخدام النسخ المخترقة - ويجب أن يتم ذلك بسرعة، وبنسبة 100% من الاكتمال. هذا صعب التحقيق يدويا.

تساعد وحدة **تسريبات واجهة برمجة التطبيقات** من Wallarm على حل هذه القضايا من خلال تقديم ما يلي:

* الكشف التلقائي عن رموز واجهة برمجة التطبيقات المسربة من المصادر العامة المختارة وتسجيل التسريبات المكتشفة في واجهة المستخدم للوحة تحكم Wallarm.
* الكشف عن مستوى الخطر.
* إمكانية إضافة التسريبات يدويا.
* القدرة على اتخاذ القرارات الخاصة بك حول كيفية التعامل مع مشكلات البيانات المسربة في كل حالة.

## تسريبات جديدة لواجهة برمجة التطبيقات

هناك طريقتان لتسجيل تسريبات جديدة:

* تلقائية - يقوم Wallarm بفحص الأماكن العامة والمصادر المختارة بنشاط وإضافة تسريبات جديدة إلى القائمة. قم بترتيب حسب **الحالة** وعرض التسريبات `المفتوحة` - تتطلب اهتمامك.
* يدوية - أضف تسريبات واجهة برمجة التطبيقات يدويا. كل واحد عبارة عن مجموعة من الرموز المسربة.

![تسريبات واجهة برمجة التطبيقات - الإضافة اليدوية](../images/api-attack-surface/api-leaks-add-manually.png)

## تحديد المصادر للبحث عن تسريبات واجهة برمجة التطبيقات

يمكنك تحديد المكان للبحث عن تسريبات واجهة برمجة التطبيقات، وإضافة الأماكن العامة والمصادر الأخرى المعروفة. يمكنك إضافة النطاقات، وسيقوم Wallarm تلقائيا بالبحث عنها للتسريبات والنطاقات الفرعية المعروضة.

لتحديد مصادر البحث عن تسريبات واجهة برمجة التطبيقات:

1. في قسم **تسريبات واجهة برمجة التطبيقات**، انقر على **تكوين**.
1. في علامة التبويب **النطاق**، انقر على **إضافة نطاق**، أضف اسم النطاق وأكد الإضافة.

    سيبدأ Wallarm بالبحث عن النطاقات الفرعية وبيانات الاعتماد المنشورة المسربة تحت النطاق. سيتم عرض تقدم البحث والنتائج في علامة التبويب **الحالة**.

![تسريبات واجهة برمجة التطبيقات - تكوين النطاق](../images/api-attack-surface/api-leaks-configure-scope.png)

## التصور التفاعلي

يوفر قسم **تسريبات واجهة برمجة التطبيقات** تمثيلا بصريا غنيا للوضع الحالي بالنسبة لتسريبات واجهة برمجة التطبيقات التي تم العثور عليها. استخدم الرسوم البيانية لتحليل الوضع الحالي بسرعة مع التسريبات المكتشفة، انقر على عناصر الرسم البياني لتصفية التسريبات حسب مستويات الخطر والمصادر.

![تسريبات واجهة برمجة التطبيقات - التصور](../images/api-attack-surface/api-leaks-visual.png)

## اتخاذ القرارات

بغض النظر عن كيفية إضافة تسريب واجهة برمجة التطبيقات - تلقائيًا أو يدويًا - فإن قرار ماذا تفعل هو دوما لك. يمكنك إدارة هذه القرارات كما يلي:

* تطبيق تصحيح افتراضي لمنع جميع محاولات استخدام الرموز المسربة.

    سيتم إنشاء [قاعدة تصحيح افتراضية](../user-guides/rules/vpatch-rule.md).

* وسم التسريب كزائف إذا كنت تعتقد أنه تمت إضافته عن طريق الخطأ.
* إغلاق التسريبات لوقف الحماية بمجرد إعادة توليد جميع الرموز المسربة أو إزالتها. سوف يزيل ذلك قاعدة التصحيح الافتراضية.
* حتى إذا تم إغلاق تسريب، لا يتم حذفه. أعد فتحه ثم طبق الإصلاح لبدء الحماية مرة أخرى.

## محاولات استخدام الرموز المسربة

في وحة تحكم Wallarm → **الهجمات**، ضبط فلتر **النوع** إلى `تصحيح افتراضي` (`vpatch`) لرؤية جميع محاولات استخدام الرموز المسربة.

![الأحداث - تسريبات واجهة برمجة التطبيقات عبر vpatch](../images/api-attack-surface/api-leaks-in-events.png)

للآن، يمكنك تتبع محاولات استخدام الرموز المسربة فقط إذا تم تطبيق `vpatch`.