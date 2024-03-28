![حذف نقطة][img-remove-point]

![مرجع النقطة][img-point-help]

[link-get-point]:           ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:          ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:          ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:   ../../dsl/points/parsers/http.md#actionname-filter
[link-action-ext-point]:    ../../dsl/points/parsers/http.md#actionext-filter
[link-uri-point]:           ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:           ../../dsl/points/parsers.md

# تكوين قواعد معالجة النقاط

تُكوّن النقاط في قسم **نقاط الإدراج** من محرر السياسات في حساب Wallarm الخاص بك. ينقسم هذا القسم إلى قسمين:

* **أين في الطلب يتم تضمين** النقاط المسموح بمعالجتها
* **أين في الطلب يتم استثناء** النقاط غير المسموح بمعالجتها

لإضافة القائمة المشكلة من النقاط، استخدم زر **إضافة نقطة إدراج** في القسم المطلوب.

لحذف النقطة، استخدم رمز «—» الموجود بجانبها:

لإنشاء سياسة، يُضاف بشكل تلقائي نقاط نموذجية إلى قسم **أين في الطلب يتم تضمين**:

* `URI_value`: [قيمة الـURI][link-uri-point]
* `PATH_.*`: أي جزء من مسار [الـURI][link-path-point]
* `ACTION_NAME`: [الإجراء][link-action-name-point]
* `ACTION_EXT`: [الامتداد][link-action-ext-point]
* `GET_.*`: أي [معامل GET][link-get-point]
* `POST_.*`: أي [معامل POST][link-post-point]

القائمة الموجودة في قسم **أين في الطلب يتم استثناء** فارغة بشكل افتراضي.

نفس القائمة من النقاط مكونة للسياسة الافتراضية. لا يمكن تغيير هذه السياسة.

عند إنشاء أو تحرير نقاط، يمكنك النقر فوق رابط **كيفية الاستخدام** للحصول على تفاصيل إضافية حول النقاط.

القائمة الكاملة من النقاط التي يمكن أن تعالجها FAST متاحة عبر ال[رابط][doc-point-list].