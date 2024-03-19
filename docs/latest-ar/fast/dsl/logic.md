[img-phases-mod-overview]:              ../../images/fast/dsl/common/mod-phases.png
[img-phases-non-mod-overview]:          ../../images/fast/dsl/common/non-mod-phases.png
[img-mod-workflow]:                     ../../images/fast/dsl/common/mod-workflow.png
[img-non-mod-workflow]:                 ../../images/fast/dsl/common/non-mod-workflow.png
[img-workers]:                          ../../images/fast/dsl/en/workers.png

[img-incomplete-policy]:                ../../images/fast/dsl/common/incomplete-policy.png
[img-incomplete-policy-remediation-1]:  ../../images/fast/dsl/common/incomplete-policy-remediation-1.png
[img-incomplete-policy-remediation-2]:  ../../images/fast/dsl/common/incomplete-policy-remediation-2.png
[img-wrong-baseline]:                   ../../images/fast/dsl/common/wrong-baseline.png   

[link-policy]:              ../terms-glossary.md#test-policy
[doc-policy-in-detail]:     ../operations/test-policy/overview.md

[link-phase-collect]:       phase-collect.md
[link-phase-match]:         phase-match.md
[link-phase-modify]:        phase-modify.md
[link-phase-generate]:      phase-generate.md
[link-phase-send]:          phase-send.md
[link-phase-detect]:        detect/phase-detect.md

[doc-collect-uniq]:         phase-collect.md#the-uniqueness-condition
[doc-point-uri]:            points/parsers/http.md#uri-filter

[link-points]:              points/intro.md

# منطق الامتدادات

يمكن وصف منطق الامتداد باستخدام عدة مراحل:
1. [جمع][link-phase-collect]
2. [مطابقة][link-phase-match]
3. [تعديل][link-phase-modify]
4. [توليد][link-phase-generate]
5. [إرسال][link-phase-send]
6. [كشف][link-phase-detect]

بدمج هذه المراحل، يتيح DSL السريع لـ Wallarm وصف نوعين من الامتدادات:
* الأول ينشئ طلب تجريبي واحد أو أكثر بتغيير معلمات الطلب الأساسي الوارد.

    سيشار إلى هذا الامتداد على أنه "امتداد معدل" طوال هذا الدليل.

* الثاني يستخدم طلبات تجريبية محددة مسبقًا ولا يغير معلمات الطلب الأساسي الوارد.

    سيُشار إلى هذا الامتداد على أنه "امتداد غير معدل" طوال هذا الدليل.

يستخدم كل نوع من الامتدادات مجموعة متميزة من المراحل. بعض هذه المراحل إلزامية، بينما البعض الآخر ليس كذلك.

استخدام مرحلة الكشف إلزامي لكل نوع من الامتدادات. هذه المرحلة تستقبل ردود التطبيق المستهدف على الطلبات التجريبية. يستخدم الامتداد هذه الردود لتحديد ما إذا كان التطبيق يحتوي على ثغرات معينة. يتم إرسال المعلومات المستقبلة من مرحلة الكشف إلى سحابة Wallarm.

!!! info "بنتاكس وصف عناصر الطلب"
    عند إنشاء امتداد FAST، تحتاج إلى فهم بنية الطلب HTTP المرسل إلى التطبيق وكذلك بنية الرد HTTP المستلم من التطبيق لكي تتمكن من وصف عناصر الطلب بشكل صحيح التي تحتاج للتعامل معها باستخدام النقاط.
    
    لمشاهدة معلومات مفصلة، يرجى الانتقال إلى هذا [الرابط][link-points].
 
## كيف يعمل الامتداد المعدل

أثناء عمل الامتداد المعدل، يمر الطلب الأساسي تسلسليًا من خلال مراحل الجمع، المطابقة، التعديل، والتوليد، كلها إختيارية وقد لا تُضمن في الامتداد. سيتم تشكيل طلب تجريبي واحد أو عدة طلبات تجريبية نتيجة لهذه المراحل. سيتم إرسال هذه الطلبات إلى التطبيق المستهدف لفحصه بحثًا عن الثغرات.

!!! info "امتداد دون مراحل إختيارية"
    إذا لم يتم تطبيق أي مراحل اختيارية على الطلب الأساس، يكون الطلب التجريبي مطابقًا للطلب الأساسي.

![نظرة عامة على مراحل الامتداد المعدل][img-phases-mod-overview]

إذا كان الطلب الأساسي يلبي سياسة اختبار FAST المحددة [تفاصيل سياسة الاختبار][doc-policy-in-detail]، فيحتوي الطلب على معلمة واحدة أو أكثر مسموح بها للمعالجة. يتكرر الامتداد المعدل من خلال هذه المعلمات:

 1. كل معلمة تمر عبر مراحل الامتداد ويتم إنشاء الطلبات التجريبية المقابلة وتنفيذها.
 2. يتابع الامتداد مع المعلمة التالية حتى يتم معالجة جميع المعلمات المتوافقة مع السياسة.

الصورة أدناه تظهر طلب POST مع بعض معلمات POST كمثال.

![نظرة عامة على سير عمل الامتداد المعدل][img-mod-workflow]

## كيف يعمل الامتداد الغير معدل

أثناء عمل الامتداد الغير معدل، يمر الطلب الأساسي من خلال مرحلة إرسال واحدة فقط.

خلال هذه المرحلة، يتم استنباط اسم المضيف أو عنوان IP فقط من قيمة رأس الـ`Host` للطلب الأساسي. ثم، يتم إرسال الطلبات التجريبية المحددة مسبقًا إلى هذا المضيف.

نظرًا لإمكانية واجهة الامتداد FAST بعدة طلبات أساسية واردة مع نفس قيمة رأس الـ`Host`، تمر هذه الطلبات من خلال مرحلة جمع ضمنية لجمع فقط تلك الطلبات التي تحتوي على قيمة فريدة لرأس الـ`Host` (انظر ["شرط الفرادة"][doc-collect-uniq]).

![نظرة عامة على مراحل الامتداد الغير معدل][img-phases-non-mod-overview]

عند عمل الامتداد الغير معدل، يتم إرسال طلب أو أكثر محدد مسبقًا إلى المضيف المذكور في رأس الـ`Host` لكل طلب أساسي يتم معالجته في مرحلة الإرسال:

![نظرة عامة على سير عمل الامتداد الغير معدل][img-non-mod-workflow]


## كيف تعالج الامتدادات الطلبات

### معالجة طلب بعدة امتدادات

قد تُعرف عدة امتدادات للاستخدام بواسطة واجهة FAST في الوقت نفسه.
كل طلب أساسي وارد سيمر عبر جميع الامتدادات المتصلة.

![الامتدادات المستخدمة بواسطة العاملين][img-workers]

في كل لحظة من الزمن، يعالج الامتداد طلب أساسي واحد. يدعم FAST معالجة الطلبات الأساسية بشكل متوازٍ؛ كل الطلبات الأساسية المستقبلة سيتم إرسالها إلى عامل متاح لتسريع المعالجة. قد يعمل عاملون مختلفون على نفس الامتدادات في الوقت نفسه لطلبات أساسية مختلفة. الامتداد يحدد ما إذا كان يجب إنشاء طلبات تجريبية على أساس الطلب الأساسي.

يعتمد عدد الطلبات التي يمكن لواجهة FAST معالجتها بالتوازي على عدد العاملين. يتم تحديد عدد العاملين بالقيمة المعينة لمتغير البيئة `WORKERS` عند تنفيذ حاوية Docker لواجهة FAST (القيمة الافتراضية للمتغير هي 10).

!!! info "تفاصيل سياسة الاختبار"
    متوفر وصف أكثر تفصيلًا للعمل مع سياسات الاختبار عبر [الرابط][doc-policy-in-detail].