# تغيير رؤوس استجابة الخادم

تسمح قاعدة [**تغيير رؤوس استجابة الخادم**](../../user-guides/rules/rules.md) بإضافة، حذف رؤوس استجابة الخادم وتغيير قيمها.

غالبًا ما يُستخدم هذا النوع من القواعد لتكوين طبقة إضافية من أمن التطبيق، على سبيل المثال:

* لإضافة رأس الاستجابة [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) الذي يتحكم في الموارد المسموح للعميل بتحميلها لصفحة معينة. هذا يساعد على الحماية من هجمات [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss).

    إذا لم يقم الخادم بإعادة هذا الرأس افتراضيًا، يُنصح بإضافته باستخدام قاعدة **تغيير رؤوس استجابة الخادم**. يمكنك العثور على وصف ل[قيم الرأس الممكنة](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) و[أمثلة على استخدام الرأس](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases) في MDN Web Docs.

    بالمثل، يمكن استخدام هذه القاعدة لإضافة رؤوس الاستجابة [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)، [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)، [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).
* لتغيير رأس NGINX `Server` أو أي رأس آخر يحتوي على بيانات حول نسخ الوحدات المثبتة. يمكن استخدام هذه البيانات من قبل المهاجم لاكتشاف نقاط الضعف في نسخ الوحدات المثبتة ونتيجة لذلك، لاستغلال النقاط الضعفية المكتشفة.

    يمكن تغيير رأس NGINX `Server` بدءًا من عقدة Wallarm 2.16.

يمكن أيضًا استخدام قاعدة **تغيير رؤوس استجابة الخادم** لمعالجة أي من قضايا الأعمال والفنية الخاصة بكم.

## إنشاء وتطبيق القاعدة

--8<-- "../include/waf/features/rules/rule-creation-options.md"

لإنشاء وتطبيق القاعدة في قسم **القواعد**:

1. أنشئ قاعدة **تغيير رؤوس استجابة الخادم** في قسم **القواعد** لواجهة Wallarm Console. تتكون القاعدة من المكونات التالية:

      * **الشرط** [يصف](rules.md#branch-description) نقاط النهاية التي يتم تطبيق القاعدة عليها.
      * اسم الرأس المراد إضافته أو استبدال قيمته.
      * القيمة الجديدة للرأس المحدد.

        لحذف رأس الاستجابة الموجود ، يرجى ترك قيمة هذا الرأس فارغة على علامة التبويب **استبدال**.

2. انتظر حتى [اكتمال تجميع القاعدة](rules.md#ruleset-lifecycle).

## مثال: إضافة رأس سياسة الأمن وقيمته

للسماح بكل محتوى `https://example.com/*` أن يأتي فقط من مصدر الموقع، يمكنك إضافة رأس الاستجابة [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) باستخدام قاعدة **تغيير رؤوس استجابة الخادم** كما يلي:

![مثال على القاعدة "تغيير رؤوس استجابة الخادم"](../../images/user-guides/rules/add-replace-response-header.png)