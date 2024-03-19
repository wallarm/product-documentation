#   معجم المصطلحات

## ثغرة أمنية

الثغرة الأمنية هي خطأ ناتج عن الإهمال أو قلة المعلومات عند بناء أو تنفيذ تطبيق ويب والذي قد يؤدي إلى خطر على أمن المعلومات.

مخاطر أمن المعلومات تتضمن:

* الدخول غير المصرح به للبيانات؛ مثلاً، الدخول لقراءة وتعديل بيانات المستخدم.
* رفض الخدمة.
* تلف البيانات وغيرها.

الثغرة الأمنية ليست خاصية للإنترنت. بل هي خاصية لنظامكم. وجود الثغرات الأمنية أو عدمه لا يعتمد على حركة مروركم عبر الإنترنت. ولكن، يمكن استخدام حركة المرور هذه لكشف الثغرات، وهو ما تقوم به Wallarm، من بين وظائف أخرى.

## شذوذ

نوع [من][vuln-anomaly] الثغرات الأمنية.

##  التطبيق المستهدف

التطبيق المستهدف هو تطبيق ويب أو واجهة برمجة التطبيقات (API) الذي يجب اختباره بحثاً عن الثغرات الأمنية باستخدام FAST.

**انظر أيضاً:** [العلاقات بين مكونات FAST][doc-internals].

##  مصدر الطلب 

مصدر الطلب هو أداة ستختبر التطبيق المستهدف باستخدام طلبات HTTP وHTTPS. يستطيع FAST إنشاء مجموعة الاختبارات الأمنية استناداً إلى هذه الطلبات (انظر "طلبات الأساس").

##  مجموعة الاختبار الأمني

تسمح مجموعة الاختبار الأمني بكشف الثغرات الأمنية في التطبيق المستهدف.
يتألف كل اختبار أمني من طلب واحد للاختبار أو أكثر.

##  طلبات الاختبار

طلبات الاختبار هي طلبات HTTP وHTTPS التي يتم إرسالها إلى التطبيق المستهدف. الطلبات المُنشأة من المُرجح جداً أن تُطلق ثغرة أمنية.

يتم إنشاء هذه الطلبات بواسطة FAST استناداً إلى طلبات الأساس التي تفي بسياسة الاختبار.

##  عقدة FAST

العقدة FAST هي أحد مكونات FAST.

تقوم العقدة بتوكيل طلبات HTTP وHTTPS وتنشئ اختبارات الأمان استناداً إلى طلبات الأساس.

بالإضافة إلى ذلك، تنفذ عقدة FAST الاختبارات الأمنية. بمعنى آخر، ترسل العقدة طلبات الاختبار إلى التطبيق المستهدف لفحص استجابة التطبيق وتحديد ما إذا كانت هناك أي ثغرات أمنية في التطبيق.

##  سحابة Wallarm

سحابة Wallarm هي أحد مكونات FAST.
توفر السحابة للمستخدم واجهة لإنشاء سياسات الاختبار، وإدارة عملية تنفيذ الاختبار، ومراقبة نتائج الاختبار.

**انظر أيضاً:**
* [العلاقات بين مكونات FAST][doc-internals],
* [العمل مع سياسات الاختبار][doc-policies].

##  طلبات الأساس

طلبات الأساس هي طلبات HTTP وHTTPS التي يتم توجيهها من مصدر الطلب إلى التطبيق المستهدف.
ينشئ FAST اختبارات الأمان على أساس هذه الطلبات.

جميع الطلبات غير الأساسية، التي يتم توجيهها عبر عقدة FAST، لن يتم استخدامها كمصدر خلال عملية إنشاء مجموعة الاختبار.

##  تشغيل الاختبار

يصف تشغيل الاختبار التكرار الفردي لعملية اختبار الثغرات الأمنية باستخدام FAST.

يمرر تشغيل الاختبار سياسة الاختبار إلى عقدة FAST. تحدد السياسة أي طلبات أساسية ستُستخدم كأساس لاختبارات الأمان.

يتم ربط كل تشغيل اختبار بعقدة FAST واحدة عبر الرمز المميز.

##  سياسة الاختبار

سياسة الاختبار هي مجموعة من القواعد، التي وفقاً لها، يتم إجراء عملية كشف الثغرات الأمنية. بالتحديد، يمكنك اختيار أنواع الثغرات الأمنية التي يجب اختبار التطبيق بحثاً عنها. بالإضافة إلى ذلك، تحدد السياسة أي معايير في طلب الأساس مؤهلة للتعديل أثناء إنشاء مجموعة الاختبار الأمني. تُستخدم هذه البيانات من قبل عقدة FAST لإنشاء طلبات الاختبار التي تُستخدم لمعرفة ما إذا كان التطبيق المستهدف قابل للاستغلال.

**انظر أيضاً:**
* [العلاقات بين مكونات FAST][doc-internals],
* [العمل مع سياسات الاختبار][doc-policies].

##  عنصر طلب الأساس

عنصر الطلب هو جزء من طلب الأساس.
بعض الأمثلة على العناصر:

* رأس HTTP, 
* جسم استجابة HTTP, 
* معاملات GET, 
* معاملات POST.

##  نقطة

النقطة هي سلسلة تشير إلى عنصر من طلب الأساس. تتألف هذه السلسلة من تسلسل أسماء المُحللات والفلاتر التي يجب تطبيقها على طلب الأساس من أجل الحصول على البيانات المطلوبة.

يتم وصف النقاط بمزيد من التفصيل [هنا][doc-points].

##  رمز مميز

الرمز المميز هو المعرّف السري الفريد الذي يخدم الأغراض التالية:
* ربط تشغيل الاختبار بعقدة FAST.
* إنشاء وإدارة تشغيل الاختبار.

الرمز المميز هو أحد خصائص عقدة FAST الأساسية.

**انظر أيضاً:** [العلاقات بين مكونات FAST][doc-internals].