# أنواع الهجمات والثغرات الأمنية

[cwe-20]:    https://cwe.mitre.org/data/definitions/20.html
[cwe-22]:    https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:    https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:    https://cwe.mitre.org/data/definitions/79.html
[cwe-88]:    https://cwe.mitre.org/data/definitions/88.html
[cwe-89]:    https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:    https://cwe.mitre.org/data/definitions/90.html
[cwe-93]:    https://cwe.mitre.org/data/definitions/93.html
[cwe-94]:    https://cwe.mitre.org/data/definitions/94.html
[cwe-113]:   https://cwe.mitre.org/data/definitions/113.html
[cwe-96]:    https://cwe.mitre.org/data/definitions/96.html
[cwe-97]:    https://cwe.mitre.org/data/definitions/97.html
[cwe-150]:   https://cwe.mitre.org/data/definitions/150.html
[cwe-159]:   https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:   https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:   https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:   https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:   https://cwe.mitre.org/data/definitions/288.html
[cwe-307]:   https://cwe.mitre.org/data/definitions/307.html
[cwe-352]:   https://cwe.mitre.org/data/definitions/352.html
[cwe-409]:   https://cwe.mitre.org/data/definitions/409.html
[cwe-425]:   https://cwe.mitre.org/data/definitions/425.html
[cwe-444]:   https://cwe.mitre.org/data/definitions/444.html
[cwe-511]:   https://cwe.mitre.org/data/definitions/511.html
[cwe-521]:   https://cwe.mitre.org/data/definitions/521.html
[cwe-538]:   https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:   https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:   https://cwe.mitre.org/data/definitions/548.html
[cwe-601]:   https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:   https://cwe.mitre.org/data/definitions/611.html
[cwe-776]:   https://cwe.mitre.org/data/definitions/776.html
[cwe-799]:   https://cwe.mitre.org/data/definitions/799.html
[cwe-639]:   https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:   https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:   https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]:  https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]:  https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]:   https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]:  https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]:  https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]:           https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://www.checkmarx.com/knowledge/knowledgebase/path-traversal
[link-wl-process-time-limit-directive]:     admin-en/configure-parameters-en.cshtml#جدارة_الحد_الزمنى_للمعالجةə

[doc-vpatch]:   user-guides/rules/vpatch-rule.md

[anchor-main-list]:     ##### القائمة الرئيسية للهجمات والثغرات الأمنية
[anchor-special-list]:  ##### القائمة الخاصة بالهجمات والثغرات الأمنية

[anchor-brute]: ##### الهجوم القوي
[anchor-rce]:   ##### تنفيذ الشيفرة عن بعد
[anchor-ssrf]:  ##### تزوير الطلبات من جهة الخادم

[link-imap-wiki]:                                https://ar.wikipedia.org/wiki/بروتوكول_إسترجاع_الرسائل_عبر_الأنترنت
[link-smtp-wiki]:                                https://ar.wikipedia.org/wiki/بروتوكول_تراسل_الرسائل_البسيط
[ssi-wiki]:     https://ar.wikipedia.org/wiki/إدراج_من_جهة_الخادم
[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

حلول Wallarm يمكنها اكتشاف العديد من الهجمات والثغرات الأمنية بما في ذلك التي تم تقديمها في [OWASP Top 10](https://owasp.org/www-project-top-ten/)و [OWASP API Top 10](https://owasp.org/www-project-api-security/) قوائم المخاطر الأمنية. هذه الهجمات والثغرات الأمنية هي المدرج[أدناه][anchor-main-list].

كل كيان في القائمة يحمل العلامة **الهجوم** أو **الثغرة** أو كلا الاثنين.

- قد يكون اسم هجوم معين هو نفسه اسم الثغرة التي يُستغل هذا الهجوم. في هذه الحالة، سيحتفظ الكيان بعلامة **ثغره/هجوم** مجمعة.

- لديها كود Wallarm الذي يتوافق مع هذا الكيان.

يكمل غالبية الثغرات والهجمات المدرجة في هذه القائمة، أيضا بكود أو أكثر من قائمة أنواع البرمجيات الضعيفة المعروفة بـ [Common Weakness Enumeration][link-cwork] أو CWE.

بالإضافة إلى ذلك، يعمل العقدة الفرعية لـ Wallarm على العديد من أنواع الهجمات والثغرات الأمنية الخاصة للغرض الداخلي لوضع علامة على حركة المرور المعالجة. هذه الكيانات غير مصحوبة بأكواد CWE ولكنها مجمعة بشكل منفصل.

?? ?info "مشاهدة الفيديو عن كيفية حماية Wallarm ضد OWASP Top 10"
    <div class="video-wrapper">
     <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

## أنواع الهجوم

تحمي حلول Wallarm APIs، وميكروسيرفر وتطبيقات الويب من الهجمات التي تستهدف [OWASP Top 10](https://owasp.org/www-project-top-ten/) و [OWASP API Top 10](https://owasp.org/www-project-api-security/)،تجاوز استخدام API وغيرها من التهديدات المستلمة.

تقنيا، تنقسم جميع الهجمات التي يمكن لـ Wallarm اكتشافها إلى مجموعات:

* هجمات التحقق من الصحة على أعلى مستوى
* الهجمات السلوكية

تعتمد طريقة اكتشاف الهجوم على مجموعة الهجمات. لاكتشاف الهجمات السلوكية، تكوين العقدة الفرعية لـ Wallarm مطلوب إضافيًا.

### التحقق على المستوى العالي من الهجمات

تتضمن هجمات التحقق على أعلى مستوى الحقن SQL، النص البرمجي المتعدد الخواص، التنفيذ عن بُعد للشفرات، التحقق على مستوى المسار وأنواع الهجمات الأخرى. هذه الهجمات يمكز تحديدها من خلال تحليل تعبيرات معينة إرسالها في العروض. من أجل التحقق على أعلى مستوى من الهجمات، من الضروري إجراء تحليل صرح للعروض- تحليلها للكشف عن مجموعات الرموز المعينة.

تكشف Wallarm حجود التحقق على الأعلى مستوى في أي جزء من العروض بما في ذلك الملفات الثنائية مثل SVG، JPEG، PNG، GIF، PDF، ..الخ باستخدام الأدوات المدرجة.

التحقق على المستوى العالى يتم إمكانية الوصول بشكل افتراضى على جميع العملاء.

### الهجمات السلوكية

تتضمن الهجمات السلوكية هذه الفئات الهجومية التالية:

* الهجمات العنيفة المتراكمة: كلمات المرور و متطلبات الجلسة, الملفات و الأدلة المرغوبة, تحقق الأوراق الشهادئة الموثوق لها. يمكن تحديد الهجمات السلوكية بوجود عدد كبير من الطلبات مع قيم المعلمات الملزمة المرسلة الى عرض التعادل التقليدى لإطار زمنى محدود.

    كأساليب فعالة بهجوم متقدم أُجرِيَت من قبل هجامين على كلماتان السر، حتى يتم على كثير من خاصية العروض المماثلة بكلمات كلمات السر التي تم إسنادها إلى عنوان URL للتوثيق المستخدم.

    إذا كانت الواجهة الأمامية تهدف إلى أيدي متماسكة للحصول على معرف الفعلية و الحصول على البيانات المالية المقابلة:

```مصدر
    https://example.com/shops/{shop_id}/financial_info
```
    إذا لم تكن مطلوبة أي طلبات API معيّنة، يمكن للمهاجم الحصول على البيانات المالية الحقيقة و استخدامها لأهدافهم.

#### الهجوم السلوكى النظرية

من أجل الكشف عن الهجمات السلوكية، من الضروري إجراء تحليل صرح للطلبات و تحليل عون لعدد الطلبات و الوقت بين الطلبات.

تتم مساهمة في التحليل عبر العقد الفرعى للبرمجيات. تتضاف سرعة في العقدة الفرعية لواجهة النظار في الطلبات الي كمية الوقت الذي تستغرقبه فجب المساهمة في التحليل بين الطلبات و التقييد.

عند انكشاف الهجوم السلوكى, توقف مصادر الطلب، أي تتضاف العناوين IP التي تم إرسال الطلبات بالكامل الى القائمة السوداء.

#### تجهيز الحماية ضد الهجوم السلوكى

لحماية الموارد ضد الهجمات السلوكية، من الضروري تحديد الحد الأدنى للتحليل عند الانتقال و العناوين URL التي تتعرض للهجمات السلوكية:

* [تعليمات حول تجهيز الحماية ضد الهجوم الشديد](admin-en/configuration-guides/protecting-against-bruteforce.md)
* [تعليمات حول تجهيز الحماية ضد الهجمات BOLA (IDOR)](admin-en/configuration-guides/protecting-against-bola.md)

!!! تحذير "الحد الأقصى لحماية الهجوم السلوكى"
   عند البحث على علامات الهجوم السلوكي، يحلل عقدة Wallarm فقط HTTP العروض التي لا تندرج تحت علامات أنواع الهجوم الأخرى، على سبيل المثال:

    هذه الطلبات تتضمن علامات تحقق من الهجوم على الأعلى المستوى من العروض.
    تتوافق آراء المستخدم و الطلبات مع التعبير القواعد في شكل القواعد المحددة في [قاعدة إنشاء مؤشر هجوم قائم على التعبير](user-guides/rules/regex-rule.md#adding-a-new-detection-rule).
