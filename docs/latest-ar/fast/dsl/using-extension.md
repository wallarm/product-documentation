[link-points]:                  points/intro.md
[link-stop-recording]:          ../qsg/test-run.md#2-execute-the-https-baseline-request-you-created-earlier 

[doc-mod-extension]:            extensions-examples/mod-extension.md
[doc-non-mod-extension]:        extensions-examples/non-mod-extension.md
[doc-testpolicy]:               logic.md#how-test-policy-influences-the-request-processing

[img-test-policy-insertion-points]:      ../../images/fast/dsl/common/using-extensions/tp_insertion_points.png
[img-test-policy-attacks]:              ../../images/fast/dsl/common/using-extensions/tp_attacks_test.png
[img-test-run]:                 ../../images/fast/dsl/common/using-extensions/create_testrun.png
[img-testrun-details]:          ../../images/fast/dsl/common/using-extensions/testrun_details.png
[img-log]:                      ../../images/fast/dsl/common/using-extensions/log.png
[img-vulns]:                    ../../images/fast/dsl/common/using-extensions/vulnerabilities.png
[img-vuln-details-mod]:             ../../images/fast/dsl/common/using-extensions/vuln_details-mod.png

[anchor-connect-extension]:     #connecting-extensions

# استخدام إمتدادت FAST

## ربط الإمتدادات

لكي تستخدم الإمتدادت المُنشأة، تحتاج إلى ربطها بعقدة FAST.

يمكنك القيام بذلك إما بإحدى الطرق التالية:
* وضع الإمتدادت في دليل وتحميل هذا الدليل إلى حاوية Docker لعقدة FAST باستخدام خيار `-v` لأمر `docker run`.
    
    ```
    sudo docker run --name <اسم الحاوية> --env-file=<ملف بالمتغيرات البيئية> -v <مسار دليل الإمتدادات>:/opt/custom_extensions -p <المنفذ المستهدف>:8080 wallarm/fast
    ```
    
    **مثال:**
    
    قم بتشغيل الأمر التالي لإطلاق عقدة FAST في حاوية Docker بالحجج التالية:

    1. اسم الحاوية: `fast-node`.
    2. ملف المتغيرات البيئية: `/home/user/fast.cfg`.
    3. مسار دليل إمتدادات FAST: `/home/user/extensions`.
    4. المنفذ الذي يتم نشره لمنفذ `8080` للحاوية: `9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* وضع الإمتدادت في مستودع Git عام وتعريف المتغير البيئي الذي يشير إلى المستودع المطلوب، في حاوية Docker لعقدة FAST.
    
    للقيام بذلك، قم بالخطوات التالية:
    
    1. أضف متغير `GIT_EXTENSIONS` إلى الملف الذي يحتوي على المتغيرات البيئية.

        **مثال:**
        
        إذا كانت إمتداداتك في مستودع Git `https://github.com/wallarm/fast-detects`، عرف المتغير البيئي التالي:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2. قم بتشغيل حاوية Docker لعقدة FAST باستخدام الملف الذي يحتوي على المتغيرات البيئية كما يلي:
        
        ```
        sudo docker run --name <اسم الحاوية> --env-file=<ملف بالمتغيرات البيئية> -p <المنفذ المستهدف>:8080 wallarm/fast
        ```
        
        **مثال:**
        
        قم بتشغيل الأمر التالي لإطلاق عقدة FAST في حاوية Docker بالحجج التالية:

        1. اسم الحاوية: `fast-node`.
        2. ملف المتغيرات البيئية: `/home/user/fast.cfg`.
        3. المنفذ الذي يتم نشره لمنفذ `8080` للحاوية: `9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include/fast/wallarm-api-host-note.md"

إذا تم إطلاق عقدة FAST بنجاح، فسوف تكتب إلى الوحدة الطرفية الإخراج التالي الذي يُخبر عن الاتصال الناجح بـ Wallarm Cloud وعدد الإمتدادت المحملة:

--8<-- "../include/fast/console-include/dsl/fast-node-run-ok.md"

إذا حدث خطأ أثناء إطلاق العقدة، يتم كتابة معلومات الخطأ إلى الوحدة الطرفية. يظهر الرسالة حول خطأ صياغة الإمتداد في المثال التالي:

--8<-- "../include/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "متطلبات موقع الإمتدادات"
    الإمتدادات من الدلائل المتداخلة لن يتم ربطها (على سبيل المثال، إذا تم وضع الإمتداد في دليل `extensions/level-2/`). بناءً على طريقة الاتصال المختارة، يجب وضع الإمتدادات إما في جذر الدليل المُحمل في حاوية Docker لعقدة FAST أو في جذر المستودع Git.

## فحص تشغيل الإمتدادات

لفحص تشغيل إمتدادات [`mod-extension.yaml`][doc-mod-extension] و [`non-mod-extension.yaml`][doc-non-mod-extension] التي تم إنشاؤها مسبقًا، قم بالإجراءات التالية:

1. ربط الإمتدادات بعقدة FAST باتباع [الخطوات المذكورة أعلاه][anchor-connect-extension].

2. إنشاء سياسة اختبار. ستُستخدم هذه السياسة من قبل جميع إمتدادات FAST المرتبطة بعقدة FAST. يُوجد معلومات مفصلة حول كيفية عمل سياسات الاختبار [هنا][doc-testpolicy].

    دعونا نُذكركم أن الإمتداد المعدل يغير نقطة `POST_JSON_DOC_HASH_email_value` في طلب الأساس، والإمتداد غير المعدل يتطلب إذنًا للعمل مع نقطة `URI`.
    
    لذلك، لجعل كلا الإمتدادين يتم تنفيذهما خلال تشغيل اختبار واحد، يجب أن تُتيح سياسة الاختبار العمل مع:
    
    * معاملات POST
    * المعامل URI
    
    ![معالج سياسة الاختبار، علامة التبويب "نقاط الإدخال"][img-test-policy-insertion-points]
    
    أيضًا، الإمتدادات تفحص إذا كان التطبيق عرضة لهجوم SQLi؛ لذلك قد يكون من المُلائم فحص التطبيق من أجل ثغرات أخرى باستخدام كشفات Wallarm فوري (مثل RCE). هذا سيساعدك على التأكد من أن ثغرة SQLi يتم كشفها باستخدام الإمتدادات المُنشأة بدلًا من كشفات FAST المُدمجة.
    
    ![معالج سياسة الاختبار، علامة التبويب "الهجمات للاختبار"][img-test-policy-attacks]
    
    يجب أن تبدو سياسة الاختبار الناتجة كما يلي:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3. إنشاء تشغيل اختبار لعقدة FAST الخاصة بك بناءً على سياسة الاختبار المُنشأة.
    
    ![تشغيل الاختبار][img-test-run]

4. انتظر حتى تكتب عقدة FAST رسالة معلوماتية إلى الوحدة الطرفية تشبه ما يلي: `Recording baselines for TestRun#`. هذا يعني أن عقدة FAST جاهزة لتسجيل طلبات الأساس.<br>
--8<-- "../include/fast/console-include/dsl/fast-node-recording.md"

5. إنشاء وإرسال طلب POST بمعاملات عشوائية إلى صفحة تسجيل الدخول OWASP Juice Shop من خلال عقدة FAST، كما هو موضح في المثال التالي:
    
    ```
    curl --proxy http://<عنوان IP عقدة FAST> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: en-US,en;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    يمكنك استخدام `curl` أو أدوات أخرى لإرسال الطلب.
    
    !!! info "إيقاف عملية تسجيل طلب الأساس"
        بعد إرسال طلب الأساس، يُوصى بإيقاف عملية التسجيل. يتم وصف هذا الإجراء [هنا][link-stop-recording].

6. في إخراج وحدة تحكم عقدة FAST، سترى كيف:

    * يتم اختبار التطبيق المستهدف باستخدام كشفات FAST المُدمجة،
    * يتم تنفيذ الإمتداد المعدل FAST لمعاملات POST في طلب الأساس، و
    * يتم تنفيذ الإمتداد غير المعدل FAST لمعامل URI في طلب الأساس.
    --8<-- "../include/fast/console-include/dsl/fast-node-working.md"

    يمكنك رؤية السجل الكامل لمعالجة الطلب عن طريق فتح معلومات تشغيل الاختبار على واجهة ويب Wallarm والنقر على رابط "التفاصيل".
    
    ![معلومات تشغيل الاختبار المفصلة][img-testrun-details]
    
    ![سجل كامل لمعالجة الطلب][img-log]

7. يمكنك أيضًا رؤية معلومات حول الثغرات الأمنية المكتشفة بالنقر على الرابط الذي يحتوي على عدد القضايا المكتشفة، مثل "2 قضايا". سيتم فتح صفحة "الثغرات الأمنية".

    ![الثغرات الأمنية على واجهة ويب Wallarm][img-vulns]
    
    ستحتوي أعمدة "المخاطر"، "النوع"، و"العنوان" على القيم التي تم تحديدها في قسم `meta-info` للإمتدادات لتلك الثغرات الأمنية التي تم كشفها بمساعدة إمتدادات FAST.

8. يمكنك النقر على ثغرة أمنية لعرض معلومات مفصلة عنها، بما في ذلك وصفها (من قسم `meta-info` لملف الإمتداد) ومثال على الطلب الذي يستغلها.

    مثال على المعلومات حول ثغرة أمنية (تم كشفها بواسطة الإمتداد المعدل):
    
    ![معلومات مفصلة عن الثغرة الأمنية][img-vuln-details-mod]