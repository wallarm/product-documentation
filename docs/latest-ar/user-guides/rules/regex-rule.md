[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md

# كاشفات محددة من قبل المستخدم

Wallarm يقدم **إنشاء مؤشر غزو مبني على regexp** [قاعدة](../../user-guides/rules/rules.md) لتحديد علامات الغزو الخاصة بك والتي يتم وصفها بواسطة التعبيرات النمطية العادية.

## إنشاء وتطبيق قاعدة

لضبط وتطبيق كاشف غزو خاص بك:

1. انتقل إلى Wallarm Console → **القواعد** → **إضافة قاعدة**.
1. في **إذا كانت الطلبية هي**, [حدد](rules.md#branch-description) نطاق تطبيق القاعدة عليه.
1. في **ثم**, اختر **إنشاء مؤشر غزو مبني على regexp** واضبط معاملات مؤشر الغزو الخاص بك:

    * **تعبير نمطي عادي** - تعبير نمطي عادي (توقيع). إذا كانت قيمة المعلمة التالية تطابق التعبير, يتم اكتشاف تلك الطلبية كغزو. نحو وخصائص التعبيرات النمطية العادية موضحة في [التعليمات الخاصة بإضافة القواعد](rules.md#condition-type-regex).

        !!! تحذير "تغيير التعبير النمطي العادي المحدد في القاعدة"
            تغيير التعبير النمطي العادي المحدد في القاعدة القائمة من نوع **إنشاء مؤشر غزو مبني على regexp** يؤدي إلى حذف تلقائي للقواعد [**تعطيل كشف الغزو المبني على regexp**](#partial-disabling) التي تستخدم التعبير السابق.

            لتعطيل كشف الغزو بواسطة تعبير نمطي عادي جديد, يرجى إنشاء قاعدة جديدة **تعطيل كشف الغزو المبني على regexp** مع التعبير النمطي العادي المحدد الجديد.

    * **تجريبي** - هذا العلم يتيح لك التحقق بأمان من تشغيل التعبير النمطي عادي دون حظر الطلبات. الطلبات لن تكون محظورة حتى عندما يكون عقدة الفلتر على وضع الحظر. هذه الطلبات ستعتبر كغزوات تم اكتشافها بالطريقة التجريبية وستكون مخفية من قائمة الحدث بشكل افتراضي. يمكن الوصول إليها باستخدام استعلام البحث `الغزوات التجريبية`.

    * **غزو** - نوع الغزو الذي سيتم اكتشافه عندما تطابق قيمة المعلمة في الطلب التعبير النمطي عادي.

1. في **في هذا الجزء من الطلب**, حدد [أجزاء الطلب](request-processing.md) التي تريد البحث فيها عن علامات الغزو.
1. انتظر [اكتمال تجميع القاعدة](rules.md#ruleset-lifecycle).

## أمثلة على القواعد

### حظر جميع الطلبات مع `X-AUTHENTICATION` رأس غير صحيح

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### حظر جميع الطلبات مع `class.module.classLoader.*` معاملات الجسم

إحدى الطرق لاستغلال الثغرة 0-day في [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) هو إرسال طلب POST مع حمولات ضارة معينة محقونة في معاملات الجسم التالية:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

إذا كنت تستخدم Spring Core Framework المعرض للخطر و [وضع](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) عقدة Wallarm مختلف عن الحظر, يمكنك منع استغلال الثغرة باستخدام التصحيح الافتراضي. القاعدة التالية ستحظر جميع الطلبات مع معاملات الجسم المذكورة حتى في أوضاع المراقبة والحظر الآمن:

![تصحيح افتراضي لمعاملات الوظيفة المحددة](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

قيمة حقل التعبير النمطي عادي هي:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

عقدة Wallarm العاملة في [وضع](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) الحظر تحظر محاولات استغلال مثل هذه الثغرة بشكل افتراضي.

مكون Spring Cloud Function لديه أيضا ثغرة نشطة (CVE-2022-22963). إذا كنت تستخدم هذا المكون و [وضع](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) عقدة Wallarm مختلف عن الحظر, أنشئ التصحيح الافتراضي كما هو موضح [أدناه](#example-block-all-requests-with-the-class-cloud-function-routing-expression-header).

### حظر جميع الطلبات مع `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` ر

مكون Spring Cloud Function لديه ثغرة نشطة (CVE-2022-22963) يمكن استغلالها عن طريق حقن حمولات ضارة في رأس `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` أو `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`.

إذا كنت تستخدم هذا المكون و [وضع](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) عقدة Wallarm مختلف عن الحظر, يمكنك منع استغلال الثغرة باستخدام التصحيح الافتراضي. القاعدة التالية ستحظر جميع الطلبات التي تحتوي على رأس `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`:

![تصحيح افتراضي لرأس محدد](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! معلومة "حظر الطلبات مع رأس `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`"
    هذه القاعدة لا تحظر الطلبات مع رأس `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` ولكن NGINX يسقط الطلبات مع هذا الرأس كطلبات غير صالحة بشكل افتراضي.

عقدة Wallarm العاملة في [وضع](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) الحظر تحظر محاولات استغلال مثل هذه الثغرة بشكل افتراضي.

هناك أيضا ثغرة 0-day في [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell). تعرف على كيفية حظر محاولات استغلالها باستخدام [التصحيح الافتراضي المبني على reqexp](#example-block-all-requests-with-the-classmoduleclassloader-body-parameters).

## تعطيل جزئي

إذا كان يجب تعطيل القاعدة المنشأة جزئياً لفرع معين, يمكن القيام به بسهولة من خلال إنشاء قاعدة **تعطيل كشف الغزو المبني على regexp** مع الحقول التالية:

- *تعبير نمطي عادي*: التعبيرات النمطية العادية المنشأة سابقاً والتي يجب تجاهلها.

    !!! تحذير "سلوك القاعدة إن تم تغيير التعبير النمطي العادي"
        تغيير التعبير النمطي العادي المحدد في القاعدة القائمة من النوع [**إنشاء مؤشر غزو مبني على regexp**](#creating-and-applying-rule) يؤدي إلى حذف تلقائي للقواعد **تعطيل كشف الغزو المبني على regexp** التي تستخدم التعبير السابق.

        لتعطيل كشف الغزو بواسطة تعبير نمطي عادي جديد, يرجى إنشاء قاعدة جديدة **تعطيل كشف الغزو المبني على regexp** مع التعبير النمطي العادي المحدد الجديد.

- *في هذا الجزء من الطلب*: يشير إلى المعلم الذي يتطلب إعداد استثناء.

**مثال: السماح برأس X-Authentication غير صحيح لعنوان URL محدد**

لنفترض أن لديك سكربت في `example.com/test.php`, وتريد تغيير تنسيق الرموز المميزة له.

لإنشاء القاعدة المعنية:

1. انتقل إلى تبويب *القواعد*
1. ابحث أو أنشئ فرع لـ `example.com/test.php` وانقر على *إضافة قاعدة*
1. اختر *تعطيل كشف الغزو المبني على regexp*
1. حدد التعبير النمطي العادي الذي تريد تعطيله
1. حدد النقطة `رأس X-AUTHENTICATION`
1. انقر على *إنشاء*

![مثال على قاعدة التعبير الثانية][img-regex-example2]

## استدعاء واجهة برمجة التطبيقات لإنشاء القاعدة

لإنشاء مؤشر الغزو المبني على regexp, يمكنك [الاتصال مباشرةً بواجهة برمجة التطبيقات Wallarm](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks).