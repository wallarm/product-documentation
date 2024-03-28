[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# نظرة عامة على تكوين عملية الكشف عن الشذوذ

بالإضافة إلى كشف [الثغرات الأمنية][gl-vuln]، يمكن لـFAST أن يكتشف [الشذوذات][gl-anomaly] باستخدام *المُختبر*.

تشرح هذه الوثيقة النقاط التالية:

* [مبادئ تشغيل المختبر][doc-fuzzer-internals]
* [تكوين المختبر باستخدام محرر السياسات][doc-fuzzer-configuration]

??? info "مثال على شذوذ"
    يُظهر السلوك الشاذ للتطبيق المستهدف [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) في [مثال امتداد FAST](../../dsl/extensions-examples/mod-extension.md).

    يستجيب هذا التطبيق عادةً برمز `403 Unauthorized` ورسالة `Invalid email or password.` لطلب التوثيق بمزيج غير صحيح من اسم المستخدم وكلمة المرور.

    ومع ذلك، إذا تم تمرير رمز `'` ضمن أي جزء من قيمة اسم المستخدم، يستجيب التطبيق برمز `500 Internal Server Error` ورسالة `...SequelizeDatabaseError: SQLITE_ERROR:...`؛ وهذا السلوك يعتبر شاذًا.

    لا يؤدي هذا الشذوذ إلى استغلال مباشر لأي ثغرة أمنية، ولكنه يزود المهاجم بمعلومات حول بنية التطبيق ويدفع لتنفيذ هجوم [حقن SQL](../../vuln-list.md#sql-injection).