[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]:         ../../attacks-vulns-list.md#bruteforce-attack
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]:          ../../attacks-vulns-list.md#data-bomb
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]:       ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]:     ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]:        ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]:           ../../attacks-vulns-list.md#overlimiting-of-computational-resources
[email-injection]:        ../../attacks-vulns-list.md#email-injection
[ssi-injection]:          ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]:            ../../attacks-vulns-list.md#unsafe-xml-header
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]:          ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# بحث الأحداث والمرشحات

تقدم Wallarm طرقاً مريحة للبحث عن الأحداث المكتشفة (الهجمات والحوادث). في أقسام **الهجمات** و**الحوادث** من وحدة تحكم Wallarm ، تتوفر طرق البحث التالية:

* **المرشحات** لاختيار معايير التصفية
* **حقل البحث** لإدخال استعلامات البحث مع الصفات والمعدلات المشابهة للغة الإنسانية

تتم تكرار القيم المعينة في المرشحات تلقائيًا في حقل البحث ، والعكس صحيح.

يمكن حفظ أي استعلام بحث أو مزيج من المرشحات عن طريق النقر على **حفظ الاستعلام**.

## المرشحات

تتم عرض المرشحات المتاحة في وحدة تحكم Wallarm بأشكال متعددة:

* لوحة المرشحات التي يتم توسيعها وطيها باستخدام الزر **تصفية**
* مرشحات سريعة لاستبعاد أو إظهار الأحداث فقط مع قيم المعلمة المحددة

![المرشحات في واجهة المستخدم](../../images/user-guides/search-and-filters/filters.png)

عند تحديد قيم المرشحات المختلفة، ستفي النتائج بكل هذه الشروط. عند تحديد قيم مختلفة لنفس المرشح، ستفي النتائج بأي من هذه الشروط.

## حقل البحث

يقبل حقل البحث استعلامات مع الصفات والمعدلات المشابهة للغة الإنسانية مما يجعل تقديم الاستعلامات غريزي. على سبيل المثال:

* `هجمات xss`: للبحث عن كل [هجمات البرمجة عبر المواقع][al-xss]
* `هجمات اليوم`: للبحث عن كل الهجمات التي حدثت اليوم
* `xss 14/12/2020`: للبحث عن جميع الاشتباهات ، والهجمات ، والحوادث من [البرمجة عبر المواقع][al-xss] في 14 ديسمبر 2020
* `p:xss 14/12/2020`: للبحث عن جميع الشكوك ، والهجمات ، والحوادث من جميع الأنواع داخل معلمة الطلب الخاصة بـ xss (أي `http://localhost/?xss=attack-here`) بتاريخ 14 ديسمبر 2020
* `هجمات 9-12/2020`: للبحث عن كل الهجمات من سبتمبر إلى ديسمبر 2020
* `rce /catalog/import.php`: للبحث عن كل الهجمات والحوادث [RCE][al-rce] على مسار `/catalog/import.php` منذ الأمس

عند تحديد قيم معايير مختلفة، ستفي النتائج بكل هذه الشروط. عند تحديد قيم مختلفة لنفس المعيار، ستفي النتائج بأي من هذه الشروط.

!!! info "ضبط قيمة الصفة على NOT"
لإلغاء قيمة الصفة ، يرجى استخدام `!` قبل اسم الصفة أو المعدل. على سبيل المثال: `هجمات !ip:111.111.111.111` لإظهار جميع الهجمات التي نشأت من أي عنوان IP باستثناء `111.111.111.111`.
