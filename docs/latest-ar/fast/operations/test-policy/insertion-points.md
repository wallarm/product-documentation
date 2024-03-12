[img-remove-point]:         ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:           ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:           ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:          ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:          ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:   ../../dsl/points/parsers/http.md#actionname-filter
[link-action-ext-point]:    ../../dsl/points/parsers/http.md#actionext-filter
[link-uri-point]:           ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:           ../../dsl/points/parsers.md

# تكوين قواعد معالجة النقاط

يتم تكوين النقاط في قسم **نقاط الإدراج** بمحرر السياسات في حسابك على Wallarm. ينقسم هذا القسم إلى قسمين:

* **أين يتم تضمين الطلب** للنقاط المسموح بمعالجتها
* **أين يتم استبعاد الطلب** للنقاط غير المسموح بمعالجتها

لإضافة قائمة النقاط المكونة، استخدم زر **إضافة نقطة إدراج** في القسم المطلوب.

لحذف النقطة، استخدم رمز «—» بجانبها:

![حذف نقطة][img-remove-point]

!!! info "النقاط الأساسية"
    عند إنشاء سياسة، يتم إضافة النقاط النمطية تلقائيًا إلى قسم **أين يتم تضمين الطلب**:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: أي جزء من مسار URI [path][link-path-point]
    * `ACTION_NAME`: [الفعل][link-action-name-point]
    * `ACTION_EXT`: [الامتداد][link-action-ext-point]
    * `GET_.*`: أي [معامل GET][link-get-point]
    * `POST_.*`: أي [معامل POST][link-post-point]
    
    قائمة النقاط في قسم **أين يتم استبعاد الطلب** فارغة افتراضيًا.

    يتم تكوين نفس قائمة النقاط للسياسة الافتراضية. لا يمكن تغيير هذه السياسة.

 
!!! info "مرجع النقطة"
    عند إنشاء أو تعديل نقاط، يمكنك النقر على رابط **كيفية الاستخدام** للحصول على تفاصيل إضافية بخصوص النقاط.

    ![مرجع النقطة][img-point-help]

    القائمة الكاملة للنقاط التي يمكن لـ FAST معالجتها متاحة بواسطة [الرابط][doc-point-list].