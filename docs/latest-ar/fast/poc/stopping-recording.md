[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

#   وقف عملية التسجيل

!!! info "متطلبات الفصل"
    لتتبع الخطوات الموضحة في هذا الفصل، يجب عليك الحصول على:
        
    * [توكن][doc-get-token]
    * [معرف][doc-get-testrun-id] لجلسة اختبار
    
    القيم التالية تستخدم كقيم مثالية عبر الفصل:

    * `token_Qwe12345` كتوكن
    * `tr_1234` كمعرف لجلسة اختبار

أوقف عملية تسجيل الطلبات الأساسية عبر API من خلال اتباع الخطوات الموضحة [هنا][doc-stop-recording].

قد تستغرق عملية اختبار التطبيق المستهدف ضد الثغرات الأمنية وقتًا طويلًا بعد توقف عملية التسجيل. استخدم المعلومات من [هذا المستند][doc-waiting-for-tests] لتحديد ما إذا كانت اختبارات الأمان FAST قد اكتملت.

 يمكنك الرجوع إلى مستند ["تدفق عمل CI/CD مع FAST"][doc-integration-overview] إذا لزم الأمر.