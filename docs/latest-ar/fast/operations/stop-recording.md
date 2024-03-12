[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   إيقاف عملية التسجيل

!!! info "البيانات الضرورية"
    لإيقاف التسجيل عبر API، البيانات التالية مطلوبة:
    
    * رمز
    * تعريف لجري التجربة

    لإيقاف التسجيل عبر واجهة الويب، تحتاج إلى حساب على Wallarrm.
    
    يُمكنكم الحصول على معلومات مفصلة عن جري التجربة والرمز [هُنا][doc-about-tr-token].
    
    تُستخدم القيم التالية كقيم مثالية في هذه الوثيقة:
        
    * `token_Qwe12345` كرمز.
    * `tr_1234` كتعريف لجري التجربة.

يُوضح الحاجة إلى إيقاف تسجيل طلبات الأساس بواسطة [الرابط][link-stop-explained]. 

## إيقاف عملية التسجيل عبر API

لإيقاف عملية التسجيل، أرسل طلب POST إلى الرابط `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop`:

--8<-- "../include/fast/operations/api-stop-recording.md"

إذا كان طلبك إلى خادم API ناجحًا، سيُقدم لك رد الخادم. يُوفر الرد معلومات مفيدة، تتضمن:
* حالة عملية التسجيل (قيمة مُعلم `recording`).
* تعريف لسجل التجربة المُقابل (مُعلم `test_record_id`).

إذا كانت قيمة المُعلم `false`، إذَا كان الإيقاف ناجحًا.

إذا كان الإيقاف ناجحًا، يُمكنك استخدام سجل التجربة بتعريف `test_record_id` لـ [نسخ جريان التجارب][doc-testrun-copying-api].

## إيقاف عملية التسجيل عبر واجهة الويب

لإيقاف عملية التسجيل عبر واجهة الويب، يُرجى اتباع الخطوات التالية:

1. اذهب إلى حسابك على Wallarm > **جريان التجارب** من [هذا الرابط](https://my.wallarm.com/testing/testruns) لحوسبة الاتحاد الأوروبي أو من [هذا الرابط](https://us1.my.wallarm.com/testing/testruns) لحوسبة الولايات المتحدة.

2. اختر جري التجربة الذي ترغب في إيقاف التسجيل له وافتح قائمة الإجراءات.

3. اختر **إيقاف التسجيل**.

    ![إيقاف التسجيل عبر واجهة الويب][img-stop-recording-item]

سيتم إيقاف مؤشر REQ الموجود إلى اليسار من عمود **طلبات الأساس.** عند إيقاف التسجيل.

يتم عرض تعريف سجل التجربة في عمود **اسم سجل التجربة / تعريف سجل التجربة**.

إذا لزم الأمر، يُمكنك [نسخ هذا جري التجربة][doc-testrun-copying-gui] باستخدام واجهة الويب وسيعيد الاختبار الجديد استخدام سجل التجربة المذكور.