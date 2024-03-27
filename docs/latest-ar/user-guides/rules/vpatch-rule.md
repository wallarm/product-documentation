[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[rule-creation-options]:    ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../../user-guides/rules/request-processing.md

# الترقيع الافتراضي

في الحالات التي يكون من المستحيل فيها إصلاح [ثغرة أمنية](../../user-guides/vulnerabilities.md) حرجة في كود تطبيقك أو تثبيت التحديثات اللازمة بسرعة، يمكنك إنشاء ترقيع افتراضي لحظر جميع الطلبات أو طلبات معينة إلى نقاط النهاية التي قد تسمح باستغلال هذه الثغرات. سيقوم الترقيع الافتراضي بحظر الطلبات حتى في [الأوضاع](../../admin-en/configure-wallarm-mode.md) المراقبة والحظر الآمن، باستثناء الطلبات القادمة من عناوين IP المُدرجة في القائمة البيضاء.

توفر Wallarm ال[قواعد](../../user-guides/rules/rules.md) التالية لإنشاء ترقيع افتراضي:

* **إنشاء قاعدة ترقيع افتراضي** - تسمح بإنشاء ترقيع افتراضي يحظر الطلبات التي تحتوي في جزئها المختار على إحدى علامات الهجوم [المعروفة](../../attacks-vulns-list.md)، مثل SQLi، SSTi، RCE الخ. كما يمكنك اختيار **أي طلب** لحظر طلبات معينة دون أي علامات هجوم.
* **إنشاء مؤشر هجوم بناءً على التعبير العادي** مع تحديد خيار **الترقيع الافتراضي** - يسمح بإنشاء ترقيع افتراضي يحظر الطلبات التي تحتوي على علامات هجوم خاصة بك أو سبب خاص بك للحظر (انظر [المثال](#blocking-all-requests-with-incorrect-x-authentication-header)) الموصوفة بالتعبيرات العادية. التفاصيل حول العمل مع القواعد المبنية على التعبير العادي موصوفة [هنا](../../user-guides/rules/regex-rule.md).

## إنشاء وتطبيق القاعدة

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## أمثلة على القواعد

### حظر طلبات معينة لنقطة نهاية محددة

لنفترض أن قسم الشراء عبر الإنترنت في تطبيقك الذي يمكن الوصول إليه على نطاق `example.com/purchase` يتعطل عند معالجة معلمة سلسلة الاستعلام `refresh`. قبل إصلاح الخطأ، تحتاج إلى حظر الطلبات التي تؤدي إلى التعطل.

للقيام بذلك، قم بتحديد قاعدة **إنشاء ترقيع افتراضي** كما هو معروض في لقطة الشاشة:

![ترقيع افتراضي لأي نوع طلب][img-vpatch-example2]

### حظر محاولات استغلال ثغرة مكتشفة ولكنها لم تُصلح بعد

لنفترض أن تطبيقك الذي يمكن الوصول إليه على النطاق `example.com` قد كشف عن ثغرة أمنية لم تُصلح بعد: المعامل `id` في التطبيق عرضة لهجمات الحقن SQL. في هذه الأثناء، تم ضبط عقدة تصفية Wallarm على وضع المراقبة ومع ذلك تحتاج إلى حظر محاولات استغلال الثغرة فوراً.

للقيام بذلك، قم بتحديد قاعدة **إنشاء ترقيع افتراضي** كما هو معروض في لقطة الشاشة:

![ترقيع افتراضي لنوع طلب معين][img-vpatch-example1]

### حظر جميع الطلبات برأس `X-AUTHENTICATION` غير صحيح

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

## استدعاءات API للترقيعات الافتراضية

لإنشاء ترقيعات افتراضية، يمكنك استدعاء API Wallarm مباشرةً. ضع في اعتبارك الأمثلة:

* [إنشاء الترقيع الافتراضي لحظر جميع الطلبات المرسلة إلى `/my/api/*`](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [إنشاء الترقيع الافتراضي لمعرف مثيل التطبيق المحدد لحظر جميع الطلبات المرسلة إلى `/my/api/*`](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)