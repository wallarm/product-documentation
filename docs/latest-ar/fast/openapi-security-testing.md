# اختبار أمان OpenAPI على CI/CD <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

يقدم اختبار أمان OpenAPI على CI/CD، الذي تقدمه Wallarm، حلاً لتحديد ومعالجة نقاط الضعف الأمنية ضمن سيناريوهات API العملية الحرجة، بما في ذلك واجهات البرمجة غير المعروفة والزومبي. تشرح هذه المقالة كيفية تشغيل واستخدام هذا الحل.

يعمل الحل من خلال إنشاء طلبات اختبار مصممة خصيصًا لكشف نقاط الضعف، مثل مشاركة مصادر Cross-Origin، والتنقل عبر المسار، وعيوب التحكم في الوصول، والمزيد. ثم يتم دمجه بسلاسة في سير عمل CI/CD الخاص بك باستخدام Docker لمسح واجهات البرمجة الخاصة بك تلقائيًا بحثًا عن هذه النقاط الضعف.

لديك المرونة في اختيار نقاط النهاية التي ترغب في إخضاعها للاختبار:

* **اكتشاف نقاط النهاية تلقائيًا**: عند استخدام وحدة [اكتشاف API من Wallarm](../api-discovery/overview.md)، يتم الكشف عن نقاط النهاية لواجهات برمجة التطبيقات الخاصة بك تلقائيًا من بيانات الحركة الواقعية. يمكنك بعد ذلك اختيار أي من هذه النقاط للاختبار. هذا يضمن أن يركز اختبار الأمان على نقاط النهاية المستخدمة بنشاط بما في ذلك غير المعروفة والزومبي، مقدمًا تقييمًا دقيقًا لنقاط الضعف في واجهة برمجة تطبيقاتك.
* **تحميل المواصفات يدويًا**: بدلاً من ذلك، يمكنك تحميل مواصفات OpenAPI الخاصة بك واستخدام الحل لاختبار نقاط النهاية من المواصفات. هذا مفيد إذا كان لديك مواصفات محدثة وترغب في تشغيل الاختبارات على نقاط النهاية المحددة ضمنها.

## المشكلات التي يعالجها اختبار أمان OpenAPI

* يتيح لك هذا الحل إجراء اختبارات أمنية أثناء اختبار الانحدار لواجهات برمجة التطبيقات الخاصة بك. إذا أجريت تغييرات على وظائف واجهات برمجة التطبيقات الخاصة بك، يمكن أن يكشف اختبار أمان Wallarm إذا كانت تغييراتك قد قدمت أي مشكلات أمنية.
* من خلال نشر التغييرات الخاصة بك على بيئة التجريب وتشغيل الاختبارات الأمنية على سير عمل CI/CD في هذه المرحلة، يمكنك منع الثغرات الأمنية المحتملة من الوصول إلى إنتاج واستغلالها من قبل المهاجمين.
* إذا استفدت من الاختبارات الأمنية بناءً على البيانات التي تم الحصول عليها من [اكتشاف API](../api-discovery/overview.md)، فإنه يختبر أيضًا واجهات برمجة التطبيقات غير المعروفة والزومبي. هذه الواجهات يتم اكتشافها تلقائيًا من قبل الوحدة نظرًا لأنها قد تتلقى حركة مرور، حتى إذا كان فريقك والتوثيق غير مدركين لوجودها. من خلال تضمين واجهات برمجة التطبيقات الزومبي في عملية الاختبار الأمني، يعالج الحل نقاط الضعف التي قد تمر دون ملاحظة، موفرًا تقييمًا أمنيًا أكثر شمولاً.

## المتطلبات

* خطة اشتراك **أمان API المتقدم** [خطة الاشتراك](../about-wallarm/subscription-plans.md#subscription-plans) النشطة. إذا كنت تتبع خطة مختلفة، يرجى التواصل مع [فريق المبيعات](mailto:sales@wallarm.com) للانتقال إلى المطلوبة.

## تشغيل الاختبارات الأمنية

للتحكم وتخصيص ميزة اختبار أمان OpenAPI، يمكنك استخدام سياسات الاختبار. بمجرد إنشاء سياسة اختبار، تتلقى أمرًا يسمح لك بدمج وتشغيل الاختبارات الأمنية ضمن سير عمل CI/CD الخاص بك باستخدام Docker.

لتشغيل اختبار أمان OpenAPI، اتبع هذه الخطوات:

1. توجه إلى وحدة تحكم Wallarm → **اختبار OpenAPI** من خلال الرابط لـ[السحابة الأمريكية](https://us1.my.wallarm.com/security-testing) أو [السحابة الأوروبية](https://my.wallarm.com/security-testing) و**إنشاء سياسة اختبار**.

    ![!إنشاء السياسة](../images/user-guides/openapi-testing/create-testing-policy.png)
1. اختر نقاط النهاية الخاصة بواجهة البرمجة التي ترغب في اختبارها إما من [مخزون API الخاص بك المكتشف تلقائيًا](../api-discovery/overview.md) أو حمل مواصفات OpenAPI 3.0 بتنسيق JSON.

    على الرغم من أن وحدة اكتشاف API تحدد تلقائيًا نقاط النهاية الجديدة، إلا أنها لا تشملها تلقائيًا في سياسات اختبار الثغرات الأمنية القائمة. نتيجة لذلك، يتطلب كل نقطة نهاية مكتشفة حديثًا سياسة منفصلة.
1. اختر أنواع الثغرات الأمنية التي ترغب في اختبار واجهات برمجة التطبيقات الخاصة بك بحثًا عنها.
1. إذا لزم الأمر، أضف رؤوسًا مخصصة للاختبار الأمني، مثل رؤوس التوثيق أو مؤشرات لطلبات الاختبار من Wallarm.

    ستُستخدم هذه الرؤوس لكل طلب لكل نقطة نهاية.
1. انسخ الأمر Docker المُقدم واملأ القيم لمتغيرات البيئة التي لم تُملأ تلقائيًا.
1. دمج الأمر داخل سير عمل CI/CD الخاص بك للاختبار التلقائي.

مثال على أمر Docker:

=== "السحابة الأمريكية"
    ```
    docker run -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```
=== "السحابة الأوروبية"
    ```
    docker run -e WALLARM_API_HOST=api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```

قائمة متغيرات البيئة التي [حاوية Docker](https://hub.docker.com/r/wallarm/oas-fast-scanner) تقبلها موفرة أدناه:

متغير البيئة | الوصف | مطلوب؟
--- | ---- | ----
`WALLARM_API_HOST` | سيرفر Wallarm API:<ul><li>`us1.api.wallarm.com` للسحابة الأمريكية</li><li>`api.wallarm.com` للسحابة الأوروبية</li></ul> | نعم
`WALLARM_API_TOKEN` | [رمز API من Wallarm](../user-guides/settings/api-tokens.md) بأذونات **اختبار OpenAPI**. | نعم
`WALLARM_TESTING_POLICY_ID` | معرف سياسة اختبار Wallarm. يتم إنشاؤه تلقائيًا بمجرد إنشاء السياسة. | نعم
`TARGET_URL` | عنوان URL الذي تستضيف فيه نقاط النهاية لواجهة برمجة التطبيقات التي ترغب في اختبارها. يتم إرسال طلبات الاختبار إلى هذا المضيف، على سبيل المثال، المرحلة التجريبية، أو البناء المحلي. | نعم

للمقاربة الأكثر أمانًا لتمرير متغيرات إلى الحاوية، يُنصح بحفظ قيم متغيرات بيئة الحاوية التي لم تُملأ تلقائيًا كمتغيرات بيئة محلية على جهازك. يمكنك القيام بذلك عن طريق تنفيذ الأوامر التالية في محطة الأوامر الخاصة بك:

```
export WALLARM_API_TOKEN=<VALUE>
export WALLARM_SCANNER_TARGET_URL=<VALUE>
```

لحفظ نتائج الاختبارات الأمنية على جهاز المضيف، حدد مسار الجهاز المضيف المطلوب في متغير `${WALLARM_REPORT_PATH}` ضمن خيار `-v` لأمر Docker.

## تفسير نتائج الاختبارات الأمنية

عند تشغيل الاختبارات الأمنية، تقوم Wallarm بإنشاء سلسلة من طلبات الاختبار النموذجية التي صُممت خصيصًا للكشف عن نقاط الضعف المحددة في سياسة اختبارك. تُرسل هذه الطلبات تتابعيًا إلى النقاط المحددة في سياستك.

من خلال تحليل الاستجابات للطلبات المُنشأة، تحدد Wallarm نقاط الضعف المفتوحة الموجودة في نقاط النهاية لواجهة برمجة التطبيقات الخاصة بك. ثم تعود برمز `0` أو `1` عبر الإخراج القياسي (stdout) لحاوية Docker:

* رمز `0` يدل على أنه لم يتم اكتشاف أي نقاط ضعف مفتوحة.
* رمز `1` يدل على وجود نقاط ضعف مفتوحة.

إذا تلقيت رمز `1` لنقاط ضعف معينة، من المهم اتخاذ التدابير المناسبة لمعالجتها.

## إنشاء تقرير الاختبارات الأمنية

يمكنك الحصول على تقرير أمني يوفر معلومات تفصيلية عن الطلبات التي كشفت عن نقاط الضعف. يتم إنشاء التقرير بتنسيقات متعددة، بما في ذلك CSV، YAML، وJSON.

لحفظ نتائج الاختبارات الأمنية على جهاز المضيف، حدد مسار الجهاز المضيف المطلوب في متغير `${WALLARM_REPORT_PATH}` ضمن خيار `-v ${WALLARM_REPORT_PATH}:/app/reports` لأمر Docker.

من المهم التأكد من أن المسار المحدد للجهاز المضيف لديه أذونات الكتابة المناسبة للسماح بحفظ ملفات التقرير بنجاح من قبل الحاوية.

مثال على تقرير JSON:

```json
[
    {
        "type":"ptrav",
        "threat":80,
        "payload":"/../../../../../../../../../etc/passwd",
        "exploit_example":"curl -v -X GET -H 'x-test-id: 123' http://app:8000/files?path=/../../../../../../