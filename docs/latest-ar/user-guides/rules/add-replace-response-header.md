# تغيير عناوين استجابة الخادم

قاعدة **تغيير عناوين استجابة الخادم** [القاعدة](../../user-guides/rules/rules.md) تسمح بإضافة، حذف عناوين استجابة الخادم وتغيير قيمها.

غالبًا ما يتم استخدام هذا النوع من القواعد لتكوين طبقة إضافية من أمان التطبيق، على سبيل المثال:

* لإضافة عنوان الاستجابة [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) الذي يتحكم في الموارد المسموح للعميل بتحميلها لصفحة معينة. هذا يساعد في الحماية ضد هجمات [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss).

    إذا لم يقم الخادم الخاص بك بإرجاع هذا العنوان بشكل افتراضي، فمن المستحسن إضافته باستخدام قاعدة **تغيير عناوين استجابة الخادم**. في وثائق MDN Web Docs، يمكنك العثور على وصف [لقيم العنوان الممكنة](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) و[أمثلة على استخدام العنوان](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases).

    بالمثل، يمكن استخدام هذه القاعدة لإضافة عناوين الاستجابة [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)، [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)، [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).
* لتغيير عنوان NGINX `Server` أو أي عنوان آخر يحتوي على بيانات حول إصدارات الوحدات المثبتة. يمكن استخدام هذه البيانات بشكل محتمل من قبل المهاجم لاكتشاف ثغرات أمنية في إصدارات الوحدات المثبتة ونتيجة لذلك، لاستغلال الثغرات المكتشفة.

    يمكن تغيير عنوان NGINX `Server` بدءًا من وحدة Wallarm 2.16.

يمكن أيضًا استخدام قاعدة **تغيير عناوين استجابة الخادم** لمعالجة أي من مشاكلك التجارية والتقنية.

## إنشاء وتطبيق القاعدة

--8<-- "../include/waf/features/rules/rule-creation-options.md"

لإنشاء وتطبيق القاعدة في قسم **القواعد**:

1. أنشئ قاعدة **تغيير عناوين استجابة الخادم** في قسم **القواعد** من واجهة Wallarm Console. تتكون القاعدة من المكونات التالية:

      * **الشرط** [يصف](rules.md#branch-description) النقاط النهائية لتطبيق القاعدة عليها.
      * اسم العنوان المراد إضافته أو استبدال قيمته.
      * القيمة الجديدة للعنوان المحدد.

        لحذف عنوان استجابة موجود، يرجى ترك قيمة هذا العنوان في علامة التبويب **استبدال** فارغة.

2. انتظر [إكمال تجميع القاعدة](rules.md#ruleset-lifecycle).

## مثال: إضافة عنوان سياسة الأمان وقيمته

للسماح بكل المحتوى من `https://example.com/*` ليأتي فقط من مصدر الموقع، يمكنك إضافة عنوان الاستجابة [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) باستخدام قاعدة **تغيير عناوين استجابة الخادم** على النحو التالي:

![مثال على قاعدة "تغيير عناوين استجابة الخادم"](../../images/user-guides/rules/add-replace-response-header.png)