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

# إنشاء تشغيل اختبار

!!! info "البيانات اللازمة"
    لإنشاء تشغيل اختبار عن طريق واجهة برمجة التطبيقات API، تحتاج إلى رمز.
    
    لإنشاء تشغيل اختبار عن طريق واجهة الويب، تحتاج إلى حساب على Wallarm.
    
    يمكنك الحصول على معلومات تفصيلية حول الرمز [هنا][doc-token-information].
    
    يُستخدم قيمة `token_Qwe12345` كمثال للرمز في هذه الوثيقة.

عند إنشاء تشغيل اختبار، يتم أيضًا إنشاء [سجل اختبار جديد][doc-testrecord].

يجب استخدام هذه الطريقة لإنشاء تشغيل اختبار إذا كان مطلوبًا اختبار التطبيق المستهدف جنبًا إلى جنب مع تسجيل طلبات الأساس.

## إنشاء تشغيل اختبار عبر API

لإنشاء تشغيل اختبار، أرسل طلب POST إلى العنوان `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include/fast/operations/api-create-testrun.md"

إذا كان الطلب إلى خادم API ناجحًا، سيتم عرض استجابة الخادم. توفر الاستجابة معلومات مفيدة، بما في ذلك:

1.  `id`: معرف تشغيل الاختبار الذي تم إنشاؤه حديثًا (مثل، `tr_1234`).
    
    ستحتاج قيمة معامل الهوية لأداء الإجراءات التالية المطلوبة لدمج FAST في CI/CD:
    
    1.  التحقق من بدء عملية تسجيل العقدة FAST.
    2.  إيقاف عملية تسجيل طلبات الأساس.
    3.  الانتظار حتى تنتهي اختبارات الأمان FAST.
    
2.  `state`: حالة تشغيل الاختبار.
    
    تشغيل الاختبار الذي تم إنشاؤه حديثًا في حالة `running`.
    يمكن العثور على وصف شامل لجميع قيم معامل `state` [هنا][doc-state-description].
    
3.  `test_record_id`: معرف سجل الاختبار الذي تم إنشاؤه حديثًا (مثل، `rec_0001`). سيتم وضع جميع طلبات الأساس في هذا سجل الاختبار.

## إنشاء تشغيل اختبار عبر واجهة الويب
      
لإنشاء تشغيل اختبار عبر واجهة حسابك على Wallarm، اتبع الخطوات التالية:

1. اذهب إلى حسابك على Wallarm > **تشغيلات الاختبار** عن طريق [هذا الرابط](https://my.wallarm.com/testing/testruns) للسحابة الأوروبية أو عن طريق [هذا الرابط](https://us1.my.wallarm.com/testing/testruns) للسحابة الأمريكية.

2. انقر على زر **إنشاء تشغيل اختبار**.

3. أدخل اسم تشغيل الاختبار الخاص بك.

4. اختر سياسة الاختبار من قائمة **سياسة الاختبار** المنسدلة. لإنشاء سياسة اختبار جديدة، يرجى اتباع هذه [التعليمات][link-create-policy]. كما يمكنك استخدام السياسة الافتراضية.

5. اختر عقدة FAST من قائمة **العقدة** المنسدلة. لإنشاء عقدة FAST، يرجى اتباع هذه [التعليمات][link-create-node].

    ![إنشاء تشغيل اختبار][img-test-run-creation]

6. إضافة **الإعدادات المتقدمة** إذا لزم الأمر. يشمل هذا البلوك النقاط التالية:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![إعدادات تشغيل الاختبار المتقدمة][img-testrun-adv-settings]

7.  انقر على زر **إنشاء وتشغيل**.

## إعادة استخدام سجل الاختبار

عند إرسال الطلبات من مصدر الطلبات إلى التطبيق المستهدف، ويتم [إيقاف عملية التسجيل][link-stopping-recording-chapter]، من الممكن [إعادة استخدام سجل الاختبار][doc-copying-testrun] مع تشغيلات اختبار أخرى.