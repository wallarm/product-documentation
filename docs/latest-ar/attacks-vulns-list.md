# أنواع الهجمات والثغرات الأمنية

[cwe-20]: https://cwe.mitre.org/data/definitions/20.html
[cwe-22]: https://cwe.mitre.org/data/definitions/22.html
[cwe-78]: https://cwe.mitre.org/data/definitions/78.html
[cwe-79]: https://cwe.mitre.org/data/definitions/79.html
[cwe-88]: https://cwe.mitre.org/data/definitions/88.html
[cwe-89]: https://cwe.mitre.org/data/definitions/89.html
[cwe-90]: https://cwe.mitre.org/data/definitions/90.html
[cwe-93]: https://cwe.mitre.org/data/definitions/93.html
[cwe-94]: https://cwe.mitre.org/data/definitions/94.html
[cwe-113]: https://cwe.mitre.org/data/definitions/113.html
[cwe-96]: https://cwe.mitre.org/data/definitions/96.html
[cwe-97]: https://cwe.mitre.org/data/definitions/97.html
[cwe-150]: https://cwe.mitre.org/data/definitions/150.html
[cwe-159]: https://cwe.mitre.org/data/definitions/159.html
[cwe-200]: https://cwe.mitre.org/data/definitions/200.html
[cwe-209]: https://cwe.mitre.org/data/definitions/209.html
[cwe-215]: https://cwe.mitre.org/data/definitions/215.html
[cwe-288]: https://cwe.mitre.org/data/definitions/288.html
[cwe-307]: https://cwe.mitre.org/data/definitions/307.html
[cwe-352]: https://cwe.mitre.org/data/definitions/352.html
[cwe-409]: https://cwe.mitre.org/data/definitions/409.html
[cwe-425]: https://cwe.mitre.org/data/definitions/425.html
[cwe-444]: https://cwe.mitre.org/data/definitions/444.html
[cwe-511]: https://cwe.mitre.org/data/definitions/511.html
[cwe-521]: https://cwe.mitre.org/data/definitions/521.html
[cwe-538]: https://cwe.mitre.org/data/definitions/538.html
[cwe-541]: https://cwe.mitre.org/data/definitions/541.html
[cwe-548]: https://cwe.mitre.org/data/definitions/548.html
[cwe-601]: https://cwe.mitre.org/data/definitions/601.html
[cwe-611]: https://cwe.mitre.org/data/definitions/611.html
[cwe-776]: https://cwe.mitre.org/data/definitions/776.html
[cwe-799]: https://cwe.mitre.org/data/definitions/799.html
[cwe-639]: https://cwe.mitre.org/data/definitions/639.html
[cwe-918]: https://cwe.mitre.org/data/definitions/918.html
[cwe-943]: https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]: https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]: https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]: https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]: https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]: https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]: https://www.checkmarx.com/knowledge/knowledgebase/path-traversal
[link-wl-process-time-limit-directive]: admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]: user-guides/rules/vpatch-rule.md

[anchor-brute]: #brute-force-attack
[anchor-rce]: #remote-code-execution-rce
[anchor-ssrf]: #serverside-request-forgery-ssrf

[link-imap-wiki]: https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]: https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]: https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

تحتوي هذه المقالة على قائمة وصف موجز للهجمات والثغرات الأمنية التي يمكن لوحدة تصفية Wallarm اكتشافها بما في ذلك تلك المقدمة في [OWASP Top 10](https://owasp.org/www-project-top-ten/) وقوائم المخاطر الأمنية [OWASP API Top 10](https://owasp.org/www-project-api-security/). تكون معظم الثغرات الأمنية والهجمات المذكورة في القائمة مرفقة بكود واحد أو أكثر من القائمة، المعروفة ب[التعداد المشترك لأنواع الضعف في البرامج][link-cwe] أو CWE.

يكتشف Wallarm الثغرات الأمنية والهجمات المدرجة تلقائيًا ويقوم بالتحرك وفقًا لـ [وضع التصفية](admin-en/configure-wallarm-mode.md). يجب أن يكون هناك تعديلات على السلوك الافتراضي التي تمت بواسطة قوانينك الخاصة [القواعد](user-guides/rules/rules.md) و[المشغلات](user-guides/triggers/triggers.md).

!!! info "التكوين المطلوب لبعض أنواع الهجمات"
    بعض الهجمات والثغرات الأمنية، مثل الوقائع السلوكية ([هجوم القوة الغاشمة](#brute-force-attack)، [التصفح الإجباري](#forced-browsing)، [BOLA](#broken-object-level-authorization-bola))، [سوء استخدام واجهة برمجة التطبيقات](#api-abuse) و[إدخال الاعتمادات](#credential-stuffing) ليست مكتشفة بشكل افتراضي. لمثل هذه الهجمات/الثغرات الأمنية، يتم تعريف التكوين المطلوب بشكل خاص.

??? info "شاهد الفيديو حول كيفية حماية Wallarm ضد OWASP Top 10"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

## سوء استخدام واجهة برمجة التطبيقات

**هجوم**

**كود Wallarm:** `api_abuse`

**الوصف:**

مجموعة أساسية من أنواع الروبوتات تتضمن زيادة زمن استجابة الخادم، إنشاء حسابات وهمية، والتذاكر.

**التكوين المطلوب:**

تكتشف Wallarm وتقلل من هجمات سوء استخدام واجهة برمجة التطبيقات فقط إذا كان لديها وحدة [الوقاية من سوء استخدام واجهة برمجة التطبيقات](about-wallarm/api-abuse-prevention.md) ممكّنة ومكوّنة بشكل صحيح.

تستخدم وحدة **الوقاية من سوء استخدام واجهة برمجة التطبيقات** نموذج الكشف عن الروبوتات المعقد للكشف عن أنواع الروبوتات التالية:

* سوء استخدام واجهة برمجة التطبيقات الذي يستهدف زيادة زمن استجابة الخادم أو عدم توفر الخادم. عادةً، يتم تحقيق ذلك من خلال زيادات ضارة في حركة المرور.
* [إنشاء حسابات وهمية](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) و[البريد المؤذي](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) هما خلق حسابات وهمية أو تأكيد المحتوى المزيف (على سبيل المثال، ردود الفعل). عادة، لا ينتج عن ذلك تعطل الخدمة ولكن يبطئ أو يتدهور العمليات التجارية العادية، على سبيل المثال:

    * معالجة طلبات المستخدمين الحقيقيين من قبل فريق الدعم
    * جمع إحصائيات المستخدم الحقيقي من قبل فريق التسويق

* يتميز ال[تذاكر](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping) بالروبوتات التي تجعل منتجات المتجر على الإنترنت غير متاحة للعملاء الحقيقيين، على سبيل المثال، عن طريق حجز جميع العناصر بحيث تصبح غير متوفرة ولكن لا تجني أي ربح.

إذا أشارت المقاييس إلى علامات هجوم الروبوت، فإن الوحدة [ترفض أو تضع في القائمة الرمادية](about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots) مصدر حركة المرور الشاذة لمدة ساعة.

**بالإضافة إلى حماية Wallarm:**

* تعرف على [وصف OWASP للتهديدات المؤتمتة](https://owasp.org/www-project-automated-threats-to-web-applications/) لتطبيقات الويب.
* رفض قائمة عناوين IP للمناطق والمصادر (مثل Tor)، والتي ليست مرتبطة بالتطبيق الخاص بك بالتأكيد.
* تكوين معدل طلبات من جانب الخادم.
* استخدم حلول CAPTCHA إضافية.
* ابحث عن التحليلات الخاصة بتطبيقك للعلامات الهجومية للروبوت.

## سوء استخدام واجهة برمجة التطبيقات - الاستيلاء على الحساب

**هجوم**

**كود Wallarm:** `api_abuse`

**الوصف:**

نوع من هجمات الإنترنت حيث يكتسب النشطاء الضارين الوصول إلى حساب شخص آخر بدون إذن أو معرفة. بمجرد حصولهم على الوصول إلى الحساب، يمكنهم استخدامه لأغراض مختلفة، مثل سرقة المعلومات الحساسة، وإجراء المعاملات الاحتيالية، أو نشر الرسائل البريدية غير المرغوب فيها أو البرامج الضارة.

**التكوين المطلوب:**

تكتشف Wallarm نوايا الاستيلاء على الحساب فقط إذا كانت وحدة التصفية لديها الإصدار 4.10 أو أعلى وكانت وظيفة [الكشف عن اختراق الاعتمادات](about-wallarm/credential-stuffing.md) ممكّنة ومكوّنة بشكل صحيح.

تكتشف [الكشف عن اختراق الاعتمادات](about-wallarm/credential-stuffing.md) الروبوتات التي تقوم بـ [الاختراق الاعتمادات](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html) التي تتم عادة كهجوم قوة غاشمة على النقاط الحرجة أو / والنقاط النهائية التي تتعلق بنقاط النهاية للمصادقة و / أو التسجيل. يتم حساب الحد التلقائي للمقاييس القبول العادل بناءً على حركة المرور الشرعية لساعة واحدة.

**بالإضافة إلى حماية Wallarm:**

* تعرف على [وصف OWASP للتهديدات المؤتمتة](https://owasp.org/www-project-automated-threats-to-web-applications/) لتطبيقات الويب.
* استخدم كلمات مرور قوية.
* لا تستخدم نفس كلمات المرور للموارد المختلفة.
* تمكين التوثيق الثنائي.
* استخدم حلول CAPTCHA الإضافية.
* راقب الحسابات بحثًا عن نشاطات مشبوهة.

## سوء استخدام واجهة برمجة التطبيقات - الحفز

**هجوم**

**كود Wallarm:** `api_abuse`

**الوصف:**

تعتبر استخراج البيانات، أو الحفز، معروفة بـ "Web scraping" عملية استخراج البيانات تلقائيًا من المواقع على الويب. يتضمن ذلك استخدام برنامج خاص أو تعليمات برمجية لاسترجاع واستخراج البيانات من صفحات الويب وحفظها في تنسيق منظم مثل جدول البيانات أو قاعدة البيانات.

يمكن استخدام خدش الويب لأغراض ضارة. على سبيل المثال، يمكن للبرامج النصية انتزاع المعلومات الحساسة مثل بيانات تسجيل الدخول أو المعلومات الشخصية أو البيانات المالية من المواقع. يمكن أيضًا للبرامج النصية استخدام ملفات البريد الإلكتروني أو استخدام البيانات المستخرجة من موقع على الويب بطريقة تضر بأدائه، مما يؤدي إلى هجمات حرمان الخدمة (DoS).

**التكوين المطلوب:**

تكتشف Wallarm الهجمات الناجمة عن الحفز فقط إذا كان لديها وحدة [الوقاية من سوء استخدام واجهة برمجة التطبيقات](about-wallarm/api-abuse-prevention.md) ممكّنة ومكوّنة بشكل صحيح.

تستخدم وحدة **الوقاية من سوء استخدام واجهة برمجة التطبيقات** نموذج الكشف عن الروبوتات المعقد للكشف عن النوع الروبوت الذي يجمع البيانات القابلة للوصول و / أو الناتج المُعَالج من التطبيق الذي قد يؤدي إلى الحصول على المحتوى الخاص أو غير المجاني لأي مستخدم.

**بالإضافة إلى حماية Wallarm:**

* تعرف على [وصف OWASP للتهديدات المؤتمتة](https://owasp.org/www-project-automated-threats-to-web-applications/) لتطبيقات الويب.
* استخدم حلول CAPTCHA الإضافية.
* استخدم ملف robots.txt لإخبار متصفحات البحث التي يمكنها ولا يمكنها تصفح.
* راقب حركة المرور للبحث عن الأنماط التي قد تشير إلى النشاط الخبيث.
* تنفيذ الحد من المعدل.
* تشويش أو تشفير البيانات.
* اتخاذ إجراءات قانونية.

## سوء استخدام واجهة برمجة التطبيقات - روبوتات الأمان

**هجوم**

**كود Wallarm:** `api_abuse`

**الوصف:**

على الرغم من أن روبوتات الأمان مصممة لمسح المواقع واكتشاف الثغرات الأمنية والقضايا الأمنية، لكن يمكن استخدامها أيضًا لأغراض ضارة. قد يستخدمها المهاجمون النشطاء لتحديد المواقع الضعيفة واستغلالها لأجلهم.

علاوة على ذلك، قد تكون بعض روبوتات الأمان تم تصميمها بشكل رديء وتسببت عن غير قصد في ضرر على المواقع عن طريق أكداس الخوادم، أو تسببت في انهيارات، أو إنشاء أنواع أخرى من الاضطرابات.

**التكوين المطلوب:**

تكتشف Wallarm هجمات روبوتات الأمان فقط إذا كان لديها وحدة [الوقاية من سوء استخدام واجهة برمجة التطبيقات](about-wallarm/api-abuse-prevention.md) ممكّنة ومكوّنة بشكل صحيح.

تستخدم وحدة **الوقاية من سوء استخدام واجهة برمجة التطبيقات** نموذج الكشف عن الروبوتات المعقد للكشف عن الأنواع التالية من روبوتات الأمان:

* يكتشف الأنواع المستغلة في طلبات معينة تتم إرسالها إلى التطبيق للحصول على معلومات من أجل بروفايل التطبيق. تم تصنيف هذا النوع بأنه [التحقق من البصمة](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html).
* يتم اجتياح المعلومات التي يتم جمعها على النحو الأمثل لتعرف أكبر قدر ممكن عن تكوين التطبيق وآليات الأمان. يكون الهدف هو تعلم أكبر قدر ممكن عن بنية التطبيق وتكوينه وآليات الأمان. تم تصنيف هذا النوع بأنه [الاعتراف بالإطار الزمني](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html).
* يتم تصنيف ذلك من خلال البحث عن الثغرات في الخدمة [فحص الثغرات](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning).

**بالإضافة إلى حماية Wallarm:**

* تعرف على [وصف OWASP للتهديدات المؤتمتة](https://owasp.org/www-project-automated-threats-to-web-applications/) لتطبيقات الويب.
* استخدم شهادات SSL.
* استخدم حلول CAPTCHA الإضافية.
* قم بتنفيذ الحد من المعدل.
* راقب حركة المرور للبحث عن الأنماط التي قد تشير إلى النشاط الخبيث.
* استخدم ملف robots.txt لإخبار متصفحات البحث التي يمكنها ولا يمكنها تصفح.
* تحديث البرامج بشكل منتظم.
* استخدم شبكة توصيل المحتوى (CDN).

## هجوم على كيان XML الخارجي (XXE)

**ثغرة أمنية/هجوم**

**كود CWE:** [CWE-611][cwe-611]

**كود Wallarm:** `xxe`

**الوصف:**

تتيح ثغرة XXE للمهاجم إدخال كيان خارجي في وثيقة XML لتقييمها بواسطة محلل XML ومن ثم تنفيذه على الخادم الهدف.

نتيجة للهجوم الناجح، سيكون للمهاجم القدرة على:

* الحصول على الوصول إلى بيانات التطبيق على الويب المؤمنة
* مسح الشبكات الداخلية للبيانات
* قراءة الملفات الموجودة على الخادم الويب
* تنفيذ هجوم [SSRF][anchor-ssrf]
* تنفيذ هجوم denial of service (DoS)

يحدث هذا الضعف بسبب القيود على تحليل كيانات XML الخارجية عند العمل مع وثائق XML التي يوفرها المستخدم.

**بالإضافة إلى حماية Wallarm:**

* قم بتعطيل تحليل كيانات XML الخارجية عند العمل مع وثائق XML التي يوفرها المستخدم.
* طبق التوصيات من [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet].

## تجاوز المصادقة

**ثغرة أمنية**

**كود CWE:** [CWE-288][cwe-288]

**كود Wallarm:** `auth`

**الوصف:**

على الرغم من وجود آليات المصادقة في مكانها، يمكن أن يكون لدى تطبيق ويب طرق مصادقة بديلة تتيح التجاوز المباشر لآلية المصادقة الرئيسية أو استغلال نقاط ضعفها. هذا التجميع من العوامل قد يؤدي إلى حدوث هجوم ناجح على تجاوز المصادقة والتي تتيح في النهاية الوصول إلى بيانات المستخدم المؤمنة أو أخذ السيطرة على التطبيق الضعيف بأذونات المشرف.

**بالإضافة إلى حماية Wallarm:**

* تحسين وتقوية آليات المصادقة الحالية.
* القضاء على أي طرق مصادقة بديلة قد تسمح للمهاجمين بالوصول إلى تطبيق مباشرة أثناء تجاوز الإجراءات المطلوبة للمصادقة عبر الآليات المحددة مسبقًا.
* طبق التوصيات من [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet].

## تفويض الكائن المكسر على المستوى (BOLA)

**هجوم/ثغرة أمنية**

**كود CWE:** [CWE-639][cwe-639]

**كود Wallarm:** `idor` للثغرات الأمنية, `bola` للهجوم

**الوصف:**

يمكن للمهاجمين استغلال نقاط النهاية لواجهة برمجة التطبيقات التي هي عرضة لتفويض الكائن المكسر على المستوى من خلال تManipulating ID الكائن الذي يتم إرساله ضمن الطلب. قد يؤدي هذا إلى الوصول غير المصرح به إلى البيانات الحساسة.

إن هذه المشكلة شائعة للغاية في التطبيقات المستندة إلى واجهة برمجة التطبيقات لأن المكون الخادم عادة ما لا يتعقب حالة العميل بشكل كامل، وبدلاً من ذلك، يعتمد أكثر على المعاملات مثل معرفات الكائنات، التي يتم إرسالها من العميل لتحديد أي كائنات سيتم الوصول إليها.

تعتمد على منطق نقطة النهاية لواجهة برمجة التطبيقات، يمكن للمهاجم إما قراءة بيانات التطبيقات على الويب وواجهات برمجة التطبيقات والمستخدمين فقط أو تعديلها. 

تُعرف هذه الثغرة الأمنية أيضًا بـ IDOR (إشارة غير آمنة للكائن).

[المزيد من التفاصيل عن الثغرة الأمنية](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md)

**التكوين المطلوب:**

تكتشف Wallarm الثغرات الأمنية لهذا النوع تلقائياً. للكشف عن وحجب هجمات BOLA، افعل واحدة أو كل ما يلي: 

* تمكين [الاكتشاف الشبكي لواجهة برمجة التطبيقات](api-discovery/overview.md) وتكوين [الحماية الآلية BOLA](admin-en/configuration-guides/protecting-against-bola.md) لنقاط النهاية التي تم اكتشافها من قبل هذه الوحدة
* تكوين مشغلات واحدة أو أكثر [** BOLA **](admin-en/configuration-guides/protecting-against-bola.md)

**بالإضافة إلى حماية Wallarm:**

* قم بتنفيذ آلية تصريح مناسبة تعتمد على سياسات المستخدم والهرمية.
* تفضل استخدام القيم العشوائية وغير القابلة للتنبؤ مثل [GUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) لمعرفات الكائنات.
* اكتب اختبارات لتقيم آلية الترخيص. لا تنشر التغييرات الضعيفة التي تكسر الاختبارات.

## هجوم القوة الغاشمة

**هجوم**

**أكواد CWE:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**كود Wallarm:** `brute`

**الوصف:**

هجوم القوة الغاشمة يحدث عندما يتم إرسال عدد كبير من الطلبات بحمولة محددة مسبقًا إلى الخادم. قد يتم توليد هذه الحمولات عن طريق بعض الوسائل أو استخراجها من ملف قاموس. يتم بعد ذلك تحليل استجابة الخادم للعثور على التوافق الصحيح لبيانات الحمولة.

هجوم القوة الغاشمة الناجح يمكن أن يؤدي بشكل محتمل إلى تجاوز آليات المصادقة والتصريح و / أو الكشف عن الموارد المخفية للتطبيق الويب (مثل الدلائل، والملفات، وأجزاء الموقع، الخ)، مما يمنح القدرة على إجراء أفعال أخرى ضارة.

**التكوين المطلوب:**

تكتشف Wallarm هجمات القوة الغاشمة فقط إذا كان لديها مشغلات القوة الغاشمة المكونة واحدة أو أكثر و / أو قواعد [الحد من المعدل](user-guides/rules/rate-limiting.md).

**بالإضافة إلى حماية Wallarm:**

*   يعد تقييد عدد الطلبات لكل فترة زمنية معينة للتطبيق الويب.
*   يعد تقييد عدد محاولات المصادقة / التصريح لكل فترة زمنية معينة للتطبيق الويب.
*   يقوم بحظر محاولات المصادقة / التصريح الجديدة بعد عدد معين من المحاولات الفاشلة.
*   يوفر القدرة على الوصول إلى أي ملفات أو دلائل على الخادم الذي يعمل عليه التطبيق على الويب، باستثناء تلك التي ضمن نطاق التطبيق.

## إدخال الاعتمادات

**هجوم**

**كود Wallarm:** `credential_stuffing`

**الوصف:**

هجوم الإنترنت حيث يستخدم الهاكرز قوائم من بيانات تسجيل الدخول المخترقة للمستخدم للوصول غير المصرح به إلى حسابات المستخدمين على مواقع متعددة. هذا الهجوم خطر لأن الكثير من الناس يعيدون استخدام نفس اسم المستخدم وكلمة المرور عبر خدمات مختلفة أو استخدام كلمات المرور الضعيفة الشائعة. يتطلب هجوم إدخال الاعتمادات الناجح عددًا أقل من المحاولات، لذلك يمكن للمهاجمين إرسال طلبات أقل بكثير بمعدل ترددي، مما يجعل التدابير القياسية مثل حماية القوة الغاشمة غير فعالة. 

**التكوين المطلوب:**

تكتشف Wallarm محاولات الإدخال فقط إذا كانت الوحدة التصفية لديها الإصدار 4.10 أو أعلى وكانت وظيفة [الكشف عن الإدخال](about-wallarm/credential-stuffing.md) مفعلة ومكوّنة بشكل صحيح.

**بالإضافة إلى حماية Wallarm:**

* تعرف على [وصف OWASP لإدخال الاعتمادات](https://owasp.org/www-community/attacks/Credential_stuffing)، بما في ذلك "Credential Stuffing Prevention Cheat Sheet".
* اجبر المستخدمين على استخدام كلمات مرور قوية.
* نصح المستخدمين بعدم استخدام نفس كلمات المرور للموارد المختلفة.
* تمكين التوثيق الثنائي.
* استخدم حلول CAPTCHA الإضافية.

## CRLF الحقن

**ثغرة أمنية/هجوم**

**كود CWE:** [CWE-93][cwe-93]

**كود Wallarm:** `crlf`

**الوصف:**

تمثل حقن CRLF مجموعة من الهجمات التي تسمح للمهاجم بحقن حروف العودة إلى البداية (CR) وتغذية السطر Line Feed (LF) في طلب إلى خادم (على سبيل المثال طلب HTTP).

بالاقتران مع عوامل أخرى، يمكن أن تساعد حقن حروف CR/LF هذه على استغلال مجموعة متنوعة من الثغرات الأمنية (مثل تقسيم الرد HTTP [CWE-113][cwe-113]، تهريب الرد HTTP [CWE-444][cwe-444]).

يمكن أن يؤدي هجوم حقن CRLF الناجح إلى منح المهاجم القدرة على تجاوز الجدران النارية، وتنفيذ تسميم الذاكرة المؤقتة، واستبدال صفحات الويب الشرعية بأخرى خبيثة، وتنفيذ هجوم "Open redirect"، والكثير من الأعمال الأخرى. 

تتحقق هذه الثغرة الأمنية بسبب تحقق غير صحيح من مدخلات المستخدم وتحليلها.

**بالإضافة إلى حماية Wallarm:**

* نقِّ الإدخال وفعّلها وقم بتنقيته لكي لا تتنفذ كود الإدخال.

## عبر الرسم طلب التزوير (CSRF)

**ثغرة أمنية**

**كود CWE:** [CWE-352][cwe-352]

**كود Wallarm:** `csrf`

**الوصف:**

هجوم تزوير الطلب عبر الرسم مكتبة (تبرعات على البنك التجاري آلي (ATM)) يحدث عندما يقوم هجوم يجبر المستخدم على تنفيذ الإجراءات الغير مرغوب فيها على تطبيق ويب تم تصديقه حالياً. مع قليل من المساعدة من الهندسة الاجتماعية (مثل إرسال رابط عبر البريد الإلكتروني أو الدردشة)، يمكن للمهاجم أن يخدع المستخدمين في تطبيق الويب من تنفيذ الإجراءات التي اختارها المهاجم.

تحدث الثغرة الأمنية المقابلة نظرًا لأن متصفح المستخدم يضيف تلقائيًا ملفات تعريف الارتباط لجلسة المستخدم التي يتم تعيينها لاسم المجال الهدف أثناء تنفيذ الطلب عبر الرسم. لمعظم المواقع، تشمل هذه الملفات تعريف الارتباط الاعتمادات المرتبطة بالموقع. لذا، إذا كان المستخدم مصادقًا حاليًا على الموقع، فلن يكون للموقع طريقة للتمييز بين الطلب المزور الذي يرسله الضحية وطلب مشروع يرسله الضحية.

لاحظع أن Wallarm فقط تكتشف ثغرات CSRF الأمنية، ولكنها لا تكتشف وبالتالي لا تحظر هجمات CSRF. يتم حل مشكلة CSRF في كل المتصفحات الحديثة عبر سياسات الأمان للمحتوى (CSP).

**الحماية:**

تتم حل CSRF بواسطة المتصفحات، والوسائل الأخرى للحماية أقل فائدة ولكن يمكن استخدامها لا يزال:

* تأكيد الحماية ضد CSRF، مثل رموز CSRF وغيرها.
* ضبط سمة الكعكة `SameSite`.
* طبق التوصيات من [تزييف معرف لكائن OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet].

##
