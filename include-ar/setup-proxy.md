!!! info
    هذه الخطوة من إعداد وُجدت للمستخدمين الذين يستعملون خادم وكيل خاص بهم لتشغيل تطبيقات الويب المحمية.
    
    إذا لم تستخدم خادم وكيل، تخطى هذه الخطوة من الإعداد.

تحتاج إلى تعيين قيم جديدة لمتغيرات البيئة، التي تحدد خادم الوكيل المستخدم، لضبط عقدة Wallarm لاستخدام خادم الوكيل الخاص بك.

أضف قيم جديدة لمتغيرات البيئة إلى ملف `/etc/environment`:
*   أضف `https_proxy` لتحديد وكيل لبروتوكول https.
*   أضف `http_proxy` لتحديد وكيل لبروتوكول http.
*   أضف `no_proxy` لتحديد قائمة الموارد التي لا ينبغي استخدام الوكيل لها.

عيّن قيم السلسلة `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` لمتغيري `https_proxy` و `http_proxy`.
* `<scheme>` تُحدد البروتوكول المستخدم. يجب أن يتطابق مع البروتوكول الذي يضبط الوكيل له متغير البيئة الحالي.
* `<proxy_user>` يحدد اسم المستخدم لتفويض الوكيل.
* `<proxy_pass>` يحدد كلمة المرور لتفويض الوكيل.
* `<host>` يحدد مضيف خادم الوكيل.
* `<port>` يحدد منفذ خادم الوكيل.

عيّن قيمة المصفوفة `"<res_1>, <res_2>, <res_3>, <res_4>, ..."`، حيث `<res_1>`, `<res_2>`, `<res_3>`, و`<res_4>` هي عناوين بروتوكول الإنترنت و/أو النطاقات، لمتغير `no_proxy` لتحديد قائمة الموارد التي لا ينبغي استخدام الوكيل لها. يجب أن تتألف هذه المصفوفة من عناوين بروتوكول الإنترنت و/أو النطاقات.

!!! warning "الموارد التي يجب مخاطبتها بدون وكيل"
    أضف العناوين التالية والنطاق إلى قائمة الموارد التي يجب مخاطبتها بدون وكيل لتشغيل النظام بشكل صحيح: `127.0.0.1`, `127.0.0.8`, `127.0.0.9`، و`localhost`.
    تُستخدم عناوين بروتوكول الإنترنت `127.0.0.8` و`127.0.0.9` لتشغيل عقدة ترشيح Wallarm.

مثال على محتويات ملف `/etc/environment` الصحيحة أدناه يوضح التكوين التالي:
*   يتم توجيه طلبات HTTPS وHTTP إلى المضيف `1.2.3.4` بالمنفذ `1234`، باستخدام اسم المستخدم `admin` وكلمة المرور `01234` للتفويض على خادم الوكيل.
*   يتم تعطيل التوجيه للطلبات المرسلة إلى `127.0.0.1`, `127.0.0.8`, `127.0.0.9`، و`localhost`.

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```