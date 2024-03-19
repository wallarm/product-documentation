# سياسة إصدار نسخ عقد التصفية

تصف هذه السياسة طريقة إصدار النسخ المختلفة لمكونات عقد التصفية في Wallarm: حزم لينكس، حاويات Docker، رسوم Helm، وغيرها. يمكنك استخدام هذا الوثيقة لاختيار نسخة عقد التصفية للتثبيت ولجدولة تحديثات الحزم المثبتة.

!!! info "المكون"
    المكون هو نتيجة تطوير عقد Wallarm التي تُستخدم لتثبيت عقدة التصفية على المنصة. على سبيل المثال: حزم لينكس، وحدات Kong API، حاويات Docker، وغيرها.

## قائمة الإصدارات

| نسخة العقدة      | تاريخ الإصدار    | الدعم حتى      |
|------------------|-----------------|----------------|
|2.18 وأقل من 2.x  |                 | نوفمبر 2021    |
|3.6 وأقل من 3.x   | أكتوبر 2021     | نوفمبر 2022    |
|4.0               | يونيو 2022      | فبراير 2023    |
|4.2               | أغسطس 2022      | يونيو 2023     |
|4.4               | نوفمبر 2022     | فبراير 2024    |
|4.6               | أبريل 2023      | أبريل 2024     |
|4.8               | أكتوبر 2023     |                |
|4.10              | يناير 2024      |                |

## صيغة الإصدار

تتبع إصدارات مكونات عقدة التصفية في Wallarm الصيغة التالية:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| المُعامِل                   | الوصف                                                                                                                                                                                                                                                                                                                   | معدل الإصدار المتوقع         |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| `<MAJOR_VERSION>`          | النسخة الرئيسية لعقدة Wallarm:<ul><li>إعادة العمل الرئيسية للمكون</li><li>التغييرات غير المتوافقة</li></ul>القيمة الابتدائية هي `2`. تزداد القيمة بـ 1، على سبيل المثال: `3.6.0`, `4.0.0`.                                                                       | لا يتوقع إصدار             |
| `<MINOR_VERSION>`          | النسخة الثانوية لعقدة Wallarm:<ul><li>ميزات المنتج الجديدة</li><li>إصلاحات الأخطاء الرئيسية</li><li>التغييرات المتوافقة الأخرى</li></ul>تزداد القيمة بـ 2، على سبيل المثال: `4.0`, `4.2`.                                                                     | مرة كل ربع                        |
| `<PATCH_VERSION>`          | نسخة التصحيح للعقدة:<ul><li>إصلاحات الأخطاء الطفيفة</li><li>إضافة ميزات جديدة بعد طلب خاص</li></ul>القيمة الابتدائية هي `0`. تزداد القيمة بـ 1، على سبيل المثال: `4.2.0`, `4.2.1`.                                                                          | مرة كل شهر                        |
| `<BUILD_NUMBER>` (اختياري) | نسخة بناء العقدة. تُعيّن القيمة تلقائيًا بواسطة منصة بناء الحزمة المستخدمة. لا يتم تعيين القيمة للمكونات المبنية يدويًا.<br />تزداد القيمة بـ 1، على سبيل المثال: `4.2.0-1`, `4.2.0-2`. في حال فشل البناء الأول، يتم تشغيل البناء مرة أخرىويزداد الرقم. | مع كل إصدار جديد `<PATCH_VERSION>` |

نوصي بإستخدام صيغ إصدار عقدة Wallarm المختلفة عند تحميل الحزم أو الصور. تعتمد الصيغة على [شكل تثبيت عقدة Wallarm](../installation/supported-deployment-options.md):

* `<MAJOR_VERSION>.<MINOR_VERSION>` لحزم لينكس
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` لرسوم Helm
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]` لحاويات Docker وصور السحاب

    عند سحب صور Docker لـ Wallarm، يمكنك أيضًا تحديد نسخة عقدة التصفية بالصيغة `<MAJOR_VERSION>.<MINOR_VERSION>`. إذ تحتوي النسخة المسحوبة من عقدة التصفية على تغييرات أحدث نسخة تصحيحية متاحة، قد يختلف سلوك نفس النسخة من الصورة `<MAJOR_VERSION>.<MINOR_VERSION>` المسحوبة في فترات زمنية مختلفة.

قد تختلف نسخ حزم عقد Wallarm ضمن نفس المكون. على سبيل المثال، إذا كان يلزم تحديث حزمة واحدة فقط، فإن الحزم الأخرى تحتفظ بالنسخة السابقة.

## دعم الإصدار

يدعم Wallarm فقط آخر 3 نسخ من عقدة التصفية بالطرق التالية:

* للنسخة الأخيرة (مثلًا 4.2): يسمح بتحميل الحزم، يصدر إصلاحات للأخطاء ويحدّث المكونات الخارجية إذا تم اكتشاف ثغرات في النسخة المستخدمة. قد يصدر ميزات جديدة بعد طلب خاص.
* للنسخة السابقة (مثلًا 4.0): يسمح بتحميل الحزم ويصدر إصلاحات للأخطاء.
* للنسخة الثالثة المتاحة (مثلًا 3.6): يسمح بتحميل الحزم ويصدر إصلاحات للأخطاء لمدة 3 أشهر بعد تاريخ إصدار النسخة الأخيرة. بعد 3 أشهر، سيتم إهمال النسخة.

مكونات العقد للنسخ المهملة متوفرة للتحميل والتثبيت، لكن إصلاحات الأخطاء والميزات الجديدة لا تصدر في النسخ المهملة.

عند تثبيت عقدة التصفية لأول مرة، يُنصح باستخدام أحدث نسخة متوفرة. عند تثبيت عقدة تصفية إضافية في بيئة بها عقد مثبتة بالفعل، من المستحسن استخدام نفس النسخة في جميع التثبيتات للتوافق الكامل.

## تحديث NGINX

تُوزع معظم وحدات Wallarm مع مكونات NGINX الخاصة بنسخها. للحفاظ على عمل وحدات Wallarm مع آخر نسخ مكونات NGINX، نقوم بتحديثها على النحو التالي:

* حزم Wallarm DEB و RPM مبنية على وحدات NGINX الرسمية و NGINX Plus. عند إصدار نسخة جديدة من NGINX / NGINX Plus، يلتزم Wallarm بتوفير تحديث لنسخته في يوم واحد. ينشر Wallarm هذا التحديث كنسخة ثانوية/تصحيح جديدة لنسخ العقدة المدعومة.
* يُبنى Wallarm Ingress Controller على أساس [متحكم دخول NGINX Community](https://github.com/kubernetes/ingress-nginx). بمجرد إصدار نسخة جديدة من متحكم دخول NGINX Community، يلتزم Wallarm بتوفير تحديث لنسخته في الـ 30 يومًا التالية. ينشر Wallarm هذا التحديث كنسخة ثانوية جديدة لأحدث متحكم دخول.

## تحديث النسخة

يُفترض أنك تستخدم أحدث نسخة متاحة من عقدة التصفية عند التثبيت أو التحديث أو التكوين للمنتج. تصف تعليمات عقدة Wallarm الأوامر التي تثبت تلقائيًا أحدث نسخة تصحيح وبناء متوفرة.

### إشعار بالنسخة الجديدة

ينشر Wallarm معلومات حول النسخ الرئيسية والثانوية الجديدة من خلال المصادر التالية:

* الوثائق العامة
* [بوابة الأخبار](https://changelog.wallarm.com/)
* واجهة مستخدم Wallarm

    ![إشعار بنسخة جديدة في واجهة مستخدم Wallarm](../images/updating-migrating/wallarm-console-new-version-notification.png)

يتم عرض معلومات حول التحديثات المتاحة للنسخ الرئيسية والثانوية ونسخ التصحيح لعقدة Wallarm أيضًا في واجهة مستخدم Wallarm → **العقد** للعقد العادية. يحتوي كل حزمة على الحالة **مُحدَّث** أو قائمة بالتحديثات المتاحة. على سبيل المثال، تبدو بطاقة عقدة التصفية بأحدث نسخ المكونات المثبتة كالتالي:

![بطاقة العقدة](../images/user-guides/nodes/view-regular-node-comp-vers.png)

### إجراء التحديث

بالإضافة إلى إصدار النسخ الرئيسية والثانوية الجديدة لعقدة التصفية، يتم أيضًا نشر تعليمات التثبيت. للوصول إلى التعليمات حول كيفية تحديث المكونات المثبتة، يرجى استخدام التعليمات المناسبة من قسم **التحديث والتهيئة**.