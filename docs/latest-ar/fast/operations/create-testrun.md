[img-test-run-creation]:            ../../images/fast/operations/common/create-testrun/test-run-create.png
[img-testrun-adv-settings]:         ../../images/fast/operations/common/create-testrun/test-run-settings.png

[doc-token-information]:    internals.md#token
[doc-state-description]:    check-testrun-status.md
[doc-copying-testrun]:      copy-testrun.md
[doc-testrecord]:           internals.md#test-record

[link-stopping-recording-chapter]:  stop-recording.md
[link-create-policy]:               test-policy/general.md
[link-create-node]:                 create-node.md
[doc-inactivity-timeout]:           internals.md#test-run

#   إنشاء جولة اختبار

!!! info "البيانات اللازمة"
    لإنشاء جولة اختبار عبر واجهة برمجة التطبيقات، تحتاج إلى رمز.
    
    لإنشاء جولة اختبار عبر واجهة الويب، تحتاج إلى حساب Wallarm.
    
    يمكنك الحصول على معلومات تفصيلية عن الرمز [هنا][doc-token-information].
    
    يُستخدم قيمة `token_Qwe12345` كمثال على الرمز في هذا المستند.

عند إنشاء جولة اختبار، يتم أيضًا إنشاء [سجل اختبار][doc-testrecord] جديد.

تُستخدم هذه الطريقة لإنشاء جولة اختبار إذا كان مطلوبًا اختبار تطبيق هدف مع تسجيل طلبات أساسية.

## إنشاء جولة اختبار عبر واجهة برمجة التطبيقات

لإنشاء جولة اختبار، أرسل طلب POST إلى العنوان `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include/fast/operations/api-create-testrun.md"

إذا كان الطلب إلى خادم واجهة برمجة التطبيقات ناجحًا، ستُقدم لك استجابة الخادم. توفر الاستجابة معلومات مفيدة، تشمل:

1.  `id`: معرف جولة الاختبار التي تم إنشاؤها حديثًا (مثال، `tr_1234`).
    
    ستحتاج إلى قيمة معامل الهوية لأداء الإجراءات التالية، المطلوبة لدمج FAST في CI/CD:
    
    1.  التحقق من بدء عملية تسجيل العقدة FAST.  
    2.  إيقاف عملية تسجيل الطلبات الأساسية.
    3.  الانتظار حتى انتهاء اختبارات الأمان FAST.
    
2.  `state`: حالة جولة الاختبار.
    
    جولة الاختبار التي تم إنشاؤها حديثًا في حالة `running`.
    يمكن العثور على وصف شامل لجميع قيم معامل `state` [هنا][doc-state-description].
    
3.  `test_record_id`: معرف سجل الاختبار الذي تم إنشاؤه حديثًا (مثال، `rec_0001`). سيتم وضع جميع الطلبات الأساسية في هذا سجل الاختبار.    

##  إنشاء جولة اختبار عبر واجهة الويب
      
لإنشاء جولة اختبار عبر واجهة حسابك في Wallarm، اتبع الخطوات أدناه:

1. اذهب إلى حسابك في Wallarm > **جولات الاختبار** من [هذا الرابط](https://my.wallarm.com/testing/testruns) لسحابة الاتحاد الأوروبي أو من [هذا الرابط](https://us1.my.wallarm.com/testing/testruns) لسحابة الولايات المتحدة.

2. انقر على زر **إنشاء جولة اختبار**.

3. أدخل اسم جولة الاختبار الخاصة بك.

4. اختر سياسة الاختبار من قائمة **سياسة الاختبار** المنسدلة. لإنشاء سياسة اختبار جديدة، يرجى اتباع [هذه التعليمات][link-create-policy]. كما يمكنك استخدام السياسة الافتراضية.

5. اختر العقدة FAST من قائمة **العقدة** المنسدلة. لإنشاء عقدة FAST، يرجى اتباع [هذه التعليمات][link-create-node].

    ![إنشاء جولة اختبار][img-test-run-creation]

6. أضف **الإعدادات المتقدمة** إذا لزم الأمر. يشمل هذا البند من الإعدادات النقاط التالية:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![إعدادات جولة الاختبار المتقدمة][img-testrun-adv-settings]

7.  انقر على زر **إنشاء وتشغيل**.

## إعادة استخدام سجل الاختبار

عندما يتم إرسال الطلبات من مصدر الطلبات إلى التطبيق الهدف، وتم إيقاف [عملية التسجيل][link-stopping-recording-chapter]، يمكن [إعادة استخدام سجل الاختبار][doc-copying-testrun] مع جولات اختبار أخرى.