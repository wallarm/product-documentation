[link-regex]:               https://github.com/yandex/pire
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[img-regex-example2]:       ../../images/user-guides/rules/regex-rule-2.png
[img-regex-id]:             ../../images/user-guides/rules/regex-id.png
[request-processing]:       ../../user-guides/rules/request-processing.md

# مكتشفات الهجمات المُعرّفة من المستخدم

توفر Wallarm قاعدة **إنشاء مؤشر هجوم مبني على التعبير النظامي** [rule](../../user-guides/rules/rules.md) لتحديد علامات الهجوم الخاصة بك التي يتم وصفها باستخدام التعبيرات النظامية.

## إنشاء وتطبيق القاعدة

لتحديد وتطبيق مُكتشف هجماتك الخاص:

1. انتقل إلى واجهة Wallarm → **القواعد** → **إضافة قاعدة**.
1. في **إذا كانت الطلبية**, [صِف](rules.md#rule-branches) نطاق تطبيق القاعدة.
1. في **ثم**, اختر **إنشاء مؤشر هجوم مبني على التعبير النظامي** وتعيين معايير مؤشر الهجوم الخاصة بك:

    * **التعبير النظامي** - التعبير النظامي (التوقيع). إذا تطابقت قيمة العامل التالي مع التعبير، يتم اكتشاف الطلب على أنه هجوم. يتم وصف بناء الجملة وخصوصيات التعبيرات النظامية في [تعليمات إضافة القواعد](rules.md#condition-type-regex).

        !!! warning "تغيير التعبير النظامي المحدد في القاعدة"
            يؤدي تغيير التعبير النظامي المحدد في القاعدة القائمة من نوع **إنشاء مؤشر هجوم مبني على التعبير النظامي** إلى حذف تلقائي للقواعد [**تعطيل كشف الهجوم المبني على التعبير النظامي**](#partial-disabling) التي تستخدم التعبير السابق.

            لتعطيل كشف الهجوم بواسطة تعبير نظامي جديد، يرجى إنشاء قاعدة جديدة **تعطيل كشف الهجوم المبني على التعبير النظامي** مع التعبير النظامي المحدد الجديد.

    * **تجريبي** - تسمح هذه العلامة بفحص تشغيل التعبير النظامي بأمان دون حجب الطلبات. لن يتم حجب الطلبات حتى عندما يتم ضبط عقدة الفلترة على وضع الحجب. ستعتبر هذه الطلبات بمثابة هجمات تم اكتشافها بالطريقة التجريبية وسيتم إخفاؤها من قائمة الأحداث بشكل افتراضي. يمكن الوصول إليها باستخدام استعلام البحث `هجمات تجريبية`.

    * **الهجوم** - نوع الهجوم الذي سيتم اكتشافه عندما تطابق قيمة العامل في الطلب التعبير النظامي.

1. في **في هذا الجزء من الطلبية**, حدد [أجزاء الطلب](request-processing.md) التي ترغب في البحث فيها عن علامات الهجوم.
1. انتظر اكتمال [تجميع القاعدة](rules.md#ruleset-lifecycle).

## أمثلة على القواعد

### حجب جميع الطلبات ذات الرأس `X-AUTHENTICATION` غير الصحيح

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

### حجب جميع الطلبات بها معايير في الجسم `class.module.classLoader.*`

إحدى طرق استغلال ثغرة اليوم الصفر في [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell) هي إرسال طلب POST به حمولات ضارة مُضافة إلى المعايير التالية في الجسم:

* `class.module.classLoader.resources.context.parent.pipeline.first.pattern`
* `class.module.classLoader.resources.context.parent.pipeline.first.suffix`
* `class.module.classLoader.resources.context.parent.pipeline.first.directory`
* `class.module.classLoader.resources.context.parent.pipeline.first.prefix`
* `class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat`

إذا كنت تستخدم Spring Core Framework القابلة للاستغلال ووضع عقدة Wallarm [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) مختلف عن الحجب، يمكنك منع استغلال الثغرة باستخدام الرقعة الافتراضية. ستقوم القاعدة التالية بحجب جميع الطلبات التي تحتوي على المعايير المذكورة في الجسم حتى في أوضاع المراقبة والحجب الآمن:

![الرقعة الافتراضية لمعايير الطلبات المحددة](../../images/user-guides/rules/regexp-rule-post-params-spring.png)

قيمة حقل التعبير النظامي هي:

```bash
(class[.]module[.]classLoader[.]resources[.]context[.]parent[.]pipeline[.]first[.])(pattern|suffix|directory|prefix|fileDateFormat)
```

تقوم عقدة Wallarm العاملة في وضع [الحجب](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) بحجب محاولات استغلال مثل هذه الثغرة افتراضيًا.

مكون Spring Cloud Function يحتوي أيضًا على ثغرة نشطة (CVE-2022-22963). إذا كنت تستخدم هذا المكون ووضع عقدة Wallarm مختلف عن الحجب، أنشئ الرقعة الافتراضية كما هو موضح [أدناه](#example-block-all-requests-with-the-class-cloud-function-routing-expression-header).

### حجب جميع الطلبات برأس `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`

مكون Spring Cloud Function يحتوي على ثغرة نشطة (CVE-2022-22963) يمكن استغلالها عن طريق حقن حمولات ضارة في رأس `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION` أو `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`.

إذا كنت تستخدم هذا المكون ووضع عقدة Wallarm [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) مختلف عن الحجب، يمكنك منع استغلال الثغرة باستخدام الرقعة الافتراضية. القاعدة التالية ستقوم بحجب جميع الطلبات التي تحتوي على رأس `CLASS-CLOUD-FUNCTION-ROUTING-EXPRESSION`:

![الرقعة الافتراضية للرأس المحدد](../../images/user-guides/rules/regexp-rule-header-spring.png)

!!! info "حجب الطلبات برأس `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION`"
    هذه القاعدة لا تحجب الطلبات برأس `CLASS.CLOUD.FUNCTION.ROUTING-EXPRESSION` لكن NGINX يرفض الطلبات برأس غير صالح كهذا بشكل افتراضي.

تقوم عقدة Wallarm العاملة في وضع [الحجب](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) بحجب محاولات استغلال مثل هذه الثغرة افتراضيًا.

هناك أيضًا ثغرة يوم الصفر في [Spring Core Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/overview.html) (Spring4Shell). تعرف على كيفية حجب محاولات استغلالها مع [الرقعة الافتراضية المبنية على التعبير النظامي](#example-block-all-requests-with-the-classmoduleclassloader-body-parameters).

## التعطيل الجزئي

إذا كان يجب تعطيل القاعدة المُنشأة جزئيًا لفرع معين، يمكن القيام بذلك بسهولة عن طريق إنشاء القاعدة **تعطيل كشف الهجوم المبني على التعبير النظامي** بالحقول التالية:

- *التعبير النظامي*: التعبيرات النظامية التي تم إنشاؤها مسبقًا والتي يجب تجاهلها.

    !!! warning "سلوك القاعدة إذا تم تغيير التعبير النظامي"
        يؤدي تغيير التعبير النظامي المحدد في القاعدة القائمة من نوع [**إنشاء مؤشر هجوم مبني على التعبير النظامي**](#creating-and-applying-rule) إلى حذف تلقائي للقواعد **تعطيل كشف الهجوم المبني على التعبير النظامي** التي تستخدم التعبير السابق.

        لتعطيل كشف الهجوم بواسطة تعبير نظامي جديد، يرجى إنشاء قاعدة جديدة **تعطيل كشف الهجوم المبني على التعبير النظامي** مع التعبير النظامي المحدد الجديد.

- *في هذا الجزء من الطلبية*: يشير إلى العامل الذي يتطلب إعداد استثناء.

**مثال: السماح برأس X-Authentication غير صحيح لعنوان URL محدد**

لنفترض أن لديك سكربت في `example.com/test.php`، وترغب في تغيير تنسيق الرموز الترويجية له.

لإنشاء القاعدة ذات الصلة:

1. انتقل إلى علامة التبويب *القواعد*
1. ابحث أو أنشئ الفرع لـ `example.com/test.php` وانقر *إضافة قاعدة*
1. اختر *تعطيل كشف الهجوم المبني على التعبير النظامي*
1. حدد التعبير النظامي الذي ترغب في تعطيله
1. ضبط نقطة `رأس X-AUTHENTICATION`
1. انقر *إنشاء*

![مثال القاعدة الثاني للتعبير النظامي][img-regex-example2]

## استدعاء API لإنشاء القاعدة

لإنشاء مؤشر الهجوم المبني على التعبير النظامي، يمكنك [استدعاء API Wallarm مباشرة](../../api/request-examples.md#create-a-rule-to-consider-the-requests-with-specific-value-of-the-x-forwarded-for-header-as-attacks).