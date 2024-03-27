[img-quick-help-howto]:     ../../images/fast/onboarding/common/1-quick-help.png
[img-fast-5mins-button]:    ../../images/fast/onboarding/common/2-fast-in-5mins.png
[img-intro]:                ../../images/fast/onboarding/common/3-intro.png
[img-deploy]:               ../../images/fast/onboarding/common/4-deploy.png
[img-cont-deployed]:        ../../images/fast/onboarding/common/5-cont-deployed.png
[img-ff-proxy-settings]:    ../../images/fast/onboarding/common/6-ff-proxy.png
[img-create-testrun]:       ../../images/fast/onboarding/common/7-create-testrun.png
[img-recording]:            ../../images/fast/onboarding/common/8-check-recording.png
[img-http-request]:         ../../images/fast/onboarding/common/9-request.png
[img-gruyere-app]:          ../../images/fast/onboarding/common/10-gruyere-app.png
[img-stop-recording]:       ../../images/fast/onboarding/common/11-stop-recording.png
[img-results]:              ../../images/fast/onboarding/common/12-detected-vuln.png
[img-detailed-results]:     ../../images/fast/onboarding/common/13-vuln-details.png
[img-finish]:               ../../images/fast/onboarding/common/14-finish.png

[link-wl-portal]:           https://us1.my.wallarm.com
[link-docker-install-docs]: https://docs.docker.com/install/overview/
[link-firefox-proxy]:       https://support.mozilla.org/en-US/kb/connection-settings-firefox
[link-gruyere-app]:         http://google-gruyere.appspot.com/
[link-qsg]:                 ../qsg/deployment-options.md

#   دليل تهيئة البدء بـFAST

--8<-- "../include/fast/cloud-note.md"

 عند تسجيل الدخول لأول مرة إلى بوابة [Wallarm][link-wl-portal]، ستكون لديك فرصة للتعرف على FAST من خلال خوض عملية تهيئة مكونة من خمس خطوات.

!!! info "التحكم في عملية التهيئة"
    يمكنك إيقاف عملية التهيئة في أي وقت بالنقر على زر ✕ في لوحة التهيئة.
    
    سيتم تقديم لك خيار إما تخطي عملية التهيئة بالكامل أو استئنافها في وقت لاحق من الخطوة التي كنت عليها.
    
    إذا كنت قد تخطيت عملية التهيئة وترغب في بدءها، اضغط على علامة الاستفهام في الزاوية العلوية اليمنى من بوابة Wallarm واختر خيار “FAST في 5 دقائق” من الشريط الجانبي الذي سيفتح:
    
    ![زر "المساعدة السريعة"][img-quick-help-howto]
    
    إذا كنت ترغب في استئناف عملية التهيئة التي أجلتها سابقًا، فانقر على زر “FAST في 5 دقائق” في الزاوية السفلية اليمنى من بوابة Wallarm:
    
    ![زر "FAST في 5 دقائق"][img-fast-5mins-button]

للحصول على مقدمة سريعة عن FAST، قم بما يلي:
1.  اقرأ عن حل FAST.
    
    ![معلومات عامة عن حل FAST][img-intro]
    
    انقر على زر “تنزيل عقدة FAST ←” للانتقال إلى الخطوة التالية.
    
2.  نزّل حاوية Docker بعقدة FAST على جهازك. للقيام بذلك، انسخ ونفذ أمر `docker run` الذي يظهر لك في هذه الخطوة. الأمر مملوء بالفعل بجميع المعاملات اللازمة.
    
    ![تلميح نشر][img-deploy]
    
    !!! info "تنزيل Docker"
        إذا لم يكن لديك Docker، فقم [بتنزيله][link-docker-install-docs]. يعتبر إصدار Docker سواء كان إصدار المجتمع أو الإصدار المؤسسي مناسبًا.
    
    ستستمع عقدة FAST للاتصالات الواردة على `127.0.0.1:8080` بعد أن تبدأ.
    
    ![عقدة FAST المنشورة][img-cont-deployed]

    قم بتكوين متصفح على جهازك لاستخدام `127.0.0.1:8080` كبروكسي HTTP خاص به. يمكنك استخدام أي متصفح باستثناء المتصفح الذي تفتح فيه بوابة Wallarm. نوصي باستخدام Mozilla Firefox (انظر [التعليمات][link-firefox-proxy] حول كيفية تكوين Firefox لاستخدام البروكسي).
    
    ![إعدادات البروكسي في Mozilla Firefox][img-ff-proxy-settings]
    
    !!! info "استخدام رقم مختلف للمنفذ"
        إذا لم ترغب في توفير المنفذ `8080` لعقدة FAST (مثلاً، يوجد خدمة أخرى تستمع إلى هذا المنفذ)، يمكنك تعيين رقم منفذ آخر لاستخدامه بواسطة FAST. للقيام بذلك، قم بتمرير رقم المنفذ المطلوب عبر معامل `-p` من أمر `docker run`. على سبيل المثال، لاستخدام المنفذ `9090`، ستكتب ما يلي: `-p 9090:8080`.
    
    انقر على زر “إنشاء تشغيل اختبار ←” للانتقال إلى الخطوة التالية.
    
    !!! info "العودة إلى الخطوة السابقة"
        لاحظ أنه يمكنك دائمًا العودة إلى الخطوة السابقة بالنقر على الزر الذي يحمل اسم الخطوة السابقة (على سبيل المثال، “← فهم FAST”).
   
3.  قم بإنشاء تشغيل اختبار بالنقر على زر “إنشاء تشغيل اختبار”. اختر اسمًا لتشغيل الاختبار ثم اختر سياسة الاختبار والعقدة اللازمين من القوائم المنسدلة كما هو مذكور في تلميح التهيئة:

    ![إنشاء تشغيل اختبار][img-create-testrun]
    
    اضغط على زر “إنشاء وتشغيل” لإكمال عملية إنشاء تشغيل الاختبار.
    
    انقر على زر “اكتشاف الثغرات الأمنية ←” للانتقال إلى الخطوة التالية.
    
4.  تأكد من ظهور رسالة `Recording baselines for TestRun...` في وحدة تحكم عقدة FAST:
    
    ![وحدة تحكم عقدة FAST][img-recording]
    
    ثم أرسل طلبًا إلى التطبيق الضعيف المسمى [Google Gruyere][link-gruyere-app] لبدء عملية اختبار الثغرات الأمنية باستخدام FAST.
    
    للقيام بذلك، انسخ طلب HTTP الموفر في تلميح التهيئة، ألصقه في شريط العناوين للمتصفح الذي قمت بتكوينه مسبقًا لاستخدام عقدة FAST كبروكسي، ونفذ الطلب:
    
    ![طلب HTTP في التلميح][img-http-request]
    
    ![تنفيذ طلب HTTP][img-gruyere-app]
    
    بعد إرسال الطلب، أوقف عملية تسجيل الطلب بتحديد خيار “إيقاف التسجيل” من قائمة “الإجراءات” المنسدلة. أكد الإجراء بالضغط على زر “نعم”:
    
    ![إيقاف عملية تسجيل الطلب][img-stop-recording]
    
    انتظر حتى اكتمال الاختبار. ينبغي لـFAST أن يكتشف ثغرة XSS في تطبيق Google Gruyere. ينبغي أن يتم عرض معرف ونوع الثغرة في عمود “النتائج” لتشغيل الاختبار:
    
    ![نتيجة الاختبار][img-results]
    
    !!! info "تحليل الثغرة الأمنية"
        يمكنك النقر على القيمة في عمود “النتائج” لتشغيل الاختبار للحصول على بعض الرؤى حول الثغرة الأمنية المكتشفة:
        
        ![معلومات تفصيلية عن الثغرة الأمنية][img-detailed-results]
    
    انقر على زر “استمر بالاستخدام!” للانتقال إلى الخطوة التالية.
    
5.  في هذه الخطوة، قد تعرفت بنجاح على FAST واكتشفت ثغرة أمنية في تطبيق ويب.
    
    ![نهاية عملية التهيئة][img-finish]
    
    انتقل إلى [“دليل البدء السريع”][link-qsg] للحصول على معلومات أكثر تفصيلاً حول كيفية البدء بـFAST.
    
    انقر على زر “الإنهاء” لإكمال عملية التهيئة.
    
    !!! info "إجراءات إضافية يمكن اتخاذها"
        يمكنك إغلاق حاوية Docker لعقدة FAST وتعطيل البروكسي في المتصفح بعد اكتشاف الثغرة الأمنية بنجاح.