[img-sample-job-recording]:     ../../images/fast/poc/en/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/en/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#test-run
[doc-container-deployment]:     node-deployment.md#deployment-of-the-docker-container
[doc-testrun-creation]:         node-deployment.md#creating-a-test-run 
[doc-testrun-copying]:          node-deployment.md#copying-a-test-run     
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#test-record
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #deployment-via-the-api-when-baseline-requests-recording-takes-place 
[anchor-no-recording]:          #deployment-via-the-api-when-prerecorded-baseline-requests-are-used

[doc-integration-overview]:     integration-overview.md

#  الدمج عبر API الخاص بـ Wallarm

هناك عدة طرق للتوزيع:
1.  [التوزيع عبر API عندما يتم تسجيل طلبات الأساس.][anchor-recording]
2.  [التوزيع عبر API عند استخدام طلبات أساس مُسجَلة مسبقًا.][anchor-no-recording]


##  التوزيع عبر API عندما يتم تسجيل طلبات الأساس

يتم إنشاء [تشغيل اختبار][doc-testrun] في هذا السيناريو. طلبات الأساس سوف تُسجَل إلى سجل اختبار يتوافق مع تشغيل الاختبار.

خطوات سير العمل المقابلة هي:

1.  بناء ونشر تطبيق الهدف.

2.  نشر وضبط عقدة FAST:
    
    1.  [نشر حاوية Docker بعقدة FAST][doc-container-deployment].
    
    2.  [إنشاء تشغيل اختبار][doc-testrun-creation].
    
        بعد قيامك بهذه الخطوات، تأكد من أن عقدة FAST جاهزة لبدء عملية تسجيل طلبات الأساس.
    
3.  الاستعداد وضبط أداة الاختبار:
    
    1.  نشر وإجراء تكوين أساسي لأداة الاختبار.
    
    2.  [ضبط عقدة FAST كخادم وكيل][doc-proxy-configuration].
    
4.  تشغيل الاختبارات الموجودة.
    
    عقدة FAST ستبدأ بإنشاء وتنفيذ مجموعة اختبارات الأمان عند استلامها للطلب الأساسي الأول.
    
5.  إيقاف عملية تسجيل طلبات الأساس.
    
    يجب [إيقاف عملية التسجيل][doc-stopping-recording] بعد تنفيذ كل الاختبارات الموجودة.
    
    الآن، [سجل الاختبار][doc-testrecord] الذي يحتفظ بطلبات الأساس المسجلة، جاهز لإعادة الاستخدام في تدفق عمل CI/CD الذي يعمل مع طلبات الأساس المسجلة مسبقًا.
    
6.  انتظار انتهاء اختبارات أمان FAST.
    
    تحقق دوريًا من حالة تشغيل الاختبار بإجراء طلب API. هذا يساعد في [تحديد ما إذا كانت اختبارات الأمان قد انتهت أم لا][doc-waiting-for-tests].
    
7.  الحصول على نتائج الاختبار.

هذا السيناريو موضح في الصورة أدناه:

![مثال على وظيفة CI/CD مع تسجيل الطلبات][img-sample-job-recording]


##  التوزيع عبر API عند استخدام طلبات أساس مُسجَلة مسبقًا

يتم نسخ تشغيل اختبار في هذا السيناريو. أثناء النسخ، يتم تمرير معرف سجل الاختبار الموجود إلى تشغيل الاختبار. يتم الحصول على سجل الاختبار في تدفق عمل CI/CD مع تسجيل طلبات الأساس.

خطوات سير العمل المقابلة هي:

1.  بناء ونشر تطبيق الهدف.

2.  نشر وضبط عقدة FAST:
    
    1.  [نشر حاوية Docker بعقدة FAST][doc-container-deployment].
    
    2.  [نسخ تشغيل اختبار][doc-testrun-copying].    

3.  استخراج طلبات الأساس من سجل الاختبار المحدد بواسطة عقدة FAST. 

4.  إجراء اختبارات الأمان لتطبيق الهدف بواسطة عقدة FAST.

5.  انتظار انتهاء اختبارات أمان FAST.
    
    تحقق دوريًا من حالة تشغيل الاختبار بإجراء طلب API. هذا يساعد في [تحديد ما إذا كانت اختبارات الأمان قد انتهت أم لا][doc-waiting-for-tests].
    
6.  الحصول على نتائج الاختبار.

![مثال على وظيفة CI/CD مع استخدام طلبات مُسجلة مسبقًا][img-sample-job-no-recording]   


##  دورة حياة حاوية عقدة FAST (التوزيع عبر API)

يفترض هذا السيناريو أن حاوية Docker مع عقدة FAST تعمل مرة واحدة فقط لوظيفة CI/CD معينة ويتم إزالتها عند انتهاء الوظيفة.
 
إذا لم تواجه عقدة FAST أخطاء حرجة أثناء التشغيل، فإنها تعمل في حلقة لا نهائية، في انتظار تشغيلات وطلبات أساس جديدة لاختبار تطبيق الهدف مرة أخرى.
  
يجب إيقاف حاوية العقدة بشكل صريح بواسطة أداة CI/CD عندما تنتهي وظيفة CI/CD. 

<!-- -->
يمكنك الرجوع إلى وثيقة [“تدفق عمل CI/CD مع FAST”][doc-integration-overview] إذا لزم الأمر.