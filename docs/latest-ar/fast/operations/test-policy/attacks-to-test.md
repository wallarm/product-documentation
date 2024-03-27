[img-custom-dsl-slider]:    ../../../images/fast/operations/en/test-policy/policy-editor/custom-slider.png

[link-user-extensions]:     ../../dsl/intro.md
[link-connect-extensions]:  ../../dsl/using-extension.md

[doc-fuzzer]:               fuzzer-intro.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability

[vuln-ptrav]:               ../../vuln-list.md#path-traversal
[vuln-rce]:                 ../../vuln-list.md#remote-code-execution-rce
[vuln-sqli]:                ../../vuln-list.md#sql-injection
[vuln-xss]:                 ../../vuln-list.md#cross-site-scripting-xss
[vuln-xxe]:                 ../../vuln-list.md#attack-on-xml-external-entity-xxe

#   تكوين عملية كشف الثغرات الأمنية

يكشف FAST ال[ثغرات الأمنية][gl-vuln] من خلال الخيارات الاتية:

* إضافات FAST المدمجة
* [إضافات مخصصة][link-user-extensions]

    !!! info "الإضافات المخصصة"
        لاستخدام الإضافات المخصصة، يرجى [ربطها][link-connect-extensions] بعقدة FAST.

يمكنك التحكم في طريقة كشف الثغرات الأمنية في التطبيق بالطرق التالية:

* إذا كنت ترغب في إجراء الاختبارات باستخدام إضافات FAST المدمجة، فقم بتحديد خانات الاختيار للثغرات الأمنية التي تريد إجراء الاختبارات عليها.
* إذا كنت ترغب في إجراء الاختبارات باستخدام الإضافات المخصصة فقط مع استثناء الإضافات المدمجة لـ FAST، فقم بإلغاء تحديد جميع خانات الاختيار أو تفعيل مفتاح **استخدام DSL المخصص فقط** واختر الثغرات الأمنية من القائمة.

    ![مفتاح DSL المخصص][img-custom-dsl-slider]

    يرجى ملاحظة أنه إذا تم تفعيل مفتاح **استخدام DSL المخصص فقط**، فسوف تتم تعطيل الإضافات المدمجة لـFAST و [FAST fuzzer][doc-fuzzer]. إذا تم تفعيل FAST fuzzer، فسوف يصبح مفتاح **استخدام DSL المخصص فقط** غير نشط مرة أخرى.

!!! info "الثغرات الأمنية الأساسية"
    عند إنشاء سياسة، تتم اختيار الثغرات الأمنية الأكثر نموذجية التي يمكن اكتشافها في التطبيقات بشكل افتراضي:

    * [تجاوز المسار (PTRAV)][vuln-ptrav]،
    * [تنفيذ التعليمات البرمجية عن بعد (RCE)][vuln-rce]،
    * [حقن SQL (SQLi)][vuln-sqli]،
    * [البرمجة النصية عبر المواقع (XSS)][vuln-xss]،
    * [الثغرة إلى الهجوم على كيان XML الخارجي (XXE)][vuln-xxe].
    
    إذا كنت تستخدم سياسات مخصصة، يمكنك تعطيل اختبار التطبيق لثغرة أمنية معينة عن طريق إلغاء تحديد الخانة المقابلة في أي وقت.