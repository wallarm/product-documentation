[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# تكوين عملية كشف الشُذوذ: نظرة عامة

بالإضافة إلى كشف [الثغرات الأمنية][gl-vuln]، FAST يمكنها كشف [الشُذوذات][gl-anomaly] باستخدام *الفازر*.

هذا القسم من الوثائق يصف النقاط التالية:

* [مبادئ عمل الفازر][doc-fuzzer-internals]
* [تكوين الفازر باستخدام محرر السياسات][doc-fuzzer-configuration]

??? info "مثال على الشُذوذ"
    يتم عرض السلوك الشاذ لتطبيق الهدف [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) في [مثال لامتداد FAST](../../dsl/extensions-examples/mod-extension.md).

    عادةً يستجيب هذا التطبيق برمز `403 Unauthorized` ورسالة `Invalid email or password.` لطلب التفويض بمجموعة خاطئة من اسم المستخدم وكلمة المرور.

    ولكن، إذا تم تمرير رمز `'` ضمن أي جزء من قيمة الدخول، يستجيب التطبيق برمز `500 Internal Server Error` ورسالة `...SequelizeDatabaseError: SQLITE_ERROR:...`؛ مثل هذا السلوك يعتبر شاذ.

    هذا الشُذوذ لا يؤدي مباشرةً إلى استغلال أي ثغرة أمنية محددة، ولكنه يوفر للمهاجم معلومات عن بنية التطبيق ويحفز على تنفيذ هجوم [SQL Injection](../../vuln-list.md#sql-injection).