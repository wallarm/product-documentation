[link-using-search]:    ../search-and-filters/use-search.md
[link-verify-attack]:   ../events/verify-attack.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[use-search]:           ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# فحص الحوادث

في واجهة Wallarm Console، يمكنك التحقق من الحوادث المكتشفة في قسم **الحوادث**. للعثور على البيانات المطلوبة، يرجى استخدام حقل البحث كما هو موضح [هنا][use-search]أوتعيين عوامل تصفية بحث يدوياً.

## الحوادث

![تبويب الحوادث][img-incidents-tab]

* **التاريخ**: التاريخ والوقت للطلب الخبيث.
    * إذا كشفت عدة طلبات من النوع نفسه في فترات قصيرة، يظهر مدة الهجوم تحت التاريخ. المدة هي الفترة الزمنية بين أول طلب من نوع معين وآخر طلب من النوع نفسه في الإطار الزمني المحدد.
    * إذا كان الهجوم يحدث في اللحظة الحالية، يتم عرض تصنيف مناسب [هنا](#events-that-are-currently-happening).
* **الحمولات**: نوع الهجوم وعدد ال[حمولات الخبيثة](../../glossary-en.md#malicious-payload) الفريدة.
* **الضربات**: عدد الضربات (الطلبات) في الهجوم خلال الإطار الزمني المحدد.
* **أعلى IP / المصدر**: عنوان IP من خلاله تم إصدار الطلبات الخبيثة. عندما تنشأ الطلبات الخبيثة من عدة عناوين IP، يعرض الواجهة عنوان IP المسؤول عن معظم الطلبات. هناك أيضاً البيانات التالية المعروضة لعنوان IP:
     * العدد الإجمالي لعناوين IP التي أنشأت الطلبات في الهجوم نفسه خلال الإطار الزمني المحدد.
     * البلد/المنطقة التي تم تسجيل عنوان IP فيها (إذا وُجِدَ في قواعد البيانات مثل IP2Location أو غيرها)
     * نوع المصدر، مثل **عنوان IP لبروكسي عام**، **ويب بروكسي**، **Tor** أو منصة السحابة التي تم تسجيل عنوان IP فيها، إلخ (إذا وُجِدَ في قواعد البيانات مثل IP2Location أو غيرها)
     * سيظهر تصنيف **IPs الخبيثة** إذا كان عنوان IP معروفًا بأنشطة خبيثة. هذا استنادًا إلى السجلات العامة وتقييمات الخبراء
* **النطاق / المسار**: النطاق والمسار ومعرف التطبيق الذي استهدفه الطلب.
* **الحالة**: حالة حجب الهجوم (تعتمد على [وضع تصفية الحركة](../../admin-en/configure-wallarm-mode.md)):
     * محجوب: تم حجب جميع ضربات الهجوم بواسطة العقدة المرشحة.
     * محجوب جزئياً: تم حجب بعض الضربات من الهجوم وتم تسجيل الباقي فقط.
     * مراقبة: تم تسجيل جميع ضربات الهجوم ولكن لم يتم حجبها.
* **المعلمة**: معطيات الطلب الخبيث وعلامات [المحللات](../rules/request-processing.md) التي تم تطبيقها على الطلب
* **الثغرات الأمنية**: الثغرة الأمنية، التي استغلتها الحادثة. النقر على الثغرة الأمنية يأخذك إلى وصفها المفصل وتعليمات حول كيفية إصلاحها.

لفرز الحوادث حسب وقت آخر طلب، يمكنك استخدام مفتاح **الفرز حسب آخر ضربة**.

## الاستدعاءات البرمجية للحصول على الحوادث

للحصول على تفاصيل الحوادث، يمكنك [استدعاء واجهة برمجة تطبيقات Wallarm مباشرةً](../../api/overview.md) بالإضافة إلى استخدام واجهة Wallarm Console. أدناه مثال على الاستدعاء البرمجي لـ **الحصول على أول 50 حادثة تم كشفها في آخر 24 ساعة**.

الطلب مماثل لـ[الاستدعاء المستخدم](check-attack.md#api-calls-to-get-attacks) لقائمة الهجمات؛ يُضاف مصطلح `"!vulnid": null` لطلب الحوادث. يوجه هذا المصطلح الواجهة البرمجية لتجاهل جميع الهجمات دون تحديد معرف الثغرة الأمنية، وهكذا يميّز النظام بين الهجمات والحوادث.

يرجى استبدال `TIMESTAMP` بتاريخ قبل 24 ساعة محول إلى تنسيق [الطابع الزمني لـ Unix](https://www.unixtimestamp.com/).

--8<-- "../include/api-request-examples/get-incidents-en.md"