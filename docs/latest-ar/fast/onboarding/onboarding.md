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

# إلمام سريع بـFAST

--8<-- "../include/fast/cloud-note.md"

عند تسجيل الدخول لأول مرة إلى بوابة [Wallarm][link-wl-portal]، ستتاح لك فرصة التعرف على FAST من خلال عملية توجيه مكونة من خمس خطوات.

!!! info "التحكم في عملية التوجيه"
    يمكنك إيقاف عملية التوجيه بالنقر على زر ✕ في لوحة التوجيه في أي وقت.
    
    سيُعرض عليك خيار إما تخطي التوجيه بالكامل أو استئناف العملية لاحقًا من الخطوة التي أنت عليها.
    
    إذا قمت بتخطي التوجيه وترغب في بدءه، اضغط على علامة الاستفهام في الزاوية العلوية اليمنى من بوابة Wallarm واختر عنصر "FAST في 5 دقائق" من الشريط الجانبي الذي يفتح:
    
    ![زر "المساعدة السريعة"][img-quick-help-howto]
    
    إذا أردت استئناف عملية التوجيه التي أجلتها سابقًا، فانقر على زر "FAST في 5 دقائق" في الزاوية السفلية اليمنى من بوابة Wallarm:
    
    ![زر "FAST في 5 دقائق"][img-fast-5mins-button]

للحصول على مقدمة سريعة عن FAST، قم بما يلي:
1. اقرأ عن حل FAST.
    
    ![معلومات عامة عن حل FAST][img-intro]
    
    انقر على زر "نشر عقدة FAST →" للانتقال إلى الخطوة التالية.
    
2. نشر حاوية Docker مع عقدة FAST على جهازك. للقيام بذلك، انسخ ونفذ الأمر `docker run` الذي يظهر لك في هذه الخطوة. الأمر مُدخل مسبقًا بجميع الوسائط اللازمة.
    
    ![تلميح للنشر][img-deploy]
    
    !!! info "تثبيت Docker"
        إذا لم يكن لديك Docker، ف[قم بتثبيته][link-docker-install-docs]. كلا الإصدارين مناسب—نسخة الجماعة أو نسخة المؤسسة.
    
    ستستمع عقدة FAST إلى الاتصالات الواردة على `127.0.0.1:8080` بعد انطلاقها.
    
    ![عقدة FAST المُنشرة][img-cont-deployed]

    قم بتكوين متصفح على جهازك لاستخدام `127.0.0.1:8080` كوكيل HTTP. يمكنك استخدام أي متصفح باستثناء الذي تم فتح بوابة Wallarm به. نوصي باستخدام Mozilla Firefox (اطلع على [التعليمات][link-firefox-proxy] لضبط Firefox لاستخدام الوكيل).
    
    ![إعدادات الوكيل في Mozilla Firefox][img-ff-proxy-settings]
    
    !!! info "استخدام رقم مختلف للمنفذ"
        إذا كنت لا تريد تخصيص المنفذ `8080` لعقدة FAST (على سبيل المثال، يوجد خدمة أخرى تستمع على ذلك المنفذ)، يمكنك تعيين رقم منفذ آخر لتستخدمه FAST. للقيام بذلك، مرر رقم المنفذ المطلوب عبر المعلمة `-p` من أمر `docker run`. على سبيل المثال، لاستخدام المنفذ `9090`، كتابة ما يلي: `-p 9090:8080`.
    
    انقر على زر "إنشاء تشغيل اختبار →" للذهاب إلى الخطوة التالية.
    
    !!! info "الرجوع إلى الخطوة السابقة"
        لاحظ أنه يمكنك دائمًا العودة إلى الخطوة السابقة بالنقر على الزر الذي يحمل اسم الخطوة السابقة (مثلاً، "← فهم FAST").
   
3.  أنشئ تشغيل اختبار بالنقر على زر "إنشاء تشغيل اختبار". اختر اسمًا لتشغيل الاختبار ثم اختر سياسة الاختبار والعقدة اللازمة من قوائم السحب حسب ما هو مذكور في تلميح التوجيه:

    ![إنشاء تشغيل اختبار][img-create-testrun]
    
    اضغط على زر "إنشاء وتشغيل" لإكمال عملية إنشاء تشغيل الاختبار.
    
    انقر على زر "اكتشاف الثغرات الأمنية →" للانتقال إلى الخطوة التالية.
    
4.  تأكد من ظهور رسالة `Recording baselines for TestRun...` في وحدة تحكم عقدة FAST:
    
    ![وحدة تحكم عقدة FAST][img-recording]
    
    ثم أرسل طلبًا إلى التطبيق الضعيف المسمى [Google Gruyere][link-gruyere-app] لبدء عملية اختبار الثغرات الأمنية باستخدام FAST.
    
    للقيام بذلك، انسخ الطلب HTTP المقدم في تلميح التوجيه، الصقه في شريط العناوين للمتصفح الذي قمت بإعداده سابقًا لاستخدام عقدة FAST كوكيل، ونفذ الطلب:
    
    ![الطلب HTTP في التلميح][img-http-request]
    
    ![تنفيذ الطلب HTTP][img-gruyere-app]
    
    بعد إرسال الطلب، أوقف عملية تسجيل الطلب بتحديد "إيقاف التسجيل" في قائمة "الإجراءات" السحابية. أكد الإجراء بالنقر على زر "نعم":
    
    ![إيقاف عملية تسجيل الطلب][img-stop-recording]
    
    انتظر حتى اكتمال الاختبار. يجب على FAST أن تكتشف ثغرة XSS في تطبيق Google Gruyere. يجب عرض معرف الثغرة ونوعها في عمود "النتائج" لتشغيل الاختبار:
    
    ![نتيجة الاختبار][img-results]
    
    !!! info "تحليل الثغرة الأمنية"
        يمكنك النقر على القيمة في عمود "النتائج" لتشغيل الاختبار للحصول على بعض الت Insights حول الثغرة الأمنية المكتشفة:
        
        ![معلومات مفصلة حول الثغرة الأمنية][img-detailed-results]
    
    انقر على زر "اعمل بها!" للانتقال إلى الخطوة التالية.
    
5.  بحلول هذه الخطوة، قد تعرفت بنجاح على FAST واكتشفت ثغرة أمنية في تطبيق ويب.
    
    ![نهاية عملية التوجيه][img-finish]
    
    انتقل إلى ["دليل البدء السريع"][link-qsg] للحصول على معلومات أكثر تفصيلًا حول كيفية البدء باستخدام FAST.
    
    انقر على زر "إنهاء" لإكمال عملية التوجيه.
    
    !!! info "إجراءات إضافية يمكن اتخاذها"
        يمكنك إيقاف تشغيل حاوية Docker لعقدة FAST وتعطيل التوجيه في المتصفح بعد الكشف الناجح عن الثغرة.