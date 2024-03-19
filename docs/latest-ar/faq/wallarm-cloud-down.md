# عند تعطل Wallarm Cloud

عند تعطل Wallarm Cloud، تستمر عُقد Wallarm في التخفيف من الهجمات مع بعض القيود. لمعرفة المزيد، استخدم هذا الدليل لتحري الخلل وإصلاحه.

## كيف تعمل عُقدة Wallarm إذا تعطل Wallarm Cloud؟

Wallarm Cloud هي خدمة مستقرة وقابلة للتوسّع بشكل كبير. علاوة على ذلك، يتم حماية جميع بيانات حساب شركتك بواسطة [النسخ الاحتياطية](#how-does-wallarm-protect-its-cloud-data-from-loss).

ومع ذلك، إذا تعطل Wallarm Cloud بشكل مؤقت في حالات نادرة (على سبيل المثال، أثناء التوقف للصيانة)، تستمر عُقدة Wallarm في العمل ولكن مع بعض القيود.

!!! معلومات "فحص حالة Wallarm Cloud"
    لفحص حالة Wallarm Cloud، قم بزيارة [status.wallarm.com](https://status.wallarm.com/). للبقاء على اطلاع، اشترك في التحديثات.

ما يستمر في العمل:

* معالجة الحركة في الوضع [الذي تم تكوينه](../admin-en/configure-wallarm-mode.md#available-filtration-modes) باستخدام القواعد التي تم تحميلها إلى العقدة خلال آخر عملية [مزامنة](../admin-en/configure-cloud-node-synchronization-en.md) ناجحة بين السحابة والعقدة. يمكن أن تستمر العقدة في العمل حيث تم تحميل أحدث نسخ من العناصر التالية من السحابة وفقًا للجدول الزمني وتخزينها محليًا على العقدة:

    * [مجموعة القواعد المخصصة](../user-guides/rules/rules.md#ruleset-lifecycle)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)

* يتم أيضًا تحميل [قوائم الـIP](../user-guides/ip-lists/overview.md) إلى العقدة وتخزينها داخلها. ستستمر العناوين المُحمّلة في التعامل معها ولكن فقط حتى تاريخ/وقت انتهاء الصلاحية.

    لن يتم تحديث هذه التواريخ/الأوقات حتى يتم استعادة السحابة ومزامنتها؛ ولن تكون هناك عناوين جديدة/محذوفة حتى استعادة السحابة/المزامنة.

    لاحظ أن انتهاء صلاحية بعض عناوين الـIP في القوائم يؤدي إلى التوقف عن حماية من [هجمات القوة الغاشمة](../admin-en/configuration-guides/protecting-against-bruteforce.md) المتعلقة بهذه العناوين.

ما يتوقف عن العمل:

* تجمع العقدة البيانات ولكن لا يمكنها إرسال البيانات حول الهجمات والثغرات الأمنية المكتشفة إلى السحابة. لاحظ أن وحدة [postanalytics](../admin-en/installation-postanalytics-en.md) لعقدتك لديها تخزين في الذاكرة (Tarantool) حيث يتم تخزين البيانات المجمعة مؤقتًا قبل إرسالها إلى السحابة. بمجرد استعادة السحابة، سيتم إرسال البيانات المخزنة مؤقتًا إليها.

    !!! تحذير "قيود تخزين الذاكرة للعقدة"
        حجم الذاكرة المؤقتة [محدود](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) وعند تجاوزه، يتم حذف البيانات الأقدم. لذا، قد يؤدي مقدار الوقت الذي كانت السحابة فيه معطلة وكمية المعلومات التي تم جمعها خلال هذا الوقت إلى حالة عندما تحصل في وحدة تحكم Wallarm على بعض البيانات فقط بعد استعادة السحابة.

* تجمع العقدة البيانات ولكن لا يمكنها إرسال [المقاييس](../admin-en/monitoring/intro.md) للحركة المعالجة إلى السحابة.
* سيتوقف الفحص لـ[الأصول المعرضة](../user-guides/scanner.md) و[الثغرات الأمنية النموذجية](../user-guides/vulnerabilities.md).
* سيتوقف عمل [المشغلات](../user-guides/triggers/triggers.md) وبالتالي:
    * ستتوقف [قوائم الـIP](../user-guides/ip-lists/overview.md) عن التحديث.
    * لن تظهر [إشعارات المشغلات](../user-guides/triggers/triggers.md).
* لن يعمل [اكتشاف جرد API](../api-discovery/overview.md).
* سيتوقف [التحقق من التهديدات النشطة](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification).
* لن يتم الكشف عن [هجمات القوة الغاشمة](../admin-en/configuration-guides/protecting-against-bruteforce.md).
* ستتوقف التكاملات، بما في ذلك:
    * لن تظهر الإشعارات الفورية وإشعارات البريد الإلكتروني [الإشعارات](../user-guides/settings/integrations/integrations-intro.md).
    * سيتوقف إعداد التقارير.
* لا يوجد وصول إلى وحدة تحكم Wallarm.
* لن يستجيب [API Wallarm](../api/overview.md).

لاحظ أنه بجانب الحالة الكاملة لتوقف المذكورة أعلاه، أحيانًا قد تكون خدمات معينة مؤقتًا غير متاحة، بينما تستمر الخدمات الأخرى في العمل. إذا كان الأمر كذلك، ستوفر لك خدمة [status.wallarm.com](https://status.wallarm.com/) المعلومات المقابلة.

## ماذا يحدث بعد استعادة السحابة؟

بعد استعادة السحابة:

* يتم استعادة الوصول إلى وحدة تحكم Wallarm.
* ترسل العقدة المعلومات المخزنة مؤقتًا إلى السحابة (ضع في اعتبارك القيود المذكورة أعلاه).
* تتفاعل المشغلات مع البيانات الجديدة بإرسال الإشعارات وتحديث IPs.
* إذا كانت هناك أي تغييرات في IPs، يتم إرسالها إلى العقدة أثناء المزامنة التالية.
* إذا كان هناك [بناء مجموعة قواعد مخصصة](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down) غير مكتمل، يتم إعادة بدء العملية.
* تتزامن السحابة وعقدة التصفية وفقًا للجدول الزمني بالطريقة العادية.

## هل يوجد حالة لم تحصل فيها العقدة على الإعدادات المحفوظة في وحدة تحكم Wallarm قبل تعطل Wallarm Cloud؟

نعم، هذا ممكن. على سبيل المثال، لنفترض أن الفاصل الزمني للـ[مزامنة](../admin-en/configure-cloud-node-synchronization-en.md) هو 3 دقائق و:

1. تم الانتهاء من آخر بناء لمجموعة القواعد المخصصة على السحابة قبل 21 دقيقة وتم تحميلها إلى العقدة قبل 20 دقيقة.
2. خلال 6 مزامنات التالية لم يتم أخذ أي شيء من السحابة لأنه لم يكن هناك جديد.
3. ثم تم تغيير القواعد على السحابة وبدأ بناء جديد - البناء يحتاج إلى 4 دقائق لينتهي ولكن في غضون دقيقتين تعطلت السحابة.
4. العقدة تأخذ فقط البناء المكتمل، لذلك خلال دقيقتين المزامنات لن تعطي شيئًا ليتم تحميله إلى العقدة.
5. بعد دقيقة إضافية، تأتي العقدة بطلب مزامنة جديد لكن السحابة لا تستجيب.
6. ستواصل العقدة التصفية وفقًا لمجموعة القواعد المخصصة ذات عمر 24 دقيقة وسيزداد هذا العمر بينما السحابة في حالة توقف.

## كيف تحمي Wallarm بيانات سحابتها من الضياع؟

تحفظ Wallarm Cloud **جميع البيانات** التي يوفرها المستخدم في وحدة تحكم Wallarm والمحملة إليها من العقد. كما ذُكر أعلاه، تعتبر حالة توقف Wallarm Cloud مؤقتًا حالة نادرة جدًا. ولكن إذا حدث هذا، فإن الاحتمال ضئيل جدًا أن تؤثر حالة التوقف هذه على البيانات المحفوظة. هذا يعني أنه بعد الاستعادة، ستواصل العمل على الفور مع جميع بياناتك.

للتعامل مع الاحتمال الضئيل أن يتم تدمير الأقراص الصلبة التي تخزن البيانات الفعلية لـWallarm Cloud، تقوم Wallarm تلقائيًا بإنشاء نسخ احتياطية واستعادتها منها عند الضرورة:

* RPO: يتم إنشاء النسخة الاحتياطية كل 24 ساعة
* RTO: ستكون النظام متاحًا مرة أخرى في غضون 48 ساعة كحد أقصى
* يتم تخزين آخر 14 نسخة احتياطية

!!! معلومات "معايير حماية وتوافر RPO/RTO"
    * **RPO (هدف نقطة الاسترداد)** يُستخدم لتحديد تكرار نسخ البيانات احتياطيًا: يحدد الحد الأقصى للوقت الذي يمكن أن تُفقد فيه البيانات.
    * **RTO (هدف وقت الاسترداد)** هو كمية الوقت الفعلي التي يجب على العمل أن يستعيد عملياته في مستوى خدمة مقبول بعد كارثة لتجنب العواقب غير المقبولة المرتبطة بالانقطاع.

لمزيد من المعلومات حول خطة استرداد الكوارث (DR) لـWallarm وخصائصها الخاصة بشركتك، [تواصل مع دعم Wallarm](mailto:support@wallarm.com).